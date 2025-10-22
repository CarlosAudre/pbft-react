// src/pages/ReplicasPanel.jsx
import React, { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import styles from "./ReplicasPanel.module.css";

export default function ReplicasPanel() {
  const [replicas, setReplicas] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReplicas = async () => {
    try {
      setLoading(true);
      const data = await useApi("/api/pbft/replicas");
      setReplicas(data || []);
    } catch (err) {
      alert("Erro ao buscar réplicas: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMalicioso = async (id, ativo) => {
    try {
      await useApi(`/api/pbft/replicas/${id}/malicioso?ativo=${ativo}`, {
        method: "POST",
      });
      fetchReplicas();
    } catch (err) {
      alert("Erro ao alterar réplica: " + err.message);
    }
  };

  useEffect(() => {
    fetchReplicas();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Réplicas</h2>
      {loading ? (
        <div className={styles.loading}>Carregando...</div>
      ) : (
        replicas.map((r) => (
          <div className={styles.replicaItem} key={r.id}>
            <div>{`R${r.id}`}</div>
            <button
              className={`${styles.toggleBtn} ${
                r.malicioso ? styles.malicious : styles.honest
              }`}
              onClick={() => toggleMalicioso(r.id, !r.malicioso)}
            >
              {r.malicioso ? "Maliciosa" : "Honesta"}
            </button>
          </div>
        ))
      )}
      <button className={styles.refreshBtn} onClick={fetchReplicas}>
        Atualizar
      </button>
    </div>
  );
}
