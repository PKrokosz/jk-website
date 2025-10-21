import Image from "next/image";
import Link from "next/link";

import { ORDER_MODELS } from "@/config/orderModels";

const currencyFormatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  maximumFractionDigits: 2
});

export function NativeModelShowcase() {
  return (
    <section className="section" aria-labelledby="native-models-heading">
      <div className="container">
        <div className="section-header">
          <h2 id="native-models-heading">Modele z formularza natywnego</h2>
          <p>
            To te same sylwetki, które wybierzesz podczas składania zamówienia. Przejrzyj je w jednym
            miejscu i znajdź inspirację przed wypełnieniem formularza.
          </p>
        </div>
        <div className="native-model-grid" role="list">
          {ORDER_MODELS.map((model) => {
            const detail = model.googleValue.replace(/-\s*(\d)/, " – $1");
            return (
              <article key={model.id} role="listitem" className="native-model-card">
                <div className="native-model-card__media" aria-hidden="true">
                  <Image
                    src={model.image}
                  alt={`Model ${model.name} z katalogu JK Handmade Footwear`}
                  width={320}
                  height={240}
                  className="native-model-card__image"
                  sizes="(min-width: 1024px) 260px, 80vw"
                />
              </div>
              <div className="native-model-card__body">
                <h3>{model.name}</h3>
                <p className="native-model-card__price">
                  {currencyFormatter.format(model.price)}
                </p>
                  <p className="native-model-card__description">{detail}</p>
                </div>
              </article>
            );
          })}
        </div>
        <div className="native-model-grid__cta">
          <Link className="button button--primary" href="/order/native">
            Przejdź do zamówienia natywnego
          </Link>
        </div>
      </div>
    </section>
  );
}
