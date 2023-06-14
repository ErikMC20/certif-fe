import { defineComponent, ref } from 'vue';
import DialogComponent from 'src/components/MainDialog/DialogComponent.vue';
// import {
//   ColumnDirective,
//   GridComponent,
//   ColumnsDirective,
//   Page,
// } from '@syncfusion/ej2-vue-grids';
// import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
const SERVICE_URI =
  'https://ej2services.syncfusion.com/production/web-services/';

export default defineComponent({
  components: {
    // 'ejs-grid': GridComponent,
    // 'e-columns': ColumnsDirective,
    // 'e-column': ColumnDirective,
    DialogComponent,
  },
  setup() {
    // const data = new DataManager({
    //   url: SERVICE_URI + 'api/Orders',
    //   adaptor: new WebApiAdaptor(),
    // });
    const pageSettings = { pageCount: 3 };
    return {
      // data,
      pageSettings,
    };
  },
  provide: {
    // grid: [Page],
  },
});
