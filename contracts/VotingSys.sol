// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingSys {
    struct Candidate {
        string name;
        string party;
        uint votes;
    }

    address public owner;
    mapping(address => bool) public officials;
    Candidate[] public candidates;

    uint public startDate;
    uint public endDate;

    mapping(address => bool) public hasVoted;
    address[] public votersList;

    event Voted(address voter, uint candidateIndex);

    constructor() {
        owner = msg.sender;
        officials[msg.sender] = true;
    }

    modifier onlyOfficial() {
        require(officials[msg.sender], "Not an official");
        _;
    }

    modifier electionActive() {
        require(startDate != 0 && endDate != 0, "Dates not set");
        require(block.timestamp >= startDate && block.timestamp <= endDate, "Election not active");
        _;
    }

    function addOfficial(address _addr) external onlyOfficial {
        officials[_addr] = true;
    }

    function addCandidate(string memory _name, string memory _party) external onlyOfficial {
        for(uint i = 0; i < candidates.length; i++){
            require(
                keccak256(bytes(candidates[i].name)) != keccak256(bytes(_name)), 
                "Candidate already exists"
            );
        }
        candidates.push(Candidate(_name, _party, 0));
    }

    function removeCandidate(uint _candidateIndex) external onlyOfficial {
        require(_candidateIndex < candidates.length, "Invalid index");
        candidates[_candidateIndex] = candidates[candidates.length - 1];
        candidates.pop();
    }

    function setElectionDates(uint _start, uint _end) external onlyOfficial {
        require(_start < _end, "Invalid dates");
        startDate = _start;
        endDate = _end;
    }

    function resetElection() external onlyOfficial {
        delete candidates;
        for (uint i = 0; i < votersList.length; i++) {
            hasVoted[votersList[i]] = false;
        }
        delete votersList;
        startDate = 0;
        endDate = 0;
    }

    function vote(uint _candidateIndex) external electionActive {
        require(!hasVoted[msg.sender], "Already voted");
        require(_candidateIndex < candidates.length, "Invalid candidate");

        candidates[_candidateIndex].votes += 1;
        hasVoted[msg.sender] = true;

        votersList.push(msg.sender);

        emit Voted(msg.sender, _candidateIndex);
    }

    function getCandidates()
        external
        view
        returns (
            string[] memory names,
            string[] memory parties,
            uint[] memory votes
        )
    {
        names = new string[](candidates.length);
        parties = new string[](candidates.length);
        votes = new uint[](candidates.length);

        for (uint i = 0; i < candidates.length; i++) {
            names[i] = candidates[i].name;
            parties[i] = candidates[i].party;
            votes[i] = candidates[i].votes;
        }
    }

    function getElectionDates() external view returns (uint, uint) {
        return (startDate, endDate);
    }

    function getTotalVotes() external view returns (uint) {
        return votersList.length;
    }

    function getWinner()
        external
        view
        returns (string memory name, string memory party, uint votes)
    {
        require(candidates.length > 0, "No candidates");

        uint maxVotes = 0;
        uint winnerIndex = 0;

        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].votes > maxVotes) {
                maxVotes = candidates[i].votes;
                winnerIndex = i;
            }
        }

        Candidate memory w = candidates[winnerIndex];
        return (w.name, w.party, w.votes);
    }
}