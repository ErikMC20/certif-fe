<template>
  <div class="row q-col-gutter-sm">
    <q-select
      v-model="data.assigned_user_id"
      :options="listUsers"
      label="Usuario asignado"
      transition-show="scale"
      transition-hide="scale"
      outlined
      dense
      class="col-md-12 col-sm-12 col-xs-12"
      @filter="filterUsers"
      option-value="id"
      option-label="user_name"
      options-dense
      :map-options="true"
      :emit-value="true"
      use-input
      clearable
    >
      <template v-slot:selected-item="scope">
        <q-item>
          <q-item-section avatar>
            <img
              :src="`${HANSACRM3_URL}/${scope.opt.avatar}`"
              style="width: 20px"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ scope.opt.user_name }}</q-item-label>
            <q-item-label caption>{{ scope.opt.a_mercado }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section avatar>
            <img
              :src="`${HANSACRM3_URL}/${scope.opt.avatar}`"
              style="width: 20px"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ scope.opt.user_name }}</q-item-label>
            <q-item-label caption>{{ scope.opt.a_mercado }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-select
      v-model="data.estadocampana"
      :options="listProspectStatus"
      label="Estado"
      transition-show="flip-up"
      transition-hide="flip-down"
      outlined
      dense
      class="col-md-6 col-sm-12 col-xs-12"
      options-dense
      option-value="value"
      option-label="label"
      use-input
      :map-options="true"
      :emit-value="true"
    />
    <q-select
      v-model="data.contacto"
      :options="listProspectSource"
      label="Toma de Contacto"
      transition-show="flip-up"
      transition-hide="flip-down"
      outlined
      dense
      class="col-md-6 col-sm-12 col-xs-12"
      option-value="value"
      option-label="label"
      :map-options="true"
      :emit-value="true"
      options-dense
    />

    <q-select
      v-model="data.pais"
      :options="listPais"
      label="Pais"
      transition-show="flip-up"
      transition-hide="flip-down"
      outlined
      dense
      class="col-md-6 col-sm-12 col-xs-12"
      option-value="cod_pais"
      option-label="label"
      :map-options="true"
      :emit-value="true"
      options-dense
    />

    <q-select
      v-model="data.regiones"
      :options="listRegion"
      label="Departamento"
      transition-show="flip-up"
      transition-hide="flip-down"
      outlined
      dense
      class="col-md-6 col-sm-12 col-xs-12"
      option-value="label"
      option-label="label"
      :map-options="true"
      :emit-value="true"
      :disable="listRegion.length == 0"
      options-dense
    />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import {
  useUserDivision,
  useProspectStatus,
  useCampaignType,
  usePais,
  useProspectSource,
} from 'src/composables/useLanguage';
import { userStore } from 'src/modules/Users/store/UserStore';
import { HANSACRM3_URL } from 'src/conections/api_conectors';

const { listProspectStatus, getListProspectStatus } = useProspectStatus();
const { getListTipoCampaña } = useCampaignType();
const { listUsers, getListUsers, filterUsers } = useUserDivision();
const { listPais, listRegion, getListPais, getListRegion } = usePais();
const { listProspectSource, getListProspectSource } = useProspectSource();

const data = ref({
  estadocampana: null,
  tipocampana: '',
  assigned_user_id: null,
  regiones: null,
  pais: '',
  contacto: null,
});

onBeforeMount(async () => {
  await getListProspectStatus();
  await getListTipoCampaña();
  await getListPais();
  await getListUsers(userStore().userCRM.iddivision);
  await getListProspectSource();
});

watch(
  () => data.value.pais,
  async (newVal) => {
    await getListRegion(newVal);
  }
);

defineExpose({ data });
</script>

<style scoped></style>
