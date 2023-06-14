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
        <q-toolbar class="bg-primary text-white">
          <q-avatar
            size="30px"
            font-size="25px"
            color="primary"
            text-color="white"
            icon="person"
          />
          <q-toolbar-title> Buscar contacto </q-toolbar-title>
          <q-btn flat round dense icon="close" @click="onClose" />
        </q-toolbar>
      </template>
      <template #body>
        <div class="row bg-white">
          <Transition enter-active-class="animated lightSpeedInRight">
            <div class="col-md-6 col-sm-12" v-if="isFiltering">
              <q-card class="no-border-radius bg-none" flat>
                <q-card-section>
                  <div class="text-h7 q-mb-sm">Lista de coincidencias</div>
                  <template v-if="filteredContacts.length > 0">
                    <q-list bordered>
                      <q-virtual-scroll
                        style="max-height: 90vh"
                        :items="filteredContacts"
                        separator
                        v-slot="{ item, index }"
                      >
                        <q-item
                          :key="index"
                          clickable
                          @click="$emit('selectItem', item)"
                        >
                          <q-item-section avatar>
                            <q-avatar
                              color="blue-3"
                              text-color="text-dark"
                              icon="person_pin"
                              font-size="20px"
                            />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>{{ item.nombre }}</q-item-label>
                            <q-item-label caption lines="1"
                              >CI:
                              <span class="text-blue">{{ item.ci }}</span> |
                              Cumpleaños: {{ item.fecha_nacimiento }}
                            </q-item-label>
                            <q-item-label v-if="$q.screen.xs">
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
                            </q-item-label>
                          </q-item-section>
                          <q-item-section
                            side
                            style="width: 200px"
                            v-if="!$q.screen.xs"
                          >
                            <small>Cuenta:</small>
                            <small
                              class="text-blue-14 truncate cursor-pointer"
                              v-if="item.cuenta"
                            >
                              {{ item.cuenta ?? 'No tiene' }}
                              <q-tooltip color="primary">
                                {{ item.cuenta }}
                              </q-tooltip>
                            </small>
                            <small v-else class="text-orange"> No tiene </small>
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
                <template v-for="(element, index) in formInputs" :key="index">
                  <q-select
                    v-model="dataFilter[element.field]"
                    :options="accountOptions"
                    v-if="
                      element.field === 'account' && element.visible === true
                    "
                    label="Cuenta"
                    hide-dropdown-icon
                    option-value="value"
                    option-label="label"
                    emit-value
                    map-options
                    class="col-12"
                    outlined
                    readonly
                    dense
                    label-slot
                  >
                    <template v-slot:after>
                      <q-btn
                        dense
                        icon="north_west"
                        color="primary"
                        @click="openAccountFilter"
                      />
                      <q-btn
                        dense
                        flat
                        icon="close"
                        color="negative"
                        @click="clearAccount"
                      />
                    </template>
                  </q-select>
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
  <AdvancedFilterAccount
    ref="accountAdvancedFilterRef"
    title="Búsqueda de Cuentas"
    @select-item="assignAccount"
  />
</template>

<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from 'vue';
import { useContacts } from 'src/modules/Accounts/composables/TabsComposables/useContacts';
import { getRecordModuleInfo } from 'src/services/GlobalService';

//* lazy loaded components
const AdvancedFilterAccount = defineAsyncComponent(
  () => import('./AdvancedFilterAccount.vue')
);

// const props = defineProps(['account_id']);
const props = withDefaults(
  defineProps<{
    account_id: string;
    persistent?: boolean;
    title?: string;
    altAccountId?: string;
  }>(),
  {
    persistent: false,
    title: 'Búsqueda avanzada',
    altAccountId: '',
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
} = useContacts();

//* Reference Variables
const accountAdvancedFilterRef = ref<InstanceType<
  typeof AdvancedFilterAccount
> | null>(null);

const filteredContacts = computed(() => {
  return listContacts.value.filter(
    (contact) => contact.id_cuenta !== props.account_id
  );
});

const accountOptions = ref([{ label: '', value: '' }]);

const onSubmit = () => {
  submitFilter(dataFilter.value, props.account_id);
};

const openDialog = async () => {
  showFilter.value = !showFilter.value;
  if (!!props.altAccountId) {
    dataFilter.value['account'] = props.altAccountId;

    const account = await getRecordModuleInfo('Accounts', props.altAccountId, {
      allData: false,
      fields: ['name'],
    });
    onSubmit();
    accountOptions.value = [
      {
        label: typeof account.name === 'string' ? account.name : '',
        value: props.altAccountId,
      },
    ];
  }
};

const openAccountFilter = () => {
  accountAdvancedFilterRef.value?.openDialog();
};

const assignAccount = (item: { [key: string]: string | null }) => {
  accountOptions.value = [{ label: item.nombre || '', value: item.id || '' }];
  dataFilter.value['account'] = item.id;
  listContacts.value = [];
  isFiltering.value = false;
  accountAdvancedFilterRef.value?.onClose();
};

const clearAccount = () => {
  dataFilter.value['account'] = '';
};

const onReset = () => {
  clearFilter();
};

defineEmits(['selectItem', 'showAccount']);
defineExpose({
  openDialog,
  onClose,
  submitFilter,
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
