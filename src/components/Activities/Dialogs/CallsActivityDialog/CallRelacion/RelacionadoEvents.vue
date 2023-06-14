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
                  <div class="text-h7 q-mb-sm">Lista de Eventos</div>
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
                              color="green-3"
                              text-color="text-dark"
                              icon="group_add"
                              font-size="20px"
                            />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>{{ item.name }}</q-item-label>
                            <!-- <q-item-label caption lines="1"
                              >CI:
                              <span class="text-blue">{{ item.ci }}</span> |
                              Cumpleaños: {{ item.fecha_nacimiento }}
                            </q-item-label> -->
                            <span class="text-blue">Eventos</span>
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
                <span>eventos</span>
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
        <!-- <pre>{{ dataFilter }}</pre> -->
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
</template>
<script lang="ts">
export default {
  name: 'RelacionadoEvents',
};
</script>
<script setup lang="ts">
import { computed } from 'vue';
import { useBusquedaEvents } from '../../../../../composables/Activity/useBusquedaEvents';

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
  listPros,
  submitFilter,
  clearFilter,
  onClose,
} = useBusquedaEvents();

const filteredContacts = computed(() => {
  return listPros.value.filter((contact) => contact.id !== props.account_id);
});

const onSubmit = () => {
  // console.log(dataFilter.value);
  submitFilter(dataFilter.value);
};

const openDialog = () => {
  showFilter.value = !showFilter.value;
};

const onReset = () => {
  clearFilter();
};

defineEmits(['selectItem', 'showAccount']);
defineExpose({
  openDialog,
  onClose,
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
