<script lang="ts">
import { computed, onMounted } from 'vue';
import { getRecordInfo } from 'src/services/MeetingsServices';
import { useAsyncState } from '@vueuse/core';
</script>
<script lang="ts" setup>
const props = defineProps<{
  module: string;
  idModule: string;
  name: string;
}>();

defineEmits<{
  (event: 'deleteSelected'): void;
}>();

const { isLoading, error } = useAsyncState(async () => {
  const response = await getRecordInfo(
    props.module.charAt(0).toUpperCase() + props.module.slice(1),
    props.idModule
  );
  console.log('your response: ', response);
  return response;
}, null);

const colorChip = computed(() => {
  switch (props.module) {
    case 'users':
      return 'cyan-4';
    case 'contacts':
      return 'blue';
    case 'leads':
      return 'green';
    case 'prospects':
      return 'orange';

    default:
      return 'gray';
  }
});

onMounted(() => {
  console.log('Mounting this...');
});
</script>
<template>
  <q-chip v-if="isLoading" class="glossy" icon="person" label="Invitado" />
  <q-chip
    @dblclick="$emit('deleteSelected')"
    v-else
    class="no-select"
    :color="colorChip"
    icon="person"
    :label="name || 'No Data'"
  />
  <pre>{{ error }}</pre>
</template>
