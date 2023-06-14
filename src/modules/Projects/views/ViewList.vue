<script lang="ts">
import { useProjectTableStore } from '../store/useProjectTableStore';
import {
  base,
  Pagination,
  Filter,
  UpdateMassiveModel,
  IndicatorsModel,
} from '../utils/types';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import UpdateMassiveComponent from '../components/UpdateMassiveComponent.vue';
import { AdvancedFilterTable, ProjectDialog } from '../components';
import { userStore } from '../../Users/store/UserStore';
import { setDefaultAvatar } from '../composables/useUtils';
import { TableSkeleton } from 'src/components';
import { ref, onMounted } from 'vue';
import AccountDialog from 'src/modules/Accounts/components/Dialogs/AccountDialog.vue';
import { getIndicators } from '../services/useProjectService';
</script>
<script setup lang="ts">
//properties
const props = withDefaults(
  defineProps<{
    idUser?: string;
    moduleId?: string;
  }>(),
  {
    idUser: '',
  }
);

//Stores
const user = userStore();
const table = useProjectTableStore();
const { setVisibleColumn, getListProjects, reloadList, setPagination } =
  useProjectTableStore();

//Refs
const filterAdvancedRef = ref<InstanceType<typeof AdvancedFilterTable> | null>(
  null
);
const projectDialogRef = ref<InstanceType<typeof ProjectDialog> | null>(null);
const accountDialogRef = ref<InstanceType<typeof AccountDialog> | null>(null);

const updateMassiveRef = ref<InstanceType<
  typeof UpdateMassiveComponent
> | null>(null);

//variables
const isReady = ref(false);
const showIndicators = ref(false);
const indicador = ref<IndicatorsModel>({
  costo: {
    porcentaje: 0.0,
    contrato: 0,
    costo_real: 0,
    costo_total: 0,
  },
  tiempo: {
    porcentaje: 0.0,
    dias: 0,
    transcurrido: 0,
  },
  alcance: {
    avance: 0.0,
    completada: 0,
    total: 0,
  },
} as IndicatorsModel);

//functions
const formSaved = async () => {
  await table.reloadList();
};

const onRequestTable = async (val: {
  pagination: Pagination;
  filter: Filter;
}) => {
  await setPagination(val.pagination);
  await getListProjects(val);
};

const onDeleteMultiple = (selected: base[]) => {
  const items = selected.map((el: base) => {
    return { id: el.id };
  });
  table.deleteMultiple(items);
};

const onUpdateMultiple = (selected: base[]) => {
  const items = selected.map((el: base) => {
    return { id: el.id };
  });
  const data = <UpdateMassiveModel>updateMassiveRef.value?.getData();
  table.updateMultiple(data, items);
};

const onSubmitDataFilter = () => {
  try {
    table.data_filter = filterAdvancedRef.value?.dataFilter;
    table.setFilterData();
    table.reloadList();
  } catch (error) {
    throw error;
  }
};

const onClearDataFilter = () => {
  try {
    filterAdvancedRef.value?.clearFilter();
    table.clearFilterData();
    table.setFilterData();
    table.reloadList();
  } catch (error) {
    throw error;
  }
};

const onUpdateDataTable = async () => {
  try {
    await reloadList();
  } catch (error) {
    throw error;
  }
};

const openDialog = (title: string) => {
  projectDialogRef.value?.openDialogProject(undefined, title);
};

const openAccountDialog = (id: string) => {
  accountDialogRef.value?.openDialogAccountTab(id);
};

const openItemSelected = (id: string) => {
  projectDialogRef.value?.openDialogProject(id);
};

const setStatusColor = (status: string) => {
  const statusName = [
    {
      name: 'In Review',
      color: 'blue-1',
      textColor: 'blue',
      icon: 'timeline',
    },
    {
      name: 'Draft',
      color: 'grey-4',
      textColor: 'grey-7',
      icon: 'mode',
    },
    {
      name: 'Underway',
      color: 'yellow-2',
      textColor: 'yellow-9',
      icon: 'timeline',
    },
    {
      name: 'On_Hold',
      color: 'cyan-2',
      textColor: 'cyan-9',
      icon: 'watch_later',
    },
    {
      name: 'Completed',
      color: 'green-2',
      textColor: 'green-9',
      icon: 'check',
    },
    {
      name: 'Canceled',
      color: 'red-2',
      textColor: 'red-9',
      icon: 'close',
    },
  ];
  return statusName.find((el) => el.name === status);
};

const onGetIndicators = async (id: string) => {
  showIndicators.value = !showIndicators.value;
  try {
    indicador.value = await getIndicators(id);
  } catch (error) {
  } finally {
  }
};

const closePopup = () => {
  console.log('cerrando...');
  indicador.value = {
    costo: {
      porcentaje: 0.0,
      contrato: 0,
      costo_real: 0,
      costo_total: 0,
    },
    tiempo: {
      porcentaje: 0.0,
      dias: 0,
      transcurrido: 0,
      total: 0,
    },
    alcance: {
      avance: 0.0,
      completada: 0,
      total: 0,
    },
  };
};

onMounted(async () => {
  //isReady.value = false;
  //await getUserConfig();
  //isReady.value = true;
  if (props.moduleId) openItemSelected(props.moduleId);
});

const constructorComp = async (idUser?: string) => {
  if (idUser) user.insertUser(idUser);
};

(() => {
  constructorComp(props.idUser);
})();

//exposes
</script>

<template>
  <div :class="$q.platform.is.desktop ? 'q-pa-md' : 'q-pa-sm'">
    <table-component
      :rows="table.data_table.rows"
      :columns="table.data_table.columns"
      :total="table.pagination.rowsNumber"
      :rowsPerPage="table.pagination.rowsPerPage"
      :sortBy="table.pagination.sortBy"
      :descending="table.pagination.descending"
      :visible="table.visible_columns"
      :dataFilter="table.data_filter"
      :loading="table.loading"
      :defaultRows="false"
      :style="'height: 95dvh'"
      searchPlaceholder="Busqueda por: Nombre, Codigo 1, Codigo 2"
      @visibleColumns="setVisibleColumn"
      @submitFilter="onSubmitDataFilter"
      @updateMultiple="onUpdateMultiple"
      @deleteMultiple="onDeleteMultiple"
      @updateData="onUpdateDataTable"
      @update:props="onRequestTable"
      @clearFilter="onClearDataFilter"
      @openDialog="openDialog"
      v-if="true"
    >
      <template #rows="{ propsTable }">
        <q-tr :props="propsTable">
          <q-td class="text-left">
            <q-checkbox v-model="propsTable.selected" flat dense />
          </q-td>
          <q-td key="codigo1" :props="propsTable" :style="'width: 100px;'">
            {{ propsTable.row.codigo1 }}
          </q-td>
          <q-td key="codigo2" :props="propsTable" :style="'width: 100px;'">
            {{ propsTable.row.codigo2 }}
          </q-td>
          <q-td key="nombre" :props="propsTable">
            <div
              class="text-primary cursor-pointer text-break"
              @click="openItemSelected(propsTable.row.id)"
            >
              {{ propsTable.row.nombre }}
            </div>
          </q-td>
          <q-td key="estado" :props="propsTable">
            <q-badge
              class="q-pa-sm text-bold full-width"
              v-bind="setStatusColor(propsTable.row.status)"
            >
              <q-icon :name="setStatusColor(propsTable.row.status)?.icon" />

              <small class="q-ml-xs"> {{ propsTable.row.estado }} </small>
            </q-badge>
          </q-td>
          <q-td key="pendiente" :props="propsTable">
            <q-badge
              color="blue-1"
              text-color="blue-9"
              class="q-py-sm q-px-md"
              v-if="propsTable.row.pendiente > 0"
            >
              <strong>
                {{ propsTable.row.pendiente }}
              </strong>
              <q-icon
                name="pending_actions"
                color="blue-9"
                class="q-ml-sm"
                size="10px"
              />
            </q-badge>
          </q-td>
          <q-td key="progreso" :props="propsTable">
            <div
              style="gap: 10px; width: 160px"
              v-if="propsTable.row.status != 'Draft'"
              class="flex items-center cursor-pointer"
              @click="onGetIndicators(propsTable.row.id)"
            >
              <q-linear-progress
                size="10px"
                :value="propsTable.row.salud / 100"
                color="blue-10 progress"
                class="observer"
              >
                <q-popup-proxy
                  :offset="[10, 10]"
                  class="row q-pa-sm"
                  @before-hide="closePopup"
                >
                  <div class="text-center col-4">
                    <q-circular-progress
                      show-value
                      font-size="10px"
                      :value="indicador.costo.porcentaje ?? 0"
                      size="50px"
                      :thickness="0.17"
                      color="green-9"
                      track-color="grey-3"
                      class="q-mx-md q-mt-sm"
                    >
                      {{ indicador.costo.porcentaje ?? 0 }}%
                    </q-circular-progress>
                    <div class="text-center">
                      <small> COSTO </small>
                    </div>
                  </div>
                  <div class="text-center col-4">
                    <q-circular-progress
                      show-value
                      font-size="10px"
                      :value="indicador.tiempo.porcentaje ?? 0"
                      size="50px"
                      :thickness="0.17"
                      color="blue-9"
                      track-color="grey-3"
                      class="q-mx-md q-mt-sm"
                    >
                      {{ indicador.tiempo.porcentaje ?? 0 }}%
                    </q-circular-progress>
                    <div class="text-center">
                      <small> TIEMPO </small>
                    </div>
                  </div>
                  <div class="text-center col-4">
                    <q-circular-progress
                      show-value
                      font-size="10px"
                      :value="indicador.alcance.avance"
                      size="50px"
                      :thickness="0.17"
                      color="orange-9"
                      track-color="grey-3"
                      class="q-mx-md q-mt-sm"
                    >
                      {{ indicador.alcance.avance }}%
                    </q-circular-progress>
                    <div class="text-center">
                      <small> ALCANCE </small>
                    </div>
                  </div>
                </q-popup-proxy>
              </q-linear-progress>
              <span class="text-grey-8">
                {{ propsTable.row.salud ?? 0 }}%
              </span>
            </div>

            <div v-else class="text-secondary">No iniciado</div>
          </q-td>
          <q-td key="responsibles" :props="propsTable">
            <div
              style="height: 100%"
              v-if="propsTable.row.responsibles.length > 0"
            >
              <template
                v-for="(item, index) in propsTable.row.responsibles"
                :key="item.id"
              >
                <q-avatar
                  size="28px"
                  class="overlapping shadow-1"
                  :style="`left: ${(index + 1) * 15}px;`"
                  v-if="index < 3"
                >
                  <img
                    :src="`${HANSACRM3_URL}${item.avatar}`"
                    @error="setDefaultAvatar"
                  />
                  <q-tooltip
                    transition-show="scale"
                    transition-hide="scale"
                    class="bg-white text-dark shadow-4 q-py-none"
                  >
                    <q-card class="no-shadow">
                      <q-card-section horizontal class="">
                        <q-card-actions class="q-pr-none">
                          <q-avatar size="50px" class="shadow-1">
                            <img
                              :src="`${HANSACRM3_URL}${item.avatar}`"
                              @error="setDefaultAvatar"
                            />
                          </q-avatar>
                        </q-card-actions>

                        <q-card-section>
                          <div>
                            {{ item.rol_name }}
                          </div>
                          <div class="text-grey-7 text-subtitle2">
                            {{ item.user_name }}
                          </div>
                          <span class="text-grey-6">
                            Division: {{ item.division }}
                          </span>
                          <br />
                          <span class="text-grey-6">
                            A Mercado: {{ item.a_mercado }}
                          </span>
                        </q-card-section>
                      </q-card-section>
                    </q-card>
                  </q-tooltip>
                </q-avatar>
                <q-avatar
                  v-if="index == 4"
                  class="shadow-1 overlapping"
                  size="28px"
                  font-size="13px"
                  color="white"
                  text-color="dark"
                  :style="`left: ${(index + 1) * 12}px;`"
                >
                  <small
                    >+
                    {{ propsTable.row.responsibles.length - 3 }}
                  </small>
                </q-avatar>
              </template>
            </div>
            <div v-else class="text-grey-6">Sin asignar</div>
          </q-td>
          <q-td key="fecha_inicio" :props="propsTable">
            {{ propsTable.row.fecha_inicio }}
          </q-td>
          <q-td key="fecha_cierre" :props="propsTable">
            {{ propsTable.row.fecha_cierre }}
          </q-td>
          <q-td key="dias" :props="propsTable">
            {{ propsTable.row.dias }} días
          </q-td>
          <q-td key="account_name" :props="propsTable">
            <span
              @click="openAccountDialog(propsTable.row.account_id_c)"
              class="text-blue-10 cursor-pointer"
            >
              {{ propsTable.row.account_name }}
            </span>
          </q-td>
          <q-td key="pais" :props="propsTable">
            {{ propsTable.row.pais }}
          </q-td>
          <q-td key="creado_por" :props="propsTable">
            {{ propsTable.row.creado_por }}
          </q-td>
          <q-td key="asignado_a" :props="propsTable">
            <div style="display: flex; align-items: center">
              <q-avatar size="25px">
                <img :src="`${HANSACRM3_URL}${propsTable.row.foto_asignado}`" />
              </q-avatar>
              <small
                :style="'width: 150px;line-break: auto;white-space: normal;margin-left: 0.5rem;'"
              >
                {{ propsTable.row.asignado_a }}
              </small>
            </div>
          </q-td>
          <q-td key="fecha_creacion" :props="propsTable">
            {{ propsTable.row.fecha_creacion }}
          </q-td>
          <q-td key="fecha_modificacion" :props="propsTable">
            {{ propsTable.row.fecha_modificacion }}
          </q-td>
        </q-tr>
      </template>
      <template #item-rows="{ propsTable }">
        <q-card
          :class="propsTable.selected ? 'bg-grey-2' : ''"
          class="q-ma-sm border-rounded q-pa-md"
        >
          <q-card-section class="flex items-center q-pa-sm">
            <q-checkbox flat v-model="propsTable.selected" dense />
            <span
              class="q-ml-md text-ellipsis text-blue-10 cursor-pointer"
              @click="openItemSelected(propsTable.row.id)"
            >
              {{ propsTable.row.nombre }}
            </span>
            <q-space />
            <!-- <q-btn icon="more_vert" dense flat size="sm" /> -->
          </q-card-section>
          <q-separator />
          <q-card-section horizontal>
            <q-card-section class="card-info row q-pa-sm">
              <div class="text-grey-9 col-12">
                <small class="text-grey-6"> Cuenta</small> <br />
                <span
                  class="text-blue-10"
                  v-if="propsTable.row.account_id_c"
                  @click="openAccountDialog(propsTable.row.account_id_c)"
                >
                  {{ propsTable.row.account_name }}
                </span>
                <span class="text-blue-10" v-else>
                  {{ '< Ninguno >' }}
                </span>
              </div>
              <div class="text-grey-9 col-12">
                <small class="text-grey-6">Monto de contrato</small> <br />
                {{ propsTable.row.monto_contrato_c ?? 0 }} $
              </div>
              <div class="col-12">
                <small class="text-grey-6">Responsables</small>
                <div
                  class="q-my-xs"
                  style="height: 20px; position: relative"
                  v-if="propsTable.row.responsibles.length > 0"
                >
                  <template
                    v-for="(item, index) in propsTable.row.responsibles"
                    :key="item.id"
                  >
                    <q-avatar
                      size="35px"
                      class="overlapping shadow-1"
                      :style="`left: ${index * 25}px;`"
                      v-if="index < 3"
                    >
                      <img
                        :src="`${HANSACRM3_URL}${item.avatar}`"
                        @error="setDefaultAvatar"
                      />
                      <q-menu anchor="bottom start" class="shadow-3">
                        <q-card class="no-shadow">
                          <q-card-section horizontal class="">
                            <q-card-actions class="q-pr-none">
                              <q-avatar size="50px" class="shadow-1">
                                <img
                                  :src="`${HANSACRM3_URL}${item.avatar}`"
                                  @error="setDefaultAvatar"
                                />
                              </q-avatar>
                            </q-card-actions>

                            <q-card-section>
                              <div>
                                {{ item.rol_name }}
                              </div>
                              <div class="text-grey-7 text-subtitle2">
                                {{ item.user_name }}
                              </div>
                              <span class="text-grey-6">
                                Division: {{ item.division }}
                              </span>
                              <br />
                              <span class="text-grey-6">
                                A Mercado: {{ item.a_mercado }}
                              </span>
                            </q-card-section>
                          </q-card-section>
                        </q-card>
                      </q-menu>
                      <!-- <q-tooltip
                        transition-show="scale"
                        transition-hide="scale"
                        class="bg-white text-dark shadow-4 q-py-none"
                        anchor="bottom end"
                        self="top middle"
                      >

                      </q-tooltip> -->
                    </q-avatar>
                    <q-avatar
                      v-if="index == 4"
                      class="shadow-1 overlapping"
                      size="35px"
                      font-size="15px"
                      color="grey-4"
                      text-color="dark"
                      :style="`left: ${index * 19}px;`"
                    >
                      <small
                        >+{{ propsTable.row.responsibles.length - 3 }}
                      </small>
                    </q-avatar>
                  </template>
                </div>
                <div v-else class="text-grey-6">Sin asignar</div>
              </div>
            </q-card-section>

            <q-card-section class="q-pa-sm text-center">
              <q-circular-progress
                show-value
                font-size="15px"
                :value="0"
                size="90px"
                :thickness="0.2"
                color="blue-8"
                track-color="grey-3"
                class="q-ma-sm text-bold"
                rounded
                v-if="propsTable.row.status == 'Draft'"
              >
                <span>
                  <q-icon name="priority_high" size="50px" color="grey-5" />
                </span>
              </q-circular-progress>
              <q-circular-progress
                show-value
                font-size="15px"
                :value="propsTable.row.salud ?? 0"
                size="90px"
                :thickness="0.2"
                color="blue-8"
                track-color="grey-3"
                class="q-ma-sm text-bold"
                rounded
                @click="onGetIndicators(propsTable.row.id)"
                v-else
              >
                <span> {{ propsTable.row.salud ?? 0 }}% </span>
              </q-circular-progress>
              <div class="q-mt-sm col-12">
                <q-badge
                  class="q-pa-sm text-bold"
                  v-bind="setStatusColor(propsTable.row.status)"
                >
                  <q-icon :name="setStatusColor(propsTable.row.status)?.icon" />

                  <small class="q-ml-xs">
                    {{ propsTable.row.estado }}
                  </small>
                </q-badge>
              </div>
            </q-card-section>
          </q-card-section>
          <q-card-section class="flex justify-between q-pa-sm">
            <span class="text-grey-7">
              <small>Fecha inicio</small> <br />
              <q-icon name="event" size="sm" color="grey-7" />
              {{ propsTable.row.fecha_inicio }}
            </span>
            <span class="text-grey-7">
              <small>Fecha cierre</small> <br />
              <q-icon name="event" size="sm" color="grey-7" />
              {{ propsTable.row.fecha_cierre }}
            </span>
          </q-card-section>
        </q-card>
      </template>
      <template v-slot:buttons>
        <q-btn
          color="primary"
          label="Nuevo Proyecto"
          v-if="!$q.screen.xs"
          @click="openDialog('NUEVO PROYECTO')"
        >
        </q-btn>
        <q-page-sticky :offset="[18, 0]" position="bottom-right" v-else>
          <q-btn
            fab
            color="primary"
            icon="add"
            @click="openDialog('NUEVO PROYECTO')"
          />
        </q-page-sticky>
      </template>
      <template #updateContent>
        <UpdateMassiveComponent ref="updateMassiveRef" />
      </template>
      <template #filterContent>
        <AdvancedFilterTable
          ref="filterAdvancedRef"
          @submitFilter="onSubmitDataFilter"
        />
      </template>
    </table-component>
    <TableSkeleton v-else />
  </div>
  <ProjectDialog ref="projectDialogRef" @formSaved="formSaved" />
  <AccountDialog ref="accountDialogRef" @saved-form="formSaved" />

  <q-dialog
    v-model="showIndicators"
    position="bottom"
    v-if="$q.screen.xs"
    @before-hide="closePopup"
    persistent
  >
    <q-card class="no-border-radius">
      <q-card-section class="q-pa-none">
        <q-toolbar>
          <q-space />
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
      </q-card-section>
      <q-separator />
      <q-card-section class="row q-pb-md">
        <div class="text-center col-4">
          <q-circular-progress
            show-value
            font-size="15px"
            :value="indicador.costo.porcentaje ?? 0"
            size="80px"
            :thickness="0.2"
            color="positive"
            track-color="grey-3"
            class="q-mx-md q-mt-sm"
            rounded
          >
            {{ indicador.costo.porcentaje ?? 0 }}%
          </q-circular-progress>
          <div class="text-center">
            <small> COSTO </small>
          </div>
        </div>
        <div class="text-center col-4">
          <q-circular-progress
            show-value
            font-size="15px"
            :value="indicador.tiempo.porcentaje ?? 0"
            size="80px"
            :thickness="0.2"
            color="orange"
            track-color="grey-3"
            class="q-mx-md q-mt-sm"
            rounded
          >
            {{ indicador.tiempo.porcentaje ?? 0 }}%
          </q-circular-progress>
          <div class="text-center">
            <small> TIEMPO </small>
          </div>
        </div>
        <div class="text-center col-4">
          <q-circular-progress
            show-value
            font-size="15px"
            :value="indicador.alcance.avance"
            size="80px"
            :thickness="0.2"
            color="blue-10"
            track-color="grey-3"
            class="q-mx-md q-mt-sm"
            rounded
          >
            {{ indicador.alcance.avance }}%
          </q-circular-progress>
          <div class="text-center">
            <small> ALCANCE </small>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.q-table tbody td {
  font-size: 0.8em;
}
.q-table thead tr,
.q-table tbody td {
  height: 45px !important;
}

.q-table__container .q-table__middle.scroll {
  max-height: 450px !important;
}
.text-break {
  width: 250px;
  line-break: auto;
  white-space: normal;
  font-size: 1.1em;
}
.overlapping {
  background-color: white;
  position: absolute;
  :hover {
    z-index: 2;
  }
}
.progress {
  border-radius: 30px;
  width: 90px;
}

.border-rounded {
  border-radius: 10px;
  .card-info {
    width: 70%;
  }
}

.text-ellipsis {
  font-size: 1.2em;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 240px;
}

.observer:hover {
  height: 11px;

  transition: height 0.1s;
  box-shadow: 0px 1px 3px 1px rgba(58, 58, 58, 0.2);
}
</style>
