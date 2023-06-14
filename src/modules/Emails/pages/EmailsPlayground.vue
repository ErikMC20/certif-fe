<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';

import UserDetailedVue from '../components/OtherComponents/UserDetails.vue';
import ViewCardVue from '../components/ViewCard/ViewCard.vue';
import InputFormVue from '../components/ViewCard/InputForm.vue';
import BaseCard from '../components/BaseCard/BaseCard.vue';

import { UserDetails } from '../components/OtherComponents/UserDetailedModels';

const stringOptions = ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'];
const usersSelected = ref<UserDetails[]>([
  {
    id: 1,
    imageSource: 'dd',
    name: 'Favio',
    marketArea: '01 Unidades Nuevas',
    occupation: 'Ejecutivo de Ventas',
    userState: 'Activo',
    principal: true,
  },
  {
    id: 2,
    imageSource: 'dd',
    name: 'Kevin',
    marketArea: '01 Unidades Nuevas',
    occupation: 'Ejecutivo de Ventas',
    userState: 'Inactivo',
    principal: false,
  },
  {
    id: 3,
    imageSource: 'dd',
    name: 'Favio',
    marketArea: '01 Unidades Nuevas',
    occupation: 'Ejecutivo de Ventas',
    userState: 'Activo',
    principal: false,
  },
]);

const $q = useQuasar();
const isOpen = ref(false);
const userSelected = ref(null);
const options = ref(stringOptions);
const dataContacts = ref({ name: '', document: '' });

const onAssign = () => {
  if (userSelected.value === null) {
    $q.notify('Invalid');
    return;
  }
  console.log('User Selected', userSelected.value);
  userSelected.value = null;
};
const onClick = () => {
  isOpen.value = !isOpen.value;
};

const filterFn = (val: string, update: any) => {
  setTimeout(() => {
    update(() => {
      if (val === '') {
        options.value = stringOptions;
      } else {
        const needle = val.toLowerCase();
        options.value = stringOptions.filter(
          (v) => v.toLowerCase().indexOf(needle) > -1
        );
      }
    });
  }, 2000);
};

const abortFilterFn = () => {
  console.log('aborting...');
};

const deleteUser = (id: number) => {
  console.log('Deleting', id);
  usersSelected.value = usersSelected.value.filter((user) => id !== user.id);
};
</script>

<template>
  <div class="q-pa-md">
    <q-btn color="primary" icon="check" label="Open Dialog" @click="onClick" />
  </div>
  <dialog-component v-model="isOpen">
    <template #body>
      <div class="q-pa-md row">
        <div class="col-12 col-md-6 col-lg-5 q-gutter-y-md">
          <ViewCardVue
            :is-edit-value="false"
            icon-name="feed"
            title="Informacion del cliente"
          >
            <template #edit>
              <div class="row q-gutter-y-md">
                <InputFormVue v-model="dataContacts.name" label="Nombre" />
                <InputFormVue v-model="dataContacts.name" label="Apellidos" />
                <InputFormVue
                  v-model="dataContacts.name"
                  label="Tipo de documento"
                />
                <InputFormVue v-model="dataContacts.name" label="CI / NIT" />
                <InputFormVue
                  v-model="dataContacts.name"
                  label="Tipo de clietne"
                />
                <InputFormVue
                  v-model="dataContacts.name"
                  label="Regimen tributario"
                />
                <InputFormVue v-model="dataContacts.name" label="Rubro" />
                <InputFormVue v-model="dataContacts.name" label="Sub rubro" />
                <InputFormVue
                  v-model="dataContacts.name"
                  label="Departamento"
                />
                <InputFormVue v-model="dataContacts.name" label="Ciudad" />
              </div>
            </template>
            <template #read>
              <div>read mode this component</div>
            </template>
          </ViewCardVue>
        </div>
        <div class="col-12 col-md-6 col-lg-7 q-pl-sm q-gutter-y-md">
          <BaseCard>
            <template #header>
              <div class="text-h6 q-mt-none">
                <q-icon name="groups" class="q-mr-sm" />Cuenta asignada a:
              </div>
            </template>
            <template #default>
              <div class="column q-gutter-y-md">
                <div>
                  <q-form
                    class="row justify-between q-gutter-md"
                    @submit="onAssign"
                  >
                    <q-select
                      outlined
                      dense
                      v-model="userSelected"
                      use-input
                      @keyup.ctrl.enter="onAssign"
                      hide-selected
                      class="col fit"
                      fill-input
                      input-debounce="100"
                      label="Buscar usuario"
                      :options="options"
                      @filter="filterFn"
                      @filter-abort="abortFilterFn"
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            No hay resultados
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                    <q-btn
                      color="primary"
                      col="col"
                      type="submit"
                      label="Asignar"
                    />
                  </q-form>
                </div>
                <div class="column q-gutter-y-md">
                  <UserDetailedVue
                    v-for="user in usersSelected"
                    :key="user.id"
                    :user-details="user"
                    @deleteUser="deleteUser"
                  />
                </div>
              </div>
            </template>
          </BaseCard>
        </div>
      </div>
    </template>
  </dialog-component>
</template>
