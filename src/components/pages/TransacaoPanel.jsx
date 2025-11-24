import React, { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import styles from "./TransacaoPanel.module.css";

export default function TransacaoPanel({ onAdded }) {
  const [remetente, setRemetente] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [valor, setValor] = useState("");
  const [loading, setLoading] = useState(false);
  const [replicas, setReplicas] = useState([]);

  const [erro, setErro] = useState(""); 

  const fetchReplicas = async () => {
    try {
      const data = await useApi("/api/pbft/replicas");
      setReplicas(Array.isArray(data) ? data : []);
    } catch (err) {
      setErro("Erro ao buscar réplicas: " + (err.message || err));
    }
  };

  useEffect(() => {
    fetchReplicas();
  }, []);

  const enviarTransacao = async () => {
    if (!remetente || !destinatario || !valor) {
      return setErro("Preencha todos os campos!");
    }

    const honestos = replicas.filter(r => !r.malicioso).length;
    const f = replicas.filter(r => r.malicioso).length;

    if (honestos < 3 * f + 1) {
      return setErro(
        `Não é possível enviar a transação: nós honestos insuficientes (honestos=${honestos}, f=${f})`
      );
    }

    try {
      setLoading(true);
      setErro(""); // limpa erro ao tentar enviar

      const transacao = await useApi("/pbft/client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ remetente, destinatario, valor }),
      });

      setRemetente("");
      setDestinatario("");
      setValor("");

      if (onAdded) onAdded(transacao);
    } catch (err) {
      let msg = "Erro ao enviar transação";
      if (err.response && err.response.message) msg += ": " + err.response.message;
      else if (err.message) msg += ": " + err.message;
      setErro(msg);
    } finally {
      setLoading(false);
      fetchReplicas();
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Nova Transação</h2>

      {/* CAIXINHA DE ERRO BONITINHA */}
      {erro && <div className={styles.errorBox}>{erro}</div>}

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
