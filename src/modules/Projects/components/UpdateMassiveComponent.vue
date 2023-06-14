<script setup lang="ts">
import {
  usePaises,
  useProjectStatus,
  useProjectPriority,
} from 'src/composables/useCRMLanguage';
import { UpdateMassiveModel } from '../utils/types';
import { ref } from 'vue';
import { useAsyncState } from '@vueuse/core';

const { listPaises, getlistPaises } = usePaises();
const { listProjectStatus, getlistProjectStatus } = useProjectStatus();
const { listProjectPriority, getlistProjectPriority } = useProjectPriority();

const data = ref<UpdateMassiveModel>({});

const { isLoading } = useAsyncState(async () => {
  return await Promise.all([
    getlistPaises(),
    getlistProjectStatus(),
    getlistProjectPriority(),
  ]);
}, void []);

const getData = () => {
  if (Object.values(data.value).every((el) => el == '')) return;
  return data.value;
};

defineExpose({
  getData,
});
</script>

<template>
  <div class="row q-col-gutter-md">
    <q-select
      v-model="data.priority"
      :options="listProjectPriority"
      label="Prioridad"
      outlined
      dense
      class="col-12"
      transition-show="scale"
      transition-hide="scale"
      option-label="label"
      option-value="value"
      options-dense
      emit-value
      map-options
    />
    <q-select
      v-model="data.status"
      :options="listProjectStatus"
      label="Estado"
      outlined
      dense
      class="col-12"
      transition-show="scale"
      transition-hide="scale"
      option-label="label"
      option-value="value"
      options-dense
      emit-value
      map-options
    />
    <q-select
      v-model="data.pais_c"
      :options="listPaises"
      label="Pais"
      outlined
      dense
      class="col-12"
      transition-show="scale"
      transition-hide="scale"
      option-value="value"
      option-label="label"
      options-dense
      emit-value
      map-options
    />

    <q-inner-loading :showing="isLoading" label="Cargando..." />
  </div>
</template>

<style scoped></style>
