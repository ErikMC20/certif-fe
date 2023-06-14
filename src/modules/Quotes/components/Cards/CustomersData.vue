<script lang="ts" setup>
import { ref, onMounted, onBeforeMount, watch } from 'vue';
import { CardInfoLead, getOpportunityType } from '../../utils/types';
import { QInput } from 'quasar';
import { userStore } from 'src/modules/Users/store/UserStore';
import { QuotationTableStore } from '../../../Quotation_model/store/QuotationTableStore';
import RelacionadoOpo from 'src/components/Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoOpo.vue';
import RelacionadoAco from 'src/components/Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoAco.vue';
import RelacionadoCon from 'src/components/Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoCon.vue';
import RelacionadoPro from 'src/components/Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoPro.vue';
import RelacionadoLed from 'src/components/Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoLed.vue';
import DirectionCard from 'src/components/MainCard/DirectionCard.vue';
import { useFormOptionsStore } from 'src/stores/formOptionsStore';
import { useActivityStore } from 'src/stores/ActivityStore';
import { useQuotesStore } from '../../store/QuotesStore';
import { useQuotesComposable } from '../../composables';

const props = withDefaults(
  defineProps<{
    id?: string;
    data?: CardInfoLead;
    readMode?: boolean;
    opportunityChange?: any;
    dataCustomDataOpp?: any;
    editFalse?: boolean;
    dataDupli2?: any;
    ModuleSubPanelInfo?: any;
  }>(),
  {
    readMode: false,
    dataDupli2: '',
  }
);

const edit = ref(false);
const bloqueado = ref(true);
const listDivision = ref();
const tableStore = QuotationTableStore();
const serviceStore = useQuotesStore();
const loggedUserStore = userStore();
const advancedFilterOpo = ref<InstanceType<typeof RelacionadoOpo> | null>(null);
const languageStore = useFormOptionsStore();
const activityStore = useActivityStore();
const getOpportuniti = ref();
const accountContactOpportunitie = ref();

const editcargar = ref(false);

const isProspectConverted = ref(false);
const isEditing = ref(props.readMode);
const quotesEdit = ref();
const advancedFilterCon = ref<InstanceType<typeof RelacionadoCon> | null>(null);
const advancedFilterAco = ref<InstanceType<typeof RelacionadoAco> | null>(null);
const advancedFilterPro = ref<InstanceType<typeof RelacionadoPro> | null>(null);
const advancedFilterLed = ref<InstanceType<typeof RelacionadoLed> | null>(null);
const directionProspectCardRef = ref<InstanceType<typeof DirectionCard> | null>(
  null
);
const composableQuotes = useQuotesComposable();

const getAccount = ref();
const dataaddress = ref({
  address_street_generated_c: '',
  latitude: 0,
  longitude: 0,
});
const addressCRM3 = ref('');
const idAccount = ref('');

const addressStreet = ref({
  billing_address_street: '',
  shipping_address_street: '',
});

const data = ref({
  name_account: '',
  id_account: '',
  name_contact: '',
  id_contact: '',
  name_prospect: '',
  id_prospect: '',
  name_lead: '',
  id_lead: '',
  // id_amercado: loggedUserStore.userCRM.idamercado,
});

const dataread = ref({
  name_account: '',
  id_account: '',
  name_contact: '',
  id_contact: '',
  name_prospect: '',
  id_prospect: '',
  name_lead: '',
  id_lead: '',
  // id_amercado: loggedUserStore.userCRM.idamercado,
});

const getopportunity = async (datainformation: getOpportunityType | any) => {
  if (!props.id && !!datainformation.isCardInfoEdited) {
    getOpportuniti.value = await serviceStore.getModuleTypeIDPro(
      'Opportunities',
      datainformation.idOpportunity
    );
    data.value.name_contact =
      getOpportuniti.value.attributes.contacto_oportunidad_c;
    data.value.id_contact = getOpportuniti.value.attributes.contact_id2_c;
    data.value.name_account = getOpportuniti.value.attributes.account_name;
    data.value.id_account = getOpportuniti.value.attributes.account_id;

    getAccount.value = await serviceStore.getModuleTypeIDPro(
      'Accounts',
      getOpportuniti.value.attributes.account_id
    );

    dataaddress.value = {
      address_street_generated_c:
        getAccount.value.attributes.address_street_generated_c,
      latitude: getAccount.value.attributes.jjwg_maps_lat_c,
      longitude: getAccount.value.attributes.jjwg_maps_lng_c,
    };

    addressCRM3.value = getAccount.value.attributes.billing_address_street;
    idAccount.value = getAccount.value.id;

    directionProspectCardRef.value?.constructorComp(
      dataaddress.value,
      idAccount.value
    );
  }
};

onMounted(async () => {
  listDivision.value = await tableStore.getDivisionLead();
  if (props.id != '') {
    editcargar.value = true;
    quotesEdit.value = await activityStore.getModuleTypeIDPro(
      'Quotes',
      String(props.id)
    );
    dataaddress.value = {
      address_street_generated_c:
        quotesEdit.value.attributes.address_street_generated_c,
      latitude: quotesEdit.value.attributes.mostrar_codigos_c,
      longitude: quotesEdit.value.attributes.mostrar_codigos_c,
    };

    addressCRM3.value = quotesEdit.value.attributes.billing_address_street;
    idAccount.value = quotesEdit.value.attributes.billing_account_id;

    directionProspectCardRef.value?.constructorComp(
      dataaddress.value,
      props.id
    );

    dataread.value = {
      name_account: quotesEdit.value.attributes.billing_account,
      id_account: quotesEdit.value.attributes.billing_account_id,
      name_contact: quotesEdit.value.attributes.billing_contact,
      id_contact: quotesEdit.value.attributes.billing_contact_id,
      name_prospect: quotesEdit.value.attributes.leads_aos_quotes_1_name,
      id_prospect: quotesEdit.value.attributes.leads_aos_quotes_1leads_ida,
      name_lead: quotesEdit.value.attributes.hano_lead_aos_quotes_name,
      id_lead: quotesEdit.value.attributes.hano_lead_aos_quoteshano_lead_ida,
    };
    editcargar.value = false;
  } else {
    isEditing.value = true;
    if (!!props.dataCustomDataOpp) {
      data.value = {
        name_account: props.dataCustomDataOpp.account_nameOppty,
        id_account: props.dataCustomDataOpp.account_idOppty,
        name_contact: props.dataCustomDataOpp.contacto_oportunidad_cOppty,
        id_contact: props.dataCustomDataOpp.contact_id2_cOppty,
        name_prospect: '',
        id_prospect: '',
        name_lead: '',
        id_lead: '',
      };
      await SearchAccount(props.dataCustomDataOpp.account_idOppty);
    }

    if (!!props.ModuleSubPanelInfo) {
      data.value = {
        name_account: props.ModuleSubPanelInfo.accountName,
        id_account: props.ModuleSubPanelInfo.accountId,
        name_contact: props.ModuleSubPanelInfo.contactName,
        id_contact: props.ModuleSubPanelInfo.contactId,
        name_prospect: props.ModuleSubPanelInfo.prospectname,
        id_prospect: props.ModuleSubPanelInfo.prospectid,
        name_lead: props.ModuleSubPanelInfo.leadname,
        id_lead: props.ModuleSubPanelInfo.leadid,
      };

      await SearchAccount(props.ModuleSubPanelInfo.accountId);
    }

    if (!props.dataCustomDataOpp && !props.ModuleSubPanelInfo) {
      data.value = {
        name_account: '',
        id_account: '',
        name_contact: '',
        id_contact: '',
        name_prospect: '',
        id_prospect: '',
        name_lead: '',
        id_lead: '',
      };
    }
  }
  if (props.dataDupli2 != '') {
    isEditing.value = true;
    data.value = {
      name_account: props.dataDupli2.billing_account,
      id_account: props.dataDupli2.billing_account_id,
      name_contact: props.dataDupli2.billing_contact,
      id_contact: props.dataDupli2.billing_contact_id,
      name_prospect: props.dataDupli2.leads_aos_quotes_1_name,
      id_prospect: props.dataDupli2.leads_aos_quotes_1leads_ida,
      name_lead: props.dataDupli2.hano_lead_aos_quotes_name,
      id_lead: props.dataDupli2.hano_lead_aos_quoteshano_lead_ida,
    };
    dataaddress.value = {
      address_street_generated_c: props.dataDupli2.address_street_generated_c,
      latitude: props.dataDupli2.jjwg_maps_lat_c,
      longitude: props.dataDupli2.jjwg_maps_lng_c,
    };

    addressCRM3.value = props.dataDupli2.billing_address_street;
    idAccount.value = props.dataDupli2.billing_account_id;

    // directionProspectCardRef.value?.constructorComp(
    //   dataaddress.value,
    //   props.dataDupli2.billing_account_id
    // );
  }
});

const SearchAccount = async (idaccount: string) => {
  getAccount.value = await serviceStore.getModuleTypeIDPro(
    'Accounts',
    idaccount
  );

  dataaddress.value = {
    address_street_generated_c:
      getAccount.value.attributes.address_street_generated_c,
    latitude: getAccount.value.attributes.jjwg_maps_lat_c,
    longitude: getAccount.value.attributes.jjwg_maps_lng_c,
  };

  addressCRM3.value = getAccount.value.attributes.billing_address_street;
  idAccount.value = getAccount.value.id;

  directionProspectCardRef.value?.constructorComp(
    dataaddress.value,
    idAccount.value
  );
};

watch(
  () => props.id,
  async () => {
    if (props.id != '') {
      editcargar.value = true;
      isEditing.value = false;
      quotesEdit.value = await activityStore.getModuleTypeIDPro(
        'Quotes',
        String(props.id)
      );
      dataaddress.value = {
        address_street_generated_c:
          quotesEdit.value.attributes.address_street_generated_c,
        latitude: quotesEdit.value.attributes.mostrar_codigos_c,
        longitude: quotesEdit.value.attributes.mostrar_codigos_c,
      };

      addressCRM3.value = quotesEdit.value.attributes.billing_address_street;
      idAccount.value = quotesEdit.value.attributes.billing_account_id;

      directionProspectCardRef.value?.constructorComp(
        dataaddress.value,
        props.id
      );

      dataread.value = {
        name_account: quotesEdit.value.attributes.billing_account,
        id_account: quotesEdit.value.attributes.billing_account_id,
        name_contact: quotesEdit.value.attributes.billing_contact,
        id_contact: quotesEdit.value.attributes.billing_contact_id,
        name_prospect: quotesEdit.value.attributes.leads_aos_quotes_1_name,
        id_prospect: quotesEdit.value.attributes.leads_aos_quotes_1leads_ida,
        name_lead: quotesEdit.value.attributes.hano_lead_aos_quotes_name,
        id_lead: quotesEdit.value.attributes.hano_lead_aos_quoteshano_lead_ida,
      };
      editcargar.value = false;
    }
  }
);
watch(
  () => props.readMode,
  async () => {
    isEditing.value = props.readMode;
  },
  { deep: true }
);
// const rulesInput = async (): Promise<boolean | undefined> =>
//   (await Promise.all([subjectInputRef.value?.validate()])).every(
//     (input) => !!input
//   );

const editList = () => {
  directionProspectCardRef.value?.changeStatusTo('edit');
  edit.value = true;
  bloqueado.value = false;
  isEditing.value = true;
};

const cancelEdit = () => {
  directionProspectCardRef.value?.changeStatusTo('read');
  edit.value = false;
  bloqueado.value = true;
  isEditing.value = false;
};

const idContact = async (item: string) => {
  console.log('nuevo', item);
  // serviceStore.value.getModuleNewStore('Contact', item);
  const auxCon = await serviceStore.getModuleNewStore('Contact', item);
  console.log(auxCon);
  data.value.name_contact = auxCon.name;
  data.value.id_contact = auxCon.id;
};
// contacto=============================================================================>
const selectRelaCon = (item: any) => {
  if (props.id == '') {
    data.value.name_contact = item.nombre;
    data.value.id_contact = item.id;
    advancedFilterCon.value?.onClose();
  } else {
    dataread.value.name_contact = item.nombre;
    dataread.value.id_contact = item.id;
    advancedFilterCon.value?.onClose();
  }
};
//para abrir y cerrar los dialogs
// const openDialogCon = () => {
//   advancedFilterCon.value?.openDialog();
// };
//para abrir y cerrar los dialogs
const openDialogConAcount = () => {
  if (props.id == '') {
    if (data.value.id_account == '') {
      advancedFilterCon.value?.openDialog();
    } else {
      advancedFilterCon.value?.openDialogAcoWithCont(
        data.value.id_account,
        data.value.name_account
      );
    }
  } else {
    if (dataread.value.id_account == '') {
      advancedFilterCon.value?.openDialog();
    } else {
      advancedFilterCon.value?.openDialogAcoWithCont(
        dataread.value.id_account,
        dataread.value.name_account
      );
    }
  }
};
const clearCon = () => {
  if (props.id == '') {
    data.value.name_contact = '';
    data.value.id_contact = '';
  } else {
    dataread.value.name_contact = '';
    dataread.value.id_contact = '';
  }
};
// cuenta=============================================================================>
const selectRelaAco = (item: any) => {
  if (props.id == '') {
    data.value.name_account = item.nombre;
    data.value.id_account = item.id;
    advancedFilterAco.value?.onClose();
  } else {
    dataread.value.name_account = item.nombre;
    dataread.value.id_account = item.id;
    advancedFilterAco.value?.onClose();
  }
};
const openDialogAco = () => {
  if (props.id == '') {
    advancedFilterAco.value?.openDialog();
  } else {
    advancedFilterAco.value?.openDialog();
  }
};
const clearAco = () => {
  if (props.id == '') {
    data.value.name_account = '';
    data.value.id_account = '';
  } else {
    dataread.value.name_account = '';
    dataread.value.id_account = '';
  }
};
// proospecto=============================================================================>
const selectRelaPro = (item: any) => {
  if (props.id == '') {
    data.value.name_prospect = item.nombre;
    data.value.id_prospect = item.id;
    advancedFilterPro.value?.onClose();
  } else {
    dataread.value.name_prospect = item.nombre;
    dataread.value.id_prospect = item.id;
    advancedFilterPro.value?.onClose();
  }
};
const openDialogPro = () => {
  if (props.id == '') {
    advancedFilterPro.value?.openDialog();
  } else {
    advancedFilterPro.value?.openDialog();
  }
};
const clearPro = () => {
  if (props.id == '') {
    data.value.name_prospect = '';
    data.value.id_prospect = '';
  } else {
    dataread.value.name_prospect = '';
    dataread.value.id_prospect = '';
  }
};
// lead=============================================================================>
const selectRelaLed = (item: any) => {
  if (props.id == '') {
    data.value.name_lead = item.nombre;
    data.value.id_lead = item.id;
    advancedFilterLed.value?.onClose();
  } else {
    dataread.value.name_lead = item.nombre;
    dataread.value.id_lead = item.id;
    advancedFilterLed.value?.onClose();
  }
};
const openDialogLed = () => {
  if (props.id == '') {
    advancedFilterLed.value?.openDialog();
  } else {
    advancedFilterLed.value?.openDialog();
  }
};
const clearLed = () => {
  if (props.id == '') {
    data.value.name_lead = '';
    data.value.id_lead = '';
  } else {
    dataread.value.name_lead = '';
    dataread.value.id_lead = '';
  }
};
// ==================================================================================>
const exposeData = () => {
  addressStreet.value.billing_address_street = composableQuotes.formatAddress(
    String(
      directionProspectCardRef.value?.captureCurrentData()
        .address_street_generated_c
    )
  );
  addressStreet.value.shipping_address_street = composableQuotes.formatAddress(
    String(
      directionProspectCardRef.value?.captureCurrentData()
        .address_street_generated_c
    )
  );

  if (props.id == '') {
    return {
      ...data.value,
      ...directionProspectCardRef.value?.captureCurrentData(),
      ...addressStreet.value,
    };
  } else {
    return {
      ...dataread.value,
      ...directionProspectCardRef.value?.captureCurrentData(),
      ...addressStreet.value,
    };
  }
};

defineExpose({
  // rulesInput,
  exposeData,
  isEditing,
  getopportunity,
});
</script>
<template>
  <!-- <pre>id quotes{{ props.id }}</pre> -->
  <!-- <pre>editando---{{ isEditing }}</pre> -->
  <q-card class="my-card" v-if="!props.id">
    <q-card-section class="row justify-between">
      <span>
        <q-icon name="share_location" size="sm" color="primary" /> Datos del
        Cliente
      </span>
    </q-card-section>
    <q-separator></q-separator>
    <q-card-section>
      <div class="row q-col-gutter-sm">
        <div class="col-md-6 col-xs-12">
          <q-input
            outlined
            v-model="data.name_account"
            label="Cuenta"
            class="col-md-6 col-sm-12"
            readonly
            dense
            label-slot
          >
            <template v-slot:prepend>
              <q-avatar>
                <q-icon name="account_circle" size="sm" />
              </q-avatar>
            </template>
            <template v-slot:after>
              <q-btn
                dense
                outline
                icon="north_west"
                color="primary"
                @click="openDialogAco"
              />
              <q-btn
                dense
                outline
                icon="close"
                color="negative"
                @click="clearAco"
              />
            </template>
          </q-input>
        </div>
        <div class="col-md-6 col-xs-12">
          <q-input
            outlined
            v-model="data.name_contact"
            label="Contacto"
            class="col-md-6 col-sm-12"
            readonly
            dense
            label-slot
          >
            <template v-slot:prepend>
              <q-avatar>
                <q-icon name="perm_contact_calendar" size="sm" />
              </q-avatar>
            </template>
            <template v-slot:after>
              <q-btn
                dense
                outline
                icon="north_west"
                color="primary"
                @click="openDialogConAcount"
              >
                <q-badge
                  rounded
                  floating
                  color="red"
                  v-if="data.name_account != '' && data.name_contact == ''"
                  >!</q-badge
                >
              </q-btn>
              <q-btn
                dense
                outline
                icon="close"
                color="negative"
                @click="clearCon"
              />
            </template>
          </q-input>
        </div>
        <div class="col-md-6 col-xs-12">
          <q-input
            outlined
            v-model="data.name_prospect"
            label="Prospecto"
            class="col-md-6 col-sm-12"
            readonly
            dense
            label-slot
          >
            <template v-slot:prepend>
              <q-avatar>
                <q-icon name="analytics" size="sm" />
              </q-avatar>
            </template>
            <template v-slot:after>
              <q-btn
                dense
                outline
                icon="north_west"
                color="primary"
                @click="openDialogPro"
              />
              <q-btn
                dense
                outline
                icon="close"
                color="negative"
                @click="clearPro"
              />
            </template>
          </q-input>
        </div>
        <div class="col-md-6 col-xs-12">
          <q-input
            outlined
            v-model="data.name_lead"
            label="Lead"
            class="col-md-6 col-sm-12"
            readonly
            dense
            label-slot
          >
            <template v-slot:prepend>
              <q-avatar>
                <q-icon name="groups_2" size="sm" />
              </q-avatar>
            </template>
            <template v-slot:after>
              <q-btn
                dense
                outline
                icon="north_west"
                color="primary"
                @click="openDialogLed"
              />
              <q-btn
                dense
                outline
                icon="close"
                color="negative"
                @click="clearLed"
              />
            </template>
          </q-input>
        </div>
        <direction-card-component
          ref="directionProspectCardRef"
          class="col-12"
          :id-local="idAccount"
          :data="dataaddress"
          :directionCRM3="addressCRM3"
          :options="[]"
          :style="{ width: $q.screen.lt.sm ? '-webkit-fill-available' : '' }"
          :readonly="isProspectConverted"
        />
      </div>
    </q-card-section>
    <!-- <pre>data{{ data }}</pre> -->
    <q-separator inset />
  </q-card>
  <!-- -------------------------------PARA LA LEER LOS DATOS ----------------------------------->
  <q-card class="my-card" v-else>
    <q-card-section class="row justify-between">
      <span>
        <q-icon name="share_location" size="sm" color="primary" /> Datos del
        Cliente
      </span>

      <q-btn
        size="10px"
        flat
        dense
        icon="mode_edit"
        class="float-right"
        :color="!$q.dark.isActive ? 'grey-8' : 'white'"
        @click="editList"
        v-if="!edit"
      >
        <q-tooltip>Editar</q-tooltip>
      </q-btn>
      <q-btn
        v-else
        size="10px"
        flat
        dense
        icon="cancel"
        class="float-right"
        :color="!$q.dark.isActive ? 'grey-8' : 'white'"
        @click="cancelEdit"
      >
        <q-tooltip>Cancelar</q-tooltip>
      </q-btn>
    </q-card-section>
    <q-separator></q-separator>
    <q-card-section>
      <div class="row q-col-gutter-sm">
        <div class="col-md-6 col-xs-12">
          <q-input
            outlined
            v-model="dataread.name_account"
            label="Cuenta"
            class="col-md-6 col-sm-12"
            readonly
            dense
            label-slot
          >
            <template v-slot:prepend>
              <q-avatar>
                <q-icon name="account_circle" size="sm" />
              </q-avatar>
            </template>
            <template v-slot:after>
              <q-btn
                dense
                outline
                icon="north_west"
                color="primary"
                @click="openDialogAco"
                :disable="bloqueado"
              />
              <q-btn
                dense
                outline
                icon="close"
                color="negative"
                @click="clearAco"
                :disable="bloqueado"
              />
            </template>
          </q-input>
        </div>
        <div class="col-md-6 col-xs-12">
          <q-input
            outlined
            v-model="dataread.name_contact"
            label="Contacto"
            class="col-md-6 col-sm-12"
            readonly
            dense
            label-slot
          >
            <template v-slot:prepend>
              <q-avatar>
                <q-icon name="perm_contact_calendar" size="sm" />
              </q-avatar>
            </template>
            <template v-slot:after>
              <q-btn
                dense
                outline
                icon="north_west"
                color="primary"
                @click="openDialogConAcount"
                :disable="bloqueado"
              />
              <q-btn
                dense
                outline
                icon="close"
                color="negative"
                @click="clearCon"
                :disable="bloqueado"
              />
            </template>
          </q-input>
        </div>
        <div class="col-md-6 col-xs-12">
          <q-input
            outlined
            v-model="dataread.name_prospect"
            label="Prospecto"
            class="col-md-6 col-sm-12"
            readonly
            dense
            label-slot
          >
            <template v-slot:prepend>
              <q-avatar>
                <q-icon name="analytics" size="sm" />
              </q-avatar>
            </template>
            <template v-slot:after>
              <q-btn
                dense
                outline
                icon="north_west"
                color="primary"
                @click="openDialogPro"
                :disable="bloqueado"
              />
              <q-btn
                dense
                outline
                icon="close"
                color="negative"
                @click="clearPro"
                :disable="bloqueado"
              />
            </template>
          </q-input>
        </div>
        <div class="col-md-6 col-xs-12">
          <q-input
            outlined
            v-model="dataread.name_lead"
            label="Lead"
            class="col-md-6 col-sm-12"
            readonly
            dense
            label-slot
          >
            <template v-slot:prepend>
              <q-avatar>
                <q-icon name="groups_2" size="sm" />
              </q-avatar>
            </template>
            <template v-slot:after>
              <q-btn
                dense
                outline
                icon="north_west"
                color="primary"
                @click="openDialogLed"
                :disable="bloqueado"
              />
              <q-btn
                dense
                outline
                icon="close"
                color="negative"
                @click="clearLed"
                :disable="bloqueado"
              />
            </template>
          </q-input>
        </div>
        <direction-card-component
          ref="directionProspectCardRef"
          class="col-12"
          :id-local="idAccount"
          :data="dataaddress"
          :directionCRM3="addressCRM3"
          :options="[]"
          :style="{ width: $q.screen.lt.sm ? '-webkit-fill-available' : '' }"
          :readonly="isProspectConverted"
        />
      </div>
    </q-card-section>
    <!-- <pre>dataread{{ dataread }}</pre> -->
    <q-separator inset />
    <q-inner-loading
      :showing="editcargar"
      label="Cargando datos del cliente..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </q-card>
  <RelacionadoAco
    ref="advancedFilterAco"
    @selectItem="selectRelaAco"
    account_id=""
  />
  <RelacionadoCon
    ref="advancedFilterCon"
    @selectItem="selectRelaCon"
    @sendIdContact="idContact"
    account_id=""
  />
  <RelacionadoPro
    ref="advancedFilterPro"
    @selectItem="selectRelaPro"
    account_id=""
  />
  <RelacionadoLed
    ref="advancedFilterLed"
    @selectItem="selectRelaLed"
    account_id=""
  />
</template>
