import { NFTListedSuccess as NFTListedSuccessEvent } from "../generated/NFTMarketplace/NFTMarketplace"
import { NFTListedSuccess } from "../generated/schema"

export function handleNFTListedSuccess(event: NFTListedSuccessEvent): void {
  let entity = new NFTListedSuccess(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.nftContract = event.params.nftContract
  entity.tokenId = event.params.tokenId
  entity.owner = event.params.owner
  entity.seller = event.params.seller
  entity.price = event.params.price
  entity.currentlyListed = event.params.currentlyListed

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
