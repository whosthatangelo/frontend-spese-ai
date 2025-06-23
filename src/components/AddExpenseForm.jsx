import { useState, useEffect } from "react";
import { addExpense } from "../api";

export default function AddExpenseForm({ onAdd }) {
  const [formData, setFormData] = useState({
    numero_fattura: "",
    data_fattura: "",
    importo: "",
    valuta: "EUR",
    azienda: "",
    tipo_pagamento: "Contanti",
    banca: "",
    tipo_documento: "Fattura",
    stato: "",
    metodo_pagamento: "Contanti",
    data_creazione: "",
    utente_id: "user_1",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

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
    setFormData(prev => ({
      ...prev,
      [name]: name === "importo" ? value.replace(",", ".") : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const spesa = {
        ...formData,
        importo: parseFloat(formData.importo),
      };

      if (isNaN(spesa.importo)) {
        throw new Error("Importo non valido");
      }

      await addExpense(spesa);
      onAdd?.();
      setMessage("✅ Spesa salvata con successo!");
      setFormData(prev => ({
        ...prev,
        numero_fattura: "",
        importo: "",
        azienda: "",
        banca: "",
        stato: "",
      }));
    } catch (err) {
      setMessage("❌ Errore: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded-4 shadow-sm mb-4 bg-light">
      <h5 className="mb-3">➕ Aggiungi Spesa Manuale</h5>
      <div className="row g-2">
        <div className="col-md-6">
          <input type="text" className="form-control" name="numero_fattura" placeholder="Numero Fattura" value={formData.numero_fattura} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <input type="date" className="form-control" name="data_fattura" value={formData.data_fattura} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <input type="number" step="0.01" className="form-control" name="importo" placeholder="Importo €" value={formData.importo} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <select className="form-control" name="valuta" value={formData.valuta} onChange={handleChange}>
            <option>EUR</option>
            <option>USD</option>
            <option>GBP</option>
            <option>CHF</option>
          </select>
        </div>
        <div className="col-md-6">
          <input type="text" className="form-control" name="azienda" placeholder="Azienda" value={formData.azienda} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <select className="form-control" name="tipo_pagamento" value={formData.tipo_pagamento} onChange={handleChange}>
            <option>Contanti</option>
            <option>Carta di credito</option>
            <option>Bonifico</option>
            <option>Satispay</option>
            <option>Altro</option>
          </select>
        </div>
        <div className="col-md-6">
          <input type="text" className="form-control" name="banca" placeholder="Banca (facoltativo)" value={formData.banca} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <select className="form-control" name="tipo_documento" value={formData.tipo_documento} onChange={handleChange}>
            <option>Fattura</option>
            <option>Ricevuta</option>
            <option>Scontrino</option>
            <option>Altro</option>
          </select>
        </div>
        <div className="col-md-6">
          <select className="form-control" name="stato" value={formData.stato} onChange={handleChange}>
            <option value="">Seleziona stato</option>
            <option>In attesa</option>
            <option>Pagata</option>
            <option>Sospesa</option>
            <option>Annullata</option>
          </select>
        </div>
        <div className="col-md-6">
          <select className="form-control" name="metodo_pagamento" value={formData.metodo_pagamento} onChange={handleChange}>
            <option>Contanti</option>
            <option>Carta di credito</option>
            <option>Bonifico</option>
            <option>Satispay</option>
            <option>Altro</option>
          </select>
        </div>
      </div>

      <button className="btn btn-success mt-3" disabled={isSubmitting}>
        {isSubmitting ? "💾 Salvataggio in corso..." : "💾 Salva"}
      </button>

      {message && (
        <div className={`alert mt-3 ${message.startsWith("✅") ? "alert-success" : "alert-danger"}`}>
          {message}
        </div>
      )}
    </form>
  );
}
