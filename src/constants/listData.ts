/** Large list size for stress-testing list implementations. */
export const LIST_ITEM_COUNT = 5000;

const SECTION_LETTERS = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i),
) as readonly string[];

const ICON_NAMES = [
  'cube-outline',
  'layers-outline',
  'albums-outline',
  'grid-outline',
  'apps-outline',
  'barcode-outline',
  'basket-outline',
  'beer-outline',
  'book-outline',
  'briefcase-outline',
  'bug-outline',
  'build-outline',
  'bus-outline',
  'cafe-outline',
  'calendar-outline',
  'call-outline',
  'camera-outline',
  'car-outline',
  'cart-outline',
  'chatbubble-outline',
  'checkbox-outline',
  'clipboard-outline',
  'cloud-outline',
  'code-slash-outline',
  'color-palette-outline',
  'compass-outline',
] as const;

export type ListRowModel = {
  readonly id: string;
  /** 1-based index for display, e.g. "Item 42". */
  readonly ordinal: number;
  readonly iconName: (typeof ICON_NAMES)[number];
};

/** SectionList section shape: letter bucket + rows. */
export type ListSection = {
  title: string;
  data: ListRowModel[];
};

export function iconNameForOrdinal(ordinal: number): (typeof ICON_NAMES)[number] {
  const idx = (ordinal - 1) % ICON_NAMES.length;
  return ICON_NAMES[idx];
}

export function buildFlatListData(count: number = LIST_ITEM_COUNT): ListRowModel[] {
  return Array.from({ length: count }, (_, i) => {
    const ordinal = i + 1;
    return {
      id: `row-${ordinal}`,
      ordinal,
      iconName: iconNameForOrdinal(ordinal),
    };
  });
}

/**
 * Splits {@link LIST_ITEM_COUNT} rows across A–Z; earlier sections receive one extra
 * item when the count does not divide evenly.
 */
export function buildSectionListData(): ListSection[] {
  const total = LIST_ITEM_COUNT;
  const n = SECTION_LETTERS.length;
  const base = Math.floor(total / n);
  const remainder = total % n;

  let ordinal = 1;
  return SECTION_LETTERS.map((title, sectionIndex) => {
    const sectionSize = base + (sectionIndex < remainder ? 1 : 0);
    const data: ListRowModel[] = [];
    for (let i = 0; i < sectionSize; i++) {
      data.push({
        id: `row-${ordinal}`,
        ordinal,
        iconName: iconNameForOrdinal(ordinal),
      });
      ordinal += 1;
    }
    return { title, data };
  });
}
