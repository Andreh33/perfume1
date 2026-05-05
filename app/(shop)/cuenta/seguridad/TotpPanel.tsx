"use client";

import { useState, useTransition } from "react";
import { Loader2, ShieldCheck, ShieldOff, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { confirmTotpEnrollAction, disableTotpAction, startTotpEnrollAction } from "./actions";

type Stage = "off" | "enroll" | "active";

export function TotpPanel({ enabled }: { enabled: boolean }) {
  const [stage, setStage] = useState<Stage>(enabled ? "active" : "off");
  const [otpauthUrl, setOtpauthUrl] = useState<string | null>(null);
  const [base32, setBase32] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [pending, start] = useTransition();
  const [copied, setCopied] = useState(false);

  const onStart = () =>
    start(async () => {
      const r = await startTotpEnrollAction();
      if (!r.ok) return toast.error(r.error);
      setOtpauthUrl(r.otpauthUrl);
      setBase32(r.base32);
      setStage("enroll");
    });

  const onConfirm = () =>
    start(async () => {
      const r = await confirmTotpEnrollAction({ token });
      if (!r.ok) return toast.error(r.error);
      setBackupCodes(r.backupCodes);
      setStage("active");
      toast.success("2FA activado");
    });

  const onDisable = () =>
    start(async () => {
      const r = await disableTotpAction({ token });
      if (!r.ok) return toast.error(r.error);
      setStage("off");
      setBackupCodes(null);
      setToken("");
      toast.success("2FA desactivado");
    });

  if (stage === "active" && !backupCodes) {
    return (
      <div className="card-velvet p-7 space-y-5">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-[var(--color-success)]" />
          <div>
            <p className="display text-xl">2FA activo</p>
            <p className="text-sm text-[var(--color-ink-muted)]">Tu cuenta está protegida.</p>
          </div>
        </div>
        <details className="border-t border-[oklch(0.55_0.10_70_/_0.2)] pt-5 space-y-3">
          <summary className="cursor-pointer text-sm text-[var(--color-danger)]">Desactivar 2FA</summary>
          <p className="text-xs text-[var(--color-ink-muted)]">
            Introduce un código actual de tu app autenticadora para confirmar.
          </p>
          <div className="flex gap-2">
            <Input
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              className="max-w-[160px] font-mono tracking-widest text-center"
            />
            <Button variant="danger" onClick={onDisable} disabled={pending || token.length !== 6}>
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldOff className="h-4 w-4" />}
              Desactivar
            </Button>
          </div>
        </details>
      </div>
    );
  }

  if (backupCodes) {
    return (
      <div className="card-velvet p-7 space-y-5">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-[var(--color-success)]" />
          <div>
            <p className="display text-xl">2FA activado</p>
            <p className="text-sm text-[var(--color-ink-muted)]">Guarda estos códigos de recuperación. No volverás a verlos.</p>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-2 font-mono text-sm">
          {backupCodes.map((code) => (
            <li key={code} className="px-3 py-2 rounded bg-[oklch(0.18_0.020_55)] border border-[var(--color-gold-deep)] text-center tracking-widest">
              {code}
            </li>
          ))}
        </ul>
        <Button
          variant="ghost"
          onClick={() => {
            navigator.clipboard.writeText(backupCodes.join("\n"));
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          }}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copiado" : "Copiar todos"}
        </Button>
        <Button onClick={() => setBackupCodes(null)}>Listo, los he guardado</Button>
      </div>
    );
  }

  if (stage === "enroll" && otpauthUrl && base32) {
    const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(otpauthUrl)}`;
    return (
      <div className="card-velvet p-7 space-y-5">
        <p className="display text-xl">Escanea este código</p>
        <p className="text-sm text-[var(--color-ink-muted)]">
          Usa Google Authenticator, 1Password, Authy o cualquier app TOTP.
        </p>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <img
            src={qrSrc}
            alt="Código QR para 2FA"
            width={240}
            height={240}
            className="rounded-md border border-[var(--color-gold-deep)] bg-white p-2"
          />
          <div className="flex-1 space-y-3">
            <div>
              <p className="accent text-[0.6rem] text-[var(--color-gold)]">Clave manual</p>
              <p className="font-mono text-sm break-all bg-[oklch(0.18_0.020_55)] p-2 rounded border border-[oklch(0.55_0.10_70_/_0.2)]">
                {base32}
              </p>
            </div>
            <div className="space-y-2">
              <label className="block">
                <span className="accent text-[0.6rem] text-[var(--color-gold)]">Código de 6 dígitos</span>
                <Input
                  value={token}
                  onChange={(e) => setToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="000000"
                  className="font-mono tracking-widest text-center text-lg"
                />
              </label>
              <Button onClick={onConfirm} disabled={pending || token.length !== 6} className="w-full">
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-velvet p-7 space-y-4">
      <div className="flex items-center gap-3">
        <ShieldOff className="h-6 w-6 text-[var(--color-ink-muted)]" />
        <div>
          <p className="display text-xl">2FA inactivo</p>
          <p className="text-sm text-[var(--color-ink-muted)]">
            Añade una segunda capa de seguridad con una app autenticadora.
          </p>
        </div>
      </div>
      <Button onClick={onStart} disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
        Activar 2FA
      </Button>
    </div>
  );
}
