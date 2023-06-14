<script setup lang="ts">
import { ref } from 'vue';
import { useAsyncState } from '@vueuse/core';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { useAssignmentStore } from '../store/useAssignmentStore';
import {
  getProjectTask,
  saveDataChargedUp,
} from '../services/useAssignmentService';
import moment from 'moment';
import { Loading } from 'quasar';
import CommentsComponent from 'src/components/Comments/CommentsComponent.vue';
import ProjectTaskDialog from 'src/modules/ProjectTask/components/Dialogs/ProjectTaskDialog.vue';
import { Notification } from 'src/composables';

const props = defineProps<{
  moduleId: string;
}>();

const { useGetLoadedTask } = useAssignmentStore();

const projectTaskDialogRef = ref<InstanceType<typeof ProjectTaskDialog> | null>(
  null
);
const listTasks = ref<any>([]);
const listImg = ref<any>([]);
const showAlert = ref(false);
const comment = ref('');
const alertAttrs = ref<any>({});
const tab = ref('resp');

const { state: data, isLoading } = useAsyncState(async () => {
  const res = await useGetLoadedTask(props.moduleId);
  listTasks.value = await getProjectTask(res.data.data.id);
  listImg.value = res.images.map((el: any) => {
    return {
      ...el,
      ext: el.description.split('.').pop(),
    };
  });
  return res.data.data;
}, {});

const onShowConfirm = (type: string) => {
  if (type === 'Approved') {
    alertAttrs.value = {
      type: 'Approved',
      title: '¿Aprobar RDO?',
      message: 'Una vez aprobado el registro afectará al avance del proyecto.',
      btnColor: 'positive',
      btnText: 'Si, aprobar',
      icon: 'check_circle',
      iconSize: '80px',
      iconColor: 'positive',
    };
  } else {
    alertAttrs.value = {
      type: 'Rejected',
      title: 'Rechazar RDO?',
      message: 'Deje un comentario de porque se rechazo el RDO.',
      btnColor: 'negative',
      btnText: 'Rechazar',
      icon: 'error',
      iconSize: '80px',
      iconColor: 'negative',
    };
  }
  showAlert.value = true;
};

const onSubmit = async () => {
  try {
    Loading.show({
      message: 'Guardando información',
    });
    const dataSend = {
      type: alertAttrs.value.type,
      id: data.value.cabecera_id,
      asignacion_id: data.value.id,
      comment: comment.value,
      tasks: listTasks.value,
    };
    await saveDataChargedUp(dataSend);
  } catch (error) {
  } finally {
    Loading.hide();
    Notification('positive', 'check_circle', 'Se guardó correctamente');
    emit('submitComplete');
  }
};

const openDialog = (id: string, title: string) => {
  projectTaskDialogRef.value?.openDialog(id, title);
};

defineExpose({
  onSubmit,
  onShowConfirm,
});

const emit = defineEmits<{
  (e: 'submitComplete'): void;
}>();
</script>
<template>
  <q-card v-if="isLoading">
    <q-item>
      <q-item-section avatar>
        <q-skeleton type="QAvatar" />
      </q-item-section>

      <q-item-section>
        <q-item-label>
          <q-skeleton type="text" />
        </q-item-label>
        <q-item-label caption>
          <q-skeleton type="text" />
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-skeleton height="200px" square />

    <q-card-actions align="right" class="q-gutter-md">
      <q-skeleton type="QBtn" />
      <q-skeleton type="QBtn" />
    </q-card-actions>
  </q-card>

  <div class="row" v-else>
    <div class="col-6">
      <q-card class="q-ma-sm">
        <q-card-section class="q-pa-none">
          <q-toolbar class="q-pa-sm">
            <q-btn flat round dense icon="task" color="primary" />
            <q-toolbar-title class="text-subtitle1">
              Información
            </q-toolbar-title>
          </q-toolbar>
        </q-card-section>
        <q-separator />
        <q-card-section horizontal class="shadow-2 q-ma-sm">
          <q-card-section class="text-dark q-gutter-xs">
            <div>Código:</div>
            <div>Área:</div>
            <div>Fecha inicio:</div>
            <div>Fecha fin:</div>
            <div>Fecha carga inicio:</div>
            <div>Fecha carga fin:</div>
          </q-card-section>
          <q-card-section class="text-dark q-gutter-xs">
            <div>
              <span class="text-primary"> {{ data.code_c }}</span>
            </div>
            <div>
              <span class="text-primary">
                {{ data.hany_asignacion_hany_objetivos_name.split('-')[1] }}
              </span>
            </div>
            <div>
              <span class="text-primary">
                {{ moment(data.estimated_start_date_c).format('DD/MM/YYYY') }}
              </span>
            </div>
            <div>
              <span class="text-primary">
                {{ moment(data.estimated_end_date_c).format('DD/MM/YYYY') }}
              </span>
            </div>
            <div>
              <span class="text-primary">
                {{ moment(data.fecha_carga_inicio).format('DD/MM/YYYY') }}
              </span>
            </div>
            <div>
              <span class="text-primary">
                {{ moment(data.fecha_carga_fin).format('DD/MM/YYYY') }}
              </span>
            </div>
          </q-card-section>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-card-section class="bg-primary text-white">
            Avance real
          </q-card-section>
          <q-scroll-area style="height: 38dvh">
            <q-list bordered separator>
              <q-item
                v-for="(item, index) in listTasks"
                :key="index"
                clickable
                @click="openDialog(item.id_tarea_real, item.tarea)"
              >
                <q-item-section top avatar>
                  <q-circular-progress
                    :value="(item.real / item.asignado_cantidad) * 100"
                    size="40px"
                    :thickness="0.1"
                    color="blue"
                    center-color="white"
                    track-color="grey-4"
                    rounded
                    show-value
                  >
                    {{ (item.real / item.asignado_cantidad) * 100 }}%
                  </q-circular-progress>
                </q-item-section>
                <q-item-section style="width: 50%">
                  <q-item-label lines="2" style="font-size: 1.1em">
                    <span class="text-dark">
                      {{ item.numero }}&nbsp;{{ item.tarea }}
                    </span>
                  </q-item-label>
                </q-item-section>
                <q-item-section side style="width: 50%" class="text-primary">
                  {{ item.real }} / {{ item.asignado_cantidad }}
                  {{ item.unidad }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-6">
      <q-card class="q-ma-sm">
        <q-card-section class="q-pa-none">
          <q-tabs
            v-model="tab"
            align="justify"
            active-color="primary"
            indicator-color="white"
            inline-label
            outside-arrows
            mobile-arrows
          >
            <q-tab name="resp" icon="find_in_page" label="Respaldos" />
            <q-tab name="comm" icon="chat" label="Comentarios" />
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="resp">
              <q-scroll-area style="height: 70dvh">
                <q-list bordered>
                  <q-item
                    clickable
                    v-ripple
                    v-for="n in listImg"
                    :key="n"
                    :href="`${HANSACRM3_URL}/upload/${n.name}`"
                    target="_blank"
                  >
                    <q-item-section avatar>
                      <img
                        :src="`${HANSACRM3_URL}/upload/${n.name}`"
                        v-if="n.ext == 'jpg' || n.ext == 'png'"
                        style="width: 50px; object-fit: cover"
                      />
                      <img
                        :src="`/assets/folder.png`"
                        v-else
                        style="width: 30px"
                      />
                    </q-item-section>
                    <q-item-section class="text-primary">
                      {{ n.description }}
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-scroll-area>
            </q-tab-panel>
            <q-tab-panel name="comm">
              <CommentsComponent
                module="HANY_CabeceraReporte"
                :module-id="data.id"
                description-crm3=""
              />
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
        <q-separator />
      </q-card>
    </div>
  </div>
  <alert-component v-model="showAlert" v-bind="alertAttrs" @confirm="onSubmit">
    <template #body v-if="alertAttrs.type === 'Rejected'">
      <div class="q-my-sm">
        Deje un comentario del porque se rechazo el RDO.
      </div>
      <q-input
        v-model="comment"
        type="textarea"
        label="Motivo del rechazo"
        class="col-12"
        outlined
        :rows="2"
      />
    </template>
  </alert-component>

  <ProjectTaskDialog ref="projectTaskDialogRef" />
</template>

<style scoped>
.example-item {
  height: 400px;
}
</style>
