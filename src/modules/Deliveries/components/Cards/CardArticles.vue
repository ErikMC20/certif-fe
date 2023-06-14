<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { RelationInfoLead } from '../../utils/types';
  import { useDeliveriesStore } from 'src/modules/Deliveries/store/DeliveriesStore';
  import { api } from '../../../../boot/axios';
  import { useQuasar, QSpinnerPuff, QTableColumn } from 'quasar';
  import { userStore } from 'src/modules/Users/store/UserStore';
  const reserveStore = useDeliveriesStore();
  const $q = useQuasar();
  const props = withDefaults(
    defineProps < {
      id?: string;
      data?: RelationInfoLead
    } > (),
    {}
  );
  const list = ref([] as { [key: string]: string }[]);
  const listAux = ref([] as { [key: string]: string }[]);
  const UpdateSend = ref({
    attributes: {
      modified_user_id: '1',
      name: '1',
    },
  });
  const { userCRM } = userStore();
  onMounted(async () => {
    list.value = await reserveStore.getProductDeliveries(props.id || '');
    list.value = list.value.data;
    listAux.value = await reserveStore.getProductDeliveries(props.id || '');
    listAux.value = listAux.value.data;
  });
  const columns: QTableColumn[] = [
    { name: 'numero', align: 'left', label: 'Nro', field: 'numero', sortable: true },
    { name: 'producto', align: 'left', label: 'Producto', field: 'producto', sortable: true },
    { name: 'placa', align: 'left', label: 'Placa', field: 'placa' },
    { name: 'accion', align: 'left', label: 'Acción', field: 'accion' },
  ]
  const Updateplaca = async (val: string, id: string) => {
    $q.loading.show({
      spinner: QSpinnerPuff,
      message: 'Actualizando Placa',
    });
    UpdateSend.value.attributes.name = val;
    UpdateSend.value.attributes.modified_user_id = userCRM.id;
    
    const response = await api.patch(
      `${process.env.CRM4_LB_02}/placa-update/${id}`,
      UpdateSend.value
    );
    list.value = await reserveStore.getProductDeliveries(props.id);
    list.value = list.value.data;
    listAux.value = await reserveStore.getProductDeliveries(props.id);
    listAux.value = listAux.value.data;
    $q.loading.hide();
  };
  const updateSelected = (index: number) => {
    list.value[index].flag = 'edit';
  };
  const deleteSelected = (index: number) => {
    list.value[index].flag = 'read';
    list.value[index].placa = listAux.value[index].placa;
  };
</script>
<template>
  <view-card-component flat ref="baseCardRef2" :initial-status="id ? 'read' : 'edit'" icon-name="dashboard_customize"
    title="Productos" bordered>
    <template #edit>
    </template>
    <template #read>
      <div class="row q-col-gutter-lg q-py-md">
        <div class="col-12">
          <!-- <pre>{{ list }}</pre> -->
          <q-table flat :rows="list" :columns="columns" row-key="name" hide-bottom>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="numero" :props="props">
                  {{ props.rowIndex+1 }}
                </q-td>
                <q-td key="producto" :props="props">
                  <p class="q-ma-none text-bold text-primary"> {{ props.row.modelo }}</p>
                  <p class="q-ma-none"><span class="text-bold">Chasis:</span> {{ props.row.chasis }}</p>
                  <p class="q-ma-none"><span class="text-bold">Color:</span> {{ props.row.color }}</p>
                  <p class="q-ma-none"><span class="text-bold">Gestión:</span> {{ props.row.gestion }}</p>
                </q-td>
                <q-td key="placa" :props="props">
                  <q-input dense :outlined="props.row.flag == 'read' ? false:true" v-model="props.row.placa" type="text"
                    label="inserte la placa" :readonly="props.row.flag == 'read' ? true:false" />
                </q-td>
                <q-td key="accion" :props="props">
                  <q-btn color="green" round size="xs" class="q-mr-md" icon="check" v-if="props.row.flag =='edit'"
                    @click="Updateplaca(props.row.placa, props.row.id)">
                    <q-tooltip>
                      Guardar cambio
                    </q-tooltip>
                  </q-btn>
                  <q-btn size="xs" color="blue" class="q-mr-md" round icon="edit"
                    @click="updateSelected(props.rowIndex)" v-if="props.row.flag =='read'">
                    <q-tooltip>
                      Editar placa
                    </q-tooltip>
                  </q-btn>
                  <q-btn size="xs" color="red" round icon="close" @click="deleteSelected(props.rowIndex)"
                    v-if="props.row.flag !=='read'">
                    <q-tooltip>
                      Cancelar cambio
                    </q-tooltip>
                  </q-btn>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </div>
    </template>
  </view-card-component>
</template>