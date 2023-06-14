<script lang="ts">
import ViewGeneralSkeletonSubpanel from 'src/components/Skeletons/ViewGeneralSkeletonSubpanel.vue';
import { useOpportunitiesStore } from 'src/modules/Opportunities/store/OpportunitiesStore';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
import { useUtils } from 'src/modules/Accounts/composables/TabsComposables/useContacts';
import { deletedRelationBetweenModules } from 'src/services/GlobalService';
const { propsDeleteRelationAlert } = useUtils();
export default {
  name: 'ViewDocuments',
};
</script>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import FormDocument from 'src/components/Documents/FormDocument.vue';
const storeOppotunities = useOpportunitiesStore();
const props = defineProps<{
  id: string;
}>();
const filter = ref('');
const documentRelation = ref([] as { [key: string]: string }[]);
const viewdocument = ref('upload/0');
const link = ref('');
const alert = ref(false);
const ActiveSqeleton = ref(false);
const cantDocs = ref();
const addDocumentsRef = ref<InstanceType<typeof FormDocument> | null>(null);
const link2 = `${HANSACRM3_URL}/index.php?entryPoint=download&type=Documents&id=`;

const alertDelet = ref(false);
const infoDocTemp = ref();
const relacarga = ref(false);

const openDialogDocument = async () => {
  addDocumentsRef.value?.openDialog();
  const listDocuments = await storeOppotunities.getRelations(
    props.id,
    'documents'
  );
  cantDocs.value = listDocuments.length + 1;
};

const reloadDocument = async (idmodulo: string) => {
  documentRelation.value = await storeOppotunities.getRelations(
    idmodulo,
    'documents'
  );
  cantDocs.value = documentRelation.value.length + 1;
};

onMounted(async () => {
  documentRelation.value = await storeOppotunities.getRelations(
    props.id,
    'documents'
  );
  ActiveSqeleton.value = true;
});

const openAlertDeletedRelationDocumentOpportunity = (item: any) => {
  alertDelet.value = true;
  infoDocTemp.value = item;
};

const deleteDocument = async () => {
  relacarga.value = true;
  await deletedRelationBetweenModules(
    'Opportunities',
    props.id,
    'Documents',
    infoDocTemp.value.id
  );
  await reloadDocument(props.id);
  alertDelet.value = false;
  relacarga.value = false;
};

const filterdocRelation = computed(() => {
  return documentRelation.value.filter(
    (objeto) =>
      objeto.name.toLowerCase().indexOf(filter.value.toLowerCase()) > -1
  );
});
const extension = ref();
const sendIdDocWeb = (item: any) => {
  extension.value = item.name.match(/\.([^.]+)$/)?.[1];
  if (
    extension.value === 'docx' ||
    extension.value === 'doc' ||
    extension.value === 'xlsx'
  ) {
    const downloadUrl = `${HANSACRM3_URL}/index.php?entryPoint=download&id=${item.document_revision_id}&type=Documents`;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', 'nombre-del-archivo.docx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    link.value = item.document_revision_id;
    viewdocument.value = `${HANSACRM3_URL}/upload/${item.document_revision_id}`;
  }
};
</script>
<template>
  <q-card class="my-card" v-if="ActiveSqeleton" style="min-height: 80vh">
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
          <div class="row justify-end q-gutter-sm">
            <slot name="buttons">
              <q-btn
                class="desktop-only"
                icon="picture_as_pdf"
                color="primary"
                @click="openDialogDocument"
                label="Agregar Documento"
                size="md"
              />
              <!-- <q-btn
                class="desktop-only"
                color="primary"
                @click="$emit('openDialog')"
                label="Seleccionar"
                size="md"
              /> -->
            </slot>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12 col-md-4 q-pa-md">
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
                    @click="sendIdDocWeb(row)"
                    active-class="my-menu-link"
                    :active="link === row.document_revision_id"
                  >
                    <q-item-section avatar>
                      <img
                        src="pdf3.jpg"
                        style="width: 30px; height: 35px"
                        v-if="row.name.slice(-1) == 'f'"
                      />
                      <img
                        src="typejpg.png"
                        style="width: 30px; height: 35px"
                        v-else-if="row.name.slice(-1) == 'g'"
                      />
                      <q-icon
                        name="description"
                        size="37px"
                        v-else
                        color="primary"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ row.name }}</q-item-label>
                      <q-item-label caption lines="1" class="text-black">{{
                        row.categoria
                      }}</q-item-label>
                      <q-item-label caption lines="1"
                        >Publicación:
                        <span>{{ row.active_date }}</span></q-item-label
                      >
                      <q-item-label caption lines="1"
                        >Vencimiento:
                        {{ row.exp_date || 'Sin Registrar' }}</q-item-label
                      >
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
                                  openAlertDeletedRelationDocumentOpportunity(
                                    row
                                  )
                                "
                                >Quitar</q-item-section
                              >
                            </q-item>
                            <!-- <q-item clickable v-close-popup>
                            <q-item-section>Descargar</q-item-section>
                          </q-item> -->
                            <q-separator />
                          </q-list>
                        </q-menu>
                      </q-btn>
                    </q-item-section>
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
                    <a
                      :href="link2 + row.document_revision_id"
                      v-if="row.name.slice(-1) == 'f'"
                    >
                      <img src="pdf.png" style="width: 30px; height: 35px" />
                    </a>
                    <a
                      :href="link2 + row.document_revision_id"
                      v-else-if="row.name.slice(-1) == 'g'"
                    >
                      <img
                        src="typejpg.png"
                        style="width: 30px; height: 35px"
                      />
                    </a>
                    <q-icon
                      name="description"
                      size="37px"
                      v-else
                      color="primary"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label
                      ><a :href="link2 + row.document_revision_id">{{
                        row.name
                      }}</a>
                    </q-item-label>
                    <q-item-label caption lines="1" class="text-black">{{
                      row.categoria
                    }}</q-item-label>
                    <q-item-label caption lines="1"
                      >Publicación: {{ row.active_date }}</q-item-label
                    >
                    <q-item-label caption lines="1"
                      >Vencimiento: {{ row.exp_date }}</q-item-label
                    >
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
                                openAlertDeletedRelationDocumentOpportunity(row)
                              "
                              >Quitar</q-item-section
                            >
                          </q-item>
                          <!-- <q-item clickable v-close-popup>
                            <q-item-section>Descargar</q-item-section>
                          </q-item> -->
                          <q-separator />
                        </q-list>
                      </q-menu>
                    </q-btn>
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
        <div class="col-8 q-pa-md column items-end" v-if="!$q.screen.xs">
          <template v-if="viewdocument === 'upload/0'">
            <q-card
              style="height: 70vh; width: 100%"
              flat
              bordered
              class="my-card column flex-center"
            >
              <img src="pdf2.jpg" style="width: 200px; height: 200px" />
              <br />
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
    <q-inner-loading
      :showing="relacarga"
      label="Recargando página.."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </q-card>
  <q-card v-else style="height: 60vh; width: 100%">
    <ViewGeneralSkeletonSubpanel />
  </q-card>

  <FormDocument
    :idModule="id"
    :nameModule="'Opportunities'"
    :cantDocument="cantDocs"
    ref="addDocumentsRef"
    @reload="reloadDocument"
  />

  <AlertComponent
    v-model="alertDelet"
    v-bind="propsDeleteRelationAlert"
    @confirm="deleteDocument"
  >
    <template #body>
      <span> Esta seguro de quitar la relación? </span>
    </template>
  </AlertComponent>
</template>
<style lang="sass">
.my-menu-link
  color: white
  background: #1BC1C6
</style>
