import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import "./skeleton.css";

export function TableSkeleton({ rows = 5, columns = 4 }) {

  // const renderSkeletonRows = () => {
  //   return Array.from({ length: rows }).map((_, rowIndex) => (
  //     <TableRow  key={`skeleton-row-${rowIndex}`}>
  //       {Array.from({ length: columns }).map((_, colIndex) => (
  //         <TableCell  key={`skeleton-col-${rowIndex}-${colIndex}`}>
  //           <div className="skeleton"></div>
  //         </TableCell >
  //       ))}
  //     </TableRow>
  //   ));
  // };

  return (
    <div className="table-responsive">
      <Table className="w-full border border-gray-300 dark:border-gray-700">
      {/* Table Header */}
      <TableHeader>
        <TableRow className="bg-gray-200 dark:bg-gray-800">
          {Array.from({ length: columns }).map((_, index) => (
            <TableHead key={`skeleton-header-${index}`} className="p-3">
              <div className="h-4 w-1/2 rounded bg-gray-300 dark:bg-gray-600 animate-pulse mx-auto"></div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      {/* Table Body */}
      <TableBody>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <TableRow key={`skeleton-row-${rowIndex}`} className="border-b border-gray-300 dark:border-gray-700">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`} className="p-3">
                <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700 animate-pulse mx-auto"></div>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  );

}