// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./promptnft.sol";

contract ImageNFT is ERC721URIStorage, ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    PromptNFT promptContract;

    mapping(string => uint256) cids;

    constructor(address addr) ERC721("ImageNFT", "INFT") {
        promptContract = PromptNFT(addr);
    }

    function getTokenIdByCID(string memory cid) public view returns (uint256) {
        return cids[cid]; // return token id
    }

    function awardItem(address user, string memory metadatacid, string memory cid, string memory promptcid)
        public returns (uint256) {
        // check ownership of prompt
        address owner = promptContract.getOnwerByCID(promptcid);
        require(owner == user, "you are not the owner of the prompt");

        // check ownership of artwork
        require(cids[cid] == 0, "artwork already exists");

       // increament to make sure that every element in cids > 0
        _tokenIds.increment();

        // mark cid as used and mint
        uint256 newItemId = _tokenIds.current();
        cids[cid] = newItemId;

        _mint(user, newItemId);
        _setTokenURI(newItemId, metadatacid);

        return newItemId;
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