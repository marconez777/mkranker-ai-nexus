
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TextoSeoProdutoForm } from "@/components/texto-seo-produto/TextoSeoProdutoForm";

const TextoSeoProdutoPage = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Texto SEO para Produto</h1>
        <p className="text-muted-foreground">
          Crie textos otimizados para SEO dos seus produtos
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-1">
        <TextoSeoProdutoForm />
      </div>
    </DashboardLayout>
  );
};

export default TextoSeoProdutoPage;
