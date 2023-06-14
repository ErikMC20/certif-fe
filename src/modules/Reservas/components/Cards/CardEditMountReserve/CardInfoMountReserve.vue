<script lang="ts" setup>
import { ref, computed,onMounted,watch  } from 'vue';
import { CardInfo } from '../../../utils/types';
import { useFormOptionsStore } from 'src/stores/formOptionsStore';
import ViewCardVue from 'src/components/MainCard/ViewCard.vue';
import { QInput } from 'quasar';
import { userStore } from 'src/modules/Users/store/UserStore';
import { useReservasStore } from 'src/modules/Reservas/store/ReservasStore';
import Notification from 'src/modules/Accounts/utils/notify';
import { Loading, QSpinnerPuff } from 'quasar';
const reserveStore = useReservasStore();
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
const baseCardMountReserve = ref<InstanceType<typeof ViewCardVue> | null>(null);
const nameLeadRef = ref<InstanceType<typeof QInput> | null>(null);
const dateClosedLeadRef = ref<InstanceType<typeof QInput> | null>(null);
const languageStore = useFormOptionsStore();
const loggedUserStore = userStore();
const userDivision = loggedUserStore.userCRM.iddivision || '03';

//* Computed variables
const isEditing = computed(() => baseCardMountReserve.value?.isEditing === 'edit');
const monto2 = computed(() => {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
  });
  return formatter.format(data.value.monto);
} );

const data = ref({
  name: '',
  monto: '',
  description: '',
  currency_id: '-99',
  tipo: '02_Anticipo',
});
const tipoMonto=[
  {
    label:'Vehiculo',
    value:'01_Vehiculo'
  },
  {
    label:'Anticipo',
    value:'02_Anticipo'
  },
  {
    label:'Deposito en garantia',
    value:'03_deposito'
  }
]

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
const inputData = ref(!!props.data ? { ...props.data } : setDefaultData());

//* methods
const validateInputs = async () => {
  const validatedFields = await Promise.all([
    nameLeadRef.value?.validate(),
    dateClosedLeadRef.value?.validate(),
  ]);
  return validatedFields.every((field) => !!field);
};

const exposeData = () => {
  return data.value;
};

const restoreValues = () => {
  if (props.data) inputData.value = { ...props.data };
};
onMounted(async () => {
  if(props.id!=''){  
    
    
    Loading.show({
      spinner: QSpinnerPuff,
      message: 'Cargando informacion',
    })

    try {
      const response= await reserveStore.getMountDetailReserve(props.id || '');
      data.value = response.data.attributes;
      const num = parseFloat(data.value.monto);
      data.value.monto=num.toFixed(2);
      Loading.hide();

    } catch (error) {
      Loading.hide();
      
      Notification(
        'negative',
        'warning',
        '<strong> Ops! algo salió mal </strong> <br/>Ocurrió un error al cargar la información.'
      );
      throw error;
    }

  const response= await reserveStore.getMountDetailReserve(props.id || '');
  data.value = response.data.attributes;
  const num = parseFloat(data.value.monto);
  data.value.monto=num.toFixed(2);
  }

  });
//  const formatValue = () => {
//   const num = parseFloat(data.value.monto);
//   if (!isNaN(num)) {
//     data.value.monto = num.toFixed(2);
//   }
// }
const quitarDecimales = (event:any) => {
  const num = parseFloat(data.value.monto);
  if (isNaN(num)) {
    console.log('El número no es un número válido.');
  } else if (Number.isInteger(num)) {
    const valor = parseFloat(event.target.value).toFixed(0);
    data.value.monto = valor;
  } else {
    const valor = parseFloat(event.target.value).toFixed(2);
    data.value.monto = valor;
  }
}

const agregarDecimales = (event:any) => {
  data.value.monto = parseFloat(data.value.monto).toFixed(2);
}

defineExpose({
  validateInputs,
  exposeData,
  isEditing,
});
</script>
<template>
   <!-- :controls="!!id" -->
  <view-card-component
  :controls="!!id"
    :initial-status="id ? 'read' : 'edit'"
    icon-name="feed"
    ref="baseCardMountReserve"
    title="Información "
    @cancel-change="restoreValues"
  >  
    <template #read>
     <div class="row q-col-gutter-lg" >
        <q-input
          class="col-12 col-sm-6 q-pb-none"
          readonly
          outlined          
          dense
          v-model="data.name"
          type="text"
          label="Nombre"
          :rules="[(val) => !!val || 'Ingrese un nombre']"
        />
        <q-select
        readonly
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="data.tipo "
          :options="tipoMonto "
          type="text"
          label="Tipo"
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
        v-model="data.currency_id"
        :options="languageStore.leadCurrency"
        type="text"
        label="Moneda"
        option-value="id"
        option-label="name"
        emit-value
        map-options
      />
        <q-input
        readonly
          class="col-12 col-sm-6 q-pb-none"
          outlined          
          ref="nameLeadRef"
          dense    
          v-model="monto2"
          type="text"
          label="Monto"
         
        />
        <q-input
        readonly
          class="col-12 q-pb-none"
          outlined          
          ref="nameLeadRef"
          dense
          v-model="data.description"
          type="textarea"
          label="Descripción"
          :rules="[(val) => !!val || 'Ingrese un nombre']"
        />       
      </div>
    </template> 
    <template #edit>
      
      <div class="row q-col-gutter-lg" >
        <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="data.name"
          type="text"
          label="Nombre"
          :rules="[(val) => !!val || 'Ingrese un nombre']"
        />
        <q-select
        
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="data.tipo"
          :options="tipoMonto"
          type="text"
          label="Tipo"
          option-value="value"
      option-label="label"
          emit-value
          map-options
        />
        <q-select
        
        class="col-12 col-sm-6"
        outlined
        dense
        v-model="data.currency_id"
        :options="languageStore.leadCurrency"
        type="text"
        label="Moneda"
        option-value="id"
        option-label="name"
        emit-value
        map-options
      />
        <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="data.monto"
          type="number"
          label="Monto"  
          :onFocus="quitarDecimales" :onBlur="agregarDecimales"
        />
        
        <q-input
          class="col-12 q-pb-none"
          outlined          
          ref="nameLeadRef"
          dense
          v-model="data.description"
          type="textarea"
          label="Descripción"
          :rules="[(val) => !!val || 'Ingrese un nombre']"
        />    
      </div>
    </template>
  
  </view-card-component>
 
</template>
