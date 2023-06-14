<template>
  <q-input
    outlined
    mask="date"
    :rules="['date']"
    dense
    class="col-lg-6 col-md-6 col-sm-12 q-pa-sm"
    label="Fecha Inicio"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  >
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover>
          <q-date v-model="date">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue';
defineProps({
  modelValue: String
});
defineEmits(['update:modelValue']);
const date = ref('');
// const { date } = toRefs(props);
// console.log(date);
</script>
