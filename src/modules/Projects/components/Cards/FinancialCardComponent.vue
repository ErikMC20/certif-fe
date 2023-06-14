<script setup lang="ts">
import { ref, computed } from 'vue';
import { FinancialInformation } from '../../utils/types';

import ViewCardVue from 'src/components/MainCard/ViewCard.vue';
//props
const props = withDefaults(
  defineProps<{
    id?: string;
    data: FinancialInformation;
    readMode?: boolean;
  }>(),
  {
    readMode: false,
  }
);

//refs
const baseCardRef = ref<InstanceType<typeof ViewCardVue> | null>(null);

//const
const isEditing = computed(() => baseCardRef.value?.isEditing === 'edit');
const inputData = ref(
  !!props.data
    ? { ...props.data }
    : {
        monto_contrato_c: 0,
        monto_costo_c: 0,
        monto_utilidad_c: 0,
        diferencia: 0,
      }
);

const restoreValues = () => {
  if (props.data) inputData.value = { ...props.data };
};

const exposeCardData = () => {
  return inputData.value;
};

const porcentaje = (neto: number, real: number) => {
  if (neto == 0 && real == 0) {
    return 0;
  }
  return Math.round(((neto - real) * 100) / neto);
};

const withComas = (value: number) => {
  return (
    String(value)
      .replace(/\D/g, '')
      //.replace(/([0-9])([0-9]{0})$/, '$1,$2')
      // .replace(/([0-9])([0-9]{0})$/, '$1.$2')
      .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, ',')
  );
};

//exposes
defineExpose({
  exposeCardData,
  isEditing,
});
</script>

<template>
  <view-card-component
    :controls="!!id"
    :initial-status="id ? 'read' : 'edit'"
    icon-name="local_atm"
    ref="baseCardRef"
    title="Información financiera del proyecto"
    @cancel-change="restoreValues"
    class="q-mb-sm"
  >
    <template #edit>
      <q-card-section class="q-px-sm row q-col-gutter-md">
        <q-input
          v-model.number="inputData.monto_contrato_c"
          type="number"
          label="Monto contrato"
          outlined
          dense
          class="col-md-4 col-xs-12"
          step="any"
        />
        <q-input
          v-model.number="inputData.monto_costo_c"
          type="number"
          label="Costo total"
          outlined
          dense
          class="col-md-4 col-xs-12"
          :rules="[

            (val:number) =>
              val <= Number(inputData.monto_contrato_c) ||
              'El monto total debe ser menor al monto de contrato',

          ]"
        />
        <q-input
          v-model.number="inputData.monto_utilidad_c"
          type="number"
          label="Costo real"
          outlined
          dense
          class="col-md-4 col-xs-12"
          :rules="[
            (val:number) =>
              val <= Number(inputData.monto_contrato_c) ||
              'El costo real debe ser menor al monto de contrato',
          ]"
        />

        <div class="col-md-12" v-if="id">
          <q-card bordered flat>
            <q-card-section horizontal>
              <q-card-section class="q-pt-xs">
                <div class="text-overline">Utilidad</div>
                <div class="text-h5 q-mt-sm q-mb-xs">
                  <q-icon name="attach_money" color="green" size="sm" />
                  <span>
                    {{
                      withComas(
                        Number(inputData.monto_contrato_c ?? 0) -
                          Number(inputData.monto_utilidad_c ?? 0)
                      )
                    }}
                    <small class="text-grey-5 q-ml-md">
                      {{
                        porcentaje(
                          Number(inputData.monto_contrato_c),
                          Number(inputData.monto_utilidad_c)
                        )
                      }}
                      % de diferencia
                    </small>
                  </span>
                </div>
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>
        <!-- <q-input
          v-model="inputData.diferencia"
          type="number"
          label="Diferencia"
          outlined
          dense
          class="col-md-6 col-xs-12"
        /> -->
      </q-card-section>
    </template>
    <template #read>
      <q-card-section class="q-px-sm row q-col-gutter-md">
        <q-input
          :model-value="inputData.monto_contrato_c.toLocaleString('es-MX')"
          type="text"
          label="Monto contrato"
          outlined
          dense
          class="col-md-4 col-xs-12"
          readonly
        />
        <q-input
          :model-value="withComas(inputData.monto_costo_c)"
          type="text"
          label="Costo total"
          outlined
          dense
          class="col-md-4 col-xs-12"
          readonly
        />
        <q-input
          :model-value="withComas(inputData.monto_utilidad_c)"
          type="text"
          label="Costo real"
          outlined
          dense
          class="col-md-4 col-xs-12"
          readonly
        />
        <div class="col-md-12">
          <q-card bordered flat>
            <q-card-section horizontal>
              <q-card-section class="q-pt-xs">
                <div class="text-overline">Utilidad</div>
                <div class="text-h5 q-mt-sm q-mb-xs">
                  <q-icon name="attach_money" color="green" />
                  <span>
                    {{
                      withComas(
                        Number(inputData.monto_contrato_c) -
                          Number(inputData.monto_utilidad_c)
                      )
                    }}
                    <small class="text-grey-5 q-ml-md">
                      {{
                        porcentaje(
                          Number(inputData?.monto_contrato_c),
                          Number(inputData?.monto_utilidad_c)
                        )
                      }}
                      % margen de utilidad
                    </small>
                  </span>
                </div>
              </q-card-section>
            </q-card-section>
          </q-card>
        </div>
        <!-- <q-input
          v-model="inputData.diferencia"
          type="text"
          label="Diferencia"
          outlined
          dense
          class="col-md-6 col-xs-12"
          readonly
        /> -->
      </q-card-section>
    </template>
  </view-card-component>
</template>

<style lang="scss" scoped>
.title-card {
  font-size: 1em;
}
</style>
