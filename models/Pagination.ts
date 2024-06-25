export interface IntPagination {
    links: { first: string; last: string; prev: string; next: string };
    meta: {
      per_page: number;
      to: number;
      total: number;
      from: string;
      last_page: number;
      current_page: number;
    };
  };