import {
    // providers as _providers,
    // Wallet as _Wallet,
    // ContractFactory as _ContractFactory,
} from 'ethers';
import compileContract from './compile.js';
import { JsonRpcProvider } from 'ethers';
import { Wallet } from 'ethers';
import { ContractFactory } from 'ethers';

async function deployContract(contractFileName, providerUrl, privateKey) {
    const { abi, bytecode } = compileContract(contractFileName);

    const provider = new JsonRpcProvider(providerUrl);
    const wallet = new Wallet(privateKey, provider);

    const factory = new ContractFactory(abi, bytecode, wallet);
    const contract = await factory.deploy();
    console.log('Contract deployed at:', await contract.getAddress());
    await contract.waitForDeployment();
    return { contract, abi };
}

export default deployContract;
