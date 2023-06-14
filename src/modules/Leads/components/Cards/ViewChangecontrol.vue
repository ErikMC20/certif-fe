<template>
    <div v-if="id == '0'">
      <div class="column no-wrap flex-center">
        <q-icon name="person_add_disabled" size="56px" />
        <div class="q-mt-md text-center">
          <p>Guarde la cuenta por favor!!!</p>
          <p>Para visualizar los registros</p>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="q-ml-lg">
        <q-card flat>
          <q-card-section style="max-height: 70vh; padding-top: 0px" class="scroll" v-if="historyChangeslist.length > 0">
            <q-item dense v-for="(reg,index) in historyInitiallist" :key="index">
              <q-item-section>
                <q-item style=" padding: 0px">
                  <q-item-section avatar v-show="$q.screen.xs ? false : true">
                    <q-avatar color="primary" text-color="white">
                      <q-icon name="person" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>Creado por: <span class="text-primary">{{reg.creado_por}}</span>
                    </q-item-label>
                    <q-item-label caption lines="1" >{{reg.fecha_creacion}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-item-section>
  
              <q-item-section>
                <q-item style=" padding: 0px">
                  <q-item-section avatar v-show="$q.screen.xs ? false : true">
                    <q-avatar color="primary" text-color="white">
                      <q-icon name="person" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>Modificado por: <span class="text-primary">{{reg.modificado_por}}</span>
                    </q-item-label>
                    <q-item-label caption lines="1">{{reg.fecha_modificacion}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-item-section>
            </q-item>
            <q-timeline color="secondary">
              <q-timeline-entry v-for="(reg,index) in historyChangeslist" :key="index" icon="person"
                style="padding-top:1px">
                <template v-slot:title>
                  <span class="text-blue-5 text-capitalize text-caption q-ml-xs">
                   
                    {{ reg.fecha_creacion + ' ' }}
                  </span>
                  <span class="text-grey-7 text-capitalize text-caption"> | {{ reg.creado_por + ' ' }}</span>
                  
                  <q-list bordered separator>
                    <q-item clickable>
                      <q-item-section>
                        <q-item-label caption>
                         Campo modificado:
                          <span class="text-primary">{{ reg.campo }}
                          </span>
                        </q-item-label>
                        <q-item-label caption >
                          <q-icon name="check" color="blue" class="q-pr-xs text-h6" />Valor Nuevo:
                          <span class="text-blue">{{ reg.valor_nuevo }} </span>
                        </q-item-label>
                        <q-item-label caption>
                          <q-icon name="delete_outline" color="red-4" class="q-pr-xs text-h6" />Valor Anterior:
                          <span class="text-red-4">{{ reg.valor_anterior }} </span>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </template>
              </q-timeline-entry>
            </q-timeline>
          </q-card-section>
          <q-card-section style="max-height: 70vh; padding-top: 0px" class="scroll" v-else>
            <q-item dense v-for="(reg,index) in historyInitiallist" :key="index">
              <q-item-section>
                <q-item style=" padding: 0px">
                  <q-item-section avatar v-show="$q.screen.xs ? false : true">
                    <q-avatar color="primary" text-color="white">
                      <q-icon name="person" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>Creado por: <span class="text-primary">{{reg.creado_por}}</span>
                    </q-item-label>
                    <q-item-label caption lines="1" >{{reg.fecha_creacion}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-item-section>
              <q-item-section>
                <q-item style=" padding: 0px">
                  <q-item-section avatar v-show="$q.screen.xs ? false : true">
                    <q-avatar color="primary" text-color="white">
                      <q-icon name="person" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption>Modificado por: <span class="text-primary">{{reg.modificado_por}}</span>
                    </q-item-label>
                    <q-item-label caption lines="1">{{reg.fecha_modificacion}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-item-section>
            </q-item>
            <q-separator />
          </q-card-section>
        </q-card>
        
      </div>
    </div>
  </template>
  <script lang="ts">
    import { ref, onMounted } from 'vue';
    import { useLeadsStore } from '../../store/LeadsStore';
    //import { HANSACRM3_URL } from 'src/conections/api_conectors';
    //import { userStore } from 'src/modules/Users/store/UserStore';
    export default {};
  </script>
  <script lang="ts" setup>
    const { getLeadsHistoryChanges,getHistoryInitial } = useLeadsStore();
    const props = defineProps < {
      id: string,
    } > ();
    const id = ref(props.id);
    const historyInitiallist = ref([] as { [key: string]: string }[]);
    const historyChangeslist = ref([] as { [key: string]: string }[]);
    onMounted(async () => {
      historyInitiallist.value = await getHistoryInitial(id.value,'Hano_Leads');
      historyChangeslist.value = await getLeadsHistoryChanges(id.value);
    });
  </script>
  <style scoped>
    #mapid {
      width: 700px;
      height: 600px;
    }
  </style>