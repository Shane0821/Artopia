// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PromptNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(string => uint8) prompts;

    constructor() ERC721("PromptNFT", "PNFT") {}

    function awardItem(address user, string memory prompt)
        public returns (uint256) {
        require(prompts[prompt] != 1, "prompt already exists");

        prompts[prompt] = 1;

        uint256 newItemId = _tokenIds.current();
        _mint(user, newItemId);
        _setTokenURI(newItemId, prompt);

        _tokenIds.increment();
        return newItemId;
    }
}