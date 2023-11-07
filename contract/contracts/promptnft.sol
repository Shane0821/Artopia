// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PromptNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(string => uint8) cids;

    constructor() ERC721("PromptNFT", "PNFT") {}

    function awardItem(address user, string memory cid)
        public returns (uint256) {
        require(cids[cid] != 1, "prompt already exists");

        cids[cid] = 1;

        uint256 newItemId = _tokenIds.current();
        _mint(user, newItemId);

        string memory metadataURI = string.concat("ipfs://", cid);
        _setTokenURI(newItemId, metadataURI);

        _tokenIds.increment();
        return newItemId;
    }
}