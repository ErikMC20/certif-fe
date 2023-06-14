<script lang="ts">
import { ref } from 'vue';
import { RowTableModel } from '../../utils/types/index';
import ContactDialog from './ContactDialog.vue';
</script>

<script setup lang="ts">
defineProps<{
  data: RowTableModel[];
}>();

const tableColumns: {
  name: keyof RowTableModel;
  align: string;
  label: string;
  field: string;
  sortable?: boolean;
}[] = [
  {
    name: 'modulo',
    align: 'left',
    label: 'Módulo',
    field: 'modulo',
    sortable: true,
  },
  {
    name: 'nombre',
    align: 'center',
    label: 'Nombre',
    field: 'nombre',
    sortable: true,
  },
  {
    name: 'telefono',
    align: 'center',
    label: 'Teléfono',
    field: 'telefono',
    sortable: true,
  },
  {
    name: 'email',
    align: 'center',
    label: 'Correo',
    field: 'email',
    sortable: true,
  },
  {
    name: 'actions',
    align: 'center',
    label: 'Acciones',
    field: 'actions',
  },
];

// Dummy data
const confirm = ref(false);
// End dummy data

const contactDialogRef = ref<InstanceType<typeof ContactDialog> | null>(null);

const openDialogWithId = (id: string, module: string) => {
  if (module === 'Cuentas') {
    contactDialogRef.value?.openDialogWithId(id);
    return;
  }
  confirm.value = true;
};
</script>

<template>
  <div class="q-pa-md">
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
    >
      <template #body-cell-actions="slotProps"
        ><q-td auto-width>
          <q-btn
            size="xs"
            round
            color="primary"
            icon="info"
            @click="openDialogWithId(slotProps.row.id, slotProps.row.modulo)"
          />
        </q-td>
      </template>
    </q-table>

    <ContactDialog ref="contactDialogRef" />
  </div>
</template>
