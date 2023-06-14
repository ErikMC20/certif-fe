<script lang="ts" setup>
import { ref, computed } from 'vue';
import * as type from '../../utils/types';
import { useFormOptionsStore } from 'src/stores/formOptionsStore';
import { userStore } from 'src/modules/Users/store/UserStore';
import ViewCardVue from 'src/components/MainCard/ViewCard.vue';
import moment from 'moment';
import { QInput } from 'quasar';
import AdvancedFilterCampaign from 'src/modules/Prospects/components/AdvancedFilterCampaign.vue';
import AccountRelationCard from './AccountRelationCard.vue';
import ContactRelationCard from './ContactRelationCard.vue';
import { useDivAreaMercado } from 'src/composables/useLanguage';
import { objectPick } from '@vueuse/core';
import { colorsStore } from '../../../../stores/template/templateStore';
import { useOpportunity } from '../../composables';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
import { useQuasar, QSpinnerPuff } from 'quasar';
import { useOpportunitiesStore } from '../../store/OpportunitiesStore';
import { useDialogTabs } from 'src/composables/Dialog/useDialog';

const props = withDefaults(
  defineProps<{
    id?: string;
    data?: type.CardInfoOpportunity;
    readMode?: boolean;
  }>(),
  {
    readMode: false,
  }
);
const emits = defineEmits<{
  (event: 'recordCompleted'): void;
}>();

const baseCardRef = ref<InstanceType<typeof ViewCardVue> | null>(null);
const nameOpportunityRef = ref<InstanceType<typeof QInput> | null>(null);
const dateClosedLeadRef = ref<InstanceType<typeof QInput> | null>(null);
const isEditing = computed(() => baseCardRef.value?.isEditing === 'edit');

const campaignFilterRef = ref<InstanceType<
  typeof AdvancedFilterCampaign
> | null>(null);

const languageStore = useFormOptionsStore();
const loggedUserStore = userStore();
const { opportunityOptions, setOppotunityOptions } = useOpportunity();
const userDivision = loggedUserStore.userCRM.iddivision || '03';
const userAmercado = loggedUserStore.userCRM.useDivAreaMercado || '';
const confirmDialog = ref(false);
const OpportunitiesStore = useOpportunitiesStore();

//* Computed variables
// const TypeOpportunitiesOptions = computed(() => {
//   const OpportunityTypeList =
//     languageStore.OpportunityOptions.OpportunityType.find(
//       (val) => val.div === userDivision
//     );
//   if (!!OpportunityTypeList) return OpportunityTypeList;
//   return [];
// });

//* Default Functions
const setDefaultData = (): type.CardInfoOpportunity => {
  const userAMercado = loggedUserStore.userCRM.idamercado || '';

  return {
    name: '',
    modified_user_id: '',
    created_by: '',
    description: '',
    assigned_user_id: '',
    opportunity_type: '',
    sales_stage: '',
    // currency_id:'',
    // amount: '',
    // amount_usdollar: '',
    origen_c: '',
    acuenta_de_c: '',
    campaign_id: '',
    idgrupocliente_c: '',
    iddivision_c: '',
    idamercado_c: '',
    region_c: '',
    tipofinanciamiento_c: '',
    // *********
    // account_id_c: '',
    // contact_id_c: '',

    cuce_c: '',
    prob_proyecto_c: '',
    // ------
    estado_oportunidad_c: 'EnTratamiento',
    motivo_c: '',
    date_closed: moment()
      .month(moment().month() + 1)
      .format('YYYY-MM-DD'),
    currency_id: '-99',
    amount: 0,
    currency_name: '',
    // currency_symbol: '',
  };
};

//* variables
const inputData = ref(!!props.data ? { ...props.data } : setDefaultData());

const campaignNameOptions = ref([
  {
    // label: inputData.value.campania_c || '',
    value: inputData.value.campaign_id,
  },
]);
const phases = computed(() => {
  const phases =
    opportunityOptions.value.find(
      (opp) => opp.value === inputData.value.opportunity_type
    )?.phase || [];
  // console.log('oooooooo', phases.values);
  return objectRender(phases.map((phase) => ({ ...phase, ...phase.prop })));
});

//* methods

const validateInputs = async () => {
  const validatedFields = await Promise.all([
    nameOpportunityRef.value?.validate(),
    dateClosedLeadRef.value?.validate(),
  ]);
  return validatedFields.every((field) => !!field);
};

const OpportunityInfoAddProps = ref(
  !!props.data
    ? { ...props.data }
    : ({
        id: '',
        name: '',
        modified_user_id: '',
        created_by: '',
        description: '',
        estado_oportunidad_c: '',
        assigned_user_id: '',
        opportunity_type: '',
        sales_stage: '',
        probability: '',
        date_closed: '',
        currency_id: '',
        amount: '',
        amount_usdollar: '',
        origen_c: '',
        acuenta_de_c: '',
        campaign_id: '',
        idgrupocliente_c: '',
        iddivision_c: '',
        idamercado_c: '',
        region_c: '',
        tipofinanciamiento_c: '',
        // *********
        // account_id_c: '',
        // contact_id_c: '',

        cuce_c: '',
        prob_proyecto_c: '',
      } as type.AdditionalInfoOpportunity)
);

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
  console.log('my campaign selected', item);
  campaignNameOptions.value = [
    {
      label: 'campaña prueba', //item.nombre,
      value: item.id,
    },
  ];
  inputData.value.campaign_id = item.id;
};

const getTypeOpportunitie = (idDiv: string) => {
  const data = languageStore.OpportunityOptions.OpportunityType;
  const dataFilter = data.filter(
    (x: type.OpportunitieTypePhasePercentageColor) => x.div == idDiv
  );
  return dataFilter;
};
const getPhase = (TypeValue: string) => {
  const data = listTypeOptions;
  const dataFind = data.value.find(
    (x: type.OpportunitieTypePhasePercentageColor) => x.value == TypeValue
  )?.phase;
  return dataFind;
};

const listTypeOptions = ref(getTypeOpportunitie(inputData.value.iddivision_c));
const listPhaseOptions = ref(getPhase(inputData.value.opportunity_type));

let faseActual=ref({
    phase: '',
    value_aux: '',
    Percent: '',
    color: '',
  });
//objectRender recibe array: lista de fases, string: fase actual
const objectRender = (listPhaseOptionsArray: any, sales_stage?: string) => {
  // sales_stage = !listPhaseOptionsArray.value.filter(
  //   (x: type.OpportunitieTypePhasePercentageColor) => x.value == sales_stage
  // )
  //   ? listPhaseOptionsArray.value[0].value //INCLUDE
  //   : sales_stage;

  // sales_stage =
  //   phases.value.find((phase) => phase.value === sales_stage)?.value ||
  //   phases.value[0].value;

  // sales_stage =
  //   listPhaseOptionsArray.value.find(
  //     (listPhaseOptionsArray) => listPhaseOptionsArray.value === sales_stage
  //   )?.value || listPhaseOptionsArray.value[0].value;

  // console.log(
  //   listPhaseOptionsArray,
  //   sales_stage,
  //   'yyyyyy',
  //   listPhaseOptionsArray[0].value
  // );
  // }

  let resp = [
    {
      value: '',
      label: '',
      color: '',
      prob: '',
      toolTipLabel: '',
    },
  ];
  let sw = true;
  let cont = 0;
  for (let i = 0; i < listPhaseOptionsArray.length; i++) {
    // if (!sales_stage) sales_stage = listPhaseOptionsArray[1].value;
    if (listPhaseOptionsArray[i].value != sales_stage) {
      if (sw) {
        resp[i] = {
          value: listPhaseOptionsArray[i].value,
          label: '',
          color: listPhaseOptionsArray[i].prop.percentage,
          prob: listPhaseOptionsArray[i].prop.percentage,
          toolTipLabel: listPhaseOptionsArray[i].label,
        };
      } else {
        resp[i] = {
          value: listPhaseOptionsArray[i].value,
          label: listPhaseOptionsArray[i].label,
          color: '#fff',
          prob: listPhaseOptionsArray[i].prop.percentage,
          toolTipLabel: listPhaseOptionsArray[i].label,
        };
      }
    } else {
      sw = false;
      cont = i;
      resp[i] = {
        value: listPhaseOptionsArray[i].value,
        label: listPhaseOptionsArray[i].prop.percentage,
        color: listPhaseOptionsArray[i].prop.color,
        prob: listPhaseOptionsArray[i].prop.percentage,
        toolTipLabel: listPhaseOptionsArray[i].label,
      };
      const a = listPhaseOptionsArray[i].label
      faseActual = {
        phase: listPhaseOptionsArray[i].label,
        value_aux: listPhaseOptionsArray[i].value,
        Percent: listPhaseOptionsArray[i].prop.percentage,
        color: listPhaseOptionsArray[i].prop.color,
      }
    }
    // console.log('oooooooo', listPhaseOptionsArray[i].prop.color);
  }
  for (let i = 0; i <= cont; i++) {
    resp[i].color = resp[cont].color;
  }
  // console.log('eeeeeee', resp);
  return resp;
};
const phaseRenderArray = ref(
  objectRender(listPhaseOptions.value, inputData.value.sales_stage)
);

// console.log(phaseRenderArray);
const udpateBasedInDivision = (value: string) => {
  inputData.value.name = value;
};
// let asdasda = '';
const assignOppType = (div: string) => {
  inputData.value.opportunity_type = '';
  setOppotunityOptions(div);
  // console.log(div);
  // asdasda = div;
};

const generatePhases = (oppPhase: string) => {
  // oppType = oppType == inputData.value.opportunity_type ? oppType:''
  phaseRenderArray.value = objectRender(listPhaseOptions.value, oppPhase);
};

setOppotunityOptions(inputData.value.iddivision_c);

defineExpose({
  isEditing,
  assignOppType,
  exposeData,
  udpateBasedInDivision,
  validateInputs,
});
const $q = useQuasar();

let auxConfirm = ref({
  value:'',
  label:''
});
const openConfirm = async (value_btn:type.RenderModel) => {
  auxConfirm.value.value = value_btn.value
  auxConfirm.value.label = value_btn.label
  confirmDialog.value = true
}

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
      },
      {}
    );
    emits('recordCompleted');
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
///////////// end UPDATE IN REAL TIME
</script>
<template>
  <view-card-component
    :controls="!!id"
    :initial-status="id ? 'read' : 'edit'"
    icon-name="feed"
    ref="baseCardRef"
    title="Información de la oportunidad"
    @cancel-change="restoreValues"
  >
    <template #edit>
      <!-- <pre>{{ 'ffffff' }}</pre>
      <pre>{{ opportunityOptions }}</pre> -->
      <div class="row q-col-gutter-lg">
        <q-input
          class="col-12 col-sm-9 q-pb-none"
          outlined
          ref="nameOpportunityRef"
          dense
          v-model="inputData.name"
          type="text"
          label="Nombre de la oportunidad *"
          :rules="[(val) => !!val || 'Ingrese un nombre']"
        />
        <q-select
          class="col-6 col-sm-3 q-pb-none"
          bg-color="secondary"
          outlined
          dense
          :options="languageStore.leadsOptions.gainStates"
          v-model="inputData.estado_oportunidad_c"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          type="text"
          label="Estado"
          @update:model-value="inputData.motivo_c = ''"
        />
        <q-select
          class="col-12 q-pb-none"
          outlined
          dense
          :options="opportunityOptions"
          v-model="inputData.opportunity_type"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          type="text"
          label="Tipo de oportunidad"
          @update:model-value="generatePhases"
        />

        <div class="col-12 q-pb-none">
          <q-span style="color:#1b1b28">Fase: </q-span><q-span :style="{'color':faseActual.color}">{{faseActual.phase}}</q-span>
          <q-scroll-area style="width: 100%; height: 50px; padding-top: 2px">
            <q-btn-group push spread v-if="!!phaseRenderArray.length">
              <q-btn
                dense
                v-for="i in phaseRenderArray"
                :key="i"
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
                  i.toolTipLabel + ' ' + i.prob
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
        <div class="col-12 col-sm-6">
          <AccountRelationCard
            v-model:id="OpportunityInfoAddProps.account_id_c"
            module-name="Cuenta"
            edit-mode
          />
        </div>
        <div class="col-12 col-sm-6">
          <ContactRelationCard
            class="col-12 col-sm-6"
            v-model:id="OpportunityInfoAddProps.contact_id_c"
            module-name="Contacto"
            :account-id="OpportunityInfoAddProps.account_id_c"
            edit-mode
          />
        </div>
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
        <q-input
          class="col-12 col-sm-4 q-pb-none"
          outlined
          dense
          v-model="inputData.amount"
          type="text"
          label="Monto"
        />
        <q-select
          class="col-12 col-sm-2 q-pb-none"
          outlined
          dense
          v-model="inputData.currency_id"
          :options="languageStore.leadCurrency"
          type="text"
          label="Moneda"
          option-value="id"
          option-label="abbreviated"
          emit-value
          map-options
        />
        <q-select
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="inputData.origen_c"
          :options="languageStore.OpportunityOptions.originLead"
          type="text"
          label="Origen"
          option-value="value"
          option-label="label"
          emit-value
          map-options
        />
        <q-select
          v-model="inputData.campaign_id"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          class="col-12 col-sm-6 q-pb-none"
          hide-dropdown-icon
          outlined
          dense
          label="Campaña"
        >
          <template #after>
            <q-btn
              @click="openCampaignFilter"
              color="primary"
              size="sm"
              icon="open_in_new"
              round
            />
          </template>
        </q-select>
      </div>
    </template>
    <template #read>
      <div class="row q-col-gutter-lg">
        <q-input
          class="col-12 col-sm-9 q-pb-none"
          outlined
          ref="nameOpportunityRef"
          dense
          v-model="inputData.name"
          readonly
          type="text"
          label="Nombre de la oportunidad"
          :rules="[(val) => !!val || 'Ingrese un nombre']"
        />
        <q-select
          class="col-6 col-sm-3 q-pb-none text-primary"
          bg-color="secondary"
          outlined
          dense
          :options="languageStore.leadsOptions.gainStates"
          v-model="inputData.estado_oportunidad_c"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          type="text"
          label="Estado"
          @update:model-value="inputData.motivo_c = ''"
        />
        <div class="col-12 q-pb-none">
          <q-span style="color:#1b1b28">Fase: </q-span><q-span :style="{'color':faseActual.color}">{{faseActual.phase}}</q-span>
          <q-scroll-area style="width: 100%; height: 50px; padding-top: 2px">
            <q-btn-group push spread v-if="!!phaseRenderArray.length">
              <q-btn
                dense
                v-for="i in phaseRenderArray"
                :key="i"
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
                  i.toolTipLabel + ' ' + i.prob
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
        <div class="col-12 col-sm-6">
          <AccountRelationCard
            v-model:id="OpportunityInfoAddProps.account_id_c"
            module-name="Cuenta"
          />
        </div>
        <div class="col-12 col-sm-6">
          <ContactRelationCard
            v-model:id="OpportunityInfoAddProps.contact_id_c"
            module-name="Contacto"
          />
        </div>

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
        <q-input
          class="col-12 col-sm-4 q-pb-none"
          outlined
          dense
          v-model="inputData.amount"
          readonly
          type="text"
          label="Monto"
          :rules="[(val) => !!val || 'Ingrese un monto']"
        />
        <q-select
          class="col-12 col-sm-2"
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
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="inputData.origen_c"
          :options="languageStore.OpportunityOptions.originLead"
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
          v-model="inputData.campaign_id"
          readonly
          :options="campaignNameOptions"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          class="col-12 col-sm-6"
          hide-dropdown-icon
          outlined
          dense
          label="Campaña"
        >
        </q-select>
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
        ¿Está seguro de que desea actualizar la fase de la Oportunidad a: <b>{{auxConfirm.label}}</b>?
      </span>
    </template>
  </AlertComponent>
</template>

<style lang="scss" scoped>
.input-name {
  max-width: 140px;
}
.q-field {
  font-weight: bolder;
}
// .text-ellipsis {
//   text-overflow: ellipsis;
//   overflow: hidden;
//   white-space: nowrap;
//   width: 240px; //113px;
// }
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
