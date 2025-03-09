### Hierarchical Clustering
Hierarchical clustering organizes data into a nested hierarchy of clusters. The result is visualized as a **dendrogram**, where you can "cut" at different levels to get a desired number of clusters. It’s great for understanding relationships at multiple granularity levels.
### 1. Agglomerative Method (Bottom-Up)
Agglomerative clustering starts with each data point as its own cluster and iteratively merges the closest pairs until all points form a single cluster.
#### How It Works
1. **Initialization**: Treat each data point as a single cluster (n clusters for n points).
2. **Distance Calculation**: Compute the distance between all pairs of clusters using a chosen measure (e.g., Euclidean distance).
3. **Merging**: Merge the two clusters with the smallest distance (based on a linkage criterion).
4. **Update**: Recalculate distances between the new cluster and all others.
5. **Repeat**: Continue merging until all points are in one cluster.
#### Linkage Criteria (How to Measure Cluster Distance)
- **Single Linkage (Minimum Distance)**:
  - Distance between clusters = shortest distance between any two points in them.
  - Formula:   $$d(C_1, C_2) = \min_{x \in C_1, y \in C_2} d(x, y) $$
  - Effect: Creates long, chain-like clusters (good for elongated shapes).
- **Complete Linkage (Maximum Distance)**:
  - Distance = farthest distance between points in the clusters.
  - Formula:  $$d(C_1, C_2) = \max_{x \in C_1, y \in C_2} d(x, y) \ $$
  - Effect: Compact, spherical clusters.
- **Average Linkage (UPGMA)**:
  - Distance = average distance between all pairs of points.
  - Formula:  $$d(C_1, C_2) = \frac{1}{|C_1||C_2|} \sum_{x \in C_1, y \in C_2} d(x, y) \ $$
  - Effect: Balances between single and complete linkage.
- **Centroid Linkage (UPGMC)**:
  - Distance = distance between cluster centroids (means).
  - Effect: Sensitive to cluster shape, may invert distances (non-monotonic).
- **Ward’s Method**:
  - Minimizes the increase in total within-cluster variance after merging.
  - Effect: Tends to produce equal-sized, compact clusters.

#### Example
Dataset: Points A(1, 1), B(2, 2), C(5, 5), D(6, 6) with Euclidean distance and single linkage.
1. Start: {A}, {B}, {C}, {D}.
2. Merge closest: A and B (distance = 1.41) → {A, B}, {C}, {D}.
3. Merge next: C and D (distance = 1.41) → {A, B}, {C, D}.
4. Merge final: {A, B} and {C, D} (distance = 5) → {A, B, C, D}.
5. Dendrogram shows merges at heights 1.41, 1.41, 5.

#### Pros and Cons
- **Pros**: Intuitive, no need for \( k \), captures nested structures.
- **Cons**: Computationally expensive (O(n²) space, O(n³) time), sensitive to noise/outliers.

### 2. Divisive Method (Top-Down)
Divisive clustering starts with all data points in one cluster and recursively splits them into smaller clusters until each point is its own cluster (or a stopping criterion is met).

#### How It Works
1. **Initialization**: Begin with all points in a single cluster.
2. **Splitting**: Choose a cluster to split (often the one with the highest variance).
3. **Partition**: Use a clustering method (e.g., K-Means with \( k = 2 \)) to divide it into two subclusters.
4. **Repeat**: Recursively split clusters until a stopping condition (e.g., desired number of clusters, minimum cluster size).
5. **Result**: A dendrogram built from the top down.

#### Splitting Criteria
- **Variance-Based**: Split cluster with highest within-cluster variance (like Ward’s in reverse).
- **Diameter-Based**: Split cluster with largest maximum pairwise distance.
- **K-Means Split**: Apply K-Means (k=2) to the cluster and use the resulting partition.

#### Example
Same dataset: A(1, 1), B(2, 2), C(5, 5), D(6, 6).
1. Start: {A, B, C, D}.
2. Split: {A, B} (closer) and {C, D} (farther) based on distance.
3. Split {A, B}: {A}, {B}.
4. Split {C, D}: {C}, {D}.
5. Dendrogram shows splits at decreasing heights.

#### Pros and Cons
- **Pros**: Can incorporate global structure early, flexible with splitting criteria.
- **Cons**: Even more computationally intensive (splitting decisions are harder), sensitive to initial split.

---

### Agglomerative vs. Divisive

| Feature            | Agglomerative (Bottom-Up)         | Divisive (Top-Down)                   |
| ------------------ | --------------------------------- | ------------------------------------- |
| **Starting Point** | Each point is a cluster           | All points in one cluster             |
| **Direction**      | Merges clusters                   | Splits clusters                       |
| **Complexity**     | O(n³) time, O(n²) space           | O(2^n) worst-case, often O(n³)        |
| **Intuition**      | Builds up from details            | Breaks down from the whole            |
| **Common Use**     | More popular, easier to implement | Less common, used with specific needs |

---
### Applications
- **Agglomerative**: Taxonomy creation (e.g., biological species), social network analysis.
- **Divisive**: Document organization (start broad, refine), anomaly detection.