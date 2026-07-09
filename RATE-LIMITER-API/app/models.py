from sqlmodel import SQLModel, Field
import time

class RateLimit(SQLModel, table=True):
    user_id: str = Field(primary_key=True)
    count: int = 0
    reset_time: float = Field(default_factory=lambda: time.time() + 60)