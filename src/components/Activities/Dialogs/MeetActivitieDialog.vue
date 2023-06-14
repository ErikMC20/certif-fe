<script lang="ts">
import { ref, inject, provide, onMounted, computed } from 'vue';
import { useQuasar, QSpinnerDots } from 'quasar';
import { useActivityStore } from 'src/stores/ActivityStore';
import ViewGeneral from './MeetActivityDialog.vue/Views/ViewGeneral.vue';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
import {
  moduleKey,
  idActivityKey,
  idModuleKey,
  reactiveModuleIdKey,
  reactiveModuleNameKey,
} from '../ProvideKeys';
import {
  InfoDataMeetingModel,
  RemindersDatum,
  ModuleActivity,
} from '../../types/index';
import { deleteMeeting } from 'src/services/MeetingsServices';
</script>
<script lang="ts" setup>
const open = ref(false);
// const tab = ref('comentarios');
const props = withDefaults(
  defineProps<{
    idActivity?: string;
  }>(),
  {
    idActivity: '',
  }
);

const emits = defineEmits<{
  (event: 'saved'): void;
}>();

//* Provide Inject feature
const idActivityLocal = ref(props.idActivity);
// console.log(props.idActivity);
// provide(idActivityKey, props.idActivity || '');

const currentModule = ref(inject<string>(moduleKey));
const currentIdModle = ref(inject<string>(idModuleKey));
//* End Provide Inject feature

//* composable variables
const $q = useQuasar();

//* local variables
const deleteActivityDialog = ref(false);
const activityStore = useActivityStore();

//* computed variables
const isEditing = computed(() => !!dynamicViewRef.value?.isSomeCardEditing);

//* reference variables
const dynamicViewRef = ref<InstanceType<typeof ViewGeneral> | null>(null);

//* methods
const openDialog = (
  id?: string,
  module?: ModuleActivity,
  moduleId?: string
) => {
  currentIdModle.value = moduleId;
  currentModule.value = module;

  if (id) {
    idActivityLocal.value = id;
  }

  open.value = true;
};

const restoreValues = () => {
  idActivityLocal.value = '';
};

const captureData = async () => {
  dynamicViewRef.value?.saveMeet();
};

const saveMeet = async (
  body: {
    attributes: InfoDataMeetingModel;
    reminders: {
      user_invitees: string[];
      contact_invitees: string[];
      lead_invitees: string[];
      prospect_invitees: string[];
      reminders_data: RemindersDatum[];
    };
    attributes_comment: { [key: string]: string };
  },
  id?: string,
  options: { autoCloseDisabled?: boolean } = {}
) => {
  const { autoCloseDisabled = false } = options;
  try {
    if (!id)
      await activityStore.createMeeting(
        body.attributes,
        body.reminders,
        body.attributes_comment
      );
    else {
      await activityStore.udpateMeeting(id, body.attributes, body.reminders);
    }
    emits('saved');
    if (autoCloseDisabled) {
      await dynamicViewRef.value?.execute();
      return;
    }
    open.value = false;
  } catch (error) {
    console.log(error);
  }
};

const submitError = (message: string, type = 'warning') => {
  $q.notify({
    type: type,
    message: 'Error en la peticion',
    caption: message,
  });
};

const deleteActivity = async () => {
  try {
    $q.loading.show({
      spinner: QSpinnerDots,
      message: 'Eliminando actividad',
    });
    await deleteMeeting(idActivityLocal.value);
    emits('saved');
    $q.notify({
      type: 'warning',
      message: 'Reunion eliminada',
      caption: 'Se ha eliminado la reunion exitosamente',
    });
    open.value = false;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Error al eliminar la reunion',
      caption: 'Se ha producido un error al eliminar la reunion',
    });
  } finally {
    $q.loading.hide();
  }
};

const cancelMeet = () => {
  console.log('Cancel...');
};

(() => {
  restoreValues();
  console.log(currentModule.value, currentIdModle.value);
})();

onMounted(() => {
  console.log(idActivityLocal.value);
});

provide(idActivityKey, idActivityLocal);
provide(reactiveModuleIdKey, currentIdModle);
provide(reactiveModuleNameKey, currentModule);

defineExpose({
  openDialog,
  open,
});
</script>
<template>
  <dialog-component
    size-dialog="dialog-lg  "
    v-model="open"
    :headerDisabled="false"
    :footerDisabled="!isEditing"
    :iconDialog="''"
    :persistent="false"
    @before-hide="restoreValues"
  >
    <template #header>
      <div class="bg-primary-3 text-black">
        <q-toolbar class="bg-primary q-pa-lg text-white">
          <q-btn
            dense
            flat
            color="white"
            v-if="$q.platform.has.touch"
            icon="arrow_back_ios"
            v-close-popup
          >
          </q-btn>
          <q-avatar>
            <q-icon name="event" size="md"></q-icon>
          </q-avatar>
          <q-toolbar-title>
            <div class="column content-start items-start ellipsis">
              <span :class="$q.screen.xs ? 'text-h6' : 'text-h5'">
                {{
                  idActivityLocal ? 'Detalles de la reunion' : 'Nueva Reunion'
                }}
              </span>
              <span v-if="!$q.screen.xs" class="text-caption">
                {{
                  idActivityLocal
                    ? ''
                    : 'Programe una nueva reunion en sus actividades'
                }}</span
              >
            </div>
          </q-toolbar-title>

          <div v-if="idActivityLocal">
            <q-btn
              v-if="$q.screen.xs"
              size="md"
              color="primary"
              icon="more_vert"
              round
              unelevated
            >
              <q-menu auto-close :offset="[110, 0]">
                <q-list style="min-width: 150px">
                  <q-item @click="deleteActivityDialog = true" clickable>
                    <q-item-section>Eliminar</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
            <q-btn-dropdown
              v-else
              style="width: max-content"
              label="Opciones"
              color="white"
              size="sm"
              outline
            >
              <q-list>
                <q-item
                  @click="deleteActivityDialog = true"
                  clickable
                  v-close-popup
                >
                  <q-item-section avatar class="q-pa-none">
                    <q-icon name="delete" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Eliminar</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>

          <q-btn
            v-if="!$q.platform.has.touch"
            dense
            flat
            color="white"
            icon="close"
            v-close-popup
          >
            <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-toolbar>
      </div>
    </template>
    <template #body>
      <ViewGeneral
        ref="dynamicViewRef"
        :id-activity="idActivityLocal"
        @submit="saveMeet"
        @submit-error="submitError"
      />
    </template>
    <template #footer>
      <q-btn color="primary" class="q-mr-md" @click="captureData"
        >Guardar</q-btn
      >
      <q-btn color="negative" v-close-popup @click="cancelMeet"
        >Cancelar</q-btn
      ></template
    >
  </dialog-component>
  <AlertComponent
    title="¿Eliminar Actividad?"
    icon="warning"
    iconColor="negative"
    iconSize="50px"
    btn-color="negative"
    btn-text="Si, eliminar"
    v-model="deleteActivityDialog"
    @confirm="deleteActivity"
    @denegate="deleteActivityDialog = false"
  >
    <template #body>
      <span class="q-py-sm"> ¿Desea eliminar la reunion? </span>
    </template>
  </AlertComponent>
</template>

<style lang="scss" scoped></style>
