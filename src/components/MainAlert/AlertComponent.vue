<script setup lang="ts">
import { toRefs } from 'vue';

const props = defineProps<{
  icon?:string;
  iconColor?:string;
  iconSize?:string;
  message?:string;
  title?:string;
  btnColor?:string;
  btnText?:string;
}>();

const { message } = toRefs(props);

defineEmits<{
  (e: 'confirm'):void
  (e: 'denegate'):void
}>();
</script>
<template>
  <q-dialog persistent>
    <q-card style="max-width: 450px">
      <q-item class="bg-grey-2">
        <q-item-section>
          <q-item-label> {{ title }} </q-item-label>
        </q-item-section>
      </q-item>
      <q-card-section class="row items-center text-center">
        <div class="col-12 text-center">
          <q-icon :name="icon" :color="iconColor" :size="iconSize" />
        </div>
        <slot name="body">
          <span class="q-py-sm">
            {{ message }}
          </span>
        </slot>
      </q-card-section>

      <q-card-actions align="center" class="bg-grey-2">
        <q-btn
          :label="btnText"
          :color="btnColor"
          v-close-popup
          @click="$emit('confirm')"
        />
        <q-btn
          label="Cancelar"
          color="secondary"
          v-close-popup
          @click="$emit('denegate')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>


<style scoped></style>