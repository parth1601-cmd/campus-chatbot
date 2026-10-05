/**
 * Unified PG Programmes catalogue — MCA + M.Sc Data Science + M.Sc Cyber Security.
 *
 * - MCA Semester-I units/topics are the OFFICIAL assessment syllabus
 *   (single source of truth lives in mcaSyllabus.ts).
 * - M.Sc DS / M.Sc Cyber outlines are INDICATIVE Semester-I structure
 *   derived from the Institute of Technology programme highlights +
 *   standard PG curriculum. They are clearly flagged `indicative: true`
 *   so the UI + chatbot never present them as the official syllabus.
 *
 * Pure module — safe for Vite client + tsx server.
 */
import {
  MCA_COURSE_CARDS,
  getMcaCourseUnits,
  getMcaCourseTopicCount,
  type McaUnit,
} from './mcaSyllabus';

export type PgProgramId = 'mca' | 'msc-ds' | 'msc-cyber';

export interface PgProgram {
  id: PgProgramId;
  code: string;
  name: string;
  shortName: string;
  duration: string;
  feePerYear: string;
  tagline: string;
  accent: string;
  semesters: number;
  totalCredits: number;
  eligibilityShort: string;
}

export interface PgCourseCard {
  id: string;
  programId: PgProgramId;
  semester: number;
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
  category: 'Core' | 'Lab' | 'Foundation' | 'Elective';
  tags: string[];
  /** true = indicative outline, confirm with PG Dept. false = official syllabus. */
  indicative: boolean;
  units: McaUnit[];
}

export const PG_PROGRAMS: PgProgram[] = [
  {
    id: 'mca',
    code: 'MCA',
    name: 'Master of Computer Applications',
    shortName: 'MCA',
    duration: '2 Years · Full-Time',
    feePerYear: '₹1,90,000/yr',
    tagline: 'Software engineering, algorithms, full-stack web & databases.',
    accent: '#1E3A8A',
    semesters: 4,
    totalCredits: 80,
    eligibilityShort: 'Any Bachelor’s (50%) + Maths at 10+2/UG. Bridge Maths if needed.',
  },
  {
    id: 'msc-ds',
    code: 'M.Sc. DS',
    name: 'M.Sc. Data Science',
    shortName: 'Data Science',
    duration: '2 Years · Full-Time',
    feePerYear: '₹1,40,000/yr',
    tagline: 'ML, deep learning, big data analytics & NLP on GPU labs.',
    accent: '#0E7C3A',
    semesters: 4,
    totalCredits: 80,
    eligibilityShort: 'B.Sc DS / CS / BCA / B.E./B.Tech / Maths-Stats-Physics (50%). Bridge CS if needed.',
  },
  {
    id: 'msc-cyber',
    code: 'M.Sc. CS',
    name: 'M.Sc. Cyber Security',
    shortName: 'Cyber Security',
    duration: '2 Years · Full-Time',
    feePerYear: '₹1,50,000/yr',
    tagline: 'Cryptography, pentesting, cloud security & digital forensics.',
    accent: '#9A3412',
    semesters: 4,
    totalCredits: 80,
    eligibilityShort: 'B.Sc CS/CA/IT or B.E./B.Tech with Maths + CS background (50%).',
  },
];

function mcaCard(
  id: string,
  programId: PgProgramId = 'mca',
): PgCourseCard {
  const base = MCA_COURSE_CARDS.find((c) => c.id === id);
  if (!base) throw new Error(`Unknown MCA card ${id}`);
  return {
    id: `pg-${base.id}`,
    programId,
    semester: 1,
    code: base.code,
    title: base.title,
    shortName: base.shortName,
    coordinator: base.coordinator,
    department: base.department,
    credits: base.credits,
    schedule: base.schedule,
    room: base.room,
    photo: base.photo,
    accent: base.accent,
    tagline: base.tagline,
    category: 'Core',
    tags: [base.shortName, base.code, ...base.title.split(' ').slice(0, 3)],
    indicative: false,
    units: getMcaCourseUnits(base.subjectId),
  };
}

const U = (unit: string, title: string, topics: string[]): McaUnit => ({ unit, title, topics });

export const PG_COURSE_CARDS: PgCourseCard[] = [
  // ---------------- MCA Semester-I (official) ----------------
  mcaCard('mca-dsa'),
  mcaCard('mca-python'),
  mcaCard('mca-java-web'),
  mcaCard('mca-maths'),
  mcaCard('mca-adbms'),

  // ---------------- M.Sc Data Science — Semester-I (indicative) ----------------
  {
    id: 'pg-mscds-101',
    programId: 'msc-ds',
    semester: 1,
    code: 'MSDS101',
    title: 'Statistical Foundations for Data Science',
    shortName: 'Statistics',
    coordinator: 'Dr. M. Subramaniakumar · Professor (PG)',
    department: 'Dept. of Computer Science (PG)',
    credits: 4,
    schedule: 'Mon · Wed · 9:00 AM',
    room: 'Euler Pavilion 102',
    photo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=60',
    accent: '#0E7C3A',
    tagline: 'Descriptive stats, probability, distributions, testing & Bayesian thinking.',
    category: 'Foundation',
    tags: ['Statistics', 'Probability', 'Distributions', 'Hypothesis Testing', 'R'],
    indicative: true,
    units: [
      U('Unit 1', 'Descriptive Statistics & EDA', ['Types of data & scales', 'Mean, median, mode, variance', 'Skewness & kurtosis', 'Outliers & five-number summary', 'Exploratory plots']),
      U('Unit 2', 'Probability Foundations', ['Sample space & axioms', 'Conditional probability', 'Bayes’ theorem', 'Random variables', 'Expectation & variance']),
      U('Unit 3', 'Core Distributions', ['Bernoulli & Binomial', 'Poisson & Exponential', 'Normal & log-normal', 't, Chi-square & F sampling', 'QQ plots & normality checks']),
      U('Unit 4', 'Estimation & Hypothesis Testing', ['Point & interval estimation', 'z-test, t-test, chi-square test', 'p-values & significance', 'Type I / Type II errors', 'ANOVA basics']),
      U('Unit 5', 'Correlation, Regression & Bayesian Intro', ['Covariance & correlation', 'Simple & multiple linear regression', 'Logistic regression idea', 'Bayes’ rule for inference', 'A/B testing case study']),
    ],
  },
  {
    id: 'pg-mscds-102',
    programId: 'msc-ds',
    semester: 1,
    code: 'MSDS102',
    title: 'Python for Data Science',
    shortName: 'Python DS',
    coordinator: 'Dr. Sheeja S · Professor (PG)',
    department: 'Dept. of Computer Science (PG)',
    credits: 4,
    schedule: 'Tue · Thu · 9:00 AM · Lab Fri',
    room: 'Turing Lab 2',
    photo: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=900&q=60',
    accent: '#0E7C3A',
    tagline: 'NumPy, Pandas, visualisation & end-to-end EDA pipelines.',
    category: 'Lab',
    tags: ['Python', 'NumPy', 'Pandas', 'EDA', 'Matplotlib'],
    indicative: true,
    units: [
      U('Unit 1', 'Python Refresher', ['Data types & control flow', 'Functions & modules', 'Lists, dicts, sets, comprehensions', 'File I/O & CSV handling', 'Virtual envs & notebooks']),
      U('Unit 2', 'NumPy Essentials', ['ndarray, indexing & slicing', 'Reshape, broadcast & vectorise', 'Aggregations & axis ops', 'Random sampling', 'Linear algebra helpers']),
      U('Unit 3', 'Pandas & Data Wrangling', ['Series & DataFrame', 'Import CSV/Excel', 'Cleaning & missing data', 'Filter, sort, groupby', 'Merges & pivots']),
      U('Unit 4', 'Visualisation', ['Matplotlib line/bar/scatter', 'Seaborn distributions & heatmaps', 'Styling & subplots', 'Plot for EDA decisions', 'Exporting figures']),
      U('Unit 5', 'EDA Mini-Project', ['Problem framing', 'Feature extraction', 'Pre-processing pipeline', 'Findings memo', 'Reproducible notebook']),
    ],
  },
  {
    id: 'pg-mscds-103',
    programId: 'msc-ds',
    semester: 1,
    code: 'MSDS103',
    title: 'Machine Learning Fundamentals',
    shortName: 'ML Basics',
    coordinator: 'Dr. S. Karthik · Professor (PG)',
    department: 'Dept. of Computer Science (PG)',
    credits: 4,
    schedule: 'Mon · Wed · 11:30 AM',
    room: 'AI Lab 1 · GPU Cluster',
    photo: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=900&q=60',
    accent: '#1E3A8A',
    tagline: 'Regression, classification, clustering & honest model evaluation.',
    category: 'Core',
    tags: ['Machine Learning', 'Regression', 'Classification', 'Clustering', 'Scikit-learn'],
    indicative: true,
    units: [
      U('Unit 1', 'ML Setup & Workflow', ['Supervised vs unsupervised', 'Train / validation / test splits', 'Features & labels', 'Baselines', 'Scikit-learn API']),
      U('Unit 2', 'Regression', ['Linear regression', 'Regularisation (Ridge/Lasso)', 'Metrics: MAE, RMSE, R²', 'Residual diagnosis', 'Case: house prices']),
      U('Unit 3', 'Classification', ['Logistic regression', 'k-NN & decision trees', 'Precision, recall, F1, ROC-AUC', 'Confusion matrix', 'Imbalanced data tactics']),
      U('Unit 4', 'Clustering & Dimensionality', ['k-means & hierarchical', 'Choosing k (elbow/silhouette)', 'PCA intuition', 't-SNE for visualisation', 'Case: customer segments']),
      U('Unit 5', 'Evaluation & Practice', ['Cross-validation', 'Overfitting vs underfitting', 'Hyperparameter search', 'Model cards', 'Mini-project & viva']),
    ],
  },
  {
    id: 'pg-mscds-104',
    programId: 'msc-ds',
    semester: 1,
    code: 'MSDS104',
    title: 'Big Data & Database Systems',
    shortName: 'Big Data',
    coordinator: 'Dr. S. Satheesh Kumar · Professor (PG)',
    department: 'Dept. of Computer Science (PG)',
    credits: 4,
    schedule: 'Thu · 11:30 AM · Lab Sat',
    room: 'Data Lab 1',
    photo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=60',
    accent: '#4A3A8A',
    tagline: 'SQL to NoSQL, warehousing, Hadoop & Spark at scale.',
    category: 'Core',
    tags: ['SQL', 'NoSQL', 'Hadoop', 'Spark', 'Data Warehouse'],
    indicative: true,
    units: [
      U('Unit 1', 'Relational Refresh', ['ER → tables & keys', 'SQL joins & aggregates', 'Views & constraints', 'Normalisation to 3NF', 'Indexing idea']),
      U('Unit 2', 'NoSQL & Warehousing', ['Document / key-value / column stores', 'Star & snowflake schema', 'ETL vs ELT', 'Partitioning', 'Case: analytics mart']),
      U('Unit 3', 'Hadoop Ecosystem', ['HDFS & MapReduce idea', 'YARN & cluster layout', 'HiveQL basics', 'Sqoop/Flume ingest', 'Lab: word count']),
      U('Unit 4', 'Spark Core', ['RDDs & DataFrames', 'Transformations vs actions', 'Spark SQL', 'Caching & shuffles', 'Lab: log analytics']),
      U('Unit 5', 'Pipelines & Governance', ['Batch vs streaming', 'Data quality checks', 'Lineage & catalog', 'Privacy basics', 'Project: pipeline demo']),
    ],
  },
  {
    id: 'pg-mscds-105',
    programId: 'msc-ds',
    semester: 1,
    code: 'MSDS105',
    title: 'Data Visualisation & Storytelling',
    shortName: 'Visualisation',
    coordinator: 'Ms. B.R. Laxmi Sree · Trainer (ML) · Practice',
    department: 'Dept. of Computer Science (PG)',
    credits: 4,
    schedule: 'Fri · 2:00 PM',
    room: 'Media Lab · Chronicle House',
    photo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=60',
    accent: '#B3540A',
    tagline: 'Dashboards, visual grammar & presenting insights clearly.',
    category: 'Lab',
    tags: ['Visualisation', 'Dashboards', 'Storytelling', 'Seaborn', 'Power BI'],
    indicative: true,
    units: [
      U('Unit 1', 'Visual Grammar', ['Chart types & when to use', 'Colour & accessibility', 'Scales & axes honesty', 'Common misleading visuals', 'Critique exercise']),
      U('Unit 2', 'Python Dashboards', ['Multi-panel figures', 'Interactive widgets idea', 'Plotly/Streamlit intro', 'Layout & annotations', 'Lab: EDA dashboard']),
      U('Unit 3', 'BI Tools', ['Power BI / Tableau tour', 'Connecting data', 'Filters & slicers', 'Calculated fields', 'Publishing & sharing']),
      U('Unit 4', 'Storytelling', ['Narrative arc for data', 'Executive one-pagers', 'Insight → action framing', 'Presentation drills', 'Peer review']),
      U('Unit 5', 'Portfolio Project', ['Brief → dataset → story', 'Dashboard + 5-slide deck', 'Documentation', 'Showcase', 'Viva']),
    ],
  },

  // ---------------- M.Sc Cyber Security — Semester-I (indicative) ----------------
  {
    id: 'pg-msccs-101',
    programId: 'msc-cyber',
    semester: 1,
    code: 'MSCS101',
    title: 'Foundations of Cyber Security & Cryptography',
    shortName: 'Crypto Basics',
    coordinator: 'Dr. S. Satheesh Kumar · Professor (PG)',
    department: 'Dept. of Computer Science (PG)',
    credits: 4,
    schedule: 'Mon · Wed · 9:00 AM',
    room: 'Cyber Range Lab',
    photo: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=900&q=60',
    accent: '#9A3412',
    tagline: 'CIA triad, threat models, classical + modern ciphers.',
    category: 'Foundation',
    tags: ['CIA Triad', 'Cryptography', 'AES', 'RSA', 'Hashing'],
    indicative: true,
    units: [
      U('Unit 1', 'Security Mindset', ['CIA triad & AAA', 'Threats, vulns & risk', 'Attack lifecycle', 'Security policies', 'Case: campus phishing']),
      U('Unit 2', 'Classical Ciphers', ['Caesar, Vigenère, transposition', 'Frequency analysis', 'One-time pad idea', 'Steganography intro', 'Lab: break Caesar']),
      U('Unit 3', 'Symmetric Crypto', ['Block vs stream ciphers', 'DES → AES intuition', 'Modes (ECB/CBC/GCM)', 'Key management', 'Lab: AES encrypt/decrypt']),
      U('Unit 4', 'Asymmetric Crypto & Hashing', ['RSA & Diffie-Hellman idea', 'Digital signatures', 'SHA & integrity', 'Certificates & PKI', 'Lab: sign & verify']),
      U('Unit 5', 'Crypto in Practice', ['TLS handshake tour', 'Password hashing (bcrypt)', 'Common pitfalls', 'Compliance note (IT Act)', 'Quiz + demo']),
    ],
  },
  {
    id: 'pg-msccs-102',
    programId: 'msc-cyber',
    semester: 1,
    code: 'MSCS102',
    title: 'Computer Networks & Security Protocols',
    shortName: 'Secure Networks',
    coordinator: 'Dr. Sheeja S · Professor (PG)',
    department: 'Dept. of Computer Science (PG)',
    credits: 4,
    schedule: 'Tue · Thu · 9:00 AM',
    room: 'Networks Lab · Turing Block',
    photo: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=60',
    accent: '#1E3A8A',
    tagline: 'TCP/IP, firewalls, VPNs, IDS/IPS & secure Wi-Fi.',
    category: 'Core',
    tags: ['TCP/IP', 'Firewalls', 'VPN', 'IDS', 'Wireshark'],
    indicative: true,
    units: [
      U('Unit 1', 'Network Refresh', ['OSI vs TCP/IP', 'IP, subnetting & routing', 'TCP vs UDP', 'DNS & DHCP', 'Lab: packet capture']),
      U('Unit 2', 'LAN & Wi-Fi Security', ['VLANs & segmentation', 'WPA2/WPA3 & 802.1X', 'Rogue AP detection', 'Campus Wi-Fi case (KJIT-Secure)', 'Lab: secure setup']),
      U('Unit 3', 'Perimeter Defence', ['Firewalls & ACLs', 'NAT & DMZ', 'VPNs (IPsec/SSL)', 'Proxies', 'Lab: rule design']),
      U('Unit 4', 'Detection & Monitoring', ['IDS vs IPS', 'Snort/Suricata tour', 'SIEM & log basics', 'Alert triage', 'Lab: detect scan']),
      U('Unit 5', 'Secure Protocols', ['HTTPS/TLS', 'SSH & hardening', 'Email security (SPF/DKIM)', 'Zero-trust idea', 'Design review']),
    ],
  },
  {
    id: 'pg-msccs-103',
    programId: 'msc-cyber',
    semester: 1,
    code: 'MSCS103',
    title: 'Operating Systems & System Security',
    shortName: 'System Security',
    coordinator: 'Dr. S. Karthik · Professor (PG)',
    department: 'Dept. of Computer Science (PG)',
    credits: 4,
    schedule: 'Mon · Wed · 1:00 PM',
    room: 'Turing Hall 208',
    photo: 'https://images.unsplash.com/photo-1629654297299-c6c22c98c540?auto=format&fit=crop&w=900&q=60',
    accent: '#4A3A8A',
    tagline: 'Linux hardening, access control, malware & patching.',
    category: 'Core',
    tags: ['Linux', 'Hardening', 'Access Control', 'Malware', 'Forensics Intro'],
    indicative: true,
    units: [
      U('Unit 1', 'OS Security Basics', ['Processes & privileges', 'Users, groups & sudo', 'Permissions & ACLs', 'Logging & auditd', 'Lab: harden VM']),
      U('Unit 2', 'Linux Hardening', ['SSH hardening', 'Firewall (ufw/nftables)', 'Updates & patching', 'Remove unused services', 'CIS checklist tour']),
      U('Unit 3', 'Access Control Models', ['DAC vs MAC vs RBAC', 'SELinux/AppArmor idea', 'Least privilege', 'Sudo policy design', 'Case review']),
      U('Unit 4', 'Malware & Defence', ['Virus, worm, trojan, ransomware', 'Static vs dynamic analysis idea', 'Antimalware & EDR', 'Backups & recovery', 'Lab: hash & sandbox']),
      U('Unit 5', 'Incident Basics', ['Detection → containment', 'Evidence handling intro', 'Chain of custody', 'Report writing', 'Tabletop exercise']),
    ],
  },
  {
    id: 'pg-msccs-104',
    programId: 'msc-cyber',
    semester: 1,
    code: 'MSCS104',
    title: 'Ethical Hacking & Penetration Testing Essentials',
    shortName: 'Ethical Hacking',
    coordinator: 'Mr. Amal Thayyil · Professor of Practice (Akamai)',
    department: 'Dept. of Computer Science (PG)',
    credits: 4,
    schedule: 'Fri · 10:00 AM · Range Sat',
    room: 'Cyber Range Lab',
    photo: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=60',
    accent: '#6E261A',
    tagline: 'Legal hacking methodology: recon to reporting, in a safe range.',
    category: 'Lab',
    tags: ['Pentesting', 'Kali', 'OWASP', 'Burp', 'Report Writing'],
    indicative: true,
    units: [
      U('Unit 1', 'Legal & Method', ['Ethics & authorisation', 'PTES / OWASP testing guide', 'Scope & rules of engagement', 'Lab safety in cyber range', 'Report structure']),
      U('Unit 2', 'Recon & Scanning', ['OSINT basics', 'Nmap scans', 'Service enumeration', 'Vulnerability scanners', 'Lab: authorised scan']),
      U('Unit 3', 'Web Basics (OWASP Top 10 Tour)', ['Injection idea (SQLi)', 'XSS idea', 'Broken auth & access', 'Security misconfig', 'Lab: DVWA guided']),
      U('Unit 4', 'Exploitation Intro (Controlled)', ['Metasploit tour (authorised only)', 'Password attacks & defences', 'Privilege escalation idea', 'Pivoting concept', 'Lab: capture-the-flag lite']),
      U('Unit 5', 'Reporting & Remediation', ['Severity & CVSS idea', 'Evidence screenshots', 'Fix recommendations', 'Retest flow', 'Mock pentest report']),
    ],
  },
  {
    id: 'pg-msccs-105',
    programId: 'msc-cyber',
    semester: 1,
    code: 'MSCS105',
    title: 'Discrete Mathematics for Cryptography',
    shortName: 'Crypto Maths',
    coordinator: 'Dr. M. Subramaniakumar · Professor (PG)',
    department: 'Dept. of Computer Science (PG)',
    credits: 4,
    schedule: 'Tue · Thu · 11:30 AM',
    room: 'Euler Pavilion 104',
    photo: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=60',
    accent: '#6E261A',
    tagline: 'Number theory, modular arithmetic & logic behind crypto.',
    category: 'Foundation',
    tags: ['Number Theory', 'Modular Arithmetic', 'Logic', 'Probability', 'Proofs'],
    indicative: true,
    units: [
      U('Unit 1', 'Logic & Proofs', ['Propositions & quantifiers', 'Direct / contrapositive / induction', 'Sets & functions', 'Pigeonhole idea', 'Proof drills']),
      U('Unit 2', 'Number Theory I', ['Divisibility & primes', 'GCD & Euclid’s algorithm', 'Modular arithmetic', 'Fermat’s little theorem', 'Lab: fast mod-exp']),
      U('Unit 3', 'Number Theory II', ['Euler’s theorem & totient', 'Discrete log idea', 'Primality testing tour', 'Random numbers', 'RSA maths walkthrough']),
      U('Unit 4', 'Probability for Security', ['Counting & permutations', 'Conditional probability', 'Bayes for spam/phishing', 'Entropy intuition', 'Worked problems']),
      U('Unit 5', 'Algebraic Structures Tour', ['Groups, rings, fields (intuition)', 'Finite fields GF(p) idea', 'Elliptic-curve concept', 'Why maths matters for crypto', 'Revision + problem set']),
    ],
  },
];

export function getPgCourseUnits(course: PgCourseCard): McaUnit[] {
  return course.units;
}

export function getPgTopicCount(course: PgCourseCard): number {
  return course.units.reduce((n, u) => n + u.topics.length, 0);
}

export function getPgCoursesByProgram(programId: PgProgramId, semester = 1): PgCourseCard[] {
  return PG_COURSE_CARDS.filter((c) => c.programId === programId && c.semester === semester);
}

export interface PgSearchHit {
  course: PgCourseCard;
  matchedTopics: string[];
  score: number;
}

/** Intelligent in-page search across codes, titles, tags, units and topics. */
export function searchPgCourses(query: string, pool: PgCourseCard[]): PgSearchHit[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return pool.map((course) => ({ course, matchedTopics: [], score: 1 }));
  const words = q.split(/\s+/).filter((w) => w.length > 1);
  return pool
    .map((course) => {
      let score = 0;
      const matchedTopics: string[] = [];
      const hay = `${course.code} ${course.title} ${course.shortName} ${course.tags.join(' ')} ${course.coordinator}`.toLowerCase();
      for (const w of words) {
        if (course.code.toLowerCase().includes(w)) score += 6;
        if (course.title.toLowerCase().includes(w)) score += 5;
        if (course.shortName.toLowerCase().includes(w)) score += 4;
        if (hay.includes(w)) score += 2;
      }
      if (hay.includes(q)) score += 8;
      for (const u of course.units) {
        for (const t of u.topics) {
          if (t.toLowerCase().includes(q) || words.some((w) => w.length > 2 && t.toLowerCase().includes(w))) {
            if (matchedTopics.length < 3) matchedTopics.push(t);
            score += 3;
          }
        }
        if (u.title.toLowerCase().includes(q)) score += 4;
      }
      return { course, matchedTopics, score };
    })
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score);
}

/** Lightweight interest match — powers the “Recommended for you” badge. */
export function pgInterestScore(course: PgCourseCard, interests: string[]): number {
  if (!interests.length) return 0;
  const hay = `${course.title} ${course.tagline} ${course.tags.join(' ')} ${course.units.map((u) => u.title).join(' ')}`.toLowerCase();
  let s = 0;
  for (const raw of interests) {
    const interest = raw.toLowerCase();
    const keywords = interest.split(/[^a-z0-9+]+/).filter((w) => w.length > 2);
    for (const k of keywords) {
      if (hay.includes(k)) {
        s += k.length > 5 ? 3 : 2;
        break;
      }
    }
  }
  return s;
}

export function getMcaOfficialTopicCount(): number {
  return (['mca-dsa', 'mca-python', 'mca-java-web', 'mca-maths', 'mca-adbms'] as const).reduce(
    (n, id) => {
      const base = MCA_COURSE_CARDS.find((c) => c.id === id);
      return n + (base ? getMcaCourseTopicCount(base.subjectId) : 0);
    },
    0,
  );
}
