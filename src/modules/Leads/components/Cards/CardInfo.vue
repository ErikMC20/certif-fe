<script lang="ts" setup>
import { ref, computed } from 'vue';
import { CardInfoLead } from '../../utils/types';
import { useFormOptionsStore } from 'src/stores/formOptionsStore';
import ViewCardVue from 'src/components/MainCard/ViewCard.vue';
import moment from 'moment';
import { QInput } from 'quasar';
import { userStore } from 'src/modules/Users/store/UserStore';
import AdvancedFilterCampaign from 'src/modules/Prospects/components/AdvancedFilterCampaign.vue';
import { storeToRefs } from 'pinia';
import { ProspectService } from 'src/components/Emails/services/MeetingsEmail';

const props = withDefaults(
  defineProps<{
    id?: string;
    data?: CardInfoLead;
    readMode?: boolean;
  }>(),
  {
    readMode: false,
  }
);

const { getCampaignsFilter } = ProspectService();

const baseCardRef = ref<InstanceType<typeof ViewCardVue> | null>(null);
const nameLeadRef = ref<InstanceType<typeof QInput> | null>(null);
const dateClosedLeadRef = ref<InstanceType<typeof QInput> | null>(null);
const campaignFilterRef = ref<InstanceType<typeof AdvancedFilterCampaign> | null>(null);

const languageStore = useFormOptionsStore();
const loggedUserStore = userStore();
const { userCRM } = storeToRefs(loggedUserStore);
let filter = {
  name: '',
  status: 'Active',
  type: '',
  start: '',
  end: '',
  assigned_to: [],
  id_division: userCRM.value.iddivision,
  id_amercado: userCRM.value.idamercado,
};
//* Computed variables
const isEditing = computed(() => baseCardRef.value?.isEditing === 'edit');

const aMercadoOptions = computed(() => {
  const amercado = languageStore.leadsOptions.divisions.filter(
    (option: { cod_div: string }) => option.cod_div === inputData.value.iddivision_c
  )[0] as { amercado: { label: string; cod_amercado: string }[] };
  return amercado?.amercado || [];
});

const motivoOptions = computed(() => {
  const currentState = languageStore.leadsOptions.gainStates.find(
    (option: { label: string; value: string }) =>
      option.value === inputData.value.estado_c
  );
  if (currentState) return currentState['motivo'];
  return [];
});

const statusOptions = computed(() => {
  return languageStore.leadsOptions.gainStates.filter(
    (x: { label: string; value: string; seeInEverything: boolean }) => !!x.seeInEverything
  );
});

const regionesOptions = computed(() => {
  return !!inputData.value.country_c
    ? languageStore.leadsOptions.regions.find(
        (region) => region.cod_pais === inputData.value.country_c
      )?.regiones || []
    : languageStore.leadsOptions.regions.map((region) => region.regiones).flat() || [];
});

const clientGroupOptions = computed(() => {
  const currentClientGroup = languageStore.clientGroup.find(
    (val) => val.div === inputData.value.iddivision_c
  );
  if (!!currentClientGroup) return currentClientGroup.grupo;
  return [];
});

const productOptionsForDiv = computed(() => {
  return (
    (
      languageStore.leadsOptions.leadProducts.filter(
        (x: { cod_div: string }) => x.cod_div === inputData.value.iddivision_c //compara división
      )[0].amercado || []
    ).filter(
      (y: { cod_amercado: string }) => y.cod_amercado === inputData.value.idamercado_c //compara área de mercado
    )[0].productos || []
  );
});

//* Default Functions
const setDefaultData = (): CardInfoLead => {
  const userIdDivision = loggedUserStore.userCRM.iddivision || '';
  const userAMercado = loggedUserStore.userCRM.idamercado || '';
  return {
    name: '',
    iddivision_c: userIdDivision,
    idamercado_c: userAMercado,
    idgrupocliente_c: '',
    origen_c: '',
    campaign_id_c: '',
    campania_c: '',
    estado_c: 'EnTratamiento',
    motivo_c: '',
    producto_c: '',
    date_closed: moment().format('YYYY-MM-DD'),
    description: '',
    currency_id: '-99',
    currency_name: '',
    currency_symbol: '',
    region_c: '01_01',
    prioridad_c: 'Media',
    amount: 0,
  };
};

//* variables
const inputData = ref(!!props.data ? { ...props.data } : setDefaultData());

const campaignNameOptions = ref([
  {
    nombre: inputData.value.campania_c || '',
    id: inputData.value.campaign_id_c,
  },
]);

//* methods

const validateInputs = async () => {
  const validatedFields = await Promise.all([
    nameLeadRef.value?.validate(),
    dateClosedLeadRef.value?.validate(),
  ]);
  return validatedFields.every((field) => !!field);
};

const exposeData = () => {
  return inputData.value;
};

const restoreValues = () => {
  if (props.data) inputData.value = { ...props.data };
};

const openCampaignFilter = () => {
  campaignFilterRef.value?.openDialog();
};

const selectCampaign = (item: { [key: string]: string }) => {
  campaignNameOptions.value = [
    {
      nombre: item.nombre,
      id: item.id,
    },
  ];
  inputData.value.campaign_id_c = item.id;
  inputData.value.name = item.nombre + ' ' + inputData.value.name;
};

const clearRegionData = () => {
  inputData.value.region_c = '';
};

// const modifyLeadName = () => {
//   console.log(campaignNameOptions.value);
// };

const deleteDivisionData = () => {
  inputData.value.idamercado_c = '';
  inputData.value.idgrupocliente_c = '';
};

const filterFn = (
  val: string,
  update: (callback: () => void) => void,
  abort?: () => void
) => {
  update(async () => {
    if (val === '') {
      if (campaignNameOptions.value.length === 0) {
        filter.name = '';
        const response = await getCampaignsFilter(filter);

        campaignNameOptions.value = response;
      }
    } else {
      const needle = val.toLowerCase();
      filter.name = needle;
      const response = await getCampaignsFilter(filter);

      campaignNameOptions.value = response;
      if (response.length === 0) {
        campaignNameOptions.value = [];
      }
    }
  });
};

const showInput = (value: string) => {
  if (value.length === 0) {
    campaignNameOptions.value = [];
    inputData.value.campaign_id_c = '';
  }
};

const showNewValue = (value: string) => {
  inputData.value.name =
    campaignNameOptions.value.find((campaign) => campaign.id === value)?.nombre || '';
};

defineExpose({
  validateInputs,
  exposeData,
  isEditing,
});
</script>
<template>
  <view-card-component
    :controls="!!id && !readMode"
    :initial-status="id ? 'read' : 'edit'"
    icon-name="feed"
    ref="baseCardRef"
    title="Información del Lead"
    @cancel-change="restoreValues"
  >
    <template #edit>
      <div class="row q-col-gutter-lg">
        <q-select
          :options="campaignNameOptions"
          @filter="filterFn"
          @input-value="showInput"
          @update:model-value="showNewValue"
          class="col-12"
          dense
          emit-value
          fill-input
          hide-dropdown-icon
          hide-selected
          input-debounce="1000"
          label="Campaña"
          map-options
          option-label="nombre"
          option-value="id"
          outlined
          use-input
          v-model="inputData.campaign_id_c"
          virtual
          virtual-scroll-slice-size="1"
        >
          <template #after>
            <q-btn
              @click="openCampaignFilter"
              color="primary"
              icon="north_west"
              outline
              dense
            />
            <q-btn
              dense
              outline
              icon="close"
              color="negative"
              @click="inputData.campaign_id_c = ''"
            />
          </template>
        </q-select>
        <q-input
          class="col-12 q-pb-none"
          outlined
          ref="nameLeadRef"
          dense
          v-model="inputData.name"
          type="text"
          label="Titulo del Lead *"
          :rules="[(val) => !!val || 'Ingrese un nombre']"
        />
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="inputData.idgrupocliente_c"
          :options="clientGroupOptions"
          type="text"
          label="Grupo Cliente"
          option-value="value"
          option-label="label"
          emit-value
          map-options
        />
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="inputData.currency_id"
          :options="languageStore.leadCurrency"
          type="text"
          label="Moneda"
          option-value="id"
          option-label="name"
          emit-value
          map-options
        />
        <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="inputData.amount"
          type="text"
          label="Monto"
        />
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="inputData.origen_c"
          :options="languageStore.leadsOptions.originLead"
          type="text"
          label="Origen"
          option-value="value"
          option-label="label"
          emit-value
          map-options
        />

        <!-- <pre>{{ languageStore.leadsOptions.gainStates }}</pre> -->
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          :options="statusOptions"
          v-model="inputData.estado_c"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          type="text"
          label="Estado"
          @update:model-value="inputData.motivo_c = ''"
        />
        <!-- <pre>{{languageStore.leadsOptions.gainStates}}</pre> -->
        <q-select
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          :options="motivoOptions"
          v-model="inputData.motivo_c"
          option-value="value"
          option-label="label"
          emit-value
          :readonly="motivoOptions.length < 2"
          :hide-dropdown-icon="motivoOptions.length < 2"
          :hint="motivoOptions.length < 2 ? 'El estado actual no tiene motivo' : ''"
          map-options
          type="text"
          label="Motivo"
        />
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          :options="productOptionsForDiv"
          v-model="inputData.producto_c"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          type="text"
          label="Producto"
        />
        <!-- <q-input
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="inputData.producto_c"
          type="text"
          label="Producto"
        /> -->
        <!-- <pre>{{languageStore.leadsOptions.leadProducts}}</pre> -->
        <!-- <pre>{{productOptionsForDiv}}</pre> -->
        <!-- {{ inputData.date_closed }} -->
        <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="inputData.date_closed"
          ref="dateClosedLeadRef"
          type="date"
          label="Fecha de cierre *"
          :rules="[(val) => !!val || 'Ingrese una fecha de cierre']"
        />
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          :options="languageStore.leadsOptions.regions"
          v-model="inputData.country_c"
          option-value="cod_pais"
          option-label="label"
          emit-value
          map-options
          type="text"
          label="Pais"
          @update:model-value="clearRegionData"
        />
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          :options="regionesOptions"
          v-model="inputData.region_c"
          option-value="cod_region"
          option-label="label"
          emit-value
          map-options
          type="text"
          label="Region"
        />
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          :options="languageStore.leadsOptions.priority"
          v-model="inputData.prioridad_c"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          type="text"
          label="Prioridad"
        />
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          :options="languageStore.leadsOptions.divisions"
          v-model="inputData.iddivision_c"
          option-value="cod_div"
          option-label="label"
          emit-value
          map-options
          type="text"
          label="Division"
          @update:model-value="deleteDivisionData()"
        />
        <q-select
          v-model="inputData.idamercado_c"
          :options="aMercadoOptions"
          option-value="cod_amercado"
          option-label="label"
          emit-value
          map-options
          class="col-12 col-sm-6"
          outlined
          dense
          label="Area de Mercado"
        />
        <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="inputData.probability"
          label="Probabilidad de que ocurra"
        />
        <!-- <q-input
          class="col-12"
          outlined
          dense
          v-model="inputData.description"
          type="textarea"
          label="Descripción"
        /> -->
      </div>
    </template>
    <template #read>
      <div class="row q-col-gutter-lg">
        <q-select
          v-model="inputData.campaign_id_c"
          readonly
          :options="campaignNameOptions"
          option-value="id"
          option-label="nombre"
          emit-value
          map-options
          class="col-12"
          hide-dropdown-icon
          outlined
          dense
          label="Campaña"
        >
        </q-select>
        <q-input
          class="col-12 q-pb-none"
          outlined
          ref="nameLeadRef"
          dense
          v-model="inputData.name"
          readonly
          type="text"
          label="Titulo del Lead *"
          :rules="[(val) => !!val || 'Ingrese un nombre']"
        />
        <!-- <pre>{{ aMercadoOptions }} || {{ inputData.idamercado_c }}</pre> -->
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="inputData.idgrupocliente_c"
          :options="clientGroupOptions"
          readonly
          hide-dropdown-icon
          type="text"
          label="Grupo Cliente"
          option-value="value"
          option-label="label"
          emit-value
          map-options
        />
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="inputData.currency_id"
          :options="languageStore.leadCurrency"
          readonly
          hide-dropdown-icon
          type="text"
          label="Moneda"
          option-value="id"
          option-label="name"
          emit-value
          map-options
        />
        <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="inputData.amount"
          readonly
          type="text"
          label="Monto"
        />
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="inputData.origen_c"
          :options="languageStore.leadsOptions.originLead"
          hide-dropdown-icon
          readonly
          type="text"
          label="Origen"
          option-value="value"
          option-label="label"
          emit-value
          map-options
        />
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          :options="statusOptions"
          hide-dropdown-icon
          readonly
          v-model="inputData.estado_c"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          type="text"
          label="Estado"
        />
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          :options="motivoOptions"
          v-model="inputData.motivo_c"
          hide-dropdown-icon
          readonly
          option-value="value"
          option-label="label"
          emit-value
          map-options
          type="text"
          label="Motivo"
        />
        <q-input
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="inputData.producto_c"
          readonly
          type="text"
          label="Producto"
        />
        <!-- {{ inputData.date_closed }} -->
        <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="inputData.date_closed"
          readonly
          ref="dateClosedLeadRef"
          type="date"
          label="Fecha de cierre *"
          :rules="[(val) => !!val || 'Ingrese una fecha de cierre']"
        />
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          readonly
          hide-dropdown-icon
          :options="languageStore.leadsOptions.regions"
          v-model="inputData.country_c"
          option-value="cod_pais"
          option-label="label"
          emit-value
          map-options
          type="text"
          label="Pais"
        />
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          :options="regionesOptions"
          v-model="inputData.region_c"
          hide-dropdown-icon
          readonly
          option-value="cod_region"
          option-label="label"
          emit-value
          map-options
          type="text"
          label="Region"
        />
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          :options="languageStore.leadsOptions.priority"
          hide-dropdown-icon
          readonly
          v-model="inputData.prioridad_c"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          type="text"
          label="Prioridad"
        />
        <q-select
          :options="languageStore.leadsOptions.divisions"
          class="col-12 col-sm-6"
          dense
          emit-value
          hide-dropdown-icon
          label="Division"
          map-options
          option-label="label"
          option-value="cod_div"
          outlined
          readonly
          type="text"
          v-model="inputData.iddivision_c"
        />
        <q-select
          v-model="inputData.idamercado_c"
          hide-dropdown-icon
          readonly
          :options="aMercadoOptions"
          option-value="cod_amercado"
          option-label="label"
          emit-value
          map-options
          class="col-12 col-sm-6"
          outlined
          dense
          label="Area de Mercado"
        />
        <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          readonly
          v-model="inputData.probability"
          label="Probabilidad de que ocurra"
        />
        <!-- <q-input
          class="col-12"
          outlined
          dense
          v-model="inputData.description"
          readonly
          type="textarea"
          label="Descripción"
        /> -->
      </div>
    </template>
  </view-card-component>
  <AdvancedFilterCampaign ref="campaignFilterRef" @select-item="selectCampaign" />
</template>
