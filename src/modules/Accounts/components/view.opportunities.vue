
<script lang="ts">
  import { defineComponent } from 'vue';
  import viewOpportunities from 'src/components/subpaneles/viewOpportunities.vue';
  export default defineComponent({
    name: 'ViewOpportunities',
  });
</script>
<script setup lang="ts">
  const props = defineProps < {
    idAccount: string;
    nameAccount: string;
  } > ();
 
</script>
<template>
  <viewOpportunities :idMod="idAccount" nameMod="Accounts"   />
</template>
<style lang="scss" scoped>
  #mapid {
    width: 700px;
    height: 600px;
  }

  .q-table--no-wrap th,
  .q-table--no-wrap td {
    white-space: revert;
  }
</style>