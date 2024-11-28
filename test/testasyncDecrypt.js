import { createInstance } from 'fhevmjs';
import { Contract } from 'ethers';
import { expect } from 'chai';
import dotenv from 'dotenv';

dotenv.config();

async function testAsyncDecrypt(abi, contractAddress, providerUrl, privateKey) {
    const instance = await createInstance({
        chainId: dotenv.CHAIN_ID,
        networkUrl: dotenv.PROVIDER_URL,
        gatewayUrl: dotenv.GATEWAY_URL,
    });
    const contract = new Contract(contractAddress, abi);

    const relayerAddress = '0x97F272ccfef4026A1F3f0e0E879d514627B84E69';
    const tx2 = await instance.contract
        .connect(relayerAddress)
        .requestBool({ gasLimit: 5_000_000 });
    await tx2.wait();
    await awaitAllDecryptionResults();
    const y = await instance.contract.yBool();
    expect(y).to.equal(true);

    console.log(instance);
}

export default testAsyncDecrypt;
