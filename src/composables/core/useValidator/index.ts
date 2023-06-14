interface ValidatorModel {
  fieldRequiredMessage?: string;
}

type InputTypes = number | string | null;

type FieldRequiredFunction = (val: InputTypes) => boolean | string;

type ValidatorTypes = {
  [key: string]: FieldRequiredFunction;
};

// type ruleType = {
//   name: string;
//   value: InputTypes;
// }

export const useCRMValidator = (options: ValidatorModel = {}) => {
  const { fieldRequiredMessage = 'El campo es requerido' } = options;

  const fieldsValidations: ValidatorTypes = {
    fieldRequired: (val: InputTypes): boolean | string => {
      return val ? true : fieldRequiredMessage;
    },
    validName: (val: InputTypes): boolean | string => {
      if (typeof val === 'string') {
        return /[A-z]{2,}/g.test(val) || 'ingrese un nombre valido';
      }
      return 'Campo no valido';
    },
    validLastName: (val: InputTypes): boolean | string => {
      if (typeof val === 'string') {
        return /[\D]{3,}/g.test(val) || 'ingrese un apellido valido';
      }
      return 'Campo no valido';
    },
    validNITCI: (val: InputTypes): boolean | string => {
      if (typeof val === 'string') {
        return /[0-9A-z]{4,}/g.test(val) || 'ingrese un CI/NIT valido';
      }
      return 'Campo no valido';
    },
  };

  function generateValidators(rules: string[] | undefined) {
    if (!rules) return [];
    return rules.map((rule: string) => fieldsValidations[rule]);
  }

  // function generateValidators2(rules: ruleType[] | undefined) {
  //   return !rules ? [] : rules.map()
  // }

  return {
    fieldsValidations,
    generateValidators,
  };
};
