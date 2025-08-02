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

const chartData = [
  {
    mes: "Enero",
    solicitudesHechas: 145,
    solicitudesResueltas: 132,
    esActual: false,
  },
  {
    mes: "Febrero",
    solicitudesHechas: 167,
    solicitudesResueltas: 158,
    esActual: false,
  },
  {
    mes: "Marzo",
    solicitudesHechas: 189,
    solicitudesResueltas: 175,
    esActual: false,
  },
  {
    mes: "Abril",
    solicitudesHechas: 156,
    solicitudesResueltas: 149,
    esActual: false,
  },
  {
    mes: "Mayo",
    solicitudesHechas: 178,
    solicitudesResueltas: 165,
    esActual: false,
  },
  {
    mes: "Junio",
    solicitudesHechas: 203,
    solicitudesResueltas: 187,
    esActual: false,
  },
  {
    mes: "Julio",
    solicitudesHechas: 195,
    solicitudesResueltas: 182,
    esActual: false,
  },
  {
    mes: "Agosto",
    solicitudesHechas: 212,
    solicitudesResueltas: 198,
    esActual: false,
  },
  {
    mes: "Septiembre",
    solicitudesHechas: 187,
    solicitudesResueltas: 174,
    esActual: false,
  },
  {
    mes: "Octubre",
    solicitudesHechas: 234,
    solicitudesResueltas: 215,
    esActual: false,
  },
  {
    mes: "Noviembre",
    solicitudesHechas: 198,
    solicitudesResueltas: 189,
    esActual: false,
  },
  {
    mes: "Diciembre",
    solicitudesHechas: 156,
    solicitudesResueltas: 98,
    esActual: true,
  },
]

const chartConfig = {
  solicitudesHechas: {
    label: " Solicitudes Hechas",
    color: "var(--chart-2)",
  },
  solicitudesResueltas: {
    label: " Solicitudes Resueltas",
    color: "var(--chart-1)",
  },
}

export default function SolicitudesChart() {
  const [mesSeleccionado, setMesSeleccionado] = useState("Octubre")

  // Encontrar el mes seleccionado para comparar
  const mesActual = chartData.find((item) => item.esActual)
  const mesComparacion = chartData.find((item) => item.mes === mesSeleccionado && !item.esActual)

  // Datos para mostrar en el gráfico (solo 2 meses)
  const datosParaGrafico = [...(mesComparacion ? [mesComparacion] : []), ...(mesActual ? [mesActual] : [])]

  const eficienciaComparacion = mesComparacion
    ? Math.round((mesComparacion.solicitudesResueltas / mesComparacion.solicitudesHechas) * 100)
    : 0

  const eficienciaActual = mesActual
    ? Math.round((mesActual.solicitudesResueltas / mesActual.solicitudesHechas) * 100)
    : 0

  return (
    <div className="space-y-6">
      <Card className="hidden md:block">
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <CardTitle>Comparación de Solicitudes: {mesSeleccionado} vs Mes Actual</CardTitle>
              <CardDescription>
                Comparación directa entre {mesSeleccionado} y {mesActual?.mes} (mes actual)
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="periodo-select" className="text-sm font-medium">
                Mes para comparar:
              </label>
              <Select value={mesSeleccionado} onValueChange={setMesSeleccionado}>
                <SelectTrigger className="w-[140px]" id="periodo-select">
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Enero">Enero</SelectItem>
                  <SelectItem value="Febrero">Febrero</SelectItem>
                  <SelectItem value="Marzo">Marzo</SelectItem>
                  <SelectItem value="Abril">Abril</SelectItem>
                  <SelectItem value="Mayo">Mayo</SelectItem>
                  <SelectItem value="Junio">Junio</SelectItem>
                  <SelectItem value="Julio">Julio</SelectItem>
                  <SelectItem value="Agosto">Agosto</SelectItem>
                  <SelectItem value="Septiembre">Septiembre</SelectItem>
                  <SelectItem value="Octubre">Octubre</SelectItem>
                  <SelectItem value="Noviembre">Noviembre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={datosParaGrafico}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value, name, props) => [
                    value,
                    chartConfig[name as keyof typeof chartConfig]?.label || name,
                    props.payload.esActual ? " (Mes Actual)" : "",
                  ]}
                />
                <ChartLegend content={<ChartLegendContent payload={undefined} />} />
                <Bar dataKey="solicitudesHechas" fill="var(--color-solicitudesHechas)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="solicitudesResueltas" fill="var(--color-solicitudesResueltas)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{mesSeleccionado} - Hechas</CardDescription>
            <CardTitle className="text-2xl">{mesComparacion?.solicitudesHechas || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Mes de comparación seleccionado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>{mesSeleccionado} - Resueltas</CardDescription>
            <CardTitle className="text-2xl">{mesComparacion?.solicitudesResueltas || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Mes de comparación seleccionado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Mes Actual - Hechas</CardDescription>
            <CardTitle className="text-2xl text-blue-600">{mesActual?.solicitudesHechas || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {mesActual && mesComparacion && mesActual.solicitudesHechas > mesComparacion.solicitudesHechas
                ? "↗"
                : "↘"}{" "}
              vs {mesSeleccionado}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Mes Actual - Resueltas</CardDescription>
            <CardTitle className="text-2xl text-green-600">{mesActual?.solicitudesResueltas || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {mesActual && mesComparacion && mesActual.solicitudesHechas > mesComparacion.solicitudesHechas
                ? "↗"
                : "↘"}{" "}
              vs {mesSeleccionado}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tarjeta de eficiencia */}
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Eficiencia</CardTitle>
          <CardDescription>
            Porcentaje de solicitudes resueltas: {mesSeleccionado} vs {mesActual?.mes} (actual)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium">Eficiencia {mesSeleccionado}</p>
              <p className="text-3xl font-bold">{eficienciaComparacion}%</p>
              <p className="text-xs text-muted-foreground">
                {mesComparacion?.solicitudesResueltas} de {mesComparacion?.solicitudesHechas} solicitudes resueltas
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Eficiencia Mes Actual</p>
              <p
                className={`text-3xl font-bold ${eficienciaActual >= eficienciaComparacion ? "text-green-600" : "text-red-600"}`}
              >
                {eficienciaActual}%
              </p>
              <p className="text-xs text-muted-foreground">
                {mesActual?.solicitudesResueltas} de {mesActual?.solicitudesHechas} solicitudes resueltas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
