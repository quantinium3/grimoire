## Association Rules
Association rules take frequent patterns a step further by identifying relationships between items, often in the form "If A, then B."

- **Example**: {milk, bread} → {butter} means people who buy milk and bread often buy butter.
- **Key Metrics**:
  - **Confidence**: How often the rule holds true.  
    - Formula: Confidence(A → B) = Support(A ∪ B) / Support(A).
  - **Lift**: Measures how much more likely B occurs with A compared to if they were independent.  
    - Formula: Lift(A → B) = Support(A ∪ B) / (Support(A) × Support(B)).
- **Use Case**: Retailers use this for product placement or recommendations.

## Correlations
Correlation analysis looks at how strongly two variables (or items) are related, often beyond simple co-occurrence.

- **Key Metric**: Correlation coefficient (e.g., Pearson correlation), ranging from -1 (negative correlation) to +1 (positive correlation), with 0 meaning no correlation.
- **Difference from Association**: Correlation measures strength and direction of relationships (not just presence), and it’s often applied to numerical data rather than categorical itemsets.
- **Example**: If sales of ice cream and sunscreen both rise in summer, they might have a positive correlation.