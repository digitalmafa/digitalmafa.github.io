(() => {
    "use strict";
const shopServices = [];

// =====================================
// DIGITALMAFA ADMIN SERVICES
// =====================================

// Admin-created services are loaded from Supabase (publicly published rows only).
async function loadAdminServicesFromSupabase() {
    try {
        if (!window.supabaseClient) {
            throw new Error("Supabase client is not initialized.");
        }
        const { data, error } = await window.supabaseClient
            .from("services")
            .select("id, name, category, description, note, price, delivery_days, features, keywords, image, published, created_at")
            .eq("published", true)
            .order("created_at", { ascending: false });
        if (error) throw error;
        shopServices.push(...(data || []).map(service => ({
            ...service,
            createdAt: service.created_at,
            features: Array.isArray(service.features) ? service.features : [],
            keywords: Array.isArray(service.keywords) ? service.keywords : []
        })));
    } catch (error) {
        console.error("Could not load admin services from Supabase:", error);
    }
    renderShop();
    openSharedServiceFromUrl();
}

    // =====================================
    // 2. GET HTML ELEMENTS
    // =====================================

    const $ = id => document.getElementById(id);

    const shopGrid = $("shopGrid");
    const shopSearch = $("shopSearch");
    const searchSuggestions = $("searchSuggestions");
    const shopSearchBtn = $("shopSearchBtn");
    const shopFilters = document.querySelectorAll(".shop-filter");

    const serviceModal = $("serviceModal");
    const modalClose = $("modalClose");
    const modalCategory = $("modalCategory");
    const modalTitle = $("modalTitle");
    const modalDescription = $("modalDescription");
    const modalContactBtn = $("modalContactBtn");
    const modalPrice = $("modalPrice");
    const modalDeliveryDays = $("modalDeliveryDays");
    const modalFavoriteBtn = $("modalFavoriteBtn");
const modalFeatures = $("modalFeatures");

    const reviewsDrawer = $("reviewsDrawer");
    const reviewsList = $("reviewsList");
    const reviewForm = $("reviewForm");
    const reviewName = $("reviewName");
    const reviewFeedback = $("reviewFeedback");
    const starRating = $("starRating");
    const reviewFormTitle = $("reviewFormTitle");
    const reviewSubmit = $("reviewSubmit");
    const reviewCancel = $("reviewCancel");

    if (
        !shopGrid || !shopSearch || !shopSearchBtn ||
        !serviceModal || !modalClose || !modalTitle ||
        !reviewsDrawer || !reviewsList || !reviewForm ||
        !reviewName || !reviewFeedback || !starRating ||
        !reviewFormTitle || !reviewSubmit || !reviewCancel
    ) {
        console.error(
            "DigitalMAFA: Required HTML element missing. Check your element IDs."
        );
        return;
    }

    // Firebase Compat objects from firebase-config.js
    const auth = window.auth;
    const db = window.db;

    if (!auth || !db) {
        console.error(
            "Firebase is not initialized. Check Firebase scripts and firebase-config.js."
        );
        return;
    }

    let activeShopCategory = "All";
    let currentReviewService = "";
    let selectedRating = 0;
    let editingReviewId = null;
    let currentUser = null;
    let serviceReviews = [];
    let unsubscribeReviews = null;
    let reviewRequestInProgress = false;
    let activeFavoriteService = null;


    
    // =====================================
    // LIVE SEARCH SUGGESTIONS
    // =====================================

    if (shopSearch && searchSuggestions) {
        shopSearch.setAttribute("autocomplete", "off");

        shopSearch.addEventListener("input", function () {
            
const query = shopSearch.value.trim().toLowerCase();
searchSuggestions.replaceChildren();

if (!query) {
    searchSuggestions.style.display = "none";
    return;
}

const matches = shopServices.filter(service => {
    const searchableText = [
        service.name,
        service.category,
        service.description,
        ...(service.keywords || []),
        ...(service.features || [])
    ].join(" ").toLowerCase();

    return searchableText.includes(query);
}).slice(0, 6);

if (matches.length === 0) {
    searchSuggestions.style.display = "none";
    return;
}


matches.forEach(service => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "search-suggestion-item";

    const matchedKeyword = (service.keywords || []).find(keyword =>
        keyword.toLowerCase().includes(query)
    );

    const title = document.createElement("span");
    title.className = "suggestion-service-name";
    title.textContent = service.name;

    item.appendChild(title);

    if (matchedKeyword) {
        const keywordText = document.createElement("small");
        keywordText.className = "suggestion-keyword";
        keywordText.textContent = "Keyword: " + matchedKeyword;
        item.appendChild(keywordText);
    }

    item.addEventListener("click", function () {
        shopSearch.value = service.name;
        searchSuggestions.style.display = "none";
        renderShop();
    });

    searchSuggestions.appendChild(item);
});


searchSuggestions.style.display = "block";


            searchSuggestions.style.display = "block";
        });

        document.addEventListener("click", function (event) {
            if (!event.target.closest(".search-box-wrapper")) {
                searchSuggestions.style.display = "none";
            }
        });

        shopSearch.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                searchSuggestions.style.display = "none";
            }
        });
    }

    // =====================================
    // SHARE POPUP + SHORT SERVICE LINKS
    // =====================================
    function makeServiceShareCode(service) {
        // Stable compact code derived from service identity; no external URL shortener needed.
        const source = String(service.name || "") + "|" + String(service.category || "");
        let hash = 2166136261;
        for (let i = 0; i < source.length; i++) {
            hash ^= source.charCodeAt(i);
            hash = Math.imul(hash, 16777619);
        }
        return (hash >>> 0).toString(36).padStart(7, "0");
    }

    function buildShortServiceUrl(service) {
        const url = new URL("search.html", window.location.href);
        url.search = "?s=" + encodeURIComponent(makeServiceShareCode(service));
        url.hash = "";
        return url.href;
    }

    function openSharePopup(service) {
        let popup = document.getElementById("serviceSharePopup");
        if (!popup) {
            popup = document.createElement("div");
            popup.id = "serviceSharePopup";
            popup.className = "share-popup-overlay";
            popup.setAttribute("aria-hidden", "true");
            popup.innerHTML = `
                <div class="share-popup-card" role="dialog" aria-modal="true" aria-labelledby="sharePopupTitle">
                    <button type="button" class="share-popup-close" aria-label="Close share popup">&times;</button>
                    <div class="share-popup-icon"><i class="fa-solid fa-share-nodes" aria-hidden="true"></i></div>
                    <h2 id="sharePopupTitle">Share this service</h2>
                    <p class="share-popup-service-name"></p>
                    <label class="share-popup-label" for="shareShortUrl">Short service link</label>
                    <div class="share-url-row">
                        <input id="shareShortUrl" type="text" readonly>
                        <button type="button" class="share-copy-btn"><i class="fa-regular fa-copy" aria-hidden="true"></i> Copy</button>
                    </div>
                    <p class="share-copy-status" aria-live="polite"></p>
                    <div class="share-popup-actions">
                        <button type="button" class="share-native-btn"><i class="fa-solid fa-arrow-up-from-bracket" aria-hidden="true"></i> Share</button>
                        <a class="share-whatsapp-btn" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> WhatsApp</a>
                    </div>
                </div>`;
            document.body.appendChild(popup);
            popup.querySelector(".share-popup-close").addEventListener("click", () => closeSharePopup());
            popup.addEventListener("click", event => {
                if (event.target === popup) closeSharePopup();
            });
            popup.querySelector(".share-copy-btn").addEventListener("click", async () => {
                const input = popup.querySelector("#shareShortUrl");
                const status = popup.querySelector(".share-copy-status");
                try {
                    if (navigator.clipboard && window.isSecureContext) {
                        await navigator.clipboard.writeText(input.value);
                    } else {
                        input.focus();
                        input.select();
                        const copied = document.execCommand("copy");
                        if (!copied) throw new Error("Copy command was not available");
                    }
                    status.textContent = "Link copied successfully!";
                    status.classList.add("is-success");
                } catch (error) {
                    input.focus();
                    input.select();
                    status.textContent = "Select the link and copy it.";
                    status.classList.remove("is-success");
                }
            });
            popup.querySelector(".share-native-btn").addEventListener("click", async () => {
                const input = popup.querySelector("#shareShortUrl");
                const title = popup.dataset.serviceTitle || "DigitalMAFA Service";
                const text = "Check out " + title + " on DigitalMAFA";
                try {
                    if (window.AndroidShare && typeof window.AndroidShare.share === "function") {
                        window.AndroidShare.share(title + " | DigitalMAFA", text, input.value);
                    } else if (window.DesktopShare && typeof window.DesktopShare.share === "function") {
                        window.DesktopShare.share(title + " | DigitalMAFA", text, input.value);
                    } else if (navigator.share) {
                        await navigator.share({ title: title + " | DigitalMAFA", text, url: input.value });
                    } else {
                        await navigator.clipboard.writeText(input.value);
                        popup.querySelector(".share-copy-status").textContent = "Link copied successfully!";
                    }
                } catch (error) {
                    if (error.name !== "AbortError") console.error("Share failed:", error);
                }
            });
            document.addEventListener("keydown", event => {
                if (event.key === "Escape") closeSharePopup();
            });
        }

        const shortUrl = buildShortServiceUrl(service);
        popup.querySelector(".share-popup-service-name").textContent = service.name;
        popup.querySelector("#shareShortUrl").value = shortUrl;
        popup.querySelector(".share-copy-status").textContent = "";
        popup.dataset.serviceTitle = service.name;
        popup.querySelector(".share-whatsapp-btn").href =
            "https://wa.me/?text=" + encodeURIComponent("Check out " + service.name + " on DigitalMAFA: " + shortUrl);
        popup.classList.add("show");
        popup.setAttribute("aria-hidden", "false");
        popup.querySelector(".share-popup-close").focus();
    }

    function closeSharePopup() {
        const popup = document.getElementById("serviceSharePopup");
        if (!popup) return;
        popup.classList.remove("show");
        popup.setAttribute("aria-hidden", "true");
    }

    function openSharedServiceFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const shareCode = params.get("s");
        const legacyName = params.get("service");
        if (!shareCode && !legacyName) return;

        const matchedService = shopServices.find(service => {
            if (shareCode) return makeServiceShareCode(service) === shareCode;
            return String(service.name || "").toLowerCase() === String(legacyName).toLowerCase();
        });
        if (!matchedService) return;

        shopSearch.value = "";
        activeShopCategory = "All";
        shopFilters.forEach(filter => filter.classList.toggle("active", filter.dataset.category === "All"));
        renderShop();
        modalCategory.textContent = matchedService.category || "";
        modalTitle.textContent = matchedService.name || "";
        modalDescription.textContent = matchedService.description || "";
        const oldNote = document.getElementById("modalNote");
        if (oldNote) oldNote.remove();
        if (matchedService.note) {
            const note = document.createElement("p");
            note.id = "modalNote";
            note.className = "shop-card-note";
            note.textContent = "Note: " + matchedService.note;
            modalDescription.insertAdjacentElement("afterend", note);
        }
        modalPrice.textContent = matchedService.price ? "Price: " + matchedService.price : "Price: Contact for pricing";
        if (modalDeliveryDays) modalDeliveryDays.textContent = matchedService.delivery_days ? "Delivery: " + matchedService.delivery_days + " days" : "";
        modalFeatures.replaceChildren();
        (matchedService.features || []).forEach(feature => {
            const item = document.createElement("li");
            item.textContent = feature;
            modalFeatures.appendChild(item);
        });
        const contactParams = new URLSearchParams({
            service: matchedService.name,
            category: matchedService.category || "",
            description: matchedService.description || "",
            note: matchedService.note || "",
            price: matchedService.price || "",
            features: (matchedService.features || []).join("|")
        });
        modalContactBtn.href = "contact.html?" + contactParams.toString();
        setCurrentReviewService(matchedService.name);
        activeFavoriteService = matchedService;
        if (modalFavoriteBtn) updateFavoriteButton(modalFavoriteBtn, window.favoriteManager?.isSaved(matchedService) || false);
        serviceModal.classList.add("show");
    }

    // =====================================
    // 3. SERVICE SEARCH AND CARDS
    // =====================================

    function renderShop() {
        const query = shopSearch.value.trim().toLowerCase();

        const filtered = shopServices.filter(service => {
            const categoryMatch =
                activeShopCategory === "All" ||
                service.category === activeShopCategory;

            const searchableText = (
                service.name + " " +
                service.category + " " +
                service.description + " " +
                service.keywords
            ).toLowerCase();

            return categoryMatch && searchableText.includes(query);
        });

        shopGrid.replaceChildren();

        if (filtered.length === 0) {
            const empty = document.createElement("p");
            empty.className = "shop-empty";
            empty.textContent =
                "No matching services found. Try another search.";
            shopGrid.appendChild(empty);
            return;
        }

        filtered.forEach(service => {
            const card = document.createElement("article");
            card.className = "shop-card";

            const top = document.createElement("div");
            top.className = "shop-card-top";

            
if (service.image) {
    const image = document.createElement("img");
    image.src = service.image;
    image.alt = service.name;
    image.className = "shop-card-image";
    image.loading = "lazy";
    top.appendChild(image);
} else {
    const icon = document.createElement("i");
    icon.className = "fa-solid " + service.icon;
    icon.setAttribute("aria-hidden", "true");
    top.appendChild(icon);
}


            const body = document.createElement("div");
            body.className = "shop-card-body";

            const category = document.createElement("span");
            category.className = "shop-card-category";
            category.textContent = service.category;

            const title = document.createElement("h3");
            title.textContent = service.name;

            
const description = document.createElement("p");
description.textContent = service.description;

const note = document.createElement("p");
note.className = "shop-card-note";
note.textContent = service.note ? "Note: " + service.note : "";
note.hidden = !service.note;

// Show service price
const price = document.createElement("p");
price.className = "shop-card-price";
price.textContent = service.price
    ? "Price: " + service.price
    : "Price: Contact for pricing";

const delivery = document.createElement("p");
delivery.className = "shop-card-delivery";
delivery.textContent = service.delivery_days ? "Delivery: " + service.delivery_days + " days" : "";
delivery.hidden = !service.delivery_days;

// Show service features
const featuresList = document.createElement("ul");
featuresList.className = "shop-card-features";

(service.features || []).forEach(feature => {
    const item = document.createElement("li");
    item.textContent = feature;
    featuresList.appendChild(item);
});

const favoriteBtn = document.createElement("button");
favoriteBtn.type = "button";
favoriteBtn.className = "card-favorite-btn";
favoriteBtn.innerHTML = '<i class="fa-regular fa-heart" aria-hidden="true"></i> Add to Favorites';
favoriteBtn.setAttribute("aria-label", "Add " + service.name + " to favorites");
favoriteBtn.addEventListener("click", async () => {
    try {
        favoriteBtn.disabled = true;
        const saved = await window.favoriteManager.toggle(service);
        updateFavoriteButton(favoriteBtn, saved);
        if (activeFavoriteService && activeFavoriteService.id === service.id && modalFavoriteBtn) {
            updateFavoriteButton(modalFavoriteBtn, saved);
        }
    } catch (error) {
        console.error("Favorite save failed:", error);
        alert("Favorite save nahi hua. Sign in aur Supabase setup check karein.");
    } finally {
        favoriteBtn.disabled = false;
    }
});
updateFavoriteButton(favoriteBtn, window.favoriteManager?.isSaved(service) || false);

const detailsBtn = document.createElement("button");

            detailsBtn.type = "button";
            detailsBtn.className = "view-details-btn";
            detailsBtn.textContent = "View Details →";

            detailsBtn.addEventListener("click", () => {
                modalCategory.textContent = service.category;
                modalTitle.textContent = service.name;
                modalDescription.textContent = service.description;
                const existingModalNote = document.getElementById("modalNote");
                if (existingModalNote) existingModalNote.remove();
                if (service.note) {
                    const modalNote = document.createElement("p");
                    modalNote.id = "modalNote";
                    modalNote.className = "shop-card-note";
                    modalNote.textContent = "Note: " + service.note;
                    modalDescription.insertAdjacentElement("afterend", modalNote);
                }
                // Show service price in popup
modalPrice.textContent = service.price
    ? "Price: " + service.price
    : "Price: Contact for pricing";
if (modalDeliveryDays) modalDeliveryDays.textContent = service.delivery_days ? "Delivery: " + service.delivery_days + " days" : "";

// Show service features in popup
modalFeatures.replaceChildren();

(service.features || []).forEach(feature => {
    const item = document.createElement("li");
    item.textContent = feature;
    modalFeatures.appendChild(item);
});

                const params = new URLSearchParams({
    service: service.name,
    category: service.category,
    description: service.description,
    note: service.note || "",
    price: service.price || "",
    features: (service.features || []).join("|")
});

modalContactBtn.href = "contact.html?" + params.toString();

                modalContactBtn.href =
                    "contact.html?" + params.toString();

                setCurrentReviewService(service.name);
                activeFavoriteService = service;
                if (modalFavoriteBtn) updateFavoriteButton(modalFavoriteBtn, window.favoriteManager?.isSaved(service) || false);
                serviceModal.classList.add("show");
            });

            
const shareBtn = document.createElement("button");
shareBtn.type = "button";

shareBtn.className = "share-service-btn";
shareBtn.innerHTML = '<i class="fa-solid fa-share-nodes" aria-hidden="true"></i>';

shareBtn.setAttribute("aria-label", "Share " + service.name);

shareBtn.addEventListener("click", () => {
    openSharePopup(service);
});
body.append(
    category,
    title,
    description,
    ...(service.note ? [note] : []),
    price,
    ...(service.delivery_days ? [delivery] : []),
    featuresList,
    favoriteBtn,
    detailsBtn,
    shareBtn
);

            card.append(top, body);
            shopGrid.appendChild(card);
            
        });
    }

    shopSearch.addEventListener("input", renderShop);
    shopSearchBtn.addEventListener("click", renderShop);

    shopSearch.addEventListener("keydown", event => {
        if (event.key === "Enter") renderShop();
    });

    shopFilters.forEach(button => {
        button.addEventListener("click", () => {
            activeShopCategory = button.dataset.category;

            shopFilters.forEach(filter => {
                filter.classList.toggle("active", filter === button);
            });

            renderShop();
        });
    });

    // =====================================
    // FAVORITES / WISHLIST UI
    // =====================================
    function updateFavoriteButton(button, saved) {
        if (!button) return;
        button.classList.toggle("is-favorite", !!saved);
        const isCardButton = button.classList.contains("card-favorite-btn");
        button.innerHTML = saved
            ? '<i class="fa-solid fa-heart" aria-hidden="true"></i>' + (isCardButton ? ' Remove Favorite' : '')
            : '<i class="fa-regular fa-heart" aria-hidden="true"></i>' + (isCardButton ? ' Add to Favorites' : '');
        button.setAttribute("aria-label", saved ? "Remove from favorites" : "Add to favorites");
        button.title = saved ? "Remove from favorites" : "Add to favorites";
    }

    if (modalFavoriteBtn) {
        modalFavoriteBtn.addEventListener("click", async () => {
            if (!activeFavoriteService || !window.favoriteManager) return;
            try {
                modalFavoriteBtn.disabled = true;
                const saved = await window.favoriteManager.toggle(activeFavoriteService);
                updateFavoriteButton(modalFavoriteBtn, saved);
                renderShop();
            } catch (error) {
                console.error("Favorite save failed:", error);
                alert("Favorite save nahi hua. Sign in aur Supabase setup check karein.");
            } finally {
                modalFavoriteBtn.disabled = false;
            }
        });
    }

    document.addEventListener("digitalmafa:favorites-changed", () => {
        if (activeFavoriteService && modalFavoriteBtn) {
            updateFavoriteButton(modalFavoriteBtn, window.favoriteManager?.isSaved(activeFavoriteService) || false);
        }
        renderShop();
    });

    // =====================================
    // 4. SERVICE MODAL
    // =====================================

    function closeServiceModal() {
        serviceModal.classList.remove("show");
    }

    modalClose.addEventListener("click", closeServiceModal);

    serviceModal.addEventListener("click", event => {
        if (event.target === serviceModal) {
            closeServiceModal();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeServiceModal();
            reviewsDrawer.classList.remove("active");
        }
    });

    // =====================================
    // 5. FIRESTORE REVIEW STORAGE
    // =====================================

    function setCurrentReviewService(serviceName) {
        currentReviewService = serviceName;
        resetReviewForm();
        listenForReviews();
    }

    function listenForReviews() {
        if (unsubscribeReviews) {
            unsubscribeReviews();
            unsubscribeReviews = null;
        }

        serviceReviews = [];
        renderReviews();

        if (!currentReviewService) return;

        unsubscribeReviews = db.collection("reviews")
            .where("serviceName", "==", currentReviewService)
            .onSnapshot(snapshot => {
                serviceReviews = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                serviceReviews.sort((a, b) => {
                    const timeA = a.createdAt &&
                        typeof a.createdAt.toMillis === "function"
                        ? a.createdAt.toMillis() : 0;

                    const timeB = b.createdAt &&
                        typeof b.createdAt.toMillis === "function"
                        ? b.createdAt.toMillis() : 0;

                    return timeB - timeA;
                });

                renderReviews();
            }, error => {
                console.error("Unable to load reviews:", error);
                reviewsList.textContent =
                    "Reviews load nahi ho paaye. Please try again.";
            });
    }

    window.toggleReviews = function () {
        if (!currentReviewService) {
            alert("Please select a service first.");
            return;
        }

        reviewsDrawer.classList.toggle("active");
        renderReviews();
    };

    // =====================================
    // 6. STAR RATING
    // =====================================

    const starButtons =
        starRating.querySelectorAll("button[data-rating]");

    function setRating(rating) {
        selectedRating = rating;

        starButtons.forEach(star => {
            const value = Number(star.dataset.rating);
            const selected = value <= rating;

            star.classList.toggle("selected", selected);
            star.classList.toggle("active", selected);
            star.setAttribute(
                "aria-pressed",
                value === rating ? "true" : "false"
            );
        });
    }

    starButtons.forEach(star => {
        star.addEventListener("click", () => {
            if (!currentUser) {
                if (confirm("You must sign in to write a review. Go to the sign-in page?")) {
    window.location.href = "sign-in.html";
}
                return;
            }

            setRating(Number(star.dataset.rating));
        });
    });

    // =====================================
    // 7. RESET REVIEW FORM
    // =====================================

    function resetReviewForm() {
        reviewForm.reset();
        editingReviewId = null;
        setRating(0);

        reviewFormTitle.textContent = "Write a Review";
        reviewSubmit.textContent = "Submit Review";
        reviewCancel.hidden = true;
        reviewName.readOnly = false;
        reviewSubmit.disabled = false;
    }

    reviewCancel.addEventListener("click", resetReviewForm);

    // =====================================
    // 8. DISPLAY REVIEWS
    // =====================================

    function renderReviews() {
        reviewsList.replaceChildren();

        if (!currentReviewService) {
            const message = document.createElement("p");
            message.textContent =
                "Select a service to view its reviews.";
            reviewsList.appendChild(message);
            return;
        }

        const loginMessage = document.createElement("p");
        loginMessage.className = "review-login-message";
        loginMessage.textContent = currentUser
            ? "Signed in as " +
                (currentUser.displayName || currentUser.email || "User")
            :"";

        reviewsList.appendChild(loginMessage);

        if (serviceReviews.length === 0) {
            const empty = document.createElement("p");
            empty.className = "no-reviews";
            empty.textContent =
                "No reviews yet for " + currentReviewService +
                ". Be the first to write one!";
            reviewsList.appendChild(empty);
            return;
        }

        serviceReviews.forEach(review => {
            const card = document.createElement("article");
            card.className = "review-card";

            const name = document.createElement("h4");
            name.textContent = review.name || "User";

            const stars = document.createElement("div");
            stars.className = "review-stars";

            const rating = Math.max(
                0,
                Math.min(5, Number(review.rating) || 0)
            );

            stars.textContent =
                "★".repeat(rating) + "☆".repeat(5 - rating);

            const feedback = document.createElement("p");
            feedback.textContent = review.feedback || "";

            const date = document.createElement("small");
            date.textContent = review.date || "";

            card.append(name, stars, feedback, date);

            // Only the owner sees the Edit/Delete buttons.
            if (currentUser && currentUser.uid === review.uid) {
                const actions = document.createElement("div");
                actions.className = "review-actions";

                const editButton = document.createElement("button");
                editButton.type = "button";
                editButton.className = "review-edit-btn";
                editButton.textContent = "✏️ Edit";

                editButton.addEventListener("click", () => {
                    if (
                        !currentUser ||
                        currentUser.uid !== review.uid
                    ) {
                        alert("Sirf apna review edit kar sakte hain.");
                        return;
                    }

                    reviewName.value = review.name || "";
                    reviewFeedback.value = review.feedback || "";
                    editingReviewId = review.id;

                    setRating(Number(review.rating) || 0);

                    reviewFormTitle.textContent = "Edit Your Review";
                    reviewSubmit.textContent = "Update Review";
                    reviewCancel.hidden = false;

                    // Name is tied to the signed-in account.
                    reviewName.readOnly = true;

                    reviewForm.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                });

               
const deleteButton = document.createElement("button");
deleteButton.type = "button";
deleteButton.className = "review-delete-btn";
deleteButton.textContent = "🗑️ Delete";

deleteButton.addEventListener("click", async () => {
    if (!currentUser) {
        alert("Please sign in to delete your review.");
        return;
    }

    if (currentUser.uid !== review.uid) {
        alert("Aap sirf apna review delete kar sakte hain.");
        return;
    }

    const confirmed = confirm(
        "Kya aap apna review delete karna chahte hain?"
    );

    if (!confirmed) return;

    deleteButton.disabled = true;
    deleteButton.textContent = "Deleting...";

    try {
        const reviewRef = db.collection("reviews").doc(review.id);

        // Verify the review still exists and belongs to this user.
        const reviewDoc = await reviewRef.get();

        if (!reviewDoc.exists) {
            alert("Ye review pehle hi delete ho chuka hai.");
            return;
        }

        if (reviewDoc.data().uid !== currentUser.uid) {
            alert("Aap sirf apna review delete kar sakte hain.");
            return;
        }

        await reviewRef.delete();

        if (editingReviewId === review.id) {
            resetReviewForm();
        }

        alert("Review successfully deleted!");
    } catch (error) {
        console.error("Review delete failed:", error);

        if (error.code === "permission-denied") {
            alert(
                "Delete permission nahi hai. Firebase Firestore Rules check karein."
            );
        } else {
            alert(
                "Review delete nahi hua. Internet connection aur Firebase login check karein."
            );
        }
    } finally {
        deleteButton.disabled = false;
        deleteButton.textContent = "🗑️ Delete";
    }
});


                actions.append(editButton, deleteButton);
                card.appendChild(actions);
            }

            reviewsList.appendChild(card);
        });
    }

    // =====================================
    // 9. SUBMIT AND EDIT REVIEW
    // =====================================

    reviewForm.addEventListener("submit", async event => {
        event.preventDefault();

        if (reviewRequestInProgress) return;

        if (!currentUser) {
            if (confirm("You must sign in to submit a review. Go to the sign-in page?")) {
    window.location.href = "sign-in.html";
}
return;
        }

        if (!currentReviewService) {
            alert("Please select a service first.");
            return;
        }

        if (!reviewForm.reportValidity()) return;

        const feedback = reviewFeedback.value.trim();

        if (!feedback) {
            alert("Please enter your feedback.");
            return;
        }

        if (selectedRating < 1 || selectedRating > 5) {
            alert("Please select a star rating.");
            return;
        }

        reviewRequestInProgress = true;
        reviewSubmit.disabled = true;

        try {
            if (editingReviewId !== null) {
                const reviewRef = db.collection("reviews")
                    .doc(editingReviewId);

                const reviewDoc = await reviewRef.get();

                if (!reviewDoc.exists) {
                    alert("Review nahi mila. Please dobara try karein.");
                    resetReviewForm();
                    return;
                }

                const existingReview = reviewDoc.data();

                if (existingReview.uid !== currentUser.uid) {
                    alert("Aap sirf apna review edit kar sakte hain.");
                    resetReviewForm();
                    return;
                }

                await reviewRef.update({
                    rating: selectedRating,
                    feedback: feedback,
                    date: new Date().toLocaleDateString()
                });
            } else {
                await db.collection("reviews").add({
                    serviceName: currentReviewService,
                    uid: currentUser.uid,
                    name: currentUser.displayName ||
                        currentUser.email ||
                        "User",
                    rating: selectedRating,
                    feedback: feedback,
                    date: new Date().toLocaleDateString(),
                    createdAt:
                        firebase.firestore.FieldValue.serverTimestamp()
                });
            }

            resetReviewForm();
            alert("Review successfully saved!");
        } catch (error) {
            console.error("Review save failed:", error);
            alert(
                "Review save nahi hua. Firestore Rules aur connection check karein."
            );
        } finally {
            reviewRequestInProgress = false;
            reviewSubmit.disabled = false;
        }
    });

    // =====================================
    // 10. AUTH STATE + INITIALIZE
    // =====================================

    auth.onAuthStateChanged(user => {
        currentUser = user;

        // If the current form is editing a review, reset it on
        // account changes to prevent stale edit state.
        if (!user && editingReviewId !== null) {
            resetReviewForm();
        }

        renderReviews();
    });


loadAdminServicesFromSupabase();
renderReviews();

// Shared service links are opened after Supabase services finish loading.

})();


