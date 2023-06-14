<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
// import { useQuasar } from 'quasar';
import { SearchUser } from '../../../../../components/types/index';
import { useActivityStore } from 'src/stores/ActivityStore';

const storeCall = useActivityStore();
// const listPhonesPro = ref();

const id = ref();
const idcall = ref();
// const $q = useQuasar();
const loads = ref(true);
const props = withDefaults(
  defineProps<{
    modelValue: SearchUser[];
    module?: string;
    aMercadoInput?: boolean;
    gClienteInput?: boolean;
    getContactsBtn?: boolean;
    idCallRecuTable?: string;
  }>(),
  {
    module: '',
    aMercadoInput: false,
    gClienteInput: false,
  }
);

const data = ref({
  telefononuevo: '',
});
// mounted(async () => {
//   loads.value = false;
// });
onMounted(async () => {
  cargandoContac();
});

const cargandoContac = async () => {
  idcall.value = props.idCallRecuTable;
  console.log(props.idCallRecuTable);
  const data = await storeCall.getPhonesRelaContactPro(
    'Leads',
    '10d55dbe-63d4-aaa8-76b5-5a15fa9f54f6'
  );
  // const data = await storeCall.getPhonesRelaContactPro(
  //   'Leads',
  //   props.idCallRecuTable
  // );

  id.value = data.map((el) => {
    return {
      nombre: el.contact_attributes.name,
      titulo: el.contact_attributes.salutation,
      modulo: 'Contactos',
      id: el.contact_id,
      phones: [
        ...el.phonesForContact.map((el2) => {
          return {
            tipo: el2.column_label,
            name: el2.column_name,
            phone: el2.phone,
          };
        }),
        ...el.phonesForPhones.map((el3) => {
          return {
            tipo: el3.description,
            name: '',
            phone: el3.phone,
          };
        }),
      ],
    };
  });
  // userFiltered.value = props.idCallRecuTable;
  // console.log(idcall.value, id.value, props.idCallRecuTable);

  loads.value = false;
};

watch(
  () => data.value.telefononuevo,
  async () => {
    // emailDialog.value.open = !emailDialog.value.open;
    // console.log(data.value.telefononuevo);
    emit('numeronuevo', data.value);
  }
);
const emit = defineEmits<{ (event: 'numeronuevo', datased: any): void }>();

const exposeData = () => {
  return data.value;
};

defineExpose({
  exposeData,
});

const columns2 = [
  // {
  //   name: 'titulo',
  //   required: true,
  //   label: 'Sr.',
  //   align: 'left',
  //   field: 'tilulo',
  //   // field: (row) => row.nombre,
  //   // format: (val) => `${val}`,
  //   sortable: true,
  // },
  {
    name: 'nombre',
    required: true,
    label: 'Nombre del contacto',
    align: 'center',
    field: 'nombre',
    // field: (row) => row.nombre,
    // format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: 'id',
    required: true,
    align: 'left',
    label: 'Modulo',
    field: 'modulo',
    sortable: true,
  },
];
</script>
<template>
  <q-card class="q-py-sm" flat>
    <!-- <q-card-section class="col-12 q-pa-none">
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
            <div>
              <q-btn
                round
                color="primary"
                icon="search"
                type="submit"
                size="xs"
                outline
              />
            </div>
          </q-form>
        </div>
      </div>
    </q-card-section> -->
    <q-card-section class="col-12 q-px-none">
      <q-table
        title="Contactos"
        :rows="id"
        :columns="columns2"
        row-key="nombre"
        :loading="loads"
        class="my-sticky-header-table"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn
                size="sm"
                color="accent"
                round
                dense
                @click="props.expand = !props.expand"
                :icon="props.expand ? 'remove' : 'add'"
              >
              </q-btn>
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
          </q-tr>
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div>
                <q-select
                  v-model="data.telefononuevo"
                  :options="props.row.phones"
                  label="Teléfonos"
                  option-value="phone"
                  option-label="phone"
                  transition-show="flip-up"
                  transition-hide="flip-down"
                  color="primary"
                >
                  <template #before>
                    <q-icon name="add_ic_call" />
                  </template>
                  <template v-slot:option="scope">
                    <q-item
                      v-bind="scope.itemProps"
                      v-if="scope.opt.phone != ''"
                    >
                      <q-item-section avatar>
                        <q-icon
                          name="phone_forwarded"
                          color="primary"
                          size="sm"
                        />
                      </q-item-section>
                      <q-item-section>
                        <!-- <q-separator /> -->
                        <q-item-label>{{ scope.opt.phone }}</q-item-label>
                        <q-item-label caption v-if="scope.opt.tipo != ''">
                          <!-- {{ nombrestele.value.find((elem) => elem.cod_tel == '02').label }} -->

                          {{ scope.opt.tipo }}
                        </q-item-label>
                        <q-item-label caption v-else
                          >Telefono Secundario</q-item-label
                        >
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <!-- <pre>{{ id }}</pre> -->
    </q-card-section>
  </q-card>
</template>

<style lang="sass" scoped>
.my-sticky-column-table
  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
  max-width: 600px

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
