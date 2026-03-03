
import React from 'react';
import { ServiceType } from './types';

export const SERVICE_THEMES: Record<ServiceType, { color: string; icon: React.ReactNode; label: string }> = {
  [ServiceType.LAUNDRY]: {
    color: 'bg-blue-500',
    icon: <i className="fa-solid fa-shirt"></i>,
    label: 'Laundry'
  },
  [ServiceType.FOOD]: {
    color: 'bg-orange-500',
    icon: <i className="fa-solid fa-bowl-food"></i>,
    label: 'Food Delivery'
  },
  [ServiceType.GARBAGE]: {
    color: 'bg-green-600',
    icon: <i className="fa-solid fa-trash-can"></i>,
    label: 'Garbage Pickup'
  }
};

export const RIDERS = [
  { id: 'r1', name: 'Alex Thompson', avatar: 'https://picsum.photos/seed/alex/100/100' },
  { id: 'r2', name: 'Maria Garcia', avatar: 'https://picsum.photos/seed/maria/100/100' },
  { id: 'r3', name: 'John Doe', avatar: 'https://picsum.photos/seed/john/100/100' }
];
