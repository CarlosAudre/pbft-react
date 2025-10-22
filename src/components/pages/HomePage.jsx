// src/pages/HomePage.jsx
import React, { useState } from "react";
import ReplicasPanel from "./ReplicasPanel";
import VotePanel from "./VotePanel";
import ResultPanel from "./ResultPanel";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const [selectedTab, setSelectedTab] = useState("replicas");
  const [voteResult, setVoteResult] = useState(null);

  const tabs = [
    { id: "replicas", label: "Réplicas" },
    { id: "votar", label: "Votar" },
    { id: "resultado", label: "Resultado" },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Simulador PBFT</h1>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`${styles.botao} ${
              selectedTab === tab.id ? styles.botaoAzul : "bg-gray-700 text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.card}>
        {selectedTab === "replicas" && <ReplicasPanel />}
        {selectedTab === "votar" && <VotePanel onResult={setVoteResult} />}
        {selectedTab === "resultado" && <ResultPanel result={voteResult} />}
      </div>
    </div>
  );
}
