import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@/lib/api-client";
import { registerUser } from "@/services/auth";

const heroImage = "/images/img_login.png";
const brandLogo = "/images/icon_atmos_agro.svg";

const registerSchema = z
  .object({
    nome: z.string().min(3, "Informe pelo menos 3 caracteres."),
    email: z.string().email("Informe um e-mail válido."),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
    confirmPassword: z.string().min(8, "Confirme a senha."),
    acceptTerms: z
      .boolean()
      .refine((value) => value === true, { message: "Você precisa aceitar os termos." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas precisam coincidir.",
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nome: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (values: RegisterFormValues) =>
      registerUser({ nome: values.nome, email: values.email, password: values.password }),
    onSuccess: () => {
      toast({
        title: "Conta criada com sucesso",
        description: "Faça login com seu e-mail e senha para continuar.",
      });
      navigate("/login");
    },
    onError: (error: unknown) => {
      let description = "Não foi possível criar a conta.";

      if (error instanceof ApiError) {
        if (error.status === 409) {
          description = "Este e-mail já está cadastrado.";
          form.setError("email", { message: description });
        } else {
          description = error.message;
        }
      }

      toast({
        variant: "destructive",
        title: "Não foi possível criar a conta",
        description,
      });
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate(values);
  };

  return (
    <div className="grid min-h-screen bg-white lg:h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img src={heroImage} alt="Campos agr�colas monitorados por sat�lite" className="h-full w-full object-cover" />
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
            <Link to="/login">Entre na sua conta</Link>
          </Button>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold text-[#181E08]">
                Bem vindo ao Atmos
                <span className="text-[#34A853]">Agro</span>!
              </h1>
              <p className="text-base text-muted-foreground">Crie sua conta e explore inúmeros benefícios</p>
            </div>

            <Form {...form}>
              <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base font-medium text-[#181E08]">Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o seu nome completo" className="h-12 text-base" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                            placeholder="Escolha uma senha"
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
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base font-medium text-[#181E08]">Confirmar senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirme a senha escolhida"
                            className="h-12 pr-12 text-base"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            className="absolute inset-y-0 right-5 flex items-center text-muted-foreground transition hover:text-primary"
                            aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <div className="flex items-start gap-3 text-sm text-[#181E08]">
                        <FormControl>
                          <Checkbox
                            id="terms"
                            className="mt-1 border-muted-foreground"
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(checked === true)}
                          />
                        </FormControl>
                        <label htmlFor="terms" className="leading-relaxed">
                          Eu aceito os {" "}
                          <a href="#" className="font-semibold text-primary hover:underline">
                            termos e condicoes
                          </a>
                        </label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="h-12 w-full rounded-[10px] bg-[#34A853] text-base font-normal hover:bg-[#249b4a]"
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Criando...
                    </>
                  ) : (
                    "Criar conta"
                  )}
                </Button>
              </form>
            </Form>

            <p className="text-center text-sm text-[#181E08]">
              Ja tem uma conta?{" "}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Entre aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
