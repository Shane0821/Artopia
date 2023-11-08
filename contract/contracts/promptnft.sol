// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PromptNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(string => uint256) cids;

    constructor() ERC721("PromptNFT", "PNFT") {}

    function awardItem(address user, string memory cid)
        public returns (uint256) {
        require(cids[cid] == 0, "prompt already exists");

        // increament to make sure that every element in cids > 0
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        cids[cid] = newItemId;

        _mint(user, newItemId);

        string memory metadataURI = string.concat("ipfs://", cid);
        _setTokenURI(newItemId, metadataURI);

        return newItemId;
    }

    function getOnwerByCID(string memory cid) public view returns (address) {
        if (cids[cid] == 0) return address(0);
        return ownerOf(cids[cid]);
    }
}