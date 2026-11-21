const SUPABASE = window.supabaseClient;
const ADMIN_USER_ID = "69826f4a-5084-48b4-ad2b-259ff5ce96a6";
const CLOUD_NAME = "ey559uiw";
const UPLOAD_PRESET = "digitalmafa_upload";

const loginSection = document.getElementById("loginSection");
const adminSection = document.getElementById("adminSection");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const logoutBtn = document.getElementById("logoutBtn");
const form = document.getElementById("serviceForm");
const imageInput = document.getElementById("image");
const preview = document.getElementById("preview");
const message = document.getElementById("message");
const serviceList = document.getElementById("serviceList");
const submitButton = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

let services = [];
let editingId = null;
let editingImage = "";

if (!SUPABASE) {
    loginMessage.textContent = "Supabase did not initialize. Check supabase-config.js and script order.";
    throw new Error("Supabase client is missing.");
}

function showLogin(messageText = "") {
    loginSection.hidden = false;
    adminSection.hidden = true;
    logoutBtn.hidden = true;
    loginMessage.textContent = messageText;
}

function showAdmin() {
    loginSection.hidden = true;
    adminSection.hidden = false;
    logoutBtn.hidden = false;
}

async function checkSession() {
    const { data, error } = await SUPABASE.auth.getSession();
    if (error) {
        showLogin("Could not check login: " + error.message);
        return;
    }
    const user = data.session?.user;
    if (!user) {
        showLogin();
        return;
    }
    if (user.id !== ADMIN_USER_ID) {
        await SUPABASE.auth.signOut();
        showLogin("This account is not authorized as the DigitalMAFA admin.");
        return;
    }
    showAdmin();
    await loadServices();
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = document.getElementById("loginBtn");
    button.disabled = true;
    loginMessage.textContent = "Signing in...";
    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;
    try {
        const { data, error } = await SUPABASE.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user?.id !== ADMIN_USER_ID) {
            await SUPABASE.auth.signOut();
            throw new Error("This account is not authorized as the DigitalMAFA admin.");
        }
        loginForm.reset();
        showAdmin();
        await loadServices();
    } catch (error) {
        loginMessage.textContent = error.message;
    } finally {
        button.disabled = false;
    }
});

logoutBtn.addEventListener("click", async () => {
    const { error } = await SUPABASE.auth.signOut();
    if (error) {
        alert("Logout failed: " + error.message);
        return;
    }
    services = [];
    showLogin("You have been logged out.");
});

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
    } else if (editingImage) {
        preview.src = editingImage;
        preview.style.display = "block";
    }
});

async function migrateLegacyLocalServices() {
    // Preserve services previously saved in this browser's Local Storage.
    const legacy = JSON.parse(localStorage.getItem("digitalmafaServices") || "[]");
    if (!Array.isArray(legacy) || legacy.length === 0) return;
    const rows = legacy.map(service => ({
        id: service.id || crypto.randomUUID(),
        name: service.name || "Untitled service",
        category: service.category || "Other",
        description: service.description || "",
        price: service.price || "",
        features: Array.isArray(service.features) ? service.features : [],
        keywords: Array.isArray(service.keywords) ? service.keywords : [],
        image: service.image || "",
        published: service.published === true,
        created_at: service.createdAt || new Date().toISOString()
    }));
    const { error } = await SUPABASE.from("services").upsert(rows, {
        onConflict: "id",
        ignoreDuplicates: true
    });
    if (error) {
        console.error("Legacy service migration did not complete:", error);
        return;
    }
    localStorage.removeItem("digitalmafaServices");
}

async function loadServices() {
    serviceList.textContent = "Loading services...";
    await migrateLegacyLocalServices();
    const { data, error } = await SUPABASE
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });
    if (error) {
        serviceList.textContent = "Could not load services: " + error.message;
        console.error(error);
        return;
    }
    services = data || [];
    showServices();
}

function showServices() {
    serviceList.innerHTML = "";
    if (!services.length) {
        serviceList.textContent = "No services added yet.";
        return;
    }
    services.forEach((service) => {
        const card = document.createElement("div");
        card.className = "service";
        const img = document.createElement("img");
        img.src = service.image || "";
        img.alt = service.name || "Service image";
        const info = document.createElement("div");
        info.className = "service-info";
        const title = document.createElement("b");
        title.textContent = service.name;
        const details = document.createElement("p");
        details.textContent = `${service.category} | ${service.price || "Price on request"}`;
        const status = document.createElement("p");
        status.textContent = service.published ? "Published" : "Draft";

        const edit = document.createElement("button");
        edit.textContent = "Edit";
        edit.addEventListener("click", () => startEdit(service));

        const toggle = document.createElement("button");
        toggle.className = "status-btn";
        toggle.textContent = service.published ? "Unpublish" : "Publish";
        toggle.addEventListener("click", async () => {
            const { error } = await SUPABASE.from("services")
                .update({ published: !service.published })
                .eq("id", service.id);
            if (error) return alert("Could not update publish status: " + error.message);
            await loadServices();
        });

        const remove = document.createElement("button");
        remove.className = "delete-btn";
        remove.textContent = "Delete";
        remove.addEventListener("click", async () => {
            if (!confirm("Delete this service? This cannot be undone.")) return;
            const { error } = await SUPABASE.from("services").delete().eq("id", service.id);
            if (error) return alert("Could not delete service: " + error.message);
            await loadServices();
        });
        info.append(title, details, note, delivery, status, edit, toggle, remove);
        card.append(img, info);
        serviceList.appendChild(card);
    });
}

function startEdit(service) {
    editingId = service.id;
    editingImage = service.image || "";
    document.getElementById("name").value = service.name || "";
    document.getElementById("category").value = service.category || "";
    document.getElementById("description").value = service.description || "";
    document.getElementById("price").value = service.price || "";
    document.getElementById("features").value = (service.features || []).join("\n");
    document.getElementById("keywords").value = (service.keywords || []).join(", ");
    preview.src = editingImage;
    preview.style.display = editingImage ? "block" : "none";
    submitButton.textContent = "Save Changes";
    cancelEditBtn.hidden = false;
    message.textContent = "Editing: " + service.name;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetEditor() {
    editingId = null;
    editingImage = "";
    form.reset();
    preview.removeAttribute("src");
    preview.style.display = "none";
    submitButton.textContent = "Upload Service";
    cancelEditBtn.hidden = true;
    message.textContent = "";
}

cancelEditBtn.addEventListener("click", resetEditor);

async function uploadImage(file) {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    data.append("folder", "digitalmafa/services");
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: data
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error?.message || "Cloudinary upload failed");
    return result.secure_url;
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const file = imageInput.files[0];
    if (!editingId && !file) {
        message.textContent = "Please select an image.";
        return;
    }
    if (file && !file.type.startsWith("image/")) {
        message.textContent = "Please select an image file.";
        return;
    }
    if (file && file.size > 10 * 1024 * 1024) {
        message.textContent = "Image must be under 10 MB.";
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = file ? "Uploading..." : "Saving...";
    message.textContent = "";
    try {
        const imageUrl = file ? await uploadImage(file) : editingImage;
        const service = {
            name: document.getElementById("name").value.trim(),
            category: document.getElementById("category").value,
            description: document.getElementById("description").value.trim(),
            price: document.getElementById("price").value.trim(),
            features: document.getElementById("features").value.split("\n").map(x => x.trim()).filter(Boolean),
            keywords: document.getElementById("keywords").value.split(",").map(x => x.trim()).filter(Boolean),
            image: imageUrl
        };
        let result;
        if (editingId) {
            result = await SUPABASE.from("services").update(service).eq("id", editingId);
        } else {
            result = await SUPABASE.from("services").insert({
                id: crypto.randomUUID(),
                ...service,
                published: false
            });
        }
        if (result.error) throw result.error;
        resetEditor();
        message.textContent = editingId ? "Service updated successfully." : "Service saved as draft. Click Publish to show it publicly.";
        await loadServices();
        // loadServices changes service list only; preserve the confirmation text.
        message.textContent = "Service saved successfully. Use Publish to make it visible on search.html.";
    } catch (error) {
        console.error(error);
        message.textContent = "Error: " + error.message;
    } finally {
        submitButton.disabled = false;
        if (!editingId) submitButton.textContent = "Upload Service";
    }
});

checkSession();
