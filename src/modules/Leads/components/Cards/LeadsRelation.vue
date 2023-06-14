<script lang="ts" setup>
import { ref, computed } from 'vue';
import { RelationInfoLead } from '../../utils/types';
import ViewCardVue from 'src/components/MainCard/ViewCard .vue';
import AccountRelationCard from './AccountRelationCard.vue';
import ContactRelationCard from './ContactRelationCard.vue';
import ProspectRelationCard from './ProspectRelationCard.vue';
const props = withDefaults(
  defineProps<{ id?: string; data?: RelationInfoLead; readMode?: boolean }>(),
  {
    readMode: false,
  }
);

const baseCardRef = ref<InstanceType<typeof ViewCardVue> | null>();
const accountRelationCardRef = ref<InstanceType<typeof AccountRelationCard> | null>();
const contactRelationCardRef = ref<InstanceType<typeof ContactRelationCard> | null>();
const prospectRelationCardRef = ref<InstanceType<typeof ProspectRelationCard> | null>();

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

const exposeData = () => {
  return leadRelations.value;
};

const restoreData = () => {
  leadRelations.value = {
    account_id_c: props.data?.account_id_c || '',
    contact_id_c: props.data?.contact_id_c || '',
    lead_id1_c: props.data?.lead_id1_c || '',
  };
};

const resetAllCards = () => {
  accountRelationCardRef.value?.reset();
  contactRelationCardRef.value?.reset();
  prospectRelationCardRef.value?.reset();
};

const validateCards = () => {
  const validatedCards = [
    contactRelationCardRef.value?.validate(),
    accountRelationCardRef.value?.validate(),
    prospectRelationCardRef.value?.validate(),
  ].some((card) => !!card);

  if (validatedCards) {
    resetAllCards();
  }

  return validatedCards;
};

const reset = (id: string) => {
  resetAllCards();
};

const exposeAllData = () => ({
  account: accountRelationCardRef.value?.state,
  contact: contactRelationCardRef.value?.state,
  prospect: prospectRelationCardRef.value?.state,
});

defineExpose({
  exposeData,
  exposeAllData,
  isEditing,
  validateCards,
});
</script>

<template>
  <view-card-component
    :controls="!!id && !readMode"
    ref="baseCardRef"
    :initial-status="id ? 'read' : 'edit'"
    icon-name="connect_without_contact"
    title="Relaciones del Lead"
    @cancel-change="restoreData"
  >
    <template #edit>
      <div class="row q-col-gutter-lg q-py-md">
        <div class="col-12">
          <AccountRelationCard
            ref="accountRelationCardRef"
            v-model:id="leadRelations.account_id_c"
            module-name="Cuenta"
            edit-mode
            @update:id="reset"
            error-message="Se necesita una cuenta"
          />
        </div>
        <div class="col-12">
          <ContactRelationCard
            ref="contactRelationCardRef"
            v-model:id="leadRelations.contact_id_c"
            module-name="Contacto"
            :account-id="leadRelations.account_id_c"
            edit-mode
            @update:id="reset"
            error-message="Se necesita un contacto"
          />
        </div>
        <div class="col-12">
          <ProspectRelationCard
            ref="prospectRelationCardRef"
            v-model:id="leadRelations.lead_id1_c"
            module-name="Prospecto"
            edit-mode
            @update:id="reset"
            error-message="Se necesita un prospecto"
          />
        </div>
      </div>
    </template>
    <template #read>
      <div class="row q-col-gutter-lg q-py-md">
        <div class="col-12">
          <AccountRelationCard
            v-model:id="leadRelations.account_id_c"
            module-name="Cuenta"
          />
        </div>
        <div class="col-12">
          <ContactRelationCard
            v-model:id="leadRelations.contact_id_c"
            module-name="Contacto"
          />
        </div>
        <div class="col-12">
          <ProspectRelationCard
            v-model:id="leadRelations.lead_id1_c"
            module-name="Prospecto"
          />
        </div>
      </div>
    </template>
  </view-card-component>
</template>
