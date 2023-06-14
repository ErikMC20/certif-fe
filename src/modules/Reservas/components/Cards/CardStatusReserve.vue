<script lang="ts" setup>
  import { ref } from 'vue';
  import { RelationInfoLead } from '../../utils/types';
  import ViewCardVue from 'src/components/MainCard/ViewCard .vue';
  import { api } from '../../../../boot/axios';
  import { userStore } from '../../../../modules/Users/store/UserStore';
  import { QInput, useQuasar, QSpinnerPuff } from 'quasar';

  const emits = defineEmits < { (event: 'formSavedd'): void }> ();
  const props = withDefaults(
    defineProps < { 
      id?: string; 
      data?: any } > (),
    {}
  );
  const $q = useQuasar();
  const user = userStore();
  const idusuario = user.userCRM.id;
  const baseCardRef = ref < InstanceType < typeof ViewCardVue > | null > ();
  const confirma = ref(false);
  const rechazar = ref(false);
  const comentario = ref('');
  const StageReserveUpdateSend = ref({
    attributes: {
      modified_user_id: '1',
      reser_stage_c: '',
    },
  });

  const commentSend = ref({
    comment: {
      bean_module: '',
      bean_id: '000786B9-BA41-4810-AD71-0AF6EEF25F11',
      visualizacion_c: 'interno',
      description: '',
      relevance: 'medium',
      created_by: '',
      assigned_user_id: '',
    },
  });

  const addComments = async (val: string) => {
    commentSend.value.comment.bean_module = 'HANQ_Reservas';
    commentSend.value.comment.description = val;
    commentSend.value.comment.bean_id = props.id || '' ;
    commentSend.value.comment.created_by = idusuario;
    commentSend.value.comment.assigned_user_id = idusuario;
    const response = await api.post(
      `${process.env.CRM4_LB_GLOBAL}/comments-new`,
      commentSend.value
    );
    comentario.value = '';
    confirma.value=false;
    rechazar.value=false;
  };

  const UpdateStageReserve = async (val: string, text: string) => {
    $q.loading.show({
            spinner: QSpinnerPuff,
            message: 'Actualizando Reserva',
          });
    await addComments(text);
    StageReserveUpdateSend.value.attributes.reser_stage_c = val;
    StageReserveUpdateSend.value.attributes.modified_user_id = idusuario;
    try {
      const response = await api.patch(
        `${process.env.CRM4_LB_02}/Reserve-update/${props.id}`,
        StageReserveUpdateSend.value
      );  
    } catch (error) {
    } finally {
      emits('formSavedd');
    }
  };

</script>
<template>
  <view-card-component ref="baseCardRef" :initial-status="id ? 'read' : 'edit'" icon-name="manage_accounts"
    title="Aprobaciones" style="width: 100%;">
    <template #edit>
    </template>
    <template #read>
      <div class="column items-center">
       <span v-if="props.data?.reser_stage_c==''" class="text-caption">Que acción desea realizar con la reserva?</span> 
       <span v-else class="text-caption"> La reserva ya se encuentra {{ props.data?.reser_stage_c=='Confirmed' ? 'Confirmada':props.data?.reser_stage_c=='rejected' ? 'Rechazada':'Sin acción'  }}</span> 
        <div class="q-pa-md q-gutter-sm">
          <q-btn :class="$q.screen.xs ? 'full-width':''" color="green" label="confirmar reserva" :disable="props.data?.reser_stage_c=='' ? false:true"  icon="check" size="sm" @click="confirma = true" />
          <q-btn :class="$q.screen.xs ? 'full-width':''" color="red" outline label="Rechazar reserva" :disable="props.data?.reser_stage_c=='' ? false:true" icon="do_not_disturb_alt" size="sm" @click="rechazar = true" />
        </div>
      </div>
    </template>
  </view-card-component>

  <q-dialog v-model="confirma" persistent transition-show="flip-down" transition-hide="flip-up">
    <q-card style="width: 40%;">
      <q-card-section class="text-center q-pa-md">
        <q-icon name="info" size="50px" color="primary" class="q-mb-sm" />
        <p class="text-h7 text-red text-weight-medium">¿Esta seguro confirmar la reserva?</p>
        <div class="text-h7 text-grey-7">
          Nota: Se enviara un correo de confirmación de la reserva.</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="text-h7">
          <q-icon name="fiber_manual_record" :color="comentario=='' ? 'grey-4':'orange'" /> Ingrese un comentario
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input placeholder="Escriba aqui..." dense v-model="comentario" autofocus type="textarea" />
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn color="primary" label="Si, confirmar" @click="UpdateStageReserve('Confirmed',comentario)" />
        <q-btn outline color="primary" label="Cancelar" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="rechazar" persistent transition-show="flip-down" transition-hide="flip-up">
    <q-card style="width: 40%;">
      <q-card-section class="text-center q-pa-md">
        <q-icon name="info" size="50px" color="primary" class="q-mb-sm" />
        <p class="text-h7 text-red text-weight-medium">¿Esta seguro rechazar la reserva?</p>
        <div class="text-h7 text-grey-7">
          Nota: Se enviara un correo de rechazo de la reserva.</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="text-h7">
          <q-icon name="fiber_manual_record" :color="comentario=='' ? 'grey-4':'orange'" /> Ingrese un comentario
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input placeholder="Escriba aqui..." dense v-model="comentario" autofocus type="textarea" />
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn color="primary" label="Si, rechazar" @click="UpdateStageReserve('rejected',comentario)" />
        <q-btn outline color="primary" label="Cancelar" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>