<script lang="ts">
import {
  InformationCardComponent,
  SupervisorComponent,
  TabCardComponent,
} from '../components';
import { ref, computed } from 'vue';
import ViewGeneralSkeleton from '../components/Skeletons/ViewGeneralSkeleton.vue';
import { Notification } from 'src/composables';
import { useQuasar, QSpinnerPuff } from 'quasar';
import { useAsyncState } from '@vueuse/core';
import { useWorkareaStore } from '../store/useWorkAreasStore';
import { BasicInformation } from '../utils/types';
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
const supervisorCardRef = ref<InstanceType<typeof SupervisorComponent> | null>(
  null
);
const tabsCardRef = ref<InstanceType<typeof TabCardComponent> | null>(null);

//variables
const $q = useQuasar();
const workareaStore = useWorkareaStore();
const localIdValue = ref(props.moduleId || '');

//* computed variables
const isSomeCardEditing = computed(() =>
  [informationCardRef.value?.isEditing].some((value) => !!value)
);

const { isLoading, execute } = useAsyncState(async () => {
  if (!!localIdValue.value) {
    const cardResponse = await workareaStore.getWorkArea(localIdValue.value);
    return cardResponse;
  }
}, {} as BasicInformation);

//functions
const validateCards = async () => {
  const validCards: (boolean | undefined)[] = [];
  if (informationCardRef.value?.isEditing) {
    const informationCardValidation =
      await informationCardRef.value.validateInputs();
    validCards.push(informationCardValidation);
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

  if (!!localIdValue.value) {
    console.log('update');
    const informationData = informationCardRef.value?.exposeCardData();

    if (!!informationData) {
      try {
        $q.loading.show({
          spinner: QSpinnerPuff,
          message: 'Actualizando Projecto',
        });
        await workareaStore.updateWorkArea(localIdValue.value, informationData);
        emits('submitComplete', localIdValue.value);
        execute();
      } catch (error) {
      } finally {
        $q.loading.hide();
      }
    }
  } else {
    console.log('create');
    const informationData = informationCardRef.value?.exposeCardData();
    const supervisorData = supervisorCardRef.value?.exposeCardData();
    const commentData = tabsCardRef.value?.exposeData();

    if (!!informationData) {
      try {
        $q.loading.show({
          spinner: QSpinnerPuff,
          message: 'Creando Projecto',
        });
        informationData.project_id = props.projectId;

        if (supervisorData?.id != undefined) {
        }

        const newWorkarea = await workareaStore.useCreateWorkArea(
          informationData,
          supervisorData?.id ?? '',
          commentData ?? ''
        );
        localIdValue.value = newWorkarea.id;
        emits('submitComplete', localIdValue.value, informationData.name);
        execute();
      } catch (error) {
        throw error;
      } finally {
        $q.loading.hide();
      }
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
        :id="moduleId ?? ''"
        :data="workareaStore.payload"
      />
    </div>
    <div class="col-md-6 col-xs-12">
      <SupervisorComponent
        ref="supervisorCardRef"
        :module-id="moduleId ?? ''"
      />
      <TabCardComponent ref="tabsCardRef" :module-id="moduleId" />
    </div>
  </div>
</template>
<style scoped></style>
