<script lang="ts">
import ToolbarComponent from '/src/components/template/ToolbarComponent.vue';
//import SidebarComponent from '/src/components/template/SidebarComponent.vue';
import { colorsStore } from 'src/stores/useTemplateStore';
import ThemeDialog from 'src/components/ThemeDialog/ThemeDialog.vue';
import { onMounted } from 'vue';
import { QSpinnerGears, useQuasar } from 'quasar';
</script>
<script lang="ts" setup>
//const template = templateStore();
const color = colorsStore();
const $q = useQuasar();
onMounted(async () => {
  try {
    $q.loading.show({
      spinner: QSpinnerGears,
      spinnerColor: 'primary',
      messageColor: 'black',
      backgroundColor: 'grey',
      message: 'Aplicando configuración',
    });
    //await color.getUserTheme();
  } catch (error) {
  } finally {
    $q.loading.hide();
  }
});
</script>

<template>
  <div
    :class="
      color.theme.transparency
        ? 'transparency ' + color.theme.name
        : color.theme.name
    "
  >
    <q-layout view="LHh LpR fFf" class="rounded-borders">
      <!-- Header del template  -->
      <ToolbarComponent />

      <!-- Sidebar del template, menus  -->
      <!-- <SidebarComponent /> -->

      <q-page-container class="GPL__page-container">
        <q-page class="row" style="height: 90vh">
          <div class="col-12">
            <router-view />
          </div>
        </q-page>
      </q-page-container>

      <ThemeDialog />
    </q-layout>
  </div>
</template>
