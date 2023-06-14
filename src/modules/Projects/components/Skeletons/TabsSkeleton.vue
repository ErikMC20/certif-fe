<template>
  <q-card style="height: 71%">
    <q-card-section>
      <div class="row q-col-gutter-sm">
        <div v-for="i in 3" :key="i" class="col-4">
          <q-skeleton type="rect" />
        </div>
      </div>
    </q-card-section>
    <q-card-section> <q-skeleton height="350px" /> </q-card-section>
  </q-card>
</template>

<script setup lang="ts"></script>

<style scoped></style>
