<script setup lang="ts">
import { AccountForm } from '../../utils/types/index';
withDefaults(
  defineProps<{
    title: string;
    value: keyof AccountForm;
    fullWidth?: boolean;
  }>(),
  { fullWidth: false }
);
</script>

<template>
  <div :class="fullWidth ? 'col-12' : 'col-12 col-sm-6'">
    <div class="text-subtitle1 text-grey-6">
      {{ title }}
    </div>
    <div v-if="value" class="text-subitile2 text-black">
      {{ value }}
    </div>
    <div v-else class="text-subtitle2 text-grey-6">No asignado</div>
  </div>
</template>

<style lang="scss" scoped>
.text-subtitle1 {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
</style>
