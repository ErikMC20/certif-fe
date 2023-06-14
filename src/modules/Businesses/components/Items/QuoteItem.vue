<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBusinesses } from '../../composables/Core/useBusinesses/index';
const { phaseValidation } = useBusinesses();

interface Props {
  id: string;
}

const props = defineProps<Props>();

const isLoading = ref(false);
const isValid = ref(true);

const validate = async () => {
  isLoading.value = true;
  const response = await phaseValidation['quotes'](props.id);
  isValid.value = response > 0;
  isLoading.value = false;
};

onMounted(async () => {
  await validate();
});
</script>

<template>
  <q-item v-if="isLoading">
    <q-item-section avatar>
      <q-skeleton type="QAvatar" />
    </q-item-section>

    <q-item-section>
      <q-item-label>
        <q-skeleton type="text" />
      </q-item-label>
      <q-item-label caption>
        <q-skeleton type="text" width="90%" />
      </q-item-label>
    </q-item-section>
  </q-item>
  <q-item v-else clickable v-ripple>
    <q-item-section avatar>
      <q-icon color="primary" name="event" />
    </q-item-section>
    <q-item-section class="row">
      <div class="col-auto">Cotización en la oportunidad</div>
    </q-item-section>
    <q-space />
    <q-item-section side>
      <q-icon v-if="isValid" name="check_circle" color="positive" />
      <q-icon v-else name="cancel" color="negative" />
    </q-item-section>
  </q-item>
</template>

<style scoped lang="scss"></style>
