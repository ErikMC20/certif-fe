<script lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useQuotesStore } from '../store/QuotesStore';
import { QTableColumn } from 'quasar';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { modeloInvoice } from '../utils/types';
import { getRecordModuleInfo } from 'src/services/GlobalService';
</script>

<script lang="ts" setup>
const { getAosQuotesGetInformationSubpanels } = useQuotesStore();
const props = withDefaults(
  defineProps<{
    id: string;
  }>(),
  {}
);

const documentRelation = ref([] as { [key: string]: string }[]);
const ActiveSqeleton = ref(false);
const filter = ref('');

const dataQuotes = ref<modeloInvoice>({} as modeloInvoice);
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 100,
});

const dataGetAccounts = ref();

onMounted(async () => {
  linkCreated.value = '';
  documentRelation.value = await getAosQuotesGetInformationSubpanels(
    'invoices',
    props.id
  );
  ActiveSqeleton.value = true;

  const fields = [
    'id',
    'iddivision_c',
    'idamercado_c',
    'idgrupocliente_c',
    'name',
    'currency_id',
    'billing_account',
    'billing_account_id',
    'billing_contact',
    'billing_contact_id',
  ];

  const options = {
    allData: false,
    fields: fields,
  };

  dataQuotes.value = await getRecordModuleInfo('Quotes', props.id, options);

  if (!!dataQuotes.value.billing_account_id) {
    const fieldsAccounts = [
      'billing_address_street',
      'billing_address_city',
      'billing_address_country',
      'billing_address_state_list_c',
      'shipping_address_street',
      'shipping_address_city',
      'shipping_address_country',
      'shipping_address_state_list_c',
    ];

    const optionsAccounts = {
      allData: false,
      fields: fieldsAccounts,
    };

    dataGetAccounts.value = await getRecordModuleInfo(
      'Accounts',
      dataQuotes.value.billing_account_id,
      optionsAccounts
    );
  }
});

const filterdocRelation = computed(() => {
  return documentRelation.value.filter(
    (objeto) =>
      objeto.name.toLowerCase().indexOf(filter.value.toLowerCase()) > -1
  );
});

const reloadInvoices = async () => {
  documentRelation.value = await getAosQuotesGetInformationSubpanels(
    'invoices',
    props.id
  );
};

const linkCreated = ref('');
const functionNewInvoiceCRM3 = () => {
  linkCreated.value =
    HANSACRM3_URL +
    `/index.php?module=AOS_Invoices&action=EditView&return_id=${
      props.id
    }&relate_to=aos_quotes_aos_invoices&relate_id=${props.id}&name=${
      dataQuotes.value.name
    }&iddivision_c=${dataQuotes.value.iddivision_c}&idamercado_c=${
      dataQuotes.value.idamercado_c
    }&idgrupocliente_c=${dataQuotes.value.idgrupocliente_c}&billing_account=${
      dataQuotes.value.billing_account
    }&billing_account_id=${
      dataQuotes.value.billing_account_id
    }&billing_contact=${dataQuotes.value.billing_contact}&billing_contact_id=${
      dataQuotes.value.billing_contact_id
    }&currency_id=${
      dataQuotes.value.currency_id
    }&billing_address_street=${functionRepalce(
      dataGetAccounts.value.billing_address_street
    )}&billing_address_city=${
      dataGetAccounts.value.billing_address_city
    }&billing_address_country=${
      dataGetAccounts.value.billing_address_country
    }&billing_address_state_list_c=${
      dataGetAccounts.value.billing_address_state_list_c
    }&shipping_address_street=${functionRepalce(
      dataGetAccounts.value.shipping_address_street
    )}&
     &shipping_address_city=${dataGetAccounts.value.shipping_address_city}&
     &shipping_address_country=${
       dataGetAccounts.value.shipping_address_country
     }&
     &shipping_address_state_list_c=${
       dataGetAccounts.value.shipping_address_state_list_c
     }&return_module=AOS_Quotes&return_action=DetailView`;
};

const functionRepalce = (address_city: string) => {
  return address_city.replace('#', 'Nro');
};

const columns: QTableColumn[] = [
  {
    name: 'number',
    align: 'left',
    label: 'Nro.',
    field: 'number',
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
    name: 'numero_pedido_c',
    align: 'left',
    label: 'Número de Pedido',
    field: 'numero_pedido_c',
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
    name: 'total_amt',
    align: 'left',
    label: 'Gran Total',
    field: 'total_amt',
    sortable: true,
  },
  {
    name: 'status',
    align: 'left',
    label: 'Estado',
    field: 'status',
    sortable: true,
  },
  {
    name: 'username',
    align: 'left',
    label: 'Usuario',
    field: 'username',
    sortable: true,
  },
];

const link =
  HANSACRM3_URL + '/index.php?module=AOS_Invoices&action=DetailView&record=';
</script>

<template>
  <!-- <pre>{{ documentRelation }}</pre> -->
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
        <div class="col-xl-4 col-lg-6 col-md-7 col-sm-12 col-xs-12 q-pa-sm">
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
                  @click="functionNewInvoiceCRM3"
                  :href="linkCreated"
                  label="Nueva Factura"
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
                <q-td key="number" :props="props">
                  {{ props.row.number }}
                </q-td>
                <q-td key="name" :props="props">
                  <a
                    :href="link + props.row.idinvoices"
                    target="_blank"
                    style="text-decoration: none"
                  >
                    <q-item-label lines="5" class="text-primary">{{
                      props.row.name
                    }}</q-item-label>
                  </a>
                </q-td>
                <q-td key="numero_pedido_c" :props="props">
                  {{ props.row.numero_pedido_c }}
                </q-td>
                <q-td key="nameaccount" :props="props">
                  {{ props.row.nameaccount }}
                </q-td>
                <q-td key="total_amt" :props="props">
                  {{ props.row.currency_id }}{{ props.row.total_amt }}
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
