
<script lang="ts">
import { defineComponent } from 'vue';
import ViewGeneralSkeletonSubpanel from 'src/components/Skeletons/ViewGeneralSkeletonSubpanel.vue';
export default defineComponent({
 name: 'ViewSurveys',
});
</script>
<script setup lang="ts">
 import { ref, onMounted, computed } from 'vue';
 import { AccountStore } from '../../Accounts/store/AccountStore';
 import { HANSACRM3_URL } from 'src/conections/api_conectors';
 import { userStore } from 'src/modules/Users/store/UserStore';
import { QTableColumn } from 'quasar';

 const { userCRM } = userStore();
 const { getAccountsDeliveries } = AccountStore();
 const props = defineProps<{
   idAccount: string;
 }>();
 const filter = ref('');
 const ActiveSqeleton = ref(false);
 const documentRelation = ref([] as { [key: string]: string }[]);

 onMounted(async () => {
   documentRelation.value = await getAccountsDeliveries(props.idAccount, userCRM.iddivision);
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
       (objeto.estado.toLowerCase().indexOf(filter.value.toLowerCase()) > -1) ||
       (objeto.amercado.toLowerCase().indexOf(filter.value.toLowerCase()) > -1)
   );
 });

 const pagination = ref({
   sortBy: 'desc',
   descending: false,
   page: 1,
   rowsPerPage: 100,
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
       name: 'estado',
       align: 'left',
       label: 'Estado',
       field: 'estado',
       sortable: true,
     },
     {
       name: 'fecha_entrega',
       align: 'left',
       label: 'Fecha de entrega',
       field: 'fecha_entrega',
       sortable: true,
     },
     {
       name: 'lugar',
       align: 'left',
       label: 'Lugar',
       field: 'lugar',
       sortable: true,
     },
     {
       name: 'amercado',
       align: 'left',
       label: 'Area de mercado',
       field: 'amercado',
       sortable: true,
     },
     {
       name: 'asignado',
       align: 'left',
       label: 'Responsable',
       field: 'asignado',
       sortable: true,
     },
   ];

 const link = HANSACRM3_URL + '/index.php?module=HANE_Entregas&action=DetailView&record=';

</script>
<template>
  <q-card class="my-card" v-if="ActiveSqeleton" style="min-height: 80vh">
   <q-card-section>
     <div class="row col-12 justify-between">
       <div class="col-xl-2 col-lg-3 col-md-4 col-sm-12 col-xs-12 q-mb-sm">
         <q-input bottom-slots dense v-model="filter" placeholder="Buscar por nombre, estado y area mercado">
           <template v-slot:hint>
            <span class="text-primary">{{filterdocRelation.length==1? filterdocRelation.length+' Entrega encontrada':filterdocRelation.length+' Entregas encontradas'}} </span> 
           </template>
           <template v-slot:append>
             <q-icon name="search" v-if="!filter" />
             <q-icon name="clear" v-else @click="filter = ''" class="cursor-pointer" />
           </template>
         </q-input>
       </div>
       <div class="col-xl-4 col-lg-6 col-md-7 col-sm-12 col-xs-12 q-mb-sm">
         <div class="row justify-end">
           <slot name="buttons">
             <q-btn :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'" color="primary" @click="$emit('openDialog')"
               label="Seleccionar" size="md" />
             <!-- <q-btn color="primary" icon="add" class="mobile-only" /> -->
           </slot>
         </div>
       </div>
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
             <q-tr :props="props" @click="openwindows(props.row.id)">
               <q-td auto-width>
                 <q-btn size="sm" round 
                 :color="props.row.estado == 'Entregado' ? 'green' 
                       : 'grey'" 
                 :icon="props.row.estado == 'Entregado' ? 'check'
                       :props.row.estado == 'En progreso' ? 'work_history'
                       :'edit_off'
                   ">
                 </q-btn>
               </q-td>
               <q-td key="nombre" :props="props">              
                 <!-- <a :href="link+props.row.id" target="_blank" style="text-decoration: none;"> -->
                     <q-item-label lines="5" class="text-primary">{{props.row.nombre}}</q-item-label>
                 <!-- </a> -->
               </q-td>
               <q-td key="nombre" :props="props" :class="
                   props.row.estado == 'Entregado'
                     ? 'text-green'
                     : 'text-grey'
                 ">
                 <q-chip :color="
                     props.row.estado == 'Sin Registrar' ? 'grey' : 'teal'
                   " size="xs" text-color="white">
                   {{ props.row.estado }}
                 </q-chip>
               </q-td>
               <q-td key="nombre" :props="props" :class="
                   $q.dark.isActive
                     ? 'text-white'
                     : props.row.fecha_entrega == 'Sin Registrar'
                     ? 'text-grey'
                     : 'text-black'
                 ">
                 <q-icon name="event" class="q-pr-xs" :color="
                     props.row.fecha_entrega == 'Sin Registrar'
                       ? 'grey'
                       : 'blue'
                   " />
                 {{ props.row.fecha_entrega }}
               </q-td>
               <q-td key="nombre" :props="props" :class="
                   $q.dark.isActive
                     ? 'text-white'
                     : props.row.lugar == 'Sin Registrar'
                     ? 'text-grey'
                     : 'text-black'
                 ">
                 <q-icon name="location_on" class="q-pr-xs" :color="
                     props.row.asignado == 'Sin Registrar' ? 'grey' : 'blue'
                   " />{{ props.row.lugar }}
               </q-td>
               <q-td key="nombre" :props="props">
                 {{ props.row.amercado }}
               </q-td>
               <q-td key="nombre" :props="props">
                 {{ props.row.asignado }}
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
         <q-card style="height: 60vh; width: 100%" flat class="my-card column flex-center">
           <img src="list-empty.png" alt="lista vacia" style="width: 220px; height: 200px" />
           <br /><br />
           <div class="text-h6 text-dark text-center">
             Lista vacía <br />
             <small class="text-grey-5">No se encontraron entregas relacionadas...</small>
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
