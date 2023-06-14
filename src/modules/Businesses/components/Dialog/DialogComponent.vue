<script setup lang="ts">
interface Props {
  title: string;
}
const props = defineProps<Props>();
</script>
<template>
  <q-dialog maximized position="right" persistent>
    <q-layout
      container
      view="lhh LpR lff"
      :style="{ 'min-width': $q.screen.lt.sm ? '100vw' : '40vw' }"
      class="bg-grey-2"
    >
      <q-page-container>
        <q-page class="dialog-body q-pa-md">
          <slot name="body"></slot>
        </q-page>

        <q-page-scroller position="bottom-right">
          <q-btn class="q-mb-sm" fab icon="keyboard_arrow_up" size="md" color="primary" />
        </q-page-scroller>
      </q-page-container>

      <q-page-sticky position="top" class="bg-primary text-white" expand>
        <q-toolbar class="q-px-md">
          <q-toolbar-title shrink>{{ props.title }}</q-toolbar-title>
          <q-space />
          <q-btn
            color="primary text-white"
            flat
            icon="close"
            round
            v-close-popup
          />
        </q-toolbar>
      </q-page-sticky>

      <q-page-sticky
        position="bottom"
        class="bg-grey-9 text-white q-pa-sm"
        expand
        v-if="$slots.footer"
      >
        <slot name="footer"
          ><div class="row justify-center q-gutter-sm">
            <q-btn color="primary" icon="send" label="Enviar" />
            <q-btn
              color="negative"
              icon="cancel"
              label="cancelar"
              v-close-popup
            />
          </div>
        </slot>
      </q-page-sticky>
    </q-layout>
  </q-dialog>
</template>

<style lang="scss" scoped>
.dialog-body {
  padding-top: 70px;
  padding-bottom: 70px;

  * {
    scrollbar-width: auto;
    scrollbar-color: #4f4f4f #ff000000;
  }

  /* Chrome, Edge, and Safari */
  *::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  *::-webkit-scrollbar-track {
    background: #ff000000;
  }

  *::-webkit-scrollbar-thumb {
    background-color: #4f4f4f;
    border-radius: 10px;
    border: 3px solid #696969;
  }
}
</style>
