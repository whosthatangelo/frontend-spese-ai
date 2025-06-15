// src/components/AudioRecorder.jsx
import { useState } from 'react';
import { addExpense } from '../api';

export default function AudioRecorder({ onAdd }) {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('Premi per iniziare');
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);

  const BASE_URL = 'https://backend-spese-ai.vercel.app';

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setChunks([]);
      setMediaRecorder(recorder);
      setIsRecording(true);
      setStatus('🎙️ Registrazione in corso...');
      recorder.start();

      recorder.ondataavailable = e => {
        setChunks(prev => [...prev, e.data]);
      };

      recorder.onstop = () => handleStop(recorder);
    } catch (err) {
      console.error("🎤 Accesso al microfono negato:", err);
      setStatus('❌ Accesso al microfono negato');
    }
  }

  async function handleStop(recorder) {
    setStatus('⏳ Invio audio...');

    const audioBlob = new Blob(chunks, { type: 'audio/webm; codecs=opus' });

    const arrayBuffer = await audioBlob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const newBlob = new Blob([uint8Array], { type: 'audio/webm' });

    const formData = new FormData();
    formData.append('audio', new File([newBlob], 'audio.webm', {
      type: 'audio/webm'
    }));

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
    } finally {
      setIsRecording(false);
    }
  }

  function handleClick() {
    if (!isRecording) {
      startRecording();
    } else if (mediaRecorder) {
      mediaRecorder.stop();
    }
  }

  return (
    <div className="mb-4 text-center">
      <button onClick={handleClick} className="btn btn-lg btn-outline-primary">
        {isRecording ? '🛑 Ferma' : '🎙️ Tocca per registrare'}
      </button>
      <p className="mt-2">{status}</p>
    </div>
  );
}
