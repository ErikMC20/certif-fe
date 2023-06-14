<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useBusinesses } from 'src/modules/Businesses/composables/Core';
import DateRangeSelect from 'src/components/DateRange/DateRangeSelect.vue';
import AmountRange from 'src/components/AmountRange/AmountRange.vue';
import UserSelect from 'src/components/UserSelect/UserSelect.vue';
import { FilterFormat } from '../../../utils/types';

const fieldOptions = [
  {
    label: 'División',
    value: 'iddivision_c',
  },
  {
    label: 'Área de mercado',
    value: 'idamercado_c',
  },
  {
    label: 'Grupo cliente',
    value: 'idgrupocliente_c',
  },
  {
    label: 'Nombre',
    value: 'name',
  },
  {
    label: 'Cuenta',
    value: 'account_id',
  },
  {
    label: 'Monto',
    value: 'from_amount',
  },
  {
    label: 'Región',
    value: 'region_c',
  },
  {
    label: 'Tipo de oportunidad',
    value: 'opportunity_type',
  },
  {
    label: 'Fase de venta',
    value: 'faseventa_c',
  },
  {
    label: 'Fecha de creación',
    value: 'from_date_entered',
  },
  {
    label: 'Asignado a',
    value: 'assigned_user_id',
  },
  {
    label: 'Origen',
    value: 'origen_c',
  },
  {
    label: 'Campaña',
    value: 'campaign_id',
  },
  {
    label: 'Evento',
    value: 'fp_events_id_c',
  },
  {
    label: 'Fecha de cierre',
    value: 'from_date_closed',
  },
  {
    label: 'Estado',
    value: 'estado_oportunidad_c',
  },
  {
    label: 'Creado Por',
    value: 'created_by',
  },
  {
    label: 'Número',
    value: 'number_c',
  },
];

const {
  grupoCliente,
  listDivisiones,
  opportunityState,
  opportunityType,
  originList,
  paisList,
  filter,
  getFilter,
  updateSalesPhase,
} = useBusinesses();

// const fields = ref<Fields>({} as Fields);
const visibleFieldsDialog = ref<boolean>(false);
const visibleFields = ref<string[]>([
  'iddivision_c',
  'idamercado_c',
  'idgrupocliente_c',
  'name',
  'account_id',
  'option_amount',
  'from_amount',
  'to_amount',
  'operator_amount',
  'region_c',
  'opportunity_type',
  'faseventa_c',
  'option_date_entered',
  'from_date_entered',
  'to_date_entered',
  'operator_date_entered',
  'assigned_user_id',
  'origen_c',
  'campaign_id',
  'fp_events_id_c',
  'option_date_closed',
  'from_date_closed',
  'to_date_closed',
  'operator_date_closed',
  'estado_oportunidad_c',
  'created_by',
  'number_c',
]);
const userSelectRef = ref<InstanceType<typeof UserSelect> | null>(null);

const checkVisibility = (fieldName: string) => visibleFields.value.includes(fieldName);

const aMercadoList = computed(
  () =>
    listDivisiones.value.find((div) => div.cod_div === filter.value.iddivision_c)
      ?.amercado || []
);
const grupoClienteList = computed(
  () =>
    grupoCliente.value.find((group) => group.div === filter.value.iddivision_c)?.grupo ||
    []
);
const regionesList = computed(() => paisList.value[0]?.regiones || []);
const opportunityTypeList = computed(
  () => opportunityType.value.filter((opp) => opp.div === filter.value.iddivision_c) || []
);
const opportunityPhaseList = computed(
  () =>
    opportunityType.value.find((opp) => opp.value === filter.value.opportunity_type)
      ?.phase || []
);

const changeDivision = (value: string) => {
  filter.value.idamercado_c = '';
  filter.value.idgrupocliente_c = '';
  filter.value.opportunity_type = '';
  filter.value.faseventa_c = '';
  filter.value.assigned_user_id = '';
  filter.value.created_by = '';
  filter.value.origen_c = '';

  userSelectRef.value?.cleanData();
  userSelectRef.value?.getListUsers(value);
};

const changeOppotunityType = (val: string) => {
  filter.value.faseventa_c = '';
  updateSalesPhase(val);
};

const resetData = () => {
  filter.value = {} as FilterFormat;
  userSelectRef.value?.cleanData();
  userSelectRef.value?.getListUsers();
};

onMounted(async () => {
  await getFilter();
});

defineExpose({
  resetData,
});
</script>

<template>
  <div class="q-pa-md q-gutter-y-md bg-white">
    <q-select
      :options="listDivisiones"
      dense
      emit-value
      label="División"
      map-options
      option-label="label"
      option-value="cod_div"
      outlined
      v-if="checkVisibility('iddivision_c')"
      v-model="filter.iddivision_c"
      @update:model-value="changeDivision"
    />
    <q-select
      :options="aMercadoList"
      dense
      emit-value
      label="Área de mercado"
      map-options
      option-label="label"
      option-value="cod_amercado"
      outlined
      v-if="checkVisibility('idamercado_c')"
      v-model="filter.idamercado_c"
    />
    <q-select
      :options="grupoClienteList"
      dense
      emit-value
      label="Grupo cliente"
      map-options
      option-label="label"
      option-value="value"
      outlined
      v-if="checkVisibility('idgrupocliente_c')"
      v-model="filter.idgrupocliente_c"
    />
    <q-input
      v-model="filter.name"
      type="text"
      label="Nombre"
      autofocus
      outlined
      dense
      v-if="checkVisibility('name')"
    />
    <select-account-input
      v-model="filter.account_id"
      v-if="checkVisibility('account_id')"
    />
    <AmountRange
      v-model:options="filter.option_amount"
      v-model:from="filter.from_amount"
      v-model:to="filter.to_amount"
      v-model:operator="filter.operator_amount"
      label="Seleccionar Monto"
      v-if="checkVisibility('from_amount')"
    />
    <q-select
      v-model="filter.region_c"
      :options="regionesList"
      emit-value
      map-options
      label="Región"
      option-label="label"
      option-value="cod_region"
      outlined
      dense
      v-if="checkVisibility('region_c')"
    />
    <q-select
      v-model="filter.opportunity_type"
      :options="opportunityTypeList"
      label="Tipo de oportunidad"
      emit-value
      map-options
      option-label="label"
      option-value="value"
      outlined
      dense
      v-if="checkVisibility('opportunity_type')"
      @update:model-value="changeOppotunityType"
    />
    <!-- TODO: Change this field to sales_stage -->
    <q-select
      v-model="filter.faseventa_c"
      :options="opportunityPhaseList"
      label="Fase de venta"
      emit-value
      map-options
      option-label="label"
      option-value="value"
      outlined
      dense
      v-if="checkVisibility('faseventa_c')"
    />
    <DateRangeSelect
      v-model:options="filter.option_date_entered"
      v-model:from="filter.from_date_entered"
      v-model:to="filter.to_date_entered"
      v-model:operator="filter.operator_date_entered"
      label="Fecha de creacion"
      v-if="checkVisibility('from_date_entered')"
    />
    <UserSelect
      ref="userSelectRef"
      label="Asignado a"
      v-model="filter.assigned_user_id"
      v-if="checkVisibility('assigned_user_id')"
    />
    <q-select
      v-model="filter.origen_c"
      :options="originList"
      label="Origen"
      emit-value
      map-options
      option-label="label"
      option-value="value"
      outlined
      dense
      v-if="checkVisibility('origen_c')"
    />
    <select-campaign-input
      v-model="filter.campaign_id"
      v-if="checkVisibility('campaign_id')"
    />
    <!-- <q-select
      v-model="fields.fp_events_id_c"
      :options="['MOD evento']"
      label="Evento(MOD)"
      outlined
      dense
      v-if="checkVisibility('fp_events_id_c')"
    /> -->
    <DateRangeSelect
      v-model:options="filter.option_date_closed"
      v-model:from="filter.from_date_closed"
      v-model:to="filter.to_date_closed"
      v-model:operator="filter.operator_date_closed"
      label="Fecha de cierre"
      v-if="checkVisibility('from_date_closed')"
    />
    <q-select
      v-model="filter.estado_oportunidad_c"
      :options="opportunityState"
      label="Estado"
      emit-value
      map-options
      option-label="label"
      option-value="value"
      outlined
      dense
      v-if="checkVisibility('estado_oportunidad_c')"
    />
    <UserSelect
      ref="userSelectRef"
      label="Creado por"
      v-model="filter.created_by"
      v-if="checkVisibility('created_by')"
    />
    <q-input
      v-model="filter.number_c"
      type="text"
      label="Número"
      outlined
      dense
      v-if="checkVisibility('number_c')"
    />
    <q-btn
      class="full-width"
      color="primary"
      label="Ver más Campos"
      flat
      @click="visibleFieldsDialog = true"
    />
  </div>
  <q-dialog v-model="visibleFieldsDialog" persistent>
    <q-card>
      <q-card-section class="q-pa-none">
        <q-toolbar class="bg-primary text-white">
          <q-btn flat round dense icon="assignment_ind" />
          <q-toolbar-title> Seleccionar campos </q-toolbar-title>
        </q-toolbar>
      </q-card-section>
      <q-card-section class="row items-center">
        <q-option-group
          v-model="visibleFields"
          type="checkbox"
          color="primary"
          :options="fieldOptions"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Aceptar" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="scss"></style>
