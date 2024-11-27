const { ethers } = require('ethers');

let signers;

const initSigners = async (providerUrl) => {
    if (!signers) {
        // Connect to the provider
        const provider = new ethers.JsonRpcProvider(providerUrl);

        // Fetch accounts (e.g., from a local node or testnet)
        const accounts = await provider.listAccounts();

        // Initialize signers for each account
        signers = {
            alice: provider.getSigner(accounts[0]),
            bob: provider.getSigner(accounts[1]),
            carol: provider.getSigner(accounts[2]),
            dave: provider.getSigner(accounts[3]),
            eve: provider.getSigner(accounts[4]),
        };
    }
};

const getSigners = async () => {
    if (!signers) {
        throw new Error('Signers not initialized. Call initSigners() first.');
    }
    return signers;
};

// Example usage:
// (async () => {
//   await initSigners("http://localhost:8545"); // Replace with your JSON-RPC URL
//   const signers = await getSigners();
//   console.log(signers);
// })();

module.exports = { initSigners, getSigners };
