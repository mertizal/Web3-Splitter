import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Splitterprogram } from "../target/types/splitterprogram";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { BN } from "bn.js";

describe("splitterprogram", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Splitterprogram as Program<Splitterprogram>;
  const provider = anchor.getProvider();

  // Constants
  const MY_TOKEN = new PublicKey("7aj2GLnYuXJm1F6qSPjTZFDu1s51SpUoNKtkCAqwpSik");
  const seedForPDA = "vault";
  const name = "Super Hackathon Prize";

  // Helper functions
  async function handlePDA(vaultName: string, tokenPubkey: PublicKey) {
    const [vault] = await PublicKey.findProgramAddressSync(
      [
        Buffer.from(seedForPDA),
        Buffer.from(vaultName),
        provider.publicKey.toBuffer(),
        tokenPubkey.toBuffer(),
      ],
      program.programId
    );
    return vault;
  }

  function findAssociatedTokenAddress(walletAddress: PublicKey, tokenMintAddress: PublicKey) {
    return PublicKey.findProgramAddressSync(
      [
        walletAddress.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintAddress.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )[0];
  }

  it("initialize", async () => {
    
    const percentage = [new BN(40), new BN(60)];
    const accs = [
      provider.publicKey,
      new PublicKey("3nYtiPWkBN6PErPuJpqoHmLTvMrCHr9wgypBKt5GHSBQ"),
    ];

    const vaultPDA = await handlePDA(name, MY_TOKEN);
    const vaultTokenAccount = await findAssociatedTokenAddress(vaultPDA, MY_TOKEN);

    const tx = await program.methods
      .initialize(name, percentage, accs)
      .accounts({
        vault: vaultPDA,
        vaultTokenAccount: vaultTokenAccount,
        token: MY_TOKEN,
        authority: provider.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .rpc();

    console.log(`Use 'solana confirm -v ${tx}' to see the logs`);

    // Fetch the created account
    const newAccount = await program.account.vault.fetch(vaultPDA);
    console.log("On-chain data is:", newAccount.name.toString());
  });

  it("update test", async () => {
    const percentages = [new BN(30), new BN(70)];
    const vaultPDA = await handlePDA(name, MY_TOKEN);

    const tx = await program.methods
      .update(percentages)
      .accounts({
        vault: vaultPDA,
        authority: provider.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log(`Use 'solana confirm -v ${tx}' to see the logs`);
  });

  it("Deposit", async () => {
    const vaultPDA = await handlePDA(name, MY_TOKEN);
    const vaultTokenAccount = await findAssociatedTokenAddress(vaultPDA, MY_TOKEN);
    const mytokenAccount = await findAssociatedTokenAddress( provider.publicKey, MY_TOKEN);
    const depositAmount = new BN(80);
    const tx = await program.methods
      .deposite(depositAmount)
      .accounts({
        vault: vaultPDA,
        vaultTokenAccount: vaultTokenAccount,
        token: MY_TOKEN,
        singerTokenAccount: mytokenAccount,
        authority: provider.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .rpc();

    console.log(`Use 'solana confirm -v ${tx}' to see the logs`);
  });

  it("claim", async () => {
    const vaultPDA = await handlePDA(name, MY_TOKEN);
    const vaultTokenAccount = await findAssociatedTokenAddress(vaultPDA, MY_TOKEN);
    const mytokenAccount = await findAssociatedTokenAddress(provider.publicKey, MY_TOKEN);

    const tx = await program.methods
      .claim()
      .accounts({
        vault: vaultPDA,
        vaultTokenAccount: vaultTokenAccount,
        token: MY_TOKEN,
        singerTokenAccount: mytokenAccount,
        claimer: provider.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .rpc();

    console.log(`Use 'solana confirm -v ${tx}' to see the logs`);
  });

  it("Delete test", async () => {
    const vaultPDA = await handlePDA(name, MY_TOKEN);

    const tx = await program.methods
      .delete()
      .accounts({
        vault: vaultPDA,
        authority: provider.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log(`Use 'solana confirm -v ${tx}' to see the logs`);
  });
});