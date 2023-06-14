<script setup lang="ts">
import { UserDetails } from './UserDetailedModels';

import UserState from '../UserState/UserState.vue';

defineProps<{ userDetails: UserDetails }>();
defineEmits(['deleteUser']);
</script>
<template>
  <q-card class="q-pa-md">
    <div class="row q-gutter-xs justify-between items-center text-caption">
      <div>
        <q-avatar size="40px" font-size="20px" color="teal" text-color="white">
          <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
        </q-avatar>
      </div>
      <div class="column">
        <div class="text-blue-9">{{ userDetails.name }}</div>
        <div>{{ userDetails.marketArea }}</div>
        <div>{{ userDetails.occupation }}</div>
      </div>
      <div class="column">
        <UserState :user-state="userDetails.userState" />
      </div>
      <div class="column">
        {{ userDetails.principal ? 'Principal' : 'Secundario' }}
      </div>
      <div class="column">
        <q-btn
          color="negative"
          size="sm"
          round
          icon="remove"
          @click="$emit('deleteUser', userDetails.id)"
        />
      </div>
    </div>
  </q-card>
</template>
