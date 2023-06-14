<script setup lang="ts">
import { ref } from 'vue';
import { Inputs, TemplateValues } from './modelsForm';

defineEmits(['submit']);
const props = defineProps<{
  inputs: Array<Inputs>;
  dataSource: TemplateValues;
}>();

const defaultdata = ref(props.dataSource);
</script>

<template>
  <q-form @submit="$emit('submit', 'dataSend')" class="q-gutter-md">
    <component
      v-for="input in inputs"
      :key="input.id"
      :is="input.inputName"
      v-model="defaultdata[input.field as keyof TemplateValues]"
      :label="input.label"
      :dense="input.dense"
      :class="input.class"
      :outlined="input.outlined"
    ></component>
  </q-form>
  <pre>{{ defaultdata }}</pre>
</template>
