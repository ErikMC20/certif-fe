<script setup lang="ts">
import { ref, computed } from 'vue';
import { useQuasar, QSpinnerPuff } from 'quasar';
import { useBusinesses } from '../../composables/Core';

import ValidationList from '../ValidationList.vue';

interface Props {
  id?: string;
  from?: string;
  to?: string;
}

interface Emits {
  (e: 'cancel', id: string): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const $q = useQuasar();
const { formatPhase, changeOpportunityPhase, reloadData } = useBusinesses();

const open = ref(false);
const opportunityValues = ref({
  id: props.id || '',
  moveTo: props.to || '',
  movedFrom: props.to || '',
});
const reloadOnChange = ref<boolean>(false);

const moveToFormat = computed(() => {
  return formatPhase(opportunityValues.value.moveTo);
});

const movedFromFormat = computed(() => {
  return formatPhase(opportunityValues.value.movedFrom);
});

const openDialog = (id: string, from: string, to: string, reload = false) => {
  reloadOnChange.value = reload;
  open.value = true;
  opportunityValues.value.id = id;
  opportunityValues.value.movedFrom = from;
  opportunityValues.value.moveTo = to;
  // $q.notify({
  //   message: 'calling something asynchronous as well',
  //   caption: `Your values: ${opportunityValues.value.id} ${props.from} -> ${props.to}`,
  // });
};

const updateOpportunity = async () => {
  try {
    $q.loading.show({
      message: 'Actualizando oportunidad',
      spinner: QSpinnerPuff,
    });
    await changeOpportunityPhase(
      opportunityValues.value.id,
      opportunityValues.value.moveTo
    );
    if (reloadOnChange.value) reloadData();
    open.value = false;
  } catch (error) {
    $q.notify({
      message: 'Error al actualizar la oportunidad',
      color: 'negative',
    });
    cancelChange(opportunityValues.value.id);

    open.value = false;
  } finally {
    $q.loading.hide();
  }
};

const cancelChange = (id: string) => {
  emits('cancel', id);
};

defineExpose({
  openDialog,
});
</script>

<template>
  <q-dialog persistent v-model="open">
    <q-layout view="Lhh lpR fff" container class="bg-white">
      <q-header class="bg-primary">
        <q-toolbar>
          <div class="q-pa-xs">
            <q-toolbar-title>Moviendo Oportunidad</q-toolbar-title>
            <div class="text-caption">
              {{ movedFromFormat }} -> {{ moveToFormat }}
            </div>
          </div>
          <q-space />
          <q-btn flat v-close-popup round dense icon="close" />
        </q-toolbar>
      </q-header>

      <q-footer class="bg-black text-white">
        <q-toolbar>
          <div class="row q-col-gutter-xs q-mx-auto">
            <q-btn
              class="q-mr-sm"
              color="primary"
              icon="check"
              label="Aceptar"
              @click="() => updateOpportunity()"
            />
            <q-btn
              color="negative"
              icon="warning"
              label="Cancelar"
              @click="cancelChange(opportunityValues.id)"
              v-close-popup
            />
          </div>
        </q-toolbar>
      </q-footer>

      <q-page-container>
        <q-page padding>
          <ValidationList
            :id="opportunityValues.id"
            :destination="opportunityValues.moveTo"
        /></q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<style scoped></style>
