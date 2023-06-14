<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import { RowTableModel } from '../../utils/types/index';
import { HANSACRM3_URL } from 'src/conections/api_conectors';

const AccountDialog = defineAsyncComponent(() => import('./AccountDialog.vue'));

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
    name: 'celular',
    align: 'center',
    label: 'Correo',
    field: 'celular',
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
    name: 'idLead',
    align: 'left',
    label: 'Lead',
    field: 'idLead',
    sortable: true,
  },
  {
    name: 'whatsapp',
    align: 'right',
    label: 'Whatsapp',
    field: 'whatsapp',
    sortable: true,
  },
  {
    name: 'fcreacion',
    align: 'center',
    label: 'Nombre',
    field: 'fcreacion',
    sortable: true,
  },
  {
    name: 'nameLead',
    align: 'center',
    label: 'Lead',
    field: 'nameLead',
    sortable: true,
  },

  {
    name: 'estadoLead',
    align: 'center',
    label: 'Estado Lead',
    field: 'estadoLead',
    sortable: true,
  },
  {
    name: 'idCampania',
    align: 'center',
    label: 'Campaña',
    field: 'idCampania',
    sortable: true,
  },
  {
    name: 'nameCampania',
    align: 'left',
    label: 'Nombre de Campaña',
    field: 'nameCampania',
    sortable: true,
  },
  {
    name: 'asignado',
    align: 'center',
    label: 'Asignado',
    field: 'asignado',
    sortable: true,
  },
  {
    name: 'nro_principal',
    align: 'center',
    label: 'Nro. Principal',
    field: 'nro_principal',
    sortable: true,
  },
];

// Dummy data
const confirm = ref(false);
// End dummy data

const accountDialogRef = ref<InstanceType<typeof AccountDialog> | null>(null);

const openDialogWithId = (id: string, module: string) => {
  if (module === 'Cuentas') {
    accountDialogRef.value?.openDialogAccountTab(id);
    return;
  }
  confirm.value = true;
};
</script>

<template>
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
    class="full-width"
    row-key="name"
    virtual-scroll
    hide-bottom
  >
    <template #body-cell-nombre="slotProps"
      ><q-td auto-width>
        <q-chip
          clickable
          class="primary"
          icon="person"
          @click="openDialogWithId(slotProps.row.id, slotProps.row.modulo)"
          :label="slotProps.row.nombre"
        />
      </q-td>
    </template>
    <template #body-cell-whatsapp="slotProps">
      <q-td class="text-center" auto-width>
        <q-icon
          name="whatsapp"
          :color="slotProps.row.whatsapp === '1' ? 'green' : 'gray'"
          size="sm"
        />
      </q-td>
    </template>
    <template #body-cell-idLead="slotProps">
      <q-td class="text-center">
        <a
          v-if="slotProps.row.idLead"
          :href="`${HANSACRM3_URL}/index.php?module=AOS_Quotes&action=DetailView&record=${slotProps.row.idLead}`"
          target="_blank"
        >
          <q-chip color="orange" icon="directions" label="Ir a lead" />
        </a>
      </q-td>
    </template>
  </q-table>
  <AccountDialog ref="accountDialogRef" />
</template>

<style lang="scss">
.q-dialog__inner--minimized > div {
  max-width: max-content;
}
</style>
