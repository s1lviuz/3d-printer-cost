'use client'

import { useMemo, useState } from "react"
import { useQuery } from "react-query"
import { MoreHorizontal, ArrowUpDown, Plus, Edit, Trash } from "lucide-react"
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
import { AddFilament } from "./AddFilament"
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { filamentSchema } from "@/schemas/filament"
import { Form } from "@/components/ui/form"
import { Filament } from "@/schemas/filament"
import { toast } from "sonner"
import { useIsMobile } from "@/hooks/use-mobile"
import { useTranslations } from "next-intl"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

const fetchFilaments = async () => {
    const response = await fetch('/api/filaments')
    return await response.json() as Filament[]
}

function DataTable<TData, TValue>({
    columns,
    data,
    openModal
}: DataTableProps<TData, TValue> & { openModal: () => void }) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = useState<ColumnFiltersState>([])
    const [search, setSearch] = useState<string>("")

    const t = useTranslations()

    const isMobile = useIsMobile()

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
            <div className="flex items-center justify-between py-4 gap-4">
                <Input
                    placeholder={t('commom.find')}
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value)

                        table.setGlobalFilter(String(event.target.value))
                    }}
                    className="max-w-sm"
                />
                <Button onClick={openModal}>
                    <Plus />
                    {!isMobile && t('parameters.filaments.add')}
                </Button>
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
                                    {t('commom.noData')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {table.getPageCount() > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {t('commom.previous')}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {t('commom.next')}
                    </Button>
                </div>
            )}
        </div>
    )
}

export function AllFilaments() {
    const filaments = useQuery('filaments', fetchFilaments)
    const [isOpen, setIsOpen] = useState(false)

    const t = useTranslations()

    const defaultValues = {
        name: "",
        color: "",
        material: "",
        cost: 0
    }

    const methods = useForm<Filament>({
        mode: 'onSubmit',
        resolver: zodResolver(filamentSchema),
        defaultValues,
    });
    const { watch } = methods;

    const columns = useMemo(() => [
        {
            accessorKey: "name",
            header: t('commom.name'),
        },
        {
            accessorKey: "color",
            header: t('commom.color'),
        },
        {
            accessorKey: "material",
            header: t('commom.material'),
        },
        {
            accessorKey: "cost",
            header: ({ column }) => {
                return (
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        {t('commom.costPerKg')}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                )
            },
            cell: ({ row }) => {
                const cost = parseFloat(row.getValue("cost"))
                const formatted = new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }).format(cost)

                return <div>{formatted}</div>
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
                            <DropdownMenuLabel>
                                {t('commom.options')}
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => {
                                    methods.reset(row.original)
                                    setIsOpen(true)
                                }}
                            >
                                <Edit />
                                {t('commom.edit')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={async () => {
                                    const response = await fetch("/api/filaments", {
                                        method: "DELETE",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify(row.original),
                                    })

                                    if (response.ok) {
                                        filaments.refetch()
                                        toast(t('parameters.filaments.toast.delete.success'))
                                    } else {
                                        toast(t('parameters.filaments.toast.delete.error'))
                                    }
                                }}
                                className="focus:bg-destructive focus:text-destructive-foreground"
                            >
                                <Trash />
                                {t('commom.delete')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ] satisfies ColumnDef<Filament>[], [t, filaments, methods, setIsOpen])

    const onSubmit = async (data: Filament) => {
        const response = await fetch('/api/filaments', {
            method: data.id ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })

        if (response.ok) {
            setIsOpen(false)
            filaments.refetch()
            methods.reset()

            toast(data.id ?
                t('parameters.filaments.toast.edit.success') :
                t('parameters.filaments.toast.add.success')
            )
        } else {
            const errorData = await response.json()
            toast(data.id ? t('parameters.filaments.toast.edit.error') : t('parameters.filaments.toast.add.error'))
        }
    };

    return (
        <div>
            {filaments.isLoading && <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full mx-auto my-8" />}
            {filaments.isError && <p>{t('parameters.filaments.loadingError')}</p>}
            {filaments.isSuccess && (
                <DataTable columns={columns} data={filaments.data} openModal={() => setIsOpen(true)} />
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
                                <DialogTitle>{watch("id") ?
                                    t('parameters.filaments.edit') :
                                    t('parameters.filaments.add')}
                                </DialogTitle>
                                <DialogDescription>
                                    {watch("id")
                                        ? t('parameters.filaments.dialog.edit')
                                        : t('parameters.filaments.dialog.add')
                                    }
                                </DialogDescription>
                            </DialogHeader>
                            <AddFilament />
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => {
                                    setIsOpen(false)
                                    methods.reset(defaultValues)
                                }}>
                                    {t('commom.cancel')}
                                </Button>
                                <Button type="submit">
                                    {t('commom.save')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}