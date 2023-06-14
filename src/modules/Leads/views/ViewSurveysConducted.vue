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
      </div>
      <div class="col-xs-12 col-md-3 q-pa-md">
        <template v-if="filterdocRelation.length > 0">
          <q-table :flat="!$q.screen.xs ? true : false" :grid="$q.screen.xs" :rows="filterdocRelation"
            :columns="columns" row-key="name" :pagination="pagination" hide-bottom>
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
                   "  >
                  </q-btn>
                </q-td>
                <q-td key="name" :props="props">
                  <q-item-label @click="openSurveys(props.row.id,props.row.survey_id,props.row.name)" class="text-primary cursor-pointer text-weight-bold" >{{props.row.name}}</q-item-label>                  
                </q-td>
                <q-td key="name" :props="props">
                  <q-checkbox v-model="props.row.email_opened" disable/>
                </q-td>
                <q-td key="name" :props="props" >
                  <q-checkbox v-model="props.row.survey_send" disable/>
                </q-td>
              
                <q-td key="name" :props="props">
                  <q-icon name="event" size="xs" :color="
                     props.row.programacion == 'Sin Registrar' ? 'grey' : 'primary'
                   " />
                  {{ props.row.programacion }}
                </q-td>
                <q-td key="name" :props="props" :class="props.row.status == 'Entregado' ? 'text-green' : props.row.status == 'Entregado y Verificado' ? 'text-teal':'text-grey'">
                  <q-icon :name="props.row.status == 'Entregado' ? 'task_alt' 
                       : 'verified_user'" size="xs" class="q-pr-xs" :color="props.row.status == 'Entregado' ? 'text-green' : props.row.status == 'Entregado y Verificado' ? 'text-teal':'text-grey'" />
                  {{ props.row.status }}

                </q-td>
                <q-td key="name" :props="props">
                  <q-icon name="star" size="xs" color="red" v-if="props.row.score_percentage>1"/>
                  <q-icon name="star" size="xs" color="orange" v-if="props.row.score_percentage>50"/>
                  <q-icon name="star" size="xs" color="yellow" v-if="props.row.score_percentage>90"/> 
                 {{ props.row.score_percentage }}
                </q-td>
                <!-- <q-td key="name" :props="props">
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
                </q-td> -->
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

  <InfoCardSurveys
    ref="emailEditDialog"
    :asunto="nombreEncuesta"
    :idSurveys="idSurvey"
    :idLeads="idModule"
  />
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import InfoCardSurveys from 'src/components/Surveys/Dialog/Card/InfoCardSurveys.vue';
  export default defineComponent({
    name: 'ViewCampaigns',
  });
</script>
<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useLeadsStore } from '../../Leads/store/LeadsStore';
  import { HANSACRM3_URL } from 'src/conections/api_conectors';
  // import { userStore } from 'src/modules/Users/store/UserStore';

  // const { userCRM } = userStore();
  const { getLeadsSurveysConducted } = useLeadsStore();
  const props = defineProps < {
    id: string;
  } > ();
  const filter = ref('');
  const ActiveSqeleton = ref(false);
  const documentRelation = ref([] as { [key: string]: string }[]);
  const emailEditDialog = ref ();
  const nombreEncuesta = ref('');
  const idModule = ref('');
  const idSurvey = ref('');

  onMounted(async () => {
    documentRelation.value = await getLeadsSurveysConducted(props.id);
    ActiveSqeleton.value = true;
  });

  const openwindows = (id: string) => {
    const url = link + id;
    window.open(url, '_blank')
  };

  const filterdocRelation = computed(() => {
    return documentRelation.value.filter(
      (objeto) =>
        (objeto.name.toLowerCase().indexOf(filter.value.toLowerCase()) > -1) ||
        (objeto.status.toLowerCase().indexOf(filter.value.toLowerCase()) > -1)
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
        name: 'name',
        align: 'left',
        label: 'Encuesta',
        field: 'nombre',
        sortable: true,
      },
      {
        name: 'fecha_entrega',
        align: 'left',
        label: 'Correo electronico abierto',
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
        name: 'asignado',
        align: 'left',
        label: 'Encuesta enviada',
        field: 'asignado',
        sortable: true,
      },
      {
        name: 'amercado',
        align: 'left',
        label: 'Programacion',
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

  const openSurveys = (id: string,id_surveys:string,nombre:string) => {
 
    
    emailEditDialog.value.open = true;
    nombreEncuesta.value = nombre;
    idModule.value = id;
    idSurvey.value = id_surveys;
    
};
</script>

<style lang="scss" scoped>

.q-table--no-wrap th,
.q-table--no-wrap td {
  white-space: revert;
}

</style>
