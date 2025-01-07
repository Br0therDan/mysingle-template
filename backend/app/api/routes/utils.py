from fastapi import APIRouter, Depends
from pydantic.networks import EmailStr

from app.api.deps import get_current_active_superuser, get_current_user
from app.schemas.token import Message
from app.utils.utils import generate_test_email, generate_verification_email, send_email

router = APIRouter()


@router.post(
    "/test-email/",
    dependencies=[Depends(get_current_active_superuser)],
    status_code=201,
)
def test_email(email_to: EmailStr) -> Message:
    """
    Test emails.
    """
    email_data = generate_test_email(email_to=email_to)
    send_email(
        email_to=email_to,
        subject=email_data.subject,
        html_content=email_data.html_content,
    )
    return Message(message="Test email sent")



@router.post(
    "/verification_email/",
    dependencies=[Depends(get_current_user)],
    status_code=201,
)
def verification_email(email_to: EmailStr) -> Message:
    """
    Family verification email
    """
    email_data = generate_verification_email(email_to=email_to)
    send_email(
        email_to=email_to,
        subject=email_data.subject,
        html_content=email_data.html_content,
    )
    return Message(message="Test email sent")

@router.get("/health-check/")
async def health_check() -> bool:
    return True
