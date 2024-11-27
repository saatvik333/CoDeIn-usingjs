import { toBufferLE } from 'bigint-buffer';
import { ethers } from 'ethers';

export const waitForBlock = (blockNumber) => {
    return new Promise((resolve, reject) => {
        const waitBlock = async (currentBlock) => {
            if (BigInt(currentBlock) >= BigInt(blockNumber)) {
                await ethers.provider.off('block', waitBlock);
                resolve(blockNumber);
            }
        };
        ethers.provider.on('block', waitBlock).catch((err) => {
            reject(err);
        });
    });
};

export const waitNBlocks = async (Nblocks) => {
    const currentBlock = await ethers.provider.getBlockNumber();
    await waitForBlock(currentBlock + Nblocks);
};

export const waitForBalance = async (address) => {
    return new Promise((resolve, reject) => {
        const checkBalance = async () => {
            const balance = await ethers.provider.getBalance(address);
            if (balance > 0) {
                await ethers.provider.off('block', checkBalance);
                resolve();
            }
        };
        ethers.provider.on('block', checkBalance).catch((err) => {
            reject(err);
        });
    });
};

export const produceDummyTransactions = async (blockCount) => {
    let counter = blockCount;
    while (counter >= 0) {
        counter--;
        const [signer] = await ethers.getSigners();
        const nullAddress = '0x0000000000000000000000000000000000000000';
        const tx = {
            to: nullAddress,
            value: BigInt(0),
        };
        const receipt = await signer.sendTransaction(tx);
        await receipt.wait();
    }
};

export const mineNBlocks = async (n) => {
    for (let index = 0; index < n; index++) {
        await ethers.provider.send('evm_mine');
    }
};

export const bigIntToBytes = (value) => {
    const byteArrayLength = Math.ceil(value.toString(2).length / 8);
    return new Uint8Array(toBufferLE(value, byteArrayLength));
};
