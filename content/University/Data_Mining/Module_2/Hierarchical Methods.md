---
id: Hierarchical Methods
aliases: []
tags: []
---

### **1. Hierarchical Clustering Methods**
Hierarchical clustering creates a tree-like structure (dendrogram) to represent data groupings at different levels of granularity.

#### **A. Agglomerative (Bottom-Up) Method**
- **Approach**: Starts with each data point as a single cluster and merges the closest pairs iteratively.
- **Steps**:
  1. Treat each data point as a singleton cluster.
  2. Compute pairwise distances between clusters.
  3. Merge the two closest clusters.
  4. Repeat until all points are in one cluster.
- **Linkage Criteria** (How to measure distance between clusters):
  - **Single Linkage**: Minimum distance between clusters (sensitive to noise).
  - **Complete Linkage**: Maximum distance between clusters (compact clusters).
  - **Average Linkage**: Average distance between clusters (balanced).
  - **Ward’s Method**: Minimizes variance when merging clusters.

#### **B. Divisive (Top-Down) Method**
- **Approach**: Starts with all points in one cluster and recursively splits them.
- **Steps**:
  1. Start with one cluster containing all points.
  2. Split the cluster into sub-clusters using a flat clustering method (e.g., k-means).
  3. Repeat recursively until each point is a cluster.
- **Less common** due to computational complexity.

---

### **2. Density-Based Methods**
These methods identify clusters as dense regions separated by sparse regions.

#### **A. DBSCAN (Density-Based Spatial Clustering of Applications with Noise)**
- **Key Parameters**:
  - **ε (eps)**: Maximum distance for two points to be neighbors.
  - **MinPts**: Minimum number of points to form a dense region.
- **Concepts**:
  - **Core Point**: Has ≥ MinPts within ε.
  - **Border Point**: Has < MinPts but is reachable from a core point.
  - **Noise Point**: Neither core nor border.
- **Steps**:
  1. Randomly pick a point, find its neighbors.
  2. If it’s a core point, form a cluster.
  3. Expand cluster by adding reachable points.
  4. Repeat for unvisited points.
- **Advantages**:
  - Handles arbitrary-shaped clusters.
  - Robust to noise.
- **Disadvantages**:
  - Struggles with varying densities.
  - Sensitive to ε and MinPts.

#### **B. OPTICS (Ordering Points To Identify the Clustering Structure)**
- Extension of DBSCAN that handles varying densities.
- Creates a reachability plot to extract clusters at different densities.

---

### **3. Clustering with Constraints**
Incorporates user-defined constraints to guide clustering.

#### **Types of Constraints**:
- **Must-Link (ML)**: Two points must be in the same cluster.
- **Cannot-Link (CL)**: Two points must not be in the same cluster.
- **Constrained Algorithms**:
  - **COP-KMeans**: Modifies k-means to respect constraints.
  - **Constrained Hierarchical Clustering**: Adjusts merges/splits based on constraints.
- **Applications**: Semi-supervised learning, domain-specific clustering.

---

### **4. Outlier Detection**
Identifies data points that deviate significantly from the majority.

#### **A. Statistical Methods**
- Assumes data follows a distribution (e.g., Gaussian).
- **Z-Score**: Points with |Z| > 3 are outliers.
- **Grubbs’ Test**: Detects outliers in univariate data.

#### **B. Distance-Based Methods**
- **k-NN Outlier Detection**: Points with large distances to their k-nearest neighbors are outliers.
- **Mahalanobis Distance**: Accounts for covariance in data.

#### **C. Density-Based Methods**
- **Local Outlier Factor (LOF)**: Compares local density of a point with its neighbors.
  - LOF ≫ 1 → Outlier.

#### **D. Clustering-Based Methods**
- Points not belonging to any cluster (e.g., noise in DBSCAN) are outliers.

#### **E. Isolation Forest**
- Uses decision trees to isolate outliers (fewer splits needed).

---

### **Summary Table**
| **Method**               | **Key Idea**                              | **Pros**                          | **Cons**                          |
|--------------------------|------------------------------------------|-----------------------------------|-----------------------------------|
| Agglomerative            | Bottom-up merging                        | No need for k, interpretable      | O(n³) complexity                 |
| Divisive                 | Top-down splitting                       | Better for large clusters         | Computationally expensive        |
| DBSCAN                   | Density-based clusters                   | Handles noise, arbitrary shapes   | Sensitive to parameters          |
| Clustering with Constraints | Uses ML/CL constraints                | Incorporates domain knowledge     | Constraints may be hard to define |
| Outlier Detection (LOF)  | Density deviation                        | Works for local outliers          | Computationally heavy            |
