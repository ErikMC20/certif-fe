<template>
  <q-dialog v-model="dialogColumns">
    <q-card class="column-dialog">
      <q-card-section>
        <div class="text-h6">
          <q-checkbox v-model="selectAll" @click="setAllVisibleColumns" />
          Columnas
          <q-btn
            icon="close"
            class="float-right"
            dense
            flat
            v-close-popup
            @click="getVisibleColumns"
          />
        </div>
        <hr />
        <div class="q-col-gutter-sm">
          <q-checkbox
            v-for="col in columnsFilter"
            :key="col.name"
            v-model="columnsSelected"
            :val="col.name"
            style="width: 50%"
            :label="col.label"
          />
        </div>
      </q-card-section>
      <q-card-actions align="center" class="text-primary">
        <q-btn
          color="primary"
          icon="save"
          label="Guardar"
          @click="onVisibleColumn"
          v-close-popup
        />
        <q-btn
          color="secondary"
          label="Cancelar"
          v-close-popup
          @click="getVisibleColumns"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <AlertComponent
    v-model="dialogDelete"
    icon="cancel"
    icon-color="negative"
    icon-size="70px"
    title="¿ Eliminar registros?"
    btnColor="negative"
    btnText="Si, eliminar registros"
    @confirm="onDeleteMassive"
    @denegate="selected = []"
  >
    <template #body>
      <span class="text-center col-12"
        >¿ Estas segur@ de eliminar
        {{
          selected.length == 1
            ? 'este registro'
            : 'estos ' + selected.length + ' registros'
        }}
        ?
      </span>
      <br />
      <small
        v-for="({ name }, index) in selected"
        :key="index"
        class="text-negative col-12 text-left q-px-md"
      >
        {{ index + 1 }}. {{ name }}
      </small>
    </template>
  </AlertComponent>

  <AlertComponent
    v-model="dialogUpdateConfirm"
    icon="edit_note"
    icon-color="blue-10"
    icon-size="70px"
    title="¿Actualizar registros?"
    btnColor="blue-10"
    btnText="Si, actualizar registros"
    @confirm="onUpdateMassive"
    @denegate="dialogUpdateConfirm = !dialogUpdateConfirm"
  >
    <template #body>
      <span class="text-center col-12"
        >¿ Estas segur@ de actualizar
        {{ ' estos ' + selected.length + ' registros' }} ?
      </span>
      <q-separator spaced inset dark />

      <div
        style="max-height: 250px; overflow-y: auto"
        class="col-12 q-gutter-sm text-left"
      >
        <div v-for="(item, index) in selected" :key="index">
          <q-checkbox
            dense
            v-model="selected"
            color="negative"
            checked-icon="cancel"
            :label="'' + item.nombre"
            :val="item"
            class="q-mb-sm"
          />
        </div>
      </div>
    </template>
  </AlertComponent>

  <q-dialog v-model="dialogUpdate" persistent>
    <q-card style="min-width: 40%">
      <q-card-section class="bg-grey-3">
        <div class="text-h7">Actualizacion masiva de datos.</div>
      </q-card-section>
      <q-card-section>
        <slot name="updateContent"></slot>
      </q-card-section>
      <q-card-actions align="center" class="bg-grey-3">
        <q-btn
          label="ACTUALIZAR DATOS"
          color="primary"
          @click="confirmUpdate"
        />
        <q-btn
          label="Cancelar"
          color="secondary"
          v-close-popup
          @click="cancelUpdate"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <dialog-component
    v-model="dialogFilter"
    :headerDisabled="false"
    :footerDisabled="false"
    sizeDialog="dialog-sm"
    :loading="loading"
    keep-alive
    ref="filter"
    id="filter"
  >
    <template #header>
      <q-toolbar class="bg-primary">
        <q-icon color="white" size="25px" name="filter_alt" />
        <q-toolbar-title class="text-white"> Filtro avanzado </q-toolbar-title>
        <q-btn dense flat icon="close" v-close-popup class="text-white">
          <q-tooltip class="text-white">Cerrar</q-tooltip>
        </q-btn>
      </q-toolbar>
    </template>
    <template #body>
      <slot name="filterContent"></slot>
    </template>
    <template #footer>
      <q-btn
        color="primary"
        class="q-mr-md"
        icon="search"
        @click="onSubmitFilter"
        >Buscar
      </q-btn>
      <q-btn color="orange" icon="restart_alt" @click="onClearFilter"
        >Limpiar</q-btn
      >
    </template>
  </dialog-component>

  <q-table
    ref="tableRef"
    :style="style"
    row-key="id"
    :rows-per-page-options="[10, 15, 20, 30, 50, 100]"
    :rows-per-page-label="'Registros por página'"
    :rows="rows"
    :columns="columns"
    :visible-columns="visible"
    :filter="search"
    :loading="loading"
    :selected-rows-label="getSelectedString"
    selection="multiple"
    class="my-sticky-header-table"
    v-model:pagination="localPagination"
    v-model:selected="selected"
    :grid="$q.screen.xs || $q.screen.sm"
    @request="onRequest"
    binary-state-sort
    :hide-selected-banner="false"
  >
    <template v-slot:top v-if="!$q.screen.xs">
      <div class="row col-12 justify-between">
        <div
          class="col-xl-2 col-lg-3 col-md-3 col-sm-12 col-xs-12"
          :class="$q.screen.xs ? ' q-mb-md' : ' q-mb-none'"
        >
          <q-form @submit.prevent="onSearch">
            <q-input
              dense
              debounce="0"
              v-model.trim="temporalSearch"
              placeholder="Buscar registro"
              :hint="
                temporalSearch
                  ? `Presione 'Enter' para realizar la busqueda.`
                  : ``
              "
              class="q-pb-none"
            >
              <template v-slot:append>
                <q-icon name="search" v-if="!temporalSearch" />
                <q-icon
                  name="clear"
                  v-else
                  @click="onClearSearching"
                  class="cursor-pointer"
                />

                <q-icon name="help_outline" class="cursor-pointer q-mx-sm">
                  <q-tooltip
                    anchor="center end"
                    self="center left"
                    transition-show="scale"
                    transition-hide="scale"
                    class="bg-primary shadow-2 col-12"
                    style="font-size: 0.7rem"
                  >
                    {{ searchPlaceholder }}
                  </q-tooltip>
                </q-icon>
              </template>
            </q-input>
          </q-form>
        </div>
        <div
          class="row col-12 col-md-auto justify-between q-mb-sm"
          :class="$q.screen.gt.lg ? 'q-gutter-sm' : 'q-gutter-md'"
        >
          <q-btn
            icon="update"
            :color="$q.dark.isActive ? 'grey-3' : 'primary'"
            dense
            flat
            @click="emit('updateData')"
            :label="`${$q.screen.xs ? '' : ''}`"
          >
            <q-tooltip class="bg-primary" :offset="[10, 10]">
              Actualizar
            </q-tooltip>
          </q-btn>
          <q-btn
            icon="view_column"
            :color="$q.dark.isActive ? 'grey-3' : 'primary'"
            dense
            flat
            @click="dialogColumns = !dialogColumns"
            :label="`${$q.screen.xs ? '' : ''}`"
            ><q-tooltip class="bg-primary" :offset="[10, 10]">
              Mostrar/Ocultar Columnas
            </q-tooltip>
          </q-btn>
          <q-btn
            icon="filter_alt"
            :color="$q.dark.isActive ? 'grey-3' : 'primary'"
            dense
            flat
            @click="dialogFilter = !dialogFilter"
            :label="`${$q.screen.xs ? '' : ''}`"
          >
            <q-chip
              size="sm"
              :label="filterCant.length"
              color="orange-7"
              rounded
              v-if="filterCant.length > 0"
            /><q-tooltip class="bg-primary" :offset="[10, 10]">
              Filtro Avanzado
            </q-tooltip>
          </q-btn>
          <slot name="buttons"> </slot>
        </div>
      </div>
      <div class="col-12 q-gutter-sm" v-if="selected.length > 0">
        <q-btn-dropdown
          split
          :color="selected.length == 0 ? 'secondary' : 'primary'"
          label="Eliminar"
          :disable="selected.length == 0"
          size="sm"
          @click="dialogDelete = !dialogDelete"
        >
          <q-list dense>
            <q-item
              clickable
              v-close-popup
              @click="dialogUpdate = !dialogUpdate"
            >
              <q-item-section>
                <q-item-label>Actualizacion masiva</q-item-label>
              </q-item-section>
            </q-item>
            <slot name="massive_actions"></slot>
          </q-list>
        </q-btn-dropdown>
      </div>
    </template>
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th class="text-left">
          <q-checkbox v-model="props.selected" flat dense />
        </q-th>
        <q-th v-for="{ name, label } in props.cols" :key="name" :props="props">
          {{ label }}
        </q-th>
      </q-tr>
    </template>
    <template v-slot:item="props">
      <div
        class="col-xs-12 col-sm-6 grid-style-transition"
        :style="props.selected ? 'transform: scale(0.95);' : ''"
      >
        <q-card
          :class="props.selected ? 'bg-grey-2' : ''"
          class="q-ma-sm"
          v-if="defaultRows"
        >
          <q-card-section>
            <q-checkbox flat v-model="props.selected" dense />
          </q-card-section>
          <q-separator />
          <q-list dense>
            <template v-for="col in props.cols" :key="col.name">
              <q-item>
                <q-item-section>
                  <q-item-label
                    caption
                    :class="$q.dark.isActive ? 'text-white' : 'text-grey'"
                    class="flex item-center"
                    >{{ col.label }}</q-item-label
                  >
                </q-item-section>
                <q-item-section>
                  <a
                    v-if="col.name === 'nombre'"
                    class="text-bold text-accent cursor-pointer flex items-center"
                    @click="onOpenDialogWithID(props.row.id)"
                  >
                    {{ col.value }}
                  </a>
                  <q-item-label
                    caption
                    v-else
                    :class="$q.dark.isActive ? 'text-white' : 'text-black'"
                    style="line-break: anywhere"
                    >{{ col.value }}</q-item-label
                  >
                </q-item-section>
              </q-item>
              <q-separator color="grey-2" />
            </template>
          </q-list>
        </q-card>
        <slot name="item-rows" :propsTable="props" v-else></slot>
      </div>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props" v-if="defaultRows">
        <q-td>
          <q-checkbox v-model="props.selected" flat dense />
        </q-td>
        <q-td v-for="{ name } in props.cols" :key="name" :props="props">
          <a
            v-if="name === 'nombre'"
            class="text-bold cursor-pointer flex items-center"
            @click="onOpenDialogWithID(props.row.id)"
          >
            <q-avatar
              v-if="withAvatar"
              text-color="white"
              :color="props.row.tipo == 'Empresa' ? 'primary' : 'orange'"
              size="24px"
              class="q-mr-sm"
            >
              <!-- {{ returnInitial(props.row.nombre) }} -->
              <q-icon
                :name="props.row.tipo == 'Empresa' ? 'groups' : 'person'"
              />
            </q-avatar>
            <!-- {{props.row.tipo}} -->
            <q-item-section>
              <q-item-label
                lines="5"
                :class="$q.dark.isActive ? 'text-white' : 'text-primary'"
                >{{ props.row[name] }}
              </q-item-label>
              <q-item-label caption class="text-grey">{{
                props.row.tipo
              }}</q-item-label>
            </q-item-section>
          </a>
          <div class="truncate" v-else>
            {{ props.row[name] }}
            <q-tooltip
              :offset="[10, 10]"
              class="bg-primary"
              v-if="JSON.stringify(props.row[name] ?? '').length > 13"
            >
              {{ props.row[name] }}
            </q-tooltip>
          </div>
        </q-td>
      </q-tr>
      <slot name="rows" :propsTable="props" v-else></slot>
    </template>
    <template v-slot:loading>
      <q-inner-loading showing color="primary" label="Cargando..." />
    </template>
    <template v-slot:bottom="props" v-if="$q.screen.sm || $q.screen.xs">
      <q-page-sticky
        position="bottom-right"
        style="z-index: 1"
        :offset="[20, 20]"
      >
        <q-btn fab color="primary" icon="add" @click="$emit('openDialog')" />
      </q-page-sticky>
      <q-footer reveal elevated :props="props" class="bg-white">
        <transition
          enter-active-class="animated zoomIn"
          leave-active-class="animated zoomOut"
        >
          <div
            class="q-pa-sm text-dark bg-white search-toolbar"
            v-show="visibleSearch"
          >
            <q-form @submit.prevent="onSearch">
              <q-input
                dense
                debounce="0"
                v-model.trim="temporalSearch"
                placeholder="Buscar registro"
                :hint="
                  temporalSearch
                    ? `Presione 'Enter' para realizar la busqueda.`
                    : ``
                "
                class="q-pb-none"
              >
                <template v-slot:append>
                  <q-icon name="search" v-if="!temporalSearch" />
                  <q-icon
                    name="clear"
                    v-else
                    @click="onClearSearching"
                    class="cursor-pointer"
                  />

                  <q-icon name="help_outline" class="cursor-pointer q-mx-sm">
                    <q-tooltip
                      anchor="center end"
                      self="center left"
                      transition-show="scale"
                      transition-hide="scale"
                      class="bg-primary shadow-2 col-12"
                      style="font-size: 0.7rem"
                    >
                      {{ searchPlaceholder }}
                    </q-tooltip>
                  </q-icon>
                </template>
              </q-input>
            </q-form>
          </div>
        </transition>

        <q-toolbar class="bg-white text-dark no-border-radius" :props="props">
          <q-btn-dropdown flat round dense dropdown-icon="expand_less">
            <q-list>
              <q-item
                clickable
                v-close-popup
                v-for="item in [10, 15, 20, 30, 50, 100]"
                :key="item"
              >
                <q-item-section>
                  <q-item-label>
                    {{ item }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <span> {{ props.pagination.rowsPerPage }} </span>
          <q-toolbar-title>
            <div class="col-12 row items-center justify-center">
              <q-btn
                v-if="props.pagesNumber > 2"
                icon="first_page"
                color="dark"
                flat
                round
                :disable="props.isFirstPage"
                @click="props.firstPage"
              />

              <q-btn
                icon="chevron_left"
                color="dark"
                flat
                round
                :disable="props.isFirstPage"
                @click="props.prevPage"
              />
              <!-- <div :class="$q.dark.isActive ? 'text-white' : 'text-black'">
                (
                {{
                  (props.pagination.page - 1) * props.pagination.rowsPerPage + 1
                }}
                - {{ props.pagination.rowsPerPage * props.pagination.page }} de
                {{ total }} )
              </div> -->
              <q-btn
                icon="chevron_right"
                color="dark"
                flat
                round
                :disable="props.isLastPage"
                @click="props.nextPage"
              />

              <q-btn
                v-if="props.pagesNumber > 2"
                icon="last_page"
                color="dark"
                flat
                round
                :disable="props.isLastPage"
                @click="props.lastPage"
              />
            </div>
          </q-toolbar-title>
          <q-btn
            flat
            round
            dense
            icon="search"
            class="q-mr-xs"
            @click="visibleSearch = !visibleSearch"
          />
          <q-btn flat round dense icon="more_vert">
            <q-menu style="width: 200px">
              <q-list separator>
                <q-item
                  clickable
                  v-close-popup
                  @click="dialogColumns = !dialogColumns"
                >
                  <q-item-section>Mostrar columnas</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="dialogFilter = !dialogFilter"
                >
                  <q-item-section>Filtro avanzado</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="emit('updateData')">
                  <q-item-section>Refrescar datos</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-toolbar>
      </q-footer>
      <!-- <div class="col-12 row items-center justify-center q-gutter-sm">
        <q-btn
          v-if="props.pagesNumber > 2"
          icon="first_page"
          color="primary"
          dense
          :disable="props.isFirstPage"
          @click="props.firstPage"
        />

        <q-btn
          icon="chevron_left"
          color="primary"
          dense
          :disable="props.isFirstPage"
          @click="props.prevPage"
        />
        <div :class="$q.dark.isActive ? 'text-white' : 'text-black'">
          (
          {{ (props.pagination.page - 1) * props.pagination.rowsPerPage + 1 }} -
          {{ props.pagination.rowsPerPage * props.pagination.page }} de
          {{ total }} )
        </div>
        <q-btn
          icon="chevron_right"
          color="primary"
          dense
          :disable="props.isLastPage"
          @click="props.nextPage"
        />

        <q-btn
          v-if="props.pagesNumber > 2"
          icon="last_page"
          color="primary"
          dense
          :disable="props.isLastPage"
          @click="props.lastPage"
        />
      </div>
       -->
    </template>
    <template v-slot:pagination="scope" v-else>
      <q-btn
        v-if="scope.pagesNumber > 2"
        icon="first_page"
        color="primary"
        dense
        flat
        :disable="scope.isFirstPage"
        @click="scope.firstPage"
      />

      <q-btn
        icon="chevron_left"
        color="primary"
        dense
        flat
        :disable="scope.isFirstPage"
        @click="scope.prevPage"
      />
      <div>
        (
        {{ (scope.pagination.page - 1) * scope.pagination.rowsPerPage + 1 }} -
        {{
          scope.pagination.rowsPerPage * scope.pagination.page > total
            ? total
            : scope.pagination.rowsPerPage * scope.pagination.page
        }}
        de {{ total }} )
      </div>
      <q-btn
        icon="chevron_right"
        color="primary"
        dense
        flat
        :disable="scope.isLastPage"
        @click="scope.nextPage"
      />

      <q-btn
        v-if="scope.pagesNumber > 2"
        icon="last_page"
        color="primary"
        dense
        flat
        :disable="scope.isLastPage"
        @click="scope.lastPage"
      />
    </template>
    <template v-slot:no-data>
      <div class="full-width row flex-center text-primary q-gutter-sm">
        <q-icon size="2em" name="sentiment_dissatisfied" />
        <span> No se encontraron registros. </span>
      </div>
    </template>
  </q-table>
</template>
<script lang="ts">
import { AlertComponent } from '..';
import { base } from '../../modules/Projects/utils/types';
import { toRefs, ref, computed, onMounted } from 'vue';
</script>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    /** Principal data for rendering table */

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rows: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: any[];
    total: number;
    rowsPerPage: number;
    sortBy: string;
    descending: boolean;
    loading: boolean;

    /** Extra props to the funcionality */
    visible: Array<string>;
    withAvatar?: boolean;

    searchPlaceholder: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataFilter: any;
    defaultRows?: boolean;
    style?: string;
  }>(),
  {
    defaultRows: true,
  }
);

const emit = defineEmits([
  'openDialog',
  'update:props',
  'openDetails',
  'submitFilter',
  'clearFilter',
  'deleteMultiple',
  'visibleColumns',
  'updateMultiple',
  'updateData',
]);
const { dataFilter, total, rowsPerPage, sortBy, descending, columns, visible } =
  toRefs(props);

/** Const declare */
const columnsSelected = ref([] as string[]);
const search = ref('');
const selected = ref([] as base[]);
const selectAll = ref(false);
const dialogColumns = ref(false);
const dialogDelete = ref(false);
const dialogUpdate = ref(false);
const dialogUpdateConfirm = ref(false);
const dialogFilter = ref(false);
const temporalSearch = ref('');
const tableRef = ref();
const visibleSearch = ref(false);
const localPagination = ref({
  page: 1,
  sortBy: sortBy,
  descending: descending,
  rowsPerPage: rowsPerPage,
  rowsNumber: total,
});

/** Mounted function */
onMounted(() => {
  getVisibleColumns();
  tableRef.value.requestServerInteraction();
});

/** Functions */
const onSearch = () => {
  search.value = temporalSearch.value;
};

const onClearSearching = () => {
  search.value = '';
  visibleSearch.value = false;
  temporalSearch.value = '';
};

const confirmUpdate = () => {
  dialogUpdateConfirm.value = true;
};

const cancelUpdate = () => {
  selected.value = [];
  dialogUpdate.value = false;
  dialogUpdateConfirm.value = false;
};

const getSelectedString = () => {
  return selected.value.length === 0
    ? ''
    : `${selected.value.length} registro${
        selected.value.length > 1 ? 's' : ''
      } seleccionado${selected.value.length > 1 ? 's' : ''}`;
};

const getVisibleColumns = () => {
  selectAll.value = false;
  columnsSelected.value = visible.value.map((el) => {
    return el;
  });
};

const setAllVisibleColumns = () => {
  columnsSelected.value = [];
  if (selectAll.value) {
    columnsSelected.value = columnsFilter.value.map(
      (el: { [key: string]: string }) => {
        return el.name;
      }
    );
  }
};

/** Computed functions */
const columnsFilter = computed(() => {
  return columns.value.filter((el: base, i: number) => el.name != 'actions');
});

const filterCant = computed(() => {
  return Object.values(dataFilter.value).filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (el: any) =>
      el !== '' && el.length !== 0 && Object.values(el).every((el) => el !== '')
  );
});

/**  Emit functions */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onRequest = (val: any) => {
  const { page } = val.pagination;
  localPagination.value.page = page;
  localPagination.value.sortBy = sortBy.value;
  localPagination.value.descending = descending;
  localPagination.value.rowsPerPage = rowsPerPage;
  localPagination.value.rowsNumber = total;
  val.filter = {
    fastFilter: search.value,
    ...dataFilter.value,
  };
  emit('update:props', val);
};

const onSubmitFilter = () => {
  emit('submitFilter');
  // if (filterCant.value.length > 0) {
  //   emit('submitFilter');
  // } else {
  //   Notification(
  //     'warning',
  //     'warning',
  //     'Debe ingresar al menos una entrada para realizar la búsqueda.'
  //   );
  // }
};

const onClearFilter = () => {
  search.value = '';
  emit('clearFilter');
};

const onDeleteMassive = () => {
  // console.log('registros a eliminar');
  // console.log(selected.value);
  // return;
  emit('deleteMultiple', selected.value);
  selected.value = [];
};

const onUpdateMassive = () => {
  emit('updateMultiple', selected.value);
  selected.value = [];
  dialogUpdate.value = false;
  dialogUpdateConfirm.value = false;
};

const onVisibleColumn = () => {
  emit('visibleColumns', columnsSelected.value);
};

const onOpenDialogWithID = (id: string) => {
  emit('openDetails', id);
};

/**
 * exposes
 */

defineExpose({
  selected,
});
</script>

<style lang="scss" scoped>
.q-menu.q-position-engine {
  max-width: 350px !important;
}
.grid-style-transition {
  transition: transform 0.28s, background-color 0.28s;
}
.q-item__label {
  color: $grey-9;
}
.q-card--dark {
  background: #3d445c;
  .q-item__label {
    color: $grey-6;
  }
  .q-card__section {
    background: #3d445c;
  }
}

.q-table tbody td {
  font-size: 12px;
}
.q-table thead tr,
.q-table tbody td {
  height: 40px !important;
}

.truncate {
  width: 100px;

  /**Major Properties**/
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.box {
  inline-size: 100px;
  overflow-wrap: break-word;
  word-break: break-all;
  white-space: inherit;
}

.column-dialog {
  max-width: 500px;
}
.q-table__container .q-table__middle.scroll {
  max-height: 450px !important;
}

.search-toolbar.show-search {
  display: block;
  height: 50px;
  transition: height 1s;
}

.search-toolbar.hide-search {
  display: none;
  height: 0px;
  transition: height 1s;
}

.my-sticky-header-table {
  /* height or max-height is important */
  height: 310px;

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    background-color: #ffffff;
    box-shadow: 0px 2px 5px 0px #88888839;
  }
  thead tr th {
    position: sticky;
    z-index: 1;
  }
  thead tr:first-child th {
    top: 0;
  }
  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px;
  }
  /* prevent scrolling behind sticky top row on focus */
  tbody {
    /* height of all previous header rows */
    scroll-margin-top: 48px;
  }
}
</style>
