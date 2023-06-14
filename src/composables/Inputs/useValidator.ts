export function useValidator() {
  function makeRequired<T>(val: T): string | boolean {
    if (!val) {
      return 'El campo es requerido';
    }
    return true;
  }

  function makeValidEmail(val: string, skipEmpty = false): string | boolean {
    if (skipEmpty && val === '') return true;
    const emailPattern =
      /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
    return emailPattern.test(val) || 'El correo no es valido';
  }

  return { makeRequired, makeValidEmail };
}
