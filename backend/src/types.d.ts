export interface Filters {
  walletId: number;
  wallet: {
    user: {
      id: number;
    };
  };
  date?: {
    gte: Date;
  };
}
