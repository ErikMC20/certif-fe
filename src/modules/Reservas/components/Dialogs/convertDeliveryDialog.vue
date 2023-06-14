<script lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import CardArticles from 'src/modules/Reservas/components/Cards/CardArticles.vue';
import CardOportunities from '../Cards/CardConvertReserve/CardOportunities.vue';
import { api } from '../../../../boot/axios';
import { Loading, QSpinnerPuff } from 'quasar';
import { ReservasTableStore } from 'src/modules/Reservas/store/ReservasTableStore';
import { useReservasStore } from 'src/modules/Reservas/store/ReservasStore';
import DeliveriesDialog from 'src/modules/Deliveries/components/Dialogs/DeliveriesDialog.vue';
import { userStore } from 'src/modules/Users/store/UserStore';
import CardCreateDelivery from '../Cards/CardValidationDelivery/CardCreateDelivery.vue';
</script>
<script lang="ts" setup>
//* Emit functions
const emits = defineEmits<{ (event: 'cerrarDialog'): void }>();

//* Props
const props = withDefaults(
  defineProps<{
    idModule?: string;
    module?: string;
    data?: any;
  }>(),
  {
    idModule: '',
  }
);

//* Store values
const tableStore = ReservasTableStore();
const reserveStore = useReservasStore();
const user = userStore();

//* InstanceType
const infoCardRefOp = ref<InstanceType<typeof CardOportunities> | null>(null);
const deliveryDialogRef = ref<InstanceType<typeof DeliveriesDialog> | null>(null);
const baseArticles = ref<InstanceType<typeof CardArticles> | null>(null);
const baseCardDelivery = ref<InstanceType<typeof CardCreateDelivery> | null>(null);

//* Variables
const $q = useQuasar();
const listTipo = ref({});
const open = ref(false);

//* Values Default
const dataBaseInstalada = {
  attributes: {
    created_by: '1',
    hane_entregas_hanb_basehane_entregas_ida: '',
    modelo: 'Ejemplo de base instalada',
    nro_serie: '1234564789',
    anho_fabricacion: '2021',
    color_c: 'rojo',
    hanb_base_accountsaccounts_ida:'',
    iddivision_c:'',
    idamercado_c:'',
    idgrupocliente_c:''
  },
};

const defaultValues = {
  attributes: {
    created_by: '1',
    name: 'ejemplo de entrega',
    description: 'ejemplo de entrega',
    estado_c: '02',
    hane_entregas_accountsaccounts_ida: '',
    hane_entregas_contactscontacts_ida:'',
    hane_entregas_hanq_reservashanq_reservas_ida: '',
    iddivision_c: '03',
    idamercado_c: '03_01',
    regional_c: '03_01',
    grupo_cliente_c: '03_32',
    assigned_user_id: '1',
    lugar_entrega_c: '',
    fecha_entrega_c: '',
  },
};

const dataReg = ref({
  name: '',
  idamercado_c: '',
  sales_stage: '',
});

const dataRegOp = {
  type: 'Opportunities',
  id: '2078e0d1-f3f7-3eb5-3894-63ecd2a9ae89',
  attributes: {
    modified_user_id: '1',
    name: 'modifi cotizaion',
    idamercado_c: '',
    amount_usdollar: 0,
    idgrupocliente_c: '',
    currency_id: '',
    estado_oportunidad_c: '',
    region_c: '',
    opportunity_type: '',
    sales_stage: '',
  },
};

//* OnMounted o useAsyncState
onMounted(async () => {
  try {
    listTipo.value = await tableStore.getTipoPhaseOpportunities();
    const response = await reserveStore.getReservasOpportunities(
      props.data.hanq_reservas_opportunitiesopportunities_ida
    );
    dataReg.value = response.data.attributes;
  } catch (error) {
    console.log(error);
  }
});

//* methods
const saveDelivery = async () => {
  const cardInfoDataOp = infoCardRefOp.value?.exposeData();
  const cardInfoDataDelivery = baseCardDelivery.value?.exposeData();
  defaultValues.attributes.created_by = user.userCRM.id;
  defaultValues.attributes.assigned_user_id = props.data.assigned_user_id;
  defaultValues.attributes.name = cardInfoDataOp?.name || '';
  defaultValues.attributes.iddivision_c = props.data.iddivision_c || '';
  defaultValues.attributes.idamercado_c = cardInfoDataOp?.idamercado_c || '';
  defaultValues.attributes.grupo_cliente_c = cardInfoDataOp?.idgrupocliente_c || '';
  defaultValues.attributes.regional_c = cardInfoDataOp?.region_c || '';
  defaultValues.attributes.hane_entregas_accountsaccounts_ida = props.data.hanq_reservas_accountsaccounts_ida;
  defaultValues.attributes.hane_entregas_contactscontacts_ida = props.data.hanq_reservas_contactscontacts_ida;
  defaultValues.attributes.hane_entregas_hanq_reservashanq_reservas_ida = props.data.id;
  defaultValues.attributes.lugar_entrega_c = cardInfoDataDelivery?.lugar_entrega_c || '';
  defaultValues.attributes.fecha_entrega_c = cardInfoDataDelivery?.fecha_entrega || '';
  //cancelTask();
  try {
    $q.loading.show({
      spinner: QSpinnerPuff,
      message: 'Generando Entrega',
    });

    const response = await api.post(
      `${process.env.CRM4_LB_02}/generate-delivery`,
      defaultValues
    );
    await saveBaseInstalada(response.data.data.id);
    await deliveryDialogRef.value?.openDialogDeliveryTab(response.data.data.id);
  } catch (error) {
  } finally {
    $q.loading.hide();
  }
};

const saveBaseInstalada = async (id: string) => {
  const cardInfoDataOp = infoCardRefOp.value?.exposeData();
  const res = baseArticles.value?.exposeData();
  const result = res?.value.data;
  for (let index = 0; index < result.length; index++) {
    dataBaseInstalada.attributes.created_by = user.userCRM.id;
    dataBaseInstalada.attributes.modelo = result[index].name;
    dataBaseInstalada.attributes.nro_serie = result[index].chasis_c;
    dataBaseInstalada.attributes.anho_fabricacion = result[index].gestion;
    dataBaseInstalada.attributes.color_c = result[index].nombre_color_c;
    dataBaseInstalada.attributes.iddivision_c = props.data.iddivision_c || '';
    dataBaseInstalada.attributes.idamercado_c = cardInfoDataOp?.idamercado_c || '';
    dataBaseInstalada.attributes.idgrupocliente_c =cardInfoDataOp?.idgrupocliente_c || '';
    dataBaseInstalada.attributes.hane_entregas_hanb_basehane_entregas_ida = id;
    dataBaseInstalada.attributes.hanb_base_accountsaccounts_ida = props.data.hanq_reservas_accountsaccounts_ida;
    
    const response = await api.post(
      `${process.env.CRM4_LB_02}/create-base-instalada`,
      dataBaseInstalada
    );
  }
};

const info = async () => {
  Loading.show({
    spinner: QSpinnerPuff,
    message: 'Verificando datos',
  });
  listTipo.value = await tableStore.getTipoPhaseOpportunities();
  const response = await reserveStore.getReservasOpportunities(
    props.data.hanq_reservas_opportunitiesopportunities_ida
  );
  dataReg.value = response.data.attributes;
  Loading.hide();
};

const cancelTask = () => {
  emits('cerrarDialog');
};

// const verificar = async () => {
//   Loading.show({
//         spinner: QSpinnerPuff ,
//         message: 'Verificando datos',
//   })
//   listTipo.value = await tableStore.getTipoPhaseOpportunities();
//   const response = await reserveStore.getReservasOpportunities(props.data.hanq_reservas_opportunitiesopportunities_ida);
//   dataReg.value = response.data.attributes;
//   Loading.hide();
// };

const verificar = async () => {
  Loading.show({
    spinner: QSpinnerPuff,
    message: 'Verificando datos',
  });
  const cardInfoDataOp = infoCardRefOp.value?.exposeData();
  dataRegOp.id = props.data.hanq_reservas_opportunitiesopportunities_ida;
  dataRegOp.attributes.name = cardInfoDataOp?.name || '';
  dataRegOp.attributes.modified_user_id = user.userCRM.id || '';
  dataRegOp.attributes.idamercado_c = cardInfoDataOp?.idamercado_c || '';
  dataRegOp.attributes.amount_usdollar = cardInfoDataOp?.amount_usdollar || 0;
  dataRegOp.attributes.idgrupocliente_c = cardInfoDataOp?.idgrupocliente_c || '';
  dataRegOp.attributes.currency_id = cardInfoDataOp?.currency_id || '';
  dataRegOp.attributes.estado_oportunidad_c = cardInfoDataOp?.estado_oportunidad_c || '';
  dataRegOp.attributes.region_c = cardInfoDataOp?.region_c || '';
  dataRegOp.attributes.opportunity_type = cardInfoDataOp?.opportunity_type || '';
  dataRegOp.attributes.sales_stage = cardInfoDataOp?.sales_stage || '';
  const response1 = await api.patch(
    `${process.env.CRM4_LB_GLOBAL}/module-update`,
    dataRegOp
  );

  listTipo.value = await tableStore.getTipoPhaseOpportunities();
  const response = await reserveStore.getReservasOpportunities(
    props.data.hanq_reservas_opportunitiesopportunities_ida
  );
  dataReg.value = response.data.attributes;
  Loading.hide();
};

const formSaved = async () => {
  await tableStore.reloadList();
};

//* computed variables
const isEditing = computed(() => {
  return [
    baseCardDelivery.value?.isEditingInfoDelivery,
    infoCardRefOp.value?.isEditing,
  ].some((value) => !!value);
});

//* defineExpose
defineExpose({
  open,
});
</script>

<template>
  <dialog-component
    size-dialog="dialog-md"
    v-model="open"
    :footerDisabled="!isEditing"
    :headerDisabled="false"
    :iconDialog="''"
    :persistent="false"
    @show="info"
    ref="generateDialog"
  >
    <template #header>
      <div class="bg-primary-3 text-black">
        <q-toolbar class="bg-primary q-pa-lg">
          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-avatar text-color="white">
                  <q-icon name="task" size="md"></q-icon>
                </q-avatar>
              </q-item-section>
              <q-item-section v-if="dataReg.sales_stage !== '03_01_Cierre'">
                <q-item-label class="text-white text-h5"
                  >Verificación para generar entrega</q-item-label
                >
                <q-item-label class="text-grey-4 text-caption" lines="1"
                  >Revise los datos
                </q-item-label>
              </q-item-section>
              <q-item-section v-else>
                <q-item-label class="text-white text-h5">Todo correcto!!!</q-item-label>
                <q-item-label class="text-grey-4 text-caption" lines="1"
                  >Todo listo para realizar la entrega</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-list>
          <q-space />
          <q-btn
            dense
            flat
            color="white"
            :icon="!$q.screen.xs ? 'close' : 'arrow_back_ios'"
            v-close-popup
          >
            <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-toolbar>
      </div>
    </template>
    <template #body>
      <div class="row q-pa-md q-col-gutter-sm">
        <div class="col-12 col-sm-12 q-gutter-y-sm">
          <div
            class="row"
            style="height: 75vh"
            v-if="dataReg.sales_stage !== '03_01_Cierre'"
          >
            <q-card style="width: 100%">
              <q-card-section v-if="dataReg.sales_stage !== '03_01_Cierre'">
                <span class="text-red"
                  >La oportunidad no se encuentra en la fase de cierre.
                </span>
                <!-- <pre>{{ props.data.assigned_user_id }}</pre>         -->
              </q-card-section>
              <CardOportunities
                :id="props.data.hanq_reservas_opportunitiesopportunities_ida"
                class="col-12"
                ref="infoCardRefOp"
              />
              <CardArticles
                :id="props.data.hanq_reservas_aos_quotesaos_quotes_idb"
                class="col-12"
                ref="baseArticles"
              />
            </q-card>
          </div>
          <div class="row" style="height: 75vh" v-else>
            <q-card style="width: 100%">
              <CardCreateDelivery
                :id="props.data.id"
                class="col-12"
                ref="baseCardDelivery"
              />
              <CardOportunities
                :id="props.data.hanq_reservas_opportunitiesopportunities_ida"
                class="col-12"
                ref="infoCardRefOp"
              />
              <CardArticles
                :id="props.data.hanq_reservas_aos_quotesaos_quotes_idb"
                class="col-12"
                ref="baseArticles"
              />
            </q-card>
          </div>
        </div>
      </div>
      <DeliveriesDialog
        ref="deliveryDialogRef"
        @form-save="formSaved"
        @close="open = false"
      />
    </template>
    <template #footer v-if="isEditing">
      <q-btn
        color="primary"
        class="q-mr-md"
        @click="verificar"
        v-if="dataReg.sales_stage !== '03_01_Cierre'"
        >Verificar y guardar</q-btn
      >
      <q-btn color="primary" class="q-mr-md" @click="saveDelivery" v-else
        >Generar a entrega</q-btn
      >
      <q-btn color="negative" v-close-popup @click="cancelTask">Cancelar</q-btn>
    </template>
  </dialog-component>
</template>
<style lang="scss" scoped></style>
