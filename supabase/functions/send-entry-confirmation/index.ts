
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EntryConfirmationRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: EntryConfirmationRequest = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { data, error } = await resend.emails.send({
      from: "Pain Tracker <onboarding@resend.dev>",
      to: [email],
      subject: "Your Daily Pain Entry has been recorded!",
      html: `
        <h1>Thank you for logging your entry!</h1>
        <p>We have successfully recorded your pain tracking data for today.</p>
        <p>Keeping a consistent log is a great step towards understanding and managing your pain.</p>
        <p>See you tomorrow!</p>
        <br/>
        <p>Best regards,<br>The Pain Tracker Team</p>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      throw error;
    }
    
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ message: "Email sent successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-entry-confirmation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
