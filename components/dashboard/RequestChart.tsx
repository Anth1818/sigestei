"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchDataForDashboard } from "@/api/api"

// Mapeo de meses en inglés a español
const MONTH_NAMES = {
  previous_december: "Diciembre",
  january: "Enero",
  february: "Febrero", 
  march: "Marzo",
  april: "Abril",
  may: "Mayo",
  june: "Junio",
  july: "Julio",
  august: "Agosto",
  september: "Septiembre",
  october: "Octubre",
  november: "Noviembre",
  december: "Diciembre",
};

const chartConfig = {
  createdRequests: {
    label: " Solicitudes Hechas",
    color: "var(--chart-2)",
  },
  resolvedRequests: {
    label: " Solicitudes Resueltas",
    color: "var(--chart-1)",
  },
}

export default function RequestChart() {
  // Get current month dynamically
  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth(); // 0-11
  const currentYear = currentDate.getFullYear();
  const previousYear = currentYear - 1;
  
  // Ajustar índice para incluir previous_december (índice 0 en MONTH_NAMES)
  const currentMonthKey = Object.keys(MONTH_NAMES)[currentMonthIndex + 1];
  
  // Default comparison: previous_december if January, otherwise previous month
  const defaultMonth = currentMonthIndex === 0 
    ? "previous_december" 
    : Object.keys(MONTH_NAMES)[currentMonthIndex]; // mes anterior
  
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth)
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const res = await fetchDataForDashboard();
      return res.data;
    },
  });

  if (isLoading) return <div>Cargando gráfica...</div>;
  if (error) return <div>Error al cargar datos de la gráfica</div>;

  // Create array of chart data based on API response
  const chartData = Object.keys(MONTH_NAMES).map((monthKey) => ({
    month: MONTH_NAMES[monthKey as keyof typeof MONTH_NAMES],
    monthKey,
    createdRequests: data?.requestsCreatedAndResolvedByMonth.created[monthKey as keyof typeof data.requestsCreatedAndResolvedByMonth.created] || 0,
    resolvedRequests: data?.requestsCreatedAndResolvedByMonth.resolved[monthKey as keyof typeof data.requestsCreatedAndResolvedByMonth.resolved] || 0,
    isCurrent: monthKey === currentMonthKey,
  }));

  // Get available months based on current month
  const monthKeys = Object.keys(MONTH_NAMES);
  // Si es enero, incluir previous_december. Si no, desde january hasta mes actual
  const startIndex = currentMonthIndex === 0 ? 0 : 1;
  const availableMonths = monthKeys.slice(startIndex, currentMonthIndex + 2);

  // Find current month and selected month for comparison
  const currentMonth = chartData.find((item) => item.isCurrent);
  const comparisonMonth = chartData.find((item) => item.monthKey === selectedMonth);
  
  // Get labels with years
  const currentMonthLabel = currentMonth ? `${currentMonth.month} ${currentYear}` : '';
  const comparisonMonthLabel = comparisonMonth 
    ? `${comparisonMonth.month} ${comparisonMonth.monthKey === 'previous_december' ? previousYear : currentYear}` 
    : '';

  // Data to show in chart: selected month first, then current month
  const chartDataForGraph = [...(comparisonMonth ? [comparisonMonth] : []), ...(currentMonth ? [currentMonth] : [])];

  const comparisonEfficiency = comparisonMonth && comparisonMonth.createdRequests > 0
    ? Math.round((comparisonMonth.resolvedRequests / comparisonMonth.createdRequests) * 100)
    : 0;

  const currentEfficiency = currentMonth && currentMonth.createdRequests > 0
    ? Math.round((currentMonth.resolvedRequests / currentMonth.createdRequests) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <Card className="hidden md:block">
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <CardTitle>Comparación de Solicitudes: {comparisonMonthLabel} vs {currentMonthLabel}</CardTitle>
              <CardDescription>
                Comparación directa entre {comparisonMonthLabel} y {currentMonthLabel}
              </CardDescription>
            </div>
            {/* show selector only from February onwards (when comparing months of current year) */}
            {currentMonthIndex >= 1 && (
            <div className="flex items-center space-x-2">
              <label htmlFor="periodo-select" className="text-sm font-medium">
                Mes para comparar:
              </label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[140px]" id="periodo-select">
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  {availableMonths.map((monthKey) => (
                    <SelectItem key={monthKey} value={monthKey}>
                      {MONTH_NAMES[monthKey as keyof typeof MONTH_NAMES]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>)}
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartDataForGraph}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value, name, props) => [
                    value,
                    chartConfig[name as keyof typeof chartConfig]?.label || name,
                    props.payload.isCurrent ? " (Mes Actual)" : "",
                  ]}
                />
                <ChartLegend content={<ChartLegendContent payload={undefined}  />} />
                <Bar dataKey="createdRequests" fill="var(--color-createdRequests)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="resolvedRequests" fill="var(--color-resolvedRequests)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{comparisonMonthLabel} - Hechas</CardDescription>
            <CardTitle className="text-2xl">{comparisonMonth?.createdRequests || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Mes de comparación</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{comparisonMonthLabel} - Resueltas</CardDescription>
            <CardTitle className="text-2xl">{comparisonMonth?.resolvedRequests || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Mes de comparación</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{currentMonthLabel} - Hechas</CardDescription>
            <CardTitle className="text-2xl text-blue-600">{currentMonth?.createdRequests || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {currentMonth && comparisonMonth && currentMonth.createdRequests > comparisonMonth.createdRequests
                ? "↗"
                : "↘"}{" "}
              vs {comparisonMonthLabel}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{currentMonthLabel} - Resueltas</CardDescription>
            <CardTitle className="text-2xl text-green-600">{currentMonth?.resolvedRequests || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {currentMonth && comparisonMonth && currentMonth.resolvedRequests > comparisonMonth.resolvedRequests
                ? "↗"
                : "↘"}{" "}
              vs {comparisonMonthLabel}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tarjeta de eficiencia */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Eficiencia</CardTitle>
          <CardDescription>
            Porcentaje de solicitudes resueltas: {comparisonMonthLabel} vs {currentMonthLabel}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Eficiencia {comparisonMonthLabel}</p>
              <p className="text-3xl font-bold">{comparisonEfficiency}%</p>
              <p className="text-xs text-muted-foreground">
                {comparisonMonth?.resolvedRequests} de {comparisonMonth?.createdRequests} solicitudes resueltas
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Eficiencia {currentMonthLabel}</p>
              <p
                className={`text-3xl font-bold ${currentEfficiency >= comparisonEfficiency ? "text-green-600" : "text-red-600"}`}
              >
                {currentEfficiency}%
              </p>
              <p className="text-xs text-muted-foreground">
                {currentMonth?.resolvedRequests} de {currentMonth?.createdRequests} solicitudes resueltas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
