<script lang="ts" setup>
defineProps<{
  inputs: number;
}>();
</script>
<template>
  <q-card class="q-mb-sm" style="height: 80vh">
    <q-item>
      <q-item-section avatar>
        <q-skeleton type="rect" animation="fade" size="30px" />
      </q-item-section>

      <q-item-section>
        <q-item-label>
          <q-skeleton type="rect" animation="fade" height="30px" />
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-separator />
    <q-card-section class="">
      <div class="row q-col-gutter-md">
        <div class="col-6" v-for="n in inputs" :key="n">
          <q-skeleton type="QRange" animation="fade" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
