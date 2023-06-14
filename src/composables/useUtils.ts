export const countObjectValues = (
  data: { [key: string]: string | object } | undefined[]
) => {
  const total = Object.values(data).filter((el) => el != '' || el.length > 0);

  return total.length;
};

export const compareObjects = (object1: object, object2: object) => {
  const obj1 = JSON.stringify(object1);
  const obj2 = JSON.stringify(object2);
  return obj1 !== obj2 ? true : false;
};
