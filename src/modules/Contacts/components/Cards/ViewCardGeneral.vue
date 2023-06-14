<script setup lang="ts">
import { ref } from 'vue';
import BaseCardVue from './ViewBaseCard.vue';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const props = defineProps<{
  iconName: string;
  title: string;
  isEditValue: boolean;
}>();

const emits = defineEmits(['update:modelValue', 'cancelChange']);

const isEditing = ref(props.isEditValue);

const changeEditStatus = () => {
  isEditing.value = !isEditing.value;
};

const onClickCancel = () => {
  changeEditStatus();
  emits('cancelChange');
};

defineExpose({
  changeEditStatus,
});
</script>
<template>
  <BaseCardVue flat bordered>
    <template #header>
      <div class="text-h6 q-mt-none row justify-between">
        <div>
          <q-icon
            :name="iconName"
            color="primary"
            class="q-mr-sm"
            size="30px"
          />{{ title }}
        </div>

        <div v-if="!isEditing">
          <q-btn
            @click="changeEditStatus"
            size="10px"
            flat
            dense
            icon="mode_edit"
            class="float-right"
            :color="!$q.dark.isActive ? 'grey-8' : 'white'"
          >
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
        </div>
        <div v-else>
          <q-btn
            @click="onClickCancel"
            size="10px"
            flat
            dense
            icon="cancel"
            class="float-right"
            :color="!$q.dark.isActive ? 'grey-8' : 'white'"
          >
            <q-tooltip>Cancelar</q-tooltip>
          </q-btn>
        </div>
      </div>
      <q-separator></q-separator>
    </template>
    <template #default>
      <div v-if="isEditing">
        <slot name="edit"></slot>
      </div>
      <div v-else>
        <slot name="read"></slot>
      </div>
    </template>
  </BaseCardVue>
</template>
