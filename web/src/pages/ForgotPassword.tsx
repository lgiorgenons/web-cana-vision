import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { requestPasswordReset } from "@/services/password";
import { ApiError } from "@/lib/api-client";

const heroImage = "/images/img_login.png";
const brandLogo = "/images/icon_atmos_agro.svg";
const envelopeIcon = "/images/icon_reset_password.svg";
const arrowIcon = "/images/ic_arrow.svg";

const forgotSchema = z.object({
  email: z.string().email("Digite um e-mail válido."),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

const ForgotPassword = () => {
  const { toast } = useToast();

  const form = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const mutation = useMutation({
    mutationFn: requestPasswordReset,
    onSuccess: (data) => {
      toast({
        title: "Se o e-mail estiver cadastrado",
        description: data.message,
      });
      form.reset();
    },
    onError: (error: unknown) => {
      let description = "Não foi possível enviar o link de redefinição.";
      if (error instanceof ApiError) {
        description = error.message;
      }
      toast({ variant: "destructive", title: "Falha ao enviar link", description });
    },
  });

  const onSubmit = (values: ForgotFormValues) => {
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
            <Link to="/login">Entre na sua conta</Link>
          </Button>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 py-8 sm:px-10">
          <div className="w-full max-w-md space-y-8 text-center">
            <div className="flex justify-center">
              <img src={envelopeIcon} alt="Envelope seguro" style={{ width: 180, height: 180 }} />
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold text-[#181E08]">Esqueceu sua senha?</h1>
              <p className="text-base text-muted-foreground">Não se preocupe, redefina a sua senha seguindo as instruções.</p>
            </div>

            <Form {...form}>
              <form className="space-y-5 text-left" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-base font-medium text-[#181E08]">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Entre com o seu e-mail cadastrado"
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
                  {mutation.isPending ? "Enviando..." : "Redefinir senha"}
                </Button>
              </form>
            </Form>

            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-[#181E08]">
              <Link to="/login" className="inline-flex items-center gap-2 font-semibold hover:text-primary">
                <img src={arrowIcon} alt="Voltar" className="h-6 w-6" />
                Voltar para o login
              </Link>
              <button
                type="button"
                onClick={() => form.handleSubmit(onSubmit)()}
                className="text-primary font-semibold hover:underline"
                disabled={mutation.isPending}
              >
                Reenviar link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
