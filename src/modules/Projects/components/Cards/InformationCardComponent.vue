<script lang="ts">
import moment from 'moment';
import { ref, computed, onMounted } from 'vue';
import { Loading, QInput } from 'quasar';
import { BasicInformation, base } from '../../utils/types';
import {
  usePaises,
  useProjectStatus,
  useProjectPriority,
  useRegionales,
} from 'src/composables/useCRMLanguage';
import {
  useDivision,
  useAreaMercado,
  useGrupoCliente,
} from 'src/composables/useLanguage';
import { updateStatusProject } from '../../services/useProjectService';
import { userStore } from '../../../Users/store/UserStore';
import { Notification } from 'src/composables';
import ViewCardVue from 'src/components/MainCard/ViewCard.vue';
import { setStatusColor } from '../../composables';
import { useProjectStore } from '../../store/useProjectStore';
import { storeToRefs } from 'pinia';
</script>
<script setup lang="ts">
//props
const props = withDefaults(
  defineProps<{
    id?: string;
    data?: BasicInformation;
    readMode?: boolean;
  }>(),
  {
    readMode: false,
  }
);

//stores
const { userCRM } = userStore();
const project = useProjectStore();
const { loading, payload } = storeToRefs(project);

//refs
const baseCardRef = ref<InstanceType<typeof ViewCardVue> | null>(null);

//inputs refs for validation
const nameInputRef = ref<InstanceType<typeof QInput> | null>(null);
const startDateInputRef = ref<InstanceType<typeof QInput> | null>(null);
const endDateInputRef = ref<InstanceType<typeof QInput> | null>(null);
const countryInputRef = ref<InstanceType<typeof QInput> | null>(null);
const ubicationInputRef = ref<InstanceType<typeof QInput> | null>(null);

//variables
const alert = ref(false);
const alertdata = ref<base>({});
const listAmercado = ref([]);
const listGcliente = ref([]);
const { getlistPaises, listPaises } = usePaises();
const { getlistRegionales, listRegionales } = useRegionales();
const { getListDivisiones, listDivisiones } = useDivision();
const { getlistProjectStatus, listProjectStatus } = useProjectStatus();
const { getlistProjectPriority, listProjectPriority } = useProjectPriority();

const isEditing = computed(() => baseCardRef.value?.isEditing === 'edit');
const inputData = ref(
  !!props.data
    ? { ...props.data }
    : {
        numeropst_c: '',
        codigoaio_c: '',
        name: '',
        description: '',
        ubicacion_c: '',
        estimated_start_date: moment().format('YYYY-MM-DD'),
        estimated_end_date: moment().add(7, 'days').format('YYYY-MM-DD'),
        real_start_date_c: '',
        real_end_date_c: '',
        status: 'Draft',
        priority: 'High',
        pais_c: '',
        msproject_projecthref_c: '',
        iddivision_c: userCRM.iddivision,
        idamercado_c: userCRM.idamercado,
        idregional_c: userCRM.idregional,
        idgrupocliente_c: '',
        sync_projectserver_c: 0,
      }
);

//functions

const validateInputs = async () => {
  const validatedFields = await Promise.all([
    nameInputRef.value?.validate(),
    startDateInputRef.value?.validate(),
    endDateInputRef.value?.validate(),
    countryInputRef.value?.validate(),
    ubicationInputRef.value?.validate(),
  ]);
  return validatedFields.every((field) => !!field);
};

const restoreValues = () => {
  if (props.data) inputData.value = { ...props.data };
};

const exposeCardData = () => {
  console.log(inputData.value);
  return inputData.value;
};

const openStatusAlert = (status: string) => {
  alert.value = true;
  alertdata.value = {
    icon: setStatusColor(status)?.icon,
    iconColor: setStatusColor(status)?.textColor,
    iconSize: '70px',
    title: '¿Estas seguro de cambiar el estado?',
    message:
      'El estado del proyecto cambiará a : ' + setStatusColor(status)?.text,
    btnText: 'Confirmar',
    btnColor: setStatusColor(status)?.textColor,
    status: status,
    customDate: moment().format('YYYY-MM-DD'),
    comment: '',
  } as base;
};

const confirmStatusChange = async () => {
  try {
    loading.value = true;
    if (props.id !== undefined) {
      await updateStatusProject(props.id, {
        comment: alertdata.value.comment,
        status: alertdata.value.status,
        date: alertdata.value.customDate,
        user_id: userStore().userCRM.id,
      });
    }
  } catch (error) {
  } finally {
    payload.value.status = alertdata.value.status;
    loading.value = false;
    Notification('positive', 'check', 'Acción realizada correctamente.');
    clearConfirmStatus();
  }
};

const clearConfirmStatus = () => {
  alert.value = false;
  alertdata.value = {};
};

const onChangeDivision = async (val: string) => {
  inputData.value.idamercado_c = '';
  inputData.value.idgrupocliente_c = '';
  val === '06'
    ? (inputData.value.sync_projectserver_c = 1)
    : (inputData.value.sync_projectserver_c = 0);
  listAmercado.value = await useAreaMercado(val);
  listGcliente.value = await useGrupoCliente(val);
};

const loadingOptions = async (val: string) => {
  listAmercado.value = await useAreaMercado(val);
  listGcliente.value = await useGrupoCliente(val);
};

//lifecicle
onMounted(async () => {
  if (!props.id) {
    inputData.value.iddivision_c = userCRM.iddivision;
    inputData.value.idamercado_c = userCRM.idamercado;
    inputData.value.idregional_c = userCRM.idregional;
    inputData.value.sync_projectserver_c = 0;
    if (userCRM.iddivision === '06') {
      inputData.value.iddivision_c = '06';
      inputData.value.sync_projectserver_c = 1;
    }
  }
  await getlistProjectPriority();
  await getlistProjectStatus();
  await getlistPaises();
  await getListDivisiones();
  await getlistRegionales();
  await loadingOptions(inputData.value.iddivision_c);
});

//exposes
defineExpose({
  validateInputs,
  exposeCardData,
  isEditing,
});
</script>

<template>
  <view-card-component
    :controls="!!id"
    :initial-status="id ? 'read' : 'edit'"
    icon-name="feed"
    ref="baseCardRef"
    title="Información del proyecto"
    @cancel-change="restoreValues"
    class="q-mb-sm"
  >
    <template #edit>
      <q-card-section class="q-pa-sm" v-if="id" style="overflow-x: auto">
        <q-btn-group spread rounded>
          <q-btn
            :color="
              index <=
              listProjectStatus.findIndex((el:any) => el.value === inputData.status)
                ? setStatusColor(inputData.status ?? '')?.color
                : ''
            "
            :text-color="
              inputData.status === value
                ? setStatusColor(inputData.status ?? '')?.textColor
                : 'grey-9'
            "
            :label="label"
            v-for="({ value, label }, index) in listProjectStatus"
            :key="index"
            dense
            @click="inputData.status !== value ? openStatusAlert(value) : ''"
          />
        </q-btn-group>
      </q-card-section>
      <q-card-section class="row q-col-gutter-sm q-pa-sm">
        <q-input
          v-model="inputData.codigoaio_c"
          type="text"
          label="Código AIO"
          outlined
          dense
          class="col-md-6 col-xs-12 q-pb-md"
          :rules="[
            (val:string) =>
              val.length < 15 || 'Debe contener como máximo 15 caractéres.',
          ]"
        />
        <q-input
          v-model="inputData.numeropst_c"
          type="text"
          label="Código PST"
          :readonly="inputData.iddivision_c === '06'"
          outlined
          dense
          class="col-md-6 col-xs-12 q-pb-md"
          :rules="[
            (val:string) =>
              val.length < 15 || 'Debe contener como máximo 15 caractéres.',
          ]"
        />
        <q-input
          v-model="inputData.name"
          type="text"
          label="Nombre del proyecto"
          outlined
          dense
          class="col-md-6 col-xs-12 q-pb-md"
          ref="nameInputRef"
          :rules="[
            (val:string) => !!val || 'Campo requerido',
            (val:string) => val.length < 50 || 'Debe tener como máximo 50 caractéres.',
          ]"
        />
        <q-input
          v-model="inputData.ubicacion_c"
          type="text"
          label="Ubicación"
          outlined
          dense
          class="col-md-6 col-xs-12 q-pb-md"
          ref="ubicationInputRef"
          :rules="[(val:string) => !!val || 'Campo requerido']"
        />
        <q-input
          v-model="inputData.estimated_start_date"
          type="date"
          label="Fecha estimada de inicio"
          outlined
          dense
          class="col-md-6 col-xs-12 q-pb-md"
          ref="startDateInputRef"
          :rules="[(val:string) => !!val || 'Campo requerido']"
        />
        <q-input
          v-model="inputData.estimated_end_date"
          type="date"
          label="Fecha estimada de entrega"
          outlined
          dense
          class="col-md-6 col-xs-12 q-pb-md"
          ref="endDateInputRef"
          :min="inputData.estimated_start_date"
          :rules="[(val:string) => !!val || 'Campo requerido']"
        />
        <!-- <q-input
          v-if="inputData.real_start_date_c !== '' && id"
          v-model="inputData.real_start_date_c"
          type="date"
          label="Fecha real de inicio"
          outlined
          dense
          color="blue-1"
          class="col-md-6 col-xs-12 q-pb-md"
        />
        <q-input
          v-if="inputData.real_start_date_c !== '' && id"
          v-model="inputData.real_end_date_c"
          type="date"
          label="Fecha real de entrega"
          outlined
          dense
          color="blue-1"
          class="col-md-6 col-xs-12 q-pb-md"
        /> -->
        <q-select
          v-model="inputData.pais_c"
          :options="listPaises"
          label="Pais"
          outlined
          dense
          class="col-md-6 col-xs-12 q-pb-md"
          options-dense
          emit-value
          map-options
          option-value="value"
          option-label="label"
          transition-show="flip-up"
          transition-hide="flip-down"
          ref="countryInputRef"
        />
        <q-input
          v-model="inputData.description"
          type="text"
          label="Alcance"
          outlined
          dense
          class="col-md-6 col-xs-12 q-pb-md"
        />

        <q-select
          v-model="inputData.status"
          :options="listProjectStatus"
          label="Estado"
          outlined
          dense
          class="col-md-6 col-xs-12 q-pb-md"
          options-dense
          emit-value
          map-options
          option-value="value"
          option-label="label"
          transition-show="flip-up"
          transition-hide="flip-down"
          readonly
          hide-dropdown-icon
        />
        <q-select
          v-model="inputData.priority"
          :options="listProjectPriority"
          label="Prioridad"
          outlined
          dense
          class="col-md-6 col-xs-12 q-pb-md"
          options-dense
          emit-value
          map-options
          option-value="value"
          option-label="label"
          transition-show="flip-up"
          transition-hide="flip-down"
        />
        <q-select
          emit-value
          map-options
          :options="listDivisiones"
          @update:model-value="onChangeDivision"
          class="col-12 col-sm-6 q-pb-md"
          dense
          label="División"
          option-label="label"
          option-value="cod_div"
          options-dense
          outlined
          v-model="inputData.iddivision_c"
        />
        <q-select
          v-model="inputData.idamercado_c"
          :options="listAmercado"
          label="Área de Mercado"
          outlined
          dense
          class="col-12 col-sm-6 q-pb-md"
          option-value="cod_amercado"
          option-label="label"
          map-options
          emit-value
          options-dense
          :readonly="inputData.iddivision_c == ''"
        />
        <q-select
          class="col-12 col-sm-6 q-pb-md"
          outlined
          dense
          v-model="inputData.idgrupocliente_c"
          :options="listGcliente"
          type="text"
          label="Grupo Cliente"
          option-value="value"
          option-label="label"
          options-dense
          emit-value
          map-options
        />
        <q-select
          class="col-12 col-sm-6 q-pb-md"
          outlined
          dense
          :options="listRegionales"
          v-model="inputData.idregional_c"
          option-value="value"
          option-label="label"
          options-dense
          emit-value
          map-options
          type="text"
          label="Reginal"
        />
        <q-input
          v-model="inputData.msproject_projecthref_c"
          type="text"
          label="MS Project URL"
          outlined
          dense
          class="col-md-6 col-xs-12 q-pb-md"
        />
        <q-checkbox
          v-model="inputData.sync_projectserver_c"
          label="Sincronizar con MS Project"
          :false-value="0"
          :true-value="1"
          class="q-mb-md text-uppercase"
        />
      </q-card-section>
    </template>
    <template #read>
      <q-card-section class="q-pa-sm" style="overflow-x: auto">
        <q-btn-group spread rounded>
          <q-btn
            disable
            :color="
              index <=
              listProjectStatus.findIndex((el:any) => el.value === inputData.status)
                ? 'grey-4'
                : ''
            "
            :text-color="'grey-9'"
            :label="label"
            v-for="({ value, label }, index) in listProjectStatus"
            :key="index"
            dense
            @click="inputData.status !== value ? openStatusAlert(value) : ''"
          />
        </q-btn-group>
      </q-card-section>
      <q-card-section class="row q-col-gutter-sm q-pa-sm">
        <q-input
          v-model="inputData.codigoaio_c"
          type="text"
          label="Código AIO"
          outlined
          dense
          class="col-md-6 col-xs-12 q-pb-md"
          readonly
        />
        <q-input
          v-model="inputData.numeropst_c"
          type="text"
          label="Código PST"
          outlined
          dense
          class="col-md-6 col-xs-12 q-pb-md"
          readonly
        />
        <q-input
          v-model="inputData.name"
          type="text"
          label="Nombre del proyecto"
          outlined
          dense
          class="col-md-6 col-xs-12 q-pb-md"
          readonly
        />
        <q-input
          v-model="inputData.ubicacion_c"
          type="text"
          label="Ubicación"
          outlined
          dense
          class="col-md-6 col-xs-12 q-pb-md"
          readonly
        />
        <q-input
          v-model="inputData.estimated_start_date"
          type="date"
          label="Fecha estimada de inicio"
          outlined
          dense
          class="col-md-6 col-xs-12 q-pb-md"
          readonly
        />
        <q-input
          v-model="inputData.estimated_end_date"
          type="date"
          label="Fecha estimada de entrega"
          outlined
          dense
          class="col-md-6 col-xs-12 q-pb-md"
          readonly
        />
        <!-- <q-input
          v-model="inputData.real_start_date_c"
          type="date"
          label="Fecha real de inicio"
          outlined
          dense
          bg-color="grey-3"
          class="col-md-6 col-xs-12 q-pb-md"
          readonly
        />
        <q-input
          v-model="inputData.real_end_date_c"
          type="date"
          label="Fecha real de entrega"
          outlined
          dense
          bg-color="grey-3"
          class="col-md-6 col-xs-12 q-pb-md"
          readonly
        /> -->
        <q-select
          v-model="inputData.pais_c"
          :options="listPaises"
          label="País"
          outlined
          dense
          class="col-md-6 col-xs-12 q-pb-md"
          readonly
          emit-value
          map-options
          options-dense
          option-value="value"
          hide-dropdown-icon
          transition-show="flip-up"
          transition-hide="flip-down"
        />
        <q-input
          v-model="inputData.description"
          type="text"
          label="Alcance"
          outlined
          dense
          class="col-md-6 col-xs-12 q-pb-md"
          readonly
        />
        <q-select
          v-model="inputData.status"
          :options="listProjectStatus"
          label="Estado"
          outlined
          dense
          class="col-md-6 col-xs-12 q-pb-md"
          options-dense
          emit-value
          map-options
          option-value="value"
          option-label="label"
          transition-show="flip-up"
          transition-hide="flip-down"
          hide-dropdown-icon
          readonly
        />
        <q-select
          v-model="inputData.priority"
          :options="listProjectPriority"
          label="Prioridad"
          outlined
          dense
          class="col-md-6 col-xs-12 q-pb-md"
          options-dense
          emit-value
          map-options
          option-value="value"
          option-label="label"
          transition-show="flip-up"
          transition-hide="flip-down"
          hide-dropdown-icon
          readonly
        />
        <q-select
          map-options
          :options="listDivisiones"
          class="col-12 col-sm-6 q-pb-md"
          dense
          label="División"
          option-label="label"
          option-value="cod_div"
          options-dense
          outlined
          transition-hide="flip-down"
          transition-show="flip-up"
          v-model="inputData.iddivision_c"
          hide-dropdown-icon
          readonly
        />
        <q-select
          v-model="inputData.idamercado_c"
          :options="listAmercado"
          label="Área de Mercado"
          transition-show="flip-up"
          transition-hide="flip-down"
          outlined
          dense
          class="col-12 col-sm-6 q-pb-md"
          option-value="cod_amercado"
          option-label="label"
          map-options
          emit-value
          options-dense
          :disable="inputData.iddivision_c == ''"
          hide-dropdown-icon
          readonly
        />
        <q-select
          class="col-12 col-sm-6 q-pb-md"
          outlined
          dense
          v-model="inputData.idgrupocliente_c"
          :options="listGcliente"
          type="text"
          label="Grupo Cliente"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          hide-dropdown-icon
          readonly
        />
        <q-select
          class="col-12 col-sm-6 q-pb-md"
          outlined
          dense
          :options="listRegionales"
          v-model="inputData.idregional_c"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          type="text"
          label="Región"
          hide-dropdown-icon
          readonly
        />
        <q-input
          v-model="inputData.msproject_projecthref_c"
          type="url"
          label="MS Project URL"
          outlined
          dense
          readonly
          class="col-md-6 col-xs-12 q-pb-md"
        />
        <q-checkbox
          v-model="inputData.sync_projectserver_c"
          label="Sincornizar con MS Project"
          class="text-uppercase q-mb-md"
          :false-value="0"
          :true-value="1"
          disable
        />
      </q-card-section>
    </template>
  </view-card-component>
  <alert-component
    v-model="alert"
    v-bind="alertdata"
    @confirm="confirmStatusChange"
    @denegate="clearConfirmStatus"
  >
    <template #body>
      <div class="q-py-sm">
        {{ alertdata.message }}
      </div>
      <!--
      <q-input
        v-model="alertdata.customDate"
        type="date"
        label="Fecha inicio real"
        class="col-12"
        outlined
        v-if="alertdata.status === 'Underway'"
      />
      <q-input
        v-model="alertdata.customDate"
        type="date"
        label="Fecha fin real"
        class="col-12"
        outlined
        v-else-if="alertdata.status === 'Completed'"
      /> -->
      <q-input
        v-model="alertdata.comment"
        type="textarea"
        rows="2"
        label="Comentario"
        class="col-12"
        autofocus
        outlined
      />
    </template>
  </alert-component>
</template>
<style lang="scss" scoped>
.title-card {
  font-size: 1em;
}
</style>
