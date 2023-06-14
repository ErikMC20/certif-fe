<script setup lang="ts">
import { ref, computed } from 'vue';
import { OpportunityGlobal } from '../../utils/types';
import ContactRelationCard from 'src/modules/Leads/components/Cards/ContactRelationCard.vue';
import ViewCard from 'src/components/MainCard/ViewCard.vue';
interface Props {
  id: string;
  view: string[];
  data: OpportunityGlobal;
}

const props = defineProps<Props>();
const baseCardRef = ref<InstanceType<typeof ViewCard> | null>();
const inputData = ref(props.data || ({} as OpportunityGlobal));

const restoreValues = () => {
  if (props.data) inputData.value = { ...props.data };
};

defineExpose({
  isEditing: computed(() => baseCardRef.value?.isEditing === 'edit'),
  exposeData: (): OpportunityGlobal => ({ ...inputData.value }),
});
</script>

<template>
  <view-card-component
    :controls="!!id"
    :initial-status="id ? 'read' : 'edit'"
    icon-name="real_estate_agent"
    ref="baseCardRef"
    title="Criterio de venta"
    @cancel-change="restoreValues"
    @edit-change="restoreValues"
  >
    <template #edit>
      <!-- <pre>My input data {{ inputData }}</pre> -->
      <div class="row q-col-gutter-lg q-py-md">
        <q-checkbox
          class="col-12 col-sm-6"
          v-model="inputData.esta_presupuestado_c"
          label="Está presupuestado donde el cliente"
          :true-value="1"
          :false-value="0"
          dense
        />
        <q-input
          outlined
          dense
          class="col-12 col-sm-6"
          v-model="inputData.monto_proyecto_c"
          type="text"
          label="Monto"
        />
        <div class="col-12 col-sm-6">
          <ContactRelationCard
            v-model:id="inputData.contact_id2_c"
            module-name="Campeón dentro del cliente"
            edit-mode
          />
        </div>
        <div class="col-12 col-sm-6">
          <ContactRelationCard
            v-model:id="inputData.contact_id1_c"
            module-name="Principal tomador de decisión"
            edit-mode
          />
        </div>
        <q-input
          outlined
          dense
          class="col-12 col-sm-6"
          v-model="inputData.desafios_cliente_c"
          type="textarea"
          label="Desafíos del cliente"
        />
        <q-input
          outlined
          dense
          class="col-12 col-sm-6"
          v-model="inputData.prioridades_cliente_c"
          type="textarea"
          label="Prioridades del cliente"
        />
        <q-input
          outlined
          dense
          class="col-12 col-sm-6"
          v-model="inputData.campeon_descripcion_c"
          type="textarea"
          label="Descripción del campeón"
        />
        <q-input
          outlined
          dense
          class="col-12 col-sm-6"
          v-model="inputData.tomador_descripcion_c"
          type="textarea"
          label="Descripción del principal tomador"
        />
        <q-input
          outlined
          dense
          class="col-12 col-sm-6"
          v-model="inputData.descripcion_problema_c"
          type="textarea"
          label="Descripción del problema"
        />
        <q-input
          outlined
          dense
          class="col-12 col-sm-6"
          v-model="inputData.descripcion_solucion_c"
          type="textarea"
          label="Descripción de la solución"
        />
        <q-input
          outlined
          dense
          class="col-12 col-sm-6"
          v-model="inputData.proceso_aprobacion_c"
          type="textarea"
          label="Proceso de aprobación"
        />
        <q-input
          outlined
          dense
          class="col-12 col-sm-6"
          v-model="inputData.evento_cierre_c"
          type="textarea"
          label="Evento que dispara el cierre"
        />
        <q-input
          outlined
          dense
          class="col-12 col-sm-6"
          v-model="inputData.historias_exito_c"
          type="textarea"
          label="Historias de éxito"
        />
        <q-input
          outlined
          dense
          class="col-12 col-sm-6"
          v-model="inputData.caso_financiero_c"
          type="textarea"
          label="Caso financiero (ROI, tiempo de repago)"
        />
        <q-input
          outlined
          dense
          class="col-12 col-sm-6"
          v-model="inputData.competidores_c"
          type="textarea"
          label="Competidores"
        />
      </div>
    </template>
    <template #read>
      <!-- <pre>My prop data {{ props.data }}</pre> -->
      <div class="row q-col-gutter-lg q-py-md">
        <q-checkbox
          class="col-12 col-sm-6"
          v-model="inputData.esta_presupuestado_c"
          label="Está presupuestado donde el cliente"
          :true-value="1"
          :false-value="0"
          dense
          disable
        />
        <q-input
          outlined
          readonly
          dense
          class="col-12 col-sm-6"
          v-model="inputData.monto_proyecto_c"
          type="text"
          label="Monto"
        />
        <div class="col-12 col-sm-6">
          <ContactRelationCard
            v-model:id="inputData.contact_id2_c"
            module-name="Campeón dentro del cliente"

          />
        </div>
        <div class="col-12 col-sm-6">
          <ContactRelationCard
            v-model:id="inputData.contact_id1_c"
            module-name="Principal tomador de decisión"

          />
        </div>
        <q-input
          outlined
          dense
          readonly
          class="col-12 col-sm-6"
          v-model="inputData.desafios_cliente_c"
          type="textarea"
          label="Desafíos del cliente"
        />
        <q-input
          outlined
          dense
          readonly
          class="col-12 col-sm-6"
          v-model="inputData.prioridades_cliente_c"
          type="textarea"
          label="Prioridades del cliente"
        />
        <q-input
          outlined
          dense
          readonly
          class="col-12 col-sm-6"
          v-model="inputData.campeon_descripcion_c"
          type="textarea"
          label="Descripción del campeón"
        />
        <q-input
          outlined
          dense
          readonly
          class="col-12 col-sm-6"
          v-model="inputData.tomador_descripcion_c"
          type="textarea"
          label="Descripción del principal tomador"
        />
        <q-input
          outlined
          dense
          readonly
          class="col-12 col-sm-6"
          v-model="inputData.descripcion_problema_c"
          type="textarea"
          label="Descripción del problema"
        />
        <q-input
          outlined
          dense
          readonly
          class="col-12 col-sm-6"
          v-model="inputData.descripcion_solucion_c"
          type="textarea"
          label="Descripción de la solución"
        />
        <q-input
          outlined
          dense
          readonly
          class="col-12 col-sm-6"
          v-model="inputData.proceso_aprobacion_c"
          type="textarea"
          label="Proceso de aprobación"
        />
        <q-input
          outlined
          dense
          readonly
          class="col-12 col-sm-6"
          v-model="inputData.evento_cierre_c"
          type="textarea"
          label="Evento que dispara el cierre"
        />
        <q-input
          outlined
          dense
          readonly
          class="col-12 col-sm-6"
          v-model="inputData.historias_exito_c"
          type="textarea"
          label="Historias de éxito"
        />
        <q-input
          outlined
          dense
          readonly
          class="col-12 col-sm-6"
          v-model="inputData.caso_financiero_c"
          type="textarea"
          label="Caso financiero (ROI, tiempo de repago)"
        />
        <q-input
          outlined
          dense
          readonly
          class="col-12 col-sm-6"
          v-model="inputData.competidores_c"
          type="textarea"
          label="Competidores"
        />
      </div>
    </template>
  </view-card-component>
</template>

<style scoped lang="scss"></style>
