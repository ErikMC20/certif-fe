import { ref, computed } from 'vue';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Sort,
  Filter,
} from '@syncfusion/ej2-vue-grids';
import { useQuasar } from 'quasar';
// import { loadCldr } from '@syncfusion/ej2-base';

import { data } from '../../data/datasource';
import SimpleCompVue from './SimpleComp.vue';
import DialogComponent from 'src/components/MainDialog/DialogComponent.vue';

export default {
  name: 'TableComponent',
  components: {
    'ejs-grid': GridComponent,
    'e-columns': ColumnsDirective,
    'e-column': ColumnDirective,
    DialogComponent,
  },
  provide: {
    grid: [Page, Sort, Filter],
  },
  setup() {
    const $q = useQuasar();
    const pageSettings = ref({ pageSize: 10 });
    const dialog = ref(true);
    const open = ref(false);
    const maximizedToggle = ref(true);
    const filterOptions = ref({ type: 'Menu' });

    const simpleRow = () => {
      return {
        template: SimpleCompVue,
      };
    };

    const dialogHandler = () => {
      console.log('opening....');
      open.value = !open.value;
    };

    const dd = (OrderID = 'nada') => {
      console.log('your order id is: ', OrderID);
    };

    console.log(SimpleCompVue);

    const onlyRow = ref(simpleRow);

    return {
      data,
      dialog,
      maximizedToggle,
      open,
      pageSettings,
      filterOptions,
      dialogHandler,
      simpleRow,
      onlyRow,
      dd,
    };
  },
};
