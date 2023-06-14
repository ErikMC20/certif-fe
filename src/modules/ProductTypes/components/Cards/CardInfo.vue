<script setup lang="ts">
import { ref, computed, defineAsyncComponent, onMounted } from 'vue';
import { useQuasar, QPopupProxy } from 'quasar';

import ViewCard from 'src/components/MainCard/ViewCard.vue';

import { ProductType } from '../../utils/types';
import { useProductType } from '../../composables';

//store
//import { useProductTypesStore } from '../../store/productTypes';

import { useDivAreaMercado, useDivision, useGrupoCliente, useRegionales } from 'src/composables/useLanguage';

import { PaisListModel } from 'src/components/types';

// const AdvancedFilterCampaign = defineAsyncComponent(
//   () => import('src/modules/Prospects/components/AdvancedFilterCampaign.vue')
// );

const { getListDivisiones, listDivisiones } = useDivision();
const { getRegionales, listRegionales} = useRegionales();

interface Props {
  id: string;
  data: ProductType;
}

const props = defineProps<Props>();

const $q = useQuasar();
const { userCRM, getProductType } = useProductType();

const baseCardRef = ref<InstanceType<typeof ViewCard> | null>(null);

const inputData = ref({ ...props.data });
inputData.value.iddivision_c = '04';

//const formStore = useProductTypesStore();

//* Methods
const restoreValues = () => {
  if (props.data) inputData.value = { ...props.data };
};

defineExpose({
  isEditing: computed(() => baseCardRef.value?.isEditing === 'edit'),
  exposeData: (): ProductType => ({ ...inputData.value }),
});

const listDivision = ref([]);
const listGrupoCliente = ref([]);
const listAreaMercado = ref([]);
const listRegional = ref([]);

onMounted(async () => {
  // const optionsSelectTypeProducts = await formStore.getLanguagesTypeProducts();
  // listDivision.value=optionsSelectTypeProducts.divisiones;
  // listGrupoCliente.value=optionsSelectTypeProducts.regiones;
  // listRegional.value=optionsSelectTypeProducts.grupoclientes;
  await getListDivisiones();
  listDivision.value = listDivisiones.value;
  listAreaMercado.value = await useDivAreaMercado(inputData.value.iddivision_c);
  listGrupoCliente.value = await useGrupoCliente(inputData.value.iddivision_c);
  await getRegionales();  
  const aux = await listRegionales.value.find((element:any)=>(element.cod_pais == 'BO'));
  listRegional.value = aux.regiones;
  console.log(listRegional.value);
});

</script>

<template>
  <view-card-component
    v-bind="$attrs"
    :controls="!!props.id"
    :initial-status="props.id ? 'read' : 'edit'"
    icon-name="info"
    ref="baseCardRef"
    title="Información general"
    @cancel-change="restoreValues"
    @edit-change="restoreValues"
  >
    <template #edit>
      <!-- Modo edicion -->
      <div class="row q-col-gutter-lg q-py-md">
        <q-input
          v-model="inputData.name"
          type="text"
          class="col-12"
          label="Tipo de Producto"
          outlined
          dense
        />
        <q-input
          v-model="inputData.description"
          type="text"
          class="col-12"
          label="Descripción"
          outlined
          dense
        />
        <q-select v-model="inputData.iddivision_c" :options="listDivision"
        class="col-12 col-sm-6"
        label="División" outlined 
        options-dense map-options 
        option-value="cod_div"
        option-label="label" 
        emit-value
        color="primary"  />
        <q-select v-model="inputData.idamercado_c" :options="listAreaMercado"
        class="col-12 col-sm-6"
        label="Área de Mercado" outlined 
        options-dense map-options 
        option-value="cod_amercado"
        option-label="label" 
        emit-value
        color="primary"  />
        <q-select v-model="inputData.idgrupocliente_c" :options="listGrupoCliente"
        class="col-12 col-sm-6"
        label="Grupo de Cliente" outlined 
        options-dense map-options 
        option-value="value"
        option-label="label" 
        emit-value
        color="primary"  />
        <q-select v-model="inputData.idregional_c" 
        options="listRegional"
        class="col-12 col-sm-6"
        label="Regional" outlined 
        options-dense map-options 
        option-value="cod_region"
        option-label="label" 
        emit-value
        color="primary"  />
        
        <!-- <q-select
          :options="opportunityState"
          class="col-12 col-sm-4"
          dense
          emit-value
          label="Estado"
          map-options
          option-label="label"
          option-value="value"
          outlined
          v-model="inputData.estado_oportunidad_c"
          @update:model-value="refreshEstadoOportunidad"
        /> -->

        <div class="col-12">
          <q-separator dark color="grey-4" />
        </div>
      </div>
    </template>
    <template #read>
      <!-- Modo lectura -->
      <div class="row q-col-gutter-lg q-py-md">
        <q-input
          v-model="inputData.nombre"
          type="text"
          class="col-12 col-sm-6"
          label="Nombre del tipo 2"
          outlined
          dense
          readonly
        />
        <!-- <q-select
          :options="opportunityState"
          class="col-12 col-sm-4"
          dense
          emit-value
          label="Estado"
          map-options
          option-label="label"
          option-value="value"
          outlined
          readonly
          v-model="inputData.estado_oportunidad_c"
          @update:model-value="refreshEstadoOportunidad"
        /> -->
      </div>
    </template>
      <!-- Modo lectura -->
      <div class="row q-col-gutter-lg q-py-md">
        <q-input
          v-model="inputData.name"
          type="text"
          class="col-12 col-sm-6"
          label="Nombre de la Empresa"
          outlined
          dense
          readonly
        />
        <!-- <q-select
          :options="opportunityState"
          class="col-12 col-sm-4"
          dense
          emit-value
          label="Estado"
          map-options
          option-label="label"
          option-value="value"
          outlined
          readonly
          v-model="inputData.estado_oportunidad_c"
          @update:model-value="refreshEstadoOportunidad"
        /> -->
      </div>
  </view-card-component>
</template>

<style scoped lang="scss">
// .prueba {
//   text-overflow: ellipsis;
//   overflow: hidden !important;
//   white-space: nowrap;
//   width: 100px;
//   padding-left: 0px;
//   // border: 1px solid;
//   // background-color: #92a8d1;
// }
</style>
