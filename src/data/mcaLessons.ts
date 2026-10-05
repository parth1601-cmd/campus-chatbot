/**
 * Deterministic MCA Semester-I lesson bank.
 *
 * Guarantees every in-syllabus "teach / explain / what is" question gets a
 * REAL exam-oriented answer even when no live AI provider is reachable —
 * never a placeholder scaffold. Lessons follow Beginner Teaching Mode:
 * Simple Definition → Analogy → Technical Definition → Example →
 * Step-by-Step → Exam Point → Quick Check.
 *
 * Pure module — safe for Vite client + tsx server.
 */

export interface McaLessonDef {
  /** Lowercase match phrases: topic names, aliases, acronyms, common typos. */
  keys: string[];
  title: string;
  body: string;
}

const BANK: McaLessonDef[] = [
  {
    keys: ['big-o', 'big o', 'big-ω', 'big-θ', 'asymptotic', 'efficiency class', 'time complexity', 'space complexity', 'best case', 'worst case', 'average case'],
    title: 'Asymptotic Notations (Big-O, Ω, Θ)',
    body: `### Step 1 — Simple Definition
**Asymptotic notation** describes how an algorithm's time or memory grows as input size n grows — ignoring machine speed and constants.

### Step 2 — Real-Life Analogy
Like describing travel cost by distance: a taxi fare grows with kilometres (linear), while hiring one bus for any group size is flat. Big-O names the *shape* of that growth.

### Step 3 — Technical Definition (exam lines)
- **Big-O O(g(n))**: upper bound — f(n) grows *at most* like g(n) (worst case).
- **Big-Ω Ω(g(n))**: lower bound — f(n) grows *at least* like g(n) (best case).
- **Big-Θ Θ(g(n))**: tight bound — same order above and below (average case).
- Basic efficiency classes: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ).

### Step 4 — Example
Linear search over n items: best Ω(1) (first item matches), worst O(n) (scan all), average Θ(n).

### Step 5 — Step-by-Step (find complexity of a loop)
1. Count primitive operations inside the loop as a function of n.
2. Drop constants and lower-order terms (3n² + 5n → n²).
3. Name the class: single loop → O(n); nested loops → O(n²); halving each step → O(log n).

| Algorithm | Best | Average | Worst |
|---|---|---|---|
| Linear Search | O(1) | O(n) | O(n) |
| Binary Search | O(1) | O(log n) | O(log n) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) |

### Step 6 — Exam Point
- **2 marks:** define O/Ω/Θ in one line each + growth order.
- **5 marks:** + best/average/worst distinction with linear vs binary search example.
- **10 marks:** + loop analysis steps, comparison table, space complexity note.

### Step 7 — Quick Check
1. What does O(n²) tell you that exact seconds cannot?
2. When is binary search O(1), and when O(log n)?
3. Why do we drop constants like the 3 in 3n²?

Reply with answers for marking. Say "next" for Linked Lists, or "I don't understand" for a simpler re-explain.`,
  },
  {
    keys: ['binary search tree', 'bst'],
    title: 'Binary Search Tree (BST)',
    body: `### Step 1 — Simple Definition
**BST** is a binary tree with one golden rule: everything left of a node is smaller, everything right is bigger.

### Step 2 — Real-Life Analogy
A dictionary: to find "mango" you open the middle — earlier words go left, later words go right — discarding half the book each time.

### Step 3 — Technical Definition (exam lines)
A Binary Search Tree is a binary tree where for every node, all left-subtree keys < node key < all right-subtree keys. Search/insert/delete cost O(h): O(log n) when balanced, O(n) when skewed. Duplicate handling and the ordering invariant are favourite exam traps.

### Step 4 — Example
Insert 10, 5, 15, 3: 10 root; 5 left; 15 right; 3 left of 5. Inorder traversal gives 3, 5, 10, 15 — always sorted.

### Step 5 — Step-by-Step (search for 3)
1. Start at root 10: 3 < 10 → go left.
2. At 5: 3 < 5 → go left. 3. At 3: match → found.
Delete rule: leaf → remove; one child → splice child up; two children → replace with in-order successor (minimum of right subtree), then delete the successor.

### Step 6 — Exam Point
- **2 marks:** ordering rule + tiny diagram.
- **5 marks:** + insert/search steps with complexity.
- **10 marks:** + deletion cases (successor logic), skewed-tree worst case, BST vs AVL.

### Step 7 — Quick Check
1. State the BST ordering rule in one sentence.
2. Why is inorder traversal of a BST always sorted?
3. Which deletion case needs the in-order successor?

Reply with answers for marking. Say "next" for AVL trees.`,
  },
  {
    keys: ['avl', 'rotation', 'll rotation', 'rr rotation', 'lr rotation', 'rl rotation', 'balanced tree', 'balance factor'],
    title: 'AVL Trees and Rotations',
    body: `### Step 1 — Simple Definition
**AVL tree** is a BST that auto-balances itself so it never becomes a slow chain.

### Step 2 — Real-Life Analogy
Like a librarian who re-shelves books whenever one shelf gets too tall — small local rearrangements (rotations) keep every shelf reachable in a few steps.

### Step 3 — Technical Definition (exam lines)
An AVL tree is a height-balanced BST where every node's **balance factor = height(left) − height(right)** stays in {−1, 0, +1}. Violation after insert/delete is repaired by rotations: **LL → single right; RR → single left; LR → left then right; RL → right then left**. All operations stay O(log n).

### Step 4 — Example
Insert 10, 20, 30: chain leans right (RR case at 10) → single **left** rotation → 20 becomes root with 10 left, 30 right.

### Step 5 — Step-by-Step (choose the rotation)
1. Find the lowest unbalanced node. 2. Look at the heavy side, then the heavy side of its child.
3. Same direction twice (LL/RR) → one single rotation; zig-zag (LR/RL) → double rotation.
4. Recompute heights upward.

### Step 6 — Exam Point
- **2 marks:** balance-factor definition + allowed values.
- **5 marks:** + the four cases with one diagram each.
- **10 marks:** + full insertion trace with rotations, complexity proof sketch, AVL vs Red-Black one-liner.

### Step 7 — Quick Check
1. What are the three legal balance factors?
2. LL imbalance needs which single rotation?
3. Why does LR need two rotations instead of one?

Reply with answers for marking. Say "next" for Graphs and BFS/DFS.`,
  },
  {
    keys: ['bfs', 'breadth first', 'dfs', 'depth first', 'graph traversal', 'adjacency matrix', 'adjacency list', 'types of graphs'],
    title: 'Graphs, BFS and DFS',
    body: `### Step 1 — Simple Definition
**BFS** visits a graph level by level (nearest first); **DFS** dives deep down one path before backtracking.

### Step 2 — Real-Life Analogy
BFS is ripples spreading from a stone dropped in water — ring by ring. DFS is exploring a maze by always walking forward until a dead end, then backtracking.

### Step 3 — Technical Definition (exam lines)
Graph = vertices + edges (directed/undirected, weighted/unweighted), stored as **adjacency matrix** (V×V, O(1) edge check, O(V²) space) or **adjacency list** (O(V+E) space, best for sparse graphs). **BFS** uses a **queue**: O(V+E). **DFS** uses a **stack/recursion**: O(V+E).

### Step 4 — Example
Graph: A connected to B, C; B to D. BFS from A: A → B, C → D. DFS from A: A → B → D → backtrack → C.

### Step 5 — Step-by-Step (BFS)
1. Enqueue start, mark visited. 2. Dequeue v, visit it. 3. Enqueue all unvisited neighbours. 4. Repeat until empty. DFS swaps the queue for a stack (or recursion).

### Step 6 — Exam Point
- **2 marks:** BFS = queue/level order; DFS = stack/depth order.
- **5 marks:** + one trace each on the same graph + matrix vs list table.
- **10 marks:** + complexities, applications (BFS: shortest path unweighted; DFS: cycle detection, topological sort).

### Step 7 — Quick Check
1. Which data structure does BFS need, and which does DFS need?
2. Matrix or list — which suits a sparse graph?
3. Name one application unique to each traversal.

Reply with answers for marking. Say "next" for Sorting algorithms.`,
  },
  {
    keys: ['merge sort', 'divide and conquer'],
    title: 'Merge Sort (Divide and Conquer)',
    body: `### Step 1 — Simple Definition
**Merge Sort** splits the array in half again and again, then merges the sorted halves back together.

### Step 2 — Real-Life Analogy
Sorting exam papers by roll number: split the pile between two friends, each sorts their half the same way, then zip the two sorted piles together.

### Step 3 — Technical Definition (exam lines)
Divide-and-conquer algorithm: **divide** array into halves, **conquer** by recursively sorting each half, **combine** by linear merge. Always Θ(n log n) time (best = average = worst), O(n) extra space, **stable**.

### Step 4 — Example
[38, 27, 43, 3] → split [38,27],[43,3] → [27,38],[3,43] → merge → [3,27,38,43].

### Step 5 — Step-by-Step (merge of [27,38] and [3,43])
1. Compare heads 27 vs 3 → take 3. 2. 27 vs 43 → take 27. 3. 38 vs 43 → take 38. 4. Copy rest → 43. Recurrence T(n) = 2T(n/2) + n → O(n log n).

### Step 6 — Exam Point
- **2 marks:** divide-conquer-combine one-liner + complexity.
- **5 marks:** + trace on 4–8 elements + recurrence.
- **10 marks:** + pseudocode, stability proof idea, Merge vs Quick table.

### Step 7 — Quick Check
1. Why is merge sort always n log n, even on sorted input?
2. What does "stable" mean, and is merge sort stable?
3. Where does the O(n) extra space go?

Reply with answers for marking. Say "next" for Quick Sort.`,
  },
  {
    keys: ['quick sort'],
    title: 'Quick Sort',
    body: `### Step 1 — Simple Definition
**Quick Sort** picks one element (pivot), throws smaller items left and bigger items right, then repeats on each side.

### Step 2 — Real-Life Analogy
Arranging students by height around one chosen student: shorter ones step left, taller ones step right — then repeat inside each group.

### Step 3 — Technical Definition (exam lines)
Divide-and-conquer with **partitioning**: average/best O(n log n), worst O(n²) when the pivot repeatedly gives the most unbalanced split (e.g. sorted input with first-element pivot). O(log n) stack space, **in-place**, **not stable**.

### Step 4 — Example
[7, 2, 1, 6] pivot 7 (last): partition → [2,1,6,7] → recurse left [2,1,6] → sorted [1,2,6,7].

### Step 5 — Step-by-Step (Lomuto partition, pivot = last)
1. i marks the smaller-region boundary. 2. Scan j: if a[j] ≤ pivot, swap into region. 3. Finally swap pivot into place. 4. Recurse left and right of pivot.

### Step 6 — Exam Point
- **2 marks:** pivot + partition idea + average complexity.
- **5 marks:** + one partition trace + when worst case strikes.
- **10 marks:** + Merge vs Quick table (stability, space, worst case), pivot-choice fixes (random/median-of-three).

### Step 7 — Quick Check
1. Why does sorted input hurt first-element-pivot quicksort?
2. Is quick sort stable? Why does it matter?
3. Where does quick sort beat merge sort in practice?

Reply with answers for marking. Say "next" for Heap Sort.`,
  },
  {
    keys: ['heap sort', 'heap', 'insertion sort', 'decrease and conquer', 'sequential search', 'linear search', 'binary search'],
    title: 'Heaps, Heap Sort, Insertion Sort and Searching',
    body: `### Step 1 — Simple Definition
A **heap** is a complete binary tree where every parent beats its children (max-heap: parent biggest). **Heap sort** repeatedly takes the top. **Insertion sort** builds the sorted part one card at a time.

### Step 2 — Real-Life Analogy
Heap = tournament bracket where the champion always sits on top; heap sort = crowning the champion, removing them, and replaying the final. Insertion sort = sorting playing cards in your hand.

### Step 3 — Technical Definition (exam lines)
- **Heap**: complete tree + heap property; insert/extract-max O(log n) via sift up/down.
- **Heap sort**: build-heap O(n) + n extractions → O(n log n) all cases, O(1) space, not stable.
- **Insertion sort** (decrease and conquer): O(n) best (sorted input), O(n²) average/worst, stable, excellent for tiny/nearly-sorted arrays.
- **Linear search** O(n), needs nothing; **binary search** O(log n), needs sorted array.

### Step 4 — Example
Max-heap [9,5,7]: extract 9 → move 7 up, sift → heap [7,5] → sorted tail grows [9]. Insertion of 3 into [1,2,4,5]: shift 4,5 right → [1,2,3,4,5].

### Step 5 — Step-by-Step (heap sort)
1. Heapify array into max-heap. 2. Swap root with last element (largest fixed). 3. Sift new root down. 4. Repeat on shrinking heap.

### Step 6 — Exam Point
- **2 marks:** heap property + one complexity each.
- **5 marks:** + heap-sort or insertion trace.
- **10 marks:** + linear vs binary search table, when insertion beats n log n sorts, stability column.

### Step 7 — Quick Check
1. What two properties make a heap?
2. Why is insertion sort O(n) on sorted input?
3. Binary search needs what precondition?

Reply with answers for marking. Say "next" for Greedy algorithms.`,
  },
  {
    keys: ["dijkstra", "kruskal", "prim", "greedy", "minimum spanning tree", "shortest path"],
    title: 'Greedy Techniques (Dijkstra, Kruskal, Prim)',
    body: `### Step 1 — Simple Definition
**Greedy** means always grabbing the currently cheapest safe option — and for these three problems, that gamble always pays off.

### Step 2 — Real-Life Analogy
Building a railway network station by station, always laying the cheapest track that connects a new station without forming a loop — the final network is the cheapest possible.

### Step 3 — Technical Definition (exam lines)
- **Dijkstra**: shortest paths from one source; needs **non-negative weights**; O((V+E) log V) with a heap. Greedy choice: finalise the nearest unsettled vertex.
- **Kruskal**: MST by sorting all edges and adding the cheapest that avoids a cycle (union-find); O(E log E).
- **Prim**: MST by growing one tree, always attaching the cheapest frontier edge; O((V+E) log V).
MST = cheapest set of edges connecting all vertices (V−1 edges, no cycles).

### Step 4 — Example
Triangle A-B(1), B-C(2), A-C(4). Kruskal picks 1, 2, skips 4 (cycle) → MST cost 3. Dijkstra from A: A=0, B=1, C=min(4, 1+2)=3.

### Step 5 — Step-by-Step (Dijkstra)
1. dist[source]=0, rest ∞; unsettled = all. 2. Pick unsettled vertex with smallest dist, finalise it. 3. Relax its edges (better path? update). 4. Repeat. Fails with negative weights because finalised vertices could still improve.

### Step 6 — Exam Point
- **2 marks:** greedy idea + Dijkstra's non-negative requirement.
- **5 marks:** + one trace each (Dijkstra table, Kruskal edge order).
- **10 marks:** + Kruskal vs Prim table, MST cut-property idea, why greedy works here but not for 0/1 knapsack.

### Step 7 — Quick Check
1. Why does Dijkstra break on negative weights?
2. How does Kruskal detect a cycle cheaply?
3. Dijkstra vs Prim — what is each optimising?

Reply with answers for marking. Say "next" for Dynamic Programming.`,
  },
  {
    keys: ["warshall", "floyd", "transitive closure", "all-pairs"],
    title: "Warshall's and Floyd's Algorithms",
    body: `### Step 1 — Simple Definition
**Warshall** answers "can I reach j from i?" for every pair; **Floyd** answers "what is the cheapest route from i to j?" for every pair.

### Step 2 — Real-Life Analogy
Warshall is a flight-connectivity chart (direct or via stops: yes/no). Floyd is the same chart with the cheapest fare filled in.

### Step 3 — Technical Definition (exam lines)
Both are DP over intermediate vertices k = 1..n, Θ(n³) time, Θ(n²) space:
- **Warshall** (transitive closure): R(k)[i][j] = R(k−1)[i][j] OR (R(k−1)[i][k] AND R(k−1)[k][j]).
- **Floyd** (all-pairs shortest paths): D(k)[i][j] = min(D(k−1)[i][j], D(k−1)[i][k] + D(k−1)[k][j]). Handles negative edges (not negative cycles).

### Step 4 — Example
A→B (3), B→C (2), A→C (10). Warshall: A reaches C (directly and via B). Floyd: cheapest A→C = 3+2 = 5 via B, not 10.

### Step 5 — Step-by-Step
1. Build n×n matrix M (0/∞ or edge weights; diagonal 0). 2. For each k, for each i, for each j: improve via k. 3. Read answers after k = n. In-place update is safe because row/column k are frozen during round k.

### Step 6 — Exam Point
- **2 marks:** what each computes + recurrence.
- **5 marks:** + 3-node trace + complexity.
- **10 marks:** + transform-and-conquer framing, Warshall vs Floyd vs Dijkstra-from-each-vertex, negative-cycle detection via negative diagonal.

### Step 7 — Quick Check
1. What question does Warshall answer that Floyd does not?
2. Why is the k-loop outermost?
3. How do you spot a negative cycle in Floyd's output?

Reply with answers for marking. Say "next" for Knapsack and DP.`,
  },
  {
    keys: ['knapsack', 'dynamic programming', 'tsp', 'travelling salesman', 'traveling salesman', 'optimal substructure', 'overlapping subproblem', 'pre-sorting', 'transform and conquer'],
    title: 'Dynamic Programming and the Knapsack Problem',
    body: `### Step 1 — Simple Definition
**Dynamic Programming** solves a big problem by solving each small subproblem once, storing the answer in a table, and reusing it.

### Step 2 — Real-Life Analogy
Packing a school bag with a weight limit: each item has value vs weight — you consult a notebook where you already recorded the best packing for every smaller limit instead of repacking from scratch.

### Step 3 — Technical Definition (exam lines)
DP needs **optimal substructure** (optimal solution built from optimal subsolutions) + **overlapping subproblems** (same subsolution needed many times). **0/1 Knapsack**: n items, capacity W, each taken at most once → table dp[i][w] = max(dp[i−1][w], dp[i−1][w−wi] + vi); O(nW) time/space. **TSP** DP (Held–Karp): O(n²·2ⁿ) — exact but exponential.

### Step 4 — Example
Capacity 5; A(w2,v3), B(w3,v4), C(w4,v5). Table gives best = A+B (weight 5, value 7) — greedy by ratio would wrongly prefer single items here.

### Step 5 — Step-by-Step (knapsack table)
1. Rows = items considered, columns = capacities 0..W. 2. Cell = max(skip item, take item if it fits). 3. Answer at bottom-right; backtrack arrows to list chosen items.

### Step 6 — Exam Point
- **2 marks:** the two DP preconditions + knapsack recurrence.
- **5 marks:** + small table trace.
- **10 marks:** + greedy vs DP (fractional vs 0/1 knapsack), memoisation vs tabulation, TSP statement + why it is hard.

### Step 7 — Quick Check
1. What breaks if subproblems do not overlap?
2. Why does greedy fail on 0/1 but work on fractional knapsack?
3. What does dp[i][w] mean in words?

Reply with answers for marking. Say "next" for Backtracking.`,
  },
  {
    keys: ['backtracking', 'n-queen', 'n queen', 'hamiltonian', 'subset sum', 'branch and bound', 'assignment problem'],
    title: 'Backtracking, Branch and Bound (N-Queens, Hamiltonian, Subset Sum)',
    body: `### Step 1 — Simple Definition
**Backtracking** tries possibilities one by one and undoes (backtracks) the moment a partial solution breaks a rule.

### Step 2 — Real-Life Analogy
Solving a Sudoku: pencil in a digit, continue — the instant a row/column/box conflicts, erase back to the last guess and try the next digit.

### Step 3 — Technical Definition (exam lines)
Backtracking = DFS over a **state-space tree** with **bounding/pruning** (abandon dead branches early). **N-Queens**: place queens so none share row/column/diagonal (4-queens has 2 solutions). **Hamiltonian circuit**: a cycle visiting every vertex once. **Subset sum**: subset hitting exact target. **Branch and bound** adds cost bounds to prune optimisation searches (e.g. assignment problem: one task per agent, minimum cost).

### Step 4 — Example
4-queens: Q1 at (1,2) → Q2 at (2,4) → Q3 has no safe square → backtrack Q2 to (2,1)? conflict → backtrack Q1 to (1,3)… solutions: (2,4,1,3) and (3,1,4,2).

### Step 5 — Step-by-Step (generic backtrack)
1. Choose next slot/variable. 2. Try each candidate passing the constraints. 3. Recurse. 4. On failure, undo and try next candidate. Prune with forward checks (attacked squares, over-budget sums).

### Step 6 — Exam Point
- **2 marks:** backtracking idea + state-space tree one-liner.
- **5 marks:** + 4-queens trace or subset-sum trace.
- **10 marks:** + Hamiltonian statement, branch and bound vs plain backtracking, complexity honesty (exponential worst case, pruning saves practice).

### Step 7 — Quick Check
1. What is pruned in a state-space tree?
2. Why must queens avoid diagonals, not just rows/columns?
3. Backtracking vs branch and bound — what extra does the bound give?

Reply with answers for marking. Say "next" for Python collections.`,
  },
];

export function findMcaLesson(query: string, matchedTopics: string[]): McaLessonDef | null {
  const q = query.toLowerCase();
  const qFlat = q.replace(/[^a-z0-9]/g, '');
  let best: McaLessonDef | null = null;
  let bestScore = 0;
  for (const lesson of BANK) {
    let score = 0;
    for (const key of lesson.keys) {
      if (q.includes(key)) {
        score += key.length * 2;
      } else {
        const kFlat = key.replace(/[^a-z0-9]/g, '');
        if (kFlat.length >= 4 && qFlat.includes(kFlat)) score += kFlat.length;
      }
    }
    // Small boost if a matched syllabus topic names this lesson's title words.
    const titleWords = lesson.title.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 4);
    for (const t of matchedTopics) {
      const tl = t.toLowerCase();
      const hits = titleWords.filter((w) => tl.includes(w)).length;
      if (hits > 0) score += hits * 3;
    }
    if (score > bestScore) {
      bestScore = score;
      best = lesson;
    }
  }
  if (!best || bestScore < 4) return null;
  return best;
}
