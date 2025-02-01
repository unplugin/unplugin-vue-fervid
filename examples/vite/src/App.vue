<script setup lang="ts">
import { ref, watch } from "vue";
import BaseCmp from "./base.vue";
const msg = ref("12312312312312313");
watch(msg, (newVal) => {
  console.log(newVal);
});
const count = ref(0);
</script>

<template>
  <div>
    <BaseCmp />
    <button @click="count++">count++</button>
    {{ count }}
    <h1>Hello world</h1>
    <h2>{{ msg }}</h2>
    <input v-model="msg" type="text" />
  </div>
</template>

<style>
input {
  color: #fba;
}
</style>

<style scoped>
button {
  color: #abf;
}
</style>
