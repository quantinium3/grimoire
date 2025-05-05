---
id: BackPropogation_In_NL
aliases: []
tags: []
title: BackPropogation In NL
---

### **Backpropagation in Neural Networks: A Step-by-Step Guide**
Backpropagation is the **core algorithm** for training neural networks. It efficiently computes gradients of the loss function with respect to each weight using the **chain rule of calculus**, enabling optimization via gradient descent.

---

## **1. Key Concepts**
### **A. Neural Network Basics**
- **Layers**: Input → Hidden → Output.
- **Neurons**: Apply weights, bias, and activation (e.g., ReLU, Sigmoid).
- **Forward Pass**: Compute predictions from input to output.
- **Loss Function**: Measures prediction error (e.g., Mean Squared Error, Cross-Entropy).

### **B. Backpropagation Intuition**
- **Goal**: Adjust weights to minimize loss.
- **Method**: Propagate error **backward** from output to input, computing gradients for each weight.

---

## **2. Mathematical Foundations**
### **A. Chain Rule**
For a composite function \( f(g(x)) \):
\[
\frac{df}{dx} = \frac{df}{dg} \cdot \frac{dg}{dx}
\]

### **B. Gradient Descent Update Rule**
\[
w_{new} = w_{old} - \eta \cdot \frac{\partial L}{\partial w}
\]
- \( \eta \): Learning rate.
- \( \frac{\partial L}{\partial w} \): Gradient of loss \( L \) w.r.t weight \( w \).

---

## **3. Step-by-Step Backpropagation**
Consider a simple 2-layer NN:
1. **Input Layer** → **Hidden Layer** (activation: Sigmoid \( \sigma \)).
2. **Hidden Layer** → **Output Layer** (activation: Linear for regression).

### **Step 1: Forward Pass**
- **Input to Hidden**:
  \[
  z_h = w_1 x + b_1, \quad a_h = \sigma(z_h)
  \]
- **Hidden to Output**:
  \[
  z_o = w_2 a_h + b_2, \quad \hat{y} = z_o \quad (\text{Linear})
  \]
- **Loss** (MSE):
  \[
  L = \frac{1}{2}(y - \hat{y})^2
  \]

### **Step 2: Backward Pass (Gradient Calculation)**
#### **1. Compute \( \frac{\partial L}{\partial w_2} \) (Output Layer)**
\[
\frac{\partial L}{\partial w_2} = \frac{\partial L}{\partial \hat{y}} \cdot \frac{\partial \hat{y}}{\partial z_o} \cdot \frac{\partial z_o}{\partial w_2}
\]
\[
\frac{\partial L}{\partial \hat{y}} = - (y - \hat{y}), \quad \frac{\partial \hat{y}}{\partial z_o} = 1, \quad \frac{\partial z_o}{\partial w_2} = a_h
\]
\[
\boxed{\frac{\partial L}{\partial w_2} = - (y - \hat{y}) \cdot a_h}
\]

#### **2. Compute \( \frac{\partial L}{\partial w_1} \) (Hidden Layer)**
\[
\frac{\partial L}{\partial w_1} = \frac{\partial L}{\partial \hat{y}} \cdot \frac{\partial \hat{y}}{\partial z_o} \cdot \frac{\partial z_o}{\partial a_h} \cdot \frac{\partial a_h}{\partial z_h} \cdot \frac{\partial z_h}{\partial w_1}
\]
\[
\frac{\partial z_o}{\partial a_h} = w_2, \quad \frac{\partial a_h}{\partial z_h} = \sigma(z_h)(1 - \sigma(z_h)), \quad \frac{\partial z_h}{\partial w_1} = x
\]
\[
\boxed{\frac{\partial L}{\partial w_1} = - (y - \hat{y}) \cdot w_2 \cdot \sigma'(z_h) \cdot x}
\]

#### **3. Update Biases (Similar Logic)**
\[
\frac{\partial L}{\partial b_2} = - (y - \hat{y}), \quad \frac{\partial L}{\partial b_1} = - (y - \hat{y}) \cdot w_2 \cdot \sigma'(z_h)
\]

---

## **4. Generalization to Deep Networks**
For a network with \( L \) layers:
1. **Forward Pass**: Compute activations \( a^{(l)} \) for all layers.
2. **Backward Pass**:
   - Initialize **error term** at output:
     \[
     \delta^{(L)} = \nabla_{\hat{y}} L \odot f'(z^{(L)})
     \]
   - Propagate backward:
     \[
     \delta^{(l)} = (w^{(l+1)})^T \delta^{(l+1)} \odot f'(z^{(l)})
     \]
   - Compute gradients:
     \[
     \frac{\partial L}{\partial w^{(l)}} = \delta^{(l)} (a^{(l-1)})^T, \quad \frac{\partial L}{\partial b^{(l)}} = \delta^{(l)}
     \]

---

## **5. Practical Considerations**
### **A. Activation Derivatives**
| **Activation** | **Derivative \( f'(z) \)**           |
|----------------|--------------------------------------|
| Sigmoid        | \( \sigma(z)(1 - \sigma(z)) \)       |
| ReLU           | \( 1 \text{ if } z > 0 \text{ else } 0 \) |
| Tanh           | \( 1 - \tanh^2(z) \)                 |

### **B. Common Loss Functions**
| **Loss**       | **Derivative \( \frac{\partial L}{\partial \hat{y}} \)** |
|----------------|--------------------------------------------------------|
| MSE            | \( \hat{y} - y \)                                      |
| Cross-Entropy  | \( \frac{\hat{y} - y}{\hat{y}(1 - \hat{y})} \)        |

### **C. Numerical Stability**
- **Vanishing Gradients**: Use ReLU/Leaky ReLU, skip connections (ResNet).
- **Exploding Gradients**: Gradient clipping, weight initialization (Xavier/He).

---

## **6. Pseudocode for Backpropagation**
```python
def backprop(X, y, weights, biases):
    # Forward pass
    z1 = X @ weights['w1'] + biases['b1']
    a1 = sigmoid(z1)
    z2 = a1 @ weights['w2'] + biases['b2']
    y_pred = z2
    
    # Loss gradient (MSE)
    dL_dy = y_pred - y
    
    # Backward pass
    dL_dw2 = a1.T @ dL_dy
    dL_db2 = np.sum(dL_dy, axis=0)
    
    dL_da1 = dL_dy @ weights['w2'].T
    dL_dz1 = dL_da1 * sigmoid_derivative(z1)
    dL_dw1 = X.T @ dL_dz1
    dL_db1 = np.sum(dL_dz1, axis=0)
    
    return {'w1': dL_dw1, 'b1': dL_db1, 'w2': dL_dw2, 'b2': dL_db2}
```

---

## **7. Visual Explanation**
```
Input (x) → [w1, b1] → Hidden Layer (σ) → [w2, b2] → Output (ŷ)
          ↑ Backward pass (gradients) ↑
```
- **Red arrows**: Error propagation from output → input.
- **Blue arrows**: Weight updates using gradients.

---

## **Key Takeaways**
1. Backpropagation computes gradients **efficiently** using the chain rule.
2. **Forward Pass**: Compute predictions and loss.
3. **Backward Pass**: Propagate errors and update weights.
4. **Critical for Deep Learning**: Enables training of complex architectures (CNNs, RNNs).
