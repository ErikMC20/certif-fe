<script setup lang="ts">
import { computed } from 'vue';
import {
  UserInviteeResponse,
  ContactInviteeResponse,
  LeadInviteeResponse,
  ProspectInviteeResponse,
} from '../../../../types/index';
import { useMeetingActivity } from 'src/composables/core';
import moment from 'moment';

const props = defineProps<{
  data?: {
    user_invitees: UserInviteeResponse[];
    contact_invitees: ContactInviteeResponse[];
    lead_invitees: LeadInviteeResponse[];
    prospect_invitees: ProspectInviteeResponse[];
  };
}>();

const { formatModuleName } = useMeetingActivity();

const invitees = computed(() => {
  const usersInvitees =
    props.data?.user_invitees.map((user) => {
      return {
        name: user.attributes.full_name,
        module: 'users',
      };
    }) || [];

  const contactInvitees =
    props.data?.contact_invitees.map((contact) => ({
      name: contact.attributes.full_name,
      module: 'contacts',
    })) || [];

  const leadInvitees =
    props.data?.lead_invitees.map((lead) => ({
      name: lead.attributes.full_name,
      module: 'leads',
    })) || [];

  const prospectInvitees =
    props.data?.prospect_invitees.map((prospect) => ({
      name: prospect.attributes.full_name,
      module: 'prospects',
    })) || [];

  return [
    ...usersInvitees,
    ...contactInvitees,
    ...leadInvitees,
    ...prospectInvitees,
  ];
});
</script>
<template>
  <q-list v-if="invitees.length > 0" bordered>
    <div v-for="(item, index) in invitees" :key="index">
      <q-item>
        <q-item-section top avatar>
          <q-avatar color="primary" text-color="white" icon="person"></q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ item.name }}</q-item-label>
          <q-item-label caption>Invitado a la reunion</q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-badge :label="formatModuleName(item.module)" />
        </q-item-section>
      </q-item>
      <q-separator spaced inset />
    </div>
  </q-list>
  <div v-else>
    <q-card flat>
      <q-card-section>
        <div class="text-grey-6">La reunion no tiene invitados</div>
      </q-card-section>
    </q-card>
  </div>
  <!-- <div class="q-py-md">
    <div class="row q-col-gutter-sm">
      <div
        class="col-12 col-sm-4 col-md-6"
        v-for="n in invitees"
        :key="`sm-${n}`"
      >
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ n.name }}</div>
            <div class="text-subtitle2">{{ n.module }}</div>
          </q-card-section>
          <q-card-section> Usuario invitado </q-card-section>
        </q-card>
      </div>
    </div>
  </div> -->
</template>

<style lang="sass" scoped>
.my-content
  padding: 10px 15px
  background: rgba(86,61,124,.15)
  border: 1px solid rgba(86,61,124,.2)
</style>
