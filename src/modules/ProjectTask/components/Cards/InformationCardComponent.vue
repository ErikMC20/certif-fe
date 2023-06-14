<script lang="ts">
import { ref, onMounted } from 'vue';
import { GenericModel } from '../../utils/types';
import ViewCardVue from 'src/components/MainCard/ViewCard.vue';
import { useProjectMetricUnits as Units } from 'src/composables/useCRMLanguage';
</script>
<script setup lang="ts">
//props

defineProps<{
  id?: string;
  data: GenericModel;
  readMode?: boolean;
}>();

const { listProjectMetricUnits, getlistProjectMetricUnits } = Units();
//refs
const baseCardRef = ref<InstanceType<typeof ViewCardVue> | null>(null);

//functions
const exposeCardData = () => {
  return '';
};

onMounted(async () => {
  await getlistProjectMetricUnits();
});

//exposes
defineExpose({
  exposeCardData,
});
</script>

<template>
  <view-card-component
    :controls="false"
    :initial-status="'read'"
    icon-name="feed"
    ref="baseCardRef"
    title="Información"
  >
    <template #read>
      <q-card-section class="row q-col-gutter-sm">
        <q-select
          :model-value="data.tipo"
          :options="[
            {
              label: 'Hito',
              value: 'project',
            },
            {
              label: 'Entregable',
              value: 'milestone',
            },
            {
              label: 'Tarea',
              value: 'task',
            },
          ]"
          label="Tipo"
          outlined
          dense
          option-value="value"
          option-label="label"
          map-options
          emit-value
          options-dense
          readonly
          hide-dropdown-icon
          class="col-12 q-mb-sm"
        />
        <q-select
          :model-value="data.status"
          :options="['En espera', 'En progreso', 'Completado']"
          label="Estado"
          outlined
          class="col-6"
          dense
          readonly
          hide-dropdown-icon
        >
          <template v-slot:prepend>
            <q-icon
              name="schedule"
              color="grey-5"
              v-if="data.status === 'En espera'"
            />
            <q-icon
              name="timeline"
              color="light-blue-4"
              v-if="data.status === 'En progreso'"
            />
            <q-icon
              name="check"
              color="green"
              v-if="data.status === 'Completado'"
            />
          </template>
        </q-select>

        <q-select
          :model-value="data.priority"
          :options="['Alta', 'Media', 'Baja']"
          label="Prioridad"
          outlined
          readonly
          hide-dropdown-icon
          class="col-6 q-mb-sm"
          dense
        >
          <template v-slot:prepend>
            <q-icon name="flag" color="red" v-if="data.priority === 'Alta'" />
            <q-icon
              name="flag"
              color="orange"
              v-if="data.priority === 'Media'"
            />
            <q-icon name="flag" color="green" v-if="data.priority === 'Baja'" />
          </template>
        </q-select>

        <q-input
          :model-value="data.name"
          type="text"
          label="Nombre"
          outlined
          dense
          class="col-12 q-mb-sm"
          autofocus
          ref="inputTitleRef"
          readonly
        >
        </q-input>

        <q-input
          :model-value="data.description"
          type="textarea"
          :rows="6"
          label="Descripción"
          outlined
          dense
          class="col-12 q-mb-sm"
          readonly
          v-if="data.tipo == 'task'"
        />

        <q-input
          :model-value="data.date_start"
          type="text"
          label="Fecha inicio"
          dense
          outlined
          readonly
          class="col-4 q-mb-sm"
        />
        <q-input
          :model-value="data.duration"
          type="number"
          label="Duracion"
          dense
          outlined
          readonly
          class="col-4 q-mb-sm"
        >
          <template #append>
            <span class="text-caption"> días </span>
          </template>
        </q-input>
        <q-input
          :model-value="data.date_finish"
          type="text"
          label="Fecha fin"
          dense
          outlined
          readonly
          class="col-4 q-mb-sm"
        />
        <q-input
          :model-value="data.cantidad"
          type="number"
          label="Cantidad"
          dense
          outlined
          class="col-md-6 col-xs-12 q-mb-sm"
          ref="inputQuantityRef"
          readonly
          v-if="data.tipo == 'task'"
        />

        <q-input
          :model-value="data.cantidad_faltante_c"
          type="number"
          label="Cantidad faltante"
          dense
          outlined
          class="col-md-6 col-xs-12 q-mb-sm"
          ref="inputQuantityResRef"
          readonly
          v-if="data.tipo == 'task'"
        />

        <q-select
          ref="inputUnitRef"
          :model-value="data.unidad"
          :options="listProjectMetricUnits"
          label="Unidad"
          outlined
          dense
          class="col-md-6 col-xs-12 q-mb-sm"
          options-dense
          option-label="label"
          option-value="value"
          map-options
          emit-value
          transition-show="scale"
          transition-hide="scale"
          readonly
          hide-dropdown-icon
          v-if="data.tipo == 'task'"
        />

        <q-input
          :model-value="data.incidencia"
          type="number"
          label="Incidencia"
          ref="inputIncidenceRef"
          dense
          outlined
          readonly
          :class="
            data.tipo == 'project'
              ? 'col-md-12 q-mb-sm'
              : 'col-md-6 col-xs-12 q-mb-sm'
          "
          v-if="data.tipo != 'milestone'"
        >
          <template v-slot:prepend>% </template>
        </q-input>

        <q-input
          v-else
          :model-value="data.date_start"
          type="date"
          :label="
            data.tipo !== 'milestone' ? 'Fecha inicio' : 'Fecha de entrega'
          "
          dense
          outlined
          readonly
          class="col-12 q-mb-sm"
        />

        <div class="col-12" v-if="data.status != 'En espera'">
          <small>Progreso: {{ data.percent_complete.toFixed(2) }} % </small>
          <q-linear-progress
            :value="Number(data.percent_complete) * 0.01"
            rounded
            color="primary"
            track-color="grey-5"
            class="q-mt-sm"
            size="15px"
          />
        </div>
      </q-card-section>
    </template>
  </view-card-component>
</template>
<style lang="scss" scoped>
.title-card {
  font-size: 1em;
}
</style>
