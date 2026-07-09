from fastapi import FastAPI, HTTPException
from app.redis_client import redis_client

app = FastAPI()

LIMIT = 10
WINDOW = 60 #SECONDS

@app.post("/check")
def check_rate_limit(user_id: str):
    key = f"rate_limit: {user_id}"

    current = redis_client.get(key)

    if current is None:
        redis_client.set(key, 1, ex=WINDOW)
        return {"allowed": True, "remaining": LIMIT - 1}
    
    current = int(current)

    if current >= LIMIT:
        raise HTTPException(
            status_code = 429,
            detail = "Rate limit exceeded. Try again later."
        )
    
    redis_client.incr(key)

    remaining = LIMIT - (current + 1)
    return {"allowed": True, "remaining": remaining}

@app.get("/stats")
def stats(user_id: str):
    key = f"rate_limit: {user_id}"

    current = redis_client.get(key)
    ttl = redis_client.ttl(key)

    if current is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    current = int(current)

    return {
        "user_id": user_id,
        "count": current,
        "limit": LIMIT,
        "remaining": max(LIMIT - current, 0),
        "reset_in_seconds": ttl,
        "rate_limited": current >= LIMIT
    }

@app.get("/reset")
def reset(user_id: str):
    key = f"rate_limit: {user_id}"

    redis_client.delete(key)

    return {
        "user_id": user_id,
        "reset": True,
        "message": "Rate  limit reset for user"
    }

@app.get("/keys")
def keys():
    keys = redis_client.keys("rate_limit:*")
    return {"keys": keys}