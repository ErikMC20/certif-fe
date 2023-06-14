<script lang="ts">
  import { ref } from 'vue';
  import {axios_LB_04} from 'src/conections/axiosCRM';
</script>

<script lang="ts" setup>
  const props = defineProps < {
    asunto?: string;
    idActivity: string;
  } > ();
  const open = ref(false);
  const localValue = ref([] as { [key: string]: string }[]);
  const ActiveSqeleton = ref(false);
  const dataEmails = ref({
    attributes: {
      de:'',
      para:'',
      cc:'',
      asunto:'',
      plantilla:''
    }
  })
  const isEditing = ref(false);  
  const info = async () => {
    const response = await axios_LB_04.get(`/get-email/${props.idActivity}`);
    localValue.value = response.data.email_resp;
    dataEmails.value.attributes.de= localValue.value[0].reply_to_addr;
    dataEmails.value.attributes.para= localValue.value[0].to_addrs;
    dataEmails.value.attributes.cc= localValue.value[0].cc_addrs;
    dataEmails.value.attributes.asunto= localValue.value[0].name;
    dataEmails.value.attributes.plantilla= localValue.value[0].description_html;
  };

  const restoreValues = () => {
    ActiveSqeleton.value = false;
  }

  //**********************************************defineExpose
  defineExpose({
    open
  });
</script>

<template>
  <dialog-component size-dialog="dialog-md" v-model="open"  :headerDisabled="false"
    :iconDialog="''" :persistent="false" @show="info" footerDisabled="read">
    <template #header>
      <div class="bg-primary-3 text-black ">
        <q-toolbar class="bg-primary q-pa-lg">
          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-avatar text-color="white">
                  <q-icon name="email" size="md"></q-icon>
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-grey-5 text-caption" lines="1">Correo
                  <q-item-label class="text-white text-h5">{{asunto}}</q-item-label>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-space />
          <q-btn size="xs" color="white" outline label="opciones">
            <q-menu auto-close :offset="[110, 0]">
              <q-list dense>
                <q-item clickable dense>
                  <q-item-section avatar dense>
                    <q-avatar icon="delete" text-color="red" size="md" />
                  </q-item-section>
                  <q-item-section >Eliminar</q-item-section>
                </q-item>
                <!-- <q-item clickable dense>
                  <q-item-section avatar dense>
                    <q-avatar icon="email" text-color="blue" size="md" />
                  </q-item-section>
                  <q-item-section>Reenviar</q-item-section>
                </q-item> -->
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn dense flat color="white" :icon="!$q.screen.xs ? 'close' : 'arrow_back_ios'" v-close-popup>
            <q-tooltip class="bg-white text-primary">Cerrar</q-tooltip>
          </q-btn>
        </q-toolbar>
      </div>
    </template>
    <template #body>
      <div class="row q-pa-md q-col-gutter-sm">
        <div class="col-12 col-sm-12 q-gutter-y-sm">
          <div class="row" style="height: 75vh;" >
            <view-card-component style="width: 100%" :initial-status="!!idActivity ? 'read' : 'edit'" icon-name="task"
              ref="baseCardRef" title="Información del correo" @cancel-change="restoreValues">
              <template #read>
                <div class="row q-col-gutter-sm q-ml-sm">
                  <q-input class="col-12 col-sm-12 q-mb-sm" readonly dense v-model="dataEmails.attributes.de" type="text"
                    label="De">
                    <template #before>
                      <q-icon name="person" color="primary" class="q-mr-sm"/>
                    </template>
                  </q-input>
                  <q-input class="col-12 col-sm-12 q-mb-sm" readonly dense v-model="dataEmails.attributes.para" type="text"
                    label="Para"> 
                    <template #before>
                      <q-icon name="groups" color="primary" class="q-mr-sm"/>
                    </template>
                  </q-input>
                    <q-input class="col-12 col-sm-12 q-mb-sm" readonly dense v-model="dataEmails.attributes.cc" type="text"
                    label="CC"> <template #before>
                      <q-icon name="groups" color="primary" class="q-mr-sm"/>
                    </template></q-input>                   
                  <q-input class="col-12 col-sm-12 q-mb-sm" readonly dense v-model="dataEmails.attributes.asunto" type="text"
                    label="Asunto">
                    <template #before>
                      <q-icon name="spellcheck" color="primary" class="q-mr-sm"/>
                    </template>
                  </q-input>  
                  <!-- <q-input class="col-12 col-sm-12 q-mb-sm" readonly dense v-model="fechas.attributes.date_start" type="text"
                    label="Fecha de envio"> 
                    <template #before>
                      <q-icon name="event" color="primary" class="q-mr-sm"/>
                    </template></q-input> -->
                  <p class="text-primary">Cuerpo del correo</p>
                  <q-card class="my-card" bordered flat>                   
                    <q-card-section>
                      <div v-html="dataEmails.attributes.plantilla"></div>   
                    </q-card-section>                    
                  </q-card>                                
                </div>
              </template>
            </view-card-component>
          </div>        
        </div>
      </div>
    </template>
    <template #footer v-if="!isEditing">
      <q-btn color="primary" class="q-mr-md" >Guardar</q-btn>
      <q-btn color="negative" v-close-popup>Cancelar</q-btn>
    </template>
  </dialog-component>
</template>
<style lang="scss" scoped>
</style>