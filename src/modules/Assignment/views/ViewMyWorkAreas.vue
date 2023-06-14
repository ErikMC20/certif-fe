<script lang="ts">
import ModuleSkeleton from '../components/Skeletons/ModuleSkeleton.vue';
import WorkAreasDialog from 'src/modules/WorkAreas/components/Dialogs/WorkAreasDialog.vue';
import { useAsyncState } from '@vueuse/core';
import { ref, computed } from 'vue';
import { userStore } from '../../Users/store/UserStore';
import { getWorkareasByUser } from '../services/useAssignmentService';
</script>
<script setup lang="ts">
const props = defineProps<{
  projectId: string;
  moduleId: string;
}>();

defineEmits<{
  (event: 'submitComplete', values: string): void;
}>();

interface Area {
  id?: string;
  name: string;
  codigo: string;
  pais: string;
  region: string;
  supervisor_id: string;
  supervisor: string;
  cargo: string;
}

const { userCRM } = userStore();

//refs
const workareaDialogRef = ref<InstanceType<typeof WorkAreasDialog> | null>(
  null
);

//variables
const filter = ref('');

const { state, isReady } = useAsyncState(async () => {
  return (await getWorkareasByUser(userCRM.id, props.projectId)) as Area[];
}, <Area[]>[]);

//functions
const listFiltered = computed(() => {
  if (filter.value == '') {
    return state.value;
  }
  return state.value.filter(
    (objeto: Area) =>
      objeto.name.toLowerCase().indexOf(filter.value.toLowerCase()) > -1 ||
      objeto.codigo.toLowerCase().indexOf(filter.value.toLowerCase()) > -1
  );
});

// const formSaved = async () => {
//   workareaDialogRef.value?.onCloseDialog();
//   await execute();
// };

const openItemSelected = (id: string, title: string) => {
  workareaDialogRef.value?.openDialog(id, title);
};
</script>

<template>
  <ModuleSkeleton v-if="!isReady" />
  <q-card v-else class="no-border-radius" style="height: calc(100dvh - 90px)">
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
      </div>
      <div class="col-xs-12 col-md-3">
        <q-list separator>
          <q-item
            v-for="(area, index) in listFiltered"
            :key="index"
            clickable
            v-ripple
            class="q-py-md"
            @click="openItemSelected(area.id ?? '', area.name)"
          >
            <q-item-section>
              <q-item-label style="font-size: 1.2em">
                <span class="text-blue-8">
                  {{ area.codigo }}
                </span>
                {{ area.name }}
              </q-item-label>
              <q-item-label caption lines="2">
                {{ area.pais }} | {{ area.region }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="arrow_forward" color="grey-4" size="xs" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-card-section>
  </q-card>
  <WorkAreasDialog
    ref="workareaDialogRef"
    :project-id="moduleId"
    @formSaved="() => {}"
  />
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
