/**
 * MCA Semester-I — Campus Assessment Syllabus Knowledge Base.
 *
 * Single source of truth for the Campus Assessment Chatbot:
 * 5 subjects, units and exam topics. Used by:
 *  - server.ts (Gemini system prompt + deterministic fallback engine)
 *  - AICampusAssistant / App.tsx global search (topic lookup)
 *
 * Pure module — no Node or DOM dependencies so it can be shared
 * between the tsx server and the Vite client bundle.
 */

export interface McaUnit {
  unit: string;
  title: string;
  topics: string[];
}

export interface McaSubject {
  id: string;
  code: string;
  name: string;
  shortName: string;
  /** Lowercase keywords / aliases used for subject detection. */
  keywords: string[];
  units: McaUnit[];
}

export const MCA_SEM1_SUBJECTS: McaSubject[] = [
  {
    id: 'dsa',
    code: 'MCA-DSA',
    name: 'Data Structures and Algorithmic Techniques',
    shortName: 'Data Structures',
    keywords: [
      'data structure', 'data structures', 'dsa', 'algorithmic technique',
      'algorithmic techniques', 'algorithm', 'algorithms', 'asymptotic',
      'big-o', 'big o', 'big-ω', 'big-θ', 'time complexity', 'space complexity',
      'linked list', 'stack', 'queue', 'priority queue', 'infix', 'postfix',
      'tree', 'trees', 'binary tree', 'binary search tree', 'bst', 'avl',
      'rotation', 'graph', 'graphs', 'bfs', 'dfs', 'sorting', 'merge sort',
      'quick sort', 'insertion sort', 'heap sort', 'heap', 'linear search',
      'binary search', 'sequential search', 'divide and conquer',
      'decrease and conquer', 'transform and conquer', 'warshall', 'floyd',
      'kruskal', 'dijkstra', 'prim', 'greedy', 'dynamic programming',
      'tsp', 'travelling salesman', 'traveling salesman', 'knapsack',
      'backtracking', 'n-queen', 'n queen', 'hamiltonian', 'subset sum',
      'branch and bound', 'assignment problem', 'recursion', 'recursive',
      'iterative', 'abstract data',
    ],
    units: [
      {
        unit: 'Unit 1',
        title: 'Introduction and Abstract Data Type',
        topics: [
          'Introduction to Data Structures',
          'Data structure classification',
          'Abstract Data Types',
          'Asymptotic Notations (Big-O, Big-Ω, Big-Θ)',
          'Basic Efficiency Classes',
          'Algorithmic Space Complexity',
          'Iterative vs Recursive approach',
          'Linked List',
          'Implementation of Linked List',
          'Linear List Applications',
          'Circular Linked List',
          'Doubly Linked List',
          'Stack',
          'Stack implementation using Linked List',
          'Applications of Stack',
          'Infix to Postfix conversion',
          'Postfix expression evaluation',
          'Queue',
          'Queue implementation using Linked List',
          'Priority Queue',
          'Applications of Queue',
        ],
      },
      {
        unit: 'Unit 2',
        title: 'Abstract Data Type Implementation',
        topics: [
          'Trees',
          'Tree terminology',
          'Binary Trees',
          'Binary Tree implementation',
          'Applications of Binary Trees',
          'Binary Tree Traversals (Preorder, Inorder, Postorder)',
          'Binary Search Tree',
          'BST implementation',
          'AVL Trees',
          'AVL Tree implementation',
          'AVL rotations (LL, RR, LR, RL)',
          'Graphs',
          'Types of Graphs',
          'Graph representations (Adjacency Matrix, Adjacency List)',
          'Breadth First Search',
          'Depth First Search',
        ],
      },
      {
        unit: 'Unit 3',
        title: 'Analysis of Sorting and Searching Algorithms',
        topics: [
          'Divide and Conquer',
          'Merge Sort',
          'Quick Sort',
          'Linear Search',
          'Binary Search',
          'Binary Search Tree',
          'Sequential Search',
          'Tree Traversal and related properties',
          'Decrease and Conquer',
          'Insertion Sort',
          'Heap',
          'Heap Sort',
        ],
      },
      {
        unit: 'Unit 4',
        title: 'Algorithmic Techniques',
        topics: [
          'Transform and Conquer',
          'Pre-sorting',
          "Warshall's Algorithm",
          "Floyd's Algorithm",
          "Kruskal's Algorithm",
          "Dijkstra's Algorithm",
          'Greedy Techniques',
          "Prim's Algorithm",
          'Dynamic Programming',
          'Traveling Salesman Problem',
          'Knapsack Problem',
        ],
      },
      {
        unit: 'Unit 5',
        title: 'Algorithmic Design Methods',
        topics: [
          'Backtracking',
          "N-Queen's Problem",
          'Hamiltonian Circuit Problem',
          'Subset Sum Problem',
          'Branch and Bound',
          'Assignment Problem',
        ],
      },
    ],
  },
  {
    id: 'python',
    code: 'MCA-PY',
    name: 'Python Programming',
    shortName: 'Python',
    keywords: [
      'python', 'tkinter', 'numpy', 'pandas', 'matplotlib', 'seaborn',
      'lists', 'tuple', 'tuples', 'dictionary', 'dict', 'sets', 'string',
      'regular expression', 'regex',       'function', 'python module', 'csv',
      'pdf', 'dataframe', 'series', 'array', 'broadcasting',
      'line plot', 'bar plot', 'pie chart', 'scatter plot', 'box plot',
      'gui', 'label', 'grid', 'entry box', 'button', 'frame', 'canvas',
      'check button', 'radio button', 'text widget', 'scale widget',
      'message box', 'menu bar', 'while loop', 'for loop', 'break',
      'continue', 'keyword argument', 'variable scope',
    ],
    units: [
      {
        unit: 'Unit 1',
        title: 'Programming Foundation and Exploratory Data Analysis',
        topics: [
          'Introduction to Python',
          'Basic Data Types',
          'Keywords',
          'Variables',
          'Expressions',
          'Decision Statements (if, if-else, if-elif-else)',
          'Iterative Statements (while loop, for loop, nested loops)',
          'break and continue',
        ],
      },
      {
        unit: 'Unit 2',
        title: 'Data Structures and Functions',
        topics: [
          'Strings',
          'Lists',
          'Tuples',
          'Dictionaries',
          'Sets',
          'Regular Expressions (basics, pattern matching, common operations)',
          'Defining functions',
          'Variable scope',
          'Parameters and Return values',
          'Keyword arguments',
          'Modules',
        ],
      },
      {
        unit: 'Unit 3',
        title: 'Files and Data Pre-processing',
        topics: [
          'File Input/Output',
          'File Operations and Access Modes',
          'CSV files and CSV processing',
          'Converting CSV into PDF',
          'Creating, modifying and extracting pages from PDF files',
          'Concatenating and merging PDFs',
          'Rotating and cropping PDF pages',
          'Encrypting and decrypting PDF files',
          'Creating PDF from scratch',
          'Feature Extraction',
          'Data Pre-processing Techniques',
        ],
      },
      {
        unit: 'Unit 4',
        title: 'Working with Python Libraries',
        topics: [
          'NumPy Arrays (indexing, slicing, reshaping)',
          'NumPy Mathematical Operations and Broadcasting',
          'Pandas Series and DataFrame',
          'Importing and exporting CSV and Excel files',
          'Data Cleaning and Missing Data',
          'Filtering, Sorting and Grouping',
          'Matplotlib and Seaborn (Line, Bar, Pie, Scatter, Box plots)',
          'Styling and Subplotting',
        ],
      },
      {
        unit: 'Unit 5',
        title: 'GUI Programming with Tkinter',
        topics: [
          'Tkinter basics',
          'Labels and Grid',
          'Entry Box and Buttons',
          'Frames, Colors and Images',
          'Canvas',
          'Check Button and Radio Button',
          'Text Widget and Scale Widget',
          'GUI Events and Title Bar',
          'Disabling widgets',
          'Message Box and Dialogs',
          'New Window and Menu Bars',
        ],
      },
    ],
  },
  {
    id: 'java-web',
    code: 'MCA-JAVA',
    name: 'Java and Web Programming',
    shortName: 'Java & Web',
    keywords: [
      'java', 'oops', 'encapsulation', 'inheritance', 'polymorphism',
      'abstraction', 'overloading', 'overriding', 'constructor',
      'stringbuilder', 'lambda', 'streams', 'wrapper class', 'vector',
      'packages', 'java package', 'interface', 'multithreading', 'thread', 'exception',
      'try-catch', 'finally', 'throw', 'throws', 'html', 'css',
      'javascript', 'html canvas', 'xml', 'xsl', 'xslt', 'dtd',
      'json', 'rest', 'web service', 'uddi', 'wsdl', 'servlet',
      'tomcat', 'jsp', 'jstl', 'cookie', 'session', 'http', 'http get',
      'http post', 'cgi', 'yaml', 'weblogic', 'jakarta',
    ],
    units: [
      {
        unit: 'Unit 1',
        title: 'Introduction',
        topics: [
          'OOP concepts (Encapsulation, Inheritance, Polymorphism, Abstraction)',
          'Overloading, Overriding, Reusability, Extensibility',
          'Dynamic Binding and Message Passing',
          'Java Features, Data Types and Arrays',
          'Classes, Methods and Constructors',
          'Method Overloading and Overriding',
          'String Handling (Lambdas, Streams, StringBuilder, Vector, Wrapper Classes)',
        ],
      },
      {
        unit: 'Unit 2',
        title: 'Packages, Interfaces, Multithreading and Exception Handling',
        topics: [
          'Java API Packages (creating, accessing and using packages)',
          'Interfaces (creating and implementing)',
          'Multithreading (Life Cycle, Priority, Pools, Concurrency Utilities)',
          'Exception Handling (try-catch, finally, throw, throws, user-defined exceptions)',
          'Stream concepts and Stream classes',
        ],
      },
      {
        unit: 'Unit 3',
        title: 'Scripting',
        topics: [
          'HTML and HTML5 web page designing',
          'CSS and CSS3',
          'JavaScript (objects, operators, events, BOM, form validation, ES6)',
          'HTML5 Canvas basics and drawing',
          'XML (tags, elements, attributes, XSL, XSLT, DTD, Schema)',
          'Web Services (UDDI, WSDL, Java Web Services)',
          'JSON and JSON-based RESTful Services',
        ],
      },
      {
        unit: 'Unit 4',
        title: 'HTTP Server Programming',
        topics: [
          'HTML Forms and CGI',
          'HTTP, Servlet Programming and Servlet Life Cycle',
          'Tomcat (creating and deploying servlets)',
          'Web Servers (Java Web Server, Tomcat, WebLogic)',
          'Servlet API and jakarta.servlet.http',
          'Servlet Parameters, HTTP Requests and Responses',
          'GET and POST',
          'Cookies and Session Tracking',
        ],
      },
      {
        unit: 'Unit 5',
        title: 'JSP and YAML/JSON',
        topics: [
          'JSP Life Cycle and Components',
          'Directives and Implicit/Explicit Objects',
          'Scriptlets, Expressions and Expression Language',
          'Scope and JSP Error Handling',
          'JSTL and JSP Tags',
          'Tomcat Integration, Request Strings and User Sessions',
          'Cookies and Session Objects',
          'YAML and JSON-based Configuration',
        ],
      },
    ],
  },
  {
    id: 'maths',
    code: 'MCA-MFCS',
    name: 'Mathematical Foundations for Computer Science',
    shortName: 'Maths (MFCS)',
    keywords: [
      'math', 'maths', 'matrix', 'matrices', 'rank of', 'echelon',
      'eigenvalue', 'eigenvector', 'linear algebra', 'vector space',
      'subspace', 'linear combination', 'linear independence',
      'linear dependence', 'basis', 'dimension', 'linear transformation',
      'rank-nullity', 'kernel', 'range', 'set', 'sets', 'subset',
      'venn', 'cartesian', 'relation', 'function', 'one-to-one',
      'onto', 'composition', 'inverse function', 'probability',
      'conditional probability', 'bayes', 'random variable',
      'expectation', 'variance', 'bernoulli', 'binomial', 'poisson',
      'normal distribution', 'uniform distribution', 'exponential',
      'chi-square', 't distribution', 'f distribution',
      'monte carlo', 'sampling', 'homogeneous system', 'consistency',
    ],
    units: [
      {
        unit: 'Unit 1',
        title: 'Matrices',
        topics: [
          'Rank of a Matrix',
          'Finding Rank using Echelon Form',
          'Homogeneous Systems of Linear Equations',
          'm Linear Equations in n Unknowns',
          'Consistency Criterion',
          'Eigenvalues',
          'Eigenvectors',
        ],
      },
      {
        unit: 'Unit 2',
        title: 'Linear Algebra',
        topics: [
          'Vector Space and Subspaces',
          'Linear Combination',
          'Linear Independence and Dependence',
          'Basis and Dimension',
          'Linear Transformation and its Matrix',
          'Range and Kernel',
          'Rank-Nullity Theorem',
        ],
      },
      {
        unit: 'Unit 3',
        title: 'Sets and Functions',
        topics: [
          'Sets, Subsets and Set Operations',
          'Laws of Set Theory and Counting',
          'Venn Diagrams and Cartesian Products',
          'Relations',
          'Functions (One-to-One, Onto, Composition, Inverse)',
        ],
      },
      {
        unit: 'Unit 4',
        title: 'Probability',
        topics: [
          'Probability Theory and Axioms',
          'Addition Rule and Conditional Probability',
          'Independent Events and Multiplication Rule',
          "Bayes' Theorem",
          'Random Variables (Discrete and Continuous)',
          'Distribution Function',
          'Expectation and Variance',
        ],
      },
      {
        unit: 'Unit 5',
        title: 'Probability Distributions',
        topics: [
          'Discrete Distributions (Bernoulli, Binomial, Poisson, Negative Binomial)',
          'Continuous Distributions (Uniform, Exponential, Normal)',
          'Sampling Distributions (t, F, Chi-Square)',
          'Mean, Variance, Properties and Applications',
          'Monte Carlo Simulation Technique',
        ],
      },
    ],
  },
  {
    id: 'adbms',
    code: 'MCA-ADBMS',
    name: 'Advanced Database Management Systems (ADBMS)',
    shortName: 'ADBMS',
    keywords: [
      'database', 'dbms', 'adbms', 'rdbms', 'sql', 'normalization', 'normalize',
      '1nf', '2nf', '3nf', 'bcnf', '4nf', '5nf', 'er model', 'eer',
      'relational', 'relational algebra', 'join', 'subquery',
      'view', 'transaction', 'acid', 'atomicity', 'serializability',
      'concurrency', 'lock', 'timestamp', 'recovery', 'trigger',
      'procedure', 'ddl', 'dml', 'dcl', 'tcl', 'dql', 'primary key',
      'foreign key', 'candidate key', 'functional dependency',
      'query processing', 'query optimization', 'three schema',
      'data independence', 'client/server', 'centralized',
    ],
    units: [
      {
        unit: 'Unit 1',
        title: 'Databases and Database Management Systems',
        topics: [
          'Introduction to Databases and Applications',
          'Characteristics of Database Approach',
          'Data Models, Schemas and Instances',
          'Three Schema Architecture and Data Independence',
          'Database Languages and Interfaces',
          'Database System Environment',
          'Centralized and Client/Server Architecture',
          'Classification of DBMS',
        ],
      },
      {
        unit: 'Unit 2',
        title: 'Relational DBMS and Database Design',
        topics: [
          'Relational Model (structure, schema, keys, diagrams)',
          'Relational Query Language and Relational Algebra',
          'ER Model, Design Process and Mapping Cardinalities',
          'Primary Keys and EER Model',
          'Redundancy, Anomalies and Dependency',
          'Normalization (1NF, 2NF, 3NF, 4NF, 5NF, BCNF)',
        ],
      },
      {
        unit: 'Unit 3',
        title: 'Relational Languages / SQL',
        topics: [
          'SQL Basics and Data Definition',
          'Basic Structure of SQL Queries',
          'Set Operations and NULL Values',
          'Aggregate Functions and Nested Subqueries',
          'Database Modification and JOIN expressions',
          'Views and Transactions',
          'Integrity Constraints, Data Types and Functions',
          'Procedures and Triggers',
        ],
      },
      {
        unit: 'Unit 4',
        title: 'Advanced Concepts in DBMS',
        topics: [
          'Query Processing and its Basic Steps',
          'Measures of Query Cost',
          'Query Optimization',
          'Transformation of Relational Expressions',
          'Estimating Statistics of Expressions',
        ],
      },
      {
        unit: 'Unit 5',
        title: 'Transaction Management',
        topics: [
          'Transactions, Atomicity and Transaction States',
          'Concurrent Execution and Serializability',
          'Concurrency Control (Lock-Based and Timestamp-Based Protocols)',
          'Recovery Systems and Failure Classification',
          'Recovery and Atomicity, Recovery Algorithms',
          'Buffer Management and Main-Memory Database Recovery',
        ],
      },
    ],
  },
];

/** Topics that are related to a subject but NOT in this syllabus. */
const BEYOND_SYLLABUS_KEYWORDS = [
  'machine learning', 'deep learning', 'neural network', 'react',
  'angular', 'vue', 'docker', 'kubernetes', 'blockchain', 'flutter',
  'mongodb atlas', 'graphql', 'redis', 'kafka', 'tensorflow', 'pytorch',
  'devops', 'aws', 'azure', 'gcp', 'cyber attack', 'ethical hacking',
  'natural language', 'computer vision', 'reinforcement learning',
];

/** Clearly non-academic queries — outside the assessment chatbot scope. */
const UNRELATED_KEYWORDS = [
  'movie', 'cricket', 'football', 'ipl', 'song', 'music album',
  'astrology', 'horoscope', 'election', 'politician', 'stock tip',
  'lottery', 'betting', 'dating', 'marriage', 'recipe', 'cooking',
  'cricket score', 'box office', 'big boss', 'netflix',
];

export type McaStudyMode =
  | 'teach'
  | 'very-easy'
  | 'exam-answer'
  | 'quiz'
  | 'mock-exam'
  | 'programming'
  | 'debugging'
  | 'maths-solve'
  | 'sql'
  | 'compare'
  | 'revision'
  | 'one-shot'
  | 'general';

export interface McaMatch {
  subject: McaSubject | null;
  unit: McaUnit | null;
  matchedTopics: string[];
  mode: McaStudyMode;
  status: 'in-syllabus' | 'beyond-syllabus' | 'unrelated' | 'general';
  /** Keyword match strength. In-syllabus engagement needs score >= 2. */
  score: number;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Short keywords (4 chars or fewer) need a word-boundary hit to avoid false positives. */
function keywordHit(q: string, kw: string): boolean {
  if (!kw) return false;
  if (kw.length <= 4) {
    return new RegExp(`\\b${escapeRegExp(kw)}\\b`).test(q);
  }
  if (q.includes(kw)) return true;
  // Concatenated / typo-tolerant match: "linklist" / "linkedlist" / "binarysearch" …
  const qFlat = q.replace(/[^a-z0-9]/g, '');
  const kwFlat = kw.replace(/[^a-z0-9]/g, '');
  if (kwFlat.length >= 5 && qFlat.includes(kwFlat)) return true;
  return false;
}

/** Fix the most common student typos before subject/topic matching. */
function fixCommonTypos(q: string): string {
  return q
    .replace(/\beer\s+modal\b/g, 'eer model')
    .replace(/\ber\s+modal\b/g, 'er model')
    .replace(/\blink\s*list\b/g, 'linked list')
    .replace(/\blinkedlist\b/g, 'linked list')
    .replace(/\blinklist\b/g, 'linked list')
    .replace(/\bbinery\b/g, 'binary')
    .replace(/\bseach\b/g, 'search')
    .replace(/\bquue\b/g, 'queue')
    .replace(/\bstak\b/g, 'stack')
    .replace(/\barry\b/g, 'array');
}

const MODE_RULES: Array<{ mode: McaStudyMode; keywords: string[] }> = [
  { mode: 'very-easy', keywords: ['very easy', 'like class 1', 'simple words', 'i am beginner', "i don't understand", 'beginner'] },
  { mode: 'mock-exam', keywords: ['mock test', 'mock exam', 'mock examination', 'practice paper', 'sample paper'] },
  { mode: 'quiz', keywords: ['quiz', 'mcq', 'multiple choice', 'true/false', 'true false', 'fill in the blank', 'test me', 'practice question'] },
  { mode: 'exam-answer', keywords: ['5-mark', '5 mark', '10-mark', '10 mark', '2-mark', '2 mark', 'exam answer', 'write an exam', 'for exam'] },
  { mode: 'debugging', keywords: ['debug', 'error in my code', 'fix my code', 'why is my code', 'not working', 'traceback'] },
  { mode: 'programming', keywords: ['write a program', 'write code', 'program to', 'code for', 'implement in', 'pseudocode'] },
  { mode: 'maths-solve', keywords: ['solve', 'find the rank', 'find eigenvalue', 'calculate probability', 'prove that', 'show that'] },
  { mode: 'sql', keywords: ['sql query', 'write sql', 'select ', 'create table', 'normalize', 'normal form'] },
  { mode: 'compare', keywords: [' vs ', ' versus ', 'difference between', 'differentiate', 'compare'] },
  { mode: 'one-shot', keywords: ['one shot', 'one-shot', 'complete revision'] },
  { mode: 'revision', keywords: ['revise', 'revision', 'quick revision', 'important questions', 'unit-wise'] },
  { mode: 'teach', keywords: ['teach me', 'explain', 'what is', 'what are', 'define', 'meaning of', 'how does', 'how do', 'why'] },
];

function detectMode(q: string): McaStudyMode {
  for (const rule of MODE_RULES) {
    if (rule.keywords.some((k) => q.includes(k))) return rule.mode;
  }
  return 'general';
}

/**
 * Match a student query against the MCA Semester-I syllabus.
 * Returns the best subject, unit, topic hits, study mode and syllabus status.
 */
export function matchMcaSyllabus(query: string): McaMatch {
  const raw = query.toLowerCase().trim();
  const q = fixCommonTypos(raw);
  const mode = detectMode(q);

  if (!q) {
    return { subject: null, unit: null, matchedTopics: [], mode, status: 'general', score: 0 };
  }

  if (UNRELATED_KEYWORDS.some((k) => q.includes(k))) {
    return { subject: null, unit: null, matchedTopics: [], mode, status: 'unrelated', score: 0 };
  }

  let bestSubject: McaSubject | null = null;
  let bestScore = 0;
  for (const subject of MCA_SEM1_SUBJECTS) {
    let score = 0;
    for (const kw of subject.keywords) {
      if (keywordHit(q, kw)) score += kw.length > 6 ? 3 : kw.length > 4 ? 2 : 1;
    }
    const shortFirst = subject.shortName.toLowerCase().split(' ')[0];
    if (shortFirst.length > 4 && q.includes(shortFirst)) {
      score += 2;
    }
    if (score > bestScore) {
      bestScore = score;
      bestSubject = subject;
    }
  }

  if (!bestSubject || bestScore === 0) {
    if (BEYOND_SYLLABUS_KEYWORDS.some((k) => q.includes(k))) {
      return { subject: null, unit: null, matchedTopics: [], mode, status: 'beyond-syllabus', score: bestScore };
    }
    const academicHint =
      mode !== 'general' ||
      ['syllabus', 'unit', 'semester', 'subject', 'chapter', 'topic', 'marks'].some((k) =>
        q.includes(k),
      );
    if (academicHint) {
      return { subject: null, unit: null, matchedTopics: [], mode, status: 'general', score: bestScore };
    }
    return { subject: null, unit: null, matchedTopics: [], mode, status: 'general', score: bestScore };
  }

  const beyondHit = BEYOND_SYLLABUS_KEYWORDS.find((k) => q.includes(k));
  if (beyondHit) {
    return { subject: bestSubject, unit: null, matchedTopics: [beyondHit], mode, status: 'beyond-syllabus', score: bestScore };
  }

  // Rank topics by specificity (specific phrase hits beat generic single-word hits),
  // so "linked list" wins over generic "data / introduction" filler topics.
  const qFlat = q.replace(/[^a-z0-9]/g, '');
  const unitMention = q.match(/unit\s*([1-5])/);
  const STOP = new Set([
    'with', 'using', 'from', 'into', 'and/or', 'introduction', 'implementation',
    'implementations', 'applications', 'application', 'basic', 'basics', 'advanced',
  ]);
  const scoredTopics: Array<{ unit: McaUnit; topic: string; score: number }> = [];
  const unitScores = new Map<string, number>();
  for (const unit of bestSubject.units) {
    let unitScore = 0;
    // Explicit "Unit N" mention boosts that unit (student told us where to look).
    if (unitMention && unit.unit.toLowerCase().includes(`unit ${unitMention[1]}`)) {
      unitScore += 5;
    }
    for (const topic of unit.topics) {
      const t = topic.toLowerCase();
      const words = t
        .replace(/[^a-z0-9+/#.\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 3 && !STOP.has(w));
      let score = 0;
      for (const w of words) {
        if (q.includes(w)) score += Math.min(w.length, 8);
        else {
          const wFlat = w.replace(/[^a-z0-9]/g, '');
          if (wFlat.length >= 5 && qFlat.includes(wFlat)) score += Math.min(w.length, 8);
        }
      }
      // Full-phrase bonus: the exact multi-word topic phrase in the query.
      const core = t.replace(/\(.*?\)/g, '').trim();
      if (core.length > 5 && (q.includes(core) || qFlat.includes(core.replace(/[^a-z0-9]/g, '')))) {
        score += 12;
      } else if (words.length >= 2) {
        // Any 2-word phrase from the topic appearing verbatim is a strong signal.
        const parts = core.split(/\s+/);
        for (let i = 0; i < parts.length - 1; i++) {
          const phrase = `${parts[i]} ${parts[i + 1]}`;
          if (phrase.length > 6 && q.includes(phrase)) {
            score += 8;
            break;
          }
        }
      }
      // Acronym bonus: EER, BCNF, 3NF, BST, AVL, BFS, SQL, JSP… typed as-is.
      const acronyms = topic.match(/\b[A-Z0-9]{2,5}\b/g) || [];
      for (const ac of acronyms) {
        if (new RegExp(`\\b${ac.toLowerCase()}\\b`).test(q)) {
          score += 10;
          break;
        }
      }
      if (score > 0) {
        scoredTopics.push({ unit, topic, score });
        unitScore += score;
      }
    }
    unitScores.set(unit.unit, unitScore);
  }
  scoredTopics.sort((a, b) => b.score - a.score);
  const matchedTopics = scoredTopics.slice(0, 4).map((s) => s.topic);
  let bestUnit: McaUnit | null = null;
  let bestUnitScore = -1;
  for (const unit of bestSubject.units) {
    const s = unitScores.get(unit.unit) || 0;
    if (s > bestUnitScore) {
      bestUnitScore = s;
      bestUnit = unit;
    }
  }
  if (bestUnitScore <= 0) bestUnit = null;

  return {
    subject: bestSubject,
    unit: bestUnit,
    matchedTopics,
    mode,
    // Single-keyword hits stay 'general' so portal blocks (clubs, fees, …)
    // keep priority; the weak-hit catcher before DEFAULT still answers them.
    status: bestScore >= 2 ? 'in-syllabus' : 'general',
    score: bestScore,
  };
}

export interface McaTopicHit {
  subjectId: string;
  subjectName: string;
  shortName: string;
  unit: string;
  unitTitle: string;
  topic: string;
}

/**
 * Flat topic search for the global SIS search box and quick links.
 */
export function searchMcaTopics(query: string, limit = 4): McaTopicHit[] {
  const q = fixCommonTypos(query.toLowerCase().trim());
  if (q.length < 2) return [];
  const hits: Array<McaTopicHit & { score: number }> = [];
  for (const subject of MCA_SEM1_SUBJECTS) {
    for (const unit of subject.units) {
      for (const topic of unit.topics) {
        const t = topic.toLowerCase();
        const tFlat = t.replace(/[^a-z0-9]/g, '');
        let score = 0;
        if (t.includes(q)) score = q.length >= 4 ? 10 + q.length : 6;
        else if (q.replace(/[^a-z0-9]/g, '').length >= 5 && tFlat.includes(q.replace(/[^a-z0-9]/g, ''))) score = 10;
        else {
          const words = q.split(/\s+/).filter((w) => w.length > 2);
          const matched = words.filter(
            (w) =>
              t.includes(w) ||
              (w.replace(/[^a-z0-9]/g, '').length >= 5 &&
                tFlat.includes(w.replace(/[^a-z0-9]/g, ''))),
          ).length;
          if (matched > 0 && matched / words.length >= 0.5) score = matched * 2;
        }
        if (score > 0) {
          hits.push({
            subjectId: subject.id,
            subjectName: subject.name,
            shortName: subject.shortName,
            unit: unit.unit,
            unitTitle: unit.title,
            topic,
            score,
          });
        }
      }
    }
    if (subject.name.toLowerCase().includes(q) || subject.shortName.toLowerCase().includes(q)) {
      hits.push({
        subjectId: subject.id,
        subjectName: subject.name,
        shortName: subject.shortName,
        unit: subject.units[0].unit,
        unitTitle: subject.units[0].title,
        topic: `${subject.name} — full syllabus overview`,
        score: 8,
      });
    }
  }
  return hits
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ score: _score, ...rest }) => rest);
}

/** Compact subject/unit index for suggestion chips and AI context. */
export function getMcaSubjectIndex(): Array<{ id: string; name: string; shortName: string; units: string[] }> {
  return MCA_SEM1_SUBJECTS.map((s) => ({
    id: s.id,
    name: s.name,
    shortName: s.shortName,
    units: s.units.map((u) => `${u.unit}: ${u.title}`),
  }));
}

/** My Courses presentation card for one MCA Semester-I subject. */
export interface McaCourseCard {
  id: string;
  subjectId: string;
  code: string;
  title: string;
  shortName: string;
  coordinator: string;
  department: string;
  credits: number;
  schedule: string;
  room: string;
  photo: string;
  accent: string;
  tagline: string;
}

function topicCount(subjectId: string): number {
  const s = MCA_SEM1_SUBJECTS.find((x) => x.id === subjectId);
  return s ? s.units.reduce((n, u) => n + u.topics.length, 0) : 0;
}

export function getMcaCourseUnits(subjectId: string): McaUnit[] {
  const s = MCA_SEM1_SUBJECTS.find((x) => x.id === subjectId);
  return s ? s.units : [];
}

export const MCA_PROGRAM_META = {
  program: 'MCA · Division D',
  semester: 'Semester I · Fall 2026',
  student: 'Parth Pimplapure · 26MCAD30',
  totalCredits: 20,
  subjectCount: 5,
};

/** Official MCA Semester-I course lineup with cover photos (Unsplash CDN). */
export const MCA_COURSE_CARDS: McaCourseCard[] = [
  {
    id: 'mca-dsa',
    subjectId: 'dsa',
    code: 'MCA101',
    title: 'Data Structures and Algorithmic Techniques',
    shortName: 'Data Structures',
    coordinator: 'Dr. Velmurugan R · PG Coordinator',
    department: 'Dept. of Computer Science (PG)',
    credits: 4,
    schedule: 'Mon · Wed · Fri · 10:00 AM',
    room: 'Turing Hall 302',
    photo: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=60',
    accent: '#1E3A8A',
    tagline: 'Trees, graphs, sorting and algorithmic design — the core of every technical interview.',
  },
  {
    id: 'mca-python',
    subjectId: 'python',
    code: 'MCA102',
    title: 'Python Programming',
    shortName: 'Python',
    coordinator: 'Dr. Sheeja S · Professor (PG)',
    department: 'Dept. of Computer Science (PG)',
    credits: 4,
    schedule: 'Tue · Thu · 9:00 AM',
    room: 'Turing Lab 2',
    photo: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=900&q=60',
    accent: '#0E7C3A',
    tagline: 'From Python basics to NumPy, Pandas, visualisation and Tkinter desktop apps.',
  },
  {
    id: 'mca-java-web',
    subjectId: 'java-web',
    code: 'MCA103',
    title: 'Java and Web Programming',
    shortName: 'Java & Web',
    coordinator: 'Dr. Muruganantham A · Head (PG)',
    department: 'Dept. of Computer Science (PG)',
    credits: 4,
    schedule: 'Mon · Wed · 1:00 PM',
    room: 'Turing Hall 208',
    photo: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=900&q=60',
    accent: '#B3540A',
    tagline: 'OOP in Java, multithreading, and full-stack web: HTML, JS, Servlets and JSP.',
  },
  {
    id: 'mca-maths',
    subjectId: 'maths',
    code: 'MCA104',
    title: 'Mathematical Foundations for Computer Science',
    shortName: 'Maths (MFCS)',
    coordinator: 'Dr. M. Subramaniakumar · Professor (PG)',
    department: 'Dept. of Computer Science (PG)',
    credits: 4,
    schedule: 'Tue · Thu · 11:30 AM',
    room: 'Euler Pavilion 104',
    photo: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=60',
    accent: '#6E261A',
    tagline: 'Matrices, linear algebra, sets, probability and distributions — solved step by step.',
  },
  {
    id: 'mca-adbms',
    subjectId: 'adbms',
    code: 'MCA105',
    title: 'Advanced Database Management Systems',
    shortName: 'ADBMS',
    coordinator: 'Dr. S. Satheesh Kumar · Professor (PG)',
    department: 'Dept. of Computer Science (PG)',
    credits: 4,
    schedule: 'Fri · 2:00 PM · Lab Sat 10:00 AM',
    room: 'Data Lab 1',
    photo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=60',
    accent: '#4A3A8A',
    tagline: 'Relational design, SQL, normalisation to 5NF/BCNF and transaction management.',
  },
];

export function getMcaCourseTopicCount(subjectId: string): number {
  return topicCount(subjectId);
}
