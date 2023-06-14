<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';
import { useQuasar } from 'quasar';
import { Container } from 'vue3-smooth-dnd';
import { profitMotive, lossMotive } from '../../utils/dummyData';
import { useBusinesses } from '../../composables/Core';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { useBusinessesStore, SalePhase } from '../../store/index';
import { userStore } from 'src/modules/Users/store/UserStore';
import { applyDrag } from './helpers';

import KanbanItem from './KanbanItem.vue';
import DialogComponent from '../Dialog/DialogComponent.vue';
import ActivitiesComponent from 'src/components/Activities/ActivitiesComponent.vue';
import ChangePhaseDialog from '../Dialog/ChangePhaseDialog.vue';
import moment from 'moment';
import { OpportunitiesResponse } from '../../utils/types';

interface OppPayload extends OpportunitiesResponse {
  loading: boolean;
}

interface DropPayload {
  removedIndex: number | null;
  addedIndex: number | null;
  payload: OppPayload;
}

interface Emits {
  (event: 'openOpportunity', id?: string): void;
}

const emits = defineEmits<Emits>();

const AccountDialog = defineAsyncComponent(
  () => import('src/modules/Accounts/components/Dialogs/AccountDialog.vue')
);
const ContactDialog = defineAsyncComponent(
  () => import('src/modules/Contacts/components/Dialogs/ContactDialog.vue')
);
const QuoteDialog = defineAsyncComponent(
  () => import('src/modules/Quotes/components/Dialogs/GeneralDialog.vue')
);

const $q = useQuasar();
const businessesStore = useBusinessesStore();
const {
  getOpportunityData,
  formatAmounts,
  changeOpportunityState,
  deleteOpportunity,
  reloadData,
} = useBusinesses();
const { userCRM } = userStore();

const deleteDialog = ref({ openDialog: false, id: '', message: '' });
const markGainedDialog = ref({
  openDialog: false,
  id: '',
  message: '',
  value: '',
});
const markLostDialog = ref({
  openDialog: false,
  id: '',
  message: '',
  value: '',
});
const duplicateDialog = ref({
  openDialog: false,
  id: '',
  message: '',
});
const activitiesDialog = ref<{
  activeTab: 'todas' | 'tarea' | 'llamada' | 'correo' | 'reunion' | 'notas';
  fromDate: string;
  opportunityId: string;
  openDialog: boolean;
  toDate: string;
}>({
  activeTab: 'todas',
  fromDate: moment().startOf('month').format('DD/MM/YYYY'),
  opportunityId: '',
  openDialog: false,
  toDate: moment().endOf('month').format('DD/MM/YYYY'),
});

const accountDialogRef = ref<InstanceType<typeof AccountDialog> | null>(null);
const contactDialogRef = ref<InstanceType<typeof ContactDialog> | null>(null);
const quoteDialogRef = ref<InstanceType<typeof QuoteDialog> | null>(null);
const changePhaseDialogRef = ref<InstanceType<typeof ChangePhaseDialog> | null>(null);
const main = ref<HTMLDivElement | null>(null);

let rollbackValue: SalePhase[] | null = null;

const validateDrop = (e, payload) => {
  // console.log('your e:', e, payload);
  rollbackValue = businessesStore.currentData;
  return e.groupName === 'col-items' && !payload.loading;
};

const prevOpp = ref({} as { columnId: string; dropResult: DropPayload });
const lastOpp = ref({} as { columnId: string; dropResult: DropPayload });

const resetMovedValues = () => {
  prevOpp.value = {} as { columnId: string; dropResult: DropPayload };
  lastOpp.value = {} as { columnId: string; dropResult: DropPayload };
};

const onCardDrop = async (columnId: string, dropResult: DropPayload) => {
  console.log(columnId, dropResult);
  if (dropResult.removedIndex !== null) {
    console.log('Previous values', dropResult.removedIndex, dropResult.addedIndex);
    prevOpp.value = { columnId, dropResult };
  }
  if (dropResult.addedIndex !== null) {
    console.log('Last moved values', dropResult.removedIndex, dropResult.addedIndex);
    lastOpp.value = { columnId, dropResult };
  }
  if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
    const sceneVal = [...businessesStore.currentData];
    const column = sceneVal.filter((p: { id: string }) => p.id === columnId)[0];
    const itemIndex = sceneVal.indexOf(column);
    const newColumn = Object.assign({}, column);

    // check if element was ADDED in current column
    if (dropResult.removedIndex == null && typeof dropResult.addedIndex === 'number') {
      // $q.notify({
      //   message: `moving id to: ${columnId} and ${
      //     businessesStore.currentColumns.find((col) => col.id === columnId)
      //       ?.value
      //   }`,
      // });
      // console.log(
      //   'moving id to: ',
      //   columnId,
      //   businessesStore.currentColumns.find((col) => col.id === columnId)?.value
      // );

      // your action / api call
      dropResult.payload.loading = true;
      // simulate api call
      dropResult.payload.loading = false;
      // setTimeout(function () {
      // }, Math.random() * 5000 + 1000);
    }

    if (
      Object.values(prevOpp.value).length > 0 &&
      Object.values(lastOpp.value).length > 0
    ) {
      const phaseFrom =
        businessesStore.currentColumns.find((col) => col.id === prevOpp.value.columnId)
          ?.value || '';
      const phaseTo =
        businessesStore.currentColumns.find((col) => col.id === lastOpp.value.columnId)
          ?.value || '';

      if (phaseFrom !== phaseTo) {
        changePhaseDialogRef.value?.openDialog(dropResult.payload.id, phaseFrom, phaseTo);
      }
    }

    newColumn.data = applyDrag(newColumn.data, dropResult);
    sceneVal.splice(itemIndex, 1, newColumn);

    businessesStore.currentData = sceneVal;
  }
};

const getPercentage = (opportunities: number) => {
  return Math.round((opportunities / businessesStore.validOpportunities.length) * 100);
};

const getCardPayload = (columnId: string) => {
  return (index: number) => {
    return businessesStore.currentData.filter((p: { id: string }) => p.id === columnId)[0]
      .data[index];
  };
};

const generateColors = (hexColor: string, options: { transparency?: string } = {}) => {
  // console.log(hexColor);
  const { transparency = '' } = options;
  return 'background-color: #bae6ff; border-radius: 5px';
  // `background-color: ${hexColor};
  // border-top: 8px solid #c8c8c8;
  // border-right: 2px solid #c8c8c8;
  // border-bottom: 2px solid #c8c8c8;
  // border-left: 2px solid #c8c8c8`
  // `border-top: 8px solid ${hexColor}${transparency};
  // border-right: 2px solid ${hexColor}${transparency};
  // border-bottom: 2px solid ${hexColor}${transparency};
  // border-left: 2px solid ${hexColor}${transparency};`;
};

const kanbanItemEvents = {
  createQuote: async (id: string) => {
    console.log('Create a quote for opportunity', id);
    const response = await getOpportunityData(id, []);
    console.log(response);
    const data = {
      idOppty: id,
      nameOppty: response?.name,
      account_nameOppty: response?.account_name,
      account_idOppty: response?.account_id,
      contact_id2_cOppty: response?.contact_id2_c,
      contacto_oportunidad_cOppty: response?.contacto_oportunidad_c,
      iddivision_cOppty: response?.iddivision_c,
      idamercado_cOppty: response?.idamercado_c,
      region_cOppty: response?.region_c,
      currency_idOppty: response?.currency_id,
      idgrupocliente_cOppty: response?.idgrupocliente_c,
    };
    quoteDialogRef.value?.openDialogQuotesTabOpportunity('', data, 'Nueva Cotización');
    $q.notify({ message: 'Creando cotización' });
  },
  deleteOpportunity: (id: string, name: string) => {
    console.log('Deleting...', name, id);
    deleteDialog.value = { openDialog: true, id, message: name };
  },
  duplicate: (id: string, name: string) => {
    console.log('Duplicate Opportunity', id);
    duplicateDialog.value = { openDialog: true, id, message: name };
  },
  markAsGained: (id: string, name: string) => {
    console.log('Opportunity as gained', id, name);
    markGainedDialog.value = { openDialog: true, id, message: name, value: '' };
  },
  markAsLost: (id: string, name: string) => {
    console.log('Opportunity as lost', id);
    markLostDialog.value = { openDialog: true, id, message: name, value: '' };
  },
  moveTo: (id: string, destination: string) => {
    console.log('Moving this opportunity to ', id, destination);
  },
  selectAccount: (id?: string) => {
    if (!!id) accountDialogRef.value?.openDialogAccountTab(id);
  },
  selectActivities: (id: string) => {
    console.log('open your activities...', id);
  },
  selectActivity: (
    id: string,
    activity: 'todas' | 'tarea' | 'llamada' | 'correo' | 'reunion' | 'notas',
    creationDate: string
  ) => {
    activitiesDialog.value = {
      ...activitiesDialog.value,
      opportunityId: id,
      activeTab: activity,
      fromDate: moment(creationDate).format('DD/MM/YYYY'),
      openDialog: true,
    };
  },
  selectContact: (id?: string) => {
    if (!!id) contactDialogRef.value?.openDialogTab(id, 'Detalle del Contacto');
  },
  selectOpportunity: (id: string) => {
    emits('openOpportunity', id);
    // opportunityDialogRef.value?.openDialogAccountTab(id);
  },
};

const cleanDeleteDialog = () => {
  deleteDialog.value = {
    openDialog: false,
    id: '',
    message: '',
  };
};

const cleanGainedDialog = () => {
  markGainedDialog.value = {
    openDialog: false,
    id: '',
    message: '',
    value: '',
  };
};

const cleanLostDialog = () => {
  markLostDialog.value = {
    openDialog: false,
    id: '',
    message: '',
    value: '',
  };
};

const cleanDuplicateDialog = () => {
  duplicateDialog.value = {
    openDialog: false,
    id: '',
    message: '',
  };
};

const markOpportunityAsGained = async () => {
  if (!markGainedDialog.value.value) {
    $q.notify({
      type: 'warning',
      message: 'Se necesita un motivo',
    });
    return;
  }
  await changeOpportunityState(
    markGainedDialog.value.id,
    markGainedDialog.value.value,
    'Ganado'
  );
  markGainedDialog.value.openDialog = false;
};

const markOpportunityAsLost = async () => {
  if (!markLostDialog.value.value) {
    $q.notify({
      type: 'warning',
      message: 'Se necesita un motivo',
    });
    return;
  }
  await changeOpportunityState(
    markLostDialog.value.id,
    markLostDialog.value.value,
    'Perdido'
  );
  markLostDialog.value.openDialog = false;
};

const duplicateOpportunity = async () => {
  await businessesStore.duplicateOpportunity(duplicateDialog.value.id);
};

const rollbackOpportunity = async () => {
  if (!!rollbackValue) businessesStore.currentData = rollbackValue;
};

const moveToOtherPhase = (id: string, newPhase: string, lastPhase: string) => {
  changePhaseDialogRef.value?.openDialog(id, newPhase, lastPhase, true);
};
</script>

<template>
  <div
    ref="main"
    class="row q-col-gutter-sm"
    style="overflow-y: hidden; overflow-x: scroll; flex: 1 1 auto"
  >
    <!-- <pre>abc{{ salesPhase }}</pre> -->
    <Container tag="div" orientation="horizontal" :behavior="'drag'" :autoScroll="true">
      <div
        class="header-col col q-mr-sm"
        style="min-width: 300px; max-height: 80vh"
        :key="column.id"
        v-for="column in businessesStore.currentData"
      >
        <!-- header-->
        <div
          class="text-black q-pa-sm q-mb-sm shadow-3"
          :style="generateColors(column.props?.color || '#003C79')"
        >
          <div class="row justify-between q-mb-xs">
            <div class="long-and-truncated">
              <span class="main-size"
                >{{ column.label }}
                <q-tooltip>
                  {{ column.label }}
                </q-tooltip></span
              >
            </div>
            <div>
              <div>
                <span class="main-size text-grey-9"
                  >{{ getPercentage(column.data.length) }}%</span
                >
              </div>
            </div>
          </div>
          <div class="row justify-between">
            <div class="column">
              <span class="caption-size">Total</span>
              <span class="primary-size">{{ column.data.length }}</span>
            </div>
            <div class="column">
              <span class="caption-size">Monto</span>
              <span class="primary-size">{{ formatAmounts(column.data) }}</span>
            </div>
          </div>
        </div>
        <!-- column -->
        <Container
          class=""
          orientation="vertical"
          style="overflow-y: auto; height: 85%"
          group-name="col-items"
          :dragBeginDelay="!$q.platform.is.desktop ? 200 : 0"
          :shouldAcceptDrop="validateDrop"
          :get-child-payload="getCardPayload(column.id)"
          :drop-placeholder="{
            className: `bg-green-11`,
            animationDuration: '200',
            showOnTop: true,
          }"
          drag-class="bg-indigo-1"
          drop-class="bg-cyan-1"
          @drop="(e) => onCardDrop(column.id, e)"
        >
          <!-- Items -->
          <!-- <q-virtual-scroll v-if="total > 100" :items="column.data" separator>
            <template v-slot="{ item, index }">
              <KanbanItem
                class="q-py-xs"
                :color="column.props?.color"
                :key="index"
                :item="item"
              ></KanbanItem>
            </template>
          </q-virtual-scroll> -->
          <KanbanItem
            :color="column.props?.color"
            :item="item"
            :key="index"
            v-on="kanbanItemEvents"
            class="q-py-xs"
            v-for="(item, index) in column.data"
            @moveTo="moveToOtherPhase"
          ></KanbanItem>
          <q-card v-if="column.data.length === 0" flat class="text-gray-7">
            <q-card-section>
              <div class="text-h6">Sin oportunidades</div>
              <div class="text-subtitle2"></div>
            </q-card-section>
            <q-card-section> </q-card-section>
          </q-card>
        </Container>
      </div>
    </Container>
  </div>
  <AccountDialog ref="accountDialogRef" @saved-form="reloadData()" />
  <ContactDialog ref="contactDialogRef" @contact-change="reloadData()" />
  <QuoteDialog ref="quoteDialogRef" />
  <alert-component
    @before-hide="cleanDeleteDialog"
    @confirm="
      () => {
        deleteOpportunity(deleteDialog.id);
      }
    "
    @denegate="deleteDialog.openDialog = false"
    btn-color="negative"
    btn-text="Si, eliminar"
    icon-color="negative"
    icon-size="50px"
    icon="warning"
    title="¿Eliminar Oportunidad?"
    v-model="deleteDialog.openDialog"
  >
    <template #body>
      <span class="q-py-sm">Se eliminará la oportunidad: </span>
      <br />
      <span class="text-bold"> - {{ deleteDialog.message }}</span>
    </template>
  </alert-component>
  <alert-component
    @before-hide="cleanGainedDialog"
    @confirm="
      () => {
        markOpportunityAsGained();
      }
    "
    @denegate="deleteDialog.openDialog = false"
    btn-color="warning"
    btn-text="Si, marcar"
    disable-auto-close-confirm
    icon-color="warning"
    icon-size="50px"
    icon="warning"
    title="¿Marcar oportunidad como ganado?"
    v-model="markGainedDialog.openDialog"
  >
    <template #body>
      <span class="q-py-sm">La siguiente oportunidad se marcará como ganado </span>
      <br />
      <span class="text-bold"> - {{ markGainedDialog.message }}</span>
      <div>
        <q-select
          :options="profitMotive"
          class="q-mt-sm"
          dense
          emit-value
          label="Motivo de Ganancia"
          map-options
          outlined
          option-value="value"
          option-label="label"
          style="min-width: 250px"
          v-model="markGainedDialog.value"
        />
      </div>
    </template>
  </alert-component>
  <alert-component
    @before-hide="cleanLostDialog"
    @confirm="
      () => {
        markOpportunityAsLost();
      }
    "
    @denegate="markLostDialog.openDialog = false"
    btn-color="negative"
    btn-text="Si, marcar"
    disable-auto-close-confirm
    icon-color="negative"
    icon-size="50px"
    icon="warning"
    title="¿Marcar oportunidad como perdido?"
    v-model="markLostDialog.openDialog"
  >
    <template #body>
      <span class="q-py-sm">Se marcará la oportunidad como perdido: </span>
      <br />
      <span class="text-bold"> - {{ markLostDialog.message }}</span>
      <div>
        <q-select
          :options="lossMotive"
          class="q-mt-sm"
          dense
          emit-value
          label="Motivo de Ganancia"
          map-options
          outlined
          option-value="value"
          option-label="label"
          style="min-width: 300px"
          v-model="markLostDialog.value"
        />
      </div>
    </template>
  </alert-component>
  <alert-component
    @before-hide="cleanDuplicateDialog"
    @confirm="
      () => {
        duplicateOpportunity();
      }
    "
    @denegate="duplicateDialog.openDialog = false"
    btn-color="warning"
    btn-text="Si, duplicar"
    icon-color="warning"
    icon-size="50px"
    icon="warning"
    title="¿Duplicar oportunidad?"
    v-model="duplicateDialog.openDialog"
  >
    <template #body>
      <span class="q-py-sm">Se duplicará la oportunidad: </span>
      <br />
      <span class="text-bold"> - {{ duplicateDialog.message }}</span>
    </template>
  </alert-component>
  <DialogComponent
    v-model="activitiesDialog.openDialog"
    title="Actividades de la Oportunidad"
  >
    <template #body>
      <ActivitiesComponent
        :active-tab="activitiesDialog.activeTab"
        :from-date="activitiesDialog.fromDate"
        :id-user="userCRM.id"
        :id="activitiesDialog.opportunityId"
        :to-date="activitiesDialog.toDate"
        module="Opportunities"
      >
      </ActivitiesComponent>
    </template>
    <!-- <template #footer>
      <q-btn color="primary" icon="check" label="Aceptar" v-close-popup />
    </template> -->
  </DialogComponent>
  <ChangePhaseDialog
    @before-hide="resetMovedValues"
    @cancel="rollbackOpportunity"
    ref="changePhaseDialogRef"
  />
</template>

<style lang="scss" scoped>
/** NB: don't remove,
* When using orientation="horizontal" it auto sets "display: table"
* In this case we need flex and not display table
*/
.smooth-dnd-container.horizontal {
  display: flex !important;
}
.header-column {
  border-top: 8px solid #00b3ff;
  border-right: 2px solid #00b3ff;
  border-bottom: 2px solid #00b3ff;
  border-left: 2px solid #00b3ff;
}

.header-col {
  .primary-size {
    font-size: 1rem;
  }
  .caption-size {
    font-size: 0.7rem;
  }
}
* {
  scrollbar-width: auto;
  scrollbar-color: #4f4f4f #ff000000;
}

/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

*::-webkit-scrollbar-track {
  background: #ff000000;
}

*::-webkit-scrollbar-thumb {
  background-color: #4f4f4f;
  border-radius: 10px;
  border: 3px solid #696969;
}

.long-and-truncated {
  flex: 1;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.short-and-fixed {
  white-space: nowrap;
  > div {
    width: 30px;
    height: 30px;
    border-radius: 10px;
    background: lightgreen;
    display: inline-block;
  }
}
</style>
