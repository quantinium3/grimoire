### **Unicast Routing**
Unicast routing involves sending data from one source to one specific destination, as opposed to multicast (one-to-many) or broadcast (one-to-all). Routing protocols help routers exchange information about network topology and compute optimal paths for data packets based on metrics like hop count, bandwidth, or delay.

### **Types of Unicast Routing Protocols**
Unicast routing protocols are broadly classified into three categories based on their operation and scope:

#### 1. **Distance Vector Protocols**
- **How they work**: Routers share their entire routing table with directly connected neighbors periodically. Each router uses this information to calculate the shortest path to a destination based on a metric (e.g., hop count).
- **Key features**:
  - Simple to implement but slower to converge (update routing tables after topology changes).
  - Prone to routing loops, mitigated by techniques like split horizon and route poisoning.
- **Examples**:
  - **RIP (Routing Information Protocol)**:
    - Uses hop count as the metric (maximum 15 hops).
    - Updates every 30 seconds.
    - Suitable for small networks due to its simplicity.
  - **IGRP (Interior Gateway Routing Protocol)**:
    - Cisco proprietary, uses a composite metric (bandwidth, delay, etc.).
    - Obsolete, replaced by EIGRP.
- **Advantages**: Easy to configure, low resource usage.
- **Disadvantages**: Limited scalability, slow convergence, and potential for routing loops.

#### 2. **Link-State Protocols**
- **How they work**: Each router floods the network with information about its directly connected links (link-state advertisements, LSAs). Routers use this data to build a complete topology map and compute the shortest path using Dijkstra’s algorithm.
- **Key features**:
  - Fast convergence and loop-free routing.
  - Scalable for larger networks but requires more processing power and memory.
  - Supports areas to reduce routing overhead in large networks.
- **Examples**:
  - **OSPF (Open Shortest Path First)**:
    - Widely used in enterprise networks.
    - Organizes networks into areas for efficiency.
    - Uses cost (based on bandwidth) as the metric.
  - **IS-IS (Intermediate System to Intermediate System)**:
    - Common in ISP networks.
    - Similar to OSPF but supports larger networks and is protocol-independent (works with IPv4 and IPv6).
- **Advantages**: Fast convergence, scalability, and robustness.
- **Disadvantages**: Complex configuration and higher resource demands.

#### 3. **Path Vector Protocols**
- **How they work**: Routers maintain a table of paths (or routes) to destinations, including the entire path’s attributes (e.g., AS numbers in BGP). Routes are selected based on policies rather than just metrics.
- **Key features**:
  - Used primarily for inter-domain routing (between autonomous systems).
  - Highly scalable and flexible due to policy-based routing.
- **Example**:
  - **BGP (Border Gateway Protocol)**:
    - **eBGP**: Used between different autonomous systems (e.g., ISPs).
    - **iBGP**: Used within a single autonomous system.
    - Selects paths based on attributes like AS path length, local preference, etc.
- **Advantages**: Scalable, supports complex routing policies, and is the backbone of the Internet.
- **Disadvantages**: Slow convergence and complex configuration.

### **Interior vs. Exterior Gateway Protocols**
Unicast routing protocols are also categorized by their scope:
- **Interior Gateway Protocols (IGPs)**: Operate within a single autonomous system (AS). Examples: RIP, OSPF, IS-IS, EIGRP.
- **Exterior Gateway Protocols (EGPs)**: Operate between autonomous systems. Example: BGP.

### **Key Concepts in Unicast Routing Protocols**
- **Routing Table**: A database in each router listing the best paths to destinations.
- **Convergence**: The process of all routers updating their routing tables to reflect network changes. Faster convergence is critical for minimizing packet loss.
- **Metrics**: Criteria for path selection (e.g., hop count, bandwidth, cost).
- **Scalability**: The ability to handle large networks without performance degradation.
- **Loop Prevention**: Techniques like split horizon, route poisoning, or path attributes to avoid routing loops.

### **Comparison of Unicast Routing Protocols**

| **Protocol** | **Type**                 | **Metric**             | **Convergence** | **Scalability** | **Use Case**                    |
| ------------ | ------------------------ | ---------------------- | --------------- | --------------- | ------------------------------- |
| RIP          | Distance Vector          | Hop count              | Slow            | Low             | Small networks                  |
| OSPF         | Link-State               | Cost (bandwidth)       | Fast            | High            | Enterprise networks             |
| IS-IS        | Link-State               | Cost                   | Fast            | High            | ISP networks                    |
| BGP          | Path Vector              | Path attributes        | Slow            | Very High       | Internet, inter-AS routing      |
| EIGRP        | Advanced Distance Vector | Bandwidth, delay, etc. | Fast            | High            | Cisco-based enterprise networks |
### **Routing Protocol**
A routing protocol is a set of rules that routers use to communicate and share information about network topology, allowing them to select the best path for forwarding packets. These protocols help in:
- **Path Determination**: Choosing the best route based on metrics like hop count, bandwidth, delay, etc.
- **Route Maintenance**: Updating routing tables when network changes occur (e.g., link failures).
- **Loop Prevention**: Avoiding routing loops that can cause packet loss or inefficiency.

### **Types of Routing Protocols**
Routing protocols can be broadly classified into three categories:

#### **A. Static Routing**
- Routes are manually configured by a network administrator.
- No dynamic updates; changes require manual intervention.
- Suitable for small, stable networks.
- **Advantages**: Low overhead, no bandwidth usage for updates.
- **Disadvantages**: Not scalable, inflexible to network changes.

#### **B. Dynamic Routing**
- Routers automatically exchange routing information.
- Adapts to topology changes (e.g., link failures, new networks).
- Classified into:
  1. **Distance Vector Protocols**
     - Routers share their entire routing table with neighbors periodically.
     - Use metrics like hop count to determine the best path.
     - Examples: **RIP (Routing Information Protocol)**, **IGRP (Interior Gateway Routing Protocol)**.
     - **Disadvantages**: Slow convergence, prone to routing loops.

  2. **Link-State Protocols**
     - Routers share information about their directly connected links (link-state advertisements).
     - Each router builds a complete topology map and computes the shortest path (e.g., using Dijkstra’s algorithm).
     - Examples: **OSPF (Open Shortest Path First)**, **IS-IS (Intermediate System to Intermediate System)**.
     - **Advantages**: Faster convergence, more scalable.

  3. **Hybrid Protocols**
     - Combine features of distance vector and link-state protocols.
     - Example: **EIGRP (Enhanced Interior Gateway Routing Protocol)** (Cisco proprietary).
     - Uses **DUAL (Diffusing Update Algorithm)** for fast convergence.

#### **C. Path Vector Protocols**
- Used in large-scale networks like the Internet (Exterior Gateway Protocols).
- Focus on policy-based routing and loop prevention.
- Example: **BGP (Border Gateway Protocol)**.

### **Classification Based on Network Scope**
- **Interior Gateway Protocols (IGPs)**: Used within an **autonomous system (AS)** (e.g., OSPF, RIP, EIGRP).
- **Exterior Gateway Protocols (EGPs)**: Used between different ASes (e.g., BGP).

### **Routing Protocol Comparison**
| Feature          | RIP             | OSPF                | EIGRP          | BGP              |
| ---------------- | --------------- | ------------------- | -------------- | ---------------- |
| **Type**         | Distance Vector | Link-State          | Hybrid         | Path Vector      |
| **Metric**       | Hop Count       | Cost                | Composite      | Path Attributes  |
| **Convergence**  | Slow            | Fast                | Very Fast      | Slow             |
| **Scalability**  | Low             | High                | High           | Very High        |
| **Use Case**<br> | Small Networks  | Enterprise Networks | Cisco Networks | Internet Routing |
|                  |                 |                     |                |                  |