<template>
    <div v-if="idProspect == '0'">
        <div class="column no-wrap flex-center">
            <q-icon name="person_add_disabled" size="56px" />
            <div class="q-mt-md text-center">
                <p>Guarde la cuenta por favor!!!</p>
                <p>Para visualizar los registros</p>
            </div>
        </div>
    </div>
    <div v-else>
        <div class="q-ml-md">
            <div class="q-gutter-y-md" v-if="getActivities.length>0">
                <div class="row justify-between">
                    <div class="q-gutter-sm" style="margin-left: -16px;">
                        <q-btn round :color="tabAct == 'todas' ? 'orange':'grey'" icon="list" size="sm"
                            @click="tabAct = 'todas'" :flat="tabAct == 'todas' ? false:true">
                            <q-badge color="red" floating transparent>
                                {{getActivities.length}}
                            </q-badge>
                            <q-tooltip class="bg-grey-8">Todas</q-tooltip>
                        </q-btn>
                        <q-btn round :color="tabAct == 'tarea' ? 'orange':'grey'" icon="task" size="sm"
                            @click="tabAct = 'tarea'" :flat="tabAct == 'tarea' ? false:true">
                            <q-badge color="red" floating transparent>
                                {{getActivities.filter((v:any) => v.tipo_actividad ===
                                'tarea').length}}
                            </q-badge>
                            <q-tooltip class="bg-grey-8">Tareas</q-tooltip>
                        </q-btn>
                        <q-btn round :color="tabAct == 'llamada' ? 'orange':'grey'" icon="phone" size="sm"
                            @click="tabAct = 'llamada'" :flat="tabAct == 'llamada' ? false:true">
                            <q-badge color="red" floating transparent>
                                {{getActivities.filter((v:any) => v.tipo_actividad ===
                                'llamada').length}}
                            </q-badge>
                            <q-tooltip class="bg-grey-8">Llamadas</q-tooltip>
                        </q-btn>
                        <q-btn round :color="tabAct == 'reunion' ? 'orange':'grey'" icon="alarm" size="sm"
                            @click="tabAct = 'reunion'" :flat="tabAct == 'reunion' ? false:true">
                            <q-badge color="red" floating transparent>
                                {{getActivities.filter((v:any) => v.tipo_actividad ===
                                'reunion').length}}
                            </q-badge>
                            <q-tooltip class="bg-grey-8">Reunión</q-tooltip>
                        </q-btn>
                        <q-btn round :color="tabAct == 'correo' ? 'orange':'grey'" icon="email" size="sm"
                            @click="tabAct = 'correo'" :flat="tabAct == 'correo' ? false:true">
                            <q-badge color="red" floating transparent>
                                {{getActivities.filter((v:any) => v.tipo_actividad ===
                                'correo').length}}
                            </q-badge>
                            <q-tooltip class="bg-grey-8">Email</q-tooltip>
                        </q-btn>
                        <q-btn round :color="tabAct == 'whatsap' ? 'orange':'grey'" icon="whatsapp" size="sm"
                            @click="tabAct = 'whatsap'" :flat="tabAct == 'whatsap' ? false:true">
                            <q-badge color="red" floating transparent>
                                {{getActivities.filter((v:any) => v.tipo_actividad ===
                                'watsap').length}}
                            </q-badge>
                            <q-tooltip class="bg-grey-8">Whatsapp</q-tooltip>
                        </q-btn>
                    </div>
                    <div>
                        <q-btn-dropdown color="primary" label="Programar" size="sm">
                            <q-list dense>
                                <q-item clickable v-close-popup>
                                    <q-item-section>
                                        <q-item-label>Tarea</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item clickable v-close-popup>
                                    <q-item-section>
                                        <q-item-label>Llamada</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item clickable v-close-popup>
                                    <q-item-section>
                                        <q-item-label>Reunion</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item clickable v-close-popup>
                                    <q-item-section>
                                        <q-item-label>Correo</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item clickable v-close-popup>
                                    <q-item-section>
                                        <q-item-label>Whatsapp</q-item-label>
                                    </q-item-section>
                                </q-item>
                                <q-item clickable v-close-popup>
                                    <q-item-section>
                                        <q-item-label>Nota</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-btn-dropdown>
                    </div>
                </div>
                <q-timeline color="secondary" style="padding:0px">
                    <div class="column items-center">
                        <q-chip outline square color="grey-6" text-color="white" icon="alarm" size="sm">
                            Actividades por hacer
                        </q-chip>
                    </div>
                    <template v-for="(reg,index) in listAux" :key="index">
                        <q-timeline-entry :icon="
                        reg.tipo_actividad =='tarea' ? 'task':
                        reg.tipo_actividad =='llamada' ? 'phone':
                        reg.tipo_actividad =='reunion' ? 'alarm':
                        reg.tipo_actividad =='correo' ? 'email':
                        ''" :color="
                        reg.tipo_actividad =='tarea' ? 'teal':
                        reg.tipo_actividad =='llamada' ? 'blue':
                        reg.tipo_actividad =='reunion' ? 'cyan-6':
                        reg.tipo_actividad =='correo' ? 'blue-10':
                        ''" text-color="white" v-if="reg.estado =='Planificada'">
                            <template v-slot:title>
                                <q-item bordered separator>
                                    <q-item-section style="padding:0px">
                                        <q-item-label class="text-blue-10 text-subtitle2">{{reg.asunto}}</q-item-label>
                                        <q-item-label >
                                            <q-chip  :color="
                                                reg.estado =='Enviado' ? 'green':
                                                reg.estado =='Realizada' ? 'green-5':
                                                reg.estado =='Completado' ? 'green-5':
                                                reg.estado =='Planificada' ? 'grey-6':
                                                reg.estado =='No iniciada' ? 'grey-6':
                                                reg.estado =='En progreso' ? 'orange-4':
                                                reg.estado =='Aplazada' ? 'red-4':
                                                reg.estado =='No Realizada' ? 'red-4':
                                                ''" :icon="
                                                reg.estado =='Enviado' ? 'check':
                                                reg.estado =='Realizada' ? 'check':
                                                reg.estado =='Completado' ? 'check':
                                                reg.estado =='Planificada' ? 'alarm_on':
                                                reg.estado =='No iniciada' ? 'alarm_on':
                                                reg.estado =='En progreso' ? 'timelapse':
                                                reg.estado =='Aplazada' ? 'close':
                                                reg.estado =='No Realizada' ? 'close':
                                                ''" text-color="white" size="xs">
                                                {{reg.estado}}
                                            </q-chip>
                                            <q-icon name="chevron_right" color="grey-4" size="xs" />
                                            <!-- <q-avatar size="sm" class="q-ml-xs">
                                                <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                                            </q-avatar> {{reg.asignado}} -->
                                            <span :class="reg.control_vencimiento>0 && (reg.estado=='No iniciada' || reg.estado=='Planificada') ? 'text-red-4':'  '">{{reg.fecha_ini_fin}} </span>
                                            
                                        </q-item-label>
                                        
                                        <q-item-label class="q-ml-md">
                                            <span class="text-black">{{reg.descripcion}} </span>
                                        </q-item-label>
                                    </q-item-section>
                                    <q-item-section side top>
                                        <q-item-label caption>
                                           
                                            <span class="q-mr-sm">{{reg.asignado}} </span>
                                            <q-btn dense outline icon="more_vert" size="xs" color="primary" flat />
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                                <!-- <q-separator color="grey-2" inset style="width: 85%;" /> -->
                            </template>
                        </q-timeline-entry>
                    </template>
                    <div class="column items-center">
                        <q-chip outline square color="deep-orange" text-color="white" icon="check" size="sm">
                            Actividades realizadas
                        </q-chip>
                    </div>
                    <template v-for="(reg,index) in listAux" :key="index">
                        <q-timeline-entry :icon="
                        reg.tipo_actividad =='tarea' ? 'task':
                        reg.tipo_actividad =='llamada' ? 'phone':
                        reg.tipo_actividad =='reunion' ? 'alarm':
                        reg.tipo_actividad =='correo' ? 'email':
                        ''" :color="
                        reg.tipo_actividad =='tarea' ? 'teal':
                        reg.tipo_actividad =='llamada' ? 'blue':
                        reg.tipo_actividad =='reunion' ? 'cyan-6':
                        reg.tipo_actividad =='correo' ? 'blue-10':
                        ''" text-color="white" v-if="reg.estado !=='Planificada'">
                            <template v-slot:title>
                                <q-item bordered separator>
                                    <q-item-section style="padding:0px">
                                        <q-item-label class="text-blue-10 text-subtitle2">{{reg.asunto}}</q-item-label>
                                        <q-item-label >
                                            <q-chip  :color="
                                                reg.estado =='Enviado' ? 'green':
                                                reg.estado =='Realizada' ? 'green-5':
                                                reg.estado =='Completado' ? 'green-5':
                                                reg.estado =='Planificada' ? 'grey-6':
                                                reg.estado =='No iniciada' ? 'grey-6':
                                                reg.estado =='En progreso' ? 'orange-4':
                                                reg.estado =='Aplazada' ? 'red-4':
                                                reg.estado =='No Realizada' ? 'red-4':
                                                ''" :icon="
                                                reg.estado =='Enviado' ? 'check':
                                                reg.estado =='Realizada' ? 'check':
                                                reg.estado =='Completado' ? 'check':
                                                reg.estado =='Planificada' ? 'alarm_on':
                                                reg.estado =='No iniciada' ? 'alarm_on':
                                                reg.estado =='En progreso' ? 'timelapse':
                                                reg.estado =='Aplazada' ? 'close':
                                                reg.estado =='No Realizada' ? 'close':
                                                ''" text-color="white" size="xs">
                                                {{reg.estado}}
                                            </q-chip>
                                            <q-icon name="chevron_right" color="grey-4" size="xs" />
                                            <!-- <q-avatar size="sm" class="q-ml-xs">
                                                <img src="https://cdn.quasar.dev/img/boy-avatar.png">
                                            </q-avatar> {{reg.asignado}} -->
                                            <span :class="reg.control_vencimiento>0 && (reg.estado=='No iniciada' || reg.estado=='Planificada') ? 'text-red-4':'  '">{{reg.fecha_ini_fin}} </span>
                                            
                                        </q-item-label>
                                        
                                        <q-item-label class="q-ml-md">
                                            <span class="text-black">{{reg.descripcion}} </span>
                                        </q-item-label>
                                    </q-item-section>
                                    <q-item-section side top>
                                        <q-item-label caption>
                                           
                                            <span class="q-mr-sm">{{reg.asignado}} </span>
                                            <q-btn dense outline icon="more_vert" size="xs" color="primary" flat />
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>
                            </template>
                        </q-timeline-entry>
                    </template>
                </q-timeline>
            </div>
            <div class="q-gutter-y-md" v-else>
                <div class="column no-wrap flex-center">
                    <!-- <q-icon name="person_add_disabled" size="56px" /> -->
                    <div class="q-mt-md text-center">
                        <p>No se encontraron </p>
                        <p>actividades del prospecto</p>
                        <div class="q-pa-md q-gutter-sm">
                            <q-btn round color="teal" icon="task">
                                <q-tooltip class="bg-grey-8">Programar tarea</q-tooltip>
                            </q-btn>
                            <q-btn round color="light-blue" icon="phone">
                                <q-tooltip class="bg-grey-8">Programar llamada</q-tooltip>
                            </q-btn>
                            <q-btn round color="cyan-6" icon="alarm">
                                <q-tooltip class="bg-grey-8">Programar reunión</q-tooltip>
                            </q-btn>
                            <q-btn round color="blue-10" icon="email" @click="openEmail">
                                <q-tooltip class="bg-grey-8">Programar email</q-tooltip>
                            </q-btn>
                            <q-btn round color="green-5" icon="whatsapp">
                                <q-tooltip class="bg-grey-8">Programar whatsapp</q-tooltip>
                            </q-btn>
                            <EmailsActivitieDialog ref="emailDialog" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import { useProspectStore } from '../../store/ProspectStore';
    import EmailsActivitieDialog from '../../../../components/Activities/Dialogs/EmailsActivitieDialog.vue';
    export default {};
</script>
<script lang="ts" setup>

    //Declaracion de Constantes, props.
    const { Get_list_Activities } = useProspectStore();
    const props = defineProps < {
        id: string;
    } > ();
    const id = ref(props.id);
    const idProspect = ref(props.id);
    const getActivities = ref([] as { [key: string]: string }[]);
    //const tabAct = ref('todas');
    const tabAct = ref('todas');

    const emailDialog = ref();
    const openEmail = () => {
        emailDialog.value.open = !emailDialog.value.open;
    };

    //Metodos y funciones
    onMounted(async () => {
        getActivities.value = await Get_list_Activities(id.value);
    });
    const listAux = computed(() => {
        if (tabAct.value == 'todas') {
            return getActivities.value;
        } else {
            return getActivities.value.filter(
                (objeto) =>
                    objeto.tipo_actividad.toLowerCase().indexOf(tabAct.value.toLowerCase()) > -1
            );
        }
    });
</script>
<style lang="sass">
.my-menu-link 
    color: white 
    background: #F2C037 

.q-timeline__title 
    font-size: 0.75rem 
    color:#96A3B0

.q-timeline__content 
    padding-bottom: 0px

.q-timeline__title 
    margin-top: 0
    margin-bottom: 5px

.q-timeline__entry--icon .q-timeline__subtitle
    padding-top: 0px
</style>