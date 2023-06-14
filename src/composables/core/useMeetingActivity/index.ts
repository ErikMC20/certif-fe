export function useMeetingActivity() {
  const formatModuleName = (module: string) => {
    const moduleName = module.toLowerCase();
    switch (moduleName) {
      case 'contacts':
        return 'Contactos';
      case 'users':
        return 'Usuarios';
      case 'prospects':
        return 'Huésped';
      case 'leads':
        return 'Prospectos';
      default:
        return 'Sin módulo';
    }
  };

  return { formatModuleName };
}
