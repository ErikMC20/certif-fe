<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { QInput } from 'quasar';
import { userStore } from 'src/modules/Users/store/UserStore';
import { useActivityStore } from 'src/stores/ActivityStore';
import { QuotationTableStore } from '../../store/QuotationTableStore';
const props = withDefaults(
  defineProps<{
    id?: string;
    readMode?: boolean;
  }>(),
  {
    readMode: false,
  }
);
const bloqueado = ref(true);
const edit = ref(false);
const recuperandoMaestra = ref();
const storeMaestra = useActivityStore();
const tableStore = QuotationTableStore();

// const data = ref({
//   name: '',
//   iddivision_c: '',
//   idamercado_c: '',
//   codigoaio_c: '',
//   marca_c: '',
//   nombre_familia_c: '',
//   nombre_grupo_c: '',
//   nombre_subgrupo_c: '',
//   estado: '',
// });
const dataread = ref({
  name: '',
  iddivision: '',
  idamercado: '',
  codigoaio: '',
  marca: '',
  nombrefamilia: '',
  nombregrupo: '',
  nombresubgrupo: '',
  usuariocreacion: '',
  usuariomodificar: '',
});

const loggedUserStore = userStore();

// console.log(loggedUserStore.userCRM);

//* Computed variables

const listDivision = ref();
const listMercado = ref();
//* Default Functions

onMounted(async () => {
  recuperandoMaestra.value = await storeMaestra.getModuleTypeIDPro(
    'HANQ_Modelo',
    props.id
  );
  // console.log(recuperandoMaestra.value);
  dataread.value = {
    name: recuperandoMaestra.value.attributes.name,
    iddivision: recuperandoMaestra.value.attributes.iddivision_c,
    // iddivision_c: lista1.find(
    //   (elem) => elem.cod_div == recuperandoMaestra.value.attributes.iddivision_c
    // ).label,
    idamercado: recuperandoMaestra.value.attributes.idamercado_c,
    codigoaio: recuperandoMaestra.value.attributes.codigoaio_c,
    marca: recuperandoMaestra.value.attributes.marca_c,
    nombrefamilia: recuperandoMaestra.value.attributes.nombre_familia_c,
    nombregrupo: recuperandoMaestra.value.attributes.nombre_grupo_c,
    nombresubgrupo: recuperandoMaestra.value.attributes.nombre_subgrupo_c,
    usuariocreacion: recuperandoMaestra.value.attributes.created_by_name,
    usuariomodificar: recuperandoMaestra.value.attributes.modified_by_name,
  };
  // const listareamercado = useDivAreaMercado('01-19');
  listDivision.value = await tableStore.getDivisionLead();
  // console.log(lis);
  // console.log('nuevo', listDivision.value);
  // await nameDivision(recuperandoMaestra.value.attributes.iddivision_c);
});

watch(
  () => dataread.value.iddivision,
  async () => {
    listMercado.value = await tableStore.getAreaMercaLead(
      dataread.value.iddivision
    );
  }
);

const editList = () => {
  edit.value = true;
  bloqueado.value = false;
  // emit('editcard', edit.value);
};

const cancelEdit = () => {
  edit.value = false;
  bloqueado.value = true;
  // emit('cancelcard', edit.value);
};

// const validateInputs = async () => {
//   const validatedFields = await Promise.all([
//     nameLeadRef.value?.validate(),
//     dateClosedLeadRef.value?.validate(),
//   ]);
//   return validatedFields.every((field) => !!field);
// };

// const exposeData = () => {
//   return inputData.value;
// };

defineExpose({
  // validateInputs,
  // exposeData,
});
</script>
<template>
  <q-card class="my-card">
    <q-card-section class="row justify-between">
      <span>
        <q-icon name="category" size="sm" color="primary" /> Información de la
        Maestra
      </span>
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
      <div class="row q-col-gutter-lg">
        <!-- <q-checkbox
          left-label  v-if="props.idCardread === ''"
          v-model="data.prioridad"
          label="Prioridad Alta"
          true-value="High"
        /> -->
        <!-- <pre>{{ props }}</pre>
        <pre>{{ idCardread }}</pre> -->

        <div class="col-xs-12 col-md-6">
          <q-input
            v-model="dataread.name"
            ref="subjectInputRef"
            type="text"
            label="Nombre del Producto"
            outlined
            dense
            color="primary"
            :readonly="bloqueado"
          >
          </q-input>
        </div>
        <div class="col-xs-12 col-md-6">
          <q-input
            v-model="dataread.codigoaio"
            ref="subjectInputRef"
            type="text"
            label="Codigo AIO"
            outlined
            dense
            color="primary"
            :readonly="bloqueado"
          >
          </q-input>
        </div>
        <div class="col-xs-12 col-md-6">
          <!-- <q-input
            v-model="dataread.iddivision_c"
            ref="subjectInputRef"
            type="text"
            label="Division"
            outlined
            dense
            color="primary"
            :readonly="bloqueado"
          >
          </q-input> -->
          <q-select
            v-model="dataread.iddivision"
            :options="listDivision"
            option-value="cod_div"
            option-label="label"
            emit-value
            map-options
            class="col-12 col-sm-6"
            outlined
            dense
            label="División"
            :readonly="bloqueado"
          />
        </div>
        <div class="col-xs-12 col-md-6">
          <!-- <q-input
            v-model="dataread.idamercado_c"
            ref="subjectInputRef"
            type="text"
            label="Area de Mercado"
            outlined
            dense
            color="primary"
            :readonly="bloqueado"
          >
          </q-input> -->
          <q-select
            v-model="dataread.idamercado"
            :options="listMercado"
            option-value="cod_amercado"
            option-label="label"
            emit-value
            map-options
            class="col-12 col-sm-6"
            outlined
            dense
            label="Area de Mercado"
            :readonly="bloqueado"
          />
        </div>
        <div class="col-xs-12 col-md-6">
          <q-input
            v-model="dataread.nombrefamilia"
            type="text"
            label="Familia"
            outlined
            dense
            color="primary"
            :readonly="bloqueado"
          >
          </q-input>
        </div>
        <div class="col-xs-12 col-md-6">
          <q-input
            v-model="dataread.nombregrupo"
            type="text"
            label="Grupo"
            outlined
            dense
            color="primary"
            :readonly="bloqueado"
          >
          </q-input>
        </div>
        <div class="col-xs-12 col-md-6">
          <q-input
            v-model="dataread.nombresubgrupo"
            type="text"
            label="Sub Grupo"
            outlined
            dense
            color="primary"
            :readonly="bloqueado"
          >
          </q-input>
        </div>
        <div class="col-xs-12 col-md-6">
          <q-input
            v-model="dataread.usuariocreacion"
            type="text"
            label="Usuario de creación"
            outlined
            dense
            color="primary"
            :readonly="bloqueado"
          >
          </q-input>
        </div>
        <div class="col-xs-12 col-md-6">
          <q-input
            v-model="dataread.usuariomodificar"
            type="text"
            label="Usuario modificado"
            outlined
            dense
            color="primary"
            :readonly="bloqueado"
          >
          </q-input>
        </div>

        <!-- <pre>{{ dataread }}</pre> -->
      </div>
    </q-card-section>
    <q-separator inset />
  </q-card>
</template>
