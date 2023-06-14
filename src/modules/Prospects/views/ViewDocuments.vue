<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="row col-12 justify-between">
        <div class="col-xl-2 col-lg-3 col-md-3 col-sm-12 col-xs-12 q-mb-sm">
          <q-input dense v-model="filter" placeholder="Buscar registro...">
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
                class="desktop-only"
                color="primary"
                @click="$emit('openDialog')"
                label="Seleccionar"
                size="md"
              />
            </slot>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-md-3 q-pa-md">
          <div
            v-if="filterdocRelation.length > 0 && !$q.screen.xs"
            col-3
            q-pa-md
            column
            items-end
          >
            <q-scroll-area style="height: 70vh">
              <q-list class="scroll q-none">
                <template
                  v-for="(row, index) in filterdocRelation"
                  :key="index"
                >
                  <q-item
                    class="q-my-sm"
                    clickable
                    @click="sendIdDocWeb(row.id_view_documento)"
                    active-class="my-menu-link"
                    :active="link === row.id_view_documento"
                  >
                    <q-item-section avatar>
                      <img src="pdf3.jpg" style="width: 30px; height: 35px" />
                      <!-- <img src="pdf.png" style=" width: 30px; height: 35px"/>     -->
                      <!-- <img src="pdf2.jfif" style=" width: 30px; height: 35px"/>                    -->
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ row.nombre }}</q-item-label>
                      <q-item-label caption lines="1" class="text-black">{{
                        row.categoria
                      }}</q-item-label>
                      <q-item-label caption lines="1"
                        >Publicación: {{ row.fecha_publicacion }}</q-item-label
                      >
                      <q-item-label caption lines="1"
                        >Vencimiento: {{ row.fecha_vencimiento }}</q-item-label
                      >
                    </q-item-section>
                    <!-- <q-item-section side>
                    <q-icon name="more_vert" color="primary" />
                  </q-item-section> -->
                  </q-item>
                  <q-separator inset />
                </template>
              </q-list>
            </q-scroll-area>
          </div>
          <div v-else-if="filterdocRelation.length > 0 && $q.screen.xs">
            <q-list>
              <template v-for="(row, index) in filterdocRelation" :key="index">
                <q-item class="q-my-sm" clickable active-class="my-menu-link">
                  <q-item-section avatar>
                    <a :href="link2 + row.id_view_documento">
                      <img src="pdf.png" style="width: 30px; height: 35px" />
                    </a>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label
                      ><a :href="link2 + row.id_view_documento">{{
                        row.nombre
                      }}</a></q-item-label
                    >
                    <q-item-label caption lines="1" class="text-black">{{
                      row.categoria
                    }}</q-item-label>
                    <q-item-label caption lines="1"
                      >Publicación: {{ row.fecha_publicacion }}</q-item-label
                    >
                    <q-item-label caption lines="1"
                      >Vencimiento: {{ row.fecha_vencimiento }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
                <q-separator inset />
              </template>
            </q-list>
          </div>
          <div v-else class="text-center">
            <span>No se encontraron registros!!!</span>
          </div>
        </div>
        <div class="col-9 q-pa-md column items-end" v-if="!$q.screen.xs">
          <template v-if="viewdocument === 'upload/0'">
            <q-card style="height: 70vh; width: 100%" flat bordered class="my-card column flex-center">
              <img src="pdf2.jpg" style="width: 200px; height: 200px" />
              <br>
              <div class="text-h5 q-mt-sm q-mb-xs text-weight-bold">
                Seleccione un documento de la lista
              </div>
            </q-card>
          </template>
          <template v-else>
            <iframe
              :src="viewdocument"
              style="height: 70vh; width: 100%"
              frameborder="0"
            >
            </iframe>
          </template>
        </div>
        <template>
          <q-dialog v-model="alert">
            <q-card>
              <iframe
                :src="viewdocument"
                style="height: 80vh; width: 100%"
                frameborder="0"
              >
              </iframe>
            </q-card>
          </q-dialog>
        </template>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
export default {
  name: 'ViewDocuments',
};
</script>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useProspectStore } from '../store/ProspectStore';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
const { getProspectsDocuments } = useProspectStore();
const props = defineProps<{
  id: string;
}>();
const filter = ref('');
const documentRelation = ref([] as { [key: string]: string }[]);
const viewdocument = ref('upload/0');
const link = ref('');
const alert = ref(false);

const link2 = `${HANSACRM3_URL}/index.php?entryPoint=download&type=Documents&id=`;

onMounted(async () => {
  documentRelation.value = await getProspectsDocuments(props.id);
});
const filterdocRelation = computed(() => {
  return documentRelation.value.filter(
    (objeto) =>
      objeto.nombre.toLowerCase().indexOf(filter.value.toLowerCase()) > -1
  );
});
const sendIdDocWeb = (id: string) => {
  console.log(id);
  link.value = id;
  viewdocument.value = `${HANSACRM3_URL}/upload/${id}`;
};
</script>
<style lang="sass">
.my-menu-link
  color: white
  background: #1BC1C6
</style>
