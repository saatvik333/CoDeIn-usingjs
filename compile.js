import fs from 'fs';

import { fileURLToPath } from 'url';

import path from 'path';
import solc from 'solc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function compileContract(contractFileName) {
    const contractPath = path.resolve(__dirname, 'contracts', contractFileName);
    const source = fs.readFileSync(contractPath, 'utf8');

    const input = {
        language: 'Solidity',
        sources: {
            [path.basename(contractPath)]: { content: source },
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['abi', 'evm.bytecode'],
                },
            },
        },
    };

    const includePath = path.resolve('node_modules');

    const output = JSON.parse(
        solc.compile(JSON.stringify(input), { import: findImports }),
    );

    function findImports(dependency) {
        try {
            const dependencyPath = path.resolve(includePath, dependency);
            return { contents: fs.readFileSync(dependencyPath, 'utf8') };
        } catch (err) {
            return { error: `File not found: ${dependency}` };
        }
    }

    if (output.errors) {
        console.error('Compilation errors:', output.errors);
    }

    const contractName = Object.keys(output.contracts)[3];
    const contractData = output.contracts[contractName];
    return {
        abi: contractData[Object.keys(contractData)[0]].abi,
        bytecode:
            contractData[Object.keys(contractData)[0]].evm.bytecode.object,
    };
}
