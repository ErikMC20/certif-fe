<script lang="ts">
import { ref, computed } from 'vue';
import CardInfo from '../components/Cards/CardInfo.vue';
import CardArticles from 'src/modules/Deliveries/components/Cards/CardArticles.vue';
import DeliveriesRelation from 'src/modules/Deliveries/components/Cards/DeliveriesRelation.vue';
import AssignedSingleUser2 from 'src/components/AssignedUsers/AssignedSingleUser2.vue';
import { userStore } from 'src/modules/Users/store/UserStore';
import { useFormOptionsStore } from 'src/stores/formOptionsStore';
import { useDeliveriesStore } from 'src/modules/Deliveries/store/DeliveriesStore';
import { useDeliveriesService } from 'src/modules/Deliveries/services/DeliveriesService';
import CommentsList from 'src/components/Comments/CommentsList.vue';
import ViewChangecontrol from 'src/modules/Deliveries/components/Cards/ViewChangecontrol.vue';
import ViewGeneralSkeleton from 'src/components/Skeletons/ViewGeneralSkeleton.vue';
import { QInput, useQuasar, QSpinnerPuff } from 'quasar';
import ActivitiesComponent from 'src/components/Activities/ActivitiesComponent.vue';
import { useAsyncState } from '@vueuse/core';
import { InfoLead } from '../utils/types';
</script>
<script lang="ts" setup>
const props = defineProps<{
  id?: string;
}>();

const tab = ref(props.id ? 'Activities' : 'comentarios');
const user = userStore();
const deliveriesStore = useDeliveriesStore();
const { setUserAssigned } = useDeliveriesService();
const languageStore = useFormOptionsStore();
const $q = useQuasar();
const assignedSingleUserRef = ref<InstanceType<
  typeof AssignedSingleUser2
> | null>(null);
const localIdValue = ref(props.id || '');
const { userCRM } = user;
const commentCreate = ref('');
const isSomeCardEditing = computed(() => {
  return [infoCardRef.value?.isEditing, leadRelationsRef.value?.isEditing].some(
    (value) => !!value
  );
});

const { state, isLoading, execute } = useAsyncState(async () => {
  await languageStore.getLeadsOptions();
  await languageStore.getDeliveryOptions();
  if (!!localIdValue.value) {
    const cardResponse = await deliveriesStore.getDeliveryFormatted(localIdValue.value);
    return cardResponse;
  }
}, {} as InfoLead);

const emits = defineEmits<{
  (event: 'submitComplete', values: string): void;
  (event: 'submitFail', values: string, options?: object): void;
}>();

const infoCardRef = ref<InstanceType<typeof CardInfo> | null>(null);
const leadRelationsRef = ref<InstanceType<typeof LeadsRelation> | null>(null);
const commentRef = ref<InstanceType<typeof QInput> | null>(null);

const onChangeUserAssigned = async (id: string) => {
  await setUserAssigned(localIdValue.value, id);
  emits('submitComplete', localIdValue.value);
};

const validateCards = async () => {
  const validCards: (boolean | undefined)[] = [];
  if (infoCardRef.value?.isEditing) {
    const infoCardValidation = await infoCardRef.value.validateInputs();
    validCards.push(infoCardValidation);
  }
  if (!localIdValue.value) {
    const firstCommentValidation = await commentRef.value?.validate();
    validCards.push(firstCommentValidation);
  }
  return validCards.every((card) => !!card);
};

const onSubmit = async () => {
  const areCardsValid = await validateCards();

  if (!areCardsValid) {
    $q.notify({
      type: 'warning',
      message: 'Error de validación',
      caption: 'Algunos campos necesitan ser llenados',
    });
    return;
  }

  if (!!localIdValue.value) {
    console.log('update');
    const cardInfoData = infoCardRef.value?.exposeData();
    const relationLeadsData = leadRelationsRef.value?.exposeData();
    if (!!cardInfoData) {
    //if (!!cardInfoData && !!relationLeadsData) {
      try {
        $q.loading.show({
          spinner: QSpinnerPuff,
          message: 'Actualizando Reserva',
        });
        await deliveriesStore.updateDelivery(
          localIdValue.value,
          cardInfoData,
          relationLeadsData
        );
        emits('submitComplete', localIdValue.value);
        execute();
      } catch (error) {
      } finally {
        $q.loading.hide();
      }
    }
  } else {
    console.log('create');
    // const cardInfoData = infoCardRef.value?.exposeData();
    // const relationLeadsData = leadRelationsRef.value?.exposeData();
    // const assignedUser = assignedSingleUserRef.value?.dataSend.id;
    // const firstComment = commentCreate.value;

    // if (
    //   !!cardInfoData &&
    //   !!relationLeadsData &&
    //   !!firstComment &&
    //   !!assignedUser
    // ) {
    //   try {
    //     $q.loading.show({
    //       spinner: QSpinnerPuff,
    //       message: 'Creando Lead',
    //     });
    //     const newLead = await reserveStore.createLead(
    //       cardInfoData,
    //       relationLeadsData,
    //       firstComment,
    //       assignedUser
    //     );
    //     localIdValue.value = newLead.id;
    //     emits('submitComplete', localIdValue.value);
    //     execute();
    //   } catch (error) {
    //     throw error;
    //   } finally {
    //     $q.loading.hide();
    //   }
    // }
  }
};

defineExpose({
  onSubmit,
  execute,
  isSomeCardEditing,
});
</script>
<template>
  <div v-if="isLoading"><ViewGeneralSkeleton /></div>
  <div v-else class="row q-col-gutter-lg">
    <div class="col-xs-12 col-sm-12 col-md-6">
      <div class="row q-gutter-y-md">
        <CardInfo
          :id="id"
          :data="state?.cardInfo"
          class="col-12"
          ref="infoCardRef"
        />
        <DeliveriesRelation
          :id="id"
          :data="state?.relationInfo"
          class="col-12"
          ref="leadRelationsRef2"
        />
        <CardArticles
          :id="id"
          :data="state?.relationInfo"
          class="col-12"
          ref="leadRelationsRef3"
        />
      </div>
    </div>
     <div class="col-xs-12 col-sm-12 col-md-6">
      <AssignedSingleUser2
        ref="assignedSingleUserRef"
        :module="'HANE_Entregas'"
        :module-id="localIdValue"
        :withList="false"
        @changeUser="onChangeUserAssigned"
      />
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
                :disable="!localIdValue"
              />
              <q-tab name="comentarios" icon="comment" label="Comentarios" />

              <q-tab
                name="historychanges"
                icon="history"
                label="Historial"
                :disable="!localIdValue"
              />
            </q-tabs>
            <q-separator />
            <q-tab-panels
              v-model="tab"
              animated
              style="min-height: fit-content"
            >
              <q-tab-panel
                name="comentarios"
                style="min-height: 500px"
                class="q-py-sm"
                v-if="1==1"
              >
                <CommentsList
                  :id="localIdValue"
                  descCRM3=""
                  :modulo="'HANE_Entregas'"
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
                  :id="localIdValue"
                  :idUser="userCRM.id"
                  module="HANE_Entregas"
                  :emails="[]"
                  :nameReg="''"
                ></ActivitiesComponent>
              </q-tab-panel>
              <q-tab-panel name="historychanges" v-if="localIdValue !== null">
                <ViewChangecontrol :id="localIdValue"></ViewChangecontrol>
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
