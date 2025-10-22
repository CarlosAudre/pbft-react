import React from "react";
import styles from "./ResultPanel.module.css";

export default function ResultPanel({ result }) {
  if (!result) {
    return <div className={styles.container}>Sem resultado ainda</div>;
  }

  const { voto, status } = result;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Resultado do Voto</h2>

      <div className={styles.item}>
        <span className={styles.label}>ID do Voto:</span> {voto.id}
      </div>

      <div className={styles.item}>
        <span className={styles.label}>Opção:</span> {voto.opcao}
      </div>

      <div className={styles.item}>
        <span className={styles.label}>Status:</span>{" "}
        <span className={status.confirmed ? styles.confirmed : styles.rejected}>
          {status.confirmed ? "✅ Confirmado" : "❌ Rejeitado"}
        </span>
      </div>

      <div className={styles.item}>
        <span className={styles.label}>Motivo:</span> {status.decisionReason}
      </div>

      <div className={styles.item}>
        <span className={styles.label}>Prepares de:</span>{" "}
        {status.preparesFrom.length > 0
          ? status.preparesFrom.join(", ")
          : "Nenhuma"}
      </div>

      <div className={styles.item}>
        <span className={styles.label}>Commits de:</span>{" "}
        {status.commitsFrom.length > 0
          ? status.commitsFrom.join(", ")
          : "Nenhum"}
      </div>
    </div>
  );
}
