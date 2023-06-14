<template>
  <!-- <div> -->
  <div class="row q-col-gutter-sm col-12" v-if="!isLoading">
    <q-select
      dense
      outlined
      v-model="date_option"
      label="Fecha de creación"
      option-value="value"
      option-label="label_es"
      options-dense
      :options="listRangeDateFilter"
      emit-value
      map-options
      class="col-md-12 col-xs-12"
      transition-show="scale"
      transition-hide="scale"
    >
    </q-select>
    <q-input
      outlined
      dense
      label="Fecha inicio"
      v-model="localDate.from"
      clearable
      :class="single_datepicker && !dual_datepicker ? 'col-md-12' : 'col-md-6'"
      v-if="single_datepicker"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy
            cover
            transition-show="scale"
            transition-hide="scale"
            anchor="center start"
          >
            <q-date
              v-model="localDate.from"
              title="Fecha inicio"
              mask="DD-MM-YYYY"
            >
              <div class="row items-center justify-center">
                <q-btn v-close-popup label="Cerrar" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-input
      outlined
      dense
      label="Fecha fin"
      v-model="localDate.to"
      class="col-md-6"
      clearable
      v-if="dual_datepicker"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy
            cover
            transition-show="scale"
            transition-hide="scale"
            anchor="center start"
          >
            <q-date v-model="localDate.to" title="Fecha fin" mask="DD-MM-YYYY">
              <div class="row items-center justify-center">
                <q-btn v-close-popup label="Cerrar" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-input
      v-if="literalDate != ''"
      v-model="literalDate"
      type="text"
      readonly
      outlined
      dense
      class="col-12"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  getDateMoment,
  useDateRangeFilter,
} from '../../composables/useLanguaje';
import { onMounted, ref, watch, toRefs } from 'vue';
import { base } from '../../modules/Planning/utils/types';
const props = defineProps<{
  date: base;
}>();

const { date } = toRefs(props);
const { listRangeDateFilter, getDateRangeFilter } = useDateRangeFilter();
const {
  unaSemana,
  ultimos30dias,
  esteMes,
  mesPasado,
  gestionPresente,
  gestionPasada,
} = getDateMoment();

const isLoading = ref(false);
const date_option = ref(props.date.option || '');
const dual_datepicker = ref(false);
const single_datepicker = ref(false);
const literalDate = ref('');

const localDate = ref<base>({
  option: props.date.option || '',
  from: props.date.from || '',
  to: props.date.to || '',
  operator: props.date.operator || '',
});

onMounted(async () => {
  localDate.value = date.value;
  updateOption(props.date.option);
  await getDateRangeFilter();
});
watch(date_option, (newvalue: string) => {
  dual_datepicker.value = false;
  single_datepicker.value = false;
  literalDate.value = '';
  updateOption(newvalue);
});

const updateOption = (value: string) => {
  switch (value) {
    case 'Prior to':
      localDate.value.operator = '<';
      // listRangeDateFilter.value.operador = '<';
      single_datepicker.value = true;
      break;
    case 'After':
      localDate.value.operator = '>';
      single_datepicker.value = true;
      break;
    case 'Different from':
      localDate.value.operator = '!=';
      single_datepicker.value = true;
      break;
    case 'Equal to':
      localDate.value.operator = '=';
      single_datepicker.value = true;
      break;
    case 'It is between':
      localDate.value.operator = 'between';
      single_datepicker.value = true;
      dual_datepicker.value = true;
      break;
    case 'This year':
      localDate.value = gestionPresente;
      localDate.value.operator = 'between';
      literalDate.value = `${localDate.value.from} a ${localDate.value.to}`;
      break;
    case 'Last year':
      localDate.value = gestionPasada;
      localDate.value.operator = 'between';
      literalDate.value = `${localDate.value.from} a ${localDate.value.to}`;
      break;
    case 'This month':
      localDate.value = esteMes;
      localDate.value.operator = 'between';
      literalDate.value = `${localDate.value.from} a ${localDate.value.to}`;
      break;
    case 'Last month':
      localDate.value = mesPasado;
      localDate.value.operator = 'between';
      literalDate.value = `${localDate.value.from} a ${localDate.value.to}`;
      break;
    case 'Last 30 days':
      localDate.value = ultimos30dias;
      localDate.value.operator = 'between';
      literalDate.value = `${localDate.value.from} a ${localDate.value.to}`;
      break;
    case 'Last 7 days':
      localDate.value = unaSemana;
      localDate.value.operator = 'between';
      literalDate.value = `${localDate.value.from} a ${localDate.value.to}`;
      break;

    default:
      dual_datepicker.value = false;
      single_datepicker.value = false;
      break;
  }
  localDate.value.option = value;
  // console.log(localDate, literalDate);
  emit('changeDate', localDate.value);
};

const resetData = () => {
  localDate.value = {
    option: '',
    from: '',
    to: '',
    operator: '',
  };
  date_option.value = '';
  literalDate.value = '';
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
  }, 100);
};

const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (event: 'changeDate', localDate: any): void;
}>();

defineExpose({
  localDate,
  resetData,
});
</script>

<style lang="scss" scoped>
.date-range {
  border: 1px dotted rgb(180, 180, 180);
}
</style>
