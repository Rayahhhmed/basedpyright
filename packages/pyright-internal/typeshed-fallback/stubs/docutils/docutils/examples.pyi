from _typeshed import Incomplete
from typing import Literal, overload
from typing_extensions import TypeAlias

from docutils.core import Publisher
from docutils.io import FileInput, StringInput
from docutils.nodes import document
from docutils.writers import _WriterParts

_HTMLHeaderLevel: TypeAlias = Literal[1, 2, 3, 4, 5, 6]

def html_parts(
    input_string: str,
    source_path=None,
    destination_path=None,
    input_encoding: str = "unicode",
    doctitle: bool = True,
    initial_header_level: _HTMLHeaderLevel = 1,
) -> _WriterParts: ...
@overload
def html_body(
    input_string: str,
    source_path=None,
    destination_path=None,
    input_encoding: str = "unicode",
    output_encoding: Literal["unicode"] = "unicode",
    doctitle: bool = True,
    initial_header_level: _HTMLHeaderLevel = 1,
) -> str: ...
@overload
def html_body(
    input_string: str,
    source_path=None,
    destination_path=None,
    input_encoding: str = "unicode",
    output_encoding: str = "unicode",
    doctitle: bool = True,
    initial_header_level: _HTMLHeaderLevel = 1,
) -> str | bytes: ...
def internals(
    input_string,
    source_path: FileInput | StringInput | None = None,
    destination_path: FileInput | StringInput | None = None,
    input_encoding: str = "unicode",
    settings_overrides: dict[str, Incomplete] | None = None,
) -> tuple[document | None, Publisher]: ...
