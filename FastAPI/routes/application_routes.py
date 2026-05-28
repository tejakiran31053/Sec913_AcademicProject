from fastapi import APIRouter, Body, HTTPException
from typing import Any, Dict
import requests

from config import SPRING_URL

router = APIRouter()


@router.post("/applications")
def apply_job(application: Dict[str, Any] = Body(...)):
    """Submit a new job application to the Spring backend."""
    try:
        response = requests.post(
            f"{SPRING_URL}/applications",
            json=application
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.ConnectionError:
        raise HTTPException(status_code=503, detail="Spring backend is unavailable")
    except requests.exceptions.HTTPError as e:
        raise HTTPException(status_code=response.status_code, detail=str(e))
    except ValueError:
        raise HTTPException(status_code=502, detail="Invalid response from Spring backend")


@router.get("/applications")
def get_applications():
    """Retrieve all job applications from the Spring backend."""
    try:
        response = requests.get(f"{SPRING_URL}/applications")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.ConnectionError:
        raise HTTPException(status_code=503, detail="Spring backend is unavailable")
    except requests.exceptions.HTTPError as e:
        raise HTTPException(status_code=response.status_code, detail=str(e))
    except ValueError:
        raise HTTPException(status_code=502, detail="Invalid response from Spring backend")