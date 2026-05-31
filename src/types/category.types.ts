export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  parentId?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
