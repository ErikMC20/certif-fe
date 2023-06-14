<script lang="ts" setup>
import { ref, computed,onMounted } from 'vue';
import { CardInfo } from '../../../utils/types';
import { useFormOptionsStore } from 'src/stores/formOptionsStore';
import ViewCardVue from 'src/components/MainCard/ViewCard.vue';
import { QInput } from 'quasar';
import { userStore } from 'src/modules/Users/store/UserStore';
import { useReservasStore } from 'src/modules/Reservas/store/ReservasStore';
// import { CardInfoOpportunities } from '../../../utils/types';
import { ReservasTableStore } from 'src/modules/Reservas/store/ReservasTableStore';
const reserveStore = useReservasStore();
const tableStore = ReservasTableStore();
const props = withDefaults(
  defineProps<{
    id?: string;
    data?: '';
    readMode?: boolean;
  }>(),
  {
    readMode: true,
  }
);

const estadoOportunidad= [
      {
        label: 'Ganado',
        value: 'Ganado',
      },
      {
        label: 'En Tratamiento',
        value: 'EnTratamiento',
      },
      ,
      {
        label: 'Perdido',
        value: 'Perdido',
      },
];

const infoCardRefOp = ref<InstanceType<typeof ViewCardVue> | null>(null);
const nameLeadRef = ref<InstanceType<typeof QInput> | null>(null);
const dateClosedLeadRef = ref<InstanceType<typeof QInput> | null>(null);
const languageStore = useFormOptionsStore();
const loggedUserStore = userStore();
const userDivision = loggedUserStore.userCRM.iddivision || '03';
const dataReg = ref({
  name: '',
  idamercado_c:'',
  sales_stage:'',
  amount_usdollar:0,
  idgrupocliente_c:'',
  currency_id:'',
  estado_oportunidad_c:'',
  region_c:'',
  opportunity_type:'',
  date_closed:'',
});

//* Computed variables
const isEditing = computed(() => infoCardRefOp.value?.isEditing === 'edit');
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


const listTipo =  ref({});

const PhaseSalesOptions = computed(() => {
  const currentClientGroup = languageStore.phase.find(
    (val) => val.value == dataReg.value.opportunity_type
  );
  if (!!currentClientGroup) return currentClientGroup.phase;
  return [];
});

//* Default Functions
const setDefaultData = (): CardInfo => {
  const userAMercado = loggedUserStore.userCRM.idamercado || '';
  return {
    name: '',
    iddivision_c: userDivision,
    idamercado_c: userAMercado,
    idgrupocliente_c: '',
    description: '',
    currency_id: '-99',
    currency_name: '',
    currency_symbol: '',
    region_c: '01_01',
  };
};

//* variables
//const inputData = ref(!!props.data ? { ...props.data } : setDefaultData());

//* methods
const validateInputs = async () => {
  const validatedFields = await Promise.all([
    nameLeadRef.value?.validate(),
    dateClosedLeadRef.value?.validate(),
  ]);
  return validatedFields.every((field) => !!field);
};

const exposeData = () => {
  return dataReg.value;
};

// const restoreValues = () => {
//   if (props.data) 
//   inputData.value = { ...props.data };
// };

onMounted(async () => {
  listTipo.value = await tableStore.getTipoPhaseOpportunities();
  const response= await reserveStore.getReservasOpportunities(props.id || '');
  dataReg.value=response.data.attributes;
  });
defineExpose({
  validateInputs,
  exposeData,
  isEditing,
});
</script>
<template>
  <view-card-component
    :controls="!!id"
    :initial-status="readMode == true ? 'edit' : 'read'"
    icon-name="feed"
    ref="infoCardRefOp"
    title="Información de la oportunidad"
  >
  
    <template #edit>
      <div class="row q-col-gutter-lg">
        <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          ref="nameLeadRef"
          dense
          v-model="dataReg.name"
          type="text"
          label="Nombre de la oportunidad *"
          :rules="[(val) => !!val || 'Ingrese un nombre']"
        />
        <q-select
        
          v-model="dataReg.idamercado_c"
          :options="aMercadoOptions"
          option-value="cod_amercado"
          option-label="label"
          emit-value
          map-options
          class="col-12 col-sm-6"
          outlined
          dense
          label="Area de mercado"
        />
        <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          
          ref="nameLeadRef"
          dense
          v-model="dataReg.amount_usdollar"
          type="number"
          label="Monto"
          :rules="[(val) => !!val || 'Ingrese un numero']"
        />
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="dataReg.idgrupocliente_c"
          :options="clientGroupOptions"
          type="text"
          label="Grupo oportunidad"
          option-value="value"
          option-label="label"
          emit-value
          map-options
        />
        <q-select
        
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="dataReg.currency_id"
          :options="languageStore.leadCurrency"
          type="text"
          label="Moneda"
          option-value="id"
          option-label="name"
          emit-value
          map-options
        />
        <q-select
        
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="dataReg.estado_oportunidad_c"
          :options="estadoOportunidad"
          type="text"
          label="Estado de oportunidad"
          option-value="value"
          option-label="label"
          emit-value
          map-options
        />
        
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="dataReg.region_c"
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
          v-model="dataReg.opportunity_type"
          :options="listTipo"
          type="text"
          label="Tipo"
          option-value="value"
          option-label="label"
          emit-value
          map-options
        />
        <q-input
        
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="dataReg.date_closed"
          type="date"
          label="Fecha de cierre"
        />
        <q-select
        
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="dataReg.sales_stage"
          :options="PhaseSalesOptions"
          type="text"
          label="Fase de ventas"
          option-value="value"
          option-label="label"
          emit-value
          map-options
        >
        <template v-slot:label>
          <q-icon class="q-mr-xs" color="deep-orange" size="20px" name="notifications" />
          <span class="text-weight-bold text-deep-orange">Fase de ventas</span>
          
        </template>
      </q-select>
      </div>
    </template>
    <template #read>
      <!-- <pre>{{ languageStore.phase }}</pre> -->
      <div class="row q-col-gutter-lg">
        <q-input
        label-color="primary"
        filled
        bg-color="grey-2"
          class="col-12 col-sm-6 q-pb-none"
          outlined
          readonly
          ref="nameLeadRef"
          dense
          v-model="dataReg.name"
          type="text"
          label="Nombre de la oportunidad *"
          :rules="[(val) => !!val || 'Ingrese un nombre']"
        />
        <q-select
        label-color="primary"
        filled
        bg-color="grey-2"
        readonly
          v-model="dataReg.idamercado_c"
          :options="aMercadoOptions"
          option-value="cod_amercado"
          option-label="label"
          emit-value
          map-options
          class="col-12 col-sm-6"
          outlined
          dense
          label="Area de mercado"
        />
        <q-input
        label-color="primary"
        filled
        bg-color="grey-2"
          class="col-12 col-sm-6 q-pb-none"
          outlined
          readonly
          ref="nameLeadRef"
          dense
          v-model="dataReg.amount_usdollar"
          type="text"
          label="Monto"
          :rules="[(val) => !!val || 'Ingrese un nombre']"
        />
        <q-select
        label-color="primary"
        filled
        bg-color="grey-2"
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="dataReg.idgrupocliente_c"
          :options="clientGroupOptions"
          type="text"
          label="Grupo oportunidad"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          readonly
        />
        <q-select
        label-color="primary"
        filled
        bg-color="grey-2"
        readonly
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="dataReg.currency_id"
          :options="languageStore.leadCurrency"
          type="text"
          label="Moneda"
          option-value="id"
          option-label="name"
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
          v-model="dataReg.estado_oportunidad_c"
          :options="estadoOportunidad"
          type="text"
          label="Estado de oportunidad"
          option-value="value"
          option-label="label"
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
          v-model="dataReg.region_c"
          :options="regionesOptions"
          type="text"
          label="Region"
          option-value="cod_region"
          option-label="label"
          emit-value
          map-options
          readonly
        />
        
        <q-select
        label-color="primary"
        filled
        bg-color="grey-2"
        readonly
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="dataReg.opportunity_type"
          :options="listTipo"
          type="text"
          label="Tipo"
          option-value="value"
          option-label="label"
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
          v-model="dataReg.date_closed"
          type="date"
          label="Fecha de cierre"
        />
        <q-select
        label-color="primary"
        filled
        bg-color="grey-2"
        readonly
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="dataReg.sales_stage"
          :options="PhaseSalesOptions"
          type="text"
          label="Fase de ventas"
          option-value="value"
          option-label="label"
          emit-value
          map-options
        />
      </div>
    </template>
  </view-card-component>
  
</template>
