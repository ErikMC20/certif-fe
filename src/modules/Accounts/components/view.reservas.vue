<template>
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
              <span class="text-primary"
                >{{
                  filterdocRelation.length == 1
                    ? filterdocRelation.length + ' Reserva encontrada'
                    : filterdocRelation.length + ' Reservas encontradas'
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
          <div class="row justify-end">
            <slot name="buttons">
              <!-- <q-btn
                :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'"
                color="primary"
                @click="$emit('openDialog')"
                label="Seleccionar"
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
              <q-tr :props="props" @click="openwindows(props.row.id)">
                <q-td auto-width>
                  <q-btn
                    size="sm"
                    round
                    :color="
                      props.row.estado == 'Confirmado'
                        ? 'green'
                        : props.row.estado == 'Rechazado'
                        ? 'red'
                        : props.row.estado == 'Cerrado'
                        ? 'teal'
                        : props.row.estado == 'Bloqueado'
                        ? 'orange'
                        : 'grey'
                    "
                    :icon="
                      props.row.estado == 'Confirmado'
                        ? 'check'
                        : props.row.estado == 'Rechazado'
                        ? 'close'
                        : props.row.estado == 'Cerrado'
                        ? 'done_all'
                        : props.row.estado == 'Bloqueado'
                        ? 'block'
                        : 'edit_off'
                    "
                  >
                  </q-btn>
                </q-td>
                <q-td key="nombre" :props="props">
                  <!-- <a :href="link+props.row.id" target="_blank" style="text-decoration: none;"> -->
                  <q-item-label lines="5" class="text-primary">{{
                    props.row.nombre
                  }}</q-item-label>
                  <!-- </a> -->
                  <q-item-label
                    caption
                    lines="2"
                    :class="$q.dark.isActive ? 'text-white' : ''"
                  >
                    Nro.: {{ props.row.numero }}
                  </q-item-label>
                </q-td>
                <q-td key="nombre" :props="props">
                  <q-chip
                    :color="
                      props.row.estado == 'Confirmado'
                        ? 'teal'
                        : props.row.estado == 'Rechazado'
                        ? 'red'
                        : props.row.estado == 'Cerrado'
                        ? 'teal'
                        : props.row.estado == 'Bloqueado'
                        ? 'orange'
                        : 'grey'
                    "
                    size="xs"
                    text-color="white"
                  >
                    {{ props.row.estado }}
                  </q-chip>
                </q-td>
                <q-td
                  key="nombre"
                  :props="props"
                  :class="
                    $q.dark.isActive
                      ? 'text-white'
                      : props.row.fecha_vencimiento == 'Sin Registrar'
                      ? 'text-grey'
                      : 'text-black'
                  "
                >
                  <q-icon
                    name="event"
                    class="q-pr-xs"
                    :color="
                      props.row.fecha_vencimiento == 'Sin Registrar'
                        ? 'grey'
                        : 'blue'
                    "
                  />
                  {{ props.row.fecha_vencimiento }}
                </q-td>
                <q-td
                  key="nombre"
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
                  key="nombre"
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
                  />{{ props.row.asignado }}
                </q-td>
                <q-td key="descripcion" :props="props">
                  {{ props.row.descripcion }}
                </q-td>
                <!-- <q-td key="nombre" :props="props">
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

  <ReservasDialog ref="reservasDialogRef" />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'ViewCampaigns',
});
</script>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { AccountStore } from '../store/AccountStore';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import ReservasDialog from 'src/modules//Reservas/components/Dialogs/ReservasDialog.vue';

const { getAccountsReservations } = AccountStore();
const props = defineProps<{
  idAccount: string;
}>();
const filter = ref('');
const ActiveSqeleton = ref(false);
//const filterdocRelation = ref < any > ([]);
const documentRelation = ref([] as { [key: string]: string }[]);
const reservasDialogRef = ref<InstanceType<typeof ReservasDialog> | null>(null);

onMounted(async () => {
  documentRelation.value = await getAccountsReservations(props.idAccount, '03');
  ActiveSqeleton.value = true;
});

const openwindows = async (id: string) => {
  //console.log(id);
  // const url = link + id;
  // window.open(url, '_blank');
  await reservasDialogRef.value?.openDialogReserveTab(id);
};

const filterdocRelation = computed(() => {
  return documentRelation.value.filter(
    (objeto) =>
      objeto.nombre.toLowerCase().indexOf(filter.value.toLowerCase()) > -1 ||
      objeto.estado.toLowerCase().indexOf(filter.value.toLowerCase()) > -1 ||
      objeto.asignado.toLowerCase().indexOf(filter.value.toLowerCase()) > -1
  );
});
const columns: {
  name: string;
  align: string;
  label: string;
  field: string;
  sortable?: boolean;
}[] = [
  {
    name: 'nombre',
    align: 'left',
    label: 'Nombre',
    field: 'nombre',
    sortable: true,
  },
  {
    name: 'estado',
    align: 'left',
    label: 'Estado',
    field: 'estado',
    sortable: true,
  },
  {
    name: 'fecha_vencimiento',
    align: 'left',
    label: 'Fecha de Vencimiento',
    field: 'fecha_vencimiento',
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
  {
    name: 'descripcion',
    align: 'left',
    label: 'Descripción',
    field: 'descripcion',
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
