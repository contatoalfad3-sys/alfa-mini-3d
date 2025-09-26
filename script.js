// Upload e preview (mantido igual)
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
  
  // Validar tipo de arquivo
  if (!file.type.startsWith('image/')) {
    alert("Por favor, selecione apenas imagens!");
    return;
  }
  
  // Validar tamanho (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    alert("Imagem muito grande! Máximo 10MB.");
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.src = e.target.result;
    preview.classList.remove("hidden");
    dropText.classList.add("hidden");
  };
  reader.readAsDataURL(file);
}

// Chamada para webhook (MELHORADA)
const generateBtn = document.getElementById("generateBtn");
const result = document.getElementById("result");
const resultImg = document.getElementById("resultImg");

generateBtn.addEventListener("click", async () => {
  // Validação
  if (!fileInput.files[0]) {
    alert("Selecione uma imagem primeiro!");
    return;
  }
  
  // Guardar texto original do botão
  const originalText = generateBtn.textContent;
  
  // Mostrar loading
  generateBtn.textContent = "🎨 Gerando ToyArt...";
  generateBtn.disabled = true;
  result.classList.add("hidden");
  
  // Preparar dados
  const formData = new FormData();
  formData.append("file", fileInput.files[0]);
  
  try {
    const response = await fetch("https://alfa3d.app.n8n.cloud/webhook-test/toyart-generator", {
      method: "POST",
      body: formData,
    });
    
    // Verificar se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.success && data.imageUrl) {
      // Sucesso - mostrar resultado
      resultImg.src = data.imageUrl;
      result.classList.remove("hidden");
      
      // Criar botão de download (opcional)
      createDownloadButton(data.imageUrl);
      
      // Scroll suave para o resultado
      result.scrollIntoView({ behavior: 'smooth' });
      
    } else {
      throw new Error(data.message || "Erro desconhecido ao gerar ToyArt");
    }
    
  } catch (error) {
    console.error("Erro completo:", error);
    
    // Mensagens de erro mais específicas
    if (error.message.includes("Failed to fetch")) {
      alert("❌ Erro de conexão. Verifique sua internet e tente novamente.");
    } else if (error.message.includes("HTTP: 429")) {
      alert("⏳ Muitas solicitações. Aguarde um momento e tente novamente.");
    } else if (error.message.includes("HTTP: 500")) {
      alert("🔧 Erro no servidor. Nossa equipe já foi notificada!");
    } else {
      alert(`❌ Erro ao gerar ToyArt: ${error.message}`);
    }
    
  } finally {
    // Restaurar botão sempre
    generateBtn.textContent = originalText;
    generateBtn.disabled = false;
  }
});

// Função para criar botão de download (NOVA)
function createDownloadButton(imageUrl) {
  // Remover botão anterior se existir
  const existingDownload = result.querySelector('.download-btn');
  if (existingDownload) {
    existingDownload.remove();
  }
  
  // Criar novo botão
  const downloadBtn = document.createElement('a');
  downloadBtn.href = imageUrl;
  downloadBtn.download = `toyart-${Date.now()}.png`;
  downloadBtn.textContent = '📥 Baixar ToyArt';
  downloadBtn.className = 'download-btn';
  downloadBtn.style.cssText = `
    display: inline-block;
    margin-top: 15px;
    padding: 12px 24px;
    background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-decoration: none;
    border-radius: 25px;
    font-weight: bold;
    transition: transform 0.2s;
  `;
  
  // Hover effect
  downloadBtn.addEventListener('mouseenter', () => {
    downloadBtn.style.transform = 'scale(1.05)';
  });
  downloadBtn.addEventListener('mouseleave', () => {
    downloadBtn.style.transform = 'scale(1)';
  });
  
  result.appendChild(downloadBtn);
}

// Carousel (mantido igual)
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

// Modal (mantido igual)
const modal = document.getElementById("tipsModal");
document.getElementById("openModal").addEventListener("click", () => modal.classList.remove("modal-hidden"));
document.getElementById("closeModal").addEventListener("click", () => modal.classList.add("modal-hidden"));
modal.addEventListener("click", (e) => { 
  if (e.target === modal) modal.classList.add("modal-hidden"); 
});

// Função adicional: Preview melhor (NOVA)
function showImagePreview(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    preview.src = e.target.result;
    preview.classList.remove("hidden");
    dropText.classList.add("hidden");
    
    // Mostrar informações do arquivo
    const fileInfo = document.createElement('div');
    fileInfo.className = 'file-info';
    fileInfo.innerHTML = `
      📁 ${file.name}<br>
      📏 ${(file.size / 1024 / 1024).toFixed(2)} MB
    `;
    fileInfo.style.cssText = `
      margin-top: 10px;
      font-size: 12px;
      color: #666;
      text-align: center;
    `;
    
    // Remover info anterior
    const existingInfo = dropArea.querySelector('.file-info');
    if (existingInfo) existingInfo.remove();
    
    dropArea.appendChild(fileInfo);
  };
  reader.readAsDataURL(file);
}

