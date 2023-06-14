<template>
  <q-card class="no-shadow border-none">
    <q-card-section>
      <div class="row q-col-gutter-y-sm">
        <q-input
          v-model="dataFilter.code"
          type="text"
          label="Código"
          outlined
          dense
          class="col-12"
        />
        <q-select
          v-model="dataFilter.status"
          multiple
          :options="['En progreso', 'En revision', 'Cerrado']"
          label="Estado"
          outlined
          dense
          class="col-12"
          use-chips
        />
        <q-select
          v-model="dataFilter.approved_status"
          multiple
          :options="['Pendiente', 'Rechazado', 'Aprobado']"
          label="Estado de carga"
          outlined
          dense
          use-chips
          class="col-12"
        />
        <q-select
          v-model="dataFilter.areas"
          multiple
          :options="[]"
          label="Areas de trabajo"
          outlined
          dense
          use-chips
          class="col-12"
        />
        <div class="q-mt-md col-12 text-center q-gutter-y-md">
          Rango de fechas de asignación <br />
          <q-date v-model="dataFilter.start_date" range landscape minimal />
        </div>
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
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';

import { userStore } from 'src/modules/Users/store/UserStore';
import { useAssignmentTableStore } from '../../store/useAssignmentTableStore';
import { useLanguaje } from 'src/composables';
</script>

<script setup lang="ts">
const tableStore = useAssignmentTableStore();
const user = userStore();
const { useUserDivision, useDateRange } = useLanguaje;
const { listDateRange, getListDateRange } = useDateRange();
const { listUsers, getListUsers, filterUsers } = useUserDivision();

const show_more_input = ref(false);
const todos = ref(false);
const form_fields = ref([...tableStore.visible_fields]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const form = ref<any>([
  {
    input: 'q-input',
    label: 'Codigo',
    clearable: true,
    field: 'code',
    visible: true,
  },
  {
    input: 'q-select',
    label: 'Estado',
    clearable: true,
    field: 'status',
    //option_label: 'label',
    //option_value: 'value',
    options_dense: true,
    use_chips: true,
    multiple: true,
    visible: true,
    // emit_value: true,
    //map_options: true,
    with_avatar: false,
    options: ['En progreso', 'En revision', 'Cerrado'],
  },
  {
    input: 'q-select',
    label: 'Estado de aprobación',
    clearable: true,
    field: 'approved_status',
    //option_label: 'label',
    //option_value: 'value',
    options_dense: true,
    use_chips: true,
    multiple: true,
    visible: true,
    //emit_value: true,
    // map_options: true,
    with_avatar: false,
    options: ['Pendiente', 'Rechazado', 'Aprobado'],
  },
  // {
  //   input: 'q-input',
  //   type: 'date',
  //   label: 'Fecha inicio',
  //   clearable: true,
  //   field: 'start_date',
  //   visible: true,
  // },
  // {
  //   input: 'q-input',
  //   type: 'date',
  //   label: 'Fecha fin',
  //   clearable: true,
  //   field: 'end_date',
  //   visible: true,
  // },
  {
    input: 'q-select',
    label: 'Fecha inicio',
    clearable: true,
    field: 'start_date',
    visible: false,
    withInput: true,
    options_dense: true,
    emit_value: true,
    map_options: true,
    option_label: 'label',
    option_value: 'value',
    options: listDateRange,
  },
  {
    input: 'q-select',
    label: 'Fecha fin',
    clearable: true,
    field: 'end_date',
    visible: false,
    withInput: true,
    options_dense: true,
    emit_value: true,
    map_options: true,
    option_label: 'label',
    option_value: 'value',
    options: listDateRange,
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

const dataFilter = ref<any>(tableStore.data_filter);

const clearFilter = () => {
  dataFilter.value = {
    code: '',
    status: [],
    approved_status: [],
    area: [],
    start_date: {
      from: '',
      to: '',
    },
    end_date: {
      from: '',
      to: '',
    },
  };
};

onMounted(async () => {
  await getListUsers(user.userCRM.iddivision);
  await getListDateRange();
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
