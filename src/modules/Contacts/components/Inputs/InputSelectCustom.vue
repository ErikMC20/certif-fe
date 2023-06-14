<script setup lang="ts">
const emits = defineEmits(['newValue']);
const valueChanged = () => {
  emits('newValue');
};
</script>
<template>
  <q-select
    class="col-12 col-sm-6 q-px-xs q-pb-xs q-mb-md"
    dense
    outlined
    options-dense
    emit-value
    map-options
    @update:model-value="valueChanged"
  />
</template>
