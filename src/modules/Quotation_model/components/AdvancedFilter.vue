<script lang="ts">
import { ref, onMounted, watch } from 'vue';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { userStore } from 'src/modules/Users/store/UserStore';
import { QuotationTableStore } from '../store/QuotationTableStore';
import {
  usePais,
  useUserDivision,
  useDateRange,
} from 'src/composables/useLanguage';
import DateRangeComponent from '../../../components/DateRange/DateRangeComponent.vue';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
// import { table } from 'console';
// import { useFormOptionsStore } from 'src/stores/formOptionsStore';
// import AdvancedFilterCampaign from './AdvancedFilterCampaign.vue';
</script>

<script setup lang="ts">
const tableStore = QuotationTableStore();
const listDivision = ref();
const listMercado = ref();
const user = userStore();
const show_more_input = ref(false);
const todos = ref(false);

const form_fields = ref([...tableStore.visible_fields]);
const { listUsers, getListUsers, filterUsers } = useUserDivision();
const { listPais, listRegion, getListPais, getListRegion } = usePais();
const { listDateRange, getListDateRange } = useDateRange();

const dynamicInput = ref<InstanceType<typeof DateRangeComponent> | null>(null);

const dataFilter = ref<any>(tableStore.data_filter);
const dataExtra = ref<any>(tableStore.data_extra);

onMounted(async () => {
  // listDivision.value = await tableStore.getDivisionLead();
  // console.log('nueva lista', listDivision.value);
  listDivision.value = await tableStore.getDivisionLead();
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
  () => dataFilter.value.iddivision,
  async () => {
    listMercado.value = await tableStore.getAreaMercaLead(
      dataFilter.value.iddivision
    );
  }
);
watch(
  () => dataFilter.value.country,
  (country: string | string[]) => {
    dataFilter.value.state = '';
    if (typeof country === 'string') getListRegion(country);
  }
);

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
    label: 'Nombre',
    clearable: true,
    field: 'name',
    visible: true,
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
    label: 'Division',
    clearable: true,
    field: 'iddivicion',
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
    field: 'idamercado',
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const dataFilter = ref<any>(tableStore.data_filter);

const clearData = () => {
  dataFilter.value = {
    // easyFilter: '',
    name: '',
    codigoAIO: '',
    iddivicion: [],
    idamercado: [],
    creation_date: { from: '', to: '', operator: '', option: '' },
  };
  dataExtra.value = {
    extra: '',
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
  // console.log('SUBMIT PARA LA BUSQUEADA DE LEADS', dataFilter.value);

  emit('submitFilter');
};

const changeDate = (val: any) => {
  console.log(val);
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

  <!-- <AlertComponent
    v-model="showConfimed"
    v-bind="propsInsertAlert"
    @confirm="deleteCallP"
    @denegate="deletecancelCallP"
  >
  </AlertComponent> -->
</template>
