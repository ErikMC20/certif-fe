<script setup lang="ts">
import moment from 'moment';
import { ref, onMounted, watch } from 'vue';

interface DateModel {
  days: number;
  start_date: string;
  end_date: string;
}

const props = withDefaults(
  defineProps<{
    date?: DateModel;
  }>(),
  {}
);

const today = moment().format('YYYY-MM-DD');
const days = ref(1);
const startDate = ref(today);
const endDate = ref(moment(today).add(1, 'days').format('YYYY-MM-DD'));

//Login operatos for
const incrementDays = (dateString: string, days: number) => {
  return moment(dateString).add(days, 'days').format('YYYY-MM-DD');
};

const decrementDays = (dateString: string, days: number) => {
  return moment(dateString).subtract(days, 'days').format('YYYY-MM-DD');
};

const calculateDays = (dateStringStart: string, dateStringEnd: string) => {
  const f1 = new Date(dateStringStart);
  const f2 = new Date(dateStringEnd);
  return Math.round((f2.getTime() - f1.getTime()) / 1000 / 60 / 60 / 24);
};

const removeDays = () => {
  const MIN_DAYS = 1;
  if (days.value <= MIN_DAYS) {
    return;
  }
  days.value--;
  endDate.value = decrementDays(endDate.value, 1);
};

const addDays = () => {
  const MAX_DAYS = 999;
  if (days.value > MAX_DAYS) {
    return;
  }
  days.value++;
  endDate.value = incrementDays(endDate.value, 1);
};

const resetDates = () => {
  days.value = 1;
  startDate.value = today;
  endDate.value = incrementDays(startDate.value, 1);
};

//listening for any change of date inputs
watch(startDate, (newValue: string) => {
  endDate.value = incrementDays(newValue, days.value);
});

watch(endDate, (newValue: string) => {
  if (newValue > startDate.value) {
    days.value = calculateDays(startDate.value, endDate.value);
    startDate.value = decrementDays(newValue, days.value);
    return;
  }
});

watch(days, (newValue: number) => {
  const MAX_DAYS = 999;
  if (newValue === undefined || newValue <= 0) days.value = 1;
  if (newValue > MAX_DAYS) days.value = MAX_DAYS;
  endDate.value = incrementDays(startDate.value, days.value);
});

const getDates = () => {
  return <DateModel>{
    start_date: startDate.value,
    end_date: endDate.value,
    days: days.value,
  };
};

onMounted(() => {
  if (props.date?.start_date) {
    startDate.value = props.date.start_date;
    endDate.value = props.date.end_date;
    days.value = props.date.days;
  }
});

defineExpose({
  getDates,
  resetDates,
});
</script>

<template>
  <div class="col-12 row q-col-gutter-sm">
    <div class="col-md-4 col-xs-12">
      <q-input
        label="Fecha de inicio"
        outlined
        dense
        v-model="startDate"
        type="date"
      >
        <!-- <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    fit
                    :offset="[157, 10]"
                    :breakpoint="600"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="startDate" minimal mask="YYYY-MM-DD" />
                  </q-popup-proxy>
                </q-icon>
              </template> -->
      </q-input>
    </div>
    <div class="col-md-4 col-xs-12">
      <q-btn-group class="no-shadow full-width">
        <q-btn
          color="primary"
          icon="remove"
          outline
          dense
          @click.prevent="removeDays"
          rounded
        />
        <q-input
          v-model="days"
          type="number"
          :min="1"
          :max="999"
          dense
          class="text-center no-border-radius full-width"
          label="Duración"
          outlined
          square
          standout
          suffix="días"
        />
        <q-btn
          color="primary"
          icon="add"
          outline
          dense
          @click.prevent="addDays"
          rounded
          type="button"
        />
      </q-btn-group>
    </div>
    <div class="col-md-4 col-xs-12">
      <q-input
        label="Fecha de cierre"
        outlined
        dense
        v-model="endDate"
        type="date"
        :min="startDate"
      >
        <!-- <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy
            fit
            :offset="[10, 10]"
            :breakpoint="600"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              v-model="endDate"
              minimal
              :options="dateOptions"
              mask="YYYY-MM-DD"
            >
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template> -->
      </q-input>
    </div>
  </div>
</template>

<style scoped></style>
