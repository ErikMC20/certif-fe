import { defineStore } from 'pinia';
import { useQuotationModelService } from '../services/QuotationModelService';
import { dataListProd } from '../utils/types';
import { ItemsP } from '../utils/types';
import { userStore } from 'src/modules/Users/store/UserStore';
const {
  listModelProducts,
  listColors,
  getListaProds,
  getTemplates,
  getListsPesta,
  crearModuloQuotation,
  getModuloQuotation,
  getCategoryModel,
  saveDocuments: saveDocumentsService,
} = useQuotationModelService();

const { userCRM } = userStore();
export const useQuotationStore = defineStore('quotationmodel', {
  state: () => ({
    draft: {},
    CRM4_LB_03: process.env.CRM4_LB_03,
    name: '',
    lista: {},
    listalmacen: {},
    listatemplates: {},
    documents: {},
  }),
  actions: {
    async getListModelProducts(data: dataListProd) {
      this.lista = await listModelProducts(data);
      return this.lista;
    },
    async getListModelAlmacen(idmod: string) {
      const params = { idmodelo: idmod, typesearch: 'almacen' };

      this.lista = await listModelProducts(params);
      this.listalmacen = this.lista.items.map((it: ItemsP) => {
        return {
          idalmacen: it.almacen_c,
          nombrealmacen: it.almacen,
        };
      });
      // console.log(this.listalmacen);
      return this.listalmacen;
    },
    async getListModelporProducto(idmod: string) {
      const params = { idmodelo: idmod, typesearch: 'productos' };
      this.lista = await listModelProducts(params);
      this.listalmacen = this.lista.items.map((it) => {
        return {
          datos:
            'Almacen: ' +
            it.almacen +
            ' Precio: ' +
            it.price +
            ' Año: ' +
            it.anio_c,
          idprod: it.id,
        };
      });
      // console.log(this.listalmacen);
      return this.listalmacen;
    },
    async getlistColors(idmode: string) {
      this.lista = await listColors(idmode);
      return this.lista;
    },
    async getListaProdsStore(idmod: string, data: any) {
      // console.log(data);
      const { almacenlist, checList, productolist } = data;
      const datasend = {
        idmodelo: idmod,
        idprodcto: productolist.idprod || '',
        idalmacen: almacenlist.idalmacen || '',
        tipolistado: checList,
      };
      // console.log(datasend);
      this.lista = await getListaProds(datasend);
      return this.lista;
    },
    async getListaTemplates() {
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
          description: true,
          assigned_user_id: true,
          active: true,
          type: true,
          pdfheader: true,
          pdffooter: true,
          margin_left: true,
          margin_right: true,
          margin_top: true,
          margin_bottom: true,
          margin_header: true,
          margin_footer: true,
        },
      };
      this.listatemplates = await getTemplates(datasend);
      return this.listatemplates;
    },
    async getListsPestaStore(idmod: string, tipo: string) {
      const datasend = {
        idmodelo: idmod,
        typesearch: tipo,
      };
      //  = await getListsPesta(datasend);
      this.lista = await getListsPesta(datasend);
      return this.lista;
    },
    async saveAttributeStore(data: any) {
      const {
        idmodelo,
        nombremodelo,
        nombre,
        conjunto_atributos,
        id_conjunto_atributos,
        valor,
        atributo,
        id_atributo,
        descripcion,
      } = data;
      // console.log(data);
      const datasend = {
        type: 'HANI_AtributosProducto',
        attributes: {
          name: nombre,
          modified_user_id: userCRM.id,
          // modified_by_name: 'Fabio Ronald Zacari Carrillo',
          created_by: userCRM.id,
          // created_by_name: 'Fabio Ronald Zacari Carrillo',
          description: descripcion,
          valor_c: valor,
          hani_atributos_id_c: id_atributo,
          atributo_id_c: atributo,
          hani_conjuntoatributos_id_c: id_conjunto_atributos,
          conjuntoatributo_id_c: conjunto_atributos,
          hani_atributosproducto_hanq_modelo_name: nombremodelo,
          hani_atributosproducto_hanq_modelohanq_modelo_ida: idmodelo,
        },
      };
      await crearModuloQuotation(datasend);
    },
    async getModuloQuotationStore(tipo: string, idmod: string) {
      this.lista = await getModuloQuotation(tipo, idmod);
      return this.lista;
    },
    async saveTechnicalStore(data: any) {
      const {
        idmodelo,
        nombremodelo,
        nombre,
        // modelo,
        descripcion,
        tipo,
        idcat,
      } = data;
      const datasend = {
        type: 'HANQ_Caracteristicas',
        attributes: {
          name: nombre,
          modified_user_id: userCRM.id,
          created_by: userCRM.id,
          description: descripcion,
          assigned_user_id: userCRM.id,
          hanq_categoria_id_c: idcat,
          categoria_c: tipo,
          // que sera esto?
          // modelo_cot_c: '85eaa907-c83a-e371-fc70-5d5326bafb22',
          hanq_modelo_hanq_caracteristicas_name: nombremodelo,
          hanq_modelo_hanq_caracteristicashanq_modelo_ida: idmodelo,
        },
      };

      await crearModuloQuotation(datasend);
    },
    async getCategoryModelStore() {
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
          modified_user_id: true,
          created_by: true,
          description: true,
          deleted: true,
          assigned_user_id: true,
          iddivision_c: true,
          codigo_c: true,
        },
      };
      this.listatemplates = await getCategoryModel(datasend);
      return this.listatemplates;
    },
    async saveVideoStore(data: any) {
      const {
        idmodelo,
        nombremodelo,
        nombre,
        // modelo,
        descripcion,
        tipo,
        idcategoria,
      } = data;
      const datasend = {
        type: 'HANQ_Caracteristicas',
        attributes: {
          name: nombre,
          modified_user_id: userCRM.id,
          created_by: userCRM.id,
          description: descripcion,
          assigned_user_id: userCRM.id,
          hanq_categoria_id_c: idcategoria,
          categoria_c: tipo,
          // que sera esto?
          // modelo_cot_c: '85eaa907-c83a-e371-fc70-5d5326bafb22',
          hanq_modelo_hanq_caracteristicas_name: nombremodelo,
          hanq_modelo_hanq_caracteristicashanq_modelo_ida: idmodelo,
        },
      };

      await crearModuloQuotation(datasend);
    },
    async saveImagenesStore(data: any) {
      const {
        nombre,
        archivo,
        verarchivo,
        tipoarchivo,
        tamanio,
        descripcion,
        idmodelo,
        nombremodelo,
      } = data;
      console.log('ob1', data);
      const datasend = {
        type: 'HANH_GaleriaImagenes',
        attributes: {
          name: nombre,
          modified_user_id: userCRM.id,
          created_by: userCRM.id,
          description: descripcion,
          assigned_user_id: userCRM.id,
          type: tipoarchivo,
          size: tamanio,
          hanh_galeriaimagenes_hanq_modelo_name: nombremodelo,
          hanh_galeriaimagenes_hanq_modelohanq_modelo_ida: idmodelo,
        },
      };
      console.log('object', datasend);
      await crearModuloQuotation(datasend);
    },
    async saveDocuments(
      data: any,
      file: any,
      modRelation: any,
      idRelation: any
    ) {
      const archivo = file.name;
      const extension = archivo.match(/\.[^.]+$/)?.[0].substring(1);
      const typedocument = file.type;

      const dataSendDocuments = {
        Document: {
          name: data.name,
          modified_user_id: userCRM.id,
          created_by: userCRM.id,
          description: '',
          assigned_user_id: userCRM.id,
          document_name: archivo,
          filename: archivo,
          active_date: data.active_date,
          exp_date: data.exp_date,
          category_id: data.category_id,
          subcategory_id: '',
          status_id: data.status,
          status: data.status,
          revision: data.revision,
          last_rev_mime_type: typedocument,
          is_template: 0,
          template_type: data.template_type,
          archivado_c: 0,
          montocontrato_c: data.montocontrato_c,
          documento_c: data.documento_c,
          iddivision_c: data.iddivision_c,
          ruta_tramo_region_c: data.ruta_tramo_region_c,
          regional_c: data.regional_c,
        },
      };

      this.documents = await saveDocumentsService(
        dataSendDocuments,
        file,
        modRelation,
        idRelation
      );
      return this.documents;
    },
  },
});
