import deployContract from './deploy.js';
import interactWithEncryptedERC20 from './test/erc20.js';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
    const providerUrl = process.env.PROVIDER_URL;
    const privateKey = process.env.PRIVATE_KEY;

    // Deploy the contract
    const { contract, abi } = await deployContract(
        'EncryptedERC20.sol',
        providerUrl,
        privateKey,
    );

    console.log('Contract Address:', await contract.getAddress());

    // Interact with the deployed contract
    await interactWithEncryptedERC20(
        abi,
        await contract.getAddress(),
        providerUrl,
        privateKey,
    );
})();
