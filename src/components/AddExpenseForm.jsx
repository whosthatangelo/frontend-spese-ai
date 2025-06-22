import { useState, useEffect } from "react";
import { addExpense } from "../api";

export default function AddExpenseForm({ onAdd }) {
  const [formData, setFormData] = useState({
    numero_fattura: "",
    data_fattura: "",
    importo: "",
    valuta: "EUR",
    azienda: "",
    tipo_pagamento: "",
    banca: "",
    tipo_documento: "fattura",
    stato: "",
    metodo_pagamento: "",
    data_creazione: "",
    utente_id: "user_1",
  });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFormData(prev => ({
      ...prev,
      data_fattura: today,
      data_creazione: today
    }));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const dataToSave = {
        ...formData,
        importo: parseFloat(formData.importo.replace(",", ".")), // ✅ gestione virgola e punto
      };
      await addExpense(dataToSave);
      alert("✅ Spesa salvata!");
      onAdd?.();

      // reset
      setFormData(prev => ({
        ...prev,
        numero_fattura: "",
        importo: "",
        azienda: "",
        tipo_pagamento: "",
        banca: "",
        stato: "",
        metodo_pagamento: "",
      }));
    } catch (err) {
      alert("❌ Errore: " + err.message);
    }
  };

  const valute = ["EUR", "USD", "GBP", "CHF", "JPY"];
  const metodiPagamento = ["contanti", "carta di credito", "bancomat", "bonifico", "satispay", "paypal"];
  const statiPossibili = ["", "sospesa", "pagata", "annullata"];
  const tipiDocumento = ["fattura", "ricevuta", "bolla", "altro"];

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded shadow-sm mb-4 bg-light">
      <h5 className="mb-3">📝 Aggiungi Spesa Manuale</h5>
      <div className="row g-2">

        <div className="col-md-3">
          <input type="text" name="numero_fattura" className="form-control" placeholder="Numero Fattura" value={formData.numero_fattura} onChange={handleChange} required />
        </div>

        <div className="col-md-3">
          <input type="date" name="data_fattura" className="form-control" value={formData.data_fattura} onChange={handleChange} required />
        </div>

        <div className="col-md-3">
          <input type="text" name="importo" className="form-control" placeholder="Importo (€)" value={formData.importo} onChange={handleChange} required pattern="^\d+([.,]\d{1,2})?$" />
        </div>

        <div className="col-md-3">
          <select name="valuta" className="form-select" value={formData.valuta} onChange={handleChange}>
            {valute.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        <div className="col-md-4">
          <input type="text" name="azienda" className="form-control" placeholder="Azienda" value={formData.azienda} onChange={handleChange} required />
        </div>

        <div className="col-md-4">
          <select name="tipo_pagamento" className="form-select" value={formData.tipo_pagamento} onChange={handleChange} required>
            <option value="">Tipo di pagamento</option>
            {metodiPagamento.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="col-md-4">
          <input type="text" name="banca" className="form-control" placeholder="Banca (opzionale)" value={formData.banca} onChange={handleChange} />
        </div>

        <div className="col-md-4">
          <select name="tipo_documento" className="form-select" value={formData.tipo_documento} onChange={handleChange} required>
            {tipiDocumento.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="col-md-4">
          <select name="stato" className="form-select" value={formData.stato} onChange={handleChange}>
            {statiPossibili.map(s => <option key={s} value={s}>{s || "— Nessuno —"}</option>)}
          </select>
        </div>

        <div className="col-md-4">
          <select name="metodo_pagamento" className="form-select" value={formData.metodo_pagamento} onChange={handleChange} required>
            <option value="">Metodo di pagamento</option>
            {metodiPagamento.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

      </div>

      <button className="btn btn-success mt-3">💾 Salva</button>
    </form>
  );
}
