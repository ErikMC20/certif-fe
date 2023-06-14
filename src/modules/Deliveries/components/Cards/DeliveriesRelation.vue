<script lang="ts" setup>
import { ref, onMounted,computed } from 'vue';
import { RelationInfoLead } from '../../utils/types';
import ViewCardVue from 'src/components/MainCard/ViewCard .vue';
import AccountRelationCard from 'src/modules/Leads/components/Cards/AccountRelationCard.vue';
import ContactRelationCard from 'src/modules/Leads/components/Cards/ContactRelationCard.vue';
import HANOReservasRelationCard from 'src/modules/Leads/components/Cards/HANOReservasRelationCard.vue';
import { useAsyncState } from '@vueuse/core';
import { useDeliveriesStore } from 'src/modules/Deliveries/store/DeliveriesStore';
const props = withDefaults(
  defineProps<{ id?: string; data?: RelationInfoLead }>(),
  {}
);
const deliveyStore = useDeliveriesStore();
const baseCardRef = ref<InstanceType<typeof ViewCardVue> | null>();
const isEditing = computed(() => baseCardRef.value?.isEditing === 'edit');
const leadRelations = ref(
  !!props.data
    ? { ...props.data }
    : ({
        account_id_c: '',
        contact_id_c: '',
        lead_id1_c: '',
      } as RelationInfoLead)
);

onMounted(async () => {
    await execute();
  });

  const { state, isLoading, execute } = useAsyncState(
    async () => {
      return await deliveyStore.getRelationDelivery(props.id || '');
    },
    {} as any,
    { immediate: false }
    );

const exposeData = () => {
  return leadRelations.value;
};

//const uno =ref('C35B288A-8ABE-40E7-B562-8FC6EE78441C');

const restoreData = () => {
  leadRelations.value = {
    account_id_c: props.data?.account_id_c || '',
    contact_id_c: props.data?.contact_id_c || '',
    lead_id1_c: props.data?.lead_id1_c || '',
  };
};

defineExpose({
  exposeData,
  isEditing,
});
</script>

<template>
  <view-card-component
    
    ref="baseCardRef2"
    :initial-status="id ? 'read' : 'edit'"
    icon-name="groups"
    title="Relaciones con la entrega"
    @cancel-change="restoreData"
  >
    <template #edit>
      <div class="row q-col-gutter-lg q-py-md">
        
      </div>
    </template>
    <template #read>
      <div class="row q-col-gutter-lg q-py-md" v-for="(reg,index) in state.data " :key="index">
        <div :class="$q.screen.xs ? 'col-12':'col-6'">
          <AccountRelationCard
            v-model:id="reg.idCuenta"
            module-name="Cuenta"
          />
        </div>
        <div :class="$q.screen.xs ? 'col-12':'col-6'">
          <ContactRelationCard
            v-model:id="reg.idContacto"
            module-name="Contacto"
          />
        </div>
        <div class="col-12">
          <HANOReservasRelationCard
            v-model:id="reg.idReserva"
            module-name="Reserva"
          />
        </div>
    </div>
    </template>
  </view-card-component>
</template>
