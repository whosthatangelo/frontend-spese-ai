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
      const spesa = {
        ...formData,
        importo: parseFloat(formData.importo),
      };
      await addExpense(spesa);
      onAdd();
      alert("✅ Spesa salvata!");
      // Reset solo alcuni campi
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
      alert("❌ Errore nel salvataggio: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded shadow-sm mb-4 bg-light">
      <h5 className="mb-3">➕ Aggiungi Spesa Manuale</h5>
      <div className="row g-2">
        <div className="col-md-3">
          <input type="text" className="form-control" name="numero_fattura" placeholder="Numero fattura" value={formData.numero_fattura} onChange={handleChange} required />
        </div>
        <div className="col-md-3">
          <input type="date" className="form-control" name="data_fattura" value={formData.data_fattura} onChange={handleChange} required />
        </div>
        <div className="col-md-3">
          <input type="number" step="0.01" className="form-control" name="importo" placeholder="Importo €" value={formData.importo} onChange={handleChange} required />
        </div>
        <div className="col-md-3">
          <input type="text" className="form-control" name="valuta" value={formData.valuta} onChange={handleChange} placeholder="Valuta" />
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control" name="azienda" placeholder="Azienda / Luogo" value={formData.azienda} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control" name="tipo_pagamento" placeholder="Tipo pagamento" value={formData.tipo_pagamento} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control" name="metodo_pagamento" placeholder="Metodo pagamento" value={formData.metodo_pagamento} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control" name="banca" placeholder="Banca (se presente)" value={formData.banca} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control" name="tipo_documento" placeholder="Tipo documento" value={formData.tipo_documento} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control" name="stato" placeholder="Stato" value={formData.stato} onChange={handleChange} />
        </div>
      </div>
      <button className="btn btn-success mt-3">💾 Salva</button>
    </form>
  );
}
