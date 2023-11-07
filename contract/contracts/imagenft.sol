// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ImageNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(string => uint8) cids;

    constructor() ERC721("ImageNFT", "INFT") {}

    function awardItem(address user, string memory metadataURI, string memory cid)
        public returns (uint256) {
        require(cids[cid] != 1, "artwork already exists");

        cids[cid] = 1;

        uint256 newItemId = _tokenIds.current();
        _mint(user, newItemId);
        _setTokenURI(newItemId, metadataURI);

        _tokenIds.increment();
        return newItemId;
    }
}