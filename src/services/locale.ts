'use server';

import { cookies, headers } from 'next/headers';
import { Locale, defaultLocale, locales } from '@/i18n/config';

const COOKIE_NAME = 'NEXT_LOCALE';

const getHeaderLocale = (locale: string) => {
    if (locale.includes('pt')) {
        return 'pt-BR';
    }

    return 'en';
}

export async function getUserLocale() {
    const headerList = headers();
    const acceptLanguage = headerList.get('accept-language');
    const firstLanguage = acceptLanguage ? getHeaderLocale(acceptLanguage.split(',')[0]) : null;

    const cookieStore = cookies();
    const localeStored = cookieStore.get(COOKIE_NAME)?.value;

    return localeStored || firstLanguage || defaultLocale;
}

export async function setUserLocale(locale: Locale) {
    cookies().set(COOKIE_NAME, locale);
}