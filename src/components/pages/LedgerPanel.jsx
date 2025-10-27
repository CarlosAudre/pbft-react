import React, { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import styles from "./LedgerPanel.module.css";

export default function LedgerPanel({ refreshKey = 0 }) {
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erroIntegridade, setErroIntegridade] = useState(false);

  const fetchLedger = async () => {
    try {
      setLoading(true);
      const data = await useApi("/api/pbft/ledger/todos");
      setLedger(Array.isArray(data) ? data : []);
      setErroIntegridade(false);
    } catch (err) {
      alert("Erro ao buscar ledger: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, [refreshKey]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Ledger</h2>
      <button className={styles.refreshBtn} onClick={fetchLedger}>
        {loading ? "Atualizando..." : "Atualizar"}
      </button>

      {erroIntegridade && (
        <div className={styles.ledgerErro}>
          ⚠️ Atenção: a cadeia está quebrada devido a alterações manuais
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Remetente</th>
            <th>Destinatário</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {ledger.map((t) => (
            <tr key={t.id} className={!t.valid ? styles.corrompido : ""}>
              <td>{t.id}</td>
              <td>{t.remetente}</td>
              <td>{t.destinatario}</td>
              <td>{t.valor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
