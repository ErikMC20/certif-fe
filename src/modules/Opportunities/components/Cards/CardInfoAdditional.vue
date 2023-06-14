<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { AdditionalInfoOpportunity } from '../../utils/types';
import ViewCardVue from 'src/components/MainCard/ViewCard .vue';
import { useFormOptionsStore } from 'src/stores/formOptionsStore';
import { userStore } from 'src/modules/Users/store/UserStore';
import { GrupoClienteResponse } from '../../../../components/types/index';

const props = withDefaults(
  defineProps<{
    id?: string;
    data?: AdditionalInfoOpportunity;
  }>(),
  {}
);

interface Emits {
  (e: 'updateDivision', division: string): void;
}

const emits = defineEmits<Emits>();

const baseCardRef = ref<InstanceType<typeof ViewCardVue> | null>();
const isEditing = computed(() => baseCardRef.value?.isEditing === 'edit');

const languageStore = useFormOptionsStore();
const loggedUserStore = userStore();
const userDivision = loggedUserStore.userCRM.iddivision || '03';
const userAmercado = loggedUserStore.userCRM.useDivAreaMercado || '';
const userGrupoCliente = loggedUserStore.userCRM.GrupoClienteResponse || '';

const aMercadoOptions = computed(() => {
  const amercado = languageStore.leadsOptions.divisions.filter(
    (option: { cod_div: string }) => option.cod_div === userDivision
  )[0] as { amercado: { label: string; cod_amercado: string }[] };
  return amercado.amercado;
});

const regionesOptions = computed(() => {
  return languageStore.leadsOptions.regions
    .map((region) => region.regiones)
    .flat();
});

const clientGroupOptions = computed(() => {
  const currentClientGroup = languageStore.clientGroup.find(
    (val) => val.div === userDivision
  );
  if (!!currentClientGroup) return currentClientGroup.grupo;
  return [];
});

const setDefaultData = (): AdditionalInfoOpportunity => {
  const userAMercado = loggedUserStore.userCRM.idamercado || '';
  return {
    iddivision_c: userDivision,
    idamercado_c: userAmercado,
    idgrupocliente_c: '',
    region_c: loggedUserStore.userCRM.idregional,
    acuenta_de_c: '',
  };
};

const inputData = ref(!!props.data ? { ...props.data } : setDefaultData());

const data = ref({
  asignado: '',
  iddivision_c: userDivision,
  idamercado_c: userAmercado,
  idgrupocliente_c: '',
  estado: '',
  opportunity_type: '',
  sales_stage: '',
  region_c: loggedUserStore.userCRM.idregional,
  acuenta_de_c: '',
  cuce_c: '',
  prob_proyecto_c: '',
});

const OpportunityInfoAddProps = ref(
  !!props.data
    ? { ...props.data }
    : ({
        iddivision_c: '',
        idamercado_c: '',
        idgrupocliente_c: '',
        region_c: '',
        cuce_c: '',
        prob_proyecto_c: '',
        acuenta_de_c: '',
        // account_id_c: '',
        // contact_id_c: '',
      } as AdditionalInfoOpportunity)
);

const exposeData = () => {
  return inputData.value;
};

const restoreValues = () => {
  if (props.data) inputData.value = { ...props.data };
};

const updateDivision = (value: string) => {
  console.log('new division', value);
  emits('updateDivision', value);
};

// onMounted(() => {
//   emits('updateDivision', inputData.value.iddivision_c);
// });
defineExpose({
  // validateInputs,
  exposeData,
  isEditing,
});
</script>

<template>
  <view-card-component
    :controls="!!id"
    ref="baseCardRef"
    :initial-status="id ? 'read' : 'edit'"
    icon-name="file_present"
    title="Información adicional"
    @cancel-change="restoreData"
  >
    <template #edit>
      <div class="row q-col-gutter-lg q-py-md">
        <q-select
          :emit-value="true"
          :map-options="true"
          :options="languageStore.OpportunityOptions.divisions"
          @update:model-value="updateDivision"
          class="col-12 col-sm-6"
          dense
          label="División"
          option-label="label"
          option-value="cod_div"
          options-dense
          outlined
          transition-hide="flip-down"
          transition-show="flip-up"
          v-model="data.iddivision_c"
        />
        <q-select
          v-model="data.idamercado_c"
          :options="aMercadoOptions"
          label="Área de Mercado"
          transition-show="flip-up"
          transition-hide="flip-down"
          outlined
          dense
          class="col-12 col-sm-6"
          option-value="cod_amercado"
          option-label="label"
          :map-options="true"
          :emit-value="true"
          options-dense
          :disable="data.iddivision_c == ''"
        />
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="inputData.idgrupocliente_c"
          :options="clientGroupOptions"
          type="text"
          label="Grupo Cliente"
          option-value="value"
          option-label="label"
          emit-value
          map-options
        />
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          :options="regionesOptions"
          v-model="data.region_c"
          option-value="cod_region"
          option-label="label"
          emit-value
          map-options
          type="text"
          label="Región"
        />
        <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="data.cuce_c"
          type="text"
          label="CUCE"
        />
        <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="data.prob_proyecto_c"
          type="text"
          label="Probabilidad de que ocurra el proyecto (%)"
        />
        <q-select
          v-model="data.acuenta_de_c"
          :options="languageStore.OpportunityOptions.acuentade"
          label="Participación como"
          transition-show="flip-up"
          transition-hide="flip-down"
          outlined
          dense
          class="col-md-6 col-sm-12 col-xs-12"
          options-dense
          option-value="value"
          option-label="label"
          :map-options="true"
          :emit-value="true"
        />
      </div>
    </template>
    <template #read>
      <div class="row q-col-gutter-lg q-py-md">
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="data.iddivision_c"
          :options="languageStore.OpportunityOptions.divisions"
          readonly
          hide-dropdown-icon
          type="text"
          label="División"
          option-label="label"
          option-value="cod_div"
          emit-value
          map-options
        />
        <q-select
          v-model="data.idamercado_c"
          hide-dropdown-icon
          readonly
          :options="aMercadoOptions"
          option-value="cod_amercado"
          option-label="label"
          emit-value
          map-options
          class="col-12 col-sm-6"
          outlined
          dense
          label="Área de Mercado"
        />
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="inputData.idgrupocliente_c"
          :options="clientGroupOptions"
          readonly
          hide-dropdown-icon
          type="text"
          label="Grupo Cliente"
          option-value="value"
          option-label="label"
          emit-value
          map-options
        />
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="inputData.region_c"
          :options="clientGroupOptions"
          readonly
          hide-dropdown-icon
          type="text"
          label="Región"
          option-value="value"
          option-label="label"
          emit-value
          map-options
        />
        <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="data.cuce_c"
          readonly
          type="text"
          label="CUCE"
        />
        <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="data.prob_proyecto_c"
          readonly
          type="text"
          label="Probabilidad de que ocurra el proyecto (%)"
        />
        <q-select
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="data.acuenta_de_c"
          :options="languageStore.OpportunityOptions.acuentade"
          readonly
          hide-dropdown-icon
          type="text"
          label="Participación como"
          option-value="value"
          option-label="label"
          emit-value
          map-options
        />
      </div>
    </template>
  </view-card-component>
</template>
