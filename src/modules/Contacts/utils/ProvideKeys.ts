import type { InjectionKey, Ref } from 'vue';

export const selectedRepeatedKey = Symbol() as InjectionKey<{
  fromConversion: Ref<boolean>;
  selectedRepeatedCb: (value: string) => string;
}>;
