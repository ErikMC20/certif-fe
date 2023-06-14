<template>
  <q-select
    outlined
    dense
    use-input
    input-debounce="100"
    label="División"
    :options="filterOptions"
    @filter="filterFn"
    clearable
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey"> No encontrado </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script lang="ts" setup>
import { defineProps, ref, toRefs } from 'vue';

const props = defineProps({
  options: {
    type: Array,
    require: true
  }
});
const { options } = toRefs<any>(props);
const filterOptions = ref(options.value);

const filterFn = (search: string, update: any) => {
  if (search === '') {
    update(() => (filterOptions.value = options.value));
    return;
  }
  update(() => {
    const needle = search.toLowerCase();
    filterOptions.value = options.value.filter(
      (val: string) => val.toLowerCase().indexOf(needle) > -1
    );
  });
};
</script>
