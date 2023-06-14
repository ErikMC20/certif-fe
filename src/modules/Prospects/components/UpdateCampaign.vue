<template>
  <q-dialog v-model="show" persistent>
    <q-card style="min-width: 40%">
      <q-card-section class="bg-grey-3">
        <div class="text-h7">Asignasión masiva de campañas.</div>
      </q-card-section>
      <q-card-section>
        <div class="row q-col-gutter-sm">
          <q-input
            outlined
            v-model="data.campaign_name"
            label="Campaña"
            class="col-md-6 col-sm-12"
            readonly
            dense
            label-slot
          >
            <template v-slot:prepend>
              <q-avatar>
                <q-icon name="campaign" color="blue-10" size="sm" />
              </q-avatar>
            </template>
            <template v-slot:after>
              <q-btn
                dense
                icon="north_west"
                color="primary"
                @click="openFilter"
              />
              <q-btn
                dense
                flat
                icon="close"
                color="negative"
                @click="clearCampaign"
              />
            </template>
          </q-input>

          <q-select
            v-model="data.assigned_user"
            :options="listUsers"
            label="Usuario asignado"
            transition-show="scale"
            transition-hide="scale"
            outlined
            dense
            class="col-md-6 col-sm-12 col-xs-12"
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
                    :src="`${HANSACRM3_URL}${scope.opt.avatar}`"
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
                    :src="`${HANSACRM3_URL}${scope.opt.avatar}`"
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
      </q-card-section>
      <q-card-actions align="center" class="bg-grey-3">
        <q-btn label="ACTUALIZAR DATOS" color="primary" @click="onSubmit" />
        <q-btn
          label="Cancelar"
          color="secondary"
          v-close-popup
          @click="onReset"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <AdvancedFilterCampaign
    ref="filterCampaignRef"
    module_id=""
    @select-item="itemSelected"
  />
</template>
<script lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useUserDivision } from 'src/composables/useLanguage';
import { userStore } from 'src/modules/Users/store/UserStore';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import AdvancedFilterCampaign from './AdvancedFilterCampaign.vue';
</script>
<script setup lang="ts">
const { listUsers, getListUsers, filterUsers } = useUserDivision();
defineProps(['cuenta']);
//variables del componente
const filterCampaignRef = ref();
const show = ref(false);
const data = ref({
  campaign_name: '',
  campaign: null,
  assigned_user: null,
});
/**ciclo de vida del componente */
onBeforeMount(async () => {
  await getListUsers(userStore().userCRM.iddivision);
});

/** metodos */
const onSubmit = async () => {
  emits('submitData', data.value);
  show.value = false;
};

const openFilter = () => {
  filterCampaignRef.value.openDialog();
};

const itemSelected = (item: any) => {
  console.log(item);
  data.value.campaign_name = item.nombre;
  data.value.campaign = item;
};

const clearCampaign = () => {
  data.value.campaign_name = '';
  data.value.campaign = null;
};

const openDialog = () => {
  show.value = true;
};

const onReset = () => {
  data.value = {
    campaign_name: '',
    campaign: null,
    assigned_user: null,
  };
};
/** */
const emits = defineEmits<{
  (event: 'submitData', data: object): void;
}>();
/** */
defineExpose({ data, openDialog });
</script>

<style scoped></style>
