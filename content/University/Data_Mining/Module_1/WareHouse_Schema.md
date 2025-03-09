---
id: WareHouse Schema
aliases: []
tags: []
title: WareHouse Schema
---

Data warehouse schemas are the logical blueprints that define how data is organized and stored within a data warehouse. They structure the relationships between tables to optimize storage and querying. Unlike operational databases (which often use normalized schemas for efficiency in transactions), data warehouse schemas prioritize fast retrieval and analysis of large datasets. The two most common schemas in data warehousing are the **Star Schema** and the **Snowflake Schema**, with a less common variant being the **Galaxy Schema**. 

## Star Schema
The star schema is the simplest and most widely used data warehouse schema.

### Structure:
- **Fact Table**: The center of the star, containing quantitative data (metrics) you want to analyze, like sales amounts, quantities sold, or revenue. It stores numerical measures and foreign keys linking to dimension tables.
  - Example: A "Sales" fact table with columns like `Sale_Amount`, `Units_Sold`, `Date_ID`, `Product_ID`, `Customer_ID`.
- **Dimension Tables**: Surround the fact table like points of a star. These hold descriptive attributes (qualitative data) providing context to the facts, such as time, product details, or customer info.
  - Example: A "Time" dimension table with `Date_ID`, `Day`, `Month`, `Year`; a "Product" dimension with `Product_ID`, `Name`, `Category`.

![[Pasted image 20250302191101.png]]
### Characteristics:
- **Denormalized**: Dimension tables are typically not broken down further (no normalization), reducing the number of joins needed for queries.
- **Simple Joins**: The fact table connects directly to dimension tables with one-to-many relationships, making queries fast and straightforward.
- **Example Layout**:
  ```
  Fact_Sales: [Sale_Amount, Date_ID, Product_ID, Customer_ID]
  Dim_Time: [Date_ID, Day, Month, Year]
  Dim_Product: [Product_ID, Name, Category, Price]
  Dim_Customer: [Customer_ID, Name, Region]
  ```

### Advantages:
- **Query Performance**: Fewer joins mean faster execution, ideal for data mining and OLAP operations.
- **Simplicity**: Easy to understand and design, even for non-technical users.
- **Scalability**: Works well with large datasets and aggregation-heavy tasks (e.g., “Total sales by region”).

### Disadvantages:
- **Redundancy**: Denormalization can lead to duplicate data in dimension tables, increasing storage needs.
- **Less Flexibility**: Harder to adapt to complex hierarchies without modification.

---

## Snowflake Schema
The snowflake schema is an extension of the star schema, adding normalization to the dimension tables. It’s called "snowflake" because the dimensions branch out like a snowflake’s intricate arms.

### Structure:
- **Fact Table**: Same as in the star schema—central, holding measures and keys to dimension tables.
  - Example: `Fact_Sales` with `Sale_Amount`, `Date_ID`, `Product_ID`, `Customer_ID`.
- **Dimension Tables**: These are normalized into multiple related tables, creating a hierarchy.
  - Example: The "Time" dimension might split into:
    - `Dim_Time: [Date_ID, Day, Month_ID]`
    - `Dim_Month: [Month_ID, Month, Year_ID]`
    - `Dim_Year: [Year_ID, Year]`
  - Similarly, "Product" might split into `Dim_Product` (basic info) and `Dim_Category` (category details).

![[Pasted image 20250302191929.png]]
### Characteristics:
- **Normalized**: Dimension tables are broken into sub-tables to eliminate redundancy, following database normalization rules.
- **Complex Joins**: More tables mean more joins in queries, as you navigate the hierarchy.
- **Example Layout**:
  ```
  Fact_Sales: [Sale_Amount, Date_ID, Product_ID, Customer_ID]
  Dim_Time: [Date_ID, Day, Month_ID]
  Dim_Month: [Month_ID, Month, Year_ID]
  Dim_Year: [Year_ID, Year]
  Dim_Product: [Product_ID, Name, Category_ID]
  Dim_Category: [Category_ID, Category_Name]
  ```

### Advantages:
- **Storage Efficiency**: Normalization reduces data duplication (e.g., storing "Year" once, not repeated across rows).
- **Complex Hierarchies**: Better suited for detailed, multi-level dimensions (e.g., product categories nesting into subcategories).
- **Data Integrity**: Less redundancy means fewer chances for inconsistencies.

### Disadvantages:
- **Query Complexity**: More joins slow down performance, especially for large-scale data mining or real-time analytics.
- **Design Complexity**: Harder to build and maintain compared to the star schema.

---

## Galaxy Schema (Fact Constellation Schema)
This is a more advanced variant, combining multiple fact tables that share dimension tables. It’s called "galaxy" or "constellation" because it looks like multiple stars connected in a network.

### Structure:
- **Multiple Fact Tables**: Each tracks different measures (e.g., `Fact_Sales` for revenue, `Fact_Inventory` for stock levels).
- **Shared Dimension Tables**: Common dimensions (e.g., `Dim_Time`, `Dim_Product`) link the fact tables.
- **Example Layout**:
  ```
  Fact_Sales: [Sale_Amount, Date_ID, Product_ID]
  Fact_Inventory: [Stock_Level, Date_ID, Product_ID]
  Dim_Time: [Date_ID, Day, Month, Year]
  Dim_Product: [Product_ID, Name, Category]
  ```
  ![[Pasted image 20250302192204.png]]

### Characteristics:
- **Interconnected**: Fact tables can relate to each other through shared dimensions.
- **Complex**: More flexible but harder to manage than a single star or snowflake.

### Advantages:
- **Flexibility**: Supports multiple business processes (e.g., sales and inventory analysis) in one warehouse.
- **Comprehensive Analysis**: Ideal for data mining across related datasets.

### Disadvantages:
- **Complexity**: Design and queries get intricate with multiple fact tables.
- **Performance**: Can be slower due to additional relationships.

---

### Comparison Table

| Feature           | Star Schema         | Snowflake Schema     | Galaxy Schema       |
| ----------------- | ------------------- | -------------------- | ------------------- |
| **Normalization** | Denormalized        | Normalized           | Mixed               |
| **Complexity**    | Simple              | Moderate             | High                |
| **Query Speed**   | Fast                | Slower (more joins)  | Varies              |
| **Storage**       | Higher (redundancy) | Lower (efficient)    | Depends on design   |
| **Use Case**      | Basic analytics     | Detailed hierarchies | Multi-fact analysis |

---

### Real-World Example
Imagine a data warehouse for an e-commerce platform:
- **Star Schema**: `Fact_Orders` (order totals) with `Dim_Customer`, `Dim_Product`, `Dim_Time`—quickly mines top-selling products by month.
- **Snowflake Schema**: Adds `Dim_Category` and `Dim_Subcategory` to `Dim_Product`—mines deeper trends like "electronics subcategories in Q4."
- **Galaxy Schema**: Adds `Fact_Returns`—mines relationships between orders and returns by customer type.
