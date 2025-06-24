import React, { useRef, useState } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || '';

export default function AudioRecorder({ onAdd }) {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  async function handleStart() {
    setStatus('🎙️ Sto registrando...');
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      let recorder;
      const mimeTypes = ['audio/webm', 'audio/webm;codecs=opus'];
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
      const res = await fetch(`${BASE_URL}/upload-audio`, {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (result?.spesa) {
        setStatus('✅ Spesa salvata');
        if (onAdd) onAdd(result.spesa);
      } else if (result?.incasso) {
        setStatus('✅ Incasso salvato');
        if (onAdd) onAdd(result.incasso); // opzionale, in base a come gestisci la lista
      } else {
        setStatus('❌ Errore salvataggio');
      }
    } catch (err) {
      setStatus('❌ Errore di rete');
    }
  }


  return (
    <div>
      <button
        onClick={isRecording ? () => mediaRecorderRef.current?.stop() : handleStart}
        className={`btn ${isRecording ? 'btn-danger' : 'btn-primary'}`}
      >
        {isRecording ? 'Ferma' : '🎤 Registra spesa'}
      </button>
      <p>{status}</p>
    </div>
  );
}
