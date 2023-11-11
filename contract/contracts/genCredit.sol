// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

contract CreditManagement {
    address public owner;

    uint256 public dailyCreditLimit = 5;
    uint256 public creditsPerPayment = 100;

    mapping(address => uint256) public userCredits;
    mapping(address => uint256) public lastCreditUpdate;

    event CreditsPurchased(address indexed user, uint256 creditsPurchased);
    event CreditsUsed(address indexed user, uint256 creditsUsed);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function updateCredits() external {
        uint256 day = block.timestamp / 1 days;

        require(
            lastCreditUpdate[msg.sender] / 1 days < day,
            "You have claimed credits for today. Come back tomorrow to get more."
        );

        if (lastCreditUpdate[msg.sender] / 1 days < day) {
            userCredits[msg.sender] = dailyCreditLimit;
            lastCreditUpdate[msg.sender] = day * 1 days;
        }
    }

    function canUpdateCredit() public view returns (bool) {
        return lastCreditUpdate[msg.sender] < block.timestamp - 1 days;
    }

    function useCredits(uint256 _amount) external {
        require(userCredits[msg.sender] >= _amount, "Insufficient credits");
        userCredits[msg.sender] -= _amount;
        emit CreditsUsed(msg.sender, _amount);
    }

    function purchaseCredits() external payable {
        uint256 minimumEtherRequired = 0.00020 * 1 ether; // Convert to wei for comparison
        require(
            msg.value >= minimumEtherRequired,
            "Insufficient ether to purchase credits"
        );
        userCredits[msg.sender] += creditsPerPayment;
        emit CreditsPurchased(msg.sender, creditsPerPayment);
    }

    function withdrawEther() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
