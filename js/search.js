
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

const shopGrid = document.getElementById("shopGrid");
const shopSearch = document.getElementById("shopSearch");
const shopSearchBtn = document.getElementById("shopSearchBtn");
const shopFilters = document.querySelectorAll(".shop-filter");

const serviceModal = document.getElementById("serviceModal");
const modalClose = document.getElementById("modalClose");
const modalCategory = document.getElementById("modalCategory");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalContactBtn = document.getElementById("modalContactBtn");

let activeShopCategory = "All";

// Display service cards
function renderShop() {
    const query = shopSearch.value.trim().toLowerCase();

    const filtered = shopServices.filter(service => {
        const categoryMatch =
            activeShopCategory === "All" ||
            service.category === activeShopCategory;

        const text = (
            service.name + " " +
            service.category + " " +
            service.description + " " +
            service.keywords
        ).toLowerCase();

        return categoryMatch && text.includes(query);
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
        detailsBtn.className = "view-details-btn";
        detailsBtn.type = "button";
        detailsBtn.textContent = "View Details →";

        // Open details and prepare Contact Now link
        detailsBtn.addEventListener("click", () => {
            modalCategory.textContent = service.category;
            modalTitle.textContent = service.name;
            modalDescription.textContent = service.description;

            const contactParams = new URLSearchParams({
                service: service.name,
                category: service.category,
                description: service.description
            });

            // Change contact.html if your page has another filename
            modalContactBtn.href =
                "contact.html?" + contactParams.toString();

            serviceModal.classList.add("show");
        });

        body.append(category, title, description, detailsBtn);
        card.append(top, body);
        shopGrid.appendChild(card);
    });
}

// Search
shopSearch.addEventListener("input", renderShop);
shopSearchBtn.addEventListener("click", renderShop);

shopSearch.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        renderShop();
    }
});

// Category filters
shopFilters.forEach(button => {
    button.addEventListener("click", () => {
        activeShopCategory = button.dataset.category;

        shopFilters.forEach(filter => {
            filter.classList.toggle("active", filter === button);
        });

        renderShop();
    });
});

// Close details popup
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
    }
});

// Initial display
renderShop();
