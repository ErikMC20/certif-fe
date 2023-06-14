<script setup lang="ts">
import { QSelect } from 'quasar';
import { ref } from 'vue';
const emits = defineEmits(['newValue']);
const valueChanged = () => {
  emits('newValue');
};

const selectRef = ref<InstanceType<typeof QSelect> | null>(null);

const validateField = () => {
  return selectRef.value?.validate();
};

defineExpose({
  validateField,
});
</script>
<template>
  <q-select
    ref="selectRef"
    class="col-12 col-sm-6 q-px-xs q-pb-xs q-mb-md"
    dense
    outlined
    options-dense
    emit-value
    map-options
    @update:model-value="valueChanged"
  />
</template>
