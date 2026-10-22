(() => {
    "use strict";

    // =====================================
    // 1. SERVICES DATA
    // =====================================

    const shopServices = [
        {
            name: "SEO Optimization",
            category: "SEO",
            icon: "fa-chart-line",
            description: "Improve search engine rankings, optimize website content, and help potential customers discover your business.",
            keywords: "google ranking search keywords organic traffic"
        },
        {
            name: "Social Media Marketing",
            category: "Social Media",
            icon: "fa-hashtag",
            description: "Build your brand, plan engaging content, and grow your audience across social media platforms.",
            keywords: "instagram facebook content followers"
        },
        {
            name: "Website Development",
            category: "Web Development",
            icon: "fa-code",
            description: "Create a professional, responsive website designed to showcase your business and convert visitors.",
            keywords: "website web design development business"
        },
        {
            name: "Google Ads",
            category: "Advertising",
            icon: "fa-bullhorn",
            description: "Reach relevant audiences with targeted advertising campaigns and track campaign performance.",
            keywords: "paid ads ppc google advertising"
        },
        {
            name: "Content Marketing",
            category: "Social Media",
            icon: "fa-pen-nib",
            description: "Plan useful, engaging content that communicates your brand message and attracts your target audience.",
            keywords: "writing blogs posts content creation"
        },
        {
            name: "Digital Marketing Strategy",
            category: "Advertising",
            icon: "fa-lightbulb",
            description: "Build a digital marketing plan around your business goals, audience, and available budget.",
            keywords: "online marketing strategy business growth"
        }
    ];

    // =====================================
    // 2. GET HTML ELEMENTS
    // =====================================

    const $ = id => document.getElementById(id);

    const shopGrid = $("shopGrid");
    const shopSearch = $("shopSearch");
    const shopSearchBtn = $("shopSearchBtn");
    const shopFilters = document.querySelectorAll(".shop-filter");

    const serviceModal = $("serviceModal");
    const modalClose = $("modalClose");
    const modalCategory = $("modalCategory");
    const modalTitle = $("modalTitle");
    const modalDescription = $("modalDescription");
    const modalContactBtn = $("modalContactBtn");

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

            const icon = document.createElement("i");
            icon.className = "fa-solid " + service.icon;
            icon.setAttribute("aria-hidden", "true");
            top.appendChild(icon);

            const body = document.createElement("div");
            body.className = "shop-card-body";

            const category = document.createElement("span");
            category.className = "shop-card-category";
            category.textContent = service.category;

            const title = document.createElement("h3");
            title.textContent = service.name;

            const description = document.createElement("p");
            description.textContent = service.description;

            const detailsBtn = document.createElement("button");
            detailsBtn.type = "button";
            detailsBtn.className = "view-details-btn";
            detailsBtn.textContent = "View Details →";

            detailsBtn.addEventListener("click", () => {
                modalCategory.textContent = service.category;
                modalTitle.textContent = service.name;
                modalDescription.textContent = service.description;

                const params = new URLSearchParams({
                    service: service.name,
                    category: service.category,
                    description: service.description
                });

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
    const params = new URLSearchParams({
        service: service.name,
        category: service.category,
        description: service.description
    });

    const shareURL =
        new URL("contact.html", window.location.href).href +
        "?" + params.toString();

    const shareText =
        service.name + "\n\n" +
        service.description + "\n\n" +
        "Explore this service at DigitalMAFA:\n" +
        shareURL;

    try {
        if (navigator.share) {
            await navigator.share({
                title: service.name + " | DigitalMAFA",
                text: service.description,
                url: shareURL
            });
        } else if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(shareText);
            alert("Service details and link copied successfully!");
        } else {
            window.prompt("Copy this service link and share it:", shareText);
        }
    } catch (error) {
        if (error.name !== "AbortError") {
            console.error("Unable to share service:", error);
            alert("Unable to share right now. Please try again.");
        }
    }
});

body.append(category, title, description, detailsBtn, shareBtn);

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
                    if (
                        !currentUser ||
                        currentUser.uid !== review.uid
                    ) {
                        alert("Sirf apna review delete kar sakte hain.");
                        return;
                    }

                    if (!confirm(
                        "Are you sure you want to delete this review?"
                    )) {
                        return;
                    }

                    try {
                        await db.collection("reviews")
                            .doc(review.id)
                            .delete();

                        if (editingReviewId === review.id) {
                            resetReviewForm();
                        }
                    } catch (error) {
                        console.error("Delete failed:", error);
                        alert(
                            "Review delete nahi hua. Firestore Rules check karein."
                        );
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

    renderShop();
    renderReviews();

})();
