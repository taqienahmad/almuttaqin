from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.user import User, UserRole
from app.services.auth_service import get_user_by_email

# Plain HTTP Bearer (not OAuth2PasswordBearer): our /auth/login endpoint takes
# a JSON {email, password} body, not the x-www-form-urlencoded
# username/password OAuth2 expects - so Swagger's built-in OAuth2 Authorize
# form would never actually work against it. HTTPBearer instead makes
# Swagger's "Authorize" dialog a plain "paste your token" field.
bearer_scheme = HTTPBearer(auto_error=False)

CREDENTIALS_ERROR = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    if credentials is None:
        raise CREDENTIALS_ERROR
    email = decode_access_token(credentials.credentials)
    if email is None:
        raise CREDENTIALS_ERROR
    user = await get_user_by_email(db, email)
    if user is None:
        raise CREDENTIALS_ERROR
    return user


def require_roles(*allowed_roles: UserRole):
    """Dependency factory: only lets through users whose role is in allowed_roles."""

    async def checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action",
            )
        return current_user

    return checker
