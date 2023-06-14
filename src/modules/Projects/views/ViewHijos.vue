<script lang="ts">
import { onMounted, ref } from 'vue';
import ViewHijos from 'src/modules/Projects/views/ViewHijos.vue';
import { QTableColumn } from 'quasar';
import ProjectTaskDialog from 'src/modules/ProjectTask/components/Dialogs/ProjectTaskDialog.vue';
</script>
<script setup lang="ts">
defineProps<{
  hijos: {
    type: Array;
    required: true;
  };
}>();

const projectTaskDialogRef = ref<InstanceType<typeof ProjectTaskDialog> | null>(
  null
);

//lifecicle
onMounted(() => {
  console.log('montado');
});

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 1000,
});

const columns: QTableColumn[] = [
  {
    name: 'nombre',
    align: 'left',
    label: 'Actividad',
    field: 'numero',
    sortable: true,
  },
  {
    name: 'unidad',
    align: 'left',
    label: 'Unidad',
    field: 'name',
    sortable: true,
  },
  {
    name: 'incidencia',
    align: 'left',
    label: 'Incidencia',
    field: 'faseval',
    sortable: true,
  },
  {
    name: 'estado',
    align: 'left',
    label: 'Estado',
    field: 'estado',
    sortable: true,
  },
  {
    name: 'contrato',
    align: 'left',
    label: 'Contrato (Cantidad)',
    field: 'fecha_creacion',
    sortable: true,
  },
  {
    name: 'planificacion',
    align: 'left',
    label: 'Asignación (Cantidad/Cant.%/Inc.%)',
    field: 'fecha_expiracion',
    sortable: true,
  },
  {
    name: 'real',
    align: 'left',
    label: 'Real (Cantidad/Cant.%/Inc.%)',
    field: 'asignado',
    sortable: true,
  },
];

// open detail tasks
const openDialog = (id: string, title: string) => {
  projectTaskDialogRef.value?.openDialog(id, title);
};
</script>
<template>
  <q-list v-if="hijos.length" class="q-ml-md" dense bordered>
    <template v-for="hijo in hijos" :key="hijo.id">
      <q-expansion-item
        v-if="hijo.childs.length > 0"
        :hide-expand-icon="hijo.childs.length == 0"
        :label="hijo.gantt_numero + '&nbsp;&nbsp;' + hijo.nombre"
        header-class="text-red bg-grey-1"
      >
        <!-- {{ hijos.length }} -->
        <ViewHijos :hijos="hijo.childs" v-if="hijo.childs.length > 0" />
      </q-expansion-item>
    </template>
    <q-table
      flat
      bordered
      :rows="hijos"
      :columns="columns"
      row-key="nombre"
      :pagination="pagination"
      hide-bottom
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            :class="
              col.name == 'contrato'
                ? 'text-weight-medium bg-blue-2'
                : col.name == 'planificacion'
                ? 'text-weight-medium bg-yellow-2'
                : col.name == 'real'
                ? 'text-weight-medium bg-green-2'
                : 'text-weight-medium'
            "
          >
            <template v-if="col.name == 'contrato'">
              {{ col.label }}
            </template>
            <span v-else>
              {{ col.label }}
            </span>
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" v-if="props.row.childs.length === 0">
          <q-td auto-width>
            <q-btn
              size="sm"
              round
              color="primary"
              icon="task"
              @click="openDialog(props.row.id, props.row.nombre)"
            />
          </q-td>
          <q-td key="nombre" :props="props">
            {{ props.row.nombre }}
          </q-td>
          <q-td key="nombre" :props="props">
            {{ props.row.unidad }}
          </q-td>
          <q-td key="nombre" :props="props" class="text-bold">
            {{ props.row.incidencia }}%
          </q-td>
          <q-td key="nombre" :props="props">
            <q-chip
              size="sm"
              :color="
                props.row.estado == 'Completado'
                  ? 'green'
                  : props.row.estado == 'En progreso'
                  ? 'grey'
                  : props.row.estado == 'En espera'
                  ? 'blue'
                  : ''
              "
              class="text-white"
            >
              {{ props.row.estado }}
            </q-chip>
          </q-td>
          <q-td key="nombre" :props="props" class="bg-blue-1">
            {{ props.row.contrato || 0 }}
          </q-td>
          <q-td key="nombre" :props="props" class="bg-yellow-1">
            <div class="row">
              <div class="col">
                {{ props.row.asignado_c }}
              </div>
              <div class="col">{{ props.row.asignado_porcentaje }}%</div>
              <div class="col" >
                <q-chip color="orange" size="sm" class="text-white">
                  {{ props.row.porcentaje_asig_incidencia }}%
                </q-chip>
               
              </div>
            </div>
          </q-td>
          <q-td key="nombre" :props="props" class="bg-green-1">
            <div class="row">
              <div class="col">
                {{ props.row.real_c || 0 }}
              </div>
              <div class="col">{{ props.row.real_porcentaje || 0 }}%</div>
              <div class="col">
                <q-chip color="green" size="sm" class="text-white">
                  {{ props.row.porcentaje_real_incidencia || 0 }}%
                </q-chip>
                </div>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-list>

  <ProjectTaskDialog ref="projectTaskDialogRef" />
</template>
<style scoped></style>
