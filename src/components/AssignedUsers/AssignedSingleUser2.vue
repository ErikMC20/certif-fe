<script lang="ts">
import { AssignedUserModel }                from '../types/index';
import { axios_GLOBAL }                     from 'src/conections/axiosCRM';
import { compareObjects }                   from '../../composables/useUtils';
import { computed, ref, onMounted, toRefs } from 'vue';
import { getListUsers, getFormattedUser   } from '../../services/AssignedUserService';
import { HANSACRM3_URL }                    from 'src/conections/api_conectors';
import { useDivAreaMercado, useDivision }   from 'src/composables/useLanguage';
import { userStore }                        from 'src/modules/Users/store/UserStore';
//import AlertComponent                       from '../MainAlert/AlertComponent.vue';
import Notification                         from '../../composables/notify';
import { AssignedUserStore }                from 'src/components/AssignedUsers/store';
import { storeToRefs }                      from 'pinia';

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
    defaultUserId?: string;
  }>(),
  {
    withList: false,
    inherited: false,
  }
);

/** const Props and Stores */
const { moduleId, module, withList } = toRefs(props);
const { userCRM }                    = userStore();
const { getRolAssignedUser }         = AssignedUserStore();
const storeAssignedUsers             = AssignedUserStore();
const { role }                       = storeToRefs(storeAssignedUsers)


//**ROL DE USUARIOS ASIGNADOS */
getRolAssignedUser(userCRM.id);

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
    if(role.value.enabled){
      let division = '';
      let amercado = '';
      if(role.value.type_search == 1){
        division = 'Todas';
        amercado = ''
      }else if(role.value.type_search == 2){
        division = userCRM.iddivision;
        amercado = ''
      }else if(role.value.type_search == 3){
        division = userCRM.iddivision;
        amercado = userCRM.idamercado;
      }
      listUsers.value = await getListUsers( division, amercado);
    }else{
      listUsers.value = await getListUsers( userCRM.iddivision, userCRM.idamercado);
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

const resetUser = () => {
  userSelected.value = userDefault;
  reset.value = compareObjects(userSelected.value, userDefault);
  createDataSend();
  emit('newAssignedId', userSelected.value.id);
};

const onChangeUser = () => {
  if (moduleId.value !== '' && !props.inherited) {
    userSelected.value = userTemporalSelected.value;
    emit('changeUser', userSelected.value.id);
  } else {
    userSelected.value = userTemporalSelected.value;
    reset.value = compareObjects(userSelected.value, userDefault);
    createDataSend();
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
    // await getUserImage(userSelected.value.id); //Experimental...
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

// const existUserInDivision = (list: AssignedUserModel[], division: string) => {
//   return list.filter((el: AssignedUserModel) => el.iddivision_c === division)
//     .length;
// };

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
    if (!!props.defaultUserId) {
      userSelected.value = await getFormattedUser(props.defaultUserId);
      dataSend.value = userSelected.value;
      emit('newAssignedId', userSelected.value.id);
      return;
    }
    userSelected.value = userDefault;
    dataSend.value = userSelected.value;
    emit('newAssignedId', userSelected.value.id);
  }
});

/** Emits */
const emit = defineEmits(['changeUser', 'newAssignedId']);

/** Exposes */
defineExpose({
  dataSend,
});
</script>
<template>
  <!-- <pre>{{ dataSend }}</pre> -->
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
                    :disable="!role.enabled && item.employee_status === 'Terminated' ||item.employee_status === 'ContractEnd'"
                    :class="item.employee_status === 'Terminated' ? 'bg-grey-4' : ''"
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
                        v-if="item.employee_status === 'Vacation' ||item.employee_status === 'Active' || role.enabled"
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
  <q-card class="my-card q-mb-md" v-if="withList">
    <q-card-section class="q-px-lg q-py-sm">
      <div class="text-h7">
        <q-icon name="group" size="20px" color="primary" class="q-mr-xs" />
        Vendedores asignados
      </div>
    </q-card-section>
    <q-separator dark />
    <template v-if="listUsersAssigneds.length > 0">
      <q-list separator style="max-height: 300px; overflow-y: auto">
        <template
          v-for="{ cod_amercado, label } in listAMercado"
          :key="cod_amercado"
        >
          <q-expansion-item
            icon="groups"
            :default-opened="cod_amercado === userDefault.idamercado_c ?? false"
            v-if="cod_amercado === userDefault.idamercado_c"
          >
            <template v-slot:header>
              <q-item-section avatar>
                <q-avatar icon="work" color="primary" text-color="white" />
              </q-item-section>

              <q-item-section>
                <div>
                  Area de mercado:
                  <span class="text-orange inline-block">
                    {{ label }}
                  </span>
                </div>

                <small>
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
            <template
              v-for="(
                {
                  user_name,
                  a_mercado,
                  division,
                  cargo,
                  avatar,
                  idamercado_c,
                  principal,
                },
                index
              ) in listUsersAssigneds"
              :key="index"
            >
              <template
                v-if="
                  idamercado_c === cod_amercado && principal !== 'assigned_id'
                "
              >
                <q-item>
                  <q-item-section top avatar>
                    <q-avatar>
                      <!-- <img :src="`${HANSACRM3_URL}/${avatar}`" /> -->
                      <object
                        :data="`${HANSACRM3_URL}${avatar}`"
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
                      {{ user_name }}
                      <small class="text-positive q-mx-sm">
                        Cargo: {{ cargo ?? 'Sin asignar' }}
                      </small>
                      <br />
                      <small class="text-grey-6">
                        División: {{ division }} | Area:
                        {{ ` ${a_mercado}` }}
                      </small>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </template>
          </q-expansion-item>
        </template>
        <!-- <template v-for="({ label }, index) in listDivisiones" :key="index">
          <q-expansion-item icon="groups">
            <template v-slot:header>
              <q-item-section>
                <div>
                  <span class="text-blue-10 inline-block">
                    {{ label }}
                  </span>
                </div>
              </q-item-section>
            </template>
            <q-separator />
            <template
              v-for="(
                { user_name, a_mercado, division, cargo, avatar }, index
              ) in listUsersAssigneds"
              :key="index"
            >
              <template>
                <q-item>
                  <q-item-section top avatar>
                    <q-avatar>
                      <object
                        :data="`${HANSACRM3_URL}${avatar}`"
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
                      {{ user_name }}
                      <small class="text-positive q-mx-sm">
                        Cargo: {{ cargo ?? 'Sin asignar' }}
                      </small>
                      <br />
                      <small class="text-grey-6">
                        División: {{ division }} | Area:
                        {{ ` ${a_mercado}` }}
                      </small>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </template>
          </q-expansion-item>
        </template> -->
      </q-list>
    </template>
    <q-card-section v-else> Sin registros que mostrar. </q-card-section>
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
