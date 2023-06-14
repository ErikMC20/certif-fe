<script lang="ts" setup>
import { ref, computed } from 'vue';
import { RelationInfoLead } from '../../utils/types';
import ViewCardVue from 'src/components/MainCard/ViewCard .vue';
import AccountRelationCard from './AccountRelationCard.vue';
import ContactRelationCard from './ContactRelationCard.vue';
const props = withDefaults(
  defineProps<{ id?: string; data?: RelationInfoLead }>(),
  {}
);

const baseCardRef = ref<InstanceType<typeof ViewCardVue> | null>();
const isEditing = computed(() => baseCardRef.value?.isEditing === 'edit');

const data = ref({
  asignado: '',
  division: '',
  areamercado: '',
  estado: '',
  opportunity_type: '',
  fase: '',
  sales_stage: '',
  region_c: '',
  acuenta_de_c: '',
});

const leadRelations = ref(
  !!props.data
    ? { ...props.data }
    : ({
        account_id_c: '',
        contact_id_c: '',
      } as RelationInfoLead)
);

const exposeData = () => {
  return leadRelations.value;
};

const restoreData = () => {
  leadRelations.value = {
    account_id_c: props.data?.account_id_c || '',
    contact_id_c: props.data?.contact_id_c || '',
  };
};

defineExpose({
  exposeData,
  isEditing,
});
</script>

<template>
  <view-card-component
    :controls="!!id"
    ref="baseCardRef"
    :initial-status="id ? 'read' : 'edit'"
    icon-name="connect_without_contact"
    title="Información adicional"
    @cancel-change="restoreData"
  >
    <template #edit>
      <div class="row q-col-gutter-lg q-py-md">
        <q-select
          v-model="data.division"
          :options="listDivision"
          label="Division"
          transition-show="flip-up"
          transition-hide="flip-down"
          outlined
          dense
          class="col-md-6 col-sm-12 col-xs-12"
          options-dense
          option-label="label"
          option-value="cod_div"
          :map-options="true"
          :emit-value="true"
        />
        <q-select
          v-model="data.areamercado"
          :options="listMercado"
          label="Area de Mercado"
          transition-show="flip-up"
          transition-hide="flip-down"
          outlined
          dense
          class="col-md-6 col-sm-12 col-xs-12"
          option-value="cod_amercado"
          option-label="label"
          :map-options="true"
          :emit-value="true"
          options-dense
          :disable="data.division == ''"
        />
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          v-model="data.idgrupocliente_c"
          :options="clientGroupOptions"
          type="text"
          label="Grupo Cliente"
          option-value="value"
          option-label="label"
          emit-value
          map-options
        />
        <q-select
          class="col-12 col-sm-6"
          outlined
          dense
          :options="regionesOptions"
          v-model="data.region_c"
          option-value="cod_region"
          option-label="label"
          emit-value
          map-options
          type="text"
          label="Region"
        />
        <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="data.amount"
          type="text"
          label="CUCE"
        />
        <q-input
          class="col-12 col-sm-6 q-pb-none"
          outlined
          dense
          v-model="data.amount"
          type="text"
          label="Probabilidad de que ocurra el proyecto (%)"
        />
        <q-select
          v-model="data.acuenta_de_c"
          :options="listParticipacion"
          label="Participación como"
          transition-show="flip-up"
          transition-hide="flip-down"
          outlined
          dense
          class="col-md-6 col-sm-12 col-xs-12"
          options-dense
          option-value="value"
          option-label="label"
          :map-options="true"
          :emit-value="true"
        />
        <!--
        <div class="col-12">
          <AccountRelationCard
            v-model:id="leadRelations.account_id_c"
            module-name="Cuenta"
            edit-mode
          />
        </div>
        <div class="col-12">
          <ContactRelationCard
            v-model:id="leadRelations.contact_id_c"
            module-name="Contacto"
            :account-id="leadRelations.account_id_c"
            edit-mode
          />
        </div> -->
      </div>
    </template>
    <template #read>
      <!-- <q-select
        v-model="inputData.idamercado_c"
        hide-dropdown-icon
        readonly
        :options="aMercadoOptions"
        option-value="cod_amercado"
        option-label="label"
        emit-value
        map-options
        class="col-12 col-sm-6"
        outlined
        dense
        label="Area de Mercado"
      />
      <q-select
        class="col-12 col-sm-6"
        outlined
        dense
        v-model="inputData.idgrupocliente_c"
        :options="clientGroupOptions"
        readonly
        hide-dropdown-icon
        type="text"
        label="Grupo Cliente"
        option-value="value"
        option-label="label"
        emit-value
        map-options
      /> -->
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
      </div>
    </template>
  </view-card-component>
</template>
