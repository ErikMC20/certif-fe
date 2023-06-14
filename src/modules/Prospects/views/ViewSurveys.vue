<template>
  <q-card class="my-card" v-if="ActiveSqeleton" style="min-height: 80vh">
    <q-card-section>
      <div class="row col-12 justify-between">
        <div class="col-xl-2 col-lg-3 col-md-4 col-sm-12 col-xs-12 q-mb-sm">
          <q-input bottom-slots dense v-model="filter" placeholder="Buscar por nombre y estado">
            <template v-slot:hint>
              <span class="text-primary">{{filterdocRelation.length==1 ? filterdocRelation.length+' Encuesta encontrada':filterdocRelation.length+' Encuestas encontradas'}} </span>
            </template>
            <template v-slot:append>
              <q-icon name="search" v-if="!filter" />
              <q-icon name="clear" v-else @click="filter = ''" class="cursor-pointer" />
            </template>
          </q-input>
        </div>
        <!-- <div class="col-xl-4 col-lg-6 col-md-7 col-sm-12 col-xs-12 q-mb-sm">
          <div class="row justify-end">
            <slot name="buttons">
              <q-btn :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'" color="primary" @click="$emit('openDialog')"
                label="Seleccionar" size="md" />             
            </slot>
          </div>
        </div> -->
      </div>
      <div class="col-xs-12 col-md-3 q-pa-md">
        <template v-if="filterdocRelation.length > 0">
          <q-table :flat="!$q.screen.xs ? true : false" :grid="$q.screen.xs" :rows="filterdocRelation"
            :columns="columns" row-key="nombre" :pagination="pagination" hide-bottom>
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th auto-width />
                <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-weight-medium">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
            <template v-slot:body="props">
              <q-tr :props="props" class="nuevo">
                <q-td auto-width>
                  <q-btn size="sm" round :color="props.row.estado == 'Entregado' ? 'green' 
                       : 'grey'" :icon="props.row.estado == 'Entregado' ? 'check'
                       :props.row.estado == 'En progreso' ? 'work_history'
                       :'edit_off'
                   "  @click="openwindows(props.row.id)">
                  </q-btn>
                </q-td>
                <q-td key="nombre" :props="props">
                  <!-- <a :href="link+props.row.id" target="_blank" style="text-decoration: none;"> -->
                  <q-item-label  class="text-primary cursor-pointer text-weight-bold" @click="openwindows(props.row.id)">{{props.row.nombre}}</q-item-label>
                  <!-- </a> -->
                </q-td>
                <q-td key="nombre" :props="props">
                  <q-icon name="mail_outline" :color="$q.dark.isActive ? 'text-white':'primary'" size="xs" />
                  @hansa.com.bo
                </q-td>
                <q-td key="nombre" :props="props" :class="
                   $q.dark.isActive
                     ? 'text-white'
                     : props.row.fecha_entrega == 'Sin Registrar'
                     ? 'text-grey'
                     : 'text-black'
                 ">
                  <q-icon name="event" size="xs" :color="
                     props.row.fecha_entrega == 'Sin Registrar'
                       ? 'grey'
                       : 'primary'
                   " />
                  {{ props.row.fecha_entrega }}
                </q-td>
                <!-- <q-td key="nombre" :props="props" :class="
                   $q.dark.isActive
                     ? 'text-white'
                     : props.row.lugar == 'Sin Registrar'
                     ? 'text-grey'
                     : 'text-black'
                 ">
                  <q-icon name="published_with_changes" size="xs" class="q-pr-xs" :color="
                     props.row.asignado == 'Sin Registrar' ? 'grey' : 'primary'
                   " />si
                </q-td> -->
                
                <!-- <q-td key="nombre" :props="props">
                  <q-btn color="orange" label="No" size="xs"/>
                </q-td> -->
                <q-td key="nombre" :props="props">
                  <q-icon name="person_outline" size="xs" :color="
                     props.row.asignado == 'Sin Registrar' ? 'grey' : 'primary'
                   " />
                  {{ props.row.asignado }}
                </q-td>
                <q-td key="nombre" :props="props" :class="props.row.estado == 'Entregado' ? 'text-green' : props.row.estado == 'Entregado y Verificado' ? 'text-teal':'text-grey'">
                  <q-icon :name="props.row.estado == 'Entregado' ? 'task_alt' 
                       : 'verified_user'" size="xs" class="q-pr-xs" :color="props.row.estado == 'Entregado' ? 'text-green' : props.row.estado == 'Entregado y Verificado' ? 'text-teal':'text-grey'" />
                  {{ props.row.estado }}

                </q-td>
                <q-td key="nombre" :props="props">
                  <q-icon name="star" size="xs" color="red" />
                  <q-icon name="star" size="xs" color="orange" />
                  <q-icon name="star" size="xs" color="yellow" /> 
                  90%
                </q-td>
                <q-td key="nombre" :props="props">
                  <q-btn size="12px" 
                  flat dense round icon="more_vert" @click="(event:Event)=>event.stopPropagation()">
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
          <q-card style="height: 60vh; width: 100%" flat class="my-card column flex-center">
            <img src="list-empty.png" alt="lista vacia" style="width: 220px; height: 200px" />
            <br /><br />
            <div class="text-h6 text-dark text-center">
              Lista vacía <br />
              <small class="text-grey-5">No se encontraron encuestas relacionadas...</small>
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
  import { AccountStore } from '../../Accounts/store/AccountStore';
  import { HANSACRM3_URL } from 'src/conections/api_conectors';
  import { userStore } from 'src/modules/Users/store/UserStore';

  const { userCRM } = userStore();
  const { getAccountsDeliveries } = AccountStore();
  const props = defineProps < {
    idAccount: string;
  } > ();
  const filter = ref('');
  const ActiveSqeleton = ref(false);
  const documentRelation = ref([] as { [key: string]: string }[]);

  onMounted(async () => {
    documentRelation.value = await getAccountsDeliveries(props.idAccount, userCRM.iddivision);
    ActiveSqeleton.value = true;
  });

  const openwindows = (id: string) => {
    const url = link + id;
    window.open(url, '_blank')
  };

  const filterdocRelation = computed(() => {
    return documentRelation.value.filter(
      (objeto) =>
        (objeto.nombre.toLowerCase().indexOf(filter.value.toLowerCase()) > -1) ||
        (objeto.estado.toLowerCase().indexOf(filter.value.toLowerCase()) > -1)
    );
  });

  const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 100,
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
        label: 'Encuesta',
        field: 'nombre',
        sortable: true,
      },
      {
        name: 'fecha_entrega',
        align: 'left',
        label: 'Correo electronico',
        field: 'fecha_entrega',
        sortable: true,
      },
      
      // {
      //   name: 'lugar',
      //   align: 'left',
      //   label: 'Programacion',
      //   field: 'lugar',
      //   sortable: true,
      // },
      {
        name: 'amercado',
        align: 'left',
        label: 'Encuesta Enviada',
        field: 'amercado',
        sortable: true,
      },
      // {
      //   name: 'asignado',
      //   align: 'left',
      //   label: 'Reenviado',
      //   field: 'asignado',
      //   sortable: true,
      // },
      {
        name: 'asignado',
        align: 'left',
        label: 'Recibido por',
        field: 'asignado',
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
        name: 'asignado',
        align: 'left',
        label: 'Puntuación',
        field: 'asignado',
        sortable: true,
      },
    ];

  const link = HANSACRM3_URL + '/index.php?module=HANE_Entregas&action=DetailView&record=';
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
