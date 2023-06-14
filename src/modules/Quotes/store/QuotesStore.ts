import { defineStore } from 'pinia';
import { useQuotesService } from '../services/QuotesService';
import Notification from 'src/composables/notify';
import { userStore } from 'src/modules/Users/store/UserStore';
import * as utils from '../utils/types';
import { CardInfoQuotes } from '../utils/types';
import { QuotesTableStore } from './QuotesTableStore';
import { QuotationTableStore } from '../../Quotation_model/store/QuotationTableStore';
import { api } from 'boot/axios';
import { dataFormatCRM3 } from '../../../conections/conexionCRM3';

const {
  getGrupoClientev2,
  crearQuotes,
  updateQuotes,
  getModuleTypeID,
  getListProductsOfQuotesService,
  deleteQuotesService,
  getGrupoClienteServices,
  getRegionalServices,
  getListFPEventsService,
  getListProductSelect,
  getListProductVer,
  getListInformationSubPanels,
  getMoneda,
  getFilterProductosVer2,
  getImagesVerProduct,
  crearQuotesVer2,
  getListArticuloVer2,
  updateQuotesVer2,
  getemailsTosendLayout,
  deleteGroupProducts,
  deleteProduct,
  getDocumentBase64,
  getQuotesCompleta,
  getModuleNew,
  relaModuleQuotes,
} = useQuotesService();

const { userCRM } = userStore();
const quotesStore = QuotesTableStore();

export const useQuotesStore = defineStore('quotes', {
  state: () => ({
    draft: {},
    calltype: {} as utils.Quotesbodydata,
    CRM4_LB_03: process.env.CRM4_LB_03,
    lista: {},
    listGrupClient: {},
    ListRegion: {},
    listEvents: [],
    listArticles: [],
    listEmail: [],
    listaAux: '',
    idQuotesNew: '',
    listSubpanels: [],
    dataDupli: {} as any,
    CRM4_LB_06: process.env.CRM4_LB_06,
    Convertbase64: '' as any,
  }),
  actions: {
    async getGrupoClienteQuo(idmode: string) {
      this.lista = await getGrupoClientev2(idmode);
      return this.lista;
    },

    async getModuleTypeIDPro(modulo: string, id_mod: string) {
      this.calltype = await getModuleTypeID(modulo, id_mod);
      return this.calltype;
    },
    async getListProductsOfQuotesStore(idModel: string) {
      // ! con este id bd050165-e82d-1205-3948-63ec1413ba8c hay lista de productos nota eliminar este comentario
      const dataSend = {
        idquotes: idModel,
      };
      this.listArticles = await getListProductsOfQuotesService(dataSend);
      return this.listArticles;
    },

    async getListGrupClientebyDivisionStore(idDivision: string) {
      this.listGrupClient = await getGrupoClienteServices(idDivision);
      return this.listGrupClient;
    },

    async getListRegionStore(idRegion: string) {
      this.ListRegion = await getRegionalServices(idRegion);
      return this.ListRegion;
    },

    // Servicio para eliminar una cotizacion
    async deleteQuotesStore(idQuotes: string) {
      const dataSend = {
        module: 'Quotes',
        module_id: idQuotes,
        login_user: userCRM.id,
      };
      await deleteQuotesService(dataSend);
    },

    // servicio para traer todos los eventos
    async getListFPEventsStore(dataSend: utils.FPEventsFilterAdvanced) {
      this.listEvents = await getListFPEventsService(dataSend);
      return this.listEvents;
    },

    async postcrearQuotes(
      data1: utils.CardInfoQuotes,
      data2: any,
      data3: any,
      data4List: any,
      data5Tot: any,
      idEdit: string,
      iduser: string
    ) {
      try {
        if (!!idEdit) {
          const dataSend = {
            quotes: {
              type: 'AOS_Quotes',
              id: idEdit,
              attributes: {
                name: data1.name,
                stage: data1.stage,
                emision_c: data1.emision_c,
                limite_fecha_c: data1.limite_fecha_c,
                expiration: data1.expiration,
                iddivision_c: data1.iddivision_c,
                region_c: data1.region_c,
                idamercado_c: data1.idamercado_c,
                idgrupocliente_c: data1.idgrupocliente_c,
                fp_events_id_c: data1.fp_events_id_c,
                events_c: data1.events_c,
                opportunity: data1.opportunity,
                opportunity_id: data1.opportunity_id,

                cond_generales_venta_c: data2.condiciones,
                datos_seguro_c: data2.datosseguro,
                garantia_c: data2.garantia,
                forma_pago_c: data2.formaspago,
                tiempo_entrega_c: data2.tiempoentrega,
                servicio_post_venta_c: data2.serviciosposventa,
                mostrar_codigos_c: data2.mostrarcodigos,
                mostrar_desc_c: data2.mostrardescuentos,
                condiciones_legales_c: data2.mostrarlegales,

                billing_account: data3.name_account,
                billing_account_id: data3.id_account,
                billing_contact: data3.name_contact,
                billing_contact_id: data3.id_contact,
                hano_lead_aos_quotes_name: data3.name_lead,
                hano_lead_aos_quoteshano_lead_ida: data3.id_lead,
                leads_aos_quotes_1_name: data3.name_prospect,
                leads_aos_quotes_1leads_ida: data3.id_prospect,
                address_street_generated_c: data3.address_street_generated_c,
                jjwg_maps_lat_c: data3.latitude,
                jjwg_maps_lng_c: data3.longitude,
                billing_address_street: data3.billing_address_street,
                shipping_address_street: data3.shipping_address_street,

                // created_by: userCRM.id,
                modified_user_id: userCRM.id,
                assigned_user_id: iduser,

                total_amt: data5Tot.totalporgrupos,
                discount_amount: data5Tot.descuentoporgrupos,
                total_amount: data5Tot.totalfinalporgrupos,
              },
            },
            listProducts: data4List.map((elem) => {
              return {
                attributesGroup: elem.attributesGroup,
                listProducts: elem.listProducts.map((el) => {
                  delete el.chasis;
                  delete el.color;
                  delete el.gestion;
                  delete el.almacen;
                  return el;
                }),
              };
            }),
          };
          console.log(dataSend);
          this.idQuotesNew = await updateQuotesVer2(dataSend);
          await quotesStore.reloadList();
          Notification(
            'positive',
            'check',
            '<strong> Acción exitosa! </strong> <br/> Se actualizo correctamente.'
          );
          return this.idQuotesNew;
        } else {
          const dataSend = {
            quotes: {
              type: 'Quotes',
              attributes: {
                name: data1.name,
                stage: data1.stage,
                emision_c: data1.emision_c,
                limite_fecha_c: data1.limite_fecha_c,
                expiration: data1.expiration,
                iddivision_c: data1.iddivision_c,
                region_c: data1.region_c,
                idamercado_c: data1.idamercado_c,
                idgrupocliente_c: data1.idgrupocliente_c,
                fp_events_id_c: data1.fp_events_id_c,
                events_c: data1.events_c,
                opportunity: data1.opportunity,
                opportunity_id: data1.opportunity_id,

                cond_generales_venta_c: data2.condiciones,
                datos_seguro_c: data2.datosseguro,
                garantia_c: data2.garantia,
                forma_pago_c: data2.formaspago,
                tiempo_entrega_c: data2.tiempoentrega,
                servicio_post_venta_c: data2.serviciosposventa,
                mostrar_codigos_c: data2.mostrarcodigos,
                mostrar_desc_c: data2.mostrardescuentos,
                condiciones_legales_c: data2.mostrarlegales,

                billing_account: data3.name_account,
                billing_account_id: data3.id_account,
                billing_contact: data3.name_contact,
                billing_contact_id: data3.id_contact,
                hano_lead_aos_quotes_name: data3.name_lead,
                hano_lead_aos_quoteshano_lead_ida: data3.id_lead,
                leads_aos_quotes_1_name: data3.name_prospect,
                leads_aos_quotes_1leads_ida: data3.id_prospect,
                address_street_generated_c: data3.address_street_generated_c,
                jjwg_maps_lat_c: data3.latitude,
                jjwg_maps_lng_c: data3.longitude,
                billing_address_street: data3.billing_address_street,
                shipping_address_street: data3.shipping_address_street,

                created_by: userCRM.id,
                modified_user_id: userCRM.id,
                assigned_user_id: iduser,

                total_amt: data5Tot.totalporgrupos,
                // con signo negativo el discountamount
                discount_amount: data5Tot.descuentoporgrupos,
                // subtotal_amount: ESTE PUEDE REPERTIRSE
                total_amount: data5Tot.totalfinalporgrupos,
              },
            },

            listProducts: data4List.map((elem) => {
              return {
                attributesGroup: elem.attributesGroup,
                listProducts: elem.listProducts.map((el) => {
                  delete el.chasis;
                  delete el.color;
                  delete el.gestion;
                  delete el.almacen;
                  delete el.id;
                  delete el.parent_id;
                  delete el.group_id;
                  return el;
                }),
              };
            }),
          };
          this.idQuotesNew = await crearQuotesVer2(dataSend);
          await quotesStore.reloadList();
          Notification(
            'positive',
            'check',
            '<strong> Acción exitosa! </strong> <br/> Se creo una nueva cotización.'
          );
          return this.idQuotesNew;
        }
      } catch (error) {
        Notification(
          'negative',
          'warning',
          '<strong> Ops! algo salió mal </strong> <br/>Ocurrió un error en los datos.'
        );
        throw error;
      } finally {
        // this.loading = false;
      }
    },
    async getListProductSelectStore(product: string) {
      const datasend = {
        iddivision: userCRM.iddivision,
        idamercado: userCRM.idamercado,
        query: product,
      };
      this.lista = await getListProductSelect(datasend);
      return this.lista;
    },
    async getListProductVerStore(idmod: string, idprod: string) {
      const datasend = {
        idmodelo: idmod,
        idproducto: idprod,
      };
      this.lista = await getListProductVer(datasend);
      return this.lista;
    },

    async getAosQuotesGetInformationSubpanels(
      namesearch: string,
      idquotes: string
    ) {
      const datasend = {
        typesupanel: namesearch,
        idquotes: idquotes,
      };

      this.listSubpanels = await getListInformationSubPanels(datasend);

      return this.listSubpanels;
    },
    async getMonedaStore() {
      const datasend = {
        offset: 0,
        limit: 100,
        skip: 0,
        order: 'name',
        where: {
          additionalProp1: {},
        },
        fields: {
          id: true,
          name: true,
          symbol: true,
          iso4217: true,
          conversion_rate: true,
          status: true,
          deleted: true,
          conversion_rate_sale: true,
          conversion_rate_official: true,
        },
      };
      this.lista = await getMoneda(datasend);
      return this.lista;
    },
    //PARA EL SELECT
    async getFilterProductosVer2Store(val: string) {
      const datasend = {
        pagina: 1,
        numregistros: 10,
        iddivision: userCRM.iddivision,
        idamercado: userCRM.idamercado,
        filter: val,
        name: '',
        anio: '',
        codaio: '',
        available: '',
        praice: '',
        almacen: '',
        chasis: '',
      };
      this.lista = await getFilterProductosVer2(datasend);
      return this.lista;
    },
    // PARA EL FILTRO DE LA LUPA
    async getFilterProductosVer2LupaStore(datasend: any) {
      this.lista = await getFilterProductosVer2(datasend);
      return this.lista;
    },
    // PARA MOSTRAR LAS IMAGENES
    async getImagesVerProductStore(idmod: string) {
      const datasend = {
        idmodelo: idmod,
      };
      this.lista = await getImagesVerProduct(datasend);
      return this.lista;
    },
    // PARA OBTENER LOS ARTICULOS
    async getListArticuloVer2Store(idquo: string) {
      // console.log('al stoeres de la lista', idquo);
      const datasend = {
        idquotes: idquo,
      };
      this.lista = await getListArticuloVer2(datasend);
      return this.lista;
    },
    async getHistoryInitial(id: string, module: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_06}/Get_HistoryInitial/${id}/${module}`
        );
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getHistoryChanges(id: string) {
      try {
        const response = await api.get(
          `${this.CRM4_LB_06}/aos_quotes_get_history_change/${id}`
        );
        return response.data.data;
      } catch (error) {
        console.log(error);
      }
    },
    async getemailsTosendLayoutStore(idaccount: string, idcontact: string) {
      try {
        this.listEmail = await getemailsTosendLayout(idaccount, idcontact);
        return this.listEmail;
      } catch (error) {
        console.log(error);
      }
    },
    // PARA OELMINARN GRUPO DE PRODUCTOS
    async deleteGroupProductsStore(idquo: string, idgroup: string) {
      const datasend = {
        idquotes: idquo,
        idaoslineitemgroups: idgroup,
        iduser: userCRM.id,
      };
      await deleteGroupProducts(datasend);
      Notification(
        'positive',
        'check',
        '<strong> Acción exitosa! </strong> <br/> Se elimino el grupo.'
      );
    },
    // PARA ELIMINAR UN PRODUCTO
    async deleteProductStore(idquo: string, idprod: string) {
      const datasend = {
        idquotes: idquo,
        idaosproductquotes: idprod,
        iduser: userCRM.id,
      };
      await deleteProduct(datasend);
      Notification(
        'positive',
        'check',
        '<strong> Acción exitosa! </strong> <br/> Se elimino el producto.'
      );
    },

    // PARA EL DOCUMENTO EN BASE64
    async getDocumentoBase64Store(idquo: string, idamerc: string) {
      const datasend = {
        idquotes: idquo,
        idamercado: idamerc,
      };
      this.Convertbase64 = await getDocumentBase64(datasend);
      return this.Convertbase64;
    },
    // PARA EL DOCUMENTO EN BASE64
    async getQuotesCompletaStore(idquo: string) {
      this.dataDupli = await getQuotesCompleta(idquo);
      return this.dataDupli;
    },
    // PARA OBTENER UN MODULO CON SU ID
    async getModuleNewStore(modid: string, idcont: string) {
      this.dataDupli = await getModuleNew(modid, idcont);
      return this.dataDupli;
    },
    //PARA RELACIONAR COTIZACIONES CON LOS MODULE DE LEADS
    async relaModulesWithQuotes(
      idEdit: string,
      nomHanolead: string,
      idHanolead: string,
      idasig: string,
      listProd: any
    ) {
      try {
        const dataSend = {
          quotes: {
            type: 'AOS_Quotes',
            id: idEdit,
            attributes: {
              hano_lead_aos_quotes_name: nomHanolead,
              hano_lead_aos_quoteshano_lead_ida: idHanolead,
              modified_user_id: userCRM.id,
              assigned_user_id: idasig,
            },
          },
          listProducts: listProd.map((elem) => {
            return {
              attributesGroup: elem.attributesGroup,
              listProducts: elem.listProducts.map((el) => {
                delete el.chasis;
                delete el.color;
                delete el.gestion;
                delete el.almacen;
                return el;
              }),
            };
          }),
        };
        this.idQuotesNew = await updateQuotesVer2(dataSend);
        Notification(
          'positive',
          'check',
          '<strong> Acción exitosa! </strong> <br/> Se relacionó con exito.'
        );
        return this.idQuotesNew;
      } catch (error) {
        console.log(error);
      }
    },
    async relaModuleQuotesStore(
      modEntr: string,
      idEntr: string,
      modSal: string,
      idSal: string
    ) {
      try {
        await relaModuleQuotes(modEntr, idEntr, modSal, idSal);
        Notification(
          'positive',
          'check',
          '<strong> Acción exitosa! </strong> <br/> Se relacionó con exito.'
        );
      } catch (error) {
        console.log(error);
      }
    },
  },
  getters: {
    CardInfoQuotesgetter: (state): CardInfoQuotes => {
      return {
        iddivision_c: state.calltype.attributes?.iddivision_c,
        idamercado_c: state.calltype.attributes?.idamercado_c,
        region_c: state.calltype.attributes?.region_c,
        idgrupocliente_c: state.calltype.attributes?.idgrupocliente_c,
        name: state.calltype.attributes?.name,
        opportunity_id: state.calltype.attributes?.opportunity_id,
        opportunity: state.calltype.attributes?.opportunity,
        stage: state.calltype.attributes?.stage,
        emision_c: state.calltype.attributes?.date_entered,
        limite_fecha_c: state.calltype.attributes?.limite_fecha_c,
        expiration: state.calltype.attributes?.expiration,
        fp_events_id_c: state.calltype.attributes?.fp_events_id_c,
        events_c: state.calltype.attributes?.events_c,
        description: state.calltype.attributes?.description,
      };
    },
    GetIdAssignedUser: (state) => {
      return state.calltype.attributes?.assigned_user_id;
    },
  },
});
