'use client'

import { useMemo, useState } from "react"
import { useQuery } from "react-query"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { AddPrinter } from "./AddPrinter"
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { printerSchema } from "@/schemas/printer"
import { Form } from "@/components/ui/form"
import { Printer } from "@/schemas/printer"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

const fetchPrinters = async () => {
    const response = await fetch('/api/printers')
    return await response.json() as Printer[]
}

function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState<ColumnFiltersState>([])
    const [search, setSearch] = useState<string>("")

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        columnResizeMode: "onChange",
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: 'auto',
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            globalFilter,
        },
    })

    return (
        <div>
            <div className="flex items-center py-4">
                <Input
                    placeholder="Pesquisar"
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value)

                        table.setGlobalFilter(String(event.target.value))
                    }}
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Nenhum dado encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Anterior
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Próxima
                </Button>
            </div>
        </div>
    )
}

export function AllPrinters() {
    const printers = useQuery('printers', fetchPrinters)
    const [isOpen, setIsOpen] = useState(false)

    const methods = useForm<Printer>({
        mode: 'onSubmit',
        resolver: zodResolver(printerSchema),
    });
    const { watch } = methods;

    const columns = useMemo(() => [
        {
            accessorKey: "name",
            header: "Nome",
        },
        {
            accessorKey: "wattage",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Potência (Watts)
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const wattage = parseFloat(row.getValue("wattage"))
                return <div>{wattage} W</div>
            }
        },
        {
            accessorKey: "id",
            header: "",
            size: 40,
            maxSize: 40,
            cell: ({ row }) => {
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="ghost" size="sm">
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Opções</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => {
                                    methods.reset(row.original)
                                    setIsOpen(true)
                                }}
                            >
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    console.log("Delete", row.original)
                                }}
                            >
                                Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ] satisfies ColumnDef<Printer>[], [])

    const onSubmit = (data: any) => {
        console.log(data);
    };

    return (
        <div>
            {printers.isLoading && <p>Carregando...</p>}
            {printers.isError && <p>Ocorreu um erro ao carregar as impressoras.</p>}
            {printers.isSuccess && (
                <DataTable columns={columns} data={printers.data} />
            )}
            <Form {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{watch("id") ? "Editar Impressora" : "Adicionar Impressora"}</DialogTitle>
                                <DialogDescription>
                                    {watch("id")
                                        ? "Edite as informações da impressora."
                                        : "Adicione uma nova impressora ao sistema."}
                                </DialogDescription>
                            </DialogHeader>
                            <AddPrinter />
                            <DialogFooter>
                                <Button type="reset" variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
                                <Button type="submit">Salvar</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </form>
            </Form>
        </div>
    )
}