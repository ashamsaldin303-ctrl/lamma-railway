'use client';
import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-6 inline-flex size-16 items-center justify-center rounded-full bg-sand"><AlertCircle className="size-8 text-clay" /></div>
        <h1 className="mb-3 font-display text-2xl font-semibold text-ink">حدث خطأ ما</h1>
        <p className="mb-6 text-stone">عذراً، حدث خطأ غير متوقع. حاول مرة أخرى.</p>
        <Button onClick={reset} className="gap-2 bg-clay text-primary-foreground hover:bg-clay/90"><RefreshCw className="size-4" />إعادة المحاولة</Button>
      </div>
    </div>
  );
}
