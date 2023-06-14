<script lang="ts">
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { setDefaultAvatar } from 'src/modules/Projects/composables/useUtils';
import { getSupervisor } from 'src/modules/WorkAreas/services/useWorkAreasService';
import { ref } from 'vue';
</script>
<script setup lang="ts">
defineProps<{
  moduleId: string;
}>();
const user = ref();
const onGetSupervisor = async (id: string) => {
  user.value = await getSupervisor(id);
};
//exposes
defineExpose({
  onGetSupervisor,
});
</script>

<template>
  <q-card class="my-card q-mb-sm">
    <q-card-section horizontal>
      <q-card-section class="col-auto flex-center flex">
        <q-avatar size="60px">
          <img
            :src="`${HANSACRM3_URL}/upload/users/${user?.id}`"
            @error="setDefaultAvatar"
          />
        </q-avatar>
      </q-card-section>
      <q-card-section class="full-width q-py-sm q-px-sm">
        <div class="row flex justify-between">
          <span class="text-overline"> Supervisor asignado </span>
        </div>
        <div class="text-h7 q-mt-none q-mb-xs">
          {{ user?.user_name ?? ' ' }}
        </div>
        <div class="text-caption text-grey-6">Cargo: {{ user?.cargo }}</div>
        <div class="text-caption text-grey-6">
          Division: {{ user?.division }} | Area:
          {{ user?.a_mercado }}
        </div>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.title-card {
  font-size: 1em;
}
</style>
