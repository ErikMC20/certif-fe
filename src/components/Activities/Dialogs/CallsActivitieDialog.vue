<script lang="ts">
import { ref } from 'vue';
import { useQuasar, QSpinnerPuff } from 'quasar';
import { useActivityStore } from 'src/stores/ActivityStore';
import CallCard from './CallsActivityDialog/Card/CallCard.vue';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
import AssignedUser from 'src/components/AssignedUsers/AssignedUser.vue';
import CommentsList from 'src/components/Comments/CommentsList.vue';
</script>
<script lang="ts" setup>
const open = ref(false);
const callform = ref();
const asigform = ref();
const idCallreadC = ref('');
const verfotter = ref(true);
const props = withDefaults(
  defineProps<{
    idActivity?: string;
    idModule: string;
    ModuleType?: string;
  }>(),
  {
    idActivity: '',
  }
);
//* composable variables
const $q = useQuasar();
const showConfimed = ref(false);

const storeCall = useActivityStore();
//const lista = ref();
// ----------comentarios ini
const tab = ref('comentarios');
const commentCreate = ref('');

const coment = ref({
  bean_module: 'Calls',
  bean_id: '',
  visualizacion_c: 'interno',
  relevance: 'medium',
  description: '',
});
// --------- comentarios fin
// ---------------------------------------------------------------------------------
const openDialog = (ids: string) => {
  open.value = !open.value;
  idCallreadC.value = ids;
  verfotter.value = false;
};

const restoreValues = () => {
  idCallreadC.value = '';
  verfotter.value = true;
};
// --------------------------------------------------------------------------------

const CallLetfRef = ref<InstanceType<typeof CallCard> | null>(null);
const assignedSingleUserRef = ref<InstanceType<typeof AssignedUser> | null>(
  null
);
const validandoInput = async (): Promise<boolean | undefined> => {
  return (await Promise.all([CallLetfRef.value?.rulesInput()])).every(
    (val) => !!val
  );
};

const saveCallP = async () => {
  const validarData = await validandoInput();
  if (!validarData) {
    console.log('mal values');
    return;
  }
  $q.loading.show({
    spinner: QSpinnerPuff,
    message: 'Creando una llamada',
  });
  callform.value = CallLetfRef.value?.exposeData();
  // asigform.value = assignedSingleUserRef.value?.assignedUser();
  asigform.value = assignedSingleUserRef.value?.assignedUser.id;
  // console.log(callform, props);
  coment.value.description = commentCreate.value;
  coment.value.bean_id = props.idActivity;

  // await storeCall.saveComentPro(coment.value, asigform.value);
  console.log('Guarda', callform.value.id, props.ModuleType);

  if (!callform.value.id) {
    await storeCall.saveCallPro(callform.value, asigform.value, coment.value);
    // console.log('vacio', callform.value);
  } else {
    await storeCall.updateCallPro(
      callform.value,
      asigform.value,
      callform.value.id
    );
    // console.log('lleno', callform.value);
  }
  commentCreate.value = '';
  open.value = false;
  $q.loading.hide();
  emits('formSaved');
};

const alertDeleteCall = async () => {
  showConfimed.value = true;
};
const deleteCallP = async () => {
  $q.loading.show({
    spinner: QSpinnerPuff,
    message: 'Eliminando una llamada',
  });
  await storeCall.deleteCallPro(idCallreadC.value);
  $q.loading.hide();
  open.value = false;
  emits('formSaved');
};
const deletecancelCallP = () => {
  // console.log('Cancelado');
  open.value = false;
};

const cancelCallP = () => {
  // console.log('Cancelado');
  open.value = false;
};
const editarCardC = () => {
  // console.log('editando');
  verfotter.value = true;
};
const cancelCardC = () => {
  // console.log('cancelando');
  verfotter.value = false;
};
const emits = defineEmits<{ (event: 'formSaved'): void }>();

const propsCreateAlert = {
  title: 'Eliminar una llamada',
  icon: 'call',
  iconSize: 'md',
  message: 'Desea eliminar una llamada',
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
        <q-toolbar class="bg-primary q-pa-md text-white">
          <q-list>
            <q-item>
              <!-- <q-btn
                dense
                flat
                color="white"
                v-if="$q.platform.has.touch"
                icon="arrow_back_ios"
                v-close-popup
              >
              </q-btn> -->
              <q-item-section avatar>
                <q-avatar text-color="white">
                  <q-icon name="phone" size="md"></q-icon>
                </q-avatar>
              </q-item-section>
              <q-item-section v-if="!idCallreadC">
                <q-item-label class="text-white text-h5"
                  >Nueva Llamada</q-item-label
                >
                <q-item-label class="text-grey-4 text-caption"
                  >Programe una nueva llamada de manera sencilla
                </q-item-label>
              </q-item-section>
              <q-item-section v-else>
                <q-item-label class="text-white text-h5"
                  >Editar Llamada</q-item-label
                >
                <q-item-label class="text-grey-4 text-caption"
                  >Editando la llamada de manera sencilla
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-space />
          <q-btn-dropdown v-if="idCallreadC" label="Opciones" color="orange">
            <q-list>
              <q-item @click="alertDeleteCall" clickable v-close-popup>
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
        <div class="col-md-6 q-pa-sm">
          <CallCard
            ref="CallLetfRef"
            module="Leads"
            :idModule="props.idModule"
            :ModuleTypeC="props.ModuleType"
            :idCardread="idCallreadC"
            :idActivityC="props.idActivity"
            @editcard="editarCardC"
            @cancelcard="cancelCardC"
          />
        </div>
        <div class="col-md-6 q-pa-sm">
          <div class="row">
            <div class="col">
              <AssignedUser
                ref="assignedSingleUserRef"
                type="single"
                module="Calls"
                :moduleId="idCallreadC"
              />
            </div>
          </div>
          <br />
          <!-- <pre>{{ idCallread }}</pre> -->

          <!-- <CommentCard
            ref="CommentRightRef"
            module="Leads"
            id-module=""
            id=""
            name-module=""
          /> -->
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
                  style="min-height: 10vh"
                  class="q-py-sm"
                >
                  <!-- <pre>{{idActivity}}</pre> -->
                  <q-input
                    v-if="!idCallreadC"
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
                    :id="idCallreadC"
                    descCRM3=""
                    modulo="Calls"
                  />
                </q-tab-panel>
              </q-tab-panels>
            </q-card>
          </div>
        </div>
      </div>
    </template>
    <template #footer v-if="verfotter"
      ><q-btn color="primary" class="q-mr-md" @click="saveCallP">Guardar</q-btn>
      <q-btn color="negative" v-close-popup @click="cancelCallP"
        >Cancelar</q-btn
      ></template
    >
  </dialog-component>
  <AlertComponent
    v-model="showConfimed"
    v-bind="propsCreateAlert"
    @confirm="deleteCallP"
    @denegate="deletecancelCallP"
  >
    <!-- <template #body>
      <span> Esta seguro de completar la actividad? </span>
    </template> -->
  </AlertComponent>
</template>

<style lang="scss" scoped></style>
