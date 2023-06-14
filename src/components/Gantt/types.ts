export interface TaskModel {
  id: string;
  description?: string;
  text: string;
  type?: string;
  unit?: string;
  duration?: number;
  start_date?: Date;
  end_date?: Date;
  date_finish?: string;
  date_start?: string;
  quantity?: number;
  quantity_remaining?: number;
  incidence: number;
  parent?: string;
  color?: string;
  user_id?: string;
  status?: string;
  progress: number;
  real_progress?: number;
  task_number?: number;
  priority?: string;
  planification_id?: string;
  real_id?: string;
  $wbs?: string;
  $index?: number;
  deleted?: number;
}

export interface LinksModel {
  id?: string;
  source: string;
  target: string;
  type: string;
}

export interface DataModel {
  data: TaskModel[];
  link?: LinksModel[];
}

export interface DateModel {
  start_date: string;
  end_date: string;
  days: number;
}

export interface DataSend {
  id: string;
  order_number: number;
  number: string;
  date_start: string;
  date_finish: string;
  duration: number;
  parent: string;
  color: string;
  name: string;
  description: string;
  incidence: number;
  quantity: number;
  unit: string;
  type: string;
  status: string;
  progress: number;
  priority: string;
  planification_id: string;
  real_id: string;
  user_id: string;
}
