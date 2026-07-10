export type Role = "CUSTOMER" | "ADMIN";

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  user: UserSummary;
  accessToken: string;
  refreshToken: string;
}

export type BookCategory =
  | "FICTION"
  | "ROMANCE"
  | "HORROR"
  | "THRILLER"
  | "EDUCATION"
  | "MANUAL"
  | "BIOGRAPHY"
  | "OTHER";

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string | null;
  category: BookCategory;
  isbn: string | null;
  price: number;
  stockQuantity: number;
  coverUrl: string | null;
  synopsis: string | null;
  active: boolean;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface CartItemView {
  id: string;
  bookId: string;
  title: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  availableStock: number;
}

export interface Cart {
  items: CartItemView[];
  total: number;
}

export type OrderStatus = "PLACED" | "CANCELED";

export interface OrderItemView {
  bookId: string;
  title: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface OrderAddress {
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  items: OrderItemView[];
  address: OrderAddress;
  totalAmount: number;
  createdAt: string;
}

export interface ApiErrorBody {
  timestamp: string;
  status: number;
  message: string;
  errors?: Record<string, string>;
}
