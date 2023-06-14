<script lang="ts">
import { ref, onMounted, inject } from 'vue';
import { RemindersDatum, SearchUser } from '../../../../types/index';
import { userStore } from 'src/modules/Users/store/UserStore';
import {
  getRecordsByValue,
  getUserAsInvitee,
} from 'src/services/MeetingsServices';
import { moduleKey, idModuleKey } from '../../../ProvideKeys';
import GuestsDialog from '../Dialogs/GuestsDialog.vue';
import CreateInviteeCard from './CreateInviteeCard.vue';
import InvitationItem from '../Lists/InvitationItem.vue';
import { useMeetingActivity } from 'src/composables/core';
import { useQuasar } from 'quasar';
import { getRecordModuleInfo } from 'src/services/GlobalService';
</script>
<script lang="ts" setup>
//* Provide Inject feature
const currentModule = ref(inject<string>(moduleKey));
const currentIdModule = ref(inject<string>(idModuleKey));
//* Provide Inject feature

const props = defineProps<{
  guests: SearchUser[];
  remindersData: RemindersDatum[];
}>();

//* variables
const addGuestDialog = ref(false);
const bodyMail = ref('');
const model = ref<SearchUser | null>(null);
const inputOptions = ref([] as SearchUser[]);
const isLoading = ref(false);
const guestsSelected = ref(props.guests ? props.guests : ([] as SearchUser[]));
const showSelectedList = ref(true);

const $q = useQuasar();

//* reference variables
const reminders = ref<RemindersDatum[]>(
  props.remindersData || ([] as RemindersDatum[])
);

//* composables variables
const { formatModuleName } = useMeetingActivity();

//* Store variables
const currentUser = userStore();

//* dummy data
// const reminderTimeOptions = [
//   {
//     label: '1 minuto antes',
//     value: '60',
//   },
//   {
//     label: '5 minutos antes',
//     value: '300',
//   },
//   {
//     label: '10 minutos antes',
//     value: '600',
//   },
//   {
//     label: '15 minutos antes',
//     value: '900',
//   },
//   {
//     label: '30 minutos antes',
//     value: '1800',
//   },
//   {
//     label: '1 hora antes',
//     value: '3600',
//   },
//   {
//     label: '2 horas antes',
//     value: '7200',
//   },
//   {
//     label: '3 horas antes',
//     value: '10800',
//   },
//   {
//     label: '5 horas antes',
//     value: '18000',
//   },
//   {
//     label: '1 dia antes',
//     value: '86400',
//   },
// ];

//* end dummy data

//* methods
const addNewGuest = (guest: SearchUser | null) => {
  if (!guest) return;
  const newGuest = {
    ...guest,
    whatsapp: '0',
    email: !!guest.email_address ? '1' : '0',
  };
  if (
    guestsSelected.value.some(
      (guestSelected) => guestSelected.id === newGuest.id
    )
  ) {
    $q.notify({
      type: 'warning',
      message: 'Usuario registrado',
      caption: 'El usuario ya existe en la reunion',
    });
    return;
  }
  guestsSelected.value.push(newGuest);
  model.value = null;
};

const assignProvided = async (): Promise<void> => {
  const validModules = ['Contacts', 'Prospects', 'Leads', 'Users'];
  if (
    !currentModule.value ||
    !currentIdModule.value ||
    !validModules.includes(currentModule.value)
  )
    return;
  const record = await getRecordModuleInfo(
    currentModule.value,
    currentIdModule.value
  );
  addNewGuest({
    id: record.id.toString(),
    fullname: record?.full_name?.toString() || '',
    email_address: record?.email1?.toString() || '',
    module: currentModule.value.toLowerCase(),
  });
};

const openAdvancedSearch = () => (addGuestDialog.value = true);

const deleteGuest = (id: string) => {
  guestsSelected.value = guestsSelected.value.filter(
    (guest) => guest.id !== id
  );
  removeInviteeFromReminders(id);
  showSelectedList.value = false;
  setTimeout(() => {
    showSelectedList.value = true;
  }, 2);
};

const removeInviteeFromReminders = (idGuest: string): void => {
  console.log('removing', idGuest);
  reminders.value = reminders.value.map((reminder) =>
    removeInviteeFromReminder(idGuest, reminder)
  );
};

const removeInviteeFromReminder = (
  idInvitee: string,
  reminder: RemindersDatum
): RemindersDatum => ({
  ...reminder,
  invitees: reminder.invitees.filter(
    (invitee) => invitee.module_id != idInvitee
  ),
});

const getGuestsIdByModule = (module: string) =>
  guestsSelected.value
    .filter((guest) => guest.module === module)
    .map((guest) => guest.id);

const exposeData = () => ({
  user_invitees: getGuestsIdByModule('users'),
  contact_invitees: getGuestsIdByModule('contacts'),
  lead_invitees: getGuestsIdByModule('leads'),
  prospect_invitees: getGuestsIdByModule('prospects'),
  //reminders_data: reminders.value,
  reminders_data: reminders.value.map((reminder) => ({
    ...reminder,
    invitees: reminder.invitees.map((invitee) => ({
      id: invitee.id,
      module: invitee.module.charAt(0).toUpperCase() + invitee.module.slice(1),
      module_id: invitee.module_id,
    })),
  })),
});

const addGuest = async (
  moduleId: string,
  module: string,
  replaceId?: string
) => {
  if (module === 'users') {
    const newGuest = await getUserAsInvitee(moduleId);
    addNewGuest(newGuest);
  }
  if (replaceId) deleteGuest(replaceId);
};

onMounted(async () => {
  if (props.guests.length === 0) {
    addNewGuest({
      id: currentUser.userCRM.id,
      fullname: `${currentUser.userCRM.nombres} ${currentUser.userCRM.apellidos}`,
      email_address: currentUser.userCRM.email,
      module: 'users',
    });
    await assignProvided();
  }
});

defineExpose({
  addGuest,
  exposeData,
});

const filterData = async (val: string, update: (cb: () => void) => void) => {
  if (!val) {
    isLoading.value = false;
    return;
  }
  try {
    isLoading.value = true;
    const data = await getRecordsByValue(val);
    update(() => {
      inputOptions.value = [...data];
    });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <q-card class="fill-available" flat>
    <q-card-section>
      <div class="row justify-between">
        <!-- <pre>{{ currentUser.userCRM }}</pre> -->
        <!-- <pre>{{ guests }}</pre> -->
        <!-- <pre>{{ currentModule || '??' }}</pre> -->
        <!-- <pre>{{ guestsSelected }}</pre> -->
        <q-select
          dense
          outlined
          v-model="model"
          use-input
          use-chips
          map-options
          no-option
          emit-value
          class="col-10"
          :loading="isLoading"
          option-label="fullname"
          :option-value="(val:SearchUser) => (val)"
          input-debounce="400"
          label="Nombre del participante"
          :options="inputOptions"
          @focus="isLoading = false"
          @filter="filterData"
          @keyup.enter="addNewGuest(model)"
          hint="ingrese el nombre"
        >
          <template #after>
            <q-btn
              color="primary"
              icon="add"
              @click="addNewGuest(model)"
              class="col-2"
            />
          </template>
          <template #loading>
            <div></div>
          </template>
          <template #before>
            <q-icon name="person" />
          </template>
          <template #option="slotProps">
            <q-item clickable v-bind="slotProps.itemProps">
              <q-item-section top avatar>
                <q-avatar color="primary" text-color="white" icon="person" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ slotProps.opt.fullname }}</q-item-label>
                <q-item-label caption lines="2"
                  >{{ formatModuleName(slotProps.opt.module) }}.</q-item-label
                >
              </q-item-section>
              <q-item-section side top>
                <q-item-label caption>{{
                  slotProps.opt.phone_mobile
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No se han encontrado resultados
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <div class="col-2">
          <q-btn
            class="fill-available"
            color="primary"
            icon="groups"
            @click="openAdvancedSearch()"
          >
            <q-tooltip> Búsqueda avanzada </q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-card-section>
    <q-separator inset />
    <q-card-section class="q-pa-none">
      <q-list class="rounded-borders">
        <q-item>
          <q-item-section>
            <q-item-label header class="q-px-none"
              >Todos los participantes</q-item-label
            >
          </q-item-section>
        </q-item>
        <div v-if="showSelectedList && guestsSelected.length > 0">
          <InvitationItem
            v-for="(item, index) in guestsSelected"
            :key="index"
            :id="item.id"
            :module="item.module"
            v-model:email="item.email"
            v-model:whatsapp="item.whatsapp"
            @delete="deleteGuest"
          />
        </div>
        <div v-else>
          <q-card flat>
            <q-card-section>
              <div class="text-grey-6">La reunion no tiene invitados</div>
            </q-card-section>
          </q-card>
        </div>
      </q-list>
    </q-card-section>
    <q-card-section>
      <div class="row q-mt-md">
        <q-input
          class="col-12"
          v-model="bodyMail"
          type="textarea"
          label="Mensaje del correo"
          dense
          outlined
        />
      </div>
    </q-card-section>

    <q-card-section>
      <q-list class="rounded-borders">
        <q-item>
          <q-item-section>
            <q-item-label header class="q-px-none"
              >Crear un participante</q-item-label
            >
          </q-item-section>
        </q-item>
        <q-expansion-item
          expand-separator
          icon="perm_contact_calendar"
          label="Añadir nuevo huésped"
        >
          <CreateInviteeCard @new-invitee="addNewGuest" />
        </q-expansion-item>
      </q-list>
      <q-separator inset />
    </q-card-section>
  </q-card>

  <GuestsDialog
    v-model="addGuestDialog"
    v-model:selected="guestsSelected"
    @delete-guest="removeInviteeFromReminders"
  />
</template>

<style lang="scss" scoped>
.fill-available {
  width: -webkit-fill-available;
}
.overlapping {
  border: 0px solid white;
  position: absolute;
  margin-left: 2rem;
}
.avatar-section {
  min-height: 6.5rem;
}
</style>
