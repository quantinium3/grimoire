---
id: HTTP
aliases: []
tags: []
---

HTTP (Hypertext Transfer Protocol) is a language for computer to communicate with each other on web. At heart HTTP sits above TCP and is therefore a request-response model.

The "requesting" computer, also known as "client", asks another computer for some information. That computer, "the server" send back a response with the information that the client asked for.

## HTTP Urls
A URL(uniform resource locator), is essentially the address of the server on the internet.
``` 
http://example.com 
```
the ==http://== at the starting tells us about the Protocol by which the data is being transferred.

## JS fetch api
In JS we use its fetch api to do http requests.
``` Javascript
const response = await fetch(url, settings)
const responseData = await response.json()
```

- ==response== is the data we receive from the server.
- ==url== is the endpoint from where we are fetching the data.
- ==settings== is an object containing some request-specific setting.
- ==await== is a JS keyword for telling it to wait till the response arrives.
- ==response.json()== converts the response data from server into json.

## Web Client
A Web client is a computer that sends the request of data to a server. It can be any computer like a phone, pc, game console, fridge or even a server(a server sending req to another server is a client as its just a name assigned to a computer that requests stuff).

A web client is the front-end. 

## Web Server
A server is a computer that serves data to a client upon requesting to a web client.

The server has a port to listen the request from the client and do some computation and send the appropriate response to the client.

While the Web client is the front-end, the Web server is the back-end.

## Web Addresses
In real world, like we use house addresses to navigate to someones house. Similarly we have IP (internet Protocol) that is kind of the address of a computer.

An IP address is a numerical label that servers two putpose:
1. Location Addressing
2. Network identification

### Domain names and ip addresses
Each device connected to the internet has a unique IP address. The router refer to this IP address to send and receive requests.

### DNS 
When we browse the internet and go a website like ==google.com== before sending the fetch request, the url gets converted to a specific IP address that is stored in the DNS (it has convertion table for website to their IP addresses). 

In JS we can use its inbuilt URL to get hostname of an address
```Javascript
const urlObj = new URL('https://boot.dev/learn/learn-python')
const urlObj.hostname // boot.dev
```

[**DNS**](https://en.wikipedia.org/wiki/Domain_Name_System) or "Domain Name System", is like a phonebook of all the hostnames mapped to their IP address. DNS "resolves" these domain names to find the associated "IP Address" so the web clients can load the resources for the specific address.

When we make a request to a specific domain name like ==example.com==.
There are 4 DNS servers involved - 
- DNS recursor - It receives request from the client and makes additional requests to satisfy clients DNS query.
- Root nameserver - It serves as a reference to other more specific location.
- TDL nameserver - It extract the top level domain(.com, .gov, .jp, .tv, etc).
- Authoritative nameserver - In it the specific name is looked up and the IP address will then be returned to DNS server that made the initial request. It is the server that contains the DNS resource records.

### Sub Domains
It's the prefix that is added to domain name allowing a domain to route network traffic to some other server where the data is stored.
Example- 
==www.netflix.com== is the domain name where we can watch netflix show.
==www.jobs.netflix.com== is the domain name of the site where we can see latest job posting available at netflix. Here ==jobs== is the sub-domain.

## URI
A URI, Uniform resource identifier, is a unique character sequence that identifies a resource that is (almost always) access by the internet.
URI are of two types:
- URL
- URN

[URI](https://storage.googleapis.com/qvault-webapp-dynamic-assets/course_assets/dcBoy2F.png)

### Parts of a URL
There are 8 main parts of a url though not always all 8 are present.
[part of URL](https://storage.googleapis.com/qvault-webapp-dynamic-assets/course_assets/7obhZ2w.png)

#### The Protocols
The 'protocols' or the 'scheme' is the first component of the url. It's purpose is to define the rules by which the data being communicated is displayed, encoded and formatted.

Some example of different protocols
- HTTP - Hypertext Transfer Protocol
- FTP - File Transfer Protocol
- SMTP - Secure Mail Transfer Protocol
- HTTPS - Hypertext Transfer Protocol Secure

#### Ports
The Port in the URL is a virtual hub to which the data is transmitted to. The ports are handled by the operating system. There are 2^16 (0 -> 65535) ports. 
When you connect to a computer on network, you are connected to a specific port on that computer. If not specifically mentioned in the URL, then the system uses default ports assigned (==$ cat /etc/services== on any unix system). For HTTP - 80, HTTPS - 443. When you aren't using default port, you have to specify in the URL like developers generally use port ==8080== as a testing port that is HTTP-ALT. 

#### URL paths
In early days of internet and even today, many web servers hosted raw file over the internet and to access different pages we would just change the path just like we do on out computers. 

Like if i host my ==docs== directory. it would search index.html in /docs. We can see other files in the docs folder by just appending the path like i have another page that inside ==http== directory inside of ==docs==. We would just append /docs/http. The server will host index.html inside http directory.

Most modern web servers don't use simple mapping of ==URL PATH -> file path==. Since URL is just a string so we can just map it to anything. So generally we just use them like flags and show the data depending upon that.

#### Query Parameters
Query parameters are often used to change page's contents or market analysis. like ==https://google.com/search?q=hello== will search hello for you.

## Async
Asynchronous code allow the execution of the code and not have to wait for that async operation to finish. Like in a website, when we fetch data it may take more time if we are hitting many different service. We don't the website to be unusable for that long. So we do fetch operation asynchronously and let the server send data and fill the data on the site afterwards the page has rendered.

#### Promises in JS
The ==Promise Object== in JS represent eventual fulfilment or rejection of our promise. While the promise is being fulfilled or rejected other part of code will execute.
``` Javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    if (getRandomBool()) {
      resolve("resolved!")
    } else {
      reject("rejected!")
    }
  }, 1000)
})

function getRandomBool(){
  return Math.random() < .5
}
```

while the ==await== keyword can be used place ==.then()== to resolve a promise, the ==async== keyword is used in place of ==new Promise== to create a new promise.

## Headers
An HTTP header allows the client and server to pass additional information with each request or response. They are just key-value pair that pass additional metadata like type of content needed, operating system, the type of client, etc.

## HTTP Methods
HTTP defines a set of methods that we can use everytime while we make a request to the server to make it a do a specific thing.

Most backend developers write their server code that the methods correspond with "CRUD" actions.
C - Create
R - Read
U - Update
D - Delete

Due to this the 3 most common HTTP methods are:
POST - Create
GET - Read
PUT - Update
DELETE - Delete

### GET
It is used to "get" or fetch some data from the server. GET requests are safe methods as they dont alter the state of the server.

``` Javascript
await fetch(url, {
  method: 'GET',
  mode: 'cors',
  headers: {
    'sec-ch-ua-platform': 'macOS'
  }
})

```

### POST
It is used to "Post" or send or create data to the server. It is an unsafe method as it alters the state of the server.

```Javascript
await fetch(url, {
  method: 'POST',
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
})
```

### PUT
It creates a new resource or updates the resources properties.

```Javascript
await fetch(url, {
   method: 'PUT',
   mode: 'cors',
   headers: {
   'Content-Type': 'application/json'
   },
   body: JSON.stringify(data)
})
```

#### POST VS PUT 
The main difference between POST and PUT is that PUT is [idempotent](https://developer.mozilla.org/en-US/docs/Glossary/Idempotent) - it doesn't have side effects if we send the same PUT requests repeatedly.
On the other hand POST is not idempotent as sending repeat POST requests can create copies of the same data.

### DELETE
It deletes the specified resource.

```Javascript
// This deletes the location with ID: 52fdfc07-2182-454f-963f-5f0f9a621d72
const url = 'https://api.boot.dev/v1/courses_rest_api/learn-http/locations/52fdfc07-2182-454f-963f-5f0f9a621d72'

await fetch(url, {
  method: 'DELETE',
  mode: 'cors'
})
```
### PATCH
Patch is intended to partially modify a resource. 

Many servers even if they support partial updates will still use PUT instead of PUT as PUT is generally more known than PATCH.
### HTTP status code
- ==100-199==: informational responses
- ==200-299==: Successful responses
- ==300-399==: Redirection message.
- ==400-499==: Client Error
- ==500-599==: Server Error

Some common status codes
- 200 - OK
- 201 - Created. Successful POST.
- 301 - Moved Permanently
- 400 - Bad request
- 401 - Unauthorized
- 404 - Not found
- 500 - Internal Server Error

#### [Website to look up status codes](https://github.com/httpcats/http.cat)

## REST API
[Representational State Transfer or REST](https://developer.mozilla.org/en-US/docs/Glossary/REST) follow a loose set of rules that make it easy to build reliable and predictable web API's. REST is conventions how HTTP should be used.

**Seperate and Agnostic** - In it resources are transferred via well-recognized, language-agnostic client/server interactions. A RESTful style means that implementaton of both client/server can be done independently as long as some standards are established.
**Stateless** - The server doesnt need to know the state of the client, nor does the client need to care what state the server is in. Statelessness in REST is enforced by interacting with resources instead of command.

```
https://api.github.com/repos/OWNER/REPO - to get info about the repo
https://api.github.com/repos/OWNER/REPO/commits - to get total commits of a repo
```

## HTTPS - HTTP Secure
Extension of HTTP. It uses [Transport Layer Security](https://en.wikipedia.org/wiki/Transport_Layer_Security) (TLS) or Secure Sockets Layer(SSL) to encrypt data for secure communication over networks.

**How it Works(On a really higher level)**:
- Client sends a request to the server.
- Server sends a public key to the client key and keeps the private key. The public key can only encrypt and private key and only decrypt.
- Client and server negotiate a symmetric key(can both encrypt and decrypt) as the server response should be encrypted too.
- Client sends encrypted HTTP request.
- Server decrypts it and process it.
- Server sends encrypted response to the client.
- Client decrypts the response.

