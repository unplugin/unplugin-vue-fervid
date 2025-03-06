<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
function counter() {
  count.value++
  console.log("count2", count.value);
}
</script>

<template>
  <div>123</div>
  <div>
    <button type="button" @click="counter">count2 is {{ count }}</button>
  </div>
</template>
