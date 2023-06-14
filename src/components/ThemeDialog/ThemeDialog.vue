<template>
  <DialogComponent v-model="color.openDialog" sizeDialog="dialog-xs" :footerDisabled="true" :headerDisabled="false">
    <template v-slot:header>
      <q-toolbar class="bg-primary">
        <q-icon color="white" size="25px" name="palette" />
        <q-toolbar-title class="text-white"> CAMBIAR TEMA </q-toolbar-title>
        <q-btn dense flat icon="close" color="white" v-close-popup>
          <q-tooltip>Cerrar</q-tooltip>
        </q-btn>
      </q-toolbar>
    </template>
    <template v-slot:body>
      <div class="q-pa-md">
        <div>
          <div class="q-pa-md q-gutter-sm">
            <strong class="q-py-md">MENÚ TRANSPARENTE</strong>

            <q-btn flat dense @click="color.changeTransparency" :class="color.theme.transparency ? 'bg-primary' : ''">
              <img src="/theme/theme-glass.jpg" style="width: 100%" />
            </q-btn>
            <q-separator spaced inset dark />
            <strong>COLORES DEL TEMA</strong>
            <q-btn flat dense @click="color.changeTheme('hansa')"
              :class="color.theme.name == 'theme-default' ? 'bg-primary' : ''">
              <img src="/theme/theme-default.jpg" style="width: 100%" />
            </q-btn>
            <q-btn flat dense @click="color.changeTheme('audi')"
              :class="color.theme.name == 'theme-audi' ? 'bg-primary' : ''">
              <img src="/theme/theme-audi.jpg" style="width: 100%" />
            </q-btn>
            <q-btn flat dense @click="color.changeTheme('volk')"
              :class="color.theme.name == 'theme-volk' ? 'bg-primary' : ''">
              <img src="/theme/theme-cyan.jpg" style="width: 100%" />
            </q-btn>
            <q-btn flat dense @click="color.changeTheme('yellow')"
              :class="color.theme.name == 'theme-yellow' ? 'bg-primary' : ''">
              <img src="/theme/theme-yellow.jpg" style="width: 100%" />
            </q-btn>
            <q-btn flat dense @click="color.changeTheme('pink')"
              :class="color.theme.name == 'theme-pink' ? 'bg-primary' : ''">
              <img src="/theme/theme-pink.jpg" style="width: 100%" />
            </q-btn>
            <q-btn flat dense @click="color.changeTheme('white')"
              :class="color.theme.name == 'theme-white' ? 'bg-primary' : ''">
              <img src="/theme/theme-white.jpg" style="width: 100%" />
            </q-btn>

            <q-btn flat dense @click="color.changeTheme('orange')"
              :class="color.theme.name == 'theme-orange' ? 'bg-primary' : ''">
              <img src="/theme/theme-orange.jpg" style="width: 100%" />
            </q-btn>
          </div>
        </div>
      </div>
    </template>
  </DialogComponent>
</template>

<script lang="ts">
import DialogComponent from 'src/components/MainDialog/DialogComponent.vue';
import { colorsStore } from 'src/stores/useTemplateStore';
const color = colorsStore();
export default {
  components: {
    DialogComponent,
  },
  setup() {
    return {
      color,
    };
  },
};
</script>

<style>

</style>
