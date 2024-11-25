import { JsonRpcProvider, Wallet, Contract } from 'ethers';
import { TFHE } from 'fhevmjs';

async function testEncryptedERC20Functions(abi, contractAddress, providerUrl, privateKey) {
    // Setup provider, instance, and wallet
    const provider = new JsonRpcProvider(providerUrl);
    const wallet = new Wallet(privateKey, provider);
    const instance = await createInstance({ networkUrl: providerUrl });
    // Connect to the contract
    const contract = new Contract(contractAddress, abi, wallet);

    console.log('--- Testing EncryptedERC20 Contract ---');

    // 1. Test Minting Tokens
    console.log('Minting tokens...');
    const mintAmount = 1000; // Amount to mint
    const mintTx = await contract.mint(mintAmount);
    await mintTx.wait();
    console.log(`Minted ${mintAmount} tokens successfully!`);

    // 2. Test Total Supply
    console.log('Checking total supply...');
    const totalSupply = await contract.totalSupply();
    console.log('Total Supply:', totalSupply.toString());

    // 3. Test Balance of Owner
    console.log('Checking owner balance...');
    const ownerBalance = await contract.balanceOf(wallet.address);
    console.log('Owner Encrypted Balance:', ownerBalance.toString());

    // 4. Test Transfer Tokens
    console.log('Transferring tokens...');
    const recipient = '0x66BD0b89FF45C2009b0968bC7Eb2141ECA91c31f'; // Replace with a valid recipient address
    const input = instance.createEncryptedInput(contractAddress, wallet.address);
    const transferAmount = 69;
    const transferProof = '0x...'; // Placeholder: Replace with valid proof
    const transferTx = await contract.transfer(recipient, encryptedTransferAmount, transferProof);
    await transferTx.wait();
    console.log(`Transferred tokens to ${recipient}`);

    // 5. Check Recipient Balance
    console.log('Checking recipient balance...');
    const recipientBalance = await contract.balanceOf(recipient);
    console.log('Recipient Encrypted Balance:', recipientBalance.toString());

    // 6. Test Approve
    console.log('Approving spender...');
    const spender = '0x77BD0b89FF45C2009b0968bC7Eb2141ECA91c31f'; // Replace with a valid spender address
    const encryptedApproveAmount = '0x...'; // Placeholder: Replace with valid encrypted approve amount
    const approveProof = '0x...'; // Placeholder: Replace with valid proof
    const approveTx = await contract.approve(spender, encryptedApproveAmount, approveProof);
    await approveTx.wait();
    console.log(`Approved ${spender} to spend tokens.`);

    // 7. Test Allowance
    console.log('Checking allowance...');
    const allowance = await contract.allowance(wallet.address, spender);
    console.log(`Allowance for ${spender}:`, allowance.toString());

    // 8. Test TransferFrom
    console.log('Transferring from spender...');
    const transferFromProof = '0x...'; // Placeholder: Replace with valid proof
    const transferFromTx = await contract.transferFrom(wallet.address, recipient, encryptedApproveAmount, transferFromProof);
    await transferFromTx.wait();
    console.log(`Transferred tokens from ${wallet.address} to ${recipient} via ${spender}`);

    console.log('--- Testing Complete ---');
}

export default testEncryptedERC20Functions;
