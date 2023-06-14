<template>
  <q-card :class="$q.screen.xs ? 'main-card' : ''">
    <q-card-section class="q-pa-none">
      <q-toolbar class="text-dark">
        <slot name="header"></slot>
      </q-toolbar>
      <q-separator />
    </q-card-section>
    <q-card-section class="q-pa-sm">
      <slot></slot>
    </q-card-section>
  </q-card>
</template>
<style scoped>
.main-card {
  width: calc(100dvw - 35px);
}
</style>
