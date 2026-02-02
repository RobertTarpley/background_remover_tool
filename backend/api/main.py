from fastapi import FastAPI, UploadFile, File, Response
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove
from PIL import Image
import io

app = FastAPI()

# Define the origins that are allowed to make requests
origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:8080",
    "http://localhost:3000", # Example frontend URL (e.g., React, Vue app)
    "http://127.0.0.1:5500",
    # "https://your-frontend-domain.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # Allow cookies, authorization headers, etc.
    allow_methods=["*"],     # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],     # Allow all headers
)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/remove-bg")
async def remove_bg(file: UploadFile = File(...)):
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes))

    output = remove(image)

    buffer = io.BytesIO()
    output.save(buffer, format="PNG")


    # Return using Response to stop FastAPI from trying to decode your bytes
    return Response(content=buffer.getvalue(), media_type="image/png")