# Mask Drawing App Backend

A FastAPI backend service for handling image uploads, mask generation, and AWS S3 storage integration.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [AWS S3 Setup](#aws-s3-setup)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Database](#database)
- [AWS Configuration](#aws-configuration)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- AWS account
- SQLite (included with Python)
- Git

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mask-drawing-app/backend
```

2. Create and activate virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Unix/macOS
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## AWS S3 Setup

1. Create AWS Account:
   - Go to [AWS Console](https://aws.amazon.com/)
   - Sign up for a new account or sign in

2. Create S3 Bucket:
   - Go to S3 service in AWS Console
   - Click "Create bucket"
   - Choose a unique bucket name
   - Select your preferred region
   - Uncheck "Block all public access" (we need this for our app)
   - Click "Create bucket"

3. Configure CORS for your bucket:
   - Select your bucket
   - Go to "Permissions" tab
   - Find "Cross-origin resource sharing (CORS)"
   - Add the following configuration:
```json
[
    {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "PUT", "POST"],
        "AllowedOrigins": [
            "http://localhost:5173",
            "https://your-production-frontend-url.com"
        ],
        "ExposeHeaders": []
    }
]
```

4. Create IAM User:
   - Go to IAM service
   - Click "Users" → "Add user"
   - Choose a username (e.g., "mask-drawing-app")
   - Select "Programmatic access"
   - Click "Next: Permissions"
   - Click "Attach existing policies directly"
   - Search for and select "AmazonS3FullAccess"
   - Complete the user creation
   - **IMPORTANT**: Save the Access Key ID and Secret Access Key

## Environment Setup

Create a `.env` file in the backend root directory:

```env
# Database
DATABASE_URL="sqlite:///./images.db"

# AWS Credentials
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_REGION=your_chosen_region (e.g., us-east-1)
S3_BUCKET_NAME=your_bucket_name

# CORS Settings
BACKEND_CORS_ORIGINS=["http://localhost:5173"]
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── images.py
│   └── utils/
│       ├── __init__.py
│       └── s3.py
├── .env
├── requirements.txt
└── images.db
```

## Dependencies

```txt
fastapi==0.100.0
uvicorn==0.23.2
sqlalchemy==2.0.19
python-multipart==0.0.6
python-dotenv==1.0.0
boto3==1.28.0
```

To generate requirements.txt:
```bash
pip freeze > requirements.txt
```

## Running the Application

1. Activate virtual environment:
```bash
# Windows
venv\Scripts\activate

# Unix/macOS
source venv/bin/activate
```

2. Start the server:
```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### `POST /api/upload`
Upload an original image
- Input: Image file (JPEG/PNG)
- Returns: Image ID and presigned URL

### `POST /api/upload/{image_id}/mask`
Upload a mask for an existing image
- Input: Mask image file
- Returns: Mask URL

### `GET /api/images/{image_id}`
Get image details
- Returns: Original and mask URLs

## Database

SQLite database (`images.db`) is automatically created with the following schema:

```sql
CREATE TABLE images (
    id TEXT PRIMARY KEY,
    original_key TEXT NOT NULL,
    mask_key TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
```

## AWS Configuration Details

### Required IAM Policy
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::your-bucket-name",
                "arn:aws:s3:::your-bucket-name/*"
            ]
        }
    ]
}
```

## Testing

1. Check server health:
```bash
curl http://localhost:8000/
```

2. Test image upload:
```bash
curl -X POST -F "file=@test.jpg" http://localhost:8000/api/upload
```

## Troubleshooting

### Common Issues

1. AWS Credentials:
- Error: "botocore.exceptions.NoCredentialsError"
- Solution: Check AWS credentials in .env file

2. CORS Issues:
- Error: "Access-Control-Allow-Origin missing"
- Solution: Verify CORS settings in both S3 and FastAPI configuration

3. Database Issues:
- Error: "SQLite database is locked"
- Solution: Check database file permissions

4. File Upload Issues:
- Error: "File too large"
- Solution: Adjust Uvicorn settings for larger files:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    max_age=3600,
)
```

## Security Considerations

1. Never commit .env file
2. Use AWS IAM roles with minimal required permissions
3. Implement rate limiting for production
4. Set up proper CORS restrictions for production
5. Implement file size limits
6. Add file type validation

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

[Your chosen license]

---

This backend documentation provides a comprehensive guide for setting up and running the service. For production deployment, additional security measures and optimizations should be implemented.
