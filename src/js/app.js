import Web3 from "web3";
import VotingSysJSON from "../../build/contracts/VotingSys.json";

const App = {
    web3: null,
    account: null,
    contract: null,
    selectedCandidate: null,
    timerSet: false,

    showPage: function (pageToShow) {
        const pages = ['signIn', 'page', 'noWallet', 'accessDenied'];
        pages.forEach(pageId => {
            const el = document.getElementById(pageId);
            if (el) el.style.display = pageId === pageToShow ? 'block' : 'none';
        });
    },

    createSignInHTML: function () {
        let signInElement = document.getElementById('signIn');
        if (!signInElement) {
            signInElement = document.createElement('aside');
            signInElement.id = 'signIn';
            signInElement.innerHTML = `
                <h1>Welcome!</h1>
                <button id="signInBtn">Sign In with MetaMask</button>
            `;
            const target = document.getElementById("page");
            if (target) target.parentNode.insertBefore(signInElement, target.nextSibling);
        }
        signInElement.style.display = 'none';
    },

    init: async function () {
        if (!window.ethereum) {
            App.showPage('noWallet');
            return;
        }

        App.web3 = new Web3(window.ethereum);
        App.createSignInHTML();

        const accounts = await window.ethereum.request({ method: "eth_accounts" });

        if (accounts.length > 0) {
            await App.setupConnection(accounts[0]);
        } else {
            App.showPage('signIn');
        }

        document.getElementById("signInBtn")?.addEventListener("click", App.connectWallet);

        window.ethereum.on('chainChanged', () => window.location.reload());
        window.ethereum.on('accountsChanged', () => window.location.reload());
    },

    connectWallet: async function () {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        await App.setupConnection(accounts[0]);
    },

    setupConnection: async function (account) {
        App.account = account;
        document.getElementById("acctAddress").innerText = account;

        const networkId = await App.web3.eth.net.getId();
        const deployedNetwork = VotingSysJSON.networks[networkId];

        if (!deployedNetwork) {
            alert("Switch to Ganache network");
            return;
        }

        App.contract = new App.web3.eth.Contract(
            VotingSysJSON.abi,
            deployedNetwork.address
        );

        const isOfficial = await App.contract.methods.officials(App.account).call();
        document.getElementById("acctType").innerText = isOfficial ? "Official" : "Voter";

        if (isOfficial) {
            if (!window.location.href.includes("official.html")) {
                App.showPage('accessDenied');
                setTimeout(() => window.location.href = "/official.html", 2000);
                return;
            }

            App.showPage('page');
            App.setupOfficialEventListeners();
            await App.loadOfficialData();

        } else {
            if (window.location.href.includes("official.html")) {
                App.showPage('accessDenied');
                setTimeout(() => window.location.href = "/", 2000);
                return;
            }

            App.showPage('page');
            await App.loadCandidates();
            await App.loadElectionDates();
        }
    },

    // ================= OFFICIAL =================

    setupOfficialEventListeners: function () {
        document.getElementById("addCandidate").onclick = App.addCandidate;
        document.getElementById("addDate").onclick = App.setDates;
        document.getElementById("resetElection").onclick = App.resetElection;
    },

    addCandidate: async function () {
        const name = document.getElementById("name").value;
        const party = document.getElementById("party").value;

        if (!name || !party) {
            alert("Enter name & party");
            return;
        }

        await App.contract.methods
            .addCandidate(name, party)
            .send({ from: App.account });

        alert("Candidate added");
        await App.loadOfficialData();
    },

    setDates: async function () {
        const startInput = document.getElementById("startDate").value;
        const endInput = document.getElementById("endDate").value;

        if (!startInput || !endInput) {
            alert("Select date & time");
            return;
        }

        const start = Math.floor(new Date(startInput).getTime() / 1000);
        const end = Math.floor(new Date(endInput).getTime() / 1000);

        await App.contract.methods
            .setElectionDates(start, end)
            .send({ from: App.account });

        alert("Dates set successfully");
        App.timerSet = false;
        await App.loadOfficialData();
    },

    resetElection: async function () {
        await App.contract.methods.resetElection().send({ from: App.account });
        alert("Election reset");
        await App.loadOfficialData();
    },

    loadOfficialData: async function () {
        const statsBox = document.getElementById("electionStats");
        const candidatesBox = document.getElementById("currentCandidates");

        const result = await App.contract.methods.getCandidates().call();
        const names = result[0];
        const parties = result[1];
        const votes = result[2];

        let html = "<ul>";
        for (let i = 0; i < names.length; i++) {
            html += `<li>${names[i]} (${parties[i]}) - Votes: ${votes[i]}</li>`;
        }
        html += "</ul>";
        candidatesBox.innerHTML = html;

        const dates = await App.contract.methods.getElectionDates().call();
        const start = Number(dates[0]);
        const end = Number(dates[1]);
        const now = Math.floor(Date.now() / 1000);

        statsBox.innerHTML = `
            <p><b>Start:</b> ${start ? new Date(start * 1000).toLocaleString() : "Not set"}</p>
            <p><b>End:</b> ${end ? new Date(end * 1000).toLocaleString() : "Not set"}</p>
        `;

        // ✅ SHOW ONLY WINNER
        if (now > end && names.length > 0) {
            const winner = await App.contract.methods.getWinner().call();

            statsBox.innerHTML += `
                <h3>🏆 Winner: ${winner[0]} (${winner[1]}) - ${winner[2]} votes</h3>
            `;
        }

        // AUTO UPDATE AFTER END
        if (end > now && !App.timerSet) {
            App.timerSet = true;

            const timeLeft = (end - now) * 1000;

            setTimeout(async () => {
                await App.loadOfficialData();
            }, timeLeft + 1000);
        }
    },

    // ================= VOTER =================

    loadCandidates: async function () {
        const box = document.getElementById("boxCandidate");

        const result = await App.contract.methods.getCandidates().call();
        const names = result[0];
        const parties = result[1];
        const votes = result[2];

        box.innerHTML = "";

        for (let i = 0; i < names.length; i++) {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${names[i]}</td>
                <td>${parties[i]}</td>
                <td>${votes[i]}</td>
            `;

            row.style.cursor = "pointer";
            row.dataset.index = i;

            row.addEventListener("click", function () {
                App.selectCandidate(this.dataset.index);
            });

            box.appendChild(row);
        }

        document.getElementById("vote").style.display = "none";
    },

    selectCandidate: function (index) {
        App.selectedCandidate = Number(index);

        const rows = document.querySelectorAll("#boxCandidate tr");
        rows.forEach(r => r.style.background = "");

        rows[index].style.background = "#d1e7dd";

        document.getElementById("vote").style.display = "block";
        document.getElementById("voteButton").disabled = false;
    },

    vote: async function () {
        await App.contract.methods
            .vote(App.selectedCandidate)
            .send({ from: App.account });

        alert("Vote casted");
        await App.loadCandidates();
    }
};

window.App = App;
App.init();