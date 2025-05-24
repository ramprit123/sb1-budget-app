import { predefinedCategories } from '@/constants/categories';

export function getCategoryById(id: string) {
  return predefinedCategories.find(cat => cat.id === id);
}