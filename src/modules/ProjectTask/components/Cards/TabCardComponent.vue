<script lang="ts">
import { CommentsComponent } from 'src/components';
import { userStore } from 'src/modules/Users/store/UserStore';
import { ref } from 'vue';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { QInput } from 'quasar';
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

const validateInputs = async () => {
  const validatedFields = await Promise.all([
    commentInputRef.value?.validate(),
  ]);
  return validatedFields.every((field) => !!field);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setAltImg = (event: any) => {
  event.target.src = `${HANSACRM3_URL}/upload/users/avatardefault.png`;
};

defineExpose({
  validateInputs,
  exposeData,
});
</script>
<template>
  <q-card style="overflow-y: auto; height: 190px">
    <q-toolbar class="text-primary q-mb-none">
      <q-btn flat round dense icon="comment" />
      <q-toolbar-title style="font-size: 1em"> Comentarios</q-toolbar-title>
    </q-toolbar>
    <q-separator />
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="comments">
        <CommentsComponent
          :id="moduleId"
          modulo="Plannings"
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
