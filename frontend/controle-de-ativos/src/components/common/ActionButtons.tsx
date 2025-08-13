'use client';
import { FaEdit, FaTrash } from 'react-icons/fa';
import styles from './ActionButtons.module.css';

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onEmprestar?: () => void;
  onDevolver?: () => void;
}

export function ActionButtons({ onEdit, onDelete, onEmprestar, onDevolver }: ActionButtonsProps) {
  return (
    <div className={`${styles.containerBotoes} flex flex-col gap-2 p-2`}>
      {onEdit && (
        <button
          onClick={onEdit}
          className={`${styles.botoesAcao} flex items-center gap-2 p-2 bg-yellow-400 rounded hover:bg-yellow-500`}
        >
          <FaEdit className="text-white" /> Atualizar
        </button>
      )}
      {onEmprestar && (
        <button
          onClick={onEmprestar}
          className={`${styles.botoesAcao} flex items-center gap-2 p-2 bg-orange-500 rounded hover:bg-orange-600`}
        >
          <FaEdit className="text-white" /> Emprestar
        </button>
      )}
      {onDevolver && (
        <button
          onClick={onDevolver}
          className={`${styles.botoesAcao} flex items-center gap-2 p-2 bg-green-500 rounded hover:bg-green-600`}
        >
          <FaEdit className="text-white" /> Devolver
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className={`${styles.botoesAcao} flex items-center gap-2 p-2 bg-red-500 rounded hover:bg-red-600`}
        >
          <FaTrash className="text-white" /> Deletar
        </button>
      )}
    </div>
  );
}
