import { storeToRefs } from 'pinia';
import { useCertificationsStore } from '../../store/useCertificationsStore';

const certificationsStore = useCertificationsStore();
const tableState = storeToRefs(certificationsStore);
const { setVisibleColumn, getListCertifications, reloadList, setPagination } =
  certificationsStore;

export function useCertifications() {
  return {
    certificationsStore,
    setVisibleColumn,
    getListCertifications,
    reloadList,
    setPagination,
  };
}
