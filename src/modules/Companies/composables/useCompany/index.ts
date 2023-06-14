// vue-quasar-libraries
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

// Global Components
import Notification from 'src/composables/notify';

// typescript types
import { Company, CompanyDocument } from '../../utils/types';

// module files (store,composables,etc)
import { userStore } from 'src/modules/Users/store/UserStore';

// Global properties
import { axios_GLOBAL, axios_NS_07 } from 'src/conections/axiosCRM';
import { Notify } from 'quasar';

// intancia del store
const uStore = userStore();

// composable variables
const localId = ref<string>('');
const isLoading = ref<boolean>(false);
const companyData = ref<Company>({} as Company);
const companyDocuments = ref<CompanyDocument[]>([])
const { userCRM } = storeToRefs(uStore);

// methods

/**
 * Obtener tipo de producto
 * @param id id del tipo de producto
 */
const getCompany = async (id: string) => {
  // llamar a servicio para obtener empresa por id
  console.log(id);
};

const assignDefaultValues = () => {
  // Asignar a productTypeData valores por defecto
};

const getDataFromDraft = () => {
  // llamar y asignar a productTypeData si se tiene un borrador(draft) (en el store o en otro lugar)
};

const resetCompanyData = () => {
  // borrar los datos de localId y productTypeData (o volver a asignar los valores por defecto)
};

const createCompany = async (data: Company, reload = false) => {
  try {
    data.modified_user_id = userCRM.value.id;
    data.created_by = userCRM.value.id;

    const response = await axios_NS_07.post('/empresas', data);
    if(response.status == 201){
      Notify.create({
        color: 'positive',
        message: 'Se ha creado la empresa correctamente'
      })
    }
    else{
      Notify.create({
        color: 'negative',
        message: 'Ocurrió un error al crear la empresa'
      })
    }
    if (!!reload) {
      console.log(response);
      localId.value = response.data.id;
      await getCompany(response.data.id);
    }
    console.log(response);
  } catch (error) {
    console.log(error)
  }
};


const updateCompany = (id: string, data: Company, reload = false) => {
  try {
    // actualizar tipo de producto por id
  } catch (error) {
    // notificar error
  }
};

const deleteCompany = (id: string) => {
  try {
    // eliminar tipo de producto por id
  } catch (error) {
    // notificar error
  }
};

// asignar responsable de forma independiente
const setUserAssigned = async (module_id: string, assigned_user_id: string) => {
  const data_send = {
    type: 'Companies',
    id: module_id,
    attributes: {
      assigned_user_id: assigned_user_id,
      modified_user_id: userCRM.value.id,
    },
  };

  try {
    const { data } = await axios_GLOBAL.patch('/module-update', data_send);
    Notification(
      'positive',
      'check',
      '<strong>Correcto!</strong> <br/> Se cambió el vendedor principal.'
    );
    return data.data;
  } catch (error) {
    Notification(
      'error',
      'error',
      '<strong>Ops!</strong> <br/> Ocurrió un error.'
    );
    throw error;
  }
};

/**
 * Composable para el modulo de tipo de producto
 * @param id (Optional) id del tipo de producto
 * @param options (Optional) opciones del composable
 * @returns propiedades y funciones para usar en el modulo tipo de producto
 */
export function useCompany(
  id?: string,
  options: { immediate?: boolean; immediateOptions?: boolean } = {}
) {
  const { immediate = false, immediateOptions = false } = options;

  if (!!id && immediate) getCompany(id);
  // if (immediateOptions) getOptions();

  return {
    // * Properties
    localId,
    isLoading,
    companyData,
    companyDocuments,
    userCRM,

    // * Methods
    assignDefaultValues,
    createCompany,
    deleteCompany,
    getDataFromDraft,
    getCompany,
    resetCompanyData,
    setUserAssigned,
    updateCompany,
  };
}
