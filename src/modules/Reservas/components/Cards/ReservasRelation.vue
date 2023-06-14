<script lang="ts" setup>
import { ref, computed } from 'vue';
import { RelationInfoLead } from '../../utils/types';
import ViewCardVue from 'src/components/MainCard/ViewCard .vue';
import AccountRelationCard from 'src/modules/Leads/components/Cards/AccountRelationCard.vue';
import ContactRelationCard from 'src/modules/Leads/components/Cards/ContactRelationCard.vue';
import OpportunitiesRelationCard from 'src/modules/Leads/components/Cards/OpportunitiesRelationCard.vue';
import AOSQuotesRelationCard from 'src/modules/Leads/components/Cards/AOSQuotesRelationCard.vue';


const props = withDefaults(
  defineProps<{ id?: string; data?: RelationInfoLead }>(),
  {}
);

const baseCardRef = ref<InstanceType<typeof ViewCardVue> | null>();

const isEditing = computed(() => baseCardRef.value?.isEditing === 'edit');

const leadRelations = ref(
  !!props.data
    ? { ...props.data }
    : ({
        hanq_reservas_accountsaccounts_ida: '',
        hanq_reservas_contactscontacts_ida: '',
        hanq_reservas_opportunitiesopportunities_ida: '',
        hanq_reservas_aos_quotesaos_quotes_idb:'',
      } as RelationInfoLead)
);

const exposeData = () => {
  return leadRelations.value;
};

const restoreData = () => {
  leadRelations.value = {
    hanq_reservas_accountsaccounts_ida: props.data?.hanq_reservas_accountsaccounts_ida || '',
    hanq_reservas_contactscontacts_ida: props.data?.hanq_reservas_contactscontacts_ida || '',
    hanq_reservas_opportunitiesopportunities_ida: props.data?.hanq_reservas_opportunitiesopportunities_ida || '',
    hanq_reservas_aos_quotesaos_quotes_idb: props.data?.hanq_reservas_aos_quotesaos_quotes_idb || '',
  };
};

defineExpose({
  exposeData,
  isEditing,
});
</script>

<template>
    <!-- :controls="!!id" -->

  <view-card-component
    ref="baseCardRef"
    :initial-status="id ? 'read' : 'edit'"
    icon-name="groups"
    title="Información comercial con la reserva"
    @cancel-change="restoreData"
  >
    <template #edit>
      <div class="row q-col-gutter-lg q-py-md">
        <div :class="$q.screen.xs ? 'cols-12':'cols-6'" >
          <AccountRelationCard
            v-model:id="leadRelations.hanq_reservas_accountsaccounts_ida"
            module-name="Cuenta"
            edit-mode
          />
        </div>
        <div :class="$q.screen.xs ? 'col-12':'col-6'">
          <ContactRelationCard
            v-model:id="leadRelations.hanq_reservas_contactscontacts_ida"
            module-name="Contacto"
            :account-id="leadRelations.hanq_reservas_accountsaccounts_ida"
            edit-mode
          />
        </div>
        <div :class="$q.screen.xs ? 'col-12':'col-6'">
          <OpportunitiesRelationCard
            v-model:id="leadRelations.hanq_reservas_opportunitiesopportunities_ida"
            module-name="Oportunidad"
            edit-mode
          />
        </div>
        <div :class="$q.screen.xs ? 'col-12':'col-6'">
          <AOSQuotesRelationCard
            v-model:id="leadRelations.hanq_reservas_aos_quotesaos_quotes_idb"
            module-name="Cotizacion"
            edit-mode
          />
        </div>
       
      </div>
    </template>
    <template #read>
      <div class="row q-col-gutter-lg q-py-md">
        <div :class="$q.screen.xs ? 'col-12':'col-6'">
          <AccountRelationCard
            v-model:id="leadRelations.hanq_reservas_accountsaccounts_ida"
            module-name="Cuenta"
          />
        </div>
        <div :class="$q.screen.xs ? 'col-12':'col-6'">
          <ContactRelationCard
            v-model:id="leadRelations.hanq_reservas_contactscontacts_ida"
            module-name="Contacto"
          />
        </div>
        <div :class="$q.screen.xs ? 'col-12':'col-6'">
          <OpportunitiesRelationCard
            v-model:id="leadRelations.hanq_reservas_opportunitiesopportunities_ida"
            module-name="Oportunidad"
          />
        </div>
          <div :class="$q.screen.xs ? 'col-12':'col-6'">
          <AOSQuotesRelationCard
            v-model:id="leadRelations.hanq_reservas_aos_quotesaos_quotes_idb"
            module-name="Cotizacion"
          />
      </div>
    </div>
    </template>
  </view-card-component>
</template>
