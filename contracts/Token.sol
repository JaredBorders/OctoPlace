// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/* 
 * ERC-721 is a Non-Fungible Token Standard that implements an API 
 * for tokens within Smart Contracts. It provides functionalities 
 * like to transfer tokens from one account to another, to get the
 * current token balance of an account, to get the owner of a specific
 * token and also the total supply of the token available on the network. 
 */
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
/* 
 * Implementation of ERC721 that includes the metadata standard extensions.
 */
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
/*
 * Provides counters that can only be incremented, decremented or reset. 
 * This can be used e.g. to track the number of elements in a mapping, 
 * issuing ERC721 ids, or counting request ids.
 */
import "@openzeppelin/contracts/utils/Counters.sol";
/*
 * Inheriting from ReentrancyGuard will make the nonReentrant modifier 
 * available, which can be applied to functions to make sure there are 
 * no nested (reentrant) calls to them.
 */
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title Non-Fungible Token based on ERC721 standard
/// @author jaredborders
contract Token {}