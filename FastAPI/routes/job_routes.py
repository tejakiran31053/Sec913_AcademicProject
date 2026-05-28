from fastapi import APIRouter, Body, HTTPException
from typing import Any, Dict
import requests

from config import SPRING_URL

router = APIRouter()


@router.get("/jobs")
def get_jobs():
    """Retrieve all job listings from the Spring backend."""
    try:
        response = requests.get(f"{SPRING_URL}/jobs")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.ConnectionError:
        raise HTTPException(status_code=503, detail="Spring backend is unavailable")
    except requests.exceptions.HTTPError as e:
        raise HTTPException(status_code=response.status_code, detail=str(e))
    except ValueError:
        raise HTTPException(status_code=502, detail="Invalid response from Spring backend")


@router.post("/jobs")
def create_job(job: Dict[str, Any] = Body(...)):
    """Create a new job listing via the Spring backend."""
    try:
        response = requests.post(
            f"{SPRING_URL}/jobs",
            json=job
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.ConnectionError:
        raise HTTPException(status_code=503, detail="Spring backend is unavailable")
    except requests.exceptions.HTTPError as e:
        raise HTTPException(status_code=response.status_code, detail=str(e))
    except ValueError:
        raise HTTPException(status_code=502, detail="Invalid response from Spring backend")


@router.get("/jobs/{id}")
def get_job(id: int):
    """Retrieve a single job listing by ID from the Spring backend."""
    try:
        response = requests.get(f"{SPRING_URL}/jobs/{id}")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.ConnectionError:
        raise HTTPException(status_code=503, detail="Spring backend is unavailable")
    except requests.exceptions.HTTPError as e:
        raise HTTPException(status_code=response.status_code, detail=str(e))
    except ValueError:
        raise HTTPException(status_code=502, detail="Invalid response from Spring backend")