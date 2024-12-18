<script setup lang="ts">




useHead({
  title: 'Home',
  meta: [
    { name: 'description', content: 'This is the service page' },
  ],
})

</script>

<template>
  <div class="bg-hero flex justify-center items-center min-h-screen">
    <div class="w-96 h-auto m-5 text-center bg-black bg-opacity-50 p-6 rounded-lg flex flex-col justify-center gap-3">
      <h1 class="text-5xl text-white">บ้านมีสุข</h1>
      <p class="text-2xl text-white">ยินดีต้อนรับ</p>
      <div class="">
        <!-- <NuxtLink to="/service" class="btn-hero"></NuxtLimk> -->
        <NuxtLink to="/service" class="btn-hero">Go to Service</NuxtLink>

      </div>
    </div>
  </div>



  <!-- Box Show Post -->
  <div class="container mx-auto">

  </div>

  <!-- BoxGrid-1 -->
  <div class="container mx-auto mt-2 mb-20">
    <BoxgridGrids1 />
  </div>


</template>

<style scoped>
.btn-hero {
  @apply transition transform duration-300 ease-in-out hover:scale-110 btn shadow-md hover:border-none hover:bg-sky-300 hover:text-black
}


.bg-hero {
  background-image: url('@/assets/images/Hero001.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 500px;
}
</style>
