<script setup lang="ts">
import { getListUsers } from 'src/services/AssignedUserService';
import { userStore as useUserStore } from 'src/modules/Users/store/UserStore';
import { ReponsibleUserModel } from '../../utils/types';
import { useResponsiblesRoles } from 'src/composables/useLanguaje';

//props
const props = defineProps<{
  id: string;
}>();

//var
const isEditing = ref(false);
const search = ref('');
const CRM3 = HANSACRM3_URL;
const userStore = useUserStore();

// function
const startEditing = () => {
  console.log('');
};

const { getlistResponsiblesRoles, listResponsiblesRoles } =
  useResponsiblesRoles();

//vueuse
const { state } = useAsyncState(async () => {
  await getlistResponsiblesRoles();
  return await getListUsers(
    userStore.userCRM.iddivision,
    userStore.userCRM.idamercado
  );
}, [] as any);

//computed
const listFiltered = computed(() => {
  return state.value.filter(
    (el: ReponsibleUserModel) =>
      el.user_name.toLowerCase().indexOf(search.value.toLowerCase()) !== -1
  );
});
</script>

<template>
  <div>
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
          </div>
          <div class="text-h7 q-mt-none q-mb-xs">Juan Daniel Rafael Torrez</div>
          <div class="text-caption text-grey-6">Cargo: Desarrollador</div>
          <div class="text-caption text-grey-6">
            Division: 03 Automotriz | Area:
            {{ 'Sin área de mercado' }}
          </div>
        </q-card-section>
      </q-card-section>

      <q-separator />

      <q-card-actions class="q-pt-xs justify-between">
        <div>
          <!-- <q-btn icon="person" flat> Asignarme a mi </q-btn> -->
          <q-btn flat>
            <q-icon
              name="search"
              size="xs"
              class="q-mr-xs"
              @click="startEditing()"
            />
            Buscar y seleccionar
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
      <q-card-section v-if="isEditing">
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
            style="z-index: 1; width: 95%"
            v-if="listFiltered?.length > 0"
          >
            <q-list
              bordered
              separator
              style="max-height: 350px"
              class="shadow-1 scroll"
              :class="$q.dark.isActive ? 'bg-primary' : 'bg-white'"
            >
              <q-item
                v-for="(item, index) in listFiltered"
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
                    <img :src="`${CRM3}${item.avatar}`" />
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
      <!-- <q-inner-loading
        :showing="isLoadingProcess"
        label="Cargando datos..."
        label-class="text-primary"
        label-style="font-size: 1.1em"
      /> -->
    </q-card>
  </div>
</template>

<style scoped></style>
