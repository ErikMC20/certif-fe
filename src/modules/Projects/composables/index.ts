export const setStatusColor = (status: string) => {
  const statusName = [
    {
      name: 'Underway',
      text: 'En Curso',
      color: 'blue-1',
      textColor: 'blue',
      icon: 'timeline',
    },
    {
      name: 'Draft',
      text: 'Borrador',
      color: 'grey-4',
      textColor: 'grey-7',
      icon: 'mode',
    },
    {
      name: 'In Review',
      text: 'En Revision',
      color: 'orange-2',
      textColor: 'orange-9',
      icon: 'timeline',
    },
    {
      name: 'On_Hold',
      text: 'En Espera',
      color: 'yellow-2',
      textColor: 'yellow-9',
      icon: 'watch_later',
    },
    {
      name: 'Completed',
      text: 'Completado',
      color: 'green-2',
      textColor: 'green-9',
      icon: 'check',
    },
    {
      name: 'Canceled',
      text: 'Cancelado',
      color: 'red-2',
      textColor: 'red-9',
      icon: 'close',
    },
  ];
  return statusName.find((el) => el.name === status);
};
