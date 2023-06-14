<template>
  <div>
    <dialog-component
      v-model="showFilter"
      :sizeDialog="isFiltering ? 'dialog-md' : 'dialog-sm'"
      :headerDisabled="false"
      :footerDisabled="false"
      :loading="loading"
    >
      <template #header>
        <!-- <q-card class="my-card no-border-radius">
          <q-card-section class="bg-orange text-white q-pa-sm">
            <div class="text-h6">
              <q-icon name="filter_alt" size="sm" />
              Busqueda avanzada de campañas
              <q-btn
                flat
                icon="close"
                dense
                class="float-right"
                v-close-popup
              />
            </div>
          </q-card-section>
        </q-card> -->

        <div class="bg-orange-3 text-black ">
        <q-toolbar class="bg-orange-8 q-pa-md">
          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-avatar text-color="white">
                  <q-icon name="filter_alt" size="md"></q-icon>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-white text-h5">Campañas</q-item-label>
                <q-item-label class="text-grey-4 text-caption" lines="1">Busqueda Avanzada
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-space />
          <q-btn dense flat color="white" :icon="!$q.screen.xs ? 'close' : 'arrow_back_ios'" v-close-popup>
            <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-toolbar>
      </div>
      </template>
      <template #body>
        <div class="row bg-white" style="height: calc(100vh - 100px)">
          <Transition enter-active-class="animated lightSpeedInRight">
            <div class="col-md-6 col-sm-12" v-if="isFiltering">
              <q-card class="no-border-radius bg-none" flat>
                <q-card-section>
                  <div class="text-h7 q-mb-sm">Lista de coincidencias</div>
                  <template v-if="listCampaigns.length > 0">
                    <q-list bordered>
                      <q-virtual-scroll
                        style="max-height: 90vh"
                        :items="listCampaigns"
                        separator
                        v-slot="{ item, index }"
                      >
                        <q-item
                          :key="index"
                          clickable
                          @click="selectItem(item)"
                        >
                          <q-item-section avatar>
                            <q-avatar
                              color="orange-3"
                              text-color="text-dark"
                              icon="campaign"
                              font-size="25px"
                            />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>{{ item.nombre }}</q-item-label>
                            <q-item-label caption lines="2"
                              >Tipo:
                              <span class="text-blue">{{ item.tipo }}</span>
                              | Estado: {{ item.estado }}
                            </q-item-label>
                          </q-item-section>
                          <!-- <q-item-section
                            side
                            style="width: 200px"
                            v-if="!$q.screen.xs"
                          >
                            <small>Cuenta:</small>
                            <small
                              class="text-blue-14 truncate cursor-pointer"
                              v-if="item.cuenta"
                            >
                              {{ item.cuenta ?? 'No tiene' }}
                              <q-tooltip color="primary">
                                {{ item.cuenta }}
                              </q-tooltip>
                            </small>
                            <small v-else class="text-orange"> No tiene </small>
                          </q-item-section> -->
                        </q-item>
                      </q-virtual-scroll>
                    </q-list>
                  </template>
                  <template v-else>
                    <div class="text-h7 text-grey-6 q-py-md text-center">
                      <img
                        src="empty_list.png"
                        alt="lista vacia"
                        style="width: 150px; height: 100px"
                      />
                      <span class="block"
                        >No se encontraron coincidencias.</span
                      >
                    </div>
                  </template>
                </q-card-section>
              </q-card>
            </div>
          </Transition>
          <div
            class="col-sm-12"
            :class="isFiltering ? 'col-md-6' : 'col-md-12'"
          >
            <q-card class="no-border-radius" flat bordered>
              <q-card-section class="row q-col-gutter-sm">
                <q-input
                  v-model="dataFilter.name"
                  type="text"
                  label="Nombre de la campaña"
                  outlined
                  dense
                  class="col-12"
                  @keydown.enter="onSubmit"
                />
                <q-input
                  outlined
                  dense
                  v-model="dataFilter.start"
                  mask="date"
                  :rules="['date']"
                  class="col-12 q-pb-none"
                  label="Fecha inicio"
                  @keydown.enter="onSubmit"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="dataFilter.start" >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Cerrar"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input
                  outlined
                  dense
                  v-model="dataFilter.end"
                  mask="date"
                  :rules="['date']"
                  class="col-12 q-pb-none"
                  label="Fecha fin"
                  @keydown.enter="onSubmit"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="dataFilter.end">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Cerrar"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-select
                  v-model="dataFilter.type"
                  :options="listCampaignType"
                  label="Tipo de campaña"
                  option-value="value"
                  option-label="label"
                  options-dense
                  emit-value
                  map-options
                  outlined
                  dense
                  class="col-12"
                  @keydown.enter="onSubmit"
                />
                <q-select
                  v-model="dataFilter.status"
                  :options="listCampaignStatus"
                  label="Estado de la campaña"
                  option-value="value"
                  option-label="label"
                  options-dense
                  emit-value
                  map-options
                  outlined
                  dense
                  class="col-12"
                  @keydown.enter="onSubmit"
                />

                <q-select
                  v-model="dataFilter.assigned_to"
                  :options="listUsers"
                  label="Usuarios asignados"
                  option-value="id"
                  option-label="username"
                  options-selected-class="text-deep-primary text-bold"
                  :emit-value="true"
                  :map-options="true"
                  multiple
                  :debounde="0"
                  @keydown.enter="onSubmit"
                  @filter="filterUsers"
                  use-input
                  dense
                  outlined
                  class="col-12"
                >
                  <template v-slot:selected-item="scope">
                    <q-chip
                      removable
                      dense
                      @remove="scope.removeAtIndex(scope.index)"
                      :tabindex="scope.tabindex"
                      color="grey-4"
                      size="md"
                    >
                      <q-avatar>
                        <img :src="`${HANSACRM3_URL}/${scope.opt.avatar}`" />
                      </q-avatar>
                      <div class="ellipsis">
                        {{ scope.opt.user_name }}
                        <q-tooltip class="bg-primary">
                          <div>{{ scope.opt.user_name }}</div>
                        </q-tooltip>
                      </div>
                    </q-chip>
                  </template>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <img
                          :src="`${HANSACRM3_URL}/${scope.opt.avatar}`"
                          style="width: 30px"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ scope.opt.user_name }}</q-item-label>
                        <q-item-label caption>{{
                          scope.opt.a_mercado
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>

                <!-- <template v-for="(element, index) in formInputs" :key="index">
                  <component
                    :is="element.input"
                    v-model="dataFilter[element.field]"
                    :label="element.label"
                    :options="element.options"
                    :option-value="element.option_value"
                    :option-label="element.option_label"
                    :options-selected-class="element.selected_class"
                    :emit-value="element.emit_value"
                    :map-options="element.map_options"
                    :multiple="element.multiple"
                    :debounde="element.debounce"
                    @keydown.enter="onSubmit"
                    @filter="element.filter_function"
                    :use-input="element.use_input"
                    option-dense
                    :clearable="element.clearable"
                    class="col-12"
                    dense
                    outlined
                  >
                    <template
                      v-slot:selected-item="scope"
                      v-if="element.with_avatar"
                    >
                      <q-chip
                        removable
                        dense
                        @remove="scope.removeAtIndex(scope.index)"
                        :tabindex="scope.tabindex"
                        color="grey-4"
                        size="md"
                      >
                        <q-avatar>
                          <img :src="`${HANSACRM3_URL}/${scope.opt.avatar}`" />
                        </q-avatar>
                        <div class="ellipsis">
                          {{ scope.opt.user_name }}
                          <q-tooltip class="bg-primary">
                            <div>{{ scope.opt.user_name }}</div>
                          </q-tooltip>
                        </div>
                      </q-chip>
                    </template>
                    <template v-slot:option="scope" v-if="element.with_avatar">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section avatar>
                          <img
                            :src="`${HANSACRM3_URL}/${scope.opt.avatar}`"
                            style="width: 30px"
                          />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ scope.opt.user_name }}</q-item-label>
                          <q-item-label caption>{{
                            scope.opt.a_mercado
                          }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </component>
                </template> -->
              </q-card-section>
            </q-card>
          </div>
        </div>
      </template>
      <template #footer>
        <q-btn
          color="primary"
          icon="search"
          label="BUSCAR"
          class="q-mr-sm"
          @click="onSubmit"
          :disable="loading"
        />
        <q-btn
          color="orange"
          icon="refresh"
          label="LIMPIAR"
          @click="onReset"
          :disable="loading"
        />
      </template>
    </dialog-component>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  useCampaignType,
  useCampignStatus,
  useUserDivision,
} from 'src/composables/useLanguage';
import { userStore } from 'src/modules/Users/store/UserStore';
import { ProspectService } from '../services/ProspectsService';
import { HANSACRM3_URL } from 'src/conections/api_conectors';

defineProps<{
  module_id?: string;
}>();

/** conts */
const { getListTipoCampaña, listCampaignType } = useCampaignType();
const { getListEstadoCampaña, listCampaignStatus } = useCampignStatus();
const { listUsers, getListUsers, filterUsers } = useUserDivision();
const { getCampaignsFilter } = ProspectService();

const showFilter = ref(false);
const isFiltering = ref(false);
const loading = ref(false);
const listCampaigns = ref([]);
const { userCRM } = userStore();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dataFilter = ref<any>({
  name: '',
  status: '',
  type: '',
  start: '',
  end: '',
  assigned_to: [],
});

/** mountedMethod */
onMounted(async () => {
  await getListTipoCampaña();
  await getListEstadoCampaña();
  await getListUsers(userCRM.iddivision);
});

/** methods */
const onSubmit = async () => {
  listCampaigns.value = await getCampaignsFilter(dataFilter.value);
  isFiltering.value = true;
};

const openDialog = () => {
  showFilter.value = !showFilter.value;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectItem = (item: any) => {
  onReset();
  showFilter.value = false;
  emit('selectItem', item);
};

const onReset = () => {
  dataFilter.value = {
    name: '',
    status: '',
    type: '',
    start: '',
    end: '',
    assigned_to: [],
  };
  listCampaigns.value = [];
  isFiltering.value = false;
};

/** emits */
const emit = defineEmits(['selectItem']);

/** exposes */
defineExpose({
  openDialog,
});
</script>

<style scoped>
.q-chip {
  max-width: 140px;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 90px;
  font-size: 0.8rem;
  text-align: right;
}
</style>
