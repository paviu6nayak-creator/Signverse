"""
Shared helpers for working with MongoDB documents.

`PyObjectId` lets Pydantic v2 models accept/validate a Mongo ObjectId
while (de)serializing it as a plain string over the API — the frontend
never needs to know about BSON types.
"""
from typing import Annotated, Any

from bson import ObjectId
from pydantic import BeforeValidator

PyObjectId = Annotated[str, BeforeValidator(str)]


def is_valid_object_id(value: str) -> bool:
    return ObjectId.is_valid(value)


def mongo_doc_to_dict(document: dict[str, Any] | None) -> dict[str, Any] | None:
    """Normalize a raw Mongo document: stringify _id -> id and all ObjectIds for API responses."""
    if document is None:
        return None
    document = dict(document)
    if "_id" in document:
        document["id"] = str(document.pop("_id"))
    for k, v in list(document.items()):
        if isinstance(v, ObjectId):
            document[k] = str(v)
    return document
