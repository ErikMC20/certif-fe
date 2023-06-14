
<template>
 <q-card class="my-card" v-if="ActiveSqeleton" style="min-height: 80vh">
    <q-card-section>
      <div class="row col-12 justify-between">
        <div class="col-xl-2 col-lg-3 col-md-4 col-sm-12 col-xs-12 q-mb-sm">
          <q-input bottom-slots dense v-model="filter" placeholder="Buscar por nombre, estado y asignado">
            <template v-slot:hint>
              <span class="text-primary">
                {{filterdocRelation.length==1?
                filterdocRelation.length+'Oportunidadencontrada':filterdocRelation.length+' Oportunidad encontradas'}}
              </span>
            </template>
            <template v-slot:append>
              <q-icon name="search" v-if="!filter" />
              <q-icon name="clear" v-else @click="filter = ''" class="cursor-pointer" />
            </template>
          </q-input>
        </div>
        <div class="col-xl-4 col-lg-6 col-md-7 col-sm-12 col-xs-12 q-mb-sm">
          <div class="row justify-end q-gutter-sm" >
            <slot name="buttons">
              <q-btn :class="!$q.screen.xs ? 'q-ms-md':'full-width'" color="primary" target="_blank" :href="linkCreated"
                label="Nuevo" size="md" />
                <q-btn :class="!$q.screen.xs ? 'q-ms-md':'full-width'" color="primary" @click="$emit('openDialog')" 
                label="Seleccionar" size="md" />
              <!-- <q-btn color="primary" icon="add" class="mobile-only" /> -->
            </slot>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-md-3 q-pa-md">
        <template v-if="filterdocRelation.length>0">
          <q-list v-if="userCRM.iddivision=='todas'">
            <template v-for="({ cod_div, label },index) in listAMercado" :key="cod_div">
              <!-- <template v-for="row,index in listAMercado" :key="index"> -->
              <q-expansion-item :label="label"
                :caption="filterdocRelation.filter((v:any) => v.iddivision === cod_div).length+' Oportunidades'"
                header-class="text-blue" popup
                v-if="filterdocRelation.filter((v:any) => v.iddivision === cod_div).length > 0">


                <template v-for="{ cod_amercado, label } in listAMercado[index].amercado" :key="cod_amercado">
              <q-expansion-item :label="'Area de mercado: '+label"
                :caption="filterdocRelation.filter((v:any) => v.idamercado === cod_amercado).length+' Oportunidades'"
                header-class="text-red"
                v-if="filterdocRelation.filter((v:any) => v.idamercado === cod_amercado).length > 0">


                <template v-if="!$q.screen.xs ? true : false">                                      
                    <q-table  :rows="filterdocRelation"
                    :columns="columns" row-key="name" :pagination="pagination" hide-bottom>>
                    <template v-slot:header="props">
                      <q-tr :props="props">
                        <q-th auto-width />
                        <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-weight-medium">
                          {{ col.label }}
                        </q-th>
                      </q-tr>
                    </template>
                    <template v-slot:body="props">
                      <q-tr :props="props" v-if="cod_amercado===props.row.idamercado" @click="openwindows(props.row.id)">
                        <q-td auto-width>
                          <!-- <a :href="link+props.row.id" target="_blank" style="text-decoration: none;"> -->
                            <q-btn size="sm" round
                              :color="props.row.estado =='En Tratamiento' ? 'orange' : props.row.estado =='Ganado'  ? 'green':'red' "
                              :icon="props.row.estado =='Ganado' ? 'check': props.row.estado =='En Tratamiento' ? 'work_history': 'trending_down'">
                            </q-btn>
                          <!-- </a> -->
                        </q-td>
                        <q-td key="name" :props="props">
                          <q-item-label lines="5" class="text-primary">{{props.row.name}}</q-item-label>
                          <span
                            :class="props.row.estado =='En Tratamiento' ? 'text-orange' : props.row.estado =='Ganado'  ? 'text-green':'text-red' ">{{props.row.estado}}</span>
                        </q-td>
                        <q-td key="name" :props="props" class="text-grey">
                          {{ props.row.etapa }}
                        </q-td>
                        <q-td key="name" :props="props" :class="$q.dark.isActive? 'text-white': props.row.fecha_creacion == 'Sin Registrar'? 'text-grey': 'text-black'">
                          <q-icon name="event" class="q-pr-xs" :color="props.row.fecha_creacion == 'Sin Registrar' ? 'grey' : 'blue'" />
                          {{ props.row.fecha_creacion }}
                        </q-td>
                        <q-td key="name" :props="props" :class="
                          $q.dark.isActive
                            ? 'text-white'
                            : props.row.fecha_cierre == 'Sin Registrar'
                            ? 'text-grey'
                            : 'text-black'
                        ">
                          <q-icon name="event" class="q-pr-xs" :color="
                            props.row.fecha_cierre == 'Sin Registrar'
                              ? 'grey'
                              : 'blue'
                          " />
                          {{ props.row.fecha_cierre }}
                        </q-td>
                        <q-td key="name" :props="props" :class="
                          $q.dark.isActive
                            ? 'text-white'
                            : props.row.asignado == 'Sin Registrar'
                            ? 'text-grey'
                            : 'text-black'
                        ">
                          <q-icon name="person" class="q-pr-xs" :color="
                            props.row.asignado == 'Sin Registrar'
                              ? 'grey'
                              : 'blue'
                          " />
                          {{ props.row.asignado }}
                        </q-td>
                        <q-td key="name" :props="props">
                          <q-chip color="teal" size="sm" text-color="white">
                            {{props.row.monto.toLocaleString('en-ES', { minimumFractionDigits: 2})}}
                            {{props.row.moneda}}
                          </q-chip>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>                                 
                </template>
                <template v-else>
                  <q-list bordered class="rounded-borders">
                    <template v-for="row2,index in filterdocRelation" :key="index">
                      <q-item v-if="cod_amercado===row2.idamercado">
                        <q-item-section avatar>
                          <a :href="link+row2.id" target="_blank" style="text-decoration: none;">
                            <q-btn size="sm" round
                              :color="row2.estado =='En Tratamiento' ? 'orange' : row2.estado =='Ganado'  ? 'green':'red' "
                              :icon="row2.estado =='Ganado' ? 'check': row2.estado =='En Tratamiento' ? 'work_history': 'trending_down'">
                            </q-btn>
                          </a>
                        </q-item-section>
                        <q-item-section>
                          <a :href="link+row2.id" target="_blank" style="text-decoration: none;">
                            <q-item-label lines="5" class="text-primary">{{row2.name}}</q-item-label>
                          </a> <span
                            :class="row2.estado =='En Tratamiento' ? 'text-orange' : row2.estado =='Ganado'  ? 'text-green':'text-red' ">{{row2.estado}}</span>
                          <q-item-label caption lines="3" v-show="!$q.screen.xs ? false:true">
                            <span class="text-weight-regular text-primary">Fecha Cierre:</span>
                          </q-item-label>
                          <q-item-label caption lines="3" v-show="!$q.screen.xs ? false:true">
                            <span class="text-black"> {{row2.fecha_cierre}}</span>
                          </q-item-label>
                          <q-item-label caption lines="3" v-show="!$q.screen.xs ? false:true">
                            <span class="text-weight-regular text-primary">Monto:</span>
                          </q-item-label>
                          <q-item-label caption lines="3" v-show="!$q.screen.xs ? false:true">
                            <span class="text-black"> {{row2.monto.toLocaleString('en-ES', { minimumFractionDigits:2})}}
                              {{row2.moneda}}</span>
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-separator inset="item" v-if="cod_amercado===row2.idamercado" />
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
              <q-expansion-item :label="label"
                :caption="filterdocRelation.filter((v:any) => v.idamercado === cod_amercado).length+' Oportunidades'"
                header-class="text-blue" popup
                v-if="filterdocRelation.filter((v:any) => v.idamercado === cod_amercado).length > 0">

                <template v-if="!$q.screen.xs ? true : false">                                      
                    <q-table  :rows="filterdocRelation"
                    :columns="columns" row-key="name" :pagination="pagination" hide-bottom>>
                    <template v-slot:header="props">
                      <q-tr :props="props">
                        <q-th auto-width />
                        <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-weight-medium">
                          {{ col.label }}
                        </q-th>
                      </q-tr>
                    </template>
                    <template v-slot:body="props">
                      <q-tr :props="props" v-if="cod_amercado===props.row.idamercado" @click="openwindows(props.row.id)">
                        <q-td auto-width>
                          <!-- <a :href="link+props.row.id" target="_blank" style="text-decoration: none;"> -->
                            <q-btn size="sm" round
                              :color="props.row.estado =='En Tratamiento' ? 'orange' : props.row.estado =='Ganado'  ? 'green':'red' "
                              :icon="props.row.estado =='Ganado' ? 'check': props.row.estado =='En Tratamiento' ? 'work_history': 'trending_down'">
                            </q-btn>
                          <!-- </a> -->
                        </q-td>
                        <q-td key="name" :props="props">
                          <q-item-label lines="5" class="text-primary">{{props.row.name}}</q-item-label>
                          <span
                            :class="props.row.estado =='En Tratamiento' ? 'text-orange' : props.row.estado =='Ganado'  ? 'text-green':'text-red' ">{{props.row.estado}}</span>
                        </q-td>
                        <q-td key="name" :props="props" class="text-grey">
                          {{ props.row.etapa }}
                        </q-td>
                        <q-td key="name" :props="props" :class="$q.dark.isActive? 'text-white': props.row.fecha_creacion == 'Sin Registrar'? 'text-grey': 'text-black'">
                          <q-icon name="event" class="q-pr-xs" :color="props.row.fecha_creacion == 'Sin Registrar' ? 'grey' : 'blue'" />
                          {{ props.row.fecha_creacion }}
                        </q-td>
                        <q-td key="name" :props="props" :class="
                          $q.dark.isActive
                            ? 'text-white'
                            : props.row.fecha_cierre == 'Sin Registrar'
                            ? 'text-grey'
                            : 'text-black'
                        ">
                          <q-icon name="event" class="q-pr-xs" :color="
                            props.row.fecha_cierre == 'Sin Registrar'
                              ? 'grey'
                              : 'blue'
                          " />
                          {{ props.row.fecha_cierre }}
                        </q-td>
                        <q-td key="name" :props="props" :class="
                          $q.dark.isActive
                            ? 'text-white'
                            : props.row.asignado == 'Sin Registrar'
                            ? 'text-grey'
                            : 'text-black'
                        ">
                          <q-icon name="person" class="q-pr-xs" :color="
                            props.row.asignado == 'Sin Registrar'
                              ? 'grey'
                              : 'blue'
                          " />
                          {{ props.row.asignado }}
                        </q-td>
                        <q-td key="name" :props="props">
                          <q-chip color="teal" size="sm" text-color="white">
                            {{props.row.monto.toLocaleString('en-ES', { minimumFractionDigits: 2})}}
                            {{props.row.moneda}}
                          </q-chip>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>                                 
                </template>
                <template v-else>
                  <q-list bordered class="rounded-borders">
                    <template v-for="row2,index in filterdocRelation" :key="index">
                      <q-item v-if="cod_amercado===row2.idamercado">
                        <q-item-section avatar>
                          <a :href="link+row2.id" target="_blank" style="text-decoration: none;">
                            <q-btn size="sm" round
                              :color="row2.estado =='En Tratamiento' ? 'orange' : row2.estado =='Ganado'  ? 'green':'red' "
                              :icon="row2.estado =='Ganado' ? 'check': row2.estado =='En Tratamiento' ? 'work_history': 'trending_down'">
                            </q-btn>
                          </a>
                        </q-item-section>
                        <q-item-section>
                          <a :href="link+row2.id" target="_blank" style="text-decoration: none;">
                            <q-item-label lines="5" class="text-primary">{{row2.name}}</q-item-label>
                          </a> <span
                            :class="row2.estado =='En Tratamiento' ? 'text-orange' : row2.estado =='Ganado'  ? 'text-green':'text-red' ">{{row2.estado}}</span>
                          <q-item-label caption lines="3" v-show="!$q.screen.xs ? false:true">
                            <span class="text-weight-regular text-primary">Fecha Cierre:</span>
                          </q-item-label>
                          <q-item-label caption lines="3" v-show="!$q.screen.xs ? false:true">
                            <span class="text-black"> {{row2.fecha_cierre}}</span>
                          </q-item-label>
                          <q-item-label caption lines="3" v-show="!$q.screen.xs ? false:true">
                            <span class="text-weight-regular text-primary">Monto:</span>
                          </q-item-label>
                          <q-item-label caption lines="3" v-show="!$q.screen.xs ? false:true">
                            <span class="text-black"> {{row2.monto.toLocaleString('en-ES', { minimumFractionDigits:2})}}
                              {{row2.moneda}}</span>
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-separator inset="item" v-if="cod_amercado===row2.idamercado" />
                    </template>
                  </q-list>
                </template>
                <q-separator />
              </q-expansion-item>
            </template>
          </q-list>
        </template>
        <template v-else>
          <q-card style="height: 60vh; width:100%;" flat class="my-card  column flex-center">
            <img src="list-empty.png" alt="lista vacia" style="width: 220px; height: 200px" />
            <br /><br />
            <div class="text-h6 text-dark text-center">
              Lista vacía <br />
              <small class="text-grey-5">No se encontraron oportunidades relacionadas...</small>
            </div>
          </q-card>
        </template>
      </div>
      <!-- <pre>{{filterdocRelation}}</pre> -->
    </q-card-section>
  </q-card>

  <q-card v-else style="height: 60vh; width:100%;">
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
    name: 'ViewOpportunities',
  });
</script>
<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useDivAreaMercado } from 'src/composables/useLanguage';
  import { ContactStore } from '../store/ContactStore';
  import { HANSACRM3_URL } from 'src/conections/api_conectors';
  import { userStore } from 'src/modules/Users/store/UserStore';
  const { userCRM } = userStore();
  //const iddivision = userCRM.iddivision;
  const { getContactsOportunities } = ContactStore();
  const props = defineProps < {
    id: string;
    idAccount:string;
    nameAccount: string;
  } > ();
  const filter = ref('');
  const listAMercado = ref([]);
  const ActiveSqeleton = ref(false);
  const documentRelation = ref([] as { [key: string]: string }[]);
  onMounted(async () => {
    if(userCRM.iddivision==''){userCRM.iddivision='todas'}
    documentRelation.value = await getContactsOportunities(props.id, userCRM.iddivision);
    ActiveSqeleton.value = true;
    listAMercado.value = await useDivAreaMercado(userCRM.iddivision);
  })

  const openwindows = (id:string) => {
  //console.log(id);
  const url=link+id;
  window.open(url, '_blank')
  };

  const filterdocRelation = computed(() => {
  return documentRelation.value.filter(
    (objeto) =>
      (objeto.name.toLowerCase().indexOf(filter.value.toLowerCase()) > -1) ||
      (objeto.estado.toLowerCase().indexOf(filter.value.toLowerCase()) > -1) ||
      (objeto.asignado.toLowerCase().indexOf(filter.value.toLowerCase()) > -1) 
  );
  });
  const link = HANSACRM3_URL + '/index.php?module=Opportunities&action=DetailView&record=';
  const linkCreated = HANSACRM3_URL + '/index.php?module=Opportunities&action=EditView&billing_account_id='+props.idAccount+'&billing_account='+props.nameAccount;
  // const amercado = [
  //   {
  //     text: '01 Unidades Nuevas',
  //     value: '03_01',
  //     div:'03'
  //   },
  //   {
  //     text: '02 Repuestos',
  //     value: '03_02',
  //     div:'03'
  //   },
  //   {
  //     text: '03 Servicios Camiones',
  //     value: '03_03',
  //     div:'03'
  //   },
  //   {
  //     text: '04 Camiones y Buses',
  //     value: '03_04',
  //     div:'03'
  //   },
  //   {
  //     text: '05 Servicios Unid. Nuevas',
  //     value: '03_05',
  //     div:'03'
  //   },
  //   {
  //     text: '06 Audi',
  //     value: '03_06',
  //     div:'03'
  //   },
  //   {
  //     text: '07 Vehiculos Comerciales',
  //     value: '03_07',
  //     div:'03'
  //   },
  //   {
  //     text: '08 Repuestos Camiones',
  //     value: '03_08',
  //     div:'03'
  //   },
  //   {
  //     text: '09 Org. y Técnica',
  //     value: '03_09',
  //     div:'03'
  //   },
  //   {
  //     text: '10 Mod Center',
  //     value: '03_10',
  //     div:'03'
  //   },
  //   {
  //     text: '11 Seminuevos',
  //     value: '03_11',
  //     div:'03'
  //   },
  //   {
  //     text: '12 Supervisión Talleres Camiones',
  //     value: '03_12',
  //     div:'03'
  //   },

  //   {
  //     text: '01 Herramientas Bosc',
  //     value: '01_01',
  //     div:'01'
  //   },
  //   {
  //     text: '02 Servicio Técnico',
  //     value: '01_02',
  //     div:'01'
  //   },
  //   {
  //     text: '03 Construcción',
  //     value: '01_03',
  //     div:'01'
  //   },
  //   {
  //     text: '04 Material Eléctric',
  //     value: '01_04',
  //     div:'01'
  //   },
  //   {
  //     text: '05 Iluminación',
  //     value: '01_05',
  //     div:'01'
  //   },
  //   {
  //     text: '06 Bombas',
  //     value: '01_06',
  //     div:'01'
  //   },

  //   {
  //     text: '01 Imagenología',
  //     value: '04_01',
  //     div:'04'
  //   },
  //   {
  //     text: '02 Consumibles',
  //     value: '04_02',
  //     div:'04'
  //   },
  //   {
  //     text: '03 Endoscopía',
  //     value: '04_03',
  //     div:'04'
  //   },
  //   {
  //     text: '04 Servicio Técnico',
  //     value: '04_04',
  //     div:'04'
  //   },
  //   {
  //     text: '05 Cirugía',
  //     value: '04_05',
  //     div:'04'
  //   },
  //   {
  //     text: '06 Dental',
  //     value: '04_06',
  //     div:'04'
  //   }
  // ]
  // const division = [
  //   {
  //     text: '01 Industria & Construcción',
  //     value: '01',
  //   },
  //   {
  //     text: '02 Consumo & Pharma',
  //     value: '02',
  //   },
  //   {
  //     text: '03 Automotriz',
  //     value: '03',
  //   },
  //   {
  //     text: '04 Soluciones Médicas',
  //     value: '04',
  //   },
  //   {
  //     text: '05 Energía & Automatización',
  //     value: '05',
  //   },
  //   {
  //     text: '06 Proyectos & Servicios',
  //     value: '06',
  //   },
  //   {
  //     text: '07 Windsor',
  //     value: '07',
  //   },
  //   {
  //     text: '98 Holding',
  //     value: '98',
  //   },
  //   {
  //     text: '99 Administración & Finanzas',
  //     value: '99',
  //   }
  // ]

  const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 2000,
  });

  const columns: {
    name: string;
    align: string;
    label: string;
    field: string;
    sortable?: boolean;
  }[] = [
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
      }, {
        name: 'monto',
        align: 'left',
        label: 'Monto',
        field: 'monto',
        sortable: true,
      }
    ];
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