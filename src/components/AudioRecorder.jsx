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
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => handleStop(recorder);

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error("❌ Errore accesso microfono:", err);
      setStatus('❌ Errore microfono');
    }
  }

  async function handleStop(recorder) {
    setStatus('⏳ Invio audio...');
    setIsRecording(false);
    recorder.stream.getTracks().forEach(t => t.stop());

    if (chunksRef.current.length === 0) {
      console.warn("❌ Nessun chunk registrato.");
      setStatus('❌ Audio vuoto, riprova');
      return;
    }

    const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.webm');

    try {
      const res = await fetch(`${BASE_URL}/upload-audio`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Errore HTTP ${res.status}: ${errorText}`);
      }

      const result = await res.json();
      setStatus('✅ Spesa vocale salvata!');
      if (onAdd && result) await onAdd(result);
    } catch (err) {
      console.error("❌ Errore durante l'invio audio:", err);
      setStatus('❌ Errore durante l’invio');
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
