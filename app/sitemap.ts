import type { MetadataRoute } from "next";
import { products } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://care-hair.example.com";
  const pages = ["", "/diagnosis", "/products", "/reviews", "/about"];

  return [
    ...pages.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date()
    })),
    ...products.map((product) => ({
      url: `${baseUrl}/products/${product.id}`,
      lastModified: new Date()
    }))
  ];
}
