<script lang="ts" setup>
import { ref, computed } from 'vue';
// import { QTableColumn } from 'quasar';
// import { useAsyncState } from '@vueuse/core';
// import { useActivityStore } from 'src/stores/ActivityStore';
// import UsersTable from '../../MeetActivityDialog.vue/Tables/UsersTable.vue';
import TablePhonesContact from '../Dialog/TablePhonesContact.vue';
import { SearchUser } from '../../../../../components/types/index';
// const props = defineProps<{
//   buscarConta: boolean;
// }>();
// const storeCall = useActivityStore();
// const listaCont = ref();
// const idCallRecu = ref();
const props = defineProps<{
  selected: SearchUser[];
  idCall: string;
}>();

const tab = ref('contacts');
// const emits = defineEmits<{}>();

const datasend = ref();
const numeroCall = ref();

const selected = computed({
  get() {
    return props.selected;
  },
  set(value) {
    // emits('update:selected', value);
  },
});

const tabs: {
  label: string;
  aMercadoInput?: boolean;
  gClienteInput?: boolean;
  getContactsBtn?: boolean;
  module: string;
}[] = [
  {
    label: 'Usuarios',
    aMercadoInput: true,
    gClienteInput: true,
    module: 'users',
  },
  {
    label: 'Prospectos',
    module: 'leads',
  },
  {
    label: 'Contactos',
    getContactsBtn: true,
    module: 'contacts',
  },
  {
    label: 'Público Objetivo',
    module: 'prospects',
  },
];
//CREANDO LOS DATOS PARA ENVIARLOS
// onMounted(async () => {
//   idCallRecu.value = props.idCall;
//   const data = await storeCall.getPhonesRelaContactPro(
//     'Leads',
//     '10d55dbe-63d4-aaa8-76b5-5a15fa9f54f6'
//   );

//   const data2 = data.map((el) => {
//     return {
//       nombre: el.contact_attributes.name,
//       id: el.contact_id,
//       phones: [
//         ...el.phonesForContact.map((el2) => {
//           return {
//             tipo: el2.column_label,
//             name: el2.column_name,
//             phone: el2.phone,
//           };
//         }),
//         ...el.phonesForPhones.map((el3) => {
//           return {
//             tipo: el3.description,
//             name: '',
//             phone: el3.phone,
//           };
//         }),
//       ],
//     };
//   });
// });
const numeronuevoC = (val: any) => {
  // console.log(val);
  numeroCall.value = val;
  // console.log(numeroCall.value.telefononuevo.phone);
  numeroCall.value = datasend.value = numeroCall.value.telefononuevo.phone;
  // data.value.idrelaUserCall = relacionCall.value.idrelaUser;
  emit('enviandotele', numeroCall.value);
};
const emit = defineEmits<{ (event: 'enviandotele', datased: any): void }>();
defineExpose({
  // openDialog,
});
</script>

<template>
  <q-dialog :maximized="$q.screen.lt.sm">
    <q-layout
      view="lHh LpR lff"
      container
      :style="{ 'max-height': $q.screen.lt.sm ? '50vh' : '95vh' }"
      class="bg-grey-3"
    >
      <q-header class="bg-primary">
        <q-toolbar>
          <q-btn
            v-if="$q.screen.lt.sm"
            color="primary"
            flat
            text-color="white"
            icon="contact_phone"
            v-close-popup
          />
          <q-icon
            :class="$q.screen.lt.sm ? '' : 'q-ml-sm'"
            size="lg"
            name="group"
          />
          <q-separator spaced inset vertical />
          <q-toolbar-title>Teléfonos del Prospecto</q-toolbar-title>
          <q-btn
            dense
            flat
            color="white"
            :icon="!$q.screen.xs ? 'close' : 'arrow_back_ios'"
            v-close-popup
          >
            <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-toolbar>
        <q-tabs
          v-model="tab"
          dense
          class="text-white"
          active-color="white"
          indicator-color="white"
          align="justify"
          narrow-indicator
        >
          <q-tab name="contacts" label="Contactos" />
        </q-tabs>

        <q-separator />
      </q-header>

      <q-page-container>
        <q-page class="q-pa-none">
          <q-card
            style="min-height: inherit"
            flat
            class="xl-dialog row justify-between"
          >
            <q-card-section class="full-width q-py-none">
              <q-card flat>
                <q-tab-panels
                  class="q-px-none"
                  v-model="tab"
                  keep-alive
                  animated
                >
                  <q-tab-panel
                    v-for="item in tabs"
                    :key="item.module"
                    :name="item.module"
                  >
                    <!-- <div class="text-h6">{{ item.label }}</div> -->
                    <TablePhonesContact
                      v-model="selected"
                      :idCallRecuTable="props.idCall"
                      @numeronuevo="numeronuevoC"
                    />
                  </q-tab-panel>
                </q-tab-panels>
              </q-card>
            </q-card-section>
            <!-- <q-inner-loading :showing="isLoading">
              <q-spinner-gears size="50px" color="primary" />
            </q-inner-loading> -->
          </q-card>
        </q-page>

        <q-page-scroller position="bottom">
          <q-btn fab icon="keyboard_arrow_up" color="red" />
        </q-page-scroller>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<style lang="scss" scoped>
// .xl-dialog {
//   width: 1000px;
//   min-height: inherit;
//   max-width: 100vw;
//   height: 800px;
//   max-height: 95vh;
// }

.customScroll {
  /* width */
  ::-webkit-scrollbar {
    width: 5px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
}

.custom-body {
  overflow-y: auto;
  /* width */
  ::-webkit-scrollbar {
    width: 5px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
}

.sticky-header-table {
  /* height or max-height is important */
  height: 310px;

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    background-color: #c1f4cd;
  }
  thead tr th {
    position: sticky;
    z-index: 1;
  }
  thead tr:first-child th {
    top: 0;
  }
  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px;
  }
}

.full-width {
  width: -webkit-fill-available;
}
</style>
