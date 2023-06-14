<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import RelacionadoCon from '../../Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoCon.vue';
import RelacionadoPro from '../../Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoPro.vue';
import { useActivityStore } from 'src/stores/ActivityStore';

const prospect_param = ref();
const listModules = ref();
const objRelacion = ref();
const props = defineProps<{
  name?: string;
  idModuleC: string;
  ModuleTypeR?: any;
  bloquear: boolean;
}>();

const dataSend = ref({
  modulorela: '',
  relaUser: '',
  idrelaUser: '',
});
const storeCallpros = useActivityStore();
const advancedFilterCon = ref<InstanceType<typeof RelacionadoCon> | null>(null);
const advancedFilterPro = ref<InstanceType<typeof RelacionadoPro> | null>(null);

onMounted(async () => {
  // console.log(props.idModule);
  listModules.value = await storeCallpros.getModulesPro();
  prospect_param.value = await storeCallpros.getModuleTypeIDPro(
    props.ModuleTypeR,
    props.idModuleC
  );
  if (!prospect_param.value.attributes.name) {
    dataSend.value.relaUser =
      prospect_param.value.attributes.first_name +
      ' ' +
      prospect_param.value.attributes.last_name;
  } else {
    dataSend.value.relaUser = prospect_param.value.attributes.name;
  }
  dataSend.value.idrelaUser = props.idModuleC;
  selects();
  console.log(prospect_param.value, props.ModuleTypeR, props.idModuleC);

  emit('changeRela', dataSend.value);
});

// watch(
//   () => dataSend.value.modulorela,
//   async () => {
//     // dataSend.value.relaUser = '';
//     console.log(dataSend.value.relaUser);
//   }
// );
const selects = async () => {
  const aux11 = await storeCallpros.getModulesPro();
  aux11.map((el) => {
    if (el.value == props.ModuleTypeR) {
      dataSend.value.modulorela = el;
    } else {
    }
    return console.log('realcionado con');
  });
};

const openDialogFilter = (option: string) => {
  console.log(option);
  objRelacion.value = dataSend.value.modulorela;
  console.log(objRelacion.value.label_es);
  if (objRelacion.value.label_es == 'Prospecto') {
    advancedFilterPro.value?.openDialog();
  } else if (objRelacion.value.label_es == 'Contacto') {
    advancedFilterCon.value?.openDialog();
  } else {
  }
};

const selectRela = (item: any) => {
  console.log(item);
  dataSend.value.relaUser = item.nombre;
  dataSend.value.idrelaUser = item.id;
  emit('changeRela', dataSend.value);
};

const emit = defineEmits<{
  (event: 'changeRela', dataSend: any): void;
}>();

const clearRela = () => {
  dataSend.value.relaUser = '';
  dataSend.value.idrelaUser = '';
};

const exposeData = () => {
  return dataSend.value;
};
defineExpose({
  exposeData,
});
</script>
<template>
  <div class="row q-col-gutter-sm col-12">
    <div class="col-md-6 col-xs-12">
      <!-- <q-label color="primary">Relacionado con:</q-label> -->
      <q-select
        v-model="dataSend.modulorela"
        :options="listModules"
        label="Relacionado con"
        dateinpu
        outlined
        dense
        options-dense
        option-value="value"
        option-label="label_es"
        transition-show="flip-up"
        transition-hide="flip-down"
        color="primary"
        :readonly="props.bloquear"
      >
        <template #before>
          <q-icon name="manage_accounts" />
        </template>
      </q-select>
    </div>
    <!-- <div class="col-md-6 col-xs-6">
          <q-input
            v-model="rela"
            label="Relacionado con Prost"
            value="duramas"
            type="text"
            outlined
            dense
            color="primary"
            readonly
            v-if="!data.modulorela"
          />
        </div> -->
    <!-- <pre>{{ id_prospect }}</pre> -->
    <div class="col-xs-12">
      <q-input
        v-model="dataSend.relaUser"
        label="Relacionado con:"
        type="text"
        outlined
        dense
        color="primary"
        readonly
        visible="false"
      >
        <template v-slot:after>
          <q-btn
            icon="find_in_page"
            color="primary"
            dense
            outline
            @click="openDialogFilter(dataSend.modulorela)"
            :disable="props.bloquear"
          >
          </q-btn>
          <q-btn
            dense
            icon="close"
            color="negative"
            outline
            @click="clearRela"
            :disable="props.bloquear"
          />
        </template>
        <template #before>
          <q-icon name="person_pin" />
        </template>
      </q-input>
    </div>
  </div>
  <RelacionadoCon ref="advancedFilterCon" @selectItem="selectRela" id="" />
  <RelacionadoPro ref="advancedFilterPro" @selectItem="selectRela" id="" />
  <!-- <pre>{{ dataSend }}</pre> -->
</template>

<style lang="scss" scoped></style>
