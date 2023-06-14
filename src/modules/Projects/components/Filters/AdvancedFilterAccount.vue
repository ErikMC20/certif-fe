<script lang="ts">
import { ref, onMounted, watch } from 'vue';
import {
  useTipoCliente,
  useTipoCuenta,
  useRubro,
  useUserDivision,
  useTipoDocumento,
  usePais,
  useRegimenTributario,
  useDateRange,
} from 'src/composables/useLanguaje';
import { userStore } from 'src/modules/Users/store/UserStore';
import { getAccountFilter } from '../../services/useProjectService';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import DateRangeComponent from 'src/components/DateRange/DateRangeComponent.vue';
</script>

<script setup lang="ts">
withDefaults(
  defineProps<{
    module_id?: string;
    persistent?: boolean;
  }>(),
  {
    persistent: false,
  }
);

/** conts */

const { listUsers, getListUsers, filterUsers } = useUserDivision();
const { listTipoCliente, getListTipoCliente, filterTipoCliente } =
  useTipoCliente();
const { listTipoCuenta, getListTipoCuenta } = useTipoCuenta();
const { listRubro, listSubrubro, getListRubro, getListSubrubro } = useRubro();
const { listTipoDocumento, getListTipoDocumento } = useTipoDocumento();
const { listPais, listRegion, getListPais, getListRegion } = usePais();
const { listRegimenTributario, getListRegimenTributario } =
  useRegimenTributario();
const { listDateRange, getListDateRange } = useDateRange();

const showFilterDialog = ref(false);
const showMoreInputs = ref(false);
const isFiltering = ref(false);
const loading = ref(false);
const listAccounts = ref([]);
const { userCRM } = userStore();

const formInputs = ref([
  {
    input: 'q-select',
    field: 'account_type',
    label: 'Tipo cuenta',
    clearable: true,
    option_label: 'label',
    option_value: 'cod_c',
    option_dense: true,
    visible: true,
    emit_value: true,
    map_options: true,
    options: listTipoCuenta,
  },
  {
    input: 'q-input',
    label: 'Nombre(s)',
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
    field_depencende: 'account_type',
  },
  {
    input: 'q-input',
    label: 'Nombre Comercial',
    clearable: true,
    field: 'comercial_name',
    visible: true,
    dependence: 'Empresa',
    field_depencende: 'account_type',
  },
  {
    input: 'q-input',
    label: 'Código AIO',
    type: 'number',
    clearable: true,
    field: 'aio_code',
    visible: true,
  },
  {
    input: 'q-input',
    label: 'NIT / CI',
    clearable: true,
    field: 'nit_ci',
    visible: true,
  },
  {
    input: 'q-select',
    label: 'Tipo cliente',
    field: 'client_type',
    option_label: 'label',
    option_value: 'cod_tipo',
    option_dense: true,
    clearable: true,
    visible: true,
    options: listTipoCliente,
    use_input: true,
    debounce: 0,
    emit_value: true,
    map_options: true,
    filter_function: filterTipoCliente,
  },
  {
    input: 'q-input',
    label: 'Teléfono / Celular',
    type: 'tel',
    clearable: true,
    field: 'cellphone',
    visible: true,
  },
  {
    input: 'q-input',
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
    input: 'q-select',
    label: 'Rubro',
    field: 'industry',
    option_label: 'label',
    option_value: 'cod_rubro',
    option_dense: true,
    clearable: true,
    visible: false,
    emit_value: true,
    map_options: true,
    options: listRubro,
  },
  {
    input: 'q-select',
    label: 'Sub rubro',
    field: 'sub_industry',
    option_label: 'label',
    option_value: 'cod_subrubro',
    option_dense: true,
    clearable: true,
    visible: false,
    emit_value: true,
    map_options: true,
    options: listSubrubro,
  },
  {
    input: 'q-select',
    label: 'Tipo Documento',
    clearable: true,
    field: 'document_type',
    option_label: 'label',
    option_value: 'cod_doc',
    option_dense: true,
    visible: false,
    emit_value: true,
    map_options: true,
    options: listTipoDocumento,
  },
  {
    input: 'q-select',
    label: 'Pais',
    clearable: true,
    field: 'country',
    option_label: 'label',
    option_value: 'cod_pais',
    option_dense: true,
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
    option_dense: true,
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
    label: 'Dirección',
    clearable: true,
    field: 'street',
    visible: false,
  },
  {
    input: 'q-select',
    label: 'Fecha creación',
    clearable: true,
    field: 'creation_date',
    visible: false,
    withInput: true,
    option_dense: true,
    emit_value: true,
    map_options: true,
    option_label: 'label',
    option_value: 'value',
    options: listDateRange,
  },
  {
    option_label: 'label',
    option_value: 'cod_rt',
    option_dense: true,
    visible: false,
    emit_value: true,
    map_options: true,
    input: 'q-select',
    label: 'Regimen tributario',
    clearable: true,
    field: 'tax_regime',
    options: listRegimenTributario,
  },
  {
    input: 'q-input',
    label: 'Sitio web',
    clearable: true,
    field: 'website',
    visible: false,
  },
]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dataFilter = ref<any>({
  name: '',
  lastname: '',
  comercial_name: '',
  client_type: '',
  account_type: '',
  aio_code: '',
  nit_ci: '',
  cellphone: '',
  email: '',
  industry: '',
  sub_industry: '',
  country: '',
  state: '',
  city: '',
  street: '',
  document_type: '',
  tax_regime: '',
  website: '',
  created_by: [],
  modified_by: [],
  assigned_to: [],
  creation_date: { from: '', to: '', operator: '', option: '' },
});

/** mountedMethod */
onMounted(async () => {
  await getListTipoCliente();
  await getListTipoCuenta();
  await getListRubro();
  await getListUsers(userCRM.iddivision);
  await getListTipoDocumento();
  await getListPais();
  await getListRegimenTributario();
  await getListDateRange();
});

watch(
  () => dataFilter.value?.industry,
  (industry: string | string[] | undefined) => {
    dataFilter.value.sub_industry = '';
    if (typeof industry === 'string') getListSubrubro(industry);
  }
);
watch(
  () => dataFilter.value?.country,
  (country: string | string[]) => {
    dataFilter.value.state = '';
    if (typeof country === 'string') getListRegion(country);
  }
);

watch(
  () => dataFilter.value?.account_type,
  (account_type: string) => {
    const last = formInputs.value.find((el) => el.field == 'lastname');
    const com = formInputs.value.find((el) => el.field == 'comercial_name');
    if (last != undefined && com != undefined) {
      if (account_type === 'Privada') {
        last.visible = true;
        com.visible = false;
      } else {
        last.visible = false;
        com.visible = true;
      }
    }
  }
);

/** methods */
const onSubmit = async () => {
  listAccounts.value = await getAccountFilter(dataFilter.value);
  isFiltering.value = true;
};

const openDialog = () => {
  showFilterDialog.value = !showFilterDialog.value;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectItem = (item: any) => {
  onReset();
  showFilterDialog.value = false;
  emit('selectItem', item);
};

const onReset = () => {
  dataFilter.value = {
    name: '',
    lastname: '',
    comercial_name: '',
    client_type: '',
    account_type: '',
    aio_code: '',
    nit_ci: '',
    cellphone: '',
    email: '',
    industry: '',
    sub_industry: '',
    country: '',
    state: '',
    city: '',
    street: '',
    document_type: '',
    tax_regime: '',
    website: '',
    created_by: [],
    modified_by: [],
    assigned_to: [],
    creation_date: { from: '', to: '', operator: '', option: '' },
  };
  listAccounts.value = [];
  isFiltering.value = false;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const changeDate = (val: any) => {
  dataFilter.value.creation_date = val;
};

const onClose = () => {
  onReset();
  showFilterDialog.value = false;
};

/** emits */
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'selectItem', item: any): void;
}>();

/** exposes */
defineExpose({
  openDialog,
  onClose,
});
</script>
<template>
  <div>
    <dialog-component
      v-model="showFilterDialog"
      :sizeDialog="isFiltering ? 'dialog-md' : 'dialog-sm'"
      :headerDisabled="false"
      :footerDisabled="false"
      :loading="loading"
      :pesistent="persistent"
    >
      <template #header>
        <q-toolbar class="bg-primary text-white">
          <q-avatar
            size="30px"
            font-size="25px"
            color="primary"
            text-color="white"
            icon="person"
          />
          <q-toolbar-title> Buscar cliente </q-toolbar-title>
          <q-btn flat round dense icon="close" @click="onClose" />
        </q-toolbar>
      </template>
      <template #body>
        <div class="row bg-white">
          <Transition enter-active-class="animated lightSpeedInRight">
            <div class="col-md-6 col-sm-12" v-if="isFiltering">
              <q-card class="no-border-radius bg-none" flat>
                <q-card-section>
                  <div class="text-h7 q-mb-sm">Lista de coincidencias</div>
                  <template v-if="listAccounts.length > 0">
                    <q-list bordered>
                      <q-virtual-scroll
                        style="max-height: 81vh"
                        :items="listAccounts"
                        separator
                        v-slot="{ item, index }"
                      >
                        <q-item
                          :key="index"
                          clickable
                          @click="selectItem(item)"
                        >
                          <q-item-section avatar>
                            <q-avatar
                              color="blue-3"
                              text-color="text-dark"
                              icon="person_pin"
                              font-size="20px"
                            />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>{{ item.nombre }}</q-item-label>
                            <q-item-label caption lines="1"
                              >NIT/CI:
                              <span class="text-blue">{{ item.nit }}</span>
                            </q-item-label>
                            <q-item-label v-if="$q.screen.xs">
                              <small>Cuenta: </small>
                              <small
                                class="text-blue-14 truncate cursor-pointer"
                                v-if="item.tipo"
                              >
                                {{ item.tipo ?? 'No tiene' }}
                                <q-tooltip color="primary">
                                  {{ item.tipo }}
                                </q-tooltip>
                              </small>
                              <small v-else class="text-orange">
                                No tiene
                              </small>
                            </q-item-label>
                          </q-item-section>
                          <q-item-section
                            side
                            style="width: 200px"
                            v-if="!$q.screen.xs"
                          >
                            <small>Cuenta:</small>
                            <small
                              class="text-blue-14 truncate cursor-pointer"
                              v-if="item.tipo"
                            >
                              {{ item.tipo ?? 'No tiene' }}
                              <q-tooltip color="primary">
                                {{ item.tipo }}
                              </q-tooltip>
                            </small>
                            <small v-else class="text-orange"> No tiene </small>
                          </q-item-section>
                        </q-item>
                      </q-virtual-scroll>
                    </q-list>
                  </template>
                  <template v-else>
                    <div class="text-h7 text-grey-6 q-py-md text-center">
                      <img
                        src="empty_list.png"
                        alt="lista vacia"
                        style="width: 150px; height: 100px"
                      />
                      <span class="block"
                        >No se encontraron coincidencias.</span
                      >
                      <slot name="no-data"></slot>
                    </div>
                  </template>
                </q-card-section>
              </q-card>
            </div>
          </Transition>
          <div
            class="col-sm-12"
            :class="isFiltering ? 'col-md-6' : 'col-md-12'"
          >
            <q-card class="no-border-radius" flat bordered>
              <q-card-section class="row q-col-gutter-sm">
                <template v-for="(item, index) in formInputs" :key="index">
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
                    :options-dense="item.option_dense"
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
                          <q-item-label caption>{{
                            scope.opt.a_mercado
                          }}</q-item-label>
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
              </q-card-section>
              <q-card-section>
                <q-btn
                  color="primary"
                  icon="check"
                  label="Mostrar más campos"
                  class="full-width"
                  outline
                  @click="showMoreInputs = !showMoreInputs"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </template>
      <template #footer>
        <q-btn
          color="primary"
          icon="search"
          label="BUSCAR"
          class="q-mr-sm"
          @click="onSubmit"
          :disable="loading"
        />
        <q-btn
          color="orange"
          icon="refresh"
          label="LIMPIAR"
          @click="onReset"
          :disable="loading"
        />
      </template>
    </dialog-component>
    <q-dialog v-model="showMoreInputs">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6 q-pt-none">
            Campos de búsqueda
            <q-btn icon="close" flat dense class="float-right" v-close-popup />
          </div>
          <hr />
          <div class="q-col-gutter-sm">
            <q-checkbox
              v-for="(item, index) in formInputs"
              :key="index"
              keep-color
              v-model="item['visible']"
              :label="item['label']"
              color="primary"
              style="width: 33.3%"
              :val="item['visible']"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<style scoped>
.q-chip {
  max-width: 140px;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 90px;
  font-size: 0.8rem;
  text-align: right;
}
</style>
