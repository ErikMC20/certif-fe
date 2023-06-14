<script setup lang="ts">
import { ref, computed } from 'vue';
import { QPopupProxy } from 'quasar';
import { OpportunityGlobal } from '../../utils/types';
import ViewCard from 'src/components/MainCard/ViewCard.vue';
import { useOpportunity } from '../../composables/useOppotunity/index';

interface Props {
  id: string;
  data: OpportunityGlobal;
}

const props = defineProps<Props>();
const { tipoFinanciamientoOptions, dimBanco } = useOpportunity();

const baseCardRef = ref<InstanceType<typeof ViewCard> | null>();
const datePopupRef = ref<InstanceType<typeof QPopupProxy> | null>(null);

const inputData = ref({ ...props.data });

const restoreValues = () => {
  inputData.value = { ...props.data };
};

const temporalOptions = [
  {
    label: 'uno',
    value: 'one',
  },
];

const hidePopup = () => {
  datePopupRef.value?.hide();
};

defineExpose({
  isEditing: computed(() => baseCardRef.value?.isEditing === 'edit'),
  exposeData: (): OpportunityGlobal => ({ ...inputData.value }),
});
</script>

<template>
  <view-card-component
    :controls="!!props.id"
    :initial-status="props.id ? 'read' : 'edit'"
    icon-name="info"
    ref="baseCardRef"
    title="Otros"
    @cancel-change="restoreValues"
    @edit-change="restoreValues"
  >
    <template #edit>
      <!-- <pre>input data values: {{ inputData }}</pre> -->
      <div class="row q-col-gutter-lg q-py-md">
        <q-select
          v-model="inputData.tipofinanciamiento_c"
          :options="tipoFinanciamientoOptions"
          class="col-12 col-sm-6"
          label="Tipo de financiamiento"
          option-value="value"
          option-label="label"
          options-dense
          emit-value
          map-options
          outlined
          dense
        />
        <q-select
          v-model="inputData.entidadbancaria_c"
          :options="dimBanco"
          class="col-12 col-sm-6"
          label="Entidad Bancaria"
          option-value="value"
          option-label="label"
          options-dense
          emit-value
          map-options
          outlined
          dense
        />
        <q-input
          outlined
          class="col-12 col-sm-6"
          dense
          label="Fecha inicio"
          v-model="inputData.fecha_entrega_c"
          clearable
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                ref="datePopupRef"
                cover
                transition-show="scale"
                transition-hide="scale"
                anchor="center start"
              >
                <q-date
                  v-model="inputData.fecha_entrega_c"
                  title="Fecha inicio"
                  mask="DD-MM-YYYY"
                  @update:model-value="hidePopup"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input
          v-model="inputData.ejecutivobanco_c"
          type="text"
          class="col-12 col-sm-6"
          label="Ejecutivo de Crédito"
          outlined
          dense
        />
      </div>
    </template>
    <template #read>
      <!-- <pre>props data: {{ props.data }}</pre> -->
      <div class="row q-col-gutter-lg q-py-md">
        <q-select
          v-model="inputData.tipofinanciamiento_c"
          :options="tipoFinanciamientoOptions"
          class="col-12 col-sm-6"
          label="Tipo de financiamiento"
          option-value="value"
          option-label="label"
          options-dense
          emit-value
          hide-dropdown-icon
          map-options
          outlined
          readonly
          dense
        />
        <q-select
          v-model="inputData.entidadbancaria_c"
          :options="dimBanco"
          class="col-12 col-sm-6"
          label="Entidad Bancaria"
          option-value="value"
          option-label="label"
          options-dense
          emit-value
          hide-dropdown-icon
          map-options
          outlined
          readonly
          dense
        />
        <q-input
          outlined
          class="col-12 col-sm-6"
          dense
          readonly
          label="Fecha inicio"
          v-model="inputData.fecha_entrega_c"
          clearable
        >
        </q-input>
        <q-input
          v-model="inputData.ejecutivobanco_c"
          type="text"
          class="col-12 col-sm-6"
          label="Ejecutivo de Crédito"
          outlined
          readonly
          dense
        />
      </div>
    </template>
  </view-card-component>
</template>

<style scoped lang="scss"></style>
