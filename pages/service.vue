<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { type Post } from '~~/types/post';

// State variables
const posts = ref<Post[]>([]);
const title = ref('');
const content = ref('');
const image = ref<File | null>(null);
const imagePreview = ref<string | null>(null);
const isModalOpen = ref(false);

// Edit form state
const editForm = ref({
    id: 0,
    title: '',
    content: '',
    imageUrl: '',
});

// Fetch posts on component mount
const fetchPosts = async () => {
    try {
        posts.value = await $fetch<Post[]>('/api/posts');
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
};

// Handle file input change
const handleFileChange = (e: Event) => {
    const fileInput = e.target as HTMLInputElement;
    if (fileInput.files?.[ 0 ]) {
        const file = fileInput.files[ 0 ];
        const allowedTypes = [ 'image/jpeg', 'image/png', 'image/gif' ];

        if (!allowedTypes.includes(file.type)) {
            alert('Only image files (JPEG, PNG, GIF) are allowed.');
            resetImage();
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert('File size exceeds the 5MB limit.');
            resetImage();
            return;
        }

        image.value = file;
        const reader = new FileReader();
        reader.onload = () => {
            imagePreview.value = reader.result as string;
        };
        reader.readAsDataURL(file);
    } else {
        resetImage();
    }
};

const resetImage = () => {
    image.value = null;
    imagePreview.value = null;
};

// Create a new post
const createPost = async () => {
    if (!title.value || !content.value || !image.value) {
        alert('Title, Content, and Image are required.');
        return;
    }

    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('content', content.value);
    formData.append('image', image.value);

    try {
        await $fetch('/api/posts', {
            method: 'POST',
            body: formData,
        });
        await fetchPosts();
        resetForm();
        alert('Post created successfully!');
    } catch (error) {
        console.error('Error creating post:', error);
        alert('Failed to create post.');
    }
};

const resetForm = () => {
    title.value = '';
    content.value = '';
    resetImage();
};

// Update an existing post
const updatePost = async () => {
    const { id, title: newTitle, content: newContent } = editForm.value;
    if (!id || !newTitle || !newContent) {
        alert('All fields are required for updating.');
        return;
    }

    const formData = new FormData();
    formData.append('title', newTitle);
    formData.append('content', newContent);

    if (image.value) {
        formData.append('image', image.value);
    }

    try {
        await $fetch(`/api/posts/${id}`, {
            method: 'PUT',
            body: formData,
        });
        await fetchPosts();
        closeModal();
        alert('Post updated successfully!');
    } catch (error) {
        console.error('Error updating post:', error);
        alert('Failed to update post.');
    }
};

// Delete a post
const deletePost = async (postId: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
        try {
            await $fetch(`/api/posts/${postId}`, { method: 'DELETE' });
            await fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post.');
        }
    }
};

// Modal handling
const openEditModal = (post: Post) => {
    editForm.value = {
        id: post.id,
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl || '',
    };
    imagePreview.value = post.imageUrl || ''; // Set the preview image for editing
    isModalOpen.value = true; // Open the modal
};

const closeModal = () => {
    isModalOpen.value = false; // Close the modal
    resetImage();
};

onMounted(fetchPosts);

useHead({
    title: 'SERVICE',
    meta: [
        { name: 'description', content: 'This is the service page' },
    ],
})
</script>

<template>
    <div class="container mx-auto mt-10 mb-10 flex flex-col items-center">
        <form @submit.prevent="createPost" class="flex flex-col gap-y-3">
            <input v-model="title" type="text" placeholder="Title" class="input input-bordered w-full max-w-xs" />
            <textarea v-model="content" placeholder="Content"
                class="textarea textarea-bordered w-full max-w-xs"></textarea>
            <input type="file" @change="handleFileChange" class="file-input file-input-bordered w-full max-w-xs" />
            <button class="btn btn-success">Create Post</button>
        </form>

        <div v-if="imagePreview" class="mt-4 w-64 h-64">
            <img :src="imagePreview" alt="Image Preview" class="w-full h-full object-cover" />
        </div>
    </div>

    <div v-if="isModalOpen" class="modal modal-open">
        <div class="modal-box">
            <h3 class="font-bold">Edit Post</h3>
            <form @submit.prevent="updatePost" class="flex flex-col gap-y-3">
                <input v-model="editForm.title" type="text" placeholder="Title" class="input input-bordered" />
                <textarea v-model="editForm.content" placeholder="Content"
                    class="textarea textarea-bordered"></textarea>
                <input type="file" @change="handleFileChange" class="file-input file-input-bordered" />
                <div v-if="imagePreview || editForm.imageUrl" class="mt-4">
                    <img :src="imagePreview || editForm.imageUrl" alt="Preview" class="w-full h-48 object-cover" />
                </div>
                <div class="modal-action">
                    <button type="button" @click="closeModal" class="btn">Cancel</button>
                    <button type="submit" class="btn btn-success">Save</button>
                </div>
            </form>
        </div>
    </div>

    <div class="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
        <div v-for="post in posts" :key="post.id" class="card border p-5">
            <h3>{{ post.title }}</h3>
            <p>{{ post.content }}</p>
            
            <img :src="post.imageUrl" alt="Post Image" class="w-full h-48 object-cover" />
            <div class="flex justify-between mt-2">
                <button @click="openEditModal(post)" class="btn btn-warning">Edit</button>
                <button @click="deletePost(post.id)" class="btn btn-danger">Delete</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Add your custom styles here */
</style>
