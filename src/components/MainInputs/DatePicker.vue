<script setup lang="ts">
import { ref, computed } from 'vue';
import { QInput } from 'quasar';
import { useBusinesses } from 'src/modules/Businesses/composables/Core';

interface Props {
  required: boolean;
  modelValue: string;
}

interface Emits {
  (event: 'update:modelValue', value: string): void;
}

const props = withDefaults(defineProps<Props>(), { required: false });
const emits = defineEmits<Emits>();

const modelValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits('update:modelValue', value);
  },
});

const { quickFilterDateList } = useBusinesses();

const dateRange = ref<string | { from: string; to: string }>('');

const dateInputRef = ref<InstanceType<typeof QInput> | null>(null);

const validate = (): boolean | Promise<boolean> | undefined => {
  return dateInputRef.value?.validate();
};

const updateDate = (value: string | { from: string; to: string }) => {
  if (typeof value === 'object')
    modelValue.value = `${value.from} - ${value.to}`;
  else modelValue.value = value;
};

defineExpose({
  validate,
});
</script>
<template>
  <q-input
    dense
    label="Rango de fechas"
    outlined
    readonly
    ref="dateInputRef"
    type="text"
    v-model="modelValue"
  >
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <div class="row" style="max-width: 500px">
            <q-list class="col-4" bordered>
              <q-item
                v-for="(item, index) in quickFilterDateList"
                :key="index"
                clickable
                v-ripple
              >
                <q-item-section>{{ item.label }}</q-item-section>
              </q-item>
            </q-list>
            <q-date
              flat
              class="col-8"
              @update:model-value="updateDate"
              v-model="dateRange"
              range
            >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Cerrar" color="primary" flat />
              </div>
            </q-date>
          </div>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<style scoped></style>
