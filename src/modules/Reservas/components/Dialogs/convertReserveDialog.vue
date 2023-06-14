<script lang="ts">
  import { ref, toRefs, onMounted,computed } from 'vue';
  import { useQuasar } from 'quasar';
  import CardAccounts from '../Cards/CardConvertReserve/CardAccounts.vue';
  import CardCrateAccountSap from '../Cards/CardConvertReserve/CardCrateAccountSap.vue';
  import CardCrateMountReserve from '../Cards/CardConvertReserve/CardCrateMountReserve.vue';
  import CardDocuments from '../Cards/CardConvertReserve/CardDocuments.vue';
  import CardOportunities from '../Cards/CardConvertReserve/CardOportunities.vue';
  import CardSalesPhase from '../Cards/CardConvertReserve/CardSalesPhase.vue';
  import { api } from '../../../../boot/axios';
  import { Loading, QSpinnerPuff } from 'quasar';
  import { ReservasTableStore } from 'src/modules/Reservas/store/ReservasTableStore';
  import { useReservasStore } from 'src/modules/Reservas/store/ReservasStore';
  // import { CardInfo } from '../../utils/types';
  import { AccountStore } from 'src/modules/Accounts/store/AccountStore';
  import ReservasDialog from 'src/modules/Reservas/components/Dialogs/ReservasDialog.vue';
  import { userStore } from 'src/modules/Users/store/UserStore';
  import AccountDialog from 'src/modules/Accounts/components/Dialogs/AccountDialog.vue';
  import GeneralDialog from 'src/modules/Quotes/components/Dialogs/GeneralDialog.vue';
  import OpportunityDialog from 'src/modules/Opportunities/components/Dialogs/OpportunityDialog.vue';
</script>
<script lang="ts" setup>

  //* Emit functions
  const emits = defineEmits < { (event: 'formSaved'): void }> ();

  //* Props
  const props = withDefaults(
    defineProps < {
      idModule?: string;
      module?: string;
      data?: any;
    } > (),
    {
      idModule: '',
    }
  );

  //* Store values
  const tableStore = ReservasTableStore();
  const reserveStore = useReservasStore();
  const AccountsStore = AccountStore();
  const user = userStore();

  //* InstanceType
  const accountDialogRef = ref<InstanceType<typeof AccountDialog> | null>(null);
  const quotesDialogRef = ref<InstanceType<typeof GeneralDialog> | null>(null);
  const OpDialogRef = ref<InstanceType<typeof OpportunityDialog> | null>(null);
  const reserveDialogRef = ref<InstanceType<typeof ReservasDialog> | null>(null);
  const baseCardAccount = ref < InstanceType < typeof CardAccounts > | null > (null);
  const infoCardRefOp = ref < InstanceType < typeof CardOportunities > | null > (null);
  const infoCardRefCreateSAP = ref < InstanceType < typeof CardCrateAccountSap > | null > (null);
  const baseCardMountReserve = ref < InstanceType < typeof CardCrateMountReserve > | null > (null);
  
  //* Variables
  const $q = useQuasar();
  const { idModule } = toRefs(props);
  const listTipo = ref({});
  const open = ref(false);

  //* Values Default
  const dataReg = ref({
    name: '',
    idamercado_c: '',
    sales_stage: ''
  });

  const data1 = ref({
    name: '',
    idamercado_c: '',
    sales_stage: '',
    idcuentasap_c:'',
    nit_ci_c:'',
  });

  const defaultValues = {
    attributes: {
      created_by: '1',
      name: 'VW - Reserva 1 conversion',
      description: 'Grupo Volskwagen en general - Mensaje de Prueba CRM4',
      iddivision_c: '03',
      idamercado_c: '03_01',
      idgrupocliente_c: '03_32',
      reser_stage_c: '',
      region_c: '02_02',
      assigned_user_id: '1',
      fecha_venc_c: '2023-03-11',
      hanq_reservas_accountsaccounts_ida:'',
      hanq_reservas_aos_quotesaos_quotes_idb: '',
      hanq_reservas_opportunitiesopportunities_ida: '',
      hanq_reservas_contactscontacts_ida:''
    }
  }

  const dataMountReserve = {
    attributes: {
      created_by: '1',
      name: 'prueba',
      description: 'prueba',
      assigned_user_id:'',
      SecurityGroups: '',
      monto: '',
      currency_id: '-99',
      tipo: '01_Vehiculo',
      hanq_monto_reserva_hanq_reservashanq_reservas_ida: ''
    }
  }

  const dataRegOp = 
  {
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
      }
  };

  //* OnMounted o useAsyncState
  onMounted(async () => {
    listTipo.value = await tableStore.getTipoPhaseOpportunities();
    const response = await reserveStore.getReservasOpportunities(props.data.attributes?.opportunity_id || '');
    if (response  && response.data)
    dataReg.value = response.data.attributes;
  });

  //* methods
  const validateCards = async () => {
    const validCards: (boolean | undefined)[] = [];
    if (baseCardMountReserve.value?.isEditingMountReserve) {
      const infoCardValidation = await baseCardMountReserve.value.validateInputs();
      validCards.push(infoCardValidation);
    }
    return validCards.every((card) => !!card);
  };

  const saveReserve = async () => {
    const areCardsValid = await validateCards();
    if (!areCardsValid) {
      $q.notify({
        type: 'warning',
        message: 'Error de validación',
        caption: 'Algunos campos necesitan ser llenados',
        position:'bottom-left'
      });
      return;
    }
    const cardInfoData = infoCardRefCreateSAP.value?.exposeData();
    //console.log(cardInfoMountReserve);
    defaultValues.attributes.name = cardInfoData?.name || '';
    defaultValues.attributes.created_by = user.userCRM.id;
    defaultValues.attributes.assigned_user_id = cardInfoData?.asignado || '';
    defaultValues.attributes.iddivision_c = cardInfoData?.iddivision_c || '';
    defaultValues.attributes.idamercado_c = cardInfoData?.idamercado_c || '';
    defaultValues.attributes.idgrupocliente_c = cardInfoData?.idgrupocliente_c || '';
    defaultValues.attributes.region_c = cardInfoData?.region_c || '';
    //defaultValues.attributes.assigned_user_id = cardInfoData.assigned_user_id;
    defaultValues.attributes.hanq_reservas_accountsaccounts_ida= props.data.attributes.billing_account_id,
    defaultValues.attributes.hanq_reservas_aos_quotesaos_quotes_idb= props.data.id,
    defaultValues.attributes.hanq_reservas_opportunitiesopportunities_ida= props.data.attributes.opportunity_id,
    defaultValues.attributes.hanq_reservas_contactscontacts_ida=props.data.attributes.billing_contact_id
    try {
      $q.loading.show({
        spinner: QSpinnerPuff,
        message: 'Convirtiendo Reserva',
      });
      const response = await api.post(
        `${process.env.CRM4_LB_02}/convert-reserve`,
        defaultValues
      );
      saveMountReserve(response.data.data.id);
      await reserveDialogRef.value?.openDialogReserveTab(response.data.data.id);
      // open.value=false;
      // await reserveDialogRef.value?.openDialogAccountTab('9fc58fcc-188e-40f6-6867-640b8842ddd5');
      
    } catch (error) {
    } finally {
      $q.loading.hide();
      emits('formSaved');
    }
  };
  
  const saveMountReserve = async (id:string) => {
    const cardInfoMountReserve = baseCardMountReserve.value?.exposeData();
    dataMountReserve.attributes.created_by = user.userCRM.id;
    dataMountReserve.attributes.assigned_user_id = user.userCRM.id;
    dataMountReserve.attributes.monto = cardInfoMountReserve?.monto || '';
    dataMountReserve.attributes.currency_id = cardInfoMountReserve?.moneda || '';
    dataMountReserve.attributes.tipo = cardInfoMountReserve?.tipo || '';
    dataMountReserve.attributes.hanq_monto_reserva_hanq_reservashanq_reservas_ida = id;
    const response = await api.post(
        `${process.env.CRM4_LB_02}/create-monto-reserve`,
        dataMountReserve
      );
  };

  const info = async () => {
    Loading.show({
          spinner: QSpinnerPuff ,
          message: 'Verificando datos',
    })
    listTipo.value = await tableStore.getTipoPhaseOpportunities();
    const response = await reserveStore.getReservasOpportunities(props.data.attributes.opportunity_id);
    dataReg.value = response.data.attributes;
    const response1= await AccountsStore.getAccountsGet(props.data.attributes.billing_account_id);
    data1.value = response1.info_account.detail_account;
    Loading.hide();
  };

  const cancelTask = () => {
    console.log('Cancel...');
  };

  const verificar = async () => {
    Loading.show({
          spinner: QSpinnerPuff ,
          message: 'Verificando datos',
    })
    const cardInfoDataOp = infoCardRefOp.value?.exposeData();
    dataRegOp.id=props.data.attributes.opportunity_id;
    dataRegOp.attributes.name=cardInfoDataOp?.name || '';
    dataRegOp.attributes.modified_user_id=user.userCRM.id || '';
    dataRegOp.attributes.idamercado_c=cardInfoDataOp?.idamercado_c || '';
    dataRegOp.attributes.amount_usdollar=cardInfoDataOp?.amount_usdollar || 0;
    dataRegOp.attributes.idgrupocliente_c=cardInfoDataOp?.idgrupocliente_c || '';
    dataRegOp.attributes.currency_id=cardInfoDataOp?.currency_id || '';
    dataRegOp.attributes.estado_oportunidad_c=cardInfoDataOp?.estado_oportunidad_c || '';
    dataRegOp.attributes.region_c=cardInfoDataOp?.region_c || '';
    dataRegOp.attributes.opportunity_type=cardInfoDataOp?.opportunity_type || '';
    dataRegOp.attributes.sales_stage=cardInfoDataOp?.sales_stage || '';
    const response1 = await api.patch(
      `${process.env.CRM4_LB_GLOBAL}/module-update`,
      dataRegOp
    );

    listTipo.value = await tableStore.getTipoPhaseOpportunities();
    const response = await reserveStore.getReservasOpportunities(props.data.attributes.opportunity_id);
    dataReg.value = response.data.attributes;
    Loading.hide();
  };

  const openDialogAccount = async (id?: string) => {
  await accountDialogRef.value?.openDialogAccountTab(id ? id : '');
  };

  const openDialogAquotes = async (id?: string) => {
  await quotesDialogRef.value?.openDialogQuotesTab(id ? id : '');
};

const openDialog = async (id?: string) => {
  await OpDialogRef.value?.openDialogAccountTab(id ? id : '');
};

const formSaved = async () => {
  await tableStore.reloadList();
};

//* Computed
const isEditing = computed(() => {
  return [infoCardRefCreateSAP.value?.isEditing,baseCardAccount.value?.isEditing, infoCardRefOp.value?.isEditing,baseCardMountReserve.value?.isEditingMountReserve].some(
    (value) => !!value
  );
});

//* define expose
  defineExpose({
    open
  });
</script>

<template>
  <dialog-component size-dialog="dialog-md" v-model="open" :footerDisabled="!isEditing" :headerDisabled="false"
    :iconDialog="''" @show="info" >
    <template #header>
      <div class="bg-primary-3 text-black ">
        <q-toolbar class="bg-primary q-pa-lg">
          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-avatar text-color="white">
                  <q-icon name="task" size="md"></q-icon>
                </q-avatar>
              </q-item-section>
              <q-item-section v-if="dataReg.sales_stage!=='03_01_Reserva'">
                <q-item-label class="text-white text-h5">Verificación y validación de datos</q-item-label>
                <q-item-label class="text-grey-4 text-caption" lines="1">Verifique los datos esenciales...
                </q-item-label>
              </q-item-section>
              <q-item-section v-else>
                <q-item-label class="text-white text-h5">Creación de cuenta SAP</q-item-label>
                <q-item-label class="text-grey-4 text-caption" lines="1">Todo listo para realizar la
                  reserva</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-space />
          <q-btn dense flat color="white" :icon="!$q.screen.xs ? 'close' : 'arrow_back_ios'" v-close-popup>
            <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-toolbar>
      </div>
    </template>
    <template #body>
      <div class="row q-pa-md q-col-gutter-sm">
        <div class="col-12 col-sm-12 q-gutter-y-sm">
          <div class="row" style="height: 75vh;"
            v-if="dataReg.sales_stage!=='03_01_Reserva' ">
            <q-card style="width: 100%">
              <q-card-section>
                <span class="text-red">La oportunidad no se encuentra en la fase de ventas de Reserva.
                 <!-- <pre> {{ props.data }}</pre> -->
                </span> 
                <br/> <br/>
                <q-list bordered dense>
      <q-item   class="q-my-sm"  >
        <!-- <q-item-section >
          <q-avatar color="primary" text-color="white">
           <q-icon name="person" @click="() => openDialogAccount(props.data.attributes.billing_account_id)" class="cursor-pointer"/>
          </q-avatar>
        </q-item-section> -->

        <q-item-section @click="() => openDialogAccount(props.data.attributes.billing_account_id)">
          <q-item-label caption>Nombre de la cuenta</q-item-label>
          <q-item-label  class="text-bold cursor-pointer flex text-primary ">{{props.data.attributes.billing_account}}</q-item-label>
        </q-item-section>

        <q-item-section @click="() => openDialog(props.data.attributes.opportunity_id )">
          <q-item-label caption>Nombre de la oportunidad</q-item-label>
          <q-item-label  class="text-bold cursor-pointer flex text-primary ">{{props.data.attributes.opportunity}}</q-item-label>
        </q-item-section>

        <q-item-section >
          <q-item-label caption>Nombre de la cotizacion</q-item-label>
          <q-item-label @click="() => openDialogAquotes (props.data.id)" class="text-bold cursor-pointer flex text-primary ">{{props.data.attributes.name}}</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />
               </q-list>               
                <!-- {{ props.data.attributes.opportunity_id }} -->
               <!-- {{ props.data.attributes.billing_account_id }} 
                {{ props.data.attributes.billing_account_id }} -->
              </q-card-section>
              <!-- <pre>{{ dataReg }}</pre> -->
              <CardOportunities :id="props.data.attributes.opportunity_id"  class="col-12" ref="infoCardRefOp" />
              <CardAccounts :id="props.data.attributes.billing_account_id"  class="col-12" ref="baseCardAccount" />
             
              <CardSalesPhase :id="props.data.id"  class="col-12" ref="infoCardRef" />
              <CardDocuments :id="props.data.attributes.opportunity_id"  class="col-12" ref="infoCardRef" />
            </q-card>
          </div>
          <div class="row" style="height: 75vh;" v-else>
            <q-card style="width: 100%" >
              <q-card-section class="bg-blue-3">
                <q-list>
                  <q-item >
                    <q-item-section>
                      <q-item-label caption class="text-white">Nombre de la cuenta</q-item-label>
                      <q-item-label  lines="1">{{ data1.name }}</q-item-label>
                    
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption class="text-white">CI/NIT</q-item-label>
                      <q-item-label  lines="1">{{ data1.nit_ci_c }}</q-item-label>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label caption class="text-white">Codigo AIO</q-item-label>
                      <q-item-label  lines="1">{{ data1.idcuentasap_c ||'Sin Codigo' }}</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-icon name="check_circle" size="lg" color="white" />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
              <!-- <pre>{{ dataReg }}</pre> -->
              <CardCrateAccountSap :id="props.data.attributes?.opportunity_id || ''"  class="col-12" ref="infoCardRefCreateSAP" />
              <CardCrateMountReserve :id="props.data.id"  class="col-12" ref="baseCardMountReserve" />
            </q-card>
          </div>
        </div>
      </div>
      <ReservasDialog ref="reserveDialogRef" @form-save="formSaved" @close="open=false" />
      <AccountDialog ref="accountDialogRef"  @form-save="formSaved"/>
      <GeneralDialog ref="quotesDialogRef" @form-save="formSaved"/>
      <OpportunityDialog ref="OpDialogRef" @form-save="formSaved"/>
    </template>
    <template #footer v-if="isEditing">
      <q-btn color="primary" class="q-mr-md" @click="verificar" v-if="dataReg.sales_stage!=='03_01_Reserva'">Verificar</q-btn>
      <q-btn color="primary" class="q-mr-md" @click="saveReserve" v-else>Convertir a reserva</q-btn>
      <q-btn color="negative" v-close-popup @click="cancelTask">Cancelar</q-btn>
    </template>
  </dialog-component>
</template>
<style lang="scss" scoped>
</style>