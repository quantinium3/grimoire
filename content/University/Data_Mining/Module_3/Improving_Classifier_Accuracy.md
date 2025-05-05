---
id: Improving_Classifier_Accuracy
aliases: []
tags: []
title: Improving Classifier Accuracy
---

## **1. Data Preprocessing**
### **A. Handle Missing Data**
- **Drop rows/columns** if missing values are excessive.
- **Impute** using:
  - Mean/median (numerical data).
  - Mode (categorical data).
  - Predictive models (e.g., k-NN imputation).

### **B. Feature Engineering**
- **Create new features** (e.g., ratios, interactions, polynomial terms).
- **Bin continuous variables** (e.g., age groups).
- **Use domain knowledge** (e.g., extracting day/month from dates).

### **C. Feature Scaling**
- **Standardization** (Z-score):  
  \( X_{\text{scaled}} = \frac{X - \mu}{\sigma} \)  
  (For SVM, k-NN, neural networks.)
- **Normalization (Min-Max)**:  
  \( X_{\text{scaled}} = \frac{X - X_{\min}}{X_{\max} - X_{\min}} \)  
  (For algorithms like k-NN, gradient descent.)

### **D. Encoding Categorical Variables**
- **One-Hot Encoding** (for nominal data).
- **Label Encoding** (for ordinal data).

### **E. Outlier Detection & Removal**
- **Z-score** (if Gaussian-distributed).
- **IQR method**:  
  Remove points outside \( Q1 - 1.5 \times IQR \) and \( Q3 + 1.5 \times IQR \).

---

## **2. Algorithm Selection**
Choose the right model based on data characteristics:

| **Scenario**               | **Recommended Algorithms**          |
|----------------------------|-------------------------------------|
| Small dataset              | SVM, Naïve Bayes, Decision Trees   |
| Large dataset             | Random Forest, XGBoost, Neural Nets |
| High-dimensional data     | Regularized models (Lasso, Ridge)   |
| Imbalanced classes        | SMOTE, Class weights, F1-score opt. |
| Non-linear relationships  | Kernel SVM, Random Forest, XGBoost  |

---

## **3. Hyperparameter Tuning**
Optimize model parameters using:
### **A. Grid Search**
- Exhaustively tests all combinations.
- Example for **Random Forest**:
  ```python
  params = {
      'n_estimators': [50, 100, 200],
      'max_depth': [5, 10, None],
      'min_samples_split': [2, 5, 10]
  }
  ```
### **B. Random Search**
- Faster than grid search; samples randomly.
### **C. Bayesian Optimization**
- Uses probabilistic models to find optimal params.

---

## **4. Handle Class Imbalance**
### **A. Resampling**
- **Oversampling**: SMOTE (Synthetic Minority Oversampling).
- **Undersampling**: Random removal of majority class.
### **B. Class Weighting**
- Assign higher weights to minority classes.
  ```python
  # In scikit-learn
  model = RandomForestClassifier(class_weight='balanced')
  ```
### **C. Use Better Metrics**
- **F1-score**, **Precision-Recall AUC** instead of accuracy.

---

## **5. Ensemble Methods**
Combine multiple models to boost performance:
### **A. Bagging (Bootstrap Aggregating)**
- **Random Forest**: Reduces variance by averaging multiple decision trees.
### **B. Boosting**
- **XGBoost/LightGBM**: Sequentially corrects errors from prior models.
### **C. Stacking**
- Uses predictions of base models as input to a meta-model.

---

## **6. Advanced Techniques**
### **A. Feature Selection**
- **Filter Methods**: Correlation, Chi-square.
- **Wrapper Methods**: Recursive Feature Elimination (RFE).
- **Embedded Methods**: Lasso regression, feature importance from trees.
### **B. Dimensionality Reduction**
- **PCA**: For linear relationships.
- **t-SNE/UMAP**: For visualization/non-linear data.
### **C. Cross-Validation**
- **Stratified k-Fold**: Preserves class distribution.
- **Leave-One-Out (LOO)**: For very small datasets.

---

## **7. Debugging Low Accuracy**
| **Issue**                | **Solution**                          |
|--------------------------|---------------------------------------|
| High bias (underfitting) | Add more features, use complex models |
| High variance (overfitting) | Regularization, more training data   |
| Poor feature quality     | Feature engineering, selection        |
| Data leakage             | Ensure no test data leaks into train  |

---

## **8. Example Workflow**
1. **Preprocess data** (clean, scale, encode).
2. **Train baseline model** (e.g., logistic regression).
3. **Tune hyperparameters** (GridSearchCV).
4. **Apply ensemble methods** (XGBoost).
5. **Evaluate** using cross-validation and metrics like F1-score.
6. **Deploy best model**.

---

## **Key Takeaways**
- **Data quality > Model complexity**.
- **Always cross-validate** to avoid overfitting.
- **Ensemble methods** (XGBoost, Random Forest) often outperform single models.
- **Focus on the right metric** (e.g., F1 for imbalanced data).
