<script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';
import AccountDialog from '../../Accounts/components/Dialogs/AccountDialog.vue';
import ViewGeneralSkeletonSubpanel from 'src/components/Skeletons/ViewGeneralSkeletonSubpanel.vue';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
import { useOpportunitiesStore } from 'src/modules/Opportunities/store/OpportunitiesStore';

export default defineComponent({
  name: 'ViewContacts',
});
</script>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useProspectStore } from 'src/modules/Prospects/store/ProspectStore';
import {
  useContacts,
  useUtils,
} from '../../Accounts/composables/TabsComposables/useContacts';
// import AdvancedFilterContact from './AdvancedFilter/AdvancedFilterContact.vue';

import AdvancedFilterContact from '../../Contacts/components/AdvancedFilter/AdvancedFilter.vue';

import RelacionadoCon from 'src/components/Activities/Dialogs/CallsActivityDialog/CallRelacion/RelacionadoCon.vue';
import {
  createRelationBetweenModulesV2,
  deletedRelationBetweenModules,
} from 'src/services/GlobalService';

const { propsDeleteRelationAlert } = useUtils();

const ContactDialog = defineAsyncComponent(
  () => import('../../Contacts/components/Dialogs/ContactDialog.vue')
);
const contactDialogRef = ref<InstanceType<typeof ContactDialog> | null>(null);
const advancedFilterConRef = ref<InstanceType<typeof RelacionadoCon> | null>(
  null
);
const storeOppotunities = useOpportunitiesStore();
const { getProspectsContact } = useProspectStore();
const props = defineProps<{
  id: string;
}>();
const ActiveSqeleton = ref(false);
const { show_add, selected, insertItem, cancelInsertion, loading } =
  useContacts(props.id);
const { propsCreateAlert } = useUtils();
const filter = ref('');
const dataRelation = ref([] as { [key: string]: string }[]);

const alertDelet = ref(false);
const infoDocTemp = ref();

onMounted(async () => {
  await getListContacts();
});

const searchContacts = () => {
  advancedFilterConRef.value?.openDialog();
  console.log('buscar contacto');
};

const alert = ref(false);
const infoCont = ref();
const relacarga = ref(false);

const selectRelaCon = async (item: any) => {
  infoCont.value = item;
  alert.value = true;
};

const saveRelationCon = async (items: any) => {
  relacarga.value = true;
  alert.value = false;
  advancedFilterConRef.value?.onClose();
  await createRelationBetweenModulesV2(
    'Opportunities',
    props.id,
    'Contacts',
    infoCont.value.id
  );
  await getListContacts();
  relacarga.value = false;
};

const openAlertDeletedRelationopportunityContacts = (item: any) => {
  alertDelet.value = true;
  infoDocTemp.value = item;
};

const deleteContact = async () => {
  relacarga.value = true;
  await deletedRelationBetweenModules(
    'Opportunities',
    props.id,
    'Contacts',
    infoDocTemp.value.id
  );
  await getListContacts();
  alertDelet.value = false;
  relacarga.value = false;
};
const filterdocRelation = computed(() => {
  return dataRelation.value.filter(
    (objeto) =>
      objeto.first_name.toLowerCase().indexOf(filter.value.toLowerCase()) > -1
  );
});

const accountDialogRef = ref<InstanceType<typeof AccountDialog> | null>(null);
const advancedFilterRef = ref<InstanceType<
  typeof AdvancedFilterContact
> | null>(null);
const getListContacts = async () => {
  dataRelation.value = await storeOppotunities.getRelations(
    props.id,
    'contacts'
  );
  ActiveSqeleton.value = true;
};

const onSubmit = async () => {
  await insertItem();
  await getListContacts();
  // await closeDialogFilter();
};

const showContact = (id?: string) => {
  if (id) {
    contactDialogRef.value?.openDialogTab(id, 'Detalle del Contacto');

    return;
  }
  contactDialogRef.value?.openDialogTab(id);
  setTimeout(() => {
    contactDialogRef.value?.setAccountId(props.id);
  }, 200);
};

const showAccount = (id: string) => {
  //accountDialogRef.value?.openDialogWithId(id);
};

// const openDialogFilter = () => {
//   advancedFilterRef.value?.openDialog();
// };

// const closeDialogFilter = () => {
//   advancedFilterRef.value?.onClose();
// };

const selectItem = (item: { [key: string]: string }) => {
  show_add.value = true;
  selected.value = item;
};
</script>
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
                @click="searchContacts"
                label="buscar y agregar"
                size="md"
              />
              <!-- <q-btn color="primary" icon="add" class="mobile-only" /> -->
            </slot>
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-md-3 q-pa-sm">
        <!-- <pre> {{ dataRelation }}</pre> -->
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
                    >{{
                      row.salutation == 'Mr.'
                        ? 'Sr.'
                        : row.salutation == 'Mrs.'
                        ? 'Sra.'
                        : row.salutation
                    }}
                    {{ row.first_name }} {{ row.last_name }}</q-item-label
                  >
                  <q-item-label caption lines="2">
                    <q-icon name="credit_card" class="q-pr-xs text-orange" />
                    <span class="text-weight-regular text-primary">CI:</span>
                    <span class="text-black q-pl-xs"> {{ row.ci_c }}</span>
                  </q-item-label>
                  <q-item-label
                    caption
                    lines="3"
                    v-show="!$q.screen.xs ? false : true"
                  >
                    <q-icon name="groups" class="q-pr-xs text-orange" />
                    <span class="text-weight-regular text-primary">Cargo:</span>
                    <span class="text-black q-pl-xs"> {{ row.title }}</span>
                  </q-item-label>
                  <q-item-label caption lines="2">
                    <q-icon name="email" class="q-pr-xs text-orange" />
                    <span class="text-weight-regular text-primary"
                      >Correo:</span
                    >
                    <span class="text-black q-pl-xs"> {{ row.email1 }}</span>
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
                    <span class="text-black q-pl-xs"> {{ row.genero_c }}</span>
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
                    <span class="text-black q-pl-xs"> {{ row.birthdate }}</span>
                  </q-item-label>
                  <q-item-label caption lines="3">
                    <q-icon name="call" class="text-orange" />
                    <span class="text-weight-regular text-primary"
                      >Telefono:</span
                    >
                    <span class="text-black q-pl-xs">
                      {{ row.phone_mobile }}</span
                    >
                  </q-item-label>
                  <q-item-label caption lines="3">
                    <q-icon name="groups" class="q-pr-xs text-orange" />
                    <span class="text-weight-regular text-primary">Cargo:</span>
                    <span class="text-black q-pl-xs"> {{ row.title }}</span>
                  </q-item-label>
                </q-item-section>
                <q-item-section v-show="$q.screen.xs ? false : true">
                  <q-item-label caption lines="1">
                    <q-icon name="flag" class="text-orange" />
                    <span class="text-weight-regular text-primary">Pais:</span>
                    <span class="text-black q-pl-xs">
                      {{ row.primary_address_country }}</span
                    >
                  </q-item-label>
                  <q-item-label caption lines="2">
                    <q-icon name="person" class="q-pr-xs text-orange" /><span
                      class="text-weight-regular text-primary"
                      >Genero:</span
                    >
                    <span class="text-black q-pl-xs"> {{ row.genero_c }}</span>
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
                  <q-item-label v-if="row.principal_c">
                    <q-chip color="primary" class="text-white glossy">
                      <q-icon name="contacts" colo="white" class="q-mr-sm" />
                      Principal
                    </q-chip>
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-btn
                    size="12px"
                    flat
                    dense
                    round
                    icon="more_vert"
                    @click="(event:Event)=>event.stopPropagation()"
                  >
                    <q-menu>
                      <q-list style="min-width: 100px" dense>
                        <q-item clickable v-close-popup>
                          <q-item-section
                            @click="
                              openAlertDeletedRelationopportunityContacts(row)
                            "
                            >Quitar</q-item-section
                          >
                        </q-item>
                        <!-- <q-item clickable v-close-popup>
                            <q-item-section>Descargar</q-item-section>
                          </q-item> -->
                        <q-separator />
                      </q-list>
                    </q-menu>
                  </q-btn>
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
    <q-inner-loading
      :showing="relacarga"
      label="Relacionando una cotización.."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </q-card>

  <q-card v-else style="height: 60vh; width: 100%">
    <ViewGeneralSkeletonSubpanel />
  </q-card>

  <!-- <AdvancedFilterContact
    ref="advancedFilterRef"
    @selectItem="selectItem"
    @showAccount="showAccount"
    :account_id="id"
  /> -->

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

  <RelacionadoCon
    account_id=""
    ref="advancedFilterConRef"
    @selectItem="selectRelaCon"
    id=""
  />
  <AlertComponent
    v-model="alert"
    icon="work"
    icon-color="primary"
    icon-size="70px"
    title="Relacionar la oportunidad"
    btnColor="primary"
    btnText="Si, relacionar"
    @confirm="saveRelationCon"
    @denegate="alert = false"
  >
    <template #body>
      <span class="text-center col-12"
        >¿ Desea relacionar la oportunidad ?
      </span>

      <span class="text-center text-primary col-12">
        {{ infoCont.nombre }}
      </span>
    </template>
  </AlertComponent>

  <AlertComponent
    v-model="alertDelet"
    v-bind="propsDeleteRelationAlert"
    @confirm="deleteContact"
  >
    <template #body>
      <span> Esta seguro de quitar la relación? </span>
    </template>
  </AlertComponent>
</template>
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
