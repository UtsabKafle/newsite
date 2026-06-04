(function(){'use strict';
var components = [
  {id:"browser",name:"Web Browser",category:"Software",icon:"browser",shape:"circle",x:125,y:15,w:110,h:50,purpose:"Triggers a DNS lookup when you type a URL and press Enter",description:"The browser checks its own cache first, and if the IP isn\\'t found, it asks the operating system\\'s resolver to perform a DNS query.",why:"DNS lookup is the critical first step before any web request can happen",analogy:"Like looking up a friend\\'s phone number before calling them",funFact:"Browsers cache DNS results aggressively, sometimes for minutes or hours",takeaway:"Every website visit starts with a DNS query, even if you don\\'t notice it",mistake:"The browser doesn\\'t query DNS servers directly?'it asks the OS resolver",descriptionDetailed:"The browser first checks its internal DNS cache, then calls the operating system\\'s gethostbyname or getaddrinfo function. The browser sets a timeout for the DNS query and will display an error if it fails. Chrome and Firefox also support DNS-over-HTTPS for encrypted lookups."},
  {id:"resolver",name:"DNS Recursive Resolver",category:"Network",icon:"dns",shape:"rounded-rect",x:125,y:95,w:110,h:50,purpose:"Queries the DNS hierarchy on behalf of the client to find the IP address",description:"The resolver starts the lookup chain by contacting root servers, then TLD servers, and finally authoritative servers until it finds the answer.",why:"Resolvers do the heavy lifting of navigating the DNS hierarchy",analogy:"Like a research assistant who goes to the library, checks the catalog, and finds the book for you",funFact:"Google\\'s public DNS at 8.8.8.8 handles over 100 billion queries per day",takeaway:"The resolver acts as your agent in the DNS lookup process",mistake:"A resolver doesn\\'t own any domain data?'it\\'s just a middleman",descriptionDetailed:"The resolver is configured by the ISP or manually (like 8.8.8.8). It queries servers iteratively, starting from the root and following referrals. Results are cached with TTL values to speed up subsequent queries."},
  {id:"root",name:"Root Name Server",category:"Network",icon:"server",shape:"hexagon",x:125,y:170,w:110,h:50,purpose:"Directs resolvers to the appropriate TLD server for the domain extension",description:"Root servers are the top of the DNS hierarchy, answering queries by pointing to TLD servers like .com, .org, or .net.",why:"Root servers are the starting point for every DNS resolution",analogy:"Like the main library index that tells you which section of the library to go to",funFact:"There are 13 root server identities, but they are replicated across hundreds of physical servers",takeaway:"Root servers don\\'t know individual domain IPs?'only where to find TLD servers",mistake:"Root servers are not controlled by any single country or company",descriptionDetailed:"Root servers are operated by 12 organizations including Verisign, ICANN, and universities. They answer queries with a referral to the appropriate TLD name server. Anycast routing allows multiple physical servers to share one IP address for resilience."},
  {id:"tld",name:"TLD Name Server",category:"Network",icon:"globe",shape:"pill",x:50,y:245,w:110,h:50,purpose:"Manages all domains under a specific top-level extension like .com or .org",description:"The TLD server stores the names of authoritative name servers for every domain registered under that extension.",why:"TLD servers are the bridge between domain extensions and specific domains",analogy:"Like a phone book for all names ending in .com",funFact:"The .com TLD has over 150 million registered domains",takeaway:"TLD servers know which authoritative server has details for each domain",mistake:"TLD servers don\\'t store IP addresses?'they store references to authoritative servers",descriptionDetailed:"TLD servers are operated by registries like Verisign (.com, .net) and PIR (.org). They maintain records of which name servers are authoritative for each registered domain. The resolver queries the TLD server with the domain name and receives a referral to the authoritative server."},
  {id:"authoritative",name:"Authoritative Name Server",category:"Network",icon:"globe",shape:"pill",x:200,y:245,w:110,h:50,purpose:"Holds the actual DNS records for a specific domain and provides the final answer",description:"The authoritative server contains A, AAAA, MX, CNAME, and other records that map a domain to its IP address and services.",why:"Authoritative servers are the source of truth for domain information",analogy:"Like the county clerk\\'s office that holds the official property records",funFact:"Authoritative servers can be configured with TTL values of seconds to days",takeaway:"This is the server that finally tells your browser the IP address",mistake:"Authoritative servers don\\'t perform recursion?'they only answer for domains they control",descriptionDetailed:"Authoritative servers host zone files containing resource records for the domain. They can be primary (master) or secondary (slave) for redundancy. Common record types include A (IPv4), AAAA (IPv6), MX (mail), CNAME (aliases), and TXT (text data)."},
  {id:"cache",name:"DNS Cache",category:"Network",icon:"database",shape:"rounded-rect",x:125,y:320,w:110,h:50,purpose:"Stores recent DNS lookup results to speed up future queries",description:"DNS caches at every level?'browser, OS, resolver, and server?'store previously resolved IPs so repeat lookups are instant.",why:"Caching drastically reduces DNS lookup times and network traffic",analogy:"Like memorizing a frequently called phone number instead of looking it up each time",funFact:"DNS caching can reduce lookup times from hundreds of milliseconds to under one millisecond",takeaway:"Cached records remain valid only for their configured TTL period",mistake:"DNS caches can serve stale records if not managed properly",descriptionDetailed:"Each DNS response includes a TTL value telling the cache how long to keep the record. When a cached record expires, the next query triggers a fresh lookup. Negative caching also stores failed lookups to prevent repeated queries for nonexistent domains."}
];
var connections = [{from:"browser",to:"resolver"},{from:"resolver",to:"root"},{from:"root",to:"tld"},{from:"tld",to:"authoritative"},{from:"authoritative",to:"cache"}];
var steps = [{label:"Step 1: Web Browser",status:"Exploring: Web Browser - Triggers a DNS lookup when you type a URL and press Enter"},{label:"Step 2: DNS Recursive Resolver",status:"Exploring: DNS Recursive Resolver - Queries the DNS hierarchy on behalf of the client to find the IP address"},{label:"Step 3: Root Name Server",status:"Exploring: Root Name Server - Directs resolvers to the appropriate TLD server for the domain extension"},{label:"Step 4: TLD Name Server",status:"Exploring: TLD Name Server - Manages all domains under a specific top-level extension like .com or .org"},{label:"Step 5: Authoritative Name Server",status:"Exploring: Authoritative Name Server - Holds the actual DNS records for a specific domain and provides the final answer"},{label:"Step 6: DNS Cache",status:"Exploring: DNS Cache - Stores recent DNS lookup results to speed up future queries"}];
var tour = [{title:"Web Browser",description:"Triggers a DNS lookup when you type a URL and press Enter",componentId:"browser"},{title:"DNS Recursive Resolver",description:"Queries the DNS hierarchy on behalf of the client to find the IP address",componentId:"resolver"},{title:"Root Name Server",description:"Directs resolvers to the appropriate TLD server for the domain extension",componentId:"root"},{title:"TLD Name Server",description:"Manages all domains under a specific top-level extension like .com or .org",componentId:"tld"},{title:"Authoritative Name Server",description:"Holds the actual DNS records for a specific domain and provides the final answer",componentId:"authoritative"},{title:"DNS Cache",description:"Stores recent DNS lookup results to speed up future queries",componentId:"cache"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Dns Lookup',
    subtitle: 'How Internet Works',
    desc: 'Follow the DNS resolution chain from browser to root, TLD, and authoritative servers.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    packetFlow: [
      {label:'Recursive Query',color:'#22c55e'},
      {label:'Root Query',color:'#60a5fa'},
      {label:'TLD Query',color:'#c084fc'},
      {label:'Authoritative',color:'#f59e0b'},
      {label:'Final Answer',color:'#22c55e'}
    ],

    render: function(container, engine) {
      engine.buildVisual(container);
      engine._setStatus('Click any component to learn more');
    },

    animate: function(engine) {
      var svg = engine.el.visual.querySelector('svg');
      if (!svg || engine.selectedId || !engine.playing) return;
      var comps = svg.querySelectorAll('.component');
      var idx = Math.floor(engine.t * 0.5) % comps.length;
      comps.forEach(function(el, i) {
        var bg = el.querySelector('.component-bg');
        if (!bg) return;
        var shape = bg.querySelector(':scope > :first-child');
        if(!shape)return;
        shape.setAttribute('fill', i === idx ? '#1e2d50' : '#1a2235');
        shape.setAttribute('stroke', i === idx ? '#0959C8' : '#2a3a55');
      });
    },

    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();
