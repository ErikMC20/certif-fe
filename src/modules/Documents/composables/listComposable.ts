
import { ref } from 'vue';
import { DocumentStore } from '../store/DocumentStore';
const { getListDocuments } = DocumentStore();

export const listComposable = () => {
 /**
   * * Datos de prueba
   */
  const loading = ref(false);
  const rows = ref([]);
  const columns = ref([
    {
      name: 'nombre',
      align: 'left',
      label: 'Nombre de documento',
      field: 'nombre',
      sortable: true,
    },
    {
      name: 'contacto',
      align: 'left',
      label: 'Contacto',
      field: 'contacto',
      sortable: true,
    },
  ]);
  const visible = ref([
    'nombre',
    'contacto',
  ]);
  const totalRows = ref<number>(0);
  const getList = async (props: any) => {
    const { pagination, filter } = props;
    const { page, rowsPerPage, sortBy, descending } = pagination;
    rows.value = [];
    loading.value = true;
    const { data, total } = await getListDocuments(
      page,
      rowsPerPage,
      sortBy,
      descending ? 'desc' : 'asc',
      filter ?? ''
    );
    //console.log(total.data);
    loading.value = false;
    totalRows.value = total.data;
    rows.value = data.data;
  };

  /**
   * * Variable y metodo para abrir el dialog
   */
  const open = ref(false);
  const title = ref('');
  const icon = ref('');
  const handleOpen = (data: { title: string; icon: string }) => {
    open.value = !open.value;
    title.value = data.title;
    icon.value = data.icon;
  };

  return {
    rows,
    columns,
    //listInputsFilter,
    totalRows,
    visible,
    loading,
    open,
    title,
    icon,
    handleOpen,
    getList,
  };
};
