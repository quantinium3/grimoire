### Frequent Pattern Mining
Frequent pattern mining is about discovering recurring patterns or itemsets in large datasets, often used in transactional data (e.g., market basket analysis). The goal is to find items that frequently appear together.

- **Example**: In a grocery store dataset, if {milk, bread} appears in many transactions, it’s a frequent pattern.
- **Key Metric**: **Support**—the percentage of transactions containing a specific pattern.  
  - Formula: Support(A) = (Number of transactions with A) / (Total transactions).
- **Algorithms**: Apriori, FP-Growth, and ECLAT are popular methods to mine these patterns efficiently.
