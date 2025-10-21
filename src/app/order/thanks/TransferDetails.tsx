"use client";

import { useState } from "react";

const BANK_DETAILS = {
  recipient: "STONELOVE Anna Karelus",
  nip: "5512389110",
  regon: "525741543",
  accountNumber: "56 1020 1433 0000 1202 0210 3547"
};

interface TransferDetailsProps {
  customerName?: string;
}

export function TransferDetails({ customerName }: TransferDetailsProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const paymentTitle = `${customerName ?? "Imię i nazwisko"} – opłata za buty`;

  const copyToClipboard = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 3000);
    } catch (error) {
      setCopiedField("error");
    }
  };

  return (
    <section className="order-thanks__transfer" aria-labelledby="transfer-heading">
      <div className="order-thanks__card">
        <h2 id="transfer-heading">Dane do przelewu</h2>
        <dl>
          <div>
            <dt>Tytuł przelewu</dt>
            <dd>
              <span>{paymentTitle}</span>
              <button type="button" onClick={() => copyToClipboard("title", paymentTitle)}>
                Kopiuj tytuł
              </button>
            </dd>
          </div>
          <div>
            <dt>Odbiorca</dt>
            <dd>{BANK_DETAILS.recipient}</dd>
          </div>
          <div>
            <dt>NIP / REGON</dt>
            <dd>
              {BANK_DETAILS.nip} · {BANK_DETAILS.regon}
            </dd>
          </div>
          <div>
            <dt>Numer konta</dt>
            <dd>
              <span>{BANK_DETAILS.accountNumber}</span>
              <button type="button" onClick={() => copyToClipboard("account", BANK_DETAILS.accountNumber)}>
                Kopiuj numer konta
              </button>
            </dd>
          </div>
        </dl>
        <p className="order-thanks__note">
          W tytule umieść swoje imię i nazwisko. Po zaksięgowaniu płatności skontaktujemy się z potwierdzeniem terminu.
        </p>
        <p aria-live="polite" className="order-thanks__copied">
          {copiedField === "title" && "Skopiowano tytuł przelewu."}
          {copiedField === "account" && "Skopiowano numer konta."}
          {copiedField === "error" && "Nie udało się skopiować. Skopiuj dane ręcznie."}
        </p>
      </div>
    </section>
  );
}
