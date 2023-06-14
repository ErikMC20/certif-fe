<script lang="ts" setup>
import { ref, defineAsyncComponent } from 'vue';
import { useAdvancedFilter } from '../../composables';
import accountTableService from '../../services/AccountTableService';
import { useLeadsStore } from 'src/modules/Leads/store/LeadsStore';
import LeadDialog from 'src/modules/Leads/components/Dialogs/LeadDialog.vue';
import { AccountModel } from '../../../../../../frontend-quasar-v3-vite/src/modules/Accounts/utils/types/index';
const { getRelationAll } = useLeadsStore();

const AccountDialog = defineAsyncComponent(
  () => import('src/modules/Accounts/components/Dialogs/AccountDialog.vue')
);

const documentRelation = ref([] as { [key: string]: string }[]);
const leadsDialogRef = ref<InstanceType<typeof LeadDialog> | null>(null);
const props = withDefaults(
  defineProps<{
    persistent?: boolean;
    title?: string;
    enableCreation?: boolean;
  }>(),
  {
    persistent: false,
    title: 'Búsqueda avanzada',
    enableCreation: false,
  }
);

const emits = defineEmits<{
  (
    event: 'selectItem',
    item: {
      [key: string]: string | null;
    }
  ): void;
}>();

//* variables

const accountDialogRef = ref<InstanceType<typeof AccountDialog> | null>(null);

const showFilterDialog = ref(false);
const filtered = ref(false);

const openDetail = async (id: any) => {
  documentRelation.value = await getRelationAll('Accounts', id);
  show_encontrados.value = true;
};

const show_encontrados = ref(false);
const openDialogLeads = async (id?: string) => {
  await leadsDialogRef.value?.openDialogAccountTab(id ? id : '');
};

const { form: formInputs, dataFilter, HANSACRM3_URL, clearFilter } = useAdvancedFilter();

const { getAccounts } = accountTableService();

//* methods
const onSubmit = async () => {
  // console.log(dataFilter.value.p);
  const accounts = await getAccounts(dataFilter.value);
  filteredAccounts.value = accounts.data;
  filtered.value = true;
};

const openDialog = () => {
  showFilterDialog.value = true;
};

const onReset = () => {
  filtered.value = false;
  filteredAccounts.value = [];
  clearFilter();
};

//* foreign variables/methods
const loading = ref(false); // from composable
const onClose = () => {
  // from composable
  showFilterDialog.value = false;
};
const show_more_field = ref(false);
const filteredAccounts = ref(
  [] as {
    [key: string]: string | null;
  }[]
);

const openDialogAccount = (id: string) => {
  accountDialogRef.value?.openDialogAccountTab(id);
};

const createNewAccount = (type: AccountModel) => {
  accountDialogRef.value?.openDialogAccountTab(
    undefined,
    type,
    type === 'Empresa' ? 'Nuevo Cuenta Empresa' : 'Nueva Cuenta Privada'
  );
};

//* end foreign variables/methods
defineExpose({
  openDialog,
  onClose,
});
</script>
<template>
  <div>
    <dialog-component
      v-model="showFilterDialog"
      :sizeDialog="filtered ? 'dialog-md' : 'dialog-sm'"
      :headerDisabled="false"
      :footerDisabled="false"
      :loading="loading"
      :persistent="persistent"
      @before-hide="onReset"
    >
      <template #header>
        <q-card class="my-card no-border-radius">
          <q-card-section class="bg-primary text-white q-pa-sm">
            <div class="text-h6">
              <slot name="header-button"> </slot>
              {{ title }}
              <q-btn
                v-if="!persistent"
                flat
                icon="close"
                dense
                class="float-right"
                @click="onClose"
              />
            </div>
          </q-card-section>
        </q-card>
      </template>
      <template #body>
        <div class="row bg-white">
          <Transition enter-active-class="animated lightSpeedInRight">
            <div class="col-md-6 col-sm-12" v-if="filtered">
              <q-card class="no-border-radius bg-none" flat>
                <q-card-section>
                  <div class="text-h7 q-mb-sm">Lista de coincidencias</div>
                  <!-- <pre>{{ filteredAccounts }}</pre> -->
                  <template v-if="filteredAccounts.length > 0">
                    <q-list bordered>
                      <q-virtual-scroll
                        style="max-height: 90vh"
                        :items="filteredAccounts"
                        separator
                        v-slot="{ item, index }"
                      >
                        <q-item :key="index" clickable @click="emits('selectItem', item)">
                          <q-item-section avatar>
                            <!-- <pre>{{ item.color }}</pre> -->
                            <q-btn
                              dense
                              round
                              :icon="item.icon"
                              :color="item.color"
                              text-color="white"
                            >
                              <q-badge
                                color="primary"
                                font-size="9px"
                                transparent
                                class="badge-count-children"
                                v-if="item.numberOfChildren"
                              >
                                {{ item.numberOfChildren }}
                              </q-badge>
                              <q-tooltip color="primary">
                                {{ `Cuenta: ${item.tipo}` }}
                              </q-tooltip>
                            </q-btn>

                            <!-- <q-avatar
                              :color="item.color"
                              text-color="white"
                              :icon="item.icon"
                              font-size="20px"
                            /> -->
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>{{ item.nombre }}</q-item-label>
                            <q-item-label caption lines="1"
                              >NIT/CI:
                              <span class="text-blue">{{ item.nit }}</span>
                            </q-item-label>
                            <q-item-label caption lines="1"
                              >Código cliente:
                              <span class="text-blue">{{ item.codigo }}</span>
                            </q-item-label>
                            <q-item-label v-if="$q.screen.xs">
                              <small>Cuenta: </small>
                              <small
                                class="text-blue-14 truncate cursor-pointer"
                                v-if="item.tipo"
                              >
                                {{ item.tipo ?? "No tiene" }}
                                <q-tooltip color="primary">
                                  {{ item.tipo }}
                                </q-tooltip>
                              </small>
                              <small v-else class="text-orange"> No tiene </small>
                            </q-item-label>
                          </q-item-section>
                          <q-item-section side @click.stop.prevent="openDetail(item.id)">
                            <q-chip
                              square
                              color="blue-2"
                              size="sm"
                              v-if="item.cantLeads > 0"
                            >
                              {{ item.cantLeads }}
                              <q-tooltip class="bg-primary">
                                Leads relacionados a la cuenta
                              </q-tooltip>
                            </q-chip>
                          </q-item-section>
                          <q-item-section side style="width: 95px">
                            <q-btn
                              color="primary"
                              class="prueba"
                              @click.stop.prevent="openDialogAccount(item.id)"
                            >
                              <small>Ver cuenta</small>
                            </q-btn>
                          </q-item-section>
                        </q-item>
                      </q-virtual-scroll>
                    </q-list>
                  </template>
                  <template v-else>
                    <div class="text-h7 text-grey-6 q-py-md text-center">
                      <img
                        src="empty_list.png"
                        alt="lista vacia"
                        style="width: 150px; height: 100px"
                      />
                      <span class="block">No se encontraron coincidencias.</span>
                      <slot name="no-data"></slot>
                    </div>
                  </template>
                </q-card-section>
              </q-card>
            </div>
          </Transition>
          <div class="col-sm-12" :class="filtered ? 'col-md-6' : 'col-md-12'">
            <q-card class="no-border-radius" flat bordered>
              <q-card-section class="row q-col-gutter-sm">
                <slot name="header"
                  ><q-btn-dropdown
                    v-if="props.enableCreation"
                    color="primary"
                    label="Crear nueva cuenta"
                    class="full-width"
                  >
                    <q-list>
                      <q-item
                        clickable
                        v-close-popup
                        @click="createNewAccount('Privada')"
                      >
                        <q-item-section>
                          <q-item-label>Nueva cuenta privada</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item
                        clickable
                        v-close-popup
                        @click="createNewAccount('Empresa')"
                      >
                        <q-item-section>
                          <q-item-label>Nueva cuenta empresa</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                </slot>

                <template v-for="(element, index) in formInputs" :key="index">
                  <component
                    :is="element.input"
                    v-model="dataFilter[element.field]"
                    :label="element.label"
                    :options="element.options"
                    :option-value="element.option_value"
                    :option-label="element.option_label"
                    :options-selected-class="element.selected_class"
                    :emit-value="element.emit_value"
                    :map-options="element.map_options"
                    :multiple="element.multiple"
                    :debounde="element.debounce"
                    @keydown.enter="onSubmit"
                    @filter="element.filter_function"
                    @clear="
                      element.multiple
                        ? (dataFilter[element.field] = [])
                        : (dataFilter[element.field] = '')
                    "
                    :use-input="element.use_input"
                    option-dense
                    :clearable="element.clearable"
                    class="col-12"
                    dense
                    outlined
                    v-if="
                      element.input === 'q-select' &&
                      element.visible &&
                      dataFilter[element.dependence ?? ''] !== ''
                    "
                  >
                    <template v-slot:selected-item="scope" v-if="element.with_avatar">
                      <q-chip
                        removable
                        dense
                        @remove="scope.removeAtIndex(scope.index)"
                        :tabindex="scope.tabindex"
                        color="grey-4"
                        size="md"
                      >
                        <q-avatar>
                          <img :src="`${HANSACRM3_URL}/${scope.opt.avatar}`" />
                        </q-avatar>
                        <div class="ellipsis">
                          {{ scope.opt.user_name }}
                          <q-tooltip class="bg-primary">
                            <div>{{ scope.opt.user_name }}</div>
                          </q-tooltip>
                        </div>
                      </q-chip>
                    </template>
                    <template v-slot:option="scope" v-if="element.with_avatar">
                      <q-item v-bind="scope.itemProps">
                        <q-item-section avatar>
                          <img
                            :src="`${HANSACRM3_URL}/${scope.opt.avatar}`"
                            style="width: 30px"
                          />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ scope.opt.user_name }}</q-item-label>
                          <q-item-label caption>{{ scope.opt.a_mercado }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </component>
                  <component
                    :is="element.input"
                    v-model.trim="dataFilter[element.field as string]"
                    type="text"
                    :label="element.label"
                    class="col-12"
                    dense
                    outlined
                    @keydown.enter="onSubmit"
                    v-if="element.input === 'q-input' && element.visible"
                  >
                  </component>
                  <q-toggle
                    v-model="dataFilter[element.field]"
                    color="primary"
                    :label="element.label"
                    indeterminate-value="''"
                    false-value="0"
                    true-value="1"
                    v-if="element.input === 'q-toggle' && element.visible"
                  />
                </template>
              </q-card-section>
              <q-card-section>
                <q-btn
                  color="primary"
                  icon="check"
                  label="Mostrar más campos"
                  class="full-width"
                  outline
                  @click="show_more_field = !show_more_field"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </template>
      <template #footer>
        <q-btn
          color="primary"
          icon="search"
          label="BUSCAR"
          class="q-mr-sm"
          @click="onSubmit"
          :disable="loading"
        />
        <q-btn
          color="primary"
          outline
          icon="filter_alt_off"
          label="LIMPIAR"
          @click="onReset"
          :disable="loading"
        />
      </template>
    </dialog-component>
    <q-dialog v-model="show_more_field">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section>
          <div class="text-h6 q-pt-none">
            Campos de búsqueda
            <q-btn icon="close" flat dense class="float-right" v-close-popup />
          </div>
          <hr />
          <div class="q-col-gutter-sm">
            <q-checkbox
              v-for="(item, index) in formInputs"
              :key="index"
              keep-color
              v-model="item['visible']"
              :label="item['label']"
              color="primary"
              style="width: 33.3%"
              :val="item['visible']"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="show_encontrados">
      <q-card style="width: 450px; max-width: 80vw">
        <q-card-section>
          <q-header class="bg-primary">
            <q-toolbar>
              <span>Leads relacionados con la cuenta</span>
              <q-space />
              <q-btn flat v-close-popup round dense icon="close" />
            </q-toolbar>
          </q-header>
        </q-card-section>

        <q-card-section>
          <q-separator />
          <div class="q-col-gutter-sm">
            <q-list separator class="q-ma-sm">
              <q-item>
                <q-item-section>
                  <q-item-label>Leads</q-item-label>
                  <q-item-label caption class="text-grey-7"
                    >Encontrados: {{ documentRelation.length }}
                  </q-item-label>
                </q-item-section>
                <!-- <q-item-section >
              <q-item-label>Cuentas</q-item-label>
              <q-item-label caption class="text-grey-7">Relacionadas con el Leads </q-item-label>
            </q-item-section>
            <q-item-section >
              <q-item-label>Contactos</q-item-label>
              <q-item-label caption class="text-grey-7">Relacionadas con el Leads </q-item-label>
            </q-item-section> -->
              </q-item>
              <q-item v-for="(reg, index) in documentRelation" :key="index">
                <q-item-section>
                  <q-item-label>
                    <a
                      class="text-bold cursor-pointer flex items-center text-primary"
                      @click="() => openDialogLeads(reg.idLead)"
                      >{{ reg.lead }}</a
                    ></q-item-label
                  >
                  <q-item-label
                    caption
                    :class="reg.fechaCreacionLead != null ? 'text-grey-8' : 'text-grey'"
                  >
                    {{ reg.fechaCreacionLead || "Sin relación" }}</q-item-label
                  >
                </q-item-section>
                <!-- <q-item-section >

              <q-item-label>{{ reg.cuenta }}</q-item-label>
              <q-item-label caption :class="reg.fechaCreacionCuenta != null ? 'text-grey-8' :'text-grey'"> {{ reg.fechaCreacionCuenta || 'Sin relación'}}</q-item-label>
            </q-item-section>
            <q-item-section >

              <q-item-label>{{ reg.contacto }}</q-item-label>
              <q-item-label caption :class="reg.fechaCreacionContacto != null ? 'text-grey-8' :'text-grey'"> {{ reg.fechaCreacionContacto || 'Sin relación'}}</q-item-label>
            </q-item-section> -->
              </q-item>
            </q-list>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
    <LeadDialog ref="leadsDialogRef" />
  </div>
  <AccountDialog ref="accountDialogRef" />
</template>

<style scoped>
.q-chip {
  max-width: 140px;
}

.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 90px;
  font-size: 0.8rem;
  text-align: right;
}
.badge-count-children {
  position: absolute;
  top: 20px;
  right: -10px;
  cursor: inherit;
  font-size: 0.8rem;
}
.prueba {
  padding-top: 0px;
  padding-right: 8px;
  padding-bottom: 0px;
  padding-left: 8px;
  font-size: 12px;
}
</style>
