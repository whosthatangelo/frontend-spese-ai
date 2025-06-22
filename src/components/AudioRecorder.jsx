import React, { useRef, useState } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL || '';

export default function AudioRecorder({ onAdd }) {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  async function handleStart() {
    console.log("🌐 Backend URL:", BASE_URL);
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
        throw new Error('❌ Nessun formato audio supportato dal browser');
      }

      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => handleStop(recorder, selectedMimeType);

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) {
      console.error("❌ Errore accesso microfono:", err);
      setStatus('❌ Errore microfono');
    }
  }

  async function handleStop(recorder, mimeType) {
    setStatus('⏳ Invio audio...');
    setIsRecording(false);
    recorder.stream.getTracks().forEach(t => t.stop());

    if (chunksRef.current.length === 0) {
      console.warn("❌ Nessun chunk registrato.");
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

      const contentType = res.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const text = await res.text();
        console.warn("⚠️ Risposta non JSON:", text);
        setStatus('⚠️ Risposta non valida dal server');
        return;
      }

      const result = await res.json();
      console.log("📦 Risposta backend:", result);

      if (res.ok && result.spesa) {
        setStatus('✅ Spesa vocale salvata!');
        if (onAdd) await onAdd(result.spesa);
      } else if (result.error) {
        setStatus(`⚠️ Errore backend: ${result.error}`);
      } else {
        setStatus('⚠️ Risposta inattesa dal server');
      }

    } catch (err) {
      console.error("❌ Errore durante fetch o parsing:", err);
      setStatus('❌ Errore di rete, riprova');
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
