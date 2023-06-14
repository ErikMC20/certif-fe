<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import { RowTableModel } from '../types';
import { HANSACRM3_URL } from 'src/conections/api_conectors';

const AccountDialog = defineAsyncComponent(
  () => import('../../modules/Accounts/components/Dialogs/AccountDialog.vue')
);
const ContactDialog = defineAsyncComponent(
  () => import('../../modules/Contacts/components/Dialogs/ContactDialog.vue')
);

const props = defineProps<{
  data: RowTableModel[];
  reservedId?: string;
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
    label: 'Celular',
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
    label: 'Fecha Creación',
    field: 'fcreacion',
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
  // {
  //   name: 'nro_principal',
  //   align: 'center',
  //   label: 'Nro. Principal',
  //   field: 'nro_principal',
  //   sortable: true,
  // },
];

const confirm = ref(false);

const accountDialogRef = ref<InstanceType<typeof AccountDialog> | null>(null);
const contactDialogRef = ref<InstanceType<typeof ContactDialog> | null>(null);

type module = 'Cuentas' | 'Contactos' | 'Prospectos';

const openDialogWithId = (id: string, module: module) => {
  if (!!props.reservedId && id === props.reservedId) return;
  if (module === 'Cuentas') {
    accountDialogRef.value?.openDialogAccountTab(id);
    return;
  }
  if (module === 'Contactos') {
    contactDialogRef.value?.openDialogTab(id, 'Detalle del Contacto');
    return;
  }
  if (module === 'Prospectos')
    window
      .open(
        `${HANSACRM3_URL}/index.php?module=Leads&action=DetailView&record=${id}`,
        '_blank'
      )
      ?.focus();
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
    class="my-sticky-column-table"
    title="Coincidencias encontradas"
    :rows="data"
    :columns="tableColumns"
    row-key="name"
    virtual-scroll
    :grid="$q.screen.xs || $q.screen.sm"
  >
    <template #body-cell-nombre="slotProps"
      ><q-td auto-width>
        <q-chip
          text-color="white"
          color="blue-6"
          size="sm"
          clickable
          class="primary"
          icon="person"
          @click="openDialogWithId(slotProps.row.id, slotProps.row.modulo)"
          :label="slotProps.row.nombre"
        >
          <q-tooltip v-if="slotProps.row.id === props.reservedId">
            ya se encuentra en este módulo
          </q-tooltip>
        </q-chip>
      </q-td>
    </template>
    <template #body-cell-email="slotProps">
      <q-td class="text-center text-teal" auto-width>
        {{ slotProps.row.email }}
      </q-td>
    </template>
    <template #body-cell-whatsapp="slotProps">
      <q-td class="text-center" auto-width>
        <q-icon
          name="whatsapp"
          :color="slotProps.row.whatsapp === '1' ? 'green' : 'grey'"
          size="sm"
        />
      </q-td>
    </template>
    <template #body-cell-idLead="slotProps">
      <q-td class="text-center">
        <a
          v-if="slotProps.row.idLead"
          :href="`${HANSACRM3_URL}/index.php?module=HANO_Lead&action=DetailView&record=${slotProps.row.idLead}`"
          target="_blank"
        >
          <q-chip color="orange" icon="directions" label="Ir a lead" />
        </a>
      </q-td>
    </template>
  </q-table>

  <AccountDialog ref="accountDialogRef" />
  <ContactDialog ref="contactDialogRef" />
</template>

<!-- .q-dialog__inner--minimized > div {
  max-width: max-content;
} -->

<style lang="sass">
.my-sticky-column-table
  thead tr:first-child th:first-child
    /* bg color is important for th; just specify one */
    background-color: #fff

  td:first-child
    background-color: #f5f5dc

  th:first-child,
  td:first-child
    position: sticky
    left: 0
    z-index: 1
</style>
