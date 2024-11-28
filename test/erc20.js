import { JsonRpcProvider, Wallet, Contract } from 'ethers';
// import { createInstances } from './instance.js';
// import { createInstance , initFhevm} from 'fhevmjs';
import { clientKeyDecryptor, createInstance as createFhevmInstance, getCiphertextCallParams } from "fhevmjs";
import dotenv from 'dotenv';
import { initSigners, getSigners } from './signer.js';
import fs from 'fs';
import { createInstances } from './instance.js';
dotenv.config();

async function testEncryptedERC20Functions(
    abi,
    contractAddress,
    providerUrl,
    privateKey,
) {
    try {
        console.log('--- Testing EncryptedERC20 Contract ---');
        const provider = new JsonRpcProvider(providerUrl);
        const wallet = new Wallet(privateKey, provider);

        const contract = new Contract(contractAddress, abi, wallet);
        await testMintingTokens(contract);
        let signers = await initSigners(providerUrl);
        const instances = await createInstances(signers);
        const instance = instances.alice;

        console.log(instance);

        // await testTotalSupply(contract);
        // await testBalanceOfOwner(contract, wallet);
        // await testTransferTokens(contract, instance, wallet);
        // await checkRecipientBalance(contract);
        // await testApprove(contract);
        // await testAllowance(contract, wallet);
        // await testTransferFrom(contract, wallet);

        console.log('--- Testing Complete ---');
    } catch (error) {
        console.log('error:', error);
    }
}

async function testMintingTokens(contract) {
    console.log('Minting tokens...');
    const mintAmount = 1000;

    const transaction = await contract.mint(mintAmount);
    await transaction.wait();

    console.log(`Minted ${mintAmount} tokens successfully!`);
}

async function testTotalSupply(contract) {
    console.log('Checking total supply...');
    const totalSupply = await contract.totalSupply();
    console.log('Total Supply:', totalSupply.toString());
}

async function testBalanceOfOwner(contract, wallet) {
    console.log('Checking owner balance...');
    const ownerBalance = await contract.balanceOf(wallet.address);
    console.log('Owner Encrypted Balance:', ownerBalance.toString());
}

async function testTransferTokens(contract, instance, contractAddress) {
    const userAddress = '0xdFe759591f31d9254dc8E2c2dBD1fFca0aFcC6E1';
    const input = instance.createEncryptedInput(contractAddress, userAddress);
    console.log('Transferring tokens...');
    input.add64(1337);
    const encryptedTransferAmount = input.encrypt();
    const recipient = '0x66BD0b89FF45C2009b0968bC7Eb2141ECA91c31f';
    console.log('Recipient:', recipient);
    const transferTx = await contract.transfer(
        recipient,
        encryptedTransferAmount.handles[0],
        encryptedTransferAmount.inputProof,
    );
    await transferTx.wait();
    console.log(`Transferred tokens to ${recipient}`);
}

async function checkRecipientBalance(contract) {
    console.log('Checking recipient balance...');
    const recipient = '0x66BD0b89FF45C2009b0968bC7Eb2141ECA91c31f';
    const recipientBalance = await contract.balanceOf(recipient);
    console.log('Recipient Encrypted Balance:', recipientBalance.toString());
}

async function testApprove(contract) {
    console.log('Approving spender...');
    const spender = '0x77BD0b89FF45C2009b0968bC7Eb2141ECA91c31f';
    const encryptedApproveAmount = '0x...';
    const approveProof = '0x...';
    const approveTx = await contract.approve(
        spender,
        encryptedApproveAmount,
        approveProof,
    );
    await approveTx.wait();
    console.log(`Approved ${spender} to spend tokens.`);
}

async function testAllowance(contract, wallet) {
    console.log('Checking allowance...');
    const spender = '0x77BD0b89FF45C2009b0968bC7Eb2141ECA91c31f';
    const allowance = await contract.allowance(wallet.address, spender);
    console.log(`Allowance for ${spender}:`, allowance.toString());
}

async function testTransferFrom(contract, wallet) {
    console.log('Transferring from spender...');
    const recipient = '0x66BD0b89FF45C2009b0968bC7Eb2141ECA91c31f';
    const spender = '0x77BD0b89FF45C2009b0968bC7Eb2141ECA91c31f';
    const encryptedApproveAmount = '0x...';
    const transferFromProof = '0x...';
    const transferFromTx = await contract.transferFrom(
        wallet.address,
        recipient,
        encryptedApproveAmount,
        transferFromProof,
    );
    await transferFromTx.wait();
    console.log(
        `Transferred tokens from ${wallet.address} to ${recipient} via ${spender}`,
    );
}

export default testEncryptedERC20Functions;
