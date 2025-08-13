export const validateAssetForm = (values: { name: string; code: string }) => {
  const errors: { name?: string; code?: string } = {};
  if (!values.name.trim()) errors.name = 'O nome é obrigatório';
  if (!values.code.trim()) errors.code = 'O código é obrigatório';
  return errors;
};
