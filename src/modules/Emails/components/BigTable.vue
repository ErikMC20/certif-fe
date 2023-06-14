<script>
import { ref } from 'vue';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  ColumnChooser,
  Page,
  Sort,
  Filter,
  Edit,
  Reorder,
  Toolbar,
} from '@syncfusion/ej2-vue-grids';
// import { DropDownButtonComponent } from '@syncfusion/ej2-vue-splitbuttons';
// import { DropDownButtonComponent } from '@syncfusion/ej2-vue-splitbuttons';
// import { ButtonComponent } from '@syncfusion/ej2-vue-buttons';
import { data, dataColumnsBigTable } from '../data/datasource';

export default {
  name: 'BigTable',
  components: {
    'ejs-grid': GridComponent,
    'e-columns': ColumnsDirective,
    'e-column': ColumnDirective,
    // 'ejs-dropdownbutton': DropDownButtonComponent,
  },
  provide: {
    grid: [Page, Sort, Filter, ColumnChooser, Edit, Reorder, Toolbar],
  },
  setup() {
    const pageSettings = ref({ pageSizes: [12, 50, 100, 200], pageCount: 4 });
    const open = ref(false);
    const maximizedToggle = ref(true);
    const filterOptions = ref({ type: 'Menu' });
    const toolbar = ref(['ColumnChooser', 'Search']);
    const editSettings = ref({});
    const selectOptions = ref({ persistSelection: true });

    return {
      data: ref(data.slice(0)),
      items: [
        {
          text: 'Cut',
        },
        {
          text: 'Copy',
        },
        {
          text: 'Paste',
        },
      ],
      maximizedToggle,
      open,
      editSettings,
      pageSettings,
      selectOptions,
      toolbar,
      filterOptions,
      dataColumnsBigTable,
      temporal: (data, event) => {
        event.stopPropagation();
        console.log('your Ship city is: ', data);
      },
      onItemClick: (city) => {
        console.log('another city', city);
      },
    };
  },
};
</script>

<template>
  <q-icon name="print" />

  <ejs-grid
    ref="grid"
    :dataSource="data"
    :allowPaging="true"
    :pageSettings="pageSettings"
    :allowFiltering="true"
    :filterSettings="filterOptions"
    :editSettings="editSettings"
    :selectionSettings="selectOptions"
    :showColumnChooser="true"
    :toolbar="toolbar"
    :allowReordering="true"
    height="365"
  >
    <e-columns>
      <e-column
        field="OrderID"
        isPrimaryKey="true"
        headerText="Order ID"
        textAlign="Right"
        width="90"
      ></e-column>
      <e-column
        field="CustomerID"
        headerText="Customer ID"
        width="120"
      ></e-column>
      <e-column
        field="Freight"
        headerText="Freight"
        textAlign="Right"
        format="C2"
        width="90"
      ></e-column>
      <e-column field="ShipCity" headerText="Ship City" width="150"></e-column>
      <e-column
        headerText="Opciones"
        width="90"
        textAlign="left"
        template="oTemplate"
      ></e-column>
    </e-columns>
    <template v-slot:oTemplate="{ data }">
      <!-- <button @click="(event) => temporal(data.ShipCity, event)">
        <i
          class="q-icon notranslate material-icons"
          aria-hidden="true"
          role="presentation"
          >more_vert</i
        >
      </button> -->

      {{ data.ShipCity }}
      <!-- <ejs-dropdownbutton :items="items" content="Paste"></ejs-dropdownbutton> -->

      <!-- <q-icon name="print" @click="(event) => temporal(data.ShipCity, event)" /> -->

      <!-- <div class="q-pa-md">
        <q-btn-dropdown color="primary" label="Dropdown Button">
          <q-list>
            <q-item clickable v-close-popup @click="onItemClick(data.ShipCity)">
              <q-item-section>
                <q-item-label>Photos</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="onItemClick(data.ShipCity)">
              <q-item-section>
                <q-item-label>Videos</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="onItemClick(data.ShipCity)">
              <q-item-section>
                <q-item-label>Articles</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div> -->
    </template>
  </ejs-grid>
</template>
