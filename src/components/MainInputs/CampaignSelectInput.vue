<script setup lang="ts">
import { ref, computed } from 'vue';
import AdvancedFilterCampaign from 'src/modules/Prospects/components/AdvancedFilterCampaign.vue';

interface Props {
  modelValue: string;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
}

const emit = defineEmits<Emits>();
const props = defineProps<Props>();

const filterCampaignRef = ref<InstanceType<
  typeof AdvancedFilterCampaign
> | null>(null);

const optionsList = ref([{ label: '', value: '' }]);
const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const openCampaignFilter = () => {
  filterCampaignRef.value?.openDialog();
};

const clearInput = () => {
  value.value = '';
};

const selectCampaign = (item: { [key: string]: string | null }) => {
  optionsList.value = [{ label: item.nombre || '', value: item.id || '' }];
  value.value = item.id || '';
};
</script>

<template>
  <q-select
    :options="optionsList"
    dense
    emit-value
    hide-dropdown-icon
    label="Campaña"
    map-options
    option-label="label"
    option-value="value"
    outlined
    readonly
    v-model="value"
  >
    <template v-slot:prepend>
      <q-avatar>
        <q-icon name="campaign" size="sm" />
      </q-avatar>
    </template>
    <template v-slot:after>
      <q-btn
        dense
        outline
        icon="north_west"
        color="primary"
        @click="openCampaignFilter"
      />
      <q-btn dense outline icon="close" color="negative" @click="clearInput" />
    </template>
  </q-select>
  <AdvancedFilterCampaign
    ref="filterCampaignRef"
    @select-item="selectCampaign"
  />
</template>

<style scoped lang="scss"></style>
