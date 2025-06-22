import { useEffect, useState } from 'react';
import { getExpenses, addExpense } from '../api';
import AudioRecorder from '../components/AudioRecorder';
import AddExpenseForm from '../components/AddExpenseForm';
import ExpenseList from '../components/ExpenseList';

function Spese() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    caricaSpese();
  }, []);

  async function caricaSpese() {
    const data = await getExpenses();
    setExpenses(data);
  }

  async function aggiungiSpesa(spesa) {
    const nuova = await addExpense(spesa);
    setExpenses(prev => [...prev, nuova]);
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="py-5 text-center text-white" style={{
        background: "linear-gradient(135deg, #6f42c1, #20c997)",
        borderBottom: "4px solid #dee2e6"
      }}>
        <div className="container">
          <h1 className="display-5 fw-bold">📊 Tracciamento Spese</h1>
          <p className="lead">Registra, gestisci e visualizza tutte le tue spese in modo semplice e smart</p>
        </div>
      </section>

      {/* Inserimento spese */}
      <div className="container my-5">
        <div className="row justify-content-center g-4">
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100 text-center">
              <div className="card-body">
                <h5 className="card-title mb-3">🎙️ Registra Spesa Vocale</h5>
                <AudioRecorder onAdd={aggiungiSpesa} />
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100 text-center">
              <div className="card-body">
                <h5 className="card-title mb-3">➕ Aggiungi Spesa Manuale</h5>
                <AddExpenseForm onAdd={aggiungiSpesa} />
              </div>
            </div>
          </div>
        </div>

        <hr className="my-5" />

        {/* Lista spese */}
        <div className="row">
          <div className="col">
            <h4 className="mb-4 text-center">📜 Elenco Completo delle Spese</h4>
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="table-dark text-center">
                  <tr>
                    <th>Fattura</th>
                    <th>Data</th>
                    <th>Azienda</th>
                    <th>Importo</th>
                    <th>Valuta</th>
                    <th>Tipo Pagamento</th>
                    <th>Tipo Documento</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {expenses.map(exp => (
                    <tr key={exp.numero_fattura}>
                      <td>{exp.numero_fattura}</td>
                      <td>{exp.data_fattura?.split('T')[0]}</td>
                      <td>{exp.azienda}</td>
                      <td>{exp.importo}</td>
                      <td>{exp.valuta}</td>
                      <td>{exp.tipo_pagamento}</td>
                      <td>{exp.tipo_documento}</td>
                      <td>
                        <button className="btn btn-sm btn-warning me-2" onClick={() => alert("TODO: modifica")}>✏️</button>
                        <button className="btn btn-sm btn-danger">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Spese;
