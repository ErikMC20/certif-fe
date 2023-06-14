<script setup lang="ts">
import InputCustom from 'src/modules/Accounts/components/Inputs/InputCustom.vue';
import { AccountModel, DetailAccountModel } from '../../utils/types/index';
import { ref, watch, onMounted, computed, inject } from 'vue';
import { useCRMValidator } from '../../composables/useCRMValidator';
import { useFormOptionsStore } from '../../../../stores/formOptionsStore';
import {
  RowTableModel,
  RowTableCINITModel,
} from '../../../../components/types/index';
import { AccountStore } from '../../store/AccountStore';
import InputSelectCustom from 'src/modules/Accounts/components/Inputs/InputSelectCustom.vue';
import { QInput } from 'quasar';
import { selectedRepeatedKey } from '../../utils/ProvideKeys';

const props = withDefaults(
  defineProps<{
    accountType: AccountModel;
    modelValue: DetailAccountModel;
    readMode?: boolean;
    editMode?: boolean;
  }>(),
  {
    readMode: false,
    editMode: false,
  }
);

const emits = defineEmits<{
  (event: 'update:modelValue', values: DetailAccountModel): void;
}>();

const { readRepeatedNITCI, accountDraft } = AccountStore();
const { generateValidators } = useCRMValidator();
const languageStore = useFormOptionsStore();

const localValues = ref({} as DetailAccountModel);
const accountTypeLocal = ref(props.accountType || 'Privada');

//* Provide / Inject feature
const selectRepeatedValue = inject(selectedRepeatedKey);
//* End Provide / Inject feature

//* Ref variables
const subIndustryFieldRef = ref<InstanceType<typeof InputSelectCustom> | null>(
  null
);

const nameInputFieldRef = ref<InstanceType<typeof InputCustom> | null>(null);
const namesInputFieldRef = ref<InstanceType<typeof InputCustom> | null>(null);
const nameCommercialinputFieldRef = ref<InstanceType<
  typeof InputCustom
> | null>(null);
const lastNameInputFieldRef = ref<InstanceType<typeof InputCustom> | null>(
  null
);
const nitCIInputFieldRef = ref<InstanceType<typeof QInput> | null>(null);
const cityInputFieldRef = ref<InstanceType<typeof InputCustom> | null>(null);

const industrySelectFieldRef = ref<InstanceType<
  typeof InputSelectCustom
> | null>(null);
const countrySelectFieldRef = ref<InstanceType<
  typeof InputSelectCustom
> | null>(null);
const stateSelectFieldRef = ref<InstanceType<typeof InputSelectCustom> | null>(
  null
);
const accountSelectFieldRef = ref<InstanceType<
  typeof InputSelectCustom
> | null>(null);

const subIndustryOptions = computed(() => {
  if (!Object.values(languageStore.accountOptions).length) return [];
  const subOption = languageStore.accountOptions.industry.find(
    (option: { cod_rubro: string }) =>
      option.cod_rubro === localValues.value.industry
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
      option.cod_pais === localValues.value.billing_address_country
  );
  if (subOption) {
    return subOption['regiones'];
  }
  return [];
});

let skipBlur = 0;
let isValidatedFirst = false;
const repeatedDialogOpen = ref(false);
const repeatedDialogData = ref([] as RowTableModel[]);
const checkRepeatetNITCI = async (val: string): Promise<boolean | string> => {
  const isReadOnly = !!props.readMode;
  if (isReadOnly) {
    return true;
  }

  const dataRepeated = await readRepeatedNITCI(val, 'account');
  repeatedDialogData.value = dataRepeated.filter(
    (d) => d.id !== props.modelValue.id
  );

  if (
    props.modelValue.id &&
    repeatedDialogData.value.length > 0 &&
    !isValidatedFirst
  ) {
    repeatedDialogOpen.value = true;
    isValidatedFirst = true;
  }

  isValidatedFirst = true;

  if (
    props.accountType === 'Empresa' ||
    repeatedDialogData.value.length === 0
  ) {
    return true;
  }

  return 'Se han encontrado datos repetidos';
};

const subIndustryValidation = (val: string) => {
  if (subIndustryOptions.value.length === 0 && !val) {
    return true;
  } else if (!val) return 'El Campo es obligatorio';
  else true;
};

const changeType = (val: AccountModel) => {
  console.log(val);
  accountTypeLocal.value = val;
  if (val === 'Privada') {
    localValues.value.names_c = localValues.value.name;
  }
};

const openRepeatedDialog = () => {
  skipBlur = 2;
  repeatedDialogOpen.value = true;
};

const checkDataAndOpenOnBlur = () => {
  if (skipBlur) {
    --skipBlur;
    if (skipBlur <= 0) {
      skipBlur = 0;
      return;
    }
  }
  if (repeatedDialogData.value.length > 0) {
    repeatedDialogOpen.value = true;
  }
};

const validateFields = async () => {
  const validNIT = await nitCIInputFieldRef.value?.validate();

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

const captureStateFields = (val: string) => {
  const labelValue = stateOptions.value.find(
    (state) => state.cod_region === val
  )?.label;
  localValues.value.billing_address_state =
    localValues.value.shipping_address_state = labelValue || '';
  localValues.value.shipping_address_state_list_c = val;
};

const captureRepeatedAccountByCI = (value: RowTableCINITModel) => {
  if (!!selectRepeatedValue) selectRepeatedValue(value);
  repeatedDialogOpen.value = false;
};

watch(localValues, () => {
  emits('update:modelValue', localValues.value);
});

onMounted(async () => {
  localValues.value = props.modelValue;
  if (!!props.modelValue.id) await nitCIInputFieldRef.value?.validate();
});

defineExpose({
  validateFields,
});
</script>

<template>
  <ci-repeated-dialog-component
    v-model="repeatedDialogOpen"
    :data="repeatedDialogData"
    :selectable="Object.values(accountDraft).length > 0"
    @expose-selected="captureRepeatedAccountByCI"
  />
  <!-- <q-dialog class="full-dialog" v-model="repeatedDialogOpen">
    <table-dialog-ci-component
      :data="repeatedDialogData"
      :expose-btn="Object.values(accountDraft).length > 0"
      @expose-selected="captureRepeatedAccountByCI"
    />
  </q-dialog> -->
  <div class="row">
    <InputCustom
      ref="nameInputFieldRef"
      v-if="accountTypeLocal === 'Privada'"
      v-model="localValues['names_c']"
      label="* Nombres"
      :rules="
        !!readMode ? [true] : generateValidators(['fieldRequired', 'validName'])
      "
      :readonly="readMode"
    />
    <InputCustom
      ref="namesInputFieldRef"
      v-else
      v-model="localValues['name']"
      label="* Nombres"
      :readonly="readMode"
      :rules="
        !!readMode ? [true] : generateValidators(['fieldRequired', 'validName'])
      "
    />
    <InputCustom
      ref="nameCommercialinputFieldRef"
      v-if="accountTypeLocal === 'Empresa'"
      v-model="localValues['nombre_comercial_c']"
      :readonly="readMode"
      label="Nombre Comercial"
    />
    <InputCustom
      ref="lastNameInputFieldRef"
      v-else
      v-model="localValues['lastname_c']"
      :readonly="readMode"
      label="* Apellidos"
      :rules="
        !!readMode
          ? [true]
          : generateValidators(['fieldRequired', 'validLastName'])
      "
    />
    <InputSelectCustom
      v-model="localValues['tipo_documento_c']"
      :readonly="readMode"
      label="Tipo de documento"
      :options="languageStore.accountOptions.documentsList"
      option-value="cod_doc"
      option-label="label"
    />
    <q-input
      class="col-12 col-sm-6 q-px-xs q-pb-xs q-mb-md"
      dense
      outlined
      color="primary"
      type="text"
      ref="nitCIInputFieldRef"
      v-model="localValues['nit_ci_c']"
      debounce="500"
      @blur="checkDataAndOpenOnBlur"
      :readonly="readMode"
      :label="accountTypeLocal === 'Empresa' ? '*NIT' : '*CI'"
      :rules="
        !!readMode
          ? [() => true]
          : [...generateValidators(['fieldRequired']), checkRepeatetNITCI]
      "
    >
      <template #append>
        <q-btn
          v-if="repeatedDialogData.length > 0"
          color="warning"
          size="xs"
          icon="warning"
          tabindex="-1"
          round
          @click="openRepeatedDialog"
        >
          <q-tooltip> Se han encontrado datos repetidos </q-tooltip>
        </q-btn>
      </template>
    </q-input>
    <InputSelectCustom
      v-model="localValues['account_type']"
      :readonly="readMode"
      label="Tipo cliente"
      :options="languageStore.accountOptions.accountType"
      option-value="cod_tipo"
      option-label="label"
    />
    <InputSelectCustom
      emit-value
      map-options
      v-model="localValues['regimen_tributario_c']"
      :readonly="readMode"
      label="Regimen Tributario"
      :options="languageStore.accountOptions.taxRegime"
      option-value="cod_rt"
      option-label="label"
    />
    <InputSelectCustom
      ref="industrySelectFieldRef"
      v-model="localValues['industry']"
      :readonly="readMode"
      label="*Rubro"
      :options="languageStore.accountOptions.industry"
      option-value="cod_rubro"
      option-label="label"
      @update:model-value="
        localValues.subindustry_c = '';
        subIndustryFieldRef?.validateField();
      "
      :rules="!!readMode ? [true] : generateValidators(['fieldRequired'])"
    />
    <InputSelectCustom
      ref="subIndustryFieldRef"
      v-model="localValues['subindustry_c']"
      :readonly="readMode"
      label="*Sub rubro"
      :options="subIndustryOptions"
      option-value="cod_subrubro"
      option-label="label"
      :rules="!!readMode ? [true] : [subIndustryValidation]"
    />
    <InputSelectCustom
      ref="countrySelectFieldRef"
      v-model="localValues['billing_address_country']"
      :readonly="readMode"
      label="*Pais"
      :options="languageStore.accountOptions.countries"
      option-value="cod_pais"
      option-label="label"
      @update:model-value="localValues.billing_address_state_list_c = ''"
      :rules="!!readMode ? [true] : generateValidators(['fieldRequired'])"
    />
    <!-- <pre>{{ stateOptions }}</pre> -->
    <InputSelectCustom
      ref="stateSelectFieldRef"
      v-model="localValues['billing_address_state_list_c']"
      @update:model-value="captureStateFields"
      :readonly="readMode"
      label="*Departamento"
      :options="stateOptions"
      option-value="cod_region"
      option-label="label"
      :rules="!!readMode ? [true] : generateValidators(['fieldRequired'])"
    />
    <InputCustom
      ref="cityInputFieldRef"
      class="col-12 q-px-xs q-pb-xs"
      v-model="localValues['billing_address_city']"
      :readonly="readMode"
      label="*Cuidad"
      :rules="!!readMode ? [true] : generateValidators(['fieldRequired'])"
    />
    <!-- <InputCustom label="Descripcion" v-model="localValues['description']" /> -->

    <InputSelectCustom
      ref="accountSelectFieldRef"
      v-if="props.editMode"
      class="col-12 q-px-xs q-pb-xs"
      v-model="localValues['tipocuenta_c']"
      :readonly="readMode"
      :options="['Privada', 'Empresa']"
      label="Tipo de cuenta"
      :rules="!!readMode ? [true] : generateValidators(['fieldRequired'])"
      @update:model-value="changeType"
    />
  </div>
</template>
