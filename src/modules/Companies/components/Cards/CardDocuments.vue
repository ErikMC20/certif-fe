<script lang="ts" setup>
import { ref } from 'vue';

import type { CompanyDocument } from '../../utils/types';

interface Props {
  data?: CompanyDocument[];
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [] as CompanyDocument[],
  id: '',
});

const localDocuments = ref<CompanyDocument[]>(props.data);
let doc1 = ref('');
let doc2 = ref('');

// methods
// const addRequirement = () => {
//   localRequirements.value.push({ nombre: '' });
// };

// const deleteRequirement = (index: number) => {
//   localRequirements.value.splice(index, 1);
// };

defineExpose({
  exposeData: (): CompanyDocument[] => localDocuments.value,
});
</script>

<template>
  <view-card-component
    v-bind="$attrs"
    :controls="false"
    :initial-status="'edit'"
    icon-name="summarize"
    ref="baseCardRef"
    title="Documentos"
    @cancel-change="() => {}"
    @edit-change="() => {}"
  >
    <template #edit>
      <!--<div
        v-if="localDocuments.length === 0"
        class="full-width row flex-center text-accent q-gutter-sm q-my-sm"
      >
        <q-icon size="2em" name="sentiment_dissatisfied" />
        <span> No se cargaron documentos </span>
      </div>-->

      <div class="row">
          <div class="col-12">
              <q-file outlined bottom-slots v-model="doc1" label="Resolución Ministerial" counter>
                <template v-slot:prepend>
                <q-icon name="cloud_upload" @click.stop.prevent />
                </template>
                <template v-slot:append>
                <q-icon name="close" @click.stop.prevent="doc1 = null" class="cursor-pointer" />
                </template>
            </q-file>
          </div>
          <div class="col-12">
              <q-file outlined bottom-slots v-model="doc2" label="Certificado de Empresa Vigente" counter>
                <template v-slot:prepend>
                <q-icon name="cloud_upload" @click.stop.prevent />
                </template>
                <template v-slot:append>
                <q-icon name="close" @click.stop.prevent="doc2 = null" class="cursor-pointer" />
                </template>
            </q-file>
          </div>
      </div>

      <!--<div class="col">
        <div
          v-for="(item, index) in localRequirements"
          :key="item.id_requerimiento"
        >
          <div class="row items-center q-my-sm">
            <div class="col-1 text-center">
              <q-btn
                class="q-mx-auto"
                color="negative"
                size="xs"
                round
                icon="remove"
                @click="deleteRequirement(index)"
              />
            </div>
            <q-input
              class="col-11"
              v-model.trim="item.nombre"
              type="text"
              outlined
              dense
              autofocus
              label="Nombre"
              @keyup.enter="addRequirement()"
            />
          </div>
        </div>
        <q-btn
          class="q-my-sm q-px-sm"
          dense
          color="primary"
          icon="add"
          label="Nuevo requerimiento"
          @click="addRequirement"
        />
      </div>-->

    </template>
    <template #read>
      <div>array to show here...</div>
    </template>
  </view-card-component>
</template>