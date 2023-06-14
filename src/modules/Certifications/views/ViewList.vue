<script setup lang="ts">
import { ref } from 'vue';
import { useCertifications } from '../composables/useCertifications';
import { HANSACRM3_URL } from 'src/conections/api_conectors';

const {
  certificationsStore: table,
  setVisibleColumn,
  getListCertifications,
  reloadList,
  setPagination,
} = useCertifications();

const onSubmitDataFilter = () => {
  console.log('data filter');
};

const onUpdateMultiple = () => {
  console.log('update multiple');
};

const onDeleteMultiple = () => {
  console.log('update multiple');
};

const onUpdateDataTable = () => {
  console.log('update data table');
};

const onRequestTable = async (val: { pagination: any; filter: any }) => {
  console.log('request data table');
  await setPagination(val.pagination);
  await getListCertifications(val);
};

const onClearDataFilter = () => {
  console.log('clear data filter');
};

const openDialog = (title: string) => {
  console.log('open dialog');
};

const openItemSelected = (id: string) => {
  console.log('open item selected');
};
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
      searchPlaceholder="Busqueda por: Nro. de solicitud"
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
              <!-- <q-circular-progress
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
              </div> -->
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
          label="Nuevo"
          v-if="!$q.screen.xs"
          @click="openDialog('NUEVO registro')"
        >
        </q-btn>
        <q-page-sticky :offset="[18, 0]" position="bottom-right" v-else>
          <q-btn
            fab
            color="primary"
            icon="add"
            @click="openDialog('NUEVO Registro')"
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
</template>
