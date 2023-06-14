import { DirectionAccountComponentModel } from './../utils/types/index';
import { ref, computed } from 'vue';

interface DirectionValueModel {
  id: string;
  label: string;
  cod_dir: string;
  value?: string;
}

/**
 * This composable is assigned to work hand to hand with a Direction generator component
 * @param options A Plain Array of data fetched from backend
 * @param sendValueToParent A function that will activate an emit function in the parent with
 * a new value
 * @returns Util function and reactive function ready to use in a component
 */
export function useInputDirection(
  value = '',
  options: DirectionValueModel[],
  sendValueToParent: (value: DirectionAccountComponentModel) => void
) {
  const detailedVersion = ref(true);
  const directionValueAuto = ref('');

  const defaultValueDetailed = [
    {
      id: '62c637a821311d23fa311c57',
      label: 'Avenida',
      cod_dir: 'Av.',
      value: '',
    },
    {
      id: '62c637a821311d23fa311c7c',
      label: 'Zona',
      cod_dir: 'Zn.',
      value: '',
    },
    {
      id: '62c637a821311d23fa311c5b',
      label: 'Calle',
      cod_dir: 'Cl.',
      value: '',
    },
    {
      id: '62e19c6565e3f619e5a29c57',
      label: 'Número',
      cod_dir: 'Nro.',
      value: '',
    },
  ];

  const directionsValueLocal = ref(
    defaultValueDetailed as DirectionValueModel[]
  );

  const addNewInput = (id: string) => {
    const newDirection = options.find((val) => val.id === id);
    if (newDirection) {
      directionsValueLocal.value.push({ ...newDirection, value: '' });
    }
  };

  const removeInputNew = (id: string) => {
    directionsValueLocal.value = directionsValueLocal.value.filter(
      (val) => val.id !== id
    );
  };

  const availableInputs = computed(() => {
    return options.filter(
      (val) => !directionsValueLocal.value.some((v) => v.id === val.id)
    );
  });

  const updateInputPerCode = (val: string) => {
    const newInput = options.find((v) => v.cod_dir === val);
    if (newInput)
      directionsValueLocal.value = directionsValueLocal.value.map((value) => {
        if (value.cod_dir === newInput.cod_dir) {
          return {
            id: newInput.id,
            label: newInput.label,
            cod_dir: newInput.cod_dir,
            value: '',
          };
        }
        return value;
      });
  };

  const searchByCode = (code_dir: string) =>
    options.filter((option) => option.cod_dir === code_dir)[0];

  const addInputPerCode = (value: string) => {
    const [cod_dirGen, ...restValues] = value.trim().split(' ');
    const newInput = searchByCode(cod_dirGen);
    if (newInput)
      directionsValueLocal.value.push({
        ...newInput,
        value: restValues.join(' '),
      });
  };

  const generatedDirection = computed(() => {
    const plainDirection = [];
    for (const val in directionsValueLocal.value) {
      plainDirection.push(
        `${directionsValueLocal.value[val].cod_dir} ${directionsValueLocal.value[val].value}`
      );
    }

    if (detailedVersion.value)
      sendValueToParent({
        address_street_generated_c: `${plainDirection.join(', ')}_gnrtd`,
        latitude: 0,
        longitude: 0,
      });
    return `${plainDirection.join(', ')}_gnrtd`;
  });

  const generatedDirectionView = computed(() => {
    return generatedDirection.value.replace('_gnrtd', '');
  });

  const reviveDetailed = (value: string) => {
    const plainValue1 = value.split('_')[0];
    const values = plainValue1.split(',');
    for (const v in values) {
      addInputPerCode(values[v]);
    }
  };

  (function () {
    if (!value) return;
    if (value && value.includes('_gnrtd')) {
      detailedVersion.value = true;
      directionsValueLocal.value = [];
      reviveDetailed(value);
    } else {
      detailedVersion.value = false;
      directionValueAuto.value = value || '';
      sendValueToParent({
        address_street_generated_c: value || '',
        longitude: 0,
        latitude: 0,
      });
    }
  })();

  return {
    availableInputs,
    detailedVersion,
    directionValueAuto,
    defaultValueDetailed,
    directionsValueLocal,
    generatedDirection,
    generatedDirectionView,
    addInputPerCode,
    addNewInput,
    removeInputNew,
    reviveDetailed,
    updateInputPerCode,
  };
}
