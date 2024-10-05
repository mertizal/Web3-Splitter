<script setup>
import { useWorkspace, initWorkspace } from "../lib/useWorkspace";
import * as anchor from "@coral-xyz/anchor";
import { reactive, ref, onMounted } from "vue";
import { SystemProgram } from "@solana/web3.js";

const { program, wallet, handlePDA,findAssociatedTokenAddress,TOKEN_PROGRAM_ID,SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID } = useWorkspace();

onMounted(async () => {
    initWorkspace();
});

const form = reactive({
    address: "EgJVwJN5enK7h74cdAKFogEYNCH1va9eWPzLZSZRNutH",
    percent: 100,
});

const splitter = reactive({
    name: "Super Takım",
    addresses: [],
    percentage: [],
});

const addresses = reactive([]);
const sumAllPercent = ref(100);
const token = ref(null);

async function createSplitter() {
    let { connection, wallet } = useWorkspace();
}
function addAdress() {
    let remain = addresses.reduce((a, b) => a + b.percent, 0);
    if (remain + form.percent > 100 || form.percent == 0) {
        return;
    }
    if (form.percent > sumAllPercent.value) {
        form.percent = sumAllPercent.value;
    }
    addresses.push({
        address: form.address,
        percent: form.percent,
    });
    remain = addresses.reduce((a, b) => a + b.percent, 0);

    form.address = "";
    form.percent = 100 - remain;
    sumAllPercent.value = 100 - remain;
}

function remove(index) {
    addresses.splice(index, 1);
    let remain = addresses.reduce((a, b) => a + b.percent, 0);
    form.percent = 100 - remain;
    sumAllPercent.value = 100 - remain;
}

async function deploySplitter() {
    const tokenAddress = new anchor.web3.PublicKey(token.value);
    const PDA = await handlePDA(splitter.name, wallet.value,tokenAddress);
    let address = [];
    let percent = [];
    for (let index = 0; index < addresses.length; index++) {
        address[index] = new anchor.web3.PublicKey(addresses[index].address);
        percent[index] = new anchor.BN(addresses[index].percent);
    }
    const vaultTokenAccount = await findAssociatedTokenAddress(
      PDA,
      tokenAddress
    );
    await program.value.methods
        .initialize(splitter.name, percent, address)
        .accounts({
            vault: PDA,
            vaultTokenAccount:vaultTokenAccount,
            token: tokenAddress,
            authority: wallet.value.publicKey,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
        })
        .rpc();
}
</script>
<template>
    <div class="card-body">
        <h2 class="card-title">Craete New Splitter</h2>
        <div class="form-control">
            <label class="label">
                <span class="label-text">Splitter Name</span>
            </label>
            <input
                type="text"
                v-model="splitter.name"
                placeholder="Splitter Name"
                class="input input-bordered"
            />
            <!-- decription of name-->
            <p class="text-muted text-sm">
                Don't forget to name of your splitter. Code is not record your PDA,
                and your PDA require splitter name
            </p>
        </div>
        <div class="form-control">
            <label class="label">
                <span class="label-text">Token address</span>
            </label>
            <input
                type="text"
                v-model="token"
                placeholder="Token address"
                class="input input-bordered"
            />
        </div>
        <div class="form-control w-full">
            <label class="label">
                <span class="label-text">Add Address</span>
            </label>

            <div class="input-group w-full">
                <span>New</span>
                <input
                    type="text"
                    v-model="form.address"
                    placeholder="Address"
                    class="input input-bordered w-1/3"
                />
                <input
                    type="number"
                    :max="sumAllPercent"
                    v-model="form.percent"
                    placeholder="%"
                    class="input input-bordered w-1/3"
                />
                <button class="btn btn-square w-1/4" @click="addAdress">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon icon-tabler icon-tabler-circle-plus"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="#ffffff"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                        <path d="M9 12l6 0" />
                        <path d="M12 9l0 6" />
                    </svg>
                </button>
            </div>
        </div>
        <div>
            <div
                class="alert alert-warning mt-1 p-2 justify-items-end"
                v-for="(item, index) in addresses"
            >
                <span>{{ item.address }} %{{ item.percent }}</span>
                <a class="btn btn-error btn-sm" @click="remove(index)">x</a>
            </div>
        </div>
        <div class="card-actions justify-end">
            <button class="btn btn-success" @click="deploySplitter">Create</button>
        </div>
    </div>
</template>
