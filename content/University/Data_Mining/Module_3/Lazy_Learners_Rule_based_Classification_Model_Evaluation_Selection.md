---
id: Lazy_Learners_Rule_based_Classification_Model_Evaluation_Selection
aliases: []
tags: []
title: Lazy Learners Rule based Classification Model Evaluation Selection
---

# **1. Lazy Learners (Instance-Based Learning)**
Lazy learners **do not build an explicit model** during training. Instead, they **store the training data** and defer processing until prediction time.

### **Key Characteristics**
- **No training phase**: Simply memorizes data (non-parametric).
- **Fast training, slow prediction**: Must compute distances/weights for each new query.
- **Adapts to new data**: No need to retrain; just add new instances.

---

### **A. k-Nearest Neighbors (k-NN)**
#### **How It Works**
1. **Store** all training examples.
2. For a new instance:
   - Compute **distance** (e.g., Euclidean, Manhattan) to all stored examples.
   - Select the **k closest neighbors**.
   - Assign the **majority class** (classification) or **average value** (regression).

#### **Distance Metrics**
| Metric          | Formula (for vectors \(x, y\))                     | Use Case                     |
|-----------------|----------------------------------------------------|-----------------------------|
| **Euclidean**   | \(\sqrt{\sum_{i=1}^n (x_i - y_i)^2}\)             | Continuous features         |
| **Manhattan**   | \(\sum_{i=1}^n |x_i - y_i|\)                    | Robust to outliers          |
| **Minkowski**   | \((\sum_{i=1}^n |x_i - y_i|^p)^{1/p}\)          | Generalizes Euclidean (p=2) |
| **Cosine**      | \(1 - \frac{x \cdot y}{\|x\| \|y\|}\)             | Text/data with sparsity     |

#### **Choosing k**
- **Small k (e.g., 1)** → High variance (overfitting, noisy boundaries).  
- **Large k** → High bias (underfitting, smoother boundaries).  
- **Rule of thumb**: \(k = \sqrt{n}\) (where \(n\) = training samples).

#### **Pros & Cons**
| **Advantages**                          | **Disadvantages**                          |
|-----------------------------------------|--------------------------------------------|
| Simple to implement                     | Slow prediction (O(n) per query)           |
| No assumptions about data distribution  | Sensitive to irrelevant features           |
| Naturally handles multi-class problems  | Requires feature scaling                   |

---

### **B. Case-Based Reasoning (CBR)**
- **Concept**: Solve new problems by retrieving **similar past cases** (e.g., medical diagnosis, legal reasoning).  
- **Steps**:
  1. **Retrieve** similar cases from memory.
  2. **Reuse** solutions from past cases.
  3. **Revise** solutions if needed.
  4. **Retain** new solutions for future use.

#### **Example: Medical Diagnosis**
- **New case**: Patient with {fever, cough}.  
- **Retrieve**: Past cases with similar symptoms.  
- **Reuse**: Diagnose as "flu" if most matches suggest it.  

#### **Pros & Cons**
| **Advantages**                          | **Disadvantages**                          |
|-----------------------------------------|--------------------------------------------|
| Interpretable (human-like reasoning)    | Requires a large case database             |
| Adapts to new knowledge incrementally  | Computationally expensive for retrieval   |

---

# **2. Rule-Based Classification**
Rule-based classifiers use **"if-then" rules** to assign classes. Rules are derived from data or expert knowledge.

### **Types of Rules**
1. **Decision Lists**: Ordered rules (first match wins).  
2. **Decision Sets**: Unordered rules (may require conflict resolution).  

### **Rule Extraction Methods**
#### **A. Direct Methods (Learn Rules from Data)**
- **RIPPER (Repeated Incremental Pruning to Produce Error Reduction)**:
  - Greedily adds rules to cover positive examples.
  - Prunes rules to avoid overfitting.
- **CN2 (Inductive Rule Learning)**:
  - Uses beam search to find high-coverage rules.

#### **B. Indirect Methods (Convert Models to Rules)**
- **From Decision Trees**: Each path from root to leaf → a rule.
  - Example:  
    `IF (Age < 30) AND (Income = High) THEN Buy = Yes`.

#### **Rule Quality Measures**
- **Coverage**: % of instances the rule applies to.  
- **Accuracy**: % of correctly classified instances covered by the rule.  
- **Laplace Estimate**: Adjusts for small sample sizes.  

#### **Pros & Cons**
| **Advantages**                          | **Disadvantages**                          |
|-----------------------------------------|--------------------------------------------|
| Highly interpretable                    | May overfit with noisy data                |
| Handles categorical data well           | Rule conflicts may require resolution     |

---

# **3. Model Evaluation and Selection**
Evaluating classifiers ensures they generalize well to unseen data.

### **A. Evaluation Metrics**
#### **For Classification**
| Metric          | Formula                          | Interpretation                          |
|-----------------|----------------------------------|----------------------------------------|
| **Accuracy**    | \(\frac{TP + TN}{TP + TN + FP + FN}\) | Overall correctness                   |
| **Precision**   | \(\frac{TP}{TP + FP}\)           | How many selected are relevant?       |
| **Recall**      | \(\frac{TP}{TP + FN}\)           | How many relevant are selected?       |
| **F1-Score**    | \(2 \times \frac{Precision \times Recall}{Precision + Recall}\) | Harmonic mean of P & R |

#### **For Imbalanced Data**
- **ROC Curve**: Plots TPR (Recall) vs. FPR (\( \frac{FP}{TN + FP} \)).  
- **AUC (Area Under Curve)**: Higher AUC = better model.  

#### **For Regression**
- **MSE (Mean Squared Error)**: \(\frac{1}{n} \sum (y_i - \hat{y}_i)^2\).  
- **R² (R-Squared)**: Proportion of variance explained by the model.  

### **B. Cross-Validation**
- **k-Fold CV**: Splits data into k folds; each fold serves as test set once.  
- **Stratified k-Fold**: Preserves class distribution in splits.  

### **C. Model Selection**
1. **Bias-Variance Tradeoff**:  
   - **High bias** (underfitting) → Simplify model.  
   - **High variance** (overfitting) → Regularize or get more data.  
2. **Hyperparameter Tuning**:  
   - **Grid Search**: Exhaustive search over parameter combinations.  
   - **Random Search**: Randomly samples parameter space.  

---

# **Summary Table**
| **Concept**               | **Key Idea**                              | **When to Use**                  |
|---------------------------|------------------------------------------|----------------------------------|
| **k-NN**                  | Instance-based, distance-weighted voting | Small datasets, interpretability |
| **Rule-Based**            | "If-then" rules from data/expertise      | Need transparent decision logic  |
| **Model Evaluation**      | Metrics (Accuracy, F1, AUC), CV          | Ensure generalization            |
| **Model Selection**       | Hyperparameter tuning, bias-variance     | Optimize performance             |
