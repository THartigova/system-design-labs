# 📡 CAP Theorem — AP System Simulation

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Distributed Systems](https://img.shields.io/badge/Distributed%20Systems-Learning-blueviolet?style=for-the-badge)
![CAP Theorem](https://img.shields.io/badge/CAP%20Theorem-AP%20System-orange?style=for-the-badge)

A hands-on simulation of the **CAP Theorem**, focusing on an **AP (Availability + Partition Tolerance)** distributed system.

The project demonstrates how distributed databases behave during **network partitions**, why **temporary inconsistency** occurs, and how **eventual consistency** is achieved through synchronization.

---

# 🎯 Learning Goals

This project explores:

- CAP Theorem
- Distributed systems fundamentals
- Availability vs Consistency
- Eventual consistency
- Data replication
- Network partitions
- Node synchronization

---

# 📚 What is the CAP Theorem?

The **CAP Theorem** states that a distributed system can guarantee only **two of the following three properties**:

| Property | Description |
|----------|-------------|
| **Consistency (C)** | Every node returns the latest data. |
| **Availability (A)** | Every request receives a response. |
| **Partition Tolerance (P)** | The system continues operating despite communication failures between nodes. |

This project implements an **AP system**, prioritizing:

- ✅ Availability
- ✅ Partition Tolerance
- ⚠️ Eventual (not immediate) Consistency

---

# 🧠 What an AP System Means

An AP system:

- always responds to requests
- remains operational during network failures
- accepts temporary inconsistencies
- synchronizes data later

This behavior mirrors systems such as:

- Amazon DynamoDB
- Apache Cassandra
- Riak
- Geo-distributed microservices

---

# 🏗️ System Architecture

```text
                Network

Node A (5001)   <----X---->   Node B (5002)

   │                         │
 write                     write
 read                      read
 sync -------------------->
```

Each node contains:

- local JSON database
- `/write`
- `/read`
- `/sync`

Synchronization is **manual**, allowing inconsistencies to be observed.

---

# 📂 Project Structure

```text
cap-theorem/

├── nodeA/
│   ├── server.js
│   └── database.json
│
├── nodeB/
│   ├── server.js
│   └── database.json
│
├── README.md
└── package.json
```

---

# ⚙️ Installation

## Clone the repository

```bash
git clone https://github.com/<your-username>/system-design-lab.git
cd cap-theorem-ap
```

---

## Install dependencies

```bash
npm install
```

---

## Start Node A

```bash
PORT=5001 node server.js
```

---

## Start Node B

```bash
PORT=5002 node server.js
```

---

Use **Postman** (or any API client) to perform the experiments below.

---

# 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/write` | POST | Store data locally |
| `/read` | GET | Read local data |
| `/sync` | POST | Replicate data to another node |

---

# 🧪 Experiments

---

## Experiment 1 — Temporary Inconsistency

### Goal

Show that nodes become inconsistent when communication is unavailable.

### Steps

1. Write to Node A

```
POST /write
```

```json
{
  "value": "Hello from A"
}
```

2. Read from Node B

```
GET /read
```

Response:

```json
{
  "value": null
}
```

### Why?

Node B has not yet received any replication.

Each node maintains its own local state.

### Real-world example

Amazon shopping carts continue accepting writes even if another region is temporarily unreachable.

---

## Experiment 2 — Eventual Consistency

### Goal

Synchronize Node A → Node B.

### Steps

1. Write to Node A

2. Read Node B

```
null
```

3. Synchronize

```
POST /sync
```

```json
{
  "target": "http://localhost:5002"
}
```

4. Read Node B again

```json
{
  "value": "Hello from A"
}
```

### Why?

Replication occurs after synchronization, resulting in **eventual consistency**.

### Real-world example

Apache Cassandra asynchronously replicates writes between regions.

---

## Experiment 3 — Partition Tolerance

### Goal

Simulate a node failure.

### Steps

1. Stop Node B.
2. Write to Node A.
3. Restart Node B.
4. Synchronize.
5. Read Node B.

### Result

The system remained available during the outage and synchronized once communication was restored.

### Real-world example

Netflix continues serving users during regional failures while synchronizing data after recovery.

---

## Experiment 4 — Bidirectional Divergence

### Goal

Demonstrate independent writes and one-way synchronization.

### Steps

- Write different values to both nodes.
- Verify each node stores different data.
- Synchronize A → B.
- Synchronize B → A.

### Result

The destination node adopts the source node's state.

Automatic conflict resolution is intentionally **not implemented**.

### Real-world example

Multi-master replication systems often require conflict resolution strategies.

---

# 🌍 Real-world Applications

AP systems are ideal when availability is more important than immediate consistency.

Examples include:

- 🛒 Shopping carts
- 🎬 Streaming services
- 📱 Social media counters
- 🌐 Edge computing
- 📡 IoT devices

---

# 📖 Key Concepts Learned

- CAP Theorem
- Distributed Systems
- Availability
- Partition Tolerance
- Eventual Consistency
- Replication
- Network Failures
- Synchronization
- Backend Architecture

---

# 🚀 Future Improvements

- Automatic synchronization
- Conflict resolution strategies
- Vector clocks
- Gossip protocol
- Multi-node cluster
- Docker Compose deployment
- Load balancing simulation

---

# 📚 References

- CAP Theorem
- Amazon DynamoDB
- Apache Cassandra
- Riak
- Distributed Systems Fundamentals

---

> Part of my **System Design Lab**, where I explore backend architecture and distributed systems by building practical implementations from scratch.
