// Upload e preview
const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("fileElem");
const preview = document.getElementById("preview");
const dropText = document.getElementById("drop-text");

dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.classList.add("dragover");
});
dropArea.addEventListener("dragleave", () => dropArea.classList.remove("dragover"));
dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.classList.remove("dragover");
  handleFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener("change", (e) => handleFile(e.target.files[0]));

function handleFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.src = e.target.result;
    preview.classList.remove("hidden");
    dropText.classList.add("hidden");
  };
  reader.readAsDataURL(file);
}

// Chamada para webhook
const generateBtn = document.getElementById("generateBtn");
const result = document.getElementById("result");
const resultImg = document.getElementById("resultImg");

generateBtn.addEventListener("click", async () => {
  if (!fileInput.files[0]) {
    alert("Selecione uma imagem primeiro!");
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  try {
    const response = await fetch("https://seu-n8n-webhook", {
      method: "POST",
      body: formData,
    });

    // Aqui você ajusta conforme a resposta real do n8n
    // Exemplo: { imageUrl: "https://..." }
    const data = await response.json();
    resultImg.src = data.imageUrl || "https://via.placeholder.com/400x400?text=Imagem+Gerada";
    result.classList.remove("hidden");
  } catch (err) {
    console.error(err);
    alert("Erro ao gerar modelo.");
  }
});

// Carousel
let currentSlide = 0;
const carousel = document.getElementById("carousel");
const dots = document.querySelectorAll(".dot");

function goToSlide(index) {
  carousel.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
  currentSlide = index;
}
dots.forEach((dot, i) => dot.addEventListener("click", () => goToSlide(i)));
setInterval(() => goToSlide((currentSlide + 1) % dots.length), 3000);
goToSlide(0);

// Modal
const modal = document.getElementById("tipsModal");
document.getElementById("openModal").addEventListener("click", () => modal.classList.remove("modal-hidden"));
document.getElementById("closeModal").addEventListener("click", () => modal.classList.add("modal-hidden"));
modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.add("modal-hidden"); });
