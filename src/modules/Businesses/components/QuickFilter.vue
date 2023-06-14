<script setup lang="ts">
import { computed, ref, onMounted, watch, defineAsyncComponent } from 'vue';
import { QPopupProxy, QInput, useQuasar } from 'quasar';
import moment from 'moment';

import { useBusinesses } from '../composables/Core';
import { FilterFormat } from '../utils/types';

// import DatePicker from 'src/components/MainInputs/DatePicker.vue';
import AdvancedFilter from 'src/modules/Businesses/components/Filter/AdvancedFilter.vue';


const emits = defineEmits<{
  (events: 'openOpportunity', id?: string): void;
  (events: 'submit', val: FilterFormat): void;
}>();

const {
  filter,
  opportunityType,
  opportunityState,
  updateSalesPhase,
  getFilter,
} = useBusinesses();
const $q = useQuasar();

const datePopupRef = ref<InstanceType<typeof QPopupProxy> | null>(null);
const fromInputRef = ref<InstanceType<typeof QInput> | null>(null);
const toInputRef = ref<InstanceType<typeof QInput> | null>(null);

const advancedFilterDialog = ref(false);

// const date = ref('');

//* computed properties
const opportunityTypeOptions = computed(
  () => opportunityType.value.filter((opp) => opp.div === filter.value.iddivision_c) || []
);
const opportunityPhaseOptions = computed(
  () =>
    opportunityType.value.find((opp) => opp.value === filter.value.opportunity_type)
      ?.phase || []
);

//* methods
const checkValidDate = (date1: string, date2: string) => {
  const dateOne = moment(date1, 'DD-MM-YYYY');
  const dateTwo = moment(date2, 'DD-MM-YYYY');
  return dateOne.diff(dateTwo) <= 0 || 'La Fecha es Inválida';
};

const checkDate = (date: string) => {
  const isDateValid = moment(date, 'DD-MM-YYYY').isValid();
  return !!isDateValid || 'Fecha Invalida';
};

const setNewDate = () => {
  filter.value.option_date_closed = 'It is between';
  filter.value.operator_date_closed = 'between';
};

const submitForm = () => {
  filter.value.iddivision_c = filter.value.iddivision_c || '03';
  filter.value.operator_date_closed = 'between';
  emits('submit', filter.value);
};

const createOpportunity = (id?: string) => {
  console.log('new opp');
  emits('openOpportunity', id);

  // opportunityDialogQFRef.value?.openDialogAccountTab();
};

const updateParameters = () => {
  console.log('abc');
  filter.value.option_date_closed = 'It is between';
  filter.value.operator_date_closed = 'between';
};

watch(
  filter,
  () => {
    datePopupRef.value?.hide();
    fromInputRef.value?.validate();
    toInputRef.value?.validate();
  },
  { deep: true }
);

onMounted(async () => {
  await getFilter();
});
</script>
<template>
  <q-toolbar class="bg-none q-px-none q-mb-sm">
    <q-form @submit="submitForm" class="q-gutter-md row">
      <q-input
        dense
        hint="Presione enter para buscar"
        label="Filtrar y buscar"
        outlined
        type="text"
        v-model="filter.term"
      >
      </q-input>
      <q-select
        v-model="filter.opportunity_type"
        dense
        emit-value
        map-options
        option-label="label"
        option-value="value"
        :options="opportunityTypeOptions"
        label="Tipo de oportunidad"
        outlined
        :rules="[(val) => !!val || 'Campo Requerido']"
        @update:model-value="updateSalesPhase"
      >
        <template #prepend> <q-icon name="business" /></template
      ></q-select>
      <q-select
        :options="opportunityState"
        dense
        emit-value
        label="Estado de la oportunidad"
        map-options
        option-label="label"
        option-value="value"
        outlined
        v-model="filter.estado_oportunidad_c"
        :rules="[(val) => !!val || 'Campo Requerido']"
      >
        <template #prepend><q-icon name="compost" /></template>
      </q-select>
      <!-- <q-select
        v-model="opportunityDate"
        dense
        :options="opportunityDateOptions"
        label="Rango de fechas"
        outlined
      >
        <template #prepend><q-icon name="compost" /></template>
      </q-select> -->
      <q-input
        ref="fromInputRef"
        dense
        outlined
        label="Desde"
        hint="Fecha cierre"
        v-model="filter.from_date_closed"
        :rules="[checkDate, (val) => checkValidDate(val, filter.to_date_closed || '')]"
        @update:model-value="updateParameters"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              ref="datePopupRef"
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="filter.from_date_closed"
                title="Fecha Inicio"
                @update:model-value="setNewDate"
                mask="DD-MM-YYYY"
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <q-input
        ref="toInputRef"
        dense
        outlined
        label="Hasta"
        hint="Fecha cierre"
        v-model="filter.to_date_closed"
        :rules="[checkDate, (val) => checkValidDate(filter.from_date_closed || '', val)]"
        @update:model-value="updateParameters"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              ref="datePopupRef"
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="filter.to_date_closed"
                title="Fecha fin"
                @update:model-value="setNewDate"
                mask="DD-MM-YYYY"
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
      <!-- <DatePicker v-model:model-value="date" required /> -->
      <div>
        <q-btn round icon="search" type="submit" color="primary" />
      </div>
    </q-form>
    <q-space />
    <q-btn
      flat
      round
      dense
      icon="filter_alt"
      class="q-mr-xs"
      @click="advancedFilterDialog = true"
    />
    <q-btn
      @click="createOpportunity()"
      class="bg-primary text-white"
      icon="add"
      label="Nuevo"
    />
  </q-toolbar>
  <AdvancedFilter v-model="advancedFilterDialog"> </AdvancedFilter>
</template>

<style scoped></style>
