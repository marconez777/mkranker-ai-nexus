
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TextoSeoBlogForm } from "@/components/texto-seo-blog/TextoSeoBlogForm";

const TextoSeoBlogPage = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Texto SEO para Blog</h1>
        <p className="text-muted-foreground">
          Crie textos otimizados para SEO em seus artigos de blog
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-1">
        <TextoSeoBlogForm />
      </div>
    </DashboardLayout>
  );
};

export default TextoSeoBlogPage;
