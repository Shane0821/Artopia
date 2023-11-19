pragma solidity ^0.8.20;

import { Auction } from './auction.sol';

contract AuctionFactory {
    address[] public auctions;
    address payable public organizer;
    address imgContractAddress;

    constructor(address t) {
        organizer = payable(msg.sender);
        imgContractAddress = t;
    }

    function createAuction(uint duration, uint256 tokenId) public returns (uint){
        Auction newAuction = new Auction(duration, payable(msg.sender), tokenId, imgContractAddress);
        auctions.push(address(newAuction));
        return auctions.length - 1;
    }

    function getAuctionByIndex(uint index) public view returns (address) {
        return auctions[index];
    }

    function allAuctions() public view returns (address[] memory) {
        return auctions;
    }
}