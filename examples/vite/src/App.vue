<script setup lang="ts">
import { ref, watch } from "vue";
import BaseCmp from "./base.vue";
const msg = ref("Welcome to my beautiful page!");
watch(msg, (newVal) => {
  console.log(newVal);
});
const count = ref(0);
const animeTitle = ref("Magical Adventure");
const episodes = ref([
  { id: 1, title: "The Beginning", thumbnail: "/ep1.jpg" },
  { id: 2, title: "New Powers", thumbnail: "/ep2.jpg" },
  { id: 3, title: "The Challenge", thumbnail: "/ep3.jpg" },
]);

const newsItems = ref([
  {
    date: "2024-02-15",
    title: "Season 2 Announcement!",
    content: "We're excited to announce that season 2 is in production!"
  },
  {
    date: "2024-02-10",
    title: "Character Design Contest",
    content: "Join our contest to design a new character for the show!"
  }
]);

const characters = ref([
  {
    name: "Yuki",
    role: "Protagonist",
    description: "A cheerful student with magical powers",
    image: "/yuki.jpg"
  },
  {
    name: "Kaze",
    role: "Mentor",
    description: "A mysterious guide with ancient knowledge",
    image: "/kaze.jpg"
  },
  {
    name: "Mira",
    role: "Support",
    description: "Yuki's best friend and trusted ally",
    image: "/mira.jpg"
  }
]);

const currentSection = ref("home");

const changeSection = (section) => {
  currentSection.value = section;
};

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
  <div class="container">
    <header class="header">
      <h1 class="title">Beautiful Vue App</h1>
    </header>

    <main class="main-content">
      <BaseCmp />

      <div class="counter-section">
        <button class="btn" @click="count++">Count: {{ count }}</button>
      </div>

      <div class="message-section">
        <h2 class="subtitle">{{ msg }}</h2>
        <input v-model="msg" type="text" class="input" placeholder="Edit message..." />
      </div>
    </main>
  </div>
</template>

<style>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Arial', sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.title {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.counter-section,
.message-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.subtitle {
  color: #34495e;
  font-size: 1.5rem;
}

.input {
  padding: 0.8rem 1.2rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  max-width: 400px;
  transition: border-color 0.3s ease;
}

.input:focus {
  border-color: #3498db;
  outline: none;
}

.btn {
  background-color: #3498db;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #2980b9;
}
</style>
