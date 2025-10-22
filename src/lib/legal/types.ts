export type LegalInlineContent =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "link";
      text: string;
      href: string;
    }
  | {
      type: "strong";
      text: string;
    };

export type LegalParagraphBlock = {
  type: "paragraph";
  content: LegalInlineContent[];
};

export type LegalListBlock = {
  type: "list";
  variant: "unordered" | "ordered";
  items: LegalInlineContent[][];
};

export type LegalContentBlock = LegalParagraphBlock | LegalListBlock;

export type LegalSection = {
  id: string;
  title: string;
  blocks: LegalContentBlock[];
};
