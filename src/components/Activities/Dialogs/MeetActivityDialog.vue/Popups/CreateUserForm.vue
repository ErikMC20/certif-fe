<script lang="ts" setup>
import { ref } from 'vue';

const data = ref({ input: '', input2: '', input3: '' });
const visible = ref(false);

const onSubmit = () => {
  console.log('submitting value...');
  visible.value = true;
  setTimeout(() => {
    visible.value = false;
    data.value = { input: '', input2: '', input3: '' };
  }, 2000);
};

const onReset = () => {
  console.log('resetting');
};
</script>

<template>
  <q-card class="my-card">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-card-section class="q-mb-none">
        <span class="text-h6">Nuevo Prospecto</span>
      </q-card-section>
      <q-card-section class="row q-mt-none q-col-gutter-xs">
        <q-input
          class="col-12"
          outlined
          dense
          v-model="data.input"
          type="text"
          label="Nombre"
        />
        <q-input
          class="col-12"
          outlined
          dense
          v-model="data.input2"
          type="text"
          label="Apellidos"
        />
        <q-input
          class="col-12"
          outlined
          dense
          v-model="data.input3"
          type="text"
          label="Correo electronico"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </q-card-actions>

      <q-inner-loading
        :showing="visible"
        label="creando prospecto"
        label-class="text-teal"
        label-style="font-size: 1.1em"
      />
    </q-form>
  </q-card>
</template>
