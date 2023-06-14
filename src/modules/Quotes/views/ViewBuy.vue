<script lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useQuotesStore } from '../store/QuotesStore';
import { QTableColumn } from 'quasar';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { getRecordModuleInfo } from 'src/services/GlobalService';
import { modeloOrderBuy } from '../utils/types';
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
const dataQuotes = ref<modeloOrderBuy>({} as modeloOrderBuy);

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 100,
});

onMounted(async () => {
  documentRelation.value = await getAosQuotesGetInformationSubpanels(
    'ordencompra',
    props.id
  );
  ActiveSqeleton.value = true;

  const fields = ['name'];

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
    name: 'hani_ordencompra_number',
    align: 'left',
    label: 'Nro.',
    field: 'hani_ordencompra_number',
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
    name: 'nameaccount',
    align: 'left',
    label: 'Cuenta',
    field: 'nameaccount',
    sortable: true,
  },
  {
    name: 'total_amount',
    align: 'left',
    label: 'Gran Total',
    field: 'total_amount',
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
  HANSACRM3_URL +
  '/index.php?module=HANI_OrdenCompra&action=DetailView&record=';

const reloadOrderBuy = async () => {
  documentRelation.value = await getAosQuotesGetInformationSubpanels(
    'ordencompra',
    props.id
  );
};

const linkCreated = ref('');
const functionNewOrderBuyCRM3 = () => {
  linkCreated.value =
    HANSACRM3_URL +
    `/index.php?module=HANI_OrdenCompra&action=EditView&name=${dataQuotes.value.name}&return_module=AOS_Quotes&return_action=DetailView&return_id=${props.id}&relate_id=${props.id}&relate_to=hani_ordencompra_aos_quotes`;
};
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
        <div class="col-xl-4 col-lg-6 col-md-7 col-sm-12 col-xs-12 q-mb-sm">
          <div class="row justify-end q-gutter-md">
            <slot name="buttons">
              <q-btn
                icon="update"
                :color="$q.dark.isActive ? 'grey-3' : 'primary'"
                dense
                flat
                @click="reloadOrderBuy"
                :label="`${$q.screen.xs ? '' : ''}`"
              />
              <div class="q-gutter-xs">
                <q-btn
                  :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'"
                  color="primary"
                  target="_blank"
                  @click="functionNewOrderBuyCRM3()"
                  :href="linkCreated"
                  label="Nueva Order de compra"
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
                <q-td key="hani_ordencompra_number" :props="props">
                  {{ props.row.hani_ordencompra_number }}
                </q-td>
                <q-td key="name" :props="props">
                  <a
                    :href="link + props.row.idordencompra"
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
                <q-td key="total_amount" :props="props">
                  {{ props.row.total_amount }}
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
