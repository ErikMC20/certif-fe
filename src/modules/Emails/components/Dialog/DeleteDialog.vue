<script setup lang="ts">
defineEmits(['deleteTemplate']);
defineProps<{ idTemplate: string }>();
</script>

<template>
  <q-dialog persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="signal_wifi_off" color="negative" text-color="white" />
        <span class="q-ml-sm">Estas seguro de eliminar el template?</span>
        <span> id: {{ idTemplate }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="negative" v-close-popup />
        <q-btn
          flat
          label="Eliminar"
          @click="$emit('deleteTemplate', idTemplate)"
          color="negative"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
