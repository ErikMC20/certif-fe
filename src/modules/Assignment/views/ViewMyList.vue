<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getProjectByUser } from '../services/useAssignmentService';
import AssignmentDialogMobile from '../components/Dialogs/AssignmentDialogMobile.vue';
import { userStore } from '../../Users/store/UserStore';
const list = ref([]);

const user = userStore();

const assignmentDialogRef = ref<InstanceType<
  typeof AssignmentDialogMobile
> | null>(null);

const props = withDefaults(
  defineProps<{
    idUser?: string;
  }>(),
  {}
);

const openItemSelected = (id: string, title: string) => {
  assignmentDialogRef.value?.openDialogTab(id, title);
};

onMounted(async () => {
  list.value = await getProjectByUser(props.idUser ?? '');
});

const constructorComp = (idUser?: string) => {
  if (idUser) {
    user.insertUser(idUser);
  } else {
    user.insertUser('');
  }
};

(() => {
  constructorComp(props.idUser);
})();
</script>
<template>
  <div class="bg-white q-pa-md" style="height: 100%">
    <q-virtual-scroll
      style="max-height: calc(100dvh - 150px)"
      :items="list"
      separator
      v-slot="{ item, index }"
    >
      <q-item
        clickable
        v-ripple
        @click="openItemSelected(item.id, item.name)"
        :key="index"
      >
        <q-item-section top avatar>
          <!-- <q-circular-progress
            show-value
            font-size="10px"
            :value="item.salud"
            size="60px"
            :thickness="0.15"
            color="teal"
            track-color="grey-3"
            class="q-my-sm"
            rounded
          >
            {{ item.salud }}%
          </q-circular-progress> -->
          <small>Pendiente</small>
          <q-avatar
            size="45px"
            font-size="20px"
            color="white"
            text-color="dark"
            class="shadow-1"
          >
            {{ item.total }}
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h7">
            {{ item.name }}
          </q-item-label>
          <q-item-label> </q-item-label>
          <q-item-label caption lines="2">
            <small>Fecha inicio: {{ item.fecha_inicio }} </small>
            <br />
            <small>Fecha fin: {{ item.fecha_fin }} </small>
          </q-item-label>
        </q-item-section>
        <q-item-section side> </q-item-section>
        <q-item-section side class="q-px-none">
          <q-icon name="arrow_forward_ios" size="20px" />
        </q-item-section>
      </q-item>
    </q-virtual-scroll>
  </div>
  <AssignmentDialogMobile ref="assignmentDialogRef" />
</template>
<style scoped></style>
