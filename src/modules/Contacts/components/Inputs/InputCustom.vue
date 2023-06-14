<script setup lang="ts">
defineProps<{
  id?: string;
  deleteControl?: boolean;
}>();

defineEmits<{
  (event: 'deleteItem', id: string | undefined): void;
}>();
</script>
<template>
  <q-input
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
    <template #error>
      <div>Hola</div>
    </template>
  </q-input>
</template>
