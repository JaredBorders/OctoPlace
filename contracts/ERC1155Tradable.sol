// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * The distinctive feature of ERC1155 is that it uses a single
 * smart contract to represent multiple tokens at once.
 */
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
/**
 * Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 */
import "@openzeppelin/contracts/access/Ownable.sol";
/**
 * Provides counters that can only be incremented, decremented or reset. 
 * This can be used e.g. to track the number of elements in a mapping, 
 * issuing ERC721 ids, or counting request ids.
 */
import "@openzeppelin/contracts/utils/Counters.sol";

/// @title Non-Fungible Token collection based on ERC1155 standard
/// @notice this provides basic support of the ERC1155 standard and in the future should be upgraded
/// @author jaredborders
contract ERC1155Tradable is ERC1155 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => address) public creators;
    mapping(uint256 => uint256) public tokenSupply;
    mapping(uint256 => string) customUri;

    address marketAddress;

    constructor(
        string memory _uri,
        address _marketAddress
    ) ERC1155(_uri) {
        marketAddress = _marketAddress;
    }

    /**
     * @dev Creates a new token type and assigns _initialSupply (OctoPlace == 1) to an address
     * @param _initialOwner address of the first owner of the token
     * @param _uri Optional URI for this token type
     * @return The newly created token ID
     */
    function create(
        address _initialOwner,
        string memory _uri
    ) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        creators[newTokenId] = _msgSender();

        if (bytes(_uri).length > 0) {
            customUri[newTokenId] = _uri;
            emit URI(_uri, newTokenId);
        }

        // batch minting not supported in this rudimentary implementation
        _mint(_initialOwner, newTokenId, 1, "");
        tokenSupply[newTokenId] = 1;

        // Gives Market contract approval to transact tokens between users
        setApprovalForAll(marketAddress, true);

        return newTokenId;
    }
}
