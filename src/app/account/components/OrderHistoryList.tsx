import React from "react";

import { accountOrderHistory, accountOrderStatusLabels } from "@/lib/account/order-history";

export function OrderHistoryList() {
  return (
    <div className="order-history" aria-live="polite">
      <ul className="order-history__list">
        {accountOrderHistory.map((order) => (
          <li key={order.id} className="order-history__item">
            <article aria-labelledby={`order-${order.id}`} className="order-card">
              <header className="order-card__header">
                <h3 id={`order-${order.id}`}>{order.model}</h3>
                <p className="order-card__meta">{order.id}</p>
              </header>

              <dl className="order-card__details">
                <div>
                  <dt>Status</dt>
                  <dd>
                    <span className={`order-status order-status--${order.status}`}>
                      {accountOrderStatusLabels[order.status]}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>Wykończenie</dt>
                  <dd>{order.finish}</dd>
                </div>
                <div>
                  <dt>Złożono</dt>
                  <dd>{order.placedAt}</dd>
                </div>
                <div>
                  <dt>Planowany odbiór</dt>
                  <dd>{order.estimatedDelivery}</dd>
                </div>
                <div>
                  <dt>Wycena</dt>
                  <dd>{order.totalPrice}</dd>
                </div>
              </dl>

              <p className="order-card__notes">{order.progressNotes}</p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
