import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import * as token from "@solana/spl-token";
import { BankrunProvider } from "anchor-bankrun";

const { PublicKey, Keypair } = anchor.web3;

import { assert } from "chai";

import {
  startAnchor,
  Clock,
  BanksClient,
  ProgramTestContext,
} from "solana-bankrun";
const AUTOCRAT_PROGRAM_ID = new PublicKey(
  "meta3cxKzFBmWYgCVozmvCQAS3y9b3fGxrG9HkHL7Wi"
);
const AUTOCRAT_MIGRATOR_PROGRAM_ID = new PublicKey(
  "8C4WEdr54tBPdtmeTPUBuZX5bgUMZw4XdvpNoNaQ6NwR"
);
import { AutocratV0 } from "../target/types/autocrat_v0";
const AutocratIDL: AutocratV0 = require("../target/idl/autocrat_v0.json");

import { expectError } from "./utils/utils";

import { AutocratMigrator } from "../target/types/autocrat_migrator";

const AutocratMigratorIDL: AutocratMigrator = require("../target/idl/autocrat_migrator.json");

export type PublicKey = anchor.web3.PublicKey;
export type Signer = anchor.web3.Signer;
export type Keypair = anchor.web3.Keypair;

import {
  createMint,
  createAccount,
  createAssociatedTokenAccount,
  mintToOverride,
  getMint,
  getAccount,
  mintTo,
} from "spl-token-bankrun";

describe("autocrat_migrator", async function () {
  let provider,
    connection,
    migrator,
    payer,
    context,
    banksClient,
    META,
    USDC,
    autocrat;

  before(async function () {
    context = await startAnchor("./", [], []);
    banksClient = context.banksClient;
    provider = new BankrunProvider(context);
    anchor.setProvider(provider);

    migrator = new anchor.Program<AutocratMigrator>(
      AutocratMigratorIDL,
      AUTOCRAT_MIGRATOR_PROGRAM_ID,
      provider
    );

    autocrat = new anchor.Program<AutocratV0>(
      AutocratIDL,
      AUTOCRAT_PROGRAM_ID,
      provider
    );

    payer = migrator.provider.wallet.payer;

    META = await createMint(
      banksClient,
      payer,
      payer.publicKey,
      payer.publicKey,
      9
    );

    USDC = await createMint(
      banksClient,
      payer,
      payer.publicKey,
      payer.publicKey,
      6
    );
  });

  describe("#multi_transfer", async function () {
    it("does transfer", async function () {
      let receiver = Keypair.generate();

      let from0 = await createAccount(
        banksClient,
        payer,
        META,
        payer.publicKey
      );
      let to0 = await createAccount(
        banksClient,
        payer,
        META,
        receiver.publicKey
      );

      let from1 = await createAccount(
        banksClient,
        payer,
        USDC,
        payer.publicKey
      );
      let to1 = await createAccount(
        banksClient,
        payer,
        USDC,
        receiver.publicKey
      );

      await mintTo(banksClient, payer, META, from0, payer, 1_000_000);
      await mintTo(banksClient, payer, USDC, from1, payer, 10_000);
      console.log(await getAccount(banksClient, from0));

      let tx = await migrator.methods
        .multiTransfer2()
        .accounts({
          authority: payer.publicKey,
          lamportReceiver: receiver.publicKey,
          from0,
          to0,
          from1,
          to1,
        })
        .rpc();

      console.log(await getAccount(banksClient, from0));
    });
  });
});
