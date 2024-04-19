import { AccountMeta, PublicKey } from "@solana/web3.js";
import { utils } from "@coral-xyz/anchor";
import { numToBytes32LE, numToBytes64LE } from "./numbers";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import BN from 'bn.js';

export const getDaoAddr = (programId: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [utils.bytes.utf8.encode("WWCACOTMICMIBMHAFTTWYGHMB")],
    programId
  );
};

export const getDaoTreasuryAddr = (
  programId: PublicKey,
  dao: PublicKey
): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [dao.toBuffer()],
    programId
  );
};

export const getProposalAddr = (
  programId: PublicKey,
  proposalNumber: number
): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [utils.bytes.utf8.encode("proposal__"), numToBytes64LE(proposalNumber)],
    programId
  );
};

export const getProposalInstructionsAddr = (
  programId: PublicKey,
  proposal: PublicKey
): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [utils.bytes.utf8.encode("proposal_instructions"), proposal.toBuffer()],
    programId
  );
};

export const getProposalVaultAddr = (
  programId: PublicKey,
  proposal: PublicKey
): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [utils.bytes.utf8.encode("proposal_vault"), proposal.toBuffer()],
    programId
  );
};

export const getAmmAddr = (
  programId: PublicKey,
  baseMint: PublicKey,
  quoteMint: PublicKey,
  nonce: BN
): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode("amm__"),
      baseMint.toBuffer(),
      quoteMint.toBuffer(),
      nonce.toBuffer('le', 8)
    ],
    programId
  );
};


export const getAmmLpMintAddr = (
  programId: PublicKey,
  amm: PublicKey,
): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [
      utils.bytes.utf8.encode("amm_lp_mint"),
      amm.toBuffer(),
    ],
    programId
  );
};

export const getAmmAuthAddr = (programId: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [utils.bytes.utf8.encode("amm_auth")],
    programId
  );
};

export const getATA = (mint: PublicKey, owner: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
};
