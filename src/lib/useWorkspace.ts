import { ComputedRef, computed } from "vue";
import { useAnchorWallet } from "solana-wallets-vue";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet, web3 } from "@project-serum/anchor";

import { IDL } from "./idl.js";
import { Buffer } from 'buffer';

const preflightCommitment = "processed";
const commitment = "confirmed";

let workspace: {
    formatThePubkey: (pubkey: PublicKey) => string;
    handlePDA: (name:string,wallet:Wallet,token:PublicKey) => Promise<PublicKey>;
    findAssociatedTokenAddress: (walletAddress:PublicKey, tokenMintAddress:PublicKey) => PublicKey;
    wallet: any;
    connection: Connection;
    provider: ComputedRef<any>;
    program: ComputedRef<any>;
    TOKEN_PROGRAM_ID: PublicKey;
    SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey;
} | null = null;
export const useWorkspace = () => workspace;

export const initWorkspace = () => {
    const programID = new PublicKey(
        "HmBSZhjCRMoUEWTtrfUVBMov3AWEdAe8XYZdywgNCTiq"
    );
    const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new web3.PublicKey(
        "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
      );
      
      const TOKEN_PROGRAM_ID = new web3.PublicKey(
        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
      );
    const wallet = useAnchorWallet();
    const connection = new Connection(clusterApiUrl("devnet"), commitment);
    const provider = computed(
        () =>
            new AnchorProvider(connection, wallet.value, {
                preflightCommitment,
                commitment,
            })
    );
    const program = computed(() => new Program(IDL, programID, provider.value));
    const handlePDA = async (name:string,wallet:Wallet,token:PublicKey) => {
        const [vault, bump] =
            await PublicKey.findProgramAddressSync(
                [
                    Buffer.from("vault"),
                    Buffer.from(name),
                    wallet.publicKey.toBytes(),
                    token.toBytes(),
                ],
                programID
            );
        return vault;
    };
    const formatThePubkey = (pubkey:PublicKey) => {
        const pubkeyStr = pubkey.toString();
        const pubkeyStrLength = pubkeyStr.length;
        const pubkeyStrFirst = pubkeyStr.slice(0, 5);
        const pubkeyStrLast = pubkeyStr.slice(pubkeyStrLength - 5, pubkeyStrLength);
        return `${pubkeyStrFirst}...${pubkeyStrLast}`;
    };
    function findAssociatedTokenAddress(walletAddress:PublicKey, tokenMintAddress:PublicKey) {
        return web3.PublicKey.findProgramAddressSync(
          [
            walletAddress.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            tokenMintAddress.toBuffer(),
          ],
          SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
        )[0];
      }

    workspace = {
        findAssociatedTokenAddress,
        formatThePubkey,
        handlePDA,
        wallet,
        connection,
        provider,
        program,
        TOKEN_PROGRAM_ID,
        SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    };
};


