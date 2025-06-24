// frontend/api.js

const BASE_URL = import.meta.env.VITE_API_URL || '';

// ======= SPESE =======

// 🔄 Ottieni tutte le spese
export async function getExpenses() {
  const res = await fetch(`${BASE_URL}/expenses`);
  if (!res.ok) throw new Error('Errore nel caricamento delle spese');
  return await res.json();
}

// ➕ Aggiungi una nuova spesa
export async function addExpense(data) {
  const res = await fetch(`${BASE_URL}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Errore nel salvataggio della spesa');
  return await res.json();
}

// ✏️ Modifica una spesa esistente
export async function updateExpense(id, data) {
  const res = await fetch(`${BASE_URL}/expenses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Errore nella modifica della spesa');
  return await res.json();
}

// 🗑️ Elimina una spesa
export async function deleteExpense(id) {
  const res = await fetch(`${BASE_URL}/expenses/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Errore nella cancellazione della spesa');
  return await res.json();
}

// 📊 Ottieni statistiche generali
export async function getStats() {
  const res = await fetch(`${BASE_URL}/stats`);
  if (!res.ok) throw new Error('Errore nel caricamento delle statistiche');
  return await res.json();
}

// ======= INCASSI =======

// 🔄 Ottieni tutti gli incassi
export async function getIncomes() {
  const res = await fetch(`${BASE_URL}/incomes`);
  if (!res.ok) throw new Error('Errore nel caricamento degli incassi');
  return await res.json();
}

// ➕ Aggiungi un nuovo incasso
export async function addIncome(data) {
  const res = await fetch(`${BASE_URL}/incomes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Errore nel salvataggio dell\'incasso');
  return await res.json();
}

// ✏️ Modifica un incasso esistente
export async function updateIncome(id, data) {
  const res = await fetch(`${BASE_URL}/incomes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Errore nella modifica dell\'incasso');
  return await res.json();
}

// 🗑️ Elimina un incasso
export async function deleteIncome(id) {
  const res = await fetch(`${BASE_URL}/incomes/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Errore nella cancellazione dell\'incasso');
  return await res.json();
}
