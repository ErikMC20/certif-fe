<script lang="ts">
import { InformationCardComponent, TabCardComponent } from '../components';
import ViewGeneralSkeleton from '../components/Skeletons/ViewGeneralSkeleton.vue';
import { Notification } from 'src/composables';
import { usePlanningStore } from '../store/usePlanningStore';
import GanttComponent from 'src/components/Gantt/GanttComponent.vue';
import { ref, computed } from 'vue';
import { useAsyncState } from '@vueuse/core';
</script>
<script setup lang="ts">
//props
const props = defineProps<{
  moduleId: string;
  projectId?: string;
}>();

const emits = defineEmits<{
  (event: 'submitComplete', values: string, title?: string): void;
}>();

//ref declarations
const informationCardRef = ref<InstanceType<
  typeof InformationCardComponent
> | null>(null);
const ganttCardRef = ref<InstanceType<typeof GanttComponent> | null>(null);
const tabsCardRef = ref<InstanceType<typeof TabCardComponent> | null>(null);

//variables
const planningStore = usePlanningStore();
const localIdValue = ref(props.moduleId || '');
const loading = ref(false);

//* computed variables
const isSomeCardEditing = computed(() =>
  [informationCardRef.value?.isEditing].some((value) => !!value)
);

const { isLoading, execute } = useAsyncState(async () => {
  if (!!localIdValue.value) {
    const cardResponse = await planningStore.getPlanningCopy(
      localIdValue.value
    );
    await planningStore.getTasksCopy(localIdValue.value);
    return cardResponse;
  }
}, {} as any);

//functions
const validateCards = async () => {
  const validCards: (boolean | undefined)[] = [];
  if (informationCardRef.value?.isEditing) {
    const informationCardValidation =
      await informationCardRef.value.validateInputs();
    validCards.push(informationCardValidation);
  }
  if (!localIdValue.value) {
    const commentCardValidation = await tabsCardRef.value?.validateInputs();
    validCards.push(commentCardValidation);
  }

  return validCards.every((card) => !!card);
};

const onSubmit = async () => {
  const areCardsValid = await validateCards();

  if (!areCardsValid) {
    Notification(
      'warning',
      'warning',
      '<strong>Error de validación</strong> <br/> Algunos campos necesitan ser llenados.'
    );
    return;
  }

  const informationData = informationCardRef.value?.exposeCardData();
  const commentData = tabsCardRef.value?.exposeData() ?? '';
  const ganttData = ganttCardRef.value?.exposeGanttData();

  if (!!informationData) {
    try {
      informationData.project_id_c = props.projectId;
      const newPlanning = await planningStore.useVersionPlanning(
        informationData,
        commentData,
        ganttData?.data ?? []
      );
      //localIdValue.value = newPlanning.id;

      emits('submitComplete', localIdValue.value, informationData.name);
      execute();
    } catch (error) {
      throw error;
    }
  }
};

//expose
defineExpose({
  onSubmit,
  isSomeCardEditing,
});
//emits
</script>
<template>
  <ViewGeneralSkeleton v-if="isLoading" />
  <div class="row q-col-gutter-sm" v-else>
    <div class="col-md-6 col-sm-12">
      <InformationCardComponent
        ref="informationCardRef"
        :id="''"
        :data="planningStore.payload"
      />
    </div>
    <div class="col-md-6 col-sm-12">
      <TabCardComponent ref="tabsCardRef" />
    </div>
    <div class="col-md-12" style="height: 83vh">
      <GanttComponent
        ref="ganttCardRef"
        :module-id="''"
        :data="planningStore.tasks"
        :isLoading="loading"
      />
    </div>
  </div>
</template>
<style scoped></style>
