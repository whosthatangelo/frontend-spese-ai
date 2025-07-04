// frontend/api.js

const BASE_URL = import.meta.env.VITE_API_URL || '';

function buildHeaders() {
  return {
    'Content-Type': 'application/json',
    'x-user-id': localStorage.getItem('userId') || '',
    'x-company-id': localStorage.getItem('companyId') || ''
  };
}

// ======= SPESE =======

export async function getExpenses() {
  const res = await fetch(`${BASE_URL}/expenses`, {
    headers: buildHeaders()
  });
  if (!res.ok) throw new Error('Errore nel caricamento delle spese');
  return res.json();
}

export async function addExpense(data) {
  const res = await fetch(`${BASE_URL}/expenses`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Errore nel salvataggio della spesa');
  return res.json();
}

export async function updateExpense(id, data) {
  const res = await fetch(`${BASE_URL}/expenses/${id}`, {
    method: 'PUT',
    headers: buildHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Errore nella modifica della spesa');
  return res.json();
}

export async function deleteExpense(id) {
  const res = await fetch(`${BASE_URL}/expenses/${id}`, {
    method: 'DELETE',
    headers: buildHeaders()
  });
  if (!res.ok) throw new Error('Errore nella cancellazione della spesa');
  return res.json();
}

export async function getStats() {
  const res = await fetch(`${BASE_URL}/stats`, {
    headers: buildHeaders()
  });
  if (!res.ok) throw new Error('Errore nel caricamento delle statistiche');
  return res.json();
}

// ======= INCASSI =======

export async function getIncomes() {
  const res = await fetch(`${BASE_URL}/incomes`, {
    headers: buildHeaders()
  });
  if (!res.ok) throw new Error('Errore nel caricamento degli incassi');
  return res.json();
}

export async function addIncome(data) {
  const res = await fetch(`${BASE_URL}/incomes`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Errore nel salvataggio dell\'incasso');
  return res.json();
}

export async function updateIncome(id, data) {
  const res = await fetch(`${BASE_URL}/incomes/${id}`, {
    method: 'PUT',
    headers: buildHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Errore nella modifica dell\'incasso');
  return res.json();
}

export async function deleteIncome(id) {
  const res = await fetch(`${BASE_URL}/incomes/${id}`, {
    method: 'DELETE',
    headers: buildHeaders()
  });
  if (!res.ok) throw new Error('Errore nella cancellazione dell\'incasso');
  return res.json();
}

// ======= DASHBOARD ANALYTICS =======

export async function getIncomeStats() {
  const res = await fetch(`${BASE_URL}/income-stats`, {
    headers: buildHeaders()
  });
  if (!res.ok) throw new Error('Errore nel caricamento delle statistiche incassi');
  return res.json();
}

export async function getLatestExpenses() {
  const res = await fetch(`${BASE_URL}/latest-expenses`, {
    headers: buildHeaders()
  });
  if (!res.ok) throw new Error('Errore nel caricamento delle ultime spese');
  return res.json();
}

export async function getLatestIncomes() {
  const res = await fetch(`${BASE_URL}/latest-income`, {
    headers: buildHeaders()
  });
  if (!res.ok) throw new Error('Errore nel caricamento degli ultimi incassi');
  return res.json();
}
