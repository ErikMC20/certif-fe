<template>
  <q-drawer v-model="template.openSidebar" show-if-above :mini="!template.openSidebar || template.miniSidebar"
    @click.capture="template.handleMiniSidebar" :width="260" :breakpoint="500" class="shadow-2"
    :class="$q.dark.isActive ? 'bg-dark' : ''" :overlay="$q.screen.sm || $q.screen.xs"
    :behavior="$q.screen.sm || $q.screen.xs ? 'mobile' : 'desktop'">
    <q-scroll-area class="q-pb-md sidebar-main">
      <div class="q-px-md q-py-md" v-if="!template.miniSidebar">
        <q-input v-model="buscarMenu" type="text" label="Buscar módulo" :color="color.theme.transparency ? 'white' : ''"
          dense outlined clearable @clear="buscarMenu = ''" />
      </div>
      <q-separator class="q-mb-sm" v-if="!template.miniSidebar" />

    </q-scroll-area>
    <div flat class="logo-metronic text-center absolute-top" :class="$q.dark.isActive ? 'bg-dark' : 'bg-custom'">
      <!-- <div :class="template.miniSidebar ? 'logo-img-small' : 'logo-img'">
        <img
          :src="$q.dark.isActive ? '/logos/logo-white.png' : '/logos/4.png'"
        />
      </div> -->
      <span v-if="!template.miniSidebar" class="text-bold text-h5"
        :class="$q.dark.isActive ? 'text-white' : 'text-primary'">HANSA
        <span class="text-bold text-h5 text-grey-5">CRM </span>
      </span>
      <span v-else class="text-bold text-h6 text-grey-7">H</span>
    </div>
    <div flat class="logo-metronic-bottom text-center absolute-bottom q-pb-md"
      :class="$q.dark.isActive ? 'bg-dark' : 'bg-custom'" v-if="$q.screen.md || !$q.screen.lg">
      <div :class="template.miniSidebar ? 'logo-img-small' : 'logo-img'">
        <img :src="$q.dark.isActive ? '/logos/logo-white.png' : '/logos/3.png'" />
      </div>
      <div class="text-justify q-ml-sm" v-if="!template.miniSidebar">
        <small class="text-sm q-mb-none">
        </small>
        <p class="text-bold q-mb-none" size="15px" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">
        </p>
      </div>
    </div>
    <!--
          boton para mostrar el mini-menu
        -->
    <div class="absolute desktop-only" style="bottom: 15px; right: -40px">
      <q-btn dense color="primary" size="15px" :icon="template.miniSidebar ? 'chevron_right' : 'chevron_left'"
        @click="template.miniSidebar = true" />
    </div>
  </q-drawer>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { templateStore, colorsStore } from 'src/stores/useTemplateStore';
import { ref } from 'vue';

const template = templateStore();
const color = colorsStore();
export default {
  components: {
  },
  setup() {
    //*COMPOSABLE

    const buscarMenu = ref('');

    window.addEventListener('resize', () => {
      if (window.innerWidth <= 900) {
        template.miniSidebar = true;
      } else {
        template.miniSidebar = false;
      }
    });

    if (!useQuasar().platform.is.desktop) {
      template.openSidebar = false;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const listMenuFilter = ref<any>([]);

    // console.log(buscarMenu.value);
    return {
      template,
      listMenuFilter,
      buscarMenu,
      color,
    };
  },
};
</script>

<style lang="sass" scoped></style>
