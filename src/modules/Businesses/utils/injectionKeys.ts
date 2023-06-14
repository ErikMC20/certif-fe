import type { InjectionKey } from 'vue';

type OpenDialogFn = (id?: string) => void;

export interface OpenDialog {
  accountDialog: OpenDialogFn;
  contactDialog: OpenDialogFn;
}

const openDialogKey = Symbol() as InjectionKey<OpenDialog>;

export { openDialogKey };
