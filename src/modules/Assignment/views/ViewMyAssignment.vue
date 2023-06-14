<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import moment from 'moment';
import 'moment/locale/es.js';
import UploadDialog from '../components/Dialogs/UploadDialog.vue';
import { getAssignmentByUser } from '../services/useAssignmentService';
import { userStore } from '../../Users/store/UserStore';

const props = defineProps<{
  projectId: string;
}>();
interface Asignacion {
  id: string;
  code_c: string;
  area: string;
  fecha_inicio: string;
  fecha_fin: string;
  fecha_literal?: string;
  tasks?: number;
  operation_status_c: string;
  status_c: string;
}

moment.locale('es');

const uploadDialogRef = ref<InstanceType<typeof UploadDialog> | null>(null);

const { userCRM } = userStore();
const lista = ref<Asignacion[]>([]);
const filter = ref({
  search: '',
  status: '',
  status2: '',
  startDate: moment().startOf('week').format('YYYY-MM-DD'),
  endDate: moment().endOf('week').format('YYYY-MM-DD'),
});

const newList = computed(() => {
  return lista.value.filter(
    (el: Asignacion) =>
      el.area.toLowerCase().includes(filter.value.search.toLowerCase()) ||
      el.code_c.toLowerCase().includes(filter.value.search.toLowerCase())
  );
});

const setStatusColor = (status: string) => {
  const statusName = [
    {
      name: 'En revision',
      color: 'blue-1',
      textColor: 'blue',
      icon: 'watch_later',
    },
    {
      name: 'Pendiente',
      color: 'grey-4',
      textColor: 'grey-7',
      icon: 'mode',
    },
    {
      name: 'En progreso',
      color: 'yellow-2',
      textColor: 'yellow-9',
      icon: 'timeline',
    },
    {
      name: 'On_Hold',
      color: 'yellow-2',
      textColor: 'yellow-9',
      icon: 'watch_later',
    },
    {
      name: 'Cerrado',
      color: 'green-2',
      textColor: 'green-9',
      icon: 'done_all',
    },
    {
      name: 'Aprobado',
      color: 'green-2',
      textColor: 'green-9',
      icon: 'done_all',
    },
    {
      name: 'Rechazado',
      color: 'red-2',
      textColor: 'red-9',
      icon: 'close',
    },
  ];
  return statusName.find((el) => el.name === status);
};

const openItemSelected = (id: string, title: string) => {
  uploadDialogRef.value?.openDialogTab(id, title);
};

const getList = async () => {
  uploadDialogRef.value?.onCloseDialog();
  lista.value = await getAssignmentByUser(userCRM.id, props.projectId);
};

onMounted(async () => {
  getList();
});
</script>
<template>
  <div class="q-ma-lg">
    <q-timeline color="secondary" v-if="newList.length > 0">
      <q-timeline-entry
        v-for="(item, index) in newList"
        :icon="setStatusColor(item.status_c)?.icon"
        :color="setStatusColor(item.status_c)?.textColor"
        :key="index"
        class="q-my-md"
      >
        <template #subtitle>
          {{ item.fecha_literal }}
        </template>
        <template #title>
          {{ item.area }}
        </template>

        <q-card class="my-card">
          <q-item>
            <!-- <q-item-section avatar>
              <q-avatar class="" color="grey-4">
                {{ item.tasks }}
              </q-avatar>
            </q-item-section> -->

            <q-item-section>
              <q-item-label>COD: {{ item.code_c }} </q-item-label>
              <q-item-label caption>
                <q-badge class="q-pa-sm" outline color="primary">
                  TAREAS ASIGNADAS: &nbsp;
                  <b style="font-size: 1.4em">{{ item.tasks }}</b>
                </q-badge>
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                color=""
                text-color="dark"
                flat
                dense
                size="20px"
                icon="add"
                @click="openItemSelected(item.id, item.code_c)"
              />
            </q-item-section>
          </q-item>
          <q-separator inset />
          <q-card-section horizontal>
            <q-card-section
              style="font-size: 0.9em"
              class="q-gutter-sm text-grey-7"
            >
              <div>Area :</div>
              <div>Fecha inicio :</div>
              <div>Fecha fin :</div>
              <div>Estado :</div>
              <div>Estado de carga :</div>
            </q-card-section>
            <q-card-section class="q-gutter-sm" style="font-size: 0.9em">
              <div>
                <span class="text-dark">{{ item.area }}</span>
              </div>
              <div>
                <span class="text-dark">{{ item.fecha_inicio }}</span>
              </div>
              <div>
                <span class="text-dark">{{ item.fecha_fin }}</span>
              </div>
              <div>
                <q-badge
                  :color="setStatusColor(item.status_c)?.color"
                  :text-color="setStatusColor(item.status_c)?.textColor"
                  class="q-pa-xs"
                  :label="item.status_c"
                />
              </div>
              <div>
                <q-badge class="q-pa-xs bg-white">
                  <q-icon
                    :name="setStatusColor(item.status_c)?.icon"
                    :color="setStatusColor(item.status_c)?.textColor"
                  />
                  <span
                    :class="'text-' + setStatusColor(item.status_c)?.textColor"
                  >
                    {{ item.operation_status_c }}
                  </span>
                </q-badge>
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </q-timeline-entry>
    </q-timeline>
    <q-card class="my-card" v-else>
      <q-card-section class="text-center">
        <q-icon name="check_circle" size="60px" color="positive" /> <br />
        <br />
        No tienes asignaciones pendientes
      </q-card-section>
    </q-card>
  </div>
  <upload-dialog ref="uploadDialogRef" @form-saved="getList" />
</template>
<style scoped>
.q-timeline__subtitle {
  opacity: 0.9 !important;
}
.card-rounded {
  border-radius: 7px;
}
</style>
