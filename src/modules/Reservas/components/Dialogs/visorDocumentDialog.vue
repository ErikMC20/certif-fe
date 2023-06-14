<script lang="ts">
  import { ref } from 'vue';
  import {  useQuasar } from 'quasar';
  import { HANSACRM3_URL } from 'src/conections/api_conectors';
  // import DurationDateTasks from '../GlobalComponent/DurationDateTasks.vue';
</script>
<script lang="ts" setup>
//**********************Invocacion de funciones nativas
  const $q = useQuasar();

//**********************Invocacion de props emits ref
  const props = withDefaults(
        defineProps < {
          idModule?: string;
          module?:string;
        } > (),
        {
          idModule: '',
        }
      );
  //const emits = defineEmits < { (event: 'formSaved'): void }> ();

//**********************Invocacion de metodos externos


//**********************Declaracion Variables individuales internas
  const open = ref(false);

  //**********************defineExpose
  defineExpose({
    open
  });
</script>

<template>
  <dialog-component size-dialog="dialog-md" v-model="open" :footerDisabled="true" :headerDisabled="false"
    :iconDialog="''" :persistent="false" >
    <template #header>
      <div class="bg-primary-3 text-black ">
        <q-toolbar class="bg-primary q-pa-lg">
          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-avatar text-color="white">
                  <q-icon name="visibility" size="md"></q-icon>
                </q-avatar>
              </q-item-section>
              <q-item-section>
               
                <q-item-label class="text-white text-h5">Visor de documentos</q-item-label>
                <!-- <q-item-label class="text-grey-4 text-caption" lines="1">Verifique los datos esenciales... 
                </q-item-label>-->
              </q-item-section>
            </q-item>
          </q-list>
          <q-space />
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
            <iframe :src="`${HANSACRM3_URL}/upload/${props.idModule}`" style="height: 85vh; width:100%;" frameborder="0">
            </iframe>
          </div>
        </div>
      </div>
    </template>
   
  </dialog-component>
</template>
<style lang="scss" scoped>
</style>