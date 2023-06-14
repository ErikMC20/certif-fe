<script lang="ts">
import { QInput } from 'quasar';
import { ref, computed, onMounted, watch } from 'vue';
import { BasicInformation } from '../../utils/types';
import { usePais } from 'src/composables/useLanguaje';
import ViewCardVue from 'src/components/MainCard/ViewCard.vue';
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

//refs
const baseCardRef = ref<InstanceType<typeof ViewCardVue> | null>(null);

//inputs refs for validation
const nameInputRef = ref<InstanceType<typeof QInput> | null>(null);

//variables
const { getListPais, getListRegion, listPais, listRegion } = usePais();
const isEditing = computed(() => baseCardRef.value?.isEditing === 'edit');
const inputData = ref(
  !!props.data
    ? { ...props.data }
    : {
        codigo_c: '',
        name: '',
        description: '',
        idregion_c: '',
        pais_c: 'BO',
        project_id: '',
      }
);

//watch
watch(
  () => inputData.value.pais_c,
  (val) => {
    console.log(val);
    getListRegion(val ?? '');
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
  await getListPais();
  await getListRegion(inputData.value.pais_c ?? '');
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
    title="Información del proyecto"
    @cancel-change="restoreValues"
    class="q-mb-sm"
    style="height: 80vh"
  >
    <template #edit>
      <q-card-section class="row q-col-gutter-md">
        <q-input
          v-model="inputData.codigo_c"
          type="text"
          label="Código del área"
          outlined
          dense
          class="col-12 q-pb-md"
        />
        <q-input
          v-model="inputData.name"
          type="text"
          label="Nombre del área de trabajo"
          outlined
          dense
          class="col-12"
          ref="nameInputRef"
          :rules="[(val) => !!val || 'Campo requerido']"
        />
        <q-select
          v-model="inputData.pais_c"
          :options="listPais"
          label="País"
          outlined
          dense
          class="col-12"
          emit-value
          map-options
          options-dense
          option-value="cod_pais"
          transition-show="scale"
          transition-hide="scale"
          :rules="[(val) => !!val || 'Campo requerido']"
        />
        <q-select
          v-model="inputData.idregion_c"
          :options="listRegion"
          label="Región"
          outlined
          dense
          class="col-12"
          emit-value
          map-options
          options-dense
          option-label="label"
          option-value="cod_region"
          transition-show="scale"
          transition-hide="scale"
          :readonly="inputData.pais_c == ''"
          :rules="[(val) => !!val || 'Campo requerido']"
        />
        <q-input
          v-model="inputData.description"
          type="textarea"
          label="Descripción"
          outlined
          dense
          class="col-12"
        />
      </q-card-section>
    </template>
    <template #read>
      <q-card-section class="q-px-md row q-col-gutter-md">
        <q-input
          v-model="inputData.codigo_c"
          type="text"
          label="Código del área"
          outlined
          dense
          class="col-12 q-pb-md"
          readonly
        />
        <q-input
          v-model="inputData.name"
          type="text"
          label="Nombre del área de trabajo"
          outlined
          dense
          class="col-12"
          ref="nameInputRef"
          :rules="[(val) => !!val || 'Campo requerido']"
          readonly
        />
        <q-select
          v-model="inputData.pais_c"
          :options="listPais"
          label="País"
          outlined
          dense
          class="col-12"
          emit-value
          map-options
          options-dense
          option-value="cod_pais"
          transition-show="flip-up"
          hide-dropdown-icon
          transition-hide="flip-down"
          readonly
          :rules="[(val) => !!val || 'Campo requerido']"
        />
        <q-select
          v-model="inputData.idregion_c"
          :options="listRegion"
          label="Región"
          outlined
          dense
          class="col-12"
          emit-value
          map-options
          options-dense
          option-value="cod_region"
          transition-show="flip-up"
          transition-hide="flip-down"
          hide-dropdown-icon
          readonly
          :rules="[(val) => !!val || 'Campo requerido']"
        />
        <q-input
          v-model="inputData.description"
          type="textarea"
          label="Descripción"
          outlined
          dense
          class="col-12"
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
