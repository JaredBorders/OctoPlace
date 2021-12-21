
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/* 
 * The distinctive feature of ERC1155 is that it uses a single 
 * smart contract to represent multiple tokens at once.
 */
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
/*
 * In order for our contract to receive ERC1155 tokens we can inherit 
 * from the convenience contract ERC1155Holder which handles the registering for us.
 */
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

/// @title Non-Fungible Token collection based on ERC1155 standard
/// @author jaredborders
contract TokenCollection is ERC1155 {
    uint256 public constant GOLD = 0;
    uint256 public constant SILVER = 1;
    uint256 public constant THORS_HAMMER = 2;
    uint256 public constant SWORD = 3;
    uint256 public constant SHIELD = 4;

    constructor() ERC1155("https://game.example/api/item/{id}.json") {
        _mint(msg.sender, GOLD, 10**18, "");
        _mint(msg.sender, SILVER, 10**27, "");
        _mint(msg.sender, THORS_HAMMER, 1, "");
        _mint(msg.sender, SWORD, 10**9, "");
        _mint(msg.sender, SHIELD, 10**9, "");
    }
}
