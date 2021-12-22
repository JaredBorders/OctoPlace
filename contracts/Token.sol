// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * ERC-721 is a Non-Fungible Token Standard that implements an API 
 * for tokens within Smart Contracts. It provides functionalities 
 * like to transfer tokens from one account to another, to get the
 * current token balance of an account, to get the owner of a specific
 * token and also the total supply of the token available on the network. 
 */
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
/** 
 * Implementation of ERC721 that includes the metadata standard extensions.
 */
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
/**
 * Provides counters that can only be incremented, decremented or reset. 
 * This can be used e.g. to track the number of elements in a mapping, 
 * issuing ERC721 ids, or counting request ids.
 */
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title Non-Fungible Token based on ERC721 standard
/// @author jaredborders
contract Token is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address marketAddress;

    constructor(address _marketAddress) ERC721("OctoPlace Tokens", "OCTP") {
        marketAddress = _marketAddress;
    }

    /** 
     * @notice create/mint NFT
     * @param tokenURI token metadata
     * @return unique token id
     */
    function createToken(string memory tokenURI) public returns (uint) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        // Gives Market contract approval to transact tokens between users
        setApprovalForAll(marketAddress, true);

        return newTokenId;
    }
}