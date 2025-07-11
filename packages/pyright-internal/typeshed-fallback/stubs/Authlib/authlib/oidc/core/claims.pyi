from _typeshed import Incomplete

from authlib.jose import JWTClaims

__all__ = ["IDToken", "CodeIDToken", "ImplicitIDToken", "HybridIDToken", "UserInfo", "get_claim_cls_by_response_type"]

class IDToken(JWTClaims):
    ESSENTIAL_CLAIMS: Incomplete
    def validate(self, now=None, leeway: int = 0) -> None: ...
    def validate_auth_time(self) -> None: ...
    def validate_nonce(self) -> None: ...
    def validate_acr(self): ...
    def validate_amr(self) -> None: ...
    def validate_azp(self) -> None: ...
    def validate_at_hash(self) -> None: ...

class CodeIDToken(IDToken):
    RESPONSE_TYPES: Incomplete

class ImplicitIDToken(IDToken):
    RESPONSE_TYPES: Incomplete
    ESSENTIAL_CLAIMS: Incomplete
    def validate_at_hash(self) -> None: ...

class HybridIDToken(ImplicitIDToken):
    RESPONSE_TYPES: Incomplete
    def validate(self, now=None, leeway: int = 0) -> None: ...
    def validate_c_hash(self) -> None: ...

class UserInfo(dict[str, object]):
    REGISTERED_CLAIMS: list[str]
    SCOPES_CLAIMS_MAPPING: dict[str, list[str]]
    def filter(self, scope: str) -> UserInfo: ...
    def __getattr__(self, key): ...

def get_claim_cls_by_response_type(response_type): ...
