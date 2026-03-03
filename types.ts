
export enum ServiceType {
  LAUNDRY = 'LAUNDRY',
  FOOD = 'FOOD',
  GARBAGE = 'GARBAGE'
}

export enum RequestStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  PICKED_UP = 'PICKED_UP',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum UserRole {
  OWNER = 'OWNER',
  RIDER = 'RIDER'
}

export interface ServiceRequest {
  id: string;
  type: ServiceType;
  status: RequestStatus;
  customerName: string;
  address: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  assignedRiderId?: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  timestamp: string;
  read: boolean;
}
