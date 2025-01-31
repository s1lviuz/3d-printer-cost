'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Prisma } from "@prisma/client"
import { useQuery } from "react-query"
import { UserPayload } from "@/app/api/users/me/route"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { signOut } from "next-auth/react"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

const fetchMe = async () => {
    const response = await fetch('/api/users/me')
    if (!response.ok) throw new Error('Falha ao buscar usuário')
    return response.json() as Promise<Prisma.UserGetPayload<{
        select: typeof UserPayload['select']
    }>>
}

const fetchDelete = async () => {
    const response = await fetch('/api/users/me', {
        method: 'DELETE',
    })
    if (!response.ok) throw new Error('Falha ao deletar usuário')
    return response.json() as Promise<{ success: boolean }>
}

export function Profile() {
    const me = useQuery('me', fetchMe)

    const handleDelete = async () => {
        try {
            const response = await fetchDelete()
            if (response.success) {
                signOut()

                toast.success('Conta deletada com sucesso')
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Perfil</CardTitle>
            </CardHeader>
            <CardContent>
                {me.isLoading && <p>Carregando...</p>}
                {me.isError && <p>Erro ao carregar perfil</p>}
                {me.isSuccess && (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <Avatar>
                                <AvatarImage src={me.data.image ?? ''} />
                                <AvatarFallback>{me.data.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-xl font-bold">{me.data.name}</h2>
                                <p className="text-gray-500">{me.data.email}</p>
                            </div>
                        </div>
                        <div className="">
                            <h3 className="text-lg font-bold">Contas</h3>
                            <ul className="list-disc list-inside">
                                {me.data.accounts?.map((account) => (
                                    <li key={account.provider}>{account.provider}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="">
                            <h3 className="text-lg font-bold">Estatísticas</h3>
                            <ul className="list-disc list-inside">
                                <li>Impressoras: {me.data._count.printers}</li>
                                <li>Filamentos: {me.data._count.filaments}</li>
                                <li>Regiões de custo: {me.data._count.regionCosts}</li>
                            </ul>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full" variant={'destructive'}>
                                    <Trash2 size={16} />
                                    Deletar conta
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Você tem certeza que deseja deletar sua conta?
                                    </DialogTitle>
                                    <DialogDescription className="text-destructive">
                                        Essa ação é irreversível e deletará todos os dados associados a sua conta.
                                    </DialogDescription>
                                </DialogHeader>
                                <Button onClick={handleDelete} variant={'destructive'}>
                                    Deletar conta
                                </Button>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

