(function(){'use strict';
var components = [
  {id:"adder",name:"Adder Circuit",category:"Processing",x:50,y:50,w:100,h:50,purpose:"Performs addition operations on binary numbers",description:"The adder uses logic gates (XOR, AND) in a carry-lookahead or ripple-carry configuration to compute the sum of two binary operands.",why:"Addition is the foundation of most arithmetic operations in the CPU",analogy:"Like a basic adding machine that sums two numbers",funFact:"The carry-lookahead adder was invented in 1957 and is still used in modern CPUs",takeaway:"The adder is the most fundamental arithmetic circuit in the ALU",mistake:"Subtraction is performed using the adder with two\\'s complement encoding",descriptionDetailed:"A full adder takes three inputs (A, B, carry-in) and produces sum and carry-out. Carry-lookahead computes all carries in parallel for speed. 64-bit adders chain or parallelize these units. Addition takes one clock cycle in most CPUs."},
  {id:"subtractor",name:"Subtractor Circuit",category:"Processing",x:200,y:50,w:100,h:50,purpose:"Performs subtraction operations using addition of two\\'s complement",description:"The subtractor converts the subtrahend to its two\\'s complement (invert and add 1) and then uses the same adder circuit for the operation.",why:"Subtraction is implemented via addition to minimize specialized hardware",analogy:"Like adding a negative number instead of subtracting a positive one",funFact:"The two\\'s complement system allows subtraction using the same hardware as addition",takeaway:"CPUs don\\'t have separate subtractors—they use the adder with negated inputs",mistake:"Two\\'s complement isn\\'t the same as simple inversion—it adds 1 after inverting",descriptionDetailed:"Subtraction: A - B = A + (~B + 1). The carry-in is set to 1 for subtraction. The ALU\\'s control unit sets the subtract mode flag. Overflow detection checks for sign mismatch."},
  {id:"multiplier",name:"Multiplier Circuit",category:"Processing",x:200,y:150,w:100,h:50,purpose:"Performs multiplication of binary numbers through repeated addition",description:"The multiplier uses shift-and-add algorithms, Booth\\'s algorithm, or Wallace trees to compute products of binary operands efficiently.",why:"Hardware multiplication is much faster than software loops of repeated addition",analogy:"Like calculating 5x3 by adding 5 three times, but at hardware speed",funFact:"Modern multipliers use Booth\\'s algorithm, which handles groups of bits at once",takeaway:"Multiplication is more complex than addition and takes multiple clock cycles",mistake:"",descriptionDetailed:"Booth\\'s algorithm processes pairs of bits to reduce partial products. Wallace trees add partial products in parallel using carry-save adders. Multiply-accumulate operations (multiply then add) are common in signal processing. Multiply typically takes 3-5 cycles."},
  {id:"shifter",name:"Barrel Shifter",category:"Processing",x:50,y:150,w:100,h:50,purpose:"Shifts or rotates bits left or right by any number of positions in one cycle",description:"The barrel shifter uses a logarithmic network of multiplexers to shift operand bits by any amount in a single clock cycle without sequential steps.",why:"Bit shifting is essential for multiplication/division by powers of 2 and bit field operations",analogy:"Like moving items on a conveyor belt to different positions simultaneously",funFact:"A barrel shifter with 64-bit input requires 384 multiplexers to shift any amount in one cycle",takeaway:"The barrel shifter can shift, rotate, and extract bit fields in one operation",mistake:"Shifting is different from rotation—shift drops bits, rotation wraps them around",descriptionDetailed:"A logarithmic barrel shifter uses n levels of multiplexers for 2^n input bits. Shift types: logical (fill with 0), arithmetic (preserve sign), rotate (wrap bits). The shifter also supports bit-field extraction and insertion."},
  {id:"comparator",name:"Comparator Circuit",category:"Processing",x:50,y:250,w:100,h:50,purpose:"Compares two values and sets status flags for decision making",description:"The comparator subtracts operands and checks the result to set flags: zero (equal), carry (unsigned comparison), overflow, and sign (signed comparison).",why:"Comparisons enable branching, sorting, and decision-making in programs",analogy:"Like a balance scale that tells you which side is heavier",funFact:"The comparator reuses the ALU\\'s adder circuitry for efficiency",takeaway:"Comparison results are stored in the status register flags",mistake:"CMP and SUB are different—CMP only sets flags without storing a result",descriptionDetailed:"Comparison is done by subtracting operands and discarding the result. Flags set: Zero (A=B), Carry (A<B unsigned), Sign (result negative), Overflow (signed overflow). Conditional jump instructions check these flags."},
  {id:"flags",name:"Status Flags Register",category:"Processing",x:200,y:250,w:100,h:50,purpose:"Stores condition codes from the last ALU operation for decision making",description:"The flags register holds single-bit indicators: Zero (Z), Carry (C), Overflow (O), Sign (S/N), and others that reflect ALU operation results.",why:"Flags enable conditional logic by recording the outcome of comparisons and arithmetic",analogy:"Like indicator lights on a dashboard that tell you the engine\\'s status",funFact:"The x86 flags register includes 18 different status and control flags",takeaway:"Flags are checked by conditional jump instructions to make decisions",mistake:"Flags are overwritten by most arithmetic instructions, so check them immediately",descriptionDetailed:"Key flags: ZF (zero result), CF (carry/borrow), OF (signed overflow), SF (negative sign), PF (even parity). Control flags: IF (interrupt enable), DF (direction). LF and AF are used internally. Flags are preserved across function calls."}
];
var connections = [{from:"adder",to:"subtractor"},{from:"subtractor",to:"multiplier"},{from:"multiplier",to:"shifter"},{from:"shifter",to:"comparator"},{from:"comparator",to:"flags"}];
var steps = [{id:"adder",label:"Step 1: Adder Circuit",status:"Exploring: Adder Circuit - Performs addition operations on binary numbers"},{id:"subtractor",label:"Step 2: Subtractor Circuit",status:"Exploring: Subtractor Circuit - Performs subtraction operations using addition of two\\'s complement"},{id:"multiplier",label:"Step 3: Multiplier Circuit",status:"Exploring: Multiplier Circuit - Performs multiplication of binary numbers through repeated addition"},{id:"shifter",label:"Step 4: Barrel Shifter",status:"Exploring: Barrel Shifter - Shifts or rotates bits left or right by any number of positions in one cycle"},{id:"comparator",label:"Step 5: Comparator Circuit",status:"Exploring: Comparator Circuit - Compares two values and sets status flags for decision making"},{id:"flags",label:"Step 6: Status Flags Register",status:"Exploring: Status Flags Register - Stores condition codes from the last ALU operation for decision making"}];
var tour = [{title:"Adder Circuit",description:"Performs addition operations on binary numbers",componentId:"adder"},{title:"Subtractor Circuit",description:"Performs subtraction operations using addition of two\\'s complement",componentId:"subtractor"},{title:"Multiplier Circuit",description:"Performs multiplication of binary numbers through repeated addition",componentId:"multiplier"},{title:"Barrel Shifter",description:"Shifts or rotates bits left or right by any number of positions in one cycle",componentId:"shifter"},{title:"Comparator Circuit",description:"Compares two values and sets status flags for decision making",componentId:"comparator"},{title:"Status Flags Register",description:"Stores condition codes from the last ALU operation for decision making",componentId:"flags"}];

function initAluChallenge(container, engine) {
  var operandA = [1, 0, 1, 0]; // A3, A2, A1, A0 (binary A = 10)
  var operandB = [0, 1, 1, 0]; // B3, B2, B1, B0 (binary B = 6)
  var activeMode = "ADD"; // "ADD", "SUB", "AND", "OR", "XOR"
  
  var currentGoalIdx = 0;
  var goals = [
    { title: "Goal 1: Compute 1001 + 0011 (9 + 3) in ADD mode", check: function() { return arrayEquals(operandA, [1,0,0,1]) && arrayEquals(operandB, [0,0,1,1]) && activeMode === "ADD"; } },
    { title: "Goal 2: Trigger the Zero Flag (ZF) using SUB mode", check: function() { var res = computeResult(); return activeMode === "SUB" && res.result.every(b => b === 0); } },
    { title: "Goal 3: Trigger the Carry Flag (CF) using ADD mode", check: function() { var res = computeResult(); return activeMode === "ADD" && res.carry === 1; } }
  ];

  function arrayEquals(a, b) {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  }

  container.innerHTML = `
    <div class="sim-interactive-area" style="padding: 16px; display: flex; flex-direction: column; gap: 14px; width: 100%;">
      <div style="font-size: 14px; font-weight:700; color: #60a5fa;">Arithmetic Logic Unit (ALU) Binary Lab</div>
      
      <!-- Challenge Goal Status Card -->
      <div class="glass-panel" style="padding: 10px; border-color: rgba(234,179,8,0.3); background: rgba(234,179,8,0.03);">
        <div style="font-size:10px; font-weight:bold; color:#eab308; text-transform:uppercase;">Current Challenge Goal</div>
        <div id="alu-goal-text" style="font-size:12px; font-weight:600; color:#fff; margin-top:2px;"></div>
      </div>
      
      <div style="display: flex; gap: 16px; flex-direction: row; flex-wrap: wrap; justify-content: center; align-items: flex-start; width: 100%;">
        <!-- Interactive Circuit Interface -->
        <div style="flex: 1.3; min-width: 280px; display:flex; flex-direction:column; gap:12px;">
          <!-- Operand A -->
          <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
            <span style="font-size:12px; font-weight:bold; color:#94a3b8; width:70px;">Operand A:</span>
            <div style="display:flex; gap:6px;" id="reg-a"></div>
            <span style="font-size:12px; font-weight:bold; color:#cbd5e1; width:50px; text-align:right;" id="dec-a"></span>
          </div>

          <!-- Operand B -->
          <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
            <span style="font-size:12px; font-weight:bold; color:#94a3b8; width:70px;">Operand B:</span>
            <div style="display:flex; gap:6px;" id="reg-b"></div>
            <span style="font-size:12px; font-weight:bold; color:#cbd5e1; width:50px; text-align:right;" id="dec-b"></span>
          </div>

          <!-- ALU Operations Selectors -->
          <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:6px; padding:8px 0; border-top:1px solid rgba(255,255,255,0.06); border-bottom:1px solid rgba(255,255,255,0.06); justify-content:center;">
            <button class="act-btn op-btn" data-mode="ADD">ADD (+)</button>
            <button class="act-btn op-btn" data-mode="SUB">SUB (-)</button>
            <button class="act-btn op-btn" data-mode="AND">AND (&)</button>
            <button class="act-btn op-btn" data-mode="OR">OR (|)</button>
            <button class="act-btn op-btn" data-mode="XOR">XOR (^)</button>
          </div>

          <!-- Output Result Y -->
          <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:6px;">
            <span style="font-size:12px; font-weight:bold; color:#22c55e; width:70px;">Output Y:</span>
            <div style="display:flex; gap:6px;" id="reg-y"></div>
            <span style="font-size:12px; font-weight:bold; color:#22c55e; width:50px; text-align:right;" id="dec-y"></span>
          </div>
        </div>

        <!-- Sidebar (Flags and logic trace) -->
        <div style="flex: 1; min-width: 240px; display:flex; flex-direction:column; gap:12px;">
          <!-- Status Register Flags -->
          <div class="glass-panel" style="padding:12px; display:flex; flex-direction:column; gap:8px;">
            <span style="font-size:10px; font-weight:bold; color:#64748b; text-transform:uppercase;">ALU Status Flags</span>
            <div style="display:flex; justify-content:space-around; align-items:center; padding:6px 0;">
              <!-- ZF -->
              <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
                <div id="flag-zf" style="width:28px; height:28px; border-radius:50%; border:2px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.02); display:flex; align-items:center; justify-content:center; font-size:9px; font-weight:bold; transition:all 0.3s; color:#94a3b8;">ZF</div>
                <span style="font-size:8px; color:#64748b;">Zero Flag</span>
              </div>
              <!-- CF -->
              <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
                <div id="flag-cf" style="width:28px; height:28px; border-radius:50%; border:2px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.02); display:flex; align-items:center; justify-content:center; font-size:9px; font-weight:bold; transition:all 0.3s; color:#94a3b8;">CF</div>
                <span style="font-size:8px; color:#64748b;">Carry Flag</span>
              </div>
              <!-- SF -->
              <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
                <div id="flag-sf" style="width:28px; height:28px; border-radius:50%; border:2px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.02); display:flex; align-items:center; justify-content:center; font-size:9px; font-weight:bold; transition:all 0.3s; color:#94a3b8;">SF</div>
                <span style="font-size:8px; color:#64748b;">Sign Flag</span>
              </div>
            </div>
          </div>
          
          <div class="glass-panel" style="padding:12px; background:rgba(0,0,0,0.25); min-height:80px; font-size:11px;">
            <div id="alu-feedback" style="color:#cbd5e1; font-weight:500;">Configure bits and modes to calculate.</div>
          </div>
        </div>
      </div>
    </div>
  `;

  var regA = container.querySelector('#reg-a');
  var regB = container.querySelector('#reg-b');
  var regY = container.querySelector('#reg-y');
  var decA = container.querySelector('#dec-a');
  var decB = container.querySelector('#dec-b');
  var decY = container.querySelector('#dec-y');
  var goalText = container.querySelector('#alu-goal-text');
  var feedback = container.querySelector('#alu-feedback');
  var opBtns = container.querySelectorAll('.op-btn');
  var flagZF = container.querySelector('#flag-zf');
  var flagCF = container.querySelector('#flag-cf');
  var flagSF = container.querySelector('#flag-sf');

  // Generate bit buttons
  function buildRegBits(regEl, arr, type) {
    regEl.innerHTML = '';
    arr.forEach(function(val, idx) {
      var btn = document.createElement('button');
      btn.className = 'act-btn';
      btn.textContent = val;
      btn.style.cssText = `width:32px; height:32px; padding:0; justify-content:center; font-size:14px; font-weight:bold; border-radius:6px; transition:all 0.2s; ${val === 1 ? 'background:rgba(59,130,246,0.15); border-color:#3b82f6; color:#60a5fa;' : ''}`;
      
      btn.addEventListener('click', function() {
        arr[idx] = arr[idx] === 1 ? 0 : 1;
        updateUI();
      });
      regEl.appendChild(btn);
    });
  }

  function updateUI() {
    buildRegBits(regA, operandA, 'A');
    buildRegBits(regB, operandB, 'B');

    var valA = parseInt(operandA.join(''), 2);
    var valB = parseInt(operandB.join(''), 2);
    decA.textContent = `(${valA})`;
    decB.textContent = `(${valB})`;

    // Compute Y and flags
    var comp = computeResult();
    var resStr = comp.result.join('');
    var valY = parseInt(resStr, 2);
    
    // Draw Y bits
    regY.innerHTML = '';
    comp.result.forEach(function(val) {
      var dot = document.createElement('div');
      dot.style.cssText = `width:32px; height:32px; border-radius:6px; border:1px solid ${val === 1 ? '#22c55e' : 'rgba(255,255,255,0.06)'}; background:${val === 1 ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.02)'}; color:${val === 1 ? '#22c55e' : '#64748b'}; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:bold; transition:all 0.2s;`;
      dot.textContent = val;
      regY.appendChild(dot);
    });
    
    // If sign flag is negative, represent signed decimal value or normal
    var isNegative = comp.result[0] === 1 && (activeMode === "ADD" || activeMode === "SUB");
    if (isNegative) {
      // Calculate twos complement negative value for 4-bit signed number
      var signedVal = valY - 16;
      decY.textContent = `(${signedVal})`;
    } else {
      decY.textContent = `(${valY})`;
    }

    // Update operation buttons highlight
    opBtns.forEach(btn => {
      var isAct = btn.dataset.mode === activeMode;
      btn.className = `act-btn op-btn ${isAct ? 'active' : ''}`;
    });

    // Update status flags UI
    updateFlagUI(flagZF, comp.zf, '#ef4444', 'rgba(239,68,68,0.15)');
    updateFlagUI(flagCF, comp.cf, '#eab308', 'rgba(234,179,8,0.15)');
    updateFlagUI(flagSF, comp.sf, '#3b82f6', 'rgba(59,130,246,0.15)');

    // Provide mathematical description
    var desc = "";
    if (activeMode === "ADD") {
      desc = `ADD Operation: Binary ${operandA.join('')} (${valA}) added to ${operandB.join('')} (${valB}) results in ${resStr}.`;
      if (comp.cf) desc += ` Carry flag set due to 4-bit unsigned sum overflow (requires carry-out bit).`;
    } else if (activeMode === "SUB") {
      desc = `SUB Operation: Binary ${operandA.join('')} (${valA}) minus ${operandB.join('')} (${valB}) computed via two\\'s complement addition of negated B.`;
      if (comp.zf) desc += ` Zero flag set since operands are equal.`;
    } else if (activeMode === "AND") {
      desc = `Logical bitwise AND: Bits are set to 1 only if BOTH Operand A and B bits are 1 at each position.`;
    } else if (activeMode === "OR") {
      desc = `Logical bitwise OR: Bits are set to 1 if AT LEAST one of Operand A or B bits is 1.`;
    } else if (activeMode === "XOR") {
      desc = `Logical bitwise XOR: Bits are set to 1 if Operand A and B bits are DIFFERENT at that position.`;
    }
    feedback.textContent = desc;

    // Check challenge goal
    checkGoal();
  }

  function updateFlagUI(el, active, activeColor, activeBg) {
    if (active) {
      el.style.borderColor = activeColor;
      el.style.background = activeBg;
      el.style.color = '#fff';
      el.style.boxShadow = `0 0 10px ${activeColor}`;
    } else {
      el.style.borderColor = 'rgba(255,255,255,0.1)';
      el.style.background = 'rgba(255,255,255,0.02)';
      el.style.color = '#64748b';
      el.style.boxShadow = 'none';
    }
  }

  function computeResult() {
    var a = parseInt(operandA.join(''), 2);
    var b = parseInt(operandB.join(''), 2);
    var y = 0;
    var carry = 0;

    if (activeMode === "ADD") {
      var raw = a + b;
      y = raw & 15;
      carry = raw > 15 ? 1 : 0;
    } else if (activeMode === "SUB") {
      var raw = a - b;
      y = raw & 15;
      carry = raw < 0 ? 1 : 0; // Borrow/Carry flag set if underflow
    } else if (activeMode === "AND") {
      y = a & b;
    } else if (activeMode === "OR") {
      y = a | b;
    } else if (activeMode === "XOR") {
      y = a ^ b;
    }

    var resultArr = y.toString(2).padStart(4, '0').split('').map(Number);
    var zf = resultArr.every(x => x === 0) ? 1 : 0;
    var sf = resultArr[0]; // Most significant bit is sign flag

    return {
      result: resultArr,
      zf: zf,
      cf: carry,
      sf: sf,
      carry: carry
    };
  }

  function checkGoal() {
    var goal = goals[currentGoalIdx];
    if (!goal) return;
    
    goalText.textContent = goal.title;

    if (goal.check()) {
      currentGoalIdx++;
      engine._setStatus(`Completed ALU Goal ${currentGoalIdx}`);
      if (currentGoalIdx < goals.length) {
        feedback.innerHTML = `<strong>🎉 Goal Completed!</strong> Moving to next goal.`;
        setTimeout(updateUI, 1500);
      } else {
        feedback.innerHTML = `<strong>🎉 Challenge Completed!</strong> You solved all binary ALU exercises and understand status register flag trigger conditions.`;
        goalText.textContent = "🏆 All ALU Challenges Resolved!";
        engine.markCompleted();
      }
    }
  }

  // Attach button triggers
  opBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      activeMode = this.dataset.mode;
      updateUI();
    });
  });

  // Initial draw
  updateUI();
}

deferInit(function(){
  new DiagramEngine({
    title: 'Alu',
    subtitle: 'CPU Components',
    desc: 'Discover how the Arithmetic Logic Unit performs calculations.',
    module: 4,
    difficulty: 'Advanced',
    time: '10',
    objectives: 'Discover how the Arithmetic Logic Unit performs calculations.',
    components: components,
    connections: connections,
    steps: steps,
    tour: tour,
    
    render: function(container, engine) {
      engine.buildVisual(container);
      engine._setStatus('Click any component to learn more');
    },
    
    customChallenge: function(container, engine) {
      initAluChallenge(container, engine);
    },
    
    animate: function(engine) {},
    onReplay: function(engine) {
      engine.t = 0;
    }
  });
});
})();