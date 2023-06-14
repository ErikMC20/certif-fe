<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { RelationInfoLead } from '../../../utils/types';
import ViewCardVue from 'src/components/MainCard/ViewCard.vue';
import { useReservasStore } from 'src/modules/Reservas/store/ReservasStore';
import { useAsyncState } from '@vueuse/core';
import { useFormOptionsStore } from 'src/stores/formOptionsStore';
import visorDocumentDialog from '../../Dialogs/visorDocumentDialog.vue';
import { QTableColumn } from 'quasar';
import { useQuotationStore } from 'src/modules/Quotation_model/store/QuotationStore';
import { QSpinnerPuff, useQuasar } from 'quasar';
import { QuotationTableStore } from 'src/modules/Quotation_model/store/QuotationTableStore';
import { QInput, QFile } from 'quasar';
import { userStore } from 'src/modules/Users/store/UserStore';
import moment from 'moment';
const props = withDefaults(
  defineProps<{ id?: string; data?: RelationInfoLead }>(),
  {}
);
const $q = useQuasar();
const nameFileRef = ref<InstanceType<typeof QFile> | null>(null);
const nameRef = ref<InstanceType<typeof QInput> | null>(null);
const categoryRef = ref<InstanceType<typeof QInput> | null>(null);
const tipoRef = ref<InstanceType<typeof QInput> | null>(null);
const loggedUserStore = userStore();
const useQuotationStoreRef = useQuotationStore();
const reserveStore = useReservasStore();
const baseCardRef = ref<InstanceType<typeof ViewCardVue> | null>();
const isEditing = computed(() => baseCardRef.value?.isEditing === 'edit');
const visorDocDialog = ref();
const iddoc = ref('');
const languageStore = useFormOptionsStore();
const tableStore = QuotationTableStore();
const listDivision = ref();
const show = ref(false);
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 100,
});
const data = ref({
  nombre: '',
  archivo: [],
  verarchivo: '',
  categoria: '',
  fechapubli: '',
  tipodocumento: '',
  division: '',
  montocontrato: '',
  estado: '',
  ruta: '',
  version: '',
  fechacadu: '',
  documento: '',
  regional: '',
});
const { state, execute } = useAsyncState(
  async () => {
    return await reserveStore.getDocOpportunitiesReserve(props.id || '');
  },
  {} as any,
  { immediate: false }
);

onMounted(async () => {
  //await languageStore.HANQModelOptions;
  listDivision.value = await tableStore.getDivisionLead();
  await execute();
  data.value = {
    nombre: '',
    archivo: [],
    verarchivo: '',
    categoria: '',
    fechapubli: moment().format('YYYY-MM-DD'),
    tipodocumento: '',
    division: loggedUserStore.userCRM.iddivision,
    montocontrato: '',
    estado: '',
    ruta: '',
    version: '1',
    fechacadu: moment().add(15, 'd').format('YYYY-MM-DD'),
    documento: '',
    regional: '',
  };
});

const openVisorDoc = (id: string) => {
  iddoc.value = id;
  visorDocDialog.value.open = !visorDocDialog.value.open;
};
const columns: QTableColumn[] = [
  {
    name: 'nombre',
    align: 'left',
    label: 'Nombre',
    field: 'nombre',
    sortable: true,
  },
  {
    name: 'fecha_publicacion',
    align: 'left',
    label: 'Fecha Publicacion',
    field: 'fecha_publicacion',
    sortable: true,
  },
  { name: 'tipo', align: 'left', label: 'tipo', field: 'tipo' },
  {
    name: 'fecha_creacion',
    align: 'left',
    label: 'Fecha de Creación',
    field: 'tipo',
  },
];
const documents = ref([] as { [key: string]: string }[]);
const previDocumento = (value: File) => {
  data.value.nombre = value.name;
};

const deleteData = () => {
  data.value.archivo = null;
  data.value.nombre = '';
};

const clearData = () => {
  data.value = {
    nombre: '',
    archivo: [],
    verarchivo: '',
    categoria: '',
    fechapubli: moment().format('YYYY-MM-DD'),
    tipodocumento: '',
    division: loggedUserStore.userCRM.iddivision,
    montocontrato: '',
    estado: '',
    ruta: '',
    version: '1',
    fechacadu: moment().add(15, 'd').format('YYYY-MM-DD'),
    documento: '',
    regional: '',
  };
};

const nuevafilarequisitos = () => {
  documents.value.push({
    iddocumentoesq: '',
  });
};

const showCard = () => {
  show.value = !show.value;
};
const enviarArchivo = async () => {
  const areCardsValid = await validateInputs();
  if (!areCardsValid) {
    $q.notify({
      type: 'warning',
      message: 'Solicitud denegada',
      caption: 'Algunos campos necesitan ser llenados',
    });
    return;
  }
  const dataSend = {
    name: data.value.nombre,
    category_id: data.value.categoria.value,
    subcategory_id: '',
    active_date: data.value.fechapubli,
    exp_date: data.value.fechacadu,
    template_type: data.value.tipodocumento.value,
    iddivision_c: data.value.division,
    montocontrato_c: '',
    status: '',
    ruta_tramo_region_c: '',
    revision: '1',
    documento_c: '',
    regional_c: data.value.regional.cod_region,
  };
  try {
    $q.loading.show({
      spinner: QSpinnerPuff,
      message: 'Guardando Documento',
    });
    await useQuotationStoreRef.saveDocuments(
      dataSend,
      data.value.archivo,
      'Opportunities',
      props.id
    );
    await execute();
  } catch (error) {
    throw error;
  } finally {
    show.value = false;
    $q.loading.hide();
    data.value = {
      nombre: '',
      archivo: [],
      verarchivo: '',
      categoria: '',
      fechapubli: moment().format('YYYY-MM-DD'),
      tipodocumento: '',
      division: loggedUserStore.userCRM.iddivision,
      montocontrato: '',
      estado: '',
      ruta: '',
      version: '1',
      fechacadu: moment().add(15, 'd').format('YYYY-MM-DD'),
      documento: '',
      regional: '',
    };
  }
};
const validateInputs = async () => {
  const validatedFields = await Promise.all([
    nameFileRef.value?.validate(),
    nameRef.value?.validate(),
  ]);
  return validatedFields.every((field) => !!field);
};

const regionesOptionsTotal = computed(() => {
  return languageStore.leadsOptions.regions.filter(
    (region) => region.cod_pais === 'BO'
  );
});
const regionesOptions = computed(() => {
  return regionesOptionsTotal.value.map((r) => r.regiones).flat();
});
const tiposFilter = computed(() => {
  const dataConcat = data.value.categoria.value + '_';
  return languageStore.HANQModelOptions.documentTemplateType.filter((r: any) =>
    r.value.toLowerCase().includes(dataConcat.toLowerCase())
  );
});

const exposeData = () => {
  //consoloe.log('ok');
};
defineExpose({
  exposeData,
  isEditing,
});
</script>
<template>
  <view-card-component
    flat
    ref="baseCardRef"
    :initial-status="id ? 'read' : 'edit'"
    icon-name="content_copy"
    title="Documentos cargados a la oportunidad"
    bordered
    style="width: 100%"
  >
    <template #edit>
      <div>
        <div>
          <q-btn
            size="sm"
            color="primary"
            label="Nuevo"
            @click="nuevafilarequisitos()"
          />
          <template v-for="(item, index) in documents" :key="index">
            <!-- <div class="row q-pa-md q-gutter-md">
            <div class="col">
              <q-file outlined v-model="data.archivo" label="Archivo" dense>
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>

            <div class="col">
              <q-input dense outlined v-model="item.iddocumentoesq" type="date" label="fecha de publicacion" />
            </div>

            <div class="col">
              <q-btn  color="red" size="sm" round icon="close" @click="removeItem(index)" />
            </div>
            <div class="col">
              <q-btn color="grey"  label="Cargar archivo" @click="enviarArchivo" size="sm"/>
            </div>
          </div> -->
            <div class="q-ma-sm">
              <q-card class="my-card" flat bordered>
                <q-card-section class="q-pt-xs">
                  <div class="text-overline">Nuevo Documento</div>
                  <div class="row q-pa-sm q-gutter-md">
                    <div class="col">
                      <q-file
                        outlined
                        v-model="data.archivo"
                        label="Archivo"
                        dense
                      >
                        <template v-slot:prepend>
                          <q-icon name="attach_file" />
                        </template>
                      </q-file>
                    </div>
                    <div class="col">
                      <q-input
                        dense
                        outlined
                        v-model="item.iddocumentoesq"
                        type="date"
                        label="fecha de publicacion"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        dense
                        outlined
                        v-model="item.iddocumentoesq"
                        type="text"
                        label="Tipo de documento"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        dense
                        outlined
                        v-model="item.iddocumentoesq"
                        type="text"
                        label="Tipo de documento"
                      />
                    </div>
                    <div class="col">
                      <q-input
                        dense
                        outlined
                        v-model="item.iddocumentoesq"
                        type="text"
                        label="Tipo de documento"
                      />
                    </div>
                  </div>
                </q-card-section>
                <q-separator />
                <q-card-actions align="right">
                  <q-btn size="sm" color="primary" @click="enviarArchivo">
                    Guardar Documento
                  </q-btn>
                  <!-- <q-btn size="sm" outline color="primary" @click="removeItem(index)"> -->
                  <q-btn size="sm" outline color="primary" @click="clearData">
                    Limpiar
                  </q-btn>
                </q-card-actions>
              </q-card>
            </div>
          </template>
        </div>
        <q-separator inset />
        <div class="col-12">
          <q-table
            flat
            :rows="state.data"
            :columns="columns"
            row-key="name"
            hide-bottom
            :pagination="pagination"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td
                  key="nombre"
                  :props="props"
                  class="cursor-pointer text-primary"
                >
                  <q-icon
                    class="text-bold cursor-pointer text-primary q-pr-md"
                    :name="
                      props.row.nombre.slice(-1) == 'f'
                        ? 'insert_drive_file'
                        : 'image'
                    "
                    :color="
                      props.row.nombre.slice(-1) == 'f' ? 'red' : 'orange'
                    "
                    size="sm"
                    @click="openVisorDoc(props.row.id_view_documento)"
                  />
                  <span @click="openVisorDoc(props.row.id_view_documento)">{{
                    props.row.nombre
                  }}</span>
                </q-td>
                <q-td key="fecha_publicacion" :props="props">
                  {{ props.row.fecha_publicacion }}
                </q-td>
                <q-td key="tipo" :props="props">
                  {{ props.row.tipo }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </div>
    </template>

    <template #read>
      <div class="q-ma-sm">
        <div>
          <!-- <pre>{{ tiposFilter }}</pre> -->
          <q-btn
            size="sm"
            color="primary"
            label="Nuevo Documento"
            @click="showCard()"
          />
          <div class="q-ma-sm" v-show="show">
            <q-card class="my-card" bordered>
              <q-card-section class="q-pt-xs">
                <div class="text-overline">Información del documento</div>
                <div class="row q-pa-sm q-gutter-md">
                  <div class="col">
                    <q-file
                      outlined
                      v-model="data.archivo"
                      label="Archivo"
                      dense
                      ref="nameFileRef"
                      :rules="[
                        (value) => !!value || 'Se requiere el documento',
                        (value) =>
                          !value ||
                          value.size < 10000000 ||
                          'El tamaño maximo de archivo es de 10 MB.',
                      ]"
                      @update:model-value="previDocumento(data.archivo)"
                    >
                      <template v-slot:prepend>
                        <q-icon name="attach_file" />
                      </template>
                      <template v-slot:append>
                        <q-icon
                          name="close"
                          @click.stop.prevent="deleteData"
                          class="cursor-pointer"
                        />
                      </template>
                    </q-file>
                  </div>
                  <div class="col">
                    <q-input
                      dense
                      outlined
                      v-model="data.nombre"
                      type="text"
                      label="Nombre"
                      ref="nameRef"
                      :rules="[(val) => !!val || 'Ingrese un nombre']"
                    />
                  </div>
                  <div class="col">
                    <q-select
                      v-model="data.categoria"
                      :options="languageStore.HANQModelOptions.documentCategory"
                      label="Categoria"
                      outlined
                      dense
                      options-dense
                      map-options
                      option-value="cod_div"
                      option-label="label"
                      emit-value
                      color="primary"
                      ref="categoryRef"
                    />
                  </div>
                  <div class="col">
                    <q-select
                      v-model="data.tipodocumento"
                      :options="tiposFilter"
                      label="Tipo de documento"
                      outlined
                      dense
                      options-dense
                      map-options
                      emit-value
                      option-value="cod_div"
                      option-label="label"
                      color="primary"
                      ref="tipoRef"
                    />
                  </div>
                </div>
                <div class="row q-pa-sm q-gutter-md">
                  <div class="col">
                    <q-input
                      dense
                      outlined
                      v-model="data.fechapubli"
                      type="date"
                      label="fecha de publicacion"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      dense
                      outlined
                      v-model="data.fechacadu"
                      type="date"
                      label="Fecha de caducidad"
                    />
                  </div>
                  <div class="col">
                    <q-select
                      v-model="data.division"
                      :options="languageStore.leadsOptions.divisions"
                      option-value="cod_div"
                      option-label="label"
                      emit-value
                      map-options
                      class="col-12 col-sm-6"
                      outlined
                      dense
                      label="Division"
                    />
                  </div>
                  <div class="col">
                    <q-select
                      v-model="data.regional"
                      :options="regionesOptions"
                      label="Regional"
                      outlined
                      emit-value
                      dense
                      options-dense
                      map-options
                      option-value="cod_div"
                      option-label="label"
                      color="primary"
                    />
                  </div>
                </div>
              </q-card-section>
              <q-separator />
              <q-card-actions align="right">
                <q-btn size="sm" color="primary" @click="enviarArchivo">
                  Guardar Documento
                </q-btn>
                <!-- <q-btn size="sm" outline color="primary" @click="removeItem(index)"> -->
                <q-btn size="sm" outline color="primary" @click="clearData">
                  Limpiar
                </q-btn>
              </q-card-actions>
            </q-card>
          </div>
          <!-- </template> -->
        </div>
        <div class="col-12">
          <q-table
            flat
            :rows="state.data"
            :columns="columns"
            row-key="name"
            hide-bottom
            :pagination="pagination"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td
                  key="nombre"
                  :props="props"
                  class="cursor-pointer text-primary"
                >
                  <q-icon
                    class="text-bold cursor-pointer text-primary q-pr-md"
                    :name="
                      props.row.nombre.slice(-1) == 'f'
                        ? 'insert_drive_file'
                        : 'image'
                    "
                    :color="
                      props.row.nombre.slice(-1) == 'f' ? 'red' : 'orange'
                    "
                    size="sm"
                    @click="openVisorDoc(props.row.id_view_documento)"
                  />
                  <span @click="openVisorDoc(props.row.id_view_documento)">{{
                    props.row.nombre
                  }}</span>
                </q-td>
                <q-td key="fecha_publicacion" :props="props">
                  {{ props.row.fecha_publicacion }}
                </q-td>
                <q-td key="tipo" :props="props">
                  {{ props.row.tipo }}
                </q-td>
                <q-td key="tipo" :props="props">
                  {{ props.row.fecha_creacion }}
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </div>
    </template>
  </view-card-component>
  <visorDocumentDialog ref="visorDocDialog" :idModule="iddoc" />
</template>
