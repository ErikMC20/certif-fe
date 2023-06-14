<script lang="ts">
import { ref, onMounted } from 'vue';
import { QInput } from 'quasar';
import moment from 'moment';
import { useActivityStore } from 'src/stores/ActivityStore';
import DurationDate from '../../../GlobalComponent/DurationDate.vue';
import ContactPhones from '../Dialog/ContactPhones.vue';
import { ModuleActivity } from '../../../../types/index';
</script>
<script lang="ts" setup>
//props definitions
const props = defineProps<{
  idModule: string;
  idCardread?: string;
  ModuleTypeC: ModuleActivity;
  idActivityC?: string;
}>();

//stores definition
const storeCall = useActivityStore();

//variables
const listStatus = ref();
const listType = ref();
const duracionCall = ref();
const duracionCallRead = ref();
const recuperandoCall = ref();
const bloqueado = ref(true);
const edit = ref(false);
const ContactPhonesDi = ref(false);

const subjectInputRef = ref<InstanceType<typeof QInput> | null>(null);
const durationInput = ref<InstanceType<typeof DurationDate> | null>(null);

const data = ref({
  asunto: '',
  telefono: '',
  tipollamada: 'Saliente',
  estadollamada: 'Planificada',
  dateestartCall: '',
  duracionhoraCall: '',
  duracionminutoCall: '',
  dateendCall: '',
  descripcion: '',
  modulorela: props.ModuleTypeC,
  relaUserCall: '',
  idrelaUserCall: '',
  prioridad: 'Short',
});

const dataread = ref({
  id: '',
  asunto: '',
  telefono: '',
  tipollamada: '',
  estadollamada: '',
  dateestartCall: '',
  duracionhoraCall: '',
  duracionminutoCall: '',
  dateendCall: '',
  descripcion: '',
  modulorela: '',
  relaUserCall: '',
  idrelaUserCall: '',
  prioridad: '',
});

onMounted(async () => {
  listStatus.value = await storeCall.getCallStatusPro();
  listType.value = await storeCall.getCallTypePro();
  const aux1 = await storeCall.getCallTypePro();
  const aux2 = await storeCall.getCallStatusPro();
  selects();
  if (props.idCardread != '') {
    recuperandoCall.value = await storeCall.getCallsPro(props.idCardread ?? '');
    dataread.value.id = recuperandoCall.value.id;
    dataread.value.asunto = recuperandoCall.value.attributes.name;
    dataread.value.telefono = recuperandoCall.value.attributes.phone_c;
    dataread.value.dateestartCall = moment(
      recuperandoCall.value.attributes.date_start
    )
      .add(4, 'h')
      .format('YYYY-MM-DD HH:mm:ss');

    dataread.value.duracionhoraCall =
      recuperandoCall.value.attributes.duration_hours;

    dataread.value.duracionminutoCall =
      recuperandoCall.value.attributes.duration_minutes;

    dataread.value.dateendCall = moment(
      recuperandoCall.value.attributes.date_end
    )
      .add(4, 'h')
      .format('YYYY-MM-DD HH:mm:ss');

    dataread.value.descripcion = recuperandoCall.value.attributes.description;
    dataread.value.modulorela = recuperandoCall.value.attributes.parent_type;
    dataread.value.idrelaUserCall = recuperandoCall.value.attributes.parent_id;
    dataread.value.prioridad = recuperandoCall.value.attributes.prioridad_c;

    aux1.map((el) => {
      if (el.name_en == recuperandoCall.value.attributes.direction) {
        dataread.value.tipollamada = el.name_es;
      } else {
      }
      return console.log('object');
    });
    aux2.map((el) => {
      if (el.name_en == recuperandoCall.value.attributes.status) {
        dataread.value.estadollamada = el.name_es;
      } else {
      }
      return console.log('object2');
    });
  } else {
  }
});
const selects = async () => {
  const aux11 = await storeCall.getCallTypePro();
  const aux22 = await storeCall.getCallStatusPro();
  aux11.map((el: any) => {
    if (el.name_es == 'Saliente') {
      data.value.tipollamada = el.name_es;
    }
  });
  aux22.map((el: any) => {
    if (el.name_es == 'Planificada') {
      data.value.estadollamada = el;
    }
  });
};

const changeDateC = (val: string) => {
  duracionCall.value = val;
  data.value.dateestartCall = moment(duracionCall.value.datestart).format(
    'YYYY-MM-DD HH:mm:ss'
  );
  data.value.dateendCall = moment(duracionCall.value.dateend).format(
    'YYYY-MM-DD HH:mm:ss'
  );
  data.value.duracionhoraCall = duracionCall.value.duracionhora;
  data.value.duracionminutoCall = duracionCall.value.duracionminuto;
};
const changeDateRead = (val: string) => {
  duracionCallRead.value = val;
  dataread.value.dateestartCall = moment(
    duracionCallRead.value.datestart
  ).format('YYYY-MM-DD HH:mm:ss');
  dataread.value.dateendCall = moment(duracionCallRead.value.dateend).format(
    'YYYY-MM-DD HH:mm:ss'
  );
  dataread.value.duracionhoraCall = duracionCallRead.value.duracionhora;
  dataread.value.duracionminutoCall = duracionCallRead.value.duracionminuto;
};
const enviandoteleC = (val: string) => {
  data.value.telefono = val;
  ContactPhonesDi.value = false;
};

const rulesInput = async (): Promise<boolean | undefined> =>
  (await Promise.all([subjectInputRef.value?.validate()])).every(
    (input) => !!input
  );

const editList = () => {
  edit.value = true;
  bloqueado.value = false;
  emit('editcard', edit.value);
};

const cancelEdit = () => {
  edit.value = false;
  bloqueado.value = true;
  emit('cancelcard', edit.value);
};

const emit = defineEmits<{
  (event: 'editcard', editcar: boolean): void;
  (event: 'cancelcard', cancelcar: boolean): void;
}>();

const exposeData = () => {
  if (props.idCardread != '') {
    return dataread.value;
  } else {
    return data.value;
  }
};

defineExpose({
  exposeData,
  rulesInput,
});
</script>
<template>
  <q-card class="my-card" v-if="!props.idCardread">
    <q-card-section class="row justify-between">
      <span>
        <q-icon name="call" size="sm" color="primary" /> Informacion de la
        llamada
      </span>
      <span
        ><q-checkbox
          left-label
          v-model="data.prioridad"
          size="xs"
          label="Prioridad Alta"
          color="primary"
          true-value="High"
          false-value="Short" />
        <q-icon
          name="local_fire_department"
          :color="data.prioridad == 'High' ? 'red' : 'grey-5'"
        ></q-icon
      ></span>
    </q-card-section>
    <q-separator></q-separator>
    <q-card-section>
      <div class="row q-col-gutter-sm">
        <div class="col-xs-12">
          <q-input
            v-model="data.asunto"
            ref="subjectInputRef"
            type="text"
            label="Asunto"
            outlined
            dense
            color="primary"
            :rules="[(val:string) => !!val || 'El campo es requerido']"
          >
            <template #before>
              <q-icon name="contact_phone" />
            </template>
          </q-input>
        </div>
        <div class="col-md-12 col-xs-12">
          <q-input
            v-model="data.telefono"
            ref="subjectInputRef"
            type="text"
            label="Número"
            outlined
            dense
            color="primary"
            :rules="[(val:string) => !!val || 'El campo es requerido']"
          >
            <template #before>
              <q-icon name="phone_forwarded" />
            </template>
          </q-input>
        </div>
        <div class="col-md-6 col-xs-12">
          <q-select
            v-model="data.tipollamada"
            :options="listType"
            label="Tipo de llamada"
            outlined
            dense
            options-dense
            option-value="value"
            option-label="name_es"
            transition-show="flip-up"
            transition-hide="flip-down"
            color="primary"
          >
            <template #before>
              <q-icon name="settings_phone" />
            </template>
          </q-select>
        </div>
        <div class="col-md-6 col-xs-12">
          <q-select
            v-model="data.estadollamada"
            :options="listStatus"
            label="Estado"
            dateinpu
            outlined
            dense
            options-dense
            option-value="value"
            option-label="name_es"
            transition-show="flip-up"
            transition-hide="flip-down"
            color="primary"
          >
          </q-select>
        </div>

        <component
          :is="DurationDate"
          ref="durationInput"
          @changeDate="changeDateC"
          durationselect
        >
        </component>
        <div class="col-xs-12">
          <q-input
            v-model="data.descripcion"
            type="textarea"
            label="Descripción"
            outlined
            color="primary"
            dense
          >
            <template #before>
              <q-icon name="description" />
            </template>
          </q-input>
        </div>
      </div>
    </q-card-section>
    <q-separator inset />
  </q-card>
  <!-- -------------------------------PARA LA LEER LOS DATOS ----------------------------------->
  <q-card class="my-card" v-else>
    <q-card-section class="row justify-between">
      <span>
        <q-icon name="call" size="sm" color="primary" /> Información de la
        llamada
      </span>
      <!-- <q-label> {{ id_pro }}</q-label> -->
      <!-- <span
        ><q-checkbox
          left-label
          v-model="dataread.prioridad"
          size="xs"
          label="Prioridad Alta"
          color="primary"
          true-value="High"
          false-value="Low" />
        <q-icon
          name="local_fire_department"
          :color="data.prioridad == 'High' ? 'red' : 'grey-5'"
        ></q-icon
      ></span> -->
      <q-btn
        size="10px"
        flat
        dense
        icon="mode_edit"
        class="float-right"
        :color="!$q.dark.isActive ? 'grey-8' : 'white'"
        @click="editList"
        v-if="!edit"
      >
        <q-tooltip>Editar</q-tooltip>
      </q-btn>
      <q-btn
        v-else
        size="10px"
        flat
        dense
        icon="cancel"
        class="float-right"
        :color="!$q.dark.isActive ? 'grey-8' : 'white'"
        @click="cancelEdit"
      >
        <q-tooltip>Cancelar</q-tooltip>
      </q-btn>
    </q-card-section>
    <q-separator></q-separator>
    <q-card-section>
      <div class="row q-col-gutter-sm">
        <span
          ><q-checkbox
            left-label
            v-model="dataread.prioridad"
            size="xs"
            label="Prioridad Alta"
            color="primary"
            true-value="High"
            false-value="Short"
            :disable="bloqueado" />
          <q-icon
            name="local_fire_department"
            :color="data.prioridad == 'High' ? 'red' : 'grey-5'"
          ></q-icon
        ></span>

        <div class="col-xs-12">
          <q-input
            v-model="dataread.asunto"
            ref="subjectInputRef"
            type="text"
            label="Asunto"
            outlined
            dense
            color="primary"
            :rules="[(val:string) => !!val || 'El campo es requerido']"
            :readonly="bloqueado"
          >
            <template #before>
              <q-icon name="contact_phone" />
            </template>
          </q-input>
        </div>
        <div class="col-md-12 col-xs-12">
          <q-input
            v-model="data.telefono"
            ref="subjectInputRef"
            type="text"
            label="Número"
            outlined
            dense
            color="primary"
            :rules="[(val:string) => !!val || 'El campo es requerido']"
          >
            <template #before>
              <q-icon name="phone_forwarded" />
            </template>
          </q-input>
        </div>
        <div class="col-md-6 col-xs-12">
          <q-select
            v-model="dataread.tipollamada"
            :options="listType"
            label="Tipo de llamada"
            outlined
            dense
            options-dense
            option-value="value"
            option-label="name_es"
            transition-show="flip-up"
            transition-hide="flip-down"
            color="primary"
            :readonly="bloqueado"
          >
            <template #before>
              <q-icon name="settings_phone" />
            </template>
          </q-select>
        </div>
        <div class="col-md-6 col-xs-12">
          <q-select
            v-model="dataread.estadollamada"
            :options="listStatus"
            label="Estado"
            dateinpu
            outlined
            dense
            options-dense
            option-value="value"
            option-label="name_es"
            transition-show="flip-up"
            transition-hide="flip-down"
            color="primary"
            :readonly="bloqueado"
          >
            <!-- <template #before>
              <q-icon name="manage_accounts" />
            </template> -->
          </q-select>
        </div>
        <component
          :is="DurationDate"
          ref="durationInput"
          @changeDateR="changeDateRead"
          durationselect
          :data="dataread"
          :bloquear="bloqueado"
          :idCard="props.idCardread"
        >
        </component>

        <div class="col-xs-12">
          <q-input
            v-model="dataread.descripcion"
            type="textarea"
            label="Descripción"
            outlined
            color="primary"
            dense
            :readonly="bloqueado"
          >
            <template #before>
              <q-icon name="description" />
            </template>
          </q-input>
        </div>
        <!-- <pre>{{ dataread }}</pre> -->
      </div>
    </q-card-section>
    <q-separator inset />
  </q-card>
  <ContactPhones
    v-model="ContactPhonesDi"
    :idCall="props.idModule"
    :buscarConta="ContactPhonesDi"
    @enviandotele="enviandoteleC"
  />
</template>

<style lang="scss" scoped></style>
