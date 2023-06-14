<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { RelationInfoLead } from '../../utils/types';
  import { useReservasStore } from 'src/modules/Reservas/store/ReservasStore';
  import { useAsyncState } from '@vueuse/core';
  import { ReadLeadFormat } from '../../utils/types';
  const reserveStore = useReservasStore();
  const props = withDefaults(
    defineProps < {
      id?: string;
      data?: RelationInfoLead
    } > (),
    {}
  );
  onMounted(async () => {
    await execute();
  });

  const { state, isLoading, execute } = useAsyncState(
    async () => {
      return await reserveStore.getCommercilOfferQuotesReserve(props.id || '');
    },
    {} as ReadLeadFormat,
    { immediate: false }
  );


</script>

<template>
  <view-card-component flat ref="baseCardRef" :initial-status="id ? 'read' : 'edit'" icon-name="attach_money"
    title="Oferta comercial propuesta en la cotización" bordered>
    <template #edit>
    </template>
    <template #read>
      <q-card class="my-card q-pa-md" flat>
        <div class="row q-col-gutter-sm" v-for="(reg,index) in state.data " :key="index">
          <q-input readonly class="col-12 col-sm-6 " outlined dense v-model="reg.formaPago" type="text"
            label="Forma de pago" />
          <q-input readonly class="col-12 col-sm-6 " outlined dense v-model="reg.garantia" type="text"
            label="Garantia" />
          <q-input readonly class="col-12 col-sm-6 " outlined dense v-model="reg.servicioPostVenta" type="text"
            label="Servicio Post venta" />
        </div>
      </q-card>

    </template>
  </view-card-component>
</template>