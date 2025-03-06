<script setup lang="ts">
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'

const count = ref(0)
function counter() {
  count.value++
  console.log("count1", count.value);
}
</script>

<template>
  <div>Im testing</div>
  <button type="button" @click="counter">count1 is {{ count }}</button>
  <HelloWorld />
</template>
