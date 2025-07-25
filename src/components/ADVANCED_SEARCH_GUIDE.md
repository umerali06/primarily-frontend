# Advanced Search Capabilities

This document outlines the advanced search capabilities implemented for the Primarily-like Items Dashboard.

## Components Created

### 1. AdvancedSearchBuilder

A visual query builder component that allows users to:

- Create complex search conditions with multiple fields and operators
- Combine conditions with logical operators (AND/OR)
- Preview the generated query
- Apply the search without needing to know the query syntax

### 2. SearchSyntaxHelp

A help component that provides:

- Documentation on the advanced search syntax
- Examples of common search patterns
- Reference for available fields and operators

### 3. Enhanced EnhancedSearchBar

Updated the search bar component with:

- Integration with the advanced search builder
- Access to search syntax help
- Detection of advanced query syntax
- Support for executing complex queries

### 4. Advanced Search Utilities

Created utility functions in advancedSearchUtils.js for:

- Parsing advanced search queries
- Applying complex filters to items
- Generating human-readable descriptions of queries

## Advanced Search Syntax

The advanced search syntax supports the following features:

### Field-Specific Search

Search within specific fields using the `field:value` syntax:

```
name:laptop
description:ergonomic
category:Electronics
```

### Operators

The following operators are supported:

| Operator  | Example                            | Description          |
| --------- | ---------------------------------- | -------------------- |
| :         | `name:laptop`                      | Contains (default)   |
| :=        | `category:=Electronics`            | Equals exactly       |
| :!=       | `category:!=Electronics`           | Does not equal       |
| :^        | `name:^Dell`                       | Starts with          |
| :$        | `name:Pro$`                        | Ends with            |
| :>        | `price:>100`                       | Greater than         |
| :<        | `quantity:<10`                     | Less than            |
| :[x TO y] | `price:[100 TO 500]`               | Between range        |
| :\*       | `image:*`                          | Field exists         |
| !field:\* | `!image:*`                         | Field does not exist |
| :(x OR y) | `category:(Electronics OR Office)` | Is one of (IN)       |

### Logical Operators

Combine multiple conditions using logical operators:

```
name:laptop AND price:<1000
category:=Electronics OR category:=Accessories
```

### Searchable Fields

The following fields are available for searching:

- `name` - Item name
- `description` - Item description
- `category` - Item category
- `location` - Item location
- `tags` - Item tags
- `price` - Item price
- `quantity` - Item quantity
- `barcode` - Item barcode or SKU
- `updatedAt` - Last update date

## Advanced Search Builder

The Advanced Search Builder provides a user-friendly interface for creating complex queries without needing to know the syntax. It includes:

1. **Field Selection**: Choose from available fields
2. **Operator Selection**: Select appropriate operators based on field type
3. **Value Input**: Enter search values with appropriate input types
4. **Logical Operator**: Choose between AND/OR for combining conditions
5. **Query Preview**: See the generated query in real-time
6. **Multiple Conditions**: Add, edit, or remove conditions as needed

## Implementation Details

### Query Parsing

The query parsing logic handles:

- Field-value pairs
- Different operators
- Quoted strings
- Logical operators
- Nested conditions with parentheses

```javascript
// Example of parsing a query
const parsedQuery = parseAdvancedQuery("name:laptop AND price:<1000");
// Result:
// {
//   conditions: [
//     { field: "name", operator: "contains", value: "laptop", valueEnd: "" },
//     { field: "price", operator: "lessThan", value: "1000", valueEnd: "" }
//   ],
//   logicalOperator: "AND"
// }
```

### Query Application

The search engine applies the parsed query to filter items:

- Handles different field types appropriately
- Applies operators correctly
- Respects logical operators for combining conditions
- Handles array fields (like tags) specially

```javascript
// Example of applying a query
const filteredItems = applyAdvancedSearch(items, parsedQuery);
```

### Human-Readable Descriptions

The system generates human-readable descriptions of queries to help users understand what they're searching for:

```javascript
// Example of generating a description
const description = getQueryDescription(parsedQuery);
// Result: "Name contains 'laptop' and Price is less than 1000"
```

## Usage Examples

### Basic Field Search

```
name:laptop
```

Finds items with "laptop" in the name field.

### Exact Match

```
category:=Electronics
```

Finds items exactly in the "Electronics" category.

### Numeric Comparisons

```
price:>100
quantity:<5
```

Finds items with price greater than 100 or quantity less than 5.

### Range Search

```
price:[100 TO 500]
```

Finds items with price between 100 and 500.

### Multiple Conditions

```
name:laptop AND price:<1000
```

Finds laptops with a price less than 1000.

### Complex Queries

```
category:=Electronics AND (price:>500 OR tags:(premium OR professional))
```

Finds electronics items that are either over $500 or have premium/professional tags.

## Benefits

1. **Power and Flexibility**: Users can create precise, complex queries
2. **Efficiency**: Find exactly what you need without multiple filter steps
3. **Consistency**: Standardized query language across the application
4. **Usability**: Visual builder for users who prefer a GUI approach
5. **Learnability**: Syntax help and examples for users who want to learn

## Future Enhancements

Potential future enhancements to the advanced search system:

1. **Query History**: Save and recall previous complex queries
2. **Query Templates**: Pre-defined query templates for common searches
3. **Natural Language Processing**: Convert natural language to search queries
4. **Search Suggestions**: Suggest query improvements based on results
5. **Field Auto-completion**: Suggest fields and values as users type
6. **Query Validation**: Validate queries and suggest corrections
7. **Search Analytics**: Track and analyze search patterns
