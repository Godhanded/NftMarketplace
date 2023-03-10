import { Address, BigInt } from "@graphprotocol/graph-ts"
import {
  ItemBought as ItemBoughtEvent,
  ItemCancelled as ItemCancelledEvent,
  ItemListed as ItemListedEvent
} from "../generated/NftMarketplace/NftMarketplace"
import { ItemBought, ItemCancelled, ItemListed,ActiveItem } from "../generated/schema"

export function handleItemBought(event: ItemBoughtEvent): void {
  let itemBought=ItemBought.load(getIdFromEventParams(event.params.tokenId,event.params.nftAddress))
  let activeItem= ActiveItem.load(getIdFromEventParams(event.params.tokenId,event.params.nftAddress))
  if(itemBought==null){
  itemBought = new ItemBought(
    getIdFromEventParams(event.params.tokenId,event.params.nftAddress)
  )
}
  itemBought.buyer = event.params.buyer
  itemBought.nftAddress = event.params.nftAddress
  itemBought.tokenId = event.params.tokenId
  itemBought.price = event.params.price
  activeItem!.buyer=event.params.buyer

  itemBought.transactionHash = event.transaction.hash

  itemBought.save()
  activeItem!.save()
}

export function handleItemCancelled(event: ItemCancelledEvent): void {
  let itemCancelled= ItemCancelled.load(getIdFromEventParams(event.params.tokenId,event.params.nftAddress))
  let activeItem=ActiveItem.load(getIdFromEventParams(event.params.tokenId,event.params.nftAddress))
  if(itemCancelled==null){
  itemCancelled = new ItemCancelled(
    getIdFromEventParams(event.params.tokenId,event.params.nftAddress)
  )}
  itemCancelled.seller = event.params.seller
  itemCancelled.nftAddress = event.params.nftAddress
  itemCancelled.tokenId = event.params.tokenId
  activeItem!.buyer=Address.fromString("0x000000000000000000000000000000000000dEaD")

  itemCancelled.transactionHash = event.transaction.hash

  itemCancelled.save()
  activeItem!.save()
}

export function handleItemListed(event: ItemListedEvent): void {
  let itemListed= ItemListed.load(getIdFromEventParams(event.params.tokenId,event.params.mftAddress))
  let activeItem= ActiveItem.load(getIdFromEventParams(event.params.tokenId,event.params.mftAddress))
  if(itemListed==null){
  itemListed = new ItemListed(
    getIdFromEventParams(event.params.tokenId,event.params.mftAddress)
  )}
  if(activeItem==null){
    activeItem= new ActiveItem(
      getIdFromEventParams(event.params.tokenId,event.params.mftAddress)
    )
  }

  itemListed.seller = event.params.seller
  activeItem.seller = event.params.seller

  itemListed.mftAddress = event.params.mftAddress
  activeItem.nftAddress = event.params.mftAddress

  itemListed.tokenId = event.params.tokenId
  activeItem.tokenId = event.params.tokenId

  itemListed.price = event.params.price
  activeItem.price =event.params.price

  activeItem.buyer = Address.fromString("0x0000000000000000000000000000000000000000")
  itemListed.transactionHash = event.transaction.hash

  itemListed.save()
  activeItem.save()
}

function getIdFromEventParams(tokenId:BigInt,nftAddress:Address): string {
  return tokenId.toHexString()+nftAddress.toHexString()
}