---
id: OSI Model
aliases: []
tags: []
title: OSI Model
---

# **OSI Model (Open Systems Interconnection Model)**  

The **OSI Model** is a **conceptual framework** used to understand how data flows in a network. It was developed by the **International Organization for Standardization (ISO)** to standardize network communication.  

It consists of **seven layers**, each with specific functions. These layers work together to **send and receive data** between devices across a network.  

---

## **OSI Model Overview**
| **Layer No.** | **Layer Name**        | **Function** |
|--------------|----------------------|-------------|
| **7** | Application | Interacts with user applications (e.g., web browsers, email clients). |
| **6** | Presentation | Formats, encrypts, and compresses data. |
| **5** | Session | Manages sessions (start, maintain, and terminate connections). |
| **4** | Transport | Ensures reliable or fast delivery of data (TCP/UDP). |
| **3** | Network | Routes data between devices using IP addresses. |
| **2** | Data Link | Manages frames and MAC addresses for physical transmission. |
| **1** | Physical | Transmits raw bits over cables or wireless signals. |

---

## **Physical Layer (Layer 1)**
    - Handles the **physical connection** between devices.  
    - Converts data into electrical, optical, or radio signals for transmission.  
    - When you connect a LAN cable to a router, the **Physical Layer** ensures that bits are transmitted correctly.  

- **Key Components**:  
    - **Cables** (Ethernet, fiber optics).  
    - **Wireless signals** (Wi-Fi, Bluetooth).  
    - **Network adapters and hubs**.  

---

## **Data Link Layer (Layer 2)**
    - **Formats data into frames** for transmission.  
    - Adds **MAC addresses** (physical addresses of network devices).  
    - Detects and corrects errors in data transmission.  
    - **Switches, Bridges, MAC Addresses**.  
    - When a switch directs network traffic **based on MAC addresses**, it works at the **Data Link Layer**.  

- **Divided into Two Sublayers**:  
    1. **LLC (Logical Link Control)** – Error checking & flow control.  
    2. **MAC (Media Access Control)** – Defines access to the physical network.  

---

## **Network Layer (Layer 3)**
    - **Routes data** between different networks using **IP addresses**.  
    - Determines the **best path** for data packets.  
    - **Routers, IP Addresses (IPv4/IPv6), ARP, ICMP**.  
    - When you visit a website, your computer contacts a router, which uses **IP addresses** to find the destination server.  

---

## **Transport Layer (Layer 4)**
    - Ensures **end-to-end delivery** of data between devices.  
    - Handles **error correction, segmentation, and reassembly**.  
    - Uses **TCP (reliable) and UDP (fast but unreliable)**.  
    - **Streaming a video** uses **UDP** for speed, while **downloading a file** uses **TCP** for reliability.  

- **Key Protocols**:  
    - **TCP (Transmission Control Protocol)** – Ensures reliable delivery, error checking, and acknowledgment.  
    - **UDP (User Datagram Protocol)** – Faster but doesn’t guarantee delivery.  

---

## **Session Layer (Layer 5)**
    - **Establishes, maintains, and terminates** communication sessions.  
    - Manages sessions between applications.  
    - A **Skype call** maintains a session so both users can communicate.  

- **Key Responsibilities**:  
    - **Session establishment** (e.g., logging into a remote server).  
    - **Session synchronization** (e.g., saving a paused video call).  

---

## **Presentation Layer (Layer 6)**
    - **Translates data** into a format the application can understand.  
    - Handles **encryption, decryption, compression, and encoding**.  
    - **Data format conversion** (e.g., converting text to ASCII).  
    - **Encryption and decryption** (e.g., SSL/TLS for secure browsing).  
    - **Compression** (e.g., reducing image file size).  
    - When you **stream a video**, compression (e.g., MP4) is used to reduce file size.  

---

## **Application Layer (Layer 7)**
    - Directly interacts with **user applications**.  
    - Provides **network services** like file transfers, web browsing, and email.  
    - When you type **"www.google.com"**, the **DNS** resolves the domain to an IP address.  

- **Key Protocols**:  
    - **HTTP/HTTPS** (Web browsing).  
    - **FTP** (File transfers).  
    - **SMTP/POP3/IMAP** (Email communication).  
    - **DNS** (Domain name resolution).  

---

## **How Data Moves Through OSI Layers (Encapsulation & Decapsulation)**
1. **Encapsulation (Sending Data)**:  
   - Data moves **from the Application Layer (L7) to the Physical Layer (L1)**.  
   - Each layer **adds headers** (e.g., IP, MAC) before transmission.  

2. **Decapsulation (Receiving Data)**:  
   - Data moves **from the Physical Layer (L1) to the Application Layer (L7)**.  
   - Each layer **removes headers** and processes data accordingly.  

---

## **OSI Model vs. TCP/IP Model**
| **Feature** | **OSI Model** | **TCP/IP Model** |
|------------|-------------|----------------|
| **Layers** | 7 | 4 |
| **Developed by** | ISO | DoD (Department of Defense) |
| **Main Purpose** | Conceptual framework | Practical implementation |
| **Structure** | Application, Presentation, Session, Transport, Network, Data Link, Physical | Application, Transport, Internet, Network Access |
| **Example Protocols** | HTTP, FTP, TCP, UDP, IP, Ethernet | HTTP, FTP, TCP, IP, Ethernet |

---

## **Why is the OSI Model Important?**
- **Standardization** – Ensures different networks and devices can communicate.  
- **Troubleshooting** – Helps **identify network issues** at specific layers.  
- **Scalability** – Allows new technologies to integrate seamlessly.  
- **Security** – Provides structured security measures at different layers.  
