let navegacaoFn: ((path: string) => void) | null = null;

export function setNavegacao(navegacao: (path: string) => void) {
  navegacaoFn = navegacao;
}

export function navigate(path: string) {
  if (navegacaoFn) {
    navegacaoFn(path);
  } else {
  }
}
