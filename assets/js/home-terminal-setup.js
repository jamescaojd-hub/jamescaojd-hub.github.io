(function() {
  const terminalElement = document.getElementById('home-terminal');

  if (!terminalElement || !window.jQuery || !jQuery.fn.terminal) {
    return;
  }

  const storageKey = 'portfolio.home-terminal.v1';
  const prompt = 'jindong@portfolio:~$ ';
  const initialEntries = [
    { type: 'command', text: './intro.sh' },
    { type: 'output', value: 'name      Jindong Cao' },
    { type: 'output', value: 'location  San Jose, California' },
    { type: 'output', value: 'focus     ranking / recommendation / applied ai' },
    { type: 'output', value: 'stack     Python / PyTorch / C++' },
    { type: 'output', value: '' },
    { type: 'command', text: 'help' },
    { type: 'output', value: 'whoami  pwd  ls  skills  contact  github  linkedin  email  resume  clear' },
  ];

  const commandOutputs = {
    whoami: [
      'Jindong Cao',
      'Machine Learning Engineer building ranking, recommendation, and applied AI systems.',
    ],
    pwd: ['/san-jose/california'],
    ls: ['highlights/  contact/  resume/'],
    skills: ['ranking-systems', 'recommender-systems', 'multi-task-learning', 'production-ml'],
    contact: [
      'github: https://github.com/jamescaojd-hub',
      'linkedin: https://www.linkedin.com/in/jindong-cao',
      'email: mailto:jamescaojd@gmail.com',
    ],
    github: ['https://github.com/jamescaojd-hub'],
    linkedin: ['https://www.linkedin.com/in/jindong-cao'],
    email: ['mailto:jamescaojd@gmail.com'],
    resume: ['/resume/', '/assets/pdf/jindong_resume.pdf'],
    help: ['whoami  pwd  ls  skills  contact  github  linkedin  email  resume  clear'],
  };

  function normalizeCommand(command) {
    return command.trim().replace(/\s+/g, ' ').toLowerCase();
  }

  function loadEntries() {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(storageKey));
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (error) {
      window.localStorage.removeItem(storageKey);
    }
    return initialEntries.slice();
  }

  function saveEntries(entries) {
    window.localStorage.setItem(storageKey, JSON.stringify(entries));
  }

  function renderValue(value) {
    if (value.startsWith('https://')) {
      return `[[!;;;;${value}]${value}]`;
    }
    if (value.startsWith('mailto:')) {
      return `[[!;;;;${value}]${value.replace('mailto:', '')}]`;
    }
    if (value === '/resume/') {
      return `[[!;;;;${value}]resume page]`;
    }
    if (value === '/assets/pdf/jindong_resume.pdf') {
      return `[[!;;;;${value}]resume pdf]`;
    }
    return $.terminal.escape_brackets(value);
  }

  function renderEntry(term, entry) {
    if (entry.type === 'command') {
      term.echo(`[[;#7cf29a;]${prompt}]${$.terminal.escape_brackets(entry.text)}`);
      return;
    }

    if (entry.type === 'output') {
      if (entry.value === '') {
        term.echo('');
        return;
      }
      term.echo(renderValue(entry.value));
    }
  }

  const transcriptEntries = loadEntries();

  const term = jQuery(terminalElement).terminal(function(command) {
    const rawCommand = command.trim();
    if (!rawCommand) {
      return;
    }

    const normalized = normalizeCommand(rawCommand);
    transcriptEntries.push({ type: 'command', text: rawCommand });

    if (normalized === 'clear') {
      transcriptEntries.length = 0;
      window.localStorage.removeItem(storageKey);
      term.clear();
      initialEntries.forEach((entry) => renderEntry(term, entry));
      initialEntries.forEach((entry) => transcriptEntries.push(entry));
      saveEntries(transcriptEntries);
      return;
    }

    const outputs = commandOutputs[normalized];
    if (outputs) {
      outputs.forEach((value) => {
        const entry = { type: 'output', value };
        transcriptEntries.push(entry);
        renderEntry(term, entry);
      });
      saveEntries(transcriptEntries);
      return;
    }

    const entry = { type: 'output', value: `command not found: ${rawCommand}` };
    transcriptEntries.push(entry);
    renderEntry(term, entry);
    saveEntries(transcriptEntries);
  }, {
    greetings: false,
    prompt,
    checkArity: false,
    clear: false,
    anyLinks: true,
    completion: ['help', 'whoami', 'pwd', 'ls', 'skills', 'contact', 'github', 'linkedin', 'email', 'resume', 'clear'],
  });

  term.clear();
  transcriptEntries.forEach((entry) => renderEntry(term, entry));
  term.scroll_to_bottom();
})();
