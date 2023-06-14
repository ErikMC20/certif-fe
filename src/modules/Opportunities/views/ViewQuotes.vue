<script lang="ts">
import { defineComponent } from 'vue';
import ViewGeneralSkeletonSubpanel from 'src/components/Skeletons/ViewGeneralSkeletonSubpanel.vue';
import GeneralDialog from 'src/modules/Quotes/components/Dialogs/GeneralDialog.vue';
import { useBusinesses } from 'src/modules/Businesses/composables/Core/useBusinesses/index';
import moment from 'moment';
export default defineComponent({
  name: 'ViewQuotes',
});
</script>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useDivAreaMercado } from 'src/composables/useLanguage';
import { useOpportunitiesStore } from 'src/modules/Opportunities/store/OpportunitiesStore';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { userStore } from 'src/modules/Users/store/UserStore';
import { useQuotesStore } from 'src/modules/Quotes/store/QuotesStore';
import { QTableColumn } from 'quasar';
import RelacionadoQuotes from 'src/components/Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoQuotes.vue';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
import { QuotesTableStore } from 'src/modules/Quotes/store/QuotesTableStore';
import LayoutQuotes from 'src/modules/Quotes/components/Dialogs/LayoutQuotes.vue';
import SendEmailQuotes from 'src/modules/Quotes/components/Dialogs/SendEmaiQuotes/SendEmailQuotes.vue';
const { userCRM } = userStore();
const { formatAmount } = useBusinesses();
const reop = useOpportunitiesStore();
const quotesStore = useQuotesStore();
const props = defineProps<{
  id: string;
  nameModule?: string;
}>();

const quotesDialogRef = ref<InstanceType<typeof GeneralDialog> | null>(null);
const relacionadoQuotesRef = ref<InstanceType<typeof RelacionadoQuotes> | null>(
  null
);

const layoutQuotesRef = ref<InstanceType<typeof LayoutQuotes> | null>(null);

const SendEmailQuotesRef = ref<InstanceType<typeof SendEmailQuotes> | null>(
  null
);

const filter = ref('');
const listAMercado = ref([]);
const ActiveSqeleton = ref(false);
const dataRelation = ref([] as { [key: string]: string }[]);
const dataOpportunityforQuotes = <any>ref();
const getOpportunityInformation = ref();
const dialogConfirm = ref(false);
const tablequotesStore = QuotesTableStore();
const { updateStageQuotesList } = tablequotesStore;
const confirm = ref({
  id: '',
  stage: '' as any,
  nombre: '',
});
onMounted(async () => {
  if (userCRM.iddivision == '') {
    userCRM.iddivision = 'todas';
  }
  dataRelation.value = await reop.getRelations(props.id, 'aos_quotes');
  ActiveSqeleton.value = true;
  listAMercado.value = await useDivAreaMercado(userCRM.iddivision);
  getOpportunityInformation.value = await quotesStore.getModuleTypeIDPro(
    'Opportunity',
    props.id
  );
});

const openwindows = (id: string) => {
  const url = link + id;
  window.open(url, '_blank');
};

const openDialogAquotes = async (id?: string) => {
  await quotesDialogRef.value?.openDialogQuotesTab(id ? id : '');
};

const reloadQuotesOpp = async () => {
  dataRelation.value = await reop.getRelations(props.id, 'aos_quotes');
};

// quotes filter =============================================================================>
const relacarga = ref(false);
const alert = ref(false);
const infoQuotes = ref();
const alertReplaceQuotes = ref(false);
const selectRelaQuotesv2 = async (item: any) => {
  if (!!item.opportunity_id) {
    alertReplaceQuotes.value = true;
  }
  infoQuotes.value = item;
  alert.value = true;
};
const saveRelationQuotesv2 = async () => {
  relacarga.value = true;
  alert.value = false;
  relacionadoQuotesRef.value?.onClose();
  await quotesStore.relaModuleQuotesStore(
    'Opportunity',
    props.id,
    'AOS_Quotes',
    infoQuotes.value.id
  );
  await reloadQuotesOpp();
  relacarga.value = false;
};
const openFilterQuotesv2 = async () => {
  alert.value = false;
  await relacionadoQuotesRef.value?.openDialog();
};
// ==========================================================================================>
const filterdocRelation = computed(() => {
  return dataRelation.value.filter(
    (objeto) =>
      objeto.name.toLowerCase().indexOf(filter.value.toLowerCase()) > -1
  );
});

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 2000,
});

const columns: QTableColumn[] = [
  {
    name: 'numero',
    align: 'left',
    label: '#',
    field: 'numero',
    sortable: true,
  },
  {
    name: 'name',
    align: 'left',
    label: 'Nombre',
    field: 'name',
    sortable: true,
  },
  {
    name: 'etapa',
    align: 'left',
    label: 'Etapa Cotización',
    field: 'etapa',
    sortable: true,
  },
  // {
  //   name: 'faseval',
  //   align: 'left',
  //   label: 'Fase de Venta',
  //   field: 'faseval',
  //   sortable: true,
  // },
  {
    name: 'fecha_creacion',
    align: 'left',
    label: 'Fecha de creación',
    field: 'fecha_creacion',
    sortable: true,
  },
  {
    name: 'fecha_expiracion',
    align: 'left',
    label: 'Valida hasta',
    field: 'fecha_expiracion',
    sortable: true,
  },
  {
    name: 'asignado',
    align: 'left',
    label: 'Asignado a',
    field: 'asignado',
    sortable: true,
  },
  {
    name: 'monto',
    align: 'left',
    label: 'Monto',
    field: 'monto',
    sortable: true,
  },
];
const link =
  HANSACRM3_URL + '/index.php?module=AOS_Quotes&action=DetailView&record=';
// const linkCreated =
//   HANSACRM3_URL +
//   '/index.php?module=AOS_Quotes&action=EditView&account_id=' +
//   props.id +
//   '&account_name=' +
//   props.nameModule;

const createNewQuotes = async (idopportunity: string) => {
  dataOpportunityforQuotes.value = {
    idOppty: idopportunity,
    nameOppty: getOpportunityInformation.value.attributes.name,
    account_nameOppty: getOpportunityInformation.value.attributes.account_name,
    account_idOppty: getOpportunityInformation.value.attributes.account_id,
    contact_id2_cOppty: getOpportunityInformation.value.attributes.contact_id_c,
    contacto_oportunidad_cOppty:
      getOpportunityInformation.value.attributes.idcampeon_c,
    iddivision_cOppty: getOpportunityInformation.value.attributes.iddivision_c,
    idamercado_cOppty: getOpportunityInformation.value.attributes.idamercado_c,
    region_cOppty: getOpportunityInformation.value.attributes.region_c,
    currency_idOppty: getOpportunityInformation.value.attributes.currency_id,
    idgrupocliente_cOppty:
      getOpportunityInformation.value.attributes.idgrupocliente_c,
  };
  await quotesDialogRef.value?.openDialogQuotesTabOpportunity(
    '',
    dataOpportunityforQuotes.value,
    'Nueva Cotización'
  );
};
// cambiar etapa========================================================>
const cargarStage = ref(false);
const openAlert = (idE: string, estadoE: string, nomStage: string) => {
  console.log(idE, estadoE, nomStage);
  confirm.value = {
    id: idE,
    stage: estadoE,
    nombre: nomStage,
  };
  dialogConfirm.value = true;
};

const stageConfirm = async () => {
  cargarStage.value = true;
  await updateStageQuotesList(confirm.value.id, confirm.value.stage);
  cargarStage.value = false;
  dialogConfirm.value = false;
};

const stageCancel = async () => {
  dialogConfirm.value = false;
  await reloadQuotesOpp();
};
// ===========================================================>
const opciones_estado = [
  { label: 'Borrador', valueE: 'Draft' },
  { label: 'Negociación', valueE: 'Negotiation' },
  { label: 'Confirmado', valueE: 'Confirmed' },
  { label: 'Rechazada', valueE: 'Not_Approved' },
  { label: 'Anulado', valueE: 'Canceled' },
];

const seeQoutesfunction = async (item: any) => {
  await layoutQuotesRef.value?.openDialogSubPanels(
    item.id,
    item.iddivision_c,
    item.idamercado_c
  );
};
const datagest = ref();
const conver64Data = ref();
const idModuleQuotes = ref('');
const sendLayoutQuotesToEmail = async (item: any) => {
  idModuleQuotes.value = item.id;
  datagest.value = await quotesStore.getemailsTosendLayoutStore(
    item.billing_account_id,
    item.billing_contact_id
  );

  if (!!item.idamercado_c) {
    conver64Data.value = '';
    SendEmailQuotesRef.value?.openDialog(
      datagest.value,
      item.name,
      conver64Data.value,
      item.id,
      item.idamercado_c,
      item.iddivision_c
    );
  } else {
    console.log('no cuenta con area de mercado');
  }
};
</script>
<template>
  <!-- <pre>{{ filterdocRelation }}</pre> -->
  <q-card class="my-card" v-if="ActiveSqeleton" style="min-height: 80vh">
    <q-card-section>
      <div class="row col-12 justify-between">
        <div class="col-xl-2 col-lg-3 col-md-4 col-sm-12 col-xs-12 q-mb-sm">
          <q-input
            bottom-slots
            dense
            v-model="filter"
            placeholder="Buscar por nombre, estado y asignado"
          >
            <template v-slot:hint>
              <span class="text-primary">
                {{
                  filterdocRelation.length == 1
                    ? filterdocRelation.filter(
                        (v: any) => v.iddivision_c === userCRM.iddivision
                      ).length + ' Cotización encontrada'
                    : filterdocRelation.filter(
                        (v: any) => v.iddivision_c === userCRM.iddivision
                      ).length + ' Cotizaciones encontradas'
                }}
              </span>
            </template>
            <template v-slot:append>
              <q-icon name="search" v-if="!filter" />
              <q-icon
                name="clear"
                v-else
                @click="filter = ''"
                class="cursor-pointer"
              />
            </template>
          </q-input>
        </div>
        <div class="col-xl-4 col-lg-6 col-md-7 col-sm-12 col-xs-12 q-mb-sm">
          <div class="row justify-end q-gutter-sm">
            <slot name="buttons">
              <q-btn
                :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'"
                color="primary"
                target="_blank"
                label="Nueva Cotizacion"
                size="md"
                @click="createNewQuotes(props.id)"
              />
              <q-btn
                :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'"
                color="primary"
                @click="openFilterQuotesv2"
                label="Buscar y Agregar"
                size="md"
              />
            </slot>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-md-3 q-pa-md">
        <template v-if="filterdocRelation.length > 0">
          <q-list v-if="userCRM.iddivision == 'todas'">
            <template
              v-for="({ cod_div, label }, index) in listAMercado"
              :key="cod_div"
            >
              <!-- <template v-for="row,index in listAMercado" :key="index"> -->
              <q-expansion-item
                :label="label"
                :caption="filterdocRelation.filter((v:any) => v.iddivision === cod_div).length+' Cotizaciones'"
                header-class="text-blue"
                popup
                v-if="filterdocRelation.filter((v:any) => v.iddivision === cod_div).length > 0"
              >
                <template
                  v-for="{ cod_amercado, label } in listAMercado[index]
                    .amercado"
                  :key="cod_amercado"
                >
                  <q-expansion-item
                    :label="'Area de mercado: ' + label"
                    :caption="filterdocRelation.filter((v:any) => v.idamercado === cod_amercado).length+' Cotizaciones'"
                    header-class="text-red"
                    v-if="filterdocRelation.filter((v:any) => v.idamercado === cod_amercado).length > 0"
                  >
                    <template v-if="!$q.screen.xs ? true : false">
                      <q-table
                        :rows="filterdocRelation"
                        :columns="columns"
                        row-key="name"
                        :pagination="pagination"
                        hide-bottom
                      >
                        <template v-slot:header="props">
                          <q-tr :props="props">
                            <q-th auto-width />
                            <q-th
                              v-for="col in props.cols"
                              :key="col.name"
                              :props="props"
                              class="text-weight-medium"
                            >
                              {{ col.label }}
                            </q-th>
                          </q-tr>
                        </template>
                        <template v-slot:body="props">
                          <q-tr
                            :props="props"
                            v-if="cod_amercado === props.row.idamercado"
                            @click="openwindows(props.row.id)"
                          >
                            <q-td auto-width>
                              <!-- <a :href="link+props.row.id" target="_blank" style="text-decoration: none;"> -->
                              <q-btn
                                size="sm"
                                round
                                :color="
                                  props.row.estado == 'Borrador'
                                    ? 'orange'
                                    : props.row.estado == 'Confirmado'
                                    ? 'green'
                                    : 'red'
                                "
                                :icon="
                                  props.row.estado == 'Confirmado'
                                    ? 'check'
                                    : props.row.estado == 'Borrador'
                                    ? 'work_history'
                                    : 'trending_down'
                                "
                              >
                              </q-btn>
                              <!-- </a> -->
                            </q-td>
                            <q-td key="name" :props="props" class="text-blue">
                              {{ props.row.numero }}
                            </q-td>
                            <q-td key="name" :props="props">
                              <q-item-label lines="5" class="text-primary">{{
                                props.row.name
                              }}</q-item-label>
                              <span
                                :class="
                                  props.row.estado == 'Borrador'
                                    ? 'text-orange'
                                    : props.row.estado == 'Confirmado'
                                    ? 'text-green'
                                    : 'text-red'
                                "
                              >
                                {{ props.row.estado }}
                              </span>
                            </q-td>
                            <q-td key="name" :props="props" class="text-grey">
                              {{ props.row.faseval }}
                            </q-td>
                            <q-td
                              key="name"
                              :props="props"
                              :class="
                                $q.dark.isActive
                                  ? 'text-white'
                                  : props.row.fecha_creacion == 'Sin Registrar'
                                  ? 'text-grey'
                                  : 'text-black'
                              "
                            >
                              <q-icon
                                name="event"
                                class="q-pr-xs"
                                :color="
                                  props.row.fecha_creacion == 'Sin Registrar'
                                    ? 'grey'
                                    : 'blue'
                                "
                              />
                              {{ props.row.fecha_creacion }}
                            </q-td>
                            <q-td
                              key="name"
                              :props="props"
                              :class="
                                $q.dark.isActive
                                  ? 'text-white'
                                  : props.row.fecha_expiracion ==
                                    'Sin Registrar'
                                  ? 'text-grey'
                                  : 'text-black'
                              "
                            >
                              <q-icon
                                name="event"
                                class="q-pr-xs"
                                :color="
                                  props.row.fecha_expiracion == 'Sin Registrar'
                                    ? 'grey'
                                    : 'blue'
                                "
                              />
                              {{ props.row.fecha_expiracion }}
                            </q-td>
                            <q-td
                              key="name"
                              :props="props"
                              :class="
                                $q.dark.isActive
                                  ? 'text-white'
                                  : props.row.asignado == 'Sin Registrar'
                                  ? 'text-grey'
                                  : 'text-black'
                              "
                            >
                              <q-icon
                                name="person"
                                class="q-pr-xs"
                                :color="
                                  props.row.asignado == 'Sin Registrar'
                                    ? 'grey'
                                    : 'blue'
                                "
                              />
                              {{ props.row.asignado }}
                            </q-td>
                            <q-td key="name" :props="props">
                              <q-chip color="teal" size="sm" text-color="white">
                                {{
                                  props.row.monto.toLocaleString('en-ES', {
                                    minimumFractionDigits: 2,
                                  })
                                }}
                                {{ props.row.moneda }}
                              </q-chip>
                            </q-td>
                            <!-- <q-td key="name" :props="props">
                              <q-btn
                                size="12px"
                                flat
                                dense
                                round
                                icon="more_vert"
                                @click="(event:Event)=>event.stopPropagation()"
                              >
                                <q-menu>
                                  <q-list style="min-width: 100px" dense>
                                    <q-item clickable v-close-popup>
                                      <q-item-section>Quitar</q-item-section>
                                    </q-item>
                                    <q-separator />
                                  </q-list>
                                </q-menu>
                              </q-btn>
                            </q-td> -->
                          </q-tr>
                        </template>
                      </q-table>
                    </template>
                    <template v-else>
                      <q-list bordered class="rounded-borders">
                        <template
                          v-for="(row2, index) in filterdocRelation"
                          :key="index"
                        >
                          <q-item v-if="cod_amercado === row2.idamercado">
                            <q-item-section avatar>
                              <a
                                :href="link + row2.id"
                                target="_blank"
                                style="text-decoration: none"
                              >
                                <q-btn
                                  size="sm"
                                  round
                                  :color="
                                    row2.estado == 'En Tratamiento'
                                      ? 'orange'
                                      : row2.estado == 'Ganado'
                                      ? 'green'
                                      : 'red'
                                  "
                                  :icon="
                                    row2.estado == 'Ganado'
                                      ? 'check'
                                      : row2.estado == 'En Tratamiento'
                                      ? 'work_history'
                                      : 'trending_down'
                                  "
                                >
                                </q-btn>
                              </a>
                            </q-item-section>
                            <q-item-section>
                              <a
                                :href="link + row2.id"
                                target="_blank"
                                style="text-decoration: none"
                              >
                                <q-item-label lines="5" class="text-primary">{{
                                  row2.name
                                }}</q-item-label>
                              </a>
                              <span
                                :class="
                                  row2.estado == 'En Tratamiento'
                                    ? 'text-orange'
                                    : row2.estado == 'Ganado'
                                    ? 'text-green'
                                    : 'text-red'
                                "
                                >{{ row2.estado }}</span
                              >
                              <q-item-label
                                caption
                                lines="3"
                                v-show="!$q.screen.xs ? false : true"
                              >
                                <span class="text-weight-regular text-primary"
                                  >Fecha Cierre:</span
                                >
                              </q-item-label>
                              <q-item-label
                                caption
                                lines="3"
                                v-show="!$q.screen.xs ? false : true"
                              >
                                <span class="text-black">
                                  {{ row2.fecha_cierre }}</span
                                >
                              </q-item-label>
                              <q-item-label
                                caption
                                lines="3"
                                v-show="!$q.screen.xs ? false : true"
                              >
                                <span class="text-weight-regular text-primary"
                                  >Monto:</span
                                >
                              </q-item-label>
                              <q-item-label
                                caption
                                lines="3"
                                v-show="!$q.screen.xs ? false : true"
                              >
                                <span class="text-black">
                                  {{
                                    row2.monto.toLocaleString('en-ES', {
                                      minimumFractionDigits: 2,
                                    })
                                  }}
                                  {{ row2.moneda }}</span
                                >
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                          <q-separator
                            inset="item"
                            v-if="cod_amercado === row2.idamercado"
                          />
                        </template>
                      </q-list>
                    </template>
                    <q-separator />
                  </q-expansion-item>
                </template>

                <q-separator />
              </q-expansion-item>
            </template>
          </q-list>

          <q-list v-else>
            <template
              v-for="{ cod_amercado, label } in listAMercado"
              :key="cod_amercado"
            >
              <q-expansion-item
                :label="label"
                :caption="filterdocRelation.filter((v:any) => v.idamercado_c === cod_amercado).length+' Cotizaciones'"
                header-class="text-blue"
                popup
                v-if="filterdocRelation.filter((v:any) => v.idamercado_c === cod_amercado).length > 0"
              >
                <template v-if="!$q.screen.xs ? true : false">
                  <q-table
                    :rows="filterdocRelation"
                    :columns="columns"
                    row-key="name"
                    :pagination="pagination"
                    hide-bottom
                  >
                    <template v-slot:header="props">
                      <q-tr :props="props">
                        <q-th auto-width />
                        <q-th
                          v-for="col in props.cols"
                          :key="col.name"
                          :props="props"
                          class="text-weight-medium"
                        >
                          {{ col.label }}
                        </q-th>
                      </q-tr>
                    </template>
                    <template v-slot:body="props">
                      <q-tr
                        :props="props"
                        v-if="cod_amercado === props.row.idamercado_c"
                      >
                        <q-td auto-width>
                          <!-- <a :href="link+props.row.id" target="_blank" style="text-decoration: none;">   -->
                          <q-btn
                            size="sm"
                            round
                            :color="
                              props.row.stage == 'Draft'
                                ? 'orange'
                                : props.row.stage == 'Confirmed'
                                ? 'green'
                                : 'red'
                            "
                            :icon="
                              props.row.stage == 'Confirmed'
                                ? 'check'
                                : props.row.stage == 'Draft'
                                ? 'work_history'
                                : 'trending_down'
                            "
                            @click="() => openDialogAquotes(props.row.id)"
                          >
                          </q-btn>
                          <!-- </a>                  -->
                        </q-td>
                        <q-td
                          key="name"
                          :props="props"
                          class="cursor-pointer"
                          @click="() => openDialogAquotes(props.row.id)"
                        >
                          {{ props.row.number }}
                        </q-td>
                        <q-td key="name" :props="props">
                          <q-item-label lines="5" class="text-primary">
                            <a
                              class="text-bold cursor-pointer flex items-center text-primary"
                              @click="() => openDialogAquotes(props.row.id)"
                              >{{ props.row.name }}</a
                            >
                          </q-item-label>
                          <span
                            :class="
                              props.row.stage == 'Draft'
                                ? 'text-orange'
                                : props.row.stage == 'Confirmed'
                                ? 'text-green'
                                : 'text-red'
                            "
                          >
                            {{
                              props.row.stage == 'Confirmed'
                                ? 'Confirmado'
                                : props.row.stage == 'Draft'
                                ? 'Borrador'
                                : props.row.stage == 'Not_Approved'
                                ? 'Rechazada'
                                : props.row.stage
                            }}
                          </span>
                        </q-td>
                        <q-td key="name" :props="props" class="text-grey">
                          <q-select
                            v-model="props.row.stage"
                            :options="opciones_estado"
                            outlined
                            rounded
                            dense
                            options-dense
                            option-value="valueE"
                            option-label="label"
                            transition-show="flip-up"
                            transition-hide="flip-down"
                            color="primary"
                            emit-value
                            map-options
                            size="xs"
                            @update:model-value="
                              openAlert(
                                props.row.id,
                                props.row.stage,
                                props.row.name
                              )
                            "
                          >
                          </q-select>
                        </q-td>
                        <!-- <q-td key="name" :props="props" class="text-grey">
                          {{ props.row.sales_stage_c }}
                        </q-td> -->
                        <q-td
                          key="name"
                          :props="props"
                          :class="
                            $q.dark.isActive
                              ? 'text-white'
                              : props.row.date_entered == 'Sin Registrar'
                              ? 'text-grey'
                              : 'text-black'
                          "
                        >
                          <q-icon
                            name="event"
                            class="q-pr-xs"
                            :color="
                              props.row.fecha_creacion == 'Sin Registrar'
                                ? 'grey'
                                : ''
                            "
                          />
                          {{
                            moment(props.row.date_entered).format(
                              'DD-MM-YYYY HH:mm'
                            )
                          }}
                        </q-td>
                        <q-td
                          key="name"
                          :props="props"
                          :class="
                            $q.dark.isActive
                              ? 'text-white'
                              : props.row.expiration == 'Sin Registrar'
                              ? 'text-grey'
                              : 'text-black'
                          "
                        >
                          <q-icon
                            name="event"
                            class="q-pr-xs"
                            :color="
                              props.row.expiration == 'Sin Registrar'
                                ? 'grey'
                                : ''
                            "
                          />
                          {{
                            moment(props.row.expiration).format('DD-MM-YYYY')
                          }}
                        </q-td>
                        <q-td
                          key="name"
                          :props="props"
                          :class="
                            $q.dark.isActive
                              ? 'text-white'
                              : props.row.assigned_user_name == 'Sin Registrar'
                              ? 'text-grey'
                              : 'text-black'
                          "
                        >
                          <q-icon
                            name="person"
                            class="q-pr-xs"
                            :color="
                              props.row.assigned_user_name == 'Sin Registrar'
                                ? 'grey'
                                : ''
                            "
                          />
                          {{ props.row.assigned_user_name }}
                        </q-td>
                        <q-td key="name" :props="props">
                          <q-chip color="teal" size="sm" text-color="white">
                            {{ formatAmount(props.row.total_amount) }}
                            {{ props.row.currency_id == '-99' ? 'USD' : 'BOB' }}
                          </q-chip>
                        </q-td>
                        <q-td key="name" :props="props">
                          <q-btn size="12px" flat dense round icon="more_vert">
                            <q-menu>
                              <q-list style="min-width: 100px" dense>
                                <q-item
                                  clickable
                                  v-close-popup
                                  @click="seeQoutesfunction(props.row)"
                                >
                                  <q-item-section
                                    >ver Cotización</q-item-section
                                  >
                                </q-item>
                                <q-item
                                  clickable
                                  v-close-popup
                                  @click="sendLayoutQuotesToEmail(props.row)"
                                >
                                  <q-item-section
                                    >Enviar Por Correo</q-item-section
                                  >
                                </q-item>
                                <q-separator />
                              </q-list>
                            </q-menu>
                          </q-btn>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </template>
                <template v-else>
                  <q-list bordered class="rounded-borders">
                    <template
                      v-for="(row2, index) in filterdocRelation"
                      :key="index"
                    >
                      <q-item v-if="cod_amercado === row2.idamercado">
                        <q-item-section avatar>
                          <a
                            :href="link + row2.id"
                            target="_blank"
                            style="text-decoration: none"
                          >
                            <q-btn
                              size="sm"
                              round
                              :color="
                                row2.estado == 'Borrador'
                                  ? 'orange'
                                  : row2.estado == 'Confirmado'
                                  ? 'green'
                                  : 'red'
                              "
                              :icon="
                                row2.estado == 'Confirmado'
                                  ? 'check'
                                  : row2.estado == 'Borrador'
                                  ? 'work_history'
                                  : 'trending_down'
                              "
                            >
                            </q-btn
                          ></a>
                        </q-item-section>
                        <q-item-section>
                          <a
                            :href="link + row2.id"
                            target="_blank"
                            style="text-decoration: none"
                          >
                            <q-item-label lines="5" class="text-primary">{{
                              row2.name
                            }}</q-item-label>
                          </a>
                          <span
                            :class="
                              row2.estado == 'Borrador'
                                ? 'text-orange'
                                : row2.estado == 'Confirmado'
                                ? 'text-green'
                                : 'text-red'
                            "
                            >{{ row2.estado }}
                          </span>
                          <q-item-label
                            caption
                            lines="3"
                            v-show="!$q.screen.xs ? false : true"
                          >
                            <span class="text-weight-regular text-primary"
                              >Fecha Cierre:</span
                            >
                          </q-item-label>
                          <q-item-label
                            caption
                            lines="3"
                            v-show="!$q.screen.xs ? false : true"
                          >
                            <span class="text-black">
                              {{ row2.fecha_expiracion }}</span
                            >
                          </q-item-label>
                          <q-item-label
                            caption
                            lines="3"
                            v-show="!$q.screen.xs ? false : true"
                          >
                            <span class="text-weight-regular text-primary"
                              >Monto:</span
                            >
                          </q-item-label>
                          <q-item-label
                            caption
                            lines="3"
                            v-show="!$q.screen.xs ? false : true"
                          >
                            <span class="text-black">
                              {{
                                row2.monto.toLocaleString('en-ES', {
                                  minimumFractionDigits: 2,
                                })
                              }}
                              {{ row2.moneda }}</span
                            >
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-separator
                        inset="item"
                        v-if="cod_amercado === row2.idamercado"
                      />
                    </template>
                  </q-list>
                </template>

                <q-separator />
              </q-expansion-item>
            </template>
          </q-list>
        </template>
        <template v-else>
          <q-card
            style="height: 60vh; width: 100%"
            flat
            class="my-card column flex-center"
          >
            <img
              src="list-empty.png"
              alt="lista vacia"
              style="width: 220px; height: 200px"
            />
            <br /><br />
            <div class="text-h6 text-dark text-center">
              Lista vacía <br />
              <small class="text-grey-5"
                >No se encontraron cotizaciones relacionadas...</small
              >
            </div>
          </q-card>
        </template>
      </div>
      <!-- <pre>{{ filterdocRelation }}</pre> -->
    </q-card-section>
    <q-inner-loading
      :showing="relacarga"
      label="Relacionando una cotización.."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
    <q-inner-loading
      :showing="cargarStage"
      label="Cambiando el estado..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </q-card>

  <q-card v-else style="height: 60vh; width: 100%">
    <ViewGeneralSkeletonSubpanel />
  </q-card>
  <GeneralDialog ref="quotesDialogRef" @reloadQuotes="reloadQuotesOpp" />
  <RelacionadoQuotes
    account_id=""
    ref="relacionadoQuotesRef"
    @selectItem="selectRelaQuotesv2"
  />
  <AlertComponent
    v-model="alert"
    icon="request_quote"
    icon-color="primary"
    icon-size="70px"
    title="Relacionar la cotización"
    btnColor="primary"
    btnText="Si, relacionar"
    @confirm="saveRelationQuotesv2"
    @denegate="alert = false"
  >
    <template #body>
      <span class="text-center col-12"
        >¿ Desea relacionar la cotización ?
      </span>

      <span class="text-center text-primary col-12">
        {{ infoQuotes.nombre }}
      </span>
    </template>
  </AlertComponent>

  <AlertComponent
    v-model="alertReplaceQuotes"
    icon="report"
    icon-color="warning"
    icon-size="70px"
    title="La cotizacion ya cuenta con una oportunidad"
    btnColor="primary"
    btnText="Si, relacionar"
    @confirm="saveRelationQuotesv2"
    @denegate="alert = false"
  >
    <template #body>
      <span class="text-center text-primary col-12">
        La cotizacion ya cuenta con una oportunidad
      </span>
      <span class="text-center text-primary col-12">
        {{ infoQuotes.nombre }}
      </span>
      <span class="text-center col-12"
        >¿ Desea relacionar la cotización ?
      </span>
      <span class="text-center col-12"
        >Esto quitara la relación con la otra oportunidad
      </span>
    </template>
  </AlertComponent>

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
        {{ confirm.nombre }}
      </span>
    </template>
  </AlertComponent>

  <LayoutQuotes :id="''" ref="layoutQuotesRef"></LayoutQuotes>
  <SendEmailQuotes
    :guests="[]"
    module="AOS_Quotes"
    :correos="datagest"
    ref="SendEmailQuotesRef"
    :idModule="idModuleQuotes"
  />
</template>
<style lang="scss" scoped>
#mapid {
  width: 700px;
  height: 600px;
}

.q-table--no-wrap th,
.q-table--no-wrap td {
  white-space: revert;
}
</style>
