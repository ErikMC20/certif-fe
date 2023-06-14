<script setup lang="ts">
import { computed, ref, inject } from 'vue';
import { useQuasar, QTableColumn } from 'quasar';
import { useAsyncState } from '@vueuse/core';
import { useChangeCase } from '@vueuse/integrations/useChangeCase';
import { getRecordsByValue } from 'src/services/MeetingsServices';
import { SearchUser } from '../../../../types/index';
import { moduleKey, idModuleKey } from '../../../ProvideKeys';
import { getRelationBetweenModules } from 'src/services/GlobalService';
import { useMeetingActivity } from 'src/composables/core';
const props = withDefaults(
  defineProps<{
    modelValue: SearchUser[];
    module?: string;
    aMercadoInput?: boolean;
    gClienteInput?: boolean;
    getContactsBtn?: boolean;
  }>(),
  {
    module: '',
    aMercadoInput: false,
    gClienteInput: false,
  }
);

const emits = defineEmits<{
  (event: 'update:modelValue', value: SearchUser[]): void;
  (event: 'itemDeselected', idItem: string): void;
}>();

const currentModuleParent = ref(inject<string>(moduleKey));
const currentIdModuleParent = ref(inject<string>(idModuleKey));

const { formatModuleName } = useMeetingActivity();

const columns: QTableColumn[] = [
  {
    name: 'fullname',
    required: true,
    label: 'Nombre',
    align: 'left',
    field: (row) => row.fullname, // Dr XXX || {label: 'progreso de tarea', percentage: 0.53}
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'module',
    required: true,
    label: 'Módulo',
    align: 'left',
    field: (row) => row.module,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'phone',
    required: true,
    label: 'Teléfono Principal',
    align: 'left',
    field: (row) => row.phone,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'email_address',
    required: true,
    label: 'Email',
    align: 'left',
    field: (row) => row.email_address,
    format: (val: string) => `${val}`,
    sortable: true,
  },
];

//* dummy data
const aMercadoOptions = [
  {
    id: 1,
    label: 'Todas',
    value: '',
  },
  {
    id: 2,
    label: '01 Unidades Nuevas',
    value: '03_01',
  },
  {
    id: 3,
    label: '02 Repuestos y servicios',
    value: '03_02',
  },
  {
    id: 4,
    label: '03 Servicios Camiones',
    value: '03_03',
  },
  {
    id: 5,
    label: '04 Camiones y Buses',
    value: '03_04',
  },
  {
    id: 6,
    label: '05 Servicios Unid. Nuevas',
    value: '03_05',
  },
  {
    id: 7,
    label: '06 Audi',
    value: '03_06',
  },
  {
    id: 8,
    label: '07 Vehiculos Comerciales',
    value: '03_07',
  },
  {
    id: 9,
    label: '08 Repuestos Camiones',
    value: '03_08',
  },
  {
    id: 10,
    label: '09 Org. y Técnicas',
    value: '03_09',
  },
  {
    id: 11,
    label: 'Mod. Center',
    value: '03_10',
  },
  {
    id: 12,
    label: '11 Seminuevos',
    value: '03_11',
  },
  {
    id: 13,
    label: '12 Supervisión Talleres Camiones',
    value: '03_12',
  },
];

const grupoClienteOptions = [
  {
    id: 1,
    label: 'Todas',
    value: '',
  },
  {
    id: 2,
    label: 'Cliente Nuevo',
    value: '03_31',
  },
  {
    id: 3,
    label: 'Cliente Recompra',
    value: '03_34',
  },
  {
    id: 4,
    label: 'Cliente Antiguo',
    value: '03_36',
  },
];

//* composable variables
const {
  state,
  isLoading,
  execute: searchUser,
} = useAsyncState(
  async () => {
    if (contactOption.value === 'module') return await getContacts();
    const response = await getRecordsByValue(userFiltered.value, {
      module: props.module,
      user_iddivision: '03',
      user_idamercado: idmercadoFilter.value,
      user_idgrupocliente: idgrupoclienteFilter.value,
    });
    return response;
  },
  [] as SearchUser[],
  { immediate: false }
);

//* variables
const userFiltered = ref('');
const divisionFilter = ref('');
const idmercadoFilter = ref('');
const idgrupoclienteFilter = ref('');
const contactOption = ref<'' | 'module'>('');

const $q = useQuasar();

//* computed variables
const getRecords = computed<SearchUser[]>(() =>
  state.value.filter(
    (record, index, self) =>
      index === self.findIndex((value) => value.id === record.id)
  )
);

const selectedValues = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits('update:modelValue', value);
  },
});

//* methods
const deletedItem = (details: {
  rows: readonly SearchUser[];
  keys: readonly string[];
  added: boolean;
  evt: Event;
}): void => {
  if (!details.added) emits('itemDeselected', details.keys[0]);
};

const getContacts = async (): Promise<SearchUser[]> => {
  if (!!currentModuleParent.value) {
    try {
      const data = await getRelationBetweenModules(
        currentModuleParent.value,
        currentIdModuleParent.value || '',
        'contacts'
      );
      if (data.length === 0)
        $q.notify({
          type: 'warning',
          message: 'Sin Contactos',
          caption: 'No se han encontrado datos',
        });
      const contacts: SearchUser[] = data.map((rel) => ({
        id: rel.id,
        module: 'contacts',
        fullname: rel.attributes.full_name as string,
        phone: rel.attributes.phone_mobile as string,
        email_address: rel.attributes.email1 as string,
        title: rel.attributes.title as string,
      }));
      if (!!userFiltered.value) {
        return contacts.filter(
          (contact) =>
            contact.fullname.includes(userFiltered.value) ||
            contact.phone?.includes(userFiltered.value)
        );
      }
      return contacts;
    } catch (error) {
      $q.notify({
        type: 'error',
        message: 'Error en la peticion',
        caption: 'No se ha podido recuperar los datos',
      });
    }
  }
  return [] as SearchUser[];
};

const createContact = () => {
  console.log(
    'Creating contact with default values and bind this to the module'
  );
};

(() => {
  if (props.getContactsBtn) {
    contactOption.value = 'module';
    getContacts().then((value) => (state.value = value));
    columns.push({
      name: 'title',
      required: true,
      label: 'Cargo',
      align: 'left',
      field: (row) => row.title,
      format: (val: string) => `${val}`,
      sortable: true,
    });
  }
})();
</script>
<template>
  <q-card class="q-py-sm" flat>
    <q-card-section class="col-12 q-pa-none">
      <div class="row q-col-gutter-md">
        <div>
          <q-form
            @submit="() => searchUser()"
            class="q-gutter-md row items-center justify-between"
          >
            <q-input
              outlined
              v-model="userFiltered"
              dense
              clearable
              type="text"
              label="Buscar"
                     
            ></q-input>

            <q-select
              style="width: 12rem"
              outlined
              dense
              v-if="props.aMercadoInput"
              v-model="idmercadoFilter"
              :options="aMercadoOptions"
              map-options
              emit-value
              label="Area de mercado"
            />
            <q-select
              style="width: 12rem"
              outlined
              dense
              v-model="idgrupoclienteFilter"
              :options="grupoClienteOptions"
              v-if="props.gClienteInput"
              map-options
              emit-value
              label="Grupo cliente"
            />
            <div>
              <q-btn
                label="Buscar"
                color="primary"
                icon="search"
                type="submit"   
                size="sm"                  
              />
            </div>
          </q-form>
        </div>
        <div
          v-if="getContactsBtn && !!currentModuleParent && !!currentIdModuleParent"
          class="col-auto"
        >
          <q-radio
            v-model="contactOption"
            checked-icon="task_alt"
            unchecked-icon="panorama_fish_eye"
            val="module"
            label="Contactos del prospecto"
          />
          <q-radio
            v-model="contactOption"
            checked-icon="task_alt"
            unchecked-icon="panorama_fish_eye"
            val=""
            label="Todo el Sistema"
          />
        </div>
        <!-- <div class="col-auto">
          <q-btn
            color="primary"
            v-if="getContactsBtn && !!currentModuleParent && !!currentIdModuleParent"
            icon="contacts"
            label="Crear contacto"
            @click="createContact"
          />
        </div> -->
      </div>
    </q-card-section>
    <q-card-section class="col-12 q-px-none" v-if="getRecords.length>0">
      <q-table
        flat
        dense
        class="customScroll sticky-header-table"
        :rows="getRecords"
        :columns="columns"
        v-model:selected="selectedValues"
        row-key="id"
        selection="multiple"
        :rows-per-page-options="[0]"
        @selection="deletedItem"
      >
        <template #body-cell-fullname="slotProps">
          <q-td>
            <span text-color="primary">{{ slotProps.value }}</span>
          </q-td>
        </template>
        <template #body-cell-module="slotProps">
          <q-td>
            <q-chip
              color="primary"
              text-color="white"
              class="no-select"
              icon="badge"
              :label="formatModuleName(slotProps.value)"
              size="sm"
          /></q-td>
        </template>
        <template #body-cell-email_address="slotProps">
          <q-td>
            <span
              v-if="
                slotProps.value === 'null' ||
                slotProps.value === 'undefined' ||
                !slotProps.value
              "
              class="text-grey-6"
              >Sin Correo</span
            >
            <span v-else text-color="primary"> {{ slotProps.value }} </span>
          </q-td>
        </template>
        <template #body-cell-title="slotProps">
          <q-td>
            <span
              v-if="slotProps.value === 'null' || !slotProps.value"
              class="text-grey-6"
              >No asignado</span
            >
            <span v-else text-color="primary"> {{ slotProps.value }}</span>
          </q-td>
        </template>
        <template #no-data>
          <q-card class="my-card" flat >
            <q-card-section  >
              <q-icon  color="grey-6" size="lg"  />
              <span class="text-grey-6" style="font-size: medium"
                >No se encontraron datos en la busqueda...</span
              >
            </q-card-section>
          </q-card>
        </template></q-table
      >
    </q-card-section>

    <q-card-section class="col-12 q-px-none" v-else >
        <!-- <span class="text-grey-6" style="font-size: medium"
          >No se encontraron datos en la busqueda...</span
        > -->

        <q-carousel-slide name="style" class="column no-wrap flex-center">
       
        <div class="q-mt-md text-center text-grey-6">
          No se encontraron datos en la busqueda...
        </div>
      </q-carousel-slide>
    </q-card-section>

    <q-inner-loading
      :showing="isLoading"
      label="Obteniendo datos..."
      label-class="text-primary"
      label-style="font-size: 1.1em"
    />
  </q-card>
</template>

<style lang="scss" scoped>
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
  max-height: 46vh;

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
</style>
