export interface DropdownActionsProps<T> {
  item: T;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onExtraAction1?: (item: T) => void;
  onExtraAction2?: (item: T) => void;
  showExtraAction1?: (item: T) => boolean;
  showExtraAction2?: (item: T) => boolean;
}