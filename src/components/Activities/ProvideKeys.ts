//* This file import symbol keys to be used in provide/inject features throught the activity component
import type { InjectionKey, Ref } from 'vue';

export const moduleKey = Symbol() as InjectionKey<string>;
export const idModuleKey = Symbol() as InjectionKey<string>;
export const idActivityKey = Symbol() as InjectionKey<Ref<string>>;

export const reactiveModuleIdKey = Symbol() as InjectionKey<Ref<string>>;
export const reactiveModuleNameKey = Symbol() as InjectionKey<Ref<string>>;
