const imageInput = document.getElementById("imageInput");
const removeBtn = document.getElementById("removeBtn");
const resultImage = document.getElementById("resultImage");
const downloadLink = document.getElementById("downloadLink");

const isLocal = 
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const apiBaseUrl = 
    window.location.hostname === "localhost"
      ? "http://localhost:8080"
      : "https://background-remover-tool-133491538114.us-east1.run.app";

removeBtn.addEventListener("click", async () => {
  const file = imageInput.files[0];

  if (!file) {
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  removeBtn.disabled = true;
  const originalText = removeBtn.textContent;
  removeBtn.textContent = "Processing...";

  try {
    const response = await fetch(`${apiBaseUrl}/remove-bg`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("API error:", response.status, text);
      alert(`Remove-bg failed (${response.status}). Check console for details.`);
      return;
    }

    const blob = await response.blob();
    
    if (resultImage.dataset.blobUrl) {
      URL.revokeObjectURL(resultImage.dataset.blobUrl);
    }
    
    const imageUrl = URL.createObjectURL(blob);
    resultImage.dataset.blobUrl = imageUrl;

    resultImage.src = imageUrl;
    downloadLink.href = imageUrl;
    downloadLink.style.display = "inline";
  } catch (err) {
    console.error("Request failed:", err);
    alert("Request failed. Check console for details.");
  } finally {
    removeBtn.disabled = false;
    removeBtn.textContent = originalText;
  }
}); 