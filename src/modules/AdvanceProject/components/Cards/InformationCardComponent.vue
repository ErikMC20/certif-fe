<script lang="ts">
import { QInput } from 'quasar';
import { ref, computed, onMounted } from 'vue';
import { BasicInformation } from '../../utils/types';
import ViewCardVue from 'src/components/MainCard/ViewCard.vue';
import { getWorkareasList } from '../../services/useAssignmentService';
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

//refs
const baseCardRef = ref<InstanceType<typeof ViewCardVue> | null>(null);

//inputs refs for validation
const nameInputRef = ref<InstanceType<typeof QInput> | null>(null);

//variables
const isEditing = computed(() => baseCardRef.value?.isEditing === 'edit');
const inputData = ref(
  !!props.data
    ? { ...props.data }
    : {
        code_c: 'REPCPR-01',
        name: '',
        estimated_start_date_c: moment().calendar(),
        estimated_end_date_c: moment().add(1, 'days').calendar(),
        project_id: '',
      }
);
const listAreas = ref([]);
//functions
const validateInputs = async () => {
  const validatedFields = await Promise.all([nameInputRef.value?.validate()]);
  return validatedFields.every((field) => !!field);
};

const restoreValues = () => {
  if (props.data) inputData.value = { ...props.data };
};

const exposeCardData = () => {
  return inputData.value;
};
onMounted(async () => {
  if (props.id) {
    listAreas.value = await getWorkareasList(props.id);
  }

  inputData.value.estimated_start_date_c = moment().format('YYYY-MM-DD');
  inputData.value.estimated_end_date_c = moment()
    .add(1, 'days')
    .format('YYYY-MM-DD');
});

const check1 = ref([]);

//lifecicle

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
    title="INFORMACION DE LA PLANIFICACION"
    @cancel-change="restoreValues"
    class="q-mb-sm"
  >
    <template #edit>
      <div>INFORMACION DE LA PLANIFICACION</div>
      <q-card-section class="row q-col-gutter-md">
        <q-input
          model-value="REPCP01/150323"
          type="text"
          label="Código"
          outlined
          readonly
          dense
          class="col-6 q-pb-md"
        />
        <q-select
          v-model="inputData.name"
          :options="['CARAPARI 01', 'CARAPARI 02', 'VILLATUNARI 01']"
          label="Area de trabajo"
          class="col-6"
          outlined
          dense
          ref="nameInputRef"
        />
        <q-input
          v-model="inputData.estimated_start_date_c"
          type="date"
          label="Fecha de inicio"
          dense
          outlined
          dinputDataense
          class="col-6 q-pb-md"
        />
        <q-input
          v-model="inputData.estimated_end_date_c"
          type="date"
          label="Fecha de finalización"
          outlined
          dense
          class="col-6 q-pb-md"
        />
        <template v-if="inputData.name != ''">
          <div>TAREAS SELECCIONADAS</div>
          <q-expansion-item
            class="col-12"
            :content-inset-level="0.5"
            expand-separator
            label="WDD"
            caption="5 tareas"
            default-opened
          >
            <q-item>
              <q-item-section side top>
                <q-checkbox v-model="check1" val="uno" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Walkout</q-item-label>
              </q-item-section>
              <q-item-section style="width: 150px" side>
                <div>
                  <q-input
                    model-value="0"
                    type="text"
                    dense
                    outlined
                    :readonly="!check1.find((el) => el == 'uno')"
                  >
                    <template v-slot:append>
                      <small style="font-size: 0.5em"> / 30 U</small>
                    </template>
                  </q-input>
                </div>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section side top>
                <q-checkbox v-model="check1" val="2" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Digitalizacion</q-item-label>
              </q-item-section>
              <q-item-section style="width: 150px" side>
                <div>
                  <q-input
                    model-value="0"
                    type="text"
                    dense
                    outlined
                    :readonly="!check1.find((el) => el == '2')"
                  >
                    <template v-slot:append>
                      <small style="font-size: 0.5em"> / 30 U</small>
                    </template>
                  </q-input>
                </div>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section side top>
                <q-checkbox v-model="check1" val="3" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Documentacion Permisos</q-item-label>
              </q-item-section>
              <q-item-section style="width: 150px" side>
                <div>
                  <q-input
                    model-value="0"
                    type="text"
                    dense
                    outlined
                    :readonly="!check1.find((el) => el == '3')"
                  >
                    <template v-slot:append>
                      <small style="font-size: 0.5em"> / 30 U</small>
                    </template>
                  </q-input>
                </div>
              </q-item-section>
            </q-item>
          </q-expansion-item>
          <q-expansion-item
            class="col-12"
            :content-inset-level="0.5"
            expand-separator
            label="INSTALACION DE POSTES Y OTRAS CIVILES"
            caption="1 tareas"
            default-opened
          >
            <q-item>
              <q-item-section side top>
                <q-checkbox v-model="check1" val="4" />
              </q-item-section>
              <q-item-section>
                <q-item-label>POSTES DE 9m</q-item-label>
              </q-item-section>
              <q-item-section style="width: 150px" side>
                <div>
                  <q-input
                    model-value="0"
                    type="text"
                    dense
                    outlined
                    :readonly="!check1.find((el) => el == '4')"
                  >
                    <template v-slot:append>
                      <small style="font-size: 0.5em"> / 30 U</small>
                    </template>
                  </q-input>
                </div>
              </q-item-section>
            </q-item>
          </q-expansion-item>
        </template>
      </q-card-section>
    </template>
    <template #read>
      <q-card-section class="row q-col-gutter-md">
        <q-input
          v-model="inputData.code_c"
          type="text"
          label="Código"
          outlined
          dense
          class="col-6 q-pb-md"
        />
        <q-input
          v-model="inputData.name"
          type="text"
          label="Area de trabajo"
          outlined
          dense
          class="col-6"
          ref="nameInputRef"
          :rules="[(val) => !!val || 'Campo requerido']"
        />
        <q-input
          v-model="inputData.estimated_start_date_c"
          type="date"
          label="Fecha de inicio"
          outlined
          dense
          class="col-6 q-pb-md"
        />
        <q-input
          v-model="inputData.estimated_end_date_c"
          type="date"
          label="Fecha de finalización"
          outlined
          dense
          class="col-6 q-pb-md"
        />
        <div>TAREAS SELECCIONADAS</div>

        <q-expansion-item
          class="col-12"
          expand-separator
          icon="mail"
          label="Inbox"
          default-opened
          ><div>primera lista</div>
        </q-expansion-item>
        <q-expansion-item
          class="col-12"
          expand-separator
          icon="perm_identity"
          label="Account settings"
          caption="John Doe"
        >
          <div>Otra lista</div>
        </q-expansion-item>
      </q-card-section>
    </template>
  </view-card-component>
</template>
<style lang="scss" scoped>
.title-card {
  font-size: 1em;
}
</style>
