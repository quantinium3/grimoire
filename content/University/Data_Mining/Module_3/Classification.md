---
id: Classification
aliases: []
tags: []
title: Classification
---

## **1. Classification: Basic Concepts**
**Classification** is a supervised learning technique where a model predicts categorical class labels based on input features.

### **Key Terms**
- **Classifier**: Algorithm that maps input data to a category.
- **Training Data**: Labeled dataset used to train the model.
- **Testing Data**: Unseen data used to evaluate model performance.
- **Features (Attributes)**: Input variables used for prediction.
- **Class Label**: Output category to be predicted.

### **Evaluation Metrics**
- **Accuracy**: (TP + TN) / Total predictions  
- **Precision**: TP / (TP + FP) *(How many selected items are relevant?)*  
- **Recall (Sensitivity)**: TP / (TP + FN) *(How many relevant items are selected?)*  
- **F1-Score**: Harmonic mean of Precision & Recall  
- **Confusion Matrix**: Tabulates TP, TN, FP, FN.

---

## **2. Decision Tree Induction**
A **decision tree** is a flowchart-like structure where:
- **Internal nodes** = Feature tests  
- **Branches** = Outcomes of tests  
- **Leaf nodes** = Class labels  

### **Tree Construction (ID3, C4.5, CART)**
1. **Select the best attribute** to split data (using a **splitting criterion**).
2. **Partition data** into subsets based on attribute values.
3. **Repeat recursively** until:
   - All samples belong to one class, or  
   - No remaining features, or  
   - Tree reaches max depth.

### **Splitting Criteria**
- **Information Gain (ID3)**  
  \( IG(D, A) = H(D) - H(D|A) \)  
  (Maximize gain; biased towards high-cardinality features.)  
- **Gain Ratio (C4.5)**  
  \( GR(D, A) = \frac{IG(D, A)}{SplitInfo(A)} \)  
  (Normalizes IG to reduce bias.)  
- **Gini Index (CART)**  
  \( Gini(D) = 1 - \sum (p_i)^2 \)  
  (Measures impurity; prefers larger partitions.)

### **Advantages & Disadvantages**
| **Pros**                     | **Cons**                          |
|------------------------------|-----------------------------------|
| Easy to interpret            | Prone to overfitting             |
| Handles non-linear data      | Unstable (small changes → new tree) |
| No need for feature scaling  | Biased if classes are imbalanced |

---

## **3. Bayesian Classification**
Bayesian methods use probability to predict class membership.

### **Naïve Bayes Classifier**
- Assumes **features are independent** given the class (naïve assumption).  
- Uses **Bayes’ Theorem**:  
  \( P(Y|X) = \frac{P(X|Y) \cdot P(Y)}{P(X)} \)  
  - \( P(Y|X) \): Posterior probability (class given features).  
  - \( P(X|Y) \): Likelihood (feature distribution per class).  
  - \( P(Y) \): Prior probability of class.  

#### **Types of Naïve Bayes**
1. **Gaussian NB**: Assumes continuous features follow a normal distribution.  
2. **Multinomial NB**: For discrete counts (e.g., text classification).  
3. **Bernoulli NB**: Binary features (e.g., word presence/absence).  

#### **Pros & Cons**
| **Pros**                     | **Cons**                          |
|------------------------------|-----------------------------------|
| Fast & scalable              | Naïve assumption (feature independence) |
| Works well with high dimensions | Struggles if dependencies exist |

---

## **4. Bayesian Belief Networks (BBNs)**
- Also called **Bayesian Networks** or **Probabilistic Graphical Models**.  
- Represents dependencies between variables via a **Directed Acyclic Graph (DAG)**.  

### **Key Components**
1. **Nodes**: Random variables (features or class).  
2. **Edges**: Conditional dependencies.  
3. **Conditional Probability Tables (CPTs)**: Quantify relationships.  

### **Example**
- **Medical Diagnosis**:  
  - Nodes: `Smoking`, `Cancer`, `Cough`  
  - Edges: `Smoking → Cancer → Cough`  
  - CPT: \( P(Cough | Cancer) \), \( P(Cancer | Smoking) \).  

### **Inference in BBNs**
- Compute posterior probabilities given evidence (e.g., \( P(Cancer | Cough = True) \)).  
- Algorithms: **Variable Elimination, Markov Chain Monte Carlo (MCMC)**.  

### **Advantages & Disadvantages**
| **Pros**                     | **Cons**                          |
|------------------------------|-----------------------------------|
| Handles dependencies         | Complex to construct             |
| Interpretable structure      | Computationally expensive for large networks |
| Incorporates prior knowledge | Requires probability estimations |

---

## **Summary Table**
| **Method**               | **Key Idea**                              | **When to Use**                  |
|--------------------------|------------------------------------------|-----------------------------------|
| Decision Trees           | Split data via feature tests             | Need interpretability, non-linear data |
| Naïve Bayes              | Probabilistic, independence assumption  | Text classification, high dimensions |
| Bayesian Networks        | Models dependencies via DAG              | Domain knowledge available, dependencies matter |

