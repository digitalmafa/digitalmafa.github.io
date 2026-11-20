(() => {
  "use strict";
  const supabase = window.favoritesSupabaseClient || window.supabaseClient;
  const auth = window.auth;
  const TABLE = "favorites";
  let cachedRows = [];
  let authReadyPromise;

  function waitForAuth() {
    if (auth?.currentUser) return Promise.resolve(auth.currentUser);
    if (!auth) return Promise.resolve(null);
    if (!authReadyPromise) {
      authReadyPromise = new Promise(resolve => {
        const unsubscribe = auth.onAuthStateChanged(user => {
          unsubscribe();
          resolve(user || null);
        });
      });
    }
    return authReadyPromise;
  }

  function getServiceId(service) {
    return String(service.id || service.service_id || service.name || "").trim();
  }

  function normalizeService(service) {
    return {
      id: getServiceId(service),
      name: service.name || "Service",
      category: service.category || "",
      description: service.description || "",
      note: service.note || "",
      price: service.price || "",
      delivery_days: service.delivery_days || null,
      image: service.image || "",
      icon: service.icon || "fa-star",
      features: Array.isArray(service.features) ? service.features : []
    };
  }

  async function getUser() {
    return await waitForAuth();
  }

  async function load() {
    const user = await getUser();
    if (!user) {
      cachedRows = [];
      return [];
    }
    if (!supabase) throw new Error("Supabase is not initialized.");

    const now = new Date().toISOString();
    // Expired rows are removed when the user returns; the database cron
    // job in favorites-supabase.sql also performs daily cleanup.
    const { error: cleanupError } = await supabase
      .from(TABLE).delete().eq("user_id", user.uid).lte("expires_at", now);
    if (cleanupError) console.warn("Expired favorites cleanup:", cleanupError.message);

    const { data, error } = await supabase
      .from(TABLE)
      .select("id, user_id, service_id, service_data, created_at, expires_at")
      .eq("user_id", user.uid)
      .gt("expires_at", now)
      .order("created_at", { ascending: false });
    if (error) throw error;
    cachedRows = data || [];
    return cachedRows;
  }

  function isSaved(service) {
    const id = getServiceId(service);
    return cachedRows.some(row => row.service_id === id);
  }

  async function toggle(service) {
    const user = await getUser();
    if (!user) {
      alert("Please sign in first to save your favorites.");
      window.location.href = "sign-in.html";
      return false;
    }
    if (!supabase) throw new Error("Supabase is not initialized.");
    const normalized = normalizeService(service);
    if (!normalized.id) throw new Error("This service cannot be identified for saving.");

    await load();
    const existing = cachedRows.find(row => row.service_id === normalized.id);
    if (existing) {
      const { error } = await supabase.from(TABLE).delete()
        .eq("user_id", user.uid).eq("service_id", normalized.id);
      if (error) throw error;
      cachedRows = cachedRows.filter(row => row.service_id !== normalized.id);
      return false;
    }

    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000);
    const { data, error } = await supabase.from(TABLE).upsert({
      user_id: user.uid,
      service_id: normalized.id,
      service_data: normalized,
      created_at: createdAt.toISOString(),
      expires_at: expiresAt.toISOString()
    }, { onConflict: "user_id,service_id" })
      .select("id, user_id, service_id, service_data, created_at, expires_at")
      .single();
    if (error) throw error;
    cachedRows = [data, ...cachedRows.filter(row => row.service_id !== normalized.id)];
    return true;
  }

  async function remove(serviceId) {
    const user = await getUser();
    if (!user) return;
    const { error } = await supabase.from(TABLE).delete()
      .eq("user_id", user.uid).eq("service_id", String(serviceId));
    if (error) throw error;
    cachedRows = cachedRows.filter(row => row.service_id !== String(serviceId));
  }

  window.favoriteManager = { load, toggle, isSaved, remove, getRows: () => cachedRows.slice(), getUser };

  // Notify pages when login state changes, so the UI can refresh its heart state.
  auth?.onAuthStateChanged(async user => {
    cachedRows = [];
    if (user) {
      try { await load(); } catch (error) { console.warn("Could not preload favorites:", error); }
    }
    document.dispatchEvent(new CustomEvent("digitalmafa:favorites-changed"));
  });
})();
