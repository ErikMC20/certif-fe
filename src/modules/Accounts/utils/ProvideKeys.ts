import type { InjectionKey } from 'vue';
import { RowTableCINITModel } from '../../../components/types/index';

export const selectedRepeatedKey = Symbol() as InjectionKey<
  (value: RowTableCINITModel) => RowTableCINITModel
>;

export const contactSelectedKey = Symbol() as InjectionKey<
  (value: string) => void
>;
