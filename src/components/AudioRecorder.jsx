// src/components/AudioRecorder.jsx
import React, { useRef, useState } from 'react';
import { useUserCompany } from '../contexts/UserCompanyContext';

export default function AudioRecorder({ onAdd }) {
  const { userId, company } = useUserCompany();
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Build headers including user & company
  function buildHeaders() {
    return {
      'x-user-id': userId || '',
      'x-company-id': company?.id || ''
    };
  }

  async function handleStart() {
    if (!company) {
      setStatus('❗ Seleziona prima un’azienda');
      return;
    }
    setStatus('🎙️ Sto registrando...');
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let recorder;
      const mimeTypes = ['audio/webm;codecs=opus', 'audio/webm'];
      let selectedMimeType = '';

      for (const type of mimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          selectedMimeType = type;
          recorder = new MediaRecorder(stream, { mimeType: type });
          break;
        }
      }

      if (!recorder) {
        setStatus('❌ Browser non supportato');
        return;
      }

      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => handleStop(recorder, selectedMimeType);

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      setStatus('❌ Errore microfono');
    }
  }

  async function handleStop(recorder, mimeType) {
    setStatus('⏳ Invio audio...');
    setIsRecording(false);
    recorder.stream.getTracks().forEach(t => t.stop());

    if (chunksRef.current.length === 0) {
      setStatus('❌ Audio vuoto, riprova');
      return;
    }

    const audioBlob = new Blob(chunksRef.current, { type: mimeType });
    const extension = mimeType.split('/')[1];
    const formData = new FormData();
    formData.append('audio', audioBlob, `audio.${extension}`);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/upload-audio`, {
        method: 'POST',
        headers: buildHeaders(),
        body: formData,
      });
      const result = await res.json();

      if (result.spesa) {
        setStatus('✅ Spesa salvata');
        onAdd?.(result.spesa);
      } else if (result.incasso) {
        setStatus('✅ Incasso salvato');
        onAdd?.(result.incasso);
      } else {
        setStatus('❌ Errore salvataggio');
      }
    } catch (err) {
      setStatus('❌ Errore di rete');
    }
  }

  return (
    <div className="d-flex align-items-center">
      <button
        onClick={isRecording ? () => mediaRecorderRef.current?.stop() : handleStart}
        className={`btn ${isRecording ? 'btn-danger' : company ? 'btn-primary' : 'btn-secondary'}`}
        disabled={!company}
      >
        {isRecording ? 'Ferma' : '🎤 Registra'}
      </button>
      <span className="ms-3">{status}</span>
    </div>
  );
}
