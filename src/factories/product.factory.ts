import { randomUUID } from "node:crypto";

import type { NewProduct } from "../api/models";

export interface ProductReferences {
  brandId: string;
  categoryId: string;
  imageId: string;
}

export const ProductFactory = {
  build(references: ProductReferences, overrides: Partial<NewProduct> = {}): NewProduct {
    const unique = randomUUID().replaceAll("-", "").slice(0, 12);
    return {
      name: `QA Product ${unique}`,
      description: `Isolated admin test product ${unique}`,
      stock: 25,
      price: 19.99,
      brand_id: references.brandId,
      category_id: references.categoryId,
      product_image_id: references.imageId,
      is_location_offer: false,
      is_rental: false,
      co2_rating: "A",
      ...overrides,
    };
  },
};
