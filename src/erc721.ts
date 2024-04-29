import { Transfer as TransferEvent } from "../generated/ERC721/ERC721";

import { fetchAccount } from "./fetch/account";
import { fetchERC721, fetchERC721Token } from "./fetch/erc721";

export function handleTransfer(event: TransferEvent): void {
  let to = event.params.to;
  let tokenId = event.params.tokenId;
  let erc721 = fetchERC721(event.address);
  if (erc721 != null) {
    let nft = fetchERC721Token(erc721, tokenId);
    let toAccount = fetchAccount(to);

    nft.owner = toAccount.id;

    erc721.save();
    nft.save();
  }
}