<script lang="ts">
import { userStore } from 'src/modules/Users/store/UserStore';
import { Notification } from 'src/composables';
import { getListUsers } from '../../../../services/AssignedUserService';
import { AssignedUserModel } from 'src/components/types';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { ref, onMounted, computed } from 'vue';
import { useAsyncState } from '@vueuse/core';
import {
  getSupervisor,
  updateSupervisor,
} from '../../services/useWorkAreasService';
</script>
<script setup lang="ts">
const props = defineProps<{
  moduleId: string;
}>();

// composables
const { userCRM } = userStore();

//variables
const crm3 = HANSACRM3_URL;
const listUsers = ref<AssignedUserModel[]>([]);

const staticUser = ref({
  id: userCRM.id,
  user_name: userCRM.nombres + ' ' + userCRM.apellidos,
  email: userCRM.email,
  division: userCRM.division,
  a_mercado: userCRM.amercado,
  avatar: crm3 + '/upload/users/' + userCRM.id,
  employee_status: userCRM.estado,
  cargo: userCRM.rol,
  iddivision_c: userCRM.iddivision,
  idamercado_c: userCRM.idamercado,
  idregional_c: userCRM.idregional,
  supervisor_id: '',
});

const isEditing = ref(false);
const type = ref('read');
const search = ref('');

const {
  state: userSelected,
  isLoading,
  execute,
} = useAsyncState(
  async () => {
    return await getSupervisor(props.moduleId);
  },
  {},
  { immediate: false }
);

const assignMyself = async () => {
  if (props.moduleId) {
    try {
      isLoading.value = true;
      const formdata = {
        user: userCRM.id,
        user_id: userCRM.id,
      };
      await updateSupervisor(userSelected.value.supervisor_id, formdata);
      Notification('positive', 'check_circle', 'Se cambió correctamente.');
    } catch (error) {
      Notification('negative', 'error', 'Ocurrió un error.');
    } finally {
      isEditing.value = false;
      isLoading.value = false;
      execute();
    }
  } else {
    userSelected.value = {
      id: userCRM.id,
      user_name: userCRM.nombres + ' ' + userCRM.apellidos,
      email: userCRM.email,
      division: userCRM.division,
      a_mercado: userCRM.amercado,
      avatar: crm3 + '/upload/users/' + userCRM.id,
      employee_status: userCRM.estado,
      cargo: userCRM.rol,
      iddivision_c: userCRM.iddivision,
      idamercado_c: userCRM.idamercado,
      idregional_c: userCRM.idregional,
      supervisor_id: '',
    };
    Notification('', 'info', 'Cambios revertidos');
  }
};

const startEditing = () => {
  isEditing.value = true;
  type.value = 'edit';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const selectUser = async (user: any) => {
  search.value = '';

  if (props.moduleId) {
    try {
      isLoading.value = true;
      const formdata = {
        user: user.id,
        user_id: userCRM.id,
      };
      await updateSupervisor(userSelected.value.supervisor_id, formdata);
      Notification('positive', 'check_circle', 'Se agregó correctamente.');
    } catch (error) {
      Notification('negative', 'error', 'Ocurrió un error.');
    } finally {
      isEditing.value = false;
      isLoading.value = false;
      execute();
      type.value = 'read';
    }
  } else {
    userSelected.value = user;
    cancelEditing();
  }
};

const cancelEditing = () => {
  isEditing.value = false;
  search.value = '';
  type.value = 'read';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setAltImg = (event: any) => {
  event.target.src = `${HANSACRM3_URL}/upload/users/avatardefault.png`;
};

const exposeCardData = () => {
  return userSelected.value;
};

//computed var
const listUserFiltered = computed(() => {
  if (search.value.length < 3) {
    return [];
  }
  return listUsers.value.filter(
    (el: AssignedUserModel) =>
      el.user_name.toLowerCase().indexOf(search.value.toLowerCase()) !== -1
  );
});

//lifecicle
onMounted(async () => {
  listUsers.value = await getListUsers(userCRM.iddivision, userCRM.idamercado);
  if (props.moduleId) {
    execute();
    staticUser.value = userSelected.value;
  } else {
    userSelected.value = staticUser.value;
  }
});

//exposes
defineExpose({
  exposeCardData,
});
</script>

<template>
  <q-card class="my-card q-mb-sm">
    <q-card-section horizontal class="">
      <q-card-section class="flex-center flex">
        <q-avatar size="60px">
          <img :src="`${crm3}${userSelected?.id}`" alt="" @error="setAltImg" />
        </q-avatar>
      </q-card-section>
      <q-card-section class="full-width q-pa-sm">
        <div class="row flex justify-between">
          <span class="text-overline"> Supervisor </span>
          <!-- <q-btn
            icon="restore"
            rounded
            size="sm"
            flat
            @click="undoChanges"
            v-if="!isEqual"
          >
            Revertir
          </q-btn> -->
        </div>
        <div class="q-mt-none q-mb-xs">
          {{ userSelected?.user_name }}
        </div>
        <div class="text-caption text-grey-6">
          Cargo: {{ userSelected.cargo ?? 'No asignado' }}
        </div>
        <div class="text-caption text-grey-6">
          Division: {{ userSelected?.division }} | Area:
          {{ userSelected?.a_mercado }}
        </div>
      </q-card-section>
    </q-card-section>

    <q-separator />

    <q-card-actions class="q-pt-sm justify-between">
      <div>
        <q-btn flat rounded @click="startEditing" v-if="type == 'read'">
          <q-icon name="search" size="xs" class="q-mr-xs" />
          Buscar y seleccionar
        </q-btn>
        <q-btn flat rounded @click="cancelEditing" v-else>
          <q-icon name="close" size="xs" class="q-mr-xs" />
          Cancelar seleccion
        </q-btn>
      </div>
      <q-btn flat rounded @click="assignMyself">
        <q-icon name="person" size="xs" class="q-mr-sm" />
        Asignarme</q-btn
      >
    </q-card-actions>
    <q-card-section v-if="isEditing" class="q-pt-sm">
      <div>
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
          style="z-index: 1; width: 95%"
          v-if="listUserFiltered?.length > 0"
        >
          <q-list
            bordered
            separator
            style="max-height: 350px"
            class="shadow-1 scroll"
            :class="$q.dark.isActive ? 'bg-primary' : 'bg-white'"
          >
            <q-item
              v-for="(item, index) in listUserFiltered"
              :key="index"
              :disable="
                item.employee_status === 'Terminated' ||
                item.employee_status === 'ContractEnd'
              "
              :class="item.employee_status === 'Terminated' ? 'bg-grey-4' : ''"
            >
              <q-item-section avatar>
                <q-avatar>
                  <img :src="`${crm3}${item.avatar}`" />
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
                  @click="selectUser(item)"
                  dense
                  color="primary"
                  round
                  class="q-px-sm"
                  icon="add"
                  v-if="
                    item.employee_status === 'Vacation' ||
                    item.employee_status === 'Active'
                  "
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </transition>
    </q-card-section>
    <q-inner-loading
      :showing="isLoading"
      label="Cargando datos..."
      label-style="font-size: 1.1em"
    />
  </q-card>
</template>

<style lang="scss" scoped>
.title-card {
  font-size: 1em;
}
.overlay {
  border: 2px solid white;
  position: absolute;
  :hover {
    z-index: 2;
  }
}
</style>
