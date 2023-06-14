<script lang="ts">
import { ref } from 'vue';
import { QInput } from 'quasar';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { userStore } from 'src/modules/Users/store/UserStore';
import ActivitiesComponentGlobal from '../InProgress/ActivitiesComponentGlobal.vue';
import MilestonesComponent from '../InProgress/MilestonesComponent.vue';
import TasksComponent from '../InProgress/TasksComponent.vue';
import CommentsComponent from 'src/components/Comments/CommentsComponent.vue';
</script>
<script setup lang="ts">
const tab = ref('comments');
defineProps<{
  moduleId?: string;
}>();

//variables
const { userCRM } = userStore();
const comentario = ref('');

//refs
const commentInputRef = ref<InstanceType<typeof QInput> | null>(null);

//functions
const exposeData = () => {
  return comentario.value;
};

const validateInputs = async () => {
  const validatedFields = await Promise.all([
    commentInputRef.value?.validate(),
  ]);
  return validatedFields.every((field) => !!field);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setAltImg = (event: any) => {
  event.target.src = `${HANSACRM3_URL}/upload/users/avatardefault.png`;
};

defineExpose({
  validateInputs,
  exposeData,
});
</script>
<template>
  <q-card
    class="q-my-sm"
    :style="$q.screen.xs ? 'width: calc(100dvw - 35px); min-height:300px' : ''"
  >
    <q-tabs
      v-model="tab"
      inline-label
      outside-arrows
      mobile-arrows
      align="justify"
      class="shadow-2 text-grey-7"
      active-class="text-primary"
    >
      <q-tab name="comments" icon="comment" label="Comentarios" />
      <q-tab
        name="hitos"
        icon="fact_check"
        label="Hitos del proyecto"
        :disable="!moduleId"
      />
      <q-tab
        name="start_tasks"
        icon="done_outline"
        label="Tareas en progreso"
        :disable="!moduleId"
      />
      <q-tab
        name="activities"
        icon="article"
        label="Actividades"
        :disable="!moduleId"
      />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="comments">
        <CommentsComponent
          v-if="moduleId"
          :module-id="moduleId"
          module="Project"
        />

        <q-input
          autogrow
          outlined
          bottom-slots
          v-model="comentario"
          placeholder="Escriba su comentario"
          ref="commentInputRef"
          dense
          v-else
          color="primary"
        >
          <template v-slot:append>
            <q-icon
              v-if="comentario !== ''"
              name="close"
              @click="comentario = ''"
              class="cursor-pointer"
            />
          </template>
          <template v-slot:before>
            <q-avatar>
              <img
                :src="`${HANSACRM3_URL}/upload/users/${userCRM.id}`"
                @error="setAltImg"
              />
            </q-avatar>
          </template>
        </q-input>
        <!-- <CommentsComponent2 module-id="" module="" /> -->
      </q-tab-panel>
      <q-tab-panel name="hitos">
        <MilestonesComponent :module-id="moduleId ?? ''" />
      </q-tab-panel>
      <q-tab-panel name="start_tasks">
        <TasksComponent :module-id="moduleId ?? ''" />
      </q-tab-panel>
      <q-tab-panel name="activities">
        <!-- <ActivitiesComponent :module-id="moduleId ?? ''" /> -->
        <ActivitiesComponentGlobal
          :id="moduleId || ''"
          :idUser="userCRM.id"
          module="ProjectTask"
        />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<style scoped></style>
