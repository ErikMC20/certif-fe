<script lang="ts">
import { CardInfoQuotes } from '../../utils/types';
import { onMounted, watch, ref, computed } from 'vue';
import { QInput } from 'quasar';
import moment from 'moment';
import { QuotationTableStore } from '../../../Quotation_model/store/QuotationTableStore';
import { useQuotesStore } from '../../store/QuotesStore';
import RelacionadoOpo from 'src/components/Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoOpo.vue';
import { userStore } from 'src/modules/Users/store/UserStore';
import RelacionadoEvents from 'src/components/Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoEvents.vue';
import { useFormOptionsStore } from 'src/stores/formOptionsStore';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
import { QuotesTableStore } from '../../store/QuotesTableStore';
</script>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    id?: string;
    dataInfoCard?: CardInfoQuotes;
    readMode?: boolean;
    datacarfinfoOpp?: any;
    dataInfocardforModule?: any;
    dataDupli2?: any;
  }>(),
  {
    readMode: false,
    dataDupli2: '',
  }
);

const dataRead = ref({} as CardInfoQuotes);
const tableStore = QuotationTableStore();
const quotesStore = useQuotesStore();
const edit = ref(false);
const bloqueado = ref(true);
const isEditing = ref(props.readMode);
const listDivision = ref();
const listMercado = ref();
const listGrupClient = ref();
const getGroupclient = ref();
const idopportunity = ref();
const advancedFilterOpo = ref<InstanceType<typeof RelacionadoOpo> | null>(null);
const advancedFilterEvents = ref<InstanceType<typeof RelacionadoEvents> | null>(
  null
);
const loggedUserStore = userStore();
const subjectInputRef = ref<InstanceType<typeof QInput> | null>(null);
const subjectInputDayRef = ref<InstanceType<typeof QInput> | null>(null);
const languageStore = useFormOptionsStore();
const dialogConfirm = ref(false);
const tablequotesStore = QuotesTableStore();
const { updateStageQuotesList } = tablequotesStore;
const confirm = ref({
  id: '',
  stage: '' as any,
});

const regionesOptions = computed(() => {
  return languageStore.leadsOptions.regions
    .map((region) => region.regiones)
    .flat();
});

const optionsState = [
  { label: 'Borrador', value: 'Draft', slot: 'Draft' },
  { label: 'Negociación', value: 'Negotiation', slot: 'Negotiation' },
  { label: 'Confirmado', value: 'Confirmed', slot: 'Confirmed' },
  { label: 'Rechazado', value: 'Not_Approved', slot: 'Not_Approved' },
  { label: 'Anulado', value: 'Canceled', slot: 'Canceled' },
];

type Mercado = {
  id: string;
};

type DayExpired = {
  dayexpiration: number;
  idamercados: Mercado[];
};

const dayexpired: DayExpired[] = [
  {
    dayexpiration: 10,
    idamercados: [{ id: '03_01' }],
  },
  {
    dayexpiration: 10,
    idamercados: [
      { id: '03_02' },
      { id: '03_03' },
      { id: '03_04' },
      { id: '03_05' },
      { id: '03_06' },
      { id: '03_07' },
      { id: '03_08' },
      { id: '03_09' },
      { id: '03_10' },
      { id: '03_11' },
      { id: '03_12' },
      { id: '' },
    ],
  },
];

const mercado = ref(
  dayexpired.find((d) =>
    d.idamercados.some((m) => m.id === loggedUserStore.userCRM.idamercado)
  )
);

const editList = () => {
  edit.value = true;
  bloqueado.value = false;
  isEditing.value = true;
};

const cancelEdit = () => {
  edit.value = false;
  bloqueado.value = true;
  isEditing.value = false;
};

const selectRelaOpo = (item: any) => {
  dataRead.value.opportunity = String(item.nombre);
  dataRead.value.opportunity_id = String(item.id);
  emits('idAccount', { idopportuniti: item.id });

  advancedFilterOpo.value?.onClose();
};
const openDialogOpo = () => {
  advancedFilterOpo.value?.openDialog();
};
const clearOpo = () => {
  dataRead.value.opportunity = '';
  dataRead.value.opportunity_id = '';
};

const selectRelaEvent = (item: any) => {
  dataRead.value.events_c = String(item.name);
  dataRead.value.fp_events_id_c = String(item.id);
  advancedFilterEvents.value?.onClose();
};
const openDialogEvent = () => {
  advancedFilterEvents.value?.openDialog();
};
const clearEvent = () => {
  dataRead.value.events_c = '';
  dataRead.value.fp_events_id_c = '';
};

const updatedataamercado = async () => {
  listMercado.value = await tableStore.getAreaMercaLead(
    String(dataRead.value.iddivision_c)
  );

  getGroupclient.value = await quotesStore.getListGrupClientebyDivisionStore(
    String(dataRead.value.iddivision_c)
  );

  if (edit.value) {
    dataRead.value.idamercado_c = listMercado.value[0].cod_amercado;
    dataRead.value.idgrupocliente_c = getGroupclient.value.grupo[0].value;
    listGrupClient.value = getGroupclient.value.grupo;
  }
  if (!props.id) {
    dataRead.value.idamercado_c = listMercado.value[0].cod_amercado;
    dataRead.value.idgrupocliente_c = getGroupclient.value.grupo[0].value;
    listGrupClient.value = getGroupclient.value.grupo;
  }
};

watch(
  () => dataRead.value.limite_fecha_c,
  async () => {
    if (edit.value) {
      dataRead.value.expiration = props.dataInfoCard?.limite_fecha_c;
      dataRead.value.expiration = moment(dataRead.value.expiration)
        .add(Number(dataRead.value.limite_fecha_c), 'd')
        .format('YYYY-MM-DD');
    }
    if (!props.id) {
      dataRead.value.expiration = moment(dataRead.value.emision_c)
        .add(Number(dataRead.value.limite_fecha_c), 'd')
        .format('YYYY-MM-DD');
    }
  }
);

const updatedateexpiration = () => {
  if (edit.value) {
    dataRead.value.expiration = moment(dataRead.value.emision_c)
      .add(Number(dataRead.value.limite_fecha_c), 'd')
      .format('YYYY-MM-DD');
  }
  if (!props.id) {
    dataRead.value.expiration = moment(dataRead.value.emision_c)
      .add(Number(dataRead.value.limite_fecha_c), 'd')
      .format('YYYY-MM-DD');
  }
};

onMounted(async () => {
  listDivision.value = await tableStore.getDivisionLead();
  listMercado.value = await tableStore.getAreaMercaLead(
    loggedUserStore.userCRM.iddivision
  );
  if (!!props.datacarfinfoOpp) {
    listMercado.value = await tableStore.getAreaMercaLead(
      props.datacarfinfoOpp.iddivision_cOppty
    );
  }

  if (!!props.id) {
    // isEditing.value = false;
    listMercado.value = await tableStore.getAreaMercaLead(
      String(props.dataInfoCard?.iddivision_c)
    );

    if (!!props.dataInfoCard?.iddivision_c) {
      getGroupclient.value =
        await quotesStore.getListGrupClientebyDivisionStore(
          String(props.dataInfoCard?.iddivision_c)
        );
      listGrupClient.value = getGroupclient.value.grupo;
    }
    confirm.value = {
      id: props.id,
      stage: props.dataInfoCard?.stage,
    };
    dataRead.value = {
      stage: props.dataInfoCard?.stage,
      name: props.dataInfoCard?.name,
      emision_c: moment(props.dataInfoCard?.emision_c).format('YYYY-MM-DD'),
      limite_fecha_c: props.dataInfoCard?.limite_fecha_c,
      expiration: moment(props.dataInfoCard?.expiration).format('YYYY-MM-DD'),
      iddivision_c: props.dataInfoCard?.iddivision_c,
      idamercado_c: props.dataInfoCard?.idamercado_c,
      region_c: props.dataInfoCard?.region_c,
      idgrupocliente_c: props.dataInfoCard?.idgrupocliente_c,
      opportunity_id: props.dataInfoCard?.opportunity_id,
      opportunity: props.dataInfoCard?.opportunity,
      fp_events_id_c: props.dataInfoCard?.fp_events_id_c,
      events_c: props.dataInfoCard?.events_c,
      description: props.dataInfoCard?.description,
    };
  } else {
    isEditing.value = true;
    getGroupclient.value = await quotesStore.getListGrupClientebyDivisionStore(
      String(loggedUserStore.userCRM.iddivision)
    );
    listGrupClient.value = getGroupclient.value.grupo;

    if (!!props.datacarfinfoOpp) {
      if (!!props.datacarfinfoOpp.iddivision_cOppty) {
        getGroupclient.value =
          await quotesStore.getListGrupClientebyDivisionStore(
            String(props.datacarfinfoOpp.iddivision_cOppty)
          );

        listGrupClient.value = getGroupclient.value.grupo;
      }

      dataRead.value = {
        stage: 'Draft',
        name: props.datacarfinfoOpp.nameOppty,
        emision_c: moment().format('YYYY-MM-DD'),
        limite_fecha_c: String(mercado.value?.dayexpiration),
        expiration: moment()
          .add(mercado.value?.dayexpiration, 'd')
          .format('YYYY-MM-DD'),
        iddivision_c: props.datacarfinfoOpp.iddivision_cOppty,
        idamercado_c: props.datacarfinfoOpp.idamercado_cOppty,
        region_c: props.datacarfinfoOpp.region_cOppty,
        idgrupocliente_c: props.datacarfinfoOpp.idgrupocliente_cOppty,
        opportunity_id: props.datacarfinfoOpp.idOppty,
        opportunity: props.datacarfinfoOpp.nameOppty,
        fp_events_id_c: '',
        events_c: '',
        description: '',
      };
    }

    if (!!props.dataInfocardforModule) {
      dataRead.value = {
        stage: 'Draft',
        name: props.dataInfocardforModule.name,
        emision_c: moment().format('YYYY-MM-DD'),
        limite_fecha_c: String(mercado.value?.dayexpiration),
        expiration: moment()
          .add(mercado.value?.dayexpiration, 'd')
          .format('YYYY-MM-DD'),
        iddivision_c: loggedUserStore.userCRM.iddivision,
        idamercado_c: loggedUserStore.userCRM.idamercado,
        region_c: '',
        idgrupocliente_c: '',
        opportunity_id: '',
        opportunity: '',
        fp_events_id_c: '',
        events_c: '',
        description: '',
      };
    }

    if (!props.datacarfinfoOpp && !props.dataInfocardforModule) {
      dataRead.value = {
        stage: 'Draft',
        name: undefined,
        emision_c: moment().format('YYYY-MM-DD'),
        limite_fecha_c: String(mercado.value?.dayexpiration),
        expiration: moment()
          .add(mercado.value?.dayexpiration, 'd')
          .format('YYYY-MM-DD'),
        iddivision_c: loggedUserStore.userCRM.iddivision,
        idamercado_c: loggedUserStore.userCRM.idamercado,
        region_c: '',
        idgrupocliente_c: '',
        opportunity_id: '',
        opportunity: '',
        fp_events_id_c: '',
        events_c: '',
        description: '',
      };
    }
  }
  if (props.dataDupli2 != '') {
    // console.log(props.dataDupli2);
    dataRead.value = {
      stage: props.dataDupli2.stage,
      name: props.dataDupli2.name,
      emision_c: props.dataDupli2.emision_c,
      limite_fecha_c: props.dataDupli2.limite_fecha_c,
      expiration: props.dataDupli2.expiration,
      iddivision_c: props.dataDupli2.iddivision_c,
      idamercado_c: props.dataDupli2.idamercado_c,
      region_c: props.dataDupli2.region_c,
      idgrupocliente_c: props.dataDupli2.idgrupocliente_c,
      opportunity_id: props.dataDupli2.opportunity_id,
      opportunity: props.dataDupli2.opportunity,
      fp_events_id_c: props.dataDupli2.fp_events_id_c,
      events_c: props.dataDupli2.events_c,
      description: props.dataDupli2.description,
    };
  }
});
watch(
  () => props.id,
  async () => {
    if (props.id != '') {
      isEditing.value = false;
    }
  }
);
watch(
  () => props.readMode,
  async () => {
    isEditing.value = props.readMode;
  },
  { deep: true }
);
// cambiar etapa========================================================>
const cambioStage = ref();
const openAlert = (stado: string) => {
  dialogConfirm.value = true;
  cambioStage.value = stado;
};

const stageConfirm = async () => {
  emits('cambioStage', dialogConfirm.value);
  await updateStageQuotesList(confirm.value.id, cambioStage.value);
  dialogConfirm.value = false;
  emits('cambioStage', dialogConfirm.value);
};

const stageCancel = () => {
  dialogConfirm.value = false;
  dataRead.value.stage = confirm.value.stage;
};
// ===========================================================>

const rulesInput = async (): Promise<boolean | undefined> => {
  return (
    await Promise.all([
      subjectInputRef.value?.validate(),
      subjectInputDayRef.value?.validate(),
    ])
  ).every((input) => !!input);
};

const emits = defineEmits<{
  (event: 'idAccount', localIdValue: any): void;
  (event: 'cambioStage', item: boolean): void;
}>();

const exposeData = () => {
  return dataRead.value;
};

defineExpose({
  rulesInput,
  exposeData,
  isEditing,
});
</script>

<template>
  <!-- <pre>{{ dataRead }}</pre> -->

  <q-card class="my-card">
    <q-card-section class="row justify-between">
      <span>
        <q-icon name="widgets" size="sm" color="primary" /> Información de la
        cotización
      </span>
      <div v-if="!!props.id">
        <q-btn
          size="10px"
          flat
          dense
          icon="mode_edit"
          class="float-right"
          :color="!$q.dark.isActive ? 'grey-8' : 'white'"
          @click="editList"
          v-if="!edit"
        >
          <q-tooltip>Editar</q-tooltip>
        </q-btn>
        <q-btn
          v-else
          size="10px"
          flat
          dense
          icon="cancel"
          class="float-right"
          :color="!$q.dark.isActive ? 'grey-8' : 'white'"
          @click="cancelEdit"
        >
          <q-tooltip>Cancelar</q-tooltip>
        </q-btn>
      </div>
    </q-card-section>
    <q-separator></q-separator>
    <!-- <pre>idquotes{{ props.id }}</pre> -->
    <!-- <pre>editando---{{ isEditing }}</pre> -->
    <div v-if="!!props.id">
      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-xs-12">
            <q-btn-toggle
              v-model="dataRead.stage"
              push
              rounded
              class="responsive-toggle"
              toggle-color="primary"
              :options="optionsState"
              size="sm"
              padding="sm lg"
              @update:model-value="openAlert"
            >
            </q-btn-toggle>
          </div>
          <div class="col-xs-12">
            <q-input
              v-model="dataRead.name"
              type="text"
              label="Título de la Cotización"
              outlined
              dense
              color="primary"
              ref="subjectInputRef"
              :rules="[(val) => !!val || 'El campo es requerido']"
              :readonly="bloqueado"
            >
            </q-input>
          </div>
          <div class="col-md-5 col-xs-12">
            <q-input
              v-model="dataRead.emision_c"
              @update:model-value="updatedateexpiration"
              type="date"
              label="Fecha Emisión"
              outlined
              dense
              color="primary"
              :readonly="bloqueado"
            >
            </q-input>
          </div>
          <div class="col-md-2 col-xs-12">
            <q-input
              v-model="dataRead.limite_fecha_c"
              type="text"
              label="Días de Validez"
              outlined
              dense
              color="primary"
              :readonly="bloqueado"
              ref="subjectInputDayRef"
              :rules="[(val) => !!val || 'El campo es requerido']"
            >
            </q-input>
          </div>
          <div class="col-md-5 col-xs-12">
            <q-input
              v-model="dataRead.expiration"
              type="date"
              label="Fecha de Validez"
              outlined
              dense
              color="primary"
              :readonly="bloqueado"
            >
            </q-input>
          </div>

          <div class="col-md-6 col-xs-12">
            <q-select
              v-model="dataRead.iddivision_c"
              :options="listDivision"
              label="División"
              outlined
              dense
              options-dense
              emit-value
              map-options
              option-value="cod_div"
              option-label="label"
              transition-show="flip-up"
              transition-hide="flip-down"
              color="primary"
              :readonly="bloqueado"
              @update:model-value="updatedataamercado"
            >
            </q-select>
          </div>

          <div class="col-md-6 col-xs-12">
            <q-select
              v-model="dataRead.idamercado_c"
              :options="listMercado"
              label="Area de Mercado"
              outlined
              dense
              options-dense
              emit-value
              map-options
              option-value="cod_amercado"
              option-label="label"
              transition-show="flip-up"
              transition-hide="flip-down"
              color="primary"
              :readonly="bloqueado"
            >
            </q-select>
          </div>

          <div class="col-md-6 col-xs-12">
            <q-select
              v-model="dataRead.idgrupocliente_c"
              :options="listGrupClient"
              label="Grupo Cliente"
              outlined
              dense
              options-dense
              emit-value
              map-options
              option-value="value"
              option-label="label"
              transition-show="flip-up"
              transition-hide="flip-down"
              color="primary"
              :readonly="bloqueado"
            >
            </q-select>
          </div>

          <div class="col-md-6 col-xs-12">
            <q-select
              v-model="dataRead.region_c"
              :options="regionesOptions"
              label="Regional"
              outlined
              dense
              options-dense
              emit-value
              map-options
              option-value="cod_region"
              option-label="label"
              transition-show="flip-up"
              transition-hide="flip-down"
              color="primary"
              :readonly="bloqueado"
            >
            </q-select>
          </div>

          <div class="col-md-6 col-xs-12">
            <q-input
              outlined
              v-model="dataRead.opportunity"
              label="Oportunidades"
              class="col-md-6 col-sm-12"
              :readonly="bloqueado"
              dense
              label-slot
            >
              <template v-slot:prepend>
                <q-avatar>
                  <q-icon name="work" size="sm" />
                </q-avatar>
              </template>
              <template v-slot:after>
                <q-btn
                  dense
                  outline
                  icon="north_west"
                  color="primary"
                  @click="openDialogOpo"
                  :disable="bloqueado"
                />
                <q-btn
                  dense
                  outline
                  icon="close"
                  color="negative"
                  @click="clearOpo"
                  :disable="bloqueado"
                />
              </template>
            </q-input>
          </div>

          <div class="col-md-6 col-xs-12">
            <q-input
              v-model="dataRead.events_c"
              type="text"
              label="Evento"
              outlined
              dense
              color="primary"
              :readonly="bloqueado"
            >
              <template v-slot:prepend>
                <q-avatar>
                  <q-icon name="event" size="sm" />
                </q-avatar>
              </template>
              <template v-slot:after>
                <q-btn
                  dense
                  outline
                  icon="north_west"
                  color="primary"
                  @click="openDialogEvent"
                  :disable="bloqueado"
                />
                <q-btn
                  dense
                  outline
                  icon="close"
                  color="negative"
                  @click="clearEvent"
                  :disable="bloqueado"
                />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
      <!-- <pre>arriba{{ dataRead }}</pre> -->
    </div>
    <div v-else>
      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-xs-12">
            <q-btn-toggle
              v-model="dataRead.stage"
              push
              rounded
              class="responsive-toggle"
              toggle-color="primary"
              :options="optionsState"
              size="sm"
              padding="sm lg"
            >
            </q-btn-toggle>
          </div>
          <div class="col-xs-12">
            <q-input
              v-model="dataRead.name"
              type="text"
              label="Título de la Cotización"
              outlined
              dense
              color="primary"
              ref="subjectInputRef"
              :rules="[(val) => !!val || 'El campo es requerido']"
            >
            </q-input>
          </div>
          <div class="col-md-5 col-xs-12">
            <q-input
              v-model="dataRead.emision_c"
              @update:model-value="updatedateexpiration"
              type="date"
              label="Fecha Emisión"
              outlined
              dense
              color="primary"
            >
            </q-input>
          </div>
          <div class="col-md-2 col-xs-12">
            <q-input
              v-model="dataRead.limite_fecha_c"
              type="text"
              label="Días de Validez"
              outlined
              dense
              color="primary"
              ref="subjectInputDayRef"
              :rules="[(val) => !!val || 'El campo es requerido']"
            >
            </q-input>
          </div>
          <div class="col-md-5 col-xs-12">
            <q-input
              v-model="dataRead.expiration"
              type="date"
              label="Fecha de Validez"
              outlined
              dense
              color="primary"
              :readonly="bloqueado"
            >
            </q-input>
          </div>

          <div class="col-md-6 col-xs-12">
            <q-select
              v-model="dataRead.iddivision_c"
              :options="listDivision"
              label="División"
              outlined
              dense
              options-dense
              emit-value
              map-options
              option-value="cod_div"
              option-label="label"
              transition-show="flip-up"
              transition-hide="flip-down"
              color="primary"
              @update:model-value="updatedataamercado"
            >
            </q-select>
          </div>

          <div class="col-md-6 col-xs-12">
            <q-select
              v-model="dataRead.idamercado_c"
              :options="listMercado"
              label="Area de Mercado"
              outlined
              dense
              options-dense
              emit-value
              map-options
              option-value="cod_amercado"
              option-label="label"
              transition-show="flip-up"
              transition-hide="flip-down"
              color="primary"
            >
            </q-select>
          </div>

          <div class="col-md-6 col-xs-12">
            <q-select
              v-model="dataRead.idgrupocliente_c"
              :options="listGrupClient"
              label="Grupo Cliente"
              outlined
              dense
              options-dense
              emit-value
              map-options
              option-value="value"
              option-label="label"
              transition-show="flip-up"
              transition-hide="flip-down"
              color="primary"
            >
            </q-select>
          </div>

          <div class="col-md-6 col-xs-12">
            <q-select
              v-model="dataRead.region_c"
              :options="regionesOptions"
              label="Regional"
              outlined
              dense
              options-dense
              emit-value
              map-options
              option-value="cod_region"
              option-label="label"
              transition-show="flip-up"
              transition-hide="flip-down"
              color="primary"
            >
            </q-select>
          </div>

          <div class="col-md-6 col-xs-12">
            <q-input
              outlined
              v-model="dataRead.opportunity"
              label="Oportunidades"
              class="col-md-6 col-sm-12"
              dense
              label-slot
              readonly
            >
              <template v-slot:prepend>
                <q-avatar>
                  <q-icon name="work" size="sm" />
                </q-avatar>
              </template>
              <template v-slot:after>
                <q-btn
                  dense
                  outline
                  icon="north_west"
                  color="primary"
                  @click="openDialogOpo"
                />
                <q-btn
                  dense
                  outline
                  icon="close"
                  color="negative"
                  @click="clearOpo"
                />
              </template>
            </q-input>
          </div>

          <div class="col-md-6 col-xs-12">
            <q-input
              v-model="dataRead.events_c"
              type="text"
              label="Evento"
              outlined
              dense
              color="primary"
              readonly
            >
              <template v-slot:prepend>
                <q-avatar>
                  <q-icon name="event" size="sm" />
                </q-avatar>
              </template>
              <template v-slot:after>
                <q-btn
                  dense
                  outline
                  icon="north_west"
                  color="primary"
                  @click="openDialogEvent"
                />
                <q-btn
                  dense
                  outline
                  icon="close"
                  color="negative"
                  @click="clearEvent"
                />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
      <!-- <pre>abajo{{ dataRead }}</pre> -->
    </div>
    <q-separator inset />
  </q-card>

  <RelacionadoOpo
    account_id=""
    ref="advancedFilterOpo"
    @selectItem="selectRelaOpo"
  />

  <RelacionadoEvents
    account_id=""
    ref="advancedFilterEvents"
    @selectItem="selectRelaEvent"
  />
  <AlertComponent
    v-model="dialogConfirm"
    icon="request_quote"
    icon-color="teal"
    icon-size="70px"
    title="Actualizar etapa"
    btnColor="teal"
    btnText="Si, actualizar etapa"
    @confirm="stageConfirm"
    @denegate="stageCancel"
  >
    <template #body>
      <span class="text-center col-12"
        >¿ Desesa cambiar la etapa de cotización ?
      </span>

      <span class="text-center text-teal col-12">
        {{ 'Cambiar a' + dataRead.stage }}
      </span>
    </template>
  </AlertComponent>
</template>

<style lang="scss" scoped>
.responsive-toggle {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.responsive-toggle .q-btn {
  width: 100%;
  max-width: 150px; /* ajusta el valor según tu diseño */
  margin: 5px;
}
</style>
