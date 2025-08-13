import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export function usePopupConfirmacaoActions() {
    
  const ConfirmarAcao = async (options?: { title?: string; text?: string }) => {
    return MySwal.fire({
      title: options?.title ?? "Tem certeza?",
      text: options?.text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0F766EFF",
      cancelButtonColor: "#DC2626FF",
      cancelButtonText: "Não",
      confirmButtonText: "Sim",
    });
  };

  return { ConfirmarAcao };
}
