---
id: Complete Search
aliases: []
tags: []
title: Complete Search
---

the idea of complete search is to generate all the possible solution to the problem using brute force and then select the best solution or count the number of solutions, depending on the problem.

its fine if the input is small but would give tle or mle if the input is large.

## Generating subsets

### Using recursive backtracking
```cpp
vector<int> subset;
int n = 3;

void search(int k) {
    if(k == n ) {
        cout << "{ ";
        for (int num : subset) cout << num << " ";
        cout << "}" << endl;
    } else {
        subset.push_back(k);
        search(k + 1);
        subset.pop_back();
        search(k + 1);
    }
}
int main() {
    search(0); // Start with the first element (index 0)
    return 0;
}
```

### Using bitset
```cpp
vector<vector<int>> genSet(vector<int>& nums) {
    int n = nums.size();
    int totalSubsets = 1 << n;
    vector<vector<int>> subsets;
    for(int b = 0; b < totalSubsets; b++) {
        vector<int> subset;
        for(int i = 0; i < n;i++) {
            if (b & (1 << i)) subset.push_back(nums[i]); // Push nums[i] instead of i
        }
        subsets.push_back(subset);
    }
    return subsets;
}

000 -> {}      // Empty subset
001 -> {1}     // 1st element included
010 -> {2}     // 2nd element included
011 -> {1,2}   // 1st and 2nd elements included
100 -> {3}     // 3rd element included
101 -> {1,3}   // 1st and 3rd elements included
110 -> {2,3}   // 2nd and 3rd elements included
111 -> {1,2,3} // All elements included

```

## Generating Permutations
### Using `next_permutation`
c++ std library contains a function `next_permutation` that can be used for this
```cpp
vector<int> perm = {1, 2, 3};
do {
    // process
} while(next_permutation(perm.begin(), perm.end()));
```

### Using recursive backtracking
```cpp
void backtrack(vector<int>& nums, int start, vector<vector<int>>& result) {
    if (start == nums.size()) {
        result.push_back(nums); // Store a valid permutation
        return;
    }
    
    for (int i = start; i < nums.size(); i++) {
        swap(nums[start], nums[i]);       // Swap current element with the start
        backtrack(nums, start + 1, result); // Recur for next index
        swap(nums[start], nums[i]);       // Backtrack (undo swap)
    }
}

vector<vector<int>> generatePermutations(vector<int>& nums) {
    vector<vector<int>> result;
    backtrack(nums, 0, result);
    return result;
}
```


