import React from 'react';
import { ToastContainer, toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer {...defaultOptions} />
    </>
  );
}

export const mensagemDeSucesso = (mensagem: string, opcoes?: ToastOptions) => {
  toast.success(mensagem, { ...defaultOptions, ...opcoes });
};

export const mensagemDeErro = (mensagem: string, opcoes?: ToastOptions) => {
  toast.error(mensagem, { ...defaultOptions, ...opcoes });
};

export const mensagemDeAviso = (mensagem: string, opcoes?: ToastOptions) => {
  toast.warning(mensagem, { ...defaultOptions, ...opcoes });
};

export const mensagemDeInfo = (mensagem: string, opcoes?: ToastOptions) => {
  toast.info(mensagem, { ...defaultOptions, ...opcoes });
};
