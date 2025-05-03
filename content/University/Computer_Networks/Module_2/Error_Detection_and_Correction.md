### 1. Types of Errors

**What is it?**
Errors occur when data bits are altered during transmission or storage due to noise, interference, or hardware faults. Understanding error types helps in designing appropriate detection and correction mechanisms.

**Key Types:**
- **Single-Bit Error**:
  - Only one bit in the data flips (e.g., `1010` → `1000`).
  - Common in low-noise environments.
  - Example: A cosmic ray flips a single bit in memory.
- **Burst Error**:
  - A sequence of consecutive bits is corrupted.
  - Length of the burst is the number of bits from the first to the last error (e.g., `101010` → `100110`, burst length = 3).
  - Common in noisy channels like wireless communication.
- **Multiple-Bit Error (Non-Burst)**:
  - Multiple bits are corrupted, but not consecutively (e.g., `101010` → `111100`, errors in positions 2 and 5).
  - Less common but harder to detect/correct.

![[Pasted image 20250503182607.png]]
### Sender Side (Encoder)
The sender’s job is to encode the original message with redundancy to enable error detection or correction at the receiver.

1. **Message**:
   - This is the original data the sender wants to transmit (e.g., a binary string like `1011`).
   - It consists of `k` bits of actual information.

2. **Generator**:
   - The generator is the component (or algorithm) that adds redundancy to the message.
   - It takes the original message and appends redundant bits to create a codeword.
   - **How it Works**:
     - Redundancy can be added using techniques like parity bits, Hamming Code, or CRC.
     - For example, in CRC, the generator polynomial (e.g., `x^3 + 1`) is used to compute a check value that’s appended to the message.
   - **Output**: A codeword consisting of the original message plus redundant bits.
     - If the message is `k` bits, and `r` redundant bits are added, the codeword is `n = k + r` bits.

3. **Message and Redundancy**:
   - This block represents the final codeword ready for transmission.
   - It includes:
     - The original message (`k` bits).
     - Redundant bits (`r` bits) for error detection/correction.
   - Example: For a message `1101` with a 3-bit CRC `100`, the transmitted codeword is `1101100`.

4. **Unreliable Transmission**:
   - The codeword is sent over an unreliable channel (e.g., a noisy wireless link).
   - Errors may occur during transmission (e.g., `1101100` might become `1100100` if a bit flips).

### Receiver Side (Decoder)
The receiver’s job is to process the received data, detect any errors, and either correct them or discard the data if errors are uncorrectable.

1. **Received Information**:
   - This is the data the receiver gets after transmission.
   - It may be identical to the sent codeword (`message + redundancy`) or may contain errors due to the unreliable channel.
   - Example: Sent `1101100`, but received `1100100` (bit 4 flipped).

2. **Checker**:
   - The checker is the component that examines the received codeword to detect errors.
   - **How it Works**:
     - It uses the redundant bits to verify the integrity of the data.
     - Depending on the technique:
       - **Error Detection**: Determines if an error exists (e.g., CRC checks if the remainder is 0).
       - **Error Correction**: Identifies and fixes errors (e.g., Hamming Code uses a syndrome to locate the error).
   - **Examples**:
     - **CRC**: Divide the received codeword by the generator polynomial. If the remainder is 0, no error; otherwise, an error is detected.
     - **Hamming Code**: Compute a syndrome to detect and correct a single-bit error.
   - **Outcome**:
     - If no errors are detected, the message is accepted.
     - If errors are detected:
       - For error correction: Fix the error (e.g., Hamming Code flips the erroneous bit).
       - For error detection only: Discard the data or request retransmission (e.g., CRC in Ethernet).

3. **Correct or Discard**:
   - This step indicates the action taken by the decoder:
     - **Correct**: If the system supports error correction (e.g., Hamming Code), the checker fixes the error, and the original message is recovered.
     - **Discard**: If the system only supports error detection (e.g., CRC), or if the errors are uncorrectable (e.g., too many bit flips for Hamming Code), the data is discarded.
     - In systems with retransmission (e.g., ARQ protocols), the receiver may request the sender to retransmit the data.

4. **Message**:
   - This is the final output at the receiver.
   - If the checker successfully detects and corrects errors (or if no errors occurred), this is the original message (e.g., `1101`).
   - If the data is discarded, no message is output, and the receiver may take further action (e.g., request retransmission).

### What is Block Coding?

Block coding is a method used to add redundancy to digital data to enable error detection or correction. It works by dividing the data into fixed-size blocks and appending redundant bits to each block, creating a codeword that can be transmitted or stored reliably. The receiver uses these redundant bits to detect or correct errors introduced during transmission or storage.

**Key Idea**: Each block of data is treated independently, and redundancy ensures the receiver can identify or fix errors without needing to retransmit the data (in the case of correction).

---

### How Block Coding Works

1. **Data Division**:
   - The message (data to be sent) is divided into blocks of **k** bits. Each block is processed independently.
   - Example: A 16-bit message `1011001110101100` might be split into four 4-bit blocks: `1011`, `0011`, `1010`, `1100`.

2. **Adding Redundancy**:
   - For each k-bit block, **r** redundant bits are added to form an **n-bit codeword**, where `n = k + r`.
   - These redundant bits are calculated based on the data bits using a specific coding scheme.
   - The redundant bits enable the receiver to detect or correct errors.

3. **Codeword**:
   - The resulting n-bit codeword consists of the original k data bits plus the r redundant bits.
   - Example: A 4-bit data block `1011` with 1 parity bit (r = 1) becomes a 5-bit codeword `10111` (even parity).

4. **Transmission**:
   - The codeword is transmitted over a communication channel or stored in a medium (e.g., disk, memory).

5. **Receiver Processing**:
   - The receiver checks the received codeword using the redundant bits:
     - **Error Detection**: Verifies if the codeword is valid (e.g., parity check fails if the number of 1s is odd).
     - **Error Correction**: Identifies and corrects errors (e.g., Hamming Code locates and fixes a single-bit error).

---

### Key Properties of Block Coding

- **Code Rate**:
  - Defined as `k/n`, the ratio of data bits to total bits in the codeword.
  - A higher code rate (closer to 1) means less redundancy but weaker error handling.
  - Example: For `k = 4`, `r = 3`, `n = 7`, the code rate is `4/7 ≈ 0.57`.

- **Systematic vs. Non-Systematic**:
  - **Systematic**: The codeword contains the original data bits followed by the redundant bits (e.g., `1011` + parity `1` = `10111`).
  - **Non-Systematic**: The codeword is a transformed version of the data, not directly containing the original bits (less common).

### Advantages of Block Coding

- **Reliability**: Enables detection and correction of errors, ensuring data integrity.
- **Simplicity**: Fixed block size makes implementation straightforward (e.g., in hardware).
- **Flexibility**: Different block codes (e.g., Hamming, CRC) can be chosen based on the type of errors expected (single-bit vs. burst).
- **No Feedback Required**: For error correction, no retransmission is needed, unlike detection-only methods.

---

### Limitations of Block Coding

- **Overhead**: Adding redundant bits increases the data size, reducing the effective data rate.
- **Limited Error Handling**:
  - Simple codes like parity can’t correct errors or detect all multi-bit errors.
  - Hamming Code corrects only single-bit errors.
- **Complexity**: Advanced codes like Reed-Solomon require more computational resources for encoding/decoding.
- **Fixed Block Size**: May not be efficient for variable-length data streams (unlike convolutional coding).


### Applications of Block Coding

- **Communication Systems**:
  - Hamming Codes: Used in memory systems (e.g., ECC RAM) to correct single-bit errors.
  - CRC: Used in Ethernet, Wi-Fi, and USB to detect burst errors.
- **Storage Systems**:
  - Reed-Solomon: Used in CDs, DVDs, and SSDs to correct errors due to scratches or defects.
- **Networking**:
  - CRC in packet headers (e.g., Ethernet frames) ensures data integrity.
- **Space Communication**:
  - Block codes like Reed-Solomon are used in satellite and deep-space communication to handle high error rates.
  
---

### Hamming Distance
The **Hamming Distance** between two codewords (or binary strings) of equal length is the number of positions at which their bits differ. It’s a metric used to quantify how "different" two codewords are, which directly impacts a code’s ability to detect and correct errors.

- **Formal Definition**: For two codewords `C1` and `C2` of length `n`, the Hamming Distance `d(C1, C2)` is the number of bit positions where `C1[i] ≠ C2[i]`.
- **Example**:
  - `C1 = 10110`
  - `C2 = 10011`
  - Compare bit by bit: `10110` vs `10011`
    - Position 1: `1` vs `1` → Same
    - Position 2: `0` vs `0` → Same
    - Position 3: `1` vs `0` → Different
    - Position 4: `1` vs `1` → Same
    - Position 5: `0` vs `1` → Different
  - Hamming Distance = 2 (differ at positions 3 and 5).


### Minimum Hamming Distance (d_min)

The **Minimum Hamming Distance** (`d_min`) of a code is the smallest Hamming Distance between any two distinct valid codewords in the code. It’s a critical property that determines the error-handling capability of the code.

- **How to Calculate**:
  - List all valid codewords in the code.
  - Compute the Hamming Distance between every pair of codewords.
  - The smallest distance is `d_min`.
- **Example**:
  - Code with codewords: `{000, 011, 101, 110}`
  - Pairwise Hamming Distances:
    - `000` vs `011`: Differ at positions 2, 3 → Distance = 2
    - `000` vs `101`: Differ at positions 1, 3 → Distance = 2
    - `000` vs `110`: Differ at positions 1, 2 → Distance = 2
    - `011` vs `101`: Differ at positions 1, 2 → Distance = 2
    - `011` vs `110`: Differ at positions 1, 3 → Distance = 2
    - `101` vs `110`: Differ at positions 2, 3 → Distance = 2
  - `d_min = 2` (smallest distance among all pairs).


### Significance of Hamming Distance in Error Detection and Correction

The Hamming Distance, particularly `d_min`, determines how many errors a code can detect or correct:

1. **Error Detection**:
   - A code can detect up to `d_min - 1` errors.
   - **Reason**: If fewer than `d_min` bits are flipped, the received word cannot match another valid codeword, so an error is detected.
   - **Example**:
     - Code with `d_min = 2` (e.g., `{000, 011, 101, 110}`).
     - Can detect `2 - 1 = 1` error.
     - Sent: `000`, Received: `001` (1 bit flipped) → Not a valid codeword → Error detected.
     - Sent: `000`, Received: `011` (2 bits flipped) → Matches a valid codeword → Error not detected.

2. **Error Correction**:
   - A code can correct up to `t = floor((d_min - 1)/2)` errors.
   - **Reason**: To correct an error, the received word must be closer to the correct codeword than any other valid codeword. This requires the Hamming Distance to the correct codeword to be less than half the distance to any other codeword.
   - **Example**:
     - Code with `d_min = 3` (e.g., Hamming Code).
     - Can correct `floor((3-1)/2) = 1` error.
     - Sent: `000`, Received: `001` (1 bit flipped) → Closer to `000` than any other codeword → Correct to `000`.
     - Sent: `000`, Received: `011` (2 bits flipped) → May be equidistant from multiple codewords → Cannot reliably correct.

### Hamming Distance in Block Coding

Block coding relies on Hamming Distance to design codes with desired error-handling capabilities:

- **Parity Check Code**:
  - Adds a single parity bit (e.g., even parity).
  - Example Code: `{0000, 0011, 0101, 0110, 1001, 1010, 1100, 1111}` (4-bit codewords with even parity).
  - `d_min = 2` (e.g., `0000` vs `0011` differ in 2 bits).
  - Detects `2 - 1 = 1` error, corrects `floor((2-1)/2) = 0` errors (no correction).

- **Hamming Code**:
  - Designed to have `d_min = 3`.
  - Example: (7,4) Hamming Code (4 data bits, 3 parity bits).
    - Codewords like `0000000`, `0110011`, etc.
    - `d_min = 3`.
    - Detects `3 - 1 = 2` errors, corrects `floor((3-1)/2) = 1` error.
  - **How Correction Works**:
    - Sent: `0110011`, Received: `0111011` (bit 4 flipped).
    - Compute syndrome (based on parity checks) → Points to bit 4 → Flip to correct.

- **Increasing d_min**:
  - To improve error handling, increase `d_min` by adding more redundancy.
  - Example: A code with `d_min = 5` (e.g., Reed-Solomon) can correct `floor((5-1)/2) = 2` errors.

### Practical Example: Hamming Code and Hamming Distance

**Problem**: Consider a (7,4) Hamming Code with 4 data bits and 3 parity bits. Verify its error correction capability using Hamming Distance.

1. **Code Structure**:
   - Data bits: 4 (`k = 4`).
   - Parity bits: 3 (`r = 3`), since `2^3 = 8 ≥ 4 + 3 + 1`.
   - Codeword length: `n = 7`.
   - `d_min = 3` (by design of Hamming Code).

2. **Sample Codewords**:
   - Data `0000` → Codeword `0000000`.
   - Data `0110` → Codeword `0110110` (after calculating parity bits).
   - Hamming Distance between `0000000` and `0110110`:
     - Differ at positions 2, 3, 5, 6 → Distance = 4.
   - For any two codewords in a Hamming Code, the minimum distance is 3.

3. **Error Handling**:
   - `d_min = 3`.
   - Detects `3 - 1 = 2` errors.
   - Corrects `floor((3-1)/2) = 1` error.
   - Example:
     - Sent: `0000000`, Received: `0100000` (bit 2 flipped).
     - Syndrome points to bit 2 → Correct to `0000000`.

### Applications of Hamming Distance

- **Error Detection/Correction**:
  - Determines the capability of codes like Hamming, CRC, and Reed-Solomon.
- **Code Design**:
  - Engineers design codes with a specific `d_min` to meet error-handling requirements.
  - Example: Hamming Code ensures `d_min = 3` for single-bit correction.
- **Communication Systems**:
  - Used in memory systems (ECC RAM), networking (Ethernet CRC), and storage (CDs/DVDs).
- **Cryptography**:
  - Hamming Distance is used in some cryptographic algorithms to measure differences between keys or hashes.

---
### Linear Block Codes

A **Linear Block Code** is a type of block code where the codewords form a linear subspace over a finite field (typically GF(2) for binary codes). This means that the codewords are generated using linear combinations of basis vectors, and the code has algebraic properties that simplify encoding, decoding, and error handling.


- **Block Code**: Data is divided into fixed-size blocks, and redundant bits are added to each block to form a codeword.
- **Linear**: The codewords satisfy the property of linearity—any linear combination of codewords (using modulo-2 arithmetic for binary codes) is also a valid codeword.

---

### Key Properties of Linear Block Codes

1. **Linearity**:
   - For any two codewords `C1` and `C2` in the code, their sum (modulo-2, i.e., XOR) is also a codeword.
   - Example: If `0000` and `1101` are codewords, then `0000 XOR 1101 = 1101` must also be a codeword.
   - This property simplifies encoding and decoding, as the code can be described using a **generator matrix**.

2. **Block Structure**:
   - Each codeword has a fixed length `n`.
   - Consists of `k` data bits and `r = n - k` redundant bits (parity or check bits).
   - Example: A (7,4) code has `n = 7` bits total, `k = 4` data bits, and `r = 3` redundant bits.

3. **Code Rate**:
   - The ratio of data bits to total bits: `k/n`.
   - Example: For a (7,4) code, code rate = `4/7 ≈ 0.57`.

4. **Minimum Hamming Distance (d_min)**:
   - The smallest Hamming Distance (number of bit differences) between any two distinct codewords.
   - For linear codes, `d_min` is equal to the minimum weight of any non-zero codeword (weight = number of 1s in a codeword).
   - Determines error-handling capability:
     - Detects up to `d_min - 1` errors.
     - Corrects up to `t = floor((d_min - 1)/2)` errors.

5. **Systematic Form**:
   - Most linear block codes are systematic, meaning the codeword consists of the original `k` data bits followed by `r` check bits.
   - Example: Data `1011` with 3 check bits might become `1011001` (data + check bits).

---

### Encoding and decoding for simple parity check rule

![[Pasted image 20250503190829.png]]

### Sender Side (Encoder)

The sender’s role is to encode the data by adding a parity bit to enable error detection at the receiver.

1. **Dataword (`a_3, a_2, a_1, a_0`)**:
   - The dataword is the original 4-bit data to be transmitted: `a_3 a_2 a_1 a_0`.
   - Example: `1011` (`a_3 = 1, a_2 = 0, a_1 = 1, a_0 = 1`).

2. **Generator**:
   - The generator computes the parity bit `r_0` based on the data bits.
   - **How it Works**:
     - In a simple parity-check code, the parity bit is calculated to ensure the total number of 1s in the codeword (data bits + parity bit) is even (for even parity) or odd (for odd parity).
     - The diagram shows the parity bit `r_0` being computed as the XOR of the data bits:
       - `r_0 = a_3 ⊕ a_2 ⊕ a_1 ⊕ a_0`
     - **XOR Operation**: 
       - `0 ⊕ 0 = 0`, `0 ⊕ 1 = 1`, `1 ⊕ 0 = 1`, `1 ⊕ 1 = 0`.
     - This ensures even parity (the number of 1s in `a_3 a_2 a_1 a_0 r_0` is even).
   - **Example**:
     - Dataword: `1011`.
     - Number of 1s: 3 (odd).
     - `r_0 = 1 ⊕ 0 ⊕ 1 ⊕ 1`:
       - `1 ⊕ 0 = 1`
       - `1 ⊕ 1 = 0`
       - `0 ⊕ 1 = 1`
     - So, `r_0 = 1`.

3. **Parity Bit (`r_0`)**:
   - The parity bit `r_0` is appended to the dataword to form the codeword.
   - In this diagram, `r_0` is the redundant bit added to the 4-bit dataword, making the codeword 5 bits long.

4. **Codeword (`a_3, a_2, a_1, a_0, r_0`)**:
   - The codeword is the 5-bit string: `a_3 a_2 a_1 a_0 r_0`.
   - Example: For dataword `1011`, `r_0 = 1`, so the codeword is `10111`.
   - Total number of 1s in `10111`: 4 (even), which satisfies even parity.

5. **Unreliable Transmission**:
   - The codeword is sent over an unreliable channel, where errors (bit flips) may occur.
   - Example: Sent `10111`, but received `10101` (bit 3 flipped from 1 to 0).

### Receiver Side (Decoder)

The receiver’s role is to check the received codeword for errors using the parity bit and decide whether to accept the data or discard it.

1. **Codeword (`b_3, b_2, b_1, b_0, q_0`)**:
   - The received codeword is labeled as `b_3 b_2 b_1 b_0 q_0`, where:
     - `b_3 b_2 b_1 b_0` correspond to the received data bits (originally `a_3 a_2 a_1 a_0`).
     - `q_0` is the received parity bit (originally `r_0`).
   - Example: Received `10101` (bit 3 flipped):
     - `b_3 = 1, b_2 = 0, b_1 = 1, b_0 = 0, q_0 = 1`.

2. **Checker**:
   - The checker computes a **syndrome** to detect errors.
   - **How it Works**:
     - The syndrome `s_0` is calculated by XORing all bits of the received codeword (data bits + parity bit):
       - `s_0 = b_3 ⊕ b_2 ⊕ b_1 ⊕ b_0 ⊕ q_0`
     - For even parity, if `s_0 = 0`, the number of 1s is even → No error (or an even number of errors, which is undetectable).
     - If `s_0 = 1`, the number of 1s is odd → Error detected (e.g., a single-bit error).
   - **Example**:
     - Received: `10101`.
     - `s_0 = 1 ⊕ 0 ⊕ 1 ⊕ 0 ⊕ 1`:
       - `1 ⊕ 0 = 1`
       - `1 ⊕ 1 = 0`
       - `0 ⊕ 0 = 0`
       - `0 ⊕ 1 = 1`
     - `s_0 = 1` → Error detected (odd number of 1s: 3).

3. **Syndrome (`s_0`)**:
   - The syndrome `s_0` is the output of the checker.
   - `s_0 = 0`: No detectable error.
   - `s_0 = 1`: Error detected (e.g., single-bit error or any odd number of errors).

4. **Decision Logic**:
   - The decision logic uses the syndrome to determine the action:
     - If `s_0 = 0`: The codeword is accepted, and the dataword `b_3 b_2 b_1 b_0` is output as the recovered data.
     - If `s_0 = 1`: The codeword is discarded (indicated by the `D` output), as an error is detected but cannot be corrected with a simple parity-check code.
   - **Example**:
     - `s_0 = 1` → Error detected → Discard the codeword.
     - In a real system, the receiver might request retransmission (e.g., using ARQ).

5. **Dataword (`a_3, a_2, a_1, a_0`)**:
   - If the codeword is accepted (`s_0 = 0`), the dataword `b_3 b_2 b_1 b_0` is output as the recovered data, ideally matching the original `a_3 a_2 a_1 a_0`.
   - If discarded, no dataword is output, and further action (e.g., retransmission) may be taken.

### How It All Ties Together

- **Sender (Encoder)**:
  - Takes a 4-bit dataword `a_3 a_2 a_1 a_0`.
  - Computes the parity bit `r_0` using XOR to ensure even parity.
  - Forms the 5-bit codeword `a_3 a_2 a_1 a_0 r_0` and transmits it.
- **Receiver (Decoder)**:
  - Receives the codeword `b_3 b_2 b_1 b_0 q_0`, which may have errors.
  - Computes the syndrome `s_0` by XORing all bits.
  - Uses the syndrome to decide whether to accept the data (output `b_3 b_2 b_1 b_0`) or discard it.

### Example Walkthrough

1. **Sender**:
   - **Dataword**: `1011`.
   - **Parity Bit**: `r_0 = 1 ⊕ 0 ⊕ 1 ⊕ 1 = 1`.
   - **Codeword**: `10111`.
   - Number of 1s: 4 (even) → Satisfies even parity.

2. **Unreliable Transmission**:
   - Sent: `10111`.
   - Received: `10101` (bit 3 flipped from 1 to 0).

3. **Receiver**:
   - **Received Codeword**: `10101`.
   - **Syndrome**: `s_0 = 1 ⊕ 0 ⊕ 1 ⊕ 0 ⊕ 1 = 1`.
   - **Decision**: `s_0 = 1` → Error detected → Discard the codeword.

**No Error Case**:
- Received: `10111` (no errors).
- `s_0 = 1 ⊕ 0 ⊕ 1 ⊕ 1 ⊕ 1 = 0`.
- `s_0 = 0` → Accept → Output dataword: `1011`.

---


### Types of Linear Block Codes

1. **Hamming Codes**:
   - Designed for single-bit error correction.
   - `d_min = 3` → Corrects 1 error, detects 2 errors.
   - Example: (7,4) Hamming Code (as above).

2. **Cyclic Codes**:
   - A subset of linear block codes where a cyclic shift of a codeword is also a codeword.
   - Example: CRC (Cyclic Redundancy Check).
   - Efficient for burst error detection.

3. **Reed-Solomon Codes**:
   - Linear block codes that operate on symbols (groups of bits).
   - Used for correcting multiple errors.
   - Applications: CDs, DVDs, QR codes.

---

### Encoder and decoder for a hamming code
![[Pasted image 20250503191117.png]]

**Figure 10.12: The structure of the encoder and decoder for a Hamming code** illustrates the encoding and decoding process for a Hamming code, a linear block code designed to correct single-bit errors.

### Sender Side (Encoder):
- **Dataword (`a_3, a_2, a_1, a_0`)**: The 4-bit input data (e.g., `1011`).
- **Generator**: Adds 3 parity bits (`r_2, r_1, r_0`) using XOR operations based on specific data bit positions (Hamming code rules).
  - Example: For `1011`, parity bits are computed to form a 7-bit codeword `a_3 a_2 a_1 a_0 r_2 r_1 r_0` (e.g., `1011010`).
- **Codeword**: The 7-bit output (`a_3 a_2 a_1 a_0 r_2 r_1 r_0`) is transmitted over an unreliable channel.

### Receiver Side (Decoder):
- **Codeword (`b_3, b_2, b_1, b_0, q_2, q_1, q_0`)**: The received 7-bit codeword, which may have errors (e.g., `1010010`, bit 4 flipped).
- **Checker**: Computes a 3-bit syndrome (`s_2, s_1, s_0`) using XOR operations on specific bit positions.
  - Example: Syndrome `011` (binary 3) indicates an error in bit 4.
- **Correction Logic**: Uses the syndrome to locate and correct the error (e.g., flip bit 4: `1010010` → `1011010`).
- **Dataword (`a_3, a_2, a_1, a_0`)**: Outputs the corrected 4-bit data (e.g., `1011`).

![[Pasted image 20250503191233.png]]
### Key Points:
- Hamming code corrects single-bit errors (`d_min = 3`).
- Encoding adds parity bits; decoding uses the syndrome to correct errors.
- Example: Encode `1011` → `1011010`, receive `1010010`, correct to `1011010`, output `1011`.

---
### Burst error correction using Hamming code
![[Pasted image 20250503191421.png]]

### Sender Side:
- Four Hamming codewords (Codeword 1 to 4) are shown, each with 7 bits (e.g., Codeword 1: `1111111`, Codeword 2: `1100010`).
- Bits are interleaved column-wise into a single data unit:
  - Bit 1 of all codewords: `0111` (from Codewords 4, 3, 2, 1).
  - Bit 2 of all codewords: `0011`, and so on.
- Resulting data unit: `011100110101...` (28 bits total).

### Transmission:
- A burst error corrupts 4 consecutive bits in the data unit (highlighted as "Corrupted bits").

### Receiver Side:
- The received data unit is de-interleaved back into the four codewords:
  - Codeword 1: `1111011` (bit 3 corrupted).
  - Codeword 2: `1000110` (bit 3 corrupted).
  - Codeword 3: `0110000` (bit 3 corrupted).
  - Codeword 4: `0001001` (bit 3 corrupted).
- Each codeword now has only a single-bit error, which a Hamming code (`d_min = 3`) can correct.
- Hamming decoding corrects each codeword back to its original form (e.g., `1111011` → `1111111`).

### Key Points:
- Interleaving spreads a burst error across multiple codewords, converting it into single-bit errors per codeword.
- Hamming code corrects these single-bit errors, effectively handling the burst error.
### Advantages of Linear Block Codes
- **Simplicity**: Encoding/decoding is efficient using matrix operations.
- **Error Handling**: Well-defined error detection/correction capabilities based on `d_min`.
- **Hardware-Friendly**: Matrix operations (e.g., XOR, AND) are easy to implement in hardware.
- **Systematic Form**: Easy to extract the original data from the codeword.

---
### Cyclic Codes

A **Cyclic Code** is a type of linear block code with an additional property: if a codeword is cyclically shifted (i.e., bits are rotated left or right), the result is another valid codeword in the same code. This cyclic property makes them efficient for implementation and particularly good at detecting burst errors.

- **Linear**: Cyclic codes are linear block codes, meaning the XOR of any two codewords is another valid codeword.
- **Block Code**: Data is divided into blocks of `k` bits, and `r` redundant bits are added to form an `n`-bit codeword (`n = k + r`).
- **Cyclic**: A cyclic shift of any codeword produces another codeword.

**Example**:
- Code: `{000, 110, 011, 101}`.
- Codeword: `110`.
- Cyclic shift (left): `110` → `101` (shift left, move the leftmost bit to the right).
- `101` is also a codeword, confirming the cyclic property.

### Key Properties of Cyclic Codes

1. **Cyclic Property**:
   - A cyclic shift of a codeword is another codeword.
   - Example: For a 3-bit code, shifting `110` to `101` or `011` (both directions) must yield valid codewords if the code is cyclic.

2. **Linearity**:
   - As a linear block code, the XOR of any two codewords is another codeword.
   - Example: `110 ⊕ 011 = 101`, which is also a codeword in the example above.

3. **Polynomial Representation**:
   - Cyclic codes are defined using polynomials over GF(2) (binary field).
   - Each `n`-bit codeword `c_0 c_1 ... c_{n-1}` is represented as a polynomial:
     - `C(x) = c_0 + c_1x + c_2x^2 + ... + c_{n-1}x^{n-1}`
   - Example: Codeword `110` → `C(x) = 1 + 1x + 0x^2 = 1 + x`.
   - Cyclic shift corresponds to polynomial multiplication by `x` modulo `x^n - 1`:
     - Shift `110` to `101`: `C(x) = 1 + x` → `xC(x) = x + x^2` → Modulo `x^3 - 1` → `1 + x^2` (which is `101`).

4. **Generator Polynomial**:
   - A cyclic code is generated by a single polynomial `G(x)` of degree `r = n - k`, which divides `x^n - 1`.
   - All codewords are multiples of `G(x)` (modulo `x^n - 1`).
   - Example: For an (n,k) cyclic code, `G(x)` has degree `r`, and codewords are of the form `C(x) = M(x) · G(x)`, where `M(x)` is the message polynomial.

5. **Minimum Hamming Distance (d_min)**:
   - Determines error-handling capability:
     - Detects up to `d_min - 1` errors.
     - Corrects up to `t = floor((d_min - 1)/2)` errors.
   - Cyclic codes can be designed with specific `d_min` (e.g., CRC has high `d_min` for burst error detection).

### Structure of Cyclic Codes
Cyclic codes are typically systematic, meaning the codeword contains the original data bits followed by redundant bits.

#### Polynomial Representation:
- **Message Polynomial**: A `k`-bit message `m_0 m_1 ... m_{k-1}` → `M(x) = m_0 + m_1x + ... + m_{k-1}x^{k-1}`.
- **Codeword Polynomial**: An `n`-bit codeword → `C(x) = c_0 + c_1x + ... + c_{n-1}x^{n-1}`.
- **Generator Polynomial**: `G(x)` of degree `r = n - k`.

#### Encoding:
1. Represent the message as `M(x)`.
2. Multiply by `x^r` to shift left by `r` bits (append `r` zeros): `x^r · M(x)`.
3. Divide by `G(x)` to get the remainder `R(x)` (degree < `r`):
   - `x^r · M(x) = Q(x) · G(x) + R(x)`
4. Codeword: `C(x) = x^r · M(x) - R(x)` (in GF(2), subtraction is XOR).
   - This ensures `C(x)` is a multiple of `G(x)`.

#### Decoding:
- Use the parity-check matrix or polynomial division to compute the syndrome.
- Syndrome `S(x) = R(x) mod G(x)`:
  - If `S(x) = 0`, no error.
  - If `S(x) ≠ 0`, an error is detected, and error patterns can be corrected (for error-correcting cyclic codes).

### CRC encoder and decoder
![[Pasted image 20250503194106.png]]

### Sender Side (Encoder)

The sender encodes the data by appending a CRC remainder to enable error detection at the receiver.

1. **Dataword (`a_3, a_2, a_1, a_0`)**:
   - The 4-bit input data: `a_3 a_2 a_1 a_0`.
   - Example: `1101`.

2. **Generator**:
   - The generator computes the CRC remainder using polynomial division (modulo-2).
   - **Process**:
     - Append `r` zeros to the dataword (where `r` is the degree of the generator polynomial).
     - In the diagram, `r = 3` (three check bits: `r_2, r_1, r_0`), so append `000`.
     - Example: `1101` → `1101000`.
     - Divide this by the generator polynomial (represented as the "Divisor").
     - The divisor is typically `G(x)` (e.g., `x^3 + x + 1` → `1011` for a degree-3 polynomial).
     - Division is done using XOR (modulo-2 arithmetic).
   - **Example**:
     - Data: `1101000`.
     - Divisor: `1011`.
     - Divide `1101000` by `1011` → Remainder = `100` (`d_2 d_1 d_0`).

3. **Remainder (`d_2, d_1, d_0`)**:
   - The remainder from the division is the CRC (3 bits in this case).
   - Example: Remainder `100` → `r_2 = 1, r_1 = 0, r_0 = 0`.

4. **Codeword (`a_3, a_2, a_1, a_0, r_2, r_1, r_0`)**:
   - The codeword is the dataword plus the CRC remainder: `a_3 a_2 a_1 a_0 r_2 r_1 r_0`.
   - Example: `1101` + `100` → `1101100`.
   - This codeword is a multiple of the generator polynomial (i.e., divisible by `G(x)` with no remainder).

5. **Unreliable Transmission**:
   - The codeword is sent over an unreliable channel, where errors may occur.
   - Example: Sent `1101100`, received `1100100` (bit 4 flipped).

### Receiver Side (Decoder)

The receiver checks the received codeword for errors using the CRC and decides whether to accept or discard the data.

1. **Codeword (`b_3, b_2, b_1, b_0, q_2, q_1, q_0`)**:
   - The received codeword: `b_3 b_2 b_1 b_0 q_2 q_1 q_0`.
   - `b_3 b_2 b_1 b_0` are the data bits, `q_2 q_1 q_0` are the received CRC bits.
   - Example: Received `1100100`.

2. **Checker**:
   - The checker recomputes the remainder by dividing the received codeword by the same divisor (generator polynomial).
   - **Process**:
     - Divide `b_3 b_2 b_1 b_0 q_2 q_1 q_0` by `G(x)` (e.g., `1011`).
     - The result is the syndrome (`s_2 s_1 s_0`).
     - If the syndrome is `000`, the codeword is valid (no detectable error).
     - If the syndrome is non-zero, an error is detected.
   - **Example**:
     - Received: `1100100`.
     - Divide `1100100` by `1011` → Remainder ≠ 0 (e.g., `101`).
     - Syndrome: `s_2 s_1 s_0 = 101`.

3. **Syndrome (`s_2, s_1, s_0`)**:
   - The syndrome indicates whether an error occurred:
     - `s_2 s_1 s_0 = 000`: No error (or undetectable error).
     - `s_2 s_1 s_0 ≠ 000`: Error detected.
   - Example: `s_2 s_1 s_0 = 101` → Error detected.

4. **Decision Logic**:
   - Based on the syndrome:
     - If `s_2 s_1 s_0 = 000`: Accept the codeword, output `b_3 b_2 b_1 b_0` as the dataword.
     - If `s_2 s_1 s_0 ≠ 000`: Discard the codeword (indicated by the "Discard" output).
   - Example: Syndrome `101` → Discard (error detected).
   - In a real system, the receiver might request retransmission (e.g., using ARQ).

5. **Dataword (`a_3, a_2, a_1, a_0`)**:
   - If accepted, the dataword `b_3 b_2 b_1 b_0` is output as the recovered data.
   - If discarded, no dataword is output.

### Example Walkthrough

1. **Sender**:
   - **Dataword**: `1101`.
   - **Append Zeros**: `1101000`.
   - **Divide by `1011`**: Remainder = `100`.
   - **Codeword**: `1101100`.

2. **Transmission**:
   - Sent: `1101100`.
   - Received: `1100100` (bit 4 flipped).

3. **Receiver**:
   - **Received Codeword**: `1100100`.
   - **Divide by `1011`**: Remainder = `101`.
   - **Syndrome**: `s_2 s_1 s_0 = 101`.
   - **Decision**: Discard (error detected).

**No Error Case**:
- Received: `1101100`.
- Divide by `1011` → Remainder = `000`.
- Syndrome: `000` → Accept → Output dataword: `1101`.

### Encoding Example (CRC as a Cyclic Code)

Consider an (7,4) cyclic code (n = 7, k = 4, r = 3) with `G(x) = x^3 + x + 1` (`1011`).

1. **Message**: `1101` → `M(x) = x^3 + x^2 + 1`.
2. **Shift Left**: `x^r · M(x) = x^3 · (x^3 + x^2 + 1) = x^6 + x^5 + x^3`.
   - As bits: `1101000`.
3. **Divide by `G(x)`**:
   - `G(x) = x^3 + x + 1` (`1011`).
   - Divide `1101000` by `1011` (modulo-2):
     - `1101000 ÷ 1011` → Remainder = `100` (`R(x) = x^2`).
4. **Codeword**:
   - `C(x) = x^r · M(x) - R(x)` → `1101000 ⊕ 0000100 = 1101100`.
   - Codeword: `1101100` (message `1101` + check bits `100`).

### Decoding and Error Detection

1. **Received Codeword**: `R(x) = 1100100` (bit 4 flipped).
2. **Syndrome**:
   - Divide `R(x)` by `G(x)`:
     - `1100100 ÷ 1011` → Remainder ≠ 0 → Error detected.
3. **Correction** (if designed for correction):
   - Cyclic codes like BCH codes (a subset) can correct errors by mapping syndromes to error patterns.
   - For CRC, typically used for detection only, the receiver requests retransmission.

### Types of Cyclic Codes

1. **Cyclic Redundancy Check (CRC)**:
   - Primarily for error detection.
   - High `d_min` for detecting burst errors.
   - Example: CRC-32 (`G(x) = x^32 + x^26 + ... + 1`), used in Ethernet.

2. **BCH Codes**:
   - Cyclic codes designed for multiple error correction.
   - Example: A BCH code with `d_min = 5` corrects `floor((5-1)/2) = 2` errors.

### Advantages of Cyclic Codes

- **Efficiency**: The cyclic property allows encoding/decoding using shift registers (hardware-friendly).
- **Burst Error Detection**: Excellent for detecting burst errors (e.g., CRC detects all bursts of length ≤ degree of `G(x)`).
- **Algebraic Structure**: Polynomial representation simplifies design and analysis.

### Limitations

- **Error Correction Complexity**: While detection is simple (e.g., CRC), correction (e.g., BCH) can be computationally intensive.
- **Fixed Length**: Like all block codes, they work with fixed block sizes.
- **Redundancy Overhead**: Adding check bits reduces the effective data rate.

### Applications

- **CRC**: Networking (Ethernet, Wi-Fi), storage (disk drives), file transfer (ZIP files).
- **BCH Codes**: Satellite communication, memory systems.

### Checksum
In computer networks, a **checksum** is a value used to verify the integrity of data during transmission. It helps detect errors that may have occurred while data was being sent over the network.
### Key Points :
1. **Purpose**:  
    To **detect errors** in transmitted data.
2. **How it Works**:
    - The sender calculates a checksum value based on the **binary data** (usually by summing up segments of the data).
    - This checksum is **sent along with the data** to the receiver.
    - The receiver recalculates the checksum from the received data.
    - If the recalculated checksum **matches** the received checksum, the data is considered **error-free**.
    - If not, it means the data was **corrupted** during transmission.
3. **Common Methods**:
    - **Internet Checksum** (used in protocols like IP, TCP, UDP): Sums up 16-bit words and adds any overflow (carry).
    - **CRC (Cyclic Redundancy Check)**: More complex but more accurate; used in Ethernet.
4. **Limitations**:
    - Can detect **most** errors, but not all.
    - Cannot correct errors — only **detect** them.

### **At the Sender Site**:
1. **Message is divided into 16-bit words**
   * The data (message) is split into chunks of 16 bits (2 bytes each).
1. **Checksum word is set to 0**
   * Before calculating, a placeholder for the checksum is initialized to `0000000000000000`.
1. **All words are added using one’s complement addition**
   * The 16-bit words are added together using one's complement addition (carry from the MSB is wrapped around to the LSB).
1. **The sum is complemented → this becomes the checksum**
   * The final sum is inverted (all bits flipped) to get the checksum.
1. **Checksum is sent with the data**
   * This checksum is now attached to the message and sent to the receiver.
### **At the Receiver Site**:
1. **Message (with checksum) is divided into 16-bit words**
   * The received message, including the checksum, is split again into 16-bit chunks.
1. **All words are added using one’s complement addition**
   * Just like the sender, the receiver adds all the 16-bit chunks including the checksum.
1. **Sum is complemented to get new checksum**
   * After adding, the receiver flips the bits of the total sum.
1. **If the result is 0 → message is valid**
   * If the final result is **all 0s (i.e., 0000000000000000)**, it means **no error**.
   * If it’s **not zero**, then the message was **corrupted**.
