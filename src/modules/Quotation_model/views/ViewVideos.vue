<script lang="ts">
export default {
  name: 'ViewVideos',
};
</script>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { useQuotationStore } from '../store/QuotationStore';
import AddVideos from '../components/Dialogs/AddVideos.vue';
const props = defineProps<{
  id: string;
}>();
const filter = ref('');
const documentRelation = ref([] as { [key: string]: string }[]);
const viewdocument = ref('upload/0');
const link = ref('');
const alert = ref(false);
const quotationStore = useQuotationStore();
const listData = ref([]);
const addVideosRef = ref<InstanceType<typeof AddVideos> | null>(null);

const data = ref({
  imagen: '',
});

const link2 = `${HANSACRM3_URL}/index.php?entryPoint=download&type=Documents&id=`;

onMounted(async () => {
  const lisAux = await quotationStore.getListsPestaStore(
    props.id,
    'caracteristicas'
  );
  listData.value = lisAux.filter((elem) => {
    if (elem.name_categoria == 'Video') {
      return { elem };
    }
  });
  console.log(listData.value);
});
const sendIdDocWeb = (id: string, name: string) => {
  link.value = id;
  viewdocument.value = name;
};
const openDialog = () => {
  addVideosRef.value?.openDialog();
  console.log('entrando a videos');
};
</script>

<template>
  <q-card class="my-card">
    <q-card-section>
      <div class="row col-12 justify-between">
        <div
          class="col-xl-2 col-lg-3 col-md-3 col-sm-12 col-xs-12 q-mb-sm text-primary"
          align="center"
        >
          <q-label>Videos </q-label>
        </div>
        <div class="col-xl-4 col-lg-6 col-md-7 col-sm-12 col-xs-12 q-mb-sm">
          <div class="row justify-end">
            <slot name="buttons">
              <q-btn
                class="desktop-only"
                color="primary"
                icon="perm_media"
                @click="openDialog"
                label="Agregar Video"
                size="md"
              />
            </slot>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-md-3 q-pa-md">
          <div
            v-if="listData.length > 0 && !$q.screen.xs"
            col-3
            q-pa-md
            column
            items-end
          >
            <q-scroll-area style="height: 70vh">
              <q-list class="scroll q-none">
                <template v-for="(row, index) in listData" :key="index">
                  <q-item
                    class="q-my-sm"
                    clickable
                    @click="sendIdDocWeb(row.id, row.name_caracteristicas)"
                    active-class="my-menu-link"
                    :active="link === row.id"
                  >
                    <q-item-section avatar>
                      <!-- <img src="pdf3.jpg" style="width: 30px; height: 35px" /> -->
                      <q-icon name="perm_media" size="xl" color="teal" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{
                        row.name_caracteristicas
                      }}</q-item-label>
                      <q-item-label caption lines="1" class="text-primary">{{
                        row.name_categoria
                      }}</q-item-label>
                      <!-- <q-item-label caption lines="1"
                        >Feche de Creación: {{ row.date_entered }}</q-item-label
                      > -->
                      <q-item-label caption lines="1"
                        >Usuario Asignado: {{ row.nameuser }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                  <q-separator inset />
                </template>
              </q-list>
            </q-scroll-area>
          </div>
          <div v-else-if="listData.length > 0 && $q.screen.xs">
            <q-list>
              <template v-for="(row, index) in listData" :key="index">
                <q-item class="q-my-sm" clickable active-class="my-menu-link">
                  <q-item-section avatar>
                    <a :href="link2 + row.id">
                      <!-- <img src="pdf.png" style="width: 30px; height: 35px" /> -->
                      <q-icon name="perm_media" size="xl" color="teal" />
                    </a>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ row.name_caracteristicas }}</q-item-label>
                    <q-item-label caption lines="1" class="text-primary">{{
                      row.name_categoria
                    }}</q-item-label>
                    <!-- <q-item-label caption lines="1"
                      >Feche de Creación: {{ row.date_entered }}</q-item-label
                    > -->
                    <q-item-label caption lines="1"
                      >Usuario Asignado: {{ row.nameuser }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
                <q-separator inset />
              </template>
            </q-list>
          </div>
          <div v-else class="text-center">
            <span>No se encontraron enlaces de videos.</span>
          </div>
        </div>
        <div class="col-9 q-pa-md column items-end" v-if="!$q.screen.xs">
          <template v-if="viewdocument === 'upload/0'">
            <q-card
              style="height: 70vh; width: 100%"
              flat
              bordered
              class="my-card column flex-center"
            >
              <!-- <img
                src="imagenvaciaNew.png"
                style="width: 300px; height: 200px"
              /> -->
              <q-icon name="perm_media" size="xl" color="teal" />

              <div class="text-h5 q-mt-sm q-mb-xs">
                Visualice un enlace de video seleccionado.
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
            <!-- <q-video
              :src="viewdocument"
              style="height: 200px; max-width: 720px"
            /> -->
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
              <!-- <q-video
                :src="viewdocument"
                style="height: 200px; max-width: 720px"
              /> -->
            </q-card>
          </q-dialog>
        </template>
      </div>
    </q-card-section>
  </q-card>
  <AddVideos ref="addVideosRef" :id="props.id" />
</template>

<style lang="sass">
.my-menu-link
  color: white
  background: #1BC1C6
</style>
