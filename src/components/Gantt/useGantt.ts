/* eslint-disable @typescript-eslint/no-explicit-any */
import { gantt } from 'gantt-hansa-js';
import { DataModel, TaskModel } from './types';
import { userStore } from 'src/modules/Users/store/UserStore';
import { useCapitalizeFirstletter } from 'src/composables/useUtlis';
import moment from 'moment';
import { ref } from 'vue';
export const Gantt = ref(gantt);

export const useInitialGant = async (
  container: HTMLDivElement,
  data: DataModel
) => {
  console.log('initial gantt');
  Gantt.value.plugins({
    //tooltip: true,
    marker: true,
    grouping: true,
    //fullscreen: true,
  });

  //configuration gantt
  Gantt.value.config.sort = true;
  Gantt.value.config.keep_grid_width = false;
  Gantt.value.config.grid_resize = true;
  Gantt.value.config.date_format = '%Y-%m-%d';
  Gantt.value.config.order_branch = 'marker';
  Gantt.value.config.order_branch_free = true;

  Gantt.value.templates.rightside_text = function (start, end, task) {
    if (task.type == Gantt.value.config.types.milestone) {
      return task.text;
    }
    return '';
  };

  const dateToStr = Gantt.value.date.date_to_str(Gantt.value.config.task_date);

  //marker config
  const d = new Date();
  const today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  Gantt.value.addMarker({
    start_date: today,
    css: 'gantt-today',
    text: 'Hoy',
    title: 'Hoy: ' + dateToStr(today),
  });

  //zoom config
  const zoomConfig = {
    levels: [
      {
        name: 'day',
        scale_height: 27,
        min_column_width: 80,
        scales: [
          {
            unit: 'day',
            step: 1,
            format: '%d %M',
            css: (date: Date) => {
              if (date.getDay() === 0 || date.getDay() === 6) {
                return 'weekend';
              }
              return '';
            },
          },
        ],
      },
      {
        name: 'week',
        scale_height: 50,
        min_column_width: 50,
        scales: [
          {
            unit: 'week',
            step: 1,
            format: function (date: Date) {
              const dateToStr = Gantt.value.date.date_to_str('%d %M');
              const endDate = Gantt.value.date.add(date, -6, 'day');
              const weekNum = Gantt.value.date.date_to_str('%W')(date);
              return (
                '#' +
                weekNum +
                ', ' +
                dateToStr(endDate) +
                ' - ' +
                dateToStr(date)
              );
            },
          },
          {
            unit: 'day',
            step: 1,
            format: '%j %D',
            css: (date: Date) => {
              if (date.getDay() === 0 || date.getDay() === 6) {
                return 'weekend';
              }
              return '';
            },
          },
        ],
      },
      {
        name: 'month',
        scale_height: 50,
        min_column_width: 120,
        scales: [
          { unit: 'month', format: '%F, %Y' },
          { unit: 'week', format: 'Semana #%W' },
        ],
      },
      {
        name: 'quarter',
        height: 50,
        min_column_width: 90,
        scales: [
          { unit: 'month', step: 1, format: '%M' },
          {
            unit: 'quarter',
            step: 1,
            format: function (date: Date) {
              const dateToStr = Gantt.value.date.date_to_str('%M');
              const endDate = Gantt.value.date.add(
                Gantt.value.date.add(date, 3, 'month'),
                -1,
                'day'
              );
              return dateToStr(date) + ' - ' + dateToStr(endDate);
            },
          },
        ],
      },
      {
        name: 'year',
        scale_height: 50,
        min_column_width: 30,
        scales: [{ unit: 'year', step: 1, format: '%Y' }],
      },
    ],
  };
  Gantt.value.ext.zoom.init(zoomConfig);
  Gantt.value.ext.zoom.setLevel('week');

  //tooltip config
  Gantt.value.templates.tooltip_date_format =
    Gantt.value.date.date_to_str('%j %F %Y');

  //row config
  Gantt.value.config.row_height = 30;

  //column config
  Gantt.value.config.min_column_width = 50;
  Gantt.value.config.columns = [
    {
      name: 'wbs',
      label: '#',
      width: 40,
      template: Gantt.value.getWBSCode,
      hide: false,
    },
    {
      name: 'text',
      align: 'left',
      width: '*',
      min_width: 200,
      tree: true,
      resize: true,
      label: 'Tarea',
      template: (task: TaskModel) => {
        return `<i class="${task.type}"></i>${task.text}`;
      },
      hide: false,
    },
    {
      name: 'description',
      align: 'left',
      width: '*',
      min_width: 200,
      resize: true,
      label: 'Descripcion',
      hide: true,
    },
    {
      name: 'start_date',
      label: 'Fecha inicio',
      align: 'center',
      resize: true,
      min_width: 100,
      template: (task: TaskModel) => {
        return `${moment(task.start_date).format('DD/MM/YYYY')}`;
      },
      hide: false,
    },
    {
      name: 'end_date',
      label: 'Fecha fin',
      align: 'center',
      resize: true,
      min_width: 100,
      template: (task: TaskModel) => {
        return `${moment(task.end_date).format('DD/MM/YYYY')}`;
      },
      hide: false,
    },
    {
      name: 'duration',
      label: 'Duración',
      align: 'center',
      resize: true,
      width: 80,
      template: (task: TaskModel) => {
        return `${task.duration}`;
      },
      hide: false,
    },
    {
      name: 'quantity',
      label: 'Cantidad',
      align: 'center',
      resize: true,
      width: 80,
      hide: false,
    },
    {
      name: 'unit',
      label: 'Unidad',
      align: 'center',
      resize: true,
      width: 80,
      hide: false,
    },
    {
      name: 'incidence',
      label: 'Incidencia',
      align: 'center',
      resize: true,
      width: 80,
      template: (task: TaskModel) => {
        return `${task.incidence ? task.incidence + ' %' : ''}`;
      },

      hide: false,
    },
    {
      name: 'status',
      label: 'Estado',
      align: 'center',
      resize: true,
      width: 100,
      template: (task: TaskModel) => {
        return `${task.type !== 'task' ? '' : task.status}`;
      },

      hide: false,
    },
    {
      name: 'add',
      width: 50,
    },
  ];

  // Gantt.value.config.layout = {
  //   css: 'gantt_container',
  //   cols: [
  //     {
  //       width: 500,
  //       min_width: 300,
  //       rows: [
  //         {
  //           view: 'grid',
  //           scrollX: 'gridScroll',
  //           scrollable: true,
  //           scrollY: 'scrollVer',
  //         },
  //         { view: 'scrollbar', id: 'gridScroll', group: 'horizontal' },
  //       ],
  //     },
  //     { resizer: true, width: 1 },
  //     {
  //       rows: [
  //         { view: 'timeline', scrollX: 'scrollHor', scrollY: 'scrollVer' },
  //         { view: 'scrollbar', id: 'scrollHor', group: 'horizontal' },
  //       ],
  //     },
  //     { view: 'scrollbar', id: 'scrollVer' },
  //   ],
  // };

  //languaje config
  Gantt.value.i18n.setLocale('es');

  //initial functions
  initialFunctionsGantt();

  //init gantt
  Gantt.value.init(container);
  Gantt.value.parse(data);
};

export const useZoomGantt = () => {
  const zoomIn = () => {
    Gantt.value.ext.zoom.zoomIn();
  };

  const zoomOut = () => {
    Gantt.value.ext.zoom.zoomOut();
  };

  return { zoomIn, zoomOut };
};

export const useToggleGantt = () => {
  const chartToggle = ref(false);
  const gridToggle = ref(false);
  const toggleChart = () => {
    Gantt.value.config.show_chart = !Gantt.value.config.show_chart;
    Gantt.value.render();
    chartToggle.value = !Gantt.value.config.show_chart;
  };

  const toggleGrid = () => {
    Gantt.value.config.grid_width = gridToggle.value == true ? 100 : 0;
    Gantt.value.render();
    gridToggle.value = !gridToggle.value;
  };

  return {
    toggleChart,
    toggleGrid,
    chartToggle,
    gridToggle,
  };
};

export const useCrudGanttFunctions = () => {
  const getTaskGantt = (id: string | number): any => {
    return Gantt.value.getTask(id) as TaskModel;
  };

  const createTaskGantt = (task: TaskModel) => {
    return Gantt.value.createTask(task);
  };

  const updateTaskGantt = (id: string | number, task: TaskModel) => {
    Gantt.value.updateTask(id, task);
    return Gantt.value.getTask(id);
  };

  const deleteTaskGantt = (id: string | number) => {
    Gantt.value.deleteTask(id);
  };

  return {
    getTaskGantt,
    createTaskGantt,
    updateTaskGantt,
    deleteTaskGantt,
  };
};

const initialFunctionsGantt = () => {
  // Gantt.value.attachEvent(
  //   'onTemplatesReady',
  //   function () {
  //     const toggle = document.createElement('i');
  //     toggle.className = 'fa fa-expand gantt-fullscreen';
  //     Gantt.value.toggleIcon = toggle;
  //     Gantt.value.$container.appendChild(toggle);
  //     toggle.onclick = function () {
  //       Gantt.value.ext.fullscreen.toggle();
  //     };
  //   },
  //   null
  // );
  // Gantt.value.attachEvent(
  //   'onExpand',
  //   function () {
  //     const icon = Gantt.value.toggleIcon;
  //     if (icon) {
  //       icon.className = icon.className.replace('fa-expand', 'fa-compress');
  //     }
  //   },
  //   null
  // );
  // Gantt.value.attachEvent(
  //   'onCollapse',
  //   function () {
  //     const icon = Gantt.value.toggleIcon;
  //     if (icon) {
  //       icon.className = icon.className.replace('fa-compress', 'fa-expand');
  //     }
  //   },
  //   null
  // );
  // Gantt.value.attachEvent(
  //   'onGanttReady',
  //   function () {
  //     // console.log('tooltip');
  //     Gantt.value.templates.tooltip_text = function (
  //       start: Date,
  //       end: Date,
  //       task: TaskModel
  //     ) {
  //       return `<b>Tarea:</b> ${task.text} <br/>
  //               <b>Descripción:</b> ${task.description} <br/>
  //                 <b>Inicio:</b> ${Gantt.value.templates.tooltip_date_format(
  //                   start
  //                 )} <br/>
  //                 <b>Fin:</b> ${Gantt.value.templates.tooltip_date_format(
  //                   end
  //                 )} <br/>`;
  //     };
  //   },
  //   null
  // );
};

export const useGanttTaskData = (dataReq: any): TaskModel => {
  let dataRes = <any>{};
  switch (dataReq.type) {
    case 'project':
      dataRes = {
        $index: dataReq.$index,
        $wbs: dataReq.$wbs,
        id: dataReq.id,
        text: useCapitalizeFirstletter(dataReq.text),
        description: dataReq.description,
        unit: '',
        quantity: '',
        incidence: dataReq.incidence,
        start_date: new Date(dataReq.date_start + ' UTC-4'),
        end_date: new Date(dataReq.date_start + ' UTC-4'),
        duration: dataReq.days,
        date_start: dataReq.date_start,
        date_finish: dataReq.date_start,
        //color: '#65c16f',
        type: dataReq.type,
        parent: dataReq.parent == '' ? '0' : dataReq.parent,
        progress: dataReq.progress * 0.01,
        real_progress: dataReq.progress,
        priority: dataReq.priority,
        status: dataReq.status,
        user_id: userStore().userCRM.id,
        real_id: dataReq.real_id,
      };
      break;
    case 'milestone':
      dataRes = {
        $index: dataReq.$index,
        $wbs: dataReq.$wbs,
        id: dataReq.id,
        text: useCapitalizeFirstletter(dataReq.text),
        description: dataReq.description ?? '',
        unit: '',
        quantity: '',
        incidence: 0,
        start_date: new Date(dataReq.date_start + ' UTC-4'),
        end_date: new Date(dataReq.date_start + ' UTC-4'),
        duration: 0,
        date_start: dataReq.date_start,
        date_finish: dataReq.date_start,
        // color: '#d33daf',
        type: dataReq.type,
        parent: dataReq.parent == '' ? '0' : dataReq.parent,
        progress: dataReq.progress * 0.01,
        real_progress: dataReq.progress,
        priority: dataReq.priority,
        status: dataReq.status,
        user_id: userStore().userCRM.id,
        real_id: dataReq.real_id,
      };
      break;
    case 'task':
      dataRes = {
        $index: dataReq.$index,
        $wbs: dataReq.$wbs,
        id: dataReq.id,
        text: useCapitalizeFirstletter(dataReq.text),
        description: dataReq.description,
        unit: dataReq.unit,
        quantity: dataReq.quantity,
        quantity_remaining: dataReq.quantity_remaining,
        incidence: dataReq.incidence,
        start_date: dataReq.start_date,
        end_date: dataReq.end_date,
        duration: dataReq.duration,
        date_start: dataReq.start_date,
        date_finish: dataReq.end_date,
        //  color: '#3db9d3',
        type: dataReq.type,
        parent: dataReq.parent == '' ? '0' : dataReq.parent,
        progress: dataReq.progress * 0.01,
        real_progress: dataReq.progress,
        priority: dataReq.priority,
        status: dataReq.status,
        user_id: userStore().userCRM.id,
        real_id: dataReq.real_id,
      };
      break;
  }

  return dataRes;
};

export const useShortcuts = () => {
  const Ctrl_S = (e: KeyboardEvent, handleFunction?: () => void) => {
    if (e.key === 's' && (e.ctrlKey || e.metaKey) && handleFunction) {
      e.preventDefault();
      handleFunction();
    }
  };

  const KEY_1 = (e: KeyboardEvent, handleFunction: any) => {
    if (e.metaKey && e.key === '1') {
      e.preventDefault();
      e.stopPropagation();
      handleFunction();
    }
  };

  return { Ctrl_S, KEY_1 };
};

export const onFormatDate = (date: string | Date | undefined) => {
  return moment(date).format('YYYY-MM-DD');
};
