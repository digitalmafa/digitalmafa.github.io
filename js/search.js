(() => {
    "use strict";

    // =====================================
    // 1. SERVICES DATA
    // =====================================

    const shopServices = [
       {
    name: "SEO Optimization",
    category: "SEO",
    image: "images/seo optimization.png",
    description: "Improve your website's search engine visibility with SEO strategies focused on keyword optimization, on-page improvements, and organic traffic growth.",
    price: "₹499 onwards",
    features: [
        "Website SEO analysis",
        "Keyword optimization",
        "On-page SEO improvements",
        "Meta title and description optimization",
        "Search engine visibility improvement"
    ],
   keywords: [
    "SEO Optimization",
    "Search Engine Optimization",
    "Website SEO",
    "Keyword Research",
    "On-Page SEO",
    "Technical SEO",
    "Organic Traffic Growth",
    "Google Search Ranking",
    "Website SEO Audit",
    "SEO Services"
]
},
      {
    name: "Social Media Marketing",
    category: "Social Media",
    image: "images/Social Media Marketing.png",
    description: "Grow your brand's online presence through strategic social media campaigns, audience engagement, and consistent brand communication.",
    price: "₹999 onwards",
    features: [
        "Social media marketing strategy",
        "Audience targeting",
        "Brand awareness improvement",
        "Engagement growth",
        "Campaign performance monitoring"
    ],
    keywords: [
    "Social Media Marketing",
    "Social Media Management",
    "Facebook Marketing",
    "Instagram Marketing",
    "Social Media Promotion",
    "Brand Awareness",
    "Audience Engagement",
    "Social Media Strategy",
    "Digital Marketing",
    "Social Media Campaigns"
]
},

{
    name: "On-Page SEO Optimization",
    category: "SEO",
    image: "images/on-page-seo.png",
    description: "We improve website page elements to make your content easier for search engines and visitors to understand.",
    price: "₹999 onwards",
    features: [
        "SEO title optimization",
        "Meta description improvement",
        "Heading structure review (H1, H2, H3)",
        "Keyword placement recommendations",
        "Image alt text suggestions",
        "Internal linking recommendations",
        "Optimization for up to 5 pages"
    ],
    keywords: [
    "On-Page SEO Optimization",
    "On-Page SEO Services",
    "Website Content Optimization",
    "Meta Title Optimization",
    "Meta Description Optimization",
    "Keyword Placement",
    "Header Tag Optimization",
    "Internal Linking",
    "Image Alt Text Optimization",
    "SEO-Friendly URLs"
]
},

{
    name: "Technical SEO Management",
    category: "SEO",
    image: "images/technical-seo.png",
    description: "We identify technical issues that may affect your website's crawling, indexing and search performance.",
    price: "₹2,499 onwards",
    features: [
        "Website technical SEO audit",
        "Broken links and crawlability checks",
        "XML sitemap and robots.txt review",
        "Indexing issue identification",
        "Mobile usability and page speed checks",
        "Prioritized technical improvement report"
    ],
    keywords: [
    "Technical SEO Management",
    "Technical SEO Services",
    "Website Technical Audit",
    "Website Crawlability",
    "Website Indexing",
    "XML Sitemap Optimization",
    "Robots.txt Optimization",
    "Core Web Vitals",
    "Website Speed Optimization",
    "Structured Data Optimization"
]},

{
    name: "High-Quality Backlink Building",
    category: "SEO",
    image: "images/backlink-building.png",
    description: "We help improve your website's backlink profile through relevant link-building opportunities.",
    price: "₹999 onwards",
    features: [
        "Up to 150 backlink opportunities or placements, depending on availability",
        "Research for relevant websites and link sources",
        "Focus on relevance and link quality rather than quantity alone",
        "Delivery report with available backlink details",
        "No guaranteed rankings or fixed SEO results"
    ],
keywords: [
    "High-Quality Backlink Building",
    "Backlink Building Services",
    "Quality Link Building",
    "White-Hat Link Building",
    "SEO Link Building",
    "Website Authority Building",
    "High-Authority Backlinks",
    "Relevant Website Backlinks",
    "Off-Page SEO",
    "Link Profile Analysis"
]},

{
    name: "Competitor SEO Analysis",
    category: "SEO",
    image: "images/Competitor SEO Analysis Infographic.png",
    description: "We analyze competitor websites to identify their visible SEO strategies and potential opportunities for your business.",
    price: "₹999 onwards",
    features: [
        "Analysis of up to 3 competitor websites",
        "Competitor content and page structure review",
        "Keyword opportunity comparison",
        "Backlink profile observations where data is available",
        "Content gap identification",
        "Actionable recommendations to improve your website"
    ],
keywords: [
    "Competitor SEO Analysis",
    "SEO Competitor Analysis",
    "Competitor Keyword Research",
    "Competitor Backlink Analysis",
    "SEO Competitor Audit",
    "Competitor Ranking Analysis",
    "Keyword Gap Analysis",
    "Competitor Website Analysis",
    "SERP Competitor Research",
    "SEO Competitive Analysis"
]},

{
    name: "Local SEO Optimization",
    category: "SEO",
    image: "images/Local SEO Optimization Banner.png",
    description: "We help eligible local businesses improve their visibility in location-based searches.",
    price: "₹999 onwards",
    features: [
        "Local keyword research",
        "Business information consistency review",
        "Google Business Profile optimization guidance",
        "Local landing-page recommendations",
        "Local search visibility checklist",
        "Recommendations for improving local discovery"
    ],
keywords: [
    "Local SEO Optimization",
    "Local SEO Services",
    "Google Business Profile Optimization",
    "Local Search Ranking",
    "Local Keyword Research",
    "Google Maps SEO",
    "Local Business Listings",
    "NAP Consistency",
    "Local Citation Building",
    "Near Me SEO"
]},

{
    name: "SEO Blog Writing",
    category: "SEO",
    image: "images/SEO Blog Writing Service Infographic.png",
    description: "We create useful, search-focused blog content based on your business and target audience.",
    price: "₹799 onwards",
    features: [
        "One original article up to 1,000 words",
        "SEO-friendly title and heading structure",
        "Relevant keyword integration",
        "Meta description suggestion",
        "Readable paragraphs and content formatting",
        "One revision round"
    ],
keywords: [
    "SEO Blog Writing",
    "SEO Content Writing",
    "Blog Writing Services",
    "SEO-Friendly Blog Posts",
    "Keyword-Optimized Content",
    "Website Blog Content",
    "Blog Content Strategy",
    "Organic Traffic Growth",
    "Content Optimization",
    "Search Engine Friendly Articles"
]},

{
    name: "Website Content Optimization",
    category: "Web Development",
    image: "images/Website Content Optimization Infographic.png",
    description: "We review existing website content and suggest improvements to make it clearer, more engaging and more relevant.",
    price: "₹999 onwards",
    features: [
        "Review of up to 5 website pages",
        "Grammar, spelling and readability suggestions",
        "Content structure improvement",
        "Keyword relevance review",
        "Call-to-action improvement suggestions",
        "Updated content recommendations"
    ],
keywords: [
    "Website Content Optimization",
    "Website Content Writing",
    "SEO Content Optimization",
    "Keyword Optimization",
    "Website Copywriting",
    "Content Readability",
    "SEO-Friendly Content",
    "Meta Title Optimization",
    "Meta Description Optimization",
    "Website Content Audit"
]},

{
    name: "Google Search Console Setup",
    category: "SEO",
    image: "images/Google Search Console Setup Guide.png",
    description: "We help connect your website to Google Search Console and review its search performance.",
    price: "₹799 onwards",
    features: [
        "Website ownership verification assistance",
        "XML sitemap submission guidance",
        "Indexing status review",
        "Search clicks and impressions analysis",
        "Top search queries and pages review",
        "Basic search performance report"
    ],
keywords: [
    "Google Search Console Setup",
    "Google Search Console Services",
    "Google Search Console Configuration",
    "Website Verification",
    "Search Console Integration",
    "Website Indexing Setup",
    "Sitemap Submission",
    "Indexing Issues Monitoring",
    "Search Performance Tracking",
    "Google Search Visibility"
]},

{
    name: "Google Analytics Setup",
    category: "SEO",
    image: "images/Google Analytics Setup Dashboard Infographic.png",
    description: "We help you understand how visitors reach and interact with your website.",
    price: "₹999 onwards",
    features: [
        "Google Analytics 4 setup or review",
        "Website tracking configuration assistance",
        "Traffic source analysis",
        "User engagement overview",
        "Basic event tracking for agreed actions, where supported",
        "Initial analytics testing and report"
    ],
keywords: [
    "Google Analytics Setup",
    "Google Analytics 4 Setup",
    "GA4 Configuration",
    "Website Analytics Integration",
    "Google Analytics Tracking",
    "Website Traffic Analysis",
    "User Behavior Tracking",
    "Conversion Tracking Setup",
    "Google Analytics Reporting",
    "Website Performance Monitoring"
]},


{
    name: "Landing Page Design",
    category: "Web Development",
    image: "images/Landing Page Design Showcase.png",
    description: "We design a focused landing page to present your offer and encourage visitors to take action.",
    price: "₹1,999 onwards",
    features: [
        "Custom layout for one landing page",
        "Attractive headline and service sections",
        "Benefits and features presentation",
        "Call-to-action placement",
        "Mobile-friendly design planning",
        "Up to 2 design revision rounds"
    ],
keywords: [
    "Landing Page Design",
    "Landing Page Development",
    "Responsive Landing Page",
    "Business Landing Page",
    "Lead Generation Landing Page",
    "Conversion-Focused Design",
    "Website UI Design",
    "Mobile-Friendly Landing Page",
    "Landing Page Optimization",
    "Custom Landing Page Design"
]},

{
    name: "Website UI/UX Improvement",
    category: "Web Development",
    image: "images/Website UI_UX Improvement Banner.png",
    description: "We review your website's design and user journey to identify opportunities for a better browsing experience.",
    price: "₹1,499 onwards",
    features: [
        "Review of up to 3 website pages",
        "Navigation and layout evaluation",
        "Mobile responsiveness review",
        "Readability and visual hierarchy suggestions",
        "Button and call-to-action improvement ideas",
        "Prioritized UI/UX improvement report"
    ],
keywords: [
    "Website UI UX Improvement",
    "UI UX Design Services",
    "Website User Experience",
    "Website Interface Design",
    "User-Friendly Website Design",
    "Website Usability Improvement",
    "Responsive UI Design",
    "Website Navigation Optimization",
    "Website Layout Improvement",
    "Conversion Rate Optimization"
]},


{
    name: "Social Media Content Management",
    category: "Social Media",
    image: "images/Social Media Content Management Strategy.png",
    description: "We help businesses plan consistent social media content for their target audience.",
    price: "₹1,999 onwards",
    features: [
        "7-day content calendar",
        "Up to 7 post topics and captions",
        "Content ideas based on your business",
        "Suggested posting schedule",
        "Brand tone and messaging guidance",
        "Platform-specific content recommendations"
    ],
keywords: [
    "Social Media Content Management",
    "Social Media Management Services",
    "Social Media Content Planning",
    "Content Calendar Management",
    "Facebook Content Management",
    "Instagram Content Management",
    "Social Media Post Scheduling",
    "Brand Content Strategy",
    "Audience Engagement",
    "Social Media Marketing"
]},

{
    name: "Social Media Post Design",
    category: "Social Media",
    image: "images/Social Media Post Design Services.png",
    description: "We create branded graphics to help communicate your business message professionally.",
    price: "₹699 onwards",
    features: [
        "3 custom static post designs",
        "Brand colors and logo integration",
        "Promotional or informative post layouts",
        "Platform-appropriate dimensions",
        "High-quality digital files",
        "One revision round"
    ],
keywords: [
    "Social Media Post Design",
    "Social Media Graphic Design",
    "Instagram Post Design",
    "Facebook Post Design",
    "Custom Social Media Graphics",
    "Creative Post Design",
    "Branded Social Media Posts",
    "Promotional Post Design",
    "Social Media Banner Design",
    "Business Social Media Design"
]},

{
    name: "Google Ads Copywriting",
    category: "Advertising",
    image: "images/Google Ads Copywriting Service Infographic.png",
    description: "We prepare advertising copy designed around your product, audience and campaign objective.",
    price: "₹599 onwards",
    features: [
        "Multiple headline variations",
        "Ad description writing",
        "Clear calls to action",
        "Benefit-focused messaging",
        "Suggested keyword themes",
        "Copy recommendations for one campaign",
        "Ad account management and advertising budget are not included"
    ],
keywords: [
    "Google Ads Copywriting",
    "Google Ads Copywriting Services",
    "PPC Ad Copywriting",
    "Google Search Ads",
    "High-Converting Ad Copy",
    "Google Ads Headlines",
    "Paid Search Advertising",
    "Ad Description Writing",
    "Pay Per Click Marketing",
    "Conversion-Focused Ad Copy"
]},

{
    name: "Email Marketing Template Design",
    category: "Advertising",
    image: "images/Email Marketing Template Design.png",
    description: "We create a branded email template for business announcements, promotions or newsletters.",
    price: "₹799 onwards",
    features: [
        "One custom email template",
        "Brand colors, logo and typography",
        "Clear headline and message structure",
        "Call-to-action button design",
        "Mobile-friendly layout recommendations",
        "One revision round"
    ],
keywords: [
    "Email Marketing Template Design",
    "Email Template Design Services",
    "Responsive Email Design",
    "Promotional Email Templates",
    "Newsletter Template Design",
    "Custom Email Templates",
    "Email Campaign Design",
    "HTML Email Templates",
    "Business Email Design",
    "Email Newsletter Design"
]},

{
    name: "Website Maintenance & Health Check",
    category: "Web Development",
    image: "images/Website Maintenance Health Check Infographic.png",
    description: "We review your website for common issues and provide a practical maintenance checklist.",
    price: "₹999 onwards",
    features: [
        "Broken link checks",
        "Page loading and usability review",
        "Missing content or page element checks",
        "Basic mobile display review",
        "Visible website issues report",
        "Prioritized maintenance recommendations"
    ],
keywords: [
    "Website Maintenance",
    "Website Health Check",
    "Website Maintenance Services",
    "Website Error Fixing",
    "Website Security Check",
    "Website Performance Optimization",
    "Website Bug Fixing",
    "Website Speed Check",
    "Website Technical Audit",
    "Website Troubleshooting"
]},

{
    name: "SEO & Website Performance Report",
    category: "SEO",
    image: "images/SEO Performance Report Infographic.png",
    description: "We turn available website data into a straightforward report that helps you understand performance and plan improvements.",
    price: "₹699 onwards",
    features: [
        "Website traffic overview, if analytics is available",
        "Search clicks and impressions, if Search Console is connected",
        "Top-performing pages and search queries",
        "Traffic source observations",
        "Important performance trends",
        "Recommended next steps for improvement"
    ],
keywords: [
    "SEO Performance Report",
    "Website Performance Report",
    "SEO Audit Report",
    "Website SEO Analysis",
    "Organic Traffic Analysis",
    "Google Search Performance",
    "Keyword Ranking Report",
    "Website Speed Analysis",
    "Technical SEO Report",
    "Website Analytics Report"
]},

        {
    name: "Basic Website Development",
    category: "Web Development",
    image: "images/Basic Website Development Banner.png",
    description: "Get a simple, professional website for your business with essential pages, a clean layout, and mobile-friendly design.",
    price: "₹2,999 onwards",
    features: [
    "Home, About, and Contact pages",
    "Mobile-friendly responsive design",
    "Modern and clean UI",
    "Contact form integration",
    "Basic on-page SEO setup",
    "Social media links integration",
    "Basic speed optimization"
],
    keywords: [
    "Basic Website Development",
    "Website Development Services",
    "Small Business Website",
    "Responsive Website Design",
    "Business Website Development",
    "Custom Website Design",
    "Mobile-Friendly Website",
    "Professional Website Design",
    "Website Design for Startups",
    "Affordable Website Development"
]
},
        {
    name: "Google Ads",
    category: "Advertising",
    image: "images/Google Ads Growth Campaign.png",
    description: "Reach potential customers through targeted Google Ads campaigns designed to increase website traffic, generate leads, and promote your business.",
    price: "₹999 onwards",
    features: [
        "Google Ads campaign setup",
        "Keyword research",
        "Audience targeting",
        "Ad copy optimization",
        "Campaign performance monitoring"
    ],
    keywords: [
    "Google Ads",
    "Google Ads Management",
    "Google Ads Services",
    "Google PPC Advertising",
    "Google Search Ads",
    "Pay Per Click Advertising",
    "Google Ads Campaign Setup",
    "Keyword Research for Google Ads",
    "Google Ads Optimization",
    "Google Ads Lead Generation"
]
},
{
    name: "Meta Ads",
    category: "Advertising",
    image: "images/Meta Ads_ Grow Your Business.png",
    description: "Promote your business on Facebook and Instagram with targeted Meta Ads campaigns designed to increase brand awareness, generate leads, and drive conversions.",
    price: "₹999",
    features: [
        "Meta Ads campaign setup",
        "Facebook and Instagram audience targeting",
        "Ad copy and creative recommendations",
        "Campaign optimization",
        "Performance monitoring and reporting"
    ],
    keywords: [
    "Meta Ads",
    "Meta Ads Management",
    "Facebook Ads",
    "Instagram Ads",
    "Meta Advertising Services",
    "Facebook Ads Campaign Setup",
    "Instagram Advertising",
    "Social Media Advertising",
    "Meta Ads Optimization",
    "Meta Ads Lead Generation"
]
},
       {
    name: "Content Marketing",
    category: "Social Media",
    image: "images/Content Marketing Growth Blueprint.png",
    description: "Build brand awareness and attract your target audience with valuable, engaging content designed to support your digital marketing goals.",
    price: "₹799",
    features: [
        "Content marketing strategy",
        "Target audience research",
        "Content topic planning",
        "Brand awareness improvement",
        "Content performance recommendations"
    ],
    keywords: [
    "Content Marketing",
    "Content Marketing Strategy",
    "Content Creation Services",
    "Content Marketing Services",
    "Brand Content Strategy",
    "Content Planning",
    "Audience Engagement",
    "Content Distribution",
    "Digital Content Marketing",
    "Content Marketing for Businesses"
]
},
       {
    name: "Digital Marketing Strategy",
    category: "Advertising",
    image: "images/Digital Marketing Strategy Blueprint.png",
    description: "Build a practical digital marketing strategy to strengthen your online presence, reach your target audience, and support business growth.",
    price: "₹1,499",
    features: [
        "Digital marketing plan",
        "Target audience research",
        "Marketing channel recommendations",
        "Campaign planning",
        "Performance tracking recommendations"
    ],
  keywords: [
    "Digital Marketing Strategy",
    "Digital Marketing Services",
    "Online Marketing Strategy",
    "Digital Marketing Plan",
    "Marketing Strategy Consulting",
    "Target Audience Research",
    "Marketing Channel Strategy",
    "Lead Generation Strategy",
    "Business Growth Strategy",
    "Digital Campaign Planning"
]
},
    ];

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
                modalDescription.textContent = service.description;
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
    const params = new URLSearchParams({
        service: service.name,
        category: service.category,
        description: service.description
    });

    const shareURL =
    new URL("search.html", window.location.href).href +
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

body.append(
    category,
    title,
    description,
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

// Open the service popup when someone visits a shared link.
const sharedParams = new URLSearchParams(window.location.search);
const sharedServiceName = sharedParams.get("service");

if (sharedServiceName) {
    const matchedService = shopServices.find(
        service => service.name.toLowerCase() === sharedServiceName.toLowerCase()
    );

    if (matchedService) {
        // Clear search and show all service cards.
        shopSearch.value = "";
        activeShopCategory = "All";

        shopFilters.forEach(filter => {
            filter.classList.toggle(
                "active",
                filter.dataset.category === "All"
            );
        });

        renderShop();

        // Fill and open the matching service popup.
        modalCategory.textContent = matchedService.category;
        modalTitle.textContent = matchedService.name;
        modalDescription.textContent = matchedService.description;

        // Show service price in shared-link popup
modalPrice.textContent = matchedService.price
    ? "Price: " + matchedService.price
    : "Price: Contact for pricing";

// Show service features in shared-link popup
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
}

})();


