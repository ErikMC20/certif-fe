<script setup lang="ts">
import InputCustom from './InputCustom.vue';
defineProps<{ id: string }>();
defineEmits<{ (event: 'deleteItem', id: string | undefined): void }>();
</script>

<template>
  <div class="row justify-between q-px-sm">
    <div class="col-10">
      <InputCustom v-bind="$attrs" />
    </div>
    <div col="col-lg-6 col-xl-6 col-sm-12 col-xs-12 flex justify-end">
      <q-btn
        color="negative"
        round
        icon="close"
        size="xs"
        @click="$emit('deleteItem', id)"
      />
    </div>
  </div>
</template>
