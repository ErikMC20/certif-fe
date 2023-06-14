import { gantt } from 'dhtmlx-gantt';
const ganttRef = ref(gantt);

interface TaskModel {
  id?: string;
  description?: string;
  text?: string;
  type?: string;
  unit?: string;
  duration?: number;
  start_date?: string;
  end_date?: string;
  quantity?: number;
  incidence: number;
}

interface LinksModel {
  id?: string;
  source: string;
  target: string;
  type: string;
}

interface DataModel {
  data: TaskModel[];
  link?: LinksModel[];
}

export const useDates = () => {
  const today = moment().format('YYYY-MM-DD');
  const days = ref(1);
  const startDate = ref(today);
  const endDate = ref(
    moment(today).add(days.value, 'days').format('YYYY-MM-DD')
  );

  const removeDays = () => {
    if (days.value == 1) return;
    days.value--;
    endDate.value = moment(endDate.value)
      .subtract(1, 'days')
      .format('YYYY-MM-DD');
  };

  const addDays = () => {
    if (days.value > 999) return;
    days.value++;
    endDate.value = moment(endDate.value).add(1, 'days').format('YYYY-MM-DD');
  };

  const resetDates = () => {
    (days.value = 1), (startDate.value = today);
    endDate.value = moment(today).add(days.value, 'days').format('YYYY-MM-DD');
  };

  watch(startDate, (newValue: string) => {
    endDate.value = moment(newValue)
      .add(days.value, 'days')
      .format('YYYY-MM-DD');
  });

  watch(endDate, (newValue: string) => {
    if (newValue > startDate.value) {
      const f1 = new Date(startDate.value);
      const f2 = new Date(endDate.value);
      const dias = (f2.getTime() - f1.getTime()) / 1000 / 60 / 60 / 24;
      days.value = dias;
      startDate.value = moment(newValue)
        .subtract(days.value, 'days')
        .format('YYYY-MM-DD');
    }
  });

  watch(days, (newValue: number | string) => {
    if (newValue == '' || newValue <= 0) days.value = 1;
    if (newValue > 999) days.value = 999;
    endDate.value = moment(startDate.value)
      .add(days.value, 'days')
      .format('YYYY-MM-DD');
  });

  return {
    addDays,
    removeDays,
    resetDates,
    days,
    startDate,
    endDate,
  };
};

export const useZoomGantt = () => {
  const zoomIn = () => {
    ganttRef.value.ext.zoom.zoomIn();
  };

  const zoomOut = () => {
    ganttRef.value.ext.zoom.zoomOut();
  };

  return { zoomIn, zoomOut };
};

export const initialGant = async (
  container: HTMLDivElement,
  data: DataModel
) => {
  console.log('initial gantt');

  initialFunctions();

  ganttRef.value.config.autosize = true;
  ganttRef.value.config.grid_resize = true;

  ganttRef.value.config.date_format = '%Y-%m-%d';
  ganttRef.value.plugins({
    tooltip: true,
    marker: true,
  });
  ganttRef.value.config.order_branch = true;
  ganttRef.value.config.order_branch_free = true;

  const dateToStr = gantt.date.date_to_str(gantt.config.task_date);

  const d = new Date();
  const today = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  gantt.addMarker({
    start_date: today,
    css: 'today',
    text: 'Hoy',
    title: 'Hoy: ' + dateToStr(today),
  });

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
              const dateToStr = gantt.date.date_to_str('%d %M');
              const endDate = gantt.date.add(date, -6, 'day');
              const weekNum = gantt.date.date_to_str('%W')(date);
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
              const dateToStr = gantt.date.date_to_str('%M');
              const endDate = gantt.date.add(
                gantt.date.add(date, 3, 'month'),
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

  ganttRef.value.ext.zoom.init(zoomConfig);
  ganttRef.value.ext.zoom.setLevel('week');

  //tooltip config
  ganttRef.value.templates.tooltip_date_format =
    ganttRef.value.date.date_to_str('%j %F %Y');

  ganttRef.value.attachEvent(
    'onGanttReady',
    function () {
      console.log('tooltip');
      ganttRef.value.templates.tooltip_text = function (start, end, task) {
        return `<b>Tarea:</b> ${task.text} <br/>
                <b>Inicio:</b> ${gantt.templates.tooltip_date_format(
                  start
                )} <br/>
                <b>Fin:</b> ${gantt.templates.tooltip_date_format(end)} <br/>`;
      };
    },
    null
  );

  //column config
  ganttRef.value.config.columns = [
    {
      name: 'wbs',
      label: '#',
      width: 40,
      template: ganttRef.value.getWBSCode,
    },
    {
      name: 'description',
      align: 'left',
      width: 200,
      resize: true,
      tree: true,
      label: 'Tarea',
      template: (task: TaskModel) => {
        return `<i class="${task.type}"></i> &nbsp; ${task.text}`;
      },
    },
    {
      name: 'start_date',
      label: 'Fecha inicio',
      align: 'center',
      resize: true,
      width: 100,
    },
    {
      name: 'end_date',
      label: 'Fecha fin',
      align: 'center',
      resize: true,
      width: 100,
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
    },
    {
      name: 'quantity',
      label: 'Cantidad',
      align: 'center',
      resize: true,
      width: 80,
    },
    {
      name: 'incidence',
      label: 'Incidencia',
      align: 'center',
      resize: true,
      width: 80,
      template: (task: TaskModel) => {
        return `${task.incidence}%`;
      },
    },
    {
      name: 'unit',
      label: 'Unidad',
      align: 'center',
      resize: true,
      width: 80,
    },

    {
      name: 'add',
      width: 50,
    },
  ];

  //languaje config
  ganttRef.value.i18n.setLocale('es');

  //initial functions
  ganttRef.value.init(container);
  ganttRef.value.parse(data);
};

const initialFunctions = () => {
  const methods = [
    'onAfterAutoSchedule',
    'onAfterBatchUpdate',
    'onAfterBranchLoading',
    'onAfterLightbox',
    'onAfterLinkAdd',
    'onAfterLinkDelete',
    'onAfterLinkUpdate',
    'onAfterQuickInfo',
    'onAfterRedo',
    'onAfterRowResize',
    'onAfterSort',
    'onAfterTaskAdd',
    'onAfterTaskAutoSchedule',
    'onAfterTaskDelete',
    'onAfterTaskDrag',
    'onAfterTaskMove',
    'onAfterTaskUpdate',
    'onAfterUndo',
    'onAjaxError',
    'onAutoScheduleCircularLink',
    'onBeforeAutoSchedule',
    'onBeforeBatchUpdate',
    'onBeforeBranchLoading',
    'onBeforeCollapse',
    'onBeforeDataRender',
    'onBeforeExpand',
    'onBeforeGanttReady',
    'onBeforeGanttRender',
    'onBeforeLightbox',
    'onBeforeLinkAdd',
    'onBeforeLinkDelete',
    'onBeforeLinkDisplay',
    'onBeforeLinkUpdate',
    'onBeforeMultiSelect',
    'onBeforeParse',
    'onBeforeRedo',
    'onBeforeRedoStack',
    'onBeforeRowDragEnd',
    'onBeforeRowDragMove',
    'onBeforeRowResize',
    'onBeforeRowResizeEnd',
    'onBeforeTaskAdd',
    'onBeforeTaskAutoSchedule',
    'onBeforeTaskChanged',
    'onBeforeTaskDelete',
    'onBeforeTaskDisplay',
    'onBeforeTaskDrag',
    'onBeforeTaskMove',
    'onBeforeTaskMultiSelect',
    'onBeforeTaskSelected',
    'onBeforeTaskUpdate',
    'onBeforeUndo',
    'onBeforeUndoStack',
    'onCircularLinkError',
    'onClear',
    'onCollapse',
    'onColumnResize',
    'onColumnResizeEnd',
    'onColumnResizeStart',
    'onContextMenu',
    'onDataProcessorReady',
    'onDataRender',
    'onDestroy',
    'onEmptyClick',
    'onError',
    'onExpand',
    'onGanttLayoutReady',
    'onGanttReady',
    'onGanttRender',
    'onGanttScroll',
    'onGridHeaderClick',
    'onGridResize',
    'onGridResizeEnd',
    'onGridResizeStart',
    'onLightbox',
    'onLightboxButton',
    'onLightboxCancel',
    'onLightboxChange',
    'onLightboxDelete',
    'onLightboxSave',
    'onLinkClick',
    'onLinkCreated',
    'onLinkDblClick',
    'onLinkIdChange',
    'onLinkValidation',
    'onLoadEnd',
    'onLoadStart',
    'onMouseMove',
    'onMultiSelect',
    'onOptionsLoad',
    'onParse',
    'onQuickInfo',
    'onRowDragEnd',
    'onRowDragStart',
    'onRowResize',
    'onScaleAdjusted',
    'onScaleClick',
    'onTaskClick',
    'onTaskClosed',
    'onTaskCreated',
    'onTaskDblClick',
    'onTaskDrag',
    'onTaskIdChange',
    'onTaskLoading',
    'onTaskMultiSelect',
    'onTaskOpened',
    'onTaskRowClick',
    'onTaskSelected',
    'onTaskUnselected',
    'onTemplatesReady',
  ];
  //console.log(methods);

  ganttRef.value.attachEvent(
    'onAfterTaskAdd',
    function () {
      //any custom logic here
      console.log('after add task');
    },
    null
  );

  ganttRef.value.attachEvent(
    'onAfterTaskAdd',
    function () {
      //any custom logic here
      console.log('hola mundo add');
    },
    null
  );

  ganttRef.value.attachEvent(
    'onGridResize',
    function () {
      //any custom logic here
      console.log('grid resize');
    },
    null
  );

  // ganttRef.value.attachEvent(
  //   'onBeforeRowDragMove',
  //   function (e, t) {
  //     //any custom logic here
  //     console.log('row move', e, t);
  //   },
  //   null
  // );

  ganttRef.value.attachEvent(
    'onBeforeRowResize',
    function () {
      //any custom logic here
      console.log('row resize');
    },
    null
  );

  ganttRef.value.attachEvent(
    'onContextMenu',
    function () {
      //any custom logic here
      console.log('context menu');
    },
    null
  );
};
