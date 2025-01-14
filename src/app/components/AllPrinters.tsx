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
import { toast } from "sonner"

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
    openModal
}: DataTableProps<TData, TValue> & { openModal: () => void }) {
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
            <div className="flex items-center justify-between py-4">
                <Input
                    placeholder="Pesquisar"
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value)

                        table.setGlobalFilter(String(event.target.value))
                    }}
                    className="max-w-sm"
                />
                <Button onClick={openModal}>Adicionar Impressora</Button>
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

    const defaultValues = {
        name: "",
        wattage: 0,
    }

    const methods = useForm<Printer>({
        mode: 'onSubmit',
        resolver: zodResolver(printerSchema),
        defaultValues,
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
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Potência (Watts)
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
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
                                onClick={async () => {
                                    const response = await fetch("/api/printers", {
                                        method: "DELETE",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify(row.original),
                                    })

                                    if (response.ok) {
                                        printers.refetch()
                                        toast("Impressora excluída com sucesso.")
                                    } else {
                                        toast("Falha ao excluir impressora.")
                                    }
                                }}
                                className="focus:bg-destructive focus:text-destructive-foreground"
                            >
                                Excluir
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ] satisfies ColumnDef<Printer>[], [])

    const onSubmit = async (data: Printer) => {
        const response = await fetch('/api/printers', {
            method: data.id ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (response.ok) {
            setIsOpen(false)
            printers.refetch()
            methods.reset()

            toast(data.id ? "Impressora atualizada com sucesso." : "Impressora adicionada com sucesso.")
        } else {
            const errorData = await response.json()
            toast(`Falha ao ${data.id ? "atualizar" : "adicionar"} impressora`)
        }
    };

    return (
        <div>
            {printers.isLoading && <p>Carregando...</p>}
            {printers.isError && <p>Ocorreu um erro ao carregar as impressoras.</p>}
            {printers.isSuccess && (
                <DataTable columns={columns} data={printers.data} openModal={() => setIsOpen(true)} />
            )}
            <Dialog open={isOpen} onOpenChange={open => {
                if (!open) {
                    methods.reset(defaultValues)
                }
                setIsOpen(open)
            }}>
                <DialogContent className="sm:max-w-[425px]">
                    <Form {...methods}>
                        <form onSubmit={methods.handleSubmit(onSubmit, (e) => console.log(e))}>
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
                                <Button type="button" variant="outline" onClick={() => {
                                    setIsOpen(false)
                                    methods.reset(defaultValues)
                                }}>Cancelar</Button>
                                <Button type="submit">Salvar</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}