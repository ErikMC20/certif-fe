<template>
  <q-card class="my-card" v-if="ActiveSqeleton" style="min-height: 80vh">
    <q-card-section>
      <div class="row col-12 justify-between">
        <div class="col-xl-2 col-lg-3 col-md-4 col-sm-12 col-xs-12 q-mb-sm">
          <q-input
            bottom-slots
            dense
            v-model="filter"
            placeholder="Buscar registro nombre campaña"
          >
            <!-- <template v-slot:hint>
              <span class="text-primary">{{
                filterdocRelation.length == 1
                ? filterdocRelation.length + ' Campaña encontrada'
                : filterdocRelation.length + ' Campañas encontradas'
                }}
              </span>
            </template> -->
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
              <!-- <q-btn :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'" color="primary" @click="$emit('openDialog')"
                label="Seleccionar" size="md" /> -->
              <q-btn
                :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'"
                color="primary"
                @click="openDialogFilter"
                label="buscar y agregar"
                size="md"
              />
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
          <span class="text-subtitle2">Campañas relacionadas a la cuenta</span>
          <q-separator spaced color="primary" />
          <q-list class="rounded-borders">
            <template v-for="(row, index2) in filterdocRelation" :key="index2">
              <div
                v-if="filterdocRelation.filter((v:any) => v.id_campania == row.id_campania && v.id_usuario == row.id_usuario).length<=1"
              >
                <q-item v-if="row.nombre_oportunidad == 'sin oportunidad'">
                  <q-item-section avatar>
                    <q-avatar
                      color="orange"
                      size="md"
                      text-color="white"
                      icon="campaign"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label lines="5" class="text-primary">{{
                      row.campania
                    }}</q-item-label>
                    <q-item-label
                      lines="5"
                      caption
                      class="text-grey"
                      v-if="!$q.screen.xs ? false : true"
                    >
                      <q-icon name="person" class="q-pr-xs" />Usuario asignado
                    </q-item-label>
                    <q-item-label
                      caption
                      lines="4"
                      class="text-black q-pr-xs"
                      v-if="!$q.screen.xs ? false : true"
                    >
                      {{ row.asignado }}
                    </q-item-label>
                    <q-item-label
                      lines="5"
                      caption
                      class="text-grey"
                      v-if="!$q.screen.xs ? false : true"
                    >
                      <q-icon name="event" class="q-pr-xs" />
                      Fecha modificación
                    </q-item-label>
                    <q-item-label
                      caption
                      lines="4"
                      class="text-black"
                      v-if="!$q.screen.xs ? false : true"
                    >
                      {{ row.f_modificacion }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section v-if="$q.screen.xs ? false : true">
                    <q-item-label lines="5" caption class="text-grey">
                      <q-icon name="person" class="q-pr-xs" />Usuario asignado
                    </q-item-label>
                    <q-item-label
                      caption
                      lines="4"
                      class="text-black q-pr-xs"
                      >{{ row.asignado }}</q-item-label
                    >
                  </q-item-section>
                  <q-item-section v-if="$q.screen.xs ? false : true">
                    <q-item-label lines="5" caption class="text-grey">
                      <q-icon name="event" class="q-pr-xs" />Fecha modificación
                    </q-item-label>
                    <q-item-label caption lines="4" class="text-black">{{
                      row.f_modificacion
                    }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
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
                            <q-item-section
                              @click="
                                deleteRelation(
                                  row.id_cuenta,
                                  row.id_campania,
                                  row.id_atributosMarketing
                                )
                              "
                              >Quitar</q-item-section
                            >
                          </q-item>
                          <q-separator />
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </q-item-section>
                </q-item>
                <div
                  v-if="filterdocRelation.filter((v:any) => v.id_campania == row.id_campania && v.id_usuario == row.id_usuario).length<=1"
                >
                  <q-separator
                    inset="item"
                    v-if="row.nombre_oportunidad == 'sin oportunidad'"
                  />
                </div>
              </div>
            </template>
          </q-list>
          <br />
          <br />
          <span class="text-subtitle2"
            >Campañas relacionadas a las oportunidades de la cuenta</span
          >
          <q-separator spaced color="primary" />
          <q-list class="rounded-borders">
            <template v-for="(row, index) in filterdocRelation" :key="index">
              <q-item v-if="row.nombre_oportunidad !== 'sin oportunidad'">
                <q-item-section avatar>
                  <q-avatar
                    color="orange"
                    size="md"
                    text-color="white"
                    icon="campaign"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label lines="5" class="text-primary">{{
                    row.campania
                  }}</q-item-label>
                  <q-item-label
                    lines="5"
                    caption
                    class="text-grey"
                    v-if="!$q.screen.xs ? false : true"
                  >
                    <q-icon name="person" class="q-pr-xs" />Usuario asignado
                  </q-item-label>
                  <q-item-label
                    caption
                    lines="4"
                    class="text-black q-pr-xs"
                    v-if="!$q.screen.xs ? false : true"
                  >
                    {{ row.asignado }}
                  </q-item-label>
                  <q-item-label
                    lines="5"
                    caption
                    class="text-grey"
                    v-if="!$q.screen.xs ? false : true"
                  >
                    <q-icon name="event" class="q-pr-xs" />
                    Nombre de la oportunidad
                  </q-item-label>
                  <q-item-label
                    caption
                    lines="4"
                    class="text-black"
                    v-if="!$q.screen.xs ? false : true"
                  >
                    {{ row.nombre_oportunidad }}
                  </q-item-label>
                  <q-item-label
                    lines="5"
                    caption
                    class="text-grey"
                    v-if="!$q.screen.xs ? false : true"
                  >
                    <q-icon name="event" class="q-pr-xs" />
                    Fecha modificación
                  </q-item-label>
                  <q-item-label
                    caption
                    lines="4"
                    class="text-black"
                    v-if="!$q.screen.xs ? false : true"
                  >
                    {{ row.f_modificacion }}
                  </q-item-label>
                </q-item-section>
                <q-item-section v-if="$q.screen.xs ? false : true">
                  <q-item-label lines="5" caption class="text-grey">
                    Nombre de la oportunidad
                  </q-item-label>
                  <q-item-label lines="4" class="text-primary q-pr-xs">{{
                    row.nombre_oportunidad
                  }}</q-item-label>
                </q-item-section>
                <q-item-section v-if="$q.screen.xs ? false : true">
                  <q-item-label lines="5" caption class="text-grey">
                    <q-icon name="person" class="q-pr-xs" />Usuario Asignado
                  </q-item-label>
                  <q-item-label caption lines="4" class="text-black">{{
                    row.asignado
                  }}</q-item-label>
                </q-item-section>
                <q-item-section v-if="$q.screen.xs ? false : true">
                  <q-item-label lines="5" caption class="text-grey">
                    <q-icon name="event" class="q-pr-xs" />Fecha de relacion
                  </q-item-label>
                  <q-item-label caption lines="4" class="text-black">{{
                    row.f_modificacion
                  }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator
                inset="item"
                v-if="row.nombre_oportunidad !== 'sin oportunidad'"
              />
            </template>
          </q-list>
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
                >No se encontraron campañas relacionadas...</small
              >
            </div>
          </q-card>
        </template>
      </div>
    </q-card-section>
    <q-inner-loading
      :showing="cargarcami"
      label="Asignando la campaña..."
      label-class="text-primary"
      label-style="font-size: 1.1em"
    />
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
  <AdvancedFilterCampaign
    ref="advancedFilter"
    @selectItem="selectItem"
    :module_id="idAccount"
  />
  <AlertComponent
    v-model="show_add"
    v-bind="propsCreateAlert"
    @confirm="onSubmitRelation"
    @denegate="onCancelRelation"
  >
    <template #body>
      <div>
         <span>
        <strong> {{ selected.nombre }} </strong> Esta seguro de relacionar la
        campaña con la cuenta?
      </span>
      
      </div>

      <div>
        <AssignedSingleUserTask
        ref="assignedSingleUserRef"
        :module="'Accounts'"
        :module-id="'1b662fdb-486e-5e6a-45b9-5d252102f190'"
        :withList="true"
        @changeUser="onChangeUserAssigned"
      />
      </div>
     
     
      
        
      
     
    </template>
   
  </AlertComponent>

  <AlertComponent
    v-model="show_add2"
    v-bind="propsCreateAlert"
    @confirm="onSubmitRelation2"
    @denegate="onCancelRelation"
  >
    <template #body>
      <span> Esta seguro de quitar la relación? </span>
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
import { AccountStore } from '../store/AccountStore';
//import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { userStore } from 'src/modules/Users/store/UserStore';
import AdvancedFilterCampaign from '../../../modules/Prospects/components/AdvancedFilterCampaign.vue';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
import { defineComponent } from 'vue';
//import { api } from 'src/boot/axios';
import { axios_LB_03, axios_LB_01 } from 'src/conections/axiosCRM';
const { userCRM } = userStore();
const { getAccountsCampaing } = AccountStore();
const props = defineProps<{
  idAccount: string;
}>();
const filter = ref('');
const show_add = ref(false);
const show_add2 = ref(false);
const selected = ref({} as { nombre: string });
const data = ref({
  campaign_name: '',
  campaign: '',
  assigned_user: '',
});
const ActiveSqeleton = ref(false);
const documentRelation = ref([] as { [key: string]: string }[]);
const advancedFilter = ref();
const cargarcami = ref(false);

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
  id_cuenta: '',
  id_campania: '',
  id_atributo: '',
};

const dataSend = {
  module: 'Accounts',
  id_user: '0051F8EE-3D26-4604-B045-DAF75B96F72',
  list_id_modules: [
    {
      id: '000172FA-AB1F-4821-819D-13BB4A8744D9',
    },
  ],
  campaign: {
    id: '2494863c-b114-7fad-62f2-5c59e1a3fd49',
    assigned_user_id: userCRM.id,
    name: 'campaña 2019',
  },
};

const selectItem = async (item: { id: string; nombre: string }) => {
  show_add.value = true;
  data.value.campaign = item.id;
  data.value.campaign_name = item.nombre;
};

onMounted(async () => {
  documentRelation.value = await getAccountsCampaing(
    props.idAccount,
    userCRM.iddivision
  );
  // console.log(userCRM.iddivision);
  // console.log(userCRM.id);
  ActiveSqeleton.value = true;
});

const openDialogFilter = () => {
  advancedFilter.value.openDialog();
};

const onSubmitRelation = async () => {
  cargarcami.value = true;
  dataSend.id_user = userCRM.id;
  dataSend.list_id_modules[0].id = props.idAccount;
  dataSend.campaign.id = data.value.campaign;
  dataSend.campaign.name = data.value.campaign_name;
  // dataSend.campaign.assigned_user_id=userCRM.id;
  //console.log(dataSend.campaign.assigned_user_id);
  const response = await axios_LB_03.post(
    '/bulk-module-accounts-update ',
    dataSend
  );
  documentRelation.value = await getAccountsCampaing(
    props.idAccount,
    userCRM.iddivision
  );
  cargarcami.value = false;
};

const deleteRelation = (
  id_cuenta: string,
  id_campania: string,
  id_atributoM: string
) => {
  show_add2.value = true;
  dataDeletedSend.id_cuenta = id_cuenta;
  dataDeletedSend.id_campania = id_campania;
  dataDeletedSend.id_atributo = id_atributoM;
};

const onSubmitRelation2 = async () => {
  cargarcami.value = true;
  const response = await axios_LB_01.delete(
    `/account_related_campaings/${dataDeletedSend.id_cuenta}/${dataDeletedSend.id_campania}/${dataDeletedSend.id_atributo} `
  );
  documentRelation.value = await getAccountsCampaing(
    props.idAccount,
    userCRM.iddivision
  );
  cargarcami.value = false;
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

const assignedSingleUserRef = ref<InstanceType<
  typeof AssignedSingleUserTask
> | null>(null);

const onChangeUserAssigned = async (id: string) => {
  dataSend.campaign.assigned_user_id = id;
  //console.log(id);
};
</script>
<style scoped>
#mapid {
  width: 700px;
  height: 600px;
}
</style>
