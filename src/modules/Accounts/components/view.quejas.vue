<template>
  <q-card class="my-card" v-if="ActiveSqeleton" style="min-height: 80vh">
    <q-card-section>
      <div class="row col-12 justify-between">
        <div class="col-xl-2 col-lg-3 col-md-4 col-sm-12 col-xs-12 q-mb-sm">
          <q-input
            bottom-slots
            dense
            v-model="filter"
            placeholder="Buscar por #, queja y responsable"
          >
            <template v-slot:hint>
              <span class="text-primary"
                >{{
                  filterdocRelation.length == 1
                    ? filterdocRelation.length + ' Queja encontrada'
                    : filterdocRelation.length + ' Quejas encontradas'
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
                icon="update"
                :color="$q.dark.isActive ? 'grey-3' : 'primary'"
                dense
                flat
                @click="reloadComplaint"
                :label="`${$q.screen.xs ? '' : ''}`"
              />
              <div class="q-gutter-xs">
                <q-btn
                  :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'"
                  color="primary"
                  target="_blank"
                  @click="createNewComplaint(props.idAccount)"
                  label="Nueva Queja"
                  size="md"
                />
                <!-- <q-btn
                :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'"
                color="primary"
                @click="$emit('openDialog')"
                label="Seleccionar"
                size="md"
              /> -->
                <!-- <q-btn color="primary" icon="add" class="mobile-only" /> -->
              </div>
            </slot>
          </div>
        </div>
      </div>
      <div>
        <template v-if="filterdocRelation.length > 0">
          <template v-for="(row, index) in division" :key="index">
            <q-expansion-item
              :label="row.text"
              :caption="filterdocRelation.filter((v:any) => v.iddivision_c === row.value).length == 1 ? filterdocRelation.filter((v:any) => v.iddivision_c === row.value).length+' Queja' : filterdocRelation.filter((v:any) => v.iddivision_c === row.value).length+' Quejas'"
              header-class="text-blue"
              popup
              v-if="filterdocRelation.filter((v:any) => v.iddivision_c === row.value).length > 0"
            >
              <template v-for="(row2, index) in filterdocRelation" :key="index">
                <div class="q-pa-sm" v-if="row.value === row2.iddivision_c">
                  <q-item dense clickable @click="openwindows(row2.id)">
                    <q-item-section avatar>
                      <!-- <a :href="link+row2.id" target="_blank" style="text-decoration: none;"> -->
                      <q-avatar
                        color="red"
                        size="md"
                        text-color="white"
                        icon="record_voice_over"
                      />
                      <!-- </a> -->
                    </q-item-section>
                    <q-item-section v-show="$q.screen.xs ? false : true">
                      <q-item-label class="text-black">
                        # {{ row2.numero }}
                        <q-chip
                          outline
                          color="black"
                          text-color="black"
                          size="sm"
                        >
                          {{ row2.estadotext }}
                        </q-chip>
                      </q-item-label>
                      <q-item-label caption class="text-grey"
                        >Responsable:</q-item-label
                      >
                      <q-item-label caption lines="4" class="text-black">{{
                        row2.responsable_queja
                      }}</q-item-label>
                    </q-item-section>

                    <q-item-section v-show="$q.screen.xs ? false : true">
                      <q-item-label caption class="text-grey"
                        >Área de mercado</q-item-label
                      >
                      <q-item-label caption lines="4" class="text-black">{{
                        row2.amercado
                      }}</q-item-label>
                      <q-item-label caption class="text-grey"
                        >Proceso afectado</q-item-label
                      >
                      <q-item-label caption lines="4" class="text-black">{{
                        row2.areaafectada
                      }}</q-item-label>
                    </q-item-section>

                    <q-item-section v-show="$q.screen.xs ? false : true">
                      <q-item-label caption class="text-grey"
                        >Queja Frecuente</q-item-label
                      >
                      <q-item-label caption lines="4" class="text-black">{{
                        row2.queja_frecuente
                      }}</q-item-label>
                      <q-item-label caption class="text-grey"
                        >Motivo de la queja</q-item-label
                      >
                      <q-item-label caption lines="4" class="text-black">{{
                        row2.motivo_reclamo
                      }}</q-item-label>
                    </q-item-section>

                    <q-item-section v-show="$q.screen.xs ? false : true">
                      <q-item-label caption class="text-grey"
                        >Fecha creacion</q-item-label
                      >
                      <q-item-label caption lines="4" class="text-black">{{
                        row2.fecha_creacion
                      }}</q-item-label>
                      <!-- <q-item-label caption class="text-grey">Etapa a realizar</q-item-label>
                      <q-item-label caption lines="4" class="text-black">{{ row2. etaparealizar}}</q-item-label> -->
                      <q-item-label caption class="text-grey"
                        >Dias transcurridos</q-item-label
                      >
                      <q-item-label caption lines="4" class="text-orange">{{
                        row2.dias_transcurridos
                      }}</q-item-label>
                    </q-item-section>

                    <q-item-section v-show="!$q.screen.xs ? false : true">
                      <q-item-label caption class="text-grey"
                        >Responsable:</q-item-label
                      >
                      <q-item-label caption lines="4" class="text-black">{{
                        row2.responsable_queja
                      }}</q-item-label>
                      <q-item-label class="text-black">
                        # {{ row2.numero }}
                        <q-chip
                          outline
                          color="black"
                          text-color="black"
                          size="sm"
                        >
                          {{ row2.estadotext }}
                        </q-chip>
                      </q-item-label>
                      <q-item-label caption class="text-grey"
                        >Queja Frecuente</q-item-label
                      >
                      <q-item-label caption lines="4" class="text-black">{{
                        row2.queja_frecuente
                      }}</q-item-label>
                      <q-item-label caption class="text-grey"
                        >Motivo de la queja</q-item-label
                      >
                      <q-item-label caption lines="4" class="text-black">{{
                        row2.motivo_reclamo
                      }}</q-item-label>
                      <q-item-label caption class="text-grey"
                        >Área de mercado</q-item-label
                      >
                      <q-item-label caption lines="4" class="text-black">{{
                        row2.amercado
                      }}</q-item-label>
                      <q-item-label caption class="text-grey"
                        >Proceso afectado</q-item-label
                      >
                      <q-item-label caption lines="4" class="text-black">{{
                        row2.areaafectada
                      }}</q-item-label>
                      <q-item-label caption class="text-grey"
                        >Dias transcurridos</q-item-label
                      >
                      <q-item-label caption lines="4" class="text-black">{{
                        row2.dias_transcurridos
                      }}</q-item-label>
                      <q-item-label caption class="text-grey"
                        >Fecha creacion</q-item-label
                      >
                      <q-item-label caption lines="4" class="text-black">{{
                        row2.fecha_creacion
                      }}</q-item-label>
                    </q-item-section>

                    <!-- <q-btn
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
                    </q-btn> -->
                  </q-item>
                  <q-separator v-if="row.value === row2.iddivision_c" />
                </div>
              </template>
              <q-separator />
            </q-expansion-item>
          </template>
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
                >No se encontraron quejas relacionadas...</small
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
  name: 'ViewQuejas',
});
</script>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { AccountStore } from '../store/AccountStore';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { userStore } from 'src/modules/Users/store/UserStore';

const { userCRM } = userStore();
const { getAccountsQuejas } = AccountStore();
const props = defineProps<{
  idAccount: string;
}>();
const filter = ref('');
const ActiveSqeleton = ref(false);
const documentRelation = ref([] as { [key: string]: string }[]);

onMounted(async () => {
  documentRelation.value = await getAccountsQuejas(
    props.idAccount,
    'accounts',
    userCRM.iddivision
  );
  ActiveSqeleton.value = true;
});

const reloadComplaint = async () => {
  console.log('recargar la lista de las quejas');
  documentRelation.value = await getAccountsQuejas(
    props.idAccount,
    'accounts',
    userCRM.iddivision
  );
};

const createNewComplaint = (idAcc: string) => {
  console.log('crear una nueva queja');
  window.open(
    HANSACRM3_URL +
      '/index.php?module=HANT_Quejas&action=EditView&return_module=HANT_Quejas&return_action=DetailView'
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
      objeto.queja_frecuente.toLowerCase().indexOf(filter.value.toLowerCase()) >
        -1 ||
      objeto.numero.toLowerCase().indexOf(filter.value.toLowerCase()) > -1 ||
      objeto.responsable_queja
        .toLowerCase()
        .indexOf(filter.value.toLowerCase()) > -1
  );
});

const link =
  HANSACRM3_URL + '/index.php?module=HANT_Quejas&action=DetailView&record=';
const division = [
  {
    text: '01 Industria & Construcción',
    value: '01',
  },
  {
    text: '02 Consumo & Pharma',
    value: '02',
  },
  {
    text: '03 Automotriz',
    value: '03',
  },
  {
    text: '04 Soluciones Médicas',
    value: '04',
  },
  {
    text: '05 Energía & Automatización',
    value: '05',
  },
  {
    text: '06 Proyectos & Servicios',
    value: '06',
  },
  {
    text: '07 Windsor',
    value: '07',
  },
  {
    text: '98 Holding',
    value: '98',
  },
  {
    text: '99 Administración & Finanzas',
    value: '99',
  },
];
</script>
<style scoped>
#mapid {
  width: 700px;
  height: 600px;
}
</style>
