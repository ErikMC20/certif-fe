<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import AdvancedFilterAccount from 'src/modules/Accounts/components/AdvancedFilter/AdvancedFilterAccount.vue';
import { getRecordModuleInfo } from 'src/services/GlobalService';

interface Props {
  modelValue: string;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const advancedAccountFilterRef = ref<InstanceType<
  typeof AdvancedFilterAccount
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

const openAccountFitler = () => {
  advancedAccountFilterRef.value?.openDialog();
};

const clearInput = () => {
  value.value = '';
};

const selectItem = (item: { [key: string]: string | null }) => {
  optionsList.value = [{ label: item.nombre || '', value: item.id || '' }];
  value.value = item.id || '';
  advancedAccountFilterRef.value?.onClose();
};

const getAccountInfo = async (id: string) => {
  const response = await getRecordModuleInfo('Accounts', id, {
    allData: false,
    fields: ['id', 'name'],
  });

  optionsList.value.push({
    label: response.name.toString() || '',
    value: response.id.toString() || '',
  });

  value.value = id;
};

onMounted(() => {
  if (!!props.modelValue) getAccountInfo(props.modelValue);
});
</script>

<template>
  <q-select
    :options="optionsList"
    dense
    emit-value
    hide-dropdown-icon
    label="Cuenta"
    map-options
    option-label="label"
    option-value="value"
    outlined
    readonly
    v-model="value"
  >
    <template v-slot:prepend>
      <q-avatar>
        <q-icon name="account_circle" size="sm" />
      </q-avatar>
    </template>
    <template v-slot:after>
      <q-btn
        dense
        outline
        icon="north_west"
        color="primary"
        @click="openAccountFitler"
      />
      <q-btn dense outline icon="close" color="negative" @click="clearInput" />
    </template>
  </q-select>
  <AdvancedFilterAccount
    ref="advancedAccountFilterRef"
    title="Búsqueda de Cuentas"
    @select-item="selectItem"
  />
</template>

<style scoped lang="scss"></style>
