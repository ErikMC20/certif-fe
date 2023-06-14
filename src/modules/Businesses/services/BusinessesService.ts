import {
  FilterForm,
  OpportunitiesResponse,
  ExpiredActivitiesResponse,
} from '../utils/types';
import { axios_NS_01, axios_LB_05 } from 'src/conections/axiosCRM';
import { FilterFormat } from '../utils/types';
import {
  DivisionesModel,
  EstadoMotivoOpportunidadModel,
  GrupoCliente,
  PaisListModel,
  OpportunityType,
  OrigenModel,
} from '../../../components/types/index';

export const useBusinessesService = () => {
  const getBusinesses = async (data: FilterForm) => {
    // [function] call valid businesses

    const { data: dataResponse } = await axios_NS_01.get<
      OpportunitiesResponse[]
    >('/businesses', {
      params: {
        iddivision_c: '03',
        opportunityType: data.opportunityType,
        term: data.nameFilter,
        idamercado_c: '',
        status_opportunity: data.opportunityState,
        idgrupocliente_c: '',
        region_c: '',
        assigned_user_id: '',
        start_date_entered: data.from.replaceAll('/', '-'),
        end_date_entered: data.to.replaceAll('/', '-'),
      },
    });

    return dataResponse;
  };

  const getDetailedOpportunities = async (params: FilterFormat) => {
    // these option aren't required for the request
    // delete params.option_amount;
    // delete params.option_date_closed;
    // delete params.option_date_entered;

    const {
      option_amount,
      option_date_closed,
      option_date_entered,
      ...paramsFormat
    } = params;

    const { data } = await axios_NS_01.get<OpportunitiesResponse[]>(
      '/businesses/advanced-filter',
      {
        params: paramsFormat,
      }
    );

    return data;
  };

  const getExpiredActivities = async (data: FilterForm) => {
    const { data: dataResponse } = await axios_NS_01.get<
      ExpiredActivitiesResponse[]
    >('/businesses/expired-activities', {
      params: {
        iddivision_c: '03',
        opportunityType: data.opportunityType,
        term: data.nameFilter,
        idamercado_c: '',
        status_opportunity: data.opportunityState,
        idgrupocliente_c: '',
        region_c: '',
        assigned_user_id: '',
        start_date_entered: data.from.replaceAll('/', '-'),
        end_date_entered: data.to.replaceAll('/', '-'),
      },
    });

    return dataResponse;
  };

  const getExpiredActivitiesDetailed = async (params: FilterFormat) => {
    const {
      option_amount,
      option_date_closed,
      option_date_entered,
      ...paramsFormat
    } = params;
    const { data: response } = await axios_NS_01.get<
      ExpiredActivitiesResponse[]
    >('/businesses/advanced-expired-activities', {
      params: paramsFormat,
    });

    return response;
  };

  const getOptionsLanguage = async () => {
    return await Promise.all([
      axios_LB_05.get<DivisionesModel[]>(
        '/lang-es-divisiones-org-ventas-lists'
      ),
      axios_LB_05.get<GrupoCliente[]>('lang-es-dimgrupocliente-lists'),
      axios_LB_05.get<PaisListModel[]>('pais-list'),
      axios_LB_05.get<OpportunityType[]>(
        'lang-es-opportunity-type-sales-stage-doms'
      ),
      axios_LB_05.get<OrigenModel[]>('lang-es-dimorigenes-lists'),
      axios_LB_05.get<EstadoMotivoOpportunidadModel[]>(
        'lang-es-hansa-estado-motivo-oportunidad-lists'
      ),
    ]);
  };

  return {
    getBusinesses,
    getDetailedOpportunities,
    getExpiredActivitiesDetailed,
    getExpiredActivities,
    getOptionsLanguage,
  };
};
