import { vi } from "vitest";
import type { Database } from "@jk/db";

type AnyMock = ReturnType<typeof vi.fn>;

export interface MockQueryBuilder {
  from: AnyMock;
  where: AnyMock;
  orderBy: AnyMock;
  limit: AnyMock;
}

export interface MockDatabase {
  db: Database;
  selectMock: AnyMock;
  insertMock: AnyMock;
  valuesMock: AnyMock;
  queryBuilder: MockQueryBuilder;
}

export function createMockPricingDatabase(): MockDatabase {
  const selectMock = vi.fn();
  const insertMock = vi.fn();
  const valuesMock = vi.fn();

  const queryBuilder: MockQueryBuilder = {
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
    limit: vi.fn()
  };

  selectMock.mockReturnValue(queryBuilder);
  insertMock.mockReturnValue({ values: valuesMock });

  return {
    db: {
      select: selectMock,
      insert: insertMock
    } as unknown as Database,
    selectMock,
    insertMock,
    valuesMock,
    queryBuilder
  };
}
