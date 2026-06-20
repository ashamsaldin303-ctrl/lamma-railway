'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';

/**
 * AR / EN locale switcher.
 * Uses next-intl's locale-aware router so the URL prefix updates
 * (`/` <-> `/en`) and the html lang/dir attributes follow.
 */
export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('nav');

  const switchTo = (next: 'ar' | 'en') => {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 px-2 text-sm font-medium text-ink"
          aria-label={t('switchLocale')}
        >
          <Languages className="h-4 w-4 text-clay" />
          <span className="tabular uppercase">{locale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[8rem]">
        <DropdownMenuItem
          onClick={() => switchTo('ar')}
          className={locale === 'ar' ? 'font-semibold text-clay' : ''}
          dir="rtl"
        >
          العربية
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchTo('en')}
          className={locale === 'en' ? 'font-semibold text-clay' : ''}
          dir="ltr"
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
