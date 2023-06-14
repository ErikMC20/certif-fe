<script lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useQuotesStore } from '../store/QuotesStore';
import { QTableColumn } from 'quasar';
import { HANSACRM3_URL } from 'src/conections/api_conectors';

import { getRecordModuleInfo } from 'src/services/GlobalService';
import { modeloContrat } from '../utils/types';
</script>
<script setup lang="ts">
const { getAosQuotesGetInformationSubpanels } = useQuotesStore();
const props = defineProps<{
  id: string;
}>();

const documentRelation = ref([] as { [key: string]: string }[]);
const ActiveSqeleton = ref(false);
const filter = ref('');

const dataQuotes = ref<modeloContrat>({} as modeloContrat);

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 100,
});

onMounted(async () => {
  documentRelation.value = await getAosQuotesGetInformationSubpanels(
    'contracts',
    props.id
  );
  ActiveSqeleton.value = true;

  const fields = [
    'iddivision_c',
    'idamercado_c',
    'region_c',
    'idgrupocliente_c',
    'name',
    'currency_id',
    'total_amount',
  ];

  const options = {
    allData: false,
    fields: fields,
  };

  dataQuotes.value = await getRecordModuleInfo('Quotes', props.id, options);
});

const filterdocRelation = computed(() => {
  return documentRelation.value.filter(
    (objeto) =>
      objeto.name.toLowerCase().indexOf(filter.value.toLowerCase()) > -1
  );
});

const columns: QTableColumn[] = [
  {
    name: 'name',
    align: 'left',
    label: 'Título del Contrato',
    field: 'name',
    sortable: true,
  },
  {
    name: 'nameaccount',
    align: 'left',
    label: 'Cuenta',
    field: 'nameaccount',
    sortable: true,
  },
  {
    name: 'total_contract_value',
    align: 'left',
    label: 'Valor de Contrato',
    field: 'total_contract_value',
    sortable: true,
  },
  {
    name: 'status',
    align: 'left',
    label: 'Estado de Contrato',
    field: 'status',
    sortable: true,
  },
  {
    name: 'username',
    align: 'left',
    label: 'Administrador de Contratos',
    field: 'username',
    sortable: true,
  },
];

const reloadInvoices = async () => {
  documentRelation.value = await getAosQuotesGetInformationSubpanels(
    'contracts',
    props.id
  );
};

const openwindows = (id: string) => {
  //console.log(id);
  const url = link + id;
  window.open(url, '_blank');
};

const linkCreated = ref('');
const functionNewContractCRM3 = () => {
  linkCreated.value =
    HANSACRM3_URL +
    `/index.php?module=AOS_Contracts&action=EditView&iddivision_c=${dataQuotes.value.iddivision_c}&idamercado_c=${dataQuotes.value.idamercado_c}&region_c=${dataQuotes.value.region_c}&idgrupocliente_c=${dataQuotes.value.idgrupocliente_c}&name=${dataQuotes.value.name}&currency_id=${dataQuotes.value.currency_id}&total_contract_value=${dataQuotes.value.total_amount}&relate_id=${dataQuotes.value.id}&return_id=${dataQuotes.value.id}&relate_to=aos_quotes_aos_contracts&return_module=AOS_Quotes&return_action=DetailView`;
};

const link =
  HANSACRM3_URL + '/index.php?module=AOS_Contracts&action=DetailView&record=';
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
            placeholder="Buscar por nombre"
          >
            <template v-slot:hint>
              <span class="text-primary"
                >{{
                  filterdocRelation.length == 1
                    ? filterdocRelation.length + ' Contrato encontrada'
                    : filterdocRelation.length + ' Contratos encontradas'
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
          <div class="row justify-end q-gutter-md">
            <slot name="buttons">
              <q-btn
                icon="update"
                :color="$q.dark.isActive ? 'grey-3' : 'primary'"
                dense
                flat
                @click="reloadInvoices"
                :label="`${$q.screen.xs ? '' : ''}`"
              />
              <div class="q-gutter-xs">
                <q-btn
                  :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'"
                  color="primary"
                  target="_blank"
                  @click="functionNewContractCRM3()"
                  :href="linkCreated"
                  label="Nuevo Contrato"
                  size="md"
                />

                <!-- <q-btn
                  :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'"
                  color="primary"
                  @click="$emit('openDialog')"
                  label="Seleccionar"
                  size="md"
                /> -->
              </div>
            </slot>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-md-3 q-pa-md">
        <template v-if="documentRelation.length > 0">
          <q-table
            :flat="!$q.screen.xs ? true : false"
            :grid="$q.screen.xs"
            :rows="documentRelation"
            :columns="columns"
            row-key="name"
            :pagination="pagination"
            hide-bottom
          >
            <template v-slot:body="props">
              <q-tr>
                <q-td key="name" :props="props">
                  <a
                    :href="link + props.row.idcontract"
                    target="_blank"
                    style="text-decoration: none"
                  >
                    <q-item-label lines="5" class="text-primary">{{
                      props.row.name
                    }}</q-item-label>
                  </a>
                </q-td>
                <q-td key="nameaccount" :props="props">
                  {{ props.row.nameaccount }}
                </q-td>
                <q-td key="total_contract_value" :props="props">
                  {{ props.row.total_contract_value }}
                </q-td>
                <q-td key="status" :props="props">
                  {{ props.row.status }}
                </q-td>
                <q-td key="username" :props="props">
                  {{ props.row.username }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
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
                >No se encontraron entregas relacionadas...</small
              >
            </div>
          </q-card>
        </template>
      </div>
    </q-card-section>
  </q-card>
  <q-card v-else style="height: 60vh; width: 100%"> </q-card>
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
