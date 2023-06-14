<template>
  <q-card class="q-pa-xs column q-gutter-y-sm">
    <q-card-section class="q-py-none">
      <slot name="header"></slot>
    </q-card-section>
    <q-card-section class="q-pa-sm">
      <slot></slot>
    </q-card-section>
  </q-card>
</template>
