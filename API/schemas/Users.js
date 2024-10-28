export const Users  = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "id": {
                "type": "string"
            },
            "email": {
                "type": "string",
                "format": "email",
                "minLength": 5
            },
            "fullname": {
                "type": "string",
                "minLength": 1
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
            },
            "imageUrl": {
                "type": "string"
            }
        },
        "required": ["id", "email", "fullname", "role", "status", "username"],
        "additionalProperties": false
    }
};

pm.test("Response schema is valid", function() {
    pm.response.to.have.jsonSchema(schema);
});
