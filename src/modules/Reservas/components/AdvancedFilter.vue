<script lang="ts">
import { ref, onMounted, watch } from 'vue';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { ReservasTableStore } from 'src/modules/Reservas/store/ReservasTableStore';
import {
  usePais,
  useUserDivision,
  useDateRange,
} from 'src/composables/useLanguage';
import DateRangeComponent from '../../../components/DateRange/DateRangeComponent.vue';
//import RelacionadoCon from '../../../components/Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoCon.vue';
import RelacionadoAco from '../../../components/Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoAco.vue';
//import RelacionadoPro from '../../../components/Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoPro.vue';
</script>

<script setup lang="ts">
const tableStore = ReservasTableStore();
const listDivision = ref();
const listMercado = ref();
const listGrupoCliente = ref();
const listEstado = [
  {
    label: 'Confirmado',
    value: 'confirmed',
  },
  {
    label: 'Cerrado',
    value: 'Closed',
  },
  {
    label: 'Bloqueado',
    value: 'blocked',
  },
  {
    label: 'Rechazado',
    value: 'rejected',
  },
];
const show_more_input = ref(false);
const todos = ref(false);
const form_fields = ref([...tableStore.visible_fields]);
// const dataFilter = ref<any>(tableStore.data_filter);
// const { listUsers, getListUsers, filterUsers } = useUserDivision();
// const { listPais, listRegion, getListPais, getListRegion } = usePais();
const { listDateRange } = useDateRange();
const dynamicInput = ref<InstanceType<typeof DateRangeComponent> | null>(null);
//const advancedFilterCon = ref<InstanceType<typeof RelacionadoCon> | null>(null);
const advancedFilterAco = ref<InstanceType<typeof RelacionadoAco> | null>(null);
//const advancedFilterPro = ref<InstanceType<typeof RelacionadoPro> | null>(null);
const dataFilter = ref<any>(tableStore.data_filter);
const dataExtra = ref<any>(tableStore.data_extra);
onMounted(async () => {
  getVisibleField();
  listDivision.value = await tableStore.getDivisionLead();
  listMercado.value = await tableStore.getAreaMercaLead(
    dataFilter.value.division
  );
  //listGrupoCliente.value = await tableStore.getGrupoClienteLead();
  const listaGR = await tableStore.getGrupoClienteLead(
    dataFilter.value.division
  );
  listGrupoCliente.value = listaGR.grupo;
});

watch(
  () => dataFilter.value.division,
  async () => {
    listMercado.value = await tableStore.getAreaMercaLead(
      dataFilter.value.division
    );
    const listaGR = await tableStore.getGrupoClienteLead(
      dataFilter.value.division
    );
    listGrupoCliente.value = listaGR.grupo;
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const form = ref<any>([
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
    field: 'areamercado',
    option_label: 'label',
    option_value: 'cod_amercado',
    options_dense: true,
    visible: true,
    emit_value: true,
    map_options: true,
    options: listMercado,
  },
  {
    input: 'q-select',
    label: 'Grupo Cliente',
    clearable: true,
    field: 'grupocliente',
    option_label: 'label',
    option_value: 'value',
    options_dense: true,
    visible: true,
    emit_value: true,
    map_options: true,
    options: listGrupoCliente,
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
    label: 'Numero',
    clearable: true,
    field: 'numero',
    visible: true,
  },
  {
    input: 'q-select',
    label: 'Estado',
    clearable: true,
    field: 'estado',
    option_label: 'label',
    option_value: 'value',
    options_dense: true,
    visible: true,
    emit_value: true,
    map_options: true,
    options: listEstado,
  },
  {
    input: 'q-input',
    label: 'Descripción / chasis / color',
    clearable: true,
    field: 'descripcion',
    visible: true,
  },
  // {
  //   with_avatar: true,
  //   input: 'q-select',
  //   label: 'Asignado a',
  //   field: 'assigned_to',
  //   option_value: 'id',
  //   option_label: 'user_name',
  //   selected_class: 'text-deep-primary text-bold',
  //   clearable: false,
  //   visible: true,
  //   use_chips: true,
  //   multiple: true,
  //   options: listUsers,
  //   use_input: true,
  //   debounce: 0,
  //   emit_value: true,
  //   map_options: true,
  //   filter_function: filterUsers,
  // },
  // {
  //   with_avatar: true,
  //   input: 'q-select',
  //   label: 'Creado por',
  //   field: 'created_by',
  //   option_value: 'id',
  //   option_label: 'user_name',
  //   selected_class: 'text-deep-primary text-bold',
  //   clearable: true,
  //   visible: true,
  //   use_chips: true,
  //   multiple: true,
  //   options: listUsers,
  //   use_input: true,
  //   debounce: 0,
  //   emit_value: true,
  //   map_options: true,
  //   filter_function: filterUsers,
  // },
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

const clearData = () => {
  dataFilter.value = {
    // easyFilter: '',
    name: '',
    grupocliente: [],
    descripcion: '',
    estado: '',
    numero: '',
    cuenta_id: '',
    contacto_id: '',
    prospecto_id: '',
    division: [],
    areamercado: [],
    region: '',
    created_by: [],
    assigned_to: [],
    creation_date: { from: '', to: '', operator: '', option: '' },
  };
  dataExtra.value = {
    name_account: '',
    name_contact: '',
    name_prospect: '',
  };
};
const clearFilter = () => {
  clearData();
};

const onSubmit = () => {
  // console.log('SUBMIT PARA LA BUSQUEADA DE LEADS', dataFilter.value);
  emit('submitFilter');
};

const openDialogAco = () => {
  advancedFilterAco.value?.openDialog();
};
const clearAco = () => {
  dataExtra.value.name_account = '';
  dataFilter.value.cuenta_id = '';
};
const selectRelaAco = (item: any) => {
  dataExtra.value.name_account = item.nombre;
  dataFilter.value.cuenta_id = item.id;
  advancedFilterAco.value?.onClose();
  // emit('changeRela', dataSend.value);
};

const changeDate = (val: any) => {
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
          <component
            :is="DateRangeComponent"
            :date="dataFilter.creation_date"
            ref="dynamicInput"
            @changeDate="changeDate"
            v-if="item.visible && item.field === 'creation_date'"
          >
          </component>
        </template>
        <div class="col-12">
          <q-input
            outlined
            v-model="dataExtra.name_account"
            label="Cuentas"
            class="col-md-6 col-sm-12"
            readonly
            dense
            label-slot
          >
            <template v-slot:prepend>
              <q-avatar>
                <q-icon name="account_circle" size="sm" />
              </q-avatar>
            </template>
            <template v-slot:after>
              <q-btn
                round
                dense
                size="sm"
                icon="search"
                color="blue-1"
                class="text-blue-10 q-ml-sm q-mr-sm"
                @click="openDialogAco"
                ><q-tooltip> Buscar cuentas </q-tooltip>
              </q-btn>
              <q-btn
                round
                class="text-red-10"
                dense
                size="sm"
                icon="close"
                color="red-2"
                @click="clearAco"
                ><q-tooltip> Limpiar Busqueda </q-tooltip></q-btn
              >
            </template>
          </q-input>
        </div>
        <q-btn
          label="agregar mas campos"
          dense
          outline
          class="full-width q-my-sm"
          color="accent"
          @click="show_more_input = !show_more_input"
        ></q-btn>
      </div>
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
</template>
