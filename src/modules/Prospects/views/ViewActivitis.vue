<template>
  <q-card class="my-card" v-if="ActiveSqeleton" style="min-height: 80vh">
    <q-card-section>
      <div class="row col-12 justify-between">
        <div class="col-xl-2 col-lg-3 col-md-4 col-sm-12 col-xs-12 q-mb-sm">
          <q-input
            bottom-slots
            dense
            v-model="filter"
            placeholder="Buscar registro por asunto"
          >
            <template v-slot:hint>
              <span class="text-primary"
                >{{
                  listAux.length == 1
                    ? listAux.length + ' Actividad encontrada'
                    : listAux.length + ' Actividades encontradas'
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
              <q-btn
                :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'"
                color="primary"
                @click="$emit('openDialog')"
                label="Seleccionar"
                size="md"
              />
            </slot>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-md-3 q-pa-md">
        <template v-if="listAux.length > 0">
          <template v-for="(reg, index) in listAux" :key="index">
            <q-item class="q-ma-sm">
              <q-item-section avatar top>
                <q-avatar
                  size="md"
                  :icon="
                    reg.tipo_actividad == 'tarea'
                      ? 'task'
                      : reg.tipo_actividad == 'llamada'
                      ? 'phone'
                      : reg.tipo_actividad == 'reunion'
                      ? 'alarm'
                      : reg.tipo_actividad == 'correo'
                      ? 'email'
                      : ''
                  "
                  :color="
                    reg.tipo_actividad == 'tarea'
                      ? 'teal'
                      : reg.tipo_actividad == 'llamada'
                      ? 'light-blue'
                      : reg.tipo_actividad == 'reunion'
                      ? 'cyan-6'
                      : reg.tipo_actividad == 'correo'
                      ? 'blue-10'
                      : ''
                  "
                  text-color="white"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ reg.asunto }}</q-item-label>
                <q-item-label
                  caption
                  :class="
                    reg.control_vencimiento > 0 &&
                    (reg.estado == 'No iniciada' || reg.estado == 'Planificada')
                      ? 'text-red'
                      : ''
                  "
                  >{{ reg.fecha_ini_fin }}
                  <q-icon name="fiber_manual_record" color="blue-3" />
                  <span class="text-blue-5">{{ reg.asignado }}</span>
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-chip
                  :color="
                    reg.estado == 'Enviado'
                      ? 'green-5'
                      : reg.estado == 'Realizada'
                      ? 'green-5'
                      : reg.estado == 'Completado'
                      ? 'green-5'
                      : reg.estado == 'Planificada'
                      ? 'grey-6'
                      : reg.estado == 'No iniciada'
                      ? 'grey-6'
                      : reg.estado == 'En progreso'
                      ? 'orange-4'
                      : reg.estado == 'Aplazada'
                      ? 'red-4'
                      : reg.estado == 'No Realizada'
                      ? 'red-4'
                      : ''
                  "
                  :icon="
                    reg.estado == 'Enviado'
                      ? 'check'
                      : reg.estado == 'Realizada'
                      ? 'check'
                      : reg.estado == 'Completado'
                      ? 'check'
                      : reg.estado == 'Planificada'
                      ? 'alarm_on'
                      : reg.estado == 'No iniciada'
                      ? 'alarm_on'
                      : reg.estado == 'En progreso'
                      ? 'timelapse'
                      : reg.estado == 'Aplazada'
                      ? 'close'
                      : reg.estado == 'No Realizada'
                      ? 'close'
                      : ''
                  "
                  text-color="white"
                  size="sm"
                >
                  {{ reg.estado }}
                </q-chip>
              </q-item-section>
            </q-item>
            <q-separator inset />
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
                >No se encontraron actividades relacionadas...</small
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
import { useProspectStore } from '../store/ProspectStore';

// import { userStore } from 'src/modules/Users/store/UserStore';
// const { userCRM } = userStore();
const { Get_list_Activities } = useProspectStore();
// const props = defineProps < {
//   idAccount: string;
// } > ();
const filter = ref('');
const ActiveSqeleton = ref(false);
const getActivities = ref([] as { [key: string]: string }[]);
//  const tabAct = ref('todas')
const listAux = computed(() => {
  return getActivities.value.filter(
    (objeto) =>
      objeto.asunto.toLowerCase().indexOf(filter.value.toLowerCase()) > -1
  );
});

onMounted(async () => {
  getActivities.value = await Get_list_Activities('32423');
  ActiveSqeleton.value = true;
});

onMounted(async () => {
  getActivities.value = await Get_list_Activities('32423');
  ActiveSqeleton.value = true;
});
</script>
<style scoped>
#mapid {
  width: 700px;
  height: 600px;
}
</style>
