<script setup>
import { ref, onMounted } from 'vue';
// import { getTasksList } from '../services/useGoalsService';

const columns = [
  {
    name: 'desc',
    align: 'left',
    label: 'Dessert',
    field: 'name',
    required: true,
  },
  {
    name: 'calories',
    align: 'center',
    label: 'Calories (editable)',
    field: 'calories',
  },
  { name: 'fat', align: 'center', label: 'Fat', field: 'fat' },
  { name: 'carbs', align: 'center', label: 'Carbs', field: 'carbs' },
  { name: 'protein', align: 'center', label: 'Protein', field: 'protein' },
];

const rows = ref([
  {
    name: 'Frozen Yogurt',
    calories: 159,
    fat: 6.0,
    carbs: 24,
    protein: 4.0,
  },
  {
    name: 'Ice cream sandwich',
    calories: 237,
    fat: 9.0,
    carbs: 37,
    protein: 4.3,
  },
  {
    name: 'Eclair',
    calories: 262,
    fat: 16.0,
    carbs: 23,
    protein: 6.0,
  },
  {
    name: 'Cupcake',
    calories: 305,
    fat: 3.7,
    carbs: 67,
    protein: 4.3,
  },
  {
    name: 'Gingerbread',
    calories: 356,
    fat: 16.0,
    carbs: 49,
    protein: 3.9,
  },
  {
    name: 'Jelly bean',
    calories: 375,
    fat: 0.0,
    carbs: 94,
    protein: 0.0,
  },
  {
    name: 'Lollipop',
    calories: 392,
    fat: 0.2,
    carbs: 98,
    protein: 0,
  },
  {
    name: 'Honeycomb',
    calories: 408,
    fat: 3.2,
    carbs: 87,
    protein: 6.5,
  },
  {
    name: 'Donut',
    calories: 452,
    fat: 25.0,
    carbs: 51,
    protein: 4.9,
  },
  {
    name: 'KitKat',
    calories: 518,
    fat: 26.0,
    carbs: 65,
    protein: 7,
  },
]);
const errorCalories = ref(false);
const errorMessageCalories = ref('');

const caloriesRangeValidation = () => {
  errorCalories.value = false;
  errorMessageCalories.value = '';
  return true;
};

onMounted(async () => {
  // await getTasksList('e76a3c63-1d54-2f40-07f8-63ca69991525');
});
</script>

<template>
  <div class="row">
    <div class="col-4 q-pa-md">
      <div class="q-mb-md">
        <q-expansion-item
          default-opened
          expand-separator
          label="Hito"
        >
          <q-list bordered>
            <q-item clickable v-ripple>
              <q-item-section>Icon as avatar</q-item-section>
              <q-item-section avatar class="q-pa-sm">
                <div class="bg-primary text-white q-px-md">0</div>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section>Icon as avatar</q-item-section>
              <q-item-section avatar class="q-pa-sm">
                <div class="bg-primary text-white q-px-md">0</div>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section>Icon as avatar</q-item-section>
              <q-item-section avatar class="q-pa-sm">
                <div class="bg-primary text-white q-px-md">0</div>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section>Icon as avatar</q-item-section>
              <q-item-section avatar class="q-pa-sm">
                <div class="bg-primary text-white q-px-md">0</div>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section>Icon as avatar</q-item-section>
              <q-item-section avatar class="q-pa-sm">
                <div class="bg-primary text-white q-px-md">0</div>
              </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section>Icon as avatar</q-item-section>
              <q-item-section avatar class="q-pa-sm">
                <div class="bg-primary text-white q-px-md">0</div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </div>
      <div>
        <q-expansion-item
          default-opened
          expand-separator
          icon="perm_identity"
          label="Account settings"
          caption="John Doe"
        >
          <q-list bordered>
            <q-item clickable v-ripple>
              <q-item-section>Icon as avatar</q-item-section>
              <q-item-section avatar class="q-pa-sm">
                <div class="bg-primary text-white q-px-md">0</div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </div>
      <div>
        <q-expansion-item
          default-opened
          expand-separator
          icon="perm_identity"
          label="Account settings"
          caption="John Doe"
        >
          <q-list bordered>
            <q-item clickable v-ripple>
              <q-item-section>Icon as avatar</q-item-section>
              <q-item-section avatar class="q-pa-sm">
                <div class="bg-primary text-white q-px-md">0</div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </div>
    </div>
    <div class="col-8 q-pa-md">
      <q-table
        :columns="columns"
        :rows-per-page-options="[]"
        :rows="rows"
        hide-bottom
        row-key="name"
        separator="none"
        :loading="false"
      >
        <template #header="slotProps">
          <q-tr :props="slotProps">
            <q-th></q-th>
            <q-th
              v-for="col in slotProps.cols"
              :key="col.name"
              :props="slotProps"
            >
              <div class="bg-primary text-white q-pa-md text-center">
                {{ col.label }}
              </div>
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td>title</q-td>
            <q-td key="desc" :props="props">
              <div class="table-item">
                {{ props.row.name }}
              </div>
              <q-popup-edit
                v-model.number="props.row.name"
                buttons
                label-set="Save"
                label-cancel="Close"
                :validate="caloriesRangeValidation"
                @hide="caloriesRangeValidation"
                v-slot="scope"
              >
                <q-input
                  type="number"
                  v-model.number="scope.value"
                  hint="Enter a number between 4 and 7"
                  :error="errorCalories"
                  :error-message="errorMessageCalories"
                  dense
                  autofocus
                  @keyup.enter="scope.set"
                />
              </q-popup-edit>
            </q-td>
            <q-td class="q-pa-md" key="calories" :props="props">
              <div class="table-item">
                {{ props.row.calories }}
              </div>
              <q-popup-edit
                v-model.number="props.row.calories"
                buttons
                label-set="Save"
                label-cancel="Close"
                :validate="caloriesRangeValidation"
                @hide="caloriesRangeValidation"
                v-slot="scope"
              >
                <q-input
                  type="number"
                  v-model.number="scope.value"
                  hint="Enter a number between 4 and 7"
                  :error="errorCalories"
                  :error-message="errorMessageCalories"
                  dense
                  autofocus
                  @keyup.enter="scope.set"
                />
              </q-popup-edit>
            </q-td>
            <q-td key="fat" :props="props">
              <div class="table-item">{{ props.row.fat }}</div>
              <q-popup-edit
                v-model.number="props.row.fat"
                buttons
                label-set="Save"
                label-cancel="Close"
                :validate="caloriesRangeValidation"
                @hide="caloriesRangeValidation"
                v-slot="scope"
              >
                <q-input
                  type="number"
                  v-model.number="scope.value"
                  hint="Enter a number between 4 and 7"
                  :error="errorCalories"
                  :error-message="errorMessageCalories"
                  dense
                  autofocus
                  @keyup.enter="scope.set"
                />
              </q-popup-edit>
            </q-td>
            <q-td key="carbs" :props="props">
              <div class="table-item">
                {{ props.row.carbs }}
              </div>
              <q-popup-edit
                v-model.number="props.row.carbs"
                buttons
                label-set="Save"
                label-cancel="Close"
                :validate="caloriesRangeValidation"
                @hide="caloriesRangeValidation"
                v-slot="scope"
              >
                <q-input
                  type="number"
                  v-model.number="scope.value"
                  hint="Enter a number between 4 and 7"
                  :error="errorCalories"
                  :error-message="errorMessageCalories"
                  dense
                  autofocus
                  @keyup.enter="scope.set"
                />
              </q-popup-edit>
            </q-td>
            <q-td key="protein" :props="props">
              <div class="table-item">
                {{ props.row.protein }}
              </div>
              <q-popup-edit
                v-model.number="props.row.protein"
                buttons
                label-set="Save"
                label-cancel="Close"
                :validate="caloriesRangeValidation"
                @hide="caloriesRangeValidation"
                v-slot="scope"
              >
                <q-input
                  type="number"
                  v-model.number="scope.value"
                  hint="Enter a number between 4 and 7"
                  :error="errorCalories"
                  :error-message="errorMessageCalories"
                  dense
                  autofocus
                  @keyup.enter="scope.set"
                />
              </q-popup-edit>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table-item {
  padding: 1.1rem;
  border: 2px solid $primary;
}
.expand-icon {
  visibility: hidden;
}
</style>
