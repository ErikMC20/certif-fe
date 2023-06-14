<script lang="ts" setup>
import { ref, computed,onMounted } from 'vue';
import { CardInfo } from '../../../utils/types';
import { useFormOptionsStore } from 'src/stores/formOptionsStore';
import ViewCardVue from 'src/components/MainCard/ViewCard.vue';
import { QInput } from 'quasar';
import { userStore } from 'src/modules/Users/store/UserStore';
import { useReservasStore } from 'src/modules/Reservas/store/ReservasStore';
// import { CardInfoOpportunities } from '../../../utils/types';
//import { ReservasTableStore } from 'src/modules/Reservas/store/ReservasTableStore';
import {
  useUserDivision,
} from 'src/composables/useLanguage';
const reserveStore = useReservasStore();
//const tableStore = ReservasTableStore();
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
const { listUsers, getListUsers, filterUsers } = useUserDivision();
const infoCardRefCreateSAP = ref<InstanceType<typeof ViewCardVue> | null>(null);
const nameLeadRef = ref<InstanceType<typeof QInput> | null>(null);
const dateClosedLeadRef = ref<InstanceType<typeof QInput> | null>(null);

// const listUsers1 = ref([] as { [key: string]: string }[]);
const languageStore = useFormOptionsStore();
const loggedUserStore = userStore();
const userDivision = loggedUserStore.userCRM.iddivision || '03';

const optionsCanalDistribucion= [
{
        label: 'Showroom',
        value: '03_02_Showroom',
      },
      {
        label: 'Distribución',
        value: '03_01_Distribucion',
      },
      
];

const dataReg = ref({
  name: '',
  idamercado_c:'',
  idgrupocliente_c:'',
  iddivision_c:'',
  sales_stage:'',
  region_c:'',
  canal:'03_01_Distribucion',
  asignado:''
});

//* Computed variables
const isEditing = computed(() => infoCardRefCreateSAP.value?.isEditing === 'edit');
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
// const inputData = ref(!!props.data ? { ...props.data } : setDefaultData());


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
//   if (props.data) inputData.value = { ...props.data };
// };

onMounted(async () => {
  //listTipo.value = await tableStore.getTipoPhaseOpportunities();
  const response= await reserveStore.getReservasOpportunities(props.id || '');
  dataReg.value=response.data.attributes;
  dataReg.value.canal='03_02_Showroom';
  // dataReg.value.asignado=loggedUserStore.userCRM.id;
  await getListUsers(loggedUserStore.userCRM.iddivision);
 
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
    icon-name="contact_mail"
    ref="infoCardRefCreateSAP"
    title="Información organizacion ventas"
  >
    <template #edit>
      <div class="row q-col-gutter-lg">
        <q-select
        hide-dropdown-icon
        bg-color="grey-2"
          filled
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="dataReg.iddivision_c"
          :options="languageStore.leadsOptions.divisions"
          type="text"
          label="Division"
          option-value="cod_div"
          option-label="label"
          emit-value
          map-options
          readonly
        />
        <q-input

        bg-color="grey-2"
          filled
          class="col-12 col-sm-6 q-pb-none"
          outlined
          readonly
          dense
          v-model="dataReg.name"
          type="text"
          label="Nombre de la oportunidad *"
          :rules="[(val) => !!val || 'Ingrese un nombre']"
        />
        <q-select
        hide-dropdown-icon
        bg-color="grey-2"
          filled
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
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="dataReg.canal"
          :options="optionsCanalDistribucion"
          type="text"
          label="Canal de distribución"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          
        />
        <q-select
        hide-dropdown-icon
        bg-color="grey-2"
          filled
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="dataReg.region_c"
          :options="regionesOptions"
          type="text"
          label="Oficina de ventas"
          option-value="cod_region"
          option-label="label"
          emit-value
          map-options
          readonly
        />
        <q-select
        
        label="Asignado a"
            class="col-12 col-sm-6"
            v-model="dataReg.asignado"
            :options="listUsers"
            :use-input="true"
            dense
            outlined
            :use-chips="true"
            :input-debounce="0"
            option-value="id"
            option-label="user_name"            
            options-selected-class="text-deep-primary text-bold"
            :emit-value="true"
            :map-options="true"
            @filter="filterUsers"  
        />
       
      </div>
    </template>
    <template #read>
      <div class="row q-col-gutter-lg">
        <q-select
          class="col-12 col-sm-6"
          bg-color="grey-2"
          label-color="primary"
          filled
          dense
          v-model="dataReg.iddivision_c"
          :options="languageStore.leadsOptions.divisions"
          type="text"
          label="Division"
          option-value="cod_div"
          option-label="label"
          hide-dropdown-icon
          emit-value
          map-options
          readonly
        />
        <q-input
        bg-color="grey-2"
        label-color="primary"
          filled
          class="col-12 col-sm-6 q-pb-none"
          outlined
          readonly
          dense
          v-model="dataReg.name"
          type="text"
          label="Nombre de la oportunidad *"
          :rules="[(val) => !!val || 'Ingrese un nombre']"
        />
        <q-select
        hide-dropdown-icon
        label-color="primary"
        bg-color="grey-2"
          filled
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
        <q-select
        label-color="primary"
        bg-color="grey-2"
          filled
        hide-dropdown-icon
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="dataReg.canal"
          :options="optionsCanalDistribucion"
          type="text"
          label="Canal de distribución"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          readonly
        />
        <q-select
        label-color="primary"
        hide-dropdown-icon
        bg-color="grey-2"
          filled
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="dataReg.region_c"
          :options="regionesOptions"
          type="text"
          label="Oficina de ventas"
          option-value="cod_region"
          option-label="label"
          emit-value
          map-options
          readonly
        />
        <q-select
        label-color="primary"
        hide-dropdown-icon
        bg-color="grey-2"
          filled
        readonly
        label="Asignado a"
            class="col-12 col-sm-6"
            v-model="dataReg.asignado"
            :options="listUsers"
            :use-input="true"
            dense
            outlined
            :use-chips="true"
            :input-debounce="0"
            option-value="id"
            option-label="user_name"            
            options-selected-class="text-deep-primary text-bold"
            :emit-value="true"
            :map-options="true"
            @filter="filterUsers"  
        />
        <!-- <pre>{{ listUsers }}</pre> -->
      </div>
    </template>
  </view-card-component>
</template>

<!-- outlined
dense
v-model="dataReg.region_c"
:options="regionesOptions"
type="text"
label="Usuario asignado"
option-value="cod_region"
option-label="label"
emit-value
map-options -->
