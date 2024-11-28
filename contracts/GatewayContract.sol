// SPDX-License-Identifier: BSD-3-Clause-Clear

pragma solidity ^0.8.24;

import 'fhevm/lib/TFHE.sol';
import 'fhevm/gateway/GatewayCaller.sol';

contract TestAsyncDecrypt is GatewayCaller {
    ebool xBool;
    bool public yBool;

    constructor() {
        xBool = TFHE.asEbool(true);
        TFHE.allow(xBool, address(this));
    }

    function requestBool() public {
        uint256[] memory cts = new uint256[](1);
        cts[0] = Gateway.toUint256(xBool);
        Gateway.requestDecryption(cts, this.callbackBool.selector, 0, block.timestamp + 100, false);
    }

    function callbackBool(uint256, bool decryptedInput) public onlyGateway returns (bool) {
        yBool = decryptedInput;
        return yBool;
    }
}
