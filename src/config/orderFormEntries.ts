export const ORDER_FORM_ENTRIES = {
  fullName: "entry.1884265043",
  phoneNumber: "entry.373060618",
  parcelLockerCode: "entry.1394835577",
  email: "entry.1434629237",
  footLength: "entry.1515156344",
  instepCircumference: "entry.1478352046",
  calfCircumference: "entry.1172317978",
  model: "entry.557964889",
  color: "entry.138253594",
  size: "entry.1212348438",
  accessories: "entry.1983434781",
  waterskin: "entry.999567488",
  bracer: "entry.717495686",
  shoeTrees: "entry.1369461585",
  discountCode: "entry.354164290",
  notes: "entry.513669972"
} as const;

export const GOOGLE_FORM_CONSTANTS = {
  actionUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSdpPdbrzFCc6EN3TgaocfSCvo-uKRNxqTNJqqsV-HeypWuaMw/formResponse",
  fvv: "1",
  pageHistory: "0",
  fbzx: "-4079028347465316598"
} as const;

export type OrderFormEntryKey = keyof typeof ORDER_FORM_ENTRIES;
