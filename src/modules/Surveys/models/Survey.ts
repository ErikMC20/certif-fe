export class Survey {
  id!: string;
  name!: string;
  division!: number;
  module!: number;

  constructor(id: string, name: string, division: number, module: number) {
    this.id = id;
    this.name = name;
    this.division = division;
    this.module = module;
  }
}
