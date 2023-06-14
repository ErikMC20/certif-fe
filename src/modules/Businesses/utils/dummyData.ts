// fetch this from mongo and delete!
export const opportunityTypes = [
  {
    label: '03 Oportunidad Hansa',
    value: '03_01_Hansa',
    salesPhases: [
      {
        label: 'Identificacion de la oportunidad',
        value: '03_01_Identificacion',
        props: {
          color: '#828DFF',
          rules: [],
        },
      },
      {
        label: 'Cotizacion',
        value: '03_01_Cotizacion',
        props: {
          color: '#40BAFF',
          rules: ['quotes'],
        },
      },
      {
        label: 'Negociacion',
        value: '03_01_Negociacion',
        props: {
          color: '#7AFFBF',
          rules: ['quotes'],
        },
      },
      {
        label: 'Reserva',
        value: '03_01_Reserva',
        props: {
          color: '#FFAA5B',
          // reserve
          rules: ['quotes', 'reserve'],
        },
      },
      {
        label: 'Cierre',
        value: '03_01_Cierre',
        props: {
          color: '#80FF55',
          rules: ['quotes', 'reserve'],
        },
      },
    ],
  },
  {
    label: '03 Oportunidad Leasing',
    value: '03_10_Leasing',
    salesPhases: [
      {
        label: 'Identificacion de la oportunidad',
        value: '03_10_Identificacion',
      },
      {
        label: 'Cotizacion',
        value: '03_10_Cotizacion',
      },
      {
        label: 'Negociacion',
        value: '03_10_Negociacion',
      },
      {
        label: 'Reserva',
        value: '03_10_Reserva',
      },
      {
        label: 'Cierre',
        value: '03_10_Cierre',
      },
    ],
  },
  {
    label: '03 Oport. Hansa Repuestos',
    value: '03_02_Repuestos',
    salesPhases: [
      {
        label: 'Identificacion de la oportunidad',
        value: '03_02_Identificacion',
      },
      {
        label: 'Cotizacion',
        value: '03_02_Cotizacion',
      },
      {
        label: 'Reserva',
        value: '03_02_Reserva',
      },
      {
        label: 'Cierre',
        value: '03_02_Cierre',
      },
    ],
  },
  {
    label: '03 Contratación menor',
    value: '03_03_Menor',
    salesPhases: [
      {
        label: 'Prospección',
        value: '03_03_Prospeccion',
      },
      {
        label: 'Calificación',
        value: '03_03_Calificacion',
      },
      {
        label: 'Propuesta',
        value: '03_03_Cotizacion',
      },
      {
        label: 'Validación',
        value: '03_03_Validacion',
      },
      {
        label: 'Negociación',
        value: '03_03_Negociacion',
      },
      {
        label: 'Reserva',
        value: '03_03_Reserva',
      },
      {
        label: 'Cierre',
        value: '03_03_Cierre',
      },
    ],
  },
  {
    label: '03 Apoyo nacional a la producción y empleo ANPE',
    value: '03_04_Apoyo',
    salesPhases: [
      {
        label: 'Prospección',
        value: '03_04_Prospeccion',
      },
      {
        label: 'Calificación',
        value: '03_04_Calificacion',
      },
      {
        label: 'Propuesta',
        value: '03_04_Cotizacion',
      },
      {
        label: 'Validación',
        value: '03_04_Validacion',
      },
      {
        label: 'Negociación',
        value: '03_04_Negociacion',
      },
      {
        label: 'Reserva',
        value: '03_04_Reserva',
      },
      {
        label: 'Cierre',
        value: '03_04_Cierre',
      },
    ],
  },
  {
    label: '03 Licitación pública',
    value: '03_05_Licitacion',
    salesPhases: [
      {
        label: 'Prospección',
        value: '03_05_Prospeccion',
      },
      {
        label: 'Calificación',
        value: '03_05_Calificacion',
      },
      {
        label: 'Propuesta',
        value: '03_05_Cotizacion',
      },
      {
        label: 'Validación',
        value: '03_05_Validacion',
      },
      {
        label: 'Negociación',
        value: '03_05_Negociacion',
      },
      {
        label: 'Reserva',
        value: '03_05_Reserva',
      },
      {
        label: 'Cierre',
        value: '03_05_Cierre',
      },
    ],
  },
  {
    label: '03 Contratación directa',
    value: '03_06_Contratacion',
    salesPhases: [
      {
        label: 'Prospección',
        value: '03_06_Prospeccion',
      },
      {
        label: 'Calificación',
        value: '03_06_Calificacion',
      },
      {
        label: 'Propuesta',
        value: '03_06_Cotizacion',
      },
      {
        label: 'Validación',
        value: '03_06_Validacion',
      },
      {
        label: 'Negociación',
        value: '03_06_Negociacion',
      },
      {
        label: 'Reserva',
        value: '03_06_Reserva',
      },
      {
        label: 'Cierre',
        value: '03_06_Cierre',
      },
    ],
  },
  {
    label: '03 Orden de compra',
    value: '03_07_OrdenCompra',
    salesPhases: [
      {
        label: 'Prospección',
        value: '03_07_Prospeccion',
      },
      {
        label: 'Calificación',
        value: '03_07_Calificacion',
      },
      {
        label: 'Propuesta',
        value: '03_07_Cotizacion',
      },
      {
        label: 'Validación',
        value: '03_07_Validacion',
      },
      {
        label: 'Negociación',
        value: '03_07_Negociacion',
      },
      {
        label: 'Reserva',
        value: '03_07_Reserva',
      },
      {
        label: 'Cierre',
        value: '03_07_Cierre',
      },
    ],
  },
  {
    label: '03 Licitación privada / Proyecto',
    value: '03_08_Proyectos',
    salesPhases: [
      {
        label: 'Prospección',
        value: '03_08_Prospeccion',
      },
      {
        label: 'Calificación',
        value: '03_08_Calificacion',
      },
      {
        label: 'Propuesta',
        value: '03_08_Cotizacion',
      },
      {
        label: 'Validación',
        value: '03_08_Validacion',
      },
      {
        label: 'Negociación',
        value: '03_08_Negociacion',
      },
      {
        label: 'Reserva',
        value: '03_08_Reserva',
      },
      {
        label: 'Cierre',
        value: '03_08_Cierre',
      },
    ],
  },
  {
    label: '03 Contrato privado',
    value: '03_09_Contrato',
    salesPhases: [
      {
        label: 'Prospección',
        value: '03_09_Prospeccion',
      },
      {
        label: 'Calificación',
        value: '03_09_Calificacion',
      },
      {
        label: 'Propuesta',
        value: '03_09_Cotizacion',
      },
      {
        label: 'Validación',
        value: '03_09_Validacion',
      },
      {
        label: 'Negociación',
        value: '03_09_Negociacion',
      },
      {
        label: 'Reserva',
        value: '03_09_Reserva',
      },
      {
        label: 'Cierre',
        value: '03_09_Cierre',
      },
    ],
  },
  {
    label: '03 Hansa Recepción',
    value: '03_11_Seminuevos',
    salesPhases: [
      {
        label: 'Identificacion de la oportunidad',
        value: '03_11_Identificacion',
      },
      {
        label: 'Tasación',
        value: '03_11_Tasacion',
      },
      {
        label: 'Cierre',
        value: '03_01_Cierre',
      },
    ],
  },
];

export const activitiesTypes = [
  {
    label: 'Reunión',
    value: 'meetings',
  },
  {
    label: 'Tareas',
    value: 'tasks',
  },
  {
    label: 'Llamadas',
    value: 'calls',
  },
];

export const opportunityStates = [
  {
    label: 'En Tratamiento',
    value: 'EnTratamiento',
  },
  {
    label: 'Ganado',
    value: 'Ganado',
  },
  {
    label: 'Perdido',
    value: 'Perdido',
  },
];

export const profitMotive = [
  {
    label: 'Buen Precio',
    value: 'Ganado_01',
  },
  {
    label: 'Mejor funcionalidad del producto',
    value: 'Ganado_02',
  },
  {
    label: 'Mejor Asistencia',
    value: 'Ganado_03',
  },
  {
    label: 'Decisíon Estratégica',
    value: 'Ganado_04',
  },
  {
    label: 'Calidad de producto',
    value: 'Ganado_05',
  },
  {
    label: 'Personalización de producto',
    value: 'Ganado_06',
  },
  {
    label: 'Ventajas técnicas y tecnológicas',
    value: 'Ganado_07',
  },
  {
    label: 'Recompra',
    value: 'Ganado_08',
  },
  {
    label: 'Buen servicio técnico',
    value: 'Ganado_09',
  },
  {
    label: 'Plazo de entrega',
    value: 'Ganado_10',
  },
];

export const lossMotive = [
  { label: 'Costos del producto', value: 'Perdido_01' },
  { label: 'Sin funcionalidad del producto', value: 'Perdido_02' },
  { label: 'Asistencia insuficiente', value: 'Perdido_03' },
  { label: 'Decisión estratégica', value: 'Perdido_04' },
  { label: 'No hay stock', value: 'Perdido_05' },
  { label: 'Atención post-venta deficiente', value: 'Perdido_06' },
  { label: 'Plazo de entrega', value: 'Perdido_07' },
  { label: 'Competencia', value: 'Perdido_08' },
  { label: 'Costes de producto demasiado alto', value: 'Perdido_09' },
  { label: 'Producto demasiado complejo', value: 'Perdido_10' },
  { label: 'Desventajas técnicas y tecnológicas', value: 'Perdido_11' },
  { label: 'Mala experiencia anterior del producto', value: 'Perdido_12' },
  { label: 'Crédito bancario negado', value: 'Perdido_13' },
  { label: 'Postergación de compra', value: 'Perdido_14' },
  { label: 'Proceso impugnado', value: 'Perdido_15' },
  { label: 'Proceso suspendido', value: 'Perdido_16' },
  { label: 'Proceso cancelado', value: 'Perdido_17' },
  { label: 'Proceso anulado', value: 'Perdido_18' },
  { label: 'Declarado desierto', value: 'Perdido_19' },
  { label: 'Fabricante decidió no participar', value: 'Perdido_20' },
  { label: 'Nos enteramos tarde del negocio', value: 'Perdido_21' },
  { label: 'Precio alto', value: 'Perdido_22' },
  { label: 'Falta de financiamiento', value: 'Perdido_23' },
  { label: 'Falta de solución técnica', value: 'Perdido_24' },
  { label: 'No bid Hansa', value: 'Perdido_25' },
  { label: 'Error Hansa', value: 'Perdido_26' },
  { label: 'El cliente desistio de la oferta', value: 'Perdido_27' },
  { label: 'Reasignación de ejecutivo', value: 'Perdido_28' },
];
