import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { getTranslations } from 'next-intl/server'

export default async function Home() {
  const t = await getTranslations()

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className='flex flex-col justify-center p-4 w-fit mx-auto space-y-4'>
        <div className="w-48 h-48 mx-auto flex flex-col justify-center bg-[url(/fundo-2.png)] bg-cover bg-center rounded-3xl shadow" />
        <h1 className="text-4xl font-bold mb-4 text-center">
          {t('home.title')}
        </h1>
        <p className="text-xl mb-8 text-center max-w-2xl mx-auto">
          {t('home.description')}
        </p>
        <div className="text-center">
          <Link href="/calculator">
            <Button size="lg">
              {t('home.button')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}



