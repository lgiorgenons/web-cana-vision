import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/services/auth";
import { saveAuthSession } from "@/lib/auth-session";
import { ApiError } from "@/lib/api-client";

const heroImage = "/images/img_login.png";
const brandLogo = "/images/icon_atmos_agro.svg";

const socialProviders = [
  { label: "Facebook", icon: "/images/ic_facebook.svg" },
  { label: "Apple", icon: "/images/ic_apple.svg" },
  { label: "Google", icon: "/images/ic_google.svg" },
];

const loginSchema = z.object({
  email: z.string().email("Digite um e-mail válido."),
  password: z.string().min(1, "Informe sua senha."),
  remember: z.boolean().default(true),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  const loginMutation = useMutation({
    mutationFn: (values: LoginFormValues) => loginUser({ email: values.email, password: values.password }),
    onSuccess: (data, variables) => {
      if (!data.tokens) {
        toast({
          variant: "destructive",
          title: "Sessão não disponível",
          description: "Confirme seu e-mail antes de acessar a plataforma.",
        });
        return;
      }

      saveAuthSession(data, variables.remember);
      toast({ title: "Bem-vindo de volta", description: `Olá, ${data.user.nome.split(" ")[0]}!` });
      navigate("/dashboard");
    },
    onError: (error: unknown, variables) => {
      if (error instanceof ApiError) {
        const body = (typeof error.body === "object" && error.body !== null ? error.body : undefined) as
          | { code?: string; message?: string }
          | undefined;

        const messageText = body?.message ?? error.message ?? "";
        const isPendingConfirmation =
          body?.code === "email_not_confirmed" || /confirm/i.test(messageText) || /confirm/i.test(error.message ?? "");

        if (isPendingConfirmation) {
          toast({
            variant: "destructive",
            title: "Confirme seu e-mail",
            description:
              "Finalize a confirmação enviada para o seu e-mail antes de entrar. Verifique sua caixa de entrada ou solicite um novo link.",
          });
          return;
        }

        if (error.status === 401) {
          const description = "E-mail não encontrado ou senha incorreta.";
          form.setError("email", { message: "Confira se o e-mail está correto." });
          form.setError("password", { message: "Confira se a senha está correta." });
          toast({ variant: "destructive", title: "Não foi possível fazer login", description });
          if (!variables?.password) {
            form.setFocus("password");
          }
          return;
        }

        toast({
          variant: "destructive",
          title: "Não foi possível fazer login",
          description: error.message,
        });
        return;
      }

      toast({ variant: "destructive", title: "Não foi possível fazer login", description: "Tente novamente em instantes." });

      if (!variables?.password) {
        form.setFocus("password");
      }
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
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
            <Link to="/registrar">Crie sua conta</Link>
          </Button>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold text-[#181E08]">
                Bem vindo ao Atmos
                <span className="text-[#34A853]">Agro</span>!
              </h1>
              <p className="text-base text-muted-foreground">Entre na sua conta</p>
            </div>

            <Form {...form}>
              <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base font-medium text-[#181E08]">Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Entre com seu e-mail" className="h-12 text-base" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base font-medium text-[#181E08]">Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Entre com sua senha"
                            className="h-12 pr-12 text-base"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-5 flex items-center text-muted-foreground transition hover:text-primary"
                            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex flex-col gap-3 text-sm text-[#181E08] sm:flex-row sm:items-center sm:justify-between">
                        <label className="flex items-center gap-2 font-medium">
                          <FormControl>
                            <Checkbox
                              id="remember"
                              className="border-muted-foreground"
                              checked={field.value}
                              onCheckedChange={(checked) => field.onChange(checked === true)}
                            />
                          </FormControl>
                          <span>Lembrar da conta</span>
                        </label>
                        <Link to="/recuperar" className="font-semibold text-primary hover:underline">
                          Esqueceu a senha?
                        </Link>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="h-12 w-full rounded-[10px] bg-[#34A853] text-base font-normal hover:bg-[#249b4a]"
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            </Form>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Separator className="flex-1 bg-[#CBCAD7]" />
                <span className="font-medium text-[#8E8E93]">Ou entre com</span>
                <Separator className="flex-1 bg-[#CBCAD7]" />
              </div>

              <div className="flex justify-center gap-10">
                {socialProviders.map(({ label, icon }) => (
                  <button key={label} type="button" className="p-0 transition focus-visible:outline-none" aria-label={`Entrar com ${label}`}>
                    <img src={icon} alt={label} className="h-[42px] w-[42px]" draggable={false} />
                  </button>
                ))}
              </div>
            </div>

            <p className="text-center text-sm text-[#181E08]">
              Não tem uma conta?{" "}
              <Link to="/registrar" className="font-semibold text-primary hover:underline">
                Registre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
