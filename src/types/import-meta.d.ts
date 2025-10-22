declare interface ImportMeta {
  glob<T = unknown>(
    pattern: string,
    options?: {
      eager?: boolean;
      import?: string;
      as?: string;
    }
  ): Record<string, () => Promise<T>>;
}
