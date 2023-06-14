<script lang="ts" setup>
import { ref } from 'vue';
import { readRepeatedEmailsPhones } from 'src/services/InputServices';
import { RowTableModel } from '../../modules/Accounts/utils/types/index';

const repeatedDialogOpen = ref(false);
const repeatedDialogData = ref([] as RowTableModel[]);

const props = defineProps<{
  id?: string;
  emailId: string;
  email: string;
}>();

const emits = defineEmits<{
  (event: 'update:email', value: string): void;
  (event: 'deleteItem', value: string): void;
}>();

const localEmail = ref(props.email || '');
//TODO AQUI MODIFICAR AL REASIGNAR
const isValidEmail = (val: string) => {
  const emailPattern =
    /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
  return emailPattern.test(val) || 'El email no es valido';
};

const checkRepeatedAPI = async (val: string) => {
  repeatedDialogData.value = [];
  const dataRepeated = await readRepeatedEmailsPhones(val);
  if (dataRepeated && dataRepeated.length > 0) {
    if (props.id) {
      const filteredRepeated = dataRepeated.filter(
        (value) => value.id !== props.id
      );
      if (filteredRepeated.length > 0) {
        repeatedDialogData.value = filteredRepeated;
      }
      return true;
    }
    repeatedDialogData.value = dataRepeated;
  }
  return true;
};

const updateEmailValue = (newValue: string | number | null) => {
  if (typeof newValue === 'string') emits('update:email', newValue);
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
  <div>
    <q-dialog
      @hide="repeatedDialogOpen = false"
      v-model="repeatedDialogOpen"
      full-width
    >
      <q-card>
        <table-dialog-component :data="repeatedDialogData" />
      </q-card>
    </q-dialog>
    <div class="row q-col-gutter-sm q-my-xs">
      <div class="col-1 row justify-center items-center">
        <q-btn
          color="negative"
          icon="remove"
          round
          size="sm"
          @click="$emit('deleteItem', emailId)"
        >
          <q-tooltip> Eliminar contacto </q-tooltip>
        </q-btn>
      </div>
      <div class="col-11">
        <div class="row q-col-gutter-sm">
          <q-input
            class="col-11"
            outlined
            dense
            v-model="localEmail"
            @update:model-value="updateEmailValue"
            ref="emailInput"
            type="text"
            label="Correo electronico"
            @blur="checkDataAndOpenOnBlur"
            :rules="[isValidEmail, checkRepeatedAPI]"
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
          <div class="col-1">
            <slot name="checkbox"> </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
