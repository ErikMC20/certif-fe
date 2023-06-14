<script lang="ts">
import { ref, computed } from 'vue';
import CardInfo from '../components/Cards/CardInfo.vue';
import LeadsRelation from '../components/Cards/LeadsRelation.vue';
import AssignedSingleUser2 from 'src/components/AssignedUsers/AssignedSingleUser2.vue';
import { userStore } from 'src/modules/Users/store/UserStore';
import { useFormOptionsStore } from 'src/stores/formOptionsStore';
import { useLeadsStore } from '../store/LeadsStore';
import { useLeadsService } from '../services/LeadsService';
import CommentsList from 'src/components/Comments/CommentsList.vue';
import ViewChangecontrol from '../components/Cards/ViewChangecontrol.vue';
import ViewGeneralSkeleton from 'src/components/Skeletons/ViewGeneralSkeleton.vue';
import { QInput, useQuasar, QSpinnerPuff } from 'quasar';
import ActivitiesComponent from 'src/components/Activities/ActivitiesComponent.vue';
import { useAsyncState } from '@vueuse/core';
import { InfoLead, CardInfoLead } from '../utils/types';
import moment from 'moment';
</script>
<script lang="ts" setup>
const props = defineProps<{
  id?: string;
  dataAccount?: { id: string; name: string };
}>();

const tab = ref(props.id ? 'Activities' : 'comentarios');
const user = userStore();
const leadsStore = useLeadsStore();
const { setUserAssigned } = useLeadsService();
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
const isLeadConverted = computed(
  () =>
    !!state.value?.cardInfo?.opportunity_id_c &&
    state.value?.cardInfo?.estado_c === 'Ganado'
);

const { state, isLoading, execute } = useAsyncState(async () => {
  await languageStore.getLeadsOptions();
  if (!!localIdValue.value) {
    const cardResponse = await leadsStore.getLeadFormatted(localIdValue.value);
    return cardResponse;
  }
  if (!!props.dataAccount) {
    const dataAccountRel = (leadsStore.draft = {
      account_id_c: props.dataAccount.id || '',
      contact_id_c: '',
      lead_id1_c: '',
    });
    const infoTemp = {
      name: props.dataAccount.name,
      iddivision_c: userCRM.iddivision,
      idamercado_c: userCRM.idamercado,
      idgrupocliente_c: '',
      origen_c: '',
      campaign_id_c: '',
      campania_c: '',
      estado_c: 'EnTratamiento',
      motivo_c: '',
      producto_c: '',
      date_closed: moment().format('YYYY-MM-DD'),
      description: '',
      currency_id: '-99',
      currency_name: '',
      currency_symbol: '',
      region_c: '01_01',
      prioridad_c: 'Media',
      amount: 0,
    } as Partial<CardInfoLead>;
    return {
      cardInfo: infoTemp as Partial<CardInfoLead>,
      relationInfo: dataAccountRel,
    };
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
  if (leadRelationsRef.value?.isEditing) {
    const leadRelationValidations = leadRelationsRef.value.validateCards();
    validCards.push(leadRelationValidations);
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
    const cardInfoData = infoCardRef.value?.exposeData();
    const relationLeadsData = leadRelationsRef.value?.exposeData();

    if (!!cardInfoData && !!relationLeadsData) {
      try {
        $q.loading.show({
          spinner: QSpinnerPuff,
          message: 'Actualizando Lead',
        });
        await leadsStore.updateLead(
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
    const cardInfoData = infoCardRef.value?.exposeData();
    const relationLeadsData = leadRelationsRef.value?.exposeData();
    const assignedUser = assignedSingleUserRef.value?.dataSend.id;
    const firstComment = commentCreate.value;

    if (
      !!cardInfoData &&
      !!relationLeadsData &&
      !!firstComment &&
      !!assignedUser
    ) {
      try {
        $q.loading.show({
          spinner: QSpinnerPuff,
          message: 'Creando Lead',
        });
        const newLead = await leadsStore.createLead(
          cardInfoData,
          relationLeadsData,
          firstComment,
          assignedUser
        );
        localIdValue.value = newLead.id;
        emits('submitComplete', localIdValue.value);
        execute();
      } catch (error) {
        throw error;
      } finally {
        $q.loading.hide();
      }
    }
  }
};

const generateComment = async () => {
  const data = leadRelationsRef.value?.exposeAllData();
  let generatedComment = '';
  if (!!data?.account?.title) {
    generatedComment =
      'Cliente: ' +
      data.account.title +
      '\n' +
      'Correo: ' +
      data.account.email1 +
      '\n' +
      'Teléfono: ' +
      data.account.celular_c +
      '\n';
  } else if (!!data?.prospect?.title) {
    generatedComment =
      'Cliente: ' +
      data.prospect.title +
      '\n' +
      'Correo: ' +
      data.prospect.email1 +
      '\n' +
      'Teléfono: ' +
      data.prospect.phone_mobile +
      '\n';
  }
  const productComment = !!infoCardRef.value?.exposeData().producto_c
    ? 'Producto: ' + infoCardRef.value?.exposeData().producto_c + '\n'
    : '';
  generatedComment = generatedComment + productComment;
  commentCreate.value = generatedComment + commentCreate.value;
  // const ress = generateCommentComposable(leadRelationsRef.value?.exposeData() || );
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
        <LeadsRelation
          :id="id"
          :data="state?.relationInfo"
          :read-mode="isLeadConverted"
          class="col-12"
          ref="leadRelationsRef"
        />
        <CardInfo
          :id="id"
          :read-mode="isLeadConverted"
          :data="state?.cardInfo"
          class="col-12"
          ref="infoCardRef"
        />
      </div>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-6">
      <AssignedSingleUser2
        ref="assignedSingleUserRef"
        :module="'HANO_Lead'"
        :module-id="localIdValue"
        :withList="false"
        @changeUser="onChangeUserAssigned"
      />
      <!-- <AssignedUser ref="assignedUserRef" module="leads" :module-id="localIdValue" /> -->

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
                v-if="!!localIdValue"
              >
                <CommentsList
                  :id="localIdValue"
                  :descCRM3="state?.cardInfo?.description || ''"
                  :modulo="'HANO_Lead'"
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
                <q-btn
                  class="q-mb-sm"
                  size="sm"
                  color="primary"
                  icon="comment"
                  label="Generar comentario"
                  @click="generateComment"
                >
                  <q-tooltip>
                    {{ 'Se generará datos de la cuenta o prospecto: ' }} <br />
                    {{ 'Nombre' }} <br />
                    {{ 'correo principal' }} <br />
                    {{ 'teléfono principal' }} <br />
                  </q-tooltip>
                </q-btn>
              </q-tab-panel>
              <q-tab-panel name="Activities">
                <ActivitiesComponent
                  :id="localIdValue"
                  :idUser="userCRM.id"
                  module="HANO_Lead"
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
