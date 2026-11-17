import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./dialog";
import { cn } from "./utils";

/**
 * Padrão único para aprofundar e agir: painel lateral à direita.
 * Cabeçalho fixo, corpo com rolagem e rodapé fixo com as ações.
 */
export function SidePanel({
  open, onOpenChange, eyebrow, title, description, footer, children, className,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "top-0 left-auto right-0 translate-x-0 translate-y-0 h-dvh w-full max-w-[min(100%,30rem)] sm:max-w-[30rem]",
          "rounded-none border-0 border-l p-0 gap-0 flex flex-col",
          "data-[state=open]:zoom-in-100 data-[state=closed]:zoom-out-100 data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
          className,
        )}
      >
        <div className="flex-none px-6 pt-6 pb-4 border-b border-border pr-12">
          {eyebrow}
          <DialogTitle className="text-lg font-semibold leading-snug">{title}</DialogTitle>
          {description ? (
            <DialogDescription className="mt-1 text-sm text-muted-foreground">{description}</DialogDescription>
          ) : (
            <DialogDescription className="sr-only">Painel lateral</DialogDescription>
          )}
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">{children}</div>
        {footer && <div className="flex-none border-t border-border px-6 py-4 flex gap-2 justify-end">{footer}</div>}
      </DialogContent>
    </Dialog>
  );
}
