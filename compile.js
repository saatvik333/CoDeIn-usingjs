import solc from 'solc';
import fs from 'fs';

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function compileContract(contractFileName) {
    const contractPath = path.resolve(__dirname, 'contracts', contractFileName);
    const source = fs.readFileSync(contractPath, 'utf8');

    const input = {
        language: 'Solidity',
        sources: {
            [contractFileName]: {
                content: source,
            },
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['abi', 'evm.bytecode.object'],
                },
            },
        },
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    const contractName = Object.keys(output.contracts[contractFileName])[0];
    const abi = output.contracts[contractFileName][contractName].abi;
    const bytecode = output.contracts[contractFileName][contractName].evm.bytecode.object;


    
    return { abi, bytecode };
}

export default compileContract;
