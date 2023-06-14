export type ProspectModel = 'Privada' | 'Empresa';
export interface OptionBase {
  [key: string]: string;
}

//para el modelo de cotización
export interface dataListProd {
  idmodelo?: string;
  typesearch: string;
}

export interface ListProducts {
  allstock: string;
  items: ItemsP[];
}
export interface ItemsP {
  almacen: string;
  almacen_c: string;
  stock: StockP[];
}
export interface StockP {
  titulo?: string;
  total?: number;
}
export interface ItemsP2 {
  id?: string;
  name?: string;
  almacen?: string;
  codigoaio_c?: string;
  price?: number;
  anio_c?: number;
  stock: StockP[];
}

export interface dataimages {
  name: string;
  color: string;
  archivocolor: file | undefined;
  vercolor: string;
  archivocostado: file | undefined;
  vercostado: string;
  archivoperfil: file | undefined;
  verperfil: string;
  archivoatras: file | undefined;
  veratras: string;
  archivofrontal: file | undefined;
  verfrontal: string;
}
