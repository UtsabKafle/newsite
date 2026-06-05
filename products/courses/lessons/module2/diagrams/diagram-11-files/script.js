(function(){'use strict';
var components = [    {id:"file",name:"File",category:"Storage",purpose:"A named container that stores related data on a storage device",description:"A file is the basic unit of storage, containing data like text, images, programs, or any digital content, identified by a name and extension.",why:"Files organize data into discrete, manageable units",analogy:"Like a document in a filing cabinet that contains specific information",funFact:"The first computer files were called datasets and used in the 1950s",takeaway:"Everything stored on a computer is stored in files",mistake:"A file\\'s extension doesn\\'t change its internal format—it just tells the OS what program to use",descriptionDetailed:"Files are stored as sequences of bytes on disk, organized by the filesystem into clusters or blocks. Each file has metadata including name, size, timestamps, and permissions."},    {id:"folder",name:"Folder (Directory)",category:"Storage",purpose:"Organizes files into a hierarchical structure for easy navigation",description:"Folders are special containers that hold files and other folders, creating a tree-like structure that helps users organize and find data.",why:"Folders bring order to the filesystem, preventing chaos",analogy:"Like a drawer in a filing cabinet that holds related documents",funFact:"The first hierarchical filesystem was introduced with Unix in the 1970s",takeaway:"Folders can contain files or other folders, creating a tree structure",mistake:"Folders aren\\'t physical locations—they\\'re logical groupings",descriptionDetailed:"Directories are special files containing a list of entries, each with a name and pointer to an inode. The root directory is the top of the hierarchy."},    {id:"path",name:"File Path",category:"Storage",purpose:"Specifies the unique location of a file or folder in the filesystem",description:"A path is a string that traces the route through the directory tree to reach a specific file, using separators and names.",why:"Paths allow users and programs to precisely locate any file",analogy:"Like directions to a house: city, street, then house number",funFact:"Maximum path length is 255 characters in most Unix systems",takeaway:"Absolute paths start from the root; relative paths start from the current directory",mistake:"Paths aren\\'t case-sensitive on Windows but are on Linux/macOS",descriptionDetailed:"Absolute paths begin with a root indicator. Relative paths start from the current working directory. Dot refers to current directory, dot-dot to parent."},    {id:"metadata",name:"Metadata",category:"Storage",purpose:"Data about files that describes their properties and attributes",description:"Metadata includes information like file size, creation date, modification date, permissions, owner, and file type.",why:"Metadata helps users and the OS understand files without reading them",analogy:"Like the label on a package showing weight, sender, and date",funFact:"A file\\'s metadata can reveal more than its contents sometimes",takeaway:"Metadata is stored separately from file data in the filesystem",mistake:"Metadata isn\\'t visible when you open a file—you see it in properties",descriptionDetailed:"In Unix, metadata is stored in an inode structure. NTFS stores metadata in the Master File Table. Extended attributes can store tags or security labels."},    {id:"permission",name:"File Permissions",category:"Security",purpose:"Controls which users can read, write, or execute a file",description:"Permissions define access rights for the file owner, group members, and others, using read (r), write (w), and execute (x) flags.",why:"Permissions protect files from unauthorized access and modification",analogy:"Like a lock on a door requiring specific keys",funFact:"In Unix, permissions are often represented as a three-digit octal number like 755",takeaway:"Permissions prevent unauthorized users from viewing or modifying files",mistake:"Execute permission means you can run it as a program, not just open it",descriptionDetailed:"Unix permissions have three tiers: owner, group, others. Each tier has read (4), write (2), execute (1) bits. ACLs provide more granular control."},    {id:"type",name:"File Type",category:"Storage",purpose:"Identifies the kind of data a file contains and which application should open it",description:"File types are indicated by extensions (.txt, .jpg) or magic bytes in the file header, telling the OS what format the data is in.",why:"File types ensure files are opened with the correct application",analogy:"Like the label on a can that tells you what food is inside",funFact:"The file command on Unix reads magic bytes, ignoring the extension",takeaway:"The OS uses file extensions to determine which program to launch",mistake:"Changing a file\\'s extension doesn\\'t change its data",descriptionDetailed:"The OS maintains a registry of file extensions mapped to programs. Magic bytes are the first few bytes identifying file format. MIME types are used on the web."}];
var connections = [{from:"file",to:"folder"},{from:"folder",to:"path"},{from:"path",to:"metadata"},{from:"metadata",to:"permission"},{from:"permission",to:"type"}];
var steps = [{label:"Step 1: File",status:"Exploring: File - A named container that stores related data on a storage device"},{label:"Step 2: Folder (Directory)",status:"Exploring: Folder (Directory) - Organizes files into a hierarchical structure for easy navigation"},{label:"Step 3: File Path",status:"Exploring: File Path - Specifies the unique location of a file or folder in the filesystem"},{label:"Step 4: Metadata",status:"Exploring: Metadata - Data about files that describes their properties and attributes"},{label:"Step 5: File Permissions",status:"Exploring: File Permissions - Controls which users can read, write, or execute a file"},{label:"Step 6: File Type",status:"Exploring: File Type - Identifies the kind of data a file contains and which application should open it"}];
var tour = [{title:"File",description:"A named container that stores related data on a storage device",componentId:"file"},{title:"Folder (Directory)",description:"Organizes files into a hierarchical structure for easy navigation",componentId:"folder"},{title:"File Path",description:"Specifies the unique location of a file or folder in the filesystem",componentId:"path"},{title:"Metadata",description:"Data about files that describes their properties and attributes",componentId:"metadata"},{title:"File Permissions",description:"Controls which users can read, write, or execute a file",componentId:"permission"},{title:"File Type",description:"Identifies the kind of data a file contains and which application should open it",componentId:"type"}];

deferInit(function(){
  new DiagramEngine({
    title: 'Files',
    subtitle: 'How Computers Work',
    desc: 'Learn how files and folders organize data on storage devices.',
    module: 2,
    difficulty: 'Beginner',
    time: '10',
    objectives: 'Learn how files and folders organize data on storage.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    
    render: function(container, engine) {
      engine.buildStepFlow(container);
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
        bg.setAttribute('fill', i === idx ? '#1e2d50' : '#1a2235');
        bg.setAttribute('stroke', i === idx ? '#0959C8' : '#2a3a55');
      });
    },
    
    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();