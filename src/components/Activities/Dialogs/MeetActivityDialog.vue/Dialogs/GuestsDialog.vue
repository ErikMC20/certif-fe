<script lang="ts" setup>
import { ref, computed } from 'vue';
// import { QTableColumn } from 'quasar';
import { useAsyncState } from '@vueuse/core';
import { getRecordsByValue } from 'src/services/MeetingsServices';
import { SearchUser } from '../../../../types/index';
import UsersTable from '../Tables/UsersTable.vue';

type TabsModule = 'contacts' | 'users' | 'leads' | 'prospects';

const props = withDefaults(
  defineProps<{
    selected: SearchUser[];
    firstTab?: TabsModule;
    tabsFiltered?: TabsModule[];
    detail?: string;
  }>(),
  {
    firstTab: 'contacts',
    detail: 'Participantes',
  }
);

const emits = defineEmits<{
  (event: 'update:selected', value: SearchUser[]): void;
  (event: 'deleteGuest', idGuest: string): void;
}>();

//* varialbles
// const columns: QTableColumn[] = [
//   {
//     name: 'fullname',
//     required: true,
//     label: 'Name',
//     align: 'left',
//     field: (row) => row.fullname,
//     format: (val) => `${val}`,
//     sortable: true,
//   },
//   {
//     name: 'module',
//     required: true,
//     label: 'Módulo',
//     align: 'left',
//     field: (row) => row.module,
//     format: (val) => `${val}`,
//     sortable: true,
//   },
//   {
//     name: 'phone',
//     required: true,
//     label: 'Teléfono Principal',
//     align: 'left',
//     field: (row) => row.phone,
//     format: (val) => `${val}`,
//     sortable: true,
//   },
//   {
//     name: 'email_address',
//     required: true,
//     label: 'Email',
//     align: 'left',
//     field: (row: SearchUser) => row.email_address,
//     format: (val: string) => `${val}`,
//     sortable: true,
//   },
// ];

const tabs: {
  label: string;
  aMercadoInput?: boolean;
  gClienteInput?: boolean;
  getContactsBtn?: boolean;
  module: TabsModule;
}[] = [
  {
    label: 'Contactos',
    getContactsBtn: true,
    module: 'contacts',
  },
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
    label: 'Público Objetivo',
    module: 'prospects',
  },
];

const selectedTabs = computed(() => {
  return !props.tabsFiltered
    ? tabs
    : tabs.filter((tab) => props.tabsFiltered?.includes(tab.module));
});

const { isLoading } = useAsyncState(async () => {
  return await getRecordsByValue('');
}, [] as SearchUser[]);
// const selected = ref([] as SearchUser[]);
const selected = computed({
  get() {
    return props.selected;
  },
  set(value) {
    emits('update:selected', value);
  },
});

const tab = ref(props.firstTab);

// const userFiltered = ref('');

//* methods
// const searchUser = async () => {
//   try {
//     isLoading.value = true;
//     const data = await getRecordsByValue(userFiltered.value);
//     state.value = [...data];
//   } catch (error) {
//     console.log(error);
//   } finally {
//     isLoading.value = false;
//   }
// };

// const getRecords = computed(() =>
//   state.value.filter(
//     (record, index, self) =>
//       index === self.findIndex((value) => value.id === record.id)
//   )
// );

// const getColumns = computed((): QTableColumn[] => {
//   return getRecords.value.some((v) => !!v.email_address)
//     ? [...columns]
//     : columns;
// });

const removeFromSelected = (value: string) => {
  console.log(value);
  selected.value = selected.value.filter(
    (participant) => participant.id !== value
  );
  emits('deleteGuest', value);
};

// const openDialog = (): void => {
//   console.log('doing something...');
// };
</script>

<template>
  <q-dialog :maximized="$q.screen.lt.sm">
    <q-layout
      view="lHh LpR lff"
      container
      :style="{ 'max-height': $q.screen.lt.sm ? '100vh' : '95vh' }"
      style="height: 900px; width: 70rem; max-width: 100vw"
      class="bg-grey-3"
    >
      <q-header class="bg-primary text-white">
        <q-toolbar class="q-pa-lg">
          <q-btn
            v-if="$q.screen.lt.sm"
            color="primary"
            flat
            text-color="white"
            icon="arrow_back_ios"
            v-close-popup
          />
          <q-icon
            :class="$q.screen.lt.sm ? '' : 'q-ml-sm'"
            size="lg"
            name="group"
          />

          <q-toolbar-title>{{ props.detail }}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <q-tabs
          v-if="selectedTabs.length > 1"
          v-model="tab"
          dense
          class="text-white"
          active-color="white"
          indicator-color="white"
          align="justify"
          narrow-indicator
        >
          <q-tab
            v-for="(tabItem, index) in selectedTabs"
            :key="index"
            :name="tabItem.module"
            :label="tabItem.label"
          />
        </q-tabs>
        <q-separator />
      </q-header>

      <q-footer bordered class="bg-white text-primary q-pa-sm" align="right">
        <q-btn
          color="primary"
          icon="group_add"
          label="Confirmar"
          v-close-popup
        />
      </q-footer>

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
                    <div class="text-h6">{{ item.label }}</div>
                    <UsersTable
                      v-model="selected"
                      :module="item.module"
                      :a-mercado-input="item.aMercadoInput"
                      :g-cliente-input="item.gClienteInput"
                      :get-contacts-btn="item.getContactsBtn"
                      @item-deselected="(id: string) => $emit('deleteGuest', id)"
                    />
                  </q-tab-panel>
                </q-tab-panels>
              </q-card>
            </q-card-section>
            <q-card-section class="col-12">
              <span class="row text-subtitle2"
                >{{ props.detail }} seleccionados</span
              >
              <q-separator spaced inset dark />
              <div v-if="selected.length > 0">
                <q-chip
                  v-for="item in selected"
                  @remove="removeFromSelected(item.id || '')"
                  :key="item.id"
                  square
                  removable
                >
                  <q-avatar square color="primary" text-color="white">
                    {{
                      !!item.fullname
                        ? item.fullname.trim().charAt(0).toUpperCase()
                        : 'U'
                    }}
                  </q-avatar>
                  {{ item.fullname }}
                </q-chip>
              </div>
              <div v-else>
                <q-card flat>
                  <q-card-section class="text-grey-6">
                    <q-icon name="dataset" size="sm" /><span>
                      Aqui se mostraran los
                      {{ props.detail }} seleccionados</span
                    >
                  </q-card-section>
                </q-card>
              </div>

              <!-- <pre>{{ state }}</pre> -->
            </q-card-section>

            <q-inner-loading :showing="isLoading">
              <q-spinner-gears size="50px" color="primary" />
            </q-inner-loading>
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
