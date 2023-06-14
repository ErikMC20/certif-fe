<script lang="ts">
import { ref, computed } from 'vue';
import { useAsyncState } from '@vueuse/core';
import { Loading } from 'quasar';
import { storeToRefs } from 'pinia';

import { useProjectStore } from '../store/useProjectStore';
import { Notification } from 'src/composables';

import { ResponsibleComponent } from 'src/components';

import {
  InformationCardComponent,
  FinancialCardComponent,
  OportunitiesCardComponent,
} from '../components';
import TabCardComponent from '../components/Cards/TabCardComponent.vue';
import ViewGeneralSkeleton from '../components/Skeletons/ViewGeneralSkeleton.vue';
import IndicatorsComponent2 from '../components/Indicators/IndicatorsComponent2.vue';
import { useProjectTableStore } from '../store/useProjectTableStore';
</script>
<script setup lang="ts">
//props
const props = defineProps<{
  moduleId: string;
}>();

const emits = defineEmits<{
  (event: 'submitComplete', values: string): void;
}>();

//ref declarations
const informationCardRef = ref<InstanceType<
  typeof InformationCardComponent
> | null>(null);
const financialCardRef = ref<InstanceType<
  typeof FinancialCardComponent
> | null>(null);
const responsibleCardRef = ref<InstanceType<
  typeof ResponsibleComponent
> | null>(null);
const oportunitiesCardRef = ref<InstanceType<
  typeof OportunitiesCardComponent
> | null>(null);

const tabsCardRef = ref<InstanceType<typeof TabCardComponent> | null>(null);

//variables
const projectStore = useProjectStore();
const projectTableStore = useProjectTableStore();
const { loading } = storeToRefs(projectStore);
const localIdValue = ref(props.moduleId || '');

//* computed variables
const isSomeCardEditing = computed(() =>
  [
    informationCardRef.value?.isEditing,
    financialCardRef.value?.isEditing,
    oportunitiesCardRef.value?.isEditing,
  ].some((value) => !!value)
);

const { execute } = useAsyncState(async () => {
  if (!!localIdValue.value) {
    const cardResponse = await projectStore.onGetProject(localIdValue.value);
    return cardResponse;
  }
}, undefined);

//functions
const validateCards = async () => {
  const validCards: (boolean | undefined)[] = [];
  if (informationCardRef.value?.isEditing) {
    const infoCardValidation = await informationCardRef.value.validateInputs();
    validCards.push(infoCardValidation);
  }
  if (oportunitiesCardRef.value?.isEditing) {
    const oportCardValidation =
      await oportunitiesCardRef.value?.validateInputs();
    validCards.push(oportCardValidation);
  }
  if (!localIdValue.value) {
    const respnsibleCardValidation =
      await responsibleCardRef.value?.validateCard();
    validCards.push(respnsibleCardValidation);
  }
  console.log(validCards);
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
    const financialData = financialCardRef.value?.exposeCardData();
    const clientinfoData = oportunitiesCardRef.value?.exposeCardData();

    if (!!informationData && !!financialData && !!clientinfoData) {
      try {
        Loading.show({
          message: 'Actualizando Informacion',
        });
        await projectStore.onUpdateProject(
          localIdValue.value,
          informationData,
          clientinfoData,
          financialData
        );
        emits('submitComplete', localIdValue.value);
        execute();
      } catch (error) {
      } finally {
        Loading.hide();
        Notification(
          'positive',
          'check_circle',
          'Se actualizó la información correctamente.'
        );
      }
    }
  } else {
    console.log('create');
    const informationData = informationCardRef.value?.exposeCardData();
    const financialData = financialCardRef.value?.exposeCardData();
    const responsiblesData = responsibleCardRef.value?.exposeCardData();
    const clientinfoData = oportunitiesCardRef.value?.exposeCardData();
    const commentData = tabsCardRef.value?.exposeData();
    if (
      !!informationData &&
      !!financialData &&
      !!clientinfoData &&
      !!responsiblesData
    ) {
      try {
        Loading.show({
          message: 'Guardando Información',
        });
        const newProject = await projectStore.onCreateProject(
          informationData,
          financialData,
          clientinfoData,
          responsiblesData,
          commentData ?? ''
        );
        localIdValue.value = newProject.id;
        emits('submitComplete', localIdValue.value);
        execute();
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        Loading.hide();
        Notification(
          'positive',
          'check_circle',
          'Se guardó la información correctamente..'
        );
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
  <ViewGeneralSkeleton v-if="loading" />
  <div class="row q-col-gutter-sm" v-else>
    <IndicatorsComponent2 v-if="moduleId" :module-id="moduleId" />
    <div class="col-md-7 col-xs-12">
      <InformationCardComponent
        ref="informationCardRef"
        :id="moduleId ?? ''"
        :data="projectStore.info1"
        @update="onSubmit"
      />

      <FinancialCardComponent
        ref="financialCardRef"
        :id="moduleId ?? ''"
        :data="projectStore.info2"
      />
      <OportunitiesCardComponent
        ref="oportunitiesCardRef"
        :id="moduleId ?? ''"
        :data="projectStore.info3"
      />
    </div>
    <div class="col-md-5 col-xs-12">
      <ResponsibleComponent
        ref="responsibleCardRef"
        :module-id="moduleId ?? ''"
        @update="projectTableStore.reloadList()"
      />
      <div class="sticky">
        <TabCardComponent ref="tabsCardRef" :module-id="moduleId" />
      </div>
    </div>
  </div>
</template>
<style scoped>
.sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 10px;
}
</style>
