
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TextoSeoProdutoForm } from "@/components/texto-seo-produto/TextoSeoProdutoForm";
import { UsageLimit } from "@/components/ui/UsageLimit";

const TextoSeoProdutoPage = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-1 w-full">
        <UsageLimit feature="textoSeoProduto" />
        <TextoSeoProdutoForm />
      </div>
    </DashboardLayout>
  );
};

export default TextoSeoProdutoPage;
