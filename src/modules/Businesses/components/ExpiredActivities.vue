<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import moment from 'moment';

import { useQuasar } from 'quasar';

import CallsActivitieDialog from 'src/components/Activities/Dialogs/CallsActivitieDialog.vue';
import EmailsActivitieDialog from 'src/components/Activities/Dialogs/EmailActivitieDialog/Card/InfoCardEmails.vue';
import MeetsActivitieDialog from 'src/components/Activities/Dialogs/MeetActivitieDialog.vue';
import TasksActivitieDialog from 'src/components/Activities/Dialogs/TaskActivityDialog/Card/InfoCard.vue';
import { ExpiredActivitiesResponse } from '../utils/types';
import { ModuleActivity } from '../../../components/types/index';
import { useBusinesses } from '../composables/Core/useBusinesses/index';

interface Props {
  icon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'call',
});

const $q = useQuasar();
const {
  isExpiredActivitiesLoading,
  validExpiredActivities,
  loadExpiredActivities,
  openOpportunityInCRM3,
} = useBusinesses();

const selectedActivity = ref({
  id: '',
  module: 'Opportunities',
  module_id: '',
  name: '',
});

const emailDialog = ref<InstanceType<typeof EmailsActivitieDialog> | null>(
  null
);
const callDialog = ref<InstanceType<typeof CallsActivitieDialog> | null>(null);
const taskDialog = ref<InstanceType<typeof TasksActivitieDialog> | null>(null);
const meetDialog = ref<InstanceType<typeof MeetsActivitieDialog> | null>(null);

const formSaved = () => {
  console.log('your form is saved');
};

const formatDate = (date: string) => {
  return moment(date).format('DD/MM/YYYY HH:MM');
};

const formatIcon = (type = 'event') => {
  switch (type) {
    case 'tasks':
      return 'task';
    case 'meetings':
      return 'groups';
    case 'calls':
      return 'call';
    case 'mails':
      return 'mail';
    default:
      return type;
  }
};

const openDialog = (activity: ExpiredActivitiesResponse) => {
  $q.notify({ message: activity.task_type });
  selectedActivity.value.name = activity.name;
  selectedActivity.value.id = activity.id;
  selectedActivity.value.module_id = activity.opp_id;
  switch (activity.task_type) {
    case 'meetings':
      meetDialog.value?.openDialog(
        activity.id,
        selectedActivity.value.module as ModuleActivity,
        selectedActivity.value.module_id
      );

      break;
    case 'tasks':
      if (!!taskDialog.value) taskDialog.value.open = true;
      break;
    case 'calls':
      if (!!callDialog.value) callDialog.value.open = true;
    case 'emails':
      if (!!emailDialog.value) emailDialog.value.open = true;
    default:
      break;
  }
};

const getNameFormatted = (name: string) => {
  switch (name) {
    case 'meetings':
      return 'Reunión';
    case 'tasks':
      return 'Tarea';
    case 'calls':
      return 'Llamada';
    case 'emails':
      return 'Correo';
    default:
      return 'sin especificar';
  }
};

onMounted(async () => {
  await loadExpiredActivities();
});
</script>
<template>
  <div class="q-mb-sm">
    <span class="text-h6"
      >Mostrando {{ validExpiredActivities.length }} actividades</span
    >
  </div>
  <q-list v-if="isExpiredActivitiesLoading" bordered>
    <q-item>
      <div class="q-pa-md">
        <div class="q-gutter-y-md">
          <q-skeleton bordered type="circle" />
          <q-skeleton bordered />
          <q-skeleton bordered square />
        </div>
      </div>
    </q-item>
  </q-list>
  <q-list v-else dense>
    <q-item
      v-for="(activity, index) in validExpiredActivities.sort(
        (a, b) => moment(b.end_date).unix() - moment(a.end_date).unix()
      )"
      :key="index"
      clickable
      v-ripple
      class="activity-item shadow-1"
      @click="openDialog(activity)"
    >
      <q-item-section avatar>
        <q-avatar
          size="md"
          color="primary"
          text-color="white"
          :icon="formatIcon(activity.task_type)"
        />
      </q-item-section>
      <q-item-section>
        <div class="col">
          <div class="col-12">
            <div class="row justify-between">
              <q-chip
                size="sm"
                class="q-mx-none"
                color="primary"
                square
                text-color="white"
                dense
              >
                {{ getNameFormatted(activity.task_type) }}
              </q-chip>
              <span class="text-negative q-mt-xs">{{
                !!activity.start_date
                  ? formatDate(activity.start_date)
                  : 'Sin fecha'
              }}</span>
            </div>
          </div>
          <div class="text-primary">{{ activity.name }}</div>
          <div class="q-mb-sm">
            <span
              :class="[!activity.description ? 'text-blue-grey-8' : '']"
              >{{ activity.description || 'Sin descripción' }}</span
            >
          </div>
          <q-btn
            :label="activity.opp_name"
            @click.stop="openOpportunityInCRM3(activity.opp_id)"
            class="q-px-xs q-py-none"
            color="primary"
            flat
            size="md  "
          >
            <q-tooltip> Oportunidad </q-tooltip>
          </q-btn>
        </div>
      </q-item-section>
    </q-item>
  </q-list>
  <!-- <pre>{{ selectedActivity }}</pre> -->
  <EmailsActivitieDialog
    ref="emailDialog"
    :id-activity="selectedActivity.id"
    :asunto="selectedActivity.name"
  />
  <MeetsActivitieDialog
    ref="meetDialog"
    :module-id="selectedActivity.module_id"
    @saved="formSaved"
    module="Opportunities"
  />
  <CallsActivitieDialog
    ref="callDialog"
    :idModule="selectedActivity.module_id"
    :ModuleType="selectedActivity.module"
    @form-saved="formSaved"
  />

  <TasksActivitieDialog
    ref="taskDialog"
    :asunto="selectedActivity.name"
    :idActivity="selectedActivity.id"
    :idModule="selectedActivity.module_id"
    @form-saved="formSaved"
    :module="selectedActivity.module"
  />
</template>

<style lang="scss">
.activity-item {
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  margin-bottom: 8px;
  background: white;
}
</style>
