export type Category =
  | "Kitchen"
  | "Home & Living"
  | "Dining"
  | "Electronics"
  | "Experiences"
  | "Keepsakes";

export interface Gift {
  id: string;
  name: string;
  desc: string;
  category: Category;
  price: number;
  blocked: boolean;
  blockedAt: string | null;
  salt: string | null;
  pinHash: string | null;
}

/** Gift with no id yet, used when seeding. */
export type NewGift = Omit<Gift, "id">;
