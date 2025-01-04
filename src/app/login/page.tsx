'use client'

import { signIn } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    await signIn('email', { email, callbackUrl: '/' })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Escolha um método para entrar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input disabled id="email" name="email" placeholder="Seu email" type="email" />
              </div>
            </div>
            <Button disabled className="w-full mt-4" type="submit">Entrar com Email</Button>
          </form>
          <div className="flex flex-col gap-2 mt-4">
            <Button onClick={() => signIn('google', { callbackUrl: '/' })} variant="outline">
              Entrar com Google
            </Button>
            {/* <Button onClick={() => signIn('facebook', { callbackUrl: '/' })} variant="outline">
              Entrar com Facebook
            </Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

