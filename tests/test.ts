// No imports needed: web3, anchor, pg and more are globally available

import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";

const seedForPDA = "vault";
async function handlePDA(vaultName, tokenPubkey) {
  const [vault, bump] = await anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(seedForPDA),
      Buffer.from(vaultName),
      pg.wallet.publicKey.toBytes(),
      tokenPubkey.toBytes(),
    ],
    pg.PROGRAM_ID
  );

  return vault;
}

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new web3.PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

const TOKEN_PROGRAM_ID = new web3.PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);
// kendi token
const MY_TOKEN = new web3.PublicKey(
  "C8XTo4rfs6APvcWUcQ2UsaMrYN8YXJhpJNKFMbz6TFoR"
);
function findAssociatedTokenAddress(walletAddress, tokenMintAddress) {
  return web3.PublicKey.findProgramAddressSync(
    [
      walletAddress.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      tokenMintAddress.toBuffer(),
    ],
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
  )[0];
}
describe("Test", () => {
  it("initialize", async () => {
    const name = "testVault6";
    const percentage = [new BN(40), new BN(60)]; 
    const accs = [
      pg.wallet.publicKey,
      new web3.PublicKey("3nYtiPWkBN6PErPuJpqoHmLTvMrCHr9wgypBKt5GHSBQ"),
    ];
    console.log("Constants v2");

    const vaultPDA = await handlePDA(name, MY_TOKEN);
    console.log("Vault PDA", vaultPDA.toString());

    const vaultTokenAccount = await findAssociatedTokenAddress(
      vaultPDA,
      MY_TOKEN
    );
    console.log("Vault Token");

    const txHash = await pg.program.methods
      .initialize(name, percentage , accs)
      .accounts({
        vault: vaultPDA,
        vaultTokenAccount: vaultTokenAccount,
        token: MY_TOKEN,
        authority: pg.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
      })
      .signers([pg.wallet.keypair])
      .rpc();
    console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);

    // Confirm transaction
    await pg.connection.confirmTransaction(txHash);

    // Fetch the created account
    const newAccount = await pg.program.account.vault.fetch(vaultPDA);

    console.log("On-chain data is:", newAccount.name.toString());
  });
  it("update test", async () => {
    const percentages = [new BN(30), new BN(70)];
    const name = "testVault6";

    const vaultPDA = await handlePDA(name, MY_TOKEN);

    const txHash = await pg.program.methods
      .update(percentages)
      .accounts({
        vault: vaultPDA,
        authority: pg.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([pg.wallet.keypair])
      .rpc();

    console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);
    await pg.connection.confirmTransaction(txHash);
  });

  it("Deposite", async () => {
    const name = "testVault6";
    const vaultPDA = await handlePDA(name, MY_TOKEN);
    console.log("Vault PDA", vaultPDA.toString());

    const vaultTokenAccount = await findAssociatedTokenAddress(
      vaultPDA,
      MY_TOKEN
    );
    console.log("Vault Token");

    const mytokenAccount = await getOrCreateAssociatedTokenAccount(
      pg.connection,
      pg.wallet.keypair,
      MY_TOKEN,
      pg.wallet.publicKey,
      false
    );
    console.log("My token account", mytokenAccount.address.toString());
    console.log("My token balance", mytokenAccount.amount.toString());

    const depositeLamport = new BN(80);
    const txHash = await pg.program.methods
      .deposite(depositeLamport)
      .accounts({
        vault: vaultPDA,
        vaultTokenAccount: vaultTokenAccount,
        token: MY_TOKEN,
        singerTokenAccount: mytokenAccount.address,
        authority: pg.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
      })
      .signers([pg.wallet.keypair])
      .rpc();
    console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);
  });

  it("claim", async () => {
    const name = "testVault6";
    const vaultPDA = await handlePDA(name, MY_TOKEN);
    console.log("Vault PDA", vaultPDA.toString());

    const vaultTokenAccount = await findAssociatedTokenAddress(
      vaultPDA,
      MY_TOKEN
    );
    console.log("Vault Token");

    const mytokenAccount = await findAssociatedTokenAddress(
      pg.wallet.publicKey,
      MY_TOKEN
    );

    const txHash = await pg.program.methods
      .claim()
      .accounts({
        vault: vaultPDA,
        vaultTokenAccount: vaultTokenAccount,
        token: MY_TOKEN,
        singerTokenAccount: mytokenAccount,
        claimer: pg.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
      })
      .signers([pg.wallet.keypair])
      .rpc();
    console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);
  });

  it("Delete test", async () => {
    const name = "testVault6";
    const vaultPDA = await handlePDA(name, MY_TOKEN);

    const txHash = await pg.program.methods
      .delete()
      .accounts({
        vault: vaultPDA,
        authority: pg.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([pg.wallet.keypair])
      .rpc();

    console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);
    await pg.connection.confirmTransaction(txHash);
  });
});