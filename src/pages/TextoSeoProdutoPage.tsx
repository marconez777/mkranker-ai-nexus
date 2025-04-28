
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TextoSeoProdutoForm } from "@/components/texto-seo-produto/TextoSeoProdutoForm";

const TextoSeoProdutoPage = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-1 w-full">
        <TextoSeoProdutoForm />
      </div>
    </DashboardLayout>
  );
};

export default TextoSeoProdutoPage;
