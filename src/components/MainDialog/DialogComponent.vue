<script lang="ts" setup>
import { ref } from 'vue';
import { QDialog } from 'quasar';

withDefaults(
  defineProps<{
    sizeDialog?: string;
    colorDialog?: string;
    iconDialog?: string;
    titleDialog?: string;
    headerDisabled?: boolean;
    footerDisabled?: boolean;
    loading?: boolean;
  }>(),
  {
    sizeDialog: 'dialog-lg',
    colorDialog: 'bg-white',
    iconDialog: 'folder',
    titleDialog: 'Default title',
  }
);

const maximizedToggle = ref(true);
const qDialogRef = ref<InstanceType<typeof QDialog> | null>(null);

const hideDialog = () => {
  qDialogRef.value?.hide();
};

defineExpose({
  hideDialog,
});
</script>

<template>
  <q-dialog
    :maximized="maximizedToggle"
    ref="qDialogRef"
    transition-show="slide-left"
    transition-hide="slide-right"
    class="row items-start"
  >
    <q-layout
      view="lhh lpr lff"
      container
      style="height: 100dvh"
      class="shadow-2 rounded-borders"
      :class="'text-black my-card ' + colorDialog + ' ' + sizeDialog"
    >
      <q-header
        v-if="!headerDisabled"
        :class="
          $q.dark.isActive ? 'bg-dark text-white' : 'bg-blue-grey-1 text-grey-9'
        "
      >
        <slot name="header"> Aqui va la cabezera </slot>
      </q-header>
      <transition
        enter-active-class="animated zoomIn"
        leave-active-class="animated zoomOut"
      >
        <q-footer
          v-if="!footerDisabled"
          elevated
          reveal
          :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-4'"
        >
          <q-toolbar class="justify-center">
            <slot name="footer"> Aqui van los botones </slot>
          </q-toolbar>
        </q-footer>
      </transition>

      <!-- <q-page-sticky
        position="bottom"
        class="bg-grey-9 text-white q-pa-sm"
        expand
      >
        <slot name="footer"> Aqui van los botones </slot>
      </q-page-sticky> -->

      <q-page-container
        :class="$q.dark.isActive ? 'bg-primary' : 'bg-blue-grey-1'"
        style="height: 100dvh"
      >
        <div class="loading-content" v-if="loading">
          <q-spinner-ios color="primary" size="4em" />
        </div>
        <q-scroll-area style="height: 100%">
          <slot name="body"> Cuerpo1 del dialog </slot>
        </q-scroll-area>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<style lang="scss" scoped>
.loading-content {
  width: 100%;
  height: 89.2%;
  position: absolute;
  z-index: 1;
  background: transparent;
  display: flex;
  align-items: center;
  .q-spinner {
    margin-left: auto;
    margin-right: auto;
  }
}
.my-card {
  margin-left: 0rem;
}

@media (min-width: 600px) {
  .my-card.dialog-xs {
    margin-left: 35%;
  }

  .my-card.dialog-sm {
    margin-left: 35%;
  }

  .my-card.dialog-md {
    margin-left: 20%;
  }

  .my-card.dialog-lg {
    margin-left: 6.5%;
  }

  .my-card.dialog-xl {
    margin-left: 0%;
  }
}

@media (min-width: 900px) {
  .my-card.dialog-xs {
    margin-left: 80%;
  }

  .my-card.dialog-sm {
    margin-left: 60%;
  }

  .my-card.dialog-md {
    margin-left: 35%;
  }

  .my-card.dialog-lg {
    margin-left: calc(17%);
  }

  .my-card.dialog-xl {
    margin-left: 5%;
  }

  .my-card.dialog-fullscreen {
    margin-left: 0%;
  }

  // .absolute-full {
  //   right: 0px !important;

  //   .scroll {
  //     padding: 0px !important;
  //   }
  // }
}
</style>
