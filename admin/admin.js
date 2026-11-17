
const CLOUD_NAME = "ey559uiw";
const UPLOAD_PRESET = "digitalmafa_upload";

const STORAGE_KEY = "digitalmafaServices";

const form = document.getElementById("serviceForm");
const imageInput = document.getElementById("image");
const preview = document.getElementById("preview");
const message = document.getElementById("message");
const serviceList = document.getElementById("serviceList");

let services = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
);

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];

    if (file) {
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
    }
});

function saveServices() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(services)
    );
}

function showServices() {
    serviceList.innerHTML = "";

    if (!services.length) {
        serviceList.textContent = "No services added yet.";
        return;
    }

    services.forEach(service => {

        const card = document.createElement("div");
        card.className = "service";

        const img = document.createElement("img");
        img.src = service.image;
        img.alt = service.name;

        const info = document.createElement("div");
        info.className = "service-info";

        const title = document.createElement("b");
        title.textContent = service.name;

        const details = document.createElement("p");
        details.textContent =
            service.category + " | " + service.price;

        const status = document.createElement("p");
        status.textContent = service.published
            ? "Published"
            : "Draft";

        const toggle = document.createElement("button");
        toggle.className = "status-btn";
        toggle.textContent = service.published
            ? "Unpublish"
            : "Publish";

        toggle.onclick = () => {
            service.published = !service.published;
            saveServices();
            showServices();
        };

        const remove = document.createElement("button");
        remove.className = "delete-btn";
        remove.textContent = "Delete";

        remove.onclick = () => {
            if (confirm("Delete this service?")) {
                services = services.filter(
                    item => item.id !== service.id
                );
                saveServices();
                showServices();
            }
        };

        info.append(title, details, status, toggle, remove);
        card.append(img, info);
        serviceList.appendChild(card);
    });
}

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const file = imageInput.files[0];

    if (!file) {
        message.textContent = "Please select an image.";
        return;
    }

    if (!file.type.startsWith("image/")) {
        message.textContent = "Please select an image file.";
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        message.textContent = "Image must be under 10 MB.";
        return;
    }

    const button = document.getElementById("submitBtn");
    button.disabled = true;
    button.textContent = "Uploading...";
    message.textContent = "";

    try {

        // Upload image to Cloudinary

        const data = new FormData();

        data.append("file", file);
        data.append("upload_preset", UPLOAD_PRESET);
        data.append("folder", "digitalmafa/services");

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: data
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.error?.message || "Cloudinary upload failed"
            );
        }

        // Create service data

        const service = {
            id: crypto.randomUUID(),

            name: document.getElementById("name").value.trim(),

            category: document.getElementById("category").value,

            description:
                document.getElementById("description").value.trim(),

            price:
                document.getElementById("price").value.trim(),

            features:
                document.getElementById("features").value
                .split("\n")
                .map(item => item.trim())
                .filter(Boolean),

            keywords:
                document.getElementById("keywords").value
                .split(",")
                .map(item => item.trim())
                .filter(Boolean),

            image: result.secure_url,

            published: false,

            createdAt: new Date().toISOString()
        };

        services.unshift(service);

        saveServices();
        showServices();

        form.reset();
        preview.style.display = "none";

        message.textContent =
            "Image uploaded and service saved successfully!";

    } catch (error) {

        console.error(error);

        message.textContent =
            "Error: " + error.message;

    } finally {

        button.disabled = false;
        button.textContent = "Upload Service";

    }

});

showServices();
