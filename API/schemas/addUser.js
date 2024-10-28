export const addUser = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "email": {
            "type": "string",
            "format": "email",
            "minLength": 5
        },
        "fullname": {
            "type": "string",
            "minLength": 1
        },
        "password": {
            "type": "string",
            "minLength": 6
        },
        "role": {
            "type": "string",
            "enum": ["Admin", "Faculty", "Adviser"]
        },
        "status": {
            "type": "string",
            "enum": ["Active", "Inactive"]
        },
        "username": {
            "type": "string",
            "minLength": 3
        }
    },
    "required": ["email", "fullname", "password", "role", "status", "username"],
    "additionalProperties": false
};
