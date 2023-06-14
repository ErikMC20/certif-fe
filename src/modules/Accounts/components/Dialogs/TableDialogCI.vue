<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import { RowTableCINITModel } from '../../utils/types/index';

const AccountDialog = defineAsyncComponent(() => import('./AccountDialog.vue'));

defineProps<{
  data: RowTableCINITModel[];
}>();

const tableColumns: {
  name: keyof RowTableCINITModel;
  align: string;
  label: string;
  field: string;
  sortable?: boolean;
}[] = [
  // TODO FORMALIZAR ESTO al volver
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

// Dummy data
const confirm = ref(false);
// End dummy data

const accountDialogRef = ref<InstanceType<typeof AccountDialog> | null>(null);

const openDialogWithId = (id: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  accountDialogRef.value?.openDialogAccountTab(id);
};
</script>

<template>
  <!-- <q-btn color="primary" icon="check" label="OK" @click="confirm = true" /> -->
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
    :columns="tableColumns"
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
  </q-table>
  <AccountDialog ref="accountDialogRef" />
</template>
