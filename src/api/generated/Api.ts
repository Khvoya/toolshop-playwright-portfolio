/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface BankTransferDetails {
  account_name?: string;
  account_number?: string;
  bank_name?: string;
}

/** BrandRequest */
export interface BrandRequest {
  /** @example "new brand" */
  name?: string;
  /**
   * URL part, words separated by hyphen
   * @example "new-brand"
   */
  slug?: string;
}

/** BrandResponse */
export interface BrandResponse {
  id?: string;
  /** @example "new brand" */
  name?: string;
  /** @example "new-brand" */
  slug?: string;
}

export interface BuyNowPayLaterDetails {
  monthly_installments?: string;
}

/** CartResponse */
export interface CartItemResponse {
  id?: string;
}

/** CartResponse */
export interface CartResponse {
  id?: string;
}

/** Placeholder for Cash on Delivery payment method */
export type CashOnDeliveryDetails = object;

/** CategoryRequest */
export interface CategoryRequest {
  /** @example "new category" */
  name?: string;
  parent_id?: string | null;
  /**
   * URL part, words separated by hyphen
   * @example "new-category"
   */
  slug?: string;
}

/** CategoryResponse */
export interface CategoryResponse {
  id?: string;
  /** @example "new category" */
  name?: string;
  parent_id?: string | null;
  /** @example "new-category" */
  slug?: string;
  sub_categories?: CategoryResponse[];
}

/** CategoryTreeResponse */
export interface CategoryTreeResponse {
  id?: string;
  /** @example "new category" */
  name?: string;
  parent_id?: string | null;
  /** @example "new-category" */
  slug?: string;
  sub_categories?: CategoryResponse[];
}

/** ContactReplyResponse */
export interface ContactReplyResponse {
  /** @example "2022-08-01 08:24:56" */
  created_at?: string;
  /** @example "1" */
  id?: string;
  /** @example "Reply message" */
  message?: string;
  user?: UserResponse;
}

/** ContactRequest */
export interface ContactRequest {
  /**
   * Required when not authenticated
   * @maxLength 256
   * @example "john@doe.example"
   */
  email?: string;
  /**
   * @maxLength 250
   * @example "Something is wrong with the website."
   */
  message: string;
  /**
   * Sender name
   * @maxLength 120
   * @example "John Doe"
   */
  name?: string;
  /**
   * @maxLength 120
   * @example "website"
   */
  subject: string;
}

/** ContactRequestAuthenticated */
export interface ContactRequestAuthenticated {
  /** @example "Something is wrong with the website." */
  message?: string;
  /**
   * If set, Authorization header is required
   * @example "John Doe"
   */
  name: string;
  /** @example "website" */
  subject?: string;
}

/** ContactResponse */
export interface ContactResponse {
  /** @example "2022-08-01 08:24:56" */
  created_at?: string;
  /** @example "john@doe.example" */
  email?: string;
  /** @example "1" */
  id?: string;
  /** @example "Something is wrong with the website." */
  message?: string;
  /** @example "John Doe" */
  name?: string;
  /** @example "NEW" */
  status?: string;
  /** @example "website" */
  subject?: string;
}

/** ContactResponseAuthenticated */
export interface ContactResponseAuthenticated {
  /** @example "2022-08-01 08:24:56" */
  created_at?: string;
  /** @example "john@doe.example" */
  email?: string;
  /** @example "1" */
  id?: string;
  /** @example "Something is wrong with the website." */
  message?: string;
  /** @example "John Doe" */
  name?: string;
  /** @example "NEW" */
  status?: string;
  /** @example "website" */
  subject?: string;
  /** @example "John Doe" */
  user_id?: string;
}

/**
 * ContactResponseFull
 * A detailed contact message response with user and replies
 */
export interface ContactResponseFull {
  /** @example "2025-03-09 09:14:49" */
  created_at?: string;
  /** @example null */
  email?: string;
  /** @example "01jnx2z1a6s8qx9z3hhqy3rdyp" */
  id?: string;
  /** @example "This is a test contact message." */
  message?: string;
  /** @example null */
  name?: string;
  replies?: ContactReplyResponse[];
  /** @example "IN_PROGRESS" */
  status?: string;
  /** @example "test-subject" */
  subject?: string;
  user?: UserResponse;
  /** @example "01JNX24JV5Q3QFDB2ZPTRBMFN8" */
  user_id?: string;
}

export interface CreditCardDetails {
  card_holder_name?: string;
  credit_card_number?: string;
  cvv?: string;
  expiration_date?: string;
}

/** DownloadResponse */
export interface DownloadResponse {
  filename?: string;
  id?: string;
  name?: string;
  status?: string;
  type?: string;
}

/** FavoriteRequest */
export interface FavoriteRequest {
  product_id?: string;
}

/** FavoriteResponse */
export interface FavoriteResponse {
  /** @example "1234" */
  id?: string;
  /** @example "1234" */
  product_id?: string;
  /** @example "1234" */
  user_id?: string;
}

/** FavoriteResponse */
export interface FavoriteWithProductResponse {
  /** @example "1234" */
  id?: string;
  product?: ProductResponse;
  /** @example "1234" */
  product_id?: string;
  /** @example "1234" */
  user_id?: string;
}

export interface GiftCardDetails {
  gift_card_number?: string;
  validation_code?: string;
}

/** ImageResponse */
export interface ImageResponse {
  by_name?: string;
  by_url?: string;
  file_name?: string;
  id?: string;
  source_name?: string;
  source_url?: string;
  title?: string;
}

/** InvoiceLineResponse */
export interface InvoiceLineResponse {
  discount_percentage?: number;
  discounted_price?: number;
  /** @example "01JFG8Q5XKZJY4BEYQ87PC2Q1Y" */
  id?: string;
  /** @example "01JFG8Q5XKZJY4BEYQ87PC2Q1Y" */
  invoice_id?: string;
  product?: ProductResponse;
  /** @example "01JFG8Q5XKZJY4BEYQ87PC2Q1Y" */
  product_id?: string;
  quantity?: number;
  unit_price?: number;
}

export interface InvoiceRequest {
  billing_city: string;
  billing_country: string;
  billing_postal_code: string;
  billing_state: string;
  billing_street: string;
  cart_id: string;
  payment_details:
    | BankTransferDetails
    | CreditCardDetails
    | GiftCardDetails
    | BuyNowPayLaterDetails
    | object;
  payment_method:
    | "bank-transfer"
    | "cash-on-delivery"
    | "credit-card"
    | "buy-now-pay-later"
    | "gift-card";
}

/** InvoiceResponse */
export interface InvoiceResponse {
  additional_discount_amount?: number;
  additional_discount_percentage?: number;
  billing_city?: string;
  billing_country?: string;
  billing_postal_code?: string;
  billing_state?: string;
  billing_street?: string;
  /** @example "2022-08-01 08:24:56" */
  created_at?: string;
  /** @example "01JFG8Q5XKZJY4BEYQ87PC2Q1Y" */
  id?: string;
  /** @example "2022-10-20 09:49:45" */
  invoice_date?: string;
  /** @example "INV-2022000002" */
  invoice_number?: string;
  invoicelines?: InvoiceLineResponse[];
  /** @example "COMPLETED" */
  status?: string;
  /** @example "" */
  status_message?: string;
  subtotal?: number;
  total?: number;
  /** @example "01JFG8Q5XKZJY4BEYQ87PC2Q1Y" */
  user_id?: string;
}

/** PaymentRequest */
export interface PaymentRequest {
  payment_details?:
    | BankTransferDetails
    | CreditCardDetails
    | GiftCardDetails
    | BuyNowPayLaterDetails
    | object;
  payment_method?:
    | "bank-transfer"
    | "cash-on-delivery"
    | "credit-card"
    | "buy-now-pay-later"
    | "gift-card";
}

/** ProductRequest */
export interface ProductRequest {
  /** @example "A" */
  co2_rating?: string;
  /** @example "01JFG8Q5XKZJY4BEYQ87PC2Q1Y" */
  brand_id?: string;
  /** @example "01JFG8Q5XKZJY4BEYQ87PC2Q1Y" */
  category_id?: string;
  description?: string;
  /** @example 1 */
  is_location_offer?: boolean;
  /** @example 0 */
  is_rental?: boolean;
  name?: string;
  /** @example 1.99 */
  price?: number;
  /** @example "01JFG8Q5XKZJY4BEYQ87PC2Q1Y" */
  product_image_id?: string;
}

/** ProductResponse */
export interface ProductResponse {
  /** @example "A" */
  co2_rating?: string;
  brand?: BrandResponse;
  category?: CategoryResponse;
  /** @example "Lorum ipsum" */
  description?: string;
  /** @example "01JFG8Q5XKZJY4BEYQ87PC2Q1Y" */
  id?: string;
  /** @example 0 */
  in_stock?: boolean;
  /** @example true */
  is_eco_friendly?: boolean;
  /** @example 1 */
  is_location_offer?: boolean;
  /** @example 0 */
  is_rental?: boolean;
  /** @example "new brand" */
  name?: string;
  /** @example 9.99 */
  price?: number;
  product_image?: ImageResponse;
}

/** ProductSpecRequest */
export interface ProductSpecRequest {
  product_id: string;
  /** @example "Weight" */
  spec_name: string;
  /** @example "kg" */
  spec_unit?: string | null;
  /** @example "1.5" */
  spec_value: string;
}

/** ProductSpecResponse */
export interface ProductSpecResponse {
  id?: string;
  product_id?: string;
  spec_name?: string;
  spec_unit?: string | null;
  spec_value?: string;
}

/** UserRequest */
export interface UserRequest {
  address?: {
    /**
     * @maxLength 40
     * @example "City"
     */
    city?: string;
    /**
     * @maxLength 40
     * @example "Country"
     */
    country?: string;
    /**
     * @maxLength 10
     * @example "12"
     */
    house_number?: string;
    /**
     * @maxLength 10
     * @example "1234AA"
     */
    postal_code?: string;
    /**
     * @maxLength 40
     * @example "State"
     */
    state?: string;
    /**
     * @maxLength 70
     * @example "Street 1"
     */
    street?: string;
  };
  /**
   * Must be a valid date between 18 and 75 years ago
   * @format date
   * @example "1970-01-01"
   */
  dob?: string;
  /**
   * @format email
   * @maxLength 256
   * @example "john@doe.example"
   */
  email: string;
  /**
   * @maxLength 40
   * @example "John"
   */
  first_name: string;
  /**
   * @maxLength 20
   * @example "Doe"
   */
  last_name: string;
  /**
   * Must include uppercase, lowercase, number, and symbol
   * @format password
   * @minLength 8
   * @example "SuperSecure@123"
   */
  password: string;
  /**
   * @maxLength 24
   * @example "0987654321"
   */
  phone?: string;
}

/** UserResponse */
export interface UserResponse {
  address?: {
    /** @example "City" */
    city?: string;
    /** @example "Country" */
    country?: string;
    /** @example "12" */
    house_number?: string | null;
    /** @example "1234AA" */
    postal_code?: string | null;
    /** @example "State" */
    state?: string | null;
    /** @example "Street 1" */
    street?: string;
  };
  /** @example "2022-08-01 08:24:56" */
  created_at?: string;
  /** @example "1970-01-01" */
  dob?: string;
  /** @example "john@doe.example" */
  email?: string;
  enabled?: boolean;
  failed_login_attempts?: number | null;
  /** @example "John" */
  first_name?: string;
  id?: string;
  /** @example "Doe" */
  last_name?: string;
  /** @example "0987654321" */
  phone?: string | null;
  provider?: string | null;
  totp_enabled?: boolean;
}
