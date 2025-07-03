export type Category = {
  id: string;
  name: string;
  color: string;
  type: "income" | "expense";
  deletedAt: Date | null;
};

export type Transaction = {
  id: string;
  amount: number;
  name: string;
  month: number;
  year: number;
  type: "income" | "expense";
  categoryId: string;
};
