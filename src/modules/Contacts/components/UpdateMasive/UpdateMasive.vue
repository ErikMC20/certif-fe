<template>
  <div class="row q-col-gutter-sm">
    <q-select
      v-model="data.assigned_user_id"
      :options="listUsersDM"
      label="Usuario asignado"
      outlined
      dense
      class="col-md-12"
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
      v-model="data.mass_account_id"
      :options="listAccounts"
      label="Cuenta"
      outlined
      input-debounce="300"
      dense
      class="col-md-12"
      @filter="filterAccounts"
      option-value="id"
      option-label="nombre"
      options-dense
      :map-options="true"
      :emit-value="true"
      use-input
      clearable
    >
      <template v-slot:selected-item="scope">
        <q-item>
          <q-item-section avatar>
            <q-avatar
              size="30px"
              font-size="30px"
              color="primary"
              text-color="white"
              icon="person"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ scope.opt.nombre }}</q-item-label>
            <q-item-label caption>
              NIT: {{ scope.opt.nit }} | CODAIO: {{ scope.opt.nit }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section avatar>
            <q-avatar
              size="30px"
              font-size="30px"
              color="primary"
              text-color="white"
              icon="person"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ scope.opt.nombre }}</q-item-label>
            <q-item-label caption>
              NIT: {{ scope.opt.nit }} | CODAIO: {{ scope.opt.nit }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import {
  useUserDivisionAmercado,
  useAccountsByNameNitCodaio,
} from 'src/composables/useLanguage';
import { userStore } from 'src/modules/Users/store/UserStore';
import { HANSACRM3_URL } from 'src/conections/api_conectors';

const user = userStore();

const { listUsersDM, getListUsersDM, filterUsers } = useUserDivisionAmercado();
const { listAccounts, filterAccounts } = useAccountsByNameNitCodaio();
const data = ref({
  mass_account_id: null,
  assigned_user_id: null,
});

onBeforeMount(async () => {
  await getListUsersDM(user.userCRM.iddivision, user.userCRM.idamercado);
});

defineExpose({ data });
</script>

<style scoped></style>
