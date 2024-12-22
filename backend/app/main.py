from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import uuid
from .models.images import Image
from .database import engine, get_db
from .utils.s3 import upload_file_to_s3, get_presigned_url
from .config import settings

# Create database tables
Image.metadata.create_all(bind=engine)

app = FastAPI()

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Mask Drawing App API"}

@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        image_id = str(uuid.uuid4())
        s3_key = upload_file_to_s3(file, "originals")
        
        db_image = Image(
            id=image_id,
            original_key=s3_key
        )
        db.add(db_image)
        db.commit()

        url = get_presigned_url(s3_key)
        return {
            "id": image_id,
            "url": url
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload/{image_id}/mask")
async def upload_mask(image_id: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        print(f"Received request to upload mask for image_id: {image_id}")
        print(f"File details: {file.filename}, {file.content_type}")
        
        image = db.query(Image).filter(Image.id == image_id).first()
        if not image:
            raise HTTPException(status_code=404, detail="Image not found")

        s3_key = upload_file_to_s3(file, f"masks/{image_id}")
        image.mask_key = s3_key
        db.commit()

        url = get_presigned_url(s3_key)
        print(f"Mask uploaded successfully. URL: {url}")
        
        return {
            "id": image_id,
            "mask_url": url
        }
    except Exception as e:
        print(f"Error in uploading mask: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/images/{image_id}")
async def get_image(image_id: str, db: Session = Depends(get_db)):
    try:
        image = db.query(Image).filter(Image.id == image_id).first()
        if not image:
            raise HTTPException(status_code=404, detail="Image not found")
        
        original_url = get_presigned_url(image.original_key)
        mask_url = get_presigned_url(image.mask_key) if image.mask_key else None
        
        return {
            "id": image.id,
            "original_url": original_url,
            "mask_url": mask_url
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))