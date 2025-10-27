import React, { useState } from "react";
import ReplicasPanel from "./ReplicasPanel";
import TransacaoPanel from "./TransacaoPanel";
import LedgerPanel from "./LedgerPanel";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const [selectedTab, setSelectedTab] = useState("replicas");
  const [refreshKey, setRefreshKey] = useState(0);

  const tabs = [
    { id: "replicas", label: "Réplicas" },
    { id: "transacao", label: "Nova Transação" },
    { id: "ledger", label: "Ledger" },
  ];


  const handleTransacaoAdded = () => {
    setRefreshKey((k) => k + 1); // força re-fetch no LedgerPanel
    setSelectedTab("ledger"); // opcional: muda automaticamente pra aba do ledger
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Simulador PBFT</h1>

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`${styles.botao} ${selectedTab === tab.id ? styles.botaoAzul : "bg-gray-700 text-white"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.card}>
        {selectedTab === "replicas" && <ReplicasPanel />}
        {selectedTab === "transacao" && <TransacaoPanel onAdded={handleTransacaoAdded} />}
        {selectedTab === "ledger" && <LedgerPanel refreshKey={refreshKey} />}
      </div>
    </div>
  );
}
