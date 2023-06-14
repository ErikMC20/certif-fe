<template>
  <div>
    <dialog-component
      v-model="showFilter"
      :sizeDialog="isFiltering ? 'dialog-md' : 'dialog-sm'"
      :headerDisabled="false"
      :footerDisabled="false"
      :loading="loading"
      :persistent="persistent"
    >
      <template #header>
        <!-- <pre>{{ persistent ? 'is persistent!' : 'is not persistent' }}</pre> -->
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
            <div class="col-md-6 col-sm-12" v-if="isFiltering">
              <q-card class="no-border-radius bg-none" flat>
                <q-card-section>
                  <div class="text-h6 q-mb-sm flex flex-center text-primary">
                    Lista de contactos
                  </div>
                  <template v-if="filteredContacts.length > 0">
                    <q-list bordered>
                      <q-virtual-scroll
                        style="max-height: 90vh"
                        :items="filteredContacts"
                        separator
                        v-slot="{ item, index }"
                      >
                        <q-item :key="index">
                          <q-item-section
                            avatar
                            class="cursor-pointer"
                            @click="$emit('selectItem', item)"
                          >
                            <q-avatar
                              color="indigo-3"
                              text-color="text-dark"
                              icon="perm_contact_calendar"
                              font-size="20px"
                            />
                          </q-item-section>
                          <q-item-section
                            class="cursor-pointer"
                            @click="$emit('selectItem', item)"
                          >
                            <q-item-label>{{ item.nombre }}</q-item-label>
                            <!-- <q-item-label caption lines="1"
                              >CI:
                              <span class="text-blue">{{ item.ci }}</span> |
                              Cumpleaños: {{ item.fecha_nacimiento }}
                            </q-item-label> -->
                            <span class="text-primary">Contacto</span>
                            <!-- <q-item-label v-if="$q.screen.xs">
                              <small>Cuenta: </small>
                              <small
                                class="text-blue-14 truncate cursor-pointer"
                                v-if="item.cuenta"
                              >
                                {{ item.cuenta ?? 'No tiene' }}
                                <q-tooltip color="primary">
                                  {{ item.cuenta }}
                                </q-tooltip>
                              </small>
                              <small v-else class="text-orange">
                                No tiene
                              </small>
                            </q-item-label> -->
                          </q-item-section>
                          <q-item-section>
                            <q-btn
                              outline
                              color="primary"
                              label="Ver"
                              @click="verDialogItem(item.id)"
                            />
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
                      <span class="block"
                        >No se encontraron coincidencias.</span
                      >
                      <slot name="no-data"></slot>
                    </div>
                  </template>
                </q-card-section>
              </q-card>
            </div>
          </Transition>
          <div
            class="col-sm-12"
            :class="isFiltering ? 'col-md-6' : 'col-md-12'"
          >
            <q-card class="no-border-radius" flat bordered>
              <q-card-section class="row q-col-gutter-sm">
                <div class="col-12 flex flex-center">
                  <q-btn
                    color="primary"
                    icon="add_box"
                    label="Crear un nuevo Contacto"
                    @click="openDialogContacto"
                    v-if="!$q.screen.xs"
                  />
                </div>
                <span class="text-h6 q-mb-sm flex flex-center text-primary"
                  >Contactos</span
                >
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
                    <template
                      v-slot:selected-item="scope"
                      v-if="element.with_avatar"
                    >
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
                          <q-item-label caption>{{
                            scope.opt.a_mercado
                          }}</q-item-label>
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
                <div class="col-12">
                  <q-input
                    outlined
                    v-model="dataE.name_account"
                    label="Cuentas"
                    class="col-md-6 col-sm-12"
                    dense
                    label-slot
                    :disable="cargaracons"
                    :loading="cargaracons"
                    @keyup.enter="onSubmitAcons"
                  >
                    <template v-slot:prepend>
                      <q-avatar>
                        <q-icon name="account_circle" size="sm" />
                      </q-avatar>
                    </template>
                    <template v-slot:after>
                      <q-btn
                        dense
                        outline
                        icon="north_west"
                        color="primary"
                        @click="openDialogAco"
                      />
                      <q-btn
                        dense
                        outline
                        icon="close"
                        color="negative"
                        @click="clearAco"
                      />
                    </template>
                  </q-input>
                </div>
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
          <!-- <pre>{{ dataFilter }}</pre>
          <pre>aa{{ dataE }}</pre> -->
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
          color="orange"
          icon="refresh"
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
  </div>
  <RelacionadoAco
    ref="advancedFilterAco"
    @selectItem="selectRelaAco"
    account_id=""
  />
  <DialogFilterEas ref="dialogFilterEasRef" id="" @seleccionando="AllRela" />
  <ContactDialog @contact-change="sendContactData" ref="contactDialogRef" />
</template>
<script lang="ts">
export default {
  name: 'RelacionadoCon',
};
</script>
<script setup lang="ts">
import { computed, ref } from 'vue';
// import { useContacts } from 'src/modules/Accounts/composables/TabsComposables/useContacts';
import { useBusquedaCon } from '../../../../../composables/Activity/useBusquedaCon';
// import { useBusquedaCon } from 'src/composables/Activity/useBusquedaCon';
import RelacionadoAco from './RelacionadoAco.vue';
import DialogFilterEas from 'src/components/MainDialog/DialogFilterEas.vue';
import { useActivityStore } from 'src/stores/ActivityStore';
import ContactDialog from 'src/modules/Contacts/components/Dialogs/ContactDialog.vue';

const props = withDefaults(
  defineProps<{
    account_id: string;
    persistent?: boolean;
    title?: string;
  }>(),
  {
    persistent: false,
    title: 'Búsqueda avanzada',
  }
);

const {
  loading,
  isFiltering,
  showFilter,
  show_more_field,
  formInputs,
  dataFilter,
  HANSACRM3_URL,
  listContacts,
  submitFilter,
  clearFilter,
  onClose,
} = useBusquedaCon();
const advancedFilterAco = ref<InstanceType<typeof RelacionadoAco> | null>(null);
const dialogFilterEasRef = ref<InstanceType<typeof DialogFilterEas> | null>(
  null
);
const contactDialogRef = ref<InstanceType<typeof ContactDialog> | null>(null);
const activityStore = useActivityStore();
const dataE = ref({
  name_account: '',
});
const filteredContacts = computed(() => {
  return listContacts.value.filter(
    (contact) => contact.id_cuenta !== props.account_id
  );
});

const onSubmit = () => {
  submitFilter(dataFilter.value, props.account_id);
};

const openDialog = () => {
  showFilter.value = !showFilter.value;
};
const verDialogItem = async (id: string) => {
  await contactDialogRef.value?.openDialogTab(id);
};

const onReset = () => {
  clearFilter();
  dataE.value.name_account = '';
};

const openDialogContacto = async () => {
  await contactDialogRef.value?.openDialogTab('', 'Nuevo Contacto');
};
const sendContactData = (id?: string) => {
  emit('sendIdContact', id);
};

//====================================
const AllRela = (item: any) => {
  // console.log(item);
  if (dataFilter.value.account == 'pre') {
    selectRelaAco(item);
  }
};
// tr=========================================================================
const openDialogAcoWithCont = (idcont: string, nomcont: string) => {
  showFilter.value = !showFilter.value;
  dataE.value.name_account = nomcont;
  dataFilter.value.account = idcont;
  onSubmit();
};
const selectRelaAco = (item: any) => {
  // console.log(item);
  dataE.value.name_account = item.nombre;
  dataFilter.value.account = item.id;
  advancedFilterAco.value?.onClose();
  onSubmit();
  // emit('changeRela', dataSend.value);
};
const openDialogAco = () => {
  advancedFilterAco.value?.openDialog();
};
const clearAco = () => {
  dataE.value.name_account = '';
  dataFilter.value.account = '';
  onSubmit();
};
const cargaracons = ref(false);
const onSubmitAcons = async () => {
  cargaracons.value = true;
  const dataInicio = await activityStore.getFiltroEasyAco(
    dataE.value.name_account
  );
  // console.log('entrada del data inciio', dataInicio);
  dialogFilterEasRef.value?.openDialog(dataInicio);
  // dataE.value.name_account = '';
  dataFilter.value.account = 'pre';
  cargaracons.value = false;
};
// tr=========================================================================

const emit = defineEmits(['selectItem', 'showAccount', 'sendIdContact']);
defineExpose({
  openDialog,
  onClose,
  openDialogAcoWithCont,
});
</script>

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
</style>
