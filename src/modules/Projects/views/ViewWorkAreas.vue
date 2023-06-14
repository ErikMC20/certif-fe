<script lang="ts">
import { base } from '../utils/types';
import ModuleSkeleton from '../components/Skeletons/ModuleSkeleton.vue';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import WorkAreasDialog from 'src/modules/WorkAreas/components/Dialogs/WorkAreasDialog.vue';
import { useAsyncState } from '@vueuse/core';
import { getWorkArasList } from '../services/useProjectService';
import { deleteWordArea } from '../../WorkAreas/services/useWorkAreasService';

import { AlertComponent } from 'src/components';
import { Notification, setDefaultAvatar } from 'src/composables';
import { QSpinnerIos, Loading } from 'quasar';
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
const workareaDialogRef = ref<InstanceType<typeof WorkAreasDialog> | null>(
  null
);

//variables
const filter = ref('');
const showDelete = ref(false);
const itemSelected = ref();

const { state, execute, isLoading, isReady } = useAsyncState(async () => {
  const data = await getWorkArasList(props.moduleId);
  return data;
}, [] as base[]);

//functions
const listFiltered = computed(() => {
  if (filter.value == '') {
    return state.value;
  }
  return state.value.filter(
    (objeto: base) =>
      objeto.name.toLowerCase().indexOf(filter.value.toLowerCase()) > -1 ||
      objeto.codigo.toLowerCase().indexOf(filter.value.toLowerCase()) > -1
  );
});

const formSaved = async () => {
  workareaDialogRef.value?.onCloseDialog();
  await execute();
};

const openDialog = () => {
  workareaDialogRef.value?.openDialog();
};

const onDelete = (item: base) => {
  itemSelected.value = item;
  showDelete.value = !showDelete.value;
};

const confirmDelete = async () => {
  try {
    isLoading.value = true;
    Loading.show({
      spinner: QSpinnerIos,
      message: 'Eliminando registro...',
    });
    await deleteWordArea(itemSelected.value.id);

    execute();
  } catch (error) {
  } finally {
    Loading.hide();
    Notification('positive', 'check', 'Eliminado correctamente');
  }
};

const denegateDelete = () => {
  itemSelected.value = null;
  showDelete.value = false;
};

const openItemSelected = (id: string, title: string) => {
  workareaDialogRef.value?.openDialog(id, title);
};
</script>

<template>
  <ModuleSkeleton v-if="!isReady" />
  <q-card v-else class="no-border-radius" style="height: 70vh; width: 100%">
    <q-card-section>
      <div class="row col-12 justify-between q-px-sm">
        <div class="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-xs-12 q-mb-sm">
          <q-input
            bottom-slots
            dense
            v-model="filter"
            placeholder="Buscar por nombre, codigo"
          >
            <template v-slot:hint>
              <span class="text-primary" v-if="filter != ''"
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
            <slot name="buttons">
              <q-btn
                :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'"
                color="primary"
                label="Nueva Area de trabajo"
                @click="openDialog"
                size="md"
              />
            </slot>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-md-3 q-pa-sm">
        <template v-if="listFiltered.length > 0">
          <q-list separator bordered class="q-mb-sm">
            <q-item
              clickable
              v-for="(item, index) in listFiltered"
              :key="index"
              @click="openItemSelected(item.id, item.name)"
            >
              <q-item-section avatar>
                <q-icon name="engineering" size="sm" color="primary" />
              </q-item-section>
              <q-item-section avatar>
                <q-item-label caption class="q-mr-lg">Código</q-item-label>
                <q-item-label class="text-blue-9">
                  {{ item.codigo }}
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption>Lugar de trabajo</q-item-label>
                <q-item-label>
                  {{ item.name }}
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption> País</q-item-label>
                <q-item-label class="">
                  <img
                    :src="`https://flagcdn.com/w20/${item.pais_code.toLowerCase()}.png`"
                    alt=""
                    width="15"
                  />
                  &nbsp;
                  {{ item.pais }}
                </q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label caption> Región</q-item-label>
                <q-item-label class="">
                  {{ item.region }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-item-label caption> Supervisor</q-item-label>
                <q-item-label>
                  <small class="text-dark">
                    {{ item.supervisor }}
                  </small>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-avatar size="33px" class="shadow-1">
                  <img
                    :src="`${HANSACRM3_URL}/upload/users/${item.supervisor_id}`"
                    @error="setDefaultAvatar"
                  />
                </q-avatar>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  icon="more_vert"
                  rounded
                  dense
                  @click="(e) => e.stopPropagation()"
                >
                  <q-menu>
                    <q-list dense>
                      <q-item clickable v-close-popup @click="onDelete(item)">
                        <q-item-section>Eliminar</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-item-section>
            </q-item>
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
  <WorkAreasDialog
    ref="workareaDialogRef"
    :project-id="moduleId"
    @formSaved="formSaved"
  />

  <AlertComponent
    v-model="showDelete"
    icon="warning"
    icon-size="60px"
    icon-color="warning"
    btn-text="Si, Eliminar"
    btn-color="negative"
    title="Eliminar area de trabajo"
    @confirm="confirmDelete"
    @denegate="denegateDelete"
  >
    <template #body>
      <div class="text-center">
        ¿Quieres eliminar al area de trabajo:
        <span class="text-negative text-uppercase">
          {{ itemSelected.name }}</span
        >
        del proyecto?
      </div>
    </template>
  </AlertComponent>
</template>

<style lang="scss" scoped>
.userName {
  max-width: 200px;
  line-break: auto;
  white-space: normal;
  margin-left: 0.5rem;
  font-size: 0.7rem;
}
</style>
