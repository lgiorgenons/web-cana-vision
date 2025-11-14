import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { resetPassword } from "@/services/password";
import { ApiError } from "@/lib/api-client";

const heroImage = "/images/img_login.png";
const brandLogo = "/images/icon_atmos_agro.svg";
const iconForm = "/images/ic_reset_password.svg";
const iconSuccess = "/images/ic_reset_sucess.svg";
const iconError = "/images/ic_reset_fail.svg";
const arrowIcon = "/images/ic_arrow.svg";

const resetSchema = z
  .object({
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
    confirmPassword: z.string().min(8, "Confirme a senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas precisam coincidir.",
  });

type ResetFormValues = z.infer<typeof resetSchema>;
type ViewMode = "form" | "success" | "error";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const accessToken = useMemo(
    () => searchParams.get("access_token") || searchParams.get("token") || "",
    [searchParams],
  );

  const [viewMode, setViewMode] = useState<ViewMode>(accessToken ? "form" : "error");
  const [errorMessage, setErrorMessage] = useState(
    "Link inválido ou expirado. Solicite um novo e-mail na tela 'Esqueci minha senha'.",
  );

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: ResetFormValues) => resetPassword({ accessToken, password: values.password }),
    onSuccess: () => {
      setViewMode("success");
      toast({ title: "Senha atualizada", description: "Faça login com a nova senha." });
    },
    onError: (error: unknown) => {
      let description = "Não foi possível redefinir a senha. Solicite um novo link.";
      if (error instanceof ApiError) {
        description = error.message;
      }
      setErrorMessage(description);
      setViewMode("error");
      toast({ variant: "destructive", title: "Erro na redefinição", description });
    },
  });

  const onSubmit = (values: ResetFormValues) => {
    if (!accessToken) {
      setViewMode("error");
      setErrorMessage("Link inválido ou expirado. Solicite um novo e-mail de recuperação.");
      return;
    }
    mutation.mutate(values);
  };

  return (
    <div className="grid min-h-screen bg-white lg:h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img src={heroImage} alt="Campos agrícolas monitorados por satélite" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />

        <div className="absolute left-3 top-3 flex items-center gap-0 text-white">
          <img src={brandLogo} alt="AtmosAgro" className="h-20 w-20" />
          <span className="text-[20px] font-normal">AtmosAgro</span>
        </div>

        <div className="absolute bottom-12 left-8 right-10 text-white">
          <h2 className="max-w-xl text-5xl font-semibold leading-[50px]">
            Monitore a saúde da sua cana direto do espaço
          </h2>
          <p className="mt-6 max-w-xl text-base font-normal text-white/85 leading-[20px]">
            Imagens de satélite, índices de estresse e alertas inteligentes — tudo para manter seu canavial produtivo,
            do plantio à colheita.
          </p>
        </div>
      </div>

      <div className="flex flex-col bg-white">
        <div className="flex justify-end px-6 pt-6 sm:px-10">
          <Button asChild className="rounded-[25px] bg-[#34A853] px-8 py-4 text-base font-normal hover:bg-[#249b4a]">
            <Link to="/login">Voltar ao login</Link>
          </Button>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md space-y-8 text-center">
            {viewMode === "form" && (
              <>
                <div className="flex justify-center">
                  <img src={iconForm} alt="Definir nova senha" className="h-40 w-40" />
                </div>
                <div className="space-y-3">
                  <h1 className="text-3xl font-semibold text-[#181E08]">Definir nova senha</h1>
                  <p className="text-base text-muted-foreground">
                    Escolha uma nova senha segura para voltar a acessar a plataforma.
                  </p>
                </div>
                <Form {...form}>
                  <form className="space-y-5 text-left" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-base font-medium text-[#181E08]">Nova senha</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Digite a nova senha" className="h-12 text-base" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-base font-medium text-[#181E08]">Confirmar senha</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Repita a nova senha"
                              className="h-12 text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={mutation.isPending}
                      className="h-12 w-full rounded-[10px] bg-[#34A853] text-base font-normal hover:bg-[#249b4a]"
                    >
                      {mutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                        </>
                      ) : (
                        "Redefinir senha"
                      )}
                    </Button>
                  </form>
                </Form>
              </>
            )}

            {viewMode === "success" && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <img src={iconSuccess} alt="Senha redefinida" className="h-40 w-40" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold text-[#181E08]">Sua senha foi redefinida</h1>
                  <p className="text-base text-muted-foreground">Você já pode acessar a plataforma com a nova senha.</p>
                </div>
                <Button
                  className="h-12 w-full rounded-[10px] bg-[#34A853] text-base font-normal hover:bg-[#249b4a]"
                  onClick={() => navigate("/login")}
                >
                  Ir para o login
                </Button>
              </div>
            )}

            {viewMode === "error" && (
              <div className="space-y-5">
                <div className="flex justify-center">
                  <img src={iconError} alt="Link inválido" className="h-40 w-40" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold text-[#181E08]">Link inválido ou expirado.</h1>
                  <p className="text-base text-muted-foreground">{errorMessage}</p>
                </div>
                <Button
                  className="h-12 w-full rounded-[10px] bg-[#34A853] text-base font-normal hover:bg-[#249b4a]"
                  onClick={() => navigate("/recuperar")}
                >
                  Esqueci minha senha
                </Button>
              </div>
            )}

            <div className="text-left">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#181E08] hover:text-primary"
              >
                <img src={arrowIcon} alt="Voltar" className="h-6 w-6" />
                Voltar para o login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
