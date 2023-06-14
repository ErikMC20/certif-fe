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
          <q-item-section avatar v-if=" data.asignado != '' ">
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserDivision } from 'src/composables/useLanguage';
import { userStore } from 'src/modules/Users/store/UserStore';
import { HANSACRM3_URL } from 'src/conections/api_conectors';

// const { listPais, listRegion } = usePais();
const { listUsers, getListUsers, filterUsers } = useUserDivision();

const user = userStore();

const data = ref({
  asignado: '',
});

onMounted(async () => {
  await getListUsers(user.userCRM.iddivision);
});

// onBeforeMount(async () => {
//   await getListPais();
// });

defineExpose({ data });
</script>

<style scoped></style>
