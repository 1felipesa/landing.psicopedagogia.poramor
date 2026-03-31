import React from 'react';

export enum UserRole {
  ADMIN = 'ADMIN',
  PATIENT = 'PATIENT'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  email: string;
}

export enum PatientStatus {
  ACTIVE = 'Ativo',
  PENDING = 'Pendente',
  COMPLETED = 'Concluído',
  ANALYSIS = 'Em Análise'
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  guardian: string;
  guardianRelation: string; // e.g., "Mãe", "Pai"
  status: PatientStatus;
  progress: number; // 0-100
  nextSession?: string;
  avatarUrl?: string;
  registrationNumber: string;
}

export interface Appointment {
  id: string;
  title: string;
  date: string; // ISO string
  type: 'Online' | 'Presencial';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ElementType;
  colorClass: string;
}