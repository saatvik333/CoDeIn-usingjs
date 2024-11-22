import deployContract from './deploy.js';
import interactWithContract from './interact.js';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
    const providerUrl = process.env.PROVIDER_URL;
    const privateKey = process.env.PRIVATE_KEY;

    // Deploy the contract
    const { contract, abi } = await deployContract(
        'SimpleStorage.sol',
        providerUrl,
        privateKey,
    );

    console.log('Contract Address:', await contract.getAddress());

    // Interact with the deployed contract
    await interactWithContract(abi, await contract.getAddress(), providerUrl, privateKey);
})();
