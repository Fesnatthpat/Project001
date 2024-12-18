<script setup lang="ts">

import { type Post } from '~~/types/post'
import { ref, onMounted } from 'vue'

const posts = ref<Post[]>([])
const title = ref('')
const content = ref('')
const image = ref<File | null>(null)
const imagePreview = ref<string | null>(null)


const handleFileChange = (e: Event) => {
    const fileInput = e.target as HTMLInputElement
    if (fileInput.files && fileInput.files[ 0 ]) {
        const file = fileInput.files[ 0 ]

        const allowedTypes = [ 'image/jpeg', 'image/png', 'image/gif' ]
        if (!allowedTypes.includes(file.type)) {
            alert('Only image files are allowed!')
            image.value = null
            imagePreview.value = null
            return
        }

        // Optionally, check for file size limit (5MB here)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size exceeds 5MB limit!')
            image.value = null
            imagePreview.value = null
            return
        }

        image.value = file

        // Create a preview URL for the selected image
        const reader = new FileReader()
        reader.onload = () => {
            imagePreview.value = reader.result as string
        }
        reader.readAsDataURL(file)
    } else {
        image.value = null
        imagePreview.value = null
    }
}

const fetchPosts = async () => {
    posts.value = await $fetch<Post[]>('/api/posts')
}

const createPost = async () => {
    if (!title.value || !content.value || !image.value) {
        alert("Title, Content, and Image are required")
        return
    }

    const formData = new FormData()
    formData.append('title', title.value)
    formData.append('content', content.value)
    formData.append('image', image.value)

    try {
        await $fetch('/api/posts', {
            method: "POST",
            body: formData
        })
        await fetchPosts()
        alert('Post created successfully!')
    } catch (err) {
        console.error('Error creating post:', err)
        alert('Failed to create post')
    }

}

const deleted = async (postId: number) => {
    const confirmed = confirm('Are you sure you want to delete this post?')
    if (confirmed) {
        try {
            await $fetch(`/api/posts/${postId}`, { method: 'DELETE' }) // ใช้ endpoint ใหม่
            await fetchPosts()
        } catch (err) {
            console.error('Error deleting post:', err)
            alert('Failed to delete post')
        }
    }
}


onMounted(fetchPosts)

// const props = defineProps({
//     imageName: {
//         type: String,
//         required: false, // ตั้งค่าเป็น false หากไม่จำเป็นต้องมีค่า
//     },
// })

useHead({
    title: 'Service',
    meta: [
        { name: 'description', content: 'This is the service page' },
    ],
})
</script>

<template>
    <div class="container mx-auto mt-10 mb-10 flex flex-col justify-center items-center">
        <form @submit.prevent="createPost" class=" flex flex-col gap-y-3">
            <input v-model="title" type="text" placeholder="Name" class="input input-bordered w-full max-w-xs" />
            <input v-model="content" type="text" placeholder="Content" class="input input-bordered w-full max-w-xs" />
            <input type="file" @change="handleFileChange" class="file-input file-input-ghost w-full max-w-xs" />
            <button class="btn btn-success">Success</button>
        </form>
        <div v-if="imagePreview" class="mt-4 border w-[700px] h-full mx-auto">
            <img :src="imagePreview" alt="Image Preview" class="w-full h-full object-cover" />
        </div>
    </div>

    <div class="container mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 m-2 gap-2">
            <div v-for="post in posts" :key="post.id" class="border-2 bg-slate-600 rounded-md p-2">
                <div class="mx-auto overflow-hidden">
                    <h3 class="font-bold">{{ post.title }}</h3>
                    <p class="p-2">{{ post.content }}</p>
                    <p class="p-2">{{ post.createdAt }}</p>
                    <!-- ถ้าใช้ imagePreview สำหรับการแสดงผลรูปภาพที่อัพโหลด -->
                    <img :src="post.imageUrl" alt="Uploaded Image" />

                </div>
                <div class="flex justify-between mt-2">
                    <button class="bg-yellow-500 text-white px-2 py-1">Edit</button>
                    <button @click="deleted(post.id)" class="bg-red-500 text-white px-2 py-1">Delete</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>