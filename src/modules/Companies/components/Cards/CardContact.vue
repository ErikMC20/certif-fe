<script lang="ts" setup>
import { computed, ref } from 'vue';
import ViewCard from 'src/components/MainCard/ViewCard.vue';
import type { Contact } from '../../utils/types';

interface Props {
  id: string;
  data: Contact;
}

const props = defineProps<Props>();
const baseCardRef = ref<InstanceType<typeof ViewCard> | null>(null);
const inputData = ref({ ...props.data });
const restoreValues = () => {
  if (props.data) inputData.value = { ...props.data };
};

defineExpose({
  isEditing: computed(() => baseCardRef.value?.isEditing === 'edit'),
  exposeData: (): Contact => ({ ...inputData.value }),
});
</script>

<template>
  <view-card-component
    v-bind="$attrs"
    :controls="!!props.id"
    :initial-status="props.id ? 'read' : 'edit'"
    icon-name="summarize"
    ref="baseCardRef"
    title="Información de Contacto"
    @cancel-change="() => {}"
    @edit-change="() => {}"
  >

    <template #edit>
      <div class="row q-col-gutter-md q-px-md q-py-md">
        <q-input
          v-model="inputData.website"
          type="text"
          class="col-12 col-sm-6"
          label="Sitio Web"
          outlined
          dense
          :rules="[
            (val)=> !!val || 'Campo requerido'
          ]"
        />
        <q-input
          v-model="inputData.email1"
          type="text"
          class="col-12 col-sm-6"
          label="Correo Electrónico"
          outlined
          dense
          :rules="[
            (val)=> !!val || 'Campo requerido'
          ]"
        />
        <q-input
          v-model="inputData.phone_office"
          type="text"
          class="col-12 col-sm-6"
          label="Teléfono Principal"
          outlined
          dense
        />
        <q-input
          v-model="inputData.phone_alternate"
          type="text"
          class="col-12 col-sm-6"
          label="Teléfono Alternativo"
          outlined
          dense
        />

        <div class="col-12">
          <q-separator dark color="grey-4" />
        </div>
      </div>
    </template>

    <template #read>
      <div class="row q-col-gutter-xs q-px-md q-py-md">
        <q-input
          v-model="inputData.website"
          type="text"
          class="col-12 col-sm-6"
          label="Sitio Web"
          outlined
          dense
          readonly
          :rules="[
            (val)=> !!val || 'Campo requerido'
          ]"
        />
        <q-input
          v-model="inputData.email1"
          type="text"
          class="col-12 col-sm-6"
          label="Correo Electrónico"
          outlined
          dense
          readonly
          :rules="[
            (val)=> !!val || 'Campo requerido'
          ]"
        />
        <q-input
          v-model="inputData.phone_office"
          type="text"
          class="col-12 col-sm-6"
          label="Teléfono Principal"
          outlined
          dense
          readonly
        />
        <q-input
          v-model="inputData.phone_alternate"
          type="text"
          class="col-12 col-sm-6"
          label="Teléfono Alternativo"
          outlined
          dense
          readonly
        />
      </div>
    </template>
  </view-card-component>
</template>