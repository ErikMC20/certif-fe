<template>
  <div class="row q-col-gutter-sm">
    <q-select
      v-model="data.assigned_user_id"
      :options="listUsers"
      label="Usuario asignado"
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
      v-model="data.tipocuenta_c"
      :options="listTipoCuenta"
      label="Tipo cuenta"
      outlined
      dense
      class="col-md-6 col-sm-12 col-xs-12"
      option-value="cod_c"
      option-label="label"
      :map-options="true"
      :emit-value="true"
      options-dense
    />
    <q-select
      v-model="data.account_type"
      :options="listTipoCliente"
      label="Tipo cliente"
      outlined
      dense
      class="col-md-6 col-sm-12 col-xs-12"
      @filter="filterTipoCliente"
      options-dense
      option-value="cod_tipo"
      option-label="label"
      use-input
      :map-options="true"
      :emit-value="true"
    />
    <q-select
      v-model="data.industry"
      :options="listRubro"
      label="Rubro"
      outlined
      dense
      option-value="cod_rubro"
      option-label="label"
      class="col-md-12 col-sm-12 col-xs-12"
      options-dense
      :map-options="true"
      :emit-value="true"
    />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import {
  useTipoCliente,
  useTipoCuenta,
  useRubro,
  useUserDivision,
} from 'src/composables/useLanguage';
import { userStore } from 'src/modules/Users/store/UserStore';
import { HANSACRM3_URL } from 'src/conections/api_conectors';

const { listTipoCuenta, getListTipoCuenta } = useTipoCuenta();
const { listRubro, getListRubro } = useRubro();
const { listUsers, getListUsers, filterUsers } = useUserDivision();
const { listTipoCliente, getListTipoCliente, filterTipoCliente } =
  useTipoCliente();

const data = ref({
  industry: null,
  account_type: null,
  tipocuenta_c: null,
  assigned_user_id: null,
});

onBeforeMount(async () => {
  await getListTipoCliente();
  await getListTipoCuenta();
  await getListRubro();
  await getListUsers(userStore().userCRM.iddivision);
});

defineExpose({ data });
</script>

<style scoped></style>
