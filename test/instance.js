import dotenv from 'dotenv';
import {
    clientKeyDecryptor,
    createInstance,
    getCiphertextCallParams,
} from 'fhevmjs';
import { readFileSync } from 'fs';
import fs from 'fs';
import { homedir } from 'os';
import path from 'path';

import { awaitCoprocessor, getClearText } from './coprocessorUtils.js';
import {
    createEncryptedInputMocked,
    reencryptRequestMocked,
} from './fhevmjsMocked.js';

dotenv.config();

const FHE_CLIENT_KEY_PATH = process.env.FHE_CLIENT_KEY_PATH;
const parsedEnvACL = dotenv.parse(
    fs.readFileSync('node_modules/fhevm/lib/.env.acl'),
);
const aclAdd = parsedEnvACL.ACL_CONTRACT_ADDRESS;

let clientKey;

// Function to create a mocked instance
export const createInstanceMocked = async () => {
    const instance = await createInstance({
        chainId: 1, // Replace with your target chain ID
    });
    instance.reencrypt = reencryptRequestMocked;
    instance.createEncryptedInput = createEncryptedInputMocked;
    instance.getPublicKey = () => '0xFFAA44433';
    return instance;
};

// Function to create instances for multiple accounts
export const createInstances = async (accounts) => {
    const instances = {};
    const isLocalNetwork = process.env.NETWORK_NAME === 'local';

    await Promise.all(
        Object.keys(accounts).map(async (key) => {
            instances[key] = isLocalNetwork
                ? await createInstanceMocked()
                : await createInstance({
                      networkUrl: process.env.NETWORK_URL,
                      gatewayUrl: 'http://localhost:7077', // Replace with your gateway URL
                      aclAddress: aclAdd,
                  });
        }),
    );

    return instances;
};

// Helper to fetch ciphertext
export const getCiphertext = async (handle, provider) => {
    return provider.call(getCiphertextCallParams(handle));
};

// Fetch decryptor key
export const getDecryptor = () => {
    if (!clientKey) {
        const keyPath =
            FHE_CLIENT_KEY_PATH || path.join(homedir(), 'network-fhe-keys/cks');
        clientKey = readFileSync(keyPath);
    }
    return clientKeyDecryptor(clientKey);
};

// Helper for decryption logic
const decryptHelper = async (handle, provider, decryptMethod) => {
    const isLocalNetwork = process.env.NETWORK_NAME === 'local';

    if (isLocalNetwork) {
        await awaitCoprocessor();
        const clearText = await getClearText(handle);
        return decryptMethod === 'address'
            ? '0x' + BigInt(clearText).toString(16).padStart(40, '0')
            : decryptMethod === 'bool'
              ? clearText === '1'
              : BigInt(clearText);
    } else {
        const decryptor = getDecryptor();
        const ciphertext = await getCiphertext(handle, provider);
        return decryptor[decryptMethod](ciphertext);
    }
};

// Exported decrypt functions
export const decryptBool = (handle, provider) =>
    decryptHelper(handle, provider, 'decryptBool');
export const decrypt4 = (handle, provider) =>
    decryptHelper(handle, provider, 'decrypt4');
export const decrypt8 = (handle, provider) =>
    decryptHelper(handle, provider, 'decrypt8');
export const decrypt16 = (handle, provider) =>
    decryptHelper(handle, provider, 'decrypt16');
export const decrypt32 = (handle, provider) =>
    decryptHelper(handle, provider, 'decrypt32');
export const decrypt64 = (handle, provider) =>
    decryptHelper(handle, provider, 'decrypt64');
export const decryptAddress = (handle, provider) =>
    decryptHelper(handle, provider, 'address');
