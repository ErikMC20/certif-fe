<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>

<template>
  <q-input class="col-6 q-pr-sm" dense outlined :label="label" type="text" />
</template>
