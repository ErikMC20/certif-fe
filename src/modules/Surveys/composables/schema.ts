export default {
  groups: [
    {
      multiple: false,
      fields: [
        {
          columns: 12,
          name: 'title',
          input: 'q-input',
          type: 'text',
          label: 'Titulo de la encuesta',
          value: '',
          readonly: false,
          required: true,
        },
      ],
    },
    {
      multiple: true,
      fields: [
        {
          columns: 6,
          name: 'title',
          input: 'q-select',
          label: 'Division',
          value: '',
          readonly: false,
          required: true,
          options: ['item 1', 'item 2', 'item 3'],
        },
        {
          columns: 6,
          name: 'title',
          input: 'select-simple',
          label: 'Modulo',
          value: '',
          readonly: false,
          required: true,
          options: ['item 1', 'item 2', 'item 3'],
        },
      ],
    },
  ],
};
