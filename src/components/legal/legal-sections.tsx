import { Fragment } from "react";

import type { LegalInlineContent, LegalSection } from "@/lib/legal/types";

type LegalSectionsProps = {
  sections: LegalSection[];
};

export function LegalSections({ sections }: LegalSectionsProps) {
  return (
    <>
      {sections.map(({ id, title, blocks }) => (
        <section key={id} className="legal-page__section" aria-labelledby={id}>
          <h2 id={id}>{title}</h2>
          {blocks.map((block, blockIndex) => {
            if (block.type === "paragraph") {
              return (
                <p key={`${id}-paragraph-${blockIndex}`}>
                  {renderInlineContent(block.content)}
                </p>
              );
            }

            const ListTag = block.variant === "ordered" ? "ol" : "ul";

            return (
              <ListTag key={`${id}-list-${blockIndex}`}>
                {block.items.map((item, itemIndex) => (
                  <li key={`${id}-list-${blockIndex}-item-${itemIndex}`}>
                    {renderInlineContent(item)}
                  </li>
                ))}
              </ListTag>
            );
          })}
        </section>
      ))}
    </>
  );
}

function renderInlineContent(content: LegalInlineContent[]) {
  return content.map((item, index) => {
    if (item.type === "text") {
      return <Fragment key={`text-${index}`}>{item.text}</Fragment>;
    }

    if (item.type === "strong") {
      return <strong key={`strong-${index}`}>{item.text}</strong>;
    }

    return (
      <a key={`link-${index}`} className="legal-page__link" href={item.href}>
        {item.text}
      </a>
    );
  });
}
