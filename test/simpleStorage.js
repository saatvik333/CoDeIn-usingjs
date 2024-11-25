import { JsonRpcProvider, Wallet, Contract } from 'ethers';

async function interactWithContract(
    abi,
    contractAddress,
    providerUrl,
    privateKey,
) {
    const provider = new JsonRpcProvider(providerUrl);
    const wallet = new Wallet(privateKey, provider);

    const contract = new Contract(contractAddress, abi, wallet);

    console.log('Setting value to 69...');
    const tx = await contract.setValue(69);
    await tx.wait();
    console.log('Value set!');

    console.log('Reading value...');
    const value = await contract.getValue();
    console.log('Stored value is:', value.toString());
}

export default interactWithContract;
