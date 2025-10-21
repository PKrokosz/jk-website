import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>JK Handmade Footwear</h1>
      <p>
        Warsztat zamówień miarowych rozwijany w oparciu o Next.js, Drizzle ORM
        oraz płatności Stripe. Ten szkielet projektu zawiera podstawowe narzędzia
        developerskie i API startowe, abyś mógł skupić się na logice domenowej.
      </p>
      <ul>
        <li>
          <Link href="/healthz">Status aplikacji</Link>
        </li>
        <li>
          <Link href="/api/pricing/quote">API wyceny (POST)</Link>
        </li>
      </ul>
    </main>
  );
}
