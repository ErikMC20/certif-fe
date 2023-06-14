
<script lang="ts">
  import { defineComponent } from 'vue';
  import { useOpportunitiesStore } from 'src/modules/Opportunities/store/OpportunitiesStore';
  import ViewGeneralSkeletonSubpanel from 'src/components/Skeletons/ViewGeneralSkeletonSubpanel.vue';
  export default defineComponent({
    name: 'ViewReservas',
  });
</script>
<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { AccountStore } from 'src/modules/Accounts/store/AccountStore';
  import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { QTableColumn } from 'quasar';

  const { getAccountsReservations } = AccountStore();
  const props = defineProps < {
    id: string;
  } > ();
  const filter = ref('');
  const ActiveSqeleton = ref(false);
  //const filterdocRelation = ref < any > ([]);
  const documentRelation = ref([] as { [key: string]: string }[]);
  const storeOpportunities = useOpportunitiesStore();
  onMounted(async () => {
    documentRelation.value = await storeOpportunities.getOpportunitiesProyect(props.id);
    ActiveSqeleton.value = true;
  })

  const openwindows = (id:string) => {
  //console.log(id);
  const url=link+id;
  window.open(url, '_blank')
  };

  const filterdocRelation = computed(() => {
  return documentRelation.value.filter(
    (objeto) =>
      (objeto.nombre.toLowerCase().indexOf(filter.value.toLowerCase()) > -1) 
       
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
    name: 'fecha_inicio',
    align: 'left',
    label: 'Fecha inicio',
    field: 'fecha_inicio',
  },
  {
    name: 'fecha_fin',
    align: 'left',
    label: 'Fecha fin',
    field: 'fecha_fin',
    sortable: true,
  },
  {
    name: 'asignado',
    align: 'left',
    label: 'Asignado a',
    field: 'asignado',
    sortable: true,
  }
];
  const link = HANSACRM3_URL + '/index.php?module=HANQ_Reservas&action=DetailView&record=';

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
              <span class="text-primary">{{filterdocRelation.length==1? filterdocRelation.length+' Proyecto encontrado':filterdocRelation.length+' Proyecto encontrados'}} </span>
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
                   <q-btn
                     size="sm"
                     round
                     color="primary"
                     icon="person"
                   >
                   </q-btn>
                 </q-td>
                 <q-td key="nombre" :props="props">            
                   <!-- <a :href="link+props.row.id" target="_blank" style="text-decoration: none;"> -->
                       <q-item-label lines="5" class="text-primary">
                        <a
           class="text-bold cursor-pointer flex items-center text-primary" 
         >   {{props.row.nombre}}</a>       
                      </q-item-label>
                   <!-- </a> -->
                   <q-item-label
                     caption
                     lines="2"
                     :class="$q.dark.isActive ? 'text-white' : ''"
                   >
                   
                   </q-item-label>
                 </q-td>
                 <q-td
                   key="nombre"
                   :props="props"                  
                 >
                   
                 <q-icon
                     name="event"
                     class="q-pr-xs"
                   />
                   <span :class="props.row.fecha_inicio == null ? 'text-grey':
                                 props.row.fecha_inicio == '' ?'text-grey'
                                 :''">
                                 {{ props.row.fecha_inicio || 'Sin registrar' }}
                  </span> 
                   
                 </q-td>
                 <q-td
                   key="nombre"
                   :props="props"                  
                 >
                   
                 <q-icon
                     name="event"
                     class="q-pr-xs"
                   />
                   <span :class="props.row.fecha_fin == null ? 'text-grey':
                                 props.row.fecha_fin == '' ?'text-grey'
                                 :''">
                                 {{ props.row.fecha_fin || 'Sin registrar' }}
                  </span> 
                   
                 </q-td>
                 
                 <q-td
                   key="nombre"
                   :props="props"                  
                 >
                   
                 <q-icon
                     name="person"
                     class="q-pr-xs"
                   />
                   <span :class="props.row.asignado == null ? 'text-grey':
                                 props.row.asignado == '' ?'text-grey'
                                 :''">
                                 {{ props.row.asignado || 'Sin registrar' }}
                  </span> 
                   
                 </q-td>
                 
                 <q-td key="nombre" :props="props">
                   <q-btn size="12px" flat dense round icon="more_vert"
                             @click="(event:Event)=>event.stopPropagation()">
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
  </q-card>

  <q-card v-else style="height: 60vh; width: 100%">
    <ViewGeneralSkeletonSubpanel/>
  </q-card>
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