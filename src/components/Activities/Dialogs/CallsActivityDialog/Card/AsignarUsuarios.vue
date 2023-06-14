<script lang="ts">
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
import { computed, ref, onMounted, toRefs } from 'vue';
import { getListUsers } from 'src/services/AssignedUserService';
import { userStore } from 'src/modules/Users/store/UserStore';
import { HANSACRM3_URL } from 'src/conections/api_conectors';
import { AssignedUserModel } from 'src/components/types/index';
import Notification from 'src/composables/notify';
import { compareObjects } from 'src/composables/useUtils';
import { axios_GLOBAL } from 'src/conections/axiosCRM';
import { useDivAreaMercado, useDivision } from 'src/composables/useLanguage';

const { getListDivisiones } = useDivision();
</script>
<script lang="ts" setup>
/** Props */
const props = withDefaults(
  defineProps<{
    module: string;
    moduleId: string;
    withList?: boolean;
    inherited?: boolean;
    idModule?: string;
  }>(),
  {
    withList: false,
    inherited: false,
  }
);

/** const Props and Stores */
const { moduleId, module, withList } = toRefs(props);
const { userCRM } = userStore();

/** Reactives reclarations */
const loading = ref(false);
const showModal = ref(false);
const changing = ref(false);
const reset = ref(false);
const search = ref('');
const listUsers = ref<AssignedUserModel[]>([]);
const listAMercado = ref([]);
const listUsersAssigneds = ref<AssignedUserModel[]>([]);
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
const dataSend = ref({} as AssignedUserModel);

/** functions */
const changeUser = async () => {
  try {
    changing.value = true;
    listUsers.value = await getListUsers(
      userCRM.iddivision,
      userCRM.idamercado
    );
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

const resetUser = () => {
  userSelected.value = userDefault;
  reset.value = compareObjects(userSelected.value, userDefault);
  createDataSend();
  emit('newAssignedId', userSelected.value.id);
};

const onChangeUser = () => {
  if (moduleId.value !== '' && !props.inherited) {
    console.log('here!!!');
    userSelected.value = userTemporalSelected.value;
    emit('changeUser', userSelected.value.id);
  } else {
    userSelected.value = userTemporalSelected.value;
    reset.value = compareObjects(userSelected.value, userDefault);
    createDataSend();
    console.log('new User Assigned Id', userSelected.value.id);
    emit('newAssignedId', userSelected.value.id);
  }
  search.value = '';
  changing.value = false;
};

const cancelChange = () => {
  search.value = '';
  changing.value = false;
  showModal.value = false;
  userTemporalSelected.value = {} as AssignedUserModel;
};

const getUserAssgined = async (id: string, module: string) => {
  try {
    loading.value = true;
    // console.log(`EXEC [crm4].[User_Assigned_By_Bean] ${module}, '${id}'`);
    const { data } = await axios_GLOBAL.get(
      `/AssignedUser-get/${module}/${id}`
    );
    userSelected.value = data.data.attributes[0];
  } catch (error) {
    Notification(
      'negative',
      'error',
      '<strong>Ops!<strong/> <br> Ocurrio un error.'
    );
  } finally {
    loading.value = false;
  }
};

const getListUsersAssigned = async (id: string, module: string) => {
  try {
    loading.value = true;
    const { data } = await axios_GLOBAL.get(
      `/AssignedUsers-get/${module}/${
        userCRM.iddivision == '' ? 'todas' : userCRM.iddivision
      }/${id}`
    );

    listUsersAssigneds.value = data.data.attributes;
  } catch (error) {
    Notification(
      'negative',
      'error',
      '<strong>Ops!<strong/> <br> Ocurrio un error.'
    );
  } finally {
    loading.value = false;
  }
};

const createDataSend = () => {
  dataSend.value = <AssignedUserModel>{
    id: userSelected.value.id,
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

const listUserFiltered = computed(() => {
  if (search.value.length < 3) {
    return [];
  }
  return listUsers.value.filter(
    (el: AssignedUserModel) =>
      el.user_name.toLowerCase().indexOf(search.value.toLowerCase()) !== -1
  );
});

/** Mounted Function  */
onMounted(async () => {
  if (moduleId.value !== '') {
    await getUserAssgined(moduleId.value, module.value);
    if (withList.value) {
      await getListUsersAssigned(moduleId.value, module.value);
      await getListDivisiones();
      listAMercado.value = await useDivAreaMercado(userCRM.iddivision);
    }
  } else {
    userSelected.value = userDefault;
    dataSend.value = userSelected.value;
    emit('newAssignedId', userSelected.value.id);
  }
});

/** Emits */
const emit = defineEmits(['changeUser', 'newAssignedId']);

const exposeData = () => {
  return dataSend.value;
};
/** Exposes */
defineExpose({
  dataSend,
  exposeData,
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
                Usuario asignado al prospecto
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
        <q-item-section side class="buttons-assigned">
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
        </q-item-section>
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
