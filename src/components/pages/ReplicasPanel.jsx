import React, { useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import styles from "./ReplicasPanel.module.css";

/** @typedef {{ id: number, malicioso: boolean }} Replica */

export default function ReplicasPanel() {
  const [replicas, setReplicas] = useState(/** @type {Replica[]} */ ([]));
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // Buscar lista de réplicas
  const fetchReplicas = async () => {
    try {
      setLoading(true);
      const data = await useApi("/api/pbft/replicas");
      setReplicas(Array.isArray(data) ? data : []);
    } catch (err) {
      alert("Erro ao buscar réplicas: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  // Alternar estado malicioso
  const toggleMalicioso = async (id, ativo) => {
    try {
      setUpdatingId(id);
      await useApi(`/api/pbft/replicas/${id}/malicioso?ativo=${ativo}`, {
        method: "POST",
      });
      // Atualiza localmente sem precisar refazer fetch completo
      setReplicas(prev =>
        prev.map(r => (r.id === id ? { ...r, malicioso: ativo } : r))
      );
    } catch (err) {
      alert("Erro ao alterar réplica: " + (err.message || err));
    } finally {
      setUpdatingId(null);
    }
  };

  const honestos = replicas.filter(r => !r.malicioso).length;

  useEffect(() => {
    fetchReplicas();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Réplicas</h2>
      <div style={{ marginBottom: "10px" }}>
        <strong>Nós honestos:</strong> {honestos} / {replicas.length}
      </div>

      {loading ? (
        <div className={styles.loading}>Carregando...</div>
      ) : (
        replicas.map(r => (
          <div className={styles.replicaItem} key={r.id}>
            <div>{`R${r.id}`}</div>
            <button
              className={`${styles.toggleBtn} ${r.malicioso ? styles.malicious : styles.honest}`}
              onClick={() => toggleMalicioso(r.id, !r.malicioso)}
              disabled={updatingId === r.id}
            >
              {updatingId === r.id
                ? "Atualizando..."
                : r.malicioso
                ? "Maliciosa"
                : "Honesta"}
            </button>
          </div>
        ))
      )}

      <button className={styles.refreshBtn} onClick={fetchReplicas} disabled={loading}>
        Atualizar
      </button>
    </div>
  );
}
