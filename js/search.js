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

    // Open shared service only after Supabase services are loaded
    openSharedServicePopup();
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

// Show Delivery Days
const deliveryDays = document.createElement("p");
deliveryDays.className = "shop-card-delivery";
deliveryDays.textContent =
    service.delivery_days != null && service.delivery_days !== ""
        ? "Delivery: " + service.delivery_days + " Days"
        : "Delivery time not specified";

// Show Note
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

// Show service features
const featuresList = document.createElement("ul");
featuresList.className = "shop-card-features";

(service.features || []).forEach(feature => {
    const item = document.createElement("li");
    item.textContent = feature;
    featuresList.appendChild(item);
});

const detailsBtn = document.createElement("button");

            detailsBtn.type = "button";
            detailsBtn.className = "view-details-btn";
            detailsBtn.textContent = "View Details →";

            detailsBtn.addEventListener("click", () => {
                modalCategory.textContent = service.category;
                modalTitle.textContent = service.name;
                const existingDelivery = document.getElementById("modalDelivery");
if (existingDelivery) existingDelivery.remove();

if (service.delivery_days != null && service.delivery_days !== "") {
    const modalDelivery = document.createElement("p");
    modalDelivery.id = "modalDelivery";
    modalDelivery.className = "shop-card-delivery";
    modalDelivery.textContent =
        "Delivery: " + service.delivery_days + " Days";

    modalDescription.insertAdjacentElement(
        "afterend",
        modalDelivery
    );
}
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
                serviceModal.classList.add("show");
            });

            
const shareBtn = document.createElement("button");
shareBtn.type = "button";

shareBtn.className = "share-service-btn";
shareBtn.innerHTML = '<i class="fa-solid fa-share-nodes" aria-hidden="true"></i>';

shareBtn.setAttribute("aria-label", "Share " + service.name);



shareBtn.addEventListener("click", async () => {

    // Short URL: only service name
    const params = new URLSearchParams({
        service: service.name
    });

    const shareURL =
        new URL("search.html", window.location.href).href +
        "?" + params.toString();

    // Share title instead of description
    const shareText =
        service.name + "\n\n" +
        shareURL;

    try {

        // Android app sharing
        if (
            window.AndroidShare &&
            typeof window.AndroidShare.share === "function"
        ) {
            window.AndroidShare.share(
                service.name + " | DigitalMAFA",
                service.name,
                shareURL
            );
            return;
        }

        // Desktop app sharing
        if (
            window.DesktopShare &&
            typeof window.DesktopShare.share === "function"
        ) {
            window.DesktopShare.share(
                service.name + " | DigitalMAFA",
                service.name,
                shareURL
            );
            return;
        }

        // Mobile browser sharing
        if (navigator.share) {
            await navigator.share({
                title: service.name + " | DigitalMAFA",
                text: service.name,
                url: shareURL
            });

        } else if (
            navigator.clipboard &&
            window.isSecureContext
        ) {
            await navigator.clipboard.writeText(shareText);
            alert("Service title and link copied successfully!");

        } else {
            window.prompt(
                "Copy this service link:",
                shareText
            );
        }

    } catch (error) {
        if (error.name !== "AbortError") {
            console.error("Unable to share service:", error);
            alert("Unable to share right now. Please try again.");
        }
    }
});



body.append(
    category,
    title,
    description,
    deliveryDays,
    ...(service.note ? [note] : []),
    price,
    featuresList,
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

// Open the service popup when someone visits a shared link.
const sharedParams = new URLSearchParams(window.location.search);
const sharedServiceName = sharedParams.get("service");


function openSharedServicePopup() {
    const sharedParams = new URLSearchParams(window.location.search);
    const sharedServiceName = sharedParams.get("service");

    if (!sharedServiceName) return;

    const matchedService = shopServices.find(
        service =>
            service.name.trim().toLowerCase() ===
            sharedServiceName.trim().toLowerCase()
    );

    if (!matchedService) {
        console.warn("Shared service not found:", sharedServiceName);
        return;
    }

    shopSearch.value = "";
    activeShopCategory = "All";

    shopFilters.forEach(filter => {
        filter.classList.toggle(
            "active",
            filter.dataset.category === "All"
        );
    });

    renderShop();

    modalCategory.textContent = matchedService.category;
    modalTitle.textContent = matchedService.name;
    modalDescription.textContent = matchedService.description;

    const oldNote = document.getElementById("modalNote");
    if (oldNote) oldNote.remove();

    if (matchedService.note) {
        const note = document.createElement("p");
        note.id = "modalNote";
        note.className = "shop-card-note";
        note.textContent = "Note: " + matchedService.note;
        modalDescription.insertAdjacentElement("afterend", note);
    }

    const oldDelivery = document.getElementById("modalDelivery");
    if (oldDelivery) oldDelivery.remove();

    if (matchedService.delivery_days != null &&
        matchedService.delivery_days !== "") {
        const delivery = document.createElement("p");
        delivery.id = "modalDelivery";
        delivery.className = "shop-card-delivery";
        delivery.textContent =
            "Delivery: " + matchedService.delivery_days + " Days";

        modalDescription.insertAdjacentElement("afterend", delivery);
    }

    modalPrice.textContent = matchedService.price
        ? "Price: " + matchedService.price
        : "Price: Contact for pricing";

    modalFeatures.replaceChildren();

    (matchedService.features || []).forEach(feature => {
        const item = document.createElement("li");
        item.textContent = feature;
        modalFeatures.appendChild(item);
    });

    const params = new URLSearchParams({
        service: matchedService.name,
        category: matchedService.category,
        description: matchedService.description
    });

    modalContactBtn.href = "contact.html?" + params.toString();

    setCurrentReviewService(matchedService.name);
    serviceModal.classList.add("show");
}


})();


