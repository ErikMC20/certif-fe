<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { StatusCard } from '../types';
import BaseCardVue from './BaseCard.vue';
/* props */
const props = withDefaults(
  defineProps<{
    controls?: boolean;
    iconName: string;
    initialStatus?: StatusCard;
    loading?: boolean;
    title: string;
  }>(),
  {
    controls: false,
    iconName: 'print',
    initialStatus: 'read',
    loading: false,
    title: 'Default Title Card',
  }
);
/* Emits */
const emits = defineEmits<{
  (event: 'cancelChange'): void;
}>();
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
const changeStatusTo = (status: StatusCard) => {
  isEditing.value = status;
};
const onClickCancel = () => {
  changeEditStatus();
  emits('cancelChange');
};
/* expose functions */
defineExpose({
  isEditing,
  changeEditStatus,
  changeStatusTo,
  onClickCancel,
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
      <q-icon :name="iconName" color="primary" size="sm" />
      <q-toolbar-title style="font-size: 1em"> {{ title }} </q-toolbar-title>

      <div class="text-h7 q-mt-none q-pb-xs row justify-between text-dark">
        <div>
          <q-icon class="q-mr-sm" color="blue" size="20px" />
        </div>
        <div v-if="isEditing === 'edit'">
          <slot name="headerFieldEdit"></slot>
        </div>
        <div v-else>
          <slot name="headerFieldRead"></slot>
        </div>
        <div v-if="controls" class="float-right">
          <q-btn
            @click="changeEditStatus"
            size="10px"
            flat
            dense
            icon="mode_edit"
            class="float-right"
            :color="!$q.dark.isActive ? 'grey-8' : 'white'"
            v-if="isEditing === 'read'"
          >
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
          <div v-if="isEditing === 'read'"></div>
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
