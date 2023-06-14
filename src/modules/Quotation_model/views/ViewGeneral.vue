<script lang="ts">
import { ref, computed, onMounted } from 'vue';
import CardInfo from '../components/Cards/CardInfo.vue';
import ListColors from '../components/Cards/ListColors.vue';
import ListProducts from '../components/Cards/ListProducts.vue';
import AssignedSingleUser2 from 'src/components/AssignedUsers/AssignedSingleUser2.vue';
import { userStore } from 'src/modules/Users/store/UserStore';
import { useFormOptionsStore } from 'src/stores/formOptionsStore';
import { useQuotationStore } from '../store/QuotationStore';
import { useQuotationModelService } from '../services/QuotationModelService';
import CommentsList from 'src/components/Comments/CommentsList.vue';
import ViewGeneralSkeleton from 'src/components/Skeletons/ViewGeneralSkeleton.vue';
import { QInput, useQuasar, QSpinnerPuff } from 'quasar';
import { useAsyncState, useStorage } from '@vueuse/core';
import { InfoLead } from '../utils/types';
</script>
<script lang="ts" setup>
const props = defineProps<{
  id?: string;
}>();

const tab = ref(props.id ? 'comentarios' : 'comentarios');
const user = userStore();
const quotesStore = useQuotationStore();
const { setUserAssigned } = useQuotationModelService();
const languageStore = useFormOptionsStore();
const $q = useQuasar();
const listalmacen = ref();
const listproducto = ref();

const assignedSingleUserRef = ref<InstanceType<
  typeof AssignedSingleUser2
> | null>(null);
const localIdValue = ref(props.id || '');
const { userCRM } = user;
const commentCreate = ref('');
const isSomeCardEditing = computed(() => {
  return [infoCardRef.value?.isEditing, ListProductsRef.value?.isEditing].some(
    (value) => !!value
  );
});

const { state, isLoading, execute } = useAsyncState(async () => {
  await languageStore.getLeadsOptions();
  if (!!localIdValue.value) {
    const cardResponse = await leadsStore.getLeadFormatted(localIdValue.value);
    return cardResponse;
  }
}, {} as InfoLead);

const emits = defineEmits<{
  (event: 'submitComplete', values: string): void;
  (event: 'submitFail', values: string, options?: object): void;
}>();

const infoCardRef = ref<InstanceType<typeof CardInfo> | null>(null);
const ListColorsRef = ref<InstanceType<typeof ListColors> | null>(null);
const ListProductsRef = ref<InstanceType<typeof ListProducts> | null>(null);
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

//para cargar las lista de almacen y productos
// onMounted(async () => {
//   listalmacen.value = await quotesStore.getListModelAlmacen(props.id);
//   listproducto.value = await quotesStore.getListModelporProducto(props.id);
//   const listaLocal = useStorage('listalmacenAlm', listalmacen.value);
//   const listaLocal2 = useStorage('listalmacenPro', listproducto.value);
// });

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
    const relationLeadsData = ListProductsRef.value?.exposeData();

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
    console.log('create');
    const cardInfoData = infoCardRef.value?.exposeData();
    const relationLeadsData = ListProductsRef.value?.exposeData();
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

defineExpose({
  onSubmit,
  execute,
  isSomeCardEditing,
});
</script>
<template>
  <div v-if="isLoading"><ViewGeneralSkeleton /></div>
  <div v-else class="row q-col-gutter-sm">
    <div class="col-xs-12 col-sm-12 col-md-6">
      <div class="row q-gutter-y-md">
        <CardInfo
          :id="id"
          :data="state?.cardInfo"
          class="col-12"
          ref="infoCardRef"
        />
        <ListProducts
          :id="id"
          :data="state?.relationInfo"
          class="col-12"
          ref="ListProductsRef"
        />
      </div>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-6">
      <ListColors
        ref="ListColorsRef"
        :id="id"
        :module="'HANQ_Modelo'"
        :module-id="localIdValue"
      />
      <br />
      <!-- <AssignedSingleUser2
        ref="assignedSingleUserRef"
        :module="'HANO_Lead'"
        :module-id="localIdValue"
        :withList="false"
        @changeUser="onChangeUserAssigned"
      /> -->
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
                <CommentsList :id="id" :modulo="'HANQ_Modelo'"></CommentsList>
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
              <!-- <q-tab-panel name="Activities">
                <ActivitiesComponent
                  :id="localIdValue"
                  :idUser="userCRM.id"
                  module="HANO_Lead"
                  :emails="[]"
                  :nameReg="''"
                ></ActivitiesComponent>
              </q-tab-panel> -->
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
