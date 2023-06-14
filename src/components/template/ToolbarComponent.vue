<template>
  <q-header :class="$q.dark.isActive ? 'bg-header-dark' : 'bg-primary'">
    <q-toolbar>
      <q-btn flat @click="template.handleOpenSidebar" round dense icon="menu" />

      <q-toolbar-title class="row items-center">
        <span class="q-ml-sm"> {{ route.meta.nameLabel }}</span>
        <!-- <q-icon :name="route.meta.iconModule" size="25px" /> -->
      </q-toolbar-title>

      <div class="q-gutter-sm row items-center no-wrap">
        <q-btn
          dense
          flat
          color="white"
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          @click="color.changeDarkMode"
        >
        </q-btn>
        <q-btn
          dense
          flat
          color="white"
          :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
          @click="$q.fullscreen.toggle()"
          class="desktop-only"
        >
        </q-btn>
        <!-- <q-btn dense flat color="white" icon="apps">
          <q-tooltip>Google Apps</q-tooltip>
        </q-btn> -->
        <!-- <q-btn dense flat color="white" icon="notifications">
          <q-badge color="red" text-color="white" floating> 2 </q-badge>
          <q-tooltip>Notifications</q-tooltip>
        </q-btn> -->
        <q-btn round flat>
          <q-avatar
            size="30px"
            font-size="52px"
            color="teal"
            text-color="white"
            icon="directions"
          />
          <!-- <q-avatar size="30px">
            <img :src="imgUser(user.userCRM.id)" @error="setDefaultAvatar" />
          </q-avatar> -->

          <q-menu>
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <div class="text-h6 q-mb-md">Configuraciones</div>
                <q-list style="min-width: 100px">
                  <q-item clickable>
                    <q-item-section>Mi perfil</q-item-section>
                  </q-item>
                  <q-separator />
                  <q-item
                    clickable
                    @click="color.openDialog = !color.openDialog"
                  >
                    <q-item-section>Cambiar tema</q-item-section>
                  </q-item>
                  <q-separator />
                </q-list>
              </div>
              <q-separator vertical inset class="q-mx-lg" />
              <div class="column items-center">
                <q-avatar size="72px">
                  <img
                    :src="imgUser(user.userCRM.id)"
                    @error="setDefaultAvatar"
                  />
                </q-avatar>
                <div class="text-caption q-mt-md q-mb-xs text-center">
                  <q-item-label
                    >{{ user.userCRM.nombres }}
                    {{ user.userCRM.apellidos }}</q-item-label
                  >
                  <q-item-label caption>{{
                    user.userCRM.division
                  }}</q-item-label>
                  <q-item-label caption>{{
                    user.userCRM.amercado
                  }}</q-item-label>
                </div>
                <q-btn
                  color="primary"
                  label="Salir"
                  push
                  size="sm"
                  v-close-popup
                  @click="useRouter()?.push('/login')"
                />
              </div>
            </div>
          </q-menu>
        </q-btn>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script lang="ts" setup>
import { templateStore, colorsStore } from 'src/stores/useTemplateStore';
import { userStore } from 'src/modules/Users/store/UserStore';
import { useRoute, useRouter } from 'vue-router';
import { setDefaultAvatar } from '../../composables/useErrorSetDefaults';

const template = templateStore();
const user = userStore();
const route = useRoute();
const color = colorsStore();

const imgUser = (id: string) => {
  if (id) return `${process.env.HANSACRM3_URL}/upload/users/${id}`;
  else return '/avatar/user.png';
};
</script>

<style></style>
