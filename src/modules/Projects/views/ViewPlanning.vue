<script lang="ts">
import { base, Columns } from '../utils/types';
import ModuleSkeleton from '../components/Skeletons/ModuleSkeleton.vue';
import { getPlanningsList } from '../services/useProjectService';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
import {
  PlanningDialog,
  PlanningDialogVersion,
} from 'src/modules/Planning/components';
import {
  deletePlanning,
  cancelPlanning,
  approvedPlanning,
} from '../../Planning/services/usePlanningService';
import { QSpinnerIos, Loading } from 'quasar';
import { Notification } from 'src/composables';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { useAsyncState } from '@vueuse/core';
import { ref, computed } from 'vue';
</script>
<script setup lang="ts">
const props = defineProps<{
  moduleId: string;
}>();

defineEmits<{
  (event: 'submitComplete', values: string): void;
}>();

//refs
const planningDialogRef = ref<InstanceType<typeof PlanningDialog> | null>(null);
const planningDialogVersionRef = ref<InstanceType<
  typeof PlanningDialogVersion
> | null>(null);

//variables
const filter = ref('');
const confirmId = ref('');

const showAproved = ref(false);
const showDenegate = ref(false);
const showDelete = ref(false);

const { state, execute, isLoading } = useAsyncState(async () => {
  return await getPlanningsList(props.moduleId);
}, [] as base[]);

//functions
const listFiltered = computed(() => {
  if (filter.value == '') {
    return state.value.filter((objeto: base) => objeto.estado != 'Aprobado');
  }
  return state.value.filter(
    (objeto: base) =>
      objeto.name.toLowerCase().indexOf(filter.value.toLowerCase()) > -1 &&
      objeto.estado != 'Aprobado' &&
      objeto.parent_id == ''
  );
});

const listApproved = computed(() => {
  return state.value.filter((el: base) => el.estado == 'Aprobado');
});

const formSaved = async () => {
  await execute();
};

const openDialog = () => {
  planningDialogRef.value?.openDialog();
};

const openItemSelected = (id: string, title: string) => {
  planningDialogRef.value?.openDialog(id, title);
};

const onConfirmAproved = async () => {
  try {
    Loading.show({
      spinner: QSpinnerIos,
      message: 'Aprobando planificacion...',
    });
    await approvedPlanning(confirmId.value, props.moduleId);
    Notification('positive', 'check_circle', 'Planificación aprobada.');
  } catch (error) {
  } finally {
    execute();
    Loading.hide();
  }
};

const onConfirmDenegate = async () => {
  try {
    Loading.show({
      spinner: QSpinnerIos,
      message: 'Cancelando planificacion...',
    });
    await cancelPlanning(confirmId.value);
    Notification('positive', 'check_circle', 'Se canceló la planificación.');
  } catch (error) {
  } finally {
    execute();
    Loading.hide();
  }
};

const onConfirmDelete = async () => {
  try {
    Loading.show({
      spinner: QSpinnerIos,
      message: 'Eliminando registro...',
    });
    await deletePlanning(confirmId.value);
    Notification('positive', 'check_circle', 'Eliminado correctamente.');
  } catch (error) {
  } finally {
    execute();
    Loading.hide();
  }
};

const onAprobedPlan = (id: string) => {
  confirmId.value = id;
  showAproved.value = true;
};

const onDenegatePlan = (id: string) => {
  confirmId.value = id;
  showDenegate.value = true;
};

const onDeletePlan = (id: string) => {
  confirmId.value = id;
  showDelete.value = true;
};
</script>

<template>
  <ModuleSkeleton v-if="isLoading" />
  <q-card v-else class="no-border-radius" style="height: 70vh; width: 100%">
    <q-card-section>
      <div class="row col-12 justify-between q-px-sm">
        <div class="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-xs-12 q-mb-sm">
          <q-input
            bottom-slots
            dense
            v-model="filter"
            placeholder="Buscar por nombre"
          >
            <template v-slot:hint>
              <span class="text-primary" v-if="filter !== ''"
                >{{
                  listFiltered.length == 1
                    ? listFiltered.length + ' Registro encontrado'
                    : listFiltered.length + ' Registros encontrados'
                }}
              </span>
            </template>
            <template v-slot:append>
              <q-icon name="search" v-if="!filter" />
              <q-icon
                name="clear"
                v-else
                @click="filter = ''"
                class="cursor-pointer"
              />
            </template>
          </q-input>
        </div>
        <div class="col-xl-4 col-lg-6 col-md-7 col-sm-12 col-xs-12 q-mb-sm">
          <div class="row justify-end q-gutter-sm">
            <q-btn
              :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'"
              color="primary"
              label="Nueva Planificacion"
              @click="openDialog"
              size="md"
            />
          </div>
        </div>
      </div>

      <div class="col-xs-12 col-md-3 q-pa-sm">
        <template v-if="state.length > 0">
          <q-list bordered class="q-mb-sm" v-if="listApproved.length">
            <q-item
              clickable
              v-for="(item, index) in listApproved"
              :key="index"
              @click="openItemSelected(item.id, item.name)"
            >
              <q-item-section avatar>
                <q-icon color="positive" name="check_circle" size="md" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Aprobado</q-item-label>
                <q-item-label class="text-blue-9 text-body1">
                  {{ item.name }}
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption> # Tareas</q-item-label>
                <q-item-label class="text-body1">
                  <q-icon name="task_alt" color="blue-8" size="xs" />
                  {{ item.tareas }} registradas
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption> Fecha inicio</q-item-label>
                <q-item-label class="text-body1">
                  <q-icon name="event" color="blue-8" size="xs" />
                  {{ item.fecha_inicio }}
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption> Fecha cierre</q-item-label>
                <q-item-label class="text-body1">
                  <q-icon name="event" color="blue-8" size="xs" />
                  {{ item.fecha_cierre }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-item-label caption> Creado por</q-item-label>
                <q-item-label>
                  {{ item.creado_por }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-avatar size="25px">
                  <img
                    :src="`${HANSACRM3_URL}/upload/users/${item.idcreado_por}`"
                  />
                </q-avatar>
              </q-item-section>
            </q-item>
          </q-list>

          <q-list separator v-if="listFiltered.length">
            <q-expansion-item
              expand-separator
              bordered
              popup
              :default-opened="!listApproved.length"
            >
              <template v-slot:header>
                <q-item-section avatar>
                  <q-avatar
                    size="30px"
                    font-size="15px"
                    :color="listApproved.length ? 'grey-6' : 'warning'"
                    text-color="white"
                  >
                    {{ listFiltered.length }}
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>Planificaciones</q-item-label>
                  <q-item-label caption>
                    {{ listApproved.length ? 'rechazadas' : 'registradas' }}
                  </q-item-label>
                </q-item-section>
              </template>
              <q-item
                clickable
                v-for="(item, index) in listFiltered"
                :key="index"
                @click="openItemSelected(item.id, item.name)"
              >
                <q-item-section avatar v-if="!listApproved.length">
                  <q-icon
                    :color="listApproved.length ? 'negative' : 'grey-6'"
                    :name="
                      listApproved.length
                        ? 'remove_circle_outline'
                        : 'pending_actions'
                    "
                    size="md"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-blue-9">
                    {{ item.name }}
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption> # Tareas</q-item-label>
                  <q-item-label class="text-grey-7">
                    <q-icon name="task_alt" color="grey-7" size="xs" />
                    {{ item.tareas }} registradas
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption> Fecha inicio</q-item-label>
                  <q-item-label class="text-grey-7">
                    <q-icon name="event" color="grey-7" size="xs" />
                    {{ item.fecha_inicio }}
                  </q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-item-label caption> Fecha cierre</q-item-label>
                  <q-item-label class="text-grey-7">
                    <q-icon name="event" color="grey-7" size="xs" />
                    {{ item.fecha_cierre }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-item-label caption> Creado por</q-item-label>
                  <q-item-label>
                    {{ item.creado_por }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-avatar size="25px">
                    <img
                      :src="`${HANSACRM3_URL}/upload/users/${item.idcreado_por}`"
                    />
                  </q-avatar>
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    text-color="black"
                    icon="more_vert"
                    dense
                    round
                    v-if="item.estado != 'Cancelado'"
                    @click="(e) => e.stopPropagation()"
                  >
                    <q-menu transition-show="scale" transition-hide="scale">
                      <q-list style="min-width: 200px" dense separator>
                        <q-item
                          clickable
                          v-close-popup
                          @click.stop="onAprobedPlan(item.id)"
                        >
                          <q-item-section avatar>
                            <q-icon color="primary" name="check" />
                          </q-item-section>
                          <q-item-section> Aprobar plan</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-close-popup
                          @click.stop="onDenegatePlan(item.id)"
                        >
                          <q-item-section avatar>
                            <q-icon color="primary" name="block" />
                          </q-item-section>
                          <q-item-section>Rechazar plan</q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-close-popup
                          @click.stop="onDeletePlan(item.id)"
                        >
                          <q-item-section avatar>
                            <q-icon color="primary" name="close" />
                          </q-item-section>
                          <q-item-section>Eliminar plan</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </q-item-section>
              </q-item>
            </q-expansion-item>
          </q-list>
        </template>
        <template v-else>
          <q-card flat class="my-card column flex-center">
            <img
              src="list-empty.png"
              alt="lista vacia"
              style="width: 220px; height: 200px"
            />
            <br /><br />
            <div class="text-h6 text-dark text-center">
              Lista vacía <br />
              <small class="text-grey-5"
                >No se encontraron áreas de trabajo...</small
              >
            </div>
          </q-card>
        </template>
      </div>
    </q-card-section>
  </q-card>

  <PlanningDialog
    ref="planningDialogRef"
    :project-id="moduleId"
    @formSaved="formSaved"
  />

  <PlanningDialogVersion
    ref="planningDialogVersionRef"
    :project-id="moduleId"
    @formSaved="formSaved"
  />

  <AlertComponent
    v-model="showAproved"
    title="¿Aprobar planficación?"
    message="Al aprobar la planificación las demás pasarán a ser rechazadas."
    icon="check_circle"
    icon-size="80px"
    icon-color="green"
    btn-text="Si, aprobar"
    btn-color="primary"
    @confirm="onConfirmAproved"
  />

  <AlertComponent
    v-model="showDenegate"
    title="¿Rechazar planficación?"
    message="Esta planificación puede volver al estado BORRADOR."
    icon="warning"
    icon-size="80px"
    icon-color="warning"
    btn-text="Si, rechazar"
    btn-color="primary"
    @confirm="onConfirmDenegate"
  />

  <AlertComponent
    v-model="showDelete"
    title="¿Eliminar planficación?"
    message="Se eliminará esta planificación del proyecto en curso."
    icon="close"
    icon-size="80px"
    icon-color="negative"
    btn-text="Si, Eliminar"
    btn-color="negative"
    @confirm="onConfirmDelete"
  />
</template>

<style scoped>
.userName {
  font-size: 0.7rem;
}
</style>
