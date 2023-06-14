<script lang="ts" setup>
import { ref, defineAsyncComponent } from 'vue';

const AccountDialog = defineAsyncComponent(
  () => import('src/modules/Accounts/components/Dialogs/AccountDialog.vue')
);
const ContactDialog = defineAsyncComponent(
  () => import('src/modules/Contacts/components/Dialogs/ContactDialog.vue')
);
const OpportunityDialog = defineAsyncComponent(
  () => import('src/modules/Opportunities/components/Dialogs/OpportunityDialog.vue')
);
const ProspectDialog = defineAsyncComponent(
  () => import('src/modules/Prospects/components/Dialogs/ProspectDialog.vue')
);
const GeneralDialog = defineAsyncComponent(
  () => import('src/modules/Quotes/components/Dialogs/GeneralDialog.vue')
);
const ReservasDialog = defineAsyncComponent(
  () => import('src/modules/Reservas/components/Dialogs/ReservasDialog.vue')
);

const accountDialogRef = ref<InstanceType<typeof AccountDialog> | null>(null);
const contactDialogRef = ref<InstanceType<typeof ContactDialog> | null>(null);
const oportunityDialogRef = ref<InstanceType<typeof OpportunityDialog> | null>(null);
const quotesDialogRef = ref<InstanceType<typeof GeneralDialog> | null>(null);
const prospectDialogRef = ref<InstanceType<typeof ProspectDialog> | null>(null);
const reserveDialogRef = ref<InstanceType<typeof ReservasDialog> | null>(null);

const props = withDefaults(
  defineProps<{
    moduleName: string;
    title?: string;
    description?: string;
    subtitle1?: string;
    icon?: string;
    noData?: boolean;
    id?: string;
    error?: boolean;
    errorMessage?: string;
  }>(),
  {
    icon: 'person',
    error: false,
    errorMessage: 'error-message',
  }
);

interface Emits {
  (event: 'moduleUpdated'): void;
}

const emits = defineEmits<Emits>();

const openDialogAccount = async (id?: string) => {
  await accountDialogRef.value?.openDialogAccountTab(id ? id : '');
};
const openDialogContact = async (id?: string) => {
  await contactDialogRef.value?.openDialogTab(id, '');
};
const openDialogOportunity = async (id?: string) => {
  await oportunityDialogRef.value?.openDialogAccountTab(id, '');
};
const openDialogQuotes = async (id?: string) => {
  await quotesDialogRef.value?.openDialogQuotesTab(id, '');
};
const openProspectDialog = async (id?: string) => {
  console.log(id);
  await prospectDialogRef.value?.openDialogAccountTab(id, '');
};
const openReservasDialog = async (id?: string) => {
  await reserveDialogRef.value?.openDialogReserveTab(id ? id : '');
};

const updateModule = () => {
  console.log('updateModule.....');
  emits('moduleUpdated');
};
</script>

<template>
  <q-card :class="{ 'error-card': props.error }" bordered flat>
    <q-list bordered>
      <q-item>
        <q-item-section v-if="$slots.leftOptions" side
          ><slot name="leftOptions"></slot
        ></q-item-section>

        <q-item-section v-if="noData">
          <q-item-label caption class="text-weight-bold" lines="1">
            <q-icon :name="icon" class="q-mr-sm" />{{ moduleName }}</q-item-label
          >
          <q-item-label class="text-grey-7">
            <q-icon name="warning" />
            <span class="text-weight-thin"> No Seleccionado </span>
          </q-item-label>
          <span v-if="props.error" class="text-caption">{{ props.errorMessage }}</span>
        </q-item-section>
        <q-item-section v-else>
          <q-item-label class="text-weight-bold" caption lines="1">
            <q-icon :name="icon" class="q-mr-sm" />{{ moduleName }}</q-item-label
          >

          <q-item-label v-if="moduleName == 'Cuenta'">
            <a
              class="text-bold cursor-pointer flex items-center text-primary"
              @click="() => openDialogAccount(id)"
            >
              {{ title }}
            </a>
          </q-item-label>

          <q-item-label v-else-if="moduleName == 'Contacto'">
            <a
              class="text-bold cursor-pointer flex items-center text-primary"
              @click="() => openDialogContact(id)"
            >
              {{ title }}
            </a>
          </q-item-label>
          <q-item-label v-else-if="moduleName == 'Oportunidad'">
            <a
              class="text-bold cursor-pointer flex items-center text-primary"
              @click="() => openDialogOportunity(id)"
            >
              {{ title }}
            </a>
          </q-item-label>
          <q-item-label v-else-if="moduleName == 'Cotizacion'">
            <a
              class="text-bold cursor-pointer flex items-center text-primary"
              @click="() => openDialogQuotes(id)"
            >
              {{ title }}
            </a>
          </q-item-label>
          <q-item-label v-else-if="moduleName == 'Prospecto'">
            <a
              class="text-bold cursor-pointer flex items-center text-primary"
              @click="() => openProspectDialog(id)"
            >
              {{ title }}
            </a>
          </q-item-label>
          <q-item-label v-else-if="moduleName == 'Reserva'">
            <a
              class="text-bold cursor-pointer flex items-center text-primary"
              @click="() => openReservasDialog(id)"
            >
              {{ title }}
            </a>
          </q-item-label>

          <q-item-label v-else>
            {{ title }}
          </q-item-label>
          <q-item-label v-if="description" caption lines="1"
            >Asignado a:
            <span class="text-weight-bold"> {{ description }} </span>
          </q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label v-if="subtitle1" caption>{{ subtitle1 }}</q-item-label>
          <slot name="options"> </slot>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
  <AccountDialog ref="accountDialogRef" @saved-form="updateModule" />
  <ContactDialog ref="contactDialogRef" />
  <OpportunityDialog ref="oportunityDialogRef" />
  <ProspectDialog ref="prospectDialogRef" />
  <GeneralDialog ref="quotesDialogRef" />
  <ReservasDialog ref="reserveDialogRef" />
</template>

<style lang="scss" scoped>
.error-card {
  border-color: $negative;
  * {
    color: $negative !important;
  }
}
</style>
