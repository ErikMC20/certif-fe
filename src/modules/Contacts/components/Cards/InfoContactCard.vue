<script lang="ts">
import { ref, computed, onMounted } from 'vue';
import ViewCardVue from 'src/components/MainCard/ViewCard.vue';
import InputContactGenerator from '../Inputs/InputContactGenerator.vue';

import CardLabels from '../Labels/CardLabels.vue';
import { LabelModel, DetailContactModel } from '../../utils/types/index';
import { StatusCard } from 'src/components/types';
import { useAsyncState } from '@vueuse/core';
import { api } from 'src/boot/axios';
import { CRM4_LB_05 } from 'src/conections/api_conectors';
import moment from 'moment';
</script>

<script setup lang="ts">
const props = defineProps<{
  idLocal?: string;
  initialDataContact: DetailContactModel;
  isLoading?: boolean;
}>();

//* composable variables
const {
  state,
  isLoading: isLoadingLanguage,
  execute,
} = useAsyncState(
  Promise.all([
    api.get(`${CRM4_LB_05}/salutation-dom-lists`),
    api.get(`${CRM4_LB_05}/tipo-documento-list`),
    api.get(`${CRM4_LB_05}/gender-lists`),
    api.get(`${CRM4_LB_05}/estado-civil-lists`),
    api.get(`${CRM4_LB_05}/dimrubro-dimsubrubro`),
    api.get(`${CRM4_LB_05}/pais-list`),
  ]).then(
    ([salutation, documentType, gender, civilStatus, industry, countries]) => {
      return {
        salutation: salutation.data,
        documentType: documentType.data,
        gender: gender.data,
        civilStatus: civilStatus.data,
        industry: industry.data,
        countries: countries.data,
      };
    }
  ),
  {
    salutation: [],
    documentType: [],
    gender: [],
    civilStatus: [],
    industry: [],
    countries: [],
  },
  {
    immediate: false,
    resetOnExecute: false,
  }
);

//* variables
const localIdAccount = ref('');
const localData = ref({
  industry_c: 'N0',
  subindustry_c: 'N0_N05',
  principal_c: 0,
  is_parents_c: null,
} as DetailContactModel);
const localDataCurrent = ref({} as DetailContactModel);
const contactInfoLabels = ref([] as LabelModel[]);
const localOptions = ref({});

//* references
const baseCardRef = ref<InstanceType<typeof ViewCardVue> | null>(null);
const inputContactGeneratorRef = ref<InstanceType<
  typeof InputContactGenerator
> | null>(null);

//* computed variables
const isEditing = computed(() => {
  return baseCardRef.value?.isEditing === 'edit';
});

//* methods
const makeLabels = (
  data: DetailContactModel,
  options: { [key: string]: string | { [key: string]: string }[] }
) => {
  console.log('Show this', data);
  const salutation =
    state.value.salutation.find(
      (val: { [key: string]: string }) => val.value === data.salutation
    )?.label || '';
  const fullName = `${salutation} ${data.first_name} ${data.last_name}`.trim();
  contactInfoLabels.value = [
    {
      title: 'Nombre',
      value: `${fullName}`,
    },
    {
      title: 'Fecha de nacimiento',
      value: `${
        data.birthdate
          ? moment(data.birthdate, 'YYYY-MM-DD').format('DD-MM-YYYY')
          : ''
      }`,
    },
    {
      title: 'CI',
      value: `${data.ci_c || ''}`,
    },
    {
      title: 'Genero',
      // value: `${data.genero_c || ''}`,
      value: `${
        options['gender'].find((val) => val.value === data.genero_c)?.label ||
        ''
      }`,
    },
    {
      title: 'Estado Civil',
      value: `${
        options['civilStatus'].find((val) => val.value === data.estado_civil_c)
          ?.label || ''
      }`,
    },
    {
      title: 'Rubro',
      value: `${
        options['industry'].find((val) => val.cod_rubro === data.industry_c)
          ?.label || ''
      }`,
    },
    {
      title: 'Subrubro',
      value: `${labelSubrubro(data.industry_c, data.subindustry_c, options)}`,
    },
    {
      title: 'Departamento',
      value: `${labelDepartamento(
        data.primary_address_country,
        data.primary_address_state_list_c,
        options
      )}`,
    },
    {
      title: 'Ciudad',
      value: `${data.primary_address_city || ''}`,
    },
    {
      title: 'Es Padre/Madre',
      value: `${
        data.is_parents_c === 1
          ? data.genero_c === 'male'
            ? 'Padre'
            : data.genero_c === 'female'
            ? 'Madre'
            : 'Padre/Madre'
          : 'No Asignado'
      }`,
    },
    {
      title: 'Cargo',
      value: `${data.title}`,
    },
  ];
};

const labelSubrubro = (
  industry: string,
  subIndustry: string,
  options: { [key: string]: string | { [key: string]: string }[] }
) => {
  const currentIndustry = options['industry'].find(
    (val) => val.cod_rubro === industry
  );
  if (!currentIndustry) return '';
  const currentSubindustry = currentIndustry['subrubro'].find(
    (val) => val.cod_subrubro === subIndustry
  );
  if (currentSubindustry) return currentSubindustry.label;
  return '';
};

const labelDepartamento = (
  country: string,
  state: string,
  options: { [key: string]: string | { [key: string]: string }[] }
) => {
  const currentCountry = options['countries'].find(
    (val) => val.cod_pais === country
  );
  if (!currentCountry) return '';
  const currentState = currentCountry['regiones'].find(
    (val) => val.cod_region === state
  );
  if (currentState) return currentState.label;
  return '';
};

const restoreData = async () => {
  localDataCurrent.value = { ...localData.value };
  await execute();
  localOptions.value = state.value;
  makeLabels(localData.value, localOptions.value);
};

const constructorComp = (data?: DetailContactModel, id?: string) => {
  if (data && !id) {
    if (Object.values(data).length === 0) {
      restoreData();
      changeStatusTo('edit');
      return;
    }
    localData.value = data;
    restoreData();
    changeStatusTo('edit');
    return;
  }
  if (!id) {
    console.log('noId...', localData.value);
    changeStatusTo('edit');
    return;
  }
  if (data) {
    console.log('data and ID...', localData.value);
    if (data.id) localIdAccount.value = data.id;
    localData.value = data;

    restoreData();
    changeStatusTo('read');
  }
};

const changeStatusTo = (newStatus: StatusCard) => {
  baseCardRef.value?.changeStatusTo(newStatus);
};

const validateFields = async () => {
  return await inputContactGeneratorRef.value?.validateFields();
};

const captureCurrentData = () => {
  return localDataCurrent.value;
};

const activateControls = (newId: string) => {
  localIdAccount.value = newId;
};

const setAccountId = (userId: string) => {
  localDataCurrent.value.account_id = userId;
};

//* initial function
onMounted(() => {
  constructorComp(props.initialDataContact, props.idLocal);
});

const cancelButton = () => {
  localDataCurrent.value = { ...localData.value };
  console.log(localDataCurrent.value);
};

const cancelChanges = () => {
  baseCardRef.value?.onClickCancel();
};

defineExpose({
  isEditing,
  activateControls,
  constructorComp,
  cancelChanges,
  captureCurrentData,
  changeStatusTo,
  restoreData,
  setAccountId,
  validateFields,
});
</script>

<template>
  <view-card-component
    :controls="!!localIdAccount"
    initial-status="read"
    icon-name="feed"
    title="Informacion del Contacto"
    ref="baseCardRef"
    :is-loading="isLoading && isLoadingLanguage"
    @cancel-change="cancelButton"
  >
    <template #headerFieldEdit>
      <q-checkbox
        v-model="localDataCurrent.principal_c"
        :true-value="1"
        :false-value="0"
        class="q-pr-md"
      >
        <q-tooltip> Contacto Principal </q-tooltip>
      </q-checkbox>
    </template>
    <template #headerFieldRead>
      <q-checkbox
        disable
        v-model="localDataCurrent.principal_c"
        :true-value="1"
        :false-value="0"
        class="q-pr-md"
      >
        <q-tooltip> Contacto Principal </q-tooltip>
      </q-checkbox>
    </template>
    <template #edit>
      <!-- <pre>{{ localDataCurrent }}</pre> -->
      <InputContactGenerator
        ref="inputContactGeneratorRef"
        :options="state"
        v-model="localDataCurrent"
      />
    </template>
    <template #read>
      <CardLabels :labels="contactInfoLabels" class="q-px-md" />
    </template>
  </view-card-component>
</template>
