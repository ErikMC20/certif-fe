<template>
  <q-card class="q-pa-sm column q-gutter-y-sm">
    <q-card-section class="q-py-none">
      <slot name="header"></slot>
    </q-card-section>
    <q-card-section class="q-py-none">
      <slot></slot>
    </q-card-section>
  </q-card>
</template>
