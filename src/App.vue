<script setup lang="ts">
import { WalletMultiButton } from "solana-wallets-vue";

import { initWorkspace } from "./lib/useWorkspace";

initWorkspace();
</script>

<template>
    <div class="bg-main-gradient">
        <div class="py-4 bg-navbar-gradient sticky top-0 z-50 shadow-lg">
            <div class="container mx-auto px-4">
                <header class="w-full flex justify-between items-center">
                    <RouterLink to="/">
                        <h1 class="logo-text text-neon type-9" data-text="Splitter Wallet">Splitter Wallet</h1>
                        <h1 class="text-white text-2xl md:text-3xl font-bold"></h1>
                    </RouterLink>
    
                    <div class="md:hidden relative">
                        <input type="checkbox" id="menu-toggle" class="hidden peer">
    
                        <label for="menu-toggle" class="block cursor-pointer z-50">
                            <svg class="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                        </label>
    
                        <div class="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40 hidden peer-checked:block"></div>
                            <nav class="fixed top-0 left-0 w-[70%] h-full bg-gray-900 transform -translate-x-full transition-transform duration-500 ease-in-out peer-checked:translate-x-0 z-50">
                                <div class="flex flex-col items-start p-8 space-y-6">
                                    <label for="menu-toggle" class="text-white text-3xl self-end cursor-pointer">
                                        &times;
                                    </label>
                                    <RouterLink to="/" class="text-white text-xl hover:text-gray-300" active-class="text-gray-100">Home</RouterLink>
                                    <RouterLink to="/create" class="text-white text-xl hover:text-gray-300" active-class="text-gray-100">Create</RouterLink>
                                    <RouterLink to="/action" class="text-white text-xl hover:text-gray-300" active-class="text-gray-100">Actions</RouterLink>
                                    <RouterLink to="/list" class="text-white text-xl hover:text-gray-300" active-class="text-gray-100">List</RouterLink>
                                </div>
                            </nav>
                        </div>
                        <nav class="hidden md:flex">
                            <RouterLink to="/" class="border-b-2 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6 text-neon type-5" active-class="text-gray-100 border-blue-500">Home</RouterLink>
                            <RouterLink to="/create" class="border-b-2 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6 text-neon type-5" active-class="text-gray-100 border-blue-500">Create</RouterLink>
                            <RouterLink to="/action" class="border-b-2 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6 text-neon type-5" active-class="text-gray-100 border-blue-500">Actions</RouterLink>
                            <RouterLink to="/list" class="border-b-2 border-transparent hover:text-gray-800 dark:hover:text-gray-200 hover:border-blue-500 mx-1.5 sm:mx-6 text-neon type-5" active-class="text-gray-100 border-blue-500">List</RouterLink>
                        </nav>
                        <div class="neon-wallet-btn">
                            <wallet-multi-button></wallet-multi-button>
                        </div>
                </header>
            </div>
        </div>
    
        <div class="container mx-auto px-4">
            <RouterView />
        </div>
        <div class="bg-main-glass"></div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Bad+Script|Gruppo|Kumar+One+Outline|League+Script|Londrina+Outline|Monoton|Sriracha|Yellowtail&amp;text=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789?+');
</style>