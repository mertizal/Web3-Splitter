import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { createWebHistory, createRouter } from 'vue-router'

import HomeView from './Home.vue'
import CreateView from './Create.vue'
import ActionView from './Action.vue'
import ListView from './List.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/create', component: CreateView },
  { path: '/action', component: ActionView },
  { path: '/list', component: ListView },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

import { VueClipboard } from '@soerenmartius/vue3-clipboard'

import SolanaWallets from "solana-wallets-vue";

import "solana-wallets-vue/styles.css";


import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

const walletOptions = {
  wallets: [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ],
  autoConnect: true,
};

createApp(App).use(SolanaWallets, walletOptions).use(VueClipboard).use(router).mount("#app");
