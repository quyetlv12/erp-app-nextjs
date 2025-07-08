'use client'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Column {
    key: string;
    label: string;
    render?: (value: any, item: any) => React.ReactNode;
}

interface CustomerTableProps {
    data: any[];
    columns: Column[];
}

const TableCustom = ({ data, columns }: CustomerTableProps) => {
    return (
        <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
            <Table>
                <TableHeader>
                    <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
                        
                        {columns.map((column, index) => (
                            <TableHead 
                                key={column.key} 
                                className={index === 0 ? "w-[70px]" : index === columns.length - 1 ? "text-right xl:pr-7.5" : ""}
                            >
                                {column.label}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index} className="border-[#eee] dark:border-dark-3">
                            {columns.map((column, colIndex) => (
                                <TableCell 
                                    key={column.key}
                                    className={colIndex === 0 ? "w-[70px]" : colIndex === columns.length - 1 ? "xl:pr-7.5" : ""}
                                >
                                    {column?.render ? column.render(item[column.key], item) : item[column.key]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default TableCustom