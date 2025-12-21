import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { RequestResponse, EquipmentResponse, AuditLog } from "./types";
import { formatChangeValueWithCatalogs, getFieldName, getChangeTypeName } from "./auditUtils";
import { get } from "http";

// Tipo para los datos de equipos (similar a RequestResponse)
interface EquipmentForPDF {
  id: number;
  type_name: string;
  brand_name: string;
  model: string;
  serial_number: string;
  status_name: string;
  assigned_user_name: string | null;
  location: string;
  asset_number: string;
}

// Interfaz para filtros opcionales
interface RequestFilters {
  status?: string;
  priority?: string;
  type?: string;
  dateRange?: { start?: Date; end?: Date };
}

interface EquipmentFilters {
  status?: string;
  type?: string;
  brand?: string;
}

/**
 * Genera un PDF con el reporte de solicitudes
 */

/**
 * Devuelve la hora en formato 12 horas:
 * - display: "hh:mm:ss AM/PM"
 * - file:    "hh-mm-ss-AM" (apto para nombres de archivo)
 */
const format12HourTime = (date: Date) => {
  const pad = (n: number) => n.toString().padStart(2, "0");
  let hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const hh = pad(hours);
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());

  return {
    display: `${hh}:${mm}:${ss} ${ampm}`,
    file: `${hh}-${mm}-${ss}-${ampm}`,
  };
};

const getFileNameFormattedDate = (typeFile: string) => {
  const now = new Date();
  const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const time = format12HourTime(now).file; // HH-MM-SS-AM/PM
  return `${typeFile}_${date}_${time}.pdf`;
};

export const generateRequestsPDF = (
  requests: RequestResponse[],
  filters?: RequestFilters
) => {
  const doc = new jsPDF("landscape"); // Formato horizontal para más columnas

  // Header principal
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("SIGESTEI - Reporte de Solicitudes", 14, 20);

  let currentY = 28;

  // Información de filtros aplicados
  if (filters && Object.keys(filters).length > 0) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);

    let filterTexts: string[] = [];
    if (filters.status) filterTexts.push(`Estado: ${filters.status}`);
    if (filters.priority) filterTexts.push(`Prioridad: ${filters.priority}`);
    if (filters.type) filterTexts.push(`Tipo: ${filters.type}`);
    if (filters.dateRange?.start || filters.dateRange?.end) {
      const startDate = filters.dateRange.start
        ? new Date(filters.dateRange.start).toLocaleDateString("es-ES")
        : "...";
      const endDate = filters.dateRange.end
        ? new Date(filters.dateRange.end).toLocaleDateString("es-ES")
        : "...";
      filterTexts.push(`Fecha: ${startDate} - ${endDate}`);
    }

    if (filterTexts.length > 0) {
      doc.text(`Filtros aplicados: ${filterTexts.join(" | ")}`, 14, currentY);
      currentY += 6;
    }
  }

  // Fecha y hora de generación
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Generado el: ${new Date().toLocaleDateString(
      "es-ES"
    )} a las ${format12HourTime(new Date()).display}`,
    14,
    currentY
  );
  currentY += 3;

  // Total de registros
  doc.text(`Total de solicitudes: ${requests.length}`, 14, currentY + 3);
  currentY += 8;

  // Resetear color de texto
  doc.setTextColor(0, 0, 0);

  // Generar la tabla
  autoTable(doc, {
    head: [
      [
        "ID",
        "Tipo",
        "Equipo",
        "Prioridad",
        "Estado",
        "Solicitante",
        "Beneficiario",
        "Técnico",
        "Fecha Solicitud",
        "Fecha Resolución",
      ],
    ],
    body: requests.map((r) => [
      r.id.toString(),
      r.request_types?.name || "-",
      r.equipment
        ? `${r.equipment.type_name || ""} ${r.equipment.model || ""}`.trim()
        : "-",
      r.request_priorities?.name || "-",
      r.request_statuses?.name || "-",
      r.users_requests_requester_idTousers?.full_name || "-",
      r.users_requests_beneficiary_idTousers?.full_name || "Mismo solicitante",
      r.users_requests_technician_idTousers?.full_name || "No asignado",
      new Date(r.request_date).toLocaleDateString("es-ES"),
      r.resolution_date
        ? new Date(r.resolution_date).toLocaleDateString("es-ES")
        : "Pendiente",
    ]),
    startY: currentY,
    styles: {
      fontSize: 7,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [41, 128, 185], // Azul
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      0: { cellWidth: 15, halign: "center" }, // ID
      1: { cellWidth: 25 }, // Tipo
      2: { cellWidth: 30 }, // Equipo
      3: { cellWidth: 20, halign: "center" }, // Prioridad
      4: { cellWidth: 20, halign: "center" }, // Estado
      5: { cellWidth: 35 }, // Solicitante
      6: { cellWidth: 35 }, // Beneficiario
      7: { cellWidth: 35 }, // Técnico
      8: { cellWidth: 25, halign: "center" }, // Fecha Solicitud
      9: { cellWidth: 25, halign: "center" }, // Fecha Resolución
    },
    margin: { top: 10, bottom: 10 },
  });

  // Footer en todas las páginas
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  // Guardar el PDF
  const fileName = getFileNameFormattedDate("solicitudes");
  doc.save(fileName);
};

/**
 * Genera un PDF con el reporte de equipos
 */
export const generateEquipmentPDF = (
  equipment: EquipmentForPDF[],
  filters?: EquipmentFilters
) => {
  const doc = new jsPDF("landscape");


  // Header principal
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("SIGESTEI - Reporte de Equipos Informáticos", 14, 20);

  let currentY = 28;

  // Información de filtros aplicados
  if (filters && Object.keys(filters).length > 0) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);

    let filterTexts: string[] = [];
    if (filters.status) filterTexts.push(`Estado: ${filters.status}`);
    if (filters.type) filterTexts.push(`Tipo: ${filters.type}`);
    if (filters.brand) filterTexts.push(`Marca: ${filters.brand}`);

    if (filterTexts.length > 0) {
      doc.text(`Filtros aplicados: ${filterTexts.join(" | ")}`, 14, currentY);
      currentY += 6;
    }
  }

  // Fecha y hora de generación
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Generado el: ${new Date().toLocaleDateString(
      "es-ES"
    )} a las ${format12HourTime(new Date()).display}`,
    14,
    currentY
  );
  currentY += 3;

  // Total de registros
  doc.text(`Total de equipos: ${equipment.length}`, 14, currentY + 3);
  currentY += 8;

  // Resetear color de texto
  doc.setTextColor(0, 0, 0);

  // Generar la tabla
  autoTable(doc, {
    head: [
      [
        "ID",
        "Nº de bien",
        "Tipo",
        "Marca",
        "Modelo",
        "Serial",
        "Estado",
        "Usuario Asignado",
        "Ubicación",
      ],
    ],
    body: equipment.map((e) => [
      e.id.toString(),
      e.asset_number,
      e.type_name,
      e.brand_name,
      e.model,
      e.serial_number,
      e.status_name,
      e.assigned_user_name || "No asignado",
      e.location,
    ]),
    startY: currentY,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [39, 174, 96], // Verde
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      0: { cellWidth: 15, halign: "center" }, // ID
      1: { cellWidth: 25, halign: "center" }, // Nº Activo
      2: { cellWidth: 30 }, // Tipo
      3: { cellWidth: 30 }, // Marca
      4: { cellWidth: 35 }, // Modelo
      5: { cellWidth: 30 }, // Serial
      6: { cellWidth: 25, halign: "center" }, // Estado
      7: { cellWidth: 40 }, // Usuario
      8: { cellWidth: 40 }, // Ubicación
    },
    margin: { top: 10, bottom: 10 },
  });

  // Footer en todas las páginas
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  // Guardar el PDF
  const fileName = getFileNameFormattedDate("equipos");
  doc.save(fileName);
};

/**
 * Genera un PDF detallado de una solicitud individual con toda su información e historial
 */
export const generateSingleRequestPDF = async (
  request: RequestResponse,
  auditHistory?: AuditLog[]
) => {
  const doc = new jsPDF();

  // Header principal
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("SIGESTEI - Detalle de Solicitud", 14, 20);

  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Solicitud #${request.id}`, 14, 28);

  // Fecha de generación
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Generado el: ${new Date().toLocaleDateString(
      "es-ES"
    )} a las ${format12HourTime(new Date()).display}`,
    14,
    34
  );

  let currentY = 45;

  // Resetear color
  doc.setTextColor(0, 0, 0);

  // Sección: Información General
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setFillColor(41, 128, 185);
  doc.rect(14, currentY, 182, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.text("Información General", 16, currentY + 5);
  currentY += 12;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const generalInfo = [
    ["ID de Solicitud", request.id.toString()],
    ["Tipo de Solicitud", request.request_types?.name || "-"],
    ["Estado", request.request_statuses?.name || "-"],
    ["Prioridad", request.request_priorities?.name || "-"],
    [
      "Fecha de Solicitud",
      new Date(request.request_date).toLocaleDateString("es-ES"),
    ],
    [
      "Fecha de Resolución",
      request.resolution_date
        ? new Date(request.resolution_date).toLocaleDateString("es-ES")
        : "Pendiente",
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    body: generalInfo,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60 },
      1: { cellWidth: 120 },
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // Sección: Personas Involucradas
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setFillColor(41, 128, 185);
  doc.rect(14, currentY, 182, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.text("Personas Involucradas", 16, currentY + 5);
  currentY += 12;

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");

  const peopleInfo = [
    [
      "Solicitante",
      request.users_requests_requester_idTousers?.full_name || "-",
    ],
    [
      "Beneficiario",
      request.users_requests_beneficiary_idTousers?.full_name ||
        "Mismo solicitante",
    ],
    [
      "Técnico Asignado",
      request.users_requests_technician_idTousers?.full_name || "No asignado",
    ],
  ];

  autoTable(doc, {
    startY: currentY,
    body: peopleInfo,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60 },
      1: { cellWidth: 120 },
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // Sección: Información del Equipo (si existe)
  if (request.equipment) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(41, 128, 185);
    doc.rect(14, currentY, 182, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("Información del Equipo", 16, currentY + 5);
    currentY += 12;

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    const equipmentInfo = [
      ["Tipo de Equipo", request.equipment.type_name || "-"],
      ["Marca", request.equipment.brand_name || "-"],
      ["Modelo", request.equipment.model || "-"],
      ["Número de Serie", request.equipment.serial_number || "-"],
      ["Número de Activo", request.equipment.asset_number || "-"],
      ["Ubicación", request.equipment.location || "-"],
    ];

    autoTable(doc, {
      startY: currentY,
      body: equipmentInfo,
      theme: "plain",
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 60 },
        1: { cellWidth: 120 },
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;
  }

  // Sección: Descripción
  if (request.description) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(41, 128, 185);
    doc.rect(14, currentY, 182, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("Descripción", 16, currentY + 5);
    currentY += 12;

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    const splitDescription = doc.splitTextToSize(request.description, 180);
    doc.text(splitDescription, 14, currentY);
    currentY += splitDescription.length * 5 + 10;
  }

  // Sección: Comentarios (si existe)
  if (request.comments_technician) {
    // Verificar si necesitamos nueva página
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(41, 128, 185);
    doc.rect(14, currentY, 182, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("Comentarios del Técnico", 16, currentY + 5);
    currentY += 12;

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    const splitComments = doc.splitTextToSize(request.comments_technician, 180);
    doc.text(splitComments, 14, currentY);
    currentY += splitComments.length * 5 + 10;
  }

  // Sección: Historial de Auditoría (si existe)
  if (auditHistory && auditHistory.length > 0) {
    // Verificar si necesitamos nueva página
    if (currentY > 220) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(41, 128, 185);
    doc.rect(14, currentY, 182, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("Historial de Cambios", 16, currentY + 5);
    currentY += 12;

    doc.setTextColor(0, 0, 0);

    // Parsear valores de auditoría con catálogos
    const parsedAuditData = await Promise.all(
      auditHistory.map(async (entry) => {
        const oldValue = entry.old_value
          ? await formatChangeValueWithCatalogs(entry.field_name, entry.old_value)
          : "-";
        const newValue = entry.new_value
          ? await formatChangeValueWithCatalogs(entry.field_name, entry.new_value)
          : "-";  

        return [
          entry.changed_at ? new Date(entry.changed_at).toLocaleDateString("es-ES") + " " + format12HourTime(new Date(entry.changed_at)).display : "-",
          entry.changed_by?.full_name || "-",
          getChangeTypeName(entry.change_type),
          getFieldName(entry.field_name),
          oldValue,
          newValue,
        ];
      })
    );

    autoTable(doc, {
      startY: currentY,
      head: [
        [
          "Fecha",
          "Usuario",
          "Acción",
          "Campo",
          "Valor Anterior",
          "Valor Nuevo",
        ],
      ],
      body: parsedAuditData,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 35 },
        5: { cellWidth: 35 },
      },
    });
  }

  // Footer en todas las páginas
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  // Guardar el PDF
  const fileName = getFileNameFormattedDate(`solicitud_${request.id}`);
  doc.save(fileName);
};

/**
 * Genera un PDF detallado de un equipo individual con toda su información e historial
 */
export const generateSingleEquipmentPDF = async (
  equipment: EquipmentResponse,
  auditHistory?: AuditLog[]
) => {
  const doc = new jsPDF();

  // Header principal
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("SIGESTEI - Detalle de Equipo", 14, 20);

  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Equipo #${equipment.id}`, 14, 28);

  // Fecha de generación
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Generado el: ${new Date().toLocaleDateString(
      "es-ES"
    )} a las ${format12HourTime(new Date()).display}`,
    14,
    34
  );

  let currentY = 45;

  // Resetear color
  doc.setTextColor(0, 0, 0);

  // Sección: Información General
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setFillColor(39, 174, 96);
  doc.rect(14, currentY, 182, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.text("Información General", 16, currentY + 5);
  currentY += 12;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  const generalInfo = [
    ["ID de Equipo", equipment.id.toString()],
    ["Número de bien", equipment.asset_number],
    ["Tipo de Equipo", equipment.type_name],
    ["Marca", equipment.brand_name],
    ["Modelo", equipment.model],
    ["Número de Serie", equipment.serial_number],
    ["Estado", equipment.status_name],
    ["Ubicación", equipment.location],
    ["Usuario Asignado", equipment.assigned_user_name || "No asignado"],
  ];

  autoTable(doc, {
    startY: currentY,
    body: generalInfo,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 60 },
      1: { cellWidth: 120 },
    },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // Sección: Especificaciones Técnicas (si existen)
  if (
    equipment.specifications?.hardware?.cpu ||
    equipment.specifications?.hardware?.ram ||
    equipment.specifications?.hardware?.storage ||
    equipment.specifications?.hardware?.gpu ||
    equipment.specifications?.hardware?.network ||
    equipment.specifications?.software?.os ||
    equipment.specifications?.software?.office ||
    equipment.specifications?.software?.antivirus
  ) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(39, 174, 96);
    doc.rect(14, currentY, 182, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("Especificaciones Técnicas", 16, currentY + 5);
    currentY += 12;

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    const technicalInfo = [];
    if (equipment.specifications?.hardware?.cpu)
      technicalInfo.push(["Procesador", equipment.specifications?.hardware?.cpu]);
    if (equipment.specifications?.hardware?.ram)
      technicalInfo.push([
        "Memoria RAM",
        equipment.specifications?.hardware?.ram,
      ]);
    if (equipment.specifications?.hardware?.storage)
      technicalInfo.push([
        "Almacenamiento",
        equipment.specifications?.hardware?.storage,
      ]);
    if (equipment.specifications?.hardware?.gpu)
      technicalInfo.push([
        "Tarjeta Gráfica",
        equipment.specifications?.hardware?.gpu,
      ]);
    if (equipment.specifications?.hardware?.network)
      technicalInfo.push([
        "Adaptador de Red",
        equipment.specifications?.hardware?.network,
      ]);
    if (equipment.specifications?.software?.os)
      technicalInfo.push([
        "Sistema Operativo",
        equipment.specifications?.software?.os,
      ]);
    if (equipment.specifications?.software?.office)
      technicalInfo.push([
        "Suite Ofimática",
        equipment.specifications?.software?.office,
      ]);
    if (equipment.specifications?.software?.antivirus)
      technicalInfo.push([
        "Antivirus",
        equipment.specifications?.software?.antivirus,
      ]);

    autoTable(doc, {
      startY: currentY,
      body: technicalInfo,
      theme: "plain",
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 60 },
        1: { cellWidth: 120 },
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;
  }



  // Sección: Historial de Auditoría (si existe)
  if (auditHistory && auditHistory.length > 0) {
    // Verificar si necesitamos nueva página
    if (currentY > 220) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(39, 174, 96);
    doc.rect(14, currentY, 182, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.text("Historial de Cambios", 16, currentY + 5);
    currentY += 12;

    doc.setTextColor(0, 0, 0);

    // Parsear valores de auditoría con catálogos
    const parsedAuditData = await Promise.all(
      auditHistory.map(async (entry) => {
        const oldValue = entry.old_value
          ? await formatChangeValueWithCatalogs(entry.field_name, entry.old_value)
          : "-";
        const newValue = entry.new_value
          ? await formatChangeValueWithCatalogs(entry.field_name, entry.new_value)
          : "-";

        return [
          format12HourTime(new Date(entry.changed_at)).display,
          entry.changed_by?.full_name || "-",
          getChangeTypeName(entry.change_type),
          getFieldName(entry.field_name),
          oldValue,
          newValue,
        ];
      })
    );

    autoTable(doc, {
      startY: currentY,
      head: [
        [
          "Fecha",
          "Usuario",
          "Acción",
          "Campo",
          "Valor Anterior",
          "Valor Nuevo",
        ],
      ],
      body: parsedAuditData,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: {
        fillColor: [39, 174, 96],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 35 },
        5: { cellWidth: 35 },
      },
    });
  }

  // Footer en todas las páginas
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  // Guardar el PDF
  const fileName = getFileNameFormattedDate(`equipo_${equipment.id}`);
  doc.save(fileName);
};

// Exportar tipos para uso en otros archivos
export type { EquipmentForPDF, RequestFilters, EquipmentFilters };
