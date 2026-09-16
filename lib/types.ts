export type Category =
  | "Kitchen"
  | "Home & Living"
  | "Dining"
  | "Electronics"
  | "Toys & Games"
  | "Experiences"
  | "Keepsakes"
  | "Travel";

export interface Gift {
  id: string;
  name: string;
  desc: string;
  category: Category;
  price: number | null;
  link: string | null;
  blocked: boolean;
  blockedAt: string | null;
  salt: string | null;
  pinHash: string | null;
}

/** Gift with no id yet, used when seeding. */
export type NewGift = Omit<Gift, "id">;
