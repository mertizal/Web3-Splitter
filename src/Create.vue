<script setup lang="ts">
import CreateSplitter from "./components/CreateSplitter.vue";
</script>
<template>
<div class="flex flex-col md:flex-row items-center justify-between page-h-full">
    <div class="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
      <CreateSplitter />
    </div>

    <div class="w-full md:w-1/2 flex justify-center md:justify-end">
        <div class="relative w-[350px] h-[310px]">
            <img src="./assets/pink-heart.png" alt="Heart" class="absolute top-0 right-0 w-64 h-64 hover:scale-105 transition-transform duration-300 animate-one">
            <img src="./assets/blue-plus.png" alt="Plus" class="absolute bottom-0 left-0 w-32 h-32 hover:scale-105 transition-transform duration-300 animate-two">
        </div>
    </div>
  </div>
</template>
