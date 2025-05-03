The Address Resolution Protocol (ARP) is a protocol used in IP networks to map an IP address (Layer 3) to a physical or MAC address (Layer 2) within a local area network (LAN). This mapping is crucial because devices on a LAN communicate using MAC addresses, but higher-level protocols like IP use IP addresses.

### How ARP Works:
1. **ARP Request**: When a device (e.g., a host or router) needs to send a packet to an IP address on the same LAN but doesn’t know the corresponding MAC address, it broadcasts an ARP request. This request says, "Who has this IP address? Please send me your MAC address."
   - The request includes the sender’s IP and MAC addresses, the target IP, and a broadcast MAC address (since the target MAC is unknown).

2. **ARP Reply**: The device with the matching IP address responds with an ARP reply, unicast directly to the sender, providing its MAC address.
   - Other devices on the LAN ignore the request if the IP doesn’t match theirs.

3. **ARP Cache**: The sender stores the IP-to-MAC mapping in its ARP cache (a temporary table) to avoid repeated ARP requests for the same IP. Entries in the cache typically expire after a set time (e.g., 20 minutes).

### Four Types
- **Case 1: A host sends a packet to another host on the same network.**
  - The sender knows the target IP (destination address in the IP datagram).
  - Since both hosts are on the same LAN, the sender uses ARP to resolve the target IP to the receiver’s MAC address.
  - The packet is sent directly to the receiver using the resolved MAC address.

- **Case 2: A host sends a packet to a host on another network.**
  - The sender identifies that the target IP belongs to a different network.
  - The sender uses ARP to resolve the IP address of the router (gateway) on its LAN.
  - The packet is sent to the router’s MAC address, which then forwards it toward the destination network.

- **Case 3: A router receives a packet to be sent to a host on another network.**
  - The router knows the target IP (destination address in the IP datagram).
  - The router looks up the next hop in its routing table, which points to another router.
  - The router uses ARP to resolve the IP address of the next router to its MAC address and forwards the packet to that router.

- **Case 4: A router receives a packet to be sent to a host on the same network.**
  - The router recognizes that the target IP is on its local network (LAN).
  - The router uses ARP to resolve the target IP to the host’s MAC address.
  - The packet is sent directly to the host using the resolved MAC address.

### RARP
The Reverse Address Resolution Protocol (RARP) is a protocol used to map a physical (MAC) address to an IP address, essentially the opposite of ARP. It was primarily used in older network environments to allow diskless workstations or devices without permanent storage to discover their IP addresses during boot.

### How RARP Works:
1. **RARP Request**: A device (e.g., a diskless workstation) knows its own MAC address but not its IP address. It broadcasts a RARP request on the local network, asking, "My MAC address is X; what’s my IP address?"
   - The request includes the device’s MAC address and is sent to a broadcast address.

2. **RARP Reply**: A RARP server (typically a host or router on the same LAN) hears the request and looks up the MAC address in its RARP table (a manually configured mapping of MAC-to-IP addresses). The server then sends a RARP reply directly to the requesting device with its assigned IP address.

3. **Usage**: The device uses the received IP address to configure its network interface and proceed with communication, often as part of a boot process using protocols like BOOTP or TFTP to load an operating system.

### Key Points:
- **Limited Scope**: RARP operates within a single LAN (broadcast domain) and requires a dedicated RARP server with a preconfigured MAC-to-IP mapping table.
- **Obsolete**: RARP is largely obsolete today, replaced by more advanced protocols like BOOTP (Bootstrap Protocol) and DHCP (Dynamic Host Configuration Protocol). These protocols are more flexible, support dynamic IP assignment, and can provide additional configuration details (e.g., subnet mask, gateway).
- **Comparison to ARP**: While ARP resolves an IP address to a MAC address for packet delivery, RARP resolves a MAC address to an IP address for device configuration. Both operate at the link layer but serve different purposes.

### Why RARP Fell Out of Use:
- **Scalability Issues**: RARP required manual configuration of MAC-to-IP mappings, which was impractical for large networks.
- **Limited Functionality**: It only provided an IP address, lacking support for other configuration parameters.
- **Modern Alternatives**: DHCP, introduced in the 1990s, automates IP assignment, supports dynamic allocation, and provides additional network configuration details, making RARP unnecessary.

### BOOTP
The Bootstrap Protocol (BOOTP) is a network protocol used to automatically assign IP addresses and other network configuration parameters to devices (clients) on a network, primarily during the boot process. It was designed to improve upon RARP by providing more configuration details and supporting diskless workstations or devices that need to load their operating system over the network.

### How BOOTP Works:
1. **BOOTP Request**: A client (e.g., a diskless workstation) broadcasts a BOOTP request on the network during boot. This request includes the client’s MAC address and is sent to a broadcast address (255.255.255.255) on UDP port 67.
   - The client may also include a vendor-specific field to request additional information.

2. **BOOTP Reply**: A BOOTP server on the network receives the request and looks up the client’s MAC address in its configuration file (a manually maintained table). The server responds with a BOOTP reply (sent to UDP port 68) containing:
   - The client’s assigned IP address.
   - Subnet mask.
   - Default gateway (router) IP address.
   - IP address of a server (e.g., TFTP server) for downloading a boot file (like an operating system image).
   - The name of the boot file.
   - Optionally, other parameters like DNS server addresses.

3. **Client Configuration**: The client uses the received information to configure its network settings and may proceed to download a boot file (e.g., via TFTP) to complete its boot process.

### Key Features:
- **Static Mapping**: BOOTP relies on a manually configured table on the server that maps MAC addresses to IP addresses and other parameters. This means IP assignments are static and predefined.
- **Cross-Network Support**: Unlike RARP, BOOTP can work across networks if a BOOTP relay agent (often a router) forwards the broadcast request to a server on another subnet.
- **UDP-Based**: BOOTP uses UDP for communication, with the server listening on port 67 and the client on port 68.

### Limitations:
- **No Dynamic Allocation**: BOOTP doesn’t support dynamic IP address allocation; mappings must be manually configured, which is inefficient for large or changing networks.
- **No Lease Time**: IP assignments are permanent unless manually changed, lacking the temporary lease mechanism of modern protocols.
- **Limited Flexibility**: While more capable than RARP, BOOTP still lacks the extensibility needed for modern networks.

### DHCP
The Dynamic Host Configuration Protocol (DHCP) is a network protocol that automatically assigns IP addresses and other network configuration parameters to devices (clients) on a network, enabling them to communicate using IP. It builds on BOOTP, offering more flexibility and scalability, and is widely used in modern networks to manage IP address allocation dynamically.

### How DHCP Works:
DHCP operates in a client-server model, typically using UDP (ports 67 for the server, 68 for the client). The process follows the **DORA** cycle (Discover, Offer, Request, Acknowledge):

1. **Discover**: A client (e.g., a device booting up) broadcasts a DHCP Discover message to find a DHCP server. This message includes the client’s MAC address and a transaction ID.
   - Sent to 255.255.255.255 (broadcast) since the client doesn’t yet have an IP address.

2. **Offer**: DHCP servers on the network respond with a DHCP Offer message, providing an available IP address from their pool, along with configuration details like subnet mask, default gateway, DNS server IPs, and a lease time (how long the IP can be used).
   - The offer is sent to the client’s MAC address via broadcast (since the client has no IP yet).

3. **Request**: The client selects one offer (if multiple servers respond) and broadcasts a DHCP Request message, indicating the chosen server and requested IP address.
   - This also informs other servers that their offers were not selected, so they can reclaim the offered IPs.

4. **Acknowledge**: The chosen DHCP server responds with a DHCP Acknowledge (ACK) message, confirming the IP assignment and providing the full configuration (e.g., lease time, gateway, DNS).
   - If there’s an issue (e.g., IP already taken), the server sends a DHCP NAK (negative acknowledgment), and the client restarts the process.

### Key Features:
- **Dynamic IP Allocation**: DHCP assigns IPs from a pool, reusing them as devices leave the network, unlike BOOTP’s static mappings.
- **Lease Time**: IPs are leased for a specific duration (e.g., 24 hours). Clients must renew their lease before it expires, typically at 50% and 87.5% of the lease period, using a DHCP Request.
- **Cross-Network Support**: DHCP relay agents (often on routers) forward DHCP messages between subnets, allowing a central DHCP server to manage multiple networks.
- **Extensibility**: DHCP supports many options (e.g., DNS servers, time servers, domain names) via a flexible options field in its messages.

### DHCP Message Types (Beyond DORA):
- **DHCP Release**: A client sends this to release its IP address before the lease expires (e.g., when shutting down).
- **DHCP Inform**: A client uses this to request configuration parameters without needing an IP (e.g., if the IP is statically assigned).
- **DHCP Decline**: A client sends this if it detects the offered IP is already in use (e.g., via an ARP check).

### Advantages Over BOOTP:
- Dynamic allocation and IP reuse make it scalable for large networks.
- Lease times prevent IP exhaustion and allow temporary assignments.
- More configuration options and better support for modern network needs.

### Use Case:
DHCP is used in most networks (e.g., home Wi-Fi, enterprise LANs) to automate IP configuration for devices like computers, phones, and IoT devices. It reduces manual configuration errors and simplifies network management.

### Limitations:
- **Security Risks**: Rogue DHCP servers can assign incorrect IPs or redirect traffic (e.g., DHCP spoofing).
- **Dependency on Server**: If the DHCP server is down, new devices can’t get IPs unless they use a fallback (e.g., APIPA, which assigns a 169.254.x.x address).
- **Broadcast Traffic**: Initial DHCP messages are broadcasts, which can add network overhead in large setups.