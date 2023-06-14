<script setup lang="ts">
import { OptionBase } from '../types';
withDefaults(
  defineProps<{
    title: string;
    value: keyof OptionBase;
    fullWidth?: boolean;
  }>(),
  { fullWidth: false }
);
</script>

<template>
  <div :class="fullWidth ? 'col-12' : 'col-12 col-sm-6'">
    <!-- <div class="text-subtitle1 text-grey-6">
      {{ title }}
    </div>
    <div v-if="value" class="text-subitile2 text-black">
      {{ value }}
    </div>
    <div v-else class="text-subtitle2 text-grey-6">No asignado</div> -->
    <q-input :model-value="value" type="text" :label="title" readonly dense />
  </div>
</template>
