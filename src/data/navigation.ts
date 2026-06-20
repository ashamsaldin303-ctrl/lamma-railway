import type { FooterColumn, NavLink } from './types';

export const mainNav: NavLink[] = [
  { href: '/gatherings', labelKey: 'nav.gatherings' },
  { href: '/hosts', labelKey: 'nav.hosts' },
  { href: '/topics', labelKey: 'nav.topics' },
  { href: '/letters', labelKey: 'nav.letters' },
];

export const footerColumns: FooterColumn[] = [
  { titleKey: 'footer.titles.about', links: [
    { href: '/about', labelKey: 'footer.about.story' },
    { href: '/about', labelKey: 'footer.about.manifesto' },
    { href: '/about', labelKey: 'footer.about.team' },
    { href: '/faq', labelKey: 'footer.help.faq' },
  ]},
  { titleKey: 'footer.titles.help', links: [
    { href: '/gatherings', labelKey: 'nav.gatherings' },
    { href: '/hosts', labelKey: 'nav.hosts' },
    { href: '/topics', labelKey: 'nav.topics' },
    { href: '/letters', labelKey: 'nav.letters' },
  ]},
  { titleKey: 'footer.titles.contact', links: [
    { href: 'mailto:hello@lamma.kw', labelKey: 'footer.contact.email' },
    { href: 'https://instagram.com/lamma.kw', labelKey: 'footer.contact.instagram' },
    { href: 'https://x.com/lamma_kw', labelKey: 'footer.contact.x' },
  ]},
];

export const socialLinks = { instagram: 'https://instagram.com/lamma.kw', x: 'https://x.com/lamma_kw' };
