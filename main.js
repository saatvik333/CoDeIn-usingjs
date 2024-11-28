import deployContract from './deploy.js';
import testEncryptedERC20Functions from './test/erc20.js';
import interactWithEncryptedERC20 from './test/erc20.js';
// import testAsyncDecrypt from './test/testasyncDecrypt.js';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
    const providerUrl = process.env.PROVIDER_URL;
    const privateKey = process.env.PRIVATE_KEY;
    const gatewayUrl = process.env.GATEWAY_URL;
    // Deploy the contract
    const { contract, abi } = await deployContract(
        'EncryptedERC20.sol',
        providerUrl,
        privateKey,
    );

    console.log('Contract Address:', await contract.getAddress());
    const address = await contract.getAddress();
    // Interact with the deployed contract
    await testEncryptedERC20Functions(
        abi,
        address,
        providerUrl,
        privateKey,
    );
})();
