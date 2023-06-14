<script lang="ts">
import { ref } from 'vue';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { useQuasar } from 'quasar';
import Notification from 'src/composables/notify';
</script>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    id: string;
    state?: string;
    iddivision?: string;
    persistent?: boolean;
    title?: string;
  }>(),
  {
    persistent: true,
    title: 'Layout de la cotización',
  }
);
const $q = useQuasar();
const cargar = ref(false);
const showFilter = ref(false);
const loading = ref(false);
const visualizarPDF = ref('');
const subpanelview = ref(false);

// para abrir el dialog con la moneda
// ejemplo https://crm.hansa.com.bo/index.php?entryPoint=aos_quoteWhatsappCRM&idamercado=03_01&idaosquote=ae6f1007-073e-0b73-0979-641a1ec93773
const openDialog = () => {
  subpanelview.value = false;
  if (props.iddivision != '03') {
    Notification(
      'warning',
      'exclamation',
      '<strong> Notificación! </strong> <br/> La división no cuenta con un layout de previsualización.'
    );
    showFilter.value = false;
    return;
  }
  if (
    props.state != '' &&
    (props.state === '03_01' || props.state === '03_06')
  ) {
    visualizarPDF.value = '';
    showFilter.value = true;
    cargar.value = true;
    const urlLayoutQuotes =
      HANSACRM3_URL +
      `/index.php?entryPoint=aos_quoteWhatsappCRM&idamercado=${props.state}&idaosquote=${props.id}`;
    setTimeout(() => {
      visualizarPDF.value = urlLayoutQuotes;
    }, 5000);
    cargar.value = false;
  } else {
    if (props.state === '') {
      Notification(
        'warning',
        'exclamation',
        '<strong> Notificación! </strong> <br/> La cotización debe de tener una área de mercado.'
      );
      return;
    }
    if (props.state !== '03_01' && props.state !== '03_06') {
      Notification(
        'warning',
        'exclamation',
        '<strong> Notificación! </strong> <br/> El área de mercado no cuenta con un layout de previsualización.'
      );
    }
  }
};
const valueMercado = ref('');
const openDialogSubPanels = (
  idQuotes: string,
  idDivision: string,
  idAmercado: string
) => {
  subpanelview.value = true;
  // idAmercado.value = idAmercado.toString() || '';
  valueMercado.value = idAmercado;
  if (idDivision != '03') {
    Notification(
      'warning',
      'exclamation',
      '<strong> Notificación! </strong> <br/> La división no cuenta con un layout de previsualización.'
    );
    showFilter.value = false;
    return;
  }
  if (idAmercado != '' && (idAmercado === '03_01' || idAmercado === '03_06')) {
    visualizarPDF.value = '';
    showFilter.value = true;
    cargar.value = true;
    const urlLayoutQuotes =
      HANSACRM3_URL +
      `/index.php?entryPoint=aos_quoteWhatsappCRM&idamercado=${idAmercado}&idaosquote=${idQuotes}`;
    setTimeout(() => {
      visualizarPDF.value = urlLayoutQuotes;
      cargar.value = false;
    }, 2500);
  } else {
    if (idAmercado === '') {
      Notification(
        'warning',
        'exclamation',
        '<strong> Notificación! </strong> <br/> La cotización debe de tener una área de mercado.'
      );
      return;
    }
    if (idAmercado !== '03_01' && idAmercado !== '03_06') {
      Notification(
        'warning',
        'exclamation',
        '<strong> Notificación! </strong> <br/> El área de mercado no cuenta con un layout de previsualización.'
      );
    }
  }
};

const closeDialog = () => {
  showFilter.value = false;
  cargar.value = false;
};

const printLayoutQuotes = () => {
  // console.log('imprimir cotizacion');
};

const cancelLayoutQuotes = () => {
  showFilter.value = false;
};

defineExpose({
  openDialog,
  openDialogSubPanels,
});
</script>
<template>
  <dialog-component
    v-model="showFilter"
    :headerDisabled="false"
    :footerDisabled="true"
    :loading="loading"
    :persistent="persistent"
  >
    <template #header>
      <q-card class="my-card no-border-radius">
        <q-card-section class="bg-primary text-white q-pa-sm">
          <div class="text-h6">
            <slot name="header-button"> </slot>
            {{ title }}
            <q-btn
              flat
              icon="close"
              dense
              class="float-right"
              @click="closeDialog"
            />
          </div>
        </q-card-section>
      </q-card>
    </template>
    <template #body>
      <div v-if="!subpanelview">
        <template v-if="!!state">
          <div style="width: 100%; height: 100dvh !important">
            <template v-if="visualizarPDF == ''"
              ><div>cargando documento...</div>
            </template>
            <template v-else>
              <object
                :data="visualizarPDF != '' ? visualizarPDF : ''"
                type="application/pdf"
                width="100%"
                height="100%"
              ></object>
            </template>
          </div>
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
              vista previa vacío <br />
              <small class="text-grey-5"
                >No se encontraron una cotización...</small
              >
            </div>
          </q-card>
        </template>
        <q-inner-loading
          :showing="cargar"
          label="Recargando página..."
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
      </div>
      <div v-else>
        <template v-if="!!valueMercado">
          <div style="width: 100%; height: 100dvh !important">
            <template v-if="visualizarPDF == ''"
              ><div>cargando documento...</div>
            </template>
            <template v-else>
              <object
                :data="visualizarPDF != '' ? visualizarPDF : ''"
                type="application/pdf"
                width="100%"
                height="100%"
              ></object>
            </template>
          </div>
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
              vista previa vacío <br />
              <small class="text-grey-5"
                >No se encontraron una cotización...</small
              >
            </div>
          </q-card>
        </template>
        <q-inner-loading
          :showing="cargar"
          label="Recargando página..."
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
      </div>
    </template>

    <template #footer>
      <!-- <q-card class="row">
        <q-card-section>
          <q-btn
            color="primary"
            icon="playlist_add_check"
            label="IMPRIMIR"
            class="q-mr-sm"
            @click="printLayoutQuotes"
            :disable="loading"
          />
          <q-btn
            color="red"
            icon="close"
            label="CANCELAR"
            @click="cancelLayoutQuotes"
            :disable="loading"
          />
        </q-card-section>
      </q-card> -->
    </template>
  </dialog-component>
</template>
<style scoped></style>
