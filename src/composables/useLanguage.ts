import { ref } from 'vue';
import { axios_LB_05, axios_LB_01 } from 'src/conections/axiosCRM';
import moment from 'moment';

const useDivAreaMercado = async (iddivision: string) => {
  try {
    const { data } = await axios_LB_05.get(
      '/lang-es-divisiones-org-ventas-lists'
    );

    if (iddivision == 'todas') {
      const res = data.find(
        (el: { [key: string]: string }) => el.cod_div === ''
      )?.allAmercado;
      return res;
    } else {
      const res = data.find(
        (el: { [key: string]: string }) => el.cod_div === iddivision
      )?.amercado;
      return res;
    }
  } catch (error) {
    throw error;
  }
};

const useAreaMercado = async (iddivision: string) => {
  try {
    const { data } = await axios_LB_05.get(
      '/lang-es-divisiones-org-ventas-lists'
    );

    const res = data.find(
      (el: { [key: string]: string }) => el.cod_div === iddivision
    )?.amercado;

    return res;
  } catch (error) {
    throw error;
  }
};

const useDivision = () => {
  const listDivisiones = ref([]);
  try {
    const getListDivisiones = async () => {
      const { data } = await axios_LB_05.get(
        '/lang-es-divisiones-org-ventas-lists'
      );
      listDivisiones.value = data;
    };
    return { listDivisiones, getListDivisiones };
  } catch (error) {
    throw error;
  }
};

const useGrupoCliente = async (iddivision: string) => {
  try {
    const { data } = await axios_LB_05.get('/lang-es-dimgrupocliente-lists');
    const res = data.find(
      (el: { [key: string]: string }) => el.div === iddivision
    )?.grupo;
    return res;
  } catch (error) {
    throw error;
  }
};

const useRegionales = () => {
  const listRegionales = ref([]);
  try {
    const getRegionales = async () => {
      const { data } = await axios_LB_05.get('/pais-list');
      listRegionales.value = data;
    };

    return {
      listRegionales,
      getRegionales,
    };
  } catch (error) {
    throw error;
  }
};

const useTipoCuenta = () => {
  const listTipoCuenta = ref([]);
  try {
    const getListTipoCuenta = async () => {
      const { data } = await axios_LB_05.get('/tipo-cuenta-list');
      listTipoCuenta.value = data;
    };
    return { listTipoCuenta, getListTipoCuenta };
  } catch (error) {
    throw error;
  }
};

const useTipoCliente = () => {
  const listTipoCliente = ref([]);
  const listAuxiliar = ref([]);
  try {
    const getListTipoCliente = async () => {
      const { data } = await axios_LB_05.get('/type-dom-list');
      listAuxiliar.value = data;
    };

    const filterTipoCliente = (
      val: string,
      update: (callback: () => void) => void
    ) => {
      if (val === '') {
        update(() => {
          listTipoCliente.value = listAuxiliar.value;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        listTipoCliente.value = listAuxiliar.value.filter(
          (v: { [key: string]: string }) =>
            v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    };
    return { listTipoCliente, getListTipoCliente, filterTipoCliente };
  } catch (error) {
    throw error;
  }
};

const useRubro = () => {
  const listRubro = ref([]);
  const listSubrubro = ref([]);
  try {
    const getListRubro = async () => {
      const { data } = await axios_LB_05.get('/dimrubro-dimsubrubro');
      listRubro.value = data;
    };
    const getListSubrubro = async (cod_r: string) => {
      if (cod_r) {
        const { data } = await axios_LB_05.get('/dimrubro-dimsubrubro');
        listSubrubro.value = data.find(
          (el: typeof data) => el.cod_rubro == cod_r
        ).subrubro;
      }
    };

    return { listRubro, listSubrubro, getListRubro, getListSubrubro };
  } catch (error) {
    throw error;
  }
};

const usePais = () => {
  const listPais = ref([]);
  const listRegion = ref([]);
  try {
    const getListPais = async () => {
      const { data } = await axios_LB_05.get('/pais-list');
      listPais.value = data;
    };
    const getListRegion = async (cod_pais: string) => {
      if (cod_pais) {
        const { data } = await axios_LB_05.get('/pais-list');
        listRegion.value = data.find(
          (el: typeof data) => el.cod_pais == cod_pais
        ).regiones;
      }
    };
    return { listPais, listRegion, getListPais, getListRegion };
  } catch (error) {
    throw error;
  }
};

const useUserDivision = () => {
  const listUsers = ref([]);
  const listAuxiliar = ref([]);
  try {
    const getListUsers = async (id_division: string) => {
      const { data } = await axios_LB_01.get(
        `/users_list_division/${id_division == '' ? 'todas' : id_division}`
      );
      listAuxiliar.value = data.data;
      //console.log(listAuxiliar.value);
    };
    const filterUsers = (
      val: string,
      update: (callback: () => void) => void
    ) => {
      if (val === '') {
        update(() => {
          listUsers.value = listAuxiliar.value;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        listUsers.value = listAuxiliar.value.filter(
          (v: { user_name: string }) =>
            v.user_name.toLowerCase().indexOf(needle) > -1
        );
      });
    };
    return { listUsers, getListUsers, filterUsers };
  } catch (error) {
    throw error;
  }
};

const useUserDivisionAmercado = () => {
  const listUsersDM = ref([]);
  const listAuxiliar = ref([]);
  try {
    const getListUsersDM = async (id_division: string, id_amercado: string) => {
      const params = {
        division: id_division,
        a_mercado: id_amercado,
      };
      const { data } = await axios_LB_01.get(
        `/users/division/amercado?params=${JSON.stringify(params)}`
      );
      listAuxiliar.value = data.data;
    };
    const filterUsers = (
      val: string,
      update: (callback: () => void) => void
    ) => {
      if (val === '') {
        update(() => {
          listUsersDM.value = listAuxiliar.value;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        listUsersDM.value = listAuxiliar.value.filter(
          (v: { user_name: string }) =>
            v.user_name.toLowerCase().indexOf(needle) > -1
        );
      });
    };
    return { listUsersDM, getListUsersDM, filterUsers };
  } catch (error) {
    throw error;
  }
};

const useAccountsByNameNitCodaio = () => {
  const listAccounts = ref([]);
  try {
    const filterAccounts = (
      val: string,
      update: (callback: () => void) => void
    ) => {
      if (val === '') {
        update(() => {
          listAccounts.value = [];
        });
        return;
      }

      update(async () => {
        if (val.length > 3) {
          const { data } = await axios_LB_01.get(
            `/accounts/search?params=${JSON.stringify({ filter: val })}`
          );
          listAccounts.value = data.data;
        }
      });
    };
    return { listAccounts, filterAccounts };
  } catch (error) {
    throw error;
  }
};

const useTipoDocumento = () => {
  const listTipoDocumento = ref([]);
  try {
    const getListTipoDocumento = async () => {
      const { data } = await axios_LB_05.get('/tipo-documento-list');
      listTipoDocumento.value = data;
      //console.log(data);
    };

    return { listTipoDocumento, getListTipoDocumento };
  } catch (error) {
    throw error;
  }
};

const useRegimenTributario = () => {
  const listRegimenTributario = ref([]);
  try {
    const getListRegimenTributario = async () => {
      const { data } = await axios_LB_05.get('/regimen-tributario-list');
      listRegimenTributario.value = data;
    };

    return { listRegimenTributario, getListRegimenTributario };
  } catch (error) {
    throw error;
  }
};

const useDateRange = () => {
  const listDateRange = ref([]);
  try {
    const getListDateRange = async () => {
      const { data } = await axios_LB_05.get(
        '/lang-es-date-range-search-dom-lists'
      );
      listDateRange.value = data.filter(
        (el: { value: string }) => !el.value.includes('next_')
      );
      // console.log(listDateRange.value);
    };

    return { listDateRange, getListDateRange };
  } catch (error) {
    throw error;
  }
};

const getDateMoment = () => {
  const unaSemana = {
    from: moment().subtract(7, 'days').format('DD-MM-YYYY'),
    to: moment().format('DD-MM-YYYY'),
  };
  const ultimos30dias = {
    from: moment().subtract(30, 'days').format('DD-MM-YYYY'),
    to: moment().format('DD-MM-YYYY'),
  };
  const esteMes = {
    from: moment().startOf('month').format('DD-MM-YYYY'),
    to: moment().endOf('month').format('DD-MM-YYYY'),
  };
  const mesPasado = {
    from: moment().subtract(1, 'month').startOf('month').format('DD-MM-YYYY'),
    to: moment().subtract(1, 'month').endOf('month').format('DD-MM-YYYY'),
  };
  const primerTrimestre = {
    from: moment().month('January').startOf('month').format('DD-MM-YYYY'),
    to: moment().month('March').endOf('month').format('DD-MM-YYYY'),
  };
  const segundoTrimestre = {
    from: moment().month('April').startOf('month').format('DD-MM-YYYY'),
    to: moment().month('June').endOf('month').format('DD-MM-YYYY'),
  };
  const tercerTrimestre = {
    from: moment().month('July').startOf('month').format('DD-MM-YYYY'),
    to: moment().month('September').endOf('month').format('DD-MM-YYYY'),
  };
  const cuartoTrimestre = {
    from: moment().month('Octuber').startOf('month').format('DD-MM-YYYY'),
    to: moment().month('December').endOf('month').format('DD-MM-YYYY'),
  };
  const gestionPresente = {
    from: moment().startOf('year').format('DD-MM-YYYY'),
    to: moment().endOf('year').format('DD-MM-YYYY'),
  };
  const gestionPasada = {
    from: moment().subtract(1, 'year').startOf('year').format('DD-MM-YYYY'),
    to: moment().subtract(1, 'year').endOf('year').format('DD-MM-YYYY'),
  };

  const date = moment().startOf('month').format('DD-MM-YYYY');
  return {
    date,
    unaSemana,
    esteMes,
    mesPasado,
    primerTrimestre,
    segundoTrimestre,
    tercerTrimestre,
    cuartoTrimestre,
    gestionPasada,
    gestionPresente,
    ultimos30dias,
  };
};

const useCampignStatus = () => {
  const listCampaignStatus = ref([]);
  try {
    const getListEstadoCampaña = async () => {
      const { data } = await axios_LB_05.get(
        '/lang-es-campaign-status-dom-lists'
      );
      listCampaignStatus.value = data;
    };

    return { listCampaignStatus, getListEstadoCampaña };
  } catch (error) {
    throw error;
  }
};

const useCampaignType = () => {
  const listCampaignType = ref([]);
  try {
    const getListTipoCampaña = async () => {
      const { data } = await axios_LB_05.get(
        '/lang-es-campaign-type-dom-lists'
      );
      listCampaignType.value = data;
    };

    return { listCampaignType, getListTipoCampaña };
  } catch (error) {
    throw error;
  }
};

const useGenderList = () => {
  const listGender = ref([]);
  try {
    const getListGeneros = async () => {
      const { data } = await axios_LB_05.get('/gender-lists');
      listGender.value = data;
    };

    return { listGender, getListGeneros };
  } catch (error) {
    throw error;
  }
};

const useProspectStatus = () => {
  const listProspectStatus = ref([]);
  try {
    const getListProspectStatus = async () => {
      const { data } = await axios_LB_05.get('/lang-es-lead-status-dom-lists');
      listProspectStatus.value = data;
    };

    return { listProspectStatus, getListProspectStatus };
  } catch (error) {
    throw error;
  }
};

const useProspectSource = () => {
  const listProspectSource = ref([]);
  try {
    const getListProspectSource = async () => {
      const { data } = await axios_LB_05.get('/lead-source-dom-lists');
      listProspectSource.value = data;
    };

    return { listProspectSource, getListProspectSource };
  } catch (error) {
    throw error;
  }
};
//para el rango de fechas de creacion fernando
const useDateRangeFilter = () => {
  const listRangeDateFilter = ref([]);
  try {
    const getDateRangeFilter = async () => {
      const { data } = await axios_LB_05.get('/lang-es-date-filter-lists');
      listRangeDateFilter.value = data;
    };

    return { listRangeDateFilter, getDateRangeFilter };
  } catch (error) {
    throw error;
  }
};

export {
  useTipoCuenta,
  useTipoCliente,
  useRubro,
  usePais,
  useUserDivision,
  useTipoDocumento,
  useRegimenTributario,
  useDivision,
  useAreaMercado,
  useUserDivisionAmercado,
  useAccountsByNameNitCodaio,
  useDateRange,
  useDivAreaMercado,
  useCampignStatus,
  useCampaignType,
  useGenderList,
  useProspectStatus,
  useProspectSource,
  getDateMoment,
  useDateRangeFilter,
  useGrupoCliente,
  useRegionales,
};
