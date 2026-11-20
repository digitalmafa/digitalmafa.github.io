(() => {
  "use strict";
  const grid = document.getElementById("favoritesGrid");
  const status = document.getElementById("favoritesStatus");
  if (!grid || !status) return;

  function makeCard(row) {
    const service = row.service_data || {};
    const card = document.createElement("article"); card.className = "favorite-card";
    if (service.image) { const image = document.createElement("img"); image.src = service.image; image.alt = service.name || "Service"; image.loading = "lazy"; card.appendChild(image); }
    const content = document.createElement("div"); content.className = "favorite-card-content";
    const title = document.createElement("h2"); title.textContent = service.name || "Saved service";
    const description = document.createElement("p"); description.textContent = service.description || "";
    const category = document.createElement("p"); category.textContent = service.category || "";
    const price = document.createElement("p"); price.textContent = service.price ? "Price: " + service.price : "";
    const delivery = document.createElement("p"); delivery.textContent = service.delivery_days ? "Delivery: " + service.delivery_days + " days" : "";
    const note = document.createElement("p"); note.textContent = service.note ? "Note: " + service.note : "";
    const expiry = document.createElement("div"); expiry.className = "favorite-meta";
    expiry.textContent = "Expires: " + new Date(row.expires_at).toLocaleDateString();
    const actions = document.createElement("div"); actions.className = "favorite-actions";
    const view = document.createElement("a"); view.className = "favorite-view"; view.href = "search.html?service=" + encodeURIComponent(service.name || ""); view.textContent = "View Details";
    const remove = document.createElement("button"); remove.className = "favorite-remove"; remove.type = "button"; remove.textContent = "♥ Remove";
    remove.addEventListener("click", async () => { remove.disabled = true; try { await window.favoriteManager.remove(row.service_id); await render(); } catch (e) { console.error(e); alert("Could not remove this favorite. Please try again."); remove.disabled = false; } });
    actions.append(view, remove); content.append(title, category, description, price, delivery, note, expiry, actions); card.appendChild(content); return card;
  }

  async function render() {
    grid.replaceChildren(); status.textContent = "Loading your favorites...";
    try {
      const user = await window.favoriteManager.getUser();
      if (!user) { status.textContent = "Please sign in to see your favorites."; const link = document.createElement("a"); link.href = "sign-in.html"; link.textContent = "Sign in"; link.style.color = "#c4b5fd"; status.append(" ", link); return; }
      const rows = await window.favoriteManager.load();
      status.textContent = rows.length ? `${rows.length} saved service${rows.length === 1 ? "" : "s"}` : "";
      if (!rows.length) { const empty = document.createElement("div"); empty.className = "favorites-empty"; empty.innerHTML = '<i class="fa-regular fa-heart" aria-hidden="true"></i><strong>No favorites yet</strong><p>Browse services and tap Add to Favorites to save one here.</p><a href="search.html" style="color:#c4b5fd">Explore Services</a>'; grid.appendChild(empty); return; }
      rows.forEach(row => grid.appendChild(makeCard(row)));
    } catch (error) { console.error("Favorites page load failed:", error); status.textContent = "Favorites could not be loaded. Please check the Supabase setup and try again."; }
  }
  document.addEventListener("digitalmafa:favorites-changed", render);
  render();
})();
