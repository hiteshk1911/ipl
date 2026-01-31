# Swagger/OpenAPI Documentation Guide

## Overview

The IPL Analytics API includes comprehensive **auto-generated Swagger/OpenAPI documentation** that makes it easy for frontend developers to understand and integrate with the API.

## Accessing the Documentation

Once the API is running, access the documentation at:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## What's Included

### 1. **API Overview**
- Complete API description
- Contact information
- License information
- Server URLs (development and production)

### 2. **Endpoint Documentation**
Each endpoint includes:
- **Summary**: Brief description
- **Detailed Description**: Full explanation with use cases
- **Parameters**: All path and query parameters with:
  - Type information
  - Validation rules (min/max values, required/optional)
  - Example values
  - Descriptions
- **Request Examples**: Sample requests
- **Response Examples**: Sample responses with real data structures
- **Error Responses**: All possible error codes and formats

### 3. **Interactive Testing**
- **Try It Out**: Test endpoints directly from the browser
- **Request Builder**: Automatically builds requests with proper encoding
- **Response Viewer**: See actual API responses
- **Schema Explorer**: Browse request/response models

### 4. **Schema Documentation**
- Complete Pydantic model definitions
- Field descriptions and types
- Required vs optional fields
- Example values
- Nested object structures

## Features for Frontend Developers

### ✅ **Complete API Reference**
All endpoints are fully documented with:
- Request formats
- Response structures
- Error handling
- Query parameters
- Path parameters

### ✅ **Type Safety**
- All request/response types are defined
- Validation rules are clearly stated
- TypeScript/JavaScript developers can generate types from OpenAPI spec

### ✅ **Example Requests**
Every endpoint includes:
- cURL examples
- Parameter examples
- Response examples
- Error examples

### ✅ **Try It Out**
- Test endpoints directly in the browser
- No need for Postman or other tools
- See real responses immediately

### ✅ **Code Generation**
The OpenAPI JSON can be used to:
- Generate TypeScript types
- Generate API client libraries
- Generate mock servers
- Generate test cases

## Example: Using Swagger UI

### Step 1: Access Swagger UI
Navigate to http://localhost:8000/docs

### Step 2: Find an Endpoint
Browse the endpoint list or use the search box. For example:
- **Batters** → **Get Batter Career Profile**

### Step 3: View Documentation
See:
- Endpoint description
- Parameters (with examples)
- Request/response schemas
- Example responses

### Step 4: Try It Out
1. Click "Try it out"
2. Enter parameters (e.g., `batter_name: V%20Kohli`)
3. Click "Execute"
4. See the actual API response

### Step 5: Use the Response
Copy the response structure to:
- Build frontend components
- Create TypeScript interfaces
- Write API integration code

## Code Generation Examples

### Generate TypeScript Types

```bash
# Using openapi-typescript
npx openapi-typescript http://localhost:8000/openapi.json -o api-types.ts

# Using swagger-codegen
swagger-codegen generate -i http://localhost:8000/openapi.json \
  -l typescript-axios -o ./generated-client
```

### Generate API Client

```bash
# Using openapi-generator
openapi-generator generate -i http://localhost:8000/openapi.json \
  -g typescript-axios -o ./api-client
```

## Documentation Structure

### Tags
Endpoints are organized by tags:
- **health**: System status
- **players**: Player management
- **batters**: Batter analytics
- **matchups**: Matchup analysis
- **matches**: Match information

### Response Models
All response models include:
- Field names and types
- Descriptions
- Example values
- Required/optional indicators

### Error Responses
Standard error format documented:
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Batter 'XYZ' not found",
    "details": {}
  }
}
```

## Best Practices for Frontend Developers

### 1. **Start with Swagger UI**
- Explore all endpoints
- Understand request/response formats
- Test with real data

### 2. **Generate Types**
- Use OpenAPI spec to generate TypeScript/JavaScript types
- Ensure type safety in your frontend code

### 3. **Use Examples**
- Copy example requests/responses
- Use as templates for your API calls
- Reference for error handling

### 4. **Check Validation Rules**
- See min/max values for parameters
- Understand required vs optional fields
- Know validation constraints

### 5. **Test Before Coding**
- Use "Try it out" to test endpoints
- Verify response structures
- Check error scenarios

## OpenAPI Specification

The full OpenAPI 3.0 specification is available at:
- **JSON**: http://localhost:8000/openapi.json
- **YAML**: Can be exported from Swagger UI

This specification can be:
- Imported into Postman
- Used with API testing tools
- Shared with frontend teams
- Used for contract testing

## Additional Resources

- **API Design Document**: See `API_DESIGN.md` for detailed endpoint specifications
- **API README**: See `API_README.md` for setup and usage guide
- **Extensibility Guide**: See `EXTENSIBILITY_EXAMPLE.md` for adding new endpoints

## Summary

The Swagger documentation provides:
- ✅ Complete API reference
- ✅ Interactive testing
- ✅ Code generation support
- ✅ Type definitions
- ✅ Example requests/responses
- ✅ Error handling documentation

**Frontend developers can use this documentation to:**
1. Understand all available endpoints
2. Test endpoints interactively
3. Generate type-safe API clients
4. Build frontend components with confidence
5. Handle errors properly

---

**Access the documentation**: http://localhost:8000/docs
