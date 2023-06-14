<script lang="ts">
import ViewList from '../../../modules/Assignment/views/ViewList.vue';
import { onMounted } from 'vue';
</script>
<script setup lang="ts">
defineProps<{
  moduleId: string;
}>();
//lifecicle
onMounted(() => {
  console.log('montado');
});
</script>

<template>
  <ViewList :module-id="moduleId" />
</template>

<style scoped></style>
