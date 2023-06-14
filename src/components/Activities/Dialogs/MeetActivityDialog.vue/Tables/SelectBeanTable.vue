<script lang="ts">
import { ref, computed } from 'vue';
// import { useAxios } from '@vueuse/integrations/useAxios';
</script>
<script setup lang="ts">
const filter = ref('');

defineProps<{
  module: string;
  data: object[];
}>();

// const data = computed(() => {
//   return
// });

console.log('la tabla de creacion de ...');
</script>
<template>
  <pre>{{ data }}</pre>
  <!-- <q-table
    flat
    style="height: 80%"
    title="Registros"
    dense
    class="customScroll sticky-header-table"
    :rows="getRecords"
    :columns="getColumns"
    v-model:selected="selected"
    row-key="id"
    selection="multiple"
    :rows-per-page-options="[0]"
  >
    <template #body-cell-fullname="slotProps">
      <q-td @onClick="openDialog">
        <span text-color="primary">{{ slotProps.value }}</span>
      </q-td>
    </template>
    <template #body-cell-TABLE_NAME="slotProps">
      <q-td>
        <q-chip
          color="orange"
          class="no-select"
          icon="badge"
          :label="slotProps.value"
          size="sm"
      /></q-td>
    </template>
    <template #no-data>
      <q-card class="my-card" flat>
        <q-card-section>
          <q-icon class="q-mr-md" color="grey-6" size="lg" name="warning" />
          <span class="text-grey-6" style="font-size: medium"
            >No existen datos disponibles</span
          >
        </q-card-section>
      </q-card>
    </template>
  </q-table> -->
</template>
