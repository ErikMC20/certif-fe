<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { CardInfoLead } from '../../utils/types';
import { QInput } from 'quasar';
import { QuotationTableStore } from '../../../Quotation_model/store/QuotationTableStore';
import { useActivityStore } from 'src/stores/ActivityStore';

const props = withDefaults(
  defineProps<{
    id?: string;
    data?: CardInfoLead;
    readMode?: boolean;
    editFalseIn?: boolean;
    dataDupli2?: any;
  }>(),
  {
    readMode: false,
    dataDupli2: '',
  }
);
const edit = ref(false);
const bloqueado = ref(true);
const listDivision = ref();
const listMercado = ref();
const tableStore = QuotationTableStore();
const isEditing = ref(props.readMode);
const activityStore = useActivityStore();
const quotesEdit = ref();
const otolista1 = ref();
const otolista2 = ref();
const editcargar = ref(false);

const data = ref({
  condiciones: '',
  formaspagolist: '',
  formaspago: '',
  datosseguro: '',
  garantia: '',
  tiempoentregalist: '',
  tiempoentrega: '',
  serviciosposventa: '',
  mostrarcodigos: '',
  mostrardescuentos: '',
  mostrarlegales: '',
});

const dataread = ref({
  condiciones: '',
  formaspagolist: '',
  formaspago: '',
  datosseguro: '',
  garantia: '',
  tiempoentregalist: '',
  tiempoentrega: '',
  serviciosposventa: '',
  mostrarcodigos: '0',
  mostrardescuentos: '0',
  mostrarlegales: '0',
});

onMounted(async () => {
  listDivision.value = await tableStore.getDivisionLead();
  if (props.id != '') {
    editcargar.value = true;
    quotesEdit.value = await activityStore.getModuleTypeIDPro(
      'Quotes',
      String(props.id)
    );
    dataread.value = {
      condiciones: quotesEdit.value.attributes.cond_generales_venta_c,
      // formaspagolist: 'Otro',
      // formaspago: quotesEdit.value.attributes.forma_pago_c,
      datosseguro: quotesEdit.value.attributes.datos_seguro_c,
      garantia: quotesEdit.value.attributes.garantia_c,
      // tiempoentregalist: 'Otro',
      // tiempoentrega: quotesEdit.value.attributes.tiempo_entrega_c,
      serviciosposventa: quotesEdit.value.attributes.servicio_post_venta_c,
      mostrarcodigos: quotesEdit.value.attributes.mostrar_codigos_c + '',
      mostrardescuentos: quotesEdit.value.attributes.mostrar_desc_c + '',
      mostrarlegales: quotesEdit.value.attributes.condiciones_legales_c + '',
    };
    editarOtro(
      quotesEdit.value.attributes.forma_pago_c,
      quotesEdit.value.attributes.tiempo_entrega_c
    );
    editcargar.value = false;
  } else {
    isEditing.value = true;
    data.value = {
      condiciones: '',
      formaspagolist: '',
      formaspago: '',
      datosseguro: '',
      garantia: '3 años y/o 100.000 km',
      tiempoentregalist: '',
      tiempoentrega: '',
      serviciosposventa: '',
      mostrarcodigos: 0 + '',
      mostrardescuentos: 0 + '',
      mostrarlegales: 0 + '',
    };
  }
  if (props.dataDupli2 != '') {
    data.value = {
      condiciones: props.dataDupli2.cond_generales_venta_c,
      // formaspagolist: props.dataDupli2.,
      // formaspago: props.dataDupli2.,
      datosseguro: props.dataDupli2.datos_seguro_c,
      garantia: props.dataDupli2.garantia_c,
      // tiempoentregalist: props.dataDupli2.,
      // tiempoentrega: props.dataDupli2.,
      serviciosposventa: props.dataDupli2.servicio_post_venta_c,
      mostrarcodigos: 0 + props.dataDupli2.mostrar_codigos_c,
      mostrardescuentos: 0 + props.dataDupli2.mostrar_desc_c,
      mostrarlegales: 0 + props.dataDupli2.condiciones_legales_c,
    };
    dupliOtro(props.dataDupli2.forma_pago_c, props.dataDupli2.tiempo_entrega_c);
  }
});

watch(
  () => props.id,
  async () => {
    if (props.id != '') {
      editcargar.value = true;
      isEditing.value = false;
      quotesEdit.value = await activityStore.getModuleTypeIDPro(
        'Quotes',
        String(props.id)
      );
      // console.log(quotesEdit.value.attributes);
      dataread.value = {
        condiciones: quotesEdit.value.attributes.cond_generales_venta_c,
        // formaspagolist: 'Otro',
        // formaspago: quotesEdit.value.attributes.forma_pago_c,
        datosseguro: quotesEdit.value.attributes.datos_seguro_c,
        garantia: quotesEdit.value.attributes.garantia_c,
        // tiempoentregalist: 'Otro',
        // tiempoentrega: quotesEdit.value.attributes.tiempo_entrega_c,
        serviciosposventa: quotesEdit.value.attributes.servicio_post_venta_c,
        mostrarcodigos: quotesEdit.value.attributes.mostrar_codigos_c + '',
        mostrardescuentos: quotesEdit.value.attributes.mostrar_desc_c + '',
        mostrarlegales: quotesEdit.value.attributes.condiciones_legales_c + '',
      };
      editarOtro(
        quotesEdit.value.attributes.forma_pago_c,
        quotesEdit.value.attributes.tiempo_entrega_c
      );
      editcargar.value = false;
    }
  }
);
watch(
  () => props.readMode,
  async () => {
    isEditing.value = props.readMode;
    // console.log(props.readMode);
  },
  { deep: true }
);

const editList = () => {
  edit.value = true;
  bloqueado.value = false;
  isEditing.value = true;
};

const cancelEdit = () => {
  edit.value = false;
  bloqueado.value = true;
  isEditing.value = false;
};
const formapagoPRO = (oto1: string) => {
  if (!props.id) {
    if (oto1 != 'Otro') {
      data.value.formaspago = oto1;
    } else {
      data.value.formaspago = '';
    }
  } else {
    if (oto1 != 'Otro') {
      dataread.value.formaspago = oto1;
    } else {
      dataread.value.formaspago = '';
    }
  }
};
const tiempoentregaPRO = (oto1: string) => {
  if (!props.id) {
    if (oto1 != 'Otro') {
      data.value.tiempoentrega = oto1;
    } else {
      data.value.tiempoentrega = '';
    }
  } else {
    if (oto1 != 'Otro') {
      dataread.value.tiempoentrega = oto1;
    } else {
      dataread.value.tiempoentrega = '';
    }
  }
};

const formaspago = [
  { label: 'Contado', value: 'Contado' },
  { label: 'Crédito Bancario', value: 'Credito Bancario' },
  { label: 'Crédito Directo', value: 'Credito Directo' },
  { label: '50% Adelanto/Anticipo', value: '50% Adelanto/Anticipo' },
  { label: 'Otro', value: 'Otro' },
];
const entregas = [
  { label: 'Inmediata', value: 'Inmediata' },
  { label: '5 días ', value: '5 dias' },
  { label: '10 días', value: '10 dias' },
  { label: '15 días', value: '15 dias' },
  { label: 'Otro', value: 'Otro' },
];

const editarOtro = (oto1: string, oto2: string) => {
  otolista1.value = formaspago.find((ite) => ite.value == oto1)?.value;
  otolista2.value = entregas.find((ite) => ite.value == oto2)?.value;
  if (otolista1.value == undefined) {
    dataread.value.formaspagolist = 'Otro';
    dataread.value.formaspago = oto1;
  } else {
    dataread.value.formaspagolist = otolista1.value;
    dataread.value.formaspago = otolista1.value;
  }
  if (otolista2.value == undefined) {
    dataread.value.tiempoentregalist = 'Otro';
    dataread.value.tiempoentrega = oto2;
  } else {
    dataread.value.tiempoentregalist = otolista2.value;
    dataread.value.tiempoentrega = otolista2.value;
  }
};
const dupliOtro = (oto1: string, oto2: string) => {
  otolista1.value = formaspago.find((ite) => ite.value == oto1)?.value;
  otolista2.value = entregas.find((ite) => ite.value == oto2)?.value;
  if (otolista1.value == undefined) {
    data.value.formaspagolist = 'Otro';
    data.value.formaspago = oto1;
  } else {
    data.value.formaspagolist = otolista1.value;
    data.value.formaspago = otolista1.value;
  }
  if (otolista2.value == undefined) {
    data.value.tiempoentregalist = 'Otro';
    data.value.tiempoentrega = oto2;
  } else {
    data.value.tiempoentregalist = otolista2.value;
    data.value.tiempoentrega = otolista2.value;
  }
};

const exposeData = () => {
  if (props.id == '') {
    return data.value;
  } else {
    return dataread.value;
  }
};
defineExpose({
  exposeData,
  isEditing,
});
</script>
<template>
  <!-- <pre>id quotes---{{ props.id }}</pre> -->
  <!-- <pre>editando---{{ isEditing }}</pre> -->
  <q-card class="my-card" v-if="!props.id">
    <q-card-section class="row justify-between">
      <span>
        <q-icon name="credit_score" size="sm" color="primary" /> Oferta
        Comercial
      </span>
    </q-card-section>
    <q-separator></q-separator>
    <q-card-section>
      <div class="row q-col-gutter-sm">
        <div class="col-md-6 col-xs-12">
          <q-input
            v-model="data.condiciones"
            type="text"
            label="Condiciones generales de venta"
            outlined
            dense
            color="primary"
          >
          </q-input>
        </div>
        <div class="col-md-6 col-xs-12">
          <q-select
            v-model="data.formaspagolist"
            :options="formaspago"
            label="Forma de Pago"
            outlined
            dense
            options-dense
            map-options
            emit-value
            option-value="value"
            option-label="label"
            transition-show="flip-up"
            transition-hide="flip-down"
            color="primary"
            @update:model-value="formapagoPRO(data.formaspagolist)"
          >
          </q-select>
        </div>
        <div
          class="col-md-6 col-xs-3 flex-center"
          align="right"
          v-if="data.formaspagolist == 'Otro'"
        >
          <q-label>Otra forma de pago :</q-label>
        </div>
        <div
          class="col-md-6 col-xs-9"
          v-if="data.formaspagolist == 'Otro'"
          align="right"
        >
          <q-input
            v-model="data.formaspago"
            type="text"
            label="..."
            outlined
            dense
            color="primary"
          >
          </q-input>
        </div>
        <div class="col-md-6 col-xs-12">
          <q-input
            v-model="data.datosseguro"
            type="text"
            label="Datos de seguro"
            outlined
            dense
            color="primary"
          >
          </q-input>
        </div>
        <div class="col-md-6 col-xs-12">
          <q-input
            v-model="data.garantia"
            type="text"
            label="Garantia"
            outlined
            dense
            color="primary"
          >
          </q-input>
        </div>
        <div class="col-md-6 col-xs-12">
          <q-select
            v-model="data.tiempoentregalist"
            :options="entregas"
            label="Tiempos de Entrega"
            outlined
            dense
            map-options
            emit-value
            options-dense
            option-value="value"
            option-label="label"
            transition-show="flip-up"
            transition-hide="flip-down"
            color="primary"
            @update:model-value="tiempoentregaPRO(data.tiempoentregalist)"
          >
          </q-select>
        </div>

        <div class="col-md-6 col-xs-12 item-right">
          <q-input
            v-model="data.serviciosposventa"
            type="text"
            label="Servicio Posventa"
            outlined
            dense
            color="primary"
          >
          </q-input>
        </div>
        <div class="col-md-6 col-xs-12" v-if="data.tiempoentregalist == 'Otro'">
          <q-input
            v-model="data.tiempoentrega"
            type="text"
            label="Otro tiempo de entrega"
            outlined
            dense
            color="primary"
          >
          </q-input>
        </div>

        <div class="col-xs-12">
          <span
            ><q-checkbox
              left-label
              v-model="data.mostrarcodigos"
              size="xs"
              label="Mostrar Códigos"
              color="primary"
              true-value="1"
              false-value="0"
            />
          </span>
          <span
            ><q-checkbox
              left-label
              v-model="data.mostrardescuentos"
              size="xs"
              label="Mostrar descuentos"
              color="primary"
              true-value="1"
              false-value="0"
            />
          </span>
          <span
            ><q-checkbox
              left-label
              v-model="data.mostrarlegales"
              size="xs"
              label="Requiere condiciones legales"
              color="primary"
              true-value="1"
              false-value="0"
            />
          </span>
        </div>
      </div>
    </q-card-section>
    <!-- <pre>data{{ data }}</pre> -->
    <q-separator inset />
  </q-card>
  <!-- -------------------------------PARA LA LEER LOS DATOS ----------------------------------->
  <q-card class="my-card" v-else>
    <q-card-section class="row justify-between">
      <span>
        <q-icon name="credit_score" size="sm" color="primary" /> Oferta
        Comercial
      </span>

      <q-btn
        size="10px"
        flat
        dense
        icon="mode_edit"
        class="float-right"
        :color="!$q.dark.isActive ? 'grey-8' : 'white'"
        @click="editList"
        v-if="!edit"
      >
        <q-tooltip>Editar</q-tooltip>
      </q-btn>
      <q-btn
        v-else
        size="10px"
        flat
        dense
        icon="cancel"
        class="float-right"
        :color="!$q.dark.isActive ? 'grey-8' : 'white'"
        @click="cancelEdit"
      >
        <q-tooltip>Cancelar</q-tooltip>
      </q-btn>
    </q-card-section>
    <q-separator></q-separator>
    <q-card-section>
      <div class="row q-col-gutter-sm">
        <div class="col-md-6 col-xs-12">
          <q-input
            v-model="dataread.condiciones"
            type="text"
            label="Condiciones generales de venta"
            outlined
            dense
            color="primary"
            :readonly="bloqueado"
          >
          </q-input>
        </div>
        <div class="col-md-6 col-xs-12">
          <q-select
            v-model="dataread.formaspagolist"
            :options="formaspago"
            label="Forma de Pago"
            outlined
            dense
            options-dense
            map-options
            emit-value
            option-value="value"
            option-label="label"
            transition-show="flip-up"
            transition-hide="flip-down"
            color="primary"
            :readonly="bloqueado"
            @update:model-value="formapagoPRO(dataread.formaspagolist)"
          >
          </q-select>
        </div>
        <div
          class="col-md-6 col-xs-3"
          align="right"
          v-if="dataread.formaspagolist == 'Otro'"
        >
          <q-label align="center">Otra forma de pago :</q-label>
        </div>
        <div
          class="col-md-6 col-xs-9"
          v-if="dataread.formaspagolist == 'Otro'"
          align="right"
        >
          <q-input
            v-model="dataread.formaspago"
            type="text"
            label="..."
            outlined
            dense
            color="primary"
            :readonly="bloqueado"
          >
          </q-input>
        </div>
        <div class="col-md-6 col-xs-12">
          <q-input
            v-model="dataread.datosseguro"
            type="text"
            label="Datos de seguro"
            outlined
            dense
            color="primary"
            :readonly="bloqueado"
          >
          </q-input>
        </div>
        <div class="col-md-6 col-xs-12">
          <q-input
            v-model="dataread.garantia"
            type="text"
            label="Garantia"
            outlined
            dense
            color="primary"
            :readonly="bloqueado"
          >
          </q-input>
        </div>
        <div class="col-md-6 col-xs-12">
          <q-select
            v-model="dataread.tiempoentregalist"
            :options="entregas"
            label="Tiempos de Entrega"
            dateinpu
            outlined
            dense
            options-dense
            option-value="value"
            option-label="label"
            transition-show="flip-up"
            transition-hide="flip-down"
            color="primary"
            :readonly="bloqueado"
            map-options
            emit-value
            @update:model-value="tiempoentregaPRO(dataread.tiempoentregalist)"
          >
          </q-select>
        </div>

        <div class="col-md-6 col-xs-12 item-right">
          <q-input
            v-model="dataread.serviciosposventa"
            type="text"
            label="Servicio Posventa"
            outlined
            dense
            color="primary"
            :readonly="bloqueado"
          >
          </q-input>
        </div>
        <div
          class="col-md-6 col-xs-12"
          v-if="dataread.tiempoentregalist == 'Otro'"
        >
          <q-input
            v-model="dataread.tiempoentrega"
            type="text"
            label="Otro tiempo de entrega"
            outlined
            dense
            color="primary"
            :readonly="bloqueado"
          >
          </q-input>
        </div>

        <div class="col-xs-12">
          <span
            ><q-checkbox
              left-label
              v-model="dataread.mostrarcodigos"
              size="xs"
              label="Mostrar Códigos"
              color="primary"
              true-value="1"
              false-value="0"
              :disable="bloqueado"
            />
          </span>
          <span
            ><q-checkbox
              left-label
              v-model="dataread.mostrardescuentos"
              size="xs"
              label="Mostrar descuentos"
              color="primary"
              true-value="1"
              false-value="0"
              :disable="bloqueado"
            />
          </span>
          <span
            ><q-checkbox
              left-label
              v-model="dataread.mostrarlegales"
              size="xs"
              label="Requiere condiciones legales"
              color="primary"
              true-value="1"
              false-value="0"
              :disable="bloqueado"
            />
          </span>
        </div>
      </div>
    </q-card-section>
    <!-- <pre>dataread{{ dataread }}</pre> -->
    <q-separator inset />
    <q-inner-loading
      :showing="editcargar"
      label="Cargando la oferta comercial..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </q-card>
</template>
