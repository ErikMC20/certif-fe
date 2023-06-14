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
            v-if="item.visible"
          >
            <template #selected-item="scope" v-if="item.with_avatar">
              <q-chip
                removable
                dense
                @remove="scope.removeAtIndex(scope.index)"
                :tabindex="scope.tabindex"
                color="grey-4"
                size="md"
              >
                <q-avatar>
                  <img :src="`${HANSACRM3_URL}${scope.opt.avatar}`" round />
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
        </template>
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
</template>

<script lang="ts">
import { ref, onMounted, watch } from 'vue';

import { useLanguaje } from 'src/composables';

import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { userStore } from 'src/modules/Users/store/UserStore';
import { useProjectTableStore } from '../../store/useProjectTableStore';
import DateRangeComponent from 'src/components/DateRange/DateRangeComponent.vue';
</script>

<script setup lang="ts">
const tableStore = useProjectTableStore();
const user = userStore();
const { usePais, useUserDivision, useDateRange } = useLanguaje;

const { listUsers, getListUsers, filterUsers } = useUserDivision();
const { listPais, listRegion, getListPais, getListRegion } = usePais();

const show_more_input = ref(false);
const todos = ref(false);
const form_fields = ref([...tableStore.visible_fields]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const form = ref<any>([
  {
    input: 'q-input',
    label: 'Nombre de la cuenta',
    clearable: true,
    field: 'account',
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
    options: [],
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
    visible: true,
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
    visible: true,
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
    options: [],
  },
]);

const dataFilter = ref<any>(tableStore.data_filter);

watch(
  () => dataFilter.value.country,
  (country: string | string[]) => {
    dataFilter.value.state = '';
    if (typeof country === 'string') getListRegion(country);
  }
);

const clearFilter = () => {
  dataFilter.value = {
    account: '',
    name: '',
    pst_code: '',
    aio_code: '',
    status: '',
    start_date: '',
    end_date: '',
    country: '',
    state: '',
    city: '',
    created_by: [],
    modified_by: [],
    assigned_to: [],
    creation_date: { from: '', to: '', operator: '', option: '' },
  };
};

onMounted(async () => {
  //await getListUsers(user.userCRM.iddivision);
  await getListPais();
  getVisibleField();
});

/**Filter Methods */
const onSubmit = () => {
  emit('submitFilter');
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
defineExpose({ dataFilter, clearFilter });
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
