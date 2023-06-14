<script lang="ts">
import { QInput } from 'quasar';
import { ref, computed, onMounted } from 'vue';
import ViewCard from 'src/components/MainCard/ViewCard.vue';
import { getWorkareasList } from '../../services/useAssignmentService';
import { GenericModel } from '../../../Goals/utils/types';
//import DateRangeWithDays from 'src/components/DateRangeWithDays/DateRangeWithDays.vue';
import moment from 'moment';
</script>
<script setup lang="ts">
interface Asignment {
  id_tarea: string;
  id: string;
  order_number: number;
  inst: string;
  tarea: string;
  objetivo: number;
  incidencia: number;
  unidad: string;
  total: number;
  parent: string;
  asignado: number;
}

//props
const props = withDefaults(
  defineProps<{
    id?: string;
    projectId: string;
    data: any;
  }>(),
  {}
);

//refs
const baseCardRef = ref<InstanceType<typeof ViewCard> | null>(null);
const areaInputRef = ref<InstanceType<typeof QInput> | null>(null);

//variables
const listAreas = ref<GenericModel[]>([]);
const area = ref('');
const inputData = ref(
  !!props.data
    ? { ...props.data }
    : {
        code: '',
        area_id: '',
        fecha_inicio: '',
        fecha_fin: '',
      }
);

const isEditing = computed(() => baseCardRef.value?.isEditing === 'edit');
const codeGenerator = computed(() => {
  if (!area.value) {
    return '';
  }
  const rand = Math.round(Math.random() * 10000);
  const fulldate = moment().format('DDMMYY');
  return `ASIG${rand}/${fulldate}`;
});

//functions
const validateInputs = async () => {
  const validatedFields = await Promise.all([areaInputRef.value?.validate()]);
  return validatedFields.every((field) => !!field);
};

const exposeData = () => {
  return {
    area: area.value,
    codigo: codeGenerator.value,
    fecha_inicio: inputData.value.fecha_inicio,
    fecha_fin: inputData.value.fecha_fin,
  };
};

//lifecicle
onMounted(async () => {
  listAreas.value = await getWorkareasList(props.projectId);
  inputData.value.fecha_inicio = moment().format('YYYY-MM-DD');
  inputData.value.fecha_fin = moment().add(7, 'days').format('YYYY-MM-DD');
  if (props.id) {
    area.value = inputData.value.instalacion_id;
    emit('changeWorkArea', area.value);
  }
});

//emits
const emit = defineEmits<{
  (e: 'changeWorkArea', id: string): void;
}>();

//exposes
defineExpose({
  validateInputs,
  isEditing,
  exposeData,
});
</script>

<template>
  <view-card-component
    :controls="false"
    :initial-status="id ? 'read' : 'edit'"
    icon-name="feed"
    ref="baseCardRef"
    title="INFORMACIÓN"
    @cancel-change="() => {}"
    class="q-mb-sm"
  >
    <template #edit>
      <q-card-section class="row q-col-gutter-md">
        <q-input
          :model-value="codeGenerator"
          type="text"
          readonly
          class="col-6"
          dense
          outlined
        />
        <q-select
          v-model="area"
          :options="listAreas"
          label="Area de trabajo"
          option-label="name"
          option-value="id"
          map-options
          stack-label
          emit-value
          class="col-6"
          outlined
          options-dense
          dense
          ref="areaInputRef"
          transition-show="scale"
          transition-hide="scale"
          hide-bottom-space
          :rules="[(val:string) => !!val || 'Campo requerido']"
          @update:model-value="(val:string) => emit('changeWorkArea', val)"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps" class="no-border-radius">
              <q-item-section avatar style="min-width: 30px !important">
                <span class="text-grey-5">
                  {{ scope.opt.pais_code.toUpperCase() }}</span
                >
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ scope.opt.name }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-input
          v-model="inputData.fecha_inicio"
          type="date"
          outlined
          dense
          class="col-6"
        />
        <q-input
          v-model="inputData.fecha_fin"
          type="date"
          :min="inputData.fecha_inicio"
          outlined
          dense
          class="col-6"
        />
      </q-card-section>
    </template>
    <template #read>
      <q-card-section class="row q-col-gutter-md">
        <q-input
          :model-value="codeGenerator"
          type="text"
          readonly
          class="col-6"
          dense
          outlined
        />
        <q-select
          v-model="area"
          :options="listAreas"
          label="Area de trabajo"
          option-label="name"
          option-value="id"
          map-options
          stack-label
          emit-value
          class="col-6"
          outlined
          options-dense
          dense
          ref="areaInputRef"
          transition-show="scale"
          transition-hide="scale"
          hide-bottom-space
          :rules="[(val:string) => !!val || 'Campo requerido']"
          @update:model-value="(val:string) => emit('changeWorkArea', val)"
          readonly
          hide-dropdown-icon
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps" class="no-border-radius">
              <q-item-section avatar style="min-width: 30px !important">
                <span class="text-grey-5">
                  {{ scope.opt.pais_code.toUpperCase() }}</span
                >
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ scope.opt.name }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-input
          v-model="inputData.estimated_start_date_c"
          type="date"
          outlined
          dense
          readonly
          class="col-6"
        />
        <q-input
          v-model="inputData.estimated_end_date_c"
          type="date"
          outlined
          dense
          readonly
          class="col-6"
        />
      </q-card-section>
    </template>
  </view-card-component>
</template>
<style lang="scss" scoped>
.title-card {
  font-size: 1em;
}
</style>
