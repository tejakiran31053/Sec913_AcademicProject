from fastapi import APIRouter, Body, HTTPException
from typing import Any, Dict
import requests

from config import SPRING_URL

router = APIRouter()


@router.post("/auth/register")
def register(user: Dict[str, Any] = Body(...)):
    """Register a new user via the Spring backend."""
    try:
        response = requests.post(
            f"{SPRING_URL}/auth/register",
            json=user
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.ConnectionError:
        raise HTTPException(status_code=503, detail="Spring backend is unavailable")
    except requests.exceptions.HTTPError as e:
        raise HTTPException(status_code=response.status_code, detail=str(e))
    except ValueError:
        # Spring returned a plain-text response (e.g. a success message)
        return {"message": response.text}


@router.post("/auth/login")
def login(user: Dict[str, Any] = Body(...)):
    """Authenticate a user via the Spring backend."""
    try:
        response = requests.post(
            f"{SPRING_URL}/auth/login",
            json=user
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.ConnectionError:
        raise HTTPException(status_code=503, detail="Spring backend is unavailable")
    except requests.exceptions.HTTPError as e:
        raise HTTPException(status_code=response.status_code, detail=str(e))
    except ValueError:
        # Spring returned a plain-text response (e.g. a JWT token string)
        return {"token": response.text}