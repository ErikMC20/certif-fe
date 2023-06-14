<script lang="ts" setup>
import { ref, inject, computed, Ref } from 'vue';
import {
  idActivityKey,
  moduleKey,
  idModuleKey,
} from 'src/components/Activities/ProvideKeys';
import InfoCard from '../Card/InfoCard.vue';
import ReadInfoCard from '../Card/ReadInfoCard.vue';
import InviteesCard from '../Card/InviteesCard.vue';
import AssignedSingleUser2 from 'src/components/AssignedUsers/AssignedSingleUser2.vue';
import AssignedUser from 'src/components/AssignedUsers/AssignedUser.vue';
import {
  InfoDataMeetingModel,
  RemindersDatum,
  DataResponse,
  SearchUser,
} from 'src/components/types/index';
import { getMeetingInfo } from 'src/services/MeetingsServices';
import { useAsyncState } from '@vueuse/core';
import ViewGeneralSkeleton from '../Skeletons/ViewGeneralSkeleton.vue';
import ReadInviteesCard from '../Card/ReadInviteesCard.vue';
import ViewCardVue from 'src/components/MainCard/ViewCard.vue';
import { useIdGenerator } from 'src/composables/General/generator';
import CommentsList from 'src/components/Comments/CommentsList.vue';

const props = withDefaults(defineProps<{ idActivity: string }>(), {
  idActivity: '',
});

const emits = defineEmits<{
  (
    event: 'submit',
    values: {
      attributes: InfoDataMeetingModel;
      reminders: {
        user_invitees: string[];
        contact_invitees: string[];
        lead_invitees: string[];
        prospect_invitees: string[];
        reminders_data: RemindersDatum[];
      };
    },
    id?: string,
    options?: { autoCloseDisabled?: boolean }
  ): void;
  (event: 'submitError', message: string, type: string): void;
}>();

//* Provide / Inject features
const idActivityInject = inject<Ref<string>>(idActivityKey);
const moduleInject = ref(inject<string>(moduleKey));
const idModuleInject = ref(inject<string>(idModuleKey));
//* End Provide / Inject features

const tab = ref('comentarios');
const commentCreate = ref('');
let prevAssignedUserId = '';

const infomeetInputRef = ref<InstanceType<typeof InfoCard> | null>(null);
const inviteesRef = ref<InstanceType<typeof InviteesCard> | null>(null);
const assignedSingleUserRef = ref<InstanceType<
  typeof AssignedSingleUser2
> | null>(null);
const assignedUserRef = ref<InstanceType<typeof AssignedUser> | null>(null);
const infoCardRef = ref<InstanceType<typeof ViewCardVue> | null>(null);
const inviteesCardRef = ref<InstanceType<typeof ViewCardVue> | null>(null);

const isSomeCardEditing = computed(() =>
  [
    infoCardRef.value?.isEditing === 'edit',
    inviteesCardRef.value?.isEditing === 'edit',
  ].some((value) => !!value)
);

const { generateLocalId } = useIdGenerator();

const validateCards = async (): Promise<boolean | undefined> => {
  if (infoCardRef.value?.isEditing === 'edit')
    return (
      await Promise.all([infomeetInputRef.value?.validateInputs()])
    ).every((val) => !!val);
  return true;
};

const saveMeet = async (
  newAssignedUserId?: string,
  prevAssignedUserId?: string
) => {
  const isValidData = await validateCards();
  if (!isValidData) {
    emits('submitError', 'Los datos no son validos', 'warning');
    return;
  }
  if (!props.idActivity) {
    const attributes = infomeetInputRef.value?.exposeData();
    if (!!attributes)
      attributes.assigned_user_id =
        assignedUserRef.value?.assignedUser.id || '';
    const reminders = inviteesRef.value?.exposeData();

    if (!!attributes && !!reminders) {
      const body = {
        attributes,
        reminders,
        attributes_comment: { description: commentCreate.value },
      };
      console.log(body);
      emits('submit', body);
    }
    return;
  } else {
    console.log('update');
    const attributes = infomeetInputRef.value?.exposeData();
    const reminders = inviteesRef.value?.exposeData();
    const updateBody = {
      attributes: attributes || state.value.meeting.attributes,
      reminders: reminders || {
        user_invitees: state.value.user_invitees.map((u) => u.id),
        contact_invitees: state.value.contact_invitees.map((c) => c.id),
        lead_invitees: state.value.lead_invitees.map((l) => l.id),
        prospect_invitees: state.value.prospect_invitees.map((p) => p.id),
        reminders_data: captureReminders(),
      },
    };

    if (newAssignedUserId) {
      updateBody.reminders.user_invitees.push(newAssignedUserId);
      updateBody.attributes.assigned_user_id = newAssignedUserId;
      // console.log('your prev assigned user id', prevAssignedUserId);
      if (prevAssignedUserId) {
        updateBody.reminders.user_invitees =
          updateBody.reminders.user_invitees.filter(
            (userId) => userId !== prevAssignedUserId
          );
      }
      emits('submit', updateBody, props.idActivity, {
        autoCloseDisabled: true,
      });
      return;
    }

    emits('submit', updateBody, props.idActivity);
    // if (!!attributes && !!reminders) {
    //   console.log('your attributes', attributes);
    //   const body = { attributes, reminders };

    //   emits('submit', body, props.idActivity);
    // }
  }
};

const captureInvitees = (): SearchUser[] => {
  const usersInvitees =
    state.value.user_invitees?.map((user) => {
      return {
        id: user.id,
        fullname: user.attributes.full_name,
        module: 'users',
        email_address: user.attributes.email1,
        phone: user.attributes.phone_work,
        email: '0',
        whatsapp: '0',
      };
    }) || [];

  const contactInvitees =
    state.value.contact_invitees?.map((contact) => ({
      id: contact.id,
      fullname: contact.attributes.full_name,
      module: 'contacts',
      email_address: contact.attributes.email1,
      phone: contact.attributes.phone_mobile,
      email: '0',
      whatsapp: '0',
    })) || [];

  const leadInvitees =
    state.value.lead_invitees?.map((lead) => ({
      id: lead.id,
      fullname: lead.attributes.full_name,
      module: 'leads',
      email_address: lead.attributes.email1,
      phone: lead.attributes.phone_mobile,
      email: '0',
      whatsapp: '0',
    })) || [];

  const prospectInvitees =
    state.value.prospect_invitees?.map((prospect) => ({
      id: prospect.id,
      fullname: prospect.attributes.full_name,
      module: 'prospects',
      email_address: prospect.attributes.email1,
      phone: prospect.attributes.phone_work,
      email: '0',
      whatsapp: '0',
    })) || [];

  return [
    ...usersInvitees,
    ...contactInvitees,
    ...leadInvitees,
    ...prospectInvitees,
  ];
};

const { state, isLoading, execute } = useAsyncState(async () => {
  return await getMeetingInfo(props.idActivity);
}, {} as DataResponse);

const captureReminders = (): RemindersDatum[] => {
  const format: RemindersDatum[] =
    state.value.reminders_data?.map((value) => {
      return {
        ...value,
        idx: generateLocalId(),
        email: Boolean(value.email),
        popup: Boolean(value.popup),
        invitees: value.invitees?.map((invitee) => ({
          ...invitee,
          module: invitee.module.toLowerCase(),
        })),
      };
    }) || ([] as RemindersDatum[]);
  return format;
};

const modifyGuests = async (newId: string, replaceId?: string) => {
  prevAssignedUserId = replaceId || '';
  await inviteesRef.value?.addGuest(newId, 'users', replaceId);
};

const onChangeUserAssigned = async (id: string) => {
  if (props.idActivity) await saveMeet(id, prevAssignedUserId);
};

defineExpose({
  isSomeCardEditing,
  saveMeet,
  execute,
});
</script>

<template>
  <ViewGeneralSkeleton v-if="isLoading" :id-activity="idActivity" />
  <div
    v-else
    :class="[$q.screen.gt.sm ? 'q-pa-md' : 'q-pa-none']"
    class="row q-col-gutter-sm"
  >
    <div class="col-12 col-sm-6 q-gutter-y-sm">
      <div class="row q-row-gutter-y">
        <!-- <pre>{{ idActivity }}</pre>
        <pre>{{ state }}</pre> -->
        <view-card-component
          class="full-width"
          ref="infoCardRef"
          :controls="!!idActivity"
          iconName="feed"
          :initial-status="!idActivity ? 'edit' : 'read'"
          title="Informacion de la reunión"
        >
          <template #edit>
            <InfoCard
              ref="infomeetInputRef"
              :data="state.meeting?.attributes"
              module="Leads"
              id-module=""
              @submit="saveMeet"
              name-module=""
            />
          </template>
          <template #read>
            <InfoCard
              ref="infomeetInputRef"
              :data="state.meeting?.attributes"
              module="Leads"
              id-module=""
              @submit="saveMeet"
              name-module=""
              readonly-fields
            />
            <!-- <ReadInfoCard :data="state.meeting?.attributes" /> -->
          </template>
        </view-card-component>
      </div>
      <div class="row">
        <view-card-component
          class="full-width"
          ref="inviteesCardRef"
          :controls="!!idActivity"
          iconName="group"
          :initial-status="!idActivity ? 'edit' : 'read'"
          title="Participantes"
        >
          <template #edit>
            <InviteesCard
              :guests="captureInvitees()"
              :reminders-data="captureReminders()"
              ref="inviteesRef"
            />
          </template>
          <template #read>
            <ReadInviteesCard
              :data="{
                user_invitees: state.user_invitees,
                contact_invitees: state.contact_invitees,
                lead_invitees: state.lead_invitees,
                prospect_invitees: state.prospect_invitees,
              }"
            />
          </template>
        </view-card-component>
      </div>
    </div>
    <div class="col-12 col-sm-6 q-gutter-y-sm">
      <div class="row">
        <div class="col">
          <!-- <AssignedSingleUser2
            ref="assignedSingleUserRef"
            :module="'leads'"
            :module-id="''"
            :withList="true"
            @changeUser="onChangeUserAssigned"
          /> -->
          <AssignedUser
            ref="assignedUserRef"
            type="single"
            module="Meetings"
            :module-id="idActivity"
            auto-update-disabled
            @selected-user="modifyGuests"
            @change-user="onChangeUserAssigned"
          />
        </div>
      </div>
      <div class="row">
        <q-card style="width: 100%; overflow-y: auto">
          <q-tabs
            class="q-ma-none"
            v-model="tab"
            indicator-color="primary"
            :inline-label="!$q.screen.xs"
            :active-color="$q.dark.isActive ? 'orange' : 'primary'"
            align="justify"
            :no-caps="$q.screen.xs ? true : false"
          >
            <q-tab name="comentarios" icon="comment" label="Comentarios" />
            <!-- <q-tab name="Relation" icon="people" label="Participantes" /> -->
          </q-tabs>
          <q-tab-panels v-model="tab" animated style="min-height: fit-content">
            <q-tab-panel
              name="comentarios"
              style="min-height: 59vh"
              class="q-py-sm"
            >
              <!-- <pre>{{idActivity}}</pre> -->
              <q-input
                v-if="!idActivity"
                autogrow
                outlined
                bottom-slots
                v-model="commentCreate"
                placeholder="Escriba su comentario inicial"
                dense
                color="primary"
                ref="commentRef"
              >
                <!-- <template v-slot:before>
                      <q-avatar>
                        <img :src="services.readImageUser" />
                      </q-avatar>
                    </template> -->
              </q-input>
              <CommentsList
                v-else
                :id="idActivity"
                descCRM3=""
                modulo="Meetings"
              />
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.full-width {
  width: -webkit-fill-available;
}
</style>
