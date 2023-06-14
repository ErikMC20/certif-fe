<script lang="ts">
import ActivitiesComponent from 'src/components/Activities/ActivitiesComponent.vue';
import CommentsComponent from 'src/components/Comments/CommentsComponent.vue';
import CommentsComponent2 from 'src/components/Comments/CommentsComponent2.vue';
import { userStore } from 'src/modules/Users/store/UserStore';
import { ref } from 'vue';
</script>
<script setup lang="ts">
const tab = ref('comments');
const { userCRM } = userStore();
defineProps<{
  moduleId?: string;
}>();
</script>
<template>
  <q-card
    class="my-card q-mb-sm"
    :style="moduleId ? 'height:auto' : 'height: 50%'"
  >
    <q-tabs
      v-model="tab"
      inline-label
      outside-arrows
      mobile-arrows
      align="justify"
      class="shadow-2"
      active-class="text-primary"
    >
      <q-tab name="comments" icon="comment" label="Comentarios" />
      <q-tab
        name="activities"
        icon="comment"
        label="Actividades"
        :disable="!moduleId"
      />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="comments">
        <CommentsComponent
          :module-id="moduleId"
          module="HANY_Asignaciones"
          description-crm3=""
          v-if="moduleId"
        />

        <q-item v-else>
          <q-item-section>
            <q-item-label>Comentarios de la asignación</q-item-label>
            <q-item-label caption lines="2"
              >Los comentarios podran agregarse una vez se haya creado la
              asignación.</q-item-label
            >
          </q-item-section>
        </q-item>
      </q-tab-panel>
      <q-tab-panel name="activities">
        <ActivitiesComponent
          :id="moduleId ?? ''"
          :idUser="userCRM.id"
          module="HANY_Asignacion"
          v-if="moduleId"
        />
        <q-item v-else>
          <q-item-section>
            <q-item-label>Actividades de la asignación</q-item-label>
            <q-item-label caption lines="2"
              >Las actividades se podrán agregar una vez la asignación se haya
              creado.</q-item-label
            >
          </q-item-section>
        </q-item>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<style></style>
