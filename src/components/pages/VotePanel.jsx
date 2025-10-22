// src/pages/VotePanel.jsx
import React, { useState } from "react";
import { useApi } from "../hooks/useApi";
import styles from "./VotePanel.module.css";

export default function VotePanel({ onResult }) {
  const [opcao, setOpcao] = useState("Sim");
  const [remetente, setRemetente] = useState("UI-Demo");
  const [loading, setLoading] = useState(false);

  const enviarVoto = async () => {
    try {
      setLoading(true);
      const now = Date.now();

      const voto = await useApi("/api/pbft/votar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opcao, remetente, timestamp: now }),
      });

      const status = await useApi(`/api/pbft/status/${voto.id}`);
      if (onResult) onResult({ voto, status });
    } catch (err) {
      alert("Erro ao enviar voto: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Votar</h2>
      <div className={styles.formGroup}>
        <label>Opção</label>
        <select
          value={opcao}
          onChange={(e) => setOpcao(e.target.value)}
          className={styles.select}
        >
          <option>Sim</option>
          <option>Não</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label>Remetente</label>
        <input
          value={remetente}
          onChange={(e) => setRemetente(e.target.value)}
          placeholder="Remetente"
          className={styles.input}
        />
      </div>

      <button
        className={styles.sendBtn}
        onClick={enviarVoto}
        disabled={loading}
      >
        {loading ? "Enviando..." : "Enviar para o líder"}
      </button>
    </div>
  );
}
