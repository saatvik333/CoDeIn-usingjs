import { JsonRpcProvider } from 'ethers';

let signers;

export const initSigners = async (providerUrl) => {
    // Connect to the provider
    const provider = new JsonRpcProvider(providerUrl);

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

    return signers;
    // if (!signers) {
    //     // Connect to the provider
    //     const provider = new JsonRpcProvider(providerUrl);

    //     // Fetch accounts (e.g., from a local node or testnet)
    //     const accounts = await provider.listAccounts();

    //     // Initialize signers for each account
    //     signers = {
    //         alice: provider.getSigner(accounts[0]),
    //         bob: provider.getSigner(accounts[1]),
    //         carol: provider.getSigner(accounts[2]),
    //         dave: provider.getSigner(accounts[3]),
    //         eve: provider.getSigner(accounts[4]),
    //     };
    // }
};

export const getSigners = async () => {
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
