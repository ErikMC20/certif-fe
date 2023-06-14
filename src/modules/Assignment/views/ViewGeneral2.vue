<script lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAsyncState } from '@vueuse/core';
import { GenericModel } from '../utils/types';
import { userStore } from 'src/modules/Users/store/UserStore';
import { Notify, Loading } from 'quasar';
import {
  getTaskList,
  getWorkareasList,
  getLastPlanning,
} from '../services/useAssignmentService';
import { getGoalsList } from '../services/useAssignmentService';
import ActivitiesDialog from '../components/Dialogs/ActivitiesDialog.vue';
import DateRangeWithDays from 'src/components/DateRangeWithDays/DateRangeWithDays.vue';
</script>
<script setup lang="ts">
interface Goal {
  id_objetivo?: string;
  id_instalacion: string;
  id_tarea: string;
  fecha_inicio: string;
  fecha_fin: string;
  total: number;
  cantidad: number;
  deleted?: boolean;
}

//props
const props = defineProps<{
  moduleId: string;
}>();

//store
const { userCRM } = userStore();

//variables
const tableRef = ref();
const inputGoalRef = ref();
const isLoading = ref(false);
const listAssignation = ref<[]>([]);
const pagination = ref({
  rowsPerPage: 0,
});

const filtro = ref({
  tipo: 'task',
  search: '',
  area: <string[]>[],
  completo: '',
});

const activitiesDialogRef = ref<InstanceType<typeof ActivitiesDialog> | null>(
  null
);

const { state: planif, execute: explan } = useAsyncState(
  async () => {
    return await getLastPlanning(props.moduleId);
  },
  {},
  { immediate: false }
);

const { state: tareas, execute: extareas } = useAsyncState(
  async (id: string) => {
    const res = await getTaskList(id);
    return res.map((el: GenericModel) => {
      return {
        number: el.$wbs,
        id_task: el.real_id,
        id_planification: el.planification_id,
        id_workarea: '',
        task_name: el.text,
        task_quantity: el.quantity,
        start_date: el.date_start,
        end_date: el.date_finish,
        task_parent: el.parent,
        task_type: el.type,
        task_unit: el.unit,
        goal_quantity: 0,
        gantt_parent: el.parent,
        gantt_id: el.id,
        incidence: el.incidence,
      };
    });
  },
  [] as GenericModel[],
  { immediate: false }
);

const { state: areas, execute: exareas } = useAsyncState(
  async () => {
    const res = await getWorkareasList(props.moduleId);
    return res.map((el: GenericModel) => {
      return {
        id: el.id,
        name: el.name.toLowerCase().replace(' ', '_'),
        label: el.name,
        field: el.name.toLowerCase().replace(' ', '_'),
        sortable: false,
        align: 'center',
      };
    });
  },
  [] as GenericModel[],
  { immediate: false }
);

const { state: objetivos, execute: exgoal } = useAsyncState(
  async (id: string) => {
    return await getGoalsList(id);
  },
  [],
  { immediate: false }
);

const tasksFiltered = computed(() => {
  const search = filtro.value.search.toLocaleLowerCase();
  const tipoFiltrado = filtro.value.tipo !== '';

  let array = tareas.value.filter(
    (el: GenericModel) =>
      (!tipoFiltrado || el.task_type === filtro.value.tipo) &&
      (!search || el.task_name.toLowerCase().includes(search))
  );

  return array;
});

const areasFiltered = computed(() => {
  if (filtro.value.area.length === 0) {
    return areas.value;
  }
  const list = areas.value.filter((el: { id: string }) =>
    filtro.value.area.includes(el.id)
  );
  return list;
});

//functions

const getQuantity = (ida: string, idt: string): number | undefined | string => {
  const goal: Goal | undefined = objetivos.value.find(
    (el: Goal) => el.id_tarea === idt && el.id_instalacion === ida
  );
  if (goal) {
    return goal.cantidad;
  }
  return '';
};

const submitValue = async (data: any) => {
  console.log(data);

  return [];
};

const convertData = () => {
  const data = areas.value.map((el: GenericModel) => {
    return el;
  });
  return {
    planning_id: props.moduleId,
    goals: data,
  };
};

const verifyData = () => {
  return false;
};

const getExposeData = () => {
  return [];
};

const SubmitForm = async () => {
  if (!verifyData()) {
    Notify.create({
      type: 'warning',
      message: 'Debe asingar al menos un objetivo',
    });
    return;
  }

  try {
    Loading.show({
      message: 'Guardando información',
    });
    const objetivos = convertData();
    //console.log(objetivos);
    // await createGoal(objetivos);
  } catch (error) {
    console.error(error);
  } finally {
    Loading.hide();
    Notify.create({
      type: 'positive',
      message: 'Guardado correctamente',
    });
  }
};

const openActivities = (task: any) => {
  activitiesDialogRef.value?.onOpenDialog(task);
};

onMounted(async () => {
  try {
    isLoading.value = true;
    await explan();
    await exareas(100, planif.value.id);
    await extareas(100, planif.value.id);
    await exgoal(100, planif.value.id);
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
});

//expose
defineExpose({
  getExposeData,
  SubmitForm,
});
</script>
<template>
  <q-card class="my-card">
    <q-card-section class="q-py-md q-px-sm">
      <q-toolbar>
        <!-- <div class="col-md-6 row q-col-gutter-sm">
          <q-input
            v-model="filtro.search"
            type="text"
            label="Buscar tarea"
            outlined
            dense
            clearable
            @clear="filtro.search = ''"
            class="col-md-4"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-select
            v-model="filtro.tipo"
            :options="[
              { label: 'Todo', value: '' },
              { label: 'Tareas', value: 'task' },
              { label: 'Hito', value: 'milestone' },
              { label: 'Proyecto', value: 'project' },
            ]"
            label="Tipo"
            outlined
            emit-value
            map-options
            dense
            class="col-md-4"
          />
          <q-select
            v-model="filtro.area"
            :options="areas"
            label="Area de trabajo"
            outlined
            emit-value
            map-options
            option-value="id"
            option-label="label"
            clearable
            @clear="filtro.area = []"
            dense
            multiple
            class="col-md-4"
          />
        </div>
        <q-separator spaced inset vertical /> -->
        <div class="col-md-6 row q-col-gutter-sm">
          <DateRangeWithDays />
        </div>
      </q-toolbar>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <q-table
        ref="tableRef"
        :rows="tasksFiltered"
        :columns="areasFiltered"
        row-key="gantt_parent"
        separator="vertical"
        class="no-border-radius my-sticky-header-column-table no-shadow"
        virtual-scroll
        dense
        v-model:pagination="pagination"
        :rows-per-page-options="[0]"
        :loading="isLoading"
        style="height: 60dvh"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th
              class="bg-blue-grey-3 text-bold"
              style="min-width: 200px; font-weight: bold"
              >Tareas</q-th
            >
            <q-th
              class="bg-blue-grey-3 text-bold"
              style="min-width: 100px; font-weight: bold"
              >Cantidad</q-th
            >
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="bold bg-blue-grey-2"
              style="width: 200px"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td
              class="bg-blue-grey-1 cursor-pointer"
              style="height: 50px"
              @click="openActivities(props.row)"
            >
              <span
                :class="
                  props.row.task_parent !== '0'
                    ? 'q-ml-md'
                    : 'text-primary text-weight-bold'
                "
              >
                <span
                  v-if="props.row.task_type === 'milestone'"
                  class="text-caption"
                >
                  <i class="milestone"></i>
                  {{ props.row.number }} &nbsp; {{ props.row.task_name }}
                </span>
                <span v-else>
                  {{ props.row.number }} &nbsp; {{ props.row.task_name }}
                </span>
              </span>
            </q-td>
            <q-td class="" style="width: 150px">
              <div
                class="flex justify-end"
                v-if="props.row.task_type === 'task'"
              >
                <div class="text-right q-mr-sm text-weight-bold">
                  {{ props.row.task_quantity }}
                  <small class="text-primary text-weight-thin">
                    {{ props.row.task_unit.toUpperCase() }}
                  </small>
                </div>
                <!-- <q-badge
                  style="width: 60px"
                  color="primary"
                  outline
                  :label="props.row.task_unit"
                /> -->
              </div>
            </q-td>
            <q-td
              :props="props"
              v-for="(col, index) in props.cols"
              :key="col.name"
              :class="props.row.task_type !== 'task' ? '' : ''"
            >
              <q-input
                v-if="
                  props.row.task_type === 'task' &&
                  Number(getQuantity(col.id, props.row.id_task)) > 0
                "
                ref="inputGoalRef"
                :key="`${index}${props.rowIndex}`"
                :model-value="''"
                type="number"
                dense
                square
                filled
                :debounce="200"
                :min="0"
                :max="getQuantity(col.id, props.row.id_task)"
                clearable
                :class="'shadow-1'"
                @update:model-value="
                  (val) =>
                    submitValue({
                      id_instalacion: col.id,
                      id_tarea: props.row.id_task,
                      cantidad: Number(val),
                    })
                "
              >
                <template v-slot:append>
                  <span class="text-caption">
                    /
                    {{ getQuantity(col.id, props.row.id_task) }}
                  </span>
                </template>
              </q-input>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>

  <ActivitiesDialog ref="activitiesDialogRef" />
</template>
<style lang="scss" scoped>
.hover-row:hover {
  box-shadow: 1px 1px 2px 0px #17171758;
  z-index: 10 !important;
}
.my-sticky-header-column-table {
  height: 250px;
  tr th {
    position: sticky;
    z-index: 2;
    background: #fff;
  }
  thead tr:last-child th {
    top: 48px;
    z-index: 3;
  }
  thead tr:first-child th {
    top: 0;
    z-index: 1;
  }
  tr:first-child th:first-child {
    z-index: 3;
  }

  td:first-child {
    z-index: 1;
  }
  td:first-child,
  th:first-child {
    position: sticky;
    left: 0;
  }
}
.input-new.q-field__control.relative-position.row.no-wrap {
  height: 25px !important;
  top: 0px !important;
}
</style>
