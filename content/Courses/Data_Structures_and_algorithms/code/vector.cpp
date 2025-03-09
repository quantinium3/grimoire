#include <iostream>
#include <stdexcept>

template <typename T> class Vec {
private:
  std::size_t len_;
  std::size_t cap_;
  T *vec_;
  static constexpr int init_cap_ = 20;

public:
  Vec() : len_(0), cap_(init_cap_) { vec_ = new T[init_cap_]; }
  ~Vec() { delete[] vec_; }

  std::size_t size() const { return len_; }
  std::size_t capacity() { return cap_; }

  void push_back(T const &data) {
    if (len_ >= cap_) {
      cap_ *= 2;
      T *new_vec = new T[cap_];

      for (int i = 0; i < len_; i++) {
        new_vec[i] = vec_[i];
      }

      delete[] vec_;
      vec_ = new_vec;
    }
    vec_[len_++] = data;
  }

  void pop_back() {
    len_ -= 1;
    if (len_ < cap_ / 2) {
      cap_ /= 2;
      T *new_vec = new T[cap_];
      for (int i = 0; i < len_; i++) {
        new_vec[i] = vec_[i];
      }

      delete[] vec_;
      vec_ = new_vec;
    }
  }

  T &operator[](size_t index) {
    if (index > len_ - 1) {
      throw std::out_of_range("n is out of range");
    }
    return vec_[index];
  }

  bool empty() { return len_ == 0; }
  T *begin() { return &vec_[0]; }
  T *end() { return &vec_[len_]; }
};

int main() {
  Vec<int> ml;
  ml.push_back(5);
  ml.push_back(6);
  ml.pop_back();

  for (const int &i : ml) {
    std::cout << i << std::endl;
  }
}
