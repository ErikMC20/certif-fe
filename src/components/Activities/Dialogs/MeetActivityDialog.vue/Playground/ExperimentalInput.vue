<script lang="ts" setup>
import { computed } from 'vue';
const props = withDefaults(
  defineProps<{
    modelValue: string;
    modelModifiers?: { capitalize?: boolean };
  }>(),
  {
    modelModifiers: () => ({}),
  }
);
const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    console.log(`your value... ${value}`);
    if (props.modelModifiers?.capitalize)
      value = value.charAt(0).toUpperCase() + value.slice(1);
    emit('update:modelValue', value);
  },
});

// interface InputEvent extends Event {
//   target: HTMLInputElement;
// }

// const emitValue = (event: InputEvent) => {
//   let value = event.target.value;
//   if (props.modelModifiers?.capitalize)
//     value = value.charAt(0).toUpperCase() + value.slice(1);
//   emit('update:modelValue', value);
// };

const changeValue = () => {
  value.value = 'localChanged';
};
</script>
<template>
  <q-input v-model="value" type="text" label="Label">
    <template #before>
      <q-btn color="primary" icon="check" label="OK" @click="changeValue" />
    </template>
  </q-input>
</template>
