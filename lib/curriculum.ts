import type {
  AlgorithmCategory,
  AlgorithmicProblem,
  Curriculum,
  Difficulty,
  QuizItem,
  SystemDesignCategory,
  SystemDesignModule
} from "./types";

type ProblemSeed = {
  title: string;
  category: AlgorithmCategory;
  difficulty: Difficulty;
};

type SystemSeed = {
  title: string;
  category: SystemDesignCategory;
  signal: SystemDesignModule["senioritySignal"];
  minutes: number;
  focus: string;
};

export const algorithmCategoryOrder: AlgorithmCategory[] = [
  "Arrays & Hashing",
  "Two Pointers",
  "Sliding Window",
  "Stack",
  "Binary Search",
  "Linked List",
  "Trees",
  "Tries",
  "Heap / Priority Queue",
  "Backtracking",
  "Graphs",
  "Advanced Graphs",
  "1-D Dynamic Programming",
  "2-D Dynamic Programming",
  "Greedy",
  "Intervals",
  "Math & Geometry",
  "Bit Manipulation"
];

const patternTagsByCategory: Record<AlgorithmCategory, string[]> = {
  "Arrays & Hashing": ["frequency maps", "dedupe", "prefix products", "constant-time lookup"],
  "Two Pointers": ["converging pointers", "sorted constraints", "in-place scans", "area bounds"],
  "Sliding Window": ["contiguous ranges", "window validity", "left-bound repair", "deque maximums"],
  Stack: ["LIFO state", "monotonic stack", "expression evaluation", "deferred matching"],
  "Binary Search": ["ordered search", "answer space", "rotated arrays", "matrix projection"],
  "Linked List": ["pointer rewiring", "dummy node", "fast-slow scan", "cache ordering"],
  Trees: ["recursive DFS", "level BFS", "BST invariants", "path aggregation"],
  Tries: ["prefix tree", "wildcard lookup", "board pruning", "word terminal state"],
  "Heap / Priority Queue": ["top-k", "two heaps", "stream order", "scheduler priority"],
  Backtracking: ["decision tree", "choose-explore-unchoose", "pruning", "state restoration"],
  Graphs: ["grid DFS", "BFS frontier", "topological sort", "union find"],
  "Advanced Graphs": ["shortest path", "minimum spanning tree", "lexicographic traversal", "weighted edges"],
  "1-D Dynamic Programming": ["state transition", "memoization", "subsequence", "knapsack"],
  "2-D Dynamic Programming": ["grid state", "string alignment", "matrix paths", "interval DP"],
  Greedy: ["local choice", "range coverage", "exchange argument", "one-pass invariant"],
  Intervals: ["sort by boundary", "merge overlap", "sweep line", "room allocation"],
  "Math & Geometry": ["matrix transform", "numeric simulation", "coordinate map", "overflow control"],
  "Bit Manipulation": ["xor cancellation", "bit counting", "masking", "two's complement"]
};

const problemSeeds: ProblemSeed[] = [
  { title: "Contains Duplicate", category: "Arrays & Hashing", difficulty: "Easy" },
  { title: "Valid Anagram", category: "Arrays & Hashing", difficulty: "Easy" },
  { title: "Two Sum", category: "Arrays & Hashing", difficulty: "Easy" },
  { title: "Group Anagrams", category: "Arrays & Hashing", difficulty: "Medium" },
  { title: "Top K Frequent Elements", category: "Arrays & Hashing", difficulty: "Medium" },
  { title: "Product of Array Except Self", category: "Arrays & Hashing", difficulty: "Medium" },
  { title: "Valid Sudoku", category: "Arrays & Hashing", difficulty: "Medium" },
  { title: "Encode and Decode Strings", category: "Arrays & Hashing", difficulty: "Medium" },
  { title: "Longest Consecutive Sequence", category: "Arrays & Hashing", difficulty: "Medium" },
  { title: "Valid Palindrome", category: "Two Pointers", difficulty: "Easy" },
  { title: "Two Sum II Input Array Is Sorted", category: "Two Pointers", difficulty: "Medium" },
  { title: "3Sum", category: "Two Pointers", difficulty: "Medium" },
  { title: "Container With Most Water", category: "Two Pointers", difficulty: "Medium" },
  { title: "Trapping Rain Water", category: "Two Pointers", difficulty: "Hard" },
  { title: "Best Time to Buy and Sell Stock", category: "Sliding Window", difficulty: "Easy" },
  { title: "Longest Substring Without Repeating Characters", category: "Sliding Window", difficulty: "Medium" },
  { title: "Longest Repeating Character Replacement", category: "Sliding Window", difficulty: "Medium" },
  { title: "Permutation in String", category: "Sliding Window", difficulty: "Medium" },
  { title: "Minimum Window Substring", category: "Sliding Window", difficulty: "Hard" },
  { title: "Sliding Window Maximum", category: "Sliding Window", difficulty: "Hard" },
  { title: "Valid Parentheses", category: "Stack", difficulty: "Easy" },
  { title: "Min Stack", category: "Stack", difficulty: "Medium" },
  { title: "Evaluate Reverse Polish Notation", category: "Stack", difficulty: "Medium" },
  { title: "Generate Parentheses", category: "Stack", difficulty: "Medium" },
  { title: "Daily Temperatures", category: "Stack", difficulty: "Medium" },
  { title: "Car Fleet", category: "Stack", difficulty: "Medium" },
  { title: "Largest Rectangle in Histogram", category: "Stack", difficulty: "Hard" },
  { title: "Binary Search", category: "Binary Search", difficulty: "Easy" },
  { title: "Search a 2D Matrix", category: "Binary Search", difficulty: "Medium" },
  { title: "Koko Eating Bananas", category: "Binary Search", difficulty: "Medium" },
  { title: "Find Minimum in Rotated Sorted Array", category: "Binary Search", difficulty: "Medium" },
  { title: "Search in Rotated Sorted Array", category: "Binary Search", difficulty: "Medium" },
  { title: "Time Based Key Value Store", category: "Binary Search", difficulty: "Medium" },
  { title: "Median of Two Sorted Arrays", category: "Binary Search", difficulty: "Hard" },
  { title: "Reverse Linked List", category: "Linked List", difficulty: "Easy" },
  { title: "Merge Two Sorted Lists", category: "Linked List", difficulty: "Easy" },
  { title: "Reorder List", category: "Linked List", difficulty: "Medium" },
  { title: "Remove Nth Node From End of List", category: "Linked List", difficulty: "Medium" },
  { title: "Copy List With Random Pointer", category: "Linked List", difficulty: "Medium" },
  { title: "Add Two Numbers", category: "Linked List", difficulty: "Medium" },
  { title: "Linked List Cycle", category: "Linked List", difficulty: "Easy" },
  { title: "Find the Duplicate Number", category: "Linked List", difficulty: "Medium" },
  { title: "LRU Cache", category: "Linked List", difficulty: "Medium" },
  { title: "Merge K Sorted Lists", category: "Linked List", difficulty: "Hard" },
  { title: "Reverse Nodes in K-Group", category: "Linked List", difficulty: "Hard" },
  { title: "Invert Binary Tree", category: "Trees", difficulty: "Easy" },
  { title: "Maximum Depth of Binary Tree", category: "Trees", difficulty: "Easy" },
  { title: "Diameter of Binary Tree", category: "Trees", difficulty: "Easy" },
  { title: "Balanced Binary Tree", category: "Trees", difficulty: "Easy" },
  { title: "Same Tree", category: "Trees", difficulty: "Easy" },
  { title: "Subtree of Another Tree", category: "Trees", difficulty: "Easy" },
  { title: "Lowest Common Ancestor of a Binary Search Tree", category: "Trees", difficulty: "Medium" },
  { title: "Binary Tree Level Order Traversal", category: "Trees", difficulty: "Medium" },
  { title: "Binary Tree Right Side View", category: "Trees", difficulty: "Medium" },
  { title: "Count Good Nodes in Binary Tree", category: "Trees", difficulty: "Medium" },
  { title: "Validate Binary Search Tree", category: "Trees", difficulty: "Medium" },
  { title: "Kth Smallest Element in a BST", category: "Trees", difficulty: "Medium" },
  { title: "Construct Binary Tree from Preorder and Inorder Traversal", category: "Trees", difficulty: "Medium" },
  { title: "Binary Tree Maximum Path Sum", category: "Trees", difficulty: "Hard" },
  { title: "Serialize and Deserialize Binary Tree", category: "Trees", difficulty: "Hard" },
  { title: "Implement Trie Prefix Tree", category: "Tries", difficulty: "Medium" },
  { title: "Design Add and Search Words Data Structure", category: "Tries", difficulty: "Medium" },
  { title: "Word Search II", category: "Tries", difficulty: "Hard" },
  { title: "Kth Largest Element in a Stream", category: "Heap / Priority Queue", difficulty: "Easy" },
  { title: "Last Stone Weight", category: "Heap / Priority Queue", difficulty: "Easy" },
  { title: "K Closest Points to Origin", category: "Heap / Priority Queue", difficulty: "Medium" },
  { title: "Kth Largest Element in an Array", category: "Heap / Priority Queue", difficulty: "Medium" },
  { title: "Task Scheduler", category: "Heap / Priority Queue", difficulty: "Medium" },
  { title: "Design Twitter", category: "Heap / Priority Queue", difficulty: "Medium" },
  { title: "Find Median from Data Stream", category: "Heap / Priority Queue", difficulty: "Hard" },
  { title: "Subsets", category: "Backtracking", difficulty: "Medium" },
  { title: "Combination Sum", category: "Backtracking", difficulty: "Medium" },
  { title: "Permutations", category: "Backtracking", difficulty: "Medium" },
  { title: "Subsets II", category: "Backtracking", difficulty: "Medium" },
  { title: "Combination Sum II", category: "Backtracking", difficulty: "Medium" },
  { title: "Word Search", category: "Backtracking", difficulty: "Medium" },
  { title: "Palindrome Partitioning", category: "Backtracking", difficulty: "Medium" },
  { title: "Letter Combinations of a Phone Number", category: "Backtracking", difficulty: "Medium" },
  { title: "N-Queens", category: "Backtracking", difficulty: "Hard" },
  { title: "Number of Islands", category: "Graphs", difficulty: "Medium" },
  { title: "Clone Graph", category: "Graphs", difficulty: "Medium" },
  { title: "Max Area of Island", category: "Graphs", difficulty: "Medium" },
  { title: "Pacific Atlantic Water Flow", category: "Graphs", difficulty: "Medium" },
  { title: "Surrounded Regions", category: "Graphs", difficulty: "Medium" },
  { title: "Rotting Oranges", category: "Graphs", difficulty: "Medium" },
  { title: "Walls and Gates", category: "Graphs", difficulty: "Medium" },
  { title: "Course Schedule", category: "Graphs", difficulty: "Medium" },
  { title: "Course Schedule II", category: "Graphs", difficulty: "Medium" },
  { title: "Redundant Connection", category: "Graphs", difficulty: "Medium" },
  { title: "Number of Connected Components in an Undirected Graph", category: "Graphs", difficulty: "Medium" },
  { title: "Graph Valid Tree", category: "Graphs", difficulty: "Medium" },
  { title: "Word Ladder", category: "Graphs", difficulty: "Hard" },
  { title: "Reconstruct Itinerary", category: "Advanced Graphs", difficulty: "Hard" },
  { title: "Min Cost to Connect All Points", category: "Advanced Graphs", difficulty: "Medium" },
  { title: "Network Delay Time", category: "Advanced Graphs", difficulty: "Medium" },
  { title: "Swim in Rising Water", category: "Advanced Graphs", difficulty: "Hard" },
  { title: "Alien Dictionary", category: "Advanced Graphs", difficulty: "Hard" },
  { title: "Cheapest Flights Within K Stops", category: "Advanced Graphs", difficulty: "Medium" },
  { title: "Climbing Stairs", category: "1-D Dynamic Programming", difficulty: "Easy" },
  { title: "Min Cost Climbing Stairs", category: "1-D Dynamic Programming", difficulty: "Easy" },
  { title: "House Robber", category: "1-D Dynamic Programming", difficulty: "Medium" },
  { title: "House Robber II", category: "1-D Dynamic Programming", difficulty: "Medium" },
  { title: "Longest Palindromic Substring", category: "1-D Dynamic Programming", difficulty: "Medium" },
  { title: "Palindromic Substrings", category: "1-D Dynamic Programming", difficulty: "Medium" },
  { title: "Decode Ways", category: "1-D Dynamic Programming", difficulty: "Medium" },
  { title: "Coin Change", category: "1-D Dynamic Programming", difficulty: "Medium" },
  { title: "Maximum Product Subarray", category: "1-D Dynamic Programming", difficulty: "Medium" },
  { title: "Word Break", category: "1-D Dynamic Programming", difficulty: "Medium" },
  { title: "Longest Increasing Subsequence", category: "1-D Dynamic Programming", difficulty: "Medium" },
  { title: "Partition Equal Subset Sum", category: "1-D Dynamic Programming", difficulty: "Medium" },
  { title: "Unique Paths", category: "2-D Dynamic Programming", difficulty: "Medium" },
  { title: "Longest Common Subsequence", category: "2-D Dynamic Programming", difficulty: "Medium" },
  { title: "Best Time to Buy and Sell Stock with Cooldown", category: "2-D Dynamic Programming", difficulty: "Medium" },
  { title: "Coin Change II", category: "2-D Dynamic Programming", difficulty: "Medium" },
  { title: "Target Sum", category: "2-D Dynamic Programming", difficulty: "Medium" },
  { title: "Interleaving String", category: "2-D Dynamic Programming", difficulty: "Medium" },
  { title: "Longest Increasing Path in a Matrix", category: "2-D Dynamic Programming", difficulty: "Hard" },
  { title: "Distinct Subsequences", category: "2-D Dynamic Programming", difficulty: "Hard" },
  { title: "Edit Distance", category: "2-D Dynamic Programming", difficulty: "Medium" },
  { title: "Burst Balloons", category: "2-D Dynamic Programming", difficulty: "Hard" },
  { title: "Regular Expression Matching", category: "2-D Dynamic Programming", difficulty: "Hard" },
  { title: "Maximum Subarray", category: "Greedy", difficulty: "Medium" },
  { title: "Jump Game", category: "Greedy", difficulty: "Medium" },
  { title: "Jump Game II", category: "Greedy", difficulty: "Medium" },
  { title: "Gas Station", category: "Greedy", difficulty: "Medium" },
  { title: "Hand of Straights", category: "Greedy", difficulty: "Medium" },
  { title: "Merge Triplets to Form Target Triplet", category: "Greedy", difficulty: "Medium" },
  { title: "Partition Labels", category: "Greedy", difficulty: "Medium" },
  { title: "Valid Parenthesis String", category: "Greedy", difficulty: "Medium" },
  { title: "Insert Interval", category: "Intervals", difficulty: "Medium" },
  { title: "Merge Intervals", category: "Intervals", difficulty: "Medium" },
  { title: "Non-Overlapping Intervals", category: "Intervals", difficulty: "Medium" },
  { title: "Meeting Rooms", category: "Intervals", difficulty: "Easy" },
  { title: "Meeting Rooms II", category: "Intervals", difficulty: "Medium" },
  { title: "Minimum Interval to Include Each Query", category: "Intervals", difficulty: "Hard" },
  { title: "Rotate Image", category: "Math & Geometry", difficulty: "Medium" },
  { title: "Spiral Matrix", category: "Math & Geometry", difficulty: "Medium" },
  { title: "Set Matrix Zeroes", category: "Math & Geometry", difficulty: "Medium" },
  { title: "Happy Number", category: "Math & Geometry", difficulty: "Easy" },
  { title: "Plus One", category: "Math & Geometry", difficulty: "Easy" },
  { title: "Pow(x, n)", category: "Math & Geometry", difficulty: "Medium" },
  { title: "Multiply Strings", category: "Math & Geometry", difficulty: "Medium" },
  { title: "Detect Squares", category: "Math & Geometry", difficulty: "Medium" },
  { title: "Single Number", category: "Bit Manipulation", difficulty: "Easy" },
  { title: "Number of 1 Bits", category: "Bit Manipulation", difficulty: "Easy" },
  { title: "Counting Bits", category: "Bit Manipulation", difficulty: "Easy" },
  { title: "Reverse Bits", category: "Bit Manipulation", difficulty: "Easy" },
  { title: "Missing Number", category: "Bit Manipulation", difficulty: "Easy" },
  { title: "Sum of Two Integers", category: "Bit Manipulation", difficulty: "Medium" },
  { title: "Reverse Integer", category: "Bit Manipulation", difficulty: "Medium" }
];

const systemSeeds: SystemSeed[] = [
  { title: "RESHADED Interview Loop", category: "Foundations", signal: "L3 fundamentals", minutes: 35, focus: "turning ambiguity into a repeatable design conversation" },
  { title: "Back-of-the-Envelope Estimation", category: "Foundations", signal: "L4/L5 trade-offs", minutes: 40, focus: "QPS, storage, bandwidth, and headroom math" },
  { title: "API Contracts and Idempotency", category: "Foundations", signal: "L4/L5 trade-offs", minutes: 40, focus: "clean endpoints, retries, idempotency keys, and versioning" },
  { title: "Latency, Throughput, and SLOs", category: "Foundations", signal: "L4/L5 trade-offs", minutes: 45, focus: "choosing targets that shape the architecture" },
  { title: "CAP, PACELC, and Consistency", category: "Foundations", signal: "L6+ ambiguity", minutes: 45, focus: "availability and consistency choices under partitions" },
  { title: "Caching Strategy Primer", category: "Foundations", signal: "L4/L5 trade-offs", minutes: 40, focus: "cache-aside, write-through, invalidation, and TTLs" },
  { title: "Load Balancing and Proxies", category: "Foundations", signal: "L3 fundamentals", minutes: 35, focus: "request routing, health checks, sticky sessions, and L7 concerns" },
  { title: "CDNs and Edge Delivery", category: "Foundations", signal: "L4/L5 trade-offs", minutes: 40, focus: "static assets, cache keys, purging, and global latency" },
  { title: "SQL vs NoSQL Selection", category: "Databases", signal: "L4/L5 trade-offs", minutes: 45, focus: "modeling access patterns before choosing storage" },
  { title: "Indexes and Query Planning", category: "Databases", signal: "L4/L5 trade-offs", minutes: 45, focus: "read paths, compound indexes, and write amplification" },
  { title: "Partitioning and Sharding", category: "Databases", signal: "L6+ ambiguity", minutes: 50, focus: "hot keys, shard routing, rebalancing, and tenant isolation" },
  { title: "Replication and Read Scaling", category: "Databases", signal: "L6+ ambiguity", minutes: 45, focus: "leader-follower, quorum reads, lag, and failover" },
  { title: "Transactions and Isolation", category: "Databases", signal: "L6+ ambiguity", minutes: 45, focus: "race conditions, serializability, and business invariants" },
  { title: "Feed Storage Models", category: "Databases", signal: "L4/L5 trade-offs", minutes: 45, focus: "fan-out write tables, timeline materialization, and query shapes" },
  { title: "Search Indexes", category: "Databases", signal: "L4/L5 trade-offs", minutes: 40, focus: "inverted indexes, ranking, freshness, and backfills" },
  { title: "Time-Series Storage", category: "Databases", signal: "L4/L5 trade-offs", minutes: 40, focus: "retention, rollups, compression, and high-cardinality tags" },
  { title: "Stateless Services and Horizontal Scale", category: "Scaling", signal: "L3 fundamentals", minutes: 35, focus: "service replicas, shared state removal, and autoscaling" },
  { title: "API Rate Limiting Algorithms", category: "Scaling", signal: "L4/L5 trade-offs", minutes: 45, focus: "token bucket, leaky bucket, fixed windows, and Redis counters" },
  { title: "Queues as Shock Absorbers", category: "Scaling", signal: "L4/L5 trade-offs", minutes: 40, focus: "smoothing write spikes and separating slow work" },
  { title: "Fan-Out Strategies", category: "Scaling", signal: "L6+ ambiguity", minutes: 50, focus: "fan-out-on-write, fan-out-on-read, celebrity users, and freshness" },
  { title: "Object Storage and Media Delivery", category: "Scaling", signal: "L4/L5 trade-offs", minutes: 40, focus: "uploads, metadata, signed URLs, and CDN integration" },
  { title: "Geo-Distributed Serving", category: "Scaling", signal: "L6+ ambiguity", minutes: 50, focus: "regional routing, data residency, replication, and failover" },
  { title: "Consistent Hashing", category: "Scaling", signal: "L4/L5 trade-offs", minutes: 45, focus: "stable key placement, cache rings, and node churn" },
  { title: "Kafka Log Fundamentals", category: "Messaging", signal: "L4/L5 trade-offs", minutes: 45, focus: "partitions, offsets, consumer groups, and replay" },
  { title: "Job Queues and Workers", category: "Messaging", signal: "L3 fundamentals", minutes: 35, focus: "durable work, dead letters, retries, and visibility timeouts" },
  { title: "Retry Semantics and Deduplication", category: "Messaging", signal: "L4/L5 trade-offs", minutes: 45, focus: "at-least-once delivery, outbox patterns, and idempotent consumers" },
  { title: "WebSockets and Presence", category: "Messaging", signal: "L4/L5 trade-offs", minutes: 45, focus: "connection state, heartbeats, fanout, and reconnects" },
  { title: "Workflow Orchestration and DAGs", category: "Messaging", signal: "L6+ ambiguity", minutes: 50, focus: "durable state machines, retries, cancellation, and audit trails" },
  { title: "Stream Processing", category: "Messaging", signal: "L6+ ambiguity", minutes: 45, focus: "windowed aggregation, late data, exactly-once claims, and checkpoints" },
  { title: "Observability for Distributed Systems", category: "Reliability", signal: "L4/L5 trade-offs", minutes: 40, focus: "metrics, logs, traces, and useful alerts" },
  { title: "Circuit Breakers and Bulkheads", category: "Reliability", signal: "L4/L5 trade-offs", minutes: 40, focus: "failure containment, timeouts, and graceful degradation" },
  { title: "Disaster Recovery Planning", category: "Reliability", signal: "L6+ ambiguity", minutes: 45, focus: "RPO, RTO, backups, and restore drills" },
  { title: "Multi-Region Failover", category: "Reliability", signal: "L6+ ambiguity", minutes: 50, focus: "active-active, active-passive, DNS routing, and split-brain" },
  { title: "Backpressure and Load Shedding", category: "Reliability", signal: "L6+ ambiguity", minutes: 45, focus: "protecting dependencies when demand exceeds capacity" },
  { title: "Online Migrations", category: "Reliability", signal: "L4/L5 trade-offs", minutes: 45, focus: "expand-contract, dual writes, and progressive cutovers" },
  { title: "Capacity Planning Review", category: "Reliability", signal: "L4/L5 trade-offs", minutes: 40, focus: "headroom, saturation signals, and cost-aware scaling" },
  { title: "Authentication and Authorization", category: "Security", signal: "L3 fundamentals", minutes: 40, focus: "sessions, tokens, roles, scopes, and boundary checks" },
  { title: "Abuse Prevention", category: "Security", signal: "L4/L5 trade-offs", minutes: 40, focus: "spam, scraping, fraud signals, and adaptive throttles" },
  { title: "Secrets and Key Management", category: "Security", signal: "L4/L5 trade-offs", minutes: 35, focus: "rotation, envelope encryption, and operational access" },
  { title: "Privacy and End-to-End Encryption", category: "Security", signal: "L6+ ambiguity", minutes: 45, focus: "metadata leakage, key exchange, and compliance trade-offs" },
  { title: "Design a URL Shortener", category: "Case Studies", signal: "L4/L5 trade-offs", minutes: 60, focus: "hash generation, read-heavy traffic, sharding, and cache placement" },
  { title: "Design an API Rate Limiter", category: "Case Studies", signal: "L4/L5 trade-offs", minutes: 60, focus: "gateway integration, Redis windows, fairness, and burst behavior" },
  { title: "Design a Social Media Feed", category: "Case Studies", signal: "L6+ ambiguity", minutes: 65, focus: "fanout models, ranking, celebrity accounts, and timeline stores" },
  { title: "Design a Ride-Sharing Service", category: "Case Studies", signal: "L6+ ambiguity", minutes: 70, focus: "geo indexing, driver dispatch, matching, and regional partitions" },
  { title: "Design a Chat Application", category: "Case Studies", signal: "L6+ ambiguity", minutes: 65, focus: "bidirectional messaging, presence, ordering, and delivery receipts" },
  { title: "Design a Global CI/CD Platform", category: "Case Studies", signal: "L6+ ambiguity", minutes: 70, focus: "DAG execution, durable workflow state, logs, retries, and sandboxing" },
  { title: "Design a Video Streaming Platform", category: "Case Studies", signal: "L6+ ambiguity", minutes: 65, focus: "transcoding, manifests, CDN strategy, and adaptive bitrate playback" },
  { title: "Design a Cloud File Storage Service", category: "Case Studies", signal: "L4/L5 trade-offs", minutes: 60, focus: "chunking, sync conflicts, metadata, and signed downloads" },
  { title: "Design a Notification System", category: "Case Studies", signal: "L4/L5 trade-offs", minutes: 60, focus: "preferences, fanout, retries, provider failover, and deduplication" },
  { title: "Design Search Autocomplete", category: "Case Studies", signal: "L4/L5 trade-offs", minutes: 60, focus: "prefix indexes, ranking, freshness, and per-locale serving" }
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function scoreForDifficulty(difficulty: Difficulty) {
  if (difficulty === "Easy") {
    return 1;
  }

  if (difficulty === "Medium") {
    return 4;
  }

  return 6;
}

function buildAlgorithmDescription(seed: ProblemSeed, index: number) {
  const tags = patternTagsByCategory[seed.category];
  return [
    `## Practice Goal`,
    `${seed.title} trains the ${seed.category} pattern without relying on memorized wording. Your job is to identify the input shape, state the invariant aloud, and choose a data structure that keeps the critical operation cheap.`,
    ``,
    `## Pattern Signature`,
    `Look for signals related to ${tags.slice(0, 3).join(", ")}. If the prompt asks for repeated lookup, ordering, a contiguous range, or a constrained traversal, name that signal before writing code.`,
    ``,
    `## Interview Plan`,
    `1. Restate the desired output and constraints in your own words.`,
    `2. Define the invariant that stays true after every loop, recursive call, or heap operation.`,
    `3. Walk through a small case, an empty or single-item case, and one adversarial case.`,
    `4. Implement the simplest optimal version, then explain time and space complexity.`,
    ``,
    `## Mastery Rubric`,
    `This is problem ${index + 1} of the 150-problem roadmap. Mark it mastered only after you can explain why the chosen pattern beats the naive approach and can re-solve it without the video.`
  ].join("\n");
}

function buildStarterCode(seed: ProblemSeed) {
  const fnName = slugify(seed.title).replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
  return `/**\n * ${seed.title}\n * Pattern: ${seed.category}\n * Fill in the core invariant before coding.\n */\nexport function ${fnName}(input) {\n  // 1. Name the constraint that drives the data structure choice.\n  // 2. Track the smallest useful state.\n  // 3. Return the required result after validating edge cases.\n  return null;\n}\n`;
}

function buildOptimalSolution(seed: ProblemSeed) {
  const tags = patternTagsByCategory[seed.category];
  return [
    `Optimal approach: treat this as a ${seed.category} problem and protect the main invariant first.`,
    ``,
    `Core template:`,
    `- Identify the operation that would be too slow in the brute-force solution.`,
    `- Introduce ${tags[0]} so that operation becomes constant, logarithmic, or amortized constant time.`,
    `- Move through the input once when possible, updating only the state required to prove correctness.`,
    `- Validate the smallest input, duplicated values, boundary movement, and the largest constraint.`,
    ``,
    `Complexity target: explain the final time and space in terms of n, and mention any hidden cost such as sorting, recursion depth, heap size, or output size.`
  ].join("\n");
}

function buildHints(seed: ProblemSeed) {
  const tags = patternTagsByCategory[seed.category];
  return [
    `Write down the brute-force bottleneck before choosing a structure.`,
    `Ask whether ${tags[0]} or ${tags[1]} removes that bottleneck.`,
    `If stuck, trace two tiny examples and name exactly when the invariant breaks.`,
    seed.difficulty === "Hard"
      ? "For the hard variant, isolate the subproblem before trying to optimize the whole flow."
      : "Keep the first implementation plain; polish only after the invariant is correct."
  ];
}

function buildPseudoTests(seed: ProblemSeed) {
  return [
    `${seed.title}: handles the smallest valid input`,
    `${seed.title}: handles repeated values or equivalent states`,
    `${seed.title}: preserves the ${seed.category} invariant on a boundary case`
  ];
}

export const algorithmicProblems: AlgorithmicProblem[] = problemSeeds.map((seed, index) => ({
  id: `algo-${String(index + 1).padStart(3, "0")}-${slugify(seed.title)}`,
  title: seed.title,
  patternCategory: seed.category,
  patternTags: patternTagsByCategory[seed.category],
  difficulty: seed.difficulty,
  prepScore: scoreForDifficulty(seed.difficulty),
  leetcodeUrl: `https://leetcode.com/problems/${slugify(seed.title)}/`,
  embeddedVideoUrl: `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(
    `${seed.title} NeetCode explanation`
  )}`,
  markdownDescription: buildAlgorithmDescription(seed, index),
  starterCode: buildStarterCode(seed),
  optimalSolution: buildOptimalSolution(seed),
  pseudoTests: buildPseudoTests(seed),
  hints: buildHints(seed)
}));

function buildSystemContent(seed: SystemSeed, index: number) {
  return [
    `## Why This Matters`,
    `${seed.title} builds the architecture muscle for ${seed.focus}. In an interview, this topic is useful only when it changes a requirement, data model, bottleneck, or failure-mode decision.`,
    ``,
    `## RESHADED Walkthrough`,
    `- Requirements: state functional goals, non-functional goals, and what is intentionally out of scope.`,
    `- Estimation: calculate traffic, storage, fanout, and peak-to-average multipliers before drawing boxes.`,
    `- Storage: choose data stores from access patterns, not brand names.`,
    `- High-level design: sketch clients, edge, services, async paths, and storage.`,
    `- APIs: define the narrow contracts that protect idempotency and evolution.`,
    `- Detailed design: drill into the highest-risk component for this module.`,
    `- Evaluation: call out bottlenecks, correctness risks, observability, and cost.`,
    `- Distinctive components: name the one detail that makes the design memorable.`,
    ``,
    `## Practice Prompt`,
    `Spend five minutes listing assumptions, then draw the first architecture without checking the reference. For module ${index + 1}, the main judgment signal is ${seed.signal}.`
  ].join("\n");
}

function checklistFor(seed: SystemSeed) {
  return [
    `Requirements include the success metric for ${seed.focus}.`,
    "Estimation names QPS, storage growth, and peak behavior.",
    "Storage choice follows access patterns and consistency requirements.",
    "High-level design separates synchronous reads from asynchronous work.",
    "APIs include idempotency, pagination, or versioning where needed.",
    "Detailed design drills into the highest-risk bottleneck.",
    "Evaluation covers failure handling, observability, and cost.",
    "Distinctive component is clear enough to remember in an interview."
  ];
}

export const systemDesignModules: SystemDesignModule[] = systemSeeds.map((seed, index) => ({
  id: `sys-${String(index + 1).padStart(2, "0")}-${slugify(seed.title)}`,
  title: seed.title,
  frameworkCategory: seed.category,
  senioritySignal: seed.signal,
  estimatedMinutes: seed.minutes,
  resourceUrl:
    seed.category === "Case Studies"
      ? "https://github.com/donnemartin/system-design-primer"
      : "https://github.com/ByteByteGoHq/system-design-101",
  videoUrl: `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(
    `${seed.title} system design interview`
  )}`,
  architectureDiagramUrl: `https://dummyimage.com/1200x720/f8f7f2/121621&text=${encodeURIComponent(seed.title)}`,
  markdownContent: buildSystemContent(seed, index),
  reshadedChecklist: checklistFor(seed)
}));

const quizOptions = [
  "It directly protects the stated requirement or bottleneck.",
  "It is the most popular tool name mentioned in system design posts.",
  "It makes the diagram more complex, which signals seniority.",
  "It avoids discussing trade-offs with the interviewer."
];

const systemQuizzes: QuizItem[] = systemDesignModules.map((module, index) => ({
  id: `quiz-system-${String(index + 1).padStart(2, "0")}`,
  relatedModuleId: module.id,
  relatedItemType: "system",
  questionText: `In ${module.title}, what makes an architecture choice interview-ready?`,
  options: quizOptions.map((label, optionIndex) => ({ id: `q${index + 1}-o${optionIndex}`, label })),
  correctAnswerIndex: 0,
  educationalExplanation:
    "Strong system design answers tie each component to a requirement, estimate, bottleneck, or failure mode. Tool names alone are not a design argument."
}));

const algorithmQuizzes: QuizItem[] = algorithmCategoryOrder.map((category, index) => ({
  id: `quiz-algo-${String(index + 1).padStart(2, "0")}-${slugify(category)}`,
  relatedModuleId: algorithmicProblems.find((problem) => problem.patternCategory === category)?.id ?? category,
  relatedItemType: "algorithm",
  questionText: `What is the first signal that should make you consider ${category}?`,
  options: [
    { id: `qa${index}-0`, label: patternTagsByCategory[category][0] },
    { id: `qa${index}-1`, label: "The problem statement is long" },
    { id: `qa${index}-2`, label: "The examples use large numbers" },
    { id: `qa${index}-3`, label: "The interviewer pauses after reading" }
  ],
  correctAnswerIndex: 0,
  educationalExplanation: `Pattern recognition starts from constraints and operations. For ${category}, listen for ${patternTagsByCategory[
    category
  ]
    .slice(0, 2)
    .join(" and ")}.`
}));

export const quizItems: QuizItem[] = [...algorithmQuizzes, ...systemQuizzes];

export const curriculum: Curriculum = {
  algorithmicProblems,
  systemDesignModules,
  quizItems
};

export const curriculumStats = {
  algorithmCount: algorithmicProblems.length,
  systemModuleCount: systemDesignModules.length,
  quizCount: quizItems.length,
  prepScoreTotal: algorithmicProblems.reduce((total, problem) => total + problem.prepScore, 0)
};
