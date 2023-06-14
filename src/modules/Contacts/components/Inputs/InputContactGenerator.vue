<script setup lang="ts">
import { ref, onMounted, watch, computed, inject } from 'vue';

import { DetailContactModel } from '../../utils/types/index';
import InputSelectCustom from 'src/modules/Accounts/components/Inputs/InputSelectCustom.vue';
import InputCustom from 'src/modules/Accounts/components/Inputs/InputCustom.vue';
import InputDateCustom from './InputDateCustom.vue';
import { useCRMValidator } from '../../composables/useCRMValidator';
import { RowTableModel } from '../../utils/types/index';
import { readRepeatedNITCI } from 'src/services/InputServices';
import moment from 'moment';
import { QInput } from 'quasar';
import { selectedRepeatedKey } from '../../utils/ProvideKeys';
import { RowTableCINITModel } from '../../../../components/types/index';

const props = withDefaults(
  defineProps<{
    modelValue: DetailContactModel;
    options: {
      salutation: { [key: string]: string }[];
      documentType: { [key: string]: string }[];
      gender: { [key: string]: string }[];
      civilStatus: { [key: string]: string }[];
      industry: { [key: string]: string | { [key: string]: string }[] }[];
      countries: { [key: string]: string | { [key: string]: string }[] }[];
    };
  }>(),
  {
    options: () => ({
      salutation: [],
      documentType: [],
      gender: [],
      civilStatus: [],
      industry: [],
      countries: [],
    }),
  }
);

const emits = defineEmits<{
  (event: 'update:modelValue', values: DetailContactModel): void;
}>();

const selectRepeated = inject(selectedRepeatedKey);
//* composable variables
const { generateValidators } = useCRMValidator();

//* references
const salutationFieldRef = ref<InstanceType<typeof InputSelectCustom> | null>(
  null
);
const nameFieldRef = ref<InstanceType<typeof InputCustom> | null>(null);
const lastnameFieldRef = ref<InstanceType<typeof InputCustom> | null>(null);
const nitCIInputFieldRef = ref<InstanceType<typeof QInput> | null>(null);
const industryFieldRef = ref<InstanceType<typeof InputSelectCustom> | null>(
  null
);
const subindustryFieldRef = ref<InstanceType<typeof InputSelectCustom> | null>(
  null
);
const birthDateFieldRef = ref<InstanceType<typeof InputDateCustom> | null>(
  null
);

//* variables
const accountInfoLocal = ref({} as DetailContactModel);

//* computed variables
const currentSubIndustry = computed(() => {
  if (!Object.values(props.options).length) return [];
  const opt = props.options.industry.find(
    (val) => val.cod_rubro === accountInfoLocal.value.industry_c
  );
  return opt ? opt['subrubro'] : [];
});

const currentState = computed(() => {
  if (!Object.values(props.options).length) return [];
  const opt = props.options.countries.find(
    (val) => val.cod_pais === accountInfoLocal.value.primary_address_country
  );
  return opt ? opt['regiones'] : [];
});

//* methods
const assignData = (data: DetailContactModel) => {
  accountInfoLocal.value = data;
  if (data.birthdate)
    accountInfoLocal.value.birthdate = moment(
      data.birthdate,
      'YYYY-MM-DD'
    ).format('DD-MM-YYYY');
  birthDateFieldRef.value?.resetValidation();
};

const getCurrentData = () => {
  return accountInfoLocal.value;
};

const validateFields = async () => {
  const validNIT = await nitCIInputFieldRef.value?.validate();

  let fields = [
    salutationFieldRef.value?.validateField(),
    nameFieldRef.value?.validateField(),
    lastnameFieldRef.value?.validateField(),
    industryFieldRef.value?.validateField(),
    subindustryFieldRef.value?.validateField(),
    validNIT,
  ];

  return fields.every((field) => !!field);
};

const repeatedDialogOpen = ref(false);
const repeatedDialogData = ref([] as RowTableModel[]);
const initialCIValue = ref('');
const checkRepeatetNITCI = async (val: string) => {
  repeatedDialogData.value = [];
  if (initialCIValue.value === val) {
    return true;
  }
  const dataRepeated = await readRepeatedNITCI(val, 'contact');

  if (dataRepeated.length > 0) {
    repeatedDialogData.value = dataRepeated;
    return 'Se han encontrado datos repetidos';
  }
  return true;
};

const subIndustryValidation = (val: string) => {
  if (currentSubIndustry.value.length === 0 && !val) {
    return true;
  } else if (!val) return 'El Campo es obligatorio';
  else true;
};

let validation = false;
const validateBirthInput = (val: string) => {
  if (!validation) {
    validation = true;
    return true;
  }
  return (
    moment(val, 'DD-MM-YYYY').isBefore(moment()) || 'No es una fecha válida'
  );
};

const captureStateFields = (val: string) => {
  if (typeof currentState.value === 'object') {
    const labelValue = currentState.value.find(
      (state) => state.cod_region === val
    )?.label;

    accountInfoLocal.value.primary_address_state =
      accountInfoLocal.value.alt_address_state = labelValue || '';
    accountInfoLocal.value.alt_address_state_list_c = val;
  }
};

const assignGender = (newValue: string) => {
  if (newValue === 'Dr.' || newValue === 'Mr.') {
    accountInfoLocal.value['genero_c'] = 'male';
    return;
  }
  if (newValue === 'Dra.' || newValue === 'Mrs.') {
    accountInfoLocal.value['genero_c'] = 'female';
    return;
  }
  accountInfoLocal.value['genero_c'] = '';
};

const handleRepeated = (value: RowTableCINITModel) => {
  if (selectRepeated) {
    selectRepeated.selectedRepeatedCb(value.id);
  }
  repeatedDialogOpen.value = false;
};

//* watch functions
watch(accountInfoLocal, () => {
  emits('update:modelValue', accountInfoLocal.value);
});

//* first function
onMounted(() => {
  initialCIValue.value = props.modelValue.ci_c;
  if (!!props.modelValue) {
    assignData(props.modelValue);
  }
});

defineExpose({
  accountInfoLocal,
  assignData,
  getCurrentData,
  validateFields,
});
</script>

<template>
  <div class="row">
    <ci-repeated-dialog-component
      v-model="repeatedDialogOpen"
      :data="repeatedDialogData"
      :selectable="selectRepeated && selectRepeated.fromConversion"
      module="contacts"
      @expose-selected="handleRepeated"
    />
    <InputSelectCustom
      ref="salutationFieldRef"
      v-model="accountInfoLocal['salutation']"
      label="* Saludo"
      :options="options.salutation"
      option-value="value"
      option-label="label"
      :rules="generateValidators(['fieldRequired'])"
      @update:model-value="assignGender"
    />
    <InputDateCustom
      ref="birthDateFieldRef"
      mask="##-##-####"
      v-model="accountInfoLocal['birthdate']"
      label="Fecha de nacimiento"
      :rules="[validateBirthInput]"
    />
    <InputCustom
      ref="nameFieldRef"
      v-model="accountInfoLocal['first_name']"
      label="* Nombres"
      :rules="generateValidators(['fieldRequired', 'validName'])"
    />
    <InputCustom
      ref="lastnameFieldRef"
      v-model="accountInfoLocal['last_name']"
      label="* Apellidos"
      :rules="generateValidators(['fieldRequired'])"
    />
    <q-input
      ref="nitCIInputFieldRef"
      class="col-12 col-sm-6 q-px-xs q-pb-xs q-mb-md"
      dense
      outlined
      color="primary"
      debounce="500"
      v-model="accountInfoLocal['ci_c']"
      type="text"
      label="CI"
      :rules="[...generateValidators(['fieldRequired']), checkRepeatetNITCI]"
    >
      <template #append>
        <q-btn
          v-if="repeatedDialogData.length > 0"
          color="warning"
          size="xs"
          icon="warning"
          round
          @click="repeatedDialogOpen = true"
        >
          <q-tooltip> Se han encontrado datos repetidos </q-tooltip>
        </q-btn>
      </template>
    </q-input>
    <InputSelectCustom
      v-model="accountInfoLocal['genero_c']"
      label="Genero"
      :options="options.gender"
      option-value="value"
      option-label="label"
    />
    <InputSelectCustom
      v-model="accountInfoLocal['estado_civil_c']"
      label="Estado civil"
      :options="options.civilStatus"
      option-value="value"
      option-label="label"
    />
    <InputSelectCustom
      ref="industryFieldRef"
      v-model="accountInfoLocal['industry_c']"
      label="rubro"
      :options="options.industry"
      option-value="cod_rubro"
      option-label="label"
      @update:model-value="
        accountInfoLocal.subindustry_c = '';
        subindustryFieldRef?.validateField();
      "
      :rules="generateValidators(['fieldRequired'])"
    />
    <InputSelectCustom
      ref="subindustryFieldRef"
      v-model="accountInfoLocal['subindustry_c']"
      label="subrubro"
      :options="currentSubIndustry"
      option-value="cod_subrubro"
      option-label="label"
      :rules="[subIndustryValidation]"
    />
    <InputSelectCustom
      v-model="accountInfoLocal['primary_address_country']"
      label="Pais"
      :options="options.countries"
      option-value="cod_pais"
      option-label="label"
      @update:model-value="accountInfoLocal.primary_address_state_list_c = ''"
      :rules="generateValidators(['fieldRequired'])"
    />
    <InputSelectCustom
      v-model="accountInfoLocal['primary_address_state_list_c']"
      @update:model-value="captureStateFields"
      label="Departamento"
      :options="currentState"
      option-value="cod_region"
      option-label="label"
      :rules="generateValidators(['fieldRequired'])"
    />
    <InputCustom
      v-model="accountInfoLocal['primary_address_city']"
      label="Ciudad"
      :rules="generateValidators(['fieldRequired'])"
    />
    <!-- <InputCustom
      v-model="accountInfoLocal['description']"
      label="Descripcion"
      auto-grow
    /> -->
    <InputCustom v-model="accountInfoLocal['title']" label="Cargo" />
    <!-- <div class="col-12 col-sm-6 q-px-xs q-pb-xs q-mb-md">
      <span>{{
        accountInfoLocal.genero_c === 'male'
          ? 'Padre'
          : accountInfoLocal.genero_c === 'female'
          ? 'Madre'
          : 'Padre/Madre'
      }}</span>
      <q-radio
        v-model="accountInfoLocal['is_parents_c']"
        checked-icon="task_alt"
        unchecked-icon="panorama_fish_eye"
        :val="1"
        label="Si"
      />
      <q-radio
        v-model="accountInfoLocal['is_parents_c']"
        checked-icon="task_alt"
        unchecked-icon="panorama_fish_eye"
        :val="0"
        label="No"
      />
    </div> -->
    <q-checkbox
      v-model="accountInfoLocal['is_parents_c']"
      :label="
        accountInfoLocal.genero_c === 'male'
          ? 'Padre'
          : accountInfoLocal.genero_c === 'female'
          ? 'Madre'
          : 'Padre/Madre'
      "
      :true-value="1"
      :false-value="0"
    />
    <!-- <pre>{{ accountInfoLocal }}</pre> -->
  </div>
</template>
