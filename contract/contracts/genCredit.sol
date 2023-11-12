// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

contract CreditManagement {
    address public owner;

    uint256 public monthlyCreditLimit = 100;
    uint256 public dailyCreditLimit = 5;
    uint256 public creditsPerPayment = 100;

    struct UpdateCreditsRequest {
        address user;
        uint256 nonce; // Use a nonce to prevent replay attacks
    }

    mapping(address => uint256) public userCredits;
    mapping(address => uint256) public lastCreditUpdate;
    mapping(address => mapping(uint256 => bool)) public nonceUsed;

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
        // Execute the logic to update credits
        uint256 month = block.timestamp / 30 days;
        require(
            lastCreditUpdate[msg.sender] / 30 days < month,
            "You've claimed your credits this month. Come back next month."
        );
        if (lastCreditUpdate[msg.sender] / 30 days < month) {
            userCredits[msg.sender] += monthlyCreditLimit;
            lastCreditUpdate[msg.sender] = month * 30 days;
        }
    }

    function updateCreditsMeta(
        UpdateCreditsRequest memory request,
        bytes memory signature
    ) external {
        // Verify the signature
        bytes32 messageHash = keccak256(
            abi.encodePacked(request.user, request.nonce)
        );
        address signer = recoverSigner(messageHash, signature);
        require(signer == msg.sender, "Invalid signature");

        // Ensure the nonce is not used before
        require(!nonceUsed[request.user][request.nonce], "Nonce already used");
        nonceUsed[request.user][request.nonce] = true;

        // Execute the logic to update credits
        uint256 day = block.timestamp / 1 days;
        require(
            lastCreditUpdate[request.user] / 1 days < day,
            "You've claimed your credits today. Come back tomorrow."
        );
        if (lastCreditUpdate[request.user] / 1 days < day) {
            userCredits[request.user] += dailyCreditLimit;
            lastCreditUpdate[request.user] = day * 1 days;
        }
    }

    function recoverSigner(
        bytes32 messageHash,
        bytes memory signature
    ) internal pure returns (address) {
        bytes32 r;
        bytes32 s;
        uint8 v;

        // Extract r, s, v from the signature
        assembly {
            r := mload(add(signature, 0x20))
            s := mload(add(signature, 0x40))
            v := byte(0, mload(add(signature, 0x60)))
        }

        // Handle Ethereum's weird v value
        if (v < 27) {
            v += 27;
        }

        // Return the signer's address
        return ecrecover(messageHash, v, r, s);
    }

    function canUpdateCredit() public view returns (bool) {
        uint256 month = block.timestamp / 30 days;
        return lastCreditUpdate[msg.sender] / 30 days < month;
    }

    function getCredits() public view returns (uint256) {
        return userCredits[msg.sender];
    }

    function useCredits(uint256 _amount) external {
        require(userCredits[msg.sender] >= _amount, "Insufficient credits");
        userCredits[msg.sender] -= _amount;
        emit CreditsUsed(msg.sender, _amount);
    }

    function purchaseCredits() external payable {
        uint256 minimumEtherRequired = 0.00030 * 1 ether; // Convert to wei for comparison
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
