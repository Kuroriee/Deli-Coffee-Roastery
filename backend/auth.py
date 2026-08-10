import os
import httpx
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException, Request, Response
from typing import Optional

EMERGENT_SESSION_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"
SESSION_COOKIE = "session_token"
SESSION_DAYS = 7

# Admin whitelist — hanya email berikut yang bisa login sebagai admin
ADMIN_WHITELIST = {
    "delicoffeedocument@gmail.com",
    "ks.kuro11@gmail.com",
}


def _cookie_kwargs(max_age: int):
    return dict(
        key=SESSION_COOKIE,
        max_age=max_age,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
    )


def set_session_cookie(response: Response, session_token: str):
    response.set_cookie(
        value=session_token,
        **_cookie_kwargs(SESSION_DAYS * 24 * 3600),
    )


def clear_session_cookie(response: Response):
    response.delete_cookie(SESSION_COOKIE, path="/")


async def fetch_emergent_session(session_id: str) -> dict:
    async with httpx.AsyncClient(timeout=15.0) as client:
        r = await client.get(EMERGENT_SESSION_URL, headers={"X-Session-ID": session_id})
        if r.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid Emergent session")
        return r.json()


async def get_session_token_from_request(request: Request) -> Optional[str]:
    # cookie first, then Authorization header
    tok = request.cookies.get(SESSION_COOKIE)
    if tok:
        return tok
    auth = request.headers.get("Authorization") or request.headers.get("authorization")
    if auth and auth.lower().startswith("bearer "):
        return auth[7:].strip()
    return None


async def current_user(request: Request, db) -> Optional[dict]:
    token = await get_session_token_from_request(request)
    if not token:
        return None
    session = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session:
        return None
    expires_at = session.get("expires_at")
    if isinstance(expires_at, str):
        try:
            expires_at = datetime.fromisoformat(expires_at)
        except Exception:
            return None
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        return None
    user = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    return user


async def require_admin(request: Request, db) -> dict:
    user = await current_user(request, db)
    if not user:
        raise HTTPException(status_code=401, detail="Belum login")
    if not user.get("is_admin") or user.get("email", "").lower() not in ADMIN_WHITELIST:
        raise HTTPException(status_code=403, detail="Bukan admin yang diizinkan")
    return user


def is_email_whitelisted(email: str) -> bool:
    return (email or "").strip().lower() in ADMIN_WHITELIST
