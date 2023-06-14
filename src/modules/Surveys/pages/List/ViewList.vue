<template>
  <div class="q-pa-md">
    <div class="q-pb-sm">
      <table-component
        :rows="list.rows"
        :columns="list.columns"
        :visible="visible"
        :loading="loading"
        @openDialog="open = !open"
      />
    </div>
  </div>

  <dialog-component
    v-model="open"
    :headerDisabled="false"
    :footerDisabled="false"
    sizeDialog="dialog-lg"
  >
    <template v-slot:header>
      <q-toolbar>
        <q-icon
          :color="$q.dark.isActive ? 'white' : 'primary'"
          size="25px"
          name="assignment"
        />
        <q-toolbar-title :class="$q.dark.isActive ? 'text-white' : 'text-bold'"
          >{{ `Nueva cuenta: encuesta` }}
        </q-toolbar-title>
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
        </q-btn>
      </q-toolbar>
    </template>
    <template v-slot:body>
      <ViewAdd />
    </template>
    <template v-slot:footer>
      <q-btn color="primary" class="q-mr-md">Guardar</q-btn>
      <q-btn color="negative" v-close-popup>Cancelar</q-btn>
    </template>
  </dialog-component>
</template>
<script lang="ts" setup>
import { listComposable } from '../../composables';
import { onMounted, ref } from 'vue';
import ViewAdd from '../Add/ViewAdd.vue';
components: {
  ViewAdd;
}
//** import variables */
const { list, open, getList, loading } = listComposable();
const visible = ref([
  'name',
  'calories',
  'fat',
  'carbs',
  'protein',
  'sodium',
  'actions'
]);
//** ajax simulation */
loading.value = true;
onMounted(async () => {
  setTimeout(async () => {
    list.value = await getList();
    loading.value = false;
  }, 1500);
});
</script>
