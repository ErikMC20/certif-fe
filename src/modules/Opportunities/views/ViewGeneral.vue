<script lang="ts">
import { ref, computed, toRef, onMounted } from 'vue';
import CardInfo from '../components/Cards/CardInfo.vue';
import InfoAdditional from '../components/Cards/CardInfoAdditional.vue';
// import InfoOthers from '../components/Cards/InfoOthers.vue';
import CardInfoTemp from '../components/Cards/CardInfoTemp.vue';
import AssignedSingleUser2 from 'src/components/AssignedUsers/AssignedSingleUser2.vue';
import CommentsList from 'src/components/Comments/CommentsList.vue';
import ViewChangecontrol from '../components/Cards/ViewChangecontrol.vue';
import ViewGeneralSkeleton from 'src/components/Skeletons/ViewGeneralSkeleton.vue';
import { QInput, useQuasar, QSpinnerPuff, event } from 'quasar';
import ActivitiesComponent from 'src/components/Activities/ActivitiesComponent.vue';
import { InfoOpportunity, OpportunityGlobal } from '../utils/types';
import CardOthersInfo from '../components/Cards/CardOthersInfo.vue';
import { useOpportunity } from '../composables/useOppotunity/';
import CardSalesCriteria from '../components/Cards/CardSalesCriteria.vue';
import { AccountModel, AccountDataDraft } from '../../../../../frontend-quasar-v3-vite/src/modules/Accounts/utils/types/index';
</script>
<script lang="ts" setup>
const props = defineProps<{
  id?: string;
  getDraftData?: boolean;
}>();

const emits = defineEmits<{
  (event: 'createAccount', type: AccountModel): void;
  (event: 'submitComplete', values: string): void;
  (event: 'pruebaRefrescar'): void;
  (event: 'submitFail', values: string, options?: object): void;
}>();

const {
  isLoading: isOppLoading,
  localId,
  salesCriteriaData,
  opportunityGlobalData,
  infoTempData,
  otherInfoData,
  userCRM,
  assignDefaultValues,
  getOpportunityGlobal,
  getDataFromDraft,
  resetOpportunityData,
  createOpportunity,
  updateOpportunity,
  setUserAssigned,
} = useOpportunity(props.id, { immediateOptions: true });

const tab = ref(props.id ? 'Activities' : 'comentarios');

const $q = useQuasar();
const assignedSingleUserRef = ref<InstanceType<typeof AssignedSingleUser2> | null>(null);

const commentCreate = ref('');

// const infoCardRef = ref<InstanceType<typeof CardInfo> | null>(null);
// const leadRelationsRef = ref<InstanceType<typeof InfoAdditional> | null>(null);
const cardInfoTempRef = ref<InstanceType<typeof CardInfoTemp> | null>(null);
const cardOthersInfoRef = ref<InstanceType<typeof CardOthersInfo> | null>(null);
const cardSalesCriteriaRef = ref<InstanceType<typeof CardSalesCriteria> | null>(null);

const isCriteriaVisible = computed(() => {
  const opportunityState = cardInfoTempRef.value?.opportunityCurrentState || '';
  return [
    '03_03_Menor',
    '03_04_Apoyo',
    '03_05_Licitacion',
    '03_06_Contratacion',
    '03_07_OrdenCompra',
    '03_08_Proyectos',
    '03_09_Contrato',
  ].includes(opportunityState);
});

// const InfoOthersRef = ref<InstanceType<typeof InfoOthers> | null>(null);
const commentRef = ref<InstanceType<typeof QInput> | null>(null);

const isSomeCardEditing = computed(() => {
  return [
    // infoCardRef.value?.isEditing,
    // leadRelationsRef.value?.isEditing
    cardInfoTempRef.value?.isEditing,
    cardOthersInfoRef.value?.isEditing,
    cardSalesCriteriaRef.value?.isEditing,
  ].some((value) => !!value);
});

const onChangeUserAssigned = async (id: string) => {
  await setUserAssigned(localId.value, id);
  await getOpportunityGlobal(localId.value, true);
  emits('submitComplete', localId.value);
};

// const validateCards = async () => {
//   const validCards: (boolean | undefined)[] = [];
//   if (infoCardRef.value?.isEditing) {
//     const infoCardValidation = await infoCardRef.value.validateInputs();
//     validCards.push(infoCardValidation);
//   }
//   if (!localId.value) {
//     const firstCommentValidation = await commentRef.value?.validate();
//     validCards.push(firstCommentValidation);
//   }
//   return validCards.every((card) => !!card);
// };

const onSubmit = async () => {
  // const areCardsValid = await validateCards();

  // if (!areCardsValid) {
  //   $q.notify({
  //     type: 'warning',
  //     message: 'Error de validación',
  //     caption: 'Algunos campos necesitan ser llenados',
  //   });
  //   return;
  // }

  if (!!localId.value) {
    console.log('update');
    // console.log('pppp');
    // const cardInfoData = infoCardRef.value?.exposeData();
    // console.log('nnnnnnn', cardInfoData);
    // const relationLeadsData = leadRelationsRef.value?.exposeData();
    const cardInfoTempData = cardInfoTempRef.value?.exposeData();
    const cardOthersData = cardOthersInfoRef.value?.exposeData();
    const cardSalesCriteria = isCriteriaVisible.value
      ? cardSalesCriteriaRef.value?.exposeData()
      : ({} as OpportunityGlobal);

    if (!!cardInfoTempData && !!cardOthersData && !!cardSalesCriteria) {
      try {
        const body: OpportunityGlobal = {
          ...cardInfoTempData,
          ...cardOthersData,
          ...cardSalesCriteria,
        };
        await updateOpportunity(localId.value, body, true);
        emits('submitComplete', localId.value);
      } catch (error) {
        console.log(error);
      }
    }

    // if (!!cardInfoData && !!relationLeadsData) {
    //   try {
    //     $q.loading.show({
    //       spinner: QSpinnerPuff,
    //       message: 'Actualizando Oportunidad',
    //     });
    //     await OpportunitiesStore.updateLead(
    //       localId.value,
    //       cardInfoData,
    //       relationLeadsData
    //     );
    //     emits('submitComplete', localId.value);
    //     execute();
    //   } catch (error) {
    //   } finally {
    //     $q.loading.hide();
    //   }
    // }
  } else {
    console.log('create');
    const cardInfoTempData = cardInfoTempRef.value?.exposeData();
    const cardOthersData = cardOthersInfoRef.value?.exposeData();
    const assignedUser = assignedSingleUserRef.value?.dataSend.id;
    const firstComment = commentCreate.value;
    const cardSalesCriteria = isCriteriaVisible.value
      ? cardSalesCriteriaRef.value?.exposeData()
      : ({} as OpportunityGlobal);

    if (!!cardInfoTempData && !!cardOthersData && !!cardSalesCriteria) {
      try {
        const body: OpportunityGlobal = {
          ...cardInfoTempData,
          ...cardOthersData,
          ...cardSalesCriteria,
          assigned_user_id: assignedUser || '',
          description: firstComment,
        };
        await createOpportunity(body, true);
        emits('submitComplete', localId.value);
      } catch (error) {
        console.log(error);
      }
    }
    // const cardInfoData = infoCardRef.value?.exposeData();
    // const relationLeadsData = leadRelationsRef.value?.exposeData();
    // const assignedUser = assignedSingleUserRef.value?.dataSend.id;
    // const firstComment = commentCreate.value;

    // if (!!cardInfoData && !!relationLeadsData && !!firstComment && !!assignedUser) {
    //   try {
    //     $q.loading.show({
    //       spinner: QSpinnerPuff,
    //       message: 'Creando Oportunidad',
    //     });
    //     const newLead = await OpportunitiesStore.createOpportunity(
    //       cardInfoData,
    //       relationLeadsData,
    //       firstComment,
    //       assignedUser
    //     );
    //     localId.value = newLead.id;
    //     emits('submitComplete', localId.value);
    //     execute();
    //   } catch (error) {
    //     throw error;
    //   } finally {
    //     $q.loading.hide();
    //   }
    // }
  }
};

const createNewAccount = (type: AccountModel) => {
  emits('createAccount', type);
};
const fillRelatedAccount = (type: AccountModel, accountData: AccountDataDraft) => {
  console.log('here new account');
  cardInfoTempRef.value?.openAccountDialogWithData(type, accountData);
}

(() => {
  if (!props.id) {
    resetOpportunityData();
    assignDefaultValues();
  }
  if (props.getDraftData) {
    getDataFromDraft();
  }
})();

defineExpose({
  fillRelatedAccount,
  onSubmit,
  isSomeCardEditing,
});
</script>
<template>
  <ViewGeneralSkeleton v-if="isOppLoading" />
  <div v-else class="row q-col-gutter-lg">
    <div class="col-xs-12 col-sm-12 col-md-6">
      <div class="row q-gutter-y-md">
        <!-- <CardInfo
          :id="id"
          :data="state?.cardInfo"
          @record-completed="eventRefresh"
          class="col-12"
          ref="infoCardRef"
        /> -->
        <!-- <pre>state: {{ state }}</pre>
        <pre>InfoData: {{ infoData }}</pre> -->
        <!-- <InfoAdditional
          :id="id"
          :data="state?.relationInfo"
          class="col-12"
          ref="leadRelationsRef"
          @update-division="updateOptions"
        /> -->
        <!-- Card Info Alt -->
        <CardInfoTemp
          :data="infoTempData"
          :id="localId"
          :account-creation-as-event="!!props.getDraftData"
          @create-account="createNewAccount"
          class="col-12"
          ref="cardInfoTempRef"
        />
        <!-- Others Info Card -->
        <CardOthersInfo
          :data="otherInfoData"
          :id="localId"
          class="col-12"
          ref="cardOthersInfoRef"
        />
        <!-- Sales Criteria Card (optional between divisions and opportunitie types) -->
        <CardSalesCriteria
          :data="salesCriteriaData"
          :id="localId"
          :view="[]"
          v-if="isCriteriaVisible"
          class="col-12"
          ref="cardSalesCriteriaRef"
        />
      </div>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-6">
      <AssignedSingleUser2
        ref="assignedSingleUserRef"
        :module="'Opportunities'"
        :module-id="localId"
        :withList="false"
        @changeUser="onChangeUserAssigned"
      />
      <!-- <AssignedUser ref="assignedUserRef" module="leads" :module-id="localId" /> -->

      <q-separator inset></q-separator>
      <div class="q-gutter-y-md">
        <q-card>
          <q-card-section style="padding: 0px">
            <q-tabs
              class="q-ma-none"
              v-model="tab"
              indicator-color="primary"
              :inline-label="!$q.screen.xs"
              :active-color="$q.dark.isActive ? 'orange' : 'primary'"
              align="justify"
              :no-caps="$q.screen.xs ? true : false"
            >
              <q-tab
                name="Activities"
                icon="person"
                label="Actividades"
                :disable="!localId"
              />
              <q-tab name="comentarios" icon="comment" label="Comentarios" />

              <q-tab
                name="historychanges"
                icon="history"
                label="Historial"
                :disable="!localId"
              />
            </q-tabs>
            <q-separator />
            <q-tab-panels v-model="tab" animated style="min-height: fit-content">
              <q-tab-panel
                name="comentarios"
                style="min-height: 500px"
                class="q-py-sm"
                v-if="!!localId"
              >
                <CommentsList
                  :id="localId"
                  :descCRM3="opportunityGlobalData.description || ''"
                  :modulo="'Opportunities'"
                >
                </CommentsList>
              </q-tab-panel>
              <q-tab-panel
                name="comentarios"
                style="min-height: 500px"
                class="q-pd-sm"
                v-else
              >
                <q-input
                  autogrow
                  outlined
                  bottom-slots
                  v-model="commentCreate"
                  placeholder="Escriba su comentario"
                  dense
                  color="primary"
                  ref="commentRef"
                  :rules="[(val) => !!val || 'El campo es requerido']"
                >
                  <template v-slot:before> </template>
                </q-input>
              </q-tab-panel>
              <q-tab-panel name="Activities">
                <ActivitiesComponent
                  :id="localId"
                  :idUser="userCRM.id"
                  module="Opportunities"
                ></ActivitiesComponent>
              </q-tab-panel>
              <q-tab-panel name="historychanges" v-if="localId !== null">
                <ViewChangecontrol :id="localId"></ViewChangecontrol>
              </q-tab-panel>
              <q-tab-panel name="historychanges" v-else>
                <ViewChangecontrol :id="'0'"></ViewChangecontrol>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>
