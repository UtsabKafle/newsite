(function(){'use strict';
var components = [
  {id:"fetch",name:"Fetch Stage",category:"Processing",x:50,y:50,w:100,h:50,purpose:"Retrieves the next instruction from memory",description:"The fetch stage reads the instruction at the address in the program counter from the instruction cache or main memory.",why:"Fetching is the first step that brings instructions into the CPU",analogy:"Like a chef reading the next step from a recipe card",funFact:"Modern CPUs fetch multiple instructions per cycle using prefetching",takeaway:"The fetch stage uses the program counter to know which instruction to get",mistake:"Fetch only retrieves the instruction—it doesn\\'t interpret or execute it",descriptionDetailed:"The program counter (PC) provides the address. Instructions are loaded from L1 instruction cache (fast) or main memory (slow). Fetched instructions are placed in a queue for decoding. Branch prediction may guide which instructions to fetch next."},
  {id:"decode",name:"Decode Stage",category:"Processing",x:200,y:50,w:100,h:50,purpose:"Translates the fetched instruction into control signals and operands",description:"The decode stage interprets the instruction\\'s opcode to determine the operation and identifies the operands (registers, memory addresses, or immediate values).",why:"Decoding translates machine-readable instructions into hardware actions",analogy:"Like a translator who converts a foreign sentence into action steps",funFact:"x86 instructions are variable-length (1-15 bytes), making decoding complex",takeaway:"The decode stage determines what operation to perform and on what data",mistake:"Decoding takes more hardware in x86 (CISC) than in ARM or RISC-V (RISC)",descriptionDetailed:"The decoder breaks the instruction into opcode, operands, and immediate values. Complex instructions are converted into micro-ops. The decoded instruction is checked for validity. Register operands are read in this stage."},
  {id:"execute",name:"Execute Stage",category:"Processing",x:200,y:150,w:100,h:50,purpose:"Performs the actual operation on the operands using the ALU",description:"The execute stage sends the operation and operands to the appropriate execution unit (ALU, FPU, load/store) and computes the result.",why:"Execution is where computation actually happens",analogy:"Like actually mixing ingredients together after reading the recipe",funFact:"The execute stage can be split into multiple sub-stages for complex operations",takeaway:"The execute stage uses the ALU for arithmetic and logic operations",mistake:"Not all instructions go to the ALU—memory instructions use the load/store unit",descriptionDetailed:"The ALU performs the specified operation. Results are produced and written to registers or stored for later use. Execution time varies by operation (addition: 1 cycle, multiplication: 3-5 cycles). Branch instructions resolve here, potentially flushing the pipeline."},
  {id:"memorywrite",name:"Memory Access Stage",category:"Processing",x:50,y:150,w:100,h:50,purpose:"Reads from or writes to data cache or main memory",description:"The memory access stage handles load (data read) and store (data write) operations, accessing L1 data cache and potentially main memory.",why:"Memory access loads data needed by instructions and saves results",analogy:"Like fetching ingredients from the pantry or storing leftovers",funFact:"Memory access is typically the slowest stage in the pipeline",takeaway:"Cache hits make memory access fast; misses cause significant delays",mistake:"Not all instructions need the memory stage—register operations skip it",descriptionDetailed:"For loads: data is read from cache/memory into the MDR. For stores: data is written from registers to the store buffer. The load/store unit manages address calculation. Cache misses cause pipeline stalls until data arrives."},
  {id:"registerwrite",name:"Write-Back Stage",category:"Processing",x:50,y:250,w:100,h:50,purpose:"Writes the execution result back to a register file",description:"The write-back stage stores the result of the ALU operation into the destination register, completing the instruction cycle.",why:"Write-back makes computation results available for subsequent instructions",analogy:"Like writing the answer down on paper so you can use it later",funFact:"The write-back stage can be bypassed to avoid pipeline hazards",takeaway:"The write-back stage commits the instruction\\'s result to architectural state",mistake:"Write-back to memory (store) happens in the memory stage, not write-back stage",descriptionDetailed:"Results are written to the specified destination register in the register file. Forwarding (bypassing) sends results directly to dependent instructions. The write-back stage retires the instruction from the reorder buffer."}
];
var connections = [{from:"fetch",to:"decode"},{from:"decode",to:"execute"},{from:"execute",to:"memorywrite"},{from:"memorywrite",to:"registerwrite"}];
var steps = [{id:"fetch",label:"Step 1: Fetch Stage",status:"Exploring: Fetch Stage - Retrieves the next instruction from memory"},{id:"decode",label:"Step 2: Decode Stage",status:"Exploring: Decode Stage - Translates the fetched instruction into control signals and operands"},{id:"execute",label:"Step 3: Execute Stage",status:"Exploring: Execute Stage - Performs the actual operation on the operands using the ALU"},{id:"memorywrite",label:"Step 4: Memory Access Stage",status:"Exploring: Memory Access Stage - Reads from or writes to data cache or main memory"},{id:"registerwrite",label:"Step 5: Write-Back Stage",status:"Exploring: Write-Back Stage - Writes the execution result back to a register file"}];
var tour = [{title:"Fetch Stage",description:"Retrieves the next instruction from memory",componentId:"fetch"},{title:"Decode Stage",description:"Translates the fetched instruction into control signals and operands",componentId:"decode"},{title:"Execute Stage",description:"Performs the actual operation on the operands using the ALU",componentId:"execute"},{title:"Memory Access Stage",description:"Reads from or writes to data cache or main memory",componentId:"memorywrite"},{title:"Write-Back Stage",description:"Writes the execution result back to a register file",componentId:"registerwrite"}];

function initJourneySimulator(container, engine) {
  var activeInstruction = "ADD"; // "ADD", "LOAD", "STORE"
  var pipelineStep = 0; // 0: Idle, 1: Fetch, 2: Decode, 3: Execute, 4: Memory, 5: Writeback, 6: Completed

  var registers = {
    PC: "0x0040",
    IR: "---",
    R1: "5",
    R2: "3",
    ALU_Out: "---"
  };

  var challengeGoals = [
    { text: "Choose the LOAD instruction and trace it step-by-step to completion.", check: function() { return activeInstruction === "LOAD" && pipelineStep === 6; } },
    { text: "At the Fetch stage of any instruction, which register holds the current address? (Click the Register in CPU state panel to solve)", solved: false }
  ];

  var currentGoalIdx = 0;

  function renderSim() {
    container.innerHTML = `
      <div class="sim-interactive-area" style="padding: 16px; display: flex; flex-direction: column; gap: 12px; width: 100%;">
        <div style="font-size: 14px; font-weight:700; color: #60a5fa;">CPU Instruction Pipeline Journey Simulator</div>
        
        <!-- Challenge Goal Panel -->
        <div class="glass-panel" style="padding: 8px; border-color: rgba(234,179,8,0.3); background: rgba(234,179,8,0.03); font-size:11px;">
          <div style="font-weight:bold; color:#eab308; text-transform:uppercase;">Simulation Challenge Goal</div>
          <div id="pipe-goal-text" style="color:#fff; font-weight:600; margin-top:2px;"></div>
        </div>

        <div style="display: flex; gap: 16px; flex-direction: row; flex-wrap: wrap; justify-content: center; align-items: flex-start; width: 100%;">
          
          <!-- Pipeline Stages (Left) -->
          <div style="flex: 1.3; min-width: 280px; display:flex; flex-direction:column; gap:10px;">
            <!-- Select Assembly Instruction -->
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <span style="font-size:11px; font-weight:bold; color:#94a3b8; text-transform:uppercase;">Instruction:</span>
              <button class="act-btn inst-select-btn" data-inst="ADD">ADD R1, R2</button>
              <button class="act-btn inst-select-btn" data-inst="LOAD">LOAD R1, [1024]</button>
              <button class="act-btn inst-select-btn" data-inst="STORE">STORE [1024], R2</button>
            </div>

            <!-- Pipeline Visual blocks -->
            <div style="display:flex; flex-direction:column; gap:6px; margin-top:6px;" id="pipe-blocks-container">
              <!-- Stages will be loaded here -->
            </div>

            <!-- Step Control buttons -->
            <div style="display:flex; gap:10px; margin-top:8px;">
              <button class="act-btn" id="btn-pipe-step" style="flex:1; justify-content:center; border-color:#3b82f6; color:#3b82f6;">Step Pipeline Cycle</button>
              <button class="act-btn" id="btn-pipe-reset" style="width:80px; justify-content:center;">Reset</button>
            </div>
          </div>

          <!-- Register States Sidebar (Right) -->
          <div style="flex: 1; min-width: 240px; display:flex; flex-direction:column; gap:10px;">
            <div class="glass-panel" style="padding:12px; display:flex; flex-direction:column; gap:6px;">
              <span style="font-size:10px; font-weight:bold; color:#64748b; text-transform:uppercase;">Register File & CPU State</span>
              
              <div style="display:flex; flex-direction:column; gap:6px; margin-top:6px;" id="cpu-regs-box">
                <!-- Registers -->
              </div>
            </div>

            <!-- Feedback Log -->
            <div class="glass-panel" style="padding:12px; background:rgba(0,0,0,0.25); min-height:80px; font-size:11px;">
              <div id="pipe-feedback" style="color:#94a3b8; font-weight:500;">Select an instruction and click Step to watch the fetch-decode-execute cycle in action.</div>
            </div>
          </div>

        </div>
      </div>
    `;

    renderGoal();
    renderStages();
    renderRegisters();

    // Bind controls
    container.querySelectorAll('.inst-select-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        if (pipelineStep > 0 && pipelineStep < 6) return; // Disallow changes while running
        activeInstruction = this.dataset.inst;
        resetPipeline();
      });
    });

    container.querySelector('#btn-pipe-step').addEventListener('click', stepPipeline);
    container.querySelector('#btn-pipe-reset').addEventListener('click', resetPipeline);
  }

  function renderGoal() {
    var text = container.querySelector('#pipe-goal-text');
    if (text) {
      text.textContent = challengeGoals[currentGoalIdx].text;
    }
  }

  function renderStages() {
    var box = container.querySelector('#pipe-blocks-container');
    if (!box) return;
    box.innerHTML = '';

    var stages = [
      { id: 1, name: "FETCH", desc: "Get instruction from code cache index", target: "fetch" },
      { id: 2, name: "DECODE", desc: "Interpret opcode and read register parameters", target: "decode" },
      { id: 3, name: "EXECUTE", desc: "ALU arithmetic calculation", target: "execute" },
      { id: 4, name: "MEMORY", desc: "Read/Write system memory address", target: "memorywrite" },
      { id: 5, name: "WRITEBACK", desc: "Commit calculation sum to registers", target: "registerwrite" }
    ];

    stages.forEach(function(st) {
      var isCurrent = pipelineStep === st.id;
      var isPassed = pipelineStep > st.id;
      
      // Determine if memory access is bypassed for ADD instruction
      var isBypassed = activeInstruction === "ADD" && st.name === "MEMORY";
      
      var color = "#cbd5e1";
      var bg = "rgba(255,255,255,0.02)";
      var border = "rgba(255,255,255,0.06)";

      if (isCurrent) {
        color = "#3b82f6";
        bg = "rgba(59,130,246,0.15)";
        border = "#3b82f6";
      } else if (isPassed) {
        color = "#10b981";
        bg = "rgba(16,185,129,0.05)";
        border = "rgba(16,185,129,0.4)";
      }

      if (isBypassed && (isCurrent || isPassed)) {
        color = "#64748b";
        bg = "rgba(255,255,255,0.02)";
        border = "rgba(255,255,255,0.06)";
      }

      var card = document.createElement('div');
      card.style.cssText = `padding:10px 14px; background:${bg}; border:1px solid ${border}; border-radius:8px; display:flex; justify-content:space-between; align-items:center; transition:all 0.3s;`;
      card.innerHTML = `
        <div>
          <div style="font-size:12px; font-weight:700; color:${color};">${st.name} STAGE</div>
          <div style="font-size:10px; color:#64748b; margin-top:2px;">${isBypassed ? 'Bypassed / Idle for ALU ops' : st.desc}</div>
        </div>
        <span style="font-size:11px; font-weight:bold; color:${color};">
          ${isBypassed ? 'BYPASS' : (isCurrent ? 'ACTIVE' : (isPassed ? '✓ DONE' : 'WAIT'))}
        </span>
      `;

      box.appendChild(card);
    });

    // Highlight selected instruction button
    container.querySelectorAll('.inst-select-btn').forEach(btn => {
      var matches = btn.dataset.inst === activeInstruction;
      btn.className = `act-btn inst-select-btn ${matches ? 'active' : ''}`;
    });
  }

  function renderRegisters() {
    var box = container.querySelector('#cpu-regs-box');
    if (!box) return;
    box.innerHTML = '';

    Object.keys(registers).forEach(function(k) {
      var item = document.createElement('div');
      item.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:6px 10px; background:rgba(255,255,255,0.01); border:1px solid rgba(255,255,255,0.04); border-radius:6px; cursor:pointer; transition:all 0.2s;';
      item.innerHTML = `
        <span style="font-size:11px; font-weight:bold; color:#94a3b8;">${k}:</span>
        <span style="font-size:12px; font-weight:700; font-family:monospace; color:#fff;">${registers[k]}</span>
      `;
      
      item.addEventListener('click', function() {
        if (currentGoalIdx === 1 && k === 'PC' && pipelineStep === 1) {
          challengeGoals[1].solved = true;
          checkGoalStatus();
        }
      });

      box.appendChild(item);
    });
  }

  function stepPipeline() {
    var log = container.querySelector('#pipe-feedback');
    if (pipelineStep >= 6) return;

    pipelineStep++;
    
    if (pipelineStep === 1) {
      // FETCH
      registers.IR = getInstructionOpcode();
      log.textContent = `Fetch Stage: Loaded instruction ${registers.IR} from memory address ${registers.PC} into the Instruction Register (IR).`;
      engine._setStatus(`Fetched instruction`);
    } else if (pipelineStep === 2) {
      // DECODE
      var details = getDecodeDetails();
      log.textContent = `Decode Stage: Decoder decoded opcode ${activeInstruction}. Read parameters: ${details}.`;
      engine._setStatus(`Decoded instruction`);
    } else if (pipelineStep === 3) {
      // EXECUTE
      var details = getExecuteDetails();
      log.textContent = `Execute Stage: Operations unit active. ${details}.`;
      engine._setStatus(`Executed ALU operation`);
    } else if (pipelineStep === 4) {
      // MEMORY
      if (activeInstruction === "ADD") {
        log.textContent = `Memory Stage: ADD instruction does not read or write main memory. Bypassing stage.`;
      } else if (activeInstruction === "LOAD") {
        log.textContent = `Memory Stage: Reading data value 18 from cache line at address [1024].`;
      } else if (activeInstruction === "STORE") {
        log.textContent = `Memory Stage: Writing R2 value (3) to system memory location [1024].`;
      }
      engine._setStatus(`Memory access step`);
    } else if (pipelineStep === 5) {
      // WRITEBACK
      if (activeInstruction === "ADD") {
        registers.R1 = "8";
        log.textContent = `Writeback Stage: Committing ALU output (8) back to register R1. Operation completed!`;
      } else if (activeInstruction === "LOAD") {
        registers.R1 = "18";
        log.textContent = `Writeback Stage: Writing data read from memory (18) back to register R1. Operation completed!`;
      } else if (activeInstruction === "STORE") {
        log.textContent = `Writeback Stage: STORE does not write back to registers. Retiring instruction.`;
      }
      registers.PC = "0x0044"; // Increment PC
      engine._setStatus(`Writeback finished`);
    } else if (pipelineStep === 6) {
      log.style.color = '#10b981';
      log.textContent = `✓ Entire instruction cycle trace complete. PC incremented to 0x0044.`;
      checkGoalStatus();
    }

    renderStages();
    renderRegisters();
  }

  function getInstructionOpcode() {
    if (activeInstruction === "ADD") return "ADD R1, R2";
    if (activeInstruction === "LOAD") return "LOAD R1, [1024]";
    if (activeInstruction === "STORE") return "STORE [1024], R2";
    return "";
  }

  function getDecodeDetails() {
    if (activeInstruction === "ADD") return "Opcode: ADD, Src1: R1 (value 5), Src2: R2 (value 3), Dest: R1";
    if (activeInstruction === "LOAD") return "Opcode: LOAD, SrcAddr: 1024, DestReg: R1";
    if (activeInstruction === "STORE") return "Opcode: STORE, SrcReg: R2 (value 3), DestAddr: 1024";
    return "";
  }

  function getExecuteDetails() {
    if (activeInstruction === "ADD") {
      registers.ALU_Out = "8";
      return "ALU calculated: 5 + 3 = 8";
    }
    if (activeInstruction === "LOAD") {
      registers.ALU_Out = "1024";
      return "Address Calculator computed cache index location: 1024";
    }
    if (activeInstruction === "STORE") {
      registers.ALU_Out = "1024";
      return "Address Calculator computed cache index location: 1024";
    }
    return "";
  }

  function resetPipeline() {
    pipelineStep = 0;
    registers.PC = "0x0040";
    registers.IR = "---";
    registers.R1 = "5";
    registers.R2 = "3";
    registers.ALU_Out = "---";

    var log = container.querySelector('#pipe-feedback');
    if (log) {
      log.style.color = '#cbd5e1';
      log.textContent = `Reset pipeline. Selected instruction: ${getInstructionOpcode()}. Click Step to begin Fetch.`;
    }

    renderStages();
    renderRegisters();
  }

  function checkGoalStatus() {
    var goal = challengeGoals[currentGoalIdx];
    if (!goal) return;

    var solved = false;
    if (currentGoalIdx === 0) {
      solved = goal.check();
    } else if (currentGoalIdx === 1) {
      solved = goal.solved;
    }

    if (solved) {
      currentGoalIdx++;
      engine._setStatus(`Solved instruction goal ${currentGoalIdx}`);
      if (currentGoalIdx < challengeGoals.length) {
        var log = container.querySelector('#pipe-feedback');
        log.style.color = '#10b981';
        log.innerHTML = `<strong>🎉 Goal Completed!</strong> Moving to next question.`;
        setTimeout(renderSim, 1500);
      } else {
        var log = container.querySelector('#pipe-feedback');
        log.style.color = '#10b981';
        log.innerHTML = `<strong>🎉 Challenge Completed!</strong> You successfully trace CPU pipeline steps and understood register flows.`;
        var text = container.querySelector('#pipe-goal-text');
        text.textContent = "🏆 Instruction Cycle Simulator Complete!";
        engine.markCompleted();
      }
    }
  }

  renderSim();
}

deferInit(function(){
  new DiagramEngine({
    title: 'Instruction Cycle',
    subtitle: 'CPU Components',
    desc: 'Follow the fetch-decode-execute cycle step by step.',
    module: 4,
    difficulty: 'Advanced',
    time: '10',
    objectives: 'Follow the fetch-decode-execute cycle step by step.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    
    render: function(container, engine) {
      engine.buildStepFlow(container);
      engine._setStatus('Click any step to learn more');
    },
    
    customChallenge: function(container, engine) {
      initJourneySimulator(container, engine);
    },
    
    animate: function(engine) {},
    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();