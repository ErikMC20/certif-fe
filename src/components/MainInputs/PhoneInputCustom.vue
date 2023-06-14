<script lang="ts" setup>
import { ref } from 'vue';
import { RowTableModel } from '../../modules/Accounts/utils/types/index';
import { readRepeatedEmailsPhones } from 'src/services/InputServices';
import { useAsyncState } from '@vueuse/core';
import { DescriptionModel } from '../types/index';
import { axios_LB_05 } from 'src/conections/axiosCRM';

const props = defineProps<{
  id: string;
  localId: string;
  country: string;
  country_code: string;
  phone: string;
  description: string;
  whatsapp: string;
}>();

const emits = defineEmits<{
  (event: 'update:country', value: string): void;
  (event: 'update:country_code', value: string): void;
  (event: 'update:phone', value: string | number): void;
  (event: 'update:description', value: string): void;
  (event: 'update:whatsapp', value: string): void;
  (event: 'deleteItem', value: string): void;
}>();

const { state: optionsDescription } = useAsyncState(
  axios_LB_05.get('/tipo-telefono-list').then((res) => res.data),
  [] as DescriptionModel[]
);

const localPhone = ref(props.phone || '');
const localDescription = ref(props.description || '');
const localWhatsapp = ref(props.whatsapp || '');

const repeatedDialogOpen = ref(false);
const repeatedDialogData = ref([] as RowTableModel[]);

//* methods

const checkRepeatedAPI = async (val: string) => {
  repeatedDialogData.value = [];
  const dataRepeated = await readRepeatedEmailsPhones(val);
  console.log(dataRepeated);
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

const updatePhone = (val: string | number | null) => {
  if (!val) {
    emits('update:phone', '');
    return;
  }
  emits('update:phone', val);
};

const updateDescription = (val: string | null) => {
  if (!val) {
    emits('update:description', '');
    return;
  }
  emits('update:description', val);
};

const updateWhatsapp = (val: string | null) => {
  if (!val) {
    emits('update:whatsapp', '');
    return;
  }
  emits('update:whatsapp', val);
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
</script>

<template>
  <div class="q-px-sm">
    <q-dialog v-model="repeatedDialogOpen" full-width>
      <q-card>
        <table-dialog-component :data="repeatedDialogData" :reserved-id="props.localId"/>
      </q-card>
    </q-dialog>
    <div class="row q-col-gutter-sm q-mb-sm">
      <div class="col-1 button-input">
        <q-btn
          color="negative"
          icon="remove"
          round
          size="sm"
          @click="$emit('deleteItem', id)"
        >
          <q-tooltip> Eliminar contacto </q-tooltip>
        </q-btn>
      </div>
      <div class="col-11">
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-sm-2">
            <slot name="countryCode"></slot>
          </div>
          <div class="col-12 col-sm-6">
            <q-input
              v-model="localPhone"
              type="text"
              label="Número"
              dense
              @blur="checkDataAndOpenOnBlur"
              @update:model-value="updatePhone"
              :rules="[
                (val) => val.length > 6 || 'Ingrese un número válido',
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
          </div>
          <div class="col-12 col-sm-3">
            <q-select
              v-model="localDescription"
              :options="optionsDescription"
              label="Descripción"
              filled
              map-options
              option-value="cod_tel"
              option-label="label"
              emit-value
              dense
              @update:model-value="updateDescription"
            />
          </div>
          <div class="col-12 col-sm-1">
            <q-checkbox
              v-model="localWhatsapp"
              true-value="1"
              false-value="0"
              checked-icon="whatsapp"
              unchecked-icon="whatsapp"
              color="positive"
              @update:model-value="updateWhatsapp"
            >
              <q-tooltip>Activo en Whatsapp </q-tooltip>
            </q-checkbox>
          </div>
        </div>
      </div>
      <q-separator v-show="$q.screen.lt.sm" />
    </div>
  </div>
</template>
