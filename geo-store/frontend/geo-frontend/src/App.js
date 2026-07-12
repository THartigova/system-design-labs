import React, { useState } from "react";
import axios from "axios";
import WorldMap from "./components/worldMap.js";

const NODES = {
  EU: { name: "EU", url: "http://localhost:3001" },
  US: { name: "US", url: "http://localhost:3002" },
  Asia: { name: "Asia", url: "http://localhost:3003" }
};

function App() {
  const [selected, setSelected] = useState(null);
  const [nodeData, setNodeData] = useState({});
  const [log, setLog] = useState([]);

  const readNode = async (key) => {
    try {
      const node = NODES[key];
      const res = await axios.get(`${node.url}/read`);
      setNodeData((prev) => ({ ...prev, [key]: res.data.data }));
      setLog((prev) => [`Read from ${key}: ${JSON.stringify(res.data.data)}`, ...prev]);
    } catch (err) {
      setLog((prev) => [`Error reading from ${key}: ${err.message}`, ...prev]);
    }
  };

  const writeNode = async (key) => {
    try {
      const node = NODES[key];
      const value = prompt(`Value to write to ${key}:`);
      if (!value) return;

      const res = await axios.post(`${node.url}/write`, { value });
      setNodeData((prev) => ({ ...prev, [key]: res.data.data }));
      setLog((prev) => [`Write to ${key}: ${value}`, ...prev]);
    } catch (err) {
      setLog((prev) => [`Error writing to ${key}: ${err.message}`, ...prev]);
    }
  };

  const syncNodes = async (fromKey, toKey) => {
    try {
      const from = NODES[fromKey];
      const to = NODES[toKey];

      await axios.post(`${from.url}/sync`, { targetUrl: to.url });
      setLog((prev) => [`Sync ${fromKey} → ${toKey}`, ...prev]);
      await readNode(toKey);
    } catch (err) {
      setLog((prev) => [`Error syncing ${fromKey} → ${toKey}: ${err.message}`, ...prev]);
    }
  };

  const addLog  = (msg) => {
    setLog((prev) => [msg, ...prev]);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Geo‑Replicated Key‑Value Store</h1>
      <p>Klikni na region na mapě.</p>

      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        
        {/* MAPA */}
        <div style={{ flex: 2 }}>
          <WorldMap onSelect={setSelected} />
        </div>

        {/* PANEL REGIONU */}
        <div style={{
          flex: 1,
          border: "1px solid #ccc",
          padding: "1rem",
          borderRadius: "8px",
          background: "#fafafa"
        }}>
          <h2>Region</h2>
          {selected ? (
            <>
              <h3>{selected}</h3>
              <p>
                Data:{" "}
                <code>{JSON.stringify(nodeData[selected] || {})}</code>
              </p>

              <button onClick={() => writeNode(selected)}>Write</button>
              <button onClick={() => readNode(selected)}>Read</button>

              <h4>Sync from {selected}:</h4>
              {Object.keys(NODES)
                .filter((k) => k !== selected)
                .map((k) => (
                  <button key={k} onClick={() => syncNodes(selected, k)}>
                    Sync → {k}
                  </button>
                ))}
            </>
          ) : (
            <p>Vyber region na mapě.</p>
          )}
        </div>

        {/* LOG */}
        <div style={{
          flex: 1,
          border: "1px solid #ccc",
          padding: "1rem",
          borderRadius: "8px",
          maxHeight: "300px",
          overflowY: "auto",
          background: "#fafafa"
        }}>
          <h2>Event Log</h2>
          <ul>
            {log.map((entry, i) => (
              <li key={i}>{entry}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
