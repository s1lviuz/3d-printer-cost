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
import { useTranslations } from "next-intl"

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

    const t = useTranslations()

    const handleDelete = async () => {
        try {
            const response = await fetchDelete()
            if (response.success) {
                signOut()

                toast.success(t('profile.deleteDialog.toast.success'))
            }
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>
                    {t('commom.profile')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {me.isLoading && <p>
                    {t('commom.loading')}
                </p>}
                {me.isError && <p>
                    {t('profile.error')}
                </p>}
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
                            <h3 className="text-lg font-bold">
                                {t('commom.accounts')}
                            </h3>
                            <ul className="list-disc list-inside">
                                {me.data.accounts?.map((account) => (
                                    <li key={account.provider}>{account.provider}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="">
                            <h3 className="text-lg font-bold">Estatísticas</h3>
                            <ul className="list-disc list-inside">
                                <li>{t('commom.printers')}: {me.data._count.printers}</li>
                                <li>{t('commom.filaments')}: {me.data._count.filaments}</li>
                                <li>{t('commom.regions')}: {me.data._count.regionCosts}</li>
                            </ul>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="w-full" variant={'destructive'}>
                                    <Trash2 size={16} />
                                    {t('profile.delete')}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        {t('profile.deleteDialog.title')}
                                    </DialogTitle>
                                    <DialogDescription className="text-destructive">
                                        {t('profile.deleteDialog.description')}
                                    </DialogDescription>
                                </DialogHeader>
                                <Button onClick={handleDelete} variant={'destructive'}>
                                    {t('profile.delete')}
                                </Button>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

