<script lang="ts">
import { ref, onMounted, computed } from 'vue';
import AdvancedFilter from '../components/AdvancedFilter.vue';
import UpdateMasive from '../components/UpdateMassive.vue';
import TableSkeleton from 'src/components/MainTable/TableSkeleton.vue';

import GeneralDialog from '../components/Dialogs/GeneralDialog.vue';
import ContactDialog from 'src/modules/Contacts/components/Dialogs/ContactDialog.vue';
import AccountDialog from 'src/modules/Accounts/components/Dialogs/AccountDialog.vue';
import OpportunityDialog from 'src/modules/Opportunities/components/Dialogs/OpportunityDialog.vue';
import ProspectDialog from 'src/modules/Prospects/components/Dialogs/ProspectDialog.vue';
import LeadDialog from 'src/modules/Leads/components/Dialogs/LeadDialog.vue';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
import {
  AccountModel,
  PaginationTable,
  OptionWithChildren,
  OptionBase,
} from '../utils/types';

import * as util from '../utils/types';

import templateStore from 'src/stores/template/templateStore';
import { userStore } from 'src/modules/Users/store/UserStore';
import { QuotesTableStore } from '../store/QuotesTableStore';
// import UpdateMassive from '../components/UpdateMassive.vue';
// import { tableStore } from '../../../stores/TableStore';
import { useFormOptionsStore } from 'src/stores/formOptionsStore';
import { useQuasar } from 'quasar';
import Notification from 'src/modules/Accounts/utils/notify';
</script>

<script lang="ts" setup>
const props = defineProps<{
  nameModule?: string;
  idUser?: string;
  menu?: string;
}>();

const isReady = ref(true);
const tableStore = QuotesTableStore();
const template = templateStore();
const user = userStore();
const $q = useQuasar();
const dialogUpdateConfirm = ref(false);
const leadStore = useFormOptionsStore();

const {
  setVisibleColumn,
  setPagination,
  deleteMultiple,
  updateMultiple,
  getListQuotes,
  updateStageQuotesList,
} = tableStore;

//* References
const generalDialogRef = ref<InstanceType<typeof GeneralDialog> | null>(null);
const filterAdvanced = ref<InstanceType<typeof AdvancedFilter> | null>(null);
const updateMassiveRef = ref<InstanceType<typeof UpdateMasive> | null>(null);
const ContactDialogRef = ref<InstanceType<typeof ContactDialog> | null>(null);
const AccountDialogRef = ref<InstanceType<typeof AccountDialog> | null>(null);
const opportunityDialogRef = ref<InstanceType<typeof OpportunityDialog> | null>(
  null
);
const prospectDialogRef = ref<InstanceType<typeof ProspectDialog> | null>(null);
const leadDialogRef = ref<InstanceType<typeof LeadDialog> | null>(null);

/* Methods */
const onRequestTable = async (val: {
  pagination: PaginationTable;
  filter: OptionWithChildren;
}) => {
  console.log(val);
  await setPagination(val.pagination);
  await getListQuotes(val);
};

const onUpdateMultiple = (selected: OptionBase[]) => {
  const contacts = selected.map((el: OptionBase) => {
    return { id: el.id };
  });
  const data = updateMassiveRef.value?.data;
  updateMultiple(data, contacts);
};

const alertaEliminacion = () => {
  Notification(
    'error',
    'error',
    '<strong> ¡No se pueden eliminar cotizaciones! </strong>'
  );
};

const onSubmitDataFilter = () => {
  try {
    tableStore.data_filter = filterAdvanced.value?.dataFilter;
    tableStore.data_extra = filterAdvanced.value?.dataExtra;
    tableStore.setFilterData();
    tableStore.reloadList();
  } catch (error) {
    // console.log(error);
  }
};

const onClearDataFilter = () => {
  try {
    filterAdvanced.value?.clearFilter();
    tableStore.clearFilterData();
    tableStore.setFilterData();
    tableStore.reloadList();
  } catch (error) {
    // console.log(error);
  }
};

const formSaved = async () => {
  await tableStore.reloadList();
};

const openDialog = async (id?: string) => {
  await generalDialogRef.value?.openDialogQuotesTab(id ? id : '');
};

const openDialogContact = async (id?: string) => {
  await ContactDialogRef.value?.openDialogTab(id, 'Detalle del Contacto');
};
const openDialogAccount = async (id?: string, type?: string) => {
  await AccountDialogRef.value?.openDialogAccountTab(
    id,
    type as AccountModel,
    'Detalle de la Cuenta:'
  );
};
const openDialogOpportu = async (id?: string) => {
  await opportunityDialogRef.value?.openDialogAccountTab(id);
};

const openDialogProspect = async (id?: string) => {
  await prospectDialogRef.value?.openDialogAccountTab(id);
};
const openDialogLeads = async (id?: string) => {
  await leadDialogRef.value?.openDialogAccountTab(id);
};

const constructorComp = (menu?: string, idUser?: string) => {
  if (menu) {
    template.hiddenMenu(menu);
  }
  if (idUser) {
    user.insertUser(idUser);
  } else {
    user.insertUser('');
  }
};

const onUpdateDataTable = async () => {
  try {
    await tableStore.reloadList();

    $q.notify({
      type: 'positive',
      color: 'positive',
      message: 'Actualización correcta',
      caption: 'Se han actualizado los datos',
    });
  } catch (e) {
    // console.log(e);
  }
};

const opciones_estado = [
  { label: 'Negociación', value: 'Negotiation' },
  { label: 'Confirmado', value: 'Confirmed' },
  { label: 'Rechazada', value: 'Not_Approved' },
  { label: 'Anulado', value: 'Canceled' },
];

// cambiar etapa========================================================>
const confirm = ref({
  id: '',
  stage: '',
  name: '',
});

const funcionopen = (val: string, val2: util.objStageSelect, name: string) => {
  dialogUpdateConfirm.value = true;
  confirm.value.name = name;
  confirm.value.id = val;
  confirm.value.stage = val2.value;
};
const stageConfirm = async () => {
  dialogUpdateConfirm.value = false;
  await updateStageQuotesList(confirm.value.id, confirm.value.stage);
};
const stageCancel = async () => {
  dialogUpdateConfirm.value = false;
  await tableStore.reloadList();
};
// ===========================================================>
/** Mounted function */
onMounted(async () => {
  isReady.value = false;
  await tableStore.getUserConfig();
  await leadStore.getLeadsOptions();
  isReady.value = true;
});

(() => {
  constructorComp(props.menu, props.idUser);
})();
</script>

<template>
  <div :class="$q.platform.is.desktop ? 'q-pa-md' : ''">
    <table-component
      flat
      item-center
      :rows="tableStore.data_table.rows"
      :columns="tableStore.data_table.columns"
      :total="tableStore.pagination.rowsNumber"
      :rowsPerPage="tableStore.pagination.rowsPerPage"
      :sortBy="tableStore.pagination.sortBy"
      :descending="tableStore.pagination.descending"
      :visible="tableStore.visible_columns"
      :dataFilter="tableStore.data_filter"
      :loading="tableStore.loading"
      searchPlaceholder="Busqueda por: Nombre, Precio y Nro. de Cotizacion"
      @visibleColumns="setVisibleColumn"
      @submitFilter="onSubmitDataFilter"
      @clearFilter="onClearDataFilter"
      @update:props="onRequestTable"
      @openDetails="openDialog"
      @deleteMultiple="alertaEliminacion"
      @updateMultiple="onUpdateMultiple"
      @updateData="onUpdateDataTable"
      v-if="isReady"
      :defaultRows="false"
    >
      <template #rows="{ propsTable }">
        <!-- {{ propsTable }} -->
        <q-tr :props="propsTable">
          <q-td class="text-left" auto-width>
            <q-checkbox left-label v-model="propsTable.selected" flat dense />
          </q-td>
          <q-td key="name" :props="propsTable">
            <a
              class="text-bold cursor-pointer flex items-center"
              @click="openDialog(propsTable.row.id)"
            >
              <q-item-section>
                <q-item-label
                  lines="5"
                  :class="$q.dark.isActive ? 'text-white ' : 'text-primary '"
                >
                  {{ propsTable.row.nombre }}
                </q-item-label>
                <q-item-label caption class="text-grey">{{
                  propsTable.row.name_idamercado_c
                }}</q-item-label>
              </q-item-section>
            </a>
          </q-td>
          <q-td key="number" :props="propsTable">
            <q-item-label class="text-overline">
              {{ propsTable.row.number }}
            </q-item-label>
          </q-td>
          <q-td key="name_iddivision_c" :props="propsTable">
            {{ propsTable.row.name_iddivision_c }}
          </q-td>
          <q-td key="name_idamercado_c" :props="propsTable">
            {{ propsTable.row.name_idamercado_c }}
          </q-td>
          <q-td key="stage" :props="propsTable">
            <!-- {{ propsTable.row.stage }} -->
            <q-select
              v-model="propsTable.row.stage"
              :options="opciones_estado"
              outlined
              rounded
              dense
              options-dense
              option-value="value"
              option-label="label"
              transition-show="flip-up"
              transition-hide="flip-down"
              emit-value
              map-options
              color="primary"
              @update:model-value="
                funcionopen(
                  propsTable.row.id,
                  propsTable.row.stage,
                  propsTable.row.nombre
                )
              "
            >
            </q-select>
          </q-td>
          <q-td key="total_amount" :props="propsTable">
            <q-badge color="green">
              {{
                propsTable.row.total_amount == null
                  ? ''
                  : propsTable.row.total_amount + ' ' + propsTable.row.symbol
              }}
            </q-badge>
          </q-td>
          <q-td key="expiration" :props="propsTable">
            <q-icon name="event_busy" class="q-pr-xs" color="teal" />
            {{ propsTable.row.expiration }}
          </q-td>
          <q-td key="name_account" :props="propsTable">
            <a
              class="text-bold cursor-pointer flex items-center"
              @click="
                openDialogAccount(
                  propsTable.row.id,
                  propsTable.row.tipocuenta_c
                )
              "
            >
              <q-item-section>
                <q-item-label
                  lines="5"
                  :class="$q.dark.isActive ? 'text-white' : 'text-primary'"
                  >{{ propsTable.row.name_account }}
                </q-item-label>
              </q-item-section>
            </a>
          </q-td>
          <q-td key="name_contact" :props="propsTable">
            <a
              class="text-bold cursor-pointer flex items-center"
              @click="openDialogContact(propsTable.row.billing_contact_id)"
            >
              <q-item-section>
                <q-item-label
                  lines="5"
                  :class="$q.dark.isActive ? 'text-white' : 'text-primary'"
                  >{{ propsTable.row.name_contact }}
                </q-item-label>
              </q-item-section>
            </a>
          </q-td>
          <q-td key="name_opportunity" :props="propsTable">
            <a
              class="text-bold cursor-pointer flex items-center"
              @click="openDialogOpportu(propsTable.row.opportunity_id)"
            >
              <q-item-section>
                <q-item-label
                  lines="5"
                  :class="$q.dark.isActive ? 'text-white' : 'text-primary'"
                  >{{ propsTable.row.name_opportunity }}
                </q-item-label>
              </q-item-section>
            </a>
          </q-td>
          <q-td key="name_leads" :props="propsTable">
            <a
              class="text-bold cursor-pointer flex items-center"
              @click="openDialogProspect(propsTable.row.id_lead)"
            >
              <q-item-section>
                <q-item-label
                  lines="5"
                  :class="$q.dark.isActive ? 'text-white' : 'text-primary'"
                  >{{ propsTable.row.name_leads }}
                </q-item-label>
              </q-item-section>
            </a>
          </q-td>
          <q-td key="name_hano_lead" :props="propsTable">
            <a
              class="text-bold cursor-pointer flex items-center"
              @click="openDialogLeads(propsTable.row.id_hano_lead)"
            >
              <q-item-section>
                <q-item-label
                  lines="5"
                  :class="$q.dark.isActive ? 'text-white' : 'text-primary'"
                  >{{ propsTable.row.name_hano_lead }}
                </q-item-label>
              </q-item-section>
            </a>
          </q-td>
          <q-td key="name_region_c" :props="propsTable">
            {{ propsTable.row.name_region_c }}
          </q-td>
          <q-td key="name_currency" :props="propsTable">
            {{ propsTable.row.name_currency }}
          </q-td>
          <q-td key="name_assigned_user_id" :props="propsTable">
            {{ propsTable.row.name_assigned_user_id }}
          </q-td>
          <q-td key="name_modified_user_id" :props="propsTable">
            {{ propsTable.row.name_modified_user_id }}
          </q-td>
          <q-td key="date_entered" :props="propsTable">
            {{ propsTable.row.date_entered }}
          </q-td>
        </q-tr>

        <!-- <pre>{{ propsTable }}</pre> -->
      </template>
      <template v-slot:buttons>
        <q-btn
          color="primary"
          label="NUEVA COTIZACION"
          @click="() => openDialog()"
          v-if="!$q.screen.xs"
        >
        </q-btn>
        <!-- <q-page-sticky
          position="bottom-right"
          :offset="[18, 18]"
          style="z-index: 1"
          v-else
        >
          <q-btn fab color="accent" icon="add" @click="() => openDialog()" />
        </q-page-sticky> -->
      </template>
      <template v-slot:filterContent>
        <AdvancedFilter
          ref="filterAdvanced"
          @submitFilter="onSubmitDataFilter"
        />
      </template>
      <template #updateContent>
        <UpdateMasive ref="updateMassiveRef" />
      </template>
    </table-component>
    <TableSkeleton v-else />
    <!-- <pre>{{ tableStore.data_table.rows }}</pre> -->
  </div>
  <GeneralDialog ref="generalDialogRef" @reloadQuotes="formSaved" />
  <ContactDialog ref="ContactDialogRef" />
  <AccountDialog ref="AccountDialogRef" />
  <OpportunityDialog ref="opportunityDialogRef" />
  <LeadDialog ref="leadDialogRef" />
  <ProspectDialog ref="prospectDialogRef" />
  <AlertComponent
    v-model="dialogUpdateConfirm"
    icon="request_quote"
    icon-color="teal"
    icon-size="70px"
    title="Actualizar etapa"
    btnColor="teal"
    btnText="Si, actualizar etapa"
    @confirm="stageConfirm"
    @denegate="stageCancel"
  >
    <template #body>
      <span class="text-center col-12"
        >¿ Desesa cambiar la etapa de cotización ?
      </span>

      <span class="text-center text-teal col-12"> {{ confirm.name }} </span>
    </template>
  </AlertComponent>
</template>
