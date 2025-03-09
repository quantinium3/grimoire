### Outlier Detection?
Outlier detection (or anomaly detection) finds data points that differ markedly from the majority of the dataset. These points don’t conform to expected patterns or distributions.

- **Examples**:
  - A $10,000 transaction in a dataset of $50 purchases.
  - A temperature reading of -50°C in a tropical climate dataset.
- **Types**:
  - **Point Outliers**: Individual anomalies (e.g., a single fraudulent transaction).
  - **Contextual Outliers**: Anomalous within a specific context (e.g., 30°C in winter).
  - **Collective Outliers**: A group behaving oddly together (e.g., a sudden spike in network traffic).
  
### Why Detect Outliers?
- **Data Quality**: Identify errors or noise (e.g., sensor malfunctions).
- **Insight**: Uncover rare events (e.g., disease outbreaks).
- **Security**: Detect fraud or intrusions (e.g., unusual login patterns).
- **Preprocessing**: Clean data for better modeling (e.g., remove outliers before clustering).

### Methods for Outlier Detection
Outlier detection methods vary based on data type, assumptions, and whether the approach is supervised or unsupervised. Let’s explore the main categories:
#### 1. Statistical Methods
- **Assumption**: Data follows a known distribution (e.g., Gaussian).
- **Techniques**:
  - **Z-Score**: Measures how many standard deviations a point is from the mean.
    - Formula: \( z = \frac{x - \mu}{\sigma} \).
    - Threshold: \( |z| > 3 \) often flags outliers (assuming normality).
    - Example: In {1, 2, 3, 4, 100}, \( \mu = 22 \), \( \sigma \approx 43.8 \), \( z_{100} = 1.78 \) (not extreme, but adjust threshold for small datasets).
  - **IQR (Interquartile Range)**:
    - Q1 (25th percentile), Q3 (75th percentile), IQR = Q3 - Q1.
    - Outliers: Below \( Q1 - 1.5 \cdot IQR \) or above \( Q3 + 1.5 \cdot IQR \).
    - Example: {1, 2, 3, 4, 100} → Q1 = 2, Q3 = 4, IQR = 2, limits = [-1, 7], so 100 is an outlier.
- **Pros**: Simple, interpretable.
- **Cons**: Assumes distribution, struggles with high-dimensional or non-numeric data.

#### 2. Distance-Based Methods
- **Assumption**: Outliers are far from most other points.
- **Techniques**:
  - **K-Nearest Neighbors (KNN)**:
    - Compute distance to \( k \)-th nearest neighbor for each point.
    - Outliers have larger distances.
    - Example: In 2D points, if point A’s 5th neighbor is 10 units away while most are < 2 units, A is an outlier.
  - **Thresholding**: Set a distance cutoff based on dataset density.
- **Pros**: No distribution assumption, works with numerical data.
- **Cons**: Sensitive to \( k \), computationally expensive (O(n²) without indexing).

#### 3. Density-Based Methods
- **Assumption**: Outliers lie in low-density regions.
- **Techniques**:
  - **DBSCAN**:
    - Points labeled as noise (not core or border) are outliers.
    - Example: In {A(1, 1), B(1, 2), C(2, 1), D(5, 5)}, with \( \epsilon = 1.5 \), \( MinPts = 3 \), D is noise (outlier).
  - **LOF (Local Outlier Factor)**:
    - Compares a point’s local density to its neighbors’ density.
    - Formula: \( LOF(p) = \frac{\text{Avg local reachability density of neighbors}}{\text{Local reachability density of } p} \).
    - LOF > 1: Lower density than neighbors → outlier.
    - Example: A point in a sparse region surrounded by dense clusters has high LOF.
- **Pros**: Handles arbitrary shapes, robust to varying density.
- **Cons**: Parameter tuning (\( \epsilon \), \( MinPts \)), LOF is complex to compute.

#### 4. Clustering-Based Methods
- **Assumption**: Outliers don’t fit well into any cluster.
- **Techniques**:
  - **K-Means**:
    - Points far from their assigned centroid (e.g., high squared error) are outliers.
    - Example: After clustering {1, 2, 3, 100} into \( k = 2 \), 100 is far from its centroid.
  - **Hierarchical Clustering**:
    - Points merged late in the dendrogram (high height) or left unclustered are outliers.
  - **DBSCAN**: Noise points are outliers (already covered).
- **Pros**: Leverages existing clustering, intuitive.
- **Cons**: Depends on clustering quality, may mislabel small clusters as outliers.

#### 5. Machine Learning-Based Methods
- **Supervised**: Train a model (e.g., SVM, Random Forest) on labeled data (normal vs. outlier).
- **Unsupervised**:
  - **Isolation Forest**:
    - Builds random trees; outliers are isolated in fewer splits (shorter paths).
    - Example: In {1, 2, 3, 100}, 100 splits off early.
  - **Autoencoders**:
    - Neural network reconstructs data; high reconstruction error = outlier.
- **Pros**: Powerful for complex data, scalable with trees.
- **Cons**: Requires tuning, supervised needs labeled data.

### Choosing a Method
- **Data Type**: Numerical → Z-Score, KNN; Categorical → LOF with appropriate distance; Mixed → Isolation Forest.
- **Scale**: Small → Statistical; Large → Isolation Forest, DBSCAN with indexing.
- **Noise**: High → Density-based or ML methods; Low → Distance-based.
- **Domain**: Fraud → LOF, Isolation Forest; Quality control → Statistical.

### Challenges
- **High Dimensions**: Distance measures lose meaning ("curse of dimensionality").
- **Context**: Outliers may be valid (e.g., a luxury purchase isn’t fraud).
- **Thresholds**: Setting cutoffs (e.g., Z > 3, LOF > 2) is subjective.

### Applications
- **Finance**: Detect fraudulent transactions (e.g., $10,000 vs. $50 norms).
- **Healthcare**: Spot abnormal vitals (e.g., heart rate spike).
- **Network Security**: Identify unusual traffic patterns (e.g., DDoS attacks).
