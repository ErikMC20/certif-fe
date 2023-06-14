export const dataFormatCRM3 = (method: string, data: any, file: File) => {
  const archivoBlob = new Blob([file], {
    type: file.type,
  });
  const formData = new FormData();
  formData.append('file', archivoBlob, file.name);
  formData.append('method', method);
  formData.append('input_type', 'JSON');
  formData.append('response_type', 'JSON');
  formData.append('rest_data', JSON.stringify(data));
  return formData;
};

export const dataFormatCRM3Basic = (method: string, data: any) => {
  const formData = new FormData();
  formData.append('method', method);
  formData.append('input_type', 'JSON');
  formData.append('response_type', 'JSON');
  formData.append('rest_data', JSON.stringify(data));
  return formData;
};
