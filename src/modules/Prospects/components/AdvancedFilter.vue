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
            v-if="
              item.visible &&
              item.field !== 'creation_date' &&
              item.field != 'campaign'
            "
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
          <!-- <div
            class="col-12 range-input-text row flex items-center"
            v-if="item.field === 'creation_date' && item.visible === true"
          >
            <div class="col-md-1 col-xs-2 text-center">
              <q-btn icon="event" dense flat color="primary">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="dataFilter.creation_date"
                    range
                    mask="YYYY-MM-DD"
                    :locale="spanish"
                  >
                    <div class="row items-center justify-center">
                      <q-btn
                        v-close-popup
                        label="Cerrar"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-btn>
            </div>

            <div class="col-md-7 col-xs-10">
              Desde: {{ dataFilter.creation_date?.from ?? 'AAAA-MM-DD' }} ,
              Hasta: {{ dataFilter.creation_date?.to ?? 'AAAA-MM-DD' }}
            </div>

            <q-select
              dense
              v-model="dataFilter['creation_date']"
              label="Selección rápida"
              :option-value="item.option_value"
              :option-label="item.option_label"
              :options-dense="item.options_dense"
              :options="item.options"
              :emit-value="item.emit_value"
              :map-options="item.map_options"
              class="col-md-4 col-xs-12"
            >
            </q-select>
          </div> -->
          <div
            class="col-12"
            v-if="item.field === 'campaign' && item.visible === true"
          >
            <q-input
              outlined
              v-model="dataExtra.name_campaign"
              label="Campaña"
              class="col-md-6 col-sm-12"
              readonly
              dense
              label-slot
            >
              <template v-slot:prepend>
                <q-avatar>
                  <q-icon name="campaign" color="blue-10" size="sm" />
                </q-avatar>
              </template>
              <template v-slot:after>
                <q-btn
                  dense
                  icon="north_west"
                  color="primary"
                  @click="openFilterCampaign"
                />
                <q-btn
                  dense
                  flat
                  icon="close"
                  color="negative"
                  @click="clearCampaign"
                />
              </template>
            </q-input>
          </div>
        </template>
        <q-btn
          label="agregar campos"
          dense
          outline
          class="full-width q-my-sm"
          color="accent"
          @click="show_more_input = !show_more_input"
        ></q-btn>
      </div>
      <!-- <pre>{{ dataFilter }}</pre>
      <pre>{{ dataExtra }}</pre> -->
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
      <!-- <q-card-section class="q-pt-none">
        <div class="text-h6 q-pt-none">Módulos relaciondos</div>
        <hr />
        <div class="q-col-gutter-sm">
          <q-checkbox
            v-for="(item, index) in form_modules"
            :key="index"
            keep-color
            v-model="item['visible']"
            :label="item['label']"
            color="primary"
            style="width: 33.3%"
            disable
            :val="item['visible']"
          />
        </div>
      </q-card-section> -->
    </q-card>
  </q-dialog>

  <AdvancedFilterCampaign
    ref="filterCampaignRef"
    @select-item="selectCampaign"
  />
</template>

<script lang="ts">
import { ref, onMounted, watch } from 'vue';
import {
  useDateRange,
  usePais,
  useUserDivision,
  useProspectSource,
  useProspectStatus,
} from 'src/composables/useLanguage';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { userStore } from 'src/modules/Users/store/UserStore';
import { ProspectTableStore } from '../store/ProspectTableStore';
import AdvancedFilterCampaign from './AdvancedFilterCampaign.vue';
import DateRangeComponent from '../../../components/DateRange/DateRangeComponent.vue';
</script>

<script setup lang="ts">
const tableStore = ProspectTableStore();
const user = userStore();
const { listUsers, getListUsers, filterUsers } = useUserDivision();
const { listPais, listRegion, getListPais, getListRegion } = usePais();
const { listProspectStatus, getListProspectStatus } = useProspectStatus();
const { listProspectSource, getListProspectSource } = useProspectSource();

const { listDateRange, getListDateRange } = useDateRange();

const show_more_input = ref(false);
const todos = ref(false);
const campaign_name = ref('');
const filterCampaignRef = ref();
const form_fields = ref([...tableStore.visible_fields]);

const dynamicInput = ref<InstanceType<typeof DateRangeComponent> | null>(null);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const form = ref<any>([
  {
    input: 'q-input',
    label: 'Campaña',
    clearable: true,
    field: 'campaign',
    visible: true,
  },
  {
    input: 'q-input',
    label: 'Nombre de la cuenta',
    clearable: true,
    field: 'account_name',
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
    label: 'Apellidos',
    clearable: true,
    field: 'lastname',
    visible: true,
    dependence: 'Privada',
  },
  {
    input: 'q-select',
    label: 'Toma de contacto',
    clearable: true,
    field: 'lead_source',
    option_label: 'label',
    option_value: 'value',
    options_dense: true,
    visible: false,
    emit_value: true,
    map_options: true,
    options: listProspectSource,
  },
  {
    input: 'q-select',
    label: 'Estado',
    clearable: true,
    field: 'status',
    option_label: 'label',
    option_value: 'value',
    options_dense: true,
    visible: false,
    emit_value: true,
    map_options: true,
    options: listProspectStatus,
  },
  {
    input: 'q-input',
    label: 'Telefono / Celular',
    type: 'tel',
    clearable: true,
    field: 'phone',
    visible: true,
  },
  {
    input: 'q-input',
    type: 'email',
    label: 'Email',
    clearable: true,
    field: 'email',
    visible: true,
  },
  {
    with_avatar: true,
    input: 'q-select',
    label: 'Asignado a',
    field: 'assigned_to',
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
    field: 'created_by',
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
    label: 'Modificado por',
    field: 'modified_by',
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
    label: 'Pais',
    clearable: true,
    field: 'country',
    option_label: 'label',
    option_value: 'cod_pais',
    options_dense: true,
    visible: false,
    emit_value: true,
    map_options: true,
    options: listPais,
  },
  {
    input: 'q-select',
    label: 'Departamento',
    clearable: true,
    option_label: 'label',
    option_value: 'cod_region',
    field: 'state',
    options_dense: true,
    visible: false,
    emit_value: true,
    map_options: true,
    options: listRegion,
  },
  {
    input: 'q-input',
    label: 'Ciudad',
    clearable: true,
    field: 'city',
    visible: false,
  },
  {
    input: 'q-input',
    label: 'Direccion',
    clearable: true,
    field: 'street',
    visible: false,
  },
  {
    input: 'q-select',
    label: 'Fecha creacion',
    clearable: true,
    field: 'creation_date',
    visible: false,
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
const dataFilter = ref<any>(tableStore.data_filter);
const dataExtra = ref<any>(tableStore.data_extra);

const openFilterCampaign = () => {
  filterCampaignRef.value.openDialog();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectCampaign = (item: any) => {
  campaign_name.value = item.nombre;
  dataFilter.value.campaign = item.id;
  dataExtra.value.name_campaign = item.nombre;
};

const clearCampaign = () => {
  campaign_name.value = '';
  dataFilter.value.campaign = '';
  dataExtra.value.name_campaign = '';
};

watch(
  () => dataFilter.value.country,
  (country: string | string[]) => {
    dataFilter.value.state = '';
    if (typeof country === 'string') getListRegion(country);
  }
);

const clearData = () => {
  dataFilter.value = {
    campaign: '',
    account_name: '',
    name: '',
    lastname: '',
    lead_source: [],
    status: [],
    phone: '',
    email: '',
    country: '',
    state: '',
    city: '',
    street: '',
    created_by: [],
    modified_by: [],
    assigned_to: [],
    creation_date: { from: '', to: '', operator: '', option: '' },
  };
  // campaign_name.value = '';
  dataExtra.value = {
    name_campaign: '',
  };
};

onMounted(async () => {
  await getListUsers(user.userCRM.iddivision);
  await getListPais();
  await getListProspectSource();
  await getListProspectStatus();
  await getListDateRange();
  getVisibleField();
});

/**Filter Methods */
const onSubmit = () => {
  emit('submitFilter');
};

const clearFilter = () => {
  clearData();
  // if (!dynamicInput.value?.resetData) {
  if (dynamicInput.value?.length > 0) {
    // console.log('entrando date cuenta');
    dynamicInput.value[0].resetData();
    // dynamicInput.value[0].value.resetData
    // dynamicInput.value?.resetData();
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
