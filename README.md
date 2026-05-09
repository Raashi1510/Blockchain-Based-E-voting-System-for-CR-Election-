# Blockchain Based E-Voting System for CR Election

A secure and transparent blockchain-based voting system developed using Ethereum smart contracts, Web3.js, Solidity, Ganache, and MetaMask.

---



## 💡 Abstract

*Traditional electoral systems exhibit critical vulnerabilities including vote manipulation, centralized points of failure, and compromised transparency that undermine democratic integrity. This research presents a decentralised blockchain-based secure voting system designed to address these challenges. The system employs Ethereum smart contracts written in Solidity to enforce immutable voting rules, Web3.js for blockchain integration, and MetaMask wallet authentication for secure voter verification. The architecture implements dual interfaces for voters and electoral commissions, with distributed consensus mechanisms ensuring real-time transaction validation. Smart contracts automatically enforce electoral rules while maintaining cryptographic immutability of voting transactions. The decentralised design eliminates single points of failure by distributing vote storage and validation across multiple nodes. System validation included unit, integration, system, and security testing. Results show prevention of vote tampering, elimination of double voting, and transparent, auditable election results. Implementation used Truffle framework, Ganache blockchain simulation, and Node.js back-end services following an Agile Prototype-based Iterative Development methodology. This work demonstrates blockchain’s feasibility in creating trustworthy electoral systems, offering a viable solution to electoral fraud and public confidence issues.*

## 📌 Project Overview

BLOCKELECT is a decentralized voting application that enables secure and tamper-proof elections using blockchain technology. The system ensures transparency, immutability, and fairness in the voting process.

The project provides:
- Secure vote casting
- One person, one vote
- Transparent election results
- Role-based access control
- Automatic winner declaration

---

## 🚀 Features

### 🔹 Secure and Transparent Voting
- Votes are securely stored on blockchain
- Prevents tampering and manipulation

### 🔹 Immutable Vote Storage
- Once a vote is cast, it cannot be changed or deleted

### 🔹 Smart Contract Automation
- Automates candidate registration, voting, and result declaration

### 🔹 Role-Based Access
- Officials manage elections
- Voters cast votes

### 🔹 Election Time Control
- Voting is only allowed between selected start and end time

### 🔹 Winner Declaration
- Automatically displays the winning candidate after election ends

---

## 🛠️ Technologies Used

- Solidity
- Ethereum Blockchain
- Web3.js
- MetaMask
- Ganache
- Truffle
- HTML
- CSS
- JavaScript

---

## 📂 Project Structure

```bash
BLOCKELECT/
│
├── contracts/
│   └── VotingSys.sol
│
├── src/
│   ├── js/
│   │   └── app.js
│   ├── official.html
│   └── index.html
│
├── migrations/
├── build/
├── test/
└── truffle-config.js
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/Raashi1510/Blockchain-Based-E-voting-System-for-CR-Election-.git
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Start Ganache

Run Ganache and keep it active.

---

### 4️⃣ Deploy Smart Contract

```bash
truffle migrate --reset
```

---

### 5️⃣ Start Project

```bash
npm run dev
```

---

## 🔐 Smart Contract Functionalities

- Add Official
- Add Candidate
- Remove Candidate
- Set Election Dates
- Vote
- Reset Election
- Get Winner
- Get Total Votes

---

## 👨‍💻 Roles in System

### 🧑‍💼 Official
- Add candidates
- Set election dates
- Add other officials
- Reset election
- View winner

### 🗳️ Voter
- View candidates
- Cast vote
- Vote only once

---

## 🔮 Future Enhancements

- Biometric Authentication
- Aadhaar Integration
- Deploy on Public Ethereum Network
- Mobile Application
- Live Result Analytics

---

## 📖 Conclusion

BLOCKELECT demonstrates how blockchain technology can improve election systems by ensuring security, transparency, decentralization, and trust in the voting process.

---

## 👩‍💻 Author

### Raashi Gada

Final Year Information Technology Student

---

## 📜 License

This project is licensed under the MIT License.

All the sound effects included in this project are from Microsoft Windows, which are the property of Microsoft Corporation. These sounds are used for demonstration purposes only and remain subject to Microsoft’s copyright and licensing terms.

---

Give this repository a ⭐ if you like it.
