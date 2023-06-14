<script lang="ts">
import { defineComponent } from 'vue';
import ViewGeneralSkeletonSubpanel from 'src/components/Skeletons/ViewGeneralSkeletonSubpanel.vue';
import { useOpportunitiesStore } from 'src/modules/Opportunities/store/OpportunitiesStore';
export default defineComponent({
  name: 'ViewProspects',
});
</script>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { AccountStore } from 'src/modules/Accounts/store/AccountStore';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { QTableColumn } from 'quasar';
import RelacionadoPro from 'src/components/Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoPro.vue';
import { updateModuleRecord } from 'src/services/GlobalService';
import { userStore } from 'src/modules/Users/store/UserStore';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
const { getAccountsReservations } = AccountStore();
const props = defineProps<{
  id: string;
}>();
const filter = ref('');
const ActiveSqeleton = ref(false);
const documentRelation = ref([] as { [key: string]: string }[]);
const storeOpportunities = useOpportunitiesStore();
const advancedFilterProRef = ref<InstanceType<typeof RelacionadoPro> | null>(
  null
);
const { userCRM } = userStore();

onMounted(async () => {
  documentRelation.value = await storeOpportunities.getOpportunitiesLeads(
    props.id
  );
  ActiveSqeleton.value = true;
});

const searchProspect = async () => {
  await advancedFilterProRef.value?.openDialog();
};

const relacarga = ref(false);
const alert = ref(false);
const infoPro = ref();

const selectRelaPro = (item: any) => {
  infoPro.value = item;
  alert.value = true;
};

const saveRelationPro = async () => {
  relacarga.value = true;
  alert.value = false;
  advancedFilterProRef.value?.onClose();
  await updateModuleRecord('Leads', infoPro.value.id, {
    modified_user_id: userCRM.id,
    opportunity_id: props.id,
  });
  // await createRelationBetweenModulesV2(
  //   'Opportunities',
  //   props.id,
  //   'Leads',
  //   infoPro.value.id
  // );
  await reloadListProspect();
  relacarga.value = false;
};

const reloadListProspect = async () => {
  documentRelation.value = await storeOpportunities.getOpportunitiesLeads(
    props.id
  );
};

const openwindows = (id: string) => {
  //console.log(id);
  const url = link + id;
  window.open(url, '_blank');
};

const filterdocRelation = computed(() => {
  return documentRelation.value.filter(
    (objeto) =>
      objeto.nombre.toLowerCase().indexOf(filter.value.toLowerCase()) > -1
    //  ||
    //  (objeto.estado.toLowerCase().indexOf(filter.value.toLowerCase()) > -1) ||
    //  (objeto.asignado.toLowerCase().indexOf(filter.value.toLowerCase()) > -1)
  );
});
const columns: QTableColumn[] = [
  {
    name: 'nombre',
    align: 'left',
    label: 'Nombre',
    field: 'nombre',
    sortable: true,
  },
  {
    name: 'telefono',
    align: 'left',
    label: 'Telefono',
    field: 'telefono',
    sortable: true,
  },
  {
    name: 'direccion',
    align: 'left',
    label: 'Dirección',
    field: 'direccion',
  },
  {
    name: 'cargo',
    align: 'left',
    label: 'Cargo',
    field: 'cargo',
    sortable: true,
  },
  {
    name: 'fecha_creacion',
    align: 'left',
    label: 'Fecha de Creación',
    field: 'fecha_creacion',
    sortable: true,
  },
  {
    name: 'asignado',
    align: 'left',
    label: 'Asignado a',
    field: 'asignado',
    sortable: true,
  },
];
const link =
  HANSACRM3_URL + '/index.php?module=HANQ_Reservas&action=DetailView&record=';

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 100,
});
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
                    ? filterdocRelation.length + ' Prospecto encontrado'
                    : filterdocRelation.length + ' Prospectos encontrados'
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
                label="Nuevo Contacto"
                @click="showContact('')"
                size="md"
              />
              <q-btn
                :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'"
                color="primary"
                @click="searchProspect"
                label="buscar y agregar"
                size="md"
              />
              <!-- <q-btn
                 :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'"
                 color="primary"
                 @click="$emit('openDialog')"
                 label="Buscar y Agregar"
                 size="md"
               /> -->
              <!-- <q-btn color="primary" icon="add" class="mobile-only" /> -->
            </slot>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-md-3 q-pa-md">
        <template v-if="filterdocRelation.length > 0">
          <q-table
            :flat="!$q.screen.xs ? true : false"
            :grid="$q.screen.xs"
            :rows="filterdocRelation"
            :columns="columns"
            row-key="nombre"
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
              <q-tr :props="props">
                <q-td auto-width>
                  <q-btn size="sm" round color="primary" icon="person"> </q-btn>
                </q-td>
                <q-td key="nombre" :props="props">
                  <!-- <a :href="link+props.row.id" target="_blank" style="text-decoration: none;"> -->
                  <q-item-label lines="5" class="text-primary">
                    <a
                      class="text-bold cursor-pointer flex items-center text-primary"
                    >
                      {{ props.row.saludo }} {{ props.row.nombre }}</a
                    >
                  </q-item-label>
                  <!-- </a> -->
                  <q-item-label
                    caption
                    lines="2"
                    :class="$q.dark.isActive ? 'text-white' : ''"
                  >
                    CI.: {{ props.row.ci || 'Sin registrar' }}
                  </q-item-label>
                </q-td>
                <q-td key="nombre" :props="props">
                  <q-icon name="phone" class="q-pr-xs" />
                  <span
                    :class="
                      props.row.telefono == null
                        ? 'text-grey'
                        : props.row.telefono == ''
                        ? 'text-grey'
                        : ''
                    "
                  >
                    {{ props.row.telefono || 'Sin registrar' }}
                  </span>
                </q-td>
                <q-td key="nombre" :props="props">
                  <q-icon name="emails" class="q-pr-xs" />
                  <span
                    :class="
                      props.row.direccion == null
                        ? 'text-grey'
                        : props.row.direccion == ''
                        ? 'text-grey'
                        : ''
                    "
                  >
                    {{ props.row.direccion || 'Sin registrar' }}
                  </span>
                </q-td>
                <q-td key="nombre" :props="props">
                  <q-icon name="person_pin" class="q-pr-xs" />
                  <span
                    :class="
                      props.row.cargo == null
                        ? 'text-grey'
                        : props.row.cargo == ''
                        ? 'text-grey'
                        : ''
                    "
                  >
                    {{ props.row.cargo || 'Sin registrar' }}
                  </span>
                </q-td>
                <q-td key="nombre" :props="props">
                  <q-icon name="event" class="q-pr-xs" />
                  <span
                    :class="
                      props.row.fecha_creacion == null
                        ? 'text-grey'
                        : props.row.fecha_creacion == ''
                        ? 'text-grey'
                        : ''
                    "
                  >
                    {{ props.row.fecha_creacion || 'Sin registrar' }}
                  </span>
                </q-td>
                <q-td key="nombre" :props="props">
                  <q-icon name="person" class="q-pr-xs" />
                  <span
                    :class="
                      props.row.asignado == null
                        ? 'text-grey'
                        : props.row.asignado == ''
                        ? 'text-grey'
                        : ''
                    "
                  >
                    {{ props.row.asignado || 'Sin registrar' }}
                  </span>
                </q-td>

                <q-td key="nombre" :props="props">
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
                >No se encontraron reservas relacionadas...</small
              >
            </div>
          </q-card>
        </template>
      </div>
    </q-card-section>
    <q-inner-loading
      :showing="relacarga"
      label="Relacionando una cotización.."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </q-card>

  <q-card v-else style="height: 60vh; width: 100%">
    <ViewGeneralSkeletonSubpanel />
  </q-card>
  <RelacionadoPro
    account_id=""
    ref="advancedFilterProRef"
    @selectItem="selectRelaPro"
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
    @confirm="saveRelationPro"
    @denegate="alert = false"
  >
    <template #body>
      <span class="text-center col-12"
        >¿ Desea relacionar la oportunidad ?
      </span>

      <span class="text-center text-primary col-12">
        {{ infoPro.nombre }}
      </span>
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
