import React, { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import styles from "./TransacaoPanel.module.css";

export default function TransacaoPanel({ onAdded }) {
  const [remetente, setRemetente] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [valor, setValor] = useState("");
  const [loading, setLoading] = useState(false);
  const [replicas, setReplicas] = useState([]);

  // busca réplicas para calcular honestos/f
  const fetchReplicas = async () => {
    try {
      const data = await useApi("/api/pbft/replicas");
      setReplicas(Array.isArray(data) ? data : []);
    } catch (err) {
      alert("Erro ao buscar réplicas: " + (err.message || err));
    }
  };

  useEffect(() => {
    fetchReplicas();
  }, []);

  const enviarTransacao = async () => {
    if (!remetente || !destinatario || !valor) return alert("Preencha todos os campos");

    const honestos = replicas.filter(r => !r.malicioso).length;
    const f = replicas.filter(r => r.malicioso).length;

    // checagem PBFT local (opcional)
    if (honestos < 3 * f + 1) {
      return alert(`Não é possível enviar a transação. Nós honestos insuficientes para PBFT (honestos=${honestos}, f=${f})`);
    }

    try {
      setLoading(true);

      const transacao = await useApi("/pbft/client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remetente, destinatario, valor }),
      });

      setRemetente("");
      setDestinatario("");
      setValor("");

      if (onAdded) onAdded(transacao);
      else alert("Transação enviada!");
    } catch (err) {
      // captura erro do backend e exibe mensagem detalhada
      let msg = "Erro ao enviar transação";
      if (err.response && err.response.message) msg += ": " + err.response.message;
      else if (err.message) msg += ": " + err.message;
      alert(msg);
    } finally {
      setLoading(false);
      fetchReplicas(); // atualiza lista de réplicas
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Nova Transação</h2>

      <div className={styles.formGroup}>
        <label>Remetente</label>
        <input
          value={remetente}
          onChange={(e) => setRemetente(e.target.value)}
          placeholder="Digite o remetente"
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Destinatário</label>
        <input
          value={destinatario}
          onChange={(e) => setDestinatario(e.target.value)}
          placeholder="Digite o destinatário"
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Valor</label>
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className={styles.input}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <strong>Nós honestos:</strong> {replicas.filter(r => !r.malicioso).length} / {replicas.length}
      </div>

      <button
        className={styles.sendBtn}
        onClick={enviarTransacao}
        disabled={loading || !remetente || !destinatario || !valor}
      >
        {loading ? "Enviando..." : "Enviar"}
      </button>
    </div>
  );
}
