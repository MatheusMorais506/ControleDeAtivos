export const validateUsuarioForm = (
  values: {
    login: string;
    nome: string;
    email: string;
    senha: string;
    editingUsuario: boolean;
  }
) => {
  const errors: { login?: string; nome?: string; email?: string; senha?: string } = {};

  if (!values.login.trim()) errors.login = 'O login é obrigatório';
  if (!values.nome.trim()) errors.nome = 'O nome é obrigatório';
  if (!values.email.trim()) errors.email = 'O e-mail é obrigatório';

  if (!values.editingUsuario) {
    if (!values.senha) errors.senha = 'A senha é obrigatória';
    else if (values.senha.length < 6) errors.senha = 'A senha deve ter no mínimo 6 caracteres';
  } else {
    if (values.senha && values.senha.length < 6) {
      errors.senha = 'A senha deve ter no mínimo 6 caracteres';
    }
  }

  return errors;
};