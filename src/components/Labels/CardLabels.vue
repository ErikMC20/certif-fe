<script setup lang="ts">
import { LabelModel } from '../types';
import BaseLabel from './BaseLabel.vue';
withDefaults(
  defineProps<{
    labels: LabelModel[];
    fullWidth?: boolean;
  }>(),
  {
    fullWidth: false,
  }
);
</script>

<template>
  <div class="row q-col-gutter-md">
    <BaseLabel
      v-for="(label, index) in labels"
      :key="index"
      :title="label.title"
      :value="label.value"
      :full-width="fullWidth"
    />
  </div>
</template>
