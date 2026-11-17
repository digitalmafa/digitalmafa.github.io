
const SUPABASE_URL = "https://mfsfxtlqfzakyelugccr.supabase.co";
const SUPABASE_KEY = "sb_publishable_Z7jdBq-VtVYmG_6MF5m84A_UM53KfT8";

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
