<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue';
import { RowTableCINITModel } from '../types';
import BaseDialog from './BaseDialog.vue';
import { QTableColumn } from 'quasar';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';

const props = withDefaults(
  defineProps<{
    data: RowTableCINITModel[];
    module?: 'accounts' | 'contacts';
    selectable?: boolean;
    itemMessage?: string;
    selectedTitle?: string;
    selectedButtonMsg?: string;
    selectedMessage?: string;
  }>(),
  {
    module: 'accounts',
    selectable: false,
    itemMessage: 'Seleccionar',
    selectedTitle: '¿Seleccionar Valor?',
    selectedButtonMsg: 'Si, seleccionar',
    selectedMessage: '¿Esta seguro de seleccionar el valor?',
  }
);

defineEmits<{
  (event: 'expose-selected', value: RowTableCINITModel): void;
}>();

const AccountDialog = defineAsyncComponent(
  () => import('../../modules/Accounts/components/Dialogs/AccountDialog.vue')
);
const ContactDialog = defineAsyncComponent(
  () => import('../../modules/Contacts/components/Dialogs/ContactDialog.vue')
);

const tableColumns: QTableColumn[] = [
  {
    name: 'nit_ci',
    align: 'left',
    label: 'NIT/CI',
    field: 'nit_ci',
    sortable: true,
  },
  {
    name: 'name',
    align: 'left',
    label: 'Nombre',
    field: 'name',
    sortable: true,
  },
  {
    name: 'tipo_cuenta',
    align: 'center',
    label: 'Correo',
    field: 'tipo_cuenta',
    sortable: true,
  },
];

const tableColumnsContact: QTableColumn[] = [
  {
    name: 'ci',
    align: 'left',
    label: 'CI',
    field: 'ci',
    sortable: true,
  },
  {
    name: 'name',
    align: 'left',
    label: 'Nombre',
    field: 'name',
    sortable: true,
  },
  {
    name: 'departamento',
    align: 'center',
    label: 'Correo',
    field: 'departamento',
    sortable: true,
  },
];

const accountDialogRef = ref<InstanceType<typeof AccountDialog> | null>(null);
const contactDialogRef = ref<InstanceType<typeof ContactDialog> | null>(null);

const selectRepeatedDialog = ref(false);
const selectedRepeated = ref({} as RowTableCINITModel);

const currentColumns = computed(() => {
  const baseColumns: QTableColumn[] = [];
  if (props.selectable)
    baseColumns.push({
      name: 'exposeBtn',
      align: 'center',
      label: 'Acciones',
      field: 'exposeBtn',
      sortable: false,
    });

  if (props.module === 'contacts')
    return [...tableColumnsContact, ...baseColumns];
  return [...tableColumns, ...baseColumns];
});

const openDialogWithId = (id: string) => {
  if (props.module === 'contacts') {
    console.log('opening contact...', id);
    contactDialogRef.value?.openDialogTab(id, 'Detalle del Contacto');
    return;
  }
  accountDialogRef.value?.openDialogAccountTab(id);
};

const openItem = (item: RowTableCINITModel) => {
  selectedRepeated.value = item;
  selectRepeatedDialog.value = true;
};
</script>

<template>
  <BaseDialog v-bind="$attrs" title="Coincidencias de CI">
    <template #body>
      <q-card flat>
        <q-card-section>
          <q-table
            dense
            flat
            :rows="data"
            :columns="currentColumns"
            row-key="name"
            hide-bottom
          >
            <template #body-cell-name="slotProps"
              ><q-td auto-width>
                <q-chip
                  clickable
                  class="primary"
                  icon="person"
                  @click="openDialogWithId(slotProps.row.id)"
                  :label="slotProps.row.name"
                />
              </q-td>
            </template>
            <template #body-cell-exposeBtn="slotProps">
              <q-td auto-width>
                <q-btn
                  @click="openItem(slotProps.row)"
                  color="primary"
                  size="sm"
                  icon="person_add"
                  round
                >
                  <q-tooltip
                    >{{ itemMessage }} {{ slotProps.row.name }}
                  </q-tooltip></q-btn
                >
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </template>
  </BaseDialog>
  <AlertComponent
    :title="selectedTitle"
    icon="warning"
    iconColor="warning"
    iconSize="50px"
    btn-color="warning"
    :btn-text="selectedButtonMsg"
    v-model="selectRepeatedDialog"
    @confirm="$emit('expose-selected', selectedRepeated)"
    @denegate="selectRepeatedDialog = false"
  >
    <template #body>
      <span class="q-py-sm">{{ selectedMessage }}</span>
    </template>
  </AlertComponent>
  <AccountDialog ref="accountDialogRef" />
  <ContactDialog ref="contactDialogRef" />
</template>
