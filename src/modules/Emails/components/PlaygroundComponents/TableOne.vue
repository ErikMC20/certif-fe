<script lang="ts">
import { defineComponent } from 'vue';
import BigTableVue from '../BigTable.vue';
import LittleTableVue from '../LittleTable.vue';

export default defineComponent({
  name: 'TableOneVue',
  components: {
    BigTableVue,
    LittleTableVue,
  },
});
</script>

<template>
  <div v-if="$q.screen.gt.xs"><big-table-vue /></div>
  <div v-else><little-table-vue /></div>
</template>
