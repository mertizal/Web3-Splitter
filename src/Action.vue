<script setup lang="ts">
import ClaimFromSplitter from "./components/ClaimFromSplitter.vue";
</script>
<template>
<div class="flex flex-col md:flex-row items-center justify-between page-h-full">
    <div class="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
      <ClaimFromSplitter />
    </div>

    <div class="w-full md:w-1/2 flex justify-center md:justify-end">
            <img src="./assets/orange-cube.png" alt="Cube" class="hover:scale-105 transition-transform duration-300 animate-cube">
    </div>
  </div>
</template>