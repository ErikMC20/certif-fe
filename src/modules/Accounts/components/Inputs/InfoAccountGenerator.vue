<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import {
  AccountModel,
  DetailAccountModel,
  RowTableModel,
} from '../../utils/types';
import InputCustom from './InputCustom.vue';
import InputSelectCustom from './InputSelectCustom.vue';
import { useCRMValidator } from '../../composables/useCRMValidator';
import { AccountStore } from '../../store/AccountStore';
import { useFormOptionsStore } from 'src/stores/formOptionsStore';

interface OptionBase {
  [key: string]: string;
}

interface OptionWithChildren {
  [key: string]: string | OptionBase[];
}

interface OptionAccountInfo {
  tipo_documento_c: OptionBase[];
  account_type: OptionBase[];
  regimen_tributario_c: OptionBase[];
  industry: OptionWithChildren[];
  billing_address_country: OptionWithChildren[];
}

const props = withDefaults(
  defineProps<{
    accountType: AccountModel;
    modelValue: DetailAccountModel;
    options: OptionAccountInfo;
    editMode?: boolean;
    currentId?: string;
    readMode?: boolean;
  }>(),
  {
    editMode: false,
    currentId: '',
    readMode: false,
  }
);
const emits = defineEmits<{
  (event: 'update:modelValue', values: DetailAccountModel): void;
}>();

const { readRepeatedNITCI } = AccountStore();
const { generateValidators } = useCRMValidator();
const languageStore = useFormOptionsStore();

const nameInputFieldRef = ref<InstanceType<typeof InputCustom> | null>(null);
const namesInputFieldRef = ref<InstanceType<typeof InputCustom> | null>(null);
const nameCommercialinputFieldRef = ref<InstanceType<
  typeof InputCustom
> | null>(null);
const lastNameInputFieldRef = ref<InstanceType<typeof InputCustom> | null>(
  null
);
const nitCIInputFieldRef = ref<InstanceType<typeof InputCustom> | null>(null);
const cityInputFieldRef = ref<InstanceType<typeof InputCustom> | null>(null);

const industrySelectFieldRef = ref<InstanceType<
  typeof InputSelectCustom
> | null>(null);
const subIndustryFieldRef = ref<InstanceType<typeof InputSelectCustom> | null>(
  null
);
const countrySelectFieldRef = ref<InstanceType<
  typeof InputSelectCustom
> | null>(null);
const stateSelectFieldRef = ref<InstanceType<typeof InputSelectCustom> | null>(
  null
);
const accountSelectFieldRef = ref<InstanceType<
  typeof InputSelectCustom
> | null>(null);

const accountTypeLocal = ref<AccountModel>(props.accountType || 'Privada');
const localData = ref({} as DetailAccountModel);

const subIndustryOptions = computed(() => {
  if (!Object.values(languageStore.accountOptions).length) return [];
  const subOption = languageStore.accountOptions.industry.find(
    (option: { cod_rubro: string }) =>
      option.cod_rubro === localData.value.industry
  );
  if (subOption) {
    return subOption['subrubro'];
  }
  return [];
});

const stateOptions = computed(() => {
  if (!Object.values(languageStore.accountOptions).length) return [];
  const subOption = languageStore.accountOptions.countries.find(
    (option: { cod_pais: string }) =>
      option.cod_pais === localData.value.billing_address_country
  );
  if (subOption) {
    return subOption['regiones'];
  }
  return [];
});

const changeType = (val: AccountModel) => {
  console.log(val);
  accountTypeLocal.value = val;
};

const repeatedDialogOpen = ref(false);
const repeatedDialogData = ref([] as RowTableModel[]);
const initialCIValue = ref('');
const checkRepeatetNITCI = async (val: string) => {
  console.log('your CI Value', initialCIValue.value);
  if (initialCIValue.value === val) {
    return true;
  }
  const dataRepeated = await readRepeatedNITCI(val, 'account');

  if (dataRepeated.length > 0) {
    console.log(Object.keys(dataRepeated[0]));
    repeatedDialogData.value = dataRepeated;
    repeatedDialogOpen.value = true;
    if (props.accountType === 'Empresa') return true;
    return 'Se han encontrado datos repetidos';
  }
  return true;
};

watch(localData, () => {
  emits('update:modelValue', localData.value);
});

const validateFields = async () => {
  const validNIT = await nitCIInputFieldRef.value?.validateField();

  let fields = [
    cityInputFieldRef.value?.validateField(),
    industrySelectFieldRef.value?.validateField(),
    subIndustryFieldRef.value?.validateField(),
    countrySelectFieldRef.value?.validateField(),
    stateSelectFieldRef.value?.validateField(),
    validNIT,
  ];

  if (accountTypeLocal.value === 'Empresa') {
    fields = [
      ...fields,
      namesInputFieldRef.value?.validateField(),
      nameCommercialinputFieldRef.value?.validateField(),
    ];
  } else if (accountTypeLocal.value === 'Privada') {
    fields = [
      ...fields,
      nameInputFieldRef.value?.validateField(),
      lastNameInputFieldRef.value?.validateField(),
    ];
  }

  return fields.every((val) => {
    return val === true;
  });
};

const subIndustryValidation = (val: string) => {
  if (subIndustryOptions.value.length === 0 && !val) {
    return true;
  } else if (!val) return 'El Campo es obligatorio';
  else true;
};

onMounted(() => {
  localData.value = props.modelValue;
  initialCIValue.value = props.modelValue.nit_ci_c;
  if (accountTypeLocal.value === 'Empresa') {
    localData.value = {
      ...localData.value,
      tipocuenta_c: 'Empresa',
    };
  } else if (accountTypeLocal.value === 'Privada') {
    localData.value = {
      ...localData.value,
      tipocuenta_c: 'Privada',
    };
  }
  if (!props.modelValue.tipo_documento_c) {
    if (accountTypeLocal.value === 'Empresa') {
      localData.value = {
        ...localData.value,
        tipo_documento_c: '03',
      };
    } else if (accountTypeLocal.value === 'Privada') {
      localData.value = {
        ...localData.value,
        tipo_documento_c: '01',
      };
    }
  }
});

defineExpose({
  validateFields,
});
</script>

<template>
  <q-dialog class="full-dialog" v-model="repeatedDialogOpen">
    <table-dialog-ci-component :data="repeatedDialogData" />
  </q-dialog>
  <div class="row">
    <InputCustom
      ref="nameInputFieldRef"
      v-if="accountTypeLocal === 'Privada'"
      v-model="localData['names_c']"
      label="* Nombres"
      :rules="generateValidators(['fieldRequired', 'validName'])"
      :readonly="readMode"
    />
    <InputCustom
      ref="namesInputFieldRef"
      v-else
      v-model="localData['name']"
      label="* Nombres"
      :readonly="readMode"
      :rules="generateValidators(['fieldRequired', 'validName'])"
    />
    <InputCustom
      ref="nameCommercialinputFieldRef"
      v-if="accountTypeLocal === 'Empresa'"
      v-model="localData['nombre_comercial_c']"
      :readonly="readMode"
      label="Nombre Comercial"
    />
    <InputCustom
      ref="lastNameInputFieldRef"
      v-else
      v-model="localData['lastname_c']"
      :readonly="readMode"
      label="* Apellidos"
      :rules="generateValidators(['fieldRequired', 'validLastName'])"
    />
    <InputSelectCustom
      v-model="localData['tipo_documento_c']"
      :readonly="readMode"
      label="Tipo de documento"
      :options="languageStore.accountOptions.documentsList"
      option-value="cod_doc"
      option-label="label"
    />
    <InputCustom
      ref="nitCIInputFieldRef"
      v-model="localData['nit_ci_c']"
      :readonly="readMode"
      :label="accountType === 'Empresa' ? '*NIT' : '*CI'"
      :rules="[
        ...generateValidators(['fieldRequired', 'validNITCI']),
        checkRepeatetNITCI,
      ]"
    />
    <InputSelectCustom
      v-model="localData['account_type']"
      :readonly="readMode"
      label="Tipo cliente"
      :options="languageStore.accountOptions.accountType"
      option-value="cod_tipo"
      option-label="label"
    />
    <InputSelectCustom
      emit-value
      map-options
      v-model="localData['regimen_tributario_c']"
      :readonly="readMode"
      label="Regimen Tributario"
      :options="languageStore.accountOptions.taxRegime"
      option-value="cod_rt"
      option-label="label"
    />
    <InputSelectCustom
      ref="industrySelectFieldRef"
      v-model="localData['industry']"
      :readonly="readMode"
      label="*Rubro"
      :options="languageStore.accountOptions.industry"
      option-value="cod_rubro"
      option-label="label"
      @update:model-value="
        localData.subindustry_c = '';
        subIndustryFieldRef?.validateField();
      "
      :rules="generateValidators(['fieldRequired'])"
    />
    <InputSelectCustom
      ref="subIndustryFieldRef"
      v-model="localData['subindustry_c']"
      :readonly="readMode"
      label="*Sub rubro"
      :options="subIndustryOptions"
      option-value="cod_subrubro"
      option-label="label"
      :rules="[subIndustryValidation]"
    />
    <InputSelectCustom
      ref="countrySelectFieldRef"
      v-model="localData['billing_address_country']"
      :readonly="readMode"
      label="*Pais"
      :options="languageStore.accountOptions.countries"
      option-value="cod_pais"
      option-label="label"
      @update:model-value="localData.billing_address_state_list_c = ''"
      :rules="generateValidators(['fieldRequired'])"
    />
    <InputSelectCustom
      ref="stateSelectFieldRef"
      v-model="localData['billing_address_state_list_c']"
      :readonly="readMode"
      label="*Departamento"
      :options="stateOptions"
      option-value="cod_region"
      option-label="label"
      :rules="generateValidators(['fieldRequired'])"
    />
    <InputCustom
      ref="cityInputFieldRef"
      class="col-12 q-px-xs q-pb-xs"
      v-model="localData['billing_address_city']"
      :readonly="readMode"
      label="*Cuidad"
      :rules="generateValidators(['fieldRequired'])"
    />
    <!-- <InputCustom label="Descripcion" v-model="localData['description']" /> -->
    <InputSelectCustom
      ref="accountSelectFieldRef"
      v-if="props.editMode"
      class="col-12 q-px-xs q-pb-xs"
      v-model="localData['tipocuenta_c']"
      :readonly="readMode"
      :options="['Privada', 'Empresa']"
      label="Tipo de cuenta"
      :rules="generateValidators(['fieldRequired'])"
      @update:model-value="changeType"
    />
  </div>
</template>

<style lang="scss">
.full-dialog {
  width: 100% !important;
}
</style>
