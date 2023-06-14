<script lang="ts" setup>
import { computed } from 'vue';
import { MeetingAttributesResponse } from '../../../../types/index';
import moment from 'moment';
console.log('Info Card here!!!');
const props = defineProps<{
  data: MeetingAttributesResponse;
}>();

const endDate = computed(() => {
  if (props.data.date_end) {
    return moment(props.data.date_end).format('DD/MM/YYYY HH:mm');
  }
  return 'Sin Datos';
});
</script>
<template>
  <div>
    <q-card class="my-card" flat>
      <q-card-section class="q-pt-xs">
        <div class="text-overline">Reunion</div>
        <div class="text-h5 q-mt-sm q-mb-xs">{{ data.name }}</div>
        <div class="text-caption text-grey">
          {{ data.description }}
        </div>
      </q-card-section>
      <q-card-section class="q-pt-xs">
        <div class="text-caption text-grey">
          {{ data.status }}
        </div>
      </q-card-section>
      <q-card-section>
        <q-icon name="location_on" /> {{ data.location }}
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn flat round icon="event" />
        <q-btn flat> {{ data.date_start }}</q-btn>
        <q-icon name="double_arrow" />
        <q-btn flat> {{ endDate }}</q-btn>
      </q-card-actions>
    </q-card>
    <!-- <pre>{{ data }}</pre> -->
  </div>
</template>
