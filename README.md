# 🧠 LeetCode-Style Backend (Express + Redis Worker)

A **simple LeetCode-like backend system** that evaluates user-submitted code using a **Node.js + TypeScript backend**, **Redis queue**, and an isolated **Docker-based worker**.

This project demonstrates how online judges (like LeetCode, HackerRank, Codeforces) execute untrusted code securely and asynchronously.

---

## 🏗️ Architecture Overview

```
Client (Frontend / API Consumer)
        ↓
Express Backend (Node.js + TypeScript)
        ↓
Redis Queue (Jobs)
        ↓
Worker (TypeScript)
        ↓
Docker (Java Runtime)
        ↓
Execution Result → Redis / DB → Backend → Client
```

---

## 📦 Project Structure

```
.
├── express-backend/        # Main backend service
│   ├── src/
│   │   ├──routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── index.ts
│   └── package.json
│
├── worker/                 # Code execution worker
│   ├── src/
│   │   ├── worker.ts
│   │   ├── executor.ts
│   │   └── utils.ts
│   └── package.json
│
├── docker/                 # Runtime images
│   └── java-runner/
│       └── Dockerfile
│
├── README.md
└── docker-compose.yml (optional)
```

---

## 🚀 Components Explained

### 1️⃣ Express Backend (`express-backend`)

The **main API server** responsible for:

* Accepting code submissions
* Validating requests
* Pushing jobs to Redis
* Fetching execution results
* Returning verdicts to clients

**Tech stack**:

* Node.js
* TypeScript
* Express
* Redis (job queue)

Example flow:

1. Client submits Java code + input
2. Backend pushes a job to Redis
3. Backend returns a submission ID

---

### 2️⃣ Redis Queue

Redis is used as a **message broker** between backend and worker.

* Jobs are pushed using `LPUSH`
* Worker consumes jobs using `BRPOP`
* Enables async, scalable processing

Example job payload:

```json
{
  "jobId": "abc123",
  "language": "java",
  "code": "class Solution { ... }",
  "input": "3 5"
}
```

---

### 3️⃣ Worker Service (`worker`)

The **worker** is responsible for:

* Pulling jobs from Redis
* Generating a runtime wrapper (LeetCode-style)
* Running code inside Docker
* Enforcing time & memory limits
* Capturing stdout / stderr
* Returning execution results

**Key responsibilities**:

* Secure execution (no network, non-root)
* One job = one container
* Clean up after execution

---

### 4️⃣ Docker Java Runtime

User-submitted Java code is executed inside an isolated container.

**Why Docker?**

* Prevents host access
* Deterministic environment
* Resource limits
* Language isolation

**Java Runtime Features**:

* Java 17 (Eclipse Temurin)
* Non-root user
* Network disabled
* CPU & memory limits

---

## 🧪 Execution Flow

1. User submits code
2. Express backend creates a job
3. Job pushed to Redis queue
4. Worker blocks on `BRPOP`
5. Worker picks job
6. Code written to temp directory
7. Docker container started
8. Code compiled & executed
9. Output captured
10. Verdict generated
11. Result stored & returned

---

## ✅ Supported Verdicts

| Verdict | Description           |
| ------- | --------------------- |
| AC      | Accepted              |
| CE      | Compilation Error     |
| RE      | Runtime Error         |
| TLE     | Time Limit Exceeded   |
| MLE     | Memory Limit Exceeded |

---

## 🔐 Security Considerations

✔ Docker isolation
✔ Non-root container user
✔ Network disabled
✔ CPU & memory limits
✔ Execution timeout
✔ Temporary directories cleaned

⚠️ **Never run user code directly on host**

---

## 🛠️ Local Setup

### Prerequisites

* Node.js (>= 18)
* Docker
* Redis

---

### Start Redis

```bash
docker run -d -p 6379:6379 redis
```

---

### Install dependencies

```bash
cd express-backend
npm install

cd ../worker
npm install
```

---

### Build Java runtime image

```bash
cd docker/java-runner
docker build -t java-runner .
```

---

### Start services

```bash
# Backend
cd express-backend
npm run dev

# Worker
cd ../worker
npm run dev
```

---

## 📌 Limitations (By Design)

* Single language (Java)
* No persistent result storage
* No sandbox escape protection beyond Docker
* Simple test case handling

---

## 🧩 Future Improvements

* Multiple language support (C++, Python, Go)
* Multiple test cases per submission
* Custom judge support
* Result caching
* Firecracker / gVisor isolation
* Horizontal worker scaling

---

## 📚 Learning Goals

This project is ideal for understanding:

* Online judge internals
* Async job queues
* Secure code execution
* Docker sandboxing
* Backend system design

---

## 📄 License

MIT License

---

## 🙌 Acknowledgements

Inspired by:

* LeetCode
* HackerRank
* Codeforces

---

⭐ If you find this project useful, consider starring the repository!
