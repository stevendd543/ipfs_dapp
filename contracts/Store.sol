pragma solidity ^0.7.3;

import "hardhat/console.sol";

contract StorageSpace {
    string data;

    constructor(string memory _data) public {
        data = _data;
    }

    function inspect() public view returns (string memory) {
        return data;
    }
}

contract StorageCreate {
    function createSpace(string memory data)
        public
        returns (StorageSpace SpaceAddress)
    {
        return new StorageSpace("HIdong");
    }
}
