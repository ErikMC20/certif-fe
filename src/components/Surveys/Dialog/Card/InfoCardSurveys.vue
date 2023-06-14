<script lang="ts">
  import { ref } from 'vue';
  import { axios_LB_03 } from 'src/conections/axiosCRM';
</script>
<script lang="ts" setup>
  const props = defineProps < {
    asunto?: string;
    idActivity?: string;
    idSurveys?: string;
    idLeads?: string;
  } > ();
  const open = ref(false);
  const datalist = ref([] as { [key: string]: string }[]);
  const dataSurveys = ref({
    base_score:'',
    obtain_score:'',
    receive_date:'',
    score_percentage:0,
    send_date:'',
    survey_name:''
  });

  const isEditing = ref(false);
  const info = async () => {
    const response = await axios_LB_03.get(`/Lead_Get_Encuesta_realizada_respuestas/${props.idLeads}/${props.idSurveys}`);
    datalist.value = response.data.questions;
    dataSurveys.value =(response.data.detail);
  };
  //**********************************************defineExpose
  defineExpose({
    open
  });
</script>
<template>
  <dialog-component size-dialog="dialog-md" v-model="open" :headerDisabled="false" :iconDialog="''" :persistent="false"
    @show="info" footerDisabled="read">
    <template #header>
      <div class="bg-primary-3 text-black ">
        <q-toolbar class="bg-primary q-pa-lg">
          <q-list >
            <q-item >
              <q-item-section avatar>
                <q-avatar text-color="white">
                  <q-icon name="event" size="md"></q-icon>
                </q-avatar>
              </q-item-section>
              <q-item-section >
                <q-item-label class="text-grey-5 text-caption">Encuesta realizada en fecha {{ dataSurveys.send_date }}
                <q-item-label class="text-white text-h5"  lines="10">{{ asunto }}</q-item-label>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-space />
          <!-- <q-btn size="xs" color="white" outline label="opciones">
            <q-menu auto-close :offset="[110, 0]">
              <q-list dense>
                <q-item clickable dense>
                  <q-item-section avatar dense>
                    <q-avatar icon="delete" text-color="red" size="md" />
                  </q-item-section>
                  <q-item-section >Eliminar</q-item-section>
                </q-item>                
              </q-list>
            </q-menu>
          </q-btn> -->
          <q-btn dense flat color="white" :icon="!$q.screen.xs ? 'close' : 'arrow_back_ios'" v-close-popup>
            <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-toolbar>
      </div>
    </template>
    <template #body>
      <div class="row q-pa-md q-col-gutter-sm">
        <div class="col-12 col-sm-12 q-gutter-y-sm">
          <div class="row" style="height: 75vh;">
            <view-card-component style="width: 100%" initial-status="read" icon-name="event"
              title="Información de la encuesta">
              <template #read>
                <div class="row q-none q-col-gutter-sm ">
                  <div class="col ">
                    <q-card flat bordered class="bg-grey-2 my-card text-center">
                      <q-card-section>
                        <div class="text-subtitle2">Calificación</div>
                        <div class="text-h6 ">{{ dataSurveys.obtain_score }}/{{ dataSurveys.base_score }}</div>
                      </q-card-section>
                    </q-card>
                  </div>
                  <div class="col">
                    <q-card flat bordered class="bg-primary my-card text-center text-white">
                      <q-card-section>
                        <div class="text-subtitle2">Porcentaje</div>
                        <div class="text-h6">{{ dataSurveys.score_percentage }}%</div>
                      </q-card-section>
                    </q-card>
                  </div>
                  <div class="col">
                    <q-card flat bordered class="my-card text-center text-orange-5">
                      <q-card-section>
                        <div class="text-subtitle2">Valoración</div>
                        <div>
                          <div class="text-h6" v-if="dataSurveys.score_percentage==null || dataSurveys.score_percentage==0">0</div>
                          <q-icon name="star" size="md" v-if="dataSurveys.score_percentage>30"/>
                          <q-icon name="star" size="md" v-if="dataSurveys.score_percentage>60"/>
                          <q-icon name="star" size="md" v-if="dataSurveys.score_percentage>90"/>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              
                <div>
                  <template v-for="(reg,index) in datalist" :key="index">
                    <q-list class="rounded-borders q-ma-sm">
                      <q-item>
                        <q-item-section avatar>
                          <q-avatar color="blue-3" text-color="white">{{ index-1 }}</q-avatar>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label class="q-mb-sm">{{ reg[0].pregunta}}</q-item-label>
                          <q-item-label :class="reg[0].respuesta == null || reg[0].respuesta =='' ? 'text-grey' : ''">
                            <span :class="reg[0].respuesta == null || reg[0].respuesta =='' ? 'text-grey text-weight-bold' : 'text-weight-bold'" >Resp.</span>
                            {{ reg[0].respuesta || 'Sin respuesta' }}
                          </q-item-label>
                        </q-item-section>
                        <q-item-section side class="text-orange-5 text-subtitle1" v-if="reg[0].base_weight !==0">
                          <q-chip color="orange" class="text-white" >
                            {{ reg[0].score_weight || 0 }}/{{ reg[0].base_weight }}
                          </q-chip>
                        </q-item-section>
                      </q-item>
                      <q-separator inset="item" />
                    </q-list>
                  </template>
                </div>
              </template>
            </view-card-component>
          </div>
        </div>
      </div>
    </template>
    <template #footer v-if="!isEditing">
      <q-btn color="primary" class="q-mr-md">Guardar</q-btn>
      <q-btn color="negative" v-close-popup>Cancelar</q-btn>
    </template>
  </dialog-component>
</template>
<style lang="scss" scoped>
</style>