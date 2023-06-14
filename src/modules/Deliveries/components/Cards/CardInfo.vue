<script lang="ts" setup>
import { ref, computed } from 'vue';
import { CardInfoLead } from '../../utils/types';
import { useFormOptionsStore } from 'src/stores/formOptionsStore';
import ViewCardVue from 'src/components/MainCard/ViewCard.vue';
import moment from 'moment';
import { QInput } from 'quasar';
import { userStore } from 'src/modules/Users/store/UserStore';
import AdvancedFilterCampaign from 'src/modules/Prospects/components/AdvancedFilterCampaign.vue';

const props = withDefaults(
  defineProps<{
    id?: string;
    data?: CardInfoLead;
    readMode?: boolean;
  }>(),
  {
    readMode: false,
  }
);

const baseCardRef = ref<InstanceType<typeof ViewCardVue> | null>(null);
const nameLeadRef = ref<InstanceType<typeof QInput> | null>(null);
const dateClosedLeadRef = ref<InstanceType<typeof QInput> | null>(null);
const campaignFilterRef = ref<InstanceType<
  typeof AdvancedFilterCampaign
> | null>(null);

const languageStore = useFormOptionsStore();
const loggedUserStore = userStore();
const userDivision = loggedUserStore.userCRM.iddivision || '03';
console.log(loggedUserStore.userCRM);

//* Computed variables
const isEditing = computed(() => baseCardRef.value?.isEditing === 'edit');

const aMercadoOptions = computed(() => {
  const amercado = languageStore.leadsOptions.divisions.filter(
    (option: { cod_div: string }) => option.cod_div === userDivision
  )[0] as { amercado: { label: string; cod_amercado: string }[] };
  return amercado.amercado;
});

const motivoOptions = computed(() => {
  const currentState = languageStore.leadsOptions.gainStates.find(
    (option: { label: string; value: string }) =>
      option.value === inputData.value.estado_c
  );
  if (currentState) return currentState['motivo'];
  return [];
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
        label: 'Entregado',
        value: '01',
      },
      {
        label: 'Entregado y Verificado',
        value: '05',
      },
      {
        label: 'En progreso',
        value: '02',
      },
      {
        label: 'Pendiente',
        value: '03',
      },
      {
        label: 'Cancelado',
        value: '04',
      }
  ];
  const listLugar = [
      {
        label: 'holaaaaa',
        value: '32de6b6e-599b-a3a6-20c4-5e15efcc075a',
      }
  ];

//* Default Functions
const setDefaultData = (): CardInfoLead => {
  const userAMercado = loggedUserStore.userCRM.idamercado || '';
  return {
    name: '',
    iddivision_c: userDivision,
    idamercado_c: userAMercado,
    grupo_cliente_c: '',
    referencia_c: '',
    campaign_id_c: '',
    campania_c: '',
    estado_c: 'EnTratamiento',
    lugar_entrega_c: '',
    producto_c: '',
    fecha_entrega_c: moment().format('YYYY-MM-DD'),
    description: '',
    currency_id: '-99',
    currency_name: '',
    currency_symbol: '',
    regional_c: '01_01',
    prioridad_c: 'Media',
    amount: 0,
  };
};

//* variables
const inputData = ref(!!props.data ? { ...props.data } : setDefaultData());
const campaignNameOptions = ref([
  {
    label: inputData.value.campania_c || '',
    value: inputData.value.campaign_id_c,
  },
]);

//* methods

const validateInputs = async () => {
  const validatedFields = await Promise.all([
    nameLeadRef.value?.validate(),
    //dateClosedLeadRef.value?.validate(),
  ]);
  return validatedFields.every((field) => !!field);
};

const exposeData = () => {
  return inputData.value;
};

const restoreValues = () => {
  if (props.data) inputData.value = { ...props.data };
};

const openCampaignFilter = () => {
  campaignFilterRef.value?.openDialog();
};

const selectCampaign = (item: { [key: string]: string }) => {
  console.log('my campaign selected', item);
  campaignNameOptions.value = [
    {
      label: item.nombre,
      value: item.id,
    },
  ];
  inputData.value.campaign_id_c = item.id;
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
    title="Información de la entrega"
    @cancel-change="restoreValues"
  >
    <template #edit>
      <!-- <pre>{{ languageStore.leadsOptions.divisions }}</pre> -->
      <div class="row q-col-gutter-lg">
        <q-input
          class="col-12 q-pb-none"
          outlined
          ref="nameLeadRef"
          dense
          v-model="inputData.name"
          type="text"
          label="Titulo de la entrega *"
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
          v-model="inputData.regional_c"
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
          v-model="inputData.grupo_cliente_c"
          :options="clientGroupOptions"
          type="text"
          label="Grupo cliente"
          option-value="value"
          option-label="label"
          emit-value
          map-options
        />
        
        <q-input
        
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="inputData.fecha_entrega_c"
          type="date"
          label="Fecha de entrega"
        />
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="inputData.estado_c"
          :options="listEstado"
          type="text"
          label="Estado"
          option-value="value"
          option-label="label"
          emit-value
          map-options
        />
        <!-- <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="inputData.lugar_entrega_c"
          type="text"
          label="Lugar de entrega"
        /> -->
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="inputData.lugar_entrega_c"
          :options="languageStore.deliveryOptions.place.data"
          type="text"
          label="Lugar de entrega"
          option-value="value"
          option-label="label"
          emit-value
          map-options
        />
        <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="inputData.referencia_c"
          type="text"
          label="Referencia"  
        />
       
      </div>
    </template>
    <template #read>
      <!-- <pre>{{ languageStore.deliveryOptions.place.data }}</pre> -->
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
          label="Titulo de la entrega *"
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
          hide-dropdown-icon
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
          hide-dropdown-icon
        />
        <q-select
        label-color="primary"
        filled
        bg-color="grey-2"
        readonly
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="inputData.regional_c"
          :options="regionesOptions"
          type="text"
          label="Region"
          option-value="cod_region"
          option-label="label"
          emit-value
          map-options
          hide-dropdown-icon
        />
        <q-select
        label-color="primary"
        filled
        bg-color="grey-2"
        readonly
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="inputData.grupo_cliente_c"
          :options="clientGroupOptions"
          type="text"
          label="Grupo cliente"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          hide-dropdown-icon
        />
        
        <q-input
        label-color="primary"
        filled
        bg-color="grey-2"
        readonly
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="inputData.fecha_entrega_c"
          type="date"
          label="Fecha de entrega"
        />
        <q-select
        label-color="primary"
        filled
        bg-color="grey-2"
        readonly
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="inputData.estado_c"
          :options="listEstado"
          type="text"
          label="Estado"
          option-value="value"
          option-label="label"
          hide-dropdown-icon
          emit-value
          map-options
        />
        <q-select
        label-color="primary"
        filled
        bg-color="grey-2"
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="inputData.lugar_entrega_c"
          :options="languageStore.deliveryOptions.place.data"
          readonly
          type="text"
          label="Lugar de entrega"
          option-value="value"
          option-label="label"
          hide-dropdown-icon
          emit-value
          map-options
        />
        <q-input
        label-color="primary"
        filled
        bg-color="grey-2"
        readonly
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="inputData.referencia_c"
          type="text"
          label="Referencia"  
        />
       
      </div>
    </template>
  </view-card-component>
  <AdvancedFilterCampaign
    ref="campaignFilterRef"
    @select-item="selectCampaign"
  />
</template>
