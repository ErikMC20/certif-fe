import { defineStore } from 'pinia';
import { userStore } from 'src/modules/Users/store/UserStore';
import { useDocumentsModelService } from '../services/DocumentsServises';
import Notification from 'src/composables/notify';
const {
  getOptionsLanguageDocuments,
  saveDocuments: saveDocumentsService,
  saveFileTemp,
  saveModelDocument,
  saveRelationModuleWithDocumnet,
  updateDocumentTemp,
} = useDocumentsModelService();

const { userCRM } = userStore();
export const useDocumentsStore = defineStore('Documentmodel', {
  state: () => ({
    documents: {},
  }),
  actions: {
    async getLanguagesDocuments() {
      const [
        docDivision,
        docgrupclient,
        docRegions,
        docCategory,
        docStatus,
        docTemplateType,
        hansaEstadoDoc,
      ] = await getOptionsLanguageDocuments();
      return {
        documentDivision: docDivision.data,
        documentGrupoClient: docgrupclient.data,
        regions: docRegions.data,
        documentCategory: docCategory.data,
        documentStatus: docStatus.data,
        documentTemplateType: docTemplateType.data,
        hansaEstadoDocument: hansaEstadoDoc.data,
      };
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
    async saveDocuments_v2(
      data?: any,
      file?: any,
      modRelation?: any,
      idRelation?: any
    ) {
      const savetempDocument = await saveFileTemp(file);
      if (!savetempDocument.success) {
        Notification(
          'negative',
          'warning',
          '<strong> Ops! algo salió mal </strong> <br/>Ocurrió un error en los datos.'
        );
        this.documents = {
          success: savetempDocument.success,
        };
        return this.documents;
      }
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

      const dataDocumentsaved = await saveModelDocument(
        dataSendDocuments,
        savetempDocument.data
      );

      const Relation = await saveRelationModuleWithDocumnet(
        dataDocumentsaved,
        modRelation,
        idRelation
      );

      this.documents = await updateDocumentTemp(
        dataDocumentsaved,
        savetempDocument.data
      );
      return this.documents;
    },
  },
});
