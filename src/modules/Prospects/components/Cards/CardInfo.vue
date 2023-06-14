<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useFormOptionsStore } from '../../../../stores/formOptionsStore';
import { QInput, QSelect } from 'quasar';
import { PaisListModel } from '../../../../components/types/index';
import ViewCardVue from 'src/components/MainCard/ViewCard.vue';
import { InfoProspectModel } from '../../utils/types';

const props = withDefaults(
  defineProps<{
    idLocal?: string;
    data?: InfoProspectModel;
    readonly?: boolean;
  }>(),
  {
    readonly: false,
  }
);

//* variables
let localValue = {} as InfoProspectModel;
const inputData = ref({ status: 'New' } as InfoProspectModel);

//* variable references
const salutationInputRef = ref<InstanceType<typeof QSelect> | null>();
const lastnameInputRef = ref<InstanceType<typeof QInput> | null>(null);
const ciNitInputRef = ref<InstanceType<typeof QInput>>();
const baseCardRef = ref<InstanceType<typeof ViewCardVue> | null>(null);

const formOptions = useFormOptionsStore();

//* computed variables
const isEditing = computed(() => baseCardRef.value?.isEditing === 'edit');
const countryStates = computed(() => {
  if (!inputData.value.primary_address_country) {
    return [];
  }
  const currentCountry = formOptions.prospectOptions.countries.find(
    (value: PaisListModel) =>
      value.cod_pais === inputData.value.primary_address_country
  );
  return !!currentCountry ? currentCountry.regiones : [];
});

//* methods
const validateCard = async (): Promise<boolean> => {
  const validation = await Promise.all([
    salutationInputRef.value?.validate(),
    lastnameInputRef.value?.validate(),
  ]);
  return validation.every((value) => !!value);
};

const captureCurrentData = () => ({
  ...inputData.value,
  alt_address_city: inputData.value.primary_address_city,
  alt_address_state_list_c: inputData.value.primary_address_state_list_c,
  alt_address_country: inputData.value.primary_address_country,
});
const restoreValues = () => (inputData.value = { ...localValue });

onMounted(() => {
  if (!!props.data && Object.values(props.data).length > 0) {
    localValue = props.data;
    restoreValues();
  }
});

defineExpose({
  captureCurrentData,
  validateCard,
  isEditing,
});
</script>
<template>
  <view-card-component
    :controls="!!idLocal && !readonly"
    :initial-status="!!idLocal ? 'read' : 'edit'"
    icon-name="feed"
    ref="baseCardRef"
    title="Información del Prospecto"
    @cancel-change="restoreValues"
  >
    <template #edit>
      <div class="row q-col-gutter-sm">
        <q-select
          ref="salutationInputRef"
          class="col-12 col-sm-6"
          :rules="[(val) => !!val || 'El campo es requerido']"
          v-model="inputData.salutation"
          :options="formOptions.prospectOptions.salutations"
          label="Saludo"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          outlined
          dense
        />
        <q-input
          ref="namesInputRef"
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="inputData.first_name"
          :rules="[(val) => !!val || 'El campo es requerido']"
          type="text"
          label="Nombres"
        />
        <q-input
          ref="lastnameInputRef"
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="inputData.last_name"
          :rules="[(val) => !!val || 'El campo es requerido']"
          type="text"
          label="Apellidos"
        />
        <q-input
          ref="titleInputRef"
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="inputData.title"
          type="text"
          label="Cargo"
        />
        <!-- <q-input
          ref="ciNitInputRef"
          class="col-12 col-sm-6 q-mb-md"
          outlined
          dense
          v-model="inputData.ci_c"
          type="text"
          label="CI/NIT"
        /> -->
        <q-select
          ref="countryInputRef"
          class="col-12 col-sm-6"
          v-model="inputData.primary_address_country"
          :options="formOptions.prospectOptions.countries"
          label="Pais"
          option-value="cod_pais"
          option-label="label"
          emit-value
          map-options
          outlined
          dense
          @update:model-value="inputData.primary_address_state_list_c = ''"
        />
        <q-select
          ref="stateInputRef"
          class="col-12 col-sm-6"
          v-model="inputData.primary_address_state_list_c"
          :options="countryStates"
          label="Departamento"
          :hint="!inputData.primary_address_country ? 'Seleccione un pais' : ''"
          :disable="!inputData.primary_address_country"
          option-value="cod_region"
          option-label="label"
          emit-value
          map-options
          outlined
          dense
        />

        <q-input
          ref="cityInputRef"
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="inputData.primary_address_city"
          type="text"
          label="Ciudad"
          :rules="[(val) => !!val || 'El campo es requerido']"
        />
        <q-select
          class="col-12 col-sm-6 q-mb-sm"
          v-model="inputData.status"
          :options="formOptions.prospectOptions.status"
          label="Estado"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          outlined
          dense
        />
        <q-select
          class="col-12 col-sm-6 q-mb-sm"
          v-model="inputData.lead_source"
          :options="formOptions.prospectOptions.leadSource"
          label="Toma de contacto"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          outlined
          dense
        />
      </div>
    </template>
    <template #read>
      <div class="row q-col-gutter-sm">
        <q-select
          class="col-12 col-sm-6 q-mb-sm"
          hide-dropdown-icon
          v-model="inputData.salutation"
          :options="formOptions.prospectOptions.salutations"
          label="Saludo"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          outlined
          dense
          readonly
        />
        <q-input
          class="col-12 col-sm-6 q-mb-sm"
          outlined
          readonly
          dense
          v-model="inputData.first_name"
          type="text"
          label="Nombres"
        />
        <q-input
          class="col-12 col-sm-6 q-mb-sm"
          outlined
          readonly
          dense
          v-model="inputData.last_name"
          type="text"
          label="Apellidos"
        />
        <q-input
          class="col-12 col-sm-6 q-mb-sm"
          outlined
          readonly
          dense
          v-model="inputData.title"
          type="text"
          label="Cargo"
        />
        <!-- <q-input
          class="col-12 col-sm-6 q-mb-sm"
          outlined
          readonly
          dense
          v-model="inputData.ci_c"
          type="text"
          label="CI/NIT"
        /> -->
        <q-select
          class="col-12 col-sm-6 q-mb-sm"
          hide-dropdown-icon
          v-model="inputData.primary_address_country"
          :options="formOptions.prospectOptions.countries"
          label="Pais"
          option-value="cod_pais"
          option-label="label"
          emit-value
          map-options
          outlined
          dense
          readonly
        />
        <q-select
          class="col-12 col-sm-6 q-mb-sm"
          hide-dropdown-icon
          v-model="inputData.primary_address_state_list_c"
          :options="countryStates"
          label="Departamento"
          option-value="cod_region"
          option-label="label"
          emit-value
          map-options
          outlined
          dense
          readonly
        />
        <q-input
          class="col-12 col-sm-6 q-mb-sm"
          outlined
          readonly
          dense
          v-model="inputData.primary_address_city"
          type="text"
          label="Ciudad"
        />
        <q-select
          class="col-12 col-sm-6 q-mb-sm"
          hide-dropdown-icon
          v-model="inputData.status"
          :options="formOptions.prospectOptions.status"
          label="Estado"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          outlined
          dense
          readonly
        />
        <q-select
          class="col-12 col-sm-6 q-mb-sm"
          hide-dropdown-icon
          v-model="inputData.lead_source"
          :options="formOptions.prospectOptions.leadSource"
          label="Toma de contacto"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          outlined
          dense
          readonly
        />
      </div>
    </template>
  </view-card-component>
</template>
