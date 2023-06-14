import { DirectionComponentModel } from '../../components/types';
import { ref, computed } from 'vue';
import { useAsyncState } from '@vueuse/core';
import { api } from 'src/boot/axios';
import { CRM4_LB_05 } from 'src/conections/api_conectors';

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
  value: string | null,
  options: DirectionValueModel[],
  sendValueToParent: (value: DirectionComponentModel) => void
) {
  const detailedVersion = ref(true);
  const directionValueAuto = ref('');

  const defaultValueDetailed = [
    {
      id: '630cb3c2a7b32ccdda259656',
      label: 'Avenida',
      cod_dir: 'Av/',
      value: '',
    },
    {
      id: '630cb3c2a7b32ccdda259695',
      label: 'Zona',
      cod_dir: 'Z/',
      value: '',
    },
    {
      id: '630cb3c2a7b32ccdda25965a',
      label: 'Calle',
      cod_dir: 'C/',
      value: '',
    },
    {
      id: '630cb3c2a7b32ccdda259673',
      label: 'Número Domicilio',
      cod_dir: '#.',
      value: '',
    },
  ];

  const directionsValueLocal = ref(
    defaultValueDetailed as DirectionValueModel[]
  );

  const {
    state: optionsVal,
    isLoading,
    execute,
  } = useAsyncState(
    api.get(`${CRM4_LB_05}/direcciones-list`).then((res) => res.data),
    [] as DirectionValueModel[]
  );

  const addNewInput = (id: string) => {
    const newDirection = optionsVal.value.find(
      (val: { id: string }) => val.id === id
    );
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
    return optionsVal.value.filter(
      (val: { id: string }) =>
        !directionsValueLocal.value.some((v) => v.id === val.id)
    );
  });

  const updateInputPerCode = (val: string) => {
    const newInput = optionsVal.value.find(
      (v: { cod_dir: string }) => v.cod_dir === val
    );
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
    optionsVal.value.filter(
      (option: { cod_dir: string }) => option.cod_dir === code_dir
    )[0];

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
        address_street_generated_c: `${plainDirection.join(',| ')}_gnrtd`,
        latitude: 0,
        longitude: 0,
      });
    return `${plainDirection.join(',| ')}_gnrtd`;
  });

  const generatedDirectionView = computed(() => {
    return generatedDirection.value.replace('_gnrtd', '').replaceAll(',|', '');
  });

  const reviveDetailed = (value: string) => {
    const plainValue1 = value.split('_')[0];
    const values = plainValue1.split(',|');
    for (const v in values) {
      addInputPerCode(values[v]);
    }
  };

  (async function () {
    if (!value) return;
    if (value && value.includes('_gnrtd')) {
      await execute();
      detailedVersion.value = true;
      directionsValueLocal.value = [];
      // optionsLocal.value = options;
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
    isLoading,
    addInputPerCode,
    addNewInput,
    removeInputNew,
    reviveDetailed,
    updateInputPerCode,
  };
}
