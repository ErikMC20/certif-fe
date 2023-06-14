<script lang="ts">
import { HANSACRM3_URL } from 'src/conections/api_conectors';

import { ref } from 'vue';
import { userStore } from 'src/modules/Users/store/UserStore';
import { QInput } from 'quasar';
import CommentsComponent from 'src/components/Comments/CommentsComponent.vue';
</script>
<script setup lang="ts">
const tab = ref('comments');
defineProps<{
  moduleId?: string;
}>();

//variables
const { userCRM } = userStore();
const comentario = ref('');

//refs
const commentInputRef = ref<InstanceType<typeof QInput> | null>(null);

//functions
const exposeData = () => {
  return comentario.value;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setAltImg = (event: any) => {
  event.target.src = `${HANSACRM3_URL}/upload/users/avatardefault.png`;
};

defineExpose({
  exposeData,
});
</script>
<template>
  <q-card class="my-card q-mb-sm" style="height: 50dvh">
    <q-tabs
      v-model="tab"
      inline-label
      outside-arrows
      mobile-arrows
      align="justify"
      class="shadow-2 text-primary"
    >
      <q-tab name="comments" icon="comment" label="Comentarios" />
    </q-tabs>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="comments">
        <CommentsComponent
          :id="moduleId"
          modulo="Workareas"
          descCRM3=""
          v-if="moduleId"
        />

        <q-input
          autogrow
          outlined
          bottom-slots
          v-model="comentario"
          placeholder="Escriba su comentario"
          ref="commentInputRef"
          :rules="[(val:string) => !!val || 'Campo requerido']"
          dense
          v-else
          color="primary"
        >
          <template v-slot:append>
            <q-icon
              v-if="comentario !== ''"
              name="close"
              @click="comentario = ''"
              class="cursor-pointer"
            />
          </template>
          <template v-slot:before>
            <q-avatar>
              <img
                :src="`${HANSACRM3_URL}/upload/users/${userCRM.id}`"
                @error="setAltImg"
              />
            </q-avatar>
          </template>
        </q-input>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<style scoped></style>
