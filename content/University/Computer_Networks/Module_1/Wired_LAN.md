---
id: LAN
aliases: []
tags: []
title: LAN
---

Wired Local Area Networks (LANs) are networks that connect devices within a limited area, such as a home, office, or building, using physical cables. These networks enable devices like computers, printers, and servers to communicate and share resources. Here's a breakdown of key aspects of wired LANs:

### 1. **Components of a Wired LAN**
   - **Devices**: Computers, printers, servers, and other networked devices.
   - **Network Interface Cards (NICs)**: Hardware in devices that allows them to connect to the network.
   - **Cables**: Physical medium for data transmission, typically Ethernet cables (e.g., Cat5e, Cat6, or Cat7).
   - **Switches**: Devices that connect multiple devices within the LAN and manage data traffic.
   - **Routers**: Devices that connect the LAN to other networks, such as the internet.
   - **Protocols**: Rules and standards for communication, such as Ethernet (IEEE 802.3) and TCP/IP.

### 2. **Types of Cables**
   - **Ethernet Cables**: The most common type, including:
     - **Cat5e**: Supports speeds up to 1 Gbps.
     - **Cat6**: Supports speeds up to 10 Gbps over shorter distances.
     - **Cat7**: Designed for higher speeds and reduced interference.
   - **Fiber Optic Cables**: Used for high-speed, long-distance connections, often in larger networks.

### 3. **Advantages of Wired LANs**
   - **Speed**: Wired connections typically offer faster data transfer rates compared to wireless networks.
   - **Reliability**: Wired networks are less prone to interference and signal loss.
   - **Security**: Physical access is required to intercept data, making wired LANs more secure than wireless ones.
   - **Stability**: Wired connections are generally more stable and consistent.

### 4. **Disadvantages of Wired LANs**
   - **Infrastructure**: Requires physical cables and hardware, which can be costly and complex to install.
   - **Mobility**: Devices are tethered to the network by cables, limiting mobility.
   - **Scalability**: Expanding the network may require additional cabling and hardware.

### 6. **Applications**
   - **Offices**: For reliable and secure internal communication and resource sharing.
   - **Data Centers**: High-speed connections for servers and storage systems.
   - **Homes**: Connecting devices like gaming consoles, smart TVs, and computers.

### 7. **Standards and Protocols**
   - **Ethernet (IEEE 802.3)**: The most widely used standard for wired LANs.
   - **TCP/IP**: The foundational protocol suite for internet and LAN communication.
   - **PoE (Power over Ethernet)**: Allows devices to receive power and data over the same cable.

### **IEEE Standard for LAN**
These standards define how devices communicate over wired and wireless networks, ensuring interoperability and consistency across different manufacturers and technologies.

---
### **1. OSI or Internet Model**
The OSI model is a conceptual framework used to understand and standardize network communication. It consists of **7 layers**, but the image focuses on the **Data Link Layer** and **Physical Layer**, which are most relevant to IEEE LAN standards.

---

### **2. Data Link Layer**
The **Data Link Layer** is divided into two sublayers in the IEEE standards:
- **Logical Link Control (LLC)**
- **Media Access Control (MAC)**

#### **Logical Link Control (LLC)**
- **Purpose**: Provides a common interface between the **Network Layer** (upper layers) and the **MAC Layer**.
- **Functions**:
  - Manages flow control.
  - Ensures error-free data transfer.
  - Works with multiple MAC protocols (e.g., Ethernet, Token Ring).

#### **Media Access Control (MAC)**
- **Purpose**: Controls how devices access and transmit data over the network.
- **Functions**:
  - Manages addressing (e.g., MAC addresses).
  - Implements protocols like **CSMA/CD** (for Ethernet) or **Token Passing** (for Token Ring).
  - Ensures fair access to the transmission medium.

---

### **3. Physical Layer**
The **Physical Layer** deals with the actual transmission of data over the network medium. It includes:
- **Transmission Medium**: The physical cables or wireless signals used to transmit data (e.g., Ethernet cables, fiber optics, radio waves).
- **Physical Layer Standards**: Define how data is encoded, transmitted, and received over the medium.

---

### **4. IEEE LAN Standards**
The image highlights three key IEEE LAN standards, each with its own **MAC** and **Physical Layer** implementations:

#### **Ethernet (IEEE 802.3)**
- **MAC Protocol**: Uses **CSMA/CD** (Carrier Sense Multiple Access with Collision Detection) to manage access to the network.
- **Physical Layer**: Supports various cabling types (e.g., twisted-pair, fiber optic) and speeds (e.g., 10 Mbps, 100 Mbps, 1 Gbps, 10 Gbps).

#### **Token Ring (IEEE 802.5)**
- **MAC Protocol**: Uses **Token Passing**, where a token is passed between devices to control access to the network.
- **Physical Layer**: Typically uses twisted-pair or fiber optic cables.

#### **Token Bus (IEEE 802.4)**
- **MAC Protocol**: Combines features of Ethernet (bus topology) and Token Ring (token passing).
- **Physical Layer**: Uses coaxial or fiber optic cables.

---

### **5. Relationship Between Layers**
- The **LLC** sublayer acts as a bridge between the **Upper Layers** (e.g., Network Layer) and the **MAC** sublayer.
- The **MAC** sublayer interacts directly with the **Physical Layer** to transmit data over the network medium.

![[Pasted image 20250223014349.png]]

---
## **HDLC Frame compared with LLC and MAC frames**
---
### **1. HDLC Frame**
**HDLC (High-Level Data Link Control)** is a widely used protocol for data communication at the **Data Link Layer**. The HDLC frame structure consists of the following fields:

- **Address**: Identifies the destination of the frame.
- **Control**: Manages flow control, error detection, and frame type (e.g., information, supervisory, or unnumbered frames).
- **Upper-layer data**: The payload or data being transmitted.
- **FCS (Frame Check Sequence)**: A checksum for error detection.

---

### **2. LLC PDU (Protocol Data Unit)**
The **LLC PDU** is the data unit used by the **Logical Link Control** sublayer of the **Data Link Layer**. It encapsulates the upper-layer data and adds LLC-specific information. The LLC PDU structure includes:

- **DSAP (Destination Service Access Point)**: Identifies the service or protocol at the destination device.
- **SSAP (Source Service Access Point)**: Identifies the service or protocol at the source device.
- **Control**: Manages flow control and error detection (similar to the HDLC Control field).
- **Upper-layer data**: The payload or data being transmitted.

---

### **3. MAC Frame**
The **MAC frame** is used by the **Media Access Control** sublayer of the **Data Link Layer**. It encapsulates the LLC PDU and adds MAC-specific information. The MAC frame structure includes:

- **MAC Header**: Contains addressing and control information specific to the MAC protocol (e.g., Ethernet MAC addresses).
- **MAC Payload**: The LLC PDU (including DSAP, SSAP, Control, and upper-layer data).
- **FCS (Frame Check Sequence)**: A checksum for error detection.

---

![[video.webm]]
### **4. Comparison of Frames**
- **HDLC Frame**: A general-purpose frame used in HDLC protocol, primarily in point-to-point and multipoint communication.
- **LLC PDU**: Focuses on providing a common interface between the **Network Layer** and the **MAC Layer**, ensuring compatibility across different MAC protocols.
- **MAC Frame**: Adds MAC-specific addressing and control information to the LLC PDU, enabling communication over the physical network medium.

![[Pasted image 20250223014931.png]]
## **Ethernet Evolution Overview**
Ethernet has evolved significantly since its inception in the 1970s. Each generation introduced higher speeds, improved performance, and new features to meet the growing demands of networking. The four generations of Ethernet are:

1. **Standard Ethernet (10 Mbps)**
2. **Fast Ethernet (100 Mbps)**
3. **Gigabit Ethernet (1 Gbps)**
4. **10 Gigabit Ethernet (10 Gbps) and beyond**

---
#### **1. Standard Ethernet (10 Mbps)**
- **Introduced**: 1980s.
- **Standards**: IEEE 802.3.
- **Key Features**:
  - Speed: 10 Mbps.
  - Cabling: Coaxial (10BASE5, 10BASE2) and twisted-pair (10BASE-T).
  - Topology: Bus (coaxial) and Star (twisted-pair).
- **Use Case**: Early LANs for basic data transfer and file sharing.

#### **2. Fast Ethernet (100 Mbps)**
- **Introduced**: Mid-1990s.
- **Standards**: IEEE 802.3u.
- **Key Features**:
  - Speed: 100 Mbps.
  - Cabling: Twisted-pair (100BASE-TX) and fiber optic (100BASE-FX).
  - Topology: Star.
- **Use Case**: Improved performance for multimedia and larger networks.

#### **3. Gigabit Ethernet (1 Gbps)**
- **Introduced**: Late 1990s.
- **Standards**: IEEE 802.3z (fiber) and IEEE 802.3ab (twisted-pair).
- **Key Features**:
  - Speed: 1 Gbps.
  - Cabling: Twisted-pair (1000BASE-T) and fiber optic (1000BASE-SX, 1000BASE-LX).
  - Topology: Star.
- **Use Case**: High-speed networks for data centers, enterprise networks, and bandwidth-intensive applications.

#### **4. 10 Gigabit Ethernet (10 Gbps) and Beyond**
- **Introduced**: Early 2000s.
- **Standards**: IEEE 802.3ae (fiber) and IEEE 802.3an (twisted-pair).
- **Key Features**:
  - Speed: 10 Gbps.
  - Cabling: Twisted-pair (10GBASE-T) and fiber optic (10GBASE-SR, 10GBASE-LR).
  - Topology: Star.
- **Use Case**: Data centers, high-performance computing, and backbone networks.
- **Beyond 10 Gbps**:
  - **40 Gigabit Ethernet (40 Gbps)**: IEEE 802.3ba.
  - **100 Gigabit Ethernet (100 Gbps)**: IEEE 802.3ba.
  - **400 Gigabit Ethernet (400 Gbps)**: IEEE 802.3bs.

## **802.3 MAC frame**
![[Pasted image 20250223014955.png]]

---
### **1. Preamble**
- **Size**: 7 bytes (56 bits).
- **Purpose**: Synchronizes the sender and receiver by providing a series of alternating 1s and 0s. This helps the receiver detect the start of a frame and synchronize its clock with the sender's clock.

---

### **2. Start Frame Delimiter (SFD)**
- **Size**: 1 byte (8 bits).
- **Value**: `10101011` (binary).
- **Purpose**: Marks the end of the preamble and indicates the start of the actual frame. The last two bits (`11`) signal the beginning of the frame.

---

### **3. Destination Address**
- **Size**: 6 bytes (48 bits).
- **Purpose**: Specifies the **MAC address** of the intended recipient of the frame. This address is used by switches and devices to determine where to forward the frame.

---

### **4. Source Address**
- **Size**: 6 bytes (48 bits).
- **Purpose**: Specifies the **MAC address** of the sender of the frame. This helps the recipient identify the source of the data.

---

### **5. Length or Type**
- **Size**: 2 bytes (16 bits).
- **Purpose**:
  - **Length Field**: Indicates the length of the data field (in bytes) if the frame is using the IEEE 802.3 standard.
  - **Type Field**: Indicates the type of protocol encapsulated in the data field (e.g., IPv4, IPv6) if the frame is using the Ethernet II standard.
- **Note**: This field is interpreted differently depending on the Ethernet version being used.

---

### **6. Data and Padding**
- **Size**: Variable (46 to 1500 bytes for Ethernet).
- **Purpose**:
  - **Data**: Contains the actual payload being transmitted (e.g., IP packet, ARP message).
  - **Padding**: Ensures the frame meets the minimum size requirement of 64 bytes (including headers and CRC). If the data is too small, padding bytes are added.
- **Minimum Frame Size**: 46 bytes (data + padding).
- **Maximum Frame Size**: 1500 bytes (data + padding).

---

### **7. Cyclic Redundancy Check (CRC)**
- **Size**: 4 bytes (32 bits).
- **Purpose**: Provides error detection. The sender calculates a checksum based on the frame's contents, and the receiver recalculates it to check for errors during transmission. If the checksums don't match, the frame is discarded.

---

### **8. Physical Layer Header**
- **Purpose**: This is not part of the MAC frame itself but is added by the **Physical Layer** when transmitting the frame over the network medium (e.g., Ethernet cable, fiber optic).
- **Function**: Includes additional information required for transmission, such as synchronization and signaling.

---

### **9. Summary of the MAC Frame**
| Field               | Size      | Purpose                                                                 |
|---------------------|-----------|-------------------------------------------------------------------------|
| **Preamble**        | 7 bytes   | Synchronizes sender and receiver.                                       |
| **SFD**             | 1 byte    | Marks the start of the frame.                                           |
| **Destination Address** | 6 bytes | Specifies the MAC address of the recipient.                             |
| **Source Address**  | 6 bytes   | Specifies the MAC address of the sender.                                |
| **Length/Type**     | 2 bytes   | Indicates the length of the data or the type of protocol.               |
| **Data and Padding**| 46–1500 bytes | Contains the payload and padding to meet minimum frame size.           |
| **CRC**             | 4 bytes   | Provides error detection.                                               |


## **Minimum and Maximum Lengths**
![[Pasted image 20250223015233.png]]

---

### **1. Ethernet Frame Structure**
An Ethernet frame consists of several fields, as shown in the image:

| Field               | Size      | Description                                                                 |
|---------------------|-----------|-----------------------------------------------------------------------------|
| **Destination Address** | 6 bytes | The MAC address of the intended recipient.                                  |
| **Source Address**  | 6 bytes   | The MAC address of the sender.                                              |
| **Length/PDU**      | 2 bytes   | Indicates the length of the payload or the type of protocol (e.g., IPv4).   |
| **Data and Padding**| 46–1500 bytes | The payload (data) being transmitted, with padding if necessary.           |
| **CRC**             | 4 bytes   | Cyclic Redundancy Check for error detection.                                |

---

### **2. Minimum and Maximum Payload Length**
- **Minimum Payload Length**: 46 bytes.
  - If the data being transmitted is less than 46 bytes, **padding** is added to meet this minimum requirement.
  - **Reason**: Ensures that the frame is long enough for collision detection in Ethernet networks.
- **Maximum Payload Length**: 1500 bytes.
  - This is the standard maximum size for the payload in Ethernet frames.
  - **Reason**: Balances efficiency and network performance.

---

### **3. Minimum and Maximum Frame Length**
- **Minimum Frame Length**: 64 bytes (512 bits).
  - This includes:
    - **Destination Address**: 6 bytes.
    - **Source Address**: 6 bytes.
    - **Length/PDU**: 2 bytes.
    - **Data and Padding**: 46 bytes (minimum).
    - **CRC**: 4 bytes.
  - **Reason**: Ensures that the frame is long enough for proper collision detection in Ethernet networks.
- **Maximum Frame Length**: 1518 bytes (12,144 bits).
  - This includes:
    - **Destination Address**: 6 bytes.
    - **Source Address**: 6 bytes.
    - **Length/PDU**: 2 bytes.
    - **Data and Padding**: 1500 bytes (maximum).
    - **CRC**: 4 bytes.
  - **Reason**: Prevents a single frame from monopolizing the network for too long.

---

### **4. Why These Lengths Matter**
- **Collision Detection**: Ethernet uses **CSMA/CD** (Carrier Sense Multiple Access with Collision Detection). The minimum frame length ensures that collisions can be detected before the frame transmission completes.
- **Efficiency**: The maximum frame length balances efficiency and fairness, ensuring that no single device dominates the network for an extended period.
- **Interoperability**: Standardizing frame sizes ensures that all devices on an Ethernet network can communicate effectively.

---

### **5. Key Takeaways**
- **Minimum Payload**: 46 bytes (padding added if necessary).
- **Maximum Payload**: 1500 bytes.
- **Minimum Frame Length**: 64 bytes (including headers and CRC).
- **Maximum Frame Length**: 1518 bytes (including headers and CRC).

## **Unicast and Multicast Addresses**
---

### **1. Unicast Address**
A **unicast address** is used for **one-to-one communication**, where data is sent from a single source to a single destination.

#### **Characteristics**:
- **Destination**: A unique address assigned to a specific device (e.g., a MAC address or IP address).
- **Transmission**: The data is delivered only to the intended recipient.
- **Use Case**: Common in most network communications, such as web browsing, email, or file transfers.

#### **Examples**:
- **MAC Unicast Address**: A unique 48-bit hardware address assigned to a network interface card (NIC). Example: `00:1A:2B:3C:4D:5E`.
- **IP Unicast Address**: A unique IP address assigned to a device. Example: `192.168.1.10` (IPv4) or `2001:0db8:85a3::8a2e:0370:7334` (IPv6).

#### **Advantages**:
- Efficient for point-to-point communication.
- Ensures data is delivered only to the intended recipient.

#### **Disadvantages**:
- Inefficient for sending the same data to multiple recipients (requires multiple transmissions).

---

### **2. Multicast Address**
A **multicast address** is used for **one-to-many communication**, where data is sent from a single source to multiple destinations simultaneously.

#### **Characteristics**:
- **Destination**: A special address that represents a group of devices interested in receiving the data.
- **Transmission**: The data is delivered to all devices in the multicast group.
- **Use Case**: Common in applications like video streaming, online gaming, and live broadcasts.

#### **Examples**:
- **MAC Multicast Address**: A special 48-bit address where the least significant bit of the first byte is set to `1`. Example: `01:00:5E:00:00:01`.
- **IP Multicast Address**: A special range of IP addresses reserved for multicast. Example:
  - IPv4: `224.0.0.0` to `239.255.255.255`.
  - IPv6: Addresses starting with `FF00::/8`.

#### **Advantages**:
- Efficient for sending the same data to multiple recipients (requires only one transmission).
- Reduces network traffic compared to sending multiple unicast transmissions.

#### **Disadvantages**:
- Requires devices to join the multicast group to receive data.
- More complex to manage than unicast.

---

### **3. Comparison of Unicast and Multicast**

| Feature               | Unicast                          | Multicast                        |
|-----------------------|----------------------------------|----------------------------------|
| **Communication Type** | One-to-one                      | One-to-many                     |
| **Destination**        | Single device                   | Group of devices                |
| **Efficiency**         | Efficient for single recipients | Efficient for multiple recipients |
| **Use Cases**          | Web browsing, email, file transfer | Video streaming, live broadcasts, online gaming |
| **Address Examples**   | MAC: `00:1A:2B:3C:4D:5E`        | MAC: `01:00:5E:00:00:01`        |
|                       | IP: `192.168.1.10`              | IP: `224.0.0.1`                 |

---


## **Standard Ethernet Common Implementations**
   - This is the overarching category shown at the top of the diagram, representing the family of Ethernet standards operating at a data rate of 10 Mbps (megabits per second). These implementations are part of the IEEE 802.3 standard, which specifies the physical and data link layer protocols for Ethernet.

### **10Base5**
   - **Topology**: Bus
   - **Cable Type**: Thick coaxial cable
   - **Description**: 
     - 10Base5, also known as "Thick Ethernet" or "Thicknet," was one of the earliest Ethernet standards.
     - It uses a thick coaxial cable (typically 10mm in diameter) as the transmission medium.
     - The "10" indicates a data rate of 10 Mbps, "Base" means baseband transmission (using the entire bandwidth for a single signal), and "5" refers to the maximum segment length of 500 meters.
     - Devices are connected to the bus topology via vampire taps or transceivers, which clamp onto the cable.
     - This implementation is largely obsolete today due to its rigid installation requirements and susceptibility to failures.
![[Pasted image 20250223020811.png]]
### **10Base2**
   - **Topology**: Bus
   - **Cable Type**: Thin coaxial cable
   - **Description**:
     - 10Base2, also known as "Thin Ethernet" or "Thinnet," is a later and more flexible version of 10Base5.
     - It uses a thinner coaxial cable (typically 5mm in diameter, such as RG-58).
     - Like 10Base5, it operates at 10 Mbps using baseband transmission, but the "2" indicates a maximum segment length of 185 meters (approximately 200 meters, hence the name).
     - Devices are connected using BNC connectors and T-connectors in a bus topology.
     - It was more affordable and easier to install than 10Base5 but is also considered obsolete, replaced by more modern standards.

![[Pasted image 20250223020830.png]]
### **10Base-T**
   - **Topology**: Star
   - **Cable Type**: UTP (Unshielded Twisted Pair)
   - **Description**:
     - 10Base-T is one of the most well-known and widely used Ethernet standards historically.
     - It operates at 10 Mbps using baseband transmission, with "T" standing for twisted pair cabling, specifically Category 3 or higher UTP cables.
     - It uses a star topology, where all devices are connected to a central hub or switch via point-to-point connections.
     - The maximum segment length is 100 meters.
     - 10Base-T became popular in the 1990s and laid the groundwork for faster Ethernet standards like 100Base-TX and Gigabit Ethernet.

![[Pasted image 20250223020846.png]]
### **10Base-F**
   - **Topology**: Star
   - **Cable Type**: Fiber
   - **Description**:
     - 10Base-F refers to Ethernet over fiber-optic cable, operating at 10 Mbps using baseband transmission.
     - "F" stands for fiber, indicating the use of optical fiber as the transmission medium.
     - It uses a star topology, typically with devices connected to a central hub or switch via fiber-optic cables.
     - Fiber-optic cables allow for longer distances (up to 2 kilometers in some configurations) and are immune to electromagnetic interference, making 10Base-F suitable for environments requiring high reliability or long-distance connections.
     - While effective, 10Base-F is less common today, as faster fiber-based standards like 100Base-FX and Gigabit Ethernet have become more prevalent.

![[Pasted image 20250223022003.png]]
## **Encoding in standard ethernet implementation**

![[Pasted image 20250223020742.png]]
### Key Components and Flow
1. **10 Mbps Data (Input)**:
   - The process begins with 10 Mbps digital data generated by the station. This data consists of binary signals (0s and 1s) that need to be transmitted over the network.

2. **Manchester Encoder**:
   - Located at the transmitting end (within the station), the Manchester encoder converts the raw 10 Mbps binary data into a Manchester-encoded signal.
   - **Manchester Encoding**:
     - Manchester encoding is a line coding technique used in Ethernet to ensure reliable data transmission. It encodes each bit of data as a transition in the signal:
       - A binary "0" is represented by a low-to-high transition (falling edge) in the middle of the bit period.
       - A binary "1" is represented by a high-to-low transition (rising edge) in the middle of the bit period.
     - This encoding method provides several advantages:
       - It includes a clock signal within the data, allowing the receiver to synchronize with the transmitter (self-clocking).
       - It ensures that there is at least one transition per bit, which helps detect errors and maintain signal integrity.
       - It eliminates long sequences of 0s or 1s, reducing the risk of signal degradation or loss of synchronization.
     - The encoded signal is then sent over the transmission medium, which can be twisted pair cables (e.g., in 10Base-T) or fiber-optic cables (e.g., in 10Base-F).

3. **Twisted Pairs or Fibers**:
   - This represents the physical medium used to transmit the Manchester-encoded signal. In the context of Standard Ethernet implementations like 10Base-T, twisted pair cables (UTP) are commonly used, while 10Base-F uses fiber-optic cables.
   - The medium carries the encoded signal from the transmitting station to the receiving station.

4. **Manchester Decoder**:
   - Located at the receiving end, the Manchester decoder receives the Manchester-encoded signal and converts it back into the original 10 Mbps binary data.
   - The decoder interprets the transitions in the signal (high-to-low or low-to-high) to reconstruct the binary data:
     - A low-to-high transition in the middle of a bit period is decoded as a "0."
     - A high-to-low transition in the middle of a bit period is decoded as a "1."
   - This process ensures that the receiving station can accurately recover the original data sent by the transmitter.

5. **10 Mbps Data (Output)**:
   - The decoded data, now restored to its original binary form, is output as 10 Mbps data at the receiving station, ready for processing or further transmission.

### Why Manchester Encoding?
- **Self-Clocking**: The transitions in the signal allow the receiver to extract the clock signal, ensuring synchronization between sender and receiver without needing a separate clock line.
- **Error Detection**: The presence of transitions helps detect errors, as a lack of transitions could indicate a problem with the signal or cable.
- **DC Balance**: Manchester encoding ensures that the signal has no net DC component, which is important for maintaining signal quality over long distances or through certain types of cables.

## **Scaling Ethernet**
---
1. **Bridged Ethernet**:
   - Bridged Ethernet refers to the use of bridges to connect multiple Ethernet segments or LANs, improving network efficiency and scalability.
   - Bridges operate at the data link layer (Layer 2 of the OSI model) and forward frames only to the segment where the destination device is located, reducing unnecessary traffic and collisions in the network.
   - This was a significant advancement over the original bus topology Ethernet (e.g., 10Base5 and 10Base2), which suffered from performance issues due to collisions in shared media.
   - Bridging helped lay the groundwork for larger, more segmented networks, paving the way for higher data rates by reducing congestion.

2. **Switched Ethernet**:
   - Switched Ethernet builds on the concept of bridging but uses switches instead of bridges. Switches are more advanced devices that can handle multiple simultaneous connections and provide dedicated bandwidth to each port.
   - In a switched Ethernet network, each device is connected to a switch port in a star topology (as seen in 10Base-T), eliminating the collision domain issues of bus-based Ethernet.
   - Switches improved network performance by enabling full utilization of the 10 Mbps bandwidth per connection and later supported higher speeds (e.g., 100 Mbps, 1 Gbps).
   - This change was crucial for scaling Ethernet to handle higher data rates and modern network demands, making it compatible with other high-data-rate LAN technologies.

3. **Full-Duplex Ethernet**:
   - Full-Duplex Ethernet allows simultaneous two-way communication between devices, meaning data can be sent and received at the same time on the same connection.
   - In contrast, the original 10-Mbps Ethernet (e.g., 10Base5, 10Base2, and early 10Base-T) operated in half-duplex mode, where devices could either send or receive data but not both simultaneously, leading to potential collisions and reduced efficiency.
   - Full-duplex operation, enabled by switches and point-to-point connections (e.g., in 10Base-T with switches), doubled the effective bandwidth (e.g., 20 Mbps total for 10 Mbps send and 10 Mbps receive) and eliminated collisions, significantly improving performance.
   - This capability was essential for Ethernet to support higher data rates and integrate with other high-speed LANs, as it provided a foundation for faster standards like Fast Ethernet (100 Mbps) and Gigabit Ethernet.

## **Fast Ethernet**

### Key Characteristics of Fast Ethernet
1. **Data Rate**:
   - Fast Ethernet operates at 100 Mbps, which is ten times faster than the original 10-Mbps Ethernet. This increase in speed accommodates the growing need for higher bandwidth in LANs.

2. **Backward Compatibility**:
   - Fast Ethernet is designed to be backward compatible with 10-Mbps Ethernet, allowing devices and networks to operate at either speed on the same infrastructure. This compatibility ensures a smooth transition for organizations upgrading their networks.

3. **Physical Media and Standards**:
   Fast Ethernet supports several physical layer implementations, each using different cabling types and topologies. The most common standards are:
   - **100Base-TX**:
     - Uses two pairs of Category 5 (Cat5) or better unshielded twisted pair (UTP) cables.
     - Operates in a star topology with hubs or switches.
     - Maximum segment length is 100 meters (328 feet).
     - This is the most widely used Fast Ethernet standard due to its affordability and compatibility with existing twisted pair wiring.
   - **100Base-FX**:
     - Uses two strands of multimode fiber-optic cable.
     - Also operates in a star topology, typically with switches or hubs.
     - Supports longer distances, up to 2 kilometers (1.24 miles), making it suitable for campus or building backbone networks.
     - Fiber-optic cables provide immunity to electromagnetic interference and higher reliability over long distances.
   - **100Base-T4** (less common):
     - Uses four pairs of Category 3, 4, or 5 UTP cables.
     - Supports older wiring infrastructure but is rarely used today due to its complexity and lower adoption compared to 100Base-TX.

4. **Encoding and Signaling**:
   - Fast Ethernet uses more advanced encoding schemes than the Manchester encoding used in 10-Mbps Ethernet. For example:
     - **100Base-TX** uses 4B/5B encoding combined with MLT-3 (Multi-Level Transmit) signaling to transmit data efficiently over twisted pair cables.
     - **100Base-FX** uses 4B/5B encoding with NRZI (Non-Return to Zero Inverted) signaling over fiber-optic cables.
   - These encoding methods allow for higher data rates while maintaining signal integrity over the specified media.

5. **Topology**:
   - Fast Ethernet primarily uses a star topology, where devices are connected to a central hub or switch. This contrasts with the bus topology of older 10Base5 and 10Base2 standards, reducing collisions and improving performance.
   - Hubs can operate in half-duplex mode (shared bandwidth), but switches enable full-duplex communication, doubling the effective throughput to 200 Mbps per connection (100 Mbps send and 100 Mbps receive).

6. **Frame Format**:
   - Fast Ethernet retains the same Ethernet frame format as 10-Mbps Ethernet (defined in IEEE 802.3), including the preamble, start frame delimiter, destination/source addresses, data payload, and frame check sequence (FCS). This ensures interoperability between 10-Mbps and 100-Mbps devices.

### Advantages of Fast Ethernet
- **Higher Speed**: 100 Mbps significantly improves network performance compared to 10 Mbps, supporting more users and data-intensive applications.
- **Cost-Effective Upgrade**: Leverages existing Cat5 or better UTP cabling and hubs/switches, reducing the need for complete infrastructure overhauls.
- **Reliability**: Uses advanced encoding and signaling to maintain signal integrity over longer distances (especially with fiber in 100Base-FX).
- **Scalability**: Supports full-duplex operation and switched networks, enabling efficient scaling for larger organizations.

### Limitations
- While fast for its time, 100 Mbps is now considered slow compared to modern Gigabit Ethernet (1 Gbps) or 10 Gigabit Ethernet (10 Gbps), which are standard in many networks as of 2025.
- The maximum segment length (100 meters for UTP, 2 km for fiber) can be a constraint for very large networks, though this is less of an issue with fiber upgrades.
- It requires compatible network interface cards (NICs), switches, and cabling to achieve full performance, which can pose challenges in mixed-speed environments.

---
### Fast Ethernet Implementation

![[Pasted image 20250223022523.png]]

### Key Components of the Diagram
Each section of the diagram represents one Fast Ethernet standard, showing how 100 Mbps data is encoded at the transmitting station, transmitted over the physical medium, and decoded at the receiving station. The standards are:

#### 1. **100Base-TX**
   - **Physical Medium**: Two pairs of Category 5 UTP (unshielded twisted pair) cables.
   - **Encoding Process**:
     - **Input**: 100 Mbps data is divided into four streams of 25 Mbps each (4 × 25 Mbps).
     - **4B/5B Encoder**: The 25 Mbps data streams are first passed through a 4B/5B encoder. This encoding scheme maps every 4 bits of data into 5 bits, increasing the signal rate to 125 Mbps (4 × 25 Mbps × 5/4 = 125 Mbps). This adds extra bits to ensure sufficient transitions for clock recovery and to maintain signal integrity, reducing the likelihood of long sequences of 0s or 1s.
     - **MLT-3 Encoder**: The 125 Mbps output from the 4B/5B encoder is then processed by an MLT-3 (Multi-Level Transmit-3) encoder. MLT-3 is a line coding technique that uses three voltage levels (+1, 0, -1) to represent data, reducing electromagnetic interference and allowing the signal to travel efficiently over UTP cables. It converts the digital signal into a form suitable for transmission over the twisted pair medium.
     - **Transmission Medium**: The encoded signal is sent over two UTP Category 5 cables to the receiving station.
     - **MLT-3 Decoder**: At the receiving end, an MLT-3 decoder converts the MLT-3 signal back into a 125 Mbps digital signal.
     - **4B/5B Decoder**: The 4B/5B decoder then reverses the 4B/5B encoding, recovering the original 100 Mbps data (25 Mbps × 4 streams) for use by the receiving station.
   - **Purpose**: 100Base-TX is the most common Fast Ethernet standard, leveraging affordable and widely available Cat5 UTP cabling, typically in a star topology with switches or hubs.

#### 2. **100Base-FX**
   - **Physical Medium**: Two strands of multimode fiber-optic cables.
   - **Encoding Process**:
     - **Input**: Similar to 100Base-TX, 100 Mbps data is divided into four streams of 25 Mbps each (4 × 25 Mbps).
     - **4B/5B Encoder**: The 25 Mbps data streams are encoded using a 4B/5B encoder, increasing the signal rate to 125 Mbps, as described for 100Base-TX.
     - **NRZ-I Encoder**: The 125 Mbps output is then processed by an NRZ-I (Non-Return to Zero Inverted) encoder. NRZ-I is a line coding technique where a binary "1" is represented by a change in signal level, and a "0" is represented by no change. This method is well-suited for fiber-optic transmission, which uses light pulses to represent data (e.g., light on for "1," light off for "0" or vice versa).
     - **Transmission Medium**: The encoded signal is transmitted over two fiber-optic cables to the receiving station.
     - **NRZ-I Decoder**: At the receiving end, an NRZ-I decoder converts the NRZ-I signal back into a 125 Mbps digital signal.
     - **4B/5B Decoder**: The 4B/5B decoder then recovers the original 100 Mbps data (25 Mbps × 4 streams) for the receiving station.
   - **Purpose**: 100Base-FX is used for longer distances (up to 2 km) and in environments requiring high reliability or immunity to electromagnetic interference, such as campus or backbone networks.

#### 3. **100Base-T4**
   - **Physical Medium**: Four pairs of Category 3 UTP cables (or better, like Cat5).
   - **Encoding Process**:
     - **Input**: 100 Mbps data is processed as a single stream.
     - **8B/6T Encoder**: The 100 Mbps data is encoded using an 8B/6T encoding scheme. This maps every 8 bits of data into 6 ternary symbols (using three levels: +1, 0, -1), allowing the data to be transmitted over four pairs of UTP cables. The 8B/6T encoding reduces the signal rate per pair, making it possible to use lower-quality Cat3 cables, which were common in older installations.
     - **Transmission Medium**: The encoded signal is sent over four UTP Category 3 cables to the receiving station.
     - **8B/6T Decoder**: At the receiving end, an 8B/6T decoder reverses the encoding, recovering the original 100 Mbps data for the receiving station.
   - **Purpose**: 100Base-T4 was designed to support older Cat3 wiring infrastructure, but it is less common today due to its complexity and the prevalence of Cat5 wiring for 100Base-TX. It’s rarely used in modern networks as of 2025.


![[Pasted image 20250223022650.png]]

## **Gigabit Ethernet Implementations**

![[Pasted image 20250223022921.png]]
#### **1000Base-SX**
   - **Medium**: Two-wire short-wave fiber (multimode fiber-optic cable).
   - **Description**:
     - "1000" indicates a data rate of 1 Gbps.
     - "Base" refers to baseband transmission (using the entire bandwidth for a single signal).
     - "SX" stands for short-wavelength, typically using 850 nm lasers or LEDs over multimode fiber.
     - Maximum segment length is typically up to 550 meters, depending on the fiber quality (e.g., 62.5/125 μm or 50/125 μm multimode fiber).
     - This is commonly used for short-distance connections within buildings or data centers due to its cost-effectiveness and compatibility with multimode fiber infrastructure.

#### **1000Base-LX**
   - **Medium**: Two-wire long-wave fiber (single-mode or multimode fiber-optic cable).
   - **Description**:
     - "LX" stands for long-wavelength, typically using 1310 nm lasers over single-mode or multimode fiber.
     - Supports longer distances than 1000Base-SX, up to 5 kilometers on single-mode fiber or 550 meters on multimode fiber.
     - Ideal for campus or metropolitan area networks where longer distances are required, offering higher reliability and lower signal attenuation over fiber.

#### **1000Base-CX**
   - **Medium**: Two-wire copper (shielded twisted pair, STP).
   - **Description**:
     - Uses short-haul copper cabling, specifically shielded twisted pair (STP), often with IBM’s Type 1 cabling or similar.
     - Maximum segment length is limited to 25 meters, making it suitable for very short connections, such as within server racks or between nearby equipment.
     - This standard is less common today due to its short range and the prevalence of UTP solutions, but it was used in early Gigabit Ethernet deployments.

#### **1000Base-T**
   - **Medium**: Four-wire UTP (unshielded twisted pair).
   - **Description**:
     - Uses four pairs of Category 5e or better UTP cables, operating in a star topology with switches.
     - Supports a maximum segment length of 100 meters, making it widely used in office and enterprise networks.
     - This is the most common Gigabit Ethernet standard as of 2025, leveraging existing twisted pair infrastructure and providing a cost-effective solution for high-speed LANs.

---

### **Encoding in Gigabit Ethernet Implementations**
![[Pasted image 20250223022940.png]]
#### 1. **1000Base-SX, 1000Base-LX, and 1000Base-CX (Left Side)**
   - **Physical Medium**: Two fibers (for SX and LX) or two STPs (for CX).
   - **Encoding Process**:
     - **Input**: 1 Gbps data is divided into eight streams of 125 Mbps each (8 × 125 Mbps = 1 Gbps).
     - **8B/10B Block Encoder**: The 125 Mbps streams are encoded using an 8B/10B block encoding scheme. This maps every 8 bits of data into 10 bits, increasing the signal rate to 1.25 Gbps (8 × 125 Mbps × 10/8 = 1.25 Gbps). The extra bits ensure sufficient transitions for clock recovery, maintain DC balance, and prevent long sequences of 0s or 1s, which could cause synchronization issues.
     - **NRZ Line Encoder**: The 1.25 Gbps output from the 8B/10B encoder is processed by a Non-Return to Zero (NRZ) line encoder. NRZ is a simple line coding technique where a "1" is represented by a high voltage and a "0" by a low voltage (or vice versa), with no return to zero between bits. This is suitable for fiber-optic and STP media, which can handle high-speed digital signals.
     - **Transmission Medium**: The encoded signal is transmitted over two fibers (for SX and LX) or two STPs (for CX) to the receiving station.
     - **NRZ Line Decoder**: At the receiving end, an NRZ line decoder converts the NRZ signal back into a 1.25 Gbps digital signal.
     - **8B/10B Block Decoder**: The 8B/10B block decoder reverses the encoding, recovering the original 1 Gbps data (125 Mbps × 8 streams) for the receiving station.
   - **Purpose**: This encoding scheme ensures reliable 1 Gbps transmission over fiber-optic cables (SX, LX) or STP (CX), leveraging the high bandwidth and low attenuation of these media for short to long distances.

#### 2. **1000Base-T (Right Side)**
   - **Physical Medium**: Four UTP (unshielded twisted pair) cables, typically Category 5e or better.
   - **Encoding Process**:
     - **Input**: 1 Gbps data is divided into eight streams of 125 Mbps each (8 × 125 Mbps = 1 Gbps).
     - **4D-PAM5 Encoder**: The 125 Mbps streams are encoded using a 4D-PAM5 (Four-Dimensional Pulse Amplitude Modulation with 5 levels) encoding scheme. PAM5 uses five voltage levels (-2, -1, 0, +1, +2) to represent data, allowing multiple bits to be transmitted per symbol. This enables 1 Gbps data to be sent over four UTP pairs, with each pair carrying 250 Mbps (using advanced signal processing to combine multiple streams).
     - **Transmission Medium**: The encoded signal is transmitted over four UTP cables to the receiving station, using all four pairs simultaneously for both sending and receiving (full-duplex operation).
     - **4D-PAM5 Decoder**: At the receiving end, a 4D-PAM5 decoder reverses the encoding, recovering the original 1 Gbps data (125 Mbps × 8 streams) for the receiving station.
   - **Purpose**: 1000Base-T is designed to use existing UTP infrastructure (Cat5e or better) in a star topology, making it the most widely used Gigabit Ethernet standard for office and enterprise networks as of 2025. The 4D-PAM5 encoding allows high-speed transmission over copper wires while managing crosstalk and signal attenuation.

![[Pasted image 20250223023016.png]]

![[Pasted image 20250223023029.png]]
