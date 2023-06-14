import { axiosCRM3 } from 'src/conections/axiosPRY';
import { useStorage } from '@vueuse/core';

const FormatCRM = (language: string) => {
  const fd = new FormData();
  fd.append('method', 'lang_get_options');
  fd.append('input_type', 'JSON');
  fd.append('response_type', 'JSON');
  fd.append('rest_data', JSON.stringify({ lang: language }));
  return fd;
};

const verifyInStore = (name: string) => {
  const store = localStorage.getItem(name);

  if (store !== undefined || store !== null) {
    const storeParse = JSON.parse(store ?? '[]');
    if (storeParse.length > 0) {
      return storeParse;
    }
    return [];
  }
};

export const usePaises = () => {
  const listPaises = useStorage('hansa_pais_list', []);
  const exist = verifyInStore('hansa_pais_list');
  try {
    const getlistPaises = async () => {
      if (exist.length > 0) {
        listPaises.value = exist;
      } else {
        const { data } = await axiosCRM3.post(
          'hansa_pais_list',
          FormatCRM('hansa_pais_list')
        );
        listPaises.value = data;
      }
    };
    return { listPaises, getlistPaises };
  } catch (error) {
    throw error;
  }
};

export const useResponsiblesRoles = () => {
  const listResponsiblesRoles = useStorage('project_user_role_dom', []);
  const exist = verifyInStore('project_user_role_dom');
  try {
    const getlistResponsiblesRoles = async () => {
      if (exist.length > 0) {
        listResponsiblesRoles.value = exist;
      } else {
        const { data } = await axiosCRM3.post(
          '',
          FormatCRM('project_user_role_dom')
        );
        listResponsiblesRoles.value = data;
      }
    };
    return { listResponsiblesRoles, getlistResponsiblesRoles };
  } catch (error) {
    throw error;
  }
};

export const useProjectStatus = () => {
  const listProjectStatus = useStorage('project_status_dom', []);
  const exist = verifyInStore('project_status_dom');
  try {
    const getlistProjectStatus = async () => {
      if (exist.length > 0) {
        listProjectStatus.value = exist;
      } else {
        const { data } = await axiosCRM3.post(
          '',
          FormatCRM('project_status_dom')
        );
        listProjectStatus.value = data;
      }
    };
    return { listProjectStatus, getlistProjectStatus };
  } catch (error) {
    throw error;
  }
};

export const useProjectPriority = () => {
  const listProjectPriority = useStorage('project_priority_options', []);
  const exist = verifyInStore('project_priority_options');
  try {
    const getlistProjectPriority = async () => {
      if (exist.length > 0) {
        listProjectPriority.value = exist;
      } else {
        const { data } = await axiosCRM3.post(
          '',
          FormatCRM('project_priority_options')
        );
        listProjectPriority.value = data;
      }
    };
    return { listProjectPriority, getlistProjectPriority };
  } catch (error) {
    throw error;
  }
};

export const useProjectMetricUnits = () => {
  const listProjectMetricUnits = useStorage(
    'project_metric_units_dom_list',
    []
  );
  const exist = verifyInStore('project_metric_units_dom_list');
  try {
    const getlistProjectMetricUnits = async () => {
      if (exist.length > 0) {
        listProjectMetricUnits.value = exist;
      } else {
        const { data } = await axiosCRM3.post(
          '',
          FormatCRM('project_metric_units_dom_list')
        );
        listProjectMetricUnits.value = data;
      }
    };
    return { listProjectMetricUnits, getlistProjectMetricUnits };
  } catch (error) {
    throw error;
  }
};

export const useRegionales = () => {
  const listRegionales = useStorage('hansa_dimregional_list', []);
  const exist = verifyInStore('hansa_dimregional_list');
  try {
    const getlistRegionales = async () => {
      if (exist.length > 0) {
        listRegionales.value = exist;
      } else {
        const { data } = await axiosCRM3.post(
          '',
          FormatCRM('hansa_dimregional_list')
        );
        listRegionales.value = data;
      }
    };
    return { listRegionales, getlistRegionales };
  } catch (error) {
    throw error;
  }
};

// try {
//   // const [
//   //   listResponsiblesRoles,
//   //   listProjectMetricUnits,
//   //   listProjectStatus,
//   //   listAsignStatus,
//   //   listAsigOpStatus,
//   //   listTaskType,
//   //   listCargStatus,
//   //   listDurationUnits,
//   // ] =

//   const { state } = useAsyncState(async () => {
//     return await Promise.all([
//       axiosCRM3.post('', FormatCRM('project_user_role_dom')),
//       axiosCRM3.post('', FormatCRM('project_metric_units_dom_list')),
//       axiosCRM3.post('', FormatCRM('project_status_dom')),
//       axiosCRM3.post('', FormatCRM('project_asig_status_dom_list')),
//       axiosCRM3.post('', FormatCRM('project_asig_operation_status_dom_list')),
//       axiosCRM3.post('', FormatCRM('project_task_type_list')),
//       axiosCRM3.post('', FormatCRM('project_carg_status_dom_list')),
//       axiosCRM3.post('', FormatCRM('project_duration_units_dom')),
//     ]);
//   }, <any>[]);

//   return {
//     state,
//   };
// } catch (error) {
//   throw error;
// }
