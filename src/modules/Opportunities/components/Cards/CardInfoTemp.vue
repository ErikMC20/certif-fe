<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue';
import type { OpportunityGlobal, RenderModel, Phase } from '../../utils/types';
import ViewCard from 'src/components/MainCard/ViewCard.vue';
import { useQuasar, QSpinnerPuff, QPopupProxy } from 'quasar';
import { useOpportunity } from '../../composables/useOppotunity/';
import AccountRelationCard from 'src/modules/Leads/components/Cards/AccountRelationCard.vue';
import ContactRelationCard from 'src/modules/Leads/components/Cards/ContactRelationCard.vue';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
import { useOpportunitiesStore } from '../../store/OpportunitiesStore';
import { userStore } from 'src/modules/Users/store/UserStore';
import {
  AccountModel,
  AccountDataDraft,
} from 'src/modules/Accounts/utils/types/index';
import { ProspectService } from '../../../../components/Emails/services/MeetingsEmail';

const AdvancedFilterCampaign = defineAsyncComponent(
  () => import('src/modules/Prospects/components/AdvancedFilterCampaign.vue')
);

interface Props {
  id: string;
  data: OpportunityGlobal;
  accountCreationAsEvent?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  accountCreationAsEvent: false,
});
interface Emits {
  (event: 'createAccount', type: AccountModel): void;
}

const emits = defineEmits<Emits>();
const {
  divisionsSales,
  grupoCliente,
  currencyOptions,
  countries,
  aCuentaDeOptions,
  opportunityTypeAll,
  opportunityState,
  origin,
  userCRM,
  getOpportunityGlobal,
} = useOpportunity();
const { getCampaignsFilter } = ProspectService();
const accountRelationCardRef = ref<InstanceType<
  typeof AccountRelationCard
> | null>(null);
const baseCardRef = ref<InstanceType<typeof ViewCard> | null>(null);
const datePopupRef = ref<InstanceType<typeof QPopupProxy> | null>(null);
const confirmDialog = ref(false);
const OpportunitiesStore = useOpportunitiesStore();
const loggedUserStore = userStore();
const campaignFilterRef = ref<InstanceType<
  typeof AdvancedFilterCampaign
> | null>(null);

const inputData = ref({ ...props.data });
const campaignNameOptions = ref([
  {
    nombre: inputData.value.campaign_name || '',
    id: inputData.value.campaign_id,
  },
]);
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

//* Options
const editAMercadoOptions = computed(
  () =>
    divisionsSales.value.find(
      (div) => div.cod_div === inputData.value.iddivision_c
    )?.amercado || []
);
const editGrupoOportunidadOptions = computed(
  () =>
    grupoCliente.value.find(
      (grupo) => grupo.div === inputData.value.iddivision_c
    )?.grupo || []
);
const countryOptions = computed(() => countries.value || []);
const regionOptions = computed(() => {
  return !!inputData.value.country_c
    ? countries.value.find(
        (country) => country.cod_pais === inputData.value.country_c
      )?.regiones || []
    : countries.value.map((country) => country.regiones).flat() || [];
});

const opportunityTypeOptions = computed(
  () =>
    opportunityTypeAll.value.filter(
      (opp) =>
        opp.div === //inputData.value.iddivision_c
        (!!inputData.value.iddivision_c
          ? inputData.value.iddivision_c
          : loggedUserStore.userCRM.iddivision)
    ) || []
);
const faseVentaOptions = computed(
  () =>
    opportunityTypeAll.value.find(
      (opp) =>
        opp.value === //inputData.value.opportunity_type
        (!!inputData.value.opportunity_type
          ? inputData.value.opportunity_type
          : '03_01_Hansa')
    )?.phase || []
);

let faseActual = ref({
  phase: '',
  value_aux: '',
  Percent: '',
  color: '',
});
const objectRender = (PhaseOptionsArray: Phase[], sales_stage?: string) => {
  sales_stage = !!sales_stage ? sales_stage : PhaseOptionsArray[0].value;
  let resp = [
    {
      value: '',
      label: '',
      color: '',
      prob: '',
      labelComponent: '',
    },
  ];

  let sw = true;
  let cont = 0;

  for (let i = 0; i < PhaseOptionsArray.length; i++) {
    if (PhaseOptionsArray[i].value != sales_stage) {
      if (sw) {
        resp[i] = {
          value: PhaseOptionsArray[i].value,
          label: '',
          color: PhaseOptionsArray[i].prop.percentage,
          prob: PhaseOptionsArray[i].prop.percentage,
          labelComponent: PhaseOptionsArray[i].label,
        };
      } else {
        resp[i] = {
          value: PhaseOptionsArray[i].value,
          label: PhaseOptionsArray[i].label,
          color: '#fff',
          prob: PhaseOptionsArray[i].prop.percentage,
          labelComponent: PhaseOptionsArray[i].label,
        };
      }
    } else {
      sw = false;
      cont = i;
      resp[i] = {
        value: PhaseOptionsArray[i].value,
        label: PhaseOptionsArray[i].prop.percentage,
        color: PhaseOptionsArray[i].prop.color,
        prob: PhaseOptionsArray[i].prop.percentage,
        labelComponent: PhaseOptionsArray[i].label,
      };

      faseActual.value = {
        phase: PhaseOptionsArray[i].label,
        value_aux: PhaseOptionsArray[i].value,
        Percent: PhaseOptionsArray[i].prop.percentage,
        color: PhaseOptionsArray[i].prop.color,
      };
    }
  }
  for (let i = 0; i <= cont; i++) {
    resp[i].color = resp[cont].color;
  }
  return resp;
};
const phaseRenderArray = ref(
  objectRender(
    faseVentaOptions.value,
    !inputData.value.sales_stage ? '' : inputData.value.sales_stage
  )
);
// const generatePhases = () => {
//   // agregar coondiciones en caso de editar o crear RECORDADORIO
//   phaseRenderArray.value = objectRender(faseVentaOptions.value, inputData.value.sales_stage);
// };

// const prueba = objectRender(faseVentaOptions.value, inputData.value.sales_stage)
// console.log('ggggg',prueba)

//* Methods
const restoreValues = () => {
  if (props.data) inputData.value = { ...props.data };
};
const hidePopup = () => {
  datePopupRef.value?.hide();
};

const refreshDivisionValues = () => {
  inputData.value.idamercado_c = '';
  inputData.value.idgrupocliente_c = '';
  inputData.value.opportunity_type = '';
  inputData.value.sales_stage = '';
};

const refreshEstadoOportunidad = () => {
  inputData.value.motivo_c = '';
};

const createNewAccount = (type: AccountModel) => {
  emits('createAccount', type);
};

const openAccountDialogWithData = (
  type: AccountModel,
  data: AccountDataDraft
) => {
  console.log('here in card info');
  accountRelationCardRef.value?.openAccountDialogWithData(type, data);
};

const assignToContact = (idContact: string) => {
  inputData.value.contact_id1_c = idContact;
};

const clearRegion = () => {
  inputData.value.region_c = '';
};

// CONFIRMACIÓN DE ACTUALIZACIÓN DE FASE
// const emitsEdit = defineEmits<{
//   (event: 'recordCompleted'): void;
// }>();

const $q = useQuasar();
let auxConfirm = ref({
  value: '',
  label: '',
  percentage: '',
});
const openConfirm = async (value_btn: RenderModel) => {
  auxConfirm.value.value = value_btn.value;
  auxConfirm.value.label = value_btn.label;
  auxConfirm.value.percentage = value_btn.prob;
  confirmDialog.value = true;
};
const Record = async () => {
  try {
    $q.loading.show({
      spinner: QSpinnerPuff,
      message: 'Actualizando oportunidad',
    });

    await OpportunitiesStore.updateLead(
      !props.id ? '' : props.id,
      {
        sales_stage: auxConfirm.value.value,
        modified_user_id: loggedUserStore.userCRM.id,
        probability: auxConfirm.value.percentage,
      },
      {}
    );
    // emitsEdit('recordCompleted');
    await getOpportunityGlobal(props.id);
    $q.notify({
      type: 'warning',
      message: 'Se ha actualizado la oportunidad correctamente',
    });
  } catch (error) {
    console.log(error);
    $q.notify({
      type: 'negative',
      message: 'Error en el proceso',
      caption: 'No se ha podido actualizar correctamente la oporunidad',
    });
  } finally {
    $q.loading.hide();
  }
  // return ''
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
  inputData.value.campaign_id = item.id;
};

const filterFn = (val: string, update: (callback: () => void) => void) => {
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
    inputData.value.campaign_id = '';
  }
};

defineExpose({
  isEditing: computed(() => baseCardRef.value?.isEditing === 'edit'),
  exposeData: (): OpportunityGlobal => ({ ...inputData.value }),
  opportunityCurrentState: computed(() => inputData.value.opportunity_type),
  openAccountDialogWithData,
});
</script>

<template>
  <view-card-component
    v-bind="$attrs"
    :controls="!!props.id"
    :initial-status="props.id ? 'read' : 'edit'"
    icon-name="info"
    ref="baseCardRef"
    title="Información general"
    @cancel-change="restoreValues"
    @edit-change="restoreValues"
  >
    <template #edit>
      <!-- <pre>input edit values = {{ inputData }}</pre> -->
      <div class="row q-col-gutter-lg q-py-md">
        <div class="col-12 col-sm-6">
          <AccountRelationCard
            ref="accountRelationCardRef"
            v-model:id="inputData.account_id"
            module-name="Cuenta"
            edit-mode
            :account-creation-as-event="props.accountCreationAsEvent"
            @create-account="createNewAccount"
            @contact-created="assignToContact"
          />
        </div>
        <div class="col-12 col-sm-6">
          <ContactRelationCard
            v-model:id="inputData.contact_id_c"
            module-name="Persona de contacto"
            edit-mode
            :account-id="inputData.account_id"
          />
        </div>
        <!-- <div class="col-12">
          <q-separator dark color="grey-4"/>
        </div> -->
        <q-input
          v-model="inputData.name"
          type="text"
          class="col-12 col-sm-8"
          label="Nombre de la oportunidad"
          outlined
          dense
        />
        <q-select
          :options="opportunityState"
          class="col-12 col-sm-4"
          dense
          emit-value
          label="Estado"
          map-options
          option-label="label"
          option-value="value"
          outlined
          v-model="inputData.estado_oportunidad_c"
          @update:model-value="refreshEstadoOportunidad"
        />
        <q-select
          :options="opportunityTypeOptions"
          class="col-12 col-sm-12"
          dense
          emit-value
          label="Tipo de oportunidad"
          map-options
          option-label="label"
          option-value="value"
          outlined
          v-model="inputData.opportunity_type"
        />
        <div class="col-12 q-pb-none">
          <span style="color: #1b1b28">Fase: </span
          ><span :style="{ color: faseActual.color }">{{
            faseActual.phase
          }}</span>
          <q-scroll-area style="width: 100%; height: 50px; padding-top: 2px">
            <q-btn-group push spread v-if="!!faseVentaOptions.length">
              <q-btn
                dense
                v-for="(i, index) in phaseRenderArray"
                :key="index"
                :value="i.value"
                class="text-dark q-px-md"
                :style="{
                  'background-color': i.color,
                }"
                style="border-top: 1px solid #cdcdcd"
                clickable
                v-model="inputData.sales_stage"
              >
                <span class="prueba">{{ i.label }}</span>
                <q-tooltip class="bg-accent">{{
                  i.labelComponent + ' ' + i.prob
                }}</q-tooltip>
              </q-btn>
            </q-btn-group>
            <q-btn
              v-else
              color="blue-grey-4"
              flat
              icon="warning"
              label="Seleccione un tipo oportunidad"
              disabled
            />
          </q-scroll-area>
          <!-- <br />
          <span>{{ inputData.phase }}</span> -->
          <!-- class="text-weight-medium" -->
        </div>
        <q-select
          :options="editGrupoOportunidadOptions"
          class="col-12 col-sm-6"
          dense
          emit-value
          label="Grupo Oportunidad"
          map-options
          option-label="label"
          option-value="value"
          outlined
          v-model="inputData.idgrupocliente_c"
        />
        <q-input
          outlined
          class="col-12 col-sm-6"
          dense
          label="Fecha de cierre"
          v-model="inputData.date_closed"
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
                  v-model="inputData.date_closed"
                  title="Fecha inicio"
                  mask="DD-MM-YYYY"
                  @update:model-value="hidePopup"
                />
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input
          v-model="inputData.amount"
          type="text"
          class="col-12 col-sm-6"
          label="Monto de la Oportunidad"
          outlined
          dense
        />
        <q-select
          :options="currencyOptions"
          class="col-12 col-sm-6"
          dense
          emit-value
          label="Moneda"
          map-options
          option-label="label"
          option-value="value"
          outlined
          v-model="inputData.currency_id"
        />
        <q-select
          :options="origin"
          class="col-12 col-sm-6"
          dense
          emit-value
          label="Origen"
          map-options
          option-label="label"
          option-value="value"
          outlined
          v-model="inputData.origen_c"
        />
        <q-select
          :options="campaignNameOptions"
          @filter="filterFn"
          @input-value="showInput"
          class="col-12 col-sm-6"
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
          v-model="inputData.campaign_id"
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
              @click="inputData.campaign_id = ''"
            />
          </template>
        </q-select>
        <div class="col-12">
          <q-separator dark color="grey-4" />
        </div>
        <q-select
          :options="divisionsSales"
          class="col-12 col-sm-6"
          dense
          emit-value
          label="División"
          map-options
          option-label="label"
          option-value="cod_div"
          outlined
          v-model="inputData.iddivision_c"
          @update:model-value="refreshDivisionValues()"
        />
        <q-select
          :options="editAMercadoOptions"
          class="col-12 col-sm-6"
          dense
          emit-value
          label="Área de mercado"
          map-options
          option-label="label"
          option-value="cod_amercado"
          outlined
          v-model="inputData.idamercado_c"
        />
        <q-select
          :options="countryOptions"
          class="col-12 col-sm-6"
          dense
          emit-value
          label="País"
          map-options
          option-label="label"
          option-value="cod_pais"
          outlined
          v-model="inputData.country_c"
          @update:model-value="clearRegion"
        />
        <q-select
          :options="regionOptions"
          class="col-12 col-sm-6"
          dense
          emit-value
          label="Región"
          map-options
          option-label="label"
          option-value="cod_region"
          outlined
          v-model="inputData.region_c"
        />
        <q-input
          v-model="inputData.provmunicipio_c"
          type="text"
          class="col-12 col-sm-6"
          label="Provincia/Municipio"
          outlined
          dense
        />
        <q-select
          :options="aCuentaDeOptions"
          class="col-12 col-sm-6"
          dense
          emit-value
          label="Participación como"
          map-options
          option-label="label"
          option-value="value"
          outlined
          v-model="inputData.acuenta_de_c"
        />
        <q-input
          outlined
          class="col-12 col-sm-6"
          dense
          label="CUCE"
          v-model="inputData.cuce_c"
          clearable
        />
        <q-input
          outlined
          class="col-12 col-sm-6"
          dense
          label="Probabilidad del proyecto (%)"
          v-model="inputData.prob_proyecto_c"
          clearable
          readonly
        />
      </div>
    </template>
    <template #read>
      <div class="row q-col-gutter-lg q-py-md">
        <div class="col-12 col-sm-6">
          <AccountRelationCard
            v-model:id="inputData.account_id"
            module-name="Cuenta"
          />
        </div>
        <div class="col-12 col-sm-6">
          <ContactRelationCard
            v-model:id="inputData.contact_id_c"
            module-name="Persona de contacto"
          />
        </div>
        <!-- <div class="col-12">
          <q-separator dark color="grey-4"/>
        </div> -->
        <q-input
          v-model="inputData.name"
          type="text"
          class="col-12 col-sm-8"
          label="Nombre de la oportunidad"
          outlined
          dense
          readonly
        />
        <q-select
          :options="opportunityState"
          class="col-12 col-sm-4"
          dense
          emit-value
          hide-dropdown-icon
          label="Estado"
          map-options
          option-label="label"
          option-value="value"
          outlined
          readonly
          v-model="inputData.estado_oportunidad_c"
          @update:model-value="refreshEstadoOportunidad"
        />
        <q-select
          :options="opportunityTypeOptions"
          class="col-12 col-sm-12"
          dense
          emit-value
          hide-dropdown-icon
          label="Tipo de oportunidad"
          map-options
          option-label="label"
          option-value="value"
          outlined
          readonly
          v-model="inputData.opportunity_type"
        />
        <div class="col-12 q-pb-none">
          <span style="color: #1b1b28">Fase: </span
          ><span :style="{ color: faseActual.color }">{{
            faseActual.phase
          }}</span>
          <q-scroll-area style="width: 100%; height: 50px; padding-top: 2px">
            <q-btn-group push spread v-if="!!faseVentaOptions.length">
              <q-btn
                dense
                v-for="(i, index) in phaseRenderArray"
                :key="index"
                :value="i.value"
                class="text-dark q-px-md"
                :style="{
                  'background-color': i.color,
                }"
                style="border-top: 1px solid #cdcdcd"
                @click="openConfirm(i)"
                clickable
                v-model="inputData.sales_stage"
              >
                <span class="prueba">{{ i.label }}</span>
                <q-tooltip class="bg-accent">{{
                  i.labelComponent + ' ' + i.prob
                }}</q-tooltip>
              </q-btn>
            </q-btn-group>
            <q-btn
              v-else
              color="blue-grey-4"
              flat
              icon="warning"
              label="Seleccione un tipo oportunidad"
              disabled
            />
          </q-scroll-area>
          <!-- <br />
          <span>{{ inputData.phase }}</span> -->
          <!-- class="text-weight-medium" -->
        </div>
        <q-select
          :options="editGrupoOportunidadOptions"
          class="col-12 col-sm-6"
          dense
          emit-value
          hide-dropdown-icon
          label="Grupo Oportunidad"
          map-options
          option-label="label"
          option-value="value"
          outlined
          readonly
          v-model="inputData.idgrupocliente_c"
        />
        <q-input
          outlined
          class="col-12 col-sm-6"
          dense
          readonly
          label="Fecha de cierre"
          v-model="inputData.date_closed"
          clearable
        >
        </q-input>
        <q-input
          v-model="inputData.amount"
          type="text"
          class="col-12 col-sm-6"
          label="Monto de la Oportunidad"
          outlined
          readonly
          dense
        />
        <q-select
          :options="currencyOptions"
          class="col-12 col-sm-6"
          dense
          emit-value
          hide-dropdown-icon
          label="Moneda"
          map-options
          option-label="label"
          option-value="value"
          outlined
          readonly
          v-model="inputData.currency_id"
        />
        <q-select
          :options="origin"
          class="col-12 col-sm-6"
          dense
          emit-value
          hide-dropdown-icon
          label="Origen"
          map-options
          option-label="label"
          option-value="value"
          outlined
          readonly
          v-model="inputData.origen_c"
        />
        <q-select
          v-model="inputData.campaign_id"
          readonly
          :options="campaignNameOptions"
          option-value="id"
          option-label="nombre"
          emit-value
          map-options
          class="col-12 col-sm-6"
          hide-dropdown-icon
          outlined
          dense
          label="Campaña"
        />
        <div class="col-12">
          <q-separator dark color="grey-4" />
        </div>
        <q-select
          :options="divisionsSales"
          class="col-12 col-sm-6"
          dense
          emit-value
          label="División"
          hide-dropdown-icon
          map-options
          option-label="label"
          option-value="cod_div"
          outlined
          readonly
          v-model="inputData.iddivision_c"
          @update:model-value="refreshDivisionValues()"
        />
        <q-select
          :options="editAMercadoOptions"
          class="col-12 col-sm-6"
          dense
          emit-value
          hide-dropdown-icon
          label="Área de mercado"
          map-options
          option-label="label"
          option-value="cod_amercado"
          outlined
          readonly
          v-model="inputData.idamercado_c"
        />
        <q-select
          :options="countryOptions"
          class="col-12 col-sm-6"
          dense
          emit-value
          hide-dropdown-icon
          label="País"
          map-options
          option-label="label"
          option-value="cod_pais"
          outlined
          readonly
          v-model="inputData.country_c"
        />
        <q-select
          :options="regionOptions"
          class="col-12 col-sm-6"
          dense
          emit-value
          hide-dropdown-icon
          label="Región"
          map-options
          option-label="label"
          option-value="cod_region"
          outlined
          readonly
          v-model="inputData.region_c"
        />
        <q-input
          v-model="inputData.provmunicipio_c"
          type="text"
          class="col-12 col-sm-6"
          label="Provincia/Municipio"
          outlined
          readonly
          dense
        />
        <q-select
          :options="aCuentaDeOptions"
          class="col-12 col-sm-6"
          dense
          emit-value
          hide-dropdown-icon
          label="Participación como"
          map-options
          option-label="label"
          option-value="value"
          outlined
          readonly
          v-model="inputData.acuenta_de_c"
        />
        <q-input
          outlined
          class="col-12 col-sm-6"
          dense
          label="CUCE"
          v-model="inputData.cuce_c"
          clearable
          readonly
        />
        <q-input
          outlined
          class="col-12 col-sm-6"
          dense
          label="Probabilidad del proyecto (%)"
          v-model="inputData.prob_proyecto_c"
          clearable
          readonly
        />
      </div>
    </template>
  </view-card-component>
  <AdvancedFilterCampaign
    ref="campaignFilterRef"
    @select-item="selectCampaign"
  />
  <AlertComponent
    title="¿Actualizar oportunidad?"
    icon="warning"
    iconColor="warning"
    iconSize="50px"
    btn-color="primary"
    btn-text="Si, actualziar"
    v-model="confirmDialog"
    @confirm="Record"
    @denegate="confirmDialog = false"
  >
    <template #body>
      <span class="q-py-sm">
        ¿Está seguro de que desea actualizar la fase de la Oportunidad a:
        <b>{{ auxConfirm.label }}</b
        >?
      </span>
    </template>
  </AlertComponent>
</template>

<style scoped lang="scss">
.prueba {
  text-overflow: ellipsis;
  overflow: hidden !important;
  white-space: nowrap;
  width: 100px;
  padding-left: 0px;
  // border: 1px solid;
  // background-color: #92a8d1;
}
</style>
