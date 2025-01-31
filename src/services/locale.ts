'use server';

import { cookies, headers } from 'next/headers';
import { Locale, defaultLocale } from '@/i18n/config';

const COOKIE_NAME = 'NEXT_LOCALE';

export async function getUserLocale() {
    const headerList = headers();
    const acceptLanguage = headerList.get('accept-language');
    const firstLanguage = acceptLanguage ? acceptLanguage.split(',')[0] : 'en';

    const cookieStore = cookies();
    const localeStored = cookieStore.get(COOKIE_NAME)?.value;

    return localeStored || firstLanguage || defaultLocale;
}

export async function setUserLocale(locale: Locale) {
    cookies().set(COOKIE_NAME, locale);
}