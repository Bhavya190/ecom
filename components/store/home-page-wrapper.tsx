"use client";

import { useEffect, useState } from "react";
import { HomePageClient } from "@/components/store/home-page-client";
import { type StoreProduct } from "@/components/store/product-card";

type HomeCategory = {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
};

type HomePageWrapperProps = {
  initialFeaturedProducts: StoreProduct[];
  initialCategories: HomeCategory[];
  initialNewArrivals: StoreProduct[];
};

export function HomePageWrapper({
  initialFeaturedProducts,
  initialCategories,
  initialNewArrivals
}: HomePageWrapperProps) {
  const [featuredProducts, setFeaturedProducts] = useState(initialFeaturedProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [newArrivals, setNewArrivals] = useState(initialNewArrivals);
  const [isLoading, setIsLoading] = useState(false);

  // Force refresh data when component mounts or when navigating back to home
  useEffect(() => {
    const refreshData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/home-data');
        if (response.ok) {
          const data = await response.json();
          setFeaturedProducts(data.featuredProducts || []);
          setCategories(data.categories || []);
          setNewArrivals(data.newArrivals || []);
        }
      } catch (error) {
        console.error('Error refreshing home data:', error);
        // Keep initial data if refresh fails
      } finally {
        setIsLoading(false);
      }
    };

    // Only refresh if we have initial data (to avoid unnecessary calls on first load)
    if (initialFeaturedProducts.length > 0 || initialCategories.length > 0) {
      refreshData();
    }
  }, [initialFeaturedProducts.length, initialCategories.length]);

  return (
    <HomePageClient
      featuredProducts={featuredProducts}
      categories={categories}
      newArrivals={newArrivals}
    />
  );
}
