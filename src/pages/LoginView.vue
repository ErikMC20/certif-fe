<script setup lang="ts">
import { axiosCRM3 } from 'src/conections/axiosPRY';
import { ref } from 'vue';
import { Loading } from 'quasar';
import { Notification } from 'src/composables';
import { useRouter, useRoute } from 'vue-router';
import { userStore } from '../modules/Users/store/UserStore';
const form = ref({
  login: '',
  password: '',
  remember: false,
});

const router = useRouter();
const showPassword = ref(false);

const inputLoginRef = ref();
const inputPasswordRef = ref();

const { userCRM } = userStore();

const validateInputs = () => {
  const valid = [
    inputLoginRef.value?.validate(),
    inputPasswordRef.value?.validate(),
  ];
  return valid.every((el) => el === true);
};

const SubmitForm = async () => {
  if (!validateInputs()) {
    //console.log('error');
    Notification('negative', 'error', 'Existen campos obligatorios.');
    return;
  }
  try {
    Loading.show({
      message: 'Iniciando Sesión',
    });
    router.push('/assignment?iduser=' + userCRM.id);
    // const fd = new FormData();
    // fd.append('method', 'authentication_mobile');
    // fd.append('input_type', 'JSON');
    // fd.append('response_type', 'JSON');
    // fd.append(
    //   'rest_data',
    //   JSON.stringify({
    //     user_name: form.value.login,
    //     password: form.value.password,
    //   })
    // );

    // const res = await axiosCRM3.post('', fd);
    // if (res.data.lenght) {
    //   useRouter().push('/assignment');
    // } else {
    //   form.value.password = '';
    //   Notification('negative', 'error', 'Usuario o contraseña incorrectos');
    // }
    // console.log(res);
  } catch (error) {
  } finally {
    Loading.hide();
  }
};
</script>
<template>
  <div class="window-height q-pa-md bg-white">
    <q-card class="my-card no-shadow" style="margin-top: 50%">
      <q-card-section>
        <div
          class="text-center text-bold text-primary"
          style="
            font-family: Arial, Helvetica, sans-serif;
            font-weight: 800;
            font-size: 4.5em;
            text-shadow: 2px 2px 3px rgb(116, 116, 116);
          "
        >
          HANSA
        </div>
      </q-card-section>
      <!-- <q-separator spaced /> -->
      <q-card-section class="q-pa-none q-gutter-y-md">
        <q-input
          v-model="form.login"
          ref="inputLoginRef"
          type="text"
          label="USUARIO"
          outlined
          :rules="[(val:string) => !!val || 'campo requerido']"
        >
          <template v-slot:prepend>
            <q-icon name="person" />
          </template>
        </q-input>
        <q-input
          v-model="form.password"
          ref="inputPasswordRef"
          :type="showPassword ? 'text' : 'password'"
          label="CONTRASEÑA"
          outlined
          :rules="[(val:string) => !!val || 'campo requerido']"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>
          <template v-slot:append>
            <q-btn
              color="grey-7"
              icon="visibility"
              @click="showPassword = !showPassword"
              dense
              flat
              round
            />
          </template>
        </q-input>
        <q-checkbox
          v-model="form.remember"
          color="primary"
          label="Recordarme"
          class="q-mb-md"
        />
      </q-card-section>
      <q-card-section class="q-pa-none">
        <q-btn color="primary" class="full-width" size="lg" @click="SubmitForm">
          <q-icon name="lock" size="20px" class="q-mr-md" /> INGRESAR
        </q-btn>
      </q-card-section>
    </q-card>
  </div>
</template>

<style scoped></style>
