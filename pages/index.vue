<script setup lang="ts">
import { type Post } from '~~/types/post';

// const { data: posts, error } = await useAPI().getAllPosts()

const posts = ref<Post[]>([]);

// Fetch posts on component mount
const fetchPosts = async () => {
    try {
        posts.value = await $fetch<Post[]>('/api/posts');
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

await fetchPosts()

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
    <div class="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
      <div v-for="post in posts" :key="post.id" class="card border p-5">
        <h3>{{ post.title }}</h3>
        <p>{{ post.content }}</p>
        <img :src="post.imageUrl" alt="Post Image" class="w-full h-48 object-cover" />
        <div class="flex justify-between mt-2">
          <!-- <button @click="openEditModal(post)" class="btn btn-warning">Edit</button>
          <button @click="deletePost(post.id)" class="btn btn-danger">Delete</button> -->
        </div>
      </div>
    </div>
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
