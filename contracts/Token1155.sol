
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * The distinctive feature of ERC1155 is that it uses a single 
 * smart contract to represent multiple tokens at once.
 */
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
/**
 * In order for our contract to receive ERC1155 tokens we can inherit 
 * from the convenience contract ERC1155Holder which handles the registering for us.
 */
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
/**
 * Provides counters that can only be incremented, decremented or reset. 
 * This can be used e.g. to track the number of elements in a mapping, 
 * issuing ERC721 ids, or counting request ids.
 */
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title Non-Fungible Token collection based on ERC1155 standard
/// @author jaredborders
contract Token1155 is ERC1155 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address marketAddress;

    constructor(address _marketAddress) ERC1155("URI_GOES_HERE") {
        marketAddress = _marketAddress;
    }
}
