<script setup lang="ts">
import { QInput } from 'quasar';
import { ref } from 'vue';
defineProps<{
  id?: string;
  deleteControl?: boolean;
}>();

defineEmits<{
  (event: 'deleteItem', id: string | undefined): void;
}>();

const inputFieldRef = ref<InstanceType<typeof QInput> | null>(null);

const validateField = () => {
  return inputFieldRef.value?.validate();
};

// const hasError = () => {
//   inputFieldRef.value?.hasError;
// };

defineExpose({
  validateField,
});
</script>
<template>
  <q-input
    ref="inputFieldRef"
    class="col-12 col-sm-6 q-px-xs q-pb-xs q-mb-md"
    dense
    outlined
    color="primary"
    type="text"
  >
    <template #append
      ><q-btn
        v-if="deleteControl && id"
        color="negative"
        icon="delete"
        size="xs"
        round
        @click="$emit('deleteItem', id)"
      >
        <q-tooltip>Eliminar campo</q-tooltip>
      </q-btn>
    </template>
    <!-- <template #></template> -->
    <template #error>
      <div>Hola</div>
    </template>
  </q-input>
</template>
