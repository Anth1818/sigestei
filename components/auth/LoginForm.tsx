"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import sigestei from "@/public/sigestei.png";
import { ThemeToggle } from "../ui/theme-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { login } from "@/api/api";
import { useRedirectBasedType } from "@/hooks/useRedirect";
import type { UserData } from "@/lib/types";
import { useUserStore } from "@/hooks/useUserStore";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [error, setError] = useState("");
  const setUser = useUserStore((state) => state.setUser);

  const redirectBasedUserType = useRedirectBasedType();
  const onSubmit = async (data: any) => {
    setError("");
    try {
      let responseLogin = await login(data.email, data.password);
      const user: UserData = responseLogin.user;
      const message = responseLogin.message;
      if (user) {
        // Guarda el usuario en localStorage
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user); // Guarda el usuario globalmente

        redirectBasedUserType(user.role_id);
      }
    } catch (err: any) {
      setError(err?.message);
      console.log(err);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Bienvenido de nuevo</h1>
                <p className="text-muted-foreground text-balance">
                  Inicia sesión en tu cuenta de SIGESTEI
                </p>
                <span className="pt-4">
                  {" "}
                  <ThemeToggle />
                </span>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email", { required: "El correo es requerido" })}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <span className="text-red-500 text-xs">
                    {errors.email.message as string}
                  </span>
                )}
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="ml-auto text-sm underline-offset-2 hover:underline">
                          Olvidaste tu contraseña?
                        </p>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        Contacta con el administrador del sistema para recuperar
                        tu contraseña.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "La contraseña es requerida",
                  })}
                  disabled={isSubmitting}
                />
                {errors.password && (
                  <span className="text-red-500 text-xs">
                    {errors.password.message as string}
                  </span>
                )}
              </div>
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Ingresando..." : "Iniciar sesión"}
              </Button>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              width={1000}
              height={1000}
              src={sigestei}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.6]"
              priority
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
