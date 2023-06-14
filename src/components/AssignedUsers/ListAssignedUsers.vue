<script lang="ts">
import { AssignedUserModel } from '../types/index';
import { axios_GLOBAL } from 'src/conections/axiosCRM';
import { compareObjects } from '../../composables/useUtils';
import { computed, ref, onMounted, toRefs } from 'vue';
import {
  getFormattedUser,
  getListUsers,
  deleteRelation,
  updateRelation,
} from '../../services/AssignedUserService';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { QSpinnerGears } from 'quasar';
import { useDivAreaMercado, useDivision } from 'src/composables/useLanguage';
import { userStore } from 'src/modules/Users/store/UserStore';
import { AssignedUserStore } from 'src/components/AssignedUsers/store';
import AlertComponent from '../MainAlert/AlertComponent.vue';
import Notification from '../../composables/notify';
import { storeToRefs } from 'pinia';

const { getListDivisiones } = useDivision();
</script>
<script lang="ts" setup>
/** Props */
const props = withDefaults(
  defineProps<{
    defaultUserId?: string;
    inherited?: boolean;
    module: string;
    moduleId: string;
    withList?: boolean;
  }>(),
  {
    withList: false,
    inherited: false,
  }
);
const deleteRela = ref('');

/** const Props and Stores */
const { moduleId, module, withList } = toRefs(props);
const { userCRM } = userStore();
const { getRolAssignedUser } = AssignedUserStore();
const storeAssignedUsers = AssignedUserStore();
const { role } = storeToRefs(storeAssignedUsers);
//**ROL DE USUARIOS ASIGNADOS */
getRolAssignedUser(userCRM.id);

/** Reactives reclarations */
const changing = ref(false);
const changingList = ref(false);
const dataSend = ref({} as AssignedUserModel);
const isLoadingUsers = ref(false);
const listAMercado = ref([]);
const listUsers = ref<AssignedUserModel[]>([]);
const listUsersAssigneds = ref<AssignedUserModel[]>([]);
const loading = ref(false);
const reset = ref(false);
const search = ref('');
const showDelete = ref(false);
const showModal = ref(false);
const showModal2 = ref(false);
const showReasign = ref(false);
const userSelected = ref({} as AssignedUserModel);
const userTemporalSelected = ref({} as AssignedUserModel);
const userDefault = <AssignedUserModel>{
  user_name: `${userCRM.nombres} ${userCRM.apellidos}`,
  assigned_user_id: userCRM.id,
  id: userCRM.id,
  division: userCRM.division,
  cargo: userCRM.rol,
  avatar: `/upload/users/${userCRM.id ?? 'avatardefault.png'}`,
  a_mercado: userCRM.amercado,
  idamercado_c: userCRM.idamercado,
  iddivision_c: userCRM.iddivision,
  idregional_c: userCRM.idregional,
  principal: 'yes',
};
const propsAlert = {
  icon: 'warning',
  iconColor: 'warning',
  iconSize: '50px',
  title: '¿ Cambiar vendedor ?',
  btnColor: 'primary',
  btnText: 'Si, cambiar',
};

const propsAlert2 = {
  icon: 'person_add',
  iconColor: 'blue-10',
  iconSize: '50px',
  title: '¿ Agregar vendedor ?',
  btnColor: 'primary',
  btnText: 'Si, agregar',
};

const propsAlertDelete = {
  icon: 'cancel',
  iconColor: 'negative',
  iconSize: '60px',
  title: '¿ Eliminar vendedor ?',
  btnColor: 'negative',
  btnText: 'Si, eliminar',
};
const propsAlertReasign = {
  icon: 'sync_problem',
  iconColor: 'negative',
  iconSize: '60px',
  title: '¿ Reasignar vendedor ?',
  btnColor: 'negative',
  btnText: 'Si, reasignar',
};

/** functions */
const changeUser = async () => {
  try {
    changing.value = true;
    if (role.value.enabled) {
      let division = '';
      let amercado = '';
      if (role.value.type_search == 1) {
        division = 'Todas';
        amercado = '';
      } else if (role.value.type_search == 2) {
        division = userCRM.iddivision;
        amercado = '';
      } else if (role.value.type_search == 3) {
        division = userCRM.iddivision;
        amercado = userCRM.idamercado;
      }
      listUsers.value = await getListUsers(division, amercado);
    } else {
      listUsers.value = await getListUsers(
        userCRM.iddivision,
        userCRM.idamercado
      );
    }
  } catch (error) {
    Notification(
      'negative',
      'error',
      '<strong>Ops!<strong/> Ocurrio un error.'
    );
    throw error;
  }
};

const searchUser = async () => {
  try {
    changingList.value = true;
    if (role.value.enabled) {
      let division = '';
      let amercado = '';
      if (role.value.type_search == 1) {
        division = 'Todas';
        amercado = '';
      } else if (role.value.type_search == 2) {
        division = userCRM.iddivision;
        amercado = '';
      } else if (role.value.type_search == 3) {
        division = userCRM.iddivision;
        amercado = userCRM.idamercado;
      }
      listUsers.value = await getListUsers(division, amercado);
    } else {
      listUsers.value = await getListUsers(
        userCRM.iddivision,
        userCRM.idamercado
      );
    }
  } catch (error) {
    Notification(
      'negative',
      'error',
      '<strong>Ops¡<strong/> Ocurrio un error.'
    );
    throw error;
  }
};

const selectUser = (item: AssignedUserModel) => {
  showModal.value = true;
  userTemporalSelected.value = item;
};

const selectUserList = (item: AssignedUserModel) => {
  showModal2.value = true;
  userTemporalSelected.value = item;
};

const selectUserDelete = (item: AssignedUserModel) => {
  userTemporalSelected.value = item;
  showDelete.value = true;
  deleteRela.value = item.id_relacion || '';
  // DeleteUser(item);
};

const selectUserReasign = (item: AssignedUserModel) => {
  const data = {
    ...item,
    idUser: userCRM.id,
  };
  userTemporalSelected.value = data;
  showReasign.value = true;
};
// const resetUser = () => {
//   userSelected.value = userDefault;
//   reset.value = compareObjects(userSelected.value, userDefault);
//   createDataSend();
// };

const onChangeUser = () => {
  if (moduleId.value !== '') {
    userSelected.value = userTemporalSelected.value;
    emit('changeUser', userSelected.value.id);
    emit('changeUserAllDataUser', userSelected.value);
    createDataSend();
  } else {
    userSelected.value = userTemporalSelected.value;
    modifi();
    reset.value = compareObjects(userSelected.value, userDefault);
  }
  search.value = '';
  changing.value = false;
};

//!Elimina usuarios asignados
const onDeleteUser = () => {
  DeleteUser(deleteRela.value);
  // search.value = '';
  // changing.value = false;
};
const cancelChange = () => {
  search.value = '';
  changing.value = false;
  changingList.value = false;
  showModal.value = false;
  showModal2.value = false;
  userTemporalSelected.value = {} as AssignedUserModel;
};

//?Reasigna usuarios
const onReasignUser = () => {
  //*Reasignación de usuario
  asignerUserUpdate(userTemporalSelected.value);
};

const cancelReasign = () => {
  return '';
};

const getUserAssgined = async (id: string, module: string) => {
  try {
    loading.value = true;
    const { data } = await axios_GLOBAL.get(
      `/AssignedUser-get/${module}/${id}`
    );
    userSelected.value = data.data.attributes[0];
    return data.data.attributes[0];
  } catch (error) {
    Notification(
      'negative',
      'error',
      '<strong>Ops¡<strong/> <br> Ocurrio un error.'
    );
  } finally {
    loading.value = false;
  }
};

const getListUsersAssigned = async (id: string, module: string) => {
  try {
    isLoadingUsers.value = true;
    const { data } = await axios_GLOBAL.get(
      `/AssignedUsers-get/${module.toLowerCase()}/${
        userCRM.iddivision == '' ? 'todas' : userCRM.iddivision
      }/${id}`
    );

    listUsersAssigneds.value = data.data.attributes;
  } catch (error) {
    Notification(
      'negative',
      'error',
      '<strong>Ops¡<strong/> <br> Ocurrio un error.'
    );
  } finally {
    isLoadingUsers.value = false;
  }
};
const modifi = () => {
  dataSend.value = <AssignedUserModel>{
    assigned_user_id: userSelected.value.id,
    principal: 'yes',
    iddivision_c: userSelected.value.iddivision_c,
    idamercado_c: userSelected.value.idamercado_c,
    idgrupocliente_c: '',
    idsector_c: '',
    idregional_c: userSelected.value.idregional_c,
    idcanalvta_c: '',
  };
};

const createDataSend = async () => {
  isLoadingUsers.value = true;
  modifi();
  console.log(userSelected, moduleId);
  try {
    const verPost = `/post-relationships-module-create-generic/${module.value}/${moduleId.value}`;
    const body = {
      type: 'HANA_Relaciones',
      attributes: {
        created_by: userCRM.id,
        description: 'PRUEBA 55',
        ...dataSend.value,
      },
    };
    await axios_GLOBAL.post(verPost, body);
    await getListUsersAssigned(moduleId.value, module.value);
    return verPost;
  } catch (error) {
    Notification(
      'error',
      'error',
      '<strong>Ops!</strong> <br/> Ocurrió un error.'
    );
    throw error;
  } finally {
    isLoadingUsers.value = false;
  }
};

const DeleteUser = async (id_hana: string) => {
  try {
    isLoadingUsers.value = true;
    await deleteRelation(module.value, moduleId.value, userDefault.id, [
      { id: id_hana },
    ]);
    await getListUsersAssigned(moduleId.value, module.value);
    Notification(
      'positive',
      'check',
      '<strong>Correcto!</strong> <br/> Se elimino el vendedor.'
    );
  } catch (error) {
    Notification(
      'error',
      'error',
      '<strong>Ops!</strong> <br/> Ocurrió un error.'
    );
    throw error;
  } finally {
    isLoadingUsers.value = false;
  }
};
const asignerUserUpdate = async (data: object) => {
  try {
    isLoadingUsers.value = true;
    await updateRelation(module.value, moduleId.value, data);
    await getListUsersAssigned(moduleId.value, module.value);
    Notification(
      'positive',
      'check',
      '<strong>Correcto!</strong> <br/> Se reasigno al vendedor.'
    );
  } catch (error) {
    Notification(
      'error',
      'error',
      '<strong>Ops!</strong> <br/> Ocurrió un error en la reasginación.'
    );
    throw error;
  } finally {
    isLoadingUsers.value = false;
  }
};

const existUserInAMercado = (list: AssignedUserModel[], amercado: string) => {
  return list.filter(
    (el: AssignedUserModel) =>
      el.idamercado_c === amercado && el.principal !== 'assigned_id'
  ).length;
};

const listUserFiltered = computed(() => {
  if (search.value.length < 3) {
    return [];
  }
  return listUsers.value
    .filter(
      (el: AssignedUserModel) =>
        el.user_name.toLowerCase().indexOf(search.value.toLowerCase()) !== -1
    )
    .map((user) => ({
      ...user,
      isSelected: !listUsersAssigneds.value.some(
        (u) =>
          u.id === user.id &&
          u.iddivision_c === user.iddivision_c &&
          u.idamercado_c === user.idamercado_c
      ),
    }));
});

const visible = ref(false);

/** Mounted Function  */
onMounted(async () => {
  if (moduleId.value !== '' && !props.inherited) {
    // console.log(`ModuleId: ${moduleId.value},
    // UserDefaultId (logged user): ${userDefault.id}
    // Module: ${module.value}
    // List A Mercado: ${userCRM.iddivision}
    // ${JSON.stringify(userCRM)}`);
    await getUserAssgined(moduleId.value, module.value);
    if (withList.value) {
      await getListUsersAssigned(moduleId.value, module.value);
      await getListDivisiones();
      listAMercado.value = await useDivAreaMercado(userCRM.iddivision);
    }
  } else {
    if (!!props.defaultUserId) {
      const assignedUser = await getFormattedUser(props.defaultUserId);
      userSelected.value = assignedUser;
      modifi();
      return;
    }

    if (!!props.module && !!props.moduleId) {
      await getUserAssgined(props.moduleId, props.module);
      return;
    }
    userSelected.value = userDefault;
    dataSend.value = userSelected.value;
  }
});

/** Emits */
// const emit = defineEmits(['changeUser']);
const emit = defineEmits<{
  (event: 'changeUser'): void;
  (event: 'changeUserAllDataUser', values: object): void;
}>();

/** Exposes */
defineExpose({
  dataSend,
});
</script>
<template>
  <AlertComponent
    v-model="showModal"
    v-bind="propsAlert"
    @confirm="onChangeUser"
    @denegate="cancelChange"
  >
    <template #body>
      <span class="q-py-sm">
        Se cambiará a <strong>{{ userTemporalSelected.user_name }}</strong> como
        nuevo responsable.
      </span>
    </template>
  </AlertComponent>

  <AlertComponent
    v-model="showModal2"
    v-bind="propsAlert2"
    @confirm="onChangeUser"
    @denegate="cancelChange"
  >
    <template #body>
      <span class="q-py-sm">
        Se agregará <strong>{{ userTemporalSelected.user_name }}</strong> a la
        lista de asignados.
      </span>
    </template>
  </AlertComponent>

  <AlertComponent
    v-model="showDelete"
    v-bind="propsAlertDelete"
    @confirm="onDeleteUser"
    @denegate="cancelChange"
  >
    <template #body>
      <span class="q-py-sm">
        Se eliminará a <strong>{{ userTemporalSelected.user_name }}</strong> de
        la lista de asignados.
      </span>
    </template>
  </AlertComponent>
  <AlertComponent
    v-model="showReasign"
    v-bind="propsAlertReasign"
    @confirm="onReasignUser"
    @denegate="cancelReasign"
  >
    <template #body>
      <span class="q-py-sm">
        Se reasignara a <strong>{{ userTemporalSelected.user_name }}</strong>
      </span>
    </template>
  </AlertComponent>
  <!-- <pre>{{ moduleId }}</pre> -->
  <q-card v-if="loading" class="my-card q-mb-md">
    <q-item>
      <q-item-section avatar>
        <q-skeleton bordered type="circle" />
      </q-item-section>
      <q-item-section>
        <q-item-label>
          <q-skeleton class="q-mb-sm" />
          <q-skeleton class="q-mb-sm" />
          <q-skeleton class="q-mb-sm" />
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-card>

  <q-card class="bg-primary glossy q-mb-sm" v-else-if="!moduleId && !inherited">
    <q-list separator>
      <template v-if="changing">
        <q-card flat class="bg-transparent q-pa-sm">
          <q-card-section class="q-pa-none">
            <div class="">
              <q-input
                v-model="search"
                dense
                color="white"
                debounce="0"
                class="placesholding"
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
                        <small class="text-grey-6">
                          Cargo: {{ item.cargo }}
                        </small>
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
                        @click="selectUser(item)"
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
        </q-card>
      </template>
      <q-item class="item-list" v-if="userSelected != null">
        <q-item-section avatar>
          <q-avatar size="60px" class="shadow-1 bg-blue">
            <img :src="`${HANSACRM3_URL}${userSelected.avatar}`" alt="" />
          </q-avatar>
        </q-item-section>
        <q-item-section class="">
          <q-item-label>
            <div class="flex items-center text-white justify-between">
              {{ userSelected.user_name }}
              <q-chip class="text-dark" color="white" size="sm">
                <q-icon
                  name="badge"
                  color="primary"
                  class="q-mr-xs"
                  size="20px"
                />

                Vendedor principal
              </q-chip>
            </div>
            <div>
              <small class="text-blue-grey-2">
                Cargo: {{ userSelected.cargo ?? 'Sin asignar' }}
              </small>
              <br />
              <small class="text-blue-grey-2">
                División: {{ userSelected.division }} | Area:
                {{ ` ${userSelected.a_mercado}` }}
              </small>
            </div>
          </q-item-label>
        </q-item-section>
        <!-- <q-item-section side class="buttons-assigned">
          <q-btn v-if="!changing" dense round @click="changeUser" color="white">
            <q-icon name="edit" color="dark" />
            <q-tooltip>Reasignar</q-tooltip>
          </q-btn>
          <q-btn v-else dense round @click="cancelChange" color="white">
            <q-icon name="close" color="dark" />
            <q-tooltip>Cancelar</q-tooltip>
          </q-btn>
          <q-btn
            v-if="reset"
            icon="refresh"
            color="white"
            flat
            dense
            round
            size="sm"
            @click="resetUser"
            class="edit-btn"
          >
            <q-tooltip>Revertir</q-tooltip>
          </q-btn>
        </q-item-section> -->
      </q-item>
      <q-item v-else>
        <q-item-section class="">
          <q-item-label class="text-white">
            Sin vendedor asignado
          </q-item-label>
        </q-item-section>
        <q-item-section side class="buttons-assigned">
          <q-btn v-if="!changing" dense round @click="changeUser" color="white">
            <q-icon name="person_add" color="dark" />
            <q-tooltip>Asignar vendedor</q-tooltip>
          </q-btn>
          <q-btn v-else dense round @click="cancelChange" color="white">
            <q-icon name="close" color="dark" />
            <q-tooltip>Cancelar</q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>

  <q-card class="bg-primary glossy q-mb-sm" v-else>
    <q-list separator>
      <template v-if="changing">
        <q-card flat class="bg-transparent q-pa-sm">
          <q-card-section class="q-pa-none">
            <div class="">
              <q-input
                v-model="search"
                dense
                color="white"
                debounce="0"
                class="placesholding"
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
                        <small class="text-grey-6">
                          Cargo: {{ item.cargo }}
                        </small>
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
                        @click="selectUser(item)"
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
        </q-card>
      </template>
      <q-item class="item-list" v-if="userSelected != null">
        <q-item-section avatar>
          <q-avatar size="60px" class="shadow-1 bg-blue">
            <img :src="`${HANSACRM3_URL}${userSelected.avatar}`" alt="" />
          </q-avatar>
        </q-item-section>
        <q-item-section class="">
          <q-item-label>
            <div class="flex items-center text-white justify-between">
              {{ userSelected.user_name }}
              <q-chip class="text-dark" color="white" size="sm">
                <q-icon
                  name="badge"
                  color="primary"
                  class="q-mr-xs"
                  size="20px"
                />

                Vendedor principal
              </q-chip>
            </div>
            <div>
              <small class="text-blue-grey-2">
                Cargo: {{ userSelected.cargo ?? 'Sin asignar' }}
              </small>
              <br />
              <small class="text-blue-grey-2">
                División: {{ userSelected.division }} | Área de mercado:
                {{ ` ${userSelected.a_mercado}` }}
              </small>
            </div>
          </q-item-label>
        </q-item-section>
        <!-- <q-item-section side class="buttons-assigned">
          <q-btn v-if="!changing" dense round @click="changeUser" color="white">
            <q-icon name="edit" color="dark" />
            <q-tooltip>Reasignar</q-tooltip>
          </q-btn>
          <q-btn v-else dense round @click="cancelChange" color="white">
            <q-icon name="close" color="dark" />
            <q-tooltip>Cancelar</q-tooltip>
          </q-btn>
          <q-btn
            v-if="reset"
            icon="refresh"
            color="white"
            flat
            dense
            round
            size="sm"
            @click="resetUser"
            class="edit-btn"
          >
            <q-tooltip>Revertir</q-tooltip>
          </q-btn>
        </q-item-section> -->
      </q-item>
      <q-item v-else>
        <q-item-section class="">
          <q-item-label class="text-white">
            Sin vendedor asignado
          </q-item-label>
        </q-item-section>
        <q-item-section side class="buttons-assigned">
          <q-btn v-if="!changing" dense round @click="changeUser" color="white">
            <q-icon name="person_add" color="dark" />
            <q-tooltip>Asignar vendedor</q-tooltip>
          </q-btn>
          <q-btn v-else dense round @click="cancelChange" color="white">
            <q-icon name="close" color="dark" />
            <q-tooltip>Cancelar</q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>

  <q-card class="my-card q-mb-md" v-if="withList">
    <q-card-section class="q-pa-none">
      <q-toolbar class="text-dark">
        <q-icon name="group" color="primary" size="sm" />
        <q-toolbar-title style="font-size: 1em">
          Vendedores asignados
        </q-toolbar-title>
        <q-btn
          color="primary"
          icon="person_add"
          flat
          dense
          round
          @click="searchUser"
          v-if="changingList == false"
        >
          <q-tooltip> Buscar y asignar </q-tooltip>
        </q-btn>
        <q-btn
          color="primary"
          icon="close"
          flat
          dense
          round
          @click="cancelChange"
          v-else
        />
      </q-toolbar>
      <!-- <pre>{{ dataSend }}</pre> -->
      <q-separator />
      <template v-if="changingList">
        <q-card flat class="bg-transparent q-pa-sm">
          <q-card-section class="q-pa-none">
            <div class="">
              <q-input
                v-model="search"
                dense
                debounce="0"
                class="placesholding"
                outlined
                placeholder="Buscar usuario"
                :autofocus="true"
              >
                <template #append>
                  <q-icon name="search" v-if="search == ''" />
                  <q-icon
                    name="clear"
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
                      (!role.enabled &&
                        item.employee_status === 'Terminated') ||
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
                        <small class="text-grey-6">
                          Cargo: {{ item.cargo }}
                        </small>
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
                        color="green-9"
                        round
                        size="sm"
                        class="q-px-sm"
                        v-if="
                          item.isSelected &&
                          (item.employee_status === 'Vacation' ||
                            item.employee_status === 'Active' ||
                            role.enabled)
                        "
                        @click="selectUserList(item)"
                      >
                        <q-icon name="add" />
                      </q-btn>
                      <q-chip
                        v-if="!item.isSelected"
                        color="warning"
                        icon="warning"
                        label="ya seleccionado"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </transition>
          </q-card-section>
        </q-card>
      </template>
    </q-card-section>
    <q-separator dark />

    <q-separator dark />
    <!-- <pre>{{ userCRM }}</pre>
    <pre>{{ listUsersAssigneds }}</pre> -->
    <template v-if="listUsersAssigneds.length > 0">
      <q-list separator style="max-height: 300px; overflow-y: auto">
        <template
          v-for="{ cod_amercado, label } in listAMercado"
          :key="cod_amercado"
        >
          <!-- <pre>{{ cod_amercado || 'no area de mercado' }}</pre>
          <pre>
abc {{listUsersAssigneds.filter((v:any) => v.idamercado_c === cod_amercado)}}</pre
          > -->
          <q-expansion-item
            icon="groups"
            header-class=" bg-grey-2"
            v-if="listUsersAssigneds.filter((v:any) => v.idamercado_c === cod_amercado).length > 0"
          >
            <template v-slot:header>
              <q-item-section avatar>
                <q-avatar icon="groups" color="primary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <template
                  v-for="(item2, index) in listUsersAssigneds.filter((v:any) => v.idamercado_c === cod_amercado)"
                  :key="index"
                >
                  <div v-if="index == 0">
                    {{ item2.user_name }}
                  </div>
                  <div v-if="index == 0">
                    <span class="inline-block text-caption text-grey">
                      Fecha asignada: {{ item2.fecha_modificacion }}
                      {{ item2.hora_modificacion }}
                    </span>
                  </div>
                </template>
              </q-item-section>
              <q-item-section>
                <div>
                  Área de mercado:
                  <span class="text-orange inline-block">
                    {{ label }}
                  </span>
                </div>

                <small class="text-grey">
                  {{
                    `Vendedores: ${existUserInAMercado(
                      listUsersAssigneds,
                      cod_amercado
                    )}`
                  }}
                </small>
              </q-item-section>
            </template>
            <q-separator />
            <template v-for="(item, index) in listUsersAssigneds" :key="index">
              <template
                v-if="
                  item.idamercado_c === cod_amercado &&
                  item.principal !== 'assigned_id'
                "
              >
                <q-item>
                  <q-item-section top avatar>
                    <q-avatar>
                      <!-- <img :src="`${HANSACRM3_URL}/${avatar}`" /> -->
                      <object
                        :data="`${HANSACRM3_URL}${item.avatar}`"
                        type="image/png"
                        style="object-fit: cover; width: 40px; height: 40px"
                      >
                        <img
                          src="/avatar/avatardefault.png"
                          style="object-fit: cover; width: 40px; height: 40px"
                        />
                      </object>
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ item.user_name }}
                      <small class="text-positive q-mx-sm">
                        Cargo: {{ item.cargo ?? 'Sin asignar' }}
                      </small>
                      <br />
                      <small class="text-grey-6">
                        División: {{ item.division }} | Área de mercado:
                        {{ ` ${item.a_mercado}` }}
                      </small>
                      <br />
                      <small class="text-grey-7">
                        Fecha de asignacion: {{ item.fecha_modificacion }}
                        {{ item.hora_modificacion }}
                      </small>
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <div class="q-pa-md q-gutter-sm">
                      <q-btn
                        color="blue"
                        icon="autorenew"
                        flat
                        dense
                        round
                        @click="selectUserReasign(item)"
                      >
                        <q-tooltip>Reasignar</q-tooltip>
                      </q-btn>
                      <q-btn
                        color="red"
                        icon="person_remove_alt_1"
                        flat
                        dense
                        round
                        @click="selectUserDelete(item)"
                        v-if="role.enabled"
                      >
                        <q-tooltip>Quitar</q-tooltip>
                      </q-btn>
                    </div>
                  </q-item-section>
                </q-item>
              </template>
            </template>
          </q-expansion-item>
        </template>
      </q-list>
    </template>

    <q-inner-loading
      :showing="isLoadingUsers"
      label="Actualizando Usuarios Asignados"
      label-class="text-primary"
      label-style="font-size: 1.1em"
    >
      <q-spinner-gears
        class="q-mb-sm"
        color="primary"
        size="3rem"
        :thickness="5"
      />
      <span class="text-primary">Actualizando lista de usuarios</span>
    </q-inner-loading>
    <!-- <q-card-section v-else-if="moduleId!=''">
      Sin registros que mostrar.
    </q-card-section> -->
  </q-card>

  <q-inner-loading :showing="visible">
    <q-spinner-gears size="50px" color="primary" />
  </q-inner-loading>
</template>

<style lang="scss" scoped>
.edit-btn {
  position: absolute;
  top: 5px;
  right: 5px;
}
.bg-primary-transparent {
  background-color: #e6e6e6;
}
.placesholding {
  color: white;
}
.item-list {
  padding: 1em;
  align-items: center;
}
</style>
