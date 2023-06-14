//* object definition in typescript
export type option2 = {
  title: string;
  caption: string;
  icon: string;
  link: string;
  separator: boolean;
  enabled: boolean;
  type: string;
  route?: string;
};

export type option1 = {
  title: string;
  caption: string;
  icon: string;
  link: string;
  separator: boolean;
  enabled: boolean;
  type: string;
  route?: string;
  listOptions2?: option2[];
};

export type option = {
  title: string;
  route?: string;
  caption: string;
  icon: string;
  link: string;
  separator: boolean;
  enabled: boolean;
  type: string;
  listOptions1?: option1[];
};

export type menu = {
  groupTitle: string;
  enabledGroup: boolean;
  separatorGroup: boolean;
  positionGroup: number;
  listOptions: option[];
};
