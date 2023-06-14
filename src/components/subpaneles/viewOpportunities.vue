<script lang="ts">
import { defineComponent } from 'vue';
import { useQuasar, QSpinnerPuff } from 'quasar';
import OpportunityDialog from 'src/modules/Opportunities/components/Dialogs/OpportunityDialog.vue';
export default defineComponent({
  name: 'ViewOpportunities',
});
</script>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useDivAreaMercado } from 'src/composables/useLanguage';

import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { userStore } from 'src/modules/Users/store/UserStore';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
import {
  useContacts,
  useUtils,
} from 'src/modules/Accounts/composables/TabsComposables/useContacts';
import { QTableColumn } from 'quasar';
import { ContactStore } from 'src/modules/Contacts/store/ContactStore';
import { AccountStore } from 'src/modules/Accounts/store/AccountStore';
import RelacionadoOpo from 'src/components/Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoOpo.vue';
import { useQuotesStore } from 'src/modules/Quotes/store/QuotesStore';
import {
  deletedRelationBetweenModules,
  getRelationBetweenModules,
  getRecordModuleInfo,
} from 'src/services/GlobalService';
import { useOpportunity } from '../../modules/Opportunities/composables/useOppotunity/index';
import { OpportunityGlobal } from '../../modules/Opportunities/utils/types';
const { getAccountsOportunities } = AccountStore();
const { getContactsOportunities } = ContactStore();

const { propsDeleteRelationAlert } = useUtils();
const $q = useQuasar();
const props = defineProps<{
  idMod: string;
  nameMod: string;
}>();

const OpDialogRef = ref<InstanceType<typeof OpportunityDialog> | null>(null);
const advancedFilterOpo = ref<InstanceType<typeof RelacionadoOpo> | null>(null);
const deleteRelation = ref({
  data: {
    module_name: 'Accounts',
    module_id: '01010FA5-F21A-44A9-A71C-E5C67783EED8',
    type_module: 'Opportunities',
    type_id_module: '8e968df2-623e-246f-7546-61940c57f911',
  },
});
const getOpportunityDataFromDraft = ref(false);
const { show_add, cancelInsertion } = useContacts('1');

const openAlertDeletedRelationOportunityModule = (item: any) => {
  show_add.value = true;
  deleteRelation.value.data.module_name = props.nameMod;
  deleteRelation.value.data.module_id = props.idMod;
  deleteRelation.value.data.type_id_module = item.id;
};

const deleteAcept = async () => {
  //console.log(deleteRelation.value.data.module_id);
  // const response = await api.delete(
  //   `${process.env.CRM4_LB_GLOBAL}/deleted-relationships-module/${deleteRelation.value.data.module_name}/${deleteRelation.value.data.module_id}/${deleteRelation.value.data.type_module}/${deleteRelation.value.data.type_id_module}`
  // );
  relacarga.value = true;
  // ActiveSqeleton.value = false;
  await deletedRelationBetweenModules(
    deleteRelation.value.data.module_name,
    deleteRelation.value.data.module_id,
    deleteRelation.value.data.type_module,
    deleteRelation.value.data.type_id_module
  );
  if (props.nameMod == 'Accounts') {
    documentRelation.value = await getAccountsOportunities(
      props.idMod,
      userCRM.iddivision
    );
  }
  if (props.nameMod == 'Contacts') {
    documentRelation.value = await getContactsOportunities(
      props.idMod,
      userCRM.iddivision
    );
  }
  // ActiveSqeleton.value = true;
  show_add.value = false;
  relacarga.value = false;
};

const { userCRM } = userStore();
const { opportunityDraft } = useOpportunity();
//const iddivision = userCRM.iddivision;

const filter = ref('');
const listAMercado = ref([]);
const ActiveSqeleton = ref(false);
const documentRelation = ref([] as { [key: string]: string }[]);
const quotesStore = useQuotesStore();
const alertDivision = ref(false);
onMounted(async () => {
  if (userCRM.iddivision == '') {
    userCRM.iddivision = 'todas';
  }
  if (props.nameMod == 'Accounts') {
    documentRelation.value = await getAccountsOportunities(
      props.idMod,
      userCRM.iddivision
    );
  }
  if (props.nameMod == 'Contacts') {
    documentRelation.value = await getContactsOportunities(
      props.idMod,
      userCRM.iddivision
    );
  }
  listAMercado.value = await useDivAreaMercado(userCRM.iddivision);
  ActiveSqeleton.value = true;
  console.log(documentRelation.value);
});

const openDialog = async (id?: string) => {
  try {
    if (props.nameMod === 'Accounts') {
      // data from account with id
      opportunityDraft.value = {} as OpportunityGlobal;

      getOpportunityDataFromDraft.value = true;
      $q.loading.show({
        message: 'Obteniendo datos',
        spinner: QSpinnerPuff,
      });
      const account = await getRecordModuleInfo<{
        name: string;
        nit_ci_c: string;
        id: string;
        tipocuenta_c: string;
      }>('Accounts', props.idMod, {
        allData: false,
        fields: ['name', 'nit_ci_c', 'id', 'tipocuenta_c'],
      });

      if (account.tipocuenta_c === 'Privada') {
        const contacts = await getRelationBetweenModules(
          'accounts',
          props.idMod,
          'contacts'
          );
        console.log(contacts.map((value) => value.attributes.ci_c));
        console.log(account.nit_ci_c)
        const principalContact = contacts.find(
          (contact) =>
            contact.attributes.principal_c === 1 &&
            contact.attributes.ci_c === account.nit_ci_c
        );
        console.log(principalContact)
        if (!!principalContact) {
          opportunityDraft.value.contact_id_c = principalContact.id
        }
      }

      opportunityDraft.value.account_id = props.idMod;

      console.log('New account...');
    } else if (props.nameMod === 'Contacts') {
      // data from contact with id
      console.log('New contact...');
    }
    await OpDialogRef.value?.openDialogAccountTab(id ? id : '');
  } catch (error) {
    $q.notify({
      message: 'Error al obtener los datos',
    });
  } finally {
    $q.loading.hide();
  }
};

const openwindows = (id: string) => {
  //console.log(id);
  const url = link + id;
  window.open(url, '_blank');
};

const filterdocRelation = computed(() => {
  return documentRelation.value.filter(
    (objeto) =>
      objeto.name.toLowerCase().indexOf(filter.value.toLowerCase()) > -1 ||
      objeto.estado.toLowerCase().indexOf(filter.value.toLowerCase()) > -1 ||
      objeto.asignado.toLowerCase().indexOf(filter.value.toLowerCase()) > -1
  );
});

const reloadListOpp = async () => {
  if (props.nameMod == 'Accounts') {
    documentRelation.value = await getAccountsOportunities(
      props.idMod,
      userCRM.iddivision
    );
  }

  if (props.nameMod == 'Contacts') {
    documentRelation.value = await getContactsOportunities(
      props.idMod,
      userCRM.iddivision
    );
  }
};
// Filter oprtunidadades=========================================================================>
const relacarga = ref(false);
const alert = ref(false);
const infoOpor = ref();
const selectRelaOpo = async (item: any) => {
  if (props.nameMod == 'Accounts' || props.nameMod == 'Contacts') {
    if (item.iddivision_c != userCRM.iddivision) {
      alertDivision.value = true;
      return;
    }
  }
  infoOpor.value = item;
  alert.value = true;
};
const saveRelationOpo = async (item: any) => {
  relacarga.value = true;
  alert.value = false;
  advancedFilterOpo.value?.onClose();
  await quotesStore.relaModuleQuotesStore(
    props.nameMod,
    props.idMod,
    'Opportunity',
    infoOpor.value.id
  );
  await reloadListOpp();
  relacarga.value = false;
};
const openDialogOpo = async () => {
  alert.value = false;
  await advancedFilterOpo.value?.openDialog();
};

const closeAlertOpportunity = () => {
  alertDivision.value = false;
};
// ================================================================================================>

const link = HANSACRM3_URL + '/index.php?module=Opportunities&action=DetailView&record=';
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 2000,
});

const columns: QTableColumn[] = [
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
    label: 'Etapa',
    field: 'etapa',
    sortable: true,
  },
  {
    name: 'fecha_creacion',
    align: 'left',
    label: 'Fecha de creación',
    field: 'fecha_creacion',
    sortable: true,
  },
  {
    name: 'fecha_cierre',
    align: 'left',
    label: 'Fecha de cierre ',
    field: 'fecha_cierre',
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

const linkCreated =
  HANSACRM3_URL +
  '/index.php?module=Opportunities&action=EditView&account_id=' +
  props.idMod +
  '&account_name=' +
  props.nameMod;
</script>
<template>
  <q-card class="my-card" v-if="ActiveSqeleton" style="min-height: 80vh">
    <q-card-section>
      <div class="row col-12 justify-between">
        <div class="col-xl-2 col-lg-3 col-md-4 col-sm-12 col-xs-12 q-mb-sm">
          <q-input
            bottom-slots
            dense
            v-model="filter"
            placeholder="Buscar por nombre y asignado"
          >
            <template v-slot:hint>
              <span class="text-primary">
                {{
                  filterdocRelation.length == 1
                    ? filterdocRelation.length + " Oportunidad encontrada"
                    : filterdocRelation.length + " Oportunidad encontradas"
                }}
              </span>
            </template>
            <template v-slot:append>
              <q-icon name="search" v-if="!filter" />
              <q-icon name="clear" v-else @click="filter = ''" class="cursor-pointer" />
            </template>
          </q-input>
        </div>
        <div class="col-xl-4 col-lg-6 col-md-7 col-sm-12 col-xs-12 q-mb-sm">
          <div class="row justify-end q-gutter-sm">
            <slot name="buttons">
              <!-- <q-btn :class="!$q.screen.xs ? 'q-ms-md':'full-width'" color="primary" target="_blank" :href="linkCreated"
                label="Nuevo" size="md" /> -->
              <q-btn
                :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'"
                color="primary"
                @click="() => openDialog('')"
                label="Nuevo Oportunidad"
                size="md"
              />
              <q-btn
                :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'"
                color="primary"
                @click="openDialogOpo"
                label="buscar y agregar"
                size="md"
              />

              <!-- <q-btn color="primary" icon="add" class="mobile-only" /> -->
            </slot>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-md-3 q-pa-md">
        <template v-if="filterdocRelation.length > 0">
          <q-list v-if="userCRM.iddivision == 'todas'">
            <template v-for="({ cod_div, label }, index) in listAMercado" :key="cod_div">
              <!-- <template v-for="row,index in listAMercado" :key="index"> -->
              <q-expansion-item
                :label="label"
                :caption="filterdocRelation.filter((v:any) => v.iddivision === cod_div).length+' Oportunidades'"
                header-class="text-blue"
                popup
                v-if="filterdocRelation.filter((v:any) => v.iddivision === cod_div).length > 0"
              >
                <template
                  v-for="{ cod_amercado, label } in listAMercado[index].amercado"
                  :key="cod_amercado"
                >
                  <q-expansion-item
                    :label="'Area de mercado: ' + label"
                    :caption="filterdocRelation.filter((v:any) => v.idamercado === cod_amercado).length+' Oportunidades'"
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
                        >>
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
                                  props.row.estado == 'En Tratamiento'
                                    ? 'orange'
                                    : props.row.estado == 'Ganado'
                                    ? 'green'
                                    : 'red'
                                "
                                :icon="
                                  props.row.estado == 'Ganado'
                                    ? 'check'
                                    : props.row.estado == 'En Tratamiento'
                                    ? 'work_history'
                                    : 'trending_down'
                                "
                              >
                              </q-btn>
                              <!-- </a> -->
                            </q-td>
                            <q-td key="name" :props="props">
                              <q-item-label lines="5" class="text-primary">{{
                                props.row.name
                              }}</q-item-label>
                              <span
                                :class="
                                  props.row.estado == 'En Tratamiento'
                                    ? 'text-orange'
                                    : props.row.estado == 'Ganado'
                                    ? 'text-green'
                                    : 'text-red'
                                "
                                >{{ props.row.estado }}</span
                              >
                            </q-td>
                            <q-td key="etapa" :props="props" class="text-grey">
                              {{ props.row.etapa }}
                            </q-td>
                            <q-td
                              key="fecha_creacion"
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
                              key="fecha_cierre"
                              :props="props"
                              :class="
                                $q.dark.isActive
                                  ? 'text-white'
                                  : props.row.fecha_cierre == 'Sin Registrar'
                                  ? 'text-grey'
                                  : 'text-black'
                              "
                            >
                              <q-icon
                                name="event"
                                class="q-pr-xs"
                                :color="
                                  props.row.fecha_cierre == 'Sin Registrar'
                                    ? 'grey'
                                    : 'blue'
                                "
                              />
                              {{ props.row.fecha_cierre }}
                            </q-td>
                            <q-td
                              key="asignado"
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
                                  props.row.asignado == 'Sin Registrar' ? 'grey' : 'blue'
                                "
                              />
                              {{ props.row.asignado }}
                            </q-td>
                            <q-td key="monto" :props="props">
                              <q-chip color="teal" size="sm" text-color="white">
                                {{
                                  props.row.monto.toLocaleString("en-ES", {
                                    minimumFractionDigits: 2,
                                  })
                                }}
                                {{ props.row.moneda }}
                              </q-chip>
                            </q-td>
                            <q-td key="name" :props="props">
                              <!-- <q-btn size="12px" flat dense round icon="more_vert" /> -->
                              <!-- <q-btn size="12px" flat dense round icon="more_vert"
                            @click="(event:Event)=>event.stopPropagation()"> -->
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
                                      <q-item-section
                                        @click="
                                          openAlertDeletedRelationOportunityModule(
                                            props.row
                                          )
                                        "
                                        >Quitar</q-item-section
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
                        <template v-for="(row2, index) in filterdocRelation" :key="index">
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
                                <span class="text-black"> {{ row2.fecha_cierre }}</span>
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
                                    row2.monto.toLocaleString("en-ES", {
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
            <template v-for="{ cod_amercado, label } in listAMercado" :key="cod_amercado">
              <!-- <template v-for="row,index in listAMercado" :key="index"> -->
              <q-expansion-item
                :label="label"
                :caption="filterdocRelation.filter((v:any) => v.idamercado === cod_amercado).length+' Oportunidades'"
                header-class="text-blue"
                popup
                v-if="filterdocRelation.filter((v:any) => v.idamercado === cod_amercado).length > 0"
              >
                <template v-if="!$q.screen.xs ? true : false">
                  <q-table
                    :rows="filterdocRelation"
                    :columns="columns"
                    row-key="name"
                    :pagination="pagination"
                    hide-bottom
                    >>
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
                      <q-tr :props="props" v-if="cod_amercado === props.row.idamercado">
                        <q-td auto-width>
                          <!-- <a :href="link+props.row.id" target="_blank" style="text-decoration: none;"> -->
                          <q-btn
                            size="sm"
                            round
                            @click="() => openDialog(props.row.id)"
                            :color="
                              props.row.estado == 'En Tratamiento'
                                ? 'orange'
                                : props.row.estado == 'Ganado'
                                ? 'green'
                                : 'red'
                            "
                            :icon="
                              props.row.estado == 'Ganado'
                                ? 'check'
                                : props.row.estado == 'En Tratamiento'
                                ? 'work_history'
                                : 'trending_down'
                            "
                          >
                          </q-btn>
                          <!-- </a> -->
                        </q-td>
                        <q-td key="name" :props="props">
                          <q-item-label
                            @click="() => openDialog(props.row.id)"
                            lines="5"
                            class="text-bold cursor-pointer flex text-primary"
                            >{{ props.row.name }}</q-item-label
                          >
                          <span
                            :class="
                              props.row.estado == 'En Tratamiento'
                                ? 'text-orange'
                                : props.row.estado == 'Ganado'
                                ? 'text-green'
                                : 'text-red'
                            "
                            >{{ props.row.estado }}</span
                          >
                        </q-td>
                        <q-td key="etapa" :props="props" class="text-grey">
                          {{ props.row.etapa }}
                        </q-td>
                        <q-td
                          key="fecha_creacion"
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
                          key="fecha_cierre"
                          :props="props"
                          :class="
                            $q.dark.isActive
                              ? 'text-white'
                              : props.row.fecha_cierre == 'Sin Registrar'
                              ? 'text-grey'
                              : 'text-black'
                          "
                        >
                          <q-icon
                            name="event"
                            class="q-pr-xs"
                            :color="
                              props.row.fecha_cierre == 'Sin Registrar' ? 'grey' : 'blue'
                            "
                          />
                          {{ props.row.fecha_cierre }}
                        </q-td>
                        <q-td
                          key="asignado"
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
                              props.row.asignado == 'Sin Registrar' ? 'grey' : 'blue'
                            "
                          />
                          {{ props.row.asignado }}
                        </q-td>
                        <q-td key="monto" :props="props">
                          <q-chip color="teal" size="sm" text-color="white">
                            {{
                              props.row.monto.toLocaleString("en-ES", {
                                minimumFractionDigits: 2,
                              })
                            }}
                            {{ props.row.moneda }}
                          </q-chip>
                        </q-td>
                        <q-td key="name" :props="props">
                          <!-- <q-btn size="12px" flat dense round icon="more_vert" /> -->
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
                                  <q-item-section
                                    @click="
                                      openAlertDeletedRelationOportunityModule(props.row)
                                    "
                                    >Quitar</q-item-section
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
                    <template v-for="(row2, index) in filterdocRelation" :key="index">
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
                            <span class="text-black"> {{ row2.fecha_cierre }}</span>
                          </q-item-label>
                          <q-item-label
                            caption
                            lines="3"
                            v-show="!$q.screen.xs ? false : true"
                          >
                            <span class="text-weight-regular text-primary">Monto:</span>
                          </q-item-label>
                          <q-item-label
                            caption
                            lines="3"
                            v-show="!$q.screen.xs ? false : true"
                          >
                            <span class="text-black">
                              {{
                                row2.monto.toLocaleString("en-ES", {
                                  minimumFractionDigits: 2,
                                })
                              }}
                              {{ row2.moneda }}</span
                            >
                          </q-item-label>
                          <!-- <q-item-label caption lines="3" v-show="!$q.screen.xs ? false:true">
                            <q-btn size="12px" flat dense round icon="more_vert" />
                          </q-item-label> -->
                        </q-item-section>
                      </q-item>
                      <q-separator inset="item" v-if="cod_amercado === row2.idamercado" />
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
                >No se encontraron oportunidades relacionadas...</small
              >
            </div>
          </q-card>
        </template>
      </div>
      <!-- <pre>{{filterdocRelation}}</pre> -->
    </q-card-section>
    <q-inner-loading
      :showing="relacarga"
      label="Relacionando una cotización.."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </q-card>

  <q-card v-else style="height: 60vh; width: 100%">
    <q-skeleton height="100px" square class="bg-primary text-white" />
    <q-card-section>
      <q-skeleton type="QBtn" width="20%" class="text-subtitle1" />
    </q-card-section>
    <q-markup-table>
      <thead>
        <tr>
          <th class="text-left" style="width: 150px">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="n in 7" :key="n">
          <td class="text-left">
            <q-skeleton animation="blink" type="text" width="85px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="50px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="35px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="65px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="25px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="85px" />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card>

  <AlertComponent
    v-model="show_add"
    v-bind="propsDeleteRelationAlert"
    @confirm="deleteAcept"
    @denegate="cancelInsertion"
  >
    <template #body>
      <span> Esta seguro de quitar la relación? </span>
    </template>
  </AlertComponent>
  <OpportunityDialog ref="OpDialogRef" :get-draft-data="getOpportunityDataFromDraft" />
  <RelacionadoOpo
    account_id=""
    ref="advancedFilterOpo"
    @selectItem="selectRelaOpo"
    id=""
  />
  <AlertComponent
    v-model="alert"
    icon="work"
    icon-color="primary"
    icon-size="70px"
    title="Relacionar la oportunidad"
    btnColor="primary"
    btnText="Si, relacionar"
    @confirm="saveRelationOpo"
    @denegate="alert = false"
  >
    <template #body>
      <span class="text-center col-12">¿ Desea relacionar la oportunidad ? </span>

      <span class="text-center text-primary col-12">
        {{ infoOpor.nombre }}
      </span>
    </template>
  </AlertComponent>

  <AlertComponent
    v-model="alertDivision"
    icon="warning"
    icon-color="warning"
    icon-size="50px"
    title="Oportunidad "
    btnColor="negative"
    btnText="cerrar"
    @confirm="closeAlertOpportunity"
    @denegate="alert = false"
  >
    <template #body>
      <span class="text-center col-12">La Oportunidad no pertenece a la division </span>
    </template>
  </AlertComponent>
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
