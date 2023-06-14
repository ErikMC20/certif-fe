import { ref, computed } from 'vue';
import {
  FieldsModels,
  OptionListModel,
  OptionsExtended,
} from '../utils/types/index';
import {
  AccountModel,
  Option,
  FullForm,
  AccountForm,
} from '../utils/types/index';
import {
  infoClientFieldsCommercial,
  infoClientFieldsPrivate,
  infoClientDirection,
} from '../utils/generated';

export const useInputsForm = (accountType: AccountModel) => {
  const fields =
    accountType === 'Privada'
      ? infoClientFieldsPrivate
      : infoClientFieldsCommercial;

  const fixedFieldsDirection = infoClientDirection.filter(
    (field: FieldsModels) => !field.extraField
  );

  const extraFieldsDirection = ref(
    fixedFieldsDirection.filter((field: FieldsModels) => field.extraField)
  );

  return {
    fields,
    fixedFieldsDirection,
    extraFieldsDirection,
  };
};

export const useCustomForm = (
  optionsList: OptionListModel,
  accountType: AccountModel,
  payload?: FullForm
) => {
  const optionsExtension = ref(optionsList);
  const subCategories = ref({} as OptionListModel);

  const templateContact = ref<FullForm>({} as FullForm);
  const { fields, fixedFieldsDirection, extraFieldsDirection } =
    useInputsForm(accountType);

  if (payload) {
    templateContact.value = { ...payload };
  } else {
    templateContact.value = { tipocuenta_c: accountType } as FullForm;
  }

  const clearData = () => {
    console.log('clearing data');
    templateContact.value = {} as FullForm;
    console.log('', templateContact.value);
  };

  /**
   * Esta funcion obtiene el nombre completo de la key de un objeto que cumpla
   * con la ocurrencia en el parametro occurence, si no lo encuentra devuelve null.
   * @param fieldsObject Un objeto que posiblemente pueda tener la key establecida en occurence.
   * @param occurence Un string que pueda ser parte de fieldsObject.
   * @return la key encontrada de tipo string o null si no existe.
   */
  const getValidKeyWithOccurence = (
    fieldsObject: OptionsExtended,
    occurence: string
  ) => {
    let value = null;
    for (const keyValue in fieldsObject) {
      if (keyValue.includes(occurence)) {
        value = keyValue;
        break;
      }
    }
    return value;
  };

  /**
   * Encuentra la lista desplegable del campo actual
   * @param options Un objeto con la lista de opciones general
   * @param targetValue el valor objetivo para buscar en la lista de opciones general
   * @param subCat si el campo esta definido, elegir la lista de las subcategorias. (se construye la lista de subcategorias)
   */
  const findSelected = (
    options: Option | OptionsExtended[],
    targetValue: string | null,
    subCat: string | null = null
  ) => {
    if (!targetValue) return null;
    if (typeof options !== 'object') return null;
    const optionSelected = options.find(
      (val: OptionsExtended) =>
        val[`${getValidKeyWithOccurence(val, 'cod')}`] === targetValue
    );
    if (subCat) {
      if (optionSelected && typeof optionSelected[`${subCat}`] === 'object') {
        subCategories.value[subCat as keyof typeof subCategories.value] =
          optionSelected[`${subCat}`];
      }
      return optionSelected;
    } else {
      return optionSelected;
    }
  };

  /**
   * Esta funcion obtiene el valor del campo, si es un campo selectivo devuelve el
   * valor actual y asigna la lista de campos anidados al campo seleccionable actual
   * @param fieldName El nombre del campo en el formulario
   * @param fieldType El tipo del campo en el formulario
   * @param value El valor del campo
   * @param childrenName Si el campo es de seleccion multiple y tiene subcategorias
   * (como lista, por tanto es un campo padre) se debe especificar en esta seccion.
   * @param childrenFrom Si el campo es un campo hijo (que su lista de valores depende de otro campo)
   * se debe de especificar aca.
   * @return devuelve el valor seleccionado y modifica la lista del campo hijo si tiene un childrenName
   * asignado.
   */
  const getValueSelect = (
    fieldName: string,
    fieldType: string,
    value: string | object | number | null = null,
    childrenName: string | null = null,
    childrenFrom: string | null = null
  ) => {
    if (!value) return null;
    if (childrenFrom) {
      if (childrenFrom === 'regiones') return value;
      if (typeof value === 'string') {
        return findSelected(subCategories.value[`${childrenFrom}`], value)
          ?.label;
      }
    }

    return fieldType === 'q-select' && typeof value === 'string'
      ? findSelected(
          optionsExtension.value[`${fieldName}`],
          value,
          childrenName
        )?.label
      : value;
  };

  /**
   * Esta funcion limpia los campos hijos si el campo padre cambia de valor
   * @param keySelected El nombre de un key que es un campo padre
   * @returns no retorna nada, modifica los valores del campo hijo.
   */
  const cleanValueByKey = (keySelected: string) => {
    if (keySelected === 'subrubro') {
      templateContact.value.subindustry_c = '';
      return;
    }
    if (keySelected === 'departamento') {
      templateContact.value.billing_address_state_list_c = '';
    }
  };

  const getLabels = computed(() => {
    return fields.map((field: FieldsModels) => {
      return {
        title: field.label,
        value: getValueSelect(
          field.field,
          field.component,
          templateContact.value[field.field as keyof AccountForm],
          field.childrenName,
          field.childrenFrom
        ),
      };
    });
  });

  return {
    fields,
    fixedFieldsDirection,
    extraFieldsDirection,
    getLabels,
    optionsExtension,
    subCategories,
    templateContact,
    clearData,
    findSelected,
    cleanValueByKey,
  };
};
