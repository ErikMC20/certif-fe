<script lang="ts">
// vue-quasar-libraries
import { ref, computed, toRef, onMounted } from 'vue';
import { Notify, QInput, useQuasar } from 'quasar';
import { Loading } from 'quasar';

import { storeToRefs } from 'pinia';

import { useProductTypesStore } from '../store/productTypes';

// global-components
import AssignedSingleUser2 from 'src/components/AssignedUsers/AssignedSingleUser2.vue';
import CommentsList from 'src/components/Comments/CommentsList.vue';
import ViewGeneralSkeleton from 'src/components/Skeletons/ViewGeneralSkeleton.vue';
// import ActivitiesComponent from 'src/components/Activities/ActivitiesComponent.vue';

// module-components
import CardInfo from '../components/Cards/CardInfo.vue';
import CardRequirements from '../components/Cards/CardRequirements.vue';

// module-files
import { useProductType } from '../composables';
import type { ProductType } from '../utils/types';
</script>
<script lang="ts" setup>
const props = defineProps<{
  id?: string;
  getDraftData?: boolean;
}>();

const emits = defineEmits<{
  (event: 'submitComplete', values: string): void;
  (event: 'pruebaRefrescar'): void;
  (event: 'submitFail', values: string, options?: object): void;
}>();

const {
  isLoading: isOppLoading,
  localId,
  productTypeData,
  productRequirements,

  userCRM,
  assignDefaultValues,
  getProductType,
  getDataFromDraft,
  resetProductTypeData,
  createProductType,
  updateProductType,
  setUserAssigned,
} = useProductType(props.id, { immediateOptions: true });

const productStore = useProductTypesStore();

const tab = ref(props.id ? 'Activities' : 'comentarios');

const $q = useQuasar();
const assignedSingleUserRef = ref<InstanceType<
  typeof AssignedSingleUser2
> | null>(null);

const commentCreate = ref('');

// const infoCardRef = ref<InstanceType<typeof CardInfo> | null>(null);
// const leadRelationsRef = ref<InstanceType<typeof InfoAdditional> | null>(null);
const cardInfoRef = ref<InstanceType<typeof CardInfo> | null>(null);
const cardRequirementsRef = ref<InstanceType<typeof CardRequirements> | null>(
  null
);

// const InfoOthersRef = ref<InstanceType<typeof InfoOthers> | null>(null);
//const commentRef = ref<InstanceType<typeof QInput> | null>(null);

const isSomeCardEditing = computed(() => {
  return [
    // infoCardRef.value?.isEditing,
    // leadRelationsRef.value?.isEditing
    cardInfoRef.value?.isEditing,
  ].some((value) => !!value);
});

const onChangeUserAssigned = async (id: string) => {
  await setUserAssigned(localId.value, id);
  await getProductType(localId.value);
  emits('submitComplete', localId.value);
};

const validateCards = async () => {
  const validCards: (boolean | undefined)[] = [];
  if (cardInfoRef.value?.isEditing) {
    const infoCardValidation = await cardInfoRef.value.validateInputs();
    validCards.push(infoCardValidation);
  }
  // if (!localId.value) {
  //   const firstCommentValidation = await commentRef.value?.validate();
  //   validCards.push(firstCommentValidation);
  // }
  return validCards.every((card) => !!card);
};

const onSubmit = async () => {
  // Validar datos...

  // const areCardsValid = await validateCards();
  // if (!areCardsValid) {
  //   $q.notify({
  //     type: 'warning',
  //     message: 'Error de validación',
  //     caption: 'Algunos campos necesitan ser llenados',
  //   });
  //   return;
  // }

  const cardInfoData = cardInfoRef.value?.exposeData();
  const requerimientos = cardRequirementsRef.value?.exposeData();

  // Verificar si existe un id por localId
  if (!!localId.value) {
    // actualizar datos si existe localId

    // if (!!cardInfoData) {
    //   try {
    //     const body: ProductType = {
    //       ...cardInfoData,
    //     };
    //     await updateProductType(localId.value, body, true);
    //     //await productStore.onUpdateProduct(cardInfoData, requerimientos);
    //     emits('submitComplete', localId.value);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
  } 
  else {

    // crear nuevo tipo de producto si NO existe localId
    //const cardInfoData = cardInfoRef.value?.exposeData();
    //const requerimientos = cardRequirementsRef.value?.exposeData();
    //const assignedUser = assignedSingleUserRef.value?.dataSend.id;
    //const firstComment = commentCreate.value;

    if (!!cardInfoData && !!requerimientos && requerimientos?.length > 0) {
      try {
        Loading.show({
          message: 'Guardando Información',
        });
        // const body: ProductType = {
        //   ...cardInfoData,
        //   requerimientos,
        // };
        //console.log(body);
        const newProductType = await productStore.onCreateProduct(cardInfoData, requerimientos);
        //await createProductType(body, true);
        //console.log(newProductType.id);

        localId.value = newProductType.id;
        emits('submitComplete', localId.value);
      } catch (error) {
        console.log(error);
      }
    }
    else{
       Notify.create({
        type: 'warning',
        message: 'Debe agregar requerimientos al tipo de producto',
        actions: [{ icon: 'close', color: 'dark', size: 'sm', round: true }],
      });
    }
  }
};

// Primera funcion a ejecutarse
(() => {
  if (!props.id) {
    resetProductTypeData();
    assignDefaultValues();
  }
  if (props.getDraftData) {
    getDataFromDraft();
  }
})();

// Funciones que se podran usar al declarar una referencia de este componente
defineExpose({
  onSubmit,
  isSomeCardEditing,
});
</script>
<template>
  <ViewGeneralSkeleton v-if="isOppLoading" />
  <div v-else class="row q-col-gutter-lg">
    <div class="col-xs-12 col-sm-12 col-md-6">
      <div class="row q-gutter-y-md">
        <CardInfo
          :data="productTypeData"
          :id="localId"
          class="col-12"
          ref="cardInfoRef"
        />
        <CardRequirements
          :data="productRequirements"
          :id="localId"
          class="col-12"
          ref="cardRequirementsRef"
        />
      </div>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-6">
      <AssignedSingleUser2
        ref="assignedSingleUserRef"
        :module="'ProductTypes'"
        :module-id="localId"
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
            <q-tab-panels
              v-model="tab"
              animated
              style="min-height: fit-content"
            >
              <q-tab-panel
                name="comentarios"
                style="min-height: 500px"
                class="q-py-sm"
                v-if="!!localId"
              >
                <CommentsList
                  :id="localId"
                  :descCRM3="''"
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
                <!-- <ActivitiesComponent
                  :id="localId"
                  :idUser="userCRM.id"
                  module="Opportunities"
                ></ActivitiesComponent> -->
                <div>Activities component</div>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>