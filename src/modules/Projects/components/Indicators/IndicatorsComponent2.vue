<script setup lang="ts">
import { getIndicators } from '../../services/useProjectService';
import IndicatorsSkeleton from '../Skeletons/IndicatorsSkeleton.vue';
import { useAsyncState } from '@vueuse/core';
import { computed, ref } from 'vue';

const props = defineProps<{
  moduleId?: string;
}>();

const { state, isLoading } = useAsyncState(async () => {
  return await getIndicators(props.moduleId ?? '');
}, {});

const salud = computed(() => {
  return (
    (state.value.costo.porcentaje +
      state.value.tiempo.porcentaje +
      state.value.alcance.avance) /
    3
  ).toFixed(1);
});

const slide = ref('salud');
</script>
<template>
  <IndicatorsSkeleton v-if="isLoading" />
  <template v-else>
    <div class="row q-col-gutter-sm col-12" v-if="!$q.screen.xs">
      <div class="col-md-3 col-sm-6 col-xs-12">
        <q-card class="my-card col-md-3">
          <q-card-section horizontal>
            <q-circular-progress
              show-value
              reverse
              :value="Number(salud)"
              size="90px"
              :thickness="0.2"
              color="primary"
              center-color="white"
              track-color="blue-1"
              class="q-ma-md"
              rounded
            >
              <span style="font-size: 0.6em">
                {{ state.salud.salud }}
                %</span
              >
            </q-circular-progress>
            <q-card-section class="flex items-center">
              <div>SALUD DEL PROYECTO</div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-3 col-sm-6 col-xs-12">
        <q-card class="my-card col-md-3">
          <q-card-section horizontal>
            <q-circular-progress
              show-value
              reverse
              :value="state.costo.porcentaje"
              size="90px"
              :thickness="0.2"
              color="green-9"
              center-color="white"
              track-color="blue-1"
              class="q-ma-md"
              rounded
            >
              <span style="font-size: 0.8em"
                >{{ state.costo.porcentaje }}%</span
              >
            </q-circular-progress>
            <q-card-section>
              <div class="text-center text-h6">COSTO</div>
              <div class="text-bold text-center">
                <span style="font-size: 1.5em">
                  {{
                    state.costo.costo_real / 1000 > 0
                      ? state.costo.costo_real / 1000 + ' k'
                      : 0
                  }}
                  <small class="text-grey-5">
                    /
                    {{
                      state.costo.contrato / 1000 > 0
                        ? state.costo.contrato / 1000 + ' k'
                        : 0
                    }}
                  </small>
                </span>
              </div>
              <div class="text-center text-grey-6" style="font-size: 0.8rem">
                DOLARES
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-3 col-sm-6 col-xs-12">
        <q-card class="my-card col-md-3">
          <q-card-section horizontal>
            <q-circular-progress
              show-value
              reverse
              :value="state.tiempo.porcentaje"
              size="90px"
              :thickness="0.2"
              color="orange"
              center-color="white"
              track-color="blue-1"
              class="q-ma-md"
              rounded
            >
              <span style="font-size: 0.8em"
                >{{ state.tiempo.porcentaje }}%</span
              >
            </q-circular-progress>
            <q-card-section>
              <div class="text-center text-h6">TIEMPO</div>
              <div class="text-bold text-center">
                <span style="font-size: 1.5em">
                  {{ state.tiempo.transcurrido }}
                  <small class="text-grey-5">
                    / {{ state.tiempo.total }}
                  </small>
                </span>
              </div>
              <div class="text-center text-grey-6" style="font-size: 0.8rem">
                DIAS
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-md-3 col-sm-6 col-xs-12">
        <q-card class="my-card col-md-3">
          <q-card-section horizontal>
            <q-circular-progress
              show-value
              reverse
              :value="state.alcance.avance"
              size="90px"
              :thickness="0.2"
              color="indigo"
              center-color="white"
              track-color="blue-1"
              class="q-ma-md"
              rounded
            >
              <span style="font-size: 0.8em">
                {{ state.alcance.avance }} %</span
              >
            </q-circular-progress>
            <q-card-section>
              <div class="text-center text-h6">AVANCE</div>
              <div class="text-bold text-center">
                <span style="font-size: 1.5em">
                  {{ state.alcance.completada }}
                  <small class="text-grey-5">
                    / {{ state.alcance.total }}
                  </small>
                </span>
              </div>
              <div class="text-center text-grey-6" style="font-size: 0.8rem">
                TAREAS
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div v-else class="col-12">
      <q-card class="no-shadow">
        <q-card-section class="q-pa-none">
          <q-carousel
            v-model="slide"
            transition-prev="scale"
            transition-next="scale"
            swipeable
            animated
            arrows
            control-text-color="transparent"
            navigation
            height="200px"
            class="shadow-1 rounded-borders"
          >
            <q-carousel-slide name="salud" class="column no-wrap flex-center">
              <q-card class="my-card full-width no-shadow">
                <q-card-section horizontal class="q-pa-none">
                  <q-card-section class="q-pa-sm">
                    <q-circular-progress
                      show-value
                      reverse
                      :value="Number(salud)"
                      size="120px"
                      :thickness="0.25"
                      color="blue-8"
                      center-color="white"
                      track-color="grey-4"
                      class="q-ma-sm"
                      rounded
                    >
                      <span style="font-size: 0.6em">
                        {{ state.salud.salud }}
                        %</span
                      >
                    </q-circular-progress>
                    <div class="text-bold text-center" style="font-size: 0.9em">
                      SALUD DEL PROYECTO
                    </div>
                  </q-card-section>
                  <q-card-section class="q-px-sm q-gutter-y-sm">
                    <q-linear-progress
                      size="15px"
                      :value="state.costo.porcentaje * 0.01"
                      color="teal"
                      animation-speed
                      style="width: 115px; border-radius: 0px"
                      track-color="grey-5"
                    />
                    <div>COSTO: {{ state.costo.porcentaje }}%</div>
                    <q-linear-progress
                      size="15px"
                      :value="state.tiempo.porcentaje * 0.01"
                      color="teal"
                      animation-speed
                      style="width: 115px; border-radius: 0px"
                      rounded
                      track-color="grey-5"
                    />
                    <div>TIEMPO: {{ state.tiempo.porcentaje }}%</div>
                    <q-linear-progress
                      size="15px"
                      :value="state.alcance.avance * 0.01"
                      color="teal"
                      animation-speed
                      style="width: 115px; border-radius: 0px"
                      rounded
                      track-color="grey-5"
                    />
                    <div>ALCANCE: {{ state.alcance.avance }}%</div>
                  </q-card-section>
                </q-card-section>
              </q-card>
            </q-carousel-slide>
            <q-carousel-slide name="costo" class="column no-wrap flex-center">
              <q-card class="full-width no-shadow">
                <q-card-section horizontal>
                  <q-circular-progress
                    show-value
                    reverse
                    :value="state.costo.porcentaje"
                    size="110px"
                    :thickness="0.2"
                    color="green-9"
                    center-color="white"
                    track-color="blue-1"
                    class="q-ma-md"
                    rounded
                  >
                    <span style="font-size: 0.8em"
                      >{{ state.costo.porcentaje }}%</span
                    >
                  </q-circular-progress>
                  <q-card-section>
                    <div class="text-center text-h6">COSTO</div>
                    <div class="text-bold text-center">
                      <span style="font-size: 1.5em">
                        {{
                          state.costo.costo_real / 1000 > 0
                            ? state.costo.costo_real / 1000 + ' k'
                            : 0
                        }}
                        <small class="text-grey-5">
                          /
                          {{
                            state.costo.contrato / 1000 > 0
                              ? state.costo.contrato / 1000 + ' k'
                              : 0
                          }}
                        </small>
                      </span>
                    </div>
                    <div
                      class="text-center text-grey-6"
                      style="font-size: 0.8rem"
                    >
                      DOLARES
                    </div>
                  </q-card-section>
                </q-card-section>
              </q-card>
            </q-carousel-slide>
            <q-carousel-slide name="tiempo" class="column no-wrap flex-center">
              <q-card class="full-width no-shadow">
                <q-card-section horizontal>
                  <q-circular-progress
                    show-value
                    reverse
                    :value="state.tiempo.porcentaje"
                    size="110px"
                    :thickness="0.2"
                    color="orange"
                    center-color="white"
                    track-color="blue-1"
                    class="q-ma-md"
                    rounded
                  >
                    <span style="font-size: 0.8em"
                      >{{ state.tiempo.porcentaje }}%</span
                    >
                  </q-circular-progress>
                  <q-card-section>
                    <div class="text-center text-h6">TIEMPO</div>
                    <div class="text-bold text-center">
                      <span style="font-size: 1.5em">
                        {{ state.tiempo.transcurrido }}
                        <small class="text-grey-5">
                          / {{ state.tiempo.total }}
                        </small>
                      </span>
                    </div>
                    <div
                      class="text-center text-grey-6"
                      style="font-size: 0.8rem"
                    >
                      DIAS
                    </div>
                  </q-card-section>
                </q-card-section>
              </q-card>
            </q-carousel-slide>
            <q-carousel-slide name="alcance" class="column no-wrap flex-center">
              <q-card class="full-width no-shadow">
                <q-card-section horizontal>
                  <q-circular-progress
                    show-value
                    reverse
                    :value="state.alcance.avance"
                    size="110px"
                    :thickness="0.2"
                    color="indigo"
                    center-color="white"
                    track-color="blue-1"
                    class="q-ma-md"
                    rounded
                  >
                    <span style="font-size: 0.8em">
                      {{ state.alcance.avance }} %</span
                    >
                  </q-circular-progress>
                  <q-card-section>
                    <div class="text-center text-h6">ALCANCE</div>
                    <div class="text-bold text-center">
                      <span style="font-size: 1.5em">
                        {{ state.alcance.completada }}
                        <small class="text-grey-5">
                          / {{ state.alcance.total }}
                        </small>
                      </span>
                    </div>
                    <div
                      class="text-center text-grey-6"
                      style="font-size: 0.8rem"
                    >
                      TAREAS
                    </div>
                  </q-card-section>
                </q-card-section>
              </q-card>
            </q-carousel-slide>
          </q-carousel>
        </q-card-section>
      </q-card>
    </div>
  </template>
</template>

<style scoped></style>
