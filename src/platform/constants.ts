import { Patient, PatientStatus, Appointment, User, UserRole } from './types';

export const CURRENT_USER_ADMIN: User = {
  id: 'admin-1',
  name: 'Dra. Ana Paula',
  email: 'ana.paula@psicopedagogia.com',
  role: UserRole.ADMIN,
  avatarUrl: 'https://picsum.photos/id/64/200/200'
};

export const CURRENT_USER_PATIENT: User = {
  id: 'patient-1',
  name: 'Maria Silva',
  email: 'maria.silva@email.com',
  role: UserRole.PATIENT,
  avatarUrl: 'https://picsum.photos/id/65/200/200'
};

export const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'Lucas Silva',
    age: 8,
    guardian: 'Mariana Silva',
    guardianRelation: 'Mãe',
    status: PatientStatus.PENDING,
    progress: 15,
    nextSession: '2023-10-26T14:00:00',
    registrationNumber: '#4029',
    avatarUrl: 'https://picsum.photos/id/1005/200/200'
  },
  {
    id: '2',
    name: 'Sofia Martins',
    age: 10,
    guardian: 'Carlos Martins',
    guardianRelation: 'Pai',
    status: PatientStatus.COMPLETED,
    progress: 100,
    nextSession: '2023-10-27T09:30:00',
    registrationNumber: '#4030',
    avatarUrl: 'https://picsum.photos/id/342/200/200'
  },
  {
    id: '3',
    name: 'Pedro Henrique',
    age: 7,
    guardian: 'Ana Souza',
    guardianRelation: 'Tia',
    status: PatientStatus.ANALYSIS,
    progress: 5,
    nextSession: '2023-10-28T16:00:00',
    registrationNumber: '#4032',
    avatarUrl: 'https://picsum.photos/id/433/200/200'
  },
  {
    id: '4',
    name: 'Beatriz Lima',
    age: 9,
    guardian: 'Fernanda Lima',
    guardianRelation: 'Mãe',
    status: PatientStatus.ACTIVE,
    progress: 65,
    nextSession: '2023-10-30T10:00:00',
    registrationNumber: '#4035',
    avatarUrl: 'https://picsum.photos/id/338/200/200'
  },
  {
    id: '5',
    name: 'João Miguel',
    age: 11,
    guardian: 'Roberto Miguel',
    guardianRelation: 'Pai',
    status: PatientStatus.ACTIVE,
    progress: 45,
    nextSession: '2023-11-01T11:30:00',
    registrationNumber: '#4041',
    avatarUrl: 'https://picsum.photos/id/334/200/200'
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '101',
    title: 'Sessão de Acompanhamento',
    date: '2023-10-24T14:00:00',
    type: 'Online',
    status: 'Scheduled'
  },
  {
    id: '102',
    title: 'Avaliação Semestral',
    date: '2023-10-25T09:00:00',
    type: 'Presencial',
    status: 'Scheduled'
  },
  {
    id: '103',
    title: 'Intervenção Lúdica',
    date: '2023-10-20T15:00:00',
    type: 'Presencial',
    status: 'Completed',
    notes: 'Ótima evolução na concentração.'
  }
];