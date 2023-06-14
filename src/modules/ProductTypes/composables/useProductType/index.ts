// vue-quasar-libraries
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

// Global Components
import Notification from 'src/composables/notify';

// typescript types
import { ProductType } from '../../utils/types';

// module files (store,composables,etc)
import { userStore } from 'src/modules/Users/store/UserStore';

// Global properties
import { axios_GLOBAL, axios_NS_07 } from 'src/conections/axiosCRM';
import { Requirement } from '../../../Requirements/utils/types';


// intancia del store
const uStore = userStore();

// composable variables
const localId = ref<string>('');
const isLoading = ref<boolean>(false);
const productTypeData = ref<ProductType>({} as ProductType);
const productRequirements = ref<Requirement[]>([]);
const { userCRM } = storeToRefs(uStore);

// methods

/**
 * Obtener tipo de producto
 * @param id id del tipo de producto
 */
const getProductType = async (id: string) => {
  // llamar a servicio para obtener Tipo de producto por id
};

const assignDefaultValues = () => {
  // Asignar a productTypeData valores por defecto
};

const getDataFromDraft = () => {
  // llamar y asignar a productTypeData si se tiene un borrador(draft) (en el store o en otro lugar)
};

const resetProductTypeData = () => {
  // borrar los datos de localId y productTypeData (o volver a asignar los valores por defecto)
  localId.value = '';
};

const createProductType = async (data: ProductType, reload = false) => {
  // try {
  //   console.log(data);
  //   // llamar a servicio para crear tipo de producto
  //   await axios_NS_07.post('/tipo-productos', data);
  // } catch (error) {
  //   console.log(error);
  // }
};

const updateProductType = (id: string, data: ProductType, reload = false) => {
  try {
    // actualizar tipo de producto por id
  } catch (error) {
    // notificar error
  }
};

const deleteProductType = (id: string) => {
  try {
    // eliminar tipo de producto por id
  } catch (error) {
    // notificar error
  }
};

// asignar responsable de forma independiente
const setUserAssigned = async (module_id: string, assigned_user_id: string) => {
  const data_send = {
    type: 'ProductTypes',
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
export function useProductType(
  id?: string,
  options: { immediate?: boolean; immediateOptions?: boolean } = {}
) {
  const { immediate = false, immediateOptions = false } = options;

  if (!!id && immediate) getProductType(id);
  // if (immediateOptions) getOptions();

  return {
    // * Properties
    localId,
    isLoading,
    productTypeData,
    productRequirements,
    userCRM,

    // * Methods
    assignDefaultValues,
    createProductType,
    deleteProductType,
    getDataFromDraft,
    getProductType,
    resetProductTypeData,
    setUserAssigned,
    updateProductType,
  };
}
