<template>
  <div class="row q-col-gutter-sm">
    <q-select
      v-model="data.asignado"
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
      v-model="data.division"
      :options="listDivision"
      label="Division"
      transition-show="flip-up"
      transition-hide="flip-down"
      outlined
      dense
      class="col-md-6 col-sm-12 col-xs-12"
      options-dense
      option-label="label"
      option-value="cod_div"
      :map-options="true"
      :emit-value="true"
    />
    <q-select
      v-model="data.areamercado"
      :options="listMercado"
      label="Area de Mercado"
      transition-show="flip-up"
      transition-hide="flip-down"
      outlined
      dense
      class="col-md-6 col-sm-12 col-xs-12"
      option-value="cod_amercado"
      option-label="label"
      :map-options="true"
      :emit-value="true"
      options-dense
      :disable="data.division == ''"
    />
    <q-select
      v-model="data.opportunity_type"
      :options="listTipoOportunidad"
      label="Tipo de oportunidad"
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
      :disable="data.division == ''"
    />
    <q-select
      v-model="data.phase"
      :options="listFaseOportunidad"
      label="Fase de oportunidad"
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
      :disable="data.opportunity_type == ''"
    />
    <q-select
      v-model="data.estado"
      :options="listEstado"
      label="Estado"
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
      v-model="data.acuenta_de_c"
      :options="listParticipacion"
      label="Participación como"
      transition-show="flip-up"
      transition-hide="flip-down"
      outlined
      dense
      class="col-md-6 col-sm-12 col-xs-12"
      options-dense
      option-value="value"
      option-label="label"
      :map-options="true"
      :emit-value="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useUserDivision } from 'src/composables/useLanguage';
import { OpportunitiesTableStore } from '../store/OpportunitiesTableStore';
import { userStore } from 'src/modules/Users/store/UserStore';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { OpportunitieTypePhasePercentageColor } from '../utils/types';

const { listUsers, getListUsers, filterUsers } = useUserDivision();

const user = userStore();
const listDivision = ref();
const listMercado = ref();
const listTipoOportunidad = ref();
const listFaseOportunidad = ref();
const listEstado = ref();
const listParticipacion = ref();
const tableStore = OpportunitiesTableStore();

const data = ref({
  asignado: '',
  division: '',
  areamercado: '',
  estado: '',
  opportunity_type: '',
  sales_stage: '',
  region_c: '',
  acuenta_de_c: '',
});

onMounted(async () => {
  listDivision.value = await tableStore.getDivisionLead();
  listEstado.value = await tableStore.getEstadoLead();
  listParticipacion.value = await tableStore.getStoreParticipacion();

  await getListUsers(user.userCRM.iddivision);

  await tableStore.getEstadoLead();
});

watch(
  () => data.value.division,
  async () => {
    listMercado.value = await tableStore.getAreaMercaLead(data.value.division);
    // console.log(listMercado.value);
  }
);
watch(
  () => data.value.division,
  async () => {
    listTipoOportunidad.value = await tableStore.getStoreTipoOportunidad(
      data.value.division
    );
  }
);
watch(
  () => data.value.opportunity_type,
  async () => {
    listFaseOportunidad.value = await tableStore.getStoregetPhaseOpportunitie(
      data.value.opportunity_type
    );
  }
);

defineExpose({ data });
</script>

<style scoped></style>
