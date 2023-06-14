import {
  axios_GLOBAL,
  axios_LB_01,
  axios_LB_05,
} from 'src/conections/axiosCRM';
import { userStore } from 'src/modules/Users/store/UserStore';
import { snakeCase } from 'snake-case';
import { pascalCase } from 'pascal-case';
import { CreateProspectModel, RelationResponse } from './types/index';
import {
  RecordInfoModel,
  RecordInfoModelData,
} from '../components/types/index';

const userCRM = userStore();

function convertObjectToFormat(obj: {
  [key: string]: string | number | null;
}): {
  [key: string]: string | number | null;
} {
  return Object.keys(obj).reduce(
    (acc, cur) => ({
      ...acc,
      [snakeCase(cur)]: obj[cur],
    }),
    {}
  );
}

export async function createModuleRecord<T, A>(module: string, attributes: T) {
  const body = { type: module, attributes };
  try {
    const {
      data: { data },
    } = await axios_GLOBAL.post<{
      data: {
        type: string;
        id: string;
        attributes: object;
        relationships: object;
      };
    }>('/module-new', body);
    console.log(data);
    return { id: data.id, ...data.attributes } as A;
  } catch (error) {
    throw error;
  }
}

export async function createRecord(
  module: string,
  attr: { [key: string]: string }
) {
  const formatAttributes = convertObjectToFormat(attr);
  formatAttributes.created_by = userCRM.userCRM.id;
  const bodyRequest = {
    type: module.charAt(0).toUpperCase() + module.slice(1),
    attributes: formatAttributes,
  };
  try {
    const { data } = await axios_GLOBAL.post<CreateProspectModel>(
      '/module-new',
      bodyRequest
    );

    if (data.status !== 201) {
      throw new Error('se ha producido un error');
    }

    return { id: data.data.id, ...data.data.attributes };
  } catch (error) {
    throw error;
  }
}

export async function getRecordModuleInfo<T>(
  moduleName: string,
  idModule: string,
  options: { allData?: boolean; fields?: string[] } = {}
): Promise<T> {
  const { allData = true, fields = ['name'] } = options;
  const fieldsRecord = fields.length > 1 ? fields : ['name'];
  try {
    if (allData) {
      const { data } = await axios_GLOBAL.get<RecordInfoModelData>(
        `module-get/${moduleName}/${idModule}`
      );
      return { id: data.data.id, ...data.data.attributes } as T;
    }
    const { data } = await axios_GLOBAL.get<RecordInfoModel>(
      `/get-fields-module/${moduleName}/${idModule}/${fieldsRecord.join(',')}`
    );
    return { id: data.data.data.id, ...data.data.data.attributes } as T;
  } catch (error) {
    throw error;
  }
}

export async function updateModuleRecord<T>(
  moduleName: string,
  id: string,
  attributes: T
) {
  try {
    const bodyRequest = {
      type: moduleName,
      id,
      attributes,
    };
    const { data } = await axios_GLOBAL.patch('/module-update', bodyRequest);

    return data;
  } catch (error) {
    throw Error;
  }
}

export async function createRelationBetweenModules(
  fromModule: string,
  fromModuleId: string,
  toModule: string,
  toModuleId: string
) {
  const bodyRequest = {
    module: fromModule,
    id_module: fromModuleId,
    id_user: userCRM.userCRM.id,
    relationship: [
      {
        modulo_related: toModule,
        id_modulo_related: toModuleId,
      },
    ],
  };
  try {
    const { data } = await axios_LB_01.post(
      '/contact-module-relation',
      bodyRequest
    );

    return data;
  } catch (error) {
    throw error;
  }
}

export async function createRelationBetweenModulesV2(
  fromModule: string,
  fromModuleId: string,
  toModule: string,
  toModuleId: string
) {
  const sendBody = {
    type: toModule,
    id: toModuleId,
  };
  try {
    const { data } = await axios_GLOBAL.post(
      '/post-relationships-module-create/' + fromModule + '/' + fromModuleId,
      sendBody
    );

    return data;
  } catch (error) {
    throw error;
  }
}

export async function deletedRelationBetweenModules(
  fromModule: string,
  fromModuleId: string,
  toModule: string,
  toModuleId: string
) {
  try {
    const { data } = await axios_GLOBAL.delete(
      '/deleted-relationships-module/' +
        fromModule +
        '/' +
        fromModuleId +
        '/' +
        toModule +
        '/' +
        toModuleId
    );

    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteModuleRecord(
  module: string,
  moduleId: string,
  userId: string
) {
  try {
    await axios_GLOBAL.delete(`/module-delete/${module}/${moduleId}/${userId}`);
  } catch (error) {
    throw error;
  }
}

export async function getRelationBetweenModules(
  module: string,
  idModule: string,
  fromModule: string
) {
  try {
    const { data } = await axios_LB_01.get<RelationResponse>(
      `/relations/${pascalCase(module)}/${idModule}/${fromModule}`
    );
    return data.data;
  } catch (error) {
    throw error;
  }
}

export const setUserAssigned = async (
  module: string,
  module_id: string,
  assignedUserId: string
) => {
  const data_send = {
    type: module.charAt(0).toUpperCase() + module.slice(1),
    id: module_id,
    attributes: {
      assigned_user_id: assignedUserId,
      modified_user_id: userCRM.userCRM.id,
    },
  };

  try {
    const { data } = await axios_GLOBAL.patch('/module-update', data_send);

    return data.data;
  } catch (error) {
    throw error;
  }
};
