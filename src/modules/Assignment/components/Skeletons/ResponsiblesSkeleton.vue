<template>
  <q-card>
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
    <q-item v-for="i in users" :key="i">
      <q-item-section avatar>
        <q-skeleton type="QAvatar" animation="fade" />
      </q-item-section>

      <q-item-section>
        <q-item-label>
          <q-skeleton type="text" animation="fade" />
        </q-item-label>
        <q-item-label caption>
          <q-skeleton type="text" animation="fade" />
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>

<script setup lang="ts">
defineProps<{
  users: number;
}>();
</script>

<style scoped></style>
