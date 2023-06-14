<script lang="ts" setup>
import { ref } from 'vue';
const text = ref('');
const rangeDate = ref('');
</script>

<template>
  <div class="q-py-md">
    <q-toolbar class="bg-gray">
      <q-input outlined dense v-model="text" type="text" label="label">
        <template #append><q-icon name="search" /></template
      ></q-input>
      <q-btn flat round dense icon="apps" class="q-mr-xs" />
      <q-btn flat round dense icon="more_vert" />
      <q-space />
      <q-input
        outlined
        dense
        v-model="rangeDate"
        type="text"
        label="Rango de fecha"
      >
        <template #append><q-icon name="date_range" /></template
      ></q-input>
    </q-toolbar>
  </div>
</template>
