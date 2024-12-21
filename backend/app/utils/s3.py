import boto3
from fastapi import UploadFile
from app.config import settings  

s3_client = boto3.client(
    's3',
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    region_name=settings.AWS_REGION
)

def upload_file_to_s3(file: UploadFile, prefix: str) -> str:
    key = f"{prefix}/{file.filename}"
    s3_client.upload_fileobj(file.file, settings.S3_BUCKET_NAME, key)
    return key

def get_presigned_url(key: str, expires_in: int = 3600) -> str:
    return s3_client.generate_presigned_url(
        'get_object',
        Params={'Bucket': settings.S3_BUCKET_NAME, 'Key': key},
        ExpiresIn=expires_in
    )