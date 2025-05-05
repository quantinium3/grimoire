---
id: Regression
aliases: []
tags: []
title: Regression
---

# **Prediction Techniques: Linear & Non-Linear Regression in Data Mining**

Regression is a **fundamental predictive modeling technique** used in data mining to forecast continuous outcomes. Below is a structured breakdown of **linear and non-linear regression methods**, their applications, and implementation strategies.

---

## **1. Linear Regression**
### **A. Simple Linear Regression**
- **Model**: Predicts a dependent variable (\( y \)) using one independent variable (\( x \)).
- **Equation**:
  \[
  y = \beta_0 + \beta_1 x + \epsilon
  \]
  - \( \beta_0 \): Intercept  
  - \( \beta_1 \): Slope  
  - \( \epsilon \): Error term  

- **Assumptions**:
  1. Linear relationship between \( x \) and \( y \).
  2. Homoscedasticity (constant variance of residuals).
  3. Independence of errors (no autocorrelation).

### **B. Multiple Linear Regression**
- **Model**: Uses **multiple predictors** (\( x_1, x_2, \dots, x_n \)).
- **Equation**:
  \[
  y = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \dots + \beta_n x_n + \epsilon
  \]

### **C. Evaluation Metrics**
| **Metric**       | **Formula**                          | **Interpretation**                     |
|------------------|--------------------------------------|----------------------------------------|
| **R² (R-Squared)** | \( 1 - \frac{SS_{res}}{SS_{tot}} \) | % variance explained (0 to 1)         |
| **Adjusted R²**  | Adjusts R² for # predictors          | Penalizes overfitting                  |
| **RMSE**         | \( \sqrt{\frac{1}{n} \sum (y_i - \hat{y}_i)^2} \) | Lower = better          |
| **MAE**          | \( \frac{1}{n} \sum |y_i - \hat{y}_i| \)    | Robust to outliers       |

### **D. Example: Python Implementation**
```python
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error

# Sample data
X = [[1], [2], [3]]  # Feature
y = [2, 4, 6]        # Target

# Train model
model = LinearRegression()
model.fit(X, y)

# Predict and evaluate
y_pred = model.predict(X)
print(f"R²: {r2_score(y, y_pred):.2f}, RMSE: {mean_squared_error(y, y_pred, squared=False):.2f}")
```

---

## **2. Non-Linear Regression**
Used when relationships between variables are **not linear**.

### **A. Polynomial Regression**
- **Model**: Fits a polynomial equation (e.g., quadratic, cubic).
- **Equation**:
  \[
  y = \beta_0 + \beta_1 x + \beta_2 x^2 + \dots + \beta_n x^n + \epsilon
  \]
- **Example**:
  ```python
  from sklearn.preprocessing import PolynomialFeatures

  # Transform features to polynomial
  poly = PolynomialFeatures(degree=2)
  X_poly = poly.fit_transform(X)

  # Fit linear regression on polynomial features
  model.fit(X_poly, y)
  ```

### **B. Generalized Additive Models (GAMs)**
- **Model**: Combines smooth functions of predictors.
- **Equation**:
  \[
  y = \beta_0 + f_1(x_1) + f_2(x_2) + \dots + f_n(x_n) + \epsilon
  \]
- **Library**: `pygam` (Python).

### **C. Decision Trees & Random Forests**
- **Non-parametric** methods for complex relationships.
- **Example**:
  ```python
  from sklearn.ensemble import RandomForestRegressor
  model = RandomForestRegressor(n_estimators=100)
  model.fit(X, y)
  ```

### **D. Support Vector Regression (SVR)**
- Uses **kernel trick** for non-linear predictions.
- **Key Parameter**: \( \epsilon \)-insensitive tube.
- **Example**:
  ```python
  from sklearn.svm import SVR
  model = SVR(kernel='rbf', C=1.0, epsilon=0.1)
  model.fit(X, y)
  ```

---

## **3. Choosing Between Linear & Non-Linear Regression**
| **Scenario**                | **Recommended Technique**          |
|-----------------------------|------------------------------------|
| Linear relationship         | Linear Regression                  |
| Curved trends               | Polynomial Regression              |
| High-dimensional interactions| Random Forest / XGBoost            |
| Small dataset with clear pattern | SVR / GAMs                   |

---

## **4. Practical Applications**
### **A. Sales Forecasting**
- **Linear Regression**: Predict sales based on ad spend.
- **Non-Linear**: Seasonal trends (Polynomial/SVR).

### **B. Housing Price Prediction**
- **Multiple Regression**: Square footage, location.
- **Random Forest**: Captures non-linear feature interactions.

### **C. Medical Research**
- **GAMs**: Model non-linear effects of drug dosage.

---

## **5. Key Takeaways**
1. **Linear Regression**: Simple, interpretable, but limited to linear trends.
2. **Polynomial Regression**: Captures curves but risks overfitting.
3. **Tree-Based Methods (Random Forest, XGBoost)**: Handle complex interactions.
4. **SVR/GAMs**: Flexible for non-linearities but computationally heavier.

### **Python Tip**
Use `scikit-learn` for most regression tasks:
```python
# For advanced non-linear models
from xgboost import XGBRegressor
from sklearn.neural_network import MLPRegressor
```
