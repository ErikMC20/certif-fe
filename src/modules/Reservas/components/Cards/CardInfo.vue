<script lang="ts" setup>
import { ref, computed } from 'vue';
import { CardInfo } from '../../utils/types';
import { useFormOptionsStore } from 'src/stores/formOptionsStore';
import ViewCardVue from 'src/components/MainCard/ViewCard.vue';
import moment from 'moment';
import { QInput } from 'quasar';
import { userStore } from 'src/modules/Users/store/UserStore';
// import AdvancedFilterCampaign from 'src/modules/Prospects/components/AdvancedFilterCampaign.vue';

const props = withDefaults(
  defineProps<{
    id?: string;
    data?: CardInfo;
    readMode?: boolean;
  }>(),
  {
    readMode: false,
  }
);

const baseCardRef = ref<InstanceType<typeof ViewCardVue> | null>(null);
const nameLeadRef = ref<InstanceType<typeof QInput> | null>(null);
const languageStore = useFormOptionsStore();
const loggedUserStore = userStore();
const userDivision = loggedUserStore.userCRM.iddivision || '03';

//* Computed variables
const isEditing = computed(() => baseCardRef.value?.isEditing === 'edit');

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

const listEstado = [
      {
        label: 'Confirmado',
        value: 'Confirmed',
      },
      {
        label: 'Cerrado',
        value: 'Closed',
      },
      {
        label: 'Bloqueado',
        value: 'blocked',
      },
      {
        label: 'Rechazado',
        value: 'rejected',
      }
];

//* Default Functions
const setDefaultData = (): CardInfo => {
  const userAMercado = loggedUserStore.userCRM.idamercado || '';
  return {
    name: '',
    iddivision_c: userDivision,
    idamercado_c: userAMercado,
    idgrupocliente_c: '',
    reser_stage_c: '',
    description: '',
    currency_id: '-99',
    currency_name: '',
    currency_symbol: '',
    region_c: '01_01',
    fecha_venc_c:  moment().format('YYYY-MM-DD')
  };
};

//* variables
const inputData = ref(!!props.data ? { ...props.data } : setDefaultData());

//* methods
const validateInputs = async () => {
  const validatedFields = await Promise.all([
    nameLeadRef.value?.validate(),
  ]);
  return validatedFields.every((field) => !!field);
};

const exposeData = () => {
  return inputData.value;
};

const restoreValues = () => {
  if (props.data) inputData.value = { ...props.data };
};


defineExpose({
  validateInputs,
  exposeData,
  isEditing,
});
</script>
<template>
  <view-card-component
    :controls="!!id"
    :initial-status="id ? 'read' : 'edit'"
    icon-name="feed"
    ref="baseCardRef"
    title="Información de la reserva"
    @cancel-change="restoreValues"
  >

    <template #edit>
      <div class="row q-col-gutter-lg">
        <q-input
          class="col-12 q-pb-none"
          outlined
          ref="nameLeadRef"
          dense
          v-model="inputData.name"
          type="text"
          label="Titulo del reserva *"
          :rules="[(val) => !!val || 'Ingrese un nombre']"
        />
        <q-select
          v-model="inputData.iddivision_c"
          :options="languageStore.leadsOptions.divisions"
          option-value="cod_div"
          option-label="label"
          emit-value
          map-options
          class="col-12 col-sm-6"
          outlined
          dense
          label="Division"
        />
        <q-select
          v-model="inputData.idamercado_c"
          :options="aMercadoOptions"
          option-value="cod_amercado"
          option-label="label"
          emit-value
          map-options
          class="col-12 col-sm-6"
          outlined
          dense
          label="Area de Mercado"
        />
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="inputData.region_c"
          :options="regionesOptions"
          type="text"
          label="Region"
          option-value="cod_region"
          option-label="label"
          emit-value
          map-options
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
        readonly
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="inputData.reser_stage_c"
          :options="listEstado"
          type="text"
          label="Estado"
          option-value="value"
          option-label="label"
          emit-value
          map-options
        />
        <q-input
        type="date"
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="inputData.fecha_venc_c"
          
          label="Fecha de vencimiento"
        />
       
      </div>
    </template>
    <template #read>
      <!-- <pre>{{ regionesOptions }}</pre> -->
      <div class="row q-col-gutter-lg">
        <q-input
        label-color="primary"
        filled
        bg-color="grey-2"
          class="col-12 q-pb-none"
          outlined
          readonly
          ref="nameLeadRef"
          dense
          v-model="inputData.name"
          type="text"
          label="Titulo del reserva *"
          :rules="[(val) => !!val || 'Ingrese un nombre']"
        />
        <q-select
        label-color="primary"
        filled
        bg-color="grey-2"
        readonly
          v-model="inputData.iddivision_c"
          :options="languageStore.leadsOptions.divisions"
          option-value="cod_div"
          option-label="label"
          emit-value
          map-options
          class="col-12 col-sm-6"
          outlined
          dense
          label="Division"
        />
        <q-select
        label-color="primary"
        filled
        bg-color="grey-2"
        readonly
          v-model="inputData.idamercado_c"
          :options="aMercadoOptions"
          option-value="cod_amercado"
          option-label="label"
          emit-value
          map-options
          class="col-12 col-sm-6"
          outlined
          dense
          label="Area de Mercado"
        />
        <q-select
        label-color="primary"
        filled
        bg-color="grey-2"
        readonly
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="inputData.region_c"
          :options="regionesOptions"
          type="text"
          label="Region"
          option-value="cod_region"
          option-label="label"
          emit-value
          map-options
        />
        <q-select
        label-color="primary"
        filled
        bg-color="grey-2"
        readonly
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
        label-color="primary"
        filled
        bg-color="grey-2"
        readonly
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="inputData.reser_stage_c"
          :options="listEstado"
          type="text"
          label="Estado"
          option-value="value"
          option-label="label"
          emit-value
          map-options
        />
        <q-input
        label-color="primary"
        filled
        bg-color="grey-2"
        type="date"
        readonly
        class="col-12 col-sm-6 q-pb-none"
        outlined
        dense
        v-model="inputData.fecha_venc_c"
        label="Fecha de vencimiento"
        />
       
      </div>
    </template>
   
 </view-card-component>
</template>
