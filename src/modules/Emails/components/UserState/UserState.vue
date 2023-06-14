<script setup lang="ts">
type UserState = 'Activo' | 'Inactivo';

defineProps<{ userState: UserState }>();
</script>
<template>
  <div
    class="row items-center q-gutter-md"
    :class="`text-${userState === 'Inactivo' ? 'red' : 'green'}`"
  >
    <q-icon class="column" name="person" />
    <div class="column">Usuario - {{ userState }}</div>
  </div>
</template>
