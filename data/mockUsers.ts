import {User} from "@/lib/types";


// Mock data for users
export const mockUsers: User[] = [
  {
    id: 1,
    worker_id: 101,
    email: "jdoe@mail.com",
    password: "password123",
    role_id: 1,
    is_active: true,
    created: "2025-08-01T10:00:00Z",
    role: "Admin",
    identity_card: 12345678,
    full_name: "John Doe",
    status: true,
    gender: "M",
    position: "Manager",
    position_id: 1,
    gender_id: 1,
    department: "IT",
    department_id: 1,
  },
  {
    id: 2,
    worker_id: 102,
    email: "asmith@mail.com",
    password: "password456",
    role_id: 2,
    is_active: false,
    created: "2025-08-02T11:00:00Z",
    role: "User",
    identity_card: 87654321,
    full_name: "Alice Smith",
    status: false,
    gender: "F",
    position: "Technician",
    position_id: 2,
    gender_id: 2,
    department: "Support",
    department_id: 2,
  },
];