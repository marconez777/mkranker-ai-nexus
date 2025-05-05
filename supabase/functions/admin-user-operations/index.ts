import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { deleteUser, manualActivateSubscription } from "./operations.ts";

serve(async (req) => {
  try {
    const { operation, userId, data } = await req.json();

    switch (operation) {
      case "delete":
        return await deleteUser(userId);
        
      case "manual_activate_subscription":
        return await manualActivateSubscription(userId, data);

      default:
        return new Response(JSON.stringify({ success: false, message: "Operação desconhecida" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
    }
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
