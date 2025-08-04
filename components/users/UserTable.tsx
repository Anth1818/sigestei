"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import { Notification } from "../shared/Notification";
import { User, SortColumnUser } from "@/lib/types";

// Mock data for users
const mockUsers: User[] = [
  {
    id: 1,
    worker_id: 101,
    username: "jdoe",
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
    username: "asmith",
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

const ExpandableRow = ({
  user,
  expanded,
  onToggle,
  onToggleActive,
}: {
  user: User;
  expanded: boolean;
  onToggle: () => void;
  onToggleActive: () => void;
}) => {
  return (
    <>
      <TableRow className="cursor-pointer" onClick={onToggle}>
        <TableCell>{user.identity_card}</TableCell>
        <TableCell>{user.username}</TableCell>
        <TableCell>{user.full_name}</TableCell>
        <TableCell>{user.role}</TableCell>
        <TableCell>{user.is_active ? "Active" : "Inactive"}</TableCell>
        <TableCell>
          <Button size="sm" onClick={(e) => { e.stopPropagation(); onToggleActive(); }}>
            {user.is_active ? 'Deactivate' : 'Activate'}
          </Button>
        </TableCell>
        <TableCell>
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </TableCell>
      </TableRow>
      <AnimatePresence initial={false}>
        {expanded && (
          <TableRow>
            <TableCell colSpan={7} className="p-0">
              <motion.div
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={{
                  open: { opacity: 1, height: "auto" },
                  collapsed: { opacity: 0, height: 0 },
                }}
                transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
              >
                <div className="p-4 bg-muted">
                  <h3 className="font-semibold mb-2">Additional Info:</h3>
                  <p>{user.position}</p>
                </div>
              </motion.div>
            </TableCell>
          </TableRow>
        )}
      </AnimatePresence>
    </>
  );
};


export default function UserTable() {
  // const { data } = useQuery({
  //   queryKey: ["users"],
  //   queryFn: () => api.get("/user").then((res) => res.data.data),
  // });
  const [users, setUsers] = useState<User[]>(mockUsers);
  // useEffect(() => {
  //   if (data) {
  //     setUsers(data);
  //   }
  // }, [data]);

  const columns = [
    {
      label: "ID Card",
      field: "identity_card",
    },
    {
      label: "Username",
      field: "username",
    },
    {
      label: "Full Name",
      field: "full_name",
    },
    {
      label: "Access Level",
      field: "role",
    },
    {
      label: 'Status',
      field: 'is_active'
    }
  ];

  const [expanded, setExpanded] = useState<number | null>(null);
  const [currentSort, setCurrentSort] = useState<SortColumnUser>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showNotification, setShowNotification] = useState(false);

  const toggleExpansion = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };
  const toggleStatus = async (id: number, status: boolean) => {
    // Simulate status toggle
    setShowNotification(true);
    const updatedUsers = users.map((user) => {
      if (user.id === id) {
        return { ...user, is_active: !status };
      }
      return user;
    });
    setUsers(updatedUsers);
    const timer = setTimeout(() => {
      setShowNotification(false);
      clearTimeout(timer);
    }, 500);
  };


  const sortUsers = (field: keyof User | "full_name") => {
    const newDirection =
      currentSort?.columna === field && currentSort.direccion === "asc"
        ? "desc"
        : "asc";
    setCurrentSort({ columna: field, direccion: newDirection });

    const sortedUsers = [...users].sort((a, b) => {
      let valueA: string, valueB: string;

      if (field === "full_name") {
        valueA = `${a.full_name}`.trim();
        valueB = `${b.full_name}`.trim();
      } else {
        valueA = a[field].toString().trim();
        valueB = b[field].toString().trim();
      }

      if (valueA < valueB) return newDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return newDirection === "asc" ? 1 : -1;
      return 0;
    });

    setUsers(sortedUsers);
  };

  const renderSortIcon = (field: keyof User | "full_name") => {
    if (currentSort?.columna !== field) {
      return <ArrowUpDown size={16} />;
    }
    return currentSort.direccion === "asc" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  const paginatedUsers = useMemo(() => {
    const startIdx = (currentPage - 1) * rowsPerPage;
    const endIdx = startIdx + rowsPerPage;
    return users.slice(startIdx, endIdx);
  }, [users, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(users.length / rowsPerPage);

  const changePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto py-1">
      {showNotification && <Notification message="User updated" />}
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.field}
                onClick={() => sortUsers(col.field as keyof User)}
                className="cursor-pointer bg-primary text-white p-2"
              >
                {col.label}
                {renderSortIcon(col.field as keyof User)}
              </TableHead>
            ))}
            <TableHead className='bg-primary text-white p-2'>Actions</TableHead>
            <TableHead className="bg-primary text-white p-2"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedUsers.map((user) => (
            <ExpandableRow
              key={user.id}
              user={user}
              expanded={expanded === user.id}
              onToggle={() => toggleExpansion(user.id)}
              onToggleActive={async () => await toggleStatus(user.id, user.is_active)}
            />
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(value) => {
              setRowsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={rowsPerPage.toString()} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10,25,50,100,250,500].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <div className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}