In networking, **delivery** refers to the process of transmitting a packet from a source to a destination across a network. Delivery can be categorized into two types: **direct delivery** and **indirect delivery**, depending on whether the source and destination are on the same network (subnet) or different networks.

### Direct Delivery:
- **Definition**: Direct delivery occurs when the source and destination devices are on the same network (same subnet or LAN). The packet is sent directly from the source to the destination without involving intermediate routers.
- **How It Works**:
  1. The source device checks the destination IP address and compares it with its own subnet mask to determine if the destination is on the same network.
  2. If it is, the source uses ARP (Address Resolution Protocol) to resolve the destination IP to its MAC address.
  3. The packet is encapsulated in a frame with the destination’s MAC address and sent directly over the LAN to the destination.
- **Example (from the Image - Case 1)**: A host sends a packet to another host on the same LAN. The target IP is the destination address in the IP datagram, and ARP resolves it to the receiver’s MAC address for direct delivery.
- **Key Point**: No routers are involved; the delivery is handled entirely at the data link layer (Layer 2).

### Indirect Delivery:
- **Definition**: Indirect delivery occurs when the source and destination are on different networks (subnets). The packet must pass through one or more routers to reach the destination.
- **How It Works**:
  1. The source device determines that the destination IP is on a different network by comparing it with its subnet mask.
  2. The source sends the packet to its default gateway (a router) on its LAN. It uses ARP to resolve the router’s IP to its MAC address and sends the packet to the router.
  3. The router looks up the destination IP in its routing table to determine the next hop (another router or the final destination).
  4. This process repeats across routers (indirect hops) until the packet reaches a router on the destination’s network.
  5. The final router performs direct delivery to the destination host using ARP to resolve the destination’s MAC address.
- **Examples (from the Image)**:
  - **Case 2**: A host sends a packet to a host on another network. The packet is first sent to the router (indirect delivery), which forwards it toward the destination network.
  - **Case 3**: A router forwards a packet to another router (indirect delivery) because the destination is on a different network.
  - **Case 4**: The final router delivers the packet to a host on its own network (this step is direct delivery, but the overall process involved indirect delivery through prior routers).
- **Key Point**: Indirect delivery involves multiple hops across routers, operating at the network layer (Layer 3), with each hop potentially involving direct delivery at the link layer within a subnet.

![[Pasted image 20250504024524.png]]

### Forwarding
Forwarding is the process by which a router or network device determines where to send a packet toward its destination based on the destination IP address. It involves looking up the next hop (the next device in the path) and sending the packet there. Forwarding occurs at the network layer (Layer 3) and is a key part of packet delivery across networks, especially in **indirect delivery** (as seen in Cases 2, 3, and 4 in the image).

### Forwarding Techniques:
Forwarding techniques describe how routers decide the next hop for a packet. The main techniques are:

1. **Next-Hop Forwarding**:
   - The router uses the destination IP address to look up the next hop in its routing table.
   - The routing table provides the IP address of the next device (router or host) and the outgoing interface.
   - Example: In Case 3 of the image, a router receives a packet, looks up the next router’s IP in its routing table, and forwards the packet to that router (indirect delivery).

2. **Network-Specific Forwarding**:
   - The router forwards packets based on the destination network rather than the specific host.
   - The routing table has entries for networks (e.g., 192.168.1.0/24), and the router matches the destination IP to the appropriate network entry.
   - This reduces the size of routing tables by grouping hosts into networks.

3. **Host-Specific Forwarding**:
   - The router forwards packets to a specific host, not just a network.
   - This is less common and used for special cases (e.g., a specific server needing unique routing).

4. **Default Forwarding (Default Route)**:
   - If no specific match is found in the routing table, the router uses a default route (often 0.0.0.0/0) to forward the packet to a default gateway.
   - Example: In Case 2, the host sends a packet to a different network via its default gateway (router), which then forwards it further.

### Forwarding Process:
The forwarding process outlines the steps a router takes to forward a packet:

1. **Receive Packet**: The router receives a packet on one of its interfaces.
   - Example: In Case 3, a router receives a packet destined for a host on another network.

2. **Extract Destination IP**: The router examines the packet’s header to get the destination IP address.
   - Example: In Case 4, the router sees the destination IP (a host on its own network).

3. **Routing Table Lookup**:
   - The router consults its routing table to find the best match for the destination IP.
   - It uses the longest prefix match (most specific route). For example, a route for 192.168.1.0/24 is chosen over 192.168.0.0/16 if the destination is 192.168.1.10.

4. **Determine Next Hop**:
   - The routing table provides the next-hop IP address (another router or the final host) and the outgoing interface.
   - Example: In Case 3, the routing table points to another router as the next hop (as indicated by “IP address of the appropriate router found in the routing table”).

5. **ARP Resolution (if needed)**:
   - If the next hop is on the same network, the router uses ARP to resolve the next hop’s IP to a MAC address.
   - Example: In Case 4, the router resolves the host’s IP to its MAC address for direct delivery.

6. **Forward Packet**:
   - The router encapsulates the packet in a new frame with the next hop’s MAC address and sends it out the appropriate interface.
   - Example: In Case 2, the host forwards the packet to the router, which then forwards it toward the destination network.

7. **Repeat (if Indirect)**:
   - If the next hop is another router, the process repeats until the packet reaches the destination network for direct delivery (as in Case 4).

### Routing Table:
A routing table is a data structure stored in a router that maps destination IP addresses (or networks) to next-hop addresses and outgoing interfaces. It’s the core of the forwarding process.

#### Structure of a Routing Table:
- **Destination**: The target network or host IP (e.g., 192.168.1.0/24 for a network).
- **Mask**: The subnet mask to determine the range of IPs covered (e.g., /24 means the first 24 bits must match).
- **Next Hop**: The IP address of the next device to send the packet to (e.g., another router or the final host).
- **Interface**: The outgoing interface on the router to use (e.g., eth0).
- **Metric (optional)**: A value indicating the route’s preference (lower is better) if multiple routes exist.
- **Gateway (optional)**: For default routes, the default gateway IP.

#### Example Routing Table:
| Destination | Mask | Next Hop      | Interface |
| ----------- | ---- | ------------- | --------- |
| 192.168.1.0 | /24  | Direct        | eth0      |
| 10.0.0.0    | /8   | 192.168.1.1   | eth1      |
| 0.0.0.0     | /0   | 192.168.1.254 | eth1      |

- If a packet is destined for 192.168.1.10, it matches 192.168.1.0/24, and the router delivers it directly via eth0 (direct delivery, like Case 4).
- If a packet is destined for 10.0.0.5, it matches 10.0.0.0/8, and the router forwards it to 192.168.1.1 via eth1 (indirect delivery, like Case 3).
- If a packet is destined for 172.16.1.1 (no specific match), it uses the default route (0.0.0.0/0) and forwards to 192.168.1.254 (like Case 2).
