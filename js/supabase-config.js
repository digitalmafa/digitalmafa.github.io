const SUPABASE_URL = "https://mfsfxtlqfzakyelugccr.supabase.co";
const SUPABASE_KEY = "sb_publishable_Z7jdBq-VtVYmG_6MF5m84A_UM53KfT8";

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// Separate Supabase client for Favorites. It forwards the signed-in Firebase
// ID token so Supabase RLS can identify the Firebase UID. The admin client
// above remains unchanged and continues to use Supabase email/password auth.
window.favoritesSupabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY,
    {
        accessToken: async () => {
            const firebaseUser = window.auth?.currentUser;
            return firebaseUser ? await firebaseUser.getIdToken() : null;
        }
    }
);
