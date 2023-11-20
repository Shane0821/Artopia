pragma solidity ^0.8.20;

import { Auction } from './auction.sol';

contract AuctionFactory {
    address[] public auctions;
    address payable public organizer;
    address imgContractAddress;
    mapping(uint256 => address) public tokenIdToAuction;

    constructor(address t) {
        organizer = payable(msg.sender);
        imgContractAddress = t;
    }

    function createAuction(uint duration, uint256 tokenId) public returns (address){
        Auction newAuction = new Auction(duration, payable(msg.sender), tokenId, imgContractAddress);
        address addr = address(newAuction);
        auctions.push(addr);
        tokenIdToAuction[tokenId] = addr;
        return addr;
    }

    function getAunctionByTokenId(uint256 tokenId) public view returns (address) {
        return tokenIdToAuction[tokenId];
    }

    function getAuctionByIndex(uint index) public view returns (address) {
        return auctions[index];
    }

    function allAuctions() public view returns (address[] memory) {
        return auctions;
    }
}