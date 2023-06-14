<script setup lang="ts">
import { ref, onMounted } from 'vue';
import moment from 'moment';
import { useAssignmentStore } from '../store/useAssignmentStore';
import { useAsyncState } from '@vueuse/core';
import {
  getProjectTask,
  createLoadedTask,
} from '../services/useAssignmentService';
import { Notify, QStepper, QUploader, Loading, uid } from 'quasar';
import { AlertComponent } from 'src/components';
import { userStore } from '../../Users/store/UserStore';
import { dataFormatCRM3Basic } from 'src/conections/conexionCRM3';
import { axiosCRM3 } from 'src/conections/axiosPRY';
import { Notification } from 'src/composables';
//* computed variables
const props = defineProps<{
  moduleId: string;
}>();

interface Tasks {
  id_tarea_real: string;
  id_tarea_asignado: string;
  numero: string;
  unidad: string;
  tarea: string;
  porcentaje: number;
  cantidad: number;
  asignado_cantidad: number;
  asignado_avance: number;
  asignado_porcentaje: number;
  objetivo_cantidad: number;
  objetivo_avance: number;
  objetivo_porcentaje: number;
  real: number;
}

const { userCRM } = userStore();

const assignmentStore = useAssignmentStore();
const isSomeCardEditing = true;
const step = ref(1);
const showConfirm = ref(false);
const comment = ref('');
const headerId = ref('');
const uploadFileRef = ref<InstanceType<typeof QUploader> | null>();
const tasksList = ref<Tasks[]>([]);
const stepper = ref<InstanceType<typeof QStepper> | null>(null);
const form = ref({
  fechaIni: '',
  fechaFin: '',
});

const {
  state: data,
  execute,
  isLoading,
} = useAsyncState(
  async () => {
    return await assignmentStore.useGetAssignment(props.moduleId);
  },
  {},
  { immediate: false }
);

const { execute: execTasks } = useAsyncState(
  async () => {
    const data = await getProjectTask(props.moduleId);
    tasksList.value = data;
    return data;
  },
  <Tasks[]>[],
  { immediate: false }
);

const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

const uploadSubImages = async (files: File[]) => {
  try {
    const img = (await toBase64(files[0])) as string;
    const dataSend = {
      IdFoto: uid(),
      Foto: img.replace(/^data:(.*,)?/, ''),
      IdTipoDocumento: '',
      IdTipoFoto: '',
      IdReporte: headerId.value,
      Ext: files[0].name.split('.').pop(),
      Name: files[0].name,
      user_id: userCRM.id,
    };
    console.log(dataSend);
    const data = dataFormatCRM3Basic('project_upload_photos', {
      data: dataSend,
    });
    await axiosCRM3.post('', data);
  } catch (error) {
    throw error;
  }
};

const onConfirm = () => {
  showConfirm.value = true;
};

const onSubmit = async () => {
  try {
    Loading.show({
      message: 'Guardando Información',
    });

    const dataSend = {
      asignacion_id: data.value.id,
      objetivo_id: data.value.objetivo_id,
      planificacion_id: data.value.planificacion_id,
      instalacion_id: data.value.instalacion_id,
      fecha_inicio: form.value.fechaIni,
      fecha_fin: form.value.fechaFin,
      comentario: comment.value,
      tasks: tasksList.value
        .filter((el: Tasks) => el.real > 0)
        .map((el: Tasks) => {
          return {
            id: el.id_tarea_real,
            name: el.tarea,
            cantidad: el.real,
            unidad_medida: el.unidad,
            id_asignado: el.id_tarea_asignado,
            duration: moment(form.value.fechaFin).diff(
              moment(form.value.fechaIni),
              'hours'
            ),
            avance_real: (el.real / el.asignado_cantidad) * 100,
          };
        }),
    };

    const res = await createLoadedTask(dataSend);
    //header
    headerId.value = res.data.id;
    // file uploads
    uploadFileRef.value?.upload();
  } catch (error) {
  } finally {
    Loading.hide();
    Notification(
      'positive',
      'check_circle',
      'Se guardó correctamente, espere a su aprobacion'
    );
    emit('submitComplete');
  }
};

const onRejected = (rejectedEntries: any) => {
  Notify.create({
    type: 'negative',
    message: `${rejectedEntries.length} file(s) did not pass validation constraints`,
  });
};

onMounted(() => {
  execTasks();
  execute();
  form.value.fechaIni = moment().format('YYYY-MM-DD');
  form.value.fechaFin = moment().add(5, 'days').format('YYYY-MM-DD');
});

defineExpose({
  //onSubmit,
  isSomeCardEditing,
});

const emit = defineEmits<{
  (e: 'submitComplete'): void;
}>();
</script>
<template>
  <q-card class="my-card q-mt-md" v-if="isLoading">
    <q-card-section class="q-gutter-sm q-my-sm">
      <q-skeleton type="rect" height="50px" />
      <q-skeleton type="rect" height="50px" />
      <q-skeleton type="rect" height="50px" />
    </q-card-section>
    <q-card-section class="q-gutter-sm">
      <q-skeleton type="rect" height="50px" />
    </q-card-section>
    <q-card-section class="q-gutter-sm">
      <q-skeleton type="rect" height="50px" />
      <q-skeleton type="rect" height="50px" />
      <q-skeleton type="rect" height="50px" />
      <q-skeleton type="rect" height="50px" />
      <q-skeleton type="rect" height="50px" />
      <q-skeleton type="rect" height="50px" />
      <q-skeleton type="rect" height="50px" />
    </q-card-section>
  </q-card>

  <q-stepper
    v-else
    v-model="step"
    ref="stepper"
    animated
    contracted
    keep-alive
    class="stepper-hansa"
  >
    <q-step
      :name="1"
      title=""
      icon="feed"
      :done="step > 1"
      done-color="positive"
      active-color="primary"
      inactive-color="secondary"
      error-color="negative"
    >
      <q-card-section class="bg-green-2 text-dark">
        <div>
          Código: <span class="text-primary"> {{ data.code_c }}</span>
        </div>
        <div>
          Área: <span class="text-primary"> {{ data.instalacion_name }}</span>
        </div>
        <div>
          Fecha inicio:
          <span class="text-primary">{{ data.estimated_start_date_c }}</span>
        </div>
        <div>
          Fecha fin:
          <span class="text-primary">{{ data.estimated_end_date_c }}</span>
        </div>
      </q-card-section>
      <q-card-section class="row q-col-gutter-sm q-px-none">
        <q-input
          v-model="form.fechaIni"
          type="date"
          class="col-6"
          outlined
          dense
        />
        <q-input
          v-model="form.fechaFin"
          type="date"
          class="col-6"
          outlined
          dense
        />
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-card-section
          class="text-center text-dark q-pa-sm shadow-1 bg-grey-3"
        >
          <q-icon name="list" size="20px" /> LISTA DE TAREAS
        </q-card-section>
        <q-list bordered separator>
          <q-item v-for="(item, index) in tasksList" :key="index" clickable>
            <q-item-section style="width: 50%">
              <q-item-label lines="2" style="font-size: 1.1em">
                <span class="text-grey-7"> {{ item.numero }}&nbsp; </span>
                {{ item.tarea }}
              </q-item-label>
            </q-item-section>
            <q-item-section side style="width: 50%">
              <div>
                <q-input
                  v-model.number="item.real"
                  type="number"
                  :min="0"
                  dense
                  outlined
                  hide-bottom-space
                  hide-hint
                  no-error-icon
                  :rules="[
                      (val:number) =>
                        val <= item.asignado_cantidad || 'Cantidad excedida'
                    ]"
                  square
                >
                  <template v-slot:append>
                    /
                    <span
                      style="font-size: 0.5em; width: 50px"
                      class="text-dark text-center"
                    >
                      {{ ` ${item.asignado_cantidad}` }} <br />
                      {{ item.unidad }}
                    </span>
                  </template>
                </q-input>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-step>

    <q-step
      :name="2"
      title=""
      icon="collections"
      :done="step > 2"
      done-color="positive"
      active-color="primary"
      inactive-color="secondary"
    >
      <q-uploader
        :factory="uploadSubImages"
        multiple
        class="full-width bg-grey-3 shadow-1"
        accept=".jpg, image/*, .pdf, .docx, .xlsx, .doc, .txt, .csv"
        style="height: calc(100dvh - 300px)"
        @rejected="onRejected"
        ref="uploadFileRef"
      >
        <template v-slot:header="scope">
          <div class="q-pa-sm bg-white text-dark flex justify-between">
            <q-btn
              :disabled="!scope.queuedFiles.length"
              icon="clear_all"
              @click="scope.removeQueuedFiles"
              dense
              flat
            >
              <q-tooltip>Quitar todo</q-tooltip>
            </q-btn>
            <q-btn
              v-if="scope.canAddFiles"
              type="a"
              icon="add"
              color="primary"
              label="agregar respaldos"
              @click="scope.pickFiles"
            >
              <q-uploader-add-trigger />
            </q-btn>
          </div>
        </template>
        <template v-slot:list="scope">
          <q-list separator class="bg-white" style="width: 85dvw">
            <q-item v-for="file in scope.files" :key="file.__key">
              <q-item-section v-if="file.__img">
                <img
                  :src="file.__img.src"
                  style="width: 100%; max-height: 300px; object-fit: cover"
                />
                <q-item-label caption class="q-py-sm">
                  Tamaño: {{ file.__sizeLabel }}
                </q-item-label>
              </q-item-section>
              <q-item-section v-else>
                <q-item-label lines="10" class="text-caption">
                  {{ file.name }}
                </q-item-label>
                <q-item-label caption>
                  Tamaño: {{ file.__sizeLabel }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn
                  size="12px"
                  flat
                  dense
                  round
                  icon="delete"
                  @click="scope.removeFile(file)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </template>
      </q-uploader>
    </q-step>

    <q-step
      title=""
      :name="3"
      icon="chat"
      :done="step > 2"
      done-color="positive"
      active-color="primary"
      inactive-color="secondary"
    >
      <q-editor v-model="comment" />
    </q-step>
    <template v-slot:navigation>
      <q-stepper-navigation style="margin-top: 10px; text-align: center">
        <q-btn
          @click="step != 3 ? stepper?.next() : onConfirm()"
          color="primary"
          :icon="step === 3 ? 'check' : 'arrow_forward'"
          :label="step === 3 ? 'Finalizar' : 'Siguiente'"
        />
        <q-btn
          v-if="step > 1"
          flat
          color="primary"
          @click="stepper?.previous()"
          label="Volver"
          class="q-ml-sm"
        />
      </q-stepper-navigation>
    </template>
  </q-stepper>

  <AlertComponent
    v-model="showConfirm"
    btn-color="primary"
    btn-text="Si, guardar"
    message="Una vez guardado no podrá editar la información"
    title="¿Esta seguro de guardar la información?"
    icon="warning"
    icon-color="warning"
    icon-size="80px"
    @confirm="onSubmit"
  />
</template>

<style lang="scss">
.q-stepper.stepper-hansa {
  height: calc(100dvh - 120px);
  .q-stepper__content.q-panel-parent {
    margin-bottom: 10px !important;
    .q-stepper__step-inner {
      padding: 10px !important;
    }
  }
}

.q-uploader {
  max-height: 100%;
}
</style>
