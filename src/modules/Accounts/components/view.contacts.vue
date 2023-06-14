<template>
  <q-card
    class="no-border-radius"
    v-if="ActiveSqeleton"
    style="min-height: 80vh"
  >
    <q-card-section>
      <div class="row col-12 justify-between q-px-sm">
        <div class="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-xs-12 q-mb-sm">
          <q-input
            bottom-slots
            dense
            v-model="filter"
            placeholder="Buscar por nombre, ci y correo"
          >
            <template v-slot:hint>
              <span class="text-primary"
                >{{
                  filterdocRelation.length == 1
                    ? filterdocRelation.length + ' Contacto encontrado'
                    : filterdocRelation.length + ' Contactos encontrados'
                }}
              </span>
            </template>
            <template v-slot:append>
              <q-icon name="search" v-if="!filter" />
              <q-icon
                name="clear"
                v-else
                @click="filter = ''"
                class="cursor-pointer"
              />
            </template>
          </q-input>
        </div>
        <div class="col-xl-4 col-lg-6 col-md-7 col-sm-12 col-xs-12 q-mb-sm">
          <div class="row justify-end q-gutter-sm">
            <slot name="buttons">
              <q-btn
                :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'"
                color="primary"
                label="Nuevo Contacto"
                @click="showContact('')"
                size="md"
              />
              <q-btn
                :class="!$q.screen.xs ? 'q-ms-md' : 'full-width'"
                color="primary"
                @click="openDialogFilter"
                label="buscar y agregar"
                size="md"
              />
              <!-- <q-btn color="primary" icon="add" class="mobile-only" /> -->
            </slot>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-md-3 q-pa-sm">
        <template v-if="filterdocRelation.length > 0">
          <q-list bordered class="rounded-borders">
            <template v-for="(row, index) in filterdocRelation" :key="index">
              <q-item clickable @click="showContact(row.id)">
                <q-item-section avatar>
                  <q-avatar
                    color="blue"
                    text-color="white"
                    icon="person"
                    @click="showAccount(row.id)"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label
                    lines="1"
                    class="text-primary text-weight-bold text-capitalize"
                    >{{ row.saludo }} {{ row.nombre }}</q-item-label
                  >
                  <q-item-label caption lines="2">
                    <q-icon name="credit_card" class="q-pr-xs text-orange" />
                    <span class="text-weight-regular text-primary">CI:</span>
                    <span class="text-black q-pl-xs"> {{ row.ci }}</span>
                  </q-item-label>
                  <q-item-label
                    caption
                    lines="3"
                    v-show="!$q.screen.xs ? false : true"
                  >
                    <q-icon name="groups" class="q-pr-xs text-orange" />
                    <span class="text-weight-regular text-primary">Cargo:</span>
                    <span class="text-black q-pl-xs"> {{ row.cargo }}</span>
                  </q-item-label>
                  <q-item-label caption lines="2">
                    <q-icon name="email" class="q-pr-xs text-orange" />
                    <span class="text-weight-regular text-primary"
                      >Correo:</span
                    >
                    <span class="text-black q-pl-xs"> {{ row.correo }}</span>
                  </q-item-label>
                  <q-item-label
                    caption
                    lines="2"
                    v-show="!$q.screen.xs ? false : true"
                  >
                    <q-icon name="person" class="q-pr-xs text-orange" /><span
                      class="text-weight-regular text-primary"
                      >Genero:</span
                    >
                    <span class="text-black q-pl-xs"> {{ row.genero }}</span>
                  </q-item-label>
                  <q-item-label
                    caption
                    lines="2"
                    v-show="!$q.screen.xs ? false : true"
                  >
                    <q-chip color="primary" size="xs" class="text-white glossy">
                      Principal
                    </q-chip>
                  </q-item-label>
                </q-item-section>
                <q-item-section v-show="$q.screen.xs ? false : true">
                  <q-item-label caption lines="3">
                    <q-icon name="event" class="q-pr-xs text-orange" /><span
                      class="text-weight-regular text-primary"
                      >Fecha Nac.:</span
                    >
                    <span class="text-black q-pl-xs">
                      {{ row.cumpleanios }}</span
                    >
                  </q-item-label>
                  <q-item-label caption lines="3">
                    <q-icon name="call" class="text-orange" />
                    <span class="text-weight-regular text-primary"
                      >Telefono:</span
                    >
                    <span class="text-black q-pl-xs"> {{ row.telefono }}</span>
                  </q-item-label>
                  <q-item-label caption lines="3">
                    <q-icon name="groups" class="q-pr-xs text-orange" />
                    <span class="text-weight-regular text-primary">Cargo:</span>
                    <span class="text-black q-pl-xs"> {{ row.cargo }}</span>
                  </q-item-label>
                </q-item-section>
                <q-item-section v-show="$q.screen.xs ? false : true">
                  <q-item-label caption lines="1">
                    <q-icon name="flag" class="text-orange" />
                    <span class="text-weight-regular text-primary">Pais:</span>
                    <span class="text-black q-pl-xs"> {{ row.pais }}</span>
                  </q-item-label>
                  <q-item-label caption lines="2">
                    <q-icon name="person" class="q-pr-xs text-orange" /><span
                      class="text-weight-regular text-primary"
                      >Genero:</span
                    >
                    <span class="text-black q-pl-xs"> {{ row.genero }}</span>
                  </q-item-label>
                  <q-item-label caption lines="2">
                    <q-icon
                      name="diversity_3"
                      class="q-pr-xs text-orange"
                    /><span class="text-weight-regular text-primary"
                      >Padre/Madre:</span
                    >
                    <q-checkbox
                      size="xs"
                      v-model="row.padre_madre"
                      val="true"
                      color="cyan"
                      disable
                    />
                    <!-- <span class="text-black q-pl-xs"> {{ row.padre_madre }}</span> -->
                  </q-item-label>
                </q-item-section>

                <q-item-section
                  side
                  style="width: 15%"
                  v-show="$q.screen.xs ? false : true"
                >
                  <q-item-label>
                    <!-- <q-chip color="primary" class="text-white glossy">
                      <q-icon name="contacts" colo="white" class="q-mr-sm" />
                      Principal
                      v-if="filterdocRelation.length > 1"
                    </q-chip> -->
                    <q-btn
                      dense
                      round
                      icon="more_vert"
                      @click="(event:Event)=>event.stopPropagation()"
                    >
                      <q-menu>
                        <q-list style="min-width: 100px" dense>
                          <q-item
                            clickable
                            v-close-popup
                            @click="selectItemDeleteRelationship(row)"
                          >
                            <q-item-section avatar>
                              <q-icon color="primary" name="power_off" />
                            </q-item-section>
                            <q-item-section>Desvincular</q-item-section>
                          </q-item>
                          <q-item
                            clickable
                            v-close-popup
                            @click="selectItemDelete(row)"
                          >
                            <q-item-section avatar>
                              <q-icon color="primary" name="delete" />
                            </q-item-section>
                            <q-item-section>Eliminar</q-item-section>
                          </q-item>
                          <q-separator />
                        </q-list>
                      </q-menu>
                    </q-btn>
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-separator inset="item" />
            </template>
          </q-list>
        </template>
        <template v-else>
          <q-card
            style="height: 60vh; width: 100%"
            flat
            class="my-card column flex-center"
          >
            <img
              src="list-empty.png"
              alt="lista vacia"
              style="width: 220px; height: 200px"
            />
            <br /><br />
            <div class="text-h6 text-dark text-center">
              Lista vacía <br />
              <small class="text-grey-5"
                >No se encontraron contactos relacionadas...</small
              >
            </div>
          </q-card>
        </template>
      </div>
    </q-card-section>
  </q-card>

  <q-card v-else style="height: 60vh; width: 100%">
    <q-skeleton height="100px" square class="bg-primary text-white" />
    <q-card-section>
      <q-skeleton type="QBtn" width="20%" class="text-subtitle1" />
    </q-card-section>
    <q-markup-table>
      <thead>
        <tr>
          <th class="text-left" style="width: 150px">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
          <th class="text-right">
            <q-skeleton animation="blink" type="text" />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="n in 7" :key="n">
          <td class="text-left">
            <q-skeleton animation="blink" type="text" width="85px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="50px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="35px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="65px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="25px" />
          </td>
          <td class="text-right">
            <q-skeleton animation="blink" type="text" width="85px" />
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card>

  <AdvancedFilterContact
    ref="advancedFilterRef"
    @selectItem="selectItem"
    @showAccount="showAccount"
    :account_id="''"
  />

  <AccountDialog
    ref="accountDialogRef"
    @saved-form="getListContacts"
    :loading="loading"
  />
  <ContactDialog ref="contactDialogRef" @contact-change="getListContacts" />
  <AlertComponent
    v-model="show_add"
    v-bind="propsCreateAlert"
    @confirm="onSubmit"
    @denegate="cancelInsertion"
  >
    <template #body>
      <span>
        <strong> {{ selected.nombre }} </strong> se relacionará como contacto de
        esta cuenta. cuenta.
      </span>
    </template>
  </AlertComponent>
  <AlertComponent
    v-model="show_delete"
    icon="person_remove"
    icon-color="warning"
    icon-size="60px"
    btn-color="negative"
    btn-text="Si, eliminar contacto"
    title="¿Eliminar contacto de esta cuenta?"
    @confirm="onDelete"
    @denegate="cancelInsertion"
  >
    <template #body>
      <div class="text-center">
        <strong class="text-negative"> {{ selected.nombre }} </strong>, se
        eliminará como contacto de esta cuenta.
      </div>
    </template>
  </AlertComponent>
  <AlertComponent
    v-model="show_delete_relationship"
    icon="person_remove"
    icon-color="warning"
    icon-size="60px"
    btn-color="negative"
    btn-text="Si, desvincular contacto"
    title="¿Desvincular contacto de esta cuenta?"
    @confirm="onDeleteRelationship"
    @denegate="cancelInsertion"
  >
    <template #body>
      <div class="text-center">
        <strong class="text-negative"> {{ selected.nombre }} </strong>, se
        desvinculara como contacto de esta cuenta.
      </div>
    </template>
  </AlertComponent>
</template>
<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import AccountDialog from './Dialogs/AccountDialog.vue';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
import { useQuasar, QSpinnerGears } from 'quasar';

export default defineComponent({
  name: 'ViewContacts',
});
</script>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { userStore } from 'src/modules/Users/store/UserStore';
import { AccountStore } from '../store/AccountStore';
import {
  useContacts,
  useUtils,
} from '../composables/TabsComposables/useContacts';
import AdvancedFilterContact from './AdvancedFilter/AdvancedFilterContact.vue';
import useContactService from '../services/AccountTabContactsService';

const ContactDialog = defineAsyncComponent(
  () => import('../../Contacts/components/Dialogs/ContactDialog.vue')
);
const contactDialogRef = ref<InstanceType<typeof ContactDialog> | null>(null);
const { getAccountsContact } = AccountStore();
const props = defineProps<{
  idAccount: string;
}>();
const $q = useQuasar();
const { show_add, selected, insertItem, cancelInsertion, loading } =
  useContacts(props.idAccount);
const {
  userCRM: { id: idUser },
} = userStore();
const ActiveSqeleton = ref(false);
const { propsCreateAlert } = useUtils();
const filter = ref('');
const documentRelation = ref([] as { [key: string]: string }[]);
const show_delete = ref(false);
const show_delete_relationship = ref(false);

onMounted(() => {
  getListContacts();
});

const filterdocRelation = computed(() => {
  return documentRelation.value.filter(
    (objeto) =>
      objeto.nombre.toLowerCase().indexOf(filter.value.toLowerCase()) > -1 ||
      objeto.ci.toLowerCase().indexOf(filter.value.toLowerCase()) > -1 ||
      objeto.correo.toLowerCase().indexOf(filter.value.toLowerCase()) > -1
  );
});

const accountDialogRef = ref();
const advancedFilterRef = ref<InstanceType<
  typeof AdvancedFilterContact
> | null>(null);
const getListContacts = async () => {
  documentRelation.value = await getAccountsContact(props.idAccount);
  console.log('Document Relation...', documentRelation.value);
  ActiveSqeleton.value = true;
};

const onSubmit = async () => {
  if (
    filterdocRelation.value.some((contact) => contact.id === selected.value.id)
  ) {
    closeDialogFilter();
    $q.notify({
      type: 'warning',
      message: 'El contacto ya esta relacionado a esta cuenta',
    });
    return;
  }
  await insertItem();
  await getListContacts();
  await closeDialogFilter();
};

const onDelete = async () => {
  //await insertItem();
  try {
    $q.loading.show({
      message: 'Eliminando el contacto de la cuenta',
      spinner: QSpinnerGears,
    });
    await useContactService().removeContact(idUser, selected.value.id);
    await getListContacts();
  } catch (error) {
    console.log(error);
  } finally {
    $q.loading.hide();
  }

  console.log('item to delete:', selected.value);
};

const onDeleteRelationship = async () => {
  try {
    $q.loading.show({
      message: 'Desvinculando contacto de la cuenta',
      spinner: QSpinnerGears,
    });
    await useContactService().removeRelationship(
      props.idAccount,
      selected.value.id
    );
    await getListContacts();
  } catch (error) {
    console.log(error);
  } finally {
    $q.loading.hide();
  }
};

const showContact = (id?: string) => {
  if (id) {
    contactDialogRef.value?.openDialogTab(id, 'Detalle del Contacto');

    return;
  }
  contactDialogRef.value?.openDialogTab(id);
  setTimeout(() => {
    contactDialogRef.value?.setAccountId(props.idAccount);
  }, 200);
};

const showAccount = (id: string) => {
  accountDialogRef.value.openDialogWithId(id);
};

const openDialogFilter = () => {
  advancedFilterRef.value?.openDialog();
};

const closeDialogFilter = () => {
  advancedFilterRef.value?.onClose();
};

const selectItem = (item: { [key: string]: string }) => {
  show_add.value = true;
  selected.value = item;
};

const selectItemDelete = (item: { [key: string]: string }) => {
  show_delete.value = true;
  selected.value = item;
};

const selectItemDeleteRelationship = (item: { [key: string]: string }) => {
  show_delete_relationship.value = true;
  selected.value = item;
};
</script>

<style scoped>
#mapid {
  width: 700px;
  height: 600px;
}
.q-chip {
  max-width: 140px;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  font-size: 0.8rem;
  text-align: right;
}
</style>
