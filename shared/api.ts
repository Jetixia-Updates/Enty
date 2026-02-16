// Home Queen - Shared API Types

export type UserRole =
  | "WIFE"
  | "HUSBAND"
  | "KID"
  | "SERVICE_PROVIDER"
  | "COMPANY"
  | "ADMIN";

export type ExpenseCategory =
  | "FOOD"
  | "BILLS"
  | "EDUCATION"
  | "HEALTH"
  | "TRANSPORT"
  | "SHOPPING"
  | "ENTERTAINMENT"
  | "OTHER";

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export type ServiceCategory =
  | "CLEANING"
  | "PLUMBING"
  | "ELECTRICAL"
  | "CARPENTRY"
  | "CAR_MECHANIC"
  | "BABYSITTER"
  | "DELIVERY"
  | "PRIVATE_TUTOR";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
  familyId?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: number;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description?: string;
  date: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  category: ServiceCategory;
  basePrice: number;
  imageUrl?: string;
}

export interface Provider {
  id: string;
  user: User;
  service: Service;
  bio?: string;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  provider: Provider;
  status: BookingStatus;
  scheduledAt: string;
  address: string;
  price?: number;
  createdAt: string;
}
