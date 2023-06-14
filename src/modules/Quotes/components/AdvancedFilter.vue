<script lang="ts">
import { ref, onMounted, watch } from 'vue';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { userStore } from 'src/modules/Users/store/UserStore';
import { QuotesTableStore } from '../store/QuotesTableStore';
import {
  usePais,
  useUserDivision,
  useDateRange,
} from 'src/composables/useLanguage';
import DateRangeComponent from '../../../components/DateRange/DateRangeComponent.vue';
import RelacionadoCon from '../../../components/Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoCon.vue';
import RelacionadoAco from '../../../components/Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoAco.vue';
import RelacionadoPro from '../../../components/Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoPro.vue';
import RelacionadoLed from '../../../components/Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoLed.vue';
import RelacionadoOpo from '../../../components/Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoOpo.vue';
import DialogFilterEas from 'src/components/MainDialog/DialogFilterEas.vue';
import { useActivityStore } from 'src/stores/ActivityStore';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';

// import { table } from 'console';
// import { useFormOptionsStore } from 'src/stores/formOptionsStore';
// import AdvancedFilterCampaign from './AdvancedFilterCampaign.vue';
import { tableStore } from '../../../stores/TableStore';
</script>

<script setup lang="ts">
const tableStore = QuotesTableStore();
const activityStore = useActivityStore();
const listDivision = ref();
const listMercado = ref();
const listRegionv2 = ref();
const user = userStore();
const show_more_input = ref(false);
const todos = ref(false);
const cargarinput = ref(false);

const form_fields = ref([...tableStore.visible_fields]);
const { listUsers, getListUsers, filterUsers } = useUserDivision();
const { listPais, listRegion, getListPais, getListRegion } = usePais();
const { listDateRange, getListDateRange } = useDateRange();

const dynamicInput = ref<InstanceType<typeof DateRangeComponent> | null>(null);
const advancedFilterCon = ref<InstanceType<typeof RelacionadoCon> | null>(null);
const advancedFilterAco = ref<InstanceType<typeof RelacionadoAco> | null>(null);
const advancedFilterPro = ref<InstanceType<typeof RelacionadoPro> | null>(null);
const advancedFilterLed = ref<InstanceType<typeof RelacionadoLed> | null>(null);
const advancedFilterOpo = ref<InstanceType<typeof RelacionadoOpo> | null>(null);
const dialogFilterEasRef = ref<InstanceType<typeof DialogFilterEas> | null>(
  null
);

const dataFilter = ref<any>(tableStore.data_filter);
const dataExtra = ref<any>(tableStore.data_extra);

onMounted(async () => {
  // listDivision.value = await tableStore.getDivisionLead();
  // console.log('nueva lista', await tableStore.getRegionalv2Store());
  listRegionv2.value = await tableStore.getRegionalv2Store();
  listDivision.value = await tableStore.getDivisionLead();
  listMercado.value = await tableStore.getAreaMercaLead(
    dataFilter.value.division
  );
  // listPais.value = await tableStore.getPaisLead();
  await getListUsers(user.userCRM.iddivision);
  await getListPais();
  await getListDateRange();
  await tableStore.getGrupoClienteLead();
  await tableStore.getOrigenLead();
  await tableStore.getEstadoLead();
  getVisibleField();
  // listMercado.value = await tableStore.getAreaMercaLead(
  //   '01 Industria & Construcción'
  // );
  // division();
  // divisionRes('01 Industria & Construcción');
  // console.log(listGrupoCliente.value);
});

watch(
  () => dataFilter.value.division,
  async () => {
    listMercado.value = await tableStore.getAreaMercaLead(
      dataFilter.value.division
    );
  }
);
// watch(
//   () => dataFilter.value.country,
//   (country: string | string[]) => {
//     dataFilter.value.state = '';
//     if (typeof country === 'string') getListRegion(country);
//   }
// );

const opciones_estado = [
  { label: 'Borrador', valueE: 'Draft' },
  { label: 'Negociación', valueE: 'Negotiation' },
  { label: 'Confirmado', valueE: 'Confirmed' },
  { label: 'Rechazada', valueE: 'Not_Approved' },
  { label: 'Anulado', valueE: 'Canceled' },
];
// watch(
//   () => dataFilter.value.areamercado,

//   auxArea.map((el) => {
//       if (el.name_en == recuperandoCall.value.attributes.status) {
//         dataread.value.estadollamada = el.name_es;
//       } else {
//       }
//       return console.log('object2');
//     });
// );

//DESFREAGMENTADO EL DIVISION Y EL AREA DE MERCADO
// const division = async () => {
//   // console.log(props.idCallRecuTable);
//   const divi = await tableStore.getDivisionLead();
//   divisionDes.value = divi.map((aux) => {
//     return {
//       cod_div: aux.cod_div,
//       nombre: aux.label,
//       id: aux._id,
//       areamercados: [
//         ...aux.amercado.map((aux2) => {
//           return {
//             area: aux2.label,
//             cod_area: aux2.cod_amercado,
//           };
//         }),
//       ],
//     };
//   });
//   console.log(divisionDes.value);
// };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const form = ref<any>([
  {
    input: 'q-input',
    label: 'Número Cotización',
    clearable: true,
    field: 'nroCotizacion',
    visible: true,
  },
  {
    input: 'q-input',
    label: 'Nombre',
    clearable: true,
    field: 'name',
    visible: true,
  },
  {
    input: 'q-input',
    label: 'Chasis',
    clearable: true,
    field: 'chasis',
    visible: true,
  },
  {
    input: 'q-input',
    label: 'Año',
    clearable: true,
    field: 'anio',
    visible: true,
  },
  // {
  //   input: 'q-select',
  //   label: 'Pais',
  //   clearable: true,
  //   field: 'country',
  //   option_label: 'label',
  //   option_value: 'cod_pais',
  //   options_dense: true,
  //   visible: true,
  //   emit_value: true,
  //   map_options: true,
  //   options: listPais,
  // },
  {
    input: 'q-select',
    label: 'Departamento',
    clearable: true,
    option_label: 'label',
    option_value: 'cod_region',
    field: 'regional',
    options_dense: true,
    visible: true,
    emit_value: true,
    map_options: true,
    options: listRegionv2,
  },
  {
    input: 'q-input',
    label: 'Codigo AIO',
    clearable: true,
    field: 'codigoAIO',
    visible: true,
  },
  {
    input: 'q-select',
    label: 'Etapa Cotización',
    clearable: true,
    option_label: 'label',
    option_value: 'valueE',
    field: 'etapaCotizacion',
    options_dense: true,
    visible: true,
    emit_value: true,
    map_options: true,
    options: opciones_estado,
  },
  {
    input: 'q-select',
    label: 'Division',
    clearable: true,
    field: 'division',
    option_label: 'label',
    option_value: 'cod_div',
    options_dense: true,
    visible: true,
    emit_value: true,
    map_options: true,
    options: listDivision,
  },
  {
    input: 'q-select',
    label: 'Area de Mercado',
    clearable: true,
    field: 'amercado',
    option_label: 'label',
    option_value: 'cod_amercado',
    options_dense: true,
    visible: true,
    emit_value: true,
    map_options: true,
    options: listMercado,
  },
  {
    with_avatar: true,
    input: 'q-select',
    label: 'Asignado a',
    field: 'userassigned',
    option_value: 'id',
    option_label: 'user_name',
    selected_class: 'text-deep-primary text-bold',
    clearable: false,
    visible: true,
    use_chips: true,
    multiple: true,
    options: listUsers,
    use_input: true,
    debounce: 0,
    emit_value: true,
    map_options: true,
    filter_function: filterUsers,
  },
  {
    with_avatar: true,
    input: 'q-select',
    label: 'Creado por',
    field: 'usercreate',
    option_value: 'id',
    option_label: 'user_name',
    selected_class: 'text-deep-primary text-bold',
    clearable: false,
    visible: true,
    use_chips: true,
    multiple: true,
    options: listUsers,
    use_input: true,
    debounce: 0,
    emit_value: true,
    map_options: true,
    filter_function: filterUsers,
  },
  {
    input: 'q-select',
    label: 'Fecha creacion',
    clearable: true,
    field: 'creation_date',
    visible: true,
    withInput: true,
    options_dense: true,
    emit_value: true,
    map_options: true,
    option_label: 'label',
    option_value: 'value',
    options: listDateRange,
  },
]);

const AllRela = (item: any) => {
  // console.log(item);
  if (dataFilter.value.contacto == 'pre') {
    selectRelaCon(item);
  }
  if (dataFilter.value.cuenta == 'pre') {
    selectRelaAco(item);
  }
  if (dataFilter.value.idprospect == 'pre') {
    selectRelaPro(item);
  }
  if (dataFilter.value.idlead == 'pre') {
    selectRelaLed(item);
  }
};

// tr=========================================================================
const selectRelaCon = (item: any) => {
  // console.log(item);
  dataExtra.value.name_contact = item.nombre;
  dataFilter.value.contacto = item.id;
  advancedFilterCon.value?.onClose();
  // emit('changeRela', dataRela.value);
};
//para abrir y cerrar los dialogs
const openDialogConAcount = () => {
  if (dataFilter.value.cuenta == '') {
    advancedFilterCon.value?.openDialog();
  } else {
    advancedFilterCon.value?.openDialogAcoWithCont(
      dataFilter.value.cuenta,
      dataExtra.value.name_account
    );
  }
};
const clearCon = () => {
  dataExtra.value.name_contact = '';
  dataFilter.value.contacto = '';
  onSubmit();
};
const cargarcont = ref(false);
const onSubmitCons = async () => {
  cargarcont.value = true;
  const dataInicio = await activityStore.getFiltroEasyCon(
    dataExtra.value.name_contact
  );
  // console.log('entrada del data inciio', dataInicio);
  dialogFilterEasRef.value?.openDialog(dataInicio);
  // dataExtra.value.name_contact = '';
  dataFilter.value.contacto = 'pre';
  cargarcont.value = false;
};
// tr=========================================================================

const selectRelaAco = (item: any) => {
  // console.log(item);
  dataExtra.value.name_account = item.nombre;
  dataFilter.value.cuenta = item.id;
  advancedFilterAco.value?.onClose();
  // emit('changeRela', dataSend.value);
};
const openDialogAco = () => {
  advancedFilterAco.value?.openDialog();
};
const clearAco = () => {
  dataExtra.value.name_account = '';
  dataFilter.value.cuenta = '';
  onSubmit();
};
const cargaracons = ref(false);
const onSubmitAcons = async () => {
  cargaracons.value = true;
  const dataInicio = await activityStore.getFiltroEasyAco(
    dataExtra.value.name_account
  );
  // console.log('entrada del data inciio', dataInicio);
  dialogFilterEasRef.value?.openDialog(dataInicio);
  // dataExtra.value.name_account = '';
  dataFilter.value.cuenta = 'pre';
  cargaracons.value = false;
};
// tr=========================================================================
const selectRelaPro = (item: any) => {
  // console.log(item);
  dataExtra.value.name_prospecto = item.nombre;
  dataFilter.value.idprospect = item.id;
  advancedFilterPro.value?.onClose();
  // emit('changeRela', dataSend.value);
};
const openDialogPro = () => {
  advancedFilterPro.value?.openDialog();
};
const clearPro = () => {
  dataExtra.value.name_prospecto = '';
  dataFilter.value.idprospect = '';
  onSubmit();
};
const cargarpros = ref(false);
const onSubmitPros = async () => {
  cargarpros.value = true;
  const dataInicio = await activityStore.getFiltroEasyPro(
    dataExtra.value.name_prospecto
  );
  // console.log('entrada del data inciio', dataInicio);
  dialogFilterEasRef.value?.openDialog(dataInicio);
  // dataExtra.value.name_prospecto = '';
  dataFilter.value.idprospect = 'pre';
  cargarpros.value = false;
};
// tr=========================================================================
const selectRelaLed = (item: any) => {
  // console.log(item);
  dataExtra.value.name_lead = item.nombre;
  dataFilter.value.idlead = item.id;
  advancedFilterLed.value?.onClose();
  // emit('changeRela', dataSend.value);
};
const openDialogLed = () => {
  advancedFilterLed.value?.openDialog();
};
const clearLed = () => {
  dataExtra.value.name_lead = '';
  dataFilter.value.idlead = '';
  onSubmit();
};
const cargarleds = ref(false);
const onSubmitLeds = async () => {
  cargarleds.value = true;
  const dataInicio = await activityStore.getFiltroEasyLed(
    dataExtra.value.name_lead
  );
  // console.log('entrada del data inciio', dataInicio);
  dialogFilterEasRef.value?.openDialog(dataInicio);
  // dataExtra.value.name_lead = '';
  dataFilter.value.idlead = 'pre';
  cargarleds.value = false;
};
// tr=========================================================================
const selectRelaOpo = (item: any) => {
  // console.log(item);
  dataExtra.value.name_oportunidad = item.nombre;
  dataFilter.value.oportunidad = item.id;
  advancedFilterOpo.value?.onClose();
  // emit('changeRela', dataSend.value);
};
const openDialogOpo = () => {
  advancedFilterOpo.value?.openDialog();
};
const clearOpo = () => {
  dataExtra.value.name_oportunidad = '';
  dataFilter.value.oportunidad = '';
};
// tr=========================================================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const dataFilter = ref<any>(tableStore.data_filter);

const clearData = () => {
  dataFilter.value = {
    nroCotizacion: '',
    name: '',
    chasis: '',
    anio: '',
    regional: [],
    division: [],
    amercado: [],
    codigoAIO: '',
    etapaCotizacion: '',
    oportunidad: '',
    cuenta: '',
    contacto: '',
    usercreate: [],
    usermodificate: [],
    userassigned: [],
    creation_date: {
      from: '',
      to: '',
      operator: '',
      option: '',
    },
    creation_amount: {
      amount_from: '',
      amount_to: '',
      amount_operator: '',
    },
    idlead: '',
    idprospect: '',
  };
  dataExtra.value = {
    name_account: '',
    name_contact: '',
    name_prospecto: '',
    name_lead: '',
    name_oportunidad: '',
  };
};
const clearFilter = () => {
  clearData();
  if (dynamicInput.value?.length > 0) {
    dynamicInput.value[0].resetData();
  }
  // console.log('BORRANDO DE LEADS', dataFilter.value, dataExtra.value);
};
// watch(
//   () =>
//     dataExtra.value.name_account +
//     dataExtra.value.name_contact +
//     dataExtra.value.name_prospect,
//   async () => {
//     dataFilter.value.cuenta = dataRela.value.idmoduloAco;
//     dataFilter.value.contacto = dataRela.value.idmoduloCon;
//     dataFilter.value.prospecto = dataRela.value.idmoduloPro;
//   }
// );
const onSubmit = () => {
  emit('submitFilter');
};

const changeDate = (val: any) => {
  // console.log(dataFilter);
  dataFilter.value.creation_date = val;
  // console.log(dataFilter.value.creation_date);
};
const getVisibleField = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form.value.map((el: any) => {
    const visible = form_fields.value.find((el2) => el2 === el.field);
    return el.field == visible ? (el.visible = true) : (el.visible = false);
  });
};
const selectAllInputs = () => {
  form_fields.value = [];
  if (todos.value) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form_fields.value = form.value.map((el: any) => {
      el.visible = todos.value;
      return el.field;
    });
  }
};
const setVisibleFields = () => {
  getVisibleField();
  tableStore.setVisibleField(form_fields.value);
};

const cancelSelecction = () => {
  form_fields.value = [...tableStore.visible_fields];
};

/** Emits and Exposes */
const emit = defineEmits<{
  (event: 'submitFilter'): void;
}>();
defineExpose({ dataFilter, dataExtra, clearFilter });
</script>

<style lang="scss" scoped>
.q-chip {
  max-width: 140px;
}
.range-input-text {
  border: 1px solid #c2c2c2;
  margin-top: 7px;
  padding: 0.2em;
  border-radius: 5px;
}
</style>

<template>
  <q-card class="no-shadow border-none">
    <q-card-section>
      <div class="row q-col-gutter-y-sm">
        <template v-for="(item, index) in form" :key="index">
          <component
            :is="item.input"
            @keyup.enter="onSubmit"
            :label="item.label"
            dense
            outlined
            v-model="dataFilter[item.field]"
            :options="item.options"
            :use-input="item.use_input"
            :multiple="item.multiple"
            :use-chips="item.use_chips"
            :input-debounce="item.debounce"
            :option-value="item.option_value"
            :option-label="item.option_label"
            :options-dense="item.options_dense"
            :options-selected-class="item.selected_class"
            :emit-value="item.emit_value"
            :map-options="item.map_options"
            @filter="item.filter_function"
            class="col-12"
            v-if="item.visible && item.field !== 'creation_date'"
          >
            <template #selected-item="scope" v-if="item.with_avatar">
              <q-chip
                removable
                dense
                @remove="scope.removeAtIndex(scope.index)"
                :tabindex="scope.tabindex"
                color="grey-4"
                size="md"
                text-color="primary"
              >
                <q-avatar>
                  <img :src="`${HANSACRM3_URL}${scope.opt.avatar}`" />
                </q-avatar>
                <div class="ellipsis">
                  {{ scope.opt.user_name }}
                  <q-tooltip class="bg-primary">
                    <div>{{ scope.opt.user_name }}</div>
                  </q-tooltip>
                </div>
              </q-chip>
            </template>
            <template #option="scope" v-if="item.with_avatar">
              <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                  <img
                    :src="`${HANSACRM3_URL}${scope.opt.avatar}`"
                    style="width: 30px"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ scope.opt.user_name }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.a_mercado }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </component>
          <!-- <component
            :is="DateRangeComponent"
            :date="dataFilter.creation_date"
            ref="dynamicInput"
            @changeDate="changeDate"
            v-if="item.visible && item.field === 'creation_date'"
          >
          </component> -->
        </template>
        <div class="col-12">
          <q-input
            outlined
            v-model="dataExtra.name_account"
            label="Cuentas"
            class="col-md-6 col-sm-12"
            dense
            label-slot
            :disable="cargaracons"
            :loading="cargaracons"
            @keyup.enter="onSubmitAcons"
          >
            <template v-slot:prepend>
              <q-avatar>
                <q-icon name="account_circle" size="sm" />
              </q-avatar>
            </template>
            <template v-slot:after>
              <q-btn
                dense
                outline
                icon="north_west"
                color="primary"
                @click="openDialogAco"
              />
              <q-btn
                dense
                outline
                icon="close"
                color="negative"
                @click="clearAco"
              />
            </template>
          </q-input>
        </div>
        <div class="col-12">
          <q-input
            outlined
            v-model="dataExtra.name_contact"
            label="Contactos"
            class="col-md-6 col-sm-12"
            dense
            label-slot
            :disable="cargarcont"
            :loading="cargarcont"
            @keyup.enter="onSubmitCons"
          >
            <template v-slot:prepend>
              <q-avatar>
                <q-icon name="perm_contact_calendar" size="sm" />
              </q-avatar>
            </template>
            <template v-slot:after>
              <q-btn
                dense
                outline
                icon="north_west"
                color="primary"
                @click="openDialogConAcount"
              >
                <q-badge
                  rounded
                  floating
                  color="red"
                  v-if="
                    dataExtra.name_account != '' && dataExtra.name_contact == ''
                  "
                  >!</q-badge
                >
              </q-btn>
              <q-btn
                dense
                outline
                icon="close"
                color="negative"
                @click="clearCon"
              />
            </template>
          </q-input>
        </div>
        <div class="col-12">
          <q-input
            outlined
            v-model="dataExtra.name_prospecto"
            label="Prospectos"
            class="col-md-6 col-sm-12"
            dense
            label-slot
            :disable="cargarpros"
            :loading="cargarpros"
            @keyup.enter="onSubmitPros"
          >
            <template v-slot:prepend>
              <q-avatar>
                <q-icon name="analytics" size="sm" />
              </q-avatar>
            </template>
            <template v-slot:after>
              <q-btn
                dense
                outline
                icon="north_west"
                color="primary"
                @click="openDialogPro"
              />
              <q-btn
                dense
                outline
                icon="close"
                color="negative"
                @click="clearPro"
              />
            </template>
          </q-input>
        </div>
        <!-- input-debounce="300" -->
        <div class="col-12">
          <q-input
            outlined
            v-model="dataExtra.name_lead"
            label="Leads"
            class="col-md-6 col-sm-12"
            dense
            label-slot
            :disable="cargarleds"
            :loading="cargarleds"
            @keyup.enter="onSubmitLeds"
          >
            <template v-slot:prepend>
              <q-avatar>
                <q-icon name="groups_2" size="sm" />
              </q-avatar>
            </template>
            <template v-slot:after>
              <q-btn
                dense
                outline
                icon="north_west"
                color="primary"
                @click="openDialogLed"
              />
              <q-btn
                dense
                outline
                icon="close"
                color="negative"
                @click="clearLed"
              />
            </template>
          </q-input>
        </div>
        <div class="col-12">
          <q-input
            outlined
            v-model="dataExtra.name_oportunidad"
            label="Oportunidades"
            class="col-md-6 col-sm-12"
            readonly
            dense
            label-slot
          >
            <template v-slot:prepend>
              <q-avatar>
                <q-icon name="work" size="sm" />
              </q-avatar>
            </template>
            <template v-slot:after>
              <q-btn
                dense
                outline
                icon="north_west"
                color="primary"
                @click="openDialogOpo"
              />
              <q-btn
                dense
                outline
                icon="close"
                color="negative"
                @click="clearOpo"
              />
            </template>
          </q-input>
        </div>

        <component
          :is="DateRangeComponent"
          :date="dataFilter.creation_date"
          ref="dynamicInput"
          @changeDate="changeDate"
        >
        </component>

        <q-btn
          label="agregar mas campos"
          dense
          outline
          class="full-width q-my-sm"
          color="accent"
          @click="show_more_input = !show_more_input"
        ></q-btn>
      </div>
      <!-- <pre>
          {{ dataFilter }}
          {{ dataExtra }}
        </pre
      > -->
    </q-card-section>
  </q-card>
  <q-dialog v-model="show_more_input">
    <q-card style="width: 700px; max-width: 80vw">
      <q-card-section>
        <div class="text-h7 q-pt-none">
          <q-checkbox v-model="todos" @click="selectAllInputs" />
          Campos de búsqueda
          <q-btn
            icon="close"
            flat
            dense
            class="float-right"
            v-close-popup
            @click="cancelSelecction"
          />
        </div>
        <hr />
        <div class="q-col-gutter-sm">
          <q-checkbox
            v-for="(item, index) in form"
            :key="index"
            keep-color
            v-model="form_fields"
            :label="item['label']"
            color="primary"
            style="width: 33.3%"
            :val="item.field"
          />
        </div>
      </q-card-section>
      <q-card-actions align="center" class="text-primary">
        <q-btn
          color="primary"
          icon="save"
          label="Guardar"
          v-close-popup
          @click="setVisibleFields"
        />
        <q-btn
          color="secondary"
          label="Cancelar"
          v-close-popup
          @click="cancelSelecction"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <RelacionadoAco
    ref="advancedFilterAco"
    @selectItem="selectRelaAco"
    account_id=""
  />
  <RelacionadoCon
    account_id=""
    ref="advancedFilterCon"
    @selectItem="selectRelaCon"
  />
  <RelacionadoPro
    account_id=""
    ref="advancedFilterPro"
    @selectItem="selectRelaPro"
  />
  <RelacionadoLed
    account_id=""
    ref="advancedFilterLed"
    @selectItem="selectRelaLed"
  />
  <RelacionadoOpo
    account_id=""
    ref="advancedFilterOpo"
    @selectItem="selectRelaOpo"
  />
  <DialogFilterEas ref="dialogFilterEasRef" id="" @seleccionando="AllRela" />

  <!-- <AlertComponent
    v-model="showConfimed"
    v-bind="propsInsertAlert"
    @confirm="deleteCallP"
    @denegate="deletecancelCallP"
  >
  </AlertComponent> -->
</template>
