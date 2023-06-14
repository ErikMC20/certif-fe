<script>
import { ref } from 'vue';

const columns = [
  {
    name: 'desc',
    required: true,
    label: 'Dessert (100g serving)',
    align: 'left',
    field: (row) => row.name,
    format: (val) => `${val}`,
    style: 'width: 60px; white-space: normal;',
    sortable: true,
  },
  {
    name: 'calories',
    align: 'center',
    label: 'Calories',
    field: 'calories',
    sortable: true,
  },
  { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs', sortable: true },
  { name: 'custom', label: 'Acciones', align: 'center' },
];

const rows = [
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23,
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0,
    carbs: 49,
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0.0,
    carbs: 94,
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25.0,
    carbs: 51,
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0,
    carbs: 65,
  },
];

export default {
  setup() {
    return {
      filter: ref(''),
      columns,
      rows,
      onClickRow: () => {
        console.log('hello this comp');
      },
    };
  },
};
</script>

<template>
  <div class="q-pa-md">
    <q-table
      :grid="$q.screen.xs"
      title="Treats"
      :rows="rows"
      :columns="columns"
      row-key="name"
      :filter="filter"
    >
      <template v-slot:top-left> <q-icon name="print" /></template>
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="desc" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="fat" :props="props">
            <q-badge color="purple">
              {{ props.row.fat }}
            </q-badge>
          </q-td>
          <q-td key="carbs" :props="props">
            <q-badge color="orange">
              {{ props.row.carbs }}
            </q-badge>
          </q-td>
          <q-td key="carbs" :props="props">
            <q-badge color="amber">
              {{ props.row.carbs }}
            </q-badge>
          </q-td>
          <q-td key="custom" align="center">
            <q-btn
              size="9px"
              round
              color="primary"
              icon="more_vert"
              @click="onClickRow"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
