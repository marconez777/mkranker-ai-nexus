
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface PaymentRecord {
  id: string;
  amount: number;
  status: string;
  method: string | null;
  reference: string | null;
  created_at: string;
}

export function PaymentHistoryCard() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useAuth();

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      if (!session?.user) return;
      
      try {
        const { data, error } = await supabase
          .from("billing_history")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (error) {
          console.error("Error fetching payment history:", error);
          throw error;
        }
        
        setPayments(data || []);
      } catch (error) {
        console.error("Failed to fetch payment history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [session]);

  // Format payment status for display
  const formatStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "aprovado":
        return <span className="text-green-600 font-medium">Aprovado</span>;
      case "recusado":
        return <span className="text-red-600 font-medium">Recusado</span>;
      case "pendente":
        return <span className="text-yellow-600 font-medium">Pendente</span>;
      default:
        return <span>{status}</span>;
    }
  };

  // Format amount as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Histórico de Pagamentos</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : payments.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Referência</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {payment.created_at ? format(new Date(payment.created_at), "dd/MM/yyyy") : "-"}
                    </TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>{payment.method || "-"}</TableCell>
                    <TableCell>{formatStatus(payment.status)}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {payment.reference ? 
                        <span className="truncate inline-block max-w-[100px]" title={payment.reference}>
                          {payment.reference}
                        </span> : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Você ainda não possui pagamentos registrados.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
