<script lang="ts" setup>
import { ref, watch } from 'vue';
type PhoneModel = {
  id?: string;
  phone: string;
  country: string;
  country_code: string;
  whatsapp: '0' | '1';
  primary_item: '0' | '1';
  description: string;
};
const props = defineProps<{
  modelValue: PhoneModel;
}>();

const emits = defineEmits<{
  (event: 'update:modelValue', values: PhoneModel): void;
}>();

// * local variables
const localPhone = ref(props.modelValue || ({} as PhoneModel));

// * vue methods
watch(localPhone.value, () => {
  emits('update:modelValue', localPhone.value);
});
</script>

<template>
  <q-item>
    <q-item-section>
      <q-select
        v-model="localPhone.country_code"
        :options="['+591', '+52']"
        label="Codigo"
        filled
        dense
      />
    </q-item-section>
    <q-item-section>
      <q-input v-model="localPhone.phone" type="text" label="Label" dense />
    </q-item-section>
    <q-item-section>
      <q-select
        v-model="localPhone.description"
        :options="['Oficina']"
        label="Standard"
        filled
        dense
      />
    </q-item-section>
    <q-item-section>
      <q-checkbox
        v-model="localPhone.whatsapp"
        label="whatsapp"
        true-value="1"
        false-value="0"
      />
    </q-item-section>
    <!-- <q-item-section side top>
        <q-item-label caption>5 min ago</q-item-label>
        <q-icon name="star" color="yellow" />
      </q-item-section> -->
  </q-item>
</template>
