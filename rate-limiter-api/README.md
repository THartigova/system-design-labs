A modern Rate Limiter built with FastAPI and Redis, part of my System Design learning repository.
It demonstrates how to design a scalable rate‑limiting system that works across multiple API instances using Redis as a centralized state store.

![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![System Design](https://img.shields.io/badge/System%20Design-Learning-blueviolet?style=for-the-badge)

![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)


## Features
- ⚡ Built with FastAPI
- 🧠 Redis-based centralized rate limiting
- 🔒 Atomic request counting using INCR
- ⏱️ Automatic expiration with Redis TTL
- 📈 Horizontally scalable architecture
- 🐳 Docker Compose for local development


## Architecture
Client
│
▼
FastAPI
│
▼
Redis

Redis stores request counts using keys in the following format:
rate_limit:{user_id}
Each key has its own TTL (Time To Live), allowing the rate-limit window to reset automatically without additional cleanup logic.



## 📂 Project Structure

rate-limiter-api/
    app/
        main.py
        redis_client.py
        models.py
        database.py
    docker-compose.yml
    requirements.txt
    README.md



## ⚙️ Getting Started
1. Clone the repository
git clone https://github.com/<THartigova>/system-design-lab.git
cd system-design-lab/rate-limiter-api

2. Create a virtual environment

Windows (PowerShell)

python -m venv venv
.\venv\Scripts\Activate.ps1
3. Install dependencies
pip install -r requirements.txt
4. Start Redis
docker compose up -d
5. Run the API
uvicorn app.main:app --reload


## 🧠 How It Works
1. A client sends a request to the API.
2. The API increments a Redis key:
rate_limit:{user_id}
3. Redis stores the number of requests.
4. A TTL is assigned to the key.
5. Once the TTL expires, Redis automatically removes the key.
6. If the request limit is exceeded, the API returns HTTP 429 – Too Many Requests.


##📚 Learning Goals

This project is part of my System Design Lab, where I explore how modern backend systems are designed and implemented.

Topics covered in this project:

REST APIs
FastAPI
Redis
Distributed state management
Rate limiting
Docker
Horizontal scalability
Backend architecture