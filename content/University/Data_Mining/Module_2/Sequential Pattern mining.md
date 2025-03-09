---
id: Sequential Pattern mining
aliases: []
tags: []
title: Sequential Pattern mining
---

Sequential pattern mining finds frequent subsequences in a dataset of sequences. A sequence is an ordered list of events or itemsets, often tied to time or position.
- **Example**: In a customer shopping dataset:
  - Sequence: <{milk}, {bread}, {butter}> means a customer bought milk, then bread, then butter over time.
  - Goal: Find patterns like <{milk}, {bread}> that appear frequently across many customers.

- **Applications**:
  - Web navigation: <homepage, product page, checkout>.
  - Bioinformatics: DNA sequences (e.g., <A, C, G, T>).
  - Retail: Purchase sequences over months.

### Key Concepts

1. **Sequence**:
   - An ordered list of itemsets (events).
   - Notation: <{a}, {b, c}, {d}> means "a happens, then b and c together, then d."
   - Itemsets within a step (e.g., {b, c}) are unordered, but the steps are ordered.

2. **Subsequence**:
   - A sequence S1 is a subsequence of S2 if all items of S1 appear in S2 in the same order (not necessarily consecutive).
   - Example: <{a}, {c}> is a subsequence of <{a}, {b}, {c, d}>.

3. **Support**:
   - The percentage of sequences in the dataset that contain a given subsequence.
   - Formula: **Support(S) = (Number of sequences containing S) / (Total sequences)**.
   - Example: If <{milk}, {bread}> appears in 3 out of 5 customer sequences, support = 3/5 = 60%.

4. **Frequent Sequential Pattern**:
   - A subsequence with support ≥ a user-defined **minimum support threshold** (min_sup).
   - Example: If min_sup = 50%, <{milk}, {bread}> (60%) is frequent.

5. **Constraints** (optional):
   - Time gaps: Events must occur within a certain time window (e.g., 1 day).
   - Length: Limit pattern length (e.g., max 3 steps).
   - Item constraints: Include specific items (e.g., must contain {milk}).

### Example Dataset
Let’s use a simple dataset of customer purchase sequences:

| Customer ID | Sequence                    |
| ----------- | --------------------------- |
| C1          | <{milk}, {bread}, {butter}> |
| C2          | <{milk}, {bread}>           |
| C3          | <{beer}, {milk}, {butter}>  |
| C4          | <{milk}, {bread}, {beer}>   |
| C5          | <{bread}, {butter}>         |

- Total sequences: 5.
- Min_sup: 40% (i.e., 2/5 = 2 sequences).

**Frequent Patterns**:
- <{milk}>: 4/5 = 80% ✓
- <{bread}>: 4/5 = 80% ✓
- <{butter}>: 3/5 = 60% ✓
- <{milk}, {bread}>: 3/5 = 60% ✓
- <{bread}, {butter}>: 2/5 = 40% ✓
- <{milk}, {butter}>: 2/5 = 40% ✓

### Key Algorithms

1. **GSP (Generalized Sequential Patterns)**:
   - How it works:
     - Similar to Apriori: Starts with frequent 1-sequences, then builds longer candidates.
     - Uses a level-wise approach, scanning the database multiple times.
   - Steps:
     1. Find frequent 1-sequences (e.g., <{milk}>).
     2. Generate candidate 2-sequences (e.g., <{milk}, {bread}>) and check support.
     3. Repeat until no more frequent sequences.
   - Pros: Simple, supports constraints like time gaps.
   - Cons: Multiple scans, slow for large datasets.

2. **PrefixSpan (Prefix-Projected Sequential Pattern Mining)**:
   - How it works:
     - Projects the database into smaller subsets based on prefixes, avoiding candidate generation.
     - Grows patterns recursively.
   - Steps (for above dataset):
     1. Start with <{milk}> (support 4):
        - Project database: Look at what follows <{milk}> in C1, C2, C3, C4.
        - Sub-sequences: <{bread}> (3), <{butter}> (2).
     2. Extend: <{milk}, {bread}> (support 3), <{milk}, {butter}> (support 2).
     3. Repeat for other prefixes (e.g., <{bread}>).
   - Pros: Faster, single-pass after projection, memory-efficient.
   - Cons: Complex to implement.

3. **SPADE (Sequential PAttern Discovery using Equivalence classes)**:
   - How it works:
     - Uses a vertical database format (item-to-sequence ID mapping).
     - Finds patterns via intersection of ID lists.
   - Example: <{milk}> in [C1, C2, C3, C4], <{bread}> in [C1, C2, C4, C5]; intersect to find <{milk}, {bread}> in [C1, C2, C4].
   - Pros: Efficient for dense data, single-pass possible.
   - Cons: Memory overhead for sparse data.
   
### Advanced Concepts

1. **Closed Sequential Patterns**:
   - A sequence is closed if no super-sequence has the same support.
   - Example: If <{milk}, {bread}> and <{milk}, {bread}, {butter}> both have support 3, only the latter is closed.
   - Benefit: Reduces output size.

2. **Maximal Sequential Patterns**:
   - A sequence is maximal if no super-sequence is frequent.
   - Example: <{milk}, {bread}, {butter}> might be maximal if <{milk}, {bread}, {butter}, {beer}> isn’t frequent.

3. **Time Constraints**:
   - Min_gap/Max_gap: Events must occur within a time window.
   - Example: <{milk}, {bread}> only counts if bread is bought within 7 days of milk.

4. **Sliding Windows**:
   - For streaming data, patterns are mined over a fixed recent window (e.g., last 100 transactions).
   
