<script lang="ts" setup>
import { ref, computed } from 'vue';
import { Draggable } from 'vue3-smooth-dnd';
import moment from 'moment';
import { useBusinesses } from '../../composables/Core';
import { OpportunitiesResponse } from '../../utils/types';
import { getRecordModuleInfo } from 'src/services/GlobalService';
import { userStore } from 'src/modules/Users/store/UserStore';

import DialogComponent from '../Dialog/DialogComponent.vue';
import ActivitiesComponent from 'src/components/Activities/ActivitiesComponent.vue';

interface Props {
  item: OpportunitiesResponse;
  color?: string;
}

interface Emits {
  (e: 'selectOpportunity', id: string): void;
  (e: 'selectAccount', id?: string): void;
  (e: 'selectContact', id?: string): void;
  (e: 'selectActivities', id: string): void;
  (
    e: 'selectActivity',
    id: string,
    activity: 'todas' | 'tarea' | 'llamada' | 'correo' | 'reunion' | 'notas',
    creationDate: string
  ): void;
  (e: 'deleteOpportunity', id: string, name: string): void;
  (e: 'markAsGained', id: string, name: string): void;
  (e: 'markAsLost', id: string, name: string): void;
  (e: 'duplicate', id: string, name: string): void;
  (e: 'createQuote', id: string): void;
  (e: 'moveTo', id: string, newPhase: string, lastPhase: string): void;
}
const props = withDefaults(defineProps<Props>(), { color: '#ffffff' });
const emits = defineEmits<Emits>();

const { currentColumns, formatAmount, formatDate } = useBusinesses();
const { userCRM } = userStore();

const confirm = ref(false);
const accountData = ref({
  accountName: '',
  accountMainPhone: '',
  accountOfficePhone: '',
  accountMail: '',
  loaded: false,
});
const isLoadingAccountData = ref(false);

const contactData = ref({
  contactName: '',
  contactMainPhone: '',
  contactOfficePhone: '',
  contactMail: '',
  loaded: false,
});
const isLoadingContactData = ref(false);

const lastActivity = computed(() => {
  return formatDate(props.item.last_completed_activity);
});

const nextActivity = computed(() => {
  return formatDate(props.item.next_activity);
});

const dateClosed = computed(() => {
  return formatDate(props.item.fechaCierre);
});

const dateClosedClass = computed(() => {
  return moment(props.item.fechaCierre).isBetween(moment(), moment().add(1, 'month'))
    ? 'text-warning'
    : moment(props.item.fechaCierre).isBefore(moment())
    ? 'text-negative'
    : '';
});

const defineNextActivityState = () => {
  if (!props.item.next_activity) return 'activity-info-void';
  const isDateValid = moment(props.item.next_activity).isValid();
  if (isDateValid) {
    const date = moment(props.item.next_activity);
    if (date.isBefore(moment())) {
      return 'activity-info-outdated';
    } else if (date.isBetween(moment().subtract(1, 'month'), moment().add(1, 'day'))) {
      return 'activity-info-warn';
    }
  }
  return 'activity-info';
};

const loadAccountData = async () => {
  if (props.item.account_id && !accountData.value.loaded) {
    isLoadingAccountData.value = true;
    const response = await getRecordModuleInfo('Accounts', props.item.account_id, {
      allData: false,
      fields: ['name', 'celular_c', 'phone_office', 'email1'],
    });
    isLoadingAccountData.value = false;
    accountData.value = {
      accountName: response.name.toString(),
      accountMainPhone: response.celular_c.toString(),
      accountOfficePhone: response.phone_office.toString(),
      accountMail: response.email1.toString(),
      loaded: true,
    };
  }
};

const loadContactData = async () => {
  if (props.item.contact_id && !contactData.value.loaded) {
    isLoadingContactData.value = true;
    const response = await getRecordModuleInfo('Contacts', props.item.contact_id, {
      allData: false,
      fields: ['name', 'phone_mobile', 'phone_work', 'email1'],
    });
    isLoadingContactData.value = false;
    contactData.value = {
      contactName: response.name.toString(),
      contactMainPhone: response.phone_mobile.toString(),
      contactOfficePhone: response.phone_work.toString(),
      contactMail: response.email1.toString(),
      loaded: true,
    };
  }
};
</script>

<template>
  <Draggable v-if="item">
    <q-card class="kanban-card shadow-1 row q-pa-none">
      <q-menu touch-position context-menu>
        <q-list>
          <q-item> Mover a: </q-item>
          <q-item
            v-for="(n, index) in currentColumns.filter(
              (col) => col.value !== props.item.faseDeVenta
            )"
            :key="index"
            @click="emits('moveTo', props.item.id, props.item.faseDeVenta, `${n.value}`)"
            dense
            clickable
            v-close-popup
          >
            <q-item-section>{{ n.label }}</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
      <q-card-section class="kanban-info col-9 q-px-md q-pr-none column justify-between">
        <div class="column q-gutter-y-sm q-pb-md">
          <div
            class="text-weight-bold"
            :class="[
              !!props.item.nombre ? 'kanban-info-value' : 'kanban-info-value-disabled',
            ]"
            @click="emits('selectOpportunity', props.item.id)"
          >
            <q-icon name="business" class="q-mr-xs" />{{ props.item.nombre }}
          </div>
          <div
            :class="[
              !!props.item.cuenta?.trim()
                ? 'kanban-info-value'
                : 'kanban-info-value-disabled',
            ]"
            @click="() => emits('selectAccount', props.item.account_id)"
          >
            <q-icon name="account_circle" class="q-mr-xs" />{{
              props.item.cuenta?.trim() || "Sin cuenta"
            }}
            <q-tooltip @show="() => loadAccountData()" v-if="!!item.account_id">
              <div v-if="isLoadingAccountData">Cargando...</div>
              <div v-else>
                {{ `Telefono: ${accountData.accountMainPhone || "Sin teléfono"}` }}
                <br />
                {{
                  `Teléfono oficina: ${accountData.accountOfficePhone || "Sin teléfono"}`
                }}
                <br />
                {{ `Correo: ${accountData.accountMail || "Sin correo"}` }}
              </div>
            </q-tooltip>
          </div>
          <div
            :class="[
              !!props.item.contact_name.trim()
                ? 'kanban-info-value'
                : 'kanban-info-value-disabled',
            ]"
            @click="emits('selectContact', item.contact_id)"
          >
            <q-icon name="contact_phone" class="q-mr-xs" />{{
              props.item.contact_name.trim() || "Sin Contacto"
            }}
            <q-tooltip @show="() => loadContactData()" v-if="!!item.contact_id">
              <div v-if="isLoadingContactData">Cargando...</div>
              <div v-else>
                {{ `Telefono: ${contactData.contactMainPhone || "Sin teléfono"}` }}
                <br />
                {{
                  `Teléfono oficina: ${contactData.contactOfficePhone || "Sin teléfono"}`
                }}
                <br />
                {{ `Correo: ${contactData.contactMail || "Sin correo"}` }}
              </div>
            </q-tooltip>
          </div>
          <div class="row justify-between">
            <div
              :class="[
                !!props.item.fechaCierre.trim() ? '' : 'kanban-info-value-disabled',
              ]"
            >
              <q-icon name="calendar_month" class="q-mr-xs" />
              <span :class="[dateClosedClass]">
                {{ dateClosed }}
              </span>
            </div>
            <span class="text-weight-bold">{{ formatAmount(props.item.monto) }}</span>
          </div>
        </div>
        <div class="kanban-activity-dates row justify-between items-center">
          <q-icon name="person"
            ><q-tooltip>
              <span v-if="!item.responsable"> Sin Responsable </span>
              <span v-else> Responsable: {{ item.responsable }} </span>
            </q-tooltip></q-icon
          >
          <div
            class="activity-info column"
            :class="[
              !!props.item.last_completed_activity
                ? 'activity-info'
                : 'activity-info-void',
            ]"
          >
            <span>Última actividad</span>
            <span>{{ lastActivity }}</span>
          </div>
          <div class="column" :class="defineNextActivityState()">
            <span>Próxima actividad</span>
            <span>{{ nextActivity }}</span>
          </div>
        </div>
      </q-card-section>
      <q-card-section
        class="kanban-completed-activities col-3 q-px-xs column justify-between content-end q-pa-xs"
      >
        <q-btn color="primary" class="q-pa-none" icon="more_vert" size="xs" flat>
          <q-menu>
            <q-list dense style="min-width: 100px">
              <q-item
                @click="emits('selectOpportunity', props.item.id)"
                clickable
                v-close-popup
              >
                <q-item-section>
                  <div>
                    <q-icon name="info" color="primary" />
                    Ver Detalle
                  </div>
                </q-item-section>
              </q-item>
              <q-item
                @click="emits('deleteOpportunity', props.item.id, props.item.nombre)"
                clickable
                v-close-popup
              >
                <q-item-section
                  ><div>
                    <q-icon name="delete" color="primary" />
                    Eliminar
                  </div></q-item-section
                >
              </q-item>
              <q-item
                @click="emits('markAsGained', props.item.id, props.item.nombre)"
                clickable
                v-close-popup
              >
                <q-item-section
                  ><div>
                    <q-icon name="done" color="primary" />
                    Marcar como ganado
                  </div></q-item-section
                >
              </q-item>
              <q-item
                @click="emits('markAsLost', props.item.id, props.item.nombre)"
                clickable
                v-close-popup
              >
                <q-item-section
                  ><div>
                    <q-icon name="money_off" color="primary" />
                    Marcar como perdido
                  </div></q-item-section
                >
              </q-item>
              <!-- <q-item
                @click="emits('duplicate', props.item.id, props.item.nombre)"
                clickable
                v-close-popup
              >
                <q-item-section
                  ><div>
                    <q-icon name="content_copy" color="primary" />
                    Duplicar
                  </div></q-item-section
                >
              </q-item> -->
              <q-item
                @click="emits('createQuote', props.item.id)"
                clickable
                v-close-popup
              >
                <q-item-section
                  ><div>
                    <q-icon name="request_quote" color="primary" />
                    Crear cotización
                  </div></q-item-section
                >
              </q-item>
              <q-item
                @click="
                  $emit(
                    'selectActivity',
                    props.item.id,
                    'todas',
                    props.item.creation_date
                  )
                "
                clickable
                v-close-popup
              >
                <q-item-section
                  ><div>
                    <q-icon name="fact_check" color="primary" />
                    Ver actividades
                  </div></q-item-section
                >
              </q-item>
              <q-item clickable>
                <q-item-section
                  ><div>
                    <q-icon name="trending_flat" color="primary" />
                    Mover a
                  </div></q-item-section
                >
                <q-item-section side>
                  <q-icon name="keyboard_arrow_right" />
                </q-item-section>
                <q-menu anchor="top end" self="top start">
                  <q-list>
                    <q-item
                      v-for="(n, index) in currentColumns.filter(
                        (col) => col.value !== props.item.faseDeVenta
                      )"
                      :key="index"
                      @click="
                        emits(
                          'moveTo',
                          props.item.id,
                          props.item.faseDeVenta,
                          `${n.value}`
                        )
                      "
                      dense
                      clickable
                      v-close-popup
                    >
                      <q-item-section>{{ n.label }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-item>
              <!-- <q-item clickable v-close-popup>
                <q-item-section>New</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable>
                <q-item-section>Preferences</q-item-section>
                <q-item-section side>
                  <q-icon name="keyboard_arrow_right" />
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section>Quit</q-item-section>
              </q-item> -->
            </q-list>
          </q-menu></q-btn
        >
        <q-btn
          flat
          color="grey-7"
          size="sm"
          @click="
            $emit('selectActivity', props.item.id, 'reunion', props.item.creation_date)
          "
          ><div>
            <q-icon
              name="alarm"
              :color="props.item.all_meetings !== props.item.Meetings ? 'orange' : ''"
            />
            <span class="completed-activities">
              {{ props.item.Meetings }}
            </span>
          </div>
          <q-tooltip
            >Completadas: {{ props.item.Meetings }} <br />Sin completar:
            {{ props.item.all_meetings - props.item.Meetings }}</q-tooltip
          >
        </q-btn>
        <q-btn
          flat
          color="grey-7"
          size="sm"
          @click="
            $emit('selectActivity', props.item.id, 'llamada', props.item.creation_date)
          "
          ><div>
            <q-icon
              name="call"
              :color="props.item.all_calls !== props.item.Calls ? 'orange' : ''"
            />
            <span class="completed-activities">
              {{ props.item.Calls }}
            </span>
          </div>
          <q-tooltip
            >Completadas: {{ props.item.Calls }} <br />Sin completar:
            {{ props.item.all_calls - props.item.Calls }}</q-tooltip
          >
        </q-btn>
        <q-btn
          flat
          color="grey-7"
          size="sm"
          @click="
            $emit('selectActivity', props.item.id, 'tarea', props.item.creation_date)
          "
          ><div>
            <q-icon
              name="task"
              :color="props.item.all_tasks !== props.item.Tasks ? 'orange' : ''"
            />
            <span class="completed-activities">
              {{ props.item.Tasks }}
            </span>
          </div>
          <q-tooltip
            >Completadas: {{ props.item.Tasks }} <br />Sin completar:
            {{ props.item.all_tasks - props.item.Tasks }}</q-tooltip
          >
        </q-btn>
        <q-btn
          flat
          color="grey-7"
          size="sm"
          @click="
            $emit('selectActivity', props.item.id, 'correo', props.item.creation_date)
          "
          ><div>
            <q-icon
              name="email"
              :color="props.item.all_emails !== props.item.emails ? 'orange' : ''"
            ></q-icon>
            <span class="completed-activities">
              {{ props.item.emails }}
            </span>
          </div>
          <q-tooltip
            >Completadas: {{ props.item.emails }} <br />Sin completar:
            {{ props.item.all_emails - props.item.emails }}</q-tooltip
          >
        </q-btn>
      </q-card-section>
    </q-card>
    <q-inner-loading :showing="item.loading">
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
    <DialogComponent title="Actividades de la oportunidad" v-model="confirm">
      <template #body>
        <ActivitiesComponent
          :id="props.item.id"
          :id-user="userCRM.id"
          module="Opportunities"
          :emails="[]"
          :nameReg="''"
          :from-date="moment(item.creation_date).format('DD/MM/YYYY')"
          :to-date="moment().endOf('month').format('DD/MM/YYYY')"
        >
        </ActivitiesComponent>
      </template>
      <!-- <template #footer>
        <div class="row justify-center q-gutter-sm">
          <q-btn color="primary" icon="send" label="Confirmar" />
          <q-btn
            color="negative"
            icon="cancel"
            label="cancelar"
            v-close-popup
          />
        </div>
      </template> -->
    </DialogComponent>
  </Draggable>
</template>

<style lang="scss" scoped>
$item-disabled: #9e9e9e;
.q-dialog__inner--minimized {
  padding: 0px;
}

/* ===== Scrollbar CSS ===== */
/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #008cb3 #ffffff;
}

/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
  width: 12px;
}

*::-webkit-scrollbar-track {
  background: #ffffff;
}

*::-webkit-scrollbar-thumb {
  background-color: #0006b3;
  border-radius: 10px;
  border: 3px solid #ffffff;
}

.activity-info {
  font-weight: bold;
  border-radius: 5px;
  color: #054500;
  background-color: #d1fadf;
  padding: 4px;
}

.activity-info-void {
  font-weight: bold;
  border-radius: 5px;
  color: #4c4c4c;
  background-color: #ededed;
  padding: 4px;
}

.activity-info-warn {
  font-weight: bold;
  border-radius: 5px;
  color: #8f7500;
  background-color: #fff693;
  padding: 4px;
}

.activity-info-outdated {
  font-weight: bold;
  border-radius: 5px;
  color: #8f001d;
  background-color: #ffa9b1;
  padding: 4px;
}

.kanban-card {
  .kanban-info {
    font-size: 0.75rem;
    color: #171717;
    padding: 8px;
    i {
      font-size: 1rem;
      color: #4e4e4e;
    }
  }
  .kanban-info-value {
    cursor: pointer;
  }
  .kanban-info-value-disabled {
    color: $item-disabled;
    i {
      color: $item-disabled;
    }
  }
  .kanban-activity-dates {
    font-size: 0.55rem;
  }
  .kanban-completed-activities {
    i {
      font-size: 1rem;
      margin-right: 0.2rem;
    }
    .completed-activities {
      padding-top: rem;
      font-size: 0.85rem;
      color: #171717;
    }
  }
}
</style>
