---
id: Association Rule Mining
aliases: []
tags: []
title: Association Rule Mining
---

### Support and Confidence in Association Rule Mining
Association rule mining finds relationships like "If A, then B" (written as A → B) in transactional datasets.

- **Support**: The frequency of a pattern or rule in the dataset.
  - For an itemset (e.g., {milk, bread}):  
    **Support = (Number of transactions with {milk, bread}) / (Total transactions)**.
  - For a rule (e.g., {milk} → {bread}):  
    **Support = (Number of transactions with both milk and bread) / (Total transactions)**.
  - Purpose: Filters out rare patterns. If support is too low, the pattern isn’t significant.

- **Confidence**: The reliability of the rule.
  - Formula: **Confidence(A → B) = Support(A ∪ B) / Support(A)**.
  - Example: If 50 out of 100 transactions have milk, and 40 of those also have bread, then:  
    Confidence({milk} → {bread}) = 40 / 50 = 80%.
  - Purpose: Measures how often B appears when A is present.

**Example Transaction Data**:
```
T1: {milk, bread, butter}
T2: {milk, bread}
T3: {milk, beer}
T4: {bread, butter}
T5: {milk}
```
- Support({milk, bread}) = 2 / 5 = 40%.
- Confidence({milk} → {bread}) = Support({milk, bread}) / Support({milk}) = (2/5) / (4/5) = 50%.

---

### Apriori Algorithm

The **Apriori algorithm** mines frequent itemsets and generates association rules efficiently by using a key principle: *If an itemset is frequent, all its subsets must also be frequent*. It prunes infrequent itemsets early.

#### How It Works
1. **Set a minimum support threshold** (e.g., 40%).
2. **Step 1: Find frequent 1-itemsets** (items meeting min support).
   - {milk}: 4/5 = 80% ✓
   - {bread}: 3/5 = 60% ✓
   - {butter}: 2/5 = 40% ✓
   - {beer}: 1/5 = 20% ✗
3. **Step 2: Generate candidate 2-itemsets** from frequent 1-itemsets.
   - {milk, bread}, {milk, butter}, {bread, butter}.
4. **Check support for 2-itemsets**:
   - {milk, bread}: 2/5 = 40% ✓
   - {milk, butter}: 1/5 = 20% ✗
   - {bread, butter}: 2/5 = 40% ✓
5. **Repeat for larger itemsets** until no more frequent itemsets are found.
6. **Generate rules** (e.g., {milk} → {bread}) and compute confidence.

#### Pros and Cons
- **Pros**: Simple, intuitive, leverages pruning to reduce computation.
- **Cons**: Requires multiple database scans, slow for large datasets or low min support due to many candidates.

---

### FP-Growth Algorithm

The **FP-Growth (Frequent Pattern Growth) algorithm** is a more efficient alternative to Apriori. Instead of generating candidates, it builds a compact tree structure called an **FP-Tree** and mines patterns directly.

#### How It Works
1. **Set a minimum support threshold** (e.g., 40%).
2. **Step 1: Scan data to find frequent 1-itemsets** (same as Apriori).
   - {milk}: 80%, {bread}: 60%, {butter}: 40%, {beer}: 20% (drop {beer}).
3. **Step 2: Sort items by frequency** and build the FP-Tree.
   - Order: {milk} > {bread} > {butter}.
   - Transactions are inserted into the tree, sharing prefixes:
     - T1: {milk, bread, butter} → Tree path: milk → bread → butter.
     - T2: {milk, bread} → Shares milk → bread.
     - T3: {milk} → Shares milk.
     - T4: {bread, butter} → New path: bread → butter.
     - T5: {milk} → Increments milk count.
4. **Step 3: Mine the FP-Tree**:
   - Start from the least frequent item (e.g., {butter}).
   - Trace paths to find conditional patterns (e.g., {milk, bread} with {butter}).
   - Recursively build smaller trees and extract frequent patterns.

#### Pros and Cons
- **Pros**: Single-pass compression with FP-Tree, no candidate generation, faster for dense datasets.
- **Cons**: FP-Tree can be memory-intensive for sparse data, harder to implement.

---
### Apriori vs. FP-Growth
| Feature            | Apriori                   | FP-Growth                     |
| ------------------ | ------------------------- | ----------------------------- |
| **Approach**       | Candidate generation      | Tree-based                    |
| **Database Scans** | Multiple                  | Two (initial + tree)          |
| **Memory Use**     | Low (but many candidates) | Higher (FP-Tree)              |
| **Speed**          | Slower on large data      | Faster, especially dense data |
| **Complexity**     | Simpler to code           | More complex                  |
