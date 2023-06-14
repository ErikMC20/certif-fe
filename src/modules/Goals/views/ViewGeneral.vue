<script lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAsyncState } from '@vueuse/core';
import {
  getTaskList,
  getWorkareasList,
  createGoal,
} from '../services/useGoalsService';
import { GenericModel } from '../utils/types';
import { userStore } from 'src/modules/Users/store/UserStore';
import { Notify, Loading } from 'quasar';
import { getGoalsList } from '../services/useGoalsService';
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
  projectId: string;
}>();

//store
const { userCRM } = userStore();

//variables
const tableRef = ref();
const inputGoalRef = ref();
const keygen = ref(1);
const isLoading = ref(false);
const listGoals = ref<Goal[]>([]);
const listOriginal = ref<Goal[]>([]);
const isEditing = ref(false);
const pagination = ref({
  rowsPerPage: 0,
});

const filtro = ref({
  tipo: '',
  search: '',
  area: <string[]>[],
  completo: '',
});

const { state: tareas, execute: extareas } = useAsyncState(
  async () => {
    const res = await getTaskList(props.moduleId);
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
      };
    });
  },
  [] as GenericModel[],
  { immediate: false }
);

const { state: areas, execute: exareas } = useAsyncState(
  async () => {
    const res = await getWorkareasList(props.projectId);
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
const getTotalQuantity = (idt: string): number => {
  const goals: Goal[] = listGoals.value.filter((el) => el.id_tarea === idt);
  const total = goals.reduce((acum, val) => acum + Number(val.cantidad), 0);
  return total;
};

const getQuantity = (ida: string, idt: string): number | undefined | string => {
  const goal: Goal | undefined = listGoals.value.find(
    (el: Goal) => el.id_tarea === idt && el.id_instalacion === ida
  );
  if (goal) {
    return goal.cantidad;
  }
  return '';
};

const submitValue = async (data: Goal) => {
  const total: number = getTotalQuantity(data.id_tarea);
  const index: number = listGoals.value.findIndex(
    (el: Goal) =>
      el.id_tarea === data.id_tarea && el.id_instalacion === data.id_instalacion
  );
  if (Number(data.cantidad) !== 0) {
    if (index !== -1) {
      const cantactual = listGoals.value[index].cantidad;
      const tt = total - cantactual + data.cantidad;
      if (tt > data.total) {
        Notify.create({
          type: 'negative',
          message: 'Cantidad excedida',
        });
        return;
      }
      listGoals.value[index] = data;
    } else {
      const tt = total + data.cantidad;
      if (tt > data.total) {
        Notify.create({
          type: 'negative',
          message: 'Cantidad excedida',
        });
        return;
      }
      listGoals.value.push(data);
    }
  } else {
    if (listGoals.value[index].id_objetivo) {
      listOriginal.value[index].deleted = true;
    } else {
      listGoals.value.splice(index, 1);
    }
  }
};

const convertData = () => {
  const data = areas.value.map((el: GenericModel) => {
    return {
      id_objetivo: listGoals.value.find((task) => task.id_instalacion === el.id)
        ?.id_objetivo,
      area: el.id,
      area_name: el.label,
      user_id: userCRM.id,
      tasks: listGoals.value.filter((task) => task.id_instalacion === el.id),
    };
  });
  return {
    planning_id: props.moduleId,
    goals: data,
  };
};

const verifyData = () => {
  const goalTotal = listGoals.value.reduce(
    (acum: number, val: Goal) => acum + val.cantidad,
    0
  );

  if (goalTotal > 0) {
    return true;
  }
  return false;
};

const getExposeData = () => {
  return listGoals.value;
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
    await createGoal(objetivos);
  } catch (error) {
    console.error(error);
  } finally {
    Loading.hide();
    Notify.create({
      type: 'positive',
      message: 'Guardado correctamente',
    });
    isEditing.value = false;
  }
};

onMounted(async () => {
  try {
    isLoading.value = true;
    listGoals.value = await getGoalsList(props.moduleId);
    listOriginal.value = listGoals.value;
  } catch (error) {
  } finally {
    await exareas();
    await extareas();
    isLoading.value = false;
  }
});

//expose
defineExpose({
  getExposeData,
  isEditing,
  SubmitForm,
});
</script>
<template>
  <q-card
    class="relative"
    :style="$q.screen.xs ? 'width: calc(100dvw - 32px)' : ''"
  >
    <q-card-section class="q-py-md q-px-sm" v-if="!$q.screen.xs">
      <q-toolbar class="q-gutter-sm">
        <q-input
          v-model="filtro.search"
          type="text"
          label="Buscar tarea"
          outlined
          dense
          clearable
          @clear="filtro.search = ''"
          class="col-md-2 col-xs-12"
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
          class="col-md-2 col-xs-12"
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
          class="col-md-2 col-xs-12"
        />
        <q-space />
        <span>
          <q-btn
            flat
            dense
            :icon="!isEditing ? 'edit' : 'cancel'"
            color="grey-7"
            @click="isEditing = !isEditing"
          >
            <q-tooltip> Editar </q-tooltip>
          </q-btn>
        </span>
      </q-toolbar>
    </q-card-section>
    <q-card-section v-else>
      <div class="row q-gutter-y-sm">
        <q-space />
        <span>
          <q-btn
            flat
            dense
            :icon="!isEditing ? 'edit' : 'cancel'"
            color="grey-7"
            @click="isEditing = !isEditing"
          >
            <q-tooltip> Editar </q-tooltip>
          </q-btn>
        </span>
        <q-expansion-item
          icon="filter_alt"
          label="Filtros"
          class="col-12"
          :expand-icon-toggle="false"
        >
          <q-card>
            <q-card-section class="q-pa-sm row q-gutter-y-sm">
              <q-input
                v-model="filtro.search"
                type="text"
                label="Buscar tarea"
                outlined
                dense
                clearable
                @clear="filtro.search = ''"
                class="col-md-2 col-xs-12"
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
                class="col-md-2 col-xs-12"
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
                class="col-md-2 col-xs-12"
              />
              <q-space />
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <q-table
        :key="keygen"
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
        style="height: 69dvh"
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
              style="min-width: 150px; font-weight: bold"
              >Cantidad</q-th
            >
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="bold bg-blue-grey-2"
              :style="$q.screen.xs ? 'min-width: 150px' : 'width: 200px'"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td class="bg-blue-grey-1" style="height: 50px">
              <span
                :class="
                  props.row.task_parent != '0'
                    ? 'q-ml-md'
                    : 'text-primary text-weight-bold'
                "
              >
                <span
                  v-if="props.row.task_type == 'milestone'"
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
            <q-td class="" style="width: 200px">
              <div
                class="flex justify-end"
                v-if="props.row.task_type === 'task'"
              >
                <div class="text-right q-mr-sm">
                  <q-icon
                    name="check_circle"
                    size="xs"
                    color="green"
                    class="q-mr-sm"
                    v-if="
                      getTotalQuantity(props.row.id_task) ==
                      props.row.task_quantity
                    "
                  />
                  <span> {{ getTotalQuantity(props.row.id_task) }}</span>
                  <small class="text-dark">
                    / {{ props.row.task_quantity }}</small
                  >
                </div>
                <q-badge
                  :color="
                    getTotalQuantity(props.row.id_task) ==
                    props.row.task_quantity
                      ? 'primary'
                      : 'grey-5'
                  "
                  :label="props.row.task_unit.toUpperCase()"
                />
              </div>
            </q-td>
            <q-td
              :props="props"
              v-for="(col, index) in props.cols"
              :key="col.name"
              :class="props.row.task_type !== 'task' ? '' : ''"
            >
              <q-input
                v-if="props.row.task_type == 'task'"
                ref="inputGoalRef"
                :key="`${index}${props.rowIndex}`"
                :model-value="getQuantity(col.id, props.row.id_task)"
                type="number"
                dense
                square
                :readonly="!isEditing"
                filled
                :debounce="200"
                clearable
                :class="!isEditing ? '' : 'shadow-1'"
                @update:model-value="
                  (val:number) =>
                    submitValue({
                      id_instalacion: col.id,
                      id_tarea: props.row.id_task,
                      fecha_inicio: props.row.start_date,
                      fecha_fin: props.row.end_date,
                      total: props.row.task_quantity,
                      cantidad: Number(val),
                    })
                "
              >
              </q-input>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>
<style lang="scss" scoped>
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
