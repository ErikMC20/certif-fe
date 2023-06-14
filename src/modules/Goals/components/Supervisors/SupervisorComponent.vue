<script lang="ts">
import { userStore } from 'src/modules/Users/store/UserStore';
import { getResponsibles } from 'src/modules/Projects/services/useResponsibleService';
import { Notification } from 'src/composables';
import { getListUsers } from '../../../../services/AssignedUserService';
import { base } from '../../utils/types';
import { ReponsibleUserModel } from 'src/components/types';
</script>
<script setup lang="ts">
const props = defineProps<{
  moduleId: string;
}>();

// composables
const { userCRM } = userStore();

//refs
//const searchInputRef = ref<InstanceType<typeof QInput> | null>(null);

//variables
const crm3 = HANSACRM3_URL;
const listUsers = ref<ReponsibleUserModel[]>([]);
const listUsersSelected = ref<ReponsibleUserModel[]>([]);
const isEditing = ref(false);
const isLoading = ref(false);
const errorLength = ref(false);
const type = ref('read');
const search = ref('');
const userSelected = ref<ReponsibleUserModel>();

//functions
const startEditing = () => {
  console.log('sadsadsa', isEditing.value);
  isEditing.value = true;
  type.value = 'edit';
};

const getListResponsibles = async () => {
  listUsersSelected.value = await getResponsibles(props.moduleId);
};

const selectUser = async (user: ReponsibleUserModel) => {
  search.value = '';
  errorLength.value = false;

  if (listUsersSelected.value.find((el: base) => el.id == user.id)) {
    return;
  }

  if (props.moduleId) {
    try {
      const formdata = {
        user_id: user.id,
        user_rol: user.rol,
        project_id: props.moduleId,
      };
      isLoading.value = true;
      // await saveResponsibles(formdata);
      Notification('positive', 'check_circle', 'Se agregó correctamente.');
      listUsersSelected.value.push(user);
    } catch (error) {
      console.log(error);
      isLoading.value = false;
      Notification('negative', 'error', 'Ocurrió un error.');
    } finally {
      isLoading.value = false;
      isEditing.value = false;
      type.value = 'read';
    }
  } else {
    userSelected.value = user;
    cancelEditing();
  }
};

const deleteUser = async (id: string) => {
  if (props.moduleId) {
    try {
      isLoading.value = true;
      //await deleteResponsibles(id);
      await getListResponsibles();
      Notification('positive', 'check_circle', 'Se eliminó correctamente.');
    } catch (error) {
      console.log(error);
      isLoading.value = false;
      Notification('negative', 'error', 'Ocurrió un error.');
    } finally {
      isLoading.value = false;
      isEditing.value = false;
      type.value = 'read';
    }
  } else {
    const index = listUsersSelected.value.findIndex((el: base) => el.id == id);
    if (index > -1) {
      listUsersSelected.value.splice(index, 1);
    }
  }
};

const cancelEditing = () => {
  isEditing.value = false;
  type.value = 'read';
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setAltImg = (event: any) => {
  event.target.src = `${HANSACRM3_URL}/upload/users/avatardefault.png`;
};

const exposeCardData = () => {
  return listUsersSelected.value;
};

const validateCard = () => {
  if (listUsersSelected.value.length <= 0) {
    errorLength.value = true;
    return false;
  }
  return true;
};

//computed var
const listUserFiltered = computed(() => {
  if (search.value.length < 3) {
    return [];
  }
  return listUsers.value.filter(
    (el: ReponsibleUserModel) =>
      el.user_name.toLowerCase().indexOf(search.value.toLowerCase()) !== -1
  );
});

//lifecicle
onMounted(async () => {
  listUsers.value = (await getListUsers(
    userCRM.iddivision,
    userCRM.idamercado
  )) as ReponsibleUserModel[];
  if (props.moduleId) {
    type.value = 'read';
    await getListResponsibles();
  }
});

//exposes
defineExpose({
  validateCard,
  exposeCardData,
});
</script>

<template>
  <q-card class="my-card q-mb-sm">
    <q-card-section horizontal>
      <q-card-section class="col-auto flex-center flex">
        <q-avatar
          size="60px"
          font-size="40px"
          color="primary"
          text-color="white"
          icon="person"
        />
      </q-card-section>
      <q-card-section class="full-width q-py-sm q-px-sm">
        <div class="row flex justify-between">
          <span class="text-overline"> Supervisor </span>
          <q-btn
            icon="close"
            round
            size="sm"
            @click="deleteUser(userSelected?.id ?? '')"
          />
        </div>
        <div class="text-h7 q-mt-none q-mb-xs">
          {{ userSelected?.user_name }}
        </div>
        <div class="text-caption text-grey-6">
          Cargo: {{ userSelected?.cargo }}
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
        <!-- <q-btn icon="person" flat> Asignarme a mi </q-btn> -->
        <q-btn flat @click="startEditing" v-if="type == 'read'">
          <q-icon name="search" size="xs" class="q-mr-xs" />
          Buscar y seleccionar
        </q-btn>
        <q-btn flat @click="cancelEditing" v-else>
          <q-icon name="close" size="xs" class="q-mr-xs" />
          Cancelar seleccion
        </q-btn>
      </div>
      <div>
        <q-btn
          outline
          icon="add"
          color="primary"
          href="http://localhost:8080/index.php"
          target="_blank"
        >
          NUEVO SUPERVISOR
        </q-btn>
      </div>
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
                  <img :src="`${crm3}${item.avatar}`" @error="setAltImg" />
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
    <!-- <q-inner-loading
        :showing="isLoadingProcess"
        label="Cargando datos..."
        label-class="text-primary"
        label-style="font-size: 1.1em"
      /> -->
  </q-card>
</template>

<style scoped>
.title-card {
  font-size: 1em;
}
</style>
