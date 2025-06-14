import { useState, useEffect } from "react";
import { addExpense } from "../api";

export default function AddExpenseForm({ onAdd }) {
  const [formData, setFormData] = useState({
    data: "",
    prodotto: "",
    luogo: "",
    importo: "",
    quantita: "",
    unita_misura: "",
  });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFormData(prev => ({ ...prev, data: today }));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const expense = {
        ...formData,
        importo: parseFloat(formData.importo),
        quantita: formData.quantita ? parseInt(formData.quantita) : null,
        audio_url: "", // sempre vuoto nel caso manuale
      };
      await addExpense(expense);
      onAdd(); // ✅ Corretto
      setFormData({
        data: formData.data,
        prodotto: "",
        luogo: "",
        importo: "",
        quantita: "",
        unita_misura: "",
      });
      alert("🎉 Spesa salvata!");
    } catch (err) {
      alert("Errore nel salvataggio: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded shadow-sm mb-4 bg-light">
      <h5 className="mb-3">➕ Aggiungi Spesa Manuale</h5>
      <div className="row g-2">
        <div className="col-md-4">
          <input type="date" className="form-control" name="data" value={formData.data} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control" name="prodotto" placeholder="Prodotto" value={formData.prodotto} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control" name="luogo" placeholder="Luogo" value={formData.luogo} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <input type="number" step="0.01" className="form-control" name="importo" placeholder="Importo €" value={formData.importo} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <input type="number" className="form-control" name="quantita" placeholder="Quantità" value={formData.quantita} onChange={handleChange} />
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control" name="unita_misura" placeholder="Unità di misura" value={formData.unita_misura} onChange={handleChange} />
        </div>
      </div>
      <button className="btn btn-success mt-3">💾 Salva</button>
    </form>
  );
}
