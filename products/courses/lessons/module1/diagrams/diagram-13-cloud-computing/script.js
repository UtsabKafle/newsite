(function(){'use strict';
var components = [
  {id:"saas",name:"Software as a Service",category:"Software",icon:"cloud",shape:"rounded-rect",x:110,y:16,w:135,h:50,purpose:"Delivers fully functional software applications over the Internet on a subscription basis",description:"SaaS provides ready-to-use applications like email, office tools, and CRM accessed through a browser without any local installation.",why:"SaaS eliminates software installation, maintenance, and upgrade hassles",analogy:"Like renting a fully furnished apartment instead of buying and furnishing your own",funFact:"Google Workspace and Microsoft 365 together have over 5 billion users",takeaway:"With SaaS, you use the software but don\\'t manage the underlying infrastructure",mistake:"SaaS isn\\'t just about cost—it also provides automatic updates and scaling",descriptionDetailed:"SaaS applications run on the provider\\'s infrastructure and are accessed via web browser or API. The provider handles all maintenance, security patching, and scaling. Multi-tenancy allows one instance to serve many customers with data isolation."},
  {id:"paas",name:"Platform as a Service",category:"Software",icon:"cloud",shape:"rounded-rect",x:110,y:88,w:135,h:50,purpose:"Provides a platform for developers to build and deploy applications without managing infrastructure",description:"PaaS offers runtime environments, databases, and development tools so developers can focus on code while the platform handles servers and scaling.",why:"PaaS accelerates development by removing infrastructure management overhead",analogy:"Like a fully equipped commercial kitchen where chefs just cook without worrying about utilities",funFact:"Heroku pioneered PaaS by letting developers deploy apps with a single git push",takeaway:"PaaS abstracts away servers, OS, and middleware, letting developers focus on code",mistake:"PaaS isn\\'t just hosting—it includes databases, caching, and scaling built in",descriptionDetailed:"PaaS platforms provide managed runtimes for languages like Node.js, Python, or Java. They include auto-scaling, load balancing, database services, and CI/CD pipelines."},
  {id:"iaas",name:"Infrastructure as a Service",category:"Software",icon:"cloud",shape:"rounded-rect",x:110,y:160,w:135,h:50,purpose:"Provides virtualized computing resources like servers, storage, and networking on demand",description:"IaaS offers virtual machines, storage volumes, and virtual networks that you provision and manage through a web interface or API.",why:"IaaS replaces physical data centers with instantly available virtual infrastructure",analogy:"Like renting raw land and building your own house instead of buying an existing one",funFact:"AWS EC2 launched in 2006 and completely changed how companies buy computing",takeaway:"IaaS gives you the most control but also the most management responsibility",mistake:"IaaS isn\\'t necessarily cheaper than owning hardware—it depends on utilization",descriptionDetailed:"IaaS provides virtual machines with configurable CPU, RAM, and storage. Resources can be scaled up or down in minutes. Billing is typically pay-as-you-go based on consumption."},
  {id:"public",name:"Public Cloud",category:"Software",icon:"globe",shape:"pill",x:50,y:248,w:110,h:52,purpose:"Cloud services delivered over the public Internet and shared across multiple organizations",description:"Public cloud resources like AWS, Azure, or GCP are hosted on the provider\\'s premises and shared among many customers with strong isolation.",why:"Public cloud offers massive scale and economies of scale that no single company can match",analogy:"Like riding a public bus that many people share, each paying for their own seat",funFact:"AWS offers over 200 services and generates over $80 billion in annual revenue",takeaway:"Public cloud provides unlimited on-demand resources with pay-as-you-go pricing",mistake:"Public cloud isn\\'t less secure—providers invest billions in security",descriptionDetailed:"Public cloud providers own and operate massive data centers globally. Resources are multi-tenant with virtual isolation. Services span compute, storage, databases, AI/ML, IoT, and more."},
  {id:"private",name:"Private Cloud",category:"Software",icon:"lock",shape:"pill",x:184,y:248,w:110,h:52,purpose:"Cloud services dedicated to a single organization, often on-premises",description:"Private cloud provides the same self-service and scalability as public cloud but on infrastructure dedicated to one organization.",why:"Private cloud offers greater control and compliance for sensitive data",analogy:"Like owning your own car instead of using a ride-sharing service",funFact:"OpenStack is the most popular open-source private cloud platform",takeaway:"Private cloud is chosen for security, compliance, or regulatory requirements",mistake:"Private cloud doesn\\'t mean it\\'s on-premises—it can be hosted by a third party exclusively for you",descriptionDetailed:"Private cloud uses virtualization and orchestration to create a cloud-like environment on dedicated hardware. It provides self-service provisioning, metering, and automation."},
  {id:"hybrid",name:"Hybrid Cloud",category:"Software",icon:"network",shape:"rounded-rect",x:131,y:328,w:118,h:52,purpose:"Combines public and private cloud, allowing workloads to move between them",description:"Hybrid cloud connects on-premises or private cloud infrastructure with public cloud resources, enabling data sharing and workload portability.",why:"Hybrid cloud offers the best of both worlds—flexibility of public cloud with control of private",analogy:"Like having a home kitchen and the ability to order from restaurants when needed",funFact:"Over 80% of enterprises use a hybrid cloud strategy",takeaway:"Hybrid cloud allows bursting to public cloud during peak demand while keeping sensitive data on-premises",mistake:"Hybrid cloud isn\\'t just two clouds—it requires networking, security, and orchestration integration",descriptionDetailed:"Hybrid cloud requires VPN or dedicated connections between environments. Orchestration tools like Kubernetes can manage workloads across both clouds."}
];
var connections = [{from:"saas",to:"paas"},{from:"paas",to:"iaas"},{from:"iaas",to:"public"},{from:"public",to:"private"},{from:"private",to:"hybrid"}];
var steps = [{label:"Step 1: Software as a Service",status:"Exploring: Software as a Service - Delivers fully functional software applications over the Internet on a subscription basis"},{label:"Step 2: Platform as a Service",status:"Exploring: Platform as a Service - Provides a platform for developers to build and deploy applications without managing infrastructure"},{label:"Step 3: Infrastructure as a Service",status:"Exploring: Infrastructure as a Service - Provides virtualized computing resources like servers, storage, and networking on demand"},{label:"Step 4: Public Cloud",status:"Exploring: Public Cloud - Cloud services delivered over the public Internet and shared across multiple organizations"},{label:"Step 5: Private Cloud",status:"Exploring: Private Cloud - Cloud services dedicated to a single organization, often on-premises"},{label:"Step 6: Hybrid Cloud",status:"Exploring: Hybrid Cloud - Combines public and private cloud, allowing workloads to move between them"}];
var tour = [{title:"Software as a Service",description:"Delivers fully functional software applications over the Internet on a subscription basis",componentId:"saas"},{title:"Platform as a Service",description:"Provides a platform for developers to build and deploy applications without managing infrastructure",componentId:"paas"},{title:"Infrastructure as a Service",description:"Provides virtualized computing resources like servers, storage, and networking on demand",componentId:"iaas"},{title:"Public Cloud",description:"Cloud services delivered over the public Internet and shared across multiple organizations",componentId:"public"},{title:"Private Cloud",description:"Cloud services dedicated to a single organization, often on-premises",componentId:"private"},{title:"Hybrid Cloud",description:"Combines public and private cloud, allowing workloads to move between them",componentId:"hybrid"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Cloud Computing',
    subtitle: 'How Internet Works',
    desc: 'Explore SaaS, PaaS, IaaS, and cloud deployment models.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    packetFlow: [
      {label:'SaaS Request',color:'#22c55e'},
      {label:'PaaS Service',color:'#60a5fa'},
      {label:'IaaS Resource',color:'#c084fc'},
      {label:'Public Cloud',color:'#f59e0b'},
      {label:'Private Cloud',color:'#22c55e'}
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