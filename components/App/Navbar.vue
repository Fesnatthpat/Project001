<script setup lang="ts">
import { ref } from 'vue'

// สร้างตัวแปร state สำหรับเปิด/ปิดเมนู
const isMenuOpen = ref(false);

// ฟังก์ชันสลับสถานะเมนู
const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
    <nav class="bg-sky-500 p-3 sticky top-0 z-10">
        <div class="flex justify-between items-center mx-3">
            <!-- โลโก้ -->
            <div class="text-white shadow-md btn btn-sm md:btn-md text-xl md:text-3xl">
                <NuxtLink to="/">FeSHoMe</NuxtLink>
            </div>

            <!-- เมนูสำหรับ Desktop -->
            <ul class="hidden md:flex gap-3">
                <NuxtLink to="/">
                    <li class="menu-item">Home</li>
                </NuxtLink>
                <!-- <NuxtLink to="/contact">
                    <li class="menu-item">Contact</li>
                </NuxtLink>
                <NuxtLink to="/about">
                    <li class="menu-item">About Us</li>
                </NuxtLink> -->
                <NuxtLink to="/service">
                    <li class="menu-item">Service</li>
                </NuxtLink>
            </ul>

            <!-- ไอคอน Toggle สำหรับมือถือ -->
            <div @click="toggleMenu" class="btn btn-sm md:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
                </svg>
            </div>
        </div>

        <!-- เมนูสำหรับมือถือ -->
        <ul v-if="isMenuOpen" class="flex flex-col gap-2 mt-3 p-3 bg-white text-black shadow-lg rounded md:hidden">
            <NuxtLink to="/">
                <li class="menu-item-mobile">Home</li>
            </NuxtLink>
            <!-- <NuxtLink to="/contact">
                <li class="menu-item-mobile">Contact</li>
            </NuxtLink> -->
            <!-- <NuxtLink to="/about">
                <li class="menu-item-mobile">About Us</li>
            </NuxtLink> -->
            <NuxtLink to="/service">
                <li class="menu-item-mobile">Service</li>
            </NuxtLink>
        </ul>
    </nav>
</template>

<style scoped>
/* เมนูสไตล์ */
.menu-item {
    @apply hover:-translate-y-1 transition-transform duration-300 ease-in-out btn btn-sm shadow-md text-white hover:bg-sky-300 hover:text-black border-none;
}

.menu-item-mobile {
    @apply p-2 rounded hover:bg-sky-500 hover:text-white transition-colors duration-200;
}
</style>
