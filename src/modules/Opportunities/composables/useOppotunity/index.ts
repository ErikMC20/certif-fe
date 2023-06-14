import { ref, computed, watch } from 'vue';
import moment from 'moment';
import { Notify } from 'quasar';
import { useFormOptionsStore } from 'src/stores/formOptionsStore';
import { storeToRefs } from 'pinia';
import { useOpportunitiesService } from '../../services/OpportunitiesService';
import { createModuleRecord, deleteModuleRecord, getRecordModuleInfo } from 'src/services/GlobalService';
import { OpportunityGlobal } from '../../utils/types';
import { userStore } from 'src/modules/Users/store/UserStore';
import { OpportunityType } from 'src/components/types';
import { updateModuleRecord } from 'src/services/GlobalService';
import { axios_LB_05 } from 'src/conections/axiosCRM';
import { currencyOptions, aCuentaDeOptions, tipoFinanciamientoOptions } from '../../utils/DummyOptions';
import { useOpportunitiesStore } from '../../store/OpportunitiesStore';


const languageStore = useFormOptionsStore();
const uStore = userStore()
const {
  opportunityTypeAll,
  grupoCliente,
  divisionsSales,
  countries,
  opportunityState,
  origin,
  dimBanco,
} = storeToRefs(languageStore);
const opportunityStore = useOpportunitiesStore()
const { draft: opportunityDraft } = storeToRefs(opportunityStore)
const { userCRM } = storeToRefs(uStore);
const { setUserAssigned, getOpportunity } = useOpportunitiesService();

const localId = ref<string>('');
const isLoading = ref<boolean>(false);
const opportunityGlobalData = ref<OpportunityGlobal>({} as OpportunityGlobal);
const opportunityOptions = ref<OpportunityType[]>([]);

//* methods
const assignDefaultValues = () => {
  opportunityGlobalData.value = {
    iddivision_c: userCRM.value.iddivision,
    idamercado_c: userCRM.value.idamercado,
    idgrupocliente_c: '',
    date_closed: moment().add(1, 'M').format('DD-MM-YYYY'),
    currency_id: '-99',
    region_c: '01_01',
    acuenta_de_c: 'Hansa',
    estado_oportunidad_c: 'EnTratamiento',
    opportunity_type: '03_01_Hansa',
    sales_stage: '03_01_Identificacion',
  } as OpportunityGlobal
}

// tipo de op por division
const setOppotunityOptions = (div: string) => {
  opportunityOptions.value = opportunityTypeAll.value.filter(
    (opp) => opp.div === div
  );
};

const resetOpportunityData = () => {
  localId.value = '';
  opportunityGlobalData.value = {} as OpportunityGlobal
};

const loadConfiguration = async () => {
  try {
    isLoading.value = true;
    await languageStore.getOpportunityOptions();
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};

const createOpportunity = async (data: OpportunityGlobal, reload = false) => {
  try {
    data.modified_user_id = userCRM.value.id;
    data.created_by = userCRM.value.id;

    // * Changing date format
    if (!!data.fecha_entrega_c) {
      data.fecha_entrega_c = moment(data.fecha_entrega_c, 'DD-MM-YYYY').format('YYYY-MM-DD')
    }
    if (!!data.date_closed) {
      data.date_closed = moment(data.date_closed, 'DD-MM-YYYY').format('YYYY-MM-DD')
    }

    const response = await createModuleRecord<OpportunityGlobal, OpportunityGlobal>('Opportunities', data);
    Notify.create({
      color: 'positive',
      message: 'Se ha creado la oportunidad correctamente'
    })
    if (!!reload) {
      console.log(response);
      localId.value = response.id;
      await getOpportunityGlobal(response.id);
    }
    console.log(response);
  } catch (error) {
    Notify.create({
      color: 'error',
      message: 'Ha ocurrido un error al crear la oportunidad'
    })
  }
}

const getOpportunityGlobal = async (id: string, disableLoading = false): Promise<OpportunityGlobal> => {
  try {
    if (!disableLoading) isLoading.value = true;
    const response = await getRecordModuleInfo<OpportunityGlobal>('Opportunities', id, { allData: true });
    // Notify.create({
    //   color: 'positive',
    //   message: 'Se ha obtenido los datos de la oportunidad'
    // })
    localId.value = response.id;

    // * Changing date format
    if (!!response.fecha_entrega_c) {
      response.fecha_entrega_c = moment(response.fecha_entrega_c, 'YYYY-MM-DD').format('DD-MM-YYYY')
    }

    if (!!response.date_closed) {
      response.date_closed = moment(response.date_closed, 'YYYY-MM-DD').format('DD-MM-YYYY')
    }

    opportunityGlobalData.value = response;
    return response;
  } catch (error) {
    console.log('An error', error)
    Notify.create({
      color: 'error',
      message: 'Ha ocurrido un error al obtener los datos'
    })
    throw error;
  } finally {
    if (!disableLoading) isLoading.value = false;
  }
}

const updateOpportunity = async (id: string, data: OpportunityGlobal, reload = false) => {
  try {
    data.modified_user_id = userCRM.value.id;

    // * Changing date format
    if (!!data.fecha_entrega_c) {
      data.fecha_entrega_c = moment(data.fecha_entrega_c, 'DD-MM-YYYY').format('YYYY-MM-DD')
    }
    if (!!data.date_closed) {
      data.date_closed = moment(data.date_closed, 'DD-MM-YYYY').format('YYYY-MM-DD')
    }

    const response = await updateModuleRecord<OpportunityGlobal>('Opportunities', id, data);
    Notify.create({
      color: 'positive',
      message: 'Se ha actualizado la oportunidad'
    })
    if (!!reload) {
      await getOpportunityGlobal(id)
    }
    console.log(response);
  } catch (error) {
    Notify.create({
      color: 'error',
      message: 'Ha ocurrido un error al actualizar los datos'
    })
  }
}

const deleteOpportunity = async (id: string) => {
  try {
    console.log('doing this...');
    const response = await deleteModuleRecord('Opportunities', id, userCRM.value.id);
    Notify.create({
      color: 'warning',
      message: 'Se ha eliminado la oportunidad'
    })
  } catch (error) {
    Notify.create({
      color: 'error',
      message: 'Ha ocurrido un error al eliminar la oportunidad'
    })
  }
}

const getDataFromDraft = () => {
  opportunityGlobalData.value = opportunityDraft.value;
}

const getOptions = async () => {
  const [
    divisions,
    dimGrupoCliente,
    pais,
    opportunityType,
    estadoMotivo,
    origen,
    dimBancoOpp,
  ] = await Promise.all([
    axios_LB_05.get('/lang-es-divisiones-org-ventas-lists'),
    axios_LB_05.get('/lang-es-dimgrupocliente-lists'),
    axios_LB_05.get('/pais-list'),
    axios_LB_05.get('/lang-es-opportunity-type-sales-stage-doms'),
    axios_LB_05.get('/lang-es-hansa-estado-motivo-oportunidad-lists'),
    axios_LB_05.get('/lang-es-dimorigenes-lists'),
    axios_LB_05.get('/lang-es-hansa-dimbanco-lists'),
  ]);

  //* data to formOptionsStore's state
  divisionsSales.value = divisions.data;
  grupoCliente.value = dimGrupoCliente.data;
  countries.value = pais.data;
  opportunityTypeAll.value = opportunityType.data;
  opportunityState.value = estadoMotivo.data;
  origin.value = origen.data;
  dimBanco.value = dimBancoOpp.data
}


export function useOpportunity(id?: string, options: { immediate?: boolean, immediateOptions?: boolean } = {}) {
  const { immediate = false, immediateOptions = false } = options;
  // console.log(id);

  if (!!id && immediate) getOpportunityGlobal(id);
  if (immediateOptions) getOptions();

  return {
    // * Properties
    isLoading,
    localId,
    opportunityOptions,
    opportunityGlobalData,
    userCRM,
    opportunityDraft,

    divisionsSales,
    grupoCliente,
    countries,
    opportunityTypeAll,
    opportunityState,
    origin,
    dimBanco,
    currencyOptions,
    aCuentaDeOptions,
    tipoFinanciamientoOptions,
    //

    // * Getters
    // phases: computed(() => languageStore.OpportunityOptions),
    infoTempData: computed((): OpportunityGlobal => {
      const isOpportunityValid = !!opportunityGlobalData.value && Object.keys(opportunityGlobalData.value).length > 0;
      if (isOpportunityValid) {
        const {
          iddivision_c,
          idamercado_c,
          name,
          idgrupocliente_c,
          account_id,
          contact_id_c,
          currency_id,
          amount,
          region_c,
          provmunicipio_c,
          date_closed,
          acuenta_de_c,
          opportunity_type,
          cuce_c,
          sales_stage,
          estado_oportunidad_c,
          probability,
          motivo_c,
          origen_c,
          next_step,
          prob_proyecto_c,
          campaign_id,
          description,
          country_c,
          campaign_name
        } = opportunityGlobalData.value

        return {
          iddivision_c,
          idamercado_c,
          name,
          idgrupocliente_c,
          account_id,
          contact_id_c,
          currency_id,
          amount,
          region_c,
          provmunicipio_c,
          date_closed,
          acuenta_de_c,
          opportunity_type,
          cuce_c,
          sales_stage,
          estado_oportunidad_c,
          probability,
          motivo_c,
          origen_c,
          next_step,
          prob_proyecto_c,
          campaign_id,
          description,
          country_c,
          campaign_name
        } as OpportunityGlobal
      }
      return {} as OpportunityGlobal
    }),
    otherInfoData: computed((): OpportunityGlobal => {
      const isOpportunityValid = !!opportunityGlobalData.value && Object.keys(opportunityGlobalData.value).length > 0;
      if (isOpportunityValid) {
        const {
          tipofinanciamiento_c,
          entidadbancaria_c,
          fecha_entrega_c,
          ejecutivobanco_c
        } = opportunityGlobalData.value;
        return {
          tipofinanciamiento_c,
          entidadbancaria_c,
          fecha_entrega_c,
          ejecutivobanco_c
        } as OpportunityGlobal;
      }

      return {} as OpportunityGlobal
    }),
    salesCriteriaData: computed((): OpportunityGlobal => {
      const isOpportunityValid = !!opportunityGlobalData.value && Object.keys(opportunityGlobalData.value).length > 0;
      if (isOpportunityValid) {
        const {
          esta_presupuestado_c,
          monto_proyecto_c,
          hana_proyectocuenta_opportunities_name,
          desafios_cliente_c,
          prioridades_cliente_c,
          idcampeon_c,
          idtomador_c,
          contact_id1_c,
          campeon_descripcion_c,
          contact_id2_c,
          tomador_descripcion_c,
          descripcion_problema_c,
          descripcion_solucion_c,
          proceso_aprobacion_c,
          evento_cierre_c,
          historias_exito_c,
          caso_financiero_c,
          competidores_c,
          marca_interes_c
        } = opportunityGlobalData.value
        return {
          esta_presupuestado_c,
          monto_proyecto_c,
          hana_proyectocuenta_opportunities_name,
          desafios_cliente_c,
          prioridades_cliente_c,
          idcampeon_c,
          contact_id1_c,
          idtomador_c,
          contact_id2_c,
          campeon_descripcion_c,
          tomador_descripcion_c,
          descripcion_problema_c,
          descripcion_solucion_c,
          proceso_aprobacion_c,
          evento_cierre_c,
          historias_exito_c,
          caso_financiero_c,
          competidores_c,
          marca_interes_c
        } as OpportunityGlobal;
      }
      return {} as OpportunityGlobal
    }),

    areaMercadoOptions: computed(
      () => divisionsSales.value.find(
        (div => div.cod_div === opportunityGlobalData.value.iddivision_c)
      )?.amercado || []
    ),
    grupoClienteOptions: computed(
      () => grupoCliente.value.find(
        gCliente => gCliente.div === opportunityGlobalData.value.iddivision_c
      )?.grupo || []
    ),
    opportunityTypeOptions: computed(
      () => opportunityTypeAll.value.filter(
        (opp) => opp.div === opportunityGlobalData.value.iddivision_c,
      ) || []
    ),
    opportunityPhaseOptions: computed(
      () => opportunityTypeAll.value.find(
        (opp) => opp.value === opportunityGlobalData.value.opportunity_type
      )?.phase || []
    ),



    // * Methods
    assignDefaultValues,
    createOpportunity,
    deleteOpportunity,
    getOpportunity,
    getDataFromDraft,
    getOpportunityGlobal,
    loadConfiguration,
    resetOpportunityData,
    setOppotunityOptions,
    setUserAssigned,
    updateOpportunity
  };
}
