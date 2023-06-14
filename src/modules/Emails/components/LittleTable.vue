<script>
import { ref } from 'vue';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Edit,
  Sort,
  Filter,
  Toolbar,
  Aggregate,
} from '@syncfusion/ej2-vue-grids';
import { data as orderDetails } from '../data/datasource';

export default {
  components: {
    'ejs-grid': GridComponent,
    'e-columns': ColumnsDirective,
    'e-column': ColumnDirective,
  },
  setup() {
    const data = ref(orderDetails);
    const rowMode = ref('Vertical');
    const editSettings = ref({ allowEditing: true, mode: 'Dialog' });
    const toolbar = ref(['Edit', 'Search']);
    const filterSettings = ref({ type: 'Excel' });
    const orderidRules = ref({ required: true, number: true });
    const customeridrules = ref({ required: true });
    const freightrules = ref({ required: true });
    const myPageSettings = ref({ pageSize: 5 });

    const grid = ref(null);

    return {
      data,
      grid,
      rowMode,
      editSettings,
      toolbar,
      filterSettings,
      orderidRules,
      customeridrules,
      freightrules,
      myPageSettings,
    };
  },
  methods: {
    load: function () {
      this.$refs.grid.$el.ej2_instances[0].adaptiveDlgTarget =
        document.getElementsByClassName('e-mobile-content')[0];
    },
  },

  provide: {
    grid: [Page, Edit, Sort, Filter, Toolbar, Aggregate],
  },
};
</script>

<template>
  <div id="app">
    <div class="e-adaptive-demo e-bigger">
      <div class="e-mobile-layout">
        <div class="e-mobile-content q-mb-xl">
          <ejs-grid
            ref="grid"
            id="adaptivebrowser"
            :dataSource="data"
            height="100%"
            :enableAdaptiveUI="true"
            :allowPaging="true"
            :allowSorting="true"
            :allowFiltering="true"
            :editSettings="editSettings"
            :toolbar="toolbar"
            :filterSettings="filterSettings"
            :load="load"
            :rowRenderingMode="rowMode"
            :pageSettings="myPageSettings"
          >
            <e-columns>
              <e-column
                field="OrderID"
                headerText="Order ID"
                width="180"
                :isPrimaryKey="true"
                :validationRules="orderidRules"
              ></e-column>
              <e-column
                field="Freight"
                headerText="Freight"
                width="180"
                format="C2"
                editType="numericedit"
                :validationRules="freightrules"
              ></e-column>
              <e-column
                field="CustomerID"
                headerText="Customer ID"
                width="180"
                :validationRules="customeridrules"
              ></e-column>
              <e-column
                field="ShipCity"
                headerText="Ship City"
                width="180"
              ></e-column>
            </e-columns>
          </ejs-grid>
        </div>
      </div>
    </div>
  </div>
</template>
