<template>
  <div class="row q-col-gutter-sm q-mb-sm">
    <div class="col-3" v-for="n in 4" :key="n">
      <q-card class="my-card">
        <q-card-section horizontal>
          <q-card-section class="q-pr-sm">
            <q-skeleton type="circle" size="70px" />
          </q-card-section>
          <q-card-section class="q-px-none q-col-gutter-y-sm">
            <div v-for="n in 3" :key="n">
              <q-skeleton width="90px" />
            </div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
