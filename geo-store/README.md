# 🌍 Geo-Store — Distributed Key-Value Store Demo

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Distributed Systems](https://img.shields.io/badge/Distributed%20Systems-Learning-blueviolet?style=for-the-badge)

A hands-on simulation of a **distributed key-value store** across multiple geographic regions.

The project demonstrates how geographically distributed systems exchange data, synchronize state, and experience network latency.

---

# 🎯 Learning Goals

This project explores:

- Distributed systems fundamentals
- Multi-region architectures
- Data synchronization
- REST API communication
- Network latency
- Frontend ↔ Backend communication
- Backend architecture

---

# ✨ Features

- 🌍 Three independent regions (EU, US, Asia)
- 📖 Read data from any region
- ✍️ Write data to a selected region
- 🔄 Synchronize data between regions
- ⚡ Simulated network latency
- 📜 Live event log
- 🖥 Interactive React frontend

---

# 🏗️ Architecture

```text
                 React Frontend
                        │
      ┌─────────────────┼─────────────────┐
      │                 │                 │
      ▼                 ▼                 ▼
 Node EU           Node US          Node Asia
 (3001)            (3002)            (3003)
      │                 │                 │
      └──────── Synchronization ──────────┘
```

Each node runs independently and exposes its own REST API.

---

# 📂 Project Structure

```text
geo-store/

├── frontend/
│   ├── src/
│   └── package.json
│
├── node-eu/
│   ├── server.js
│   └── database.json
│
├── node-us/
│   ├── server.js
│   └── database.json
│
├── node-asia/
│   ├── server.js
│   └── database.json
│
└── README.md
```

---

# ⚙️ Getting Started

## Clone the repository

```bash
git clone https://github.com/<your-username>/system-design-lab.git
cd geo-store
```

---

## Backend

Install dependencies inside every node.

```bash
npm install
```

Start each server:

### Europe

```bash
node server.js
```

Port:

```
3001
```

---

### United States

```bash
node server.js
```

Port:

```
3002
```

---

### Asia

```bash
node server.js
```

Port:

```
3003
```

---

## Frontend

```bash
cd frontend
npm install
npm start
```

Runs on:

```
http://localhost:3000
```

---

# 🔌 REST API

## Read value

```http
GET /read
```

Returns:

```json
{
  "value": "Hello",
  "lastUpdated": "2025-07-12T14:23:00Z"
}
```

---

## Write value

```http
POST /write
```

Body:

```json
{
  "value": "Hello World"
}
```

---

## Synchronize

```http
POST /sync
```

Body:

```json
{
  "targetUrl": "http://localhost:3002"
}
```

Copies the local value to another region.

---

## Latency

```http
GET /latency
```

Returns simulated network latency.

Example:

```json
{
  "latency": 143
}
```

---

# 🧠 How It Works

Each region maintains its own local state.

Writing data updates only the selected node.

Synchronization transfers the value from one node to another.

Latency is simulated to demonstrate how geographic distance affects communication between distributed systems.

---

# 🌍 Simulated Regions

| Region | Port |
|---------|-----:|
| 🇪🇺 Europe | 3001 |
| 🇺🇸 United States | 3002 |
| 🌏 Asia | 3003 |

---

# 📚 Concepts Covered

- Distributed Systems
- REST APIs
- Data Replication
- Multi-region Architecture
- Network Latency
- Synchronization
- React
- Express
- Backend Architecture

---

# ⚠️ Limitations

This project is intentionally simplified for educational purposes.

It **does not implement**:

- Automatic replication
- Conflict resolution
- Consensus algorithms
- Eventual consistency
- Leader election
- Fault tolerance

Network latency is simulated using `setTimeout()`.

---

# 🚀 Future Improvements

- Automatic synchronization
- Conflict resolution
- Versioning
- Vector clocks
- Leader election
- Docker Compose deployment
- Kubernetes deployment
- WebSocket-based synchronization

---

# 📖 Inspiration

This project was created as part of my **System Design Lab**, where I explore distributed systems by building practical simulations inspired by real-world architectures.