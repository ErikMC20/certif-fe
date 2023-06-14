<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { RelationInfoLead } from '../../utils/types';
  import { useReservasStore } from 'src/modules/Reservas/store/ReservasStore';
  import { useAsyncState } from '@vueuse/core';
  import { ReadLeadFormat } from '../../utils/types';
  import ViewCardVue from 'src/components/MainCard/ViewCard.vue';
  import {  QTableColumn } from 'quasar';
  const baseArticles = ref<InstanceType<typeof ViewCardVue> | null>(null);
  const reserveStore = useReservasStore();
  const props = withDefaults(
    defineProps < { 
      id?: string; 
      data?: RelationInfoLead } > (),
    {}
  );
  onMounted(async () => {
    await execute();
  });

  const { state, isLoading, execute } = useAsyncState(
    async () => {
      return await reserveStore.getProductQuotesReserve(props.id || '');
    },
    {} as ReadLeadFormat,
    { immediate: false }
  );

  const exposeData = () => {
  return state;
};

defineExpose({
  exposeData,
});

  const columns :QTableColumn[] = [
    { name: 'numero', align: 'center', label: 'Nro.', field: 'numero', sortable: true },
    { name: 'producto', align: 'left', label: 'Producto', field: 'producto', sortable: true },
    { name: 'chasisnumero', align: 'left', label: 'Descripción', field: 'chasisnumero', sortable: true },
    { name: 'precio', align: 'left', label: 'Precio', field: 'precio' },
  ]
</script>

<template>
  <view-card-component flat ref="baseArticles" :initial-status="id ? 'read' : 'edit'" icon-name="dashboard_customize"
    title="Productos" bordered >
    <template #edit>
    </template>
    <template #read>
      <div class="row q-col-gutter-lg q-py-md">
        <div class="col-12">
          <q-table flat :rows="state.data" :columns="columns" row-key="name" hide-bottom
         >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="numero" :props="props" class="text-bold">
                  {{ props.rowIndex+1 }}
                </q-td>
                <q-td key="producto" :props="props">                  
                  <p class="q-ma-none text-primary"><span class="text-bold"></span> {{ props.row.name || 'Sin registrar producto' }}</p>
                  <p class="q-ma-none text-caption"><span class="text-bold">Cantidad:</span> {{ props.row.product_qty || 'Sin registrar' }}</p>
                </q-td>
                <q-td key="chasisnumero" :props="props">
                  <p class="q-ma-none text-caption"><span class="text-bold">Chasis:</span> {{ props.row.chasis_c || 'Sin registrar' }}</p>
                  <p class="q-ma-none text-caption"><span class="text-bold">Color:</span> {{ props.row.nombre_color_c || 'Sin registrar' }}</p>
                  <p class="q-ma-none text-caption"><span class="text-bold">Gestión:</span> {{ props.row.gestion || 'Sin registrar' }}</p>
                  <p class="q-ma-none text-caption"><span class="text-bold">Almacen:</span> {{ props.row.almacen_c || 'Sin registrar' }}</p>
                </q-td>
                <q-td key="precio" :props="props">
                  <p class="q-ma-none text-caption"><span class="text-bold">Precio:</span> {{ props.row.product_list_price !=undefined ? props.row.product_list_price.toLocaleString('en-ES',{ minimumFractionDigits: 2}) :0}}</p>
                  <p class="q-ma-none text-caption"><span class="text-bold">Descuento:</span> {{ props.row.product_discount_amount || 'Sin registrar' }}</p>
                  <p class="q-ma-none text-caption"><span class="text-bold">Tipo descuento:</span> {{ props.row.discount || 'Sin registrar' }}</p>
                  <p class="q-ma-none text-caption"><span class="text-bold">Total:</span> {{ props.row.product_total_price !=undefined ? props.row.product_total_price.toLocaleString('en-ES',{ minimumFractionDigits: 2}) :0}}</p>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </div>
    </template>
  </view-card-component>
</template>