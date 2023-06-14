<script lang="ts" setup>
import { ref,  computed } from 'vue';
import { LegacyPhoneModel } from 'src/modules/Accounts/utils/types';
import { COUNTRYFLAG } from 'src/conections/api_conectors';
import { 
  CountryOptions,
  RowTableModel,
} from '../../modules/Accounts/utils/types/index';
import { readRepeatedEmailsPhones } from 'src/services/InputServices';
import { QInput } from 'quasar';
const props = withDefaults(
  defineProps<{
    title?: string;
    options: CountryOptions[];
    modelValue: LegacyPhoneModel;
    description?: string;
    localId?: string;
    required?: boolean;
  }>(),
  {
    title: 'Default Title',
    description: 'Main',
    required: false,
  }
);

const emits = defineEmits<{
  (event: 'update:modelValue', value: LegacyPhoneModel): LegacyPhoneModel;
}>();

//* reference variables
const phoneInputRef = ref<InstanceType<typeof QInput> | null>(null);

//* local variables
const localPhone = ref({
  code: props.modelValue?.code || '+591',
  phone: props.modelValue?.phone || '',
  whatsapp: props.modelValue?.whatsapp || '0',
} as LegacyPhoneModel);
const valuePhone = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits('update:modelValue', value);
  },
});
console.log('your data', localPhone);
const repeatedDialogOpen = ref(false);
const repeatedDialogData = ref([] as RowTableModel[]);
const skipVal = ref(false);

//* computed variables
const countrySelected = computed(() => {
  if (valuePhone.value.code) {
    const targetCountryValue = props.options.find(
      (option) => option.code === valuePhone.value.code
    );
    if (targetCountryValue) {
      return {
        id: targetCountryValue.id,
        code: targetCountryValue.code,
      };
    }
    return {};
  }
  return {};
});

//* methods
const checkRepeatedAPI = async (val: string) => {
  repeatedDialogData.value = [];
  if (skipVal.value) {
    skipVal.value = false;
    return true;
  }
  const dataRepeated = await readRepeatedEmailsPhones(val);
  if (dataRepeated && dataRepeated.length > 0) {
    // if (props.localId) {
    //   const filteredRepeated = dataRepeated.filter(
    //     (value) => value.id !== props.localId
    //   );
    //   if (filteredRepeated.length > 0) {
    //     repeatedDialogData.value = filteredRepeated;
    //   }
    //   return true;
    // }
    repeatedDialogData.value = dataRepeated;
  }
  return true;
};
let skipBlur = 0;
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
const openRepeatedDialog = () => {
  skipBlur = 2;
  repeatedDialogOpen.value = true;
};

const mininumLength = (val: string) => {
  if (!props.required) return true;
  repeatedDialogData.value = [];
  return val.length > 6 || 'Ingrese un número válido';
};

const validatePhone = async () => {
  if (!!props.required) return await phoneInputRef.value?.validate();
  return true;
};

const assignValues = (phone: LegacyPhoneModel, inherited?: boolean) => {
  if (inherited) {
    skipVal.value = true;
  }
  valuePhone.value = phone;
  emits('update:modelValue', valuePhone.value);
};

// //* vue events
// watch(localPhone.value, () => {
//   emits('update:modelValue', localPhone.value);
// });

defineExpose({
  assignValues,
  validatePhone,
});
</script>

<template>
  <q-dialog
    @hide="repeatedDialogOpen = false"
    v-model="repeatedDialogOpen"
    full-width
  >
    <q-card>
      <table-dialog-component :data="repeatedDialogData" :reserved-id="props.localId"/>
    </q-card>
  </q-dialog>
  <div
    class="row q-col-gutter-sm q-mx-auto"
    :class="$q.screen.lt.sm ? 'q-mb-md' : ''"
  >
    <q-select
      class="col-12 col-sm-2"
      v-model="valuePhone.code"
      :options="options"
      map-options
      emit-value
      option-value="code"
      option-label="name_es"
      label="Codigo"
      outlined
      dense
    >
      <!-- <template #option="{ opt }">
        <q-item clickable>
          <q-item-section top avatar>
            <q-avatar class="q-mx-sm" size="20px" color="teal"
              ><img :src="`https://countryflagsapi.com/png/${opt.id}`"
            /></q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ opt.code }}</q-item-label>
            <q-item-label caption lines="2">{{ opt.name_es }}</q-item-label>
          </q-item-section>
        </q-item>
      </template> -->
      <template #selected>
        <q-avatar
          v-if="valuePhone.code"
          class="q-mx-sm"
          size="20px"
          color="teal"
          ><img :src="`${COUNTRYFLAG}/${countrySelected.id}`"
        /></q-avatar>
        {{ countrySelected.code }}
      </template>
    </q-select>
    <q-input
      ref="phoneInputRef"
      class="col-12 col-sm-6"
      v-model.trim="valuePhone.phone"
      type="text"
      :label="title"
      outlined
      dense
      debounce="500"
      @blur="checkDataAndOpenOnBlur"
      :rules="[
        (val) => (!required ? true : !!val || 'Se requiere un número'),
        mininumLength,
        checkRepeatedAPI,
      ]"
    >
      <template #append>
        <q-btn
          v-if="repeatedDialogData.length > 0"
          color="red"
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
    <q-select
      class="col-12 col-sm-3"
      :model-value="`${description}`"
      readonly
      label="Descripción"
      filled
      dense
      hide-dropdown-icon
    />
    <div>
      <q-checkbox
        class="col-12 col-sm-1"
        v-model="valuePhone.whatsapp"
        checked-icon="whatsapp"
        unchecked-icon="whatsapp"
        color="positive"
        true-value="1"
        false-value="0"
      />
    </div>
  </div>
</template>
