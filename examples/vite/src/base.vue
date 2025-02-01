<script setup lang="ts">
import { ref } from 'vue'

const message = ref('Hello Vue!')
const isVisible = ref(true)

const toggleMessage = () => {
  isVisible.value = !isVisible.value
}
</script>

<template>
  <div class="container">
    <h1>Basic Vue</h1>
    <button @click="toggleMessage">Toggle Message</button>
    <p v-if="isVisible">{{ message }}</p>
  </div>
</template>

<style>
.container {
  padding: 20px;
  text-align: center;
}

button {
  padding: 8px 16px;
  margin: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
