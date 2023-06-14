<template>
  <q-card class="my-card" v-if="ActiveSqeleton" style="min-height: 80vh">
    <q-card-section>
      <div class="row col-12 justify-between">
        <div class="col-xl-4 col-lg-3 col-md-5 col-sm-12 col-xs-12 q-mb-sm">
          <q-input bottom-slots dense v-model="filter" placeholder="Buscar por nombre, parentesco, genero y cumpleaños">
            <template v-slot:hint>
             <span class="text-primary">{{filterdocRelation.length==1? filterdocRelation.length+' Familiar encontrado':filterdocRelation.length+' Familiares encontrados'}} </span> 
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
              <q-btn
                :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'"
                color="primary"
                @click="$emit('openDialog')"
                label="Seleccionar"
                size="md"
              />
              <!-- <q-btn color="primary" icon="add" class="mobile-only" /> -->
            </slot>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-md-3 q-pa-md">
        <template v-if="filterdocRelation.length > 0">
          <q-table
            flat
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
                  <!-- <a :href="link+props.row.id" target="_blank" style="text-decoration: none;">   -->
                    <q-btn  size="sm" round
                    :color="props.row.genero == 'Masculino' ? 'blue' : 'pink'"
                    :icon="props.row.genero == 'Masculino' ? 'person' : 'person_3'">
                        </q-btn>                       
                      <!-- </a> -->                 
                </q-td>
                <q-td key="nombre" :props="props">
                  <q-item-label lines="3">{{ props.row.nombre }}</q-item-label>
                  <q-item-label caption lines="2">
                    {{ props.row.parentesco }}
                  </q-item-label>
                </q-td>
                <q-td
                  key="nombre"
                  :props="props"
                  :class="
                    props.row.genero == 'Masculino' ? 'text-blue' : 'text-pink'
                  "
                >
                <q-icon  :name="props.row.genero == 'Masculino' ? 'male' : 'female'" />
                  {{ props.row.genero }}
                </q-td>
                <q-td
                  key="nombre"
                  :props="props"
                  :class="
                    props.row.cumpleanos == 'Sin Registrar'
                      ? 'text-grey'
                      : 'text-black'
                  "
                >
                  <q-icon
                    name="cake"
                    class="q-pr-xs"
                    :color="
                      props.row.cumpleanos == 'Sin Registrar'
                        ? 'grey'
                        : 'orange'
                    "
                  />
                  {{ props.row.cumpleanos }}
                </q-td>
                <q-td
                  key="nombre"
                  :props="props"
                  :class="
                    props.row.telefono == 'Sin Registrar'
                      ? 'text-grey'
                      : 'text-black'
                  "
                >
                  <q-icon
                    name="phone"
                    class="q-pr-xs"
                    :color="
                      props.row.telefono == 'Sin Registrar' ? 'grey' : 'blue'
                    "
                  />{{ props.row.telefono }}
                </q-td>
                <q-td key="nombre" :props="props">
                  {{ props.row.descripcion }}
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
                >No se encontraron familiares relacionadas...</small
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
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ViewCampaigns',
});
</script>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ContactStore } from '../store/ContactStore';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { userStore } from 'src/modules/Users/store/UserStore';
  const { userCRM } = userStore();
const { getContactsRelatives } = ContactStore();
const props = defineProps<{
  id: string;
}>();
const filter = ref('');
const ActiveSqeleton = ref(false);
const documentRelation = ref([] as { [key: string]: string }[]);

onMounted(async () => {
  documentRelation.value = await getContactsRelatives(props.id, userCRM.iddivision);
  ActiveSqeleton.value = true;
});

const openwindows = (id:string) => {
  //console.log(id);
  const url=link+id;
  window.open(url, '_blank')
  };

const filterdocRelation = computed(() => {
    return documentRelation.value.filter(
      (objeto) =>
        (objeto.nombre.toLowerCase().indexOf(filter.value.toLowerCase()) > -1) ||
        (objeto.parentesco.toLowerCase().indexOf(filter.value.toLowerCase()) > -1) ||
        (objeto.genero.toLowerCase().indexOf(filter.value.toLowerCase()) > -1) ||
        (objeto.cumpleanos.toLowerCase().indexOf(filter.value.toLowerCase()) > -1) 
    );
  });

const link = HANSACRM3_URL + '/index.php?module=HANC_Familiares&action=DetailView&record=';

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
    name: 'genero',
    align: 'left',
    label: 'Genero',
    field: 'genero',
    sortable: true,
  },
  {
    name: 'cumpleanos',
    align: 'left',
    label: 'Cumpleaños',
    field: 'cumpleanos',
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
    name: 'descripcion',
    align: 'left',
    label: 'Descripción',
    field: 'descripcion',
    sortable: true,
  },
];

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
