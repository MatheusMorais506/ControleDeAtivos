export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => React.ReactNode;
}
