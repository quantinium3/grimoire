## **Congestion Control**
Congestion occurs when network traffic exceeds its capacity, leading to **packet loss, increased delay, and reduced throughput**. Congestion control mechanisms aim to **prevent or mitigate** network overload.

### **Causes of Congestion:**
- **High Traffic Load:** Too many packets sent simultaneously.
- **Slow Receivers:** If a receiver cannot process data fast enough.
- **Bottleneck Links:** Low-bandwidth links in the network path.
- **Buffer Overflow:** Routers dropping packets when queues are full.

### **Congestion Control vs. Flow Control**
| Feature       | Congestion Control                                      | Flow Control                                    |
| ------------- | ------------------------------------------------------- | ----------------------------------------------- |
| **Scope**     | Network-wide (prevents traffic overload)                | End-to-end (prevents receiver overload)         |
| **Mechanism** | Adjusts sending rate based on network conditions        | Adjusts sending rate based on receiver’s buffer |
| **Example**   | TCP’s AIMD (Additive Increase, Multiplicative Decrease) | TCP’s Sliding Window                            |

## **Quality of Service (QoS)**
QoS refers to **prioritizing certain types of traffic** to ensure better performance for critical applications (e.g., VoIP, video streaming).

### **QoS Parameters:**
1. **Bandwidth:** Minimum guaranteed data rate.
2. **Delay:** Maximum tolerable latency.
3. **Jitter:** Variation in delay (critical for real-time apps).
4. **Packet Loss:** Acceptable loss percentage.

### **QoS Improving Techniques:**
1. **Traffic Shaping:** Controls the rate of data transmission (e.g., **Leaky Bucket, Token Bucket**).
2. **Packet Scheduling:** Prioritizes packets (e.g., **Priority Queuing, Weighted Fair Queuing**).
3. **Resource Reservation:** Allocates bandwidth in advance (e.g., **RSVP - Resource Reservation Protocol**).
4. **Admission Control:** Rejects new flows if the network is congested.

---

## **Leaky Bucket Algorithm**
### **Concept:**
- Models traffic flow as **water leaking from a bucket** at a **constant rate**.
- Used for **smoothing bursty traffic** into a steady stream.

### **Working:**
1. **Bucket Analogy:**
   - **Incoming Packets:** Represented as water poured into the bucket.
   - **Leak Rate (Output Rate):** Fixed, regardless of input burst.
   - **Bucket Size:** If full, excess packets are **discarded or marked**.

2. **Algorithm Steps:**
   - Packets arrive at **variable rates**.
   - The bucket **stores them temporarily**.
   - Packets exit at a **fixed rate (R)**.

### **Advantages:**
- **Smooths Traffic:** Converts bursty traffic into a steady flow.
- **Prevents Network Overload:** Limits peak data rate.

### **Disadvantages:**
- **Does Not Adapt to Bursts:** Drops excess packets.
- **Fixed Rate:** May not be optimal for all applications.

### **Use Cases:**
- **VoIP Traffic:** Ensures smooth voice transmission.
- **Network Traffic Policing:** Enforces bandwidth limits.

---

## **4. Token Bucket Algorithm**
### **Concept:**
- More flexible than Leaky Bucket.
- **Tokens** are added to a bucket at a **fixed rate**.
- A packet can be transmitted **only if a token is available**.

### **Working:**
1. **Bucket Analogy:**
   - **Tokens:** Represent permission to send data.
   - **Token Generation Rate (R):** Tokens added at fixed intervals.
   - **Bucket Capacity (C):** Maximum tokens stored.

2. **Algorithm Steps:**
   - Tokens are **added periodically** (e.g., 1 token every 1/R seconds).
   - When a packet arrives:
     - If **tokens available**, it is transmitted, and a token is **consumed**.
     - If **no tokens**, the packet is **buffered or dropped**.
   - **Burst Handling:** Allows short bursts up to bucket capacity.

### **Advantages:**
- **Allows Controlled Bursts:** Better for variable traffic.
- **More Flexible:** Adapts better than Leaky Bucket.

### **Disadvantages:**
- **Complexity:** Requires token management.
- **Not Strictly Rate-Limiting:** Bursts can still cause congestion.

### **Use Cases:**
- **Video Streaming:** Handles variable bitrate traffic.
- **Traffic Shaping in ISPs:** Manages user bandwidth.

---

## **Leaky Bucket vs. Token Bucket**
| Feature             | Leaky Bucket                   | Token Bucket                       |
| ------------------- | ------------------------------ | ---------------------------------- |
| **Traffic Shaping** | Strictly enforces a fixed rate | Allows controlled bursts           |
| **Burst Handling**  | Drops excess packets           | Permits bursts if tokens available |
| **Complexity**      | Simpler                        | More complex (token management)    |
| **Flexibility**     | Less flexible                  | More flexible                      |
| **Use Cases**       | VoIP, policing                 | Video streaming, traffic shaping   |
