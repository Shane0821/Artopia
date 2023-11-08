// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PromptNFT is ERC721URIStorage, ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Mapping from cid to tokenId
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
        // because baseURI is ipfs://, the tokenURI is ipfs://cid
        _setTokenURI(newItemId, cid);

        return newItemId;
    }

    function getOnwerByCID(string memory cid) public view returns (address) {
        if (cids[cid] == 0) return address(0);
        return ownerOf(cids[cid]);
    }

    // overriden functions
    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overridden in child contracts.
     */
    function _baseURI() internal view override virtual returns (string memory) {
        return "ipfs://";
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}