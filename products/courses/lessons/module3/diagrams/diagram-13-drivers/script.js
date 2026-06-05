(function(){'use strict';
var components = [    {id:"driver",name:"Hardware Driver",category:"Software",purpose:"Enables communication between the OS and specific hardware components",description:"Drivers act as translators between the operating system and hardware, converting generic OS commands into device-specific instructions.",why:"Without the correct drivers, hardware either doesn\\'t work or works poorly",analogy:"Like an interpreter that translates between two languages",funFact:"The Windows Driver Kit allows anyone to develop signed drivers for Windows",takeaway:"Always download drivers from the official manufacturer website, not third-party sites",mistake:"Installing the wrong driver version can cause crashes or hardware malfunction",descriptionDetailed:"Drivers run in kernel or user mode. Signed drivers are verified by the OS for security. Driver updates can improve performance and fix bugs. Device Manager shows all installed drivers with status indicators."},    {id:"utility",name:"System Utility",category:"Software",purpose:"Provides tools for system configuration, monitoring, and maintenance",description:"Utilities include manufacturer software for overclocking, fan control, lighting control, and system monitoring, plus third-party tools.",why:"Utilities give you control over hardware settings not available in the OS",analogy:"Like a remote control that adjusts TV settings beyond basic on/off",funFact:"MSI Afterburner is one of the most popular GPU overclocking utilities",takeaway:"Install only the utilities you need—bloatware slows down your system",mistake:"Some manufacturer utilities run background services that consume resources unnecessarily",descriptionDetailed:"Common utilities include CPU-Z (system info), HWMonitor (temperatures), GPU-Z (graphics info), and manufacturer-specific software for RGB control and fan curves. Many utilities can create system restore points."},    {id:"codec",name:"Audio/Video Codec",category:"Software",purpose:"Encodes and decodes digital media for playback and editing",description:"Codecs compress raw audio and video data into manageable file sizes (encoding) and decompress them for playback (decoding).",why:"Codecs make it possible to store and stream high-quality media efficiently",analogy:"Like a packing system that squeezes clothes into a suitcase and unpacks them",funFact:"H.264 is the most widely used video codec, supported by virtually all devices",takeaway:"Codec packs like K-Lite enable playback of many media formats",mistake:"Missing codecs cause \\'no audio\\' or \\'cannot play\\' errors in media players",descriptionDetailed:"Lossy codecs (MP3, AAC, H.264) sacrifice quality for size. Lossless codecs (FLAC, PNG) preserve original quality. Video codecs use inter-frame compression to reduce file size. Modern codecs like AV1 offer better compression efficiency."},    {id:"runtime",name:"Runtime Library",category:"Software",purpose:"Provides pre-built functions that applications need to run",description:"Runtimes like DirectX, .NET Framework, Visual C++ Redistributable, and Java provide common code libraries that many applications depend on.",why:"Runtimes ensure compatibility and provide standard functions for applications",analogy:"Like shared kitchen facilities in an apartment building that all residents can use",funFact:"Games require DirectX runtime, which installs with Windows or game installers",takeaway:"Install runtimes when prompted—many applications won\\'t start without them",mistake:"Manually deleting runtime files can break multiple applications",descriptionDetailed:"DirectX handles graphics and audio for games. .NET Framework supports C# applications. Visual C++ Redistributables are needed by many programs compiled in C++. Java Runtime Environment runs Java applications."},    {id:"update",name:"Software Update",category:"Software",purpose:"Keeps drivers, utilities, and applications current with latest fixes",description:"Update mechanisms check for newer versions of installed software and apply patches that fix bugs, close security holes, and add features.",why:"Regular updates are critical for security and stability",analogy:"Like getting regular check-ups and vaccinations to stay healthy",funFact:"Windows Update has been providing automatic updates since Windows 98",takeaway:"Enable automatic updates where possible for the best protection",mistake:"Delaying updates leaves security vulnerabilities unpatched",descriptionDetailed:"Updates can be security patches, feature updates, or cumulative rollups. Windows Update manages OS and Microsoft driver updates. Third-party software has its own update checkers. Some updates require system reboot to apply."},    {id:"config",name:"Software Configuration",category:"Software",purpose:"Customizes settings for hardware and software to user preferences",description:"Configuration involves adjusting settings in the OS, BIOS, or individual applications to optimize performance, security, and user experience.",why:"Proper configuration unlocks performance and tailors the system to your needs",analogy:"Like adjusting the seat, mirrors, and steering wheel in a rental car",funFact:"Windows has over 200 configurable Group Policy settings for enterprise management",takeaway:"Default settings work for most users, but tweaking can improve performance",mistake:"Unoptimized settings can leave performance on the table—like RAM running at default JEDEC speeds instead of XMP",descriptionDetailed:"Common configurations include enabling XMP for RAM speed, setting power plan to High Performance, disabling startup programs, and configuring antivirus exclusions for performance applications."}];
var connections = [{from:"driver",to:"utility"},{from:"utility",to:"codec"},{from:"codec",to:"runtime"},{from:"runtime",to:"update"},{from:"update",to:"config"}];
var steps = [{label:"Step 1: Hardware Driver",status:"Exploring: Hardware Driver - Enables communication between the OS and specific hardware components"},{label:"Step 2: System Utility",status:"Exploring: System Utility - Provides tools for system configuration, monitoring, and maintenance"},{label:"Step 3: Audio/Video Codec",status:"Exploring: Audio/Video Codec - Encodes and decodes digital media for playback and editing"},{label:"Step 4: Runtime Library",status:"Exploring: Runtime Library - Provides pre-built functions that applications need to run"},{label:"Step 5: Software Update",status:"Exploring: Software Update - Keeps drivers, utilities, and applications current with latest fixes"},{label:"Step 6: Software Configuration",status:"Exploring: Software Configuration - Customizes settings for hardware and software to user preferences"}];
var tour = [{title:"Hardware Driver",description:"Enables communication between the OS and specific hardware components",componentId:"driver"},{title:"System Utility",description:"Provides tools for system configuration, monitoring, and maintenance",componentId:"utility"},{title:"Audio/Video Codec",description:"Encodes and decodes digital media for playback and editing",componentId:"codec"},{title:"Runtime Library",description:"Provides pre-built functions that applications need to run",componentId:"runtime"},{title:"Software Update",description:"Keeps drivers, utilities, and applications current with latest fixes",componentId:"update"},{title:"Software Configuration",description:"Customizes settings for hardware and software to user preferences",componentId:"config"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Drivers',
    subtitle: 'Computer Assembly',
    desc: 'Match device drivers to their hardware and functions.',
    module: 3,
    difficulty: 'Intermediate',
    time: '10',
    objectives: 'Match device drivers to their hardware and functions.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    
    render: function(container, engine) {
      engine.buildDragMatching(container, {
        items: [
          {id: 'driver', label: 'Hardware Driver', slot: 'hwcomm'},
          {id: 'utility', label: 'System Utility', slot: 'sysopt'},
          {id: 'codec', label: 'Audio/Video Codec', slot: 'mediaplay'},
          {id: 'runtime', label: 'Runtime Library', slot: 'appexec'},
          {id: 'update', label: 'Software Update', slot: 'patch'},
          {id: 'config', label: 'Software Configuration', slot: 'settings'}
        ],
        slots: [
          {id: 'hwcomm', label: 'Hardware communication'},
          {id: 'sysopt', label: 'System optimization'},
          {id: 'mediaplay', label: 'Media playback support'},
          {id: 'appexec', label: 'Application execution'},
          {id: 'patch', label: 'Bug fixes and features'},
          {id: 'settings', label: 'Software settings management'}
        ]
      });
    },
    
    animate: function() {},
    
    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();