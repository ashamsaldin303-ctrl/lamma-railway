'use client';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Container } from './Container';
import { footerColumns, socialLinks } from '@/data/navigation';
import { Instagram, Twitter } from 'lucide-react';

export function SiteFooter() {
  const t = useTranslations();
  const isExternal = (href: string) => href.startsWith('http') || href.startsWith('mailto:');

  return (
    <footer className="mt-auto border-t border-border bg-paper">
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {footerColumns.map((col) => (
            <div key={col.titleKey}>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-stone">{t(col.titleKey as 'footer.titles.about')}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.labelKey}>
                    {isExternal(link.href) ? (
                      <a href={link.href} className="link-editorial text-sm text-ink/80 hover:text-clay" target={link.href.startsWith('http') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}>{t(link.labelKey as 'footer.contact.email')}</a>
                    ) : (
                      <Link href={link.href} className="link-editorial text-sm text-ink/80 hover:text-clay">{t(link.labelKey as 'nav.gatherings')}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-stone">{t('footer.rights')}</p>
          <div className="flex items-center gap-3">
            <a href={socialLinks.instagram} aria-label="Instagram" className="text-stone transition-colors hover:text-clay" target="_blank" rel="noopener noreferrer"><Instagram className="h-4 w-4" /></a>
            <a href={socialLinks.x} aria-label="X" className="text-stone transition-colors hover:text-clay" target="_blank" rel="noopener noreferrer"><Twitter className="h-4 w-4" /></a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
