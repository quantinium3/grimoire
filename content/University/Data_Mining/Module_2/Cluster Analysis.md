---
id: Cluster Analysis
aliases: []
tags: []
---

Cluster analysis groups data points into clusters where objects within a cluster are more similar to each other than to those in other clusters. It’s unsupervised—no predefined labels, just patterns in the data.
### 1. Types of Data in Cluster Analysis
The type of data dictates how clustering is performed and which measures or methods work best. Here are the main categories:

- **Numerical Data (Quantitative)**:
  - Continuous: Real numbers (e.g., height: 1.75m, temperature: 23.5°C).
  - Discrete: Integers (e.g., number of purchases: 3, 5).
  - Use case: Common in scientific and financial data.
  - Example measures: Euclidean distance, Manhattan distance.

- **Categorical Data (Qualitative)**:
  - Nominal: Unordered categories (e.g., colors: red, blue; gender: male, female).
  - Ordinal: Ordered categories (e.g., ratings: low, medium, high).
  - Challenge: No inherent numerical distance.
  - Example measures: Hamming distance, Jaccard similarity.

- **Binary Data**:
  - Two states (e.g., 0/1, yes/no, true/false).
  - Example: Feature presence (e.g., has_feature: 1 or 0).
  - Measures: Jaccard coefficient, simple matching coefficient.

- **Mixed Data**:
  - Combines numerical and categorical (e.g., {age: 25, gender: female, income: $50K}).
  - Challenge: Requires hybrid distance measures (e.g., Gower’s distance).

- **Text Data**:
  - Words or documents (e.g., customer reviews).
  - Converted to vectors (e.g., TF-IDF, word embeddings).
  - Measures: Cosine similarity, Euclidean distance on vectors.

- **Time Series/Sequential Data**:
  - Ordered sequences (e.g., stock prices over time, purchase histories).
  - Measures: Dynamic Time Warping (DTW), correlation-based distances.

- **Spatial Data**:
  - Coordinates or geometric data (e.g., latitude/longitude).
  - Measures: Euclidean distance, geodesic distance.
---
### 2. Similarity and Distance Measures
Clustering relies on quantifying how "similar" or "dissimilar" data points are. **Distance measures** (dissimilarity) and **similarity measures** are two sides of the same coin.

#### Distance Measures (Dissimilarity)
- **Euclidean Distance** (Numerical):
  - Formula: \( d(x, y) = \sqrt{\sum (x_i - y_i)^2} \).
  - Example: Points (1, 2) and (4, 6) → \( d = \sqrt{(4-1)^2 + (6-2)^2} = 5 \).
  - Use: General-purpose, assumes spherical clusters.

- **Manhattan Distance** (Numerical):
  - Formula: \( d(x, y) = \sum |x_i - y_i| \).
  - Example: (1, 2) and (4, 6) → \( d = |4-1| + |6-2| = 7 \).
  - Use: Grid-like data, less sensitive to outliers than Euclidean.

- **Minkowski Distance** (Numerical):
  - Generalization: \( d(x, y) = (\sum |x_i - y_i|^p)^{1/p} \).
  - \( p = 1 \): Manhattan; \( p = 2 \): Euclidean.
  - Use: Flexible for different data shapes.

- **Hamming Distance** (Categorical/Binary):
  - Counts mismatches between two equal-length strings.
  - Example: "red" vs. "blue" (encoded as vectors) → Compare positions.
  - Use: Nominal data, binary attributes.

- **Dynamic Time Warping (DTW)** (Time Series):
  - Aligns sequences by warping time axis.
  - Use: Time series with varying speeds (e.g., speech patterns).

#### Similarity Measures
- **Cosine Similarity** (Text/Numerical):
  - Formula: \( \text{cos}(\theta) = \frac{x \cdot y}{|x| |y|} \).
  - Range: 0 to 1 (1 = identical direction).
  - Use: Text data, high-dimensional sparse data.

- **Jaccard Similarity** (Binary/Sets):
  - Formula: \( J(A, B) = \frac{|A \cap B|}{|A \cup B|} \).
  - Example: Sets {a, b} and {b, c} → \( J = 1/3 \).
  - Use: Binary or set-based data (e.g., purchased items).

- **Gower’s Distance** (Mixed Data):
  - Combines normalized distances for numerical, categorical, and binary attributes.
  - Use: Heterogeneous datasets.
---
### 3. Partitioning Methods
Partitioning methods divide data into \( k \) non-overlapping clusters. You specify \( k \) (number of clusters) beforehand.

#### K-Means
- **How it works**:
  1. Randomly initialize \( k \) centroids.
  2. Assign each point to the nearest centroid (Euclidean distance).
  3. Update centroids as the mean of assigned points.
  4. Repeat until convergence.
- **Data type**: Numerical.
- **Pros**: Fast, scalable, works well with spherical clusters.
- **Cons**: Sensitive to outliers, assumes equal-sized clusters, needs \( k \) specified.
- **Example**: Group customers by {age, income}.

#### K-Medoids (PAM - Partitioning Around Medoids)
- **How it works**:
  - Similar to K-Means, but uses actual data points (medoids) as cluster centers instead of means.
  - Minimizes total distance to medoids.
- **Data type**: Numerical, categorical (with appropriate distance measures).
- **Pros**: Robust to outliers, flexible with distance measures (e.g., Manhattan).
- **Cons**: Slower than K-Means (computes pairwise distances).
- **Example**: Cluster cities by {latitude, longitude} with outliers.

#### K-Modes
- **How it works**:
  - Adapts K-Means for categorical data.
  - Uses modes (most frequent category) instead of means, Hamming distance instead of Euclidean.
- **Data type**: Categorical.
- **Pros**: Simple, efficient for nominal data.
- **Cons**: Limited to categorical attributes.
- **Example**: Cluster survey responses {gender, preference}.

#### CLARA (Clustering Large Applications)
- **How it works**:
  - A scalable version of K-Medoids.
  - Samples the dataset, applies PAM on the sample, and extends results.
- **Data type**: Numerical, categorical.
- **Pros**: Handles large datasets, robust like K-Medoids.
- **Cons**: Sampling may miss small clusters.
- **Example**: Cluster millions of customer transactions.

### Choosing the Right Approach
- **Data Type**: Numerical → K-Means; Categorical → K-Modes; Mixed → Gower’s + K-Medoids.
- **Scale**: Small → K-Means/K-Medoids; Large → CLARA.
- **Shape**: Spherical idclusters → K-Means; Arbitrary → K-Medoids.
