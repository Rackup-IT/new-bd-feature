import { cn } from "@/utils/utils";

export interface Column<T> {
  header: string;
  cell: (row: T, rowIndex: number) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey?: keyof T;
  getRowClassName?: (row: T, rowIndex: number) => string;
}

export default function Table<T extends object>({
  data,
  columns,
  rowKey,
  getRowClassName,
}: TableProps<T>) {
  // const cols = useMemo(() => columns, [columns]);
  // const rows = useMemo(() => data, [data]);

  return (
    <div className="overflow-auto max-h-full">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.header}
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => {
            const key = rowKey ? (row[rowKey] as React.Key) : rowIndex;
            const rowClassName = getRowClassName
              ? getRowClassName(row, rowIndex)
              : "";
            return (
              <tr key={key} className={rowClassName}>
                {columns.map((col) => (
                  <td
                    key={col.header}
                    className={cn("px-4 py-2 text-sm w-fit")}
                  >
                    {col.cell(row, rowIndex)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
