<template>
<div class="flex flex-col md:flex-row items-center justify-between page-h-full">
    <div class="w-full md:w-1/3 flex items-center justify-center">
        <RouterLink to="/create" class="flex flex-col items-center justify-center">
            <div class="relative w-[350px] h-[310px] mb-2">
                <img src="./assets/pink-heart.png" alt="Heart" class="absolute top-0 right-0 w-64 h-64 hover:scale-105 transition-transform duration-300 animate-heart">
                <img src="./assets/blue-plus.png" alt="Plus" class="absolute bottom-0 left-0 w-32 h-32 hover:scale-105 transition-transform duration-300 animate-plus">
            </div>
            <span class="text-6xl font-bold mt-4 text-neon type-4">Create</span>
        </RouterLink>
    </div>
    <div class="w-full md:w-1/3 flex items-center justify-center">
        <RouterLink to="/action" class="flex flex-col items-center justify-center">
            <div class="relative w-[350px] h-[310px] mb-2">
                <img src="./assets/orange-cube.png" alt="Cube" class="absolute transition-transform duration-300 animate-cube">
            </div>
            <span class="text-6xl font-bold mt-4 text-neon type-4">Actions</span>
        </RouterLink>
    </div>
    <div class="w-full md:w-1/3 flex items-center justify-center">
        <RouterLink to="/list" class="flex flex-col items-center justify-center">
            <div class="relative w-[350px] h-[310px] mb-2">
                <img src="./assets/blue-creature.png" alt="Creature" class="absolute transition-transform duration-300 animate-creature">
            </div>
            <span class="text-6xl font-bold mt-4 text-neon type-4">List</span>
        </RouterLink>
    </div>
  </div>
</template>