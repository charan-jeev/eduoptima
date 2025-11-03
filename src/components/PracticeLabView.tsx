import { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Settings,
  LogOut,
  Calendar,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  Lightbulb,
  Code,
  Trophy,
  Star,
  Clock,
  FileText,
  Zap,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { GEMINI_API_KEY } from '../lib/firebase';

interface PracticeLabViewProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

const defaultPracticeScenarios = [
  {
    id: 1,
    title: 'Basic Router Configuration',
    difficulty: 'Beginner',
    points: 100,
    description: 'Learn to configure a basic router with hostname and interface IP addresses',
    instructions: [
      'Enter privileged EXEC mode',
      'Enter global configuration mode',
      'Set the hostname to R1',
      'Enter interface configuration mode for GigabitEthernet 0/0',
      'Set the IP address to 192.168.1.1 with subnet mask 255.255.255.0',
      'Enable the interface',
    ],
    commands: [
      'enable',
      'configure terminal',
      'hostname R1',
      'interface gigabitethernet 0/0',
      'ip address 192.168.1.1 255.255.255.0',
      'no shutdown',
    ],
    hints: [
      'Use "enable" to enter privileged mode',
      'Use "configure terminal" to enter global config',
      'Use "hostname [name]" to set the device name',
      'Use "interface [type] [number]" to enter interface config',
      'Use "ip address [ip] [mask]" to assign an IP',
      'Use "no shutdown" to activate the interface',
    ],
  },
  {
    id: 2,
    title: 'VLAN Configuration',
    difficulty: 'Intermediate',
    points: 150,
    description: 'Create VLANs and assign switch ports to specific VLANs',
    instructions: [
      'Enter privileged EXEC mode',
      'Enter global configuration mode',
      'Create VLAN 10',
      'Name VLAN 10 as "Sales"',
      'Exit VLAN configuration',
      'Enter interface FastEthernet 0/1',
      'Set the port to access mode',
      'Assign the port to VLAN 10',
    ],
    commands: [
      'enable',
      'configure terminal',
      'vlan 10',
      'name Sales',
      'exit',
      'interface fastethernet 0/1',
      'switchport mode access',
      'switchport access vlan 10',
    ],
    hints: [
      'Use "enable" to enter privileged mode',
      'Use "configure terminal" to enter global config',
      'Use "vlan [number]" to create a VLAN',
      'Use "name [vlan-name]" to name the VLAN',
      'Use "exit" to go back one level',
      'Use "interface [type] [number]" to configure a port',
      'Use "switchport mode access" for access mode',
      'Use "switchport access vlan [number]" to assign VLAN',
    ],
  },
  {
    id: 3,
    title: 'Static Routing',
    difficulty: 'Advanced',
    points: 200,
    description: 'Configure static routes to enable communication between networks',
    instructions: [
      'Enter privileged EXEC mode',
      'Enter global configuration mode',
      'Add a static route to network 192.168.2.0/24 via next-hop 192.168.1.2',
      'Add another static route to network 10.0.0.0/8 via next-hop 192.168.1.3',
    ],
    commands: [
      'enable',
      'configure terminal',
      'ip route 192.168.2.0 255.255.255.0 192.168.1.2',
      'ip route 10.0.0.0 255.0.0.0 192.168.1.3',
    ],
    hints: [
      'Use "enable" to enter privileged mode',
      'Use "configure terminal" to enter global config',
      'Use "ip route [network] [mask] [next-hop]" for static routing',
      'Remember to use the correct subnet mask for each network',
    ],
  },
];

export default function PracticeLabView({ onNavigate, onLogout }: PracticeLabViewProps) {
  const [scenarios, setScenarios] = useState(defaultPracticeScenarios);
  const [selectedScenario, setSelectedScenario] = useState(defaultPracticeScenarios[0]);
  const [userInput, setUserInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<Array<{ 
    command: string; 
    response: string;
    isAI?: boolean;
  }>>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [routerMode, setRouterMode] = useState('user'); // user, privileged, config, interface, etc.
  const [hostname, setHostname] = useState('Router');
  const [useAIMode, setUseAIMode] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [dynamicHint, setDynamicHint] = useState<string>('');
  const [isGeneratingHint, setIsGeneratingHint] = useState(false);
  const [generationPrompt, setGenerationPrompt] = useState('Create a beginner lab to configure hostname, interface IP, and bring interface up on a single router.');
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);
  const [generationError, setGenerationError] = useState<string>('');
  const terminalRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, view: 'student-dashboard' },
    { id: 'courses', label: 'Courses', icon: BookOpen, view: 'courses' },
    { id: 'work-analysis', label: 'Work Analysis', icon: FileText, view: 'work-analysis' },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, view: 'student-feedback' },
    { id: 'practice', label: 'Practice Lab', icon: Code, view: 'practice-lab' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, view: 'calendar' },
    { id: 'due-this-week', label: 'Due This Week', icon: Clock, view: 'due-this-week' },
    { id: 'settings', label: 'Settings', icon: Settings, view: 'settings' },
  ];

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory]);

  // Command shortcuts mapping (like real Cisco IOS)
  const commandShortcuts: { [key: string]: string } = {
    // Enable/Disable shortcuts
    'en': 'enable',
    'ena': 'enable',
    'dis': 'disable',
    
    // Configure shortcuts
    'conf': 'configure',
    'conf t': 'configure terminal',
    'config': 'configure',
    'config t': 'configure terminal',
    'configure t': 'configure terminal',
    
    // Interface shortcuts
    'int': 'interface',
    'inter': 'interface',
    'int g': 'interface gigabitethernet',
    'int gi': 'interface gigabitethernet',
    'int f': 'interface fastethernet',
    'int fa': 'interface fastethernet',
    'int e': 'interface ethernet',
    'int eth': 'interface ethernet',
    
    // No shutdown shortcuts
    'no shut': 'no shutdown',
    'no sh': 'no shutdown',
    
    // Show shortcuts
    'sh': 'show',
    'sho': 'show',
    'sh run': 'show running-config',
    'show run': 'show running-config',
    'sh ip': 'show ip',
    'sh int': 'show interface',
    'sh ip int': 'show ip interface',
    'sh ip int br': 'show ip interface brief',
    'sh vlan': 'show vlan',
    
    // Exit shortcuts
    'ex': 'exit',
    'exi': 'exit',
    
    // Hostname shortcuts
    'host': 'hostname',
    'hostn': 'hostname',
    
    // IP shortcuts
    'ip addr': 'ip address',
    'ip add': 'ip address',
    
    // Switchport shortcuts
    'sw': 'switchport',
    'switch': 'switchport',
    'sw mode': 'switchport mode',
    'sw mode acc': 'switchport mode access',
    'sw mode tr': 'switchport mode trunk',
    'sw acc': 'switchport access',
    'sw acc vlan': 'switchport access vlan',
    
    // VLAN shortcuts
    'vl': 'vlan',
    
    // Routing shortcuts
    'ip rou': 'ip route',
    
    // Write shortcuts
    'wr': 'write',
    'wr mem': 'write memory',
    'copy run start': 'copy running-config startup-config',
  };

  const expandCommandShortcuts = (input: string): string => {
    const trimmedInput = input.trim().toLowerCase();
    
    // Check for exact matches first
    if (commandShortcuts[trimmedInput]) {
      return commandShortcuts[trimmedInput];
    }
    
    // Check for partial matches (e.g., "int g 0/0" -> "interface gigabitethernet 0/0")
    for (const [shortcut, fullCommand] of Object.entries(commandShortcuts)) {
      if (trimmedInput.startsWith(shortcut + ' ')) {
        // Replace the shortcut part with the full command
        const remainingPart = input.trim().substring(shortcut.length).trim();
        return `${fullCommand} ${remainingPart}`;
      }
    }
    
    // Return original if no shortcut found
    return input.trim();
  };

  const getPrompt = () => {
    if (routerMode === 'user') return `${hostname}>`;
    if (routerMode === 'privileged') return `${hostname}#`;
    if (routerMode === 'config') return `${hostname}(config)#`;
    if (routerMode.startsWith('interface-')) return `${hostname}(config-if)#`;
    if (routerMode === 'vlan') return `${hostname}(config-vlan)#`;
    return `${hostname}>`;
  };

  const callGeminiAPI = async (command: string, context: string) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a Cisco IOS terminal simulator. The current mode is "${routerMode}" and hostname is "${hostname}". 
                
Context of the current lab: ${selectedScenario.title} - ${selectedScenario.description}

User entered command: "${command}"

Respond EXACTLY like a real Cisco IOS router would. Include:
- Configuration confirmations when appropriate
- Error messages if the command is invalid or incomplete
- Status messages like "% Invalid input detected" for syntax errors
- Interface status changes
- Configuration mode transitions

Keep responses concise and authentic to Cisco IOS. Do not explain or teach, just respond as the router would.
Do not use markdown formatting. Use plain text only.

${context}`
              }]
            }],
            generationConfig: {
              temperature: 0.4,
              topK: 32,
              topP: 1,
              maxOutputTokens: 200,
            }
          })
        }
      );

      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text.trim();
      }
      return 'Command processing error.';
    } catch (error) {
      console.error('Gemini API Error:', error);
      return '% Command could not be processed. Check your API configuration.';
    }
  };

  const generateScenarioFromPrompt = async () => {
    if (!generationPrompt.trim() || isGeneratingScenario) return;
    setIsGeneratingScenario(true);
    setGenerationError('');
    try {
      const systemPrompt = `You are an assistant that generates Cisco IOS terminal lab scenarios for students. Given a teacher prompt, produce a JSON object with the exact schema below. Keep instructions and commands tightly aligned and concise. Do not include any text outside of the JSON.

Schema:
{
  "title": string,
  "difficulty": "Beginner" | "Intermediate" | "Advanced",
  "points": number,
  "description": string,
  "instructions": string[],
  "commands": string[],
  "hints": string[]
}

Constraints:
- commands must be IOS commands executable in sequence to complete the lab
- instructions map 1:1 to commands in order
- hints correspond 1:1 to instructions, brief and actionable
- keep total steps between 4 and 8
- prefer realistic device/interface names (e.g., GigabitEthernet0/0)
`;

      const teacherPrompt = generationPrompt.trim();
      const body = {
        contents: [
          { parts: [{ text: systemPrompt }] },
          { parts: [{ text: `Teacher prompt: ${teacherPrompt}` }] },
        ],
        generationConfig: {
          temperature: 0.5,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 512,
        },
      } as any;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      // Extract JSON block
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Malformed AI response');
      const parsed = JSON.parse(jsonMatch[0]);

      // Basic validation
      if (!parsed.title || !Array.isArray(parsed.instructions) || !Array.isArray(parsed.commands)) {
        throw new Error('Invalid scenario structure');
      }
      if (parsed.instructions.length !== parsed.commands.length) {
        throw new Error('Instructions and commands length mismatch');
      }

      const newScenario = {
        id: Date.now(),
        title: String(parsed.title).slice(0, 80),
        difficulty: ['Beginner', 'Intermediate', 'Advanced'].includes(parsed.difficulty)
          ? parsed.difficulty
          : 'Beginner',
        points: Number.isFinite(parsed.points) ? Math.max(50, Math.min(300, Math.round(parsed.points))) : 120,
        description: String(parsed.description || 'AI-generated practice lab'),
        instructions: parsed.instructions.map((s: any) => String(s)),
        commands: parsed.commands.map((s: any) => String(s)),
        hints: (parsed.hints || parsed.instructions).map((s: any) => String(s)),
      } as typeof defaultPracticeScenarios[number];

      setScenarios(prev => [newScenario, ...prev]);
      setSelectedScenario(newScenario);
      handleReset();
    } catch (e: any) {
      console.error('Scenario generation error:', e);
      setGenerationError('Could not generate a lab. Please refine your prompt and try again.');
    } finally {
      setIsGeneratingScenario(false);
    }
  };

  const generateContextualHint = async () => {
    setIsGeneratingHint(true);
    try {
      const commandsExecuted = commandHistory.map(h => h.command).join(', ');
      const completedStepsArray = Array.from(completedSteps);
      const remainingSteps = selectedScenario.commands
        .map((cmd, idx) => ({ cmd, idx }))
        .filter(({ idx }) => !completedSteps.has(idx))
        .map(({ cmd }) => cmd);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a Cisco IOS instructor helping a student with: ${selectedScenario.title}

Lab Goal: ${selectedScenario.description}

Current router state:
- Mode: ${routerMode}
- Hostname: ${hostname}

Commands the student has executed: ${commandsExecuted || 'None yet'}

Steps completed: ${completedStepsArray.length} out of ${selectedScenario.commands.length}
Remaining required commands: ${remainingSteps.join(', ')}

Lab instructions remaining:
${selectedScenario.instructions.filter((_, idx) => !completedSteps.has(idx)).map((inst, idx) => `${idx + 1}. ${inst}`).join('\n')}

Provide a brief, helpful hint (1-2 sentences max) about what the student should do next based on their current progress. Be specific and actionable. Do not give the exact command, but guide them toward the next step.`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 150,
            }
          })
        }
      );

      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        setDynamicHint(data.candidates[0].content.parts[0].text.trim());
      } else {
        setDynamicHint('Try checking the lab instructions for guidance on the next step.');
      }
    } catch (error) {
      console.error('Hint generation error:', error);
      setDynamicHint('Try following the next step in the lab instructions.');
    } finally {
      setIsGeneratingHint(false);
    }
  };

  const processLocalCommand = (cmd: string): string | null => {
    // Expand shortcuts first
    const expandedCmd = expandCommandShortcuts(cmd);
    const command = expandedCmd.toLowerCase();
    
    // Handle mode changes
    if (routerMode === 'user' && command === 'enable') {
      setRouterMode('privileged');
      return '';
    }
    
    if (routerMode === 'privileged' && command === 'configure terminal') {
      setRouterMode('config');
      return 'Enter configuration commands, one per line. End with CNTL/Z.';
    }
    
    if (routerMode === 'config' && command.startsWith('hostname ')) {
      const newHostname = expandedCmd.trim().split(' ')[1];
      setHostname(newHostname);
      return '';
    }
    
    if (routerMode === 'config' && command.startsWith('interface ')) {
      setRouterMode('interface-' + expandedCmd.trim().split(' ')[1]);
      return '';
    }
    
    if (routerMode === 'config' && command.startsWith('vlan ')) {
      setRouterMode('vlan');
      return '';
    }
    
    if ((routerMode.startsWith('interface-') || routerMode === 'vlan' || routerMode === 'config') && command === 'exit') {
      setRouterMode('config');
      return '';
    }
    
    if (routerMode === 'config' && (command === 'exit' || command === 'end')) {
      setRouterMode('privileged');
      return '';
    }
    
    if (command === 'exit' && routerMode === 'privileged') {
      setRouterMode('user');
      return '';
    }
    
    // IP address configuration
    if (routerMode.startsWith('interface-') && command.startsWith('ip address ')) {
      return '';
    }
    
    if (routerMode.startsWith('interface-') && command === 'no shutdown') {
      return `%LINK-5-CHANGED: Interface ${routerMode.replace('interface-', '')}, changed state to up
%LINEPROTO-5-UPDOWN: Line protocol on Interface ${routerMode.replace('interface-', '')}, changed state to up`;
    }
    
    if (routerMode === 'vlan' && command.startsWith('name ')) {
      return '';
    }
    
    if (command.startsWith('switchport ')) {
      return '';
    }
    
    if (command.startsWith('ip route ')) {
      return '';
    }
    
    // Show commands
    if (command.startsWith('show ')) {
      return 'Configuration details would appear here...';
    }
    
    return null; // Let AI handle if we don't have a specific response
  };

  const handleRunCommand = async () => {
    if (!userInput.trim()) return;
    
    setIsProcessing(true);
    
    const cmd = userInput.trim();
    const expandedCmd = expandCommandShortcuts(cmd);
    let response = '';
    
    if (useAIMode) {
      // Try local processing first
      const localResponse = processLocalCommand(cmd);
      
      if (localResponse !== null) {
        response = localResponse;
      } else {
        // Use Gemini AI for complex or unrecognized commands
        const context = `Current step in lab: ${selectedScenario.instructions[currentStep]}. Expected command: ${selectedScenario.commands[currentStep]}`;
        response = await callGeminiAPI(expandedCmd, context);
      }
      
      // Check if this command matches any expected command for progress tracking
      // Use expanded command for comparison
      const normalizedCmd = expandedCmd.toLowerCase();
      selectedScenario.commands.forEach((expectedCmd, idx) => {
        if (normalizedCmd === expectedCmd.toLowerCase() && !completedSteps.has(idx)) {
          const newCompletedSteps = new Set(completedSteps);
          newCompletedSteps.add(idx);
          setCompletedSteps(newCompletedSteps);
          setScore(score + (selectedScenario.points / selectedScenario.commands.length));
          
          // Check if all steps are completed
          if (newCompletedSteps.size === selectedScenario.commands.length) {
            setCompleted(true);
          }
        }
      });
      
      // Clear dynamic hint when a new command is executed
      if (showHint) {
        setDynamicHint('');
      }
    } else {
      // Original guided mode - accept both shortcuts and full commands
      const expectedCommand = selectedScenario.commands[currentStep];
      const normalizedInput = expandedCmd.toLowerCase();
      const normalizedExpected = expectedCommand.toLowerCase();
      const isCorrect = normalizedInput === normalizedExpected;
      
      if (isCorrect) {
        response = '✓ Correct! Command executed successfully.';
        setScore(score + (selectedScenario.points / selectedScenario.commands.length));
        
        // Update mode based on command
        processLocalCommand(cmd);
        
        // Mark step as completed
        const newCompletedSteps = new Set(completedSteps);
        newCompletedSteps.add(currentStep);
        setCompletedSteps(newCompletedSteps);
        
        if (currentStep < selectedScenario.commands.length - 1) {
          setCurrentStep(currentStep + 1);
          setShowHint(false);
        } else {
          setCompleted(true);
        }
      } else {
        response = `✗ Incorrect. Expected: ${expectedCommand}`;
      }
    }
    
    setCommandHistory([
      ...commandHistory,
      {
        command: cmd,
        response,
        isAI: useAIMode,
      }
    ]);
    
    setUserInput('');
    setIsProcessing(false);
  };

  const handleReset = () => {
    setCommandHistory([]);
    setCurrentStep(0);
    setUserInput('');
    setShowHint(false);
    setScore(0);
    setCompleted(false);
    setRouterMode('user');
    setHostname('Router');
    setCompletedSteps(new Set());
    setDynamicHint('');
  };

  const handleSelectScenario = (scenario: typeof defaultPracticeScenarios[0]) => {
    setSelectedScenario(scenario);
    handleReset();
  };

  // Progress calculation based on completed steps
  const progress = useAIMode 
    ? (completedSteps.size / selectedScenario.commands.length) * 100
    : ((currentStep + (completed ? 1 : 0)) / selectedScenario.commands.length) * 100;
  const totalAttempts = commandHistory.length;

  return (
    <div className="flex h-screen bg-[#fafafa] overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 bg-black text-white flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-gray-800">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <span className="text-xl text-black">E</span>
          </div>
          <span className="text-lg">EduOptima</span>
        </div>

        <nav className="flex-1 p-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.view)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                item.id === 'practice'
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:bg-gray-900 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button
          onClick={onLogout}
          className="m-4 flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-900 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="mb-6">
            <h2 className="text-black mb-1">Practice Lab</h2>
            <p className="text-gray-600 text-sm">
              Master Cisco IOS commands through interactive practice
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Scenarios List */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-black mb-4">Select Lab</h3>
              <div className="space-y-3">
                {scenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => handleSelectScenario(scenario)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      selectedScenario.id === scenario.id
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <h4 className="text-black text-sm mb-2">{scenario.title}</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        className="text-xs bg-gray-100 text-black border border-gray-300"
                      >
                        {scenario.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Star className="w-3 h-3" />
                        {scenario.points} pts
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">{scenario.instructions.length} steps</p>
                  </button>
                ))}
              </div>
              <div className="mt-5 border-t border-gray-200 pt-5">
                <h4 className="text-black mb-2">Generate Lab from Prompt</h4>
                <div className="space-y-2">
                  <textarea
                    value={generationPrompt}
                    onChange={(e) => setGenerationPrompt(e.target.value)}
                    placeholder="Describe the lab you want (topic, goals, difficulty, constraints)"
                    className="w-full text-sm p-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none"
                    rows={3}
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={generateScenarioFromPrompt}
                      className="bg-black hover:bg-gray-800 text-white"
                      disabled={isGeneratingScenario}
                    >
                      {isGeneratingScenario ? 'Generating...' : 'Generate with AI'}
                    </Button>
                    {generationError && (
                      <span className="text-xs text-red-600">{generationError}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Lab Area */}
            <div className="lg:col-span-3 space-y-4">
              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4 text-black" />
                    <p className="text-xs text-gray-600">Score</p>
                  </div>
                  <p className="text-black text-xl">{Math.round(score)}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-black" />
                    <p className="text-xs text-gray-600">Progress</p>
                  </div>
                  <p className="text-black text-xl">
                    {useAIMode ? completedSteps.size : (currentStep + (completed ? 1 : 0))}/{selectedScenario.commands.length}
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-black" />
                    <p className="text-xs text-gray-600">Commands</p>
                  </div>
                  <p className="text-black text-xl">{totalAttempts}</p>
                </div>
              </div>

              {/* Instructions Panel */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-black">{selectedScenario.title}</h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setUseAIMode(!useAIMode)}
                      variant="outline"
                      className={useAIMode ? 'border-black text-black bg-gray-100' : 'border-gray-300 text-gray-700'}
                      size="sm"
                    >
                      <Zap className="w-4 h-4 mr-1" />
                      {useAIMode ? 'AI Mode' : 'Guided'}
                    </Button>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="border-gray-300 text-gray-700"
                      size="sm"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                </div>
                
                {useAIMode && (
                  <div className="bg-black text-white rounded-lg p-3 mb-4 text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4" />
                      <span className="font-medium">AI-Powered Real-Time Mode</span>
                    </div>
                    <p className="text-gray-300">
                      Practice freely! The AI terminal responds like a real Cisco router to any command you type.
                    </p>
                  </div>
                )}
                
                <p className="text-gray-600 text-sm mb-4">{selectedScenario.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>Overall Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="text-black text-sm mb-3">📋 {useAIMode ? 'Lab Goals:' : 'Current Task:'}</h4>
                  {!completed ? (
                    useAIMode ? (
                      <div className="space-y-2">
                        {selectedScenario.instructions.map((instruction, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            {completedSteps.has(idx) ? (
                              <CheckCircle className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                            ) : (
                              <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0 mt-0.5" />
                            )}
                            <p className={`text-xs ${completedSteps.has(idx) ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                              {instruction}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs">
                          {currentStep + 1}
                        </div>
                        <p className="text-sm text-gray-700">
                          {selectedScenario.instructions[currentStep]}
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center gap-2 text-black">
                      <CheckCircle className="w-5 h-5" />
                      <p className="text-sm">Lab completed! Great job!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Terminal */}
              <div className="bg-black rounded-2xl p-6 text-white font-mono text-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <p className="text-white">Cisco IOS Terminal</p>
                    {useAIMode && (
                      <Badge className="bg-white text-black text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        AI-Powered
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>

                <div 
                  ref={terminalRef}
                  className="space-y-1 mb-4 min-h-[300px] max-h-[400px] overflow-y-auto"
                >
                  <p className="text-gray-400">Cisco IOS Software, Version 15.7</p>
                  <p className="text-gray-400">Copyright (c) 1986-2025 by Cisco Systems, Inc.</p>
                  <p className="text-gray-400 mb-4">---</p>
                  
                  {commandHistory.map((item, index) => (
                    <div key={index} className="mb-2">
                      <div className="flex items-start gap-1">
                        <span className="text-green-400">{index === 0 ? 'Router>' : getPrompt()}</span>
                        <p className="text-white flex-1">{item.command}</p>
                      </div>
                      {item.response && (
                        <div className="mt-1 ml-1">
                          <p className="text-gray-300 whitespace-pre-wrap">{item.response}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isProcessing && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <div className="animate-pulse">Processing...</div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                {!completed && (
                  <div className="flex gap-1 items-center border-t border-gray-800 pt-4">
                    <span className="text-green-400">{getPrompt()}</span>
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !isProcessing && handleRunCommand()}
                      placeholder="Type your command here..."
                      className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-600"
                      autoFocus
                      disabled={isProcessing}
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {!completed && (
                  <>
                    <Button
                      onClick={handleRunCommand}
                      className="bg-black hover:bg-gray-800 text-white"
                      disabled={!userInput.trim() || isProcessing}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {isProcessing ? 'Processing...' : 'Execute Command'}
                    </Button>
                    <Button
                      onClick={() => {
                        if (useAIMode && !showHint) {
                          generateContextualHint();
                        }
                        setShowHint(!showHint);
                      }}
                      variant="outline"
                      className="border-black text-black hover:bg-gray-100"
                      disabled={isGeneratingHint}
                    >
                      <Lightbulb className="w-4 h-4 mr-2" />
                      {isGeneratingHint ? 'Generating...' : showHint ? 'Hide' : 'Show'} Hint
                    </Button>
                  </>
                )}
                {completed && (
                  <Button
                    onClick={handleReset}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Try Again for Higher Score
                  </Button>
                )}
              </div>

              {/* Hint */}
              {showHint && !completed && (
                <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-200 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-700 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-yellow-900">
                        <strong>💡 Hint:</strong>{' '}
                        {useAIMode ? (
                          dynamicHint || 'Click "Show Hint" to get AI-powered guidance based on your progress.'
                        ) : (
                          selectedScenario.hints[currentStep]
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Completion */}
              {completed && (
                <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Trophy className="w-8 h-8 text-green-600" />
                    <div>
                      <h4 className="text-green-900">Lab Completed! 🎉</h4>
                      <p className="text-sm text-green-800">
                        You earned {Math.round(score)} points with {totalAttempts} commands executed!
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-green-800">
                    {useAIMode 
                      ? "Excellent work! You've mastered the free-form terminal practice!"
                      : "Great job! Keep practicing to master Cisco IOS commands!"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
