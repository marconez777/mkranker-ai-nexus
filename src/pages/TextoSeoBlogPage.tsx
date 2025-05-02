
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TextoSeoBlogForm } from "@/components/texto-seo-blog/TextoSeoBlogForm";
import { UsageLimit } from "@/components/ui/UsageLimit";

const TextoSeoBlogPage = () => {
  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-1 w-full">
        <UsageLimit feature="textoSeoBlog" />
        <TextoSeoBlogForm />
      </div>
    </DashboardLayout>
  );
};

export default TextoSeoBlogPage;
