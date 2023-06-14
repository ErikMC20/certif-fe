<script lang="ts" setup>
import { ref, computed,onMounted } from 'vue';
import { CardInfo } from '../../../utils/types';
import { useFormOptionsStore } from 'src/stores/formOptionsStore';
import ViewCardVue from 'src/components/MainCard/ViewCard.vue';
import { QInput } from 'quasar';
import { userStore } from 'src/modules/Users/store/UserStore';
//import AdvancedFilterCampaign from 'src/modules/Prospects/components/AdvancedFilterCampaign.vue';
// import { useAsyncState } from '@vueuse/core';
//import { AccountStore } from 'src/modules/Accounts/store/AccountStore';
// import { ReadLeadFormat } from '../../../utils/types';
import { AccountStore } from 'src/modules/Accounts/store/AccountStore';
const reserveStore = AccountStore();
// const Account = AccountStore();
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

const baseCardAccount = ref<InstanceType<typeof ViewCardVue> | null>(null);
const nameLeadRef = ref<InstanceType<typeof QInput> | null>(null);
const dateClosedLeadRef = ref<InstanceType<typeof QInput> | null>(null);

const languageStore = useFormOptionsStore();
const loggedUserStore = userStore();
const userDivision = loggedUserStore.userCRM.iddivision || '03';

//* Computed variables
const isEditing = computed(() => baseCardAccount.value?.isEditing === 'edit');
const data = ref({
  tipocuenta_c:'',
  idcuentasap_c:'',
  nombre_comercial_c:'',
  tipo_documento_c:'',
  nit_ci_c:'',
  account_type:'',
  regimen_tributario_c:'',
  industry:'',
  names_c:'',
  lastname_c:'',
});
const data2 = ref({
  celular_c:''
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
  return inputData.value;
};

const restoreValues = () => {
  if (props.data) inputData.value = { ...props.data };
};
onMounted(async () => {
  const response= await reserveStore.getAccountsGet(props.id || '');
   data.value = response.info_account.detail_account;
   data2.value = response.phone_email_account;
  });

defineExpose({
  validateInputs,
  exposeData,
  isEditing,
});
</script>
<template>
   <!-- :controls="!!id" -->
  <view-card-component
   
    :initial-status="id ? 'read' : 'edit'"
    icon-name="feed"
    ref="baseCardAccount"
    title="Información de la cuenta"
    @cancel-change="restoreValues"
  >
    <template #edit>
      
      <div class="row q-col-gutter-lg" v-if="data.tipocuenta_c==='Empresa'">
        <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          
          dense
          v-model="data.tipocuenta_c"
          type="text"
          label="Tipo de cuenta"
          :rules="[(val) => !!val || 'Ingrese un nombre']"
        />
        <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          
          ref="nameLeadRef"
          dense
          v-model="data.idcuentasap_c"
          type="text"
          label="Codigo AIO"
         
        />
        <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          
          ref="nameLeadRef"
          dense
          v-model="data.name"
          type="text"
          label="Nombre"
          :rules="[(val) => !!val || 'Ingrese un nombre']"
        />

        <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          
          ref="nameLeadRef"
          dense
          v-model="data.nombre_comercial_c"
          type="text"
          label="Nombre Comercial"
          :rules="[(val) => !!val || 'Ingrese un nombre']"
        />

        <q-select
        
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="data.tipo_documento_c"
          :options="languageStore.accountOptions.documentsList"
          type="text"
          label="Tipo de documento"
          option-value="cod_doc"
      option-label="label"
          emit-value
          map-options
        />
      
        
        <q-input
        
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="data.nit_ci_c"
          type="text"
          label="NIT"
        />
        <q-select
        
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="data.account_type"
          :options="languageStore.accountOptions.accountType"
          type="text"
          label="Tipo cliente"
          option-value="cod_tipo"
      option-label="label"
          emit-value
          map-options
        />
        <q-select
        
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="data.regimen_tributario_c"
          :options="languageStore.accountOptions.taxRegime"
          type="text"
          label="Regimen tributario"
          option-value="cod_rt"
      option-label="label"
          emit-value
          map-options
        />
        <q-input
        
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="data2.celular_c"
          type="text"
          label="Teléfono celular"
        />

        <q-select
        
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="data.industry"
          :options="languageStore.accountOptions.industry"
          type="text"
          label="Rubro"
          option-value="cod_rubro"
      option-label="label"
          emit-value
          map-options
        />
      </div>
      <div class="row q-col-gutter-lg" v-else>
        <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          
          dense
          v-model="data.tipocuenta_c"
          type="text"
          label="Tipo de cuenta"
          :rules="[(val) => !!val || 'Ingrese un nombre']"
        />
        <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          
          ref="nameLeadRef"
          dense
          v-model="data.idcuentasap_c"
          type="text"
          label="Codigo AIO"
         
        />
        <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          
          ref="nameLeadRef"
          dense
          v-model="data.name"
          type="text"
          label="Nombre"
          :rules="[(val) => !!val || 'Ingrese un nombre']"
        />

        <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          
          ref="nameLeadRef"
          dense
          v-model="data.nombre_comercial_c"
          type="text"
          label="Nombre Comercial"
          :rules="[(val) => !!val || 'Ingrese un nombre']"
        />

        <q-select
        
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="data.tipo_documento_c"
          :options="languageStore.accountOptions.documentsList"
          type="text"
          label="Tipo de documento"
          option-value="cod_doc"
      option-label="label"
          emit-value
          map-options
        />
      
        
        <q-input
        
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="data.nit_ci_c"
          type="text"
          label="NIT"
        />
        <q-select
        
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="data.account_type"
          :options="languageStore.accountOptions.accountType"
          type="text"
          label="Tipo cliente"
          option-value="cod_tipo"
      option-label="label"
          emit-value
          map-options
        />
        <q-select
        
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="data.regimen_tributario_c"
          :options="languageStore.accountOptions.taxRegime"
          type="text"
          label="Regimen tributario"
          option-value="cod_rt"
      option-label="label"
          emit-value
          map-options
        />
        <q-input
        
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="data2.celular_c"
          type="text"
          label="Teléfono celular"
        />

        <q-select
        
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="data.industry"
          :options="languageStore.accountOptions.industry"
          type="text"
          label="Rubro"
          option-value="cod_rubro"
      option-label="label"
          emit-value
          map-options
        />
      </div>
    </template>
    <template #read>
     <!-- <pre>{{ data.tipocuenta_c }}</pre>  -->
      <div class="row q-col-gutter-lg" v-if="data.tipocuenta_c==='Empresa'">
        <q-input
        label-color="primary"
        filled
        bg-color="grey-2"
          class="col-12 col-sm-6 q-pb-none"
          outlined
          readonly
          dense
          v-model="data.tipocuenta_c"
          type="text"
          label="Tipo de cuenta"
          :rules="[(val) => !!val || 'Ingrese un nombre']"
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
          v-model="data.idcuentasap_c"
          type="text"
          label="Codigo AIO"
         
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
          v-model="data.name"
          type="text"
          label="Nombre"
          :rules="[(val) => !!val || 'Ingrese un nombre']"
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
          v-model="data.nombre_comercial_c"
          type="text"
          label="Nombre Comercial"
          :rules="[(val) => !!val || 'Ingrese un nombre']"
        />

        <q-select
        label-color="primary"
        filled
        bg-color="grey-2"
        readonly
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="data.tipo_documento_c"
          :options="languageStore.accountOptions.documentsList"
          type="text"
          label="Tipo de documento"
          option-value="cod_doc"
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
          v-model="data.nit_ci_c"
          type="text"
          label="NIT"
        />
        <q-select
        label-color="primary"
        filled
        bg-color="grey-2"
        readonly
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="data.account_type"
          :options="languageStore.accountOptions.accountType"
          type="text"
          label="Tipo cliente"
          option-value="cod_tipo"
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
          v-model="data.regimen_tributario_c"
          :options="languageStore.accountOptions.taxRegime"
          type="text"
          label="Regimen tributario"
          option-value="cod_rt"
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
          v-model="data2.celular_c"
          type="text"
          label="Teléfono celular"
        />

        <q-select
        label-color="primary"
        filled
        bg-color="grey-2"
        readonly
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="data.industry"
          :options="languageStore.accountOptions.industry"
          type="text"
          label="Rubro"
          option-value="cod_rubro"
      option-label="label"
          emit-value
          map-options
        />
      </div>
      <div class="row q-col-gutter-lg" v-else>
        <q-input
        label-color="primary"
        filled
        bg-color="grey-2"
          class="col-12 col-sm-6 q-pb-none"
          outlined
          readonly
          dense
          v-model="data.tipocuenta_c"
          type="text"
          label="Tipo de cuenta"
          :rules="[(val) => !!val || 'Ingrese un nombre']"
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
          v-model="data.idcuentasap_c"
          type="text"
          label="Codigo AIO"
         
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
          v-model="data.names_c"
          type="text"
          label="Nombres"
          :rules="[(val) => !!val || 'Ingrese un nombre']"
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
          v-model="data.lastname_c"
          type="text"
          label="Apellidos"
          :rules="[(val) => !!val || 'Ingrese un nombre']"
        />

        <q-select
        label-color="primary"
        filled
        bg-color="grey-2"
        readonly
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="data.tipo_documento_c"
          :options="languageStore.accountOptions.documentsList"
          type="text"
          label="Tipo de documento"
          option-value="cod_doc"
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
          v-model="data.nit_ci_c"
          type="text"
          label="CI"
        />
        <q-select
        label-color="primary"
        filled
        bg-color="grey-2"
        readonly
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="data.account_type"
          :options="languageStore.accountOptions.accountType"
          type="text"
          label="Tipo cliente"
          option-value="cod_tipo"
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
          v-model="data.regimen_tributario_c"
          :options="languageStore.accountOptions.taxRegime"
          type="text"
          label="Regimen tributario"
          option-value="cod_rt"
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
          v-model="data2.celular_c"
          type="text"
          label="Teléfono celular"
        />

        <q-select
        label-color="primary"
        filled
        bg-color="grey-2"
        readonly
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="data.industry"
          :options="languageStore.accountOptions.industry"
          type="text"
          label="Rubro"
          option-value="cod_rubro"
      option-label="label"
          emit-value
          map-options
        />
        
        
  
      </div>
    </template>
  </view-card-component>
 
</template>
