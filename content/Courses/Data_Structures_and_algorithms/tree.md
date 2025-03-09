---
id: tree
aliases: []
tags: []
title: tree
---

A **tree** is a frequently used data structure to simulate a hierarchical tree structure. Each node of the tree will have a root value and a list of references to other nodes which are called child nodes. From a graph view, a tree is defined as a directed acyclic graph which has N nodes and N - 1 edges.

A **Binary Tree** is one of the most used type of tree structure. It is a tree structure in which each node has at most two child nodes.

## Traverse a Tree

### Pre-order Traversal
It is one of ways to traverse a binary tree. The order for visiting the nodes are - 
- Visit the root
- traverse the left subtree recursively
- traverse the right subtree recursively

```mathematica
        A
       / \
      B   C
     / \   \
    D   E   F
```

the pre order traversal of this tree would be 

```mathematica
A → B → D → E → C → F
```

```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:  
    vector<int> preorderTraversal(TreeNode* root) {
        vector<int> res;
        stack<TreeNode*> st;
        if(!root) return res;
        st.push(root);

        while(!st.empty()) {
            TreeNode* curr = st.top();
            st.pop();
            res.push_back(res);
            
            if(curr->left) st.push(curr->left);
            if(curr->right) st.push(curr->right);
        }
    }
};
```

### In-Order traversal
The order for visiting the nodes are -
- traverse the left subtree recursively
- Visit the root
- traverse the right subtree recursively

```mathematica
        A
       / \
      B   C
     / \   \
    D   E   F
```

the pre order traversal of this tree would be 

```mathematica
D → B → E → A → C → F
```

```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:  
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> res;
        if(!root) return res;
        stack<TreeNode* > st;
        TreeNode* curr = root;
        
        while(curr != nullptr || !st.empty()) {
            while(curr != nullptr) {
                st.push(curr);
                curr = curr->left;
            }
            curr = st.top();
            st.pop();
            res.push_back(curr->val);

            curr = curr->right;
        }
        return res;
    }
};
```

### Post-Order traversal
The order for visiting the nodes are -
- traverse the left subtree recursively
- traverse the right subtree recursively
- Visit the root

```mathematica
        A
       / \
      B   C
     / \   \
    D   E   F
```

the post order traversal of this tree would be 

```mathematica
D → E → B → F → C → A
```
