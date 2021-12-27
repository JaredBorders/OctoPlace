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
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
/**
 * Provides counters that can only be incremented, decremented or reset.
 * This can be used e.g. to track the number of elements in a mapping,
 * issuing ERC721 ids, or counting request ids.
 */
import "@openzeppelin/contracts/utils/Counters.sol";
/**
 * Inheriting from ReentrancyGuard will make the nonReentrant modifier
 * available, which can be applied to functions to make sure there are
 * no nested (reentrant) calls to them.
 */
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
/**
 * A contract Implementing ERC1155Holder registers itself as 
 * aware of the ERC1155 protocol, thereby allowing for ERC1155 token
 * transfers. See https://docs.openzeppelin.com/contracts/3.x/erc1155#sending-to-contracts
 */
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

/// @title A Market for NFTs
/// @author jaredborders
contract Market is ReentrancyGuard, ERC1155Holder {
    using Counters for Counters.Counter;
    Counters.Counter private _item721Ids;
    Counters.Counter private _items721Sold;
    Counters.Counter private _item1155Ids;
    Counters.Counter private _items1155Sold;

    event MarketItemCreated(
        uint256 indexed itemId,
        uint256 price,
        uint256 indexed tokenId,
        address indexed tokenAddress,
        address seller,
        address owner
    );

    /// @notice tokenId will not necessarily be the same as itemId
    struct MarketItem {
        uint256 itemId;
        uint256 tokenId;
        uint256 price;
        address tokenAddress;
        address payable seller;
        address payable owner;
        bool sold;
        bool isERC1155; // is this an erc1155Tradable or erc721Tradable nft?
    }

    mapping(uint256 => MarketItem) private idToMarketItem;

    /**
     * @notice create and list a market item
     * @param tokenAddress address of ERC721Tradable contract
     * @param tokenId id of token (@dev NOT item id)
     * @param price token listing price
     */
    function createMarketItem(
        address tokenAddress,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Item must have a valid listing price");

        // increment number of items listed
        _item721Ids.increment();
        uint256 itemId = _item721Ids.current();

        // add new market item to {id => item} mapping.
        idToMarketItem[itemId] = MarketItem(
            itemId,
            tokenId,
            price,
            tokenAddress,
            payable(msg.sender),
            payable(address(0)),
            false,
            false
        );

        // transfer token from user to this address (market)
        IERC721(tokenAddress).transferFrom(msg.sender, address(this), tokenId);
        emit MarketItemCreated(
            itemId,
            price,
            tokenId,
            tokenAddress,
            msg.sender,
            address(0)
        );
    }

    /**
     * @notice create and list a market item
     * @param tokenAddress address of ERC1155Tradable contract
     * @param tokenId id of ERC1155Tradable (@dev NOT item id)
     * @param price token listing price
     */
    function createMarketItemERC1155(
        address tokenAddress,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Item must have a valid listing price");

        // increment number of items listed
        _item1155Ids.increment();
        uint256 itemId = _item1155Ids.current();

        // add new market item to {id => item} mapping.
        idToMarketItem[itemId] = MarketItem(
            itemId,
            tokenId,
            price,
            tokenAddress,
            payable(msg.sender),
            payable(address(0)),
            false,
            true
        );

        // transfer token from user to this address (market)
        IERC1155(tokenAddress).safeTransferFrom(msg.sender, address(this), tokenId, 0, "");
        emit MarketItemCreated(
            itemId,
            price,
            tokenId,
            tokenAddress,
            msg.sender,
            address(0)
        );
    }

    /**
     * @notice buy market item and transfer ownership
     * @param tokenAddress address of ERC721Tradable contract
     * @param itemId id of token (@dev NOT token id)
     */
    function buyMarketItem(address tokenAddress, uint256 itemId)
        public
        payable
        nonReentrant
    {
        // fetch price and tokenId of token to be sold
        uint256 price = idToMarketItem[itemId].price;
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        require(msg.value == price, "insufficient funds for transaction");

        // transfer selling price to current token owner (i.e. pay for asset)
        idToMarketItem[itemId].seller.transfer(msg.value);

        // transfer ownership to buyer (i.e. msg.sender)
        IERC721(tokenAddress).transferFrom(address(this), msg.sender, tokenId);

        // update market item state
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].sold = true;

        _items721Sold.increment();
    }

    /**
     * @notice buy market item and transfer ownership
     * @param tokenAddress address of ERC1155Tradable contract
     * @param itemId id of token (@dev NOT token id)
     */
    function buyMarketItemERC1155(address tokenAddress, uint256 itemId)
        public
        payable
        nonReentrant
    {
        // fetch price and tokenId of token to be sold
        uint256 price = idToMarketItem[itemId].price;
        uint256 tokenId = idToMarketItem[itemId].tokenId;
        require(msg.value == price, "insufficient funds for transaction");

        // transfer selling price to current token owner (i.e. pay for asset)
        idToMarketItem[itemId].seller.transfer(msg.value);

        // transfer token from user to this address (market)
        IERC1155(tokenAddress).safeTransferFrom(address(this), msg.sender, tokenId, 0, "");

        // update market item state
        idToMarketItem[itemId].owner = payable(msg.sender);
        idToMarketItem[itemId].sold = true;

        _items1155Sold.increment();
    }

    /**
     * @param marketItemId item id
     * @return market item
     */
    function getMarketItemByItemId(uint256 marketItemId)
        public
        view
        returns (MarketItem memory)
    {
        return idToMarketItem[marketItemId];
    }

    /**
     * @return all market items which have not been sold
     * @notice items where owner has been set to address(0) have not been sold
     */
    function getAllUnsoldMarketItems() 
        public 
        view 
        returns (MarketItem[] memory) 
    {
        uint256 itemCount = _item721Ids.current();
        uint256 unsoldItemCount = itemCount - _items721Sold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            // if item owner is not set (i.e. has not been sold)
            /// @notice itemId will never be 0 due to how counter is used
            if (idToMarketItem[i + 1].owner == address(0)) {
                uint256 currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    /**
     * @return all market items which have not been sold
     * @notice items where owner has been set to address(0) have not been sold
     */
    function getAllUnsoldMarketItemsERC1155() 
        public 
        view 
        returns (MarketItem[] memory) 
    {
        uint256 itemCount = _item1155Ids.current();
        uint256 unsoldItemCount = itemCount - _items1155Sold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            // if item owner is not set (i.e. has not been sold)
            /// @notice itemId will never be 0 due to how counter is used
            if (idToMarketItem[i + 1].owner == address(0)) {
                uint256 currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    /**
     * @notice fetch market items that are owned by the caller
     * @return market items belonging to the caller
     */
    function getMarketItemsOwnedByCaller() 
        public 
        view 
        returns (MarketItem[] memory) 
    {
        uint256 totalItemCount = _item721Ids.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            /// @notice itemId will never be 0 due to how counter is used
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    /**
     * @notice fetch market items that are owned by the caller
     * @return market items belonging to the caller
     */
    function getMarketItemsOwnedByCallerERC1155() 
        public 
        view 
        returns (MarketItem[] memory) 
    {
        uint256 totalItemCount = _item1155Ids.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            /// @notice itemId will never be 0 due to how counter is used
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    /**
     * @notice fetch market items that were created by the caller
     * @return market items created by the caller
     */
    function getMarketItemsCreatedByCaller() 
        public 
        view 
        returns (MarketItem[] memory) 
    {
        uint256 totalItemCount = _item721Ids.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            /// @notice itemId will never be 0 due to how counter is used
            if (idToMarketItem[i + 1].seller == msg.sender) {
                uint256 currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    /**
     * @notice fetch market items that were created by the caller
     * @return market items created by the caller
     */
    function getMarketItemsCreatedByCallerERC1155() 
        public 
        view 
        returns (MarketItem[] memory) 
    {
        uint256 totalItemCount = _item1155Ids.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            /// @notice itemId will never be 0 due to how counter is used
            if (idToMarketItem[i + 1].seller == msg.sender) {
                uint256 currentId = idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }
}