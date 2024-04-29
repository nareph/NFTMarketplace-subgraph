import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts";

import { Account, Collection, NFT } from "../../generated/schema";

import { fetchAccount } from "./account";

import { supportsInterface } from "./erc165";
import { ERC721 } from "./../../generated/ERC721/ERC721";

export function fetchERC721(address: Address): Collection | null {
  let erc721 = ERC721.bind(address);

  // Try load entry
  let contract = Collection.load(address);
  if (contract != null) {
    return contract;
  }

  // Detect using ERC165
  let detectionId = address.concat(Bytes.fromHexString("80ac58cd")); // Address + ERC721
  let detectionAccount = Account.load(detectionId);

  // On missing cache
  if (detectionAccount === null) {
    detectionAccount = new Account(detectionId);
    let introspection_01ffc9a7 = supportsInterface(erc721, "01ffc9a7"); // ERC165
    let introspection_80ac58cd = supportsInterface(erc721, "80ac58cd"); // ERC721
    let introspection_00000000 = supportsInterface(erc721, "00000000", false);
    let isERC721 =
      introspection_01ffc9a7 &&
      introspection_80ac58cd &&
      introspection_00000000;
    detectionAccount.asERC721 = address; //isERC721 ? address : null;
    detectionAccount.save();
  }

  // If an ERC721, build entry
  if (detectionAccount.asERC721) {
    contract = new Collection(address);
    let try_name = erc721.try_name();
    contract.name = try_name.reverted ? "" : try_name.value;
    let try_symbol = erc721.try_symbol();
    contract.symbol = try_symbol.reverted ? "" : try_symbol.value;
    let try_url = erc721.try_tokenURI(BigInt.fromI32(1));
    contract.imageUrl = try_url.reverted ? "" : try_url.value;
    contract.supportsMetadata = supportsInterface(erc721, "5b5e139f"); // ERC721Metadata
    contract.asAccount = address;
    contract.save();

    let account = fetchAccount(address);
    account.asERC721 = address;
    account.save();
  }

  return contract;
}

export function fetchERC721Token(
  contract: Collection,
  identifier: BigInt
): NFT {
  let id = contract.id
    .toHex()
    .concat("/")
    .concat(identifier.toHex());
  let token = NFT.load(id);

  if (token === null) {
    token = new NFT(id);
    token.collection = contract.id;
    token.tokenId = identifier;
    token.tokenUri = "";

   // if (contract.supportsMetadata) {
      let erc721 = ERC721.bind(Address.fromBytes(contract.id));
      let try_tokenURI = erc721.try_tokenURI(identifier);
      token.tokenUri = try_tokenURI.reverted ? "" : try_tokenURI.value;
  //  }

  }

  return token as NFT;
}
