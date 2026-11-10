import type {
  BrandResponse,
  CategoryResponse,
  FavoriteWithProductResponse,
  ImageResponse,
  InvoiceRequest,
  InvoiceResponse,
  ProductRequest,
  ProductResponse,
  UserRequest,
  UserResponse,
} from "./generated/Api";

export type Credentials = Pick<UserRequest, "email" | "password">;
export type Address = Required<NonNullable<UserRequest["address"]>>;

export interface NewUser extends UserRequest {
  address: Address;
  dob: string;
  phone: string;
}

export interface User extends UserResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  address: Address;
  dob: string;
  phone: string;
}

export interface Token {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface TestUser {
  account: User;
  credentials: Credentials;
  token?: string;
}

export interface Brand extends BrandResponse {
  id: string;
  name: string;
}

export interface Category extends CategoryResponse {
  id: string;
  name: string;
}

export interface ProductImage extends ImageResponse {
  id: string;
  title: string;
}

export interface EmbeddedProduct extends ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  in_stock: boolean;
  is_rental: boolean;
  is_location_offer: boolean;
  is_eco_friendly: boolean;
}

export interface Product extends EmbeddedProduct {
  brand: Brand;
  category: Category;
  product_image: ProductImage;
}

export interface Page<Item> {
  current_page: number;
  data: Item[];
  last_page: number;
  per_page: number;
  total: number;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  product: EmbeddedProduct;
  discount_percentage?: number;
  discounted_price?: number;
}

export interface Cart {
  id: string;
  cart_items: CartItem[];
  additional_discount_percentage?: number;
}

export interface Favorite extends FavoriteWithProductResponse {
  id: string;
  user_id: string;
  product_id: string;
  product: EmbeddedProduct;
}

export type OrderCreate = InvoiceRequest;

export interface Order extends InvoiceResponse {
  id: string;
  user_id: string;
  invoice_number: string;
  invoice_date: string;
  billing_street: string;
  billing_city: string;
  billing_state: string;
  billing_country: string;
  billing_postal_code: string;
  subtotal: number;
  total: number;
  status: string;
}

export interface ErrorResponse {
  message?: string;
  error?: string;
}

export interface NewProduct extends ProductRequest {
  name: string;
  description: string;
  stock: number;
  price: number;
  brand_id: string;
  category_id: string;
  product_image_id: string;
  is_location_offer: boolean;
  is_rental: boolean;
  co2_rating: string;
}
