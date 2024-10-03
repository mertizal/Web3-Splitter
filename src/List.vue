<script setup lang="ts">
import ListAllSplitter from "./components/ListAllSplitter.vue";
</script>
<template>
<div class="flex flex-col md:flex-row items-center justify-between page-h-full">
    <div class="w-full md:w-3/3 text-center md:text-left mb-8 md:mb-0">
      <ListAllSplitter />
    </div>

    <div class="w-full md:w-1/4 flex justify-center md:justify-end">
            <img src="./assets/blue-creature.png" alt="Cube" class="hover:scale-105 transition-transform duration-300 animate-creature">
    </div>
  </div>
</template>
