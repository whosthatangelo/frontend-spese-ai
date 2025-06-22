import { useState, useEffect } from "react";
import { addExpense } from "../api";

export default function AddExpenseForm({ onAdd }) {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    numero_fattura: "",
    data_fattura: today,
    importo: "",
    valuta: "EUR",
    azienda: "",
    tipo_pagamento: "",
    banca: "",
    tipo_documento: "fattura",
    stato: "",
    metodo_pagamento: "",
    data_creazione: today,
    utente_id: "user_1",
    prodotto: "",
    luogo: "",
    quantita: "",
    unita_misura: "",
    audio_url: "",
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const spesa = {
        ...formData,
        importo: parseFloat(formData.importo),
        quantita: formData.quantita ? parseInt(formData.quantita) : null,
      };
      await addExpense(spesa);
      onAdd?.();
      alert("✅ Spesa manuale salvata!");

      // Reset, mantenendo le date odierne
      setFormData(prev => ({
        ...prev,
        numero_fattura: "",
        importo: "",
        azienda: "",
        tipo_pagamento: "",
        banca: "",
        stato: "",
        metodo_pagamento: "",
        prodotto: "",
        luogo: "",
        quantita: "",
        unita_misura: "",
        audio_url: "",
      }));
    } catch (err) {
      alert("❌ Errore nel salvataggio: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded shadow-sm mb-4 bg-light">
      <h5 className="mb-3">📝 Aggiungi Spesa Manuale Completa</h5>
      <div className="row g-2">
        <div className="col-md-3">
          <input type="text" className="form-control" name="numero_fattura" placeholder="N° Fattura" value={formData.numero_fattura} onChange={handleChange} />
        </div>
        <div className="col-md-3">
          <input type="date" className="form-control" name="data_fattura" value={formData.data_fattura} onChange={handleChange} />
        </div>
        <div className="col-md-3">
          <input type="number" step="0.01" className="form-control" name="importo" placeholder="Importo €" value={formData.importo} onChange={handleChange} required />
        </div>
        <div className="col-md-3">
          <input type="text" className="form-control" name="valuta" placeholder="Valuta" value={formData.valuta} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control" name="azienda" placeholder="Azienda / Luogo" value={formData.azienda} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control" name="tipo_pagamento" placeholder="Tipo pagamento" value={formData.tipo_pagamento} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control" name="banca" placeholder="Banca" value={formData.banca} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control" name="tipo_documento" placeholder="Tipo documento" value={formData.tipo_documento} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control" name="stato" placeholder="Stato" value={formData.stato} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control" name="metodo_pagamento" placeholder="Metodo pagamento" value={formData.metodo_pagamento} onChange={handleChange} />
        </div>
        <div className="col-md-3">
          <input type="date" className="form-control" name="data_creazione" value={formData.data_creazione} onChange={handleChange} />
        </div>
        <div className="col-md-3">
          <input type="text" className="form-control" name="utente_id" placeholder="Utente" value={formData.utente_id} onChange={handleChange} />
        </div>
        <div className="col-md-3">
          <input type="text" className="form-control" name="prodotto" placeholder="Prodotto" value={formData.prodotto} onChange={handleChange} />
        </div>
        <div className="col-md-3">
          <input type="text" className="form-control" name="luogo" placeholder="Luogo" value={formData.luogo} onChange={handleChange} />
        </div>
        <div className="col-md-3">
          <input type="number" className="form-control" name="quantita" placeholder="Quantità" value={formData.quantita} onChange={handleChange} />
        </div>
        <div className="col-md-3">
          <input type="text" className="form-control" name="unita_misura" placeholder="Unità di misura" value={formData.unita_misura} onChange={handleChange} />
        </div>
      </div>
      <button className="btn btn-success mt-3">💾 Salva</button>
    </form>
  );
}
