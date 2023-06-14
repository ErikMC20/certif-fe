<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useAsyncState } from '@vueuse/core';
import { QSlideItem } from 'quasar';
import { axios_GLOBAL } from 'src/conections/axiosCRM';

import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
import { useMeetingActivity } from 'src/composables/core/';

const props = withDefaults(
  defineProps<{
    id: string;
    module: string;
    email?: string;
    whatsapp?: string;
  }>(),
  {
    email: '0',
    whatsapp: '0',
  }
);

const emits = defineEmits<{
  (event: 'update:email', value: string): void;
  (event: 'update:whatsapp', value: string): void;
  (event: 'delete', id: string): void;
}>();

const closeDialogState = ref(false);

const slideItemRef = ref<InstanceType<typeof QSlideItem> | null>(null);

const { formatModuleName } = useMeetingActivity();

const emailValue = computed({
  get() {
    return props.email;
  },
  set(value) {
    emits('update:email', value);
  },
});

const whatsappValue = computed({
  get() {
    return props.whatsapp;
  },
  set(value) {
    emits('update:whatsapp', value);
  },
});

const { state, isLoading } = useAsyncState(async () => {
  return await axios_GLOBAL.get(
    `/module-get/${
      props.module.charAt(0).toUpperCase() + props.module.slice(1)
    }/${props.id}`
  );
}, {} as any);

const resetAlert = () => {
  closeDialogState.value = false;
  slideItemRef.value?.reset();
};
</script>

<template>
  <q-item v-if="isLoading">
    <q-item-section avatar>
      <q-skeleton type="QAvatar" />
    </q-item-section>

    <q-item-section>
      <q-item-label>
        <q-skeleton type="text" width="35%" />
      </q-item-label>
      <q-item-label caption>
        <q-skeleton type="text" />
      </q-item-label>
    </q-item-section>
  </q-item>

  <q-slide-item
    ref="slideItemRef"
    v-else-if="$q.platform.has.touch"
    @right="closeDialogState = true"
    right-color="negative"
  >
    <template v-slot:right>
      <div class="row items-center">
        Eliminar invitado <q-icon right name="remove" />
      </div>
    </template>
    <q-item style="box-sizing: border-box" class="q-ma-none q-pa-sm">
      <q-item-section class="q-pa-none" avatar>
        <q-avatar color="primary" text-color="white" icon="person"> </q-avatar>
      </q-item-section>

      <q-item-section class="q-pa-none">
        <q-item-label lines="1">{{
          state.data.data.attributes.full_name
        }}</q-item-label>
        <q-item-label caption lines="2">
          <span class="text-weight-bold">Contacto</span>
          {{ state.data.data.attributes.email1 || 'Sin Correo' }}
        </q-item-label>
      </q-item-section>

      <q-item-section style="padding-left: 5px" class="q-pl-none" side top>
        <div>
          <q-checkbox
            checked-icon="mail"
            unchecked-icon="mail"
            v-model="emailValue"
            :disable="!state.data.data.attributes.email1"
            true-value="1"
            false-value="0"
            left-label
          >
          </q-checkbox>
          <!-- <q-checkbox
            v-model="whatsappValue"
            checked-icon="whatsapp"
            unchecked-icon="whatsapp"
            true-value="1"
            false-value="0"
            left-label
          >
          </q-checkbox> -->
        </div>
      </q-item-section>
    </q-item>
  </q-slide-item>

  <q-item class="q-ma-none q-py-sm q-px-md" v-else>
    <div style="margin: auto 0" class="q-pr-sm">
      <q-btn
        color="negative"
        icon="remove"
        size="xs"
        round
        @click="closeDialogState = true"
      />
    </div>

    <q-item-section avatar>
      <q-avatar color="primary" text-color="white" icon="person"> </q-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label lines="1">{{
        state.data.data.attributes.full_name
      }}</q-item-label>
      <q-item-label caption lines="2">
        <span class="text-weight-bold">{{
          formatModuleName(props.module)
        }}</span>
        -- {{ state.data.data.attributes.email1 || 'Sin Correo' }}
      </q-item-label>
    </q-item-section>

    <q-item-section side top>
      <div>
        <q-checkbox
          checked-icon="mail"
          unchecked-icon="mail"
          v-model="emailValue"
          :disable="!state.data.data.attributes.email1"
          true-value="1"
          false-value="0"
          left-label
        >
          <q-tooltip>{{
            !state.data.data.attributes.email1
              ? 'El invitado no tiene correo'
              : 'Invitacion por correo'
          }}</q-tooltip></q-checkbox
        >
        <!-- <q-checkbox
          v-model="whatsappValue"
          checked-icon="whatsapp"
          unchecked-icon="whatsapp"
          true-value="1"
          false-value="0"
          left-label
        >
          <q-tooltip>Invitacion por whatsapp</q-tooltip>
        </q-checkbox> -->
      </div>
    </q-item-section>
  </q-item>

  <AlertComponent
    title="¿Eliminar Invitado?"
    icon="warning"
    iconColor="warning"
    iconSize="50px"
    btn-color="primary"
    btn-text="Si, eliminar"
    v-model="closeDialogState"
    @confirm="$emit('delete', id)"
    @denegate="resetAlert"
  >
    <template #body>
      <span class="q-py-sm"> Se eliminara al invitado de la reunion </span>
    </template>
  </AlertComponent>
</template>
