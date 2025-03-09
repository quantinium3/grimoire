---
id: Wireless LAN
aliases: []
tags: []
title: Wireless LAN
---

# **IEEE 802.11 Overview**
IEEE 802.11 defines the specifications for a wireless LAN, covering both physical and data link layers.

---

### **Architecture**
Wireless networks can be categorized into two main types:
- **Basic Service Set (BSS)**
- **Extended Service Set (ESS)**

---

### **Basic Service Set (BSS)**
BSS is the fundamental building block of a WLAN. There are two types:
- **Independent BSS (IBSS) / Ad-hoc network**  
  - This consists of wireless stations (devices) communicating directly with each other **without** an access point (AP).
  - It is a peer-to-peer setup.
  - Used in temporary or small-scale networks where infrastructure is not needed.

- **Infrastructure BSS**  
  - This consists of wireless stations communicating through a **central access point (AP)**.
  - The AP manages the network, allowing communication between devices and providing internet access.
  - It is commonly used in homes, offices, and businesses.

![[Pasted image 20250223181108.png]]

---
### **Extended Service Set (ESS)**
- An **ESS** consists of **multiple BSSs connected together** using a **distribution system (DS)**.
- The **distribution system** is usually a wired LAN (such as Ethernet) that links multiple APs.
- This allows devices to roam between different BSSs while remaining connected to the network.

![[Pasted image 20250223181139.png]]

---

### **5. Station Types**
IEEE 802.11 classifies stations based on their mobility:
1. **No-transition stations** – Remain within a single BSS.
2. **BSS-transition stations** – Move between BSSs within an ESS.
3. **ESS-transition stations** – Move between different ESSs.
---
![[Pasted image 20250223181637.png]]
### **Overall Layer Structure**
   - The diagram shows the relationship between the **Data Link Layer** and the **Physical Layer** in the IEEE 802.11 standard, which follows the OSI model.
   - The Data Link Layer is divided into two sublayers:
     - **LLC Sublayer (Logical Link Control)**: This is the upper sublayer, shown in yellow, and it interfaces with higher layers (like the network layer) to provide a common interface for different types of physical layers.
     - **MAC Sublayer (Medium Access Control)**: This is the lower sublayer of the Data Link Layer, shown in blue and pink, and it handles access to the physical medium (e.g., radio frequencies for Wi-Fi).

   - Below the MAC sublayer is the **Physical Layer**, which includes various technologies for transmitting data over the air or through infrared.

### **MAC Sublayer Components**
   The MAC sublayer is split into two key functions for managing access to the wireless medium:
   - **Distributed Coordination Function (DCF)** (shown in pink): 
     - This is the default access method in IEEE 802.11, based on a contention-based protocol called CSMA/CA (Carrier Sense Multiple Access with Collision Avoidance).
     - Devices listen to the medium before transmitting to avoid collisions. If the medium is busy, they wait and use a random backoff timer to reduce the likelihood of collisions.
     - DCF is used for contention service, meaning multiple devices compete for access to the medium.
   - **Point Coordination Function (PCF)** (shown in blue):
     - This is an optional, contention-free access method that provides prioritized, controlled access to the medium.
     - PCF is managed by a point coordinator (typically an access point) that polls stations to give them access to the medium in an orderly fashion, ensuring no collisions occur.
     - It’s used for time-sensitive applications but is less common in modern Wi-Fi networks.

   The diagram shows that PCF operates above DCF, indicating that PCF can coexist with DCF in a network, but DCF is always active as the base mechanism.

### **Contention-Free vs. Contention Service**
   - The pink arrow labeled “Contention service” points to DCF, indicating that this function allows devices to contend for the medium, which might lead to delays or collisions but is flexible for general use.
   - The magenta arrow labeled “Contention-free service” points to PCF, showing that this function provides a collision-free, controlled access method, ideal for real-time applications like voice or video.

### **Physical Layer**
   - The Physical Layer, shown at the bottom, includes various standards and technologies for transmitting data wirelessly:
     - **802.11 FHSS**: Frequency-Hopping Spread Spectrum, an early method using different frequencies to reduce interference.
     - **802.11 DSSS**: Direct-Sequence Spread Spectrum, another early method that spreads data over a wider frequency band for reliability.
     - **802.11 Infrared**: Uses infrared light for short-range communication (less common today).
     - **802.11a DSSS and OFDM**: Uses Direct-Sequence Spread Spectrum and Orthogonal Frequency Division Multiplexing for higher data rates.
     - **802.11g DSSS**: Combines DSSS with other techniques for improved performance in the 2.4 GHz band.

   These physical layer standards define how data is transmitted over the air, while the MAC layer ensures proper access and coordination.

### **IEEE 802.1**
   - The yellow box at the top represents the IEEE 802.1 standard, which deals with higher-layer LAN/MAN (Local Area Network/Metropolitan Area Network) management and bridging. It interfaces with the LLC sublayer.

---

## **CSMA/CA flowchart**
![[Pasted image 20250223181906.png]]

### 1. **Start**
   - The process begins at the “Start” oval, indicating the initiation of a device attempting to transmit data over the wireless network.

### 2. **Set Back-off to Zero**
   - The device resets its back-off timer to zero. The back-off timer is used to manage delays before attempting to transmit, helping to reduce the chance of collisions in a busy network.

### 3. **Persistence Strategy**
   - The device applies a persistence strategy, which determines how it senses the medium. In CSMA/CA, the device listens to the wireless medium to check if it’s idle or busy (carrier sensing).

### 4. **Wait DIFS**
   - DIFS stands for Distributed Interframe Space, a specific time interval that the device must wait before attempting to transmit. This ensures that the medium has been idle long enough to proceed, giving priority to other types of traffic (like acknowledgments or control frames) that use shorter interframe spaces.

### 5. **Send RTS**
   - If the medium is idle after DIFS, the device sends a Request to Send (RTS) frame. The RTS frame is part of the optional RTS/CTS (Clear to Send) mechanism, which helps avoid collisions in hidden node scenarios (where some devices can’t hear each other).

### 6. **Set a Timer**
   - After sending RTS, the device sets a timer to wait for a response (CTS) from the receiver (e.g., an access point or another device).

### 7. **CTS Received Before Time-out?**
   - The device checks if it receives a Clear to Send (CTS) frame from the receiver within the allotted time.
     - **Yes**: If CTS is received, the process continues.
     - **No**: If no CTS is received before the timer expires (indicating a potential collision or interference), the device moves to handle the failure.

### 8. **Wait SIFS**
   - SIFS stands for Short Interframe Space, a shorter time interval than DIFS. The device waits this brief period after receiving CTS to ensure the medium remains clear before sending the actual data frame.

### 9. **Send the Frame**
   - The device sends its data frame (the actual information it wants to transmit) over the wireless medium.

### 10. **Set a Timer**
   - Another timer is set to wait for an acknowledgment (ACK) from the receiver, confirming that the frame was successfully received.

### 11. **ACK Received Before Time-out?**
   - The device checks if it receives an Acknowledgment (ACK) frame from the receiver within the allotted time.
     - **Yes**: If ACK is received, the transmission is successful, and the process ends with “Success.”
     - **No**: If no ACK is received before the timer expires (indicating a possible failure or collision), the device handles the error.

### 12. **Back-off Limit?**
   - If there’s a failure (no CTS or no ACK), the device checks if it has reached the maximum number of back-off attempts (a limit to prevent endless retries).
     - **Yes**: If the back-off limit is reached, the process aborts, and the transmission attempt fails.
     - **No**: If the limit hasn’t been reached, the device increments the back-off time (making it wait longer before retrying) and returns to the “Wait back-off time” step.

### 13. **Wait Back-off Time**
   - The device waits for a random back-off period (determined by the incremented back-off time) before attempting to retransmit. This random delay helps reduce the likelihood of repeated collisions with other devices also trying to transmit.

### 14. **Increment Back-off**
   - If the back-off limit hasn’t been reached, the device increases the back-off time (e.g., by doubling it or using an exponential back-off algorithm) to further reduce the chance of collisions on the next attempt.

### 15. **Abort or Success**
   - If the back-off limit is exceeded, the process ends with “Abort,” meaning the transmission attempt is abandoned.
   - If an ACK is received, the process ends with “Success,” indicating the data was successfully transmitted and acknowledged.

## **CSMA/CA and NAV**
![[Pasted image 20250223182415.png]]
### 1. **Key Components**
   - **Source**: The device initiating the data transmission (e.g., a laptop or smartphone).
   - **Destination**: The device receiving the data (e.g., a Wi-Fi access point or another device).
   - **All Other Stations**: Other devices in the network that are not directly involved in this transmission but are listening to the medium.
   - **Time**: The vertical axis represents the progression of time, with events occurring sequentially from top to bottom.

### 2. **Sequence of Events (Source and Destination)**
   The left and center parts of the diagram show the interaction between the source and destination, with specific timing intervals (DIFS and SIFS) and frames (RTS, CTS, Data, ACK):

   - **DIFS (Distributed Interframe Space)**:
     - Before transmitting, the source waits for a DIFS period to ensure the wireless medium is idle. DIFS is a longer interframe space that gives priority to control frames and ensures the medium is clear.

   - **RTS (Request to Send)**:
     - The source sends an RTS frame to the destination. This frame signals the source’s intent to transmit data and reserves the medium, helping to avoid collisions, especially in scenarios with hidden nodes (devices that can’t hear each other).

   - **SIFS (Short Interframe Space)**:
     - After receiving RTS, the destination waits a shorter SIFS period before responding. SIFS is used for high-priority, time-sensitive responses like CTS, ensuring quick acknowledgment without interference.

   - **CTS (Clear to Send)**:
     - The destination responds with a CTS frame, indicating it is ready to receive data. The CTS frame also helps reserve the medium and informs other nearby devices (including hidden nodes) to back off.

   - **Data**:
     - After receiving CTS, the source sends the actual data frame to the destination, again separated by an SIFS interval to maintain priority and minimize delays.

   - **ACK (Acknowledgment)**:
     - The destination, after receiving the data, waits another SIFS period and sends an ACK frame back to the source, confirming successful reception of the data.

   - **DIFS Again**:
     - After the ACK, the medium is free again, and the source (or any other device) must wait DIFS before attempting another transmission.

### 3. **Network Allocation Vector (NAV) and Other Stations**
   - The right part of the diagram shows how “All other stations” (other devices in the network) behave during this transmission.
   - When other stations hear the RTS or CTS frames, they set their Network Allocation Vector (NAV), represented by the yellow box labeled “NAV (No carrier sensing).”
   - The NAV is a virtual timer that indicates the medium is busy for a specific duration, preventing these stations from transmitting during that time. This helps avoid collisions by ensuring other devices remain silent while the source and destination complete their communication.
   - The NAV is set based on the duration field in the RTS and CTS frames, which specifies how long the medium will be occupied (including time for data and ACK transmission).

### 4. **Purpose of CSMA/CA and NAV**
   - **CSMA/CA**: This protocol minimizes collisions in wireless networks by having devices sense the medium (carrier sensing) and use random back-offs (as seen in the previous flowchart). The RTS/CTS mechanism adds an extra layer of collision avoidance, particularly for hidden node problems, where two devices might not hear each other but could interfere with a common destination.
   - **NAV**: The Network Allocation Vector ensures that all stations in the network respect the reservation of the medium, even if they can’t directly sense the carrier (e.g., due to distance or interference). This improves efficiency and reduces the likelihood of collisions in a busy Wi-Fi network.


## **Repetition Interval**
![[Pasted image 20250223182529.png]]
### 1. **Key Components**
   - **AP (Access Point)**: The central device managing the wireless network, responsible for coordinating access to the medium in PCF mode.
   - **Polled Station**: A specific station (e.g., a device like a laptop) that the AP polls to allow it to transmit data.
   - **Others**: Other stations in the network that are not currently polled but are part of the network.
   - **Time**: The horizontal axis represents the progression of time, with events occurring from left to right.
   - **Repetition Interval**: The overall time period during which the contention-free period (CFP) occurs, followed by a contention period (CP).

### 2. **Sequence of Events in the Repetition Interval**
   The diagram shows a structured sequence of frames and timing intervals within the repetition interval, which alternates between contention-free and contention periods:

   - **Beacon Frame (B)**:
     - The repetition interval begins with the AP broadcasting a Beacon frame (shown in pink). Beacons are periodic management frames that synchronize the network, announce the network’s presence, and indicate the start of the contention-free period (CFP).
     - The Beacon is sent after a PIFS (PCF Interframe Space), which is shorter than DIFS and gives the AP priority to access the medium.

   - **Poll**:
     - After the Beacon, the AP sends a Poll frame (also in pink) to a specific polled station, granting it permission to transmit data. This is part of the contention-free service, where the AP controls access to avoid collisions.
     - The Poll is separated from the Beacon by an SIFS (Short Interframe Space), ensuring quick and prioritized communication.

   - **ACK + Data**:
     - The polled station responds with an acknowledgment (ACK) and its data frame (shown in blue), also separated by an SIFS. This ensures the AP knows the data was received, and the data transmission happens without contention.
     - The ACK and data are combined into one frame for efficiency in this context.

   - **ACK + CF-Poll (Contention-Free Poll)**:
     - The AP acknowledges the data with an ACK and sends another CF-Poll (Contention-Free Poll) frame (in pink) to either the same station or another station, allowing further contention-free transmission.
     - This process can repeat, with dots (“...”) indicating potential additional polls until the end of the contention-free period.
     - The contention-free period ends with a CF-End frame, signaling that the medium is now available for contention-based access.

   - **Contention Period (CP)**:
     - After the contention-free period, the network switches to the contention period, where devices use CSMA/CA (as shown in previous diagrams) to compete for medium access, potentially leading to collisions but allowing flexibility for all devices.

### 3. **Network Allocation Vector (NAV)**
   - The yellow box labeled “NAV” at the bottom represents the Network Allocation Vector for other stations (those not polled).
   - During the contention-free period, other stations set their NAV based on the Beacon or Poll frames, indicating that the medium is busy. This prevents them from transmitting, ensuring the AP and polled stations can communicate without interference.
   - The NAV lasts throughout the contention-free period, after which other stations can attempt to transmit during the contention period using CSMA/CA.

### 4. **Timing Intervals**
   - **PIFS (PCF Interframe Space)**: Used by the AP to gain priority access to the medium before sending the Beacon, shorter than DIFS to ensure contention-free operation.
   - **SIFS (Short Interframe Space)**: Used between frames (e.g., Beacon to Poll, Poll to ACK+Data, etc.) to maintain high-priority, collision-free communication within the CFP.

### 5. **Purpose of PCF and This Diagram**
   - **PCF**: Unlike DCF, which relies on contention and can lead to collisions, PCF provides a controlled, contention-free access method ideal for time-sensitive applications like voice or video. The AP acts as a coordinator, polling stations to ensure orderly and predictable access to the medium.
   - **Repetition Interval**: This diagram shows how the network alternates between contention-free and contention periods within a repetitive cycle, balancing efficiency for prioritized traffic with flexibility for general use.

## **Frame Format*
![[Pasted image 20250223182741.png]]
### 1. **Overall Frame Structure**
   - The frame consists of several fields, each with a specific size in bytes, totaling the frame length (excluding any preamble or physical layer headers).
   - The fields are:
     - **FC (Frame Control)**: 2 bytes
     - **D (Duration)**: 2 bytes
     - **Address 1**: 6 bytes
     - **Address 2**: 6 bytes
     - **Address 3**: 6 bytes
     - **SC (Sequence Control)**: 2 bytes
     - **Address 4**: 6 bytes (optional, used in specific scenarios like wireless bridging)
     - **Frame Body**: 0 to 2312 bytes (contains the actual data or management/control information)
     - **FCS (Frame Check Sequence)**: 4 bytes

   - The frame is divided into a header (FC through Address 4) and a payload (Frame Body), with FCS at the end for error detection.

### 2. **Detailed Breakdown of Fields**

#### **Frame Control (FC) - 2 bytes**
   - This field, shown in pink, contains critical control information about the frame. It’s further broken down into:
     - **Protocol Version**: 2 bits – Indicates the version of the 802.11 protocol (typically 0 for current standards).
     - **Type**: 2 bits – Specifies the type of frame (e.g., Management, Control, or Data).
     - **Subtype**: 4 bits – Provides more specific information about the frame type (e.g., Beacon, RTS, CTS, Data, ACK, etc.).
     - **To DS**: 1 bit – Indicates if the frame is destined for the Distribution System (e.g., an access point or wired network).
     - **From DS**: 1 bit – Indicates if the frame is coming from the Distribution System.
     - **More Frag**: 1 bit – Indicates if more fragments of the frame follow (used for fragmented data).
     - **Retry**: 1 bit – Indicates if this is a retransmitted frame.
     - **Pwr Mgt**: 1 bit – Indicates the power management state of the sending station (e.g., active or power-saving mode).
     - **More Data**: 1 bit – Indicates if more data frames are buffered for the receiving station.
     - **WEP**: 1 bit – Indicates if Wired Equivalent Privacy (WEP) encryption is used (an older security mechanism, now largely deprecated).
     - **Rsvd**: 1 bit – Reserved for future use.

   - The FC field is crucial for interpreting the frame’s purpose and handling it appropriately in the network.

#### **Duration (D) - 2 bytes**
   - Shown in yellow, this field specifies the duration (in microseconds) for which the medium will be busy. It’s used to set the Network Allocation Vector (NAV) for other stations, preventing them from transmitting and causing collisions. This is particularly important in CSMA/CA for managing medium access.

#### **Address Fields - 6 bytes each**
   - There are up to four address fields (Address 1, 2, 3, and 4), shown in pink and light blue, depending on the frame type and network configuration:
     - **Address 1**: Typically the receiver’s MAC address (e.g., the destination).
     - **Address 2**: Typically the transmitter’s MAC address (e.g., the source).
     - **Address 3**: Used for additional addressing, such as the final destination or source in infrastructure networks (e.g., the access point or another network segment).
     - **Address 4**: Optional, used in rare cases like wireless bridging between two access points.
   - These addresses are 48-bit MAC addresses, uniquely identifying devices on the network.

#### **Sequence Control (SC) - 2 bytes**
   - Shown in light blue, this field manages frame ordering and prevents duplicate frames. It includes a sequence number and fragment number to track fragmented or reordered frames.

#### **Frame Body - 0 to 2312 bytes**
   - This variable-length field, shown in white, contains the payload of the frame. It can include:
     - Data for upper-layer protocols (e.g., IP packets).
     - Management information (e.g., Beacon frames, association requests).
     - Control information (e.g., RTS, CTS, ACK).
   - The size can vary depending on the type of frame and the amount of data being transmitted.

#### **Frame Check Sequence (FCS) - 4 bytes**
   - Shown in green, this field contains a cyclic redundancy check (CRC) value to detect errors in the frame. The receiver calculates the CRC and compares it with the FCS to ensure the frame was received correctly. If there’s a mismatch, the frame is discarded.

### 3. **Purpose of the Frame Format**
   - The IEEE 802.11 frame format ensures reliable and structured communication in Wi-Fi networks. It supports various frame types (management, control, data) and handles addressing, error detection, and medium access control.
   - The format is flexible, allowing for different configurations (e.g., varying numbers of addresses or frame body sizes) depending on the network setup (e.g., ad-hoc vs. infrastructure mode) and the specific frame’s purpose.

## **Subfields in FC Field**
![[Pasted image 20250223183031.png]]

## **Control Frames**
![[Pasted image 20250223183226.png]]
### 1. **Overall Structure of Control Frames**
   - Control frames are a category of IEEE 802.11 frames used for coordinating access to the wireless medium and confirming successful transmissions. They are shorter than data or management frames and have no frame body, as they carry minimal control information.
   - The structure includes the following fields, which are consistent with the general frame format you saw in Figure 14.7, but with specific adaptations for control frames:
     - **FC (Frame Control)**: 2 bytes – Specifies the frame type and subtype (e.g., RTS, CTS, or ACK).
     - **D (Duration)**: 2 bytes – Indicates how long the medium will be busy, used to set the Network Allocation Vector (NAV) for other stations.
     - **Address 1 and Address 2**: 6 bytes each – Identify the sender and receiver of the frame.
     - **FCS (Frame Check Sequence)**: 4 bytes – Ensures error detection by verifying the integrity of the frame.

   - Unlike the general frame format, control frames do not include Address 3, Address 4, Sequence Control, or a Frame Body, as they are lightweight and focused on coordination rather than carrying data.

### 2. **RTS Frame Format**
   - **Size**: 20 bytes total.
   - **Fields**:
     - **FC (Frame Control)**: 2 bytes (pink) – Indicates this is an RTS frame (a control subtype).
     - **D (Duration)**: 2 bytes (yellow) – Specifies the duration the medium will be reserved, including time for CTS, data, and ACK frames, to prevent other stations from transmitting.
     - **Address 1**: 6 bytes (pink) – The MAC address of the intended recipient (e.g., the destination device or access point).
     - **Address 2**: 6 bytes (pink) – The MAC address of the sender (e.g., the source device initiating the transmission).
     - **FCS (Frame Check Sequence)**: 4 bytes (green) – A CRC value to detect errors in the frame.

   - **Purpose**: The RTS frame is sent by a device to request permission to transmit data, helping avoid collisions, especially in hidden node scenarios. It’s part of the optional RTS/CTS mechanism in CSMA/CA, as shown in earlier diagrams (e.g., Figure 14.5).

### 3. **CTS or ACK Frame Format**
   - **Size**: 14 bytes total.
   - **Fields**:
     - **FC (Frame Control)**: 2 bytes (pink) – Indicates whether this is a CTS or ACK frame (a control subtype).
     - **D (Duration)**: 2 bytes (yellow) – Specifies the remaining duration the medium will be busy (e.g., for data and ACK in the case of CTS, or just ending the reservation for ACK).
     - **Address 1**: 6 bytes (pink) – The MAC address of the recipient (e.g., the sender of the RTS for CTS, or the sender of the data for ACK).
     - **FCS (Frame Check Sequence)**: 4 bytes (green) – A CRC value for error detection.

   - **Purpose**:
     - **CTS (Clear to Send)**: Sent by the destination in response to an RTS, indicating it’s ready to receive data and reserving the medium for the upcoming transmission.
     - **ACK (Acknowledgment)**: Sent by the destination after receiving data, confirming successful reception and ending the medium reservation.

   - The diagram notes “CTS or ACK” because both use the same frame format, differing only in the Frame Control field’s subtype. They both serve to manage medium access and ensure reliable communication but have different roles in the transmission process.

### 4. **Key Differences from General Frame Format**
   - Control frames are simpler than management or data frames, omitting fields like Address 3, Address 4, Sequence Control, and Frame Body.
   - They prioritize speed and efficiency for medium access control, as they are used for short, critical interactions like reserving the medium or acknowledging transmissions.

### 5. **Role in Wi-Fi Communication**
   - These control frames are integral to the CSMA/CA protocol (Distributed Coordination Function, DCF) and can also support the Point Coordination Function (PCF) in contention-free scenarios.
   - **RTS/CTS**: Helps prevent collisions in busy networks or with hidden nodes by reserving the medium before data transmission.
   - **ACK**: Ensures reliability by confirming that data frames were received correctly, triggering retransmissions if needed.

![[Pasted image 20250223183256.png]]

![[Pasted image 20250223183306.png]]

## **Addressing Mechanisms**
![[Pasted image 20250223183431.png]]
### 1. **Key Concepts**
   - **BSS (Basic Service Set)**: A group of devices communicating via a single access point or in an ad-hoc network. Each BSS is identified by a BSS-ID (similar to a MAC address of the AP or a unique identifier in ad-hoc mode).
   - **AP (Access Point)**: A device that connects wireless devices to a wired network (Distribution System) or another BSS.
   - **Distribution System (DS)**: A system (typically wired, like Ethernet) that connects multiple BSSs or APs, allowing communication between them.
   - **Wireless Distribution System (WDS)**: An extension of the DS using wireless links between APs, instead of wired connections.
   - **Addresses**: Wi-Fi frames can include up to four address fields (Address 1, 2, 3, and 4) to specify the source, destination, and intermediate points in the network, depending on the frame type and network topology.

### 2. **Case-by-Case Explanation**

#### **a. Case 1: Ad-Hoc Mode (Independent BSS)**
   - **Setup**: No access point or distribution system—devices communicate directly in an ad-hoc network (IBSS, Independent Basic Service Set).
   - **Devices**: Two stations, B and A, within the same BSS, identified by the BSS-ID.
   - **Addressing**:
     - **Address 1**: Destination (e.g., A, the receiver).
     - **Address 2**: Source (e.g., B, the sender).
     - **Address 3**: BSS-ID (identifies the network for routing within the BSS).
     - **Address 4**: Not used (empty) since there’s no DS or AP involved.
   - **Flow**: B sends a frame to A directly, using the BSS-ID to ensure they’re in the same network. This is a simple peer-to-peer communication without infrastructure.

#### **b. Case 2: Infrastructure Mode with DS (Single AP)**
   - **Setup**: A single AP connects two stations, B and A, within the same BSS, with the AP linked to a Distribution System (e.g., a wired network).
   - **Devices**: B (station), A (station), and AP (access point) within the BSS, with the DS connecting the AP to other networks.
   - **Addressing**:
     - **Address 1**: Destination (e.g., A, the receiver, or the AP if B is sending to the DS).
     - **Address 2**: Source (e.g., B, the sender).
     - **Address 3**: AP or DS address (e.g., the AP’s MAC address or the final destination in the DS).
     - **Address 4**: Not used (empty) since there’s only one AP and no need for additional routing.
   - **Flow**: B sends a frame to A via the AP. The AP acts as an intermediary, forwarding the frame within the BSS or to the DS if needed. The DS might route the frame to another BSS or network.

#### **c. Case 3: Infrastructure Mode with DS (Single AP, Extended)**
   - **Setup**: Similar to Case 2, but explicitly shows the AP connecting two BSSs via a Distribution System (wired).
   - **Devices**: B and A in different BSSs, with an AP bridging them through the DS.
   - **Addressing**:
     - **Address 1**: Destination (e.g., A, the receiver in the other BSS).
     - **Address 2**: Source (e.g., B, the sender in its BSS).
     - **Address 3**: AP or DS address (e.g., the AP’s MAC address or the DS endpoint).
     - **Address 4**: Not used (empty) since there’s only one AP involved.
   - **Flow**: B sends a frame to A through the AP and DS. The AP handles the frame within its BSS, and the DS routes it to the destination BSS, ensuring communication across the network.

#### **d. Case 4: Wireless Distribution System (WDS) with Two APs**
   - **Setup**: Two access points (AP1 and AP2) connect two BSSs wirelessly via a Wireless Distribution System, without a wired DS.
   - **Devices**: B in AP1’s BSS, A in AP2’s BSS, with AP1 and AP2 communicating wirelessly.
   - **Addressing**:
     - **Address 1**: Destination (e.g., A, the receiver in AP2’s BSS).
     - **Address 2**: Source (e.g., B, the sender in AP1’s BSS).
     - **Address 3**: AP1 or AP2 address (e.g., AP1’s MAC for forwarding to AP2).
     - **Address 4**: AP2’s MAC address (used because there are two APs in the wireless link, requiring additional routing information).
   - **Flow**: B sends a frame to A through AP1, which forwards it wirelessly to AP2 via WDS. AP2 then delivers the frame to A. The use of Address 4 accommodates the two-hop wireless path between APs.

### 3. **Common Elements Across Cases**
   - **BSS-ID**: Identifies the BSS, ensuring devices are part of the same network.
   - **Distribution System (DS or WDS)**: Facilitates communication between BSSs, either wired (DS) or wireless (WDS).
   - **Address Usage**: The number of address fields used depends on the network topology—ad-hoc networks use fewer addresses, while multi-AP or WDS setups may require all four.

### 4. **Purpose of Addressing Mechanisms**
   - The addressing in IEEE 802.11 frames allows flexible routing of data within and across BSSs, supporting various network configurations (ad-hoc, infrastructure, or extended networks).
   - It ensures frames are correctly directed to their destinations, whether within a single BSS, through an AP to a DS, or across multiple APs in a WDS, while minimizing collisions and maintaining network efficiency.

## **Use of Handshaking to prevent hidden station problem**

The use of handshaking, specifically the RTS/CTS (Request to Send/Clear to Send) mechanism, is a key strategy in the IEEE 802.11 Wi-Fi standard to prevent the hidden station problem. This problem occurs in wireless networks when two or more stations are within range of a common receiver but out of range of each other, potentially causing collisions at the receiver. The RTS/CTS handshake, part of the CSMA/CA (Carrier Sense Multiple Access with Collision Avoidance) protocol, mitigates this issue by reserving the wireless medium and notifying all relevant stations, even those that can’t hear each other. Let’s break it down:

---

### **What is the Hidden Station Problem?**
- The hidden station problem arises when, for example, Station B and Station C can both communicate with Station A (the receiver) but cannot detect each other’s transmissions because they are out of range or separated by obstacles (e.g., walls).
- If B and C transmit to A simultaneously, their signals collide at A, corrupting the data, even though B and C don’t realize a collision is occurring because they can’t hear each other.
- This is a limitation of CSMA/CA’s carrier sensing, as stations rely on listening to the medium before transmitting, but hidden stations won’t detect each other’s activity.

---

### **How Handshaking (RTS/CTS) Prevents the Hidden Station Problem**
The RTS/CTS handshake adds an explicit medium reservation step to CSMA/CA, ensuring that all stations near the receiver are aware of an impending transmission, even if they can’t hear the sender. Here’s how it works, as illustrated in Figure 14.11 from your diagrams:

#### **1. RTS (Request to Send)**
   - A station wanting to transmit (e.g., Station B) first sends an RTS frame to the intended receiver (e.g., Station A).
   - The RTS frame includes:
     - The MAC address of the sender (B) and receiver (A).
     - A Duration field specifying how long the medium will be busy for the upcoming transmission (including time for CTS, data, and ACK frames).
   - B sends the RTS only after ensuring the medium is idle for a DIFS (Distributed Interframe Space) period, as per CSMA/CA.

#### **2. CTS (Clear to Send)**
   - If Station A receives the RTS successfully, it responds with a CTS frame after a short SIFS (Short Interframe Space) interval.
   - The CTS frame includes:
     - The MAC address of the sender of the RTS (B, now the receiver of the data).
     - The same Duration value from the RTS, indicating how long the medium will remain busy.
   - The CTS is broadcast and can be heard by all stations within A’s transmission range, including any hidden stations (e.g., Station C) that couldn’t hear B’s RTS.

#### **3. NAV (Network Allocation Vector)**
   - Stations that hear the CTS (e.g., C) set their Network Allocation Vector (NAV), a virtual timer that indicates the medium is busy for the specified duration.
   - This prevents C (and other stations within A’s range) from transmitting during this period, avoiding a collision at A even though C couldn’t hear B’s RTS.

#### **4. Data and ACK**
   - After receiving CTS, B sends its data frame to A, followed by A sending an ACK (Acknowledgment) frame to confirm successful reception.
   - The NAV ensures that no other stations interfere during this exchange, protecting the transmission from hidden stations like C.

---

## **Exposed Station Problem?**
The exposed station problem occurs in wireless networks when a station (device) unnecessarily delays or defers its transmission because it detects activity on the medium, even though its transmission wouldn’t interfere with the ongoing communication. This leads to reduced network efficiency and throughput, as the station waits when it could safely transmit without causing collisions.

### **Key Characteristics:**
- **Stations Involved**: Consider three stations: Station B, Station A, and Station D. B and D are within range of A, but B and D are not within range of each other.
- **Scenario**: If A is transmitting data to B, Station D (within A’s range) senses the medium as busy and defers its transmission. However, D’s transmission to another station (e.g., not shown in the diagram) wouldn’t interfere with A’s communication to B, as D is out of B’s range.
- **Problem**: D is “exposed” to A’s transmission but unnecessarily restricted from transmitting, wasting potential network capacity and reducing efficiency.

### **Why It Happens:**
- In CSMA/CA (Carrier Sense Multiple Access with Collision Avoidance), stations listen to the medium before transmitting. If D hears A’s transmission to B, it assumes the medium is busy and waits, even though D’s transmission wouldn’t cause a collision at B (or any other relevant receiver).
- This conservative approach to carrier sensing can lead to inefficiency, as D delays its transmission unnecessarily, even when it could communicate with another station without interference.

---
### **Use of Handshaking (RTS/CTS) in the Exposed Station Problem**
Unlike the hidden station problem, the RTS/CTS (Request to Send/Clear to Send) handshake does not directly solve or mitigate the exposed station problem. In fact, it can sometimes exacerbate it. Here’s why and how it works in this context:

#### **How RTS/CTS Works in General**
- In CSMA/CA, a station (e.g., A) wanting to transmit to B sends an RTS frame, and B responds with a CTS frame. The Duration field in RTS and CTS sets the NAV (Network Allocation Vector) for other stations, preventing them from transmitting during the reserved time.
- This handshake is effective for avoiding collisions from hidden stations (as seen in the hidden station problem) by ensuring all stations near the receiver (B) defer transmission.

#### **Impact on Exposed Stations**
- **No Direct Solution**: The RTS/CTS mechanism doesn’t address the exposed station problem because it reserves the medium for a longer duration, potentially causing more stations (like D) to defer unnecessarily, even if their transmissions wouldn’t interfere.
- For example, in the scenario where A sends RTS to B and B responds with CTS, Station D (within A’s range) hears the CTS and sets its NAV, deferring its transmission. However, D could safely transmit to another station outside B’s range without causing a collision, but the NAV forces it to wait, worsening the exposed station issue.
- **Potential Exacerbation**: The additional overhead of RTS/CTS (extra frames and delays) can further reduce efficiency in networks with exposed stations, as it increases the time the medium appears busy, leading to more unnecessary deferrals.

#### **Why RTS/CTS Doesn’t Help**
- The exposed station problem stems from the conservative nature of carrier sensing in CSMA/CA, where a station defers even when its transmission wouldn’t interfere. RTS/CTS reinforces this conservatism by broadcasting the medium reservation, but it doesn’t distinguish between stations that would cause interference and those that wouldn’t.
- The handshake assumes all stations within range of the sender (A) or receiver (B) should defer, which is overly restrictive for exposed stations like D.

![[Pasted image 20250223184617.png]]

![[Pasted image 20250223184627.png]]


## **IEEE 802.11 FHSS physical layer**
![[Pasted image 20250223184754.png]]

- **Overview**: Illustrates the Frequency-Hopping Spread Spectrum (FHSS) physical layer in IEEE 802.11, operating in the 2.4 GHz band with data rates of 1 or 2 Mbps.
- **Digital Data Input**: Accepts 1 or 2 Mbps digital data from the MAC layer for transmission.
- **Modulator (2-Level or 4-Level FSK)**: Converts digital data into a 1-MHz analog signal using Frequency Shift Keying (FSK):
  - 2-Level FSK for 1 Mbps (two frequencies for 0 and 1).
  - 4-Level FSK for 2 Mbps (four frequencies for bit combinations).
- **Pseudorandom Sequence**: Generates a pseudorandom hopping pattern to switch frequencies, enhancing security and reducing interference.
- **Frequency Synthesizer**: Uses the pseudorandom sequence to dynamically adjust the carrier frequency, hopping across 1-MHz channels at ~2.5 hops/second.
- **Analog Signal Output**: Produces a 1-MHz analog signal for wireless transmission, spread across frequencies to resist interference and multipath fading.
- **Advantages**: Reduces interference, improves robustness, and coexists with other 2.4 GHz devices.
- **Limitations**: Low data rates (1–2 Mbps), hardware complexity, and obsolescence compared to modern Wi-Fi standards.

## **Physical layer of IEEE 802.11 DSSS**
![[Pasted image 20250223184812.png]]

- **Overview**: Illustrates the Direct-Sequence Spread Spectrum (DSSS) physical layer in IEEE 802.11, operating in the 2.4 GHz band with data rates of 1 or 2 Mbps.
- **Digital Data Input**: Accepts 1 or 2 Mbps digital data from the MAC layer for transmission.
- **11-Chip Barker Sequence**: Spreads the digital data using an 11-chip Barker sequence, increasing the signal bandwidth to 11 Mbps (spreading) while maintaining the original data rate, improving resistance to interference and noise.
- **Modulator (BPSK or QPSK)**: Converts the spread data into an 11-MHz analog signal using phase modulation:
  - BPSK (Binary Phase Shift Keying) for 1 Mbps (one bit per symbol).
  - QPSK (Quadrature Phase Shift Keying) for 2 Mbps (two bits per symbol).
- **Analog Signal Output**: Produces an 11-MHz analog signal for wireless transmission, spread across a wider frequency band to enhance reliability and reduce interference.
- **Advantages**: Offers better interference resistance and robustness than FHSS, simpler hardware than frequency hopping, and supports coexistence in the 2.4 GHz band.
- **Limitations**: Lower data rates (1–2 Mbps) compared to modern Wi-Fi standards, and susceptibility to multipath fading, though less than FHSS. Now outdated but foundational for early 802.11 and 802.11b.

## **Physical layer of IEEE  802.11 infrared
![[Pasted image 20250223184919.png]]

- **Overview**: Illustrates the infrared physical layer in IEEE 802.11, using infrared light for short-range wireless communication with data rates of 1 or 2 Mbps.
- **Digital Data Input**: Accepts 1 or 2 Mbps digital data from the MAC layer for transmission.
- **Encoder (4 to 16 or 2 to 4)**: Encodes the digital data into a format suitable for infrared transmission:
  - 4 to 16 encoding for 1 Mbps (expanding 4 bits to 16 pulses or symbols).
  - 2 to 4 encoding for 2 Mbps (expanding 2 bits to 4 pulses or symbols).
- **Modulator (Pulse Position Modulation)**: Converts the encoded data into an analog infrared signal using pulse position modulation (PPM), where data is represented by the position of pulses in a time frame.
- **Analog Signal Output**: Produces an analog infrared signal for transmission via infrared LEDs, limited to line-of-sight, short-range communication.
- **Advantages**: Immune to radio frequency interference, secure due to line-of-sight requirement, and simple for short-range applications.
- **Limitations**: Limited range (typically a few meters), requires line-of-sight, low data rates (1–2 Mbps), and now obsolete compared to RF-based Wi-Fi standards like DSSS and OFDM.

## **Physical layer for IEEE 802.11b**
![[Pasted image 20250223185001.png]]

- **Overview**: Illustrates the Direct-Sequence Spread Spectrum (DSSS) physical layer in IEEE 802.11b, operating in the 2.4 GHz band with data rates of 5.5 Mbps or 11 Mbps.
- **Digital Data Input**: Accepts 5.5 Mbps or 11 Mbps digital data from the MAC layer for transmission.
- **1:4 or 1:8 Spreading**: Spreads the data using a spreading factor:
  - 1:4 for 5.5 Mbps (one data bit spread into four chips).
  - 1:8 for 11 Mbps (one data bit spread into eight chips), increasing bandwidth to 11 Mbps to enhance resistance to interference.
- **CCK (Complementary Code Keying) Selector**: Encodes the spread data using CCK, producing 5.5 Mbps (2 bits) or 11 Mbps (6 bits) streams, improving efficiency over Barker sequences used in earlier DSSS.
- **Modulator (QPSK)**: Converts the CCK-encoded data into an 11-MHz analog signal using Quadrature Phase Shift Keying (QPSK), where four phase states represent two bits per symbol.
- **Analog Signal Output**: Produces an 11-MHz analog signal for wireless transmission, spread across a wider frequency band for robustness and interference resistance.
- **Advantages**: Higher data rates (up to 11 Mbps) than earlier 802.11 standards, better interference resistance, and compatibility with 802.11 DSSS (1–2 Mbps).
- **Limitations**: Operates in the crowded 2.4 GHz band, susceptible to interference from other devices (e.g., microwaves, Bluetooth), and now outdated compared to later standards like 802.11a/g/n/ac/ax.

