<script lang="ts">
import { ref, onMounted, watch } from 'vue';
import CommentsList from 'src/components/Comments/CommentsList.vue';
import { useActivityStore } from 'src/stores/ActivityStore';
import { QInput, useQuasar, QSpinnerPuff } from 'quasar';
// import ListAssignedUsers from 'src/components/AssignedUsers/ListAssignedUsers.vue';
// import AsignarUsuarios from './CallsActivityDialog/Card/AsignarUsuarios.vue';
import AssignedUser from 'src/components/AssignedUsers/AssignedUser.vue';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
</script>
<script lang="ts" setup>
const open = ref(false);
//const callform = ref();
const asigform = ref();
const idNote = ref('');
const verfotter = ref(true);
const bloqueado = ref(true);
const edit = ref(false);
const recuperandoNote = ref();
const pdfver = ref();
const eliminandoConfirm = ref(false);
const previsualizar = ref('upload/0');
const props = withDefaults(
  defineProps<{
    idActivity?: string;
    idModule: string;
    ModuleType: string;
  }>(),
  {
    idActivity: '',
  }
);
const storeCall = useActivityStore();
const tab = ref('comentarios');
const commentCreate = ref('');

const coment = ref({
  bean_module: 'Notes',
  bean_id: '',
  visualizacion_c: 'interno',
  relevance: 'medium',
  description: '',
});

const data = ref({
  asunto: '',
  archivo: '',
  tipoarchivo: '',
  nombrearchivo: '',
  descripcion: '',
  parent_pros: '',
  parent_typepros: props.ModuleType,
  filecontents: '',
});
const dataread = ref({
  id: '',
  asunto: '',
  archivo: '',
  tipoarchivo: '',
  nombrearchivo: '',
  descripcion: '',
  parent_pros: '',
  parent_typepros: '',
});
const $q = useQuasar();
const documento = ref();
watch(
  () => data.value.archivo,
  async () => {
    pdfver.value = URL.createObjectURL(data.value.archivo);
    data.value.nombrearchivo = data.value.archivo.name;
    data.value.tipoarchivo = data.value.archivo.type;
    // console.log(data.value.archivo);
    documento.value = await toBase64(data.value.archivo);
    if (
      data.value.archivo.type == 'application/pdf' ||
      data.value.archivo.type == 'application/x-empty' ||
      data.value.archivo.type == 'application/octet-stream'
    ) {
      data.value.filecontents = documento.value.replace(
        'data:application/pdf;base64,',
        ''
      );
    } else {
      data.value.filecontents = documento.value.replace(
        /^data:image\/[a-z]+;base64,/,
        ''
      );
    }

    // console.log(documento.value.replace('data:application/pdf;base64,', ''));
    // .replace(/^data:image\/[a-z]+;base64,/, ""); para imagenes
  }
);
watch(
  () => dataread.value.archivo,
  async () => {
    pdfver.value = URL.createObjectURL(dataread.value.archivo);
    dataread.value.nombrearchivo = dataread.value.archivo.name;
    dataread.value.tipoarchivo = dataread.value.archivo.type;

    // console.log(pdfver.value, dataread.value.id);
    // console.log(convertToBase64());
  }
);

const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
// ---------------------------------------------------------------------------------
const openDialog = (ids: string) => {
  console.log(ids);
  open.value = !open.value;
  idNote.value = ids;
  verfotter.value = false;
  edit.value = false;
  recuperandoNotaPRO(idNote.value);

  pdfver.value = idNote.value;
  console.log(
    'PROSPECT',
    ids,
    props.idModule,
    idNote.value + '.pdf',
    pdfver.value
  );
};

const recuperandoNotaPRO = async (str: any) => {
  recuperandoNote.value = await storeCall.getNotePro(str);
  console.log(recuperandoNote.value);
  dataread.value.id = recuperandoNote.value.id;
  dataread.value.asunto = recuperandoNote.value.attributes.name;
  dataread.value.archivo = recuperandoNote.value.attributes.filename;
  dataread.value.tipoarchivo = recuperandoNote.value.attributes.file_mime_type;
  dataread.value.nombrearchivo = recuperandoNote.value.attributes.filename;
  dataread.value.descripcion = recuperandoNote.value.attributes.description;
  dataread.value.parent_pros = recuperandoNote.value.attributes.parent_id;
  dataread.value.parent_typepros = recuperandoNote.value.attributes.parent_type;

  previsualizar.value = `${HANSACRM3_URL}/index.php?entryPoint=download&id=${idNote.value}&type=Notes`;
  pdfver.value = `${HANSACRM3_URL}/upload/${recuperandoNote.value.id}`;
  console.log(pdfver.value, previsualizar.value);
};
const restoreValues = () => {
  idNote.value = '';
  verfotter.value = true;
  console.log('para idcero', idNote);
  edit.value = false;
  data.value = {
    asunto: '',
    archivo: '',
    tipoarchivo: '',
    nombrearchivo: '',
    descripcion: '',
    parent_pros: '',
    parent_typepros: 'Notes',
    filecontents: '',
  };
};

// --------------------------------------------------------------------------------
onMounted(async () => {
  // console.log(props.idModule, props.idActivity);
  if (idNote.value != '') {
    recuperandoNotaPRO(idNote.value);
  } else {
  }
});
const subjectInputRef = ref<InstanceType<typeof QInput> | null>(null);
// const CommentRightRef = ref<InstanceType<typeof CommentCard> | null>(null);
const assignedSingleUserRef = ref<InstanceType<typeof AssignedUser> | null>(
  null
);
const validandoInput = async (): Promise<boolean | undefined> => {
  return (await Promise.all([subjectInputRef.value?.validate()])).every(
    (val) => !!val
  );
};
// const rulesInput = async (): Promise<boolean | undefined> =>
//   (await Promise.all([subjectInputRef.value?.validate()])).every(
//     (input) => !!input
//   );
const saveNoteP = async () => {
  // callform.value = CallLetfRef.value?.exposeData();

  const validarData = await validandoInput();
  if (!validarData) {
    console.log('mal values');
    return;
  }
  $q.loading.show({
    spinner: QSpinnerPuff,
    message: 'Creando una nota',
  });
  asigform.value = assignedSingleUserRef.value?.assignedUser.id;
  data.value.parent_pros = props.idModule;
  coment.value.description = commentCreate.value;
  coment.value.bean_id = props.idActivity;
  console.log('Guarda');
  if (!idNote.value) {
    console.log('vacio', data.value);
    await storeCall.saveNotePro(data.value, asigform.value, coment.value);
  } else {
    console.log('lleno', dataread.value);
    await storeCall.updateNotePro(
      dataread.value,
      asigform.value,
      dataread.value.id
    );
  }
  commentCreate.value = '';
  open.value = false;
  $q.loading.hide();
  emits('formSaved');
};

const cancelNoteP = () => {
  console.log('Cancelado');
  open.value = false;
};

const EliminarNote = async () => {
  eliminandoConfirm.value = true;
};
const deleteNoteP = async () => {
  $q.loading.show({
    spinner: QSpinnerPuff,
    message: 'Eliminando una nota',
  });
  await storeCall.deleteNotePro(idNote.value);
  $q.loading.hide();
  open.value = false;
  emits('formSaved');
};

const deletecancelNoteP = () => {
  console.log('Cancelando la eliminacion');
};

// -----------------------------------------------------------------
// const editarCardC = () => {
//   console.log('editando');
//   verfotter.value = true;
// };
// const cancelCardC = () => {
//   console.log('cancelando');
//   verfotter.value = false;
// };
const editList = () => {
  edit.value = true;
  bloqueado.value = false;
  verfotter.value = true;
};

const cancelEdit = () => {
  edit.value = false;
  bloqueado.value = true;
  verfotter.value = false;
};
const emits = defineEmits<{ (event: 'formSaved'): void }>();

const propsCreateAlert = {
  title: 'Eliminar nota',
  icon: 'note_alt',
  iconSize: 'md',
  message: 'Desea eliminar el registro de la nota?',
  iconColor: 'primary',
  btnColor: 'red',
  btnText: 'Si, estoy seguro',
};

defineExpose({
  openDialog,
  open,
});
</script>
<template>
  <dialog-component
    size-dialog="dialog-lg"
    v-model="open"
    :footerDisabled="false"
    :headerDisabled="false"
    :iconDialog="''"
    :persistent="false"
    @before-hide="restoreValues"
  >
    <template #header>
      <div class="bg-primary-3 text-black">
        <q-toolbar class="bg-primary q-pa-lg">
          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-avatar text-color="white">
                  <q-icon name="note_alt" size="md"></q-icon>
                </q-avatar>
              </q-item-section>
              <q-item-section v-if="!idNote">
                <q-item-label class="text-white text-h5"
                  >Nueva Nota</q-item-label
                >
                <q-item-label class="text-grey-4 text-caption"
                  >Programe una nueva nota de manera sencilla
                </q-item-label>
              </q-item-section>
              <q-item-section v-else>
                <q-item-label class="text-white text-h5"
                  >Editar Nota</q-item-label
                >
                <q-item-label class="text-grey-4 text-caption"
                  >Editando la nota de manera sencilla
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-space />
          <q-btn-dropdown v-if="idNote" label="Opciones" color="orange">
            <q-list>
              <q-item @click="EliminarNote" clickable v-close-popup>
                <q-item-section>
                  <q-item-label>Eliminar</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn
            dense
            flat
            color="white"
            :icon="!$q.screen.xs ? 'close' : 'arrow_back_ios'"
            v-close-popup
          >
            <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-toolbar>
      </div>
    </template>
    <template #body>
      <div class="row">
        <div class="col-md-6 q-pa-sm" v-if="!idNote">
          <q-card class="my-card">
            <q-card-section class="row justify-between">
              <span>
                <q-icon name="call" size="sm" color="primary" /> Informacion de
                la nota
              </span>
            </q-card-section>
            <q-separator></q-separator>
            <q-card-section>
              <div class="row q-col-gutter-sm">
                <div class="col-xs-12">
                  <q-input
                    v-model="data.asunto"
                    ref="subjectInputRef"
                    type="text"
                    label="Asunto"
                    outlined
                    dense
                    color="primary"
                    :rules="[(val) => !!val || 'El campo es requerido']"
                  >
                    <template #before>
                      <q-icon name="contact_phone" />
                    </template>
                  </q-input>
                </div>
                <div class="col-xs-12">
                  <q-file
                    outlined
                    v-model="data.archivo"
                    label="Adjuntar archivo"
                    dense
                    standout
                    bottom-slots
                    counter
                    clearable
                  >
                    <template v-slot:append>
                      <q-icon name="attachment" />
                    </template>
                    <template #before>
                      <q-icon name="note_alt" />
                    </template>
                    <template v-slot:hint> Tamaño del archivo </template>
                  </q-file>
                </div>
                <div class="col-xs-12" v-if="data.archivo">
                  <embed
                    :src="pdfver"
                    type="application/pdf"
                    width="400"
                    height="200"
                  />
                </div>

                <!-- <pre>{{ pdfver }}</pre> -->

                <!-- <q-card flat bordered class="q-mt-md bg-grey-2">
                  <q-card-section> Documento adjunto </q-card-section>
                </q-card> -->
                <!-- <div class="col-xs-12">
                  <q-card flat bordered class="q-mt-md bg-grey-2">
                    <q-card-section>Documento adjunto: </q-card-section>
                    <q-separator />
                    <q-card-section class="row q-gutter-sm items-center">
                      Documento adjunto = {{ data.archivo }}
                    </q-card-section>
                  </q-card>
                </div> -->

                <div class="col-xs-12">
                  <q-input
                    v-model="data.descripcion"
                    type="textarea"
                    label="Descripción"
                    outlined
                    color="primary"
                    dense
                  >
                    <template #before>
                      <q-icon name="description" />
                    </template>
                  </q-input>
                </div>
                <!-- <pre>{{ data }}</pre> -->
              </div>
            </q-card-section>
            <q-separator inset />
          </q-card>
        </div>
        <!-- PARA LEER DATOS DE LA NOTA ----------------------------------------->
        <div class="col-md-6 q-pa-sm" v-else>
          <q-card class="my-card">
            <q-card-section class="row justify-between">
              <span>
                <q-icon name="call" size="sm" color="primary" /> Informacion de
                la nota
              </span>
              <q-btn
                size="10px"
                flat
                dense
                icon="mode_edit"
                class="float-right"
                :color="!$q.dark.isActive ? 'grey-8' : 'white'"
                @click="editList"
                v-if="!edit"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn
                v-else
                size="10px"
                flat
                dense
                icon="cancel"
                class="float-right"
                :color="!$q.dark.isActive ? 'grey-8' : 'white'"
                @click="cancelEdit"
              >
                <q-tooltip>Cancelar</q-tooltip>
              </q-btn>
            </q-card-section>
            <q-separator></q-separator>
            <q-card-section>
              <div class="row q-col-gutter-sm">
                <div class="col-xs-12">
                  <q-input
                    v-model="dataread.asunto"
                    ref="subjectInputRef"
                    type="text"
                    label="Asunto"
                    outlined
                    dense
                    color="primary"
                    :rules="[(val) => !!val || 'El campo es requerido']"
                    :readonly="bloqueado"
                  >
                    <template #before>
                      <q-icon name="contact_phone" />
                    </template>
                  </q-input>
                </div>
                <div class="col-xs-12">
                  <q-file
                    outlined
                    v-model="dataread.archivo"
                    label="Adjuntar archivo"
                    dense
                    standout
                    bottom-slots
                    counter
                    clearable
                    :readonly="bloqueado"
                  >
                    <template v-slot:append>
                      <q-icon name="attachment" />
                    </template>
                    <template #before>
                      <q-icon name="note_alt" />
                    </template>
                    <template v-slot:hint> Tamaño del archivo </template>
                  </q-file>
                </div>
                <div class="col-xs-12" v-if="dataread.archivo">
                  <embed
                    :src="pdfver"
                    type="application/pdf"
                    width="400"
                    height="200"
                  />
                </div>
                <!-- <q-card flat bordered class="q-mt-md bg-grey-2">
                  <q-card-section> Documento adjunto </q-card-section>
                </q-card> -->
                <!-- <div class="col-xs-12">
                  <q-card flat bordered class="q-mt-md bg-grey-2">
                    <q-card-section>Documento adjunto: </q-card-section>
                    <q-separator />
                    <q-card-section class="row q-gutter-sm items-center">
                      Documento adjunto = {{ data.archivo }}
                    </q-card-section>
                  </q-card>
                </div> -->

                <div class="col-xs-12">
                  <q-input
                    v-model="dataread.descripcion"
                    type="textarea"
                    label="Descripción"
                    outlined
                    color="primary"
                    dense
                    :readonly="bloqueado"
                  >
                    <template #before>
                      <q-icon name="description" />
                    </template>
                  </q-input>
                </div>
                <!-- <pre>{{ dataread }}</pre> -->
              </div>
            </q-card-section>
            <q-separator inset />
          </q-card>
        </div>
        <!-- <div class="col-md-6 q-pa-sm">
          <CallCard
            ref="CallLetfRef"
            module="Leads"
            :idCallRead="props.idCallRead"
          />
        </div> -->
        <div class="col-md-6 q-pa-sm">
          <!-- <pre>{{ idCallread }}</pre> -->
          <div class="row">
            <div class="col">
              <AssignedUser
                ref="assignedSingleUserRef"
                type="single"
                module="Notes"
                :moduleId="idNote"
              />
            </div>
          </div>
          <br />
          <div class="row">
            <q-card style="width: 100%; height: 55vh; overflow-y: auto">
              <q-tabs
                class="q-ma-none"
                v-model="tab"
                indicator-color="primary"
                :inline-label="!$q.screen.xs"
                :active-color="$q.dark.isActive ? 'orange' : 'primary'"
                align="justify"
                :no-caps="$q.screen.xs ? true : false"
              >
                <q-tab name="comentarios" icon="comment" label="Comentarios" />
                <!-- <q-tab name="Relation" icon="people" label="Participantes" /> -->
              </q-tabs>
              <q-tab-panels
                v-model="tab"
                animated
                style="min-height: fit-content"
              >
                <q-tab-panel
                  name="comentarios"
                  style="min-height: 59vh"
                  class="q-py-sm"
                >
                  <!-- <pre>{{idActivity}}</pre> -->
                  <q-input
                    v-if="!idNote"
                    autogrow
                    outlined
                    bottom-slots
                    v-model="commentCreate"
                    placeholder="Escriba su comentario inicial"
                    dense
                    color="primary"
                    ref="commentRef"
                  >
                    <!-- <template v-slot:before>
                      <q-avatar>
                        <img :src="services.readImageUser" />
                      </q-avatar>
                    </template> -->
                  </q-input>
                  <CommentsList
                    v-else
                    :id="idNote"
                    descCRM3=""
                    modulo="Notes"
                  />
                </q-tab-panel>
              </q-tab-panels>
            </q-card>
          </div>
        </div>
      </div>
      <!-- <pre>{{ coment }}</pre> -->
    </template>
    <template #footer v-if="verfotter"
      ><q-btn color="primary" class="q-mr-md" @click="saveNoteP">Guardar</q-btn>
      <q-btn color="negative" v-close-popup @click="cancelNoteP"
        >Cancelar</q-btn
      ></template
    >
  </dialog-component>
  <AlertComponent
    v-model="eliminandoConfirm"
    v-bind="propsCreateAlert"
    @confirm="deleteNoteP"
    @denegate="deletecancelNoteP"
  >
    <!-- <template #body>
      <span> Esta seguro de completar la actividad? </span>
    </template> -->
  </AlertComponent>
</template>

<style lang="scss" scoped></style>
