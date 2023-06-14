<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { StatusCard } from '../../utils/types/index';
import BaseCardVue from './ViewBaseCard.vue';
/* props */
const props = withDefaults(
  defineProps<{
    controls: boolean;
    iconName: string;
    initialStatus?: StatusCard;
    loading?: boolean;
    title: string;
  }>(),
  {
    iconName: 'print',
    title: 'Default Title Card',
    loading: false,
    initialStatus: 'read',
    controls: true,
  }
);
/* Emits */
const emits = defineEmits(['update:modelValue', 'cancelChange']);
/* Local Variables */
const $q = useQuasar();
const isEditing = ref(props.initialStatus);
/* methods */
const changeEditStatus = () => {
  if (isEditing.value === 'read') {
    isEditing.value = 'edit';
  } else if (isEditing.value === 'edit') {
    isEditing.value = 'read';
  }
};
const changeStatusTo = (status: StatusCard) => (isEditing.value = status);
const onClickCancel = () => {
  changeEditStatus();
  emits('cancelChange');
};
/* expose functions */
defineExpose({
  isEditing,
  changeEditStatus,
  changeStatusTo,
});
</script>
<template>
  <q-card v-if="loading" class="q-pa-md">
    <slot name="skeleton">
      <q-item>
        <q-item-section avatar>
          <q-skeleton type="QAvatar" />
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <q-skeleton type="text" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" />
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-skeleton height="200px" square />

      <q-card-actions align="right" class="q-gutter-md">
        <q-skeleton type="QBtn" />
        <q-skeleton type="QBtn" />
      </q-card-actions>
    </slot>
  </q-card>

  <BaseCardVue v-else>
    <template #header>
      <div class="text-h6 q-mt-none q-pb-xs row justify-between">
        <div>
          <q-icon :name="iconName" class="q-mr-sm" size="25px" />{{ title }}
        </div>
        <div v-if="controls" class="float-right">
          <div v-if="isEditing === 'read'">
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
          <div v-else-if="isEditing === 'edit'">
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
      </div>
      <q-separator></q-separator>
    </template>
    <template #default>
      <div v-if="isEditing === 'edit'">
        <slot name="edit"></slot>
      </div>
      <div v-else-if="isEditing === 'read'">
        <slot name="read"></slot>
      </div>
    </template>
  </BaseCardVue>
</template>
