<script lang="ts">
import {
  InformationCardComponent,
  SupervisorComponent,
  TabCardComponent,
  GoalsCardComponent,
} from '../components';
import { ref, computed, onMounted } from 'vue';
import { useAssignmentStore } from '../store/useAssignmentStore';
import { BasicInformation } from '../utils/types';
import { userStore } from 'src/modules/Users/store/UserStore';
import { useAsyncState } from '@vueuse/core';
import ViewGeneralSkeleton from 'src/components/Skeletons/ViewGeneralSkeleton.vue';
import { getTasksProject } from '../services/useAssignmentService';
</script>
<script setup lang="ts">
//props
const props = defineProps<{
  moduleId: string;
  projectId: string;
}>();

//ref declarations
const informationCardRef = ref<InstanceType<
  typeof InformationCardComponent
> | null>(null);
const supervisorCardRef = ref<InstanceType<typeof SupervisorComponent> | null>(
  null
);
const goalsCardRef = ref<InstanceType<typeof GoalsCardComponent> | null>(null);
const tabsCardRef = ref<InstanceType<typeof TabCardComponent> | null>(null);

//variables
const assigmentStore = useAssignmentStore();
const { userCRM } = userStore();
const localIdValue = ref('');
const tasks = ref([]);

//* computed variables
const isSomeCardEditing = computed(() =>
  [informationCardRef.value?.isEditing].some((value) => !!value)
);

const { execute, isLoading } = useAsyncState(
  async () => {
    return await assigmentStore.useGetAssignment(props.moduleId);
  },
  {},
  { immediate: false }
);

const onChangeWorkArea = (id: string) => {
  supervisorCardRef.value?.onGetSupervisor(id);
  goalsCardRef.value?.onGetGoalsList(id);
};

const validateCards = async () => {
  const validCards: (boolean | undefined)[] = [];
  if (informationCardRef.value?.isEditing) {
    const infoCardValidation = await informationCardRef.value.validateInputs();
    validCards.push(infoCardValidation);
  }

  const goalsCardValidation = goalsCardRef.value?.validateInputs();
  validCards.push(goalsCardValidation);

  return validCards.every((card) => !!card);
};

const onSubmit = async () => {
  const areCardsValid = await validateCards();

  if (!areCardsValid) {
    return;
  }

  if (!!localIdValue.value) {
    const informationData =
      informationCardRef.value?.exposeData() as BasicInformation;
    const goalsData = goalsCardRef.value?.exposeData();

    try {
      emits('submitComplete', localIdValue.value);
      ///execute();
    } catch (error) {}
  } else {
    const informationData = informationCardRef.value?.exposeData();
    const goalsData = goalsCardRef.value?.exposeData();
    try {
      const obj = <any>Object.values(goalsData)[0];
      const info = {
        ...informationData,
        objetivo: obj.objetivo,
        total_asignado: obj.total_asignado,
        user_id: userCRM.id,
      };

      const newRegistry = await assigmentStore.useCreateAssignment(
        info,
        obj.tareas
      );
      localIdValue.value = newRegistry.id;
      emits('submitComplete', localIdValue.value);
      execute();
    } catch (error) {
      throw error;
    }
  }
};

onMounted(async () => {
  tasks.value = await getTasksProject(props.projectId);

  if (props.moduleId) {
    execute();
  }
});

//expose
defineExpose({
  onSubmit,
  isSomeCardEditing,
});
//emits
const emits = defineEmits<{
  (e: 'submitComplete', id: string): void;
}>();
</script>
<template>
  <ViewGeneralSkeleton v-if="isLoading" />
  <div class="row q-col-gutter-sm" v-else>
    <div class="col-md-6 col-sm-12">
      <InformationCardComponent
        ref="informationCardRef"
        :id="assigmentStore.payload?.id ?? ''"
        :data="assigmentStore.payload"
        :project-id="projectId ?? ''"
        @changeWorkArea="onChangeWorkArea"
      />
      <GoalsCardComponent
        ref="goalsCardRef"
        :tasks="tasks"
        :id="moduleId ?? ''"
      />
    </div>
    <div class="col-md-6 col-sm-12">
      <SupervisorComponent
        ref="supervisorCardRef"
        :module-id="projectId ?? ''"
      />
      <TabCardComponent ref="tabsCardRef" :module-id="moduleId" />
    </div>
  </div>
</template>
<style scoped></style>
