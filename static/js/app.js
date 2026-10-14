// Mejoras mínimas de UX. La app funciona igual sin JavaScript.
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".flash").forEach((el) => {
    setTimeout(() => {
      el.style.transition = "opacity 0.4s ease";
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 400);
    }, 6000);
  });
});

// ---------------------------------------------------------------------------
// Mostrar/ocultar contraseña o PIN
// ---------------------------------------------------------------------------
const EYE_ICON = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
const EYE_OFF_ICON = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.3 20.3 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a20.3 20.3 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

function togglePasswordVisibility(button) {
  const input = button.previousElementSibling;
  const isHidden = input.type === "password";
  input.type = isHidden ? "text" : "password";
  button.setAttribute("aria-label", isHidden ? "Ocultar contraseña" : "Mostrar contraseña");
  button.innerHTML = isHidden ? EYE_OFF_ICON : EYE_ICON;
}

// ---------------------------------------------------------------------------
// Vista previa de archivos seleccionados (foto de perfil, carnet de vacunas...)
// ---------------------------------------------------------------------------
function handleFileFieldChange(input, nameElId, previewElId) {
  const file = input.files && input.files[0];

  const nameEl = document.getElementById(nameElId);
  if (nameEl) nameEl.textContent = file ? file.name : "Ningún archivo seleccionado";

  if (!previewElId) return;
  const previewEl = document.getElementById(previewElId);
  if (!previewEl) return;

  if (file && file.type && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      previewEl.src = ev.target.result;
      previewEl.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    previewEl.removeAttribute("src");
    previewEl.style.display = "none";
  }
}

// ---------------------------------------------------------------------------
// Compartir ubicación al avisar por WhatsApp
// ---------------------------------------------------------------------------
function shareLocationAndOpenWhatsapp(event, link) {
  if (!navigator.geolocation) {
    return true; // sin soporte: deja que el <a> abra el wa_link normal
  }
  event.preventDefault();

  const phone = link.dataset.phone;
  const baseMessage = link.dataset.message;

  const openWhatsapp = (message) => {
    window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const mapsLink = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
      openWhatsapp(`${baseMessage}\n\nMi ubicación actual: ${mapsLink}`);
    },
    () => openWhatsapp(baseMessage),
    { enableHighAccuracy: true, timeout: 6000, maximumAge: 0 }
  );
  return false;
}

function openPhotoViewer(src) {
  document.getElementById("photo-viewer-img").src = src;
  document.getElementById("photo-viewer").hidden = false;
}
function closePhotoViewer() {
  document.getElementById("photo-viewer").hidden = true;
}
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePhotoViewer(); });
