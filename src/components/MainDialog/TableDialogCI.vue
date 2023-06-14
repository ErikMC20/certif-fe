<script setup lang="ts">
import { ref, defineAsyncComponent, computed } from 'vue';
import { RowTableCINITModel, RowTableCINITContactModel } from '../types';
import AlertComponent from '../MainAlert/AlertComponent.vue';

const AccountDialog = defineAsyncComponent(
  () => import('../../modules/Accounts/components/Dialogs/AccountDialog.vue')
);
const ContactDialog = defineAsyncComponent(
  () => import('../../modules/Contacts/components/Dialogs/ContactDialog.vue')
);

const props = withDefaults(
  defineProps<{
    data: RowTableCINITModel[];
    module?: 'accounts' | 'contacts';
    exposeBtn?: boolean;
    messageBtn?: string;
    titleDialog?: string;
    confirmDialogBtn?: string;
    messageDialog?: string;
  }>(),
  {
    module: 'accounts',
    exposeBtn: false,
    messageBtn: 'Exponer:  ',
    titleDialog: '¿Asignar Cuenta?',
    confirmDialogBtn: 'Si, asignar',
    messageDialog: '¿Está seguro de asignar esta cuenta?',
  }
);

defineEmits<{
  (event: 'expose-selected', value: RowTableCINITModel): void;
}>();

const tableColumns: {
  name: keyof RowTableCINITModel;
  align: string;
  label: string;
  field: string;
  sortable?: boolean;
}[] = [
  {
    name: 'nit_ci',
    align: 'left',
    label: 'NIT/CI',
    field: 'nit_ci',
    sortable: true,
  },
  {
    name: 'name',
    align: 'center',
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

const tableColumnsContact: {
  name: keyof RowTableCINITContactModel;
  align: string;
  label: string;
  field: string;
  sortable?: boolean;
}[] = [
  {
    name: 'ci',
    align: 'left',
    label: 'CI',
    field: 'ci',
    sortable: true,
  },
  {
    name: 'name',
    align: 'center',
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

const currentColumns = computed(() => {
  const baseColumns = [];
  if (props.exposeBtn)
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

// Dummy data
const confirm = ref(false);
// End dummy data

const accountDialogRef = ref<InstanceType<typeof AccountDialog> | null>(null);
const contactDialogRef = ref<InstanceType<typeof ContactDialog> | null>(null);

const selectRepeatedDialog = ref(false);
const selectedRepeated = ref({} as RowTableCINITModel);

const openRepeatedDialog = (val: RowTableCINITModel) => {
  selectedRepeated.value = val;
  selectRepeatedDialog.value = true;
};
const openDialogWithId = (id: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (props.module === 'contacts') {
    console.log('opening contact...', id);
    contactDialogRef.value?.openDialogTab(id, 'Detalle del Contacto');
    return;
  }
  accountDialogRef.value?.openDialogAccountTab(id);
};
</script>

<template>
  <!-- <q-btn color="primary" icon="check" label="OK" @click="confirm = true" /> -->
  <!-- <pre>{{ data }}</pre> -->
  <q-dialog v-model="confirm" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="info" color="primary" text-color="white" />
        <span class="q-ml-sm">PROXIMAMENTE NUEVO DIALOG</span>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cerrar" color="primary" v-close-popup />
        <q-btn flat label="Aceptar" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-table
    title="Coincidencias"
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
          @click="openRepeatedDialog(slotProps.row)"
          color="primary"
          icon="assignment"
          round
        >
          <q-tooltip
            >{{ messageBtn }} {{ slotProps.row.name }}
          </q-tooltip></q-btn
        >
      </q-td>
    </template>
  </q-table>

  <AlertComponent
    :title="titleDialog"
    icon="warning"
    iconColor="positive"
    iconSize="50px"
    btn-color="positive"
    :btn-text="confirmDialogBtn"
    v-model="selectRepeatedDialog"
    @confirm="$emit('expose-selected', selectedRepeated)"
    @denegate="selectRepeatedDialog = false"
  >
    <template #body>
      <span class="q-py-sm">{{ messageDialog }}</span>
    </template>
  </AlertComponent>
  <AccountDialog ref="accountDialogRef" />
  <ContactDialog ref="contactDialogRef" />
</template>
