export type Role = 'super_admin' | 'editor' | 'reader';

export type BookStatus = 'published' | 'draft';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';
export type MessageStatus = 'new' | 'read' | 'replied';
export type UserStatus = 'active' | 'banned';

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  sortOrder: number;
  bookCount?: number;
}

export interface Author {
  id: string;
  slug: string;
  name: string;
  country: string;
  birthYear?: number;
  bio: string;
  tchadian: boolean;
  accentColor: string;
  bookCount?: number;
}

export interface Book {
  id: string;
  slug: string;
  title: string;
  authorId: string;
  categoryId: string;
  summary: string;
  year: number;
  pages: number;
  fileSizeKb: number;
  language: string;
  downloads: number;
  views: number;
  rating: number;
  ratingCount: number;
  status: BookStatus;
  featured: boolean;
  isNew: boolean;
  tags: string[];
  coverColor: string;
  coverUrl: string | null;
  pdfUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  bookId: string;
  readerName: string;
  readerEmail: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
}

export interface SiteUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: UserStatus;
  favorites: string[];
  later: string[];
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  slogans: string[];
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  contributionText: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  primaryColor: string;
  secondaryColor: string;
  logoText: string;
  social: { whatsapp: string; facebook: string; x: string; youtube: string };
  maintenanceMode: boolean;
}

export interface BookFilters {
  category?: string;
  author?: string;
  year?: string;
  language?: string;
  sort?: 'popular' | 'new' | 'title' | 'rating' | 'year';
  q?: string;
  page?: number;
  perPage?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface DashboardStats {
  totalBooks: number;
  totalDownloads: number;
  totalReaders: number;
  totalCategories: number;
  totalAuthors: number;
  pendingReviews: number;
  newMessages: number;
  downloadsByMonth: { month: string; downloads: number; views: number }[];
  topBooks: Pick<Book, 'slug' | 'title' | 'authorId' | 'downloads' | 'views'>[];
}
