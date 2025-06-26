"""
AnomalyYunsa - Fabric Quality Control System
Main FastAPI application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

# Initialize FastAPI app
app = FastAPI(
    title="AnomalyYunsa API",
    version="0.1.0",
    description="AI-powered fabric anomaly detection system"
)

# CORS middleware for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """Root endpoint - health check"""
    return {
        "service": "AnomalyYunsa API",
        "status": "healthy",
        "mode": "simulation",
        "version": "0.1.0"
    }

@app.get("/health")
async def health_check():
    """Detailed health check endpoint"""
    return {
        "status": "healthy",
        "mode": "simulation",
        "components": {
            "ml_engine": "ready",
            "fabric_generator": "ready",
            "websocket": "ready"
        }
    }

# Include route modules (will be added in next sprints)
# from routes import fabric_routes, detection_routes, learning_routes
# app.include_router(fabric_routes.router, prefix="/api/fabric")
# app.include_router(detection_routes.router, prefix="/api/detection")
# app.include_router(learning_routes.router, prefix="/api/learning")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
