<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useInputDirection } from '../../composables/InputDirection';
import { MapComponentLeaflet } from '../../../../components/MapsGPS/index';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { DirectionAccountComponentModel } from '../../utils/types/index';
const provider = new OpenStreetMapProvider();
interface DirectionValueModel {
  id: string;
  label: string;
  cod_dir: string;
  value?: string;
}
const props = defineProps<{
  modelValue: DirectionAccountComponentModel;
  options: DirectionValueModel[];
}>();
const emits = defineEmits<{
  (event: 'update:modelValue', values: DirectionAccountComponentModel): void;
}>();
const sendValueToParent = (value: DirectionAccountComponentModel) => {
  emits('update:modelValue', value);
};
const {
  availableInputs,
  detailedVersion,
  directionValueAuto,
  directionsValueLocal,
  generatedDirectionView,
  addNewInput,
  removeInputNew,
  updateInputPerCode,
} = useInputDirection(
  props.modelValue.address_street_generated_c,
  props.options,
  sendValueToParent
);

// VALUES FAST SEARCH
const options2 = ref<object[]>([]);
const latitude = ref<number>(props.modelValue.latitude || 0);
const longitude = ref<number>(props.modelValue.longitude || 0);

const searchTerm = computed({
  get() {
    return directionValueAuto.value;
    //return '';
  },
  set(val: { label: string; y: number; x: number } | string) {
    if (typeof val === 'object') {
      directionValueAuto.value = val.label;
      latitude.value = val.y;
      longitude.value = val.x;
      return val.label;
    }
  },
});

const filterFn = (val: string, update: (arg0: () => Promise<void>) => void) => {
  setTimeout(() => {
    update(async () => {
      if (val === '') {
        options2.value = [];
      } else {
        const results = await provider.search({ query: val });
        console.log('resultado');
        console.log(results);
        options2.value = results;
      }
    });
  }, 1000);
};
const abortFilterFn = () => {
  //console.log('delayed filter aborted')
};
const insertDirection = (location: {
  direction: string;
  latitude: number;
  longitude: number;
}) => {
  directionValueAuto.value = location.direction;
  latitude.value = location.latitude;
  longitude.value = location.longitude;
  sendValueToParent({
    address_street_generated_c: location.direction,
    latitude: latitude.value,
    longitude: longitude.value,
  });
};
// END VALUES FAST SEARCH

// Reset values onToggle detailedVersion
watch(detailedVersion, () => {
  if (directionsValueLocal.value.length > 0) {
    directionsValueLocal.value = directionsValueLocal.value.map((v) => ({
      ...v,
      value: '',
    }));
  }
  directionValueAuto.value = '';
  sendValueToParent({
    address_street_generated_c: '',
    latitude: 0,
    longitude: 0,
  });
});
</script>

<template>
  <div v-if="detailedVersion">
    <q-input
      v-for="input in directionsValueLocal"
      :key="input.id"
      v-model="input.value"
      outlined
      dense
      class="q-mb-sm"
      type="text"
      :label="input.label"
    >
      <template #prepend>
        <q-select
          v-model="input.cod_dir"
          :options="availableInputs"
          label="Titulo"
          dense
          filled
          option-value="cod_dir"
          option-label="label"
          map-options
          emit-value
          style="min-width: 100px"
          @update:model-value="updateInputPerCode"
        />
      </template>
      <template #after>
        <q-btn
          color="negative"
          icon="close"
          round
          :size="'sm'"
          @click="removeInputNew(input.id)"
        />
      </template>
    </q-input>

    <q-btn-dropdown
      v-if="availableInputs.length > 0"
      label="Añadir Nuevo Campo"
      flat
      icon="add"
      class="q-my-sm"
      color="primary"
      auto-close
    >
      <q-list>
        <q-item
          v-for="val in availableInputs"
          :key="val.id"
          clickable
          v-close-popup
        >
          <q-item-section>
            <q-item-label @click="addNewInput(val.id)">{{
              val.label
            }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <q-input
      v-model="generatedDirectionView"
      label="Direccion Completa"
      readonly
      autogrow
    />
  </div>

  <div v-else>
    <q-select
      v-model="searchTerm"
      :options="options2"
      standout
      outlined
      hide-selected
      fill-input
      input-debounce="0"
      label="Dirección"
      dense
      options-dense
      use-input
      bottom-slots
      @filter="filterFn"
      @filter-abort="abortFilterFn"
    >
      <template #append>
        <q-btn class="gt-ms" size="12px" flat dense round icon="place">
          <q-tooltip class="bg-indigo" :offset="[10, 10]">
            Leaflet Maps
          </q-tooltip>
          <q-popup-proxy>
            <MapComponentLeaflet
              @insert="insertDirection"
              :lat="latitude"
              :lng="longitude"
            ></MapComponentLeaflet>
          </q-popup-proxy>
        </q-btn>
      </template>
      <template #no-option> Sin resultados </template>

      <!-- <template #hint>
                  Ingresar mas dirección:
                  <q-toggle
                    v-model="visible"
                    size="xs"
                    icon="local_library"
                    @update:model-value="changeDirectionType"
                    :label="visible ? 'Corto' : 'Detallado'"
                  />
                </template> -->
    </q-select>
    <q-input
      v-model="directionValueAuto"
      label="Direccion Completa"
      readonly
      autogrow
    />
  </div>

  <q-toggle
    icon="direction"
    class="q-mt-sm"
    checked-icon="check"
    :label="`Modo detallado ${detailedVersion ? 'Activado' : 'Desactivado'}`"
    unchecked-icon="clear"
    v-model="detailedVersion"
    color="primary"
  />
</template>
