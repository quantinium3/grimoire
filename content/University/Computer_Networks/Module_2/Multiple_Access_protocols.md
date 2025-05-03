## **1. Pure ALOHA**
### **Concept:**
- Developed in the **1970s** for early wireless networks.
- **Completely decentralized**—no synchronization required.
- Stations transmit **whenever they have data**.
- If a collision occurs, they wait for a **random backoff time** before retransmitting.

### **How It Works:**
1. **Transmission:**
   - A station sends data immediately when ready.
2. **Collision Detection:**
   - If two stations transmit at the same time, their packets collide and are destroyed.
3. **Retransmission:**
   - After a collision, stations wait for a **random delay** before trying again.

### **Efficiency:**
- **Maximum throughput: ~18.4%** (due to high collision probability).
- **Vulnerable Period:** Two packets can collide if sent within **2 × packet transmission time (2T)**.

### **Advantages:**
- Simple to implement.
- No need for synchronization.

### **Disadvantages:**
- Low efficiency due to high collision rate.
- Poor performance in high-traffic networks.

### **Use Case:**
- Early satellite and wireless networks.

---

## **2. Slotted ALOHA**
### **Concept:**
- An **improvement over Pure ALOHA**.
- Time is divided into **fixed-length slots** (equal to packet transmission time).
- Stations can **only transmit at the start of a slot** (synchronized).

### **How It Works:**
1. **Slot Synchronization:**
   - All stations agree on slot boundaries.
2. **Transmission:**
   - A station transmits **only at the beginning of a slot**.
3. **Collision Handling:**
   - If two stations transmit in the same slot, they collide and retry after a random delay.

### **Efficiency:**
- **Maximum throughput: ~36.8%** (twice as efficient as Pure ALOHA).
- **Vulnerable Period:** Only **1 × slot time (T)** (better than Pure ALOHA).

### **Advantages:**
- Higher efficiency than Pure ALOHA.
- Still simple to implement.

### **Disadvantages:**
- Requires **time synchronization**.
- Still suffers from collisions in high-load scenarios.

### **Use Case:**
- Early satellite communications, RFID systems.

---

## **3. CSMA/CD (Carrier Sense Multiple Access with Collision Detection)**
### **Concept:**
- Used in **Ethernet (wired networks)**.
- Stations **sense the channel before transmitting**.
- If a collision is detected, transmission is **aborted immediately**.

### **How It Works:**
1. **Carrier Sensing:**
   - A station listens to the medium before sending.
   - If idle, it transmits; if busy, it waits.
2. **Collision Detection:**
   - If two stations transmit simultaneously, a collision occurs.
   - Both detect the collision and **stop transmission**.
3. **Backoff & Retransmission:**
   - Stations wait for a **random time (binary exponential backoff)** before retrying.

### **Efficiency:**
- Works well in **low to moderate traffic**.
- **Breaks down in high-traffic or large networks** (due to increased collisions).

### **Advantages:**
- Reduces collisions compared to ALOHA.
- Widely used in wired Ethernet.

### **Disadvantages:**
- **Not suitable for wireless networks** (collision detection is hard in wireless).
- Performance degrades with network size.

### **Use Case:**
- Traditional **Ethernet (IEEE 802.3)**.

---

## **4. CSMA/CA (Carrier Sense Multiple Access with Collision Avoidance)**
### **Concept:**
- Used in **Wi-Fi (wireless networks)**.
- Since **collision detection is difficult in wireless**, CSMA/CA **avoids collisions** rather than detecting them.
- Uses **RTS/CTS (Request-to-Send / Clear-to-Send)** for reservation.

### **How It Works:**
1. **Carrier Sensing:**
   - Station checks if the channel is idle.
2. **Random Backoff (IFS - Interframe Space):**
   - Waits for a **DIFS (DCF Interframe Space)** period.
   - If idle, it picks a **random backoff timer** before transmitting.
3. **Virtual Sensing (NAV - Network Allocation Vector):**
   - Uses **RTS/CTS** to reserve the channel.
   - Other stations defer transmission based on NAV.
4. **Acknowledgment (ACK):**
   - Receiver sends an **ACK** after successful reception.

### **Efficiency:**
- Better suited for **wireless networks** than CSMA/CD.
- **Slower than CSMA/CD** due to overhead (RTS/CTS/ACK).

### **Advantages:**
- Avoids hidden terminal problem (using RTS/CTS).
- Works well in wireless environments.

### **Disadvantages:**
- **Higher overhead** (RTS/CTS/ACK).
- **Slower than CSMA/CD**.

### **Use Case:**
- **Wi-Fi (IEEE 802.11)**.

---

## **5. Comparison of Multiple Access Protocols**
| Protocol          | Type             | Key Feature                                | Efficiency          | Used in                 |
| ----------------- | ---------------- | ------------------------------------------ | ------------------- | ----------------------- |
| **Pure ALOHA**    | Random Access    | No synchronization, immediate transmission | ~18.4%              | Early wireless networks |
| **Slotted ALOHA** | Random Access    | Time-slotted transmission                  | ~36.8%              | Satellite comms, RFID   |
| **CSMA/CD**       | Contention-Based | Detects collisions, aborts transmission    | High (wired)        | Ethernet (802.3)        |
| **CSMA/CA**       | Contention-Based | Avoids collisions (RTS/CTS)                | Moderate (wireless) | Wi-Fi (802.11)          |