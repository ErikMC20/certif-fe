<template>
  <AlertComponent
    v-model="showDelete"
    v-bind="propsDeleteAlert"
    @confirm="removeItem"
    @denegate="clearData"
  />

  <AlertComponent
    v-model="showAdd"
    v-bind="propsCreateAlert"
    @confirm="insertItem"
    @denegate="clearData"
  />

  <q-card
    flat
    class="my-card q-mb-sm"
    style="min-height: 450px"
    v-if="accountId"
  >
    <q-card-section class="row q-px-none q-py-sm items-center">
      <q-icon name="people" size="25px" color="grey-8" />
      <div class="text-h6 q-ml-xs text-grey-8">Cuentas relacionadas</div>
      <q-space />
      <q-btn
        size="10px"
        flat
        dense
        icon="mode_edit"
        class="float-right"
        :color="!$q.dark.isActive ? 'grey-8' : 'white'"
        @click="editList"
        v-if="!edit"
      >
        <q-tooltip>Editar</q-tooltip>
      </q-btn>
      <q-btn
        v-else
        size="10px"
        flat
        dense
        icon="cancel"
        class="float-right"
        :color="!$q.dark.isActive ? 'grey-8' : 'white'"
        @click="cancelEdit"
      >
        <q-tooltip>Cancelar</q-tooltip>
      </q-btn>
    </q-card-section>
    <q-separator />
    <q-card-section class="q-px-none">
      <transition
        enter-active-class="animated zoomIn"
        leave-active-class="animated zoomOut"
      >
        <div class="col-12 q-mb-sm" v-if="edit">
          <q-input
            v-model="search"
            dense
            debounce="300"
            outlined
            placeholder="Buscar cuenta... "
            :loading="loading"
          >
            <template #append>
              <q-icon name="search" v-if="search == ''" />
              <q-icon
                name="clear"
                class="cursor-pointer"
                v-else
                @click="search = ''"
              />
            </template>
          </q-input>
        </div>
      </transition>

      <transition appear enter-active-class="animated zoomIn">
        <div
          bordered
          class="my-card absolute shadow-1 bg-white col-12 q-py-none"
          style="z-index: 2; width: 100%"
          v-if="search.length >= 3"
        >
          <q-list
            bordered
            separator
            style="max-height: 350px; overflow-y: auto"
          >
            <q-item
              v-for="(contact, index) in listAccounts"
              :key="index"
              :class="contact.parent_id ? 'bg-orange-2' : ''"
            >
              <q-item-section>
                <q-item-label>
                  <q-icon name="account_circle" size="sm" color="grey-7" />
                  {{ contact.nombre }}
                </q-item-label>
                <q-item-label>
                  <small
                    >{{ `Región: ${contact.state}` }} | NIT/CI:
                    {{ contact.nit }} | {{ `AIO: ${contact.codaio}` }}</small
                  >
                </q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-btn
                  v-if="!contact.parent_id"
                  color="positive"
                  icon="person_add"
                  label="Seleccionar"
                  class="q-px-sm"
                  rounded
                  size="sm"
                  dense
                  @click="selectItem(0, contact, 'add')"
                />
                <div v-else>
                  <small>Relacionado con:</small> <br />
                  <a
                    href="javascript:void(0)"
                    class="text-blue-7"
                    @click="openDialogWithId(contact.parent_id)"
                  >
                    {{ contact.padre }}
                  </a>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </transition>

      <q-list separator bordered v-if="totalSelected > 0">
        <q-item v-for="(user, index) in listSelected" :key="index">
          <q-item-section avatar>
            <q-avatar>
              <q-icon name="account_circle" size="lg" color="grey-7" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="items-center">
              <a
                style="text-decoration: dashed"
                class="text-primary cursor-pointer"
                @click="openDialogWithId(user.id)"
              >
                {{ user.nombre }}
              </a>
            </q-item-label>
            <q-item-label>
              <small
                >{{ `Región: ${user.state}` }} | NIT/CI: {{ user.nit }} |
                {{ `AIO: ${user.codaio}` }}</small
              >
            </q-item-label>
          </q-item-section>
          <!-- <q-item-section avatar v-if="edit">
            <q-btn
              color="negative"
              icon="close"
              @click="selectItem(index, user, 'delete')"
              rounded
              dense
              flat
            />
          </q-item-section> -->
        </q-item>
      </q-list>
      <span v-if="totalSelected === 0 && !edit">
        No existen cuentas relacionadas.
        <a @click="editList" class="cursor-pointer text-info"> Agregar</a>
      </span>
    </q-card-section>
  </q-card>
  <!-- <q-card flat class="my-card q-mb-sm" style="min-height: 450px" v-else>
    <q-card-section class="row q-px-none q-py-sm items-center">
      <q-icon name="people" size="25px" />
      <div class="text-h6 q-ml-xs">Cuentas relacionadas</div>
      <q-space />
    </q-card-section>
    <q-separator />
    <q-card-section class="q-px-none">
      <transition enter-active-class="animated zoomIn">
        <div class="col-12 q-mb-sm">
          <q-input
            v-model="search"
            dense
            debounce="300"
            outlined
            placeholder="Buscar cuenta... "
            :loading="loading"
          >
            <template #append>
              <q-icon name="search" v-if="search == ''" />
              <q-icon
                name="clear"
                class="cursor-pointer"
                v-else
                @click="search = ''"
              />
            </template>
          </q-input>
        </div>
      </transition>
      <transition appear enter-active-class="animated zoomIn">
        <div
          bordered
          class="my-card absolute shadow-1 bg-white col-12 q-py-none"
          style="z-index: 2; width: 100%"
          v-if="search.length >= 3"
        >
          <q-list
            bordered
            separator
            style="max-height: 350px; overflow-y: auto"
          >
            <q-item
              v-for="(contact, index) in listAccounts"
              :key="index"
              clickable
              @click="selectItem(0, contact, 'add')"
            >
              <q-item-section>
                <q-item-label>
                  <q-icon name="account_circle" size="sm" color="grey-7" />
                  {{ contact.nombre }}
                </q-item-label>
                <q-item-label>
                  <small
                    >{{ `Región: ${contact.state}` }} | NIT/CI:
                    {{ contact.nit }} | {{ `AIO: ${contact.codaio}` }}</small
                  >
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </transition>
      <q-list separator bordered v-if="listSelected.length > 0">
        <q-item v-for="(user, index) in listSelected" :key="index">
          <q-item-section avatar>
            <q-avatar>
              <q-icon name="account_circle" size="lg" color="grey-7" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="items-center">
              <a
                style="text-decoration: dashed"
                class="text-primary cursor-pointer"
                @click="openDialogWithId(user.id)"
              >
                {{ user.nombre }}
              </a>
            </q-item-label>
            <q-item-label>
              <small
                >{{ `Región: ${user.state}` }} | NIT/CI: {{ user.nit }} |
                {{ `AIO: ${user.codaio}` }}</small
              >
            </q-item-label>
          </q-item-section>
          <q-item-section avatar>
            <q-btn
              color="negative"
              icon="close"
              @click="selectItem(index, user, 'delete')"
              rounded
              dense
              flat
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card> -->

  <AccountDialog ref="accountDialogRef" />
</template>
<script lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import { useRelatedAccounts, useUtils } from '../../composables/useRelations';
import AccountDialog from 'src/modules/Accounts/components/Dialogs/AccountDialog.vue';
import AlertComponent from 'src/components/MainAlert/AlertComponent.vue';
</script>

<script setup lang="ts">
const AccountDialog = defineAsyncComponent(
  () => import('src/modules/Accounts/components/Dialogs/AccountDialog.vue')
);

const props = defineProps({
  accountId: {
    type: String,
    required: false,
    default: null,
  },
});

const accountDialogRef = ref<InstanceType<typeof AccountDialog> | null>(null);

const openDialogWithId = (id: string) => {
  accountDialogRef.value?.openDialogAccountTab(id);
};

const {
  showDelete,
  showAdd,
  edit,
  search,
  loading,
  totalSelected,
  listSelected,
  listAccounts,
  selectItem,
  insertItem,
  removeItem,
  editList,
  cancelEdit,
  clearData,
} = useRelatedAccounts(props.accountId);

const { propsCreateAlert, propsDeleteAlert } = useUtils();
defineExpose({
  listSelected,
});
</script>

<style scoped></style>
