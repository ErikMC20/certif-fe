<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useBusinesses } from '../../composables/Core';

interface Props {
  id: string;
}

const props = defineProps<Props>();

const { phaseValidation } = useBusinesses();
const isLoading = ref<boolean>(false);
const isValid = ref<boolean>(false);

const validate = async (id: string) => {
  isLoading.value = true;
  const response = await phaseValidation['reserves'](id);
  isValid.value = response > 0;
  isLoading.value = false;
};

onMounted(async () => {
  await validate(props.id);
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
      <q-icon color="primary" name="request_quote" />
    </q-item-section>
    <q-item-section class="row">
      <div class="col-auto">Reservas en la oportunidad</div>
    </q-item-section>
    <!-- <div v-for="(item, index) in fases" :key="index">
      <q-chip
        @click.stop.prevent="mostrar(index)"
        class="glossy"
        icon="directions"
        label="Get directions"
      />
    </div> -->
    <q-space />
    <q-item-section side>
      <q-icon v-if="isValid" name="check_circle" color="positive" />
      <q-icon v-else name="cancel" color="negative" />
    </q-item-section>
  </q-item>
</template>

<style scoped lang="scss"></style>
