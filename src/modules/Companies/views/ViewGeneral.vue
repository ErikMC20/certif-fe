<script lang="ts">
// vue-quasar-libraries
import { Loading, QInput } from 'quasar';
import { computed, ref } from 'vue';

// global-components

import { useCompaniesStore } from '../store/companyStore';
//import CommentsList from 'src/components/Comments/CommentsList.vue';
import ViewGeneralSkeleton from 'src/components/Skeletons/ViewGeneralSkeleton.vue';
// import ActivitiesComponent from 'src/components/Activities/ActivitiesComponent.vue';

// module-components
import CardDocuments from '../components/Cards/CardDocuments.vue';
import CardInfo from '../components/Cards/CardInfo.vue';
import CardContact from '../components/Cards/CardContact.vue';



// module-files
import { useAsyncState } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { Company } from '../utils/types';
</script>
<script lang="ts" setup>
const props = defineProps<{
  id?: string;
}>();



const companyStore = useCompaniesStore();
const { cardInfo, cardContact} = storeToRefs(companyStore)


const tab = ref(props.id ? 'Activities' : 'comentarios');
const localId = ref(props.id ?? '')
const commentCreate = ref('');


const cardInfoRef = ref<InstanceType<typeof CardInfo> | null>(null);
const cardContactRef = ref<InstanceType<typeof CardContact> | null>(null);
const cardDocumentsRef = ref<InstanceType<typeof CardDocuments> | null>(null);
const commentRef = ref<InstanceType<typeof QInput> | null>(null);

const isSomeCardEditing = computed(() => {
  return [
    // infoCardRef.value?.isEditing,
    // leadRelationsRef.value?.isEditing
    cardContactRef.value?.isEditing,
    cardInfoRef.value?.isEditing,
  ].some((value) => !!value);
});

//se dispara cuando carga el componente
const { isLoading, execute } = useAsyncState(async () => {
  if (!!localId.value) {
    return  await companyStore.onGetCompany(localId.value);
  }
}, {});

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

  // Verificar si existe un id por localId
  if (!!localId.value) {
    // actualizar datos si existe localId
    const cardInfoData = cardInfoRef.value?.exposeData();
    const cardContactData = cardContactRef.value?.exposeData();

    if (!!cardInfoData || !!cardContactData) {
      try {
        const body: Company = {
          ...cardInfoData,
          ...cardContactData
        };
        await companyStore.onUpdateCompany(localId.value, body);
        emits('submitComplete', localId.value);
        await execute();
      } catch (error) {
        console.log(error);
      }
    }
  } 
  else {
    const cardInfoData = cardInfoRef.value?.exposeData();
    const cardContactData = cardContactRef.value?.exposeData();

    if (!!cardInfoData || !!cardContactData) {
      try {
        Loading.show({
          message: 'Guardando Información',
        });
        const newCompany = await companyStore.onCreateCompany({...cardInfoData, ...cardContactData}, []);
        localId.value = newCompany.id;
        emits('submitComplete', localId.value);
        await execute();
      } catch (error) {
        console.log(error);
      }
    }
  }
};

// Funciones que se podran usar al declarar una referencia de este componente
defineExpose({
  onSubmit,
  isSomeCardEditing
});

const emits = defineEmits<{
  (event: 'submitComplete', values: string): void;
  (event: 'pruebaRefrescar'): void;
  (event: 'submitFail', values: string, options?: object): void;
}>();

</script>
<template>
  <ViewGeneralSkeleton v-if="isLoading" />
  <div v-else class="row q-col-gutter-lg">
    <div class="col-xs-12 col-sm-12 col-md-6">
      <div class="row q-gutter-y-md">
        <CardInfo
          :data="cardInfo"
          :id="localId"
          class="col-12"
          ref="cardInfoRef"
        />
        <CardContact
          :data="cardContact"
          :id="localId"
          class="col-12"
          ref="cardContactRef"
        />
      </div>
    </div>
    <div class="col-xs-12 col-sm-12 col-md-6">
      <!-- <AssignedSingleUser2
        ref="assignedSingleUserRef"
        :module="'HANCE_Empresa'"
        :module-id="localId"
        :withList="false"
        @changeUser="onChangeUserAssigned"
      /> -->

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
