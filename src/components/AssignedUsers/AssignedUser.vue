<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useAsyncState, useRefHistory } from '@vueuse/core';

import { useQuasar } from 'quasar';
import { AssignedUserModel } from '../types/index';
import {
  getListUsers,
  getFormattedUser,
} from '../../services/AssignedUserService';

import {
  getAssignedUser,
  getUserLogged,
  // getUserImage,
} from '../../services/AssignedUserService';
import { HANSACRM3_URL } from 'src/conections/api_conectors';

import AlertComponent from '../MainAlert/AlertComponent.vue';
import { setUserAssigned } from '../../services/GlobalService';

const props = withDefaults(
  defineProps<{
    type: 'single' | 'multiple';
    module?: string;
    moduleId?: string;
    defaultUserId?: string;
    autoUpdateDisabled?: boolean;
  }>(),
  {
    type: 'single',
    autoUpdateDisabled: false,
  }
);

const emits = defineEmits<{
  (event: 'changeUser', value: string): void;
  (event: 'selectedUser', newId: string, prevId: string): void;
}>();

const search = ref('');
const assignedUser = ref({} as AssignedUserModel);
const selectedUser = ref({} as AssignedUserModel);
const isLoadingProcess = ref(false);
const showModalChange = ref(false);

const assignedUserOptions = ref([] as AssignedUserModel[]);

const showFilter = ref(false);

//* composable variables
const $q = useQuasar();
const { undo, history } = useRefHistory(assignedUser, {
  capacity: 10,
});
const { isLoading } = useAsyncState(async () => {
  if (props.type === 'single') {
    if (!!props.module && !!props.moduleId)
      try {
        const response = await getAssignedUser(props.module, props.moduleId);
        assignedUser.value = response;
        return response;
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Error en la captura',
          caption: 'No se capturo el usario de forma correcta',
        });
      }
    else {
      if (!!props.defaultUserId) {
        assignedUser.value = await getFormattedUser(props.defaultUserId);
        // await getUserImage(assignedUser.value.avatar);
        return;
      }
      assignedUser.value = await getUserLogged();
    }
  } else if (props.type === 'multiple') {
    $q.notify({
      type: 'positive',
      message: 'Captura de usuarios...',
    });
  }
}, null as null | AssignedUserModel | AssignedUserModel[]);

const listUsersFiltered = computed(() => {
  if (search.value.length < 3) {
    return [];
  }
  return assignedUserOptions.value.filter(
    (el: AssignedUserModel) =>
      el.user_name.toLowerCase().indexOf(search.value.toLowerCase()) !== -1
  );
});
//* methods
const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};

const assignUser = async (user: AssignedUserModel) => {
  const prevAssignedUserId = assignedUser.value.id;
  if (user.id === assignedUser.value.id) {
    $q.notify({
      type: 'warning',
      message: 'Ya Asignado',
      caption: 'Este usuario ya esta asignado',
    });
    return;
  }

  emits('selectedUser', user.id, prevAssignedUserId);
  assignedUser.value = user;
  search.value = '';
  if (!!props.module && !!props.moduleId && !props.autoUpdateDisabled) {
    try {
      isLoadingProcess.value = true;
      if (!props.moduleId) return;
      await setUserAssigned(
        props.module,
        props.moduleId,
        assignedUser.value.id
      );
      $q.notify({
        type: 'positive',
        message: 'Nuevo usuario asignado',
        caption: `Se asigno a ${assignedUser.value.user_name} como principal`,
      });
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: 'Error al asignar usuario',
      });
      undo();
    } finally {
      isLoadingProcess.value = false;
    }
  }
  emits('changeUser', assignedUser.value.id);
};

const assignLoggedUser = async () => {
  const userLogged = await getUserLogged();
  selectedUser.value = userLogged;
  showModalChange.value = true;
};

const changeUser = () => {
  assignUser(selectedUser.value);
};

const cancelChange = () => {
  search.value = '';
};

onMounted(async () => {
  if (props.type === 'single') assignedUserOptions.value = await getListUsers();
});

defineExpose({
  assignedUser,
});
</script>

<template>
  <AlertComponent
    v-model="showModalChange"
    icon="warning"
    icon-color="warning"
    icon-size="50px"
    title="¿ Cambiar vendedor ?"
    btn-color="primary"
    btn-text="Si, Cambiar"
    @confirm="changeUser"
    @denegate="cancelChange"
  >
    <template #body>
      <span class="q-py-sm">
        Se cambiará a <strong>{{ selectedUser.user_name }}</strong> como nuevo
        responsable.
      </span>
    </template>
  </AlertComponent>
  <div v-if="isLoading">
    <q-card class="q-pa-sm">
      <q-item>
        <q-item-section avatar>
          <q-skeleton type="QAvatar" />
        </q-item-section>

        <q-item-section>
          <q-item-label>
            <q-skeleton type="text" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" />
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-skeleton height="80px" square />
    </q-card>
  </div>
  <div v-else>
    <q-card v-if="type === 'single'" class="my-card">
      <q-card-section horizontal>
        <q-card-section class="col-auto flex flex-center">
          <!-- <q-avatar
            size="60px"
            font-size="40px"
            color="primary"
            text-color="white"
            icon="person"
          >
            <img :src="`${HANSACRM3_URL}${assignedUser.avatar}`" alt="" />
          </q-avatar> -->
          <q-avatar size="60px" font-size="40px">
            <img :src="`${HANSACRM3_URL}${assignedUser.avatar}`" alt="" />
          </q-avatar>
        </q-card-section>
        <q-card-section class="full-width q-py-xs">
          <div class="row q-mt-sm flex justify-between">
            <span class="text-caption text-weight-medium">
              Usuario Asignado
            </span>
            <div>
              <q-chip
                v-if="type === 'single'"
                outline
                size="sm"
                color="primary"
                text-color="white"
                icon="shop"
                class="q-py-none q-my-none"
              >
                Vendedor principal
              </q-chip>
            </div>
          </div>
          <div class="assigned-user q-mt-none q-mb-none">
            {{ assignedUser.user_name || 'Sin Usuario' }}
          </div>
          <div class="text-caption text-weight-light text-grey-9">
            Cargo: {{ assignedUser.cargo || 'Sin Cargo' }}
          </div>
          <div class="text-caption text-weight-light text-grey-9">
            Division - {{ assignedUser.division || 'Sin división' }} | Area:
            {{ assignedUser.a_mercado || 'Sin área de mercado' }}
          </div>
        </q-card-section>
      </q-card-section>

      <q-separator />

      <q-card-actions class="card-actions justify-between">
        <div>
          <q-btn
            style="font-size: 13px"
            icon="person"
            @click="assignLoggedUser"
            flat
          >
            <span class="q-ml-xs"> Asignarme </span>
          </q-btn>
          <q-btn
            style="font-size: 13px"
            icon="edit"
            @click="toggleFilter"
            flat
            color="primary"
          >
            <span class="q-ml-xs"> Editar Selección </span>
          </q-btn>
        </div>
        <div>
          <q-btn
            v-if="!moduleId"
            outline
            :disable="!(history.length > 2)"
            @click="undo"
            icon="undo"
            color="primary"
            class=""
          >
            Revertir
          </q-btn>
        </div>
      </q-card-actions>
      <q-card-section v-if="showFilter">
        <div class="">
          <q-input
            v-model="search"
            dense
            debounce="0"
            outlined
            placeholder="Buscar usuario"
            :autofocus="true"
          >
            <template #append>
              <q-icon color="white" name="search" v-if="search == ''" />
              <q-icon
                name="clear"
                color="white"
                class="cursor-pointer"
                v-else
                @click="search = ''"
              />
            </template>
          </q-input>
        </div>
        <transition
          enter-active-class="animated zoomIn"
          leave-active-class="animated zoomOut"
        >
          <div
            bordered
            class="absolute col-12 q-py-none q-px-xs"
            style="z-index: 1; width: 100%"
            v-if="listUsersFiltered?.length > 0"
          >
            <q-list
              bordered
              separator
              style="max-height: 350px"
              class="shadow-1 scroll"
              :class="$q.dark.isActive ? 'bg-primary' : 'bg-white'"
            >
              <q-item
                v-for="(item, index) in listUsersFiltered"
                :key="index"
                :disable="
                  item.employee_status === 'Terminated' ||
                  item.employee_status === 'ContractEnd'
                "
                :class="
                  item.employee_status === 'Terminated' ? 'bg-grey-4' : ''
                "
              >
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="`${HANSACRM3_URL}${item.avatar}`" />
                    <q-badge
                      floating
                      color="red"
                      size="xs"
                      icon="circle"
                      rounded
                      v-if="
                        item.employee_status === 'Terminated' ||
                        item.employee_status === 'ContractEnd' ||
                        item.employee_status === 'Volunted'
                      "
                    />
                    <q-badge
                      floating
                      color="secondary"
                      size="xs"
                      icon="schedule"
                      rounded
                      v-if="item.employee_status === 'Vacation'"
                    />
                    <q-badge
                      floating
                      color="green"
                      size="xs"
                      icon="circle"
                      rounded
                      v-if="item.employee_status === 'Active'"
                    />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ item.user_name }}
                    <br />
                    <small class="text-grey-6"> Cargo: {{ item.cargo }} </small>
                    <br />
                    <small class="text-grey-6">
                      División: {{ item.division }} | Area:
                      {{ ` ${item?.a_mercado}` }}
                    </small>
                    <br />
                  </q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-btn
                    dense
                    color="green-9"
                    rounded
                    size="sm"
                    class="q-px-sm"
                    v-if="
                      item.employee_status === 'Vacation' ||
                      item.employee_status === 'Active'
                    "
                    @click="
                      () => {
                        selectedUser = item;
                        showModalChange = true;
                      }
                    "
                  >
                    <q-icon name="person_add" />
                    Seleccionar</q-btn
                  >
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </transition>
      </q-card-section>
      <q-inner-loading
        :showing="isLoadingProcess"
        label="Cargando datos..."
        label-class="text-primary"
        label-style="font-size: 1.1em"
      />
    </q-card>
    <q-card v-else flat bordered>
      <q-item>
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white" icon="group"></q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>Usuarios Asignados</q-item-label>
          <q-item-label class="text-grey-8" caption>
            Lista de usuarios asignados
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />

      <q-list bordered>
        <q-item class="q-px-lg" clickable v-ripple>
          <q-item-section avatar>
            <q-icon color="primary" name="person" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Sergio Alejandro Machaca Lamas</q-item-label>
            <q-item-label class="text-grey-8" caption>
              Division: Automotriz | Cargo: todas
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item class="q-px-lg" clickable v-ripple>
          <q-item-section avatar>
            <q-icon color="primary" name="person" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Kevin Emilio Torrez Quisbert </q-item-label>
            <q-item-label class="text-grey-8" caption>
              Division: Automotriz | Cargo: todas
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-inner-loading
        :showing="isLoadingProcess"
        label="Cargando datos..."
        label-class="text-primary"
        label-style="font-size: 1.1em"
      />
    </q-card>
  </div>
</template>

<style lang="scss">
.assigned-user {
  font-size: 1.04rem;
}

.card-actions {
  padding: 5px;
}
</style>
