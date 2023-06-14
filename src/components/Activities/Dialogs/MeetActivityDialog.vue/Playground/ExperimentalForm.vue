<script lang="ts" setup>
import { computed } from 'vue';
type TemporalForm = { name: string; lastName: string; email: string };
const props = withDefaults(
  defineProps<{
    userForm: TemporalForm;
    userFormModifiers?: { capitalize?: boolean };
  }>(),
  {
    userForm: () => ({
      name: '',
      lastName: '',
      email: '',
    }),
    userFormModifiers: () => ({}),
  }
);

const emit = defineEmits<{
  (event: 'update:userForm', value: TemporalForm): void;
}>();

const currentData = computed({
  get() {
    return props.userForm;
  },
  set(value) {
    emit('update:userForm', value);
  },
});

const updateValue = () => {
  currentData.value.lastName = 'lastNameUpdated';
  if (!currentData.value.email.includes('@'))
    currentData.value.email = currentData.value.email + '@gmail.com';
};

const onReset = () => {
  currentData.value = { name: '', lastName: '', email: '' };
};
</script>

<template>
  <q-card flat>
    <q-form @reset="onReset" class="q-gutter-md">
      <q-card-section class="row q-col-gutter-md">
        <pre>{{ userFormModifiers }}form</pre>
        <q-input
          class="col-12"
          dense
          filled
          v-model="currentData.name"
          type="text"
          label="Nombre"
        />
        <q-input
          class="col-12"
          dense
          filled
          v-model="currentData.lastName"
          type="text"
          label="Apellido"
        />
        <q-input
          class="col-12"
          dense
          filled
          v-model="currentData.email"
          type="email"
          label="Email"
        />
      </q-card-section>
      <q-card-actions>
        <q-btn label="Update" @click="updateValue" color="primary" />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>
