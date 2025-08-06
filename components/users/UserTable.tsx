"use client";

import {  useMemo, useState } from "react";
import {
  Table,
  TableBody,
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
import { useQuery } from "@tanstack/react-query";

import { Notification } from "../shared/Notification";
import { User, SortColumnUser } from "@/lib/types";
import { ExpandableRow } from "../shared/ExpandableRow";
import { mockUsers } from "@/data/mockUsers";

export default function UserTable() {
  const [searchId, setSearchId] = useState("");
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
      label: "Cédula",
      field: "identity_card",
    },
    {
      label: "Correo",
      field: "email",
    },
    {
      label: "Nombre completo",
      field: "full_name",
    },
    {
      label: "Nivel de acceso",
      field: "role",
    },
    {
      label: 'Estatus',
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


  // Filtrar por ID antes de paginar
  const filteredUsers = useMemo(() => {
    if (!searchId.trim()) return users;
    return users.filter((user) =>
      user.identity_card.toString().includes(searchId.trim())
    );
  }, [users, searchId]);

  const paginatedUsers = useMemo(() => {
    const startIdx = (currentPage - 1) * rowsPerPage;
    const endIdx = startIdx + rowsPerPage;
    return filteredUsers.slice(startIdx, endIdx);
  }, [filteredUsers, currentPage, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / rowsPerPage));

  const changePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container mx-auto py-1">
      {/* Search by ID */}
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="search-id" className="text-sm font-medium">
          Buscar por cédula:
        </label>
        <input
          id="search-id"
          type="text"
          value={searchId}
          onChange={(e) => {
            setSearchId(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded px-2 py-1 text-sm w-48"
          placeholder="Ingrese número de cédula"
        />
      </div>
      {showNotification && <Notification message="Usuario actualizado" />}
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.field}
                onClick={() => sortUsers(col.field as keyof User)}
                className="cursor-pointer  p-2"
              >
                {col.label}
                {renderSortIcon(col.field as keyof User)}
              </TableHead>
            ))}
            <TableHead className='p-2'>Acciones</TableHead>
            <TableHead className="p-2"></TableHead>
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
          <p className="text-sm font-medium">Filas por página</p>
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
            <span className="sr-only">Página anterior</span>
          </Button>
          <div className="text-sm font-medium">
            Página {currentPage} de {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Página siguiente</span>
          </Button>
        </div>
      </div>
    </div>
  );
}