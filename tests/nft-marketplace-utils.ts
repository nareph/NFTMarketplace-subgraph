import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { NFTListedSuccess } from "../generated/NFTMarketplace/NFTMarketplace"

export function createNFTListedSuccessEvent(
  nftContract: Address,
  tokenId: BigInt,
  owner: Address,
  seller: Address,
  price: BigInt,
  currentlyListed: boolean
): NFTListedSuccess {
  let nftListedSuccessEvent = changetype<NFTListedSuccess>(newMockEvent())

  nftListedSuccessEvent.parameters = new Array()

  nftListedSuccessEvent.parameters.push(
    new ethereum.EventParam(
      "nftContract",
      ethereum.Value.fromAddress(nftContract)
    )
  )
  nftListedSuccessEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  nftListedSuccessEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  nftListedSuccessEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  nftListedSuccessEvent.parameters.push(
    new ethereum.EventParam("price", ethereum.Value.fromUnsignedBigInt(price))
  )
  nftListedSuccessEvent.parameters.push(
    new ethereum.EventParam(
      "currentlyListed",
      ethereum.Value.fromBoolean(currentlyListed)
    )
  )

  return nftListedSuccessEvent
}
