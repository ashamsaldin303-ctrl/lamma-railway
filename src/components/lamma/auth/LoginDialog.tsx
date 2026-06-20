'use client';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/auth-store';
import { localized } from '@/lib/use-localized';
import { demoUsers } from '@/data/demo-users';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Lock, Users } from 'lucide-react';

export function LoginDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const t = useTranslations('auth');
  const locale = useLocale() as 'ar' | 'en';
  const { login, loginAs } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError(null);
    const r = login(email, password);
    if (r.success) { onOpenChange(false); setEmail(''); setPassword(''); }
    else if (r.error) setError(t(`errors.${r.error}` as 'user-not-found'));
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="font-display text-2xl">{t('loginTitle')}</DialogTitle><DialogDescription>{t('loginSubtitle')}</DialogDescription></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2"><Label htmlFor="login-email">{t('email')}</Label><div className="relative"><Mail className="absolute top-1/2 size-4 -translate-y-1/2 text-stone start-3" /><Input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="noura@lamma.demo" className="ps-9" required /></div></div>
          <div className="space-y-2"><Label htmlFor="login-password">{t('password')}</Label><div className="relative"><Lock className="absolute top-1/2 size-4 -translate-y-1/2 text-stone start-3" /><Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••" className="ps-9" required /></div><p className="text-xs text-stone">{t('demoPasswordHint')}</p></div>
          {error && <p className="text-sm text-error">{error}</p>}
          <Button type="submit" className="w-full bg-clay text-primary-foreground hover:bg-clay/90">{t('login')}</Button>
        </form>
        <div className="relative my-2"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-stone/20" /></div><div className="relative flex justify-center text-xs"><span className="bg-paper px-2 text-stone">{t('orQuickDemo')}</span></div></div>
        <div className="space-y-2"><p className="flex items-center justify-center gap-1 text-center text-xs text-stone"><Users className="size-3" /> {t('demoUsersTitle')}</p><div className="grid grid-cols-4 gap-2">{demoUsers.map((u) => (<Button key={u.id} variant="outline" size="sm" onClick={() => { loginAs(u.id); onOpenChange(false); }} className="h-auto flex-col items-center gap-1 py-2"><Avatar className="size-8"><AvatarImage src={u.avatarUrl} alt="" /><AvatarFallback>{localized(u.nameLocalized, locale).charAt(0)}</AvatarFallback></Avatar><span className="text-xs">{t(`demoUsers.${u.id}` as 'user-noura')}</span></Button>))}</div></div>
      </DialogContent>
    </Dialog>
  );
}
