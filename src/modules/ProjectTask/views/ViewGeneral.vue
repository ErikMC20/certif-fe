<script lang="ts">
import { ref } from 'vue';
import { useAsyncState } from '@vueuse/core';
import ViewGeneralSkeleton from '../components/Skeletons/ViewGeneralSkeleton.vue';
import InformationCardComponent from '../components/Cards/InformationCardComponent.vue';
import CommentsComponent from 'src/components/Comments/CommentsComponent.vue';
import ActivitiesComponent from 'src/components/Activities/ActivitiesComponent.vue';
import ListAssignationsComponent from '../components/Cards/ListAssignmentsComponent.vue';
import { userStore } from '../../Users/store/UserStore';
import { useProjectTask } from '../store/useProjectTaskStore';
</script>
<script setup lang="ts">
//props
const props = defineProps<{
  moduleId: string;
}>();

const task = useProjectTask();
const { userCRM } = userStore();

//variables
const tab = ref('comments');

const { state, isLoading } = useAsyncState(async () => {
  return await task.getTasks(props.moduleId);
}, {});

//emits
</script>
<template>
  <ViewGeneralSkeleton v-if="isLoading" />
  <div class="row q-col-gutter-sm" v-else>
    <div class="col-md-6 col-sm-12">
      <InformationCardComponent
        ref="informationCardRef"
        :id="state.id"
        :data="state"
        :read-mode="true"
      />
    </div>
    <div class="col-md-6 col-xs-12">
      <q-card class="">
        <q-card-section class="q-pa-none">
          <q-tabs
            v-model="tab"
            inline-label
            outside-arrows
            mobile-arrows
            align="justify"
            class="shadow-2 text-grey-7"
            active-class="text-primary"
          >
            <q-tab name="comments" icon="chat" label="Comentarios" />
            <q-tab name="assignment" icon="mail" label="Asignaciones" />
            <q-tab name="activities" icon="movie" label="Actividades" />
          </q-tabs>
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="comments">
              <CommentsComponent
                module="ProjectTask"
                :module-id="state.id"
                :description-crm3="''"
              />
            </q-tab-panel>
            <q-tab-panel name="assignment">
              <ListAssignationsComponent :module-id="state.id" />
            </q-tab-panel>

            <q-tab-panel name="activities">
              <ActivitiesComponent
                module="ProjectTask"
                :id="state.id"
                :id-user="userCRM.id"
              />
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<style scoped></style>
