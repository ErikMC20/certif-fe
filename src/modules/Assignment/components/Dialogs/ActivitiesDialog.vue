<script setup lang="ts">
import ActivitiesComponent from 'src/components/Activities/ActivitiesComponent.vue';
import { userStore } from 'src/modules/Users/store/UserStore';
import { ref } from 'vue';
import { GenericModel } from '../../utils/types';

const { userCRM } = userStore();

const open = ref(false);
const taskId = ref<GenericModel>({});

const onOpenDialog = (task: GenericModel) => {
  open.value = !open.value;
  taskId.value = task;
};

defineExpose({
  onOpenDialog,
});
</script>
<template>
  <dialog-component
    v-model="open"
    size-dialog="dialog-sm"
    :headerDiaabled="false"
    :footerDisabled="true"
  >
    <template #header>
      <q-toolbar class="bg-primary text-white">
        <q-btn flat round dense icon="pending_actions" />
        <q-toolbar-title> Actividades </q-toolbar-title>

        <q-btn flat round dense icon="close" v-close-popup />
      </q-toolbar>
    </template>
    <template #body>
      <div class="q-pa-sm">
        <q-card class="q-mb-sm">
          <q-card-section>
            <span class="text-caption">Información de la tarea</span>
            <div>
              <small class="text-grey-6">Tarea: </small>{{ taskId.task_name }}
              <br />
              <small class="text-grey-6">Incidencia: </small
              >{{ taskId.incidence }}% <br />
              <small class="text-grey-6">Cantidad: </small
              >{{ taskId.task_quantity }}
              {{ taskId.task_unit }}
            </div>
          </q-card-section>
        </q-card>
        <ActivitiesComponent
          :id="taskId.id_task"
          :idUser="userCRM.id"
          module="ProjectTask"
        />
      </div>
    </template>
  </dialog-component>
</template>

<style scoped></style>
