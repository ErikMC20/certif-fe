<template>
  <q-card class="my-card" v-if="ActiveSqeleton" style="min-height: 80vh">
    <q-card-section>
      <div class="row col-12 justify-between">
        <div class="col-xl-2 col-lg-3 col-md-4 col-sm-12 col-xs-12 q-mb-sm">
          <q-input bottom-slots dense v-model="filter" placeholder="Buscar registro nombre campaña">
            <template v-slot:hint>
              <span class="text-primary">{{
                filterdocRelation.length == 1
                ? filterdocRelation.length + ' Campaña encontrada'
                : filterdocRelation.length + ' Campañas encontradas'
                }}
              </span>
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
              <q-btn :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'" color="primary" @click="openDialogFilter"
                label="buscar y agregar" size="md" />
              <!-- <q-btn
                :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'"
                color="primary"
                @click="updateDatosPros"
                label="Seleccionar"
                size="md"
              /> -->
            </slot>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-md-3 q-pa-md">
        <template v-if="filterdocRelation.length > 0">
          <span class="text-subtitle">Campañas relacionadas</span>
          <q-separator spaced color="primary" />
          <q-list class="rounded-borders">
            <template v-for="(row, index2) in filterdocRelation" :key="index2">
              <div>
                <q-item v-if="row.nombre_oportunidad=='sin oportunidad'">
                  <q-item-section avatar>
                    <q-avatar color="orange" size="md" text-color="white" icon="campaign" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label  class="text-primary">{{
                      row.campania
                      }}</q-item-label>
                    <q-item-label  caption class="text-grey" v-if="!$q.screen.xs ? false : true">
                      <q-icon name="person" class="q-pr-xs" />Usuario asignado
                    </q-item-label>
                    <q-item-label caption class="text-black q-pr-xs" v-if="!$q.screen.xs ? false : true">
                      {{ row.asignado }}
                    </q-item-label>
                    <q-item-label  caption class="text-grey" v-if="!$q.screen.xs ? false : true">
                      <q-icon name="event" class="q-pr-xs" />
                      Fecha modificación
                    </q-item-label>
                    <q-item-label caption class="text-black" v-if="!$q.screen.xs ? false : true">
                      {{ row.f_modificacion }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section v-if="$q.screen.xs ? false : true">
                    <q-item-label  caption class="text-grey">
                      <q-icon name="person" class="q-pr-xs" />Usuario
                      asignado
                    </q-item-label>
                    <q-item-label caption class="text-black q-pr-xs">{{
                      row.asignado
                      }}</q-item-label>
                  </q-item-section>
                  <q-item-section v-if="$q.screen.xs ? false : true">
                    <q-item-label  caption class="text-grey">
                      <q-icon name="event" class="q-pr-xs" />Fecha
                      modificación
                    </q-item-label>
                    <q-item-label caption class="text-black">{{
                      row.f_modificacion
                      }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn size="12px" flat dense round icon="more_vert"
                      @click="(event:Event)=>event.stopPropagation()">
                      <q-menu>
                        <q-list style="min-width: 100px" dense>
                          <q-item clickable v-close-popup>
                            <q-item-section
                              @click="deleteRelation(row.id,row.id_campania,row.id_atributosMarketing)">Quitar</q-item-section>
                          </q-item>                  
                          <q-separator />
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </q-item-section>
                </q-item>
                <div
                 >
                  <q-separator inset="item" />
                </div>
              </div>
            </template>
          </q-list>

        </template>
        <template v-else>
          <q-card style="height: 60vh; width: 100%" flat class="my-card column flex-center">
            <img src="list-empty.png" alt="lista vacia" style="width: 220px; height: 200px" />
            <br /><br />
            <div class="text-h6 text-dark text-center">
              Lista vacía <br />
              <small class="text-grey-5">No se encontraron campañas relacionadas...</small>
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
  <AdvancedFilterCampaign ref="advancedFilter" @selectItem="selectItem" :module_id="id" />
  <AlertComponent v-model="show_add" v-bind="propsCreateAlert" @confirm="onSubmitRelation" @denegate="onCancelRelation">
    <template #body>
      <span>
        <strong> {{ selected.nombre }} </strong> Esta seguro de relacionar la campaña con el prospecto?
      </span>
      <br>
      <br>
      <div class="col-12">
        <AssignedSingleUserTask ref="assignedSingleUserRef" :module="'Leads'"
          :module-id="'1b662fdb-486e-5e6a-45b9-5d252102f190'" :withList="true" @changeUser="onChangeUserAssigned" />
      </div>
    </template>
  </AlertComponent>
  <AlertComponent v-model="show_add2" v-bind="propsCreateAlert" @confirm="onSubmitRelation2"
    @denegate="onCancelRelation">
    <template #body>
      <span>
        Esta seguro de quitar la relación?
      </span>
    </template>
  </AlertComponent>
</template>
<script lang="ts">
  export default defineComponent({
    name: 'ViewCampaigns',
  });
</script>
<script setup lang="ts">
  import AssignedSingleUserTask from 'src/components/AssignedUsers/AssignedSingleUserTask.vue';
  import { ref, onMounted, computed } from 'vue';
  import { useProspectStore } from '../store/ProspectStore';
  import { userStore } from 'src/modules/Users/store/UserStore';
  import AdvancedFilterCampaign from '../../../modules/Prospects/components/AdvancedFilterCampaign.vue';
  import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
  import { defineComponent } from 'vue';
  import {
    axios_LB_03,
    axios_LB_01,
  } from 'src/conections/axiosCRM';
  const { userCRM } = userStore();
  const { getProspectsCampaing } = useProspectStore();
  const props = defineProps < {
    id: string;
  } > ();
  const filter = ref('');
  const show_add = ref(false);
  const show_add2 = ref(false);
  const selected = ref({} as any);
  const data = ref({
    campaign_name: '',
    campaign: '',
    assigned_user: '',
  });
  const ActiveSqeleton = ref(false);
  const documentRelation = ref([] as { [key: string]: string }[]);
  const advancedFilter = ref();

  const propsCreateAlert = {
    title: 'Alerta de confirmación',
    icon: 'person',
    iconSize: 'md',
    message: '',
    iconColor: 'primary',
    btnColor: 'primary',
    btnText: 'Si, estoy seguro',
  };

  const dataDeletedSend = {
    id_leads: '',
    id_campania: '',
    id_atributo: '',
  };

  const dataSend = {
    id_prospect: 'a6fd1753-caa5-f9ab-c72a-63bf1c76156c',
    id_campaing: '73be0498-75c3-3537-36e4-57a11e3ed3cd',
    id_user_create: '1b662fdb-486e-5e6a-45b9-5d252102f190',
    id_asigned_user: '1b662fdb-486e-5e6a-45b9-5d252102f190',
    name_campaign: 'Nuevo Gol 2016'
  };

  onMounted(async () => {
    documentRelation.value = await getProspectsCampaing(
      props.id,
      userCRM.iddivision
    );
    ActiveSqeleton.value = true;
  });

  const selectItem = async (item: any) => {
    show_add.value = true;
    data.value.campaign = item.id;
    data.value.campaign_name = item.nombre;
  };

  const openDialogFilter = () => {
    advancedFilter.value.openDialog();
  };

  const onSubmitRelation = async () => {
    dataSend.id_asigned_user = userCRM.id;
    dataSend.id_user_create = userCRM.id;
    dataSend.id_prospect = props.id;
    dataSend.id_campaing = data.value.campaign;
    dataSend.name_campaign = data.value.campaign_name;
    const response = await axios_LB_03.post('/create_related_campaings_prospect', dataSend);
    documentRelation.value = await getProspectsCampaing(
      props.id,
      userCRM.iddivision
    );
  };

  const deleteRelation = (id_leads: string, id_campania: string, id_atributoM: string) => {
    show_add2.value = true;
    dataDeletedSend.id_leads = id_leads;
    dataDeletedSend.id_campania = id_campania;
    dataDeletedSend.id_atributo = id_atributoM;
  };

  const onSubmitRelation2 = async () => {
    const response = await axios_LB_03.delete(`/prospects_related_campaings/${dataDeletedSend.id_leads}/${dataDeletedSend.id_campania}/${dataDeletedSend.id_atributo} `);
    documentRelation.value = await getProspectsCampaing(
      props.id,
      userCRM.iddivision
    );
  };

  const onCancelRelation = () => {
    console.log('se cancelo');
  };

  const filterdocRelation = computed(() => {
    return documentRelation.value.filter(
      (objeto) =>
        objeto.campania.toLowerCase().indexOf(filter.value.toLowerCase()) > -1
    );
  });

  const assignedSingleUserRef = ref < InstanceType <
    typeof AssignedSingleUserTask
    > | null > (null);

  const onChangeUserAssigned = async (id: string) => {
    dataSend.id_asigned_user = id;
  };
</script>
<style scoped>
  #mapid {
    width: 700px;
    height: 600px;
  }
</style>