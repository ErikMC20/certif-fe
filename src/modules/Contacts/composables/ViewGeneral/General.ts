import { ref, computed } from 'vue';
import { api } from 'src/boot/axios';
import { DetailAccountModel } from '../../utils/types/index';
import {
  AccountModel,
  OptionBase,
  SelectOptionsModel,
  OptionWithChildren,
} from '../../utils/types/index';

interface DirectionFieldModel {
  id: string;
  label: string;
  cod_dir: string;
}
interface GenericModel {
  [key: string]: string;
}

/**
 * This composable have a lot of features to use with an Input Field
 * @param direction Direction of the client in object mode
 */
export const useDirectionDetailed = () => {
  const directionsAvailable = ref([] as GenericModel[]);
  const activeFields = ref([] as DirectionFieldModel[]);
  const accountDirectionLocal = ref({
    'Av.': '',
    'Zn.': '',
    'Cl.': '',
  } as GenericModel);

  const addField = (id: string) => {
    const newField = directionsAvailable.value.find((val) => val.id === id);
    if (newField) {
      activeFields.value.push({
        id: newField['id'],
        label: newField['label'],
        cod_dir: newField['cod_dir'],
      });
    }
  };

  const removeInput = (id: string) => {
    const addToAvailable = activeFields.value.find((v) => v.id === id);
    if (addToAvailable !== undefined) {
      activeFields.value = activeFields.value.filter((v) => v.id !== id);
      delete accountDirectionLocal.value[addToAvailable?.cod_dir];
    }
  };

  const reviveFields = () => {
    for (const val in accountDirectionLocal.value) {
      const valueToAdd = directionsAvailable.value.find(
        (dir) => dir.cod_dir === val
      );
      console.log('your value founded: ', valueToAdd);
      if (valueToAdd) {
        addField(valueToAdd.id);
      }
    }
  };

  let responseDataDirections = null;
  (async function () {
    responseDataDirections = await api.get(
      `${process.env.CRM4_LB_05}/direcciones-list`
    );
    console.log(responseDataDirections.data);
    directionsAvailable.value = [...responseDataDirections.data];
    reviveFields();
  })();

  const directionsAv = computed(() => {
    return directionsAvailable.value.filter(
      (field) => !activeFields.value.some((f) => f.id === field.id)
    );
  });

  const directionsGenerated = computed(() => {
    const value = [];
    for (const val in accountDirectionLocal.value) {
      value.push(`${val} ${accountDirectionLocal.value[val]}`);
    }
    return value.join(', ');
  });

  return {
    directionsAvailable,
    activeFields,
    accountDirectionLocal,
    directionsGenerated,
    directionsAv,
    addField,
    removeInput,
    reviveFields,
  };
};

export const useLabelsInfo = (
  data: DetailAccountModel,
  options: SelectOptionsModel,
  accountType = 'Privada' as AccountModel
) => {
  const getOptionValue = (
    key: string,
    value: string,
    options: string | OptionBase[] | OptionWithChildren[] | undefined,
    children = ''
  ) => {
    if (typeof options === 'object') {
      const option = options.find((val) => val[key] === value);
      if (children) {
        if (option) {
          return option[children];
        }
      }
      if (option) return option['label'];
    } else {
      return '';
    }
  };

  const getInfoLabels = () => {
    let infoAccountLabels = [];
    if (data === undefined) {
      return [{ title: 'No data', value: 'No Values' }];
    }

    infoAccountLabels = [
      { title: 'Tipo de Cuenta', value: data.tipocuenta_c },
      { title: 'CI/NIT', value: data.nit_ci_c },
      {
        title: 'Tipo Cliente',
        value: getOptionValue(
          'cod_tipo',
          data.account_type,
          options.infoClient.account_type
        ),
      },
      {
        title: 'Regimen Tributario',
        value: getOptionValue(
          'cod_rt',
          data.regimen_tributario_c,
          options.infoClient.regimen_tributario_c
        ),
      },
      {
        title: 'Rubro',
        value: getOptionValue(
          'cod_rubro',
          data.industry,
          options.infoClient.industry
        ),
      },
      {
        title: 'Subrubro',
        value: getOptionValue(
          'cod_subrubro',
          data.subindustry_c,
          getOptionValue(
            'cod_rubro',
            data.industry,
            options.infoClient.industry,
            'subrubro'
          )
        ),
      },
      {
        title: 'Pais',
        value: getOptionValue(
          'cod_pais',
          data.billing_address_country,
          options.infoClient.billing_address_country
        ),
      },
      { title: 'Departamento', value: data.billing_address_state_list_c },
      { title: 'Ciudad', value: data.billing_address_city },
    ];

    if (accountType === 'Empresa') {
      infoAccountLabels = [
        { title: 'Nombre Completo', value: data.name },
        { title: 'Nombre Comercial', value: data.nombre_comercial_c },
        ...infoAccountLabels,
      ];
    } else if (accountType === 'Privada') {
      infoAccountLabels = [
        { title: 'Nombres', value: data.names_c || '' },
        { title: 'Apellidos', value: data.lastname_c || '' },
        ...infoAccountLabels,
      ];
    }

    return infoAccountLabels;
  };

  return {
    getInfoLabels,
  };
};

export const useAccountOptions = () => {
  const options = async () => {
    const [
      documentsList,
      accountType,
      taxRegime,
      industry,
      countries,
      codesCountry,
      directions,
    ] = await Promise.all([
      api.get(`${process.env.CRM4_LB_05}/tipo-documento-list`),
      api.get(`${process.env.CRM4_LB_05}/type-dom-list`),
      api.get(`${process.env.CRM4_LB_05}/regimen-tributario-list`),
      api.get(`${process.env.CRM4_LB_05}/dimrubro-dimsubrubro`),
      api.get(`${process.env.CRM4_LB_05}/pais-list`),
      api.get(`${process.env.CRM4_LB_05}/lang-es-cod-paises-lists`),
      api.get(`${process.env.CRM4_LB_05}/direcciones-list`),
    ]);
    const currentOptions = {
      infoClient: {
        tipo_documento_c: [...documentsList.data],
        account_type: [...accountType.data],
        regimen_tributario_c: [...taxRegime.data],
        industry: [...industry.data],
        billing_address_country: [...countries.data],
      },
      infoDirectionsAccount: [...directions.data],
      infoCodeCountry: codesCountry.data,
    };
    return currentOptions;
  };

  return {
    options,
  };
};
