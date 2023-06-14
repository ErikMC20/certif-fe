<script lang="ts">
import { QSelect, QInput } from 'quasar';
import { Notification } from 'src/composables';
import { useResponsiblesRoles } from 'src/composables/useCRMLanguage';
import { getResponsibles } from 'src/modules/Projects/services/useResponsibleService';
import { userStore } from 'src/modules/Users/store/UserStore';
import { setDefaultAvatar } from '../../composables';
import {
  deleteResponsibles,
  saveResponsibles,
  updateResponsibles,
} from '../../modules/Projects/services/useResponsibleService';
import { getListUsers } from '../../services/AssignedUserService';
import { ReponsibleUserModel } from '../types';
import { HANSACRM3_URL } from '../../conections/api_conectors';
import { onMounted, computed, ref } from 'vue';
</script>
<script setup lang="ts">
const props = defineProps<{
  moduleId: string;
}>();

// composables
const { userCRM } = userStore();
const crm3 = HANSACRM3_URL;

//refs
const searchInputRef = ref<InstanceType<typeof QInput> | null>(null);
const selectRolRef = ref();
const { getlistResponsiblesRoles, listResponsiblesRoles } =
  useResponsiblesRoles();

//variables
const errorLength = ref(false);
const isEditing = ref(false);
const isLoading = ref(false);
const listUsers = ref<ReponsibleUserModel[]>([]);
const listUsersSelected = ref<ReponsibleUserModel[]>([]);
const search = ref('');
const type = ref('create');

//functions
const startEditing = () => {
  isEditing.value = true;
  type.value = 'edit';
};

const getListResponsibles = async () => {
  listUsersSelected.value = await getResponsibles(props.moduleId);
};

const onSelectUser = async (user: ReponsibleUserModel) => {
  search.value = '';
  errorLength.value = false;
  console.log(user);
  if (
    listUsersSelected.value.find((el: ReponsibleUserModel) => el.id == user.id)
  ) {
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
      await saveResponsibles(formdata);
      emit('update');
      Notification('positive', 'check_circle', 'Se agregó correctamente.');
      listUsersSelected.value.push(user);
    } catch (error) {
      isLoading.value = false;
      Notification('negative', 'error', 'Ocurrió un error.');
    } finally {
      isLoading.value = false;
      isEditing.value = false;
      type.value = 'read';
    }
  } else {
    listUsersSelected.value.push(user);
  }
};

const onDeleteUser = async (user: ReponsibleUserModel) => {
  if (props.moduleId) {
    try {
      isLoading.value = true;
      await deleteResponsibles(user.res_id);
      await getListResponsibles();
      emit('update');
      Notification('positive', 'check_circle', 'Se eliminó correctamente.');
    } catch (error) {
      isLoading.value = false;
      Notification('negative', 'error', 'Ocurrió un error.');
    } finally {
      isLoading.value = false;
      isEditing.value = false;
      type.value = 'read';
    }
  } else {
    const index = listUsersSelected.value.findIndex((el) => el.id == user.id);
    if (index > -1) {
      listUsersSelected.value.splice(index, 1);
    }
  }
};

const onChangeRol = async (rol: string, id: string) => {
  if (props.moduleId) {
    try {
      isLoading.value = true;
      await updateResponsibles(id, { user_rol: rol });
      await getListResponsibles();
      emit('update');
      Notification(
        'positive',
        'check_circle',
        'Se modificó el rol correctamente.'
      );
    } catch (error) {
      isLoading.value = false;
      Notification('negative', 'error', 'Ocurrió un error.');
    } finally {
      isLoading.value = false;
      isEditing.value = false;
      type.value = 'read';
    }
  }
};

const onCancelEditing = () => {
  isEditing.value = false;
  type.value = 'read';
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
  await getlistResponsiblesRoles();
  listUsers.value = (await getListUsers(
    userCRM.iddivision,
    userCRM.idamercado
  )) as ReponsibleUserModel[];
  if (props.moduleId) {
    type.value = 'read';
    await getListResponsibles();
  }
});

//emits
const emit = defineEmits<{
  (e: 'update'): void;
}>();

//exposes
defineExpose({
  validateCard,
  exposeCardData,
});
</script>

<template>
  <q-card class="q-mb-sm" :class="$q.screen.xs ? 'responsive-width' : ''">
    <q-card-section class="q-pa-none">
      <q-list class="rounded-borders">
        <q-card-section class="q-pa-none">
          <q-toolbar class="text-dark">
            <q-btn icon="group" color="primary" flat round>
              <q-badge
                color="orange"
                text-color="white"
                :label="listUsersSelected.length"
                floating
                rounded
              />
            </q-btn>
            <q-toolbar-title class="title-card"> Responsables </q-toolbar-title>

            <template v-if="type == 'read' || type == 'edit'">
              <q-btn
                color="grey-7"
                :icon="!isEditing ? 'edit' : 'cancel'"
                size="sm"
                flat
                round
                @click="!isEditing ? startEditing() : onCancelEditing()"
              />
            </template>
          </q-toolbar>
          <q-separator />
        </q-card-section>

        <q-card-section v-if="type != 'read'">
          <q-input
            v-model="search"
            type="text"
            label="Buscar usuario"
            dense
            outlined
            ref="searchInputRef"
            class="q-pb-none"
          >
            <template v-slot:prepend>
              <q-icon name="search" v-if="search == ''" />
              <q-icon
                name="close"
                v-else
                @click="search = ''"
                class="cursor-pointer"
              />
            </template>
          </q-input>
          <transition
            enter-active-class="animated zoomIn"
            leave-active-class="animated zoomOut"
          >
            <div
              bordered
              class="absolute col-12 q-py-none"
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
                    item.employee_status == 'Terminated' ||
                    item.employee_status == 'ContractEnd'
                  "
                  :class="
                    item.employee_status === 'Terminated' ? 'bg-grey-4' : ''
                  "
                >
                  <q-item-section avatar>
                    <q-avatar size="50px">
                      <img :src="`${crm3}${item.avatar}`" />
                      <q-badge
                        floating
                        color="red"
                        size="xs"
                        icon="circle"
                        rounded
                        v-if="
                          item.employee_status == 'Terminated' ||
                          item.employee_status == 'ContractEnd' ||
                          item.employee_status == 'Volunted'
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
                  <q-item-section>
                    <q-select
                      ref="selectRolRef"
                      style="border-radius: 5px; width: 200px"
                      dense
                      outlined
                      v-model="item.rol"
                      :options="listResponsiblesRoles"
                      options-dense
                      label="Rol"
                      :hide-dropdown-icon="type == 'read'"
                      :readonly="type == 'read'"
                      option-value="value"
                      option-label="label"
                      emit-value
                      :disable="
                        item.employee_status == 'Terminated' ||
                        item.employee_status == 'ContractEnd'
                      "
                      map-options
                      :rules="[(val:string) => !!val || 'Seleccione un rol']"
                    />
                  </q-item-section>
                  <q-item-section avatar>
                    <q-btn
                      dense
                      color="primary"
                      round
                      size=""
                      class="q-px-sm"
                      v-if="
                        item.employee_status == 'Vacation' ||
                        item.employee_status == 'Active'
                      "
                      @click="onSelectUser(item)"
                    >
                      <q-icon name="add"
                    /></q-btn>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </transition>
        </q-card-section>

        <q-scroll-area
          style="height: 160px; overflow-y: auto"
          v-if="listUsersSelected.length > 0"
        >
          <template v-for="user in listUsersSelected" :key="user.id">
            <q-item>
              <q-item-section avatar>
                <q-avatar size="40px">
                  <img
                    :src="`${crm3}${user.avatar}`"
                    @error="setDefaultAvatar"
                  />
                  <q-badge
                    floating
                    :color="user.status == 'active' ? 'green' : 'red'"
                    rounded
                  >
                  </q-badge>
                  <q-badge
                    floating
                    :color="
                      user.employee_status == 'Active' ? 'green' : 'secondary'
                    "
                    rounded
                    v-if="
                      user.employee_status == 'Active' ||
                      user.employee_status == 'Vacation'
                    "
                  />

                  <q-badge
                    floating
                    color="red"
                    size="xs"
                    icon="circle"
                    rounded
                    v-else
                  />
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1">
                  <span class="text-weight-medium">{{ user.user_name }}</span>
                </q-item-label>
                <q-item-label caption lines="1">
                  <span class="text-grey-9">Division: </span>
                  {{ user.division }}
                </q-item-label>
                <q-item-label caption lines="1"
                  ><span class="text-grey-9">A. Mercado: </span>
                  {{ user.a_mercado }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-select
                  ref="selectRolRef"
                  style="border-radius: 5px; width: 200px"
                  dense
                  outlined
                  v-model="user.rol"
                  :options="listResponsiblesRoles"
                  options-dense
                  label="Rol"
                  :hide-dropdown-icon="type == 'read'"
                  :readonly="type == 'read'"
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  :rules="[(val:string) => !!val || 'Seleccione un rol']"
                  @update:model-value="onChangeRol(user.rol, user.res_id)"
                />
              </q-item-section>

              <q-item-section side v-if="type == 'edit' || type == 'create'">
                <div class="text-grey-8 q-gutter-xs">
                  <q-btn size="12px" flat dense round icon="more_vert">
                    <q-menu
                      transition-show="scale"
                      transition-hide="scale"
                      auto-close
                    >
                      <q-list dense>
                        <q-item clickable @click="onDeleteUser(user)">
                          <q-item-section>
                            <span>Eliminar</span>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
            <q-separator inset color="white" />
          </template>
        </q-scroll-area>
      </q-list>
    </q-card-section>
    <q-card-section class="q-py-sm" v-if="errorLength">
      <q-icon name="error" size="sm" color="negative" />
      <small class="text-negative q-ml-sm">
        Debe seleccionar al menos un responsable.</small
      >
    </q-card-section>
    <q-inner-loading
      :showing="isLoading"
      label="Procesando..."
      label-style="font-size: 1.1em"
    />
  </q-card>
</template>

<style scoped>
.title-card {
  font-size: 1em;
}
.responsive-width {
  width: calc(100dvw - 35px);
}
</style>
