<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
  }>(),
  {}
);
</script>

<template>
  <q-dialog :maximized="$q.screen.lt.sm">
    <q-layout
      view="lHh LpR lff"
      container
      :style="{ 'max-height': $q.screen.lt.sm ? '100vh' : '80vh' }"
      style="height: 900px; width: 70rem; max-width: 100vw"
      class="bg-white"
    >
      <q-header class="bg-primary text-white">
        <q-toolbar class="q-pa-lg">
          <q-btn
            v-if="$q.screen.lt.sm"
            color="primary"
            flat
            text-color="white"
            icon="arrow_back_ios"
            v-close-popup
          />
          <q-icon
            :class="$q.screen.lt.sm ? '' : 'q-ml-sm'"
            size="lg"
            name="group"
          />

          <q-toolbar-title>{{ title }}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <slot name="header"></slot>
      </q-header>
      <q-footer
        v-if="$slots.footer"
        bordered
        class="bg-white text-primary q-pa-sm"
        align="right"
      >
        <slot name="footer"></slot>
      </q-footer>
      <q-page-container>
        <q-page class="q-pa-none"> <slot name="body"></slot> </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>
