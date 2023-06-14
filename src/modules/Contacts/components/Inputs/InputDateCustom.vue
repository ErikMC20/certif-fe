<script setup lang="ts">
import moment from 'moment';
import { QInput } from 'quasar';
import { ref, onMounted } from 'vue';
const options = (val: string) => {
  return val <= moment(Date.now()).format('YYYY/MM/DD');
};
const inputDateRef = ref<InstanceType<typeof QInput> | null>(null);

const resetValidation = () => {
  inputDateRef.value?.resetValidation();
};

onMounted(() => {
  inputDateRef.value?.resetValidation();
});

defineExpose({
  resetValidation,
});
</script>
<template>
  <q-input
    class="col-12 col-sm-6 q-px-xs q-pb-xs q-mb-md"
    dense
    outlined
    color="primary"
    ref="inputDateRef"
    @blur="resetValidation"
  >
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date v-bind="$attrs" mask="DD-MM-YYYY" :options="options">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>
