import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { NFTListedSuccess as NFTListedSuccessEvent } from "../generated/NFTMarketplace/NFTMarketplace"
import { NFTListed } from "../generated/schema"

import { fetchAccount } from "./fetch/account";
import { fetchERC721, fetchERC721Token } from "./fetch/erc721";

const ONE_INT = BigInt.fromI32(1);

export function handleNFTListed(event: NFTListedSuccessEvent): void {
  let currentlyListed = event.params.currentlyListed;
  let newSeller = event.params.seller;
  let price = event.params.price;

  let erc721 = fetchERC721(event.params.nftContract);
  if (erc721 != null) {
    let nft = fetchERC721Token(erc721, event.params.tokenId);

    let entity = NFTListed.load(nft.id);

    if(entity == null){
       entity = new NFTListed(nft.id)
       entity.nft = nft.id
       entity.seller = newSeller
       entity.price = price
       entity.currentlyListed = true

       let ercListed =  erc721.listed;
       erc721.listed = ercListed? ercListed.plus(ONE_INT) : ONE_INT;

       let account = fetchAccount(newSeller);
       let listed = account.listed;
       account.listed = listed? listed.plus(ONE_INT) : ONE_INT;
       account.save();
    }
    else {
        entity.nft = nft.id
        entity.price = price
        entity.currentlyListed = currentlyListed

        if(currentlyListed){ // currentlyListed=true (re-list)
            entity.seller = newSeller
            let listed = erc721.listed;
            erc721.listed = listed? listed.plus(ONE_INT) : ONE_INT;

            let account = fetchAccount(newSeller);
            let accListed = account.listed;
            account.listed = accListed? accListed.plus(ONE_INT) : ONE_INT;
            account.save();
        }
        else { // currentlyListed=false(sold)
            let listed = erc721.listed;
            erc721.listed = listed? listed.minus(ONE_INT): BigInt.zero();
            let sold = erc721.sold;
            let volume = erc721.volume;
            erc721.sold = sold? sold.plus(ONE_INT) : ONE_INT;
            erc721.volume = volume? volume.plus(price) : price;

            let account = fetchAccount(Address.fromBytes(entity.seller));
            let accListed = account.listed;
            account.listed = accListed? accListed.minus(ONE_INT) : BigInt.zero();
            let accSold = account.sold;
            let accVolume = account.volume;
            account.sold = accSold? accSold.plus(ONE_INT) : ONE_INT;
            account.volume = accVolume? accVolume.plus(price) : price;
            account.save();

            entity.seller = newSeller;

        }
    }

      erc721.save();
      entity.save();
    }














}
