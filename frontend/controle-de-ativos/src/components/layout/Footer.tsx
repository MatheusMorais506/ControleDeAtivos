export const Footer: React.FC = () => {
  return (
   <footer className="bg-gray-100 border-t border-gray-200 py-2 text-center text-sm text-gray-500 w-full">
      © {new Date().getFullYear()} Controle de Ativos. Todos os direitos reservados.
    </footer>
  );
};
