<script lang="ts">
import { BasicInformation } from '../../utils/types';
import { useProjectStatus } from 'src/composables/useLanguaje';
import ViewCardVue from 'src/components/MainCard/ViewCard.vue';
import { useProjectStore } from 'src/modules/Projects/store/useProjectStore';
import moment from 'moment';
import { computed, ref, onMounted } from 'vue';
import { QInput } from 'quasar';
</script>
<script setup lang="ts">
//props
const props = withDefaults(
  defineProps<{
    id?: string;
    data?: BasicInformation;
    readMode?: boolean;
  }>(),
  {
    readMode: false,
  }
);

//stores
const proyectStore = useProjectStore();

//refs
const baseCardRef = ref<InstanceType<typeof ViewCardVue> | null>(null);

//inputs refs for validation
const nameInputRef = ref<InstanceType<typeof QInput> | null>(null);

//variables
const isEditing = computed(() => baseCardRef.value?.isEditing === 'edit');
const inputData = ref(
  !!props.data
    ? { ...props.data }
    : {
        name: '',
        status: 'Draft',
        estimated_start_date: moment(
          proyectStore.info1.estimated_start_date
        ).format('YYYY-MM-DD'),
        estimated_end_date: moment(
          proyectStore.info1.estimated_end_date
        ).format('YYYY-MM-DD'),
      }
);

//functions
const validateInputs = async () => {
  const validatedFields = await Promise.all([nameInputRef.value?.validate()]);
  return validatedFields.every((field) => !!field);
};

const restoreValues = () => {
  if (props.data) inputData.value = { ...props.data };
};

const exposeCardData = () => {
  return inputData.value;
};

//lifecicle
onMounted(async () => {
  inputData.value.estimated_start_date = moment(
    proyectStore.info1.estimated_start_date
  ).format('YYYY-MM-DD');
  inputData.value.estimated_end_date = moment(
    proyectStore.info1.estimated_end_date
  ).format('YYYY-MM-DD');
});

//exposes
defineExpose({
  validateInputs,
  exposeCardData,
  isEditing,
});
</script>

<template>
  <view-card-component
    :controls="!!id"
    :initial-status="id ? 'read' : 'edit'"
    icon-name="feed"
    ref="baseCardRef"
    title="Información de la planificación"
    @cancel-change="restoreValues"
  >
    <template #edit>
      <q-card-section class="row q-col-gutter-sm q-pa-sm">
        <q-input
          v-model="inputData.name"
          type="text"
          label="Nombre"
          outlined
          dense
          class="col-md-12 col-xs-12"
          ref="nameInputRef"
          :rules="[(val:string) => !!val || 'Campo requerido']"
        />
        <!-- <q-select
          v-model="inputData.status"
          :options="[
            { label: 'Aprobado', value: 'Approved' },
            { label: 'En Borrador', value: 'Draft' },
          ]"
          label="Estado"
          outlined
          dense
          class="col-6"
          emit-value
          map-options
          options-dense
          option-value="value"
          transition-show="scale"
          transition-hide="scale"
          :rules="[(val) => !!val || 'Campo requerido']"
        /> -->
        <q-input
          v-model="inputData.estimated_start_date"
          type="date"
          label="Fecha de inicio"
          outlined
          dense
          class="col-6"
        />
        <q-input
          v-model="inputData.estimated_end_date"
          type="date"
          label="Fecha de finalización"
          outlined
          dense
          class="col-6"
        />
      </q-card-section>
    </template>
    <template #read>
      <q-card-section class="q-pa-sm row q-col-gutter-md">
        <q-input
          v-model="inputData.name"
          type="text"
          label="Nombre"
          outlined
          dense
          class="col-12 q-mb-sm"
          ref="nameInputRef"
          readonly
        />
        <!-- <q-select
          v-model="inputData.status"
          :options="[
            { label: 'Aprobado', value: 'Approved' },
            { label: 'En Borrador', value: 'Draft' },
          ]"
          label="Estado"
          outlined
          dense
          class="col-6"
          emit-value
          map-options
          options-dense
          option-value="value"
          transition-show="flip-up"
          hide-dropdown-icon
          transition-hide="flip-down"
          readonly
          :rules="[(val) => !!val || 'Campo requerido']"
        /> -->
        <q-input
          v-model="inputData.estimated_start_date"
          type="date"
          label="Fecha de inicio"
          outlined
          dense
          class="col-6"
          readonly
        />
        <q-input
          v-model="inputData.estimated_end_date"
          type="date"
          label="Fecha de cierre"
          outlined
          dense
          class="col-6"
          readonly
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
