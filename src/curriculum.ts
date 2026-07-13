import { Module } from './types';

export const modules: Module[] = [
  {
    id: 'm1',
    title: 'Module 1: Python Core',
    subtitle: 'Learn Python Fundamentals',
    description: 'Master variables, loops, control flow, functions, OOP, testing, and state machines.',
    lessons: [
      {
        id: 'm1-l1',
        title: 'Variables & Data Types',
        description: 'Understand how Python stores information in variables.',
        xpReward: 100,
        exercises: [
          {
            id: 'm1-l1-e1',
            type: 'MCQ',
            question: 'Which of the following is a valid integer variable assignment in Python?',
            points: 20,
            romanHindiHint: 'Bhai, Python me type declare nahi karna hota! Direct variable_name = value likho.',
            options: [
              'int x = 5',
              'x = 5',
              'var x = 5',
              'declare x = 5'
            ],
            correctIndex: 1
          },
          {
            type: 'PREDICT',
            id: 'm1-l1-e2',
            question: 'Predict the output of the following code snippet:',
            points: 20,
            romanHindiHint: 'Bhai check karo variable variables are added together as strings or numbers. String concatenation ho rahi hai!',
            code: 'a = "Py"\nb = "Duo"\nprint(a + b)',
            options: [
              'Py Duo',
              'PyDuo',
              'Py+Duo',
              'Error'
            ],
            correctAnswer: 'PyDuo'
          },
          {
            type: 'DEBUG',
            id: 'm1-l1-e3',
            question: 'Fix the syntax error in the variable assignment below:',
            points: 30,
            romanHindiHint: 'Python names cannot start with a number! Number ko peeche lagao.',
            instructions: 'Ensure variable starts with a letter.',
            buggyCode: '1st_place = "Gold"',
            correctCode: 'first_place = "Gold"'
          },
          {
            type: 'DRAG_DROP',
            id: 'm1-l1-e4',
            question: 'Arrange the statements to calculate a 15% tip on a $100 bill and print it:',
            points: 30,
            romanHindiHint: 'Pehle total bill declare karo, phir tip percentage multiply karo, phir print!',
            items: [
              'bill = 100',
              'tip = bill * 0.15',
              'print(tip)'
            ],
            correctOrder: [
              'bill = 100',
              'tip = bill * 0.15',
              'print(tip)'
            ]
          },
          {
            type: 'CODE',
            id: 'm1-l1-e5',
            question: 'Assign the value 42 to a variable named `answer` and print it using `print(answer)`.',
            points: 40,
            romanHindiHint: 'Bhai direct answer = 42 likh ke print(answer) kar do, easy peasy!',
            initialCode: '# Write your code below\n',
            testCases: [
              {
                expectedOutput: '42',
                description: 'Verify variable equals 42 and is printed.'
              }
            ],
            solutionCode: 'answer = 42\nprint(answer)'
          }
        ]
      },
      {
        id: 'm1-l2',
        title: 'Control Flow: If-Else & Loops',
        description: 'Learn conditional branching and looping with `if`, `while`, and `for`.',
        xpReward: 100,
        exercises: [
          {
            id: 'm1-l2-e1',
            type: 'MCQ',
            question: 'How do you check if a number is even in a Python `if` condition?',
            points: 20,
            romanHindiHint: 'Modulo operator (%) use karo, jo remainder zero de!',
            options: [
              'if num / 2 == 0:',
              'if num % 2 == 0:',
              'if num.is_even():',
              'if num %% 2 == 0:'
            ],
            correctIndex: 1
          },
          {
            type: 'CODE',
            id: 'm1-l2-e2',
            question: 'Write a loop that prints numbers from 1 to 5 inclusive using `range()`.',
            points: 40,
            romanHindiHint: 'range(start, end) use karo, jisme end exclusive hota hai. So range(1, 6) chalega!',
            initialCode: '# Use a for loop\n',
            testCases: [
              {
                expectedOutput: '1\n2\n3\n4\n5',
                description: 'Loop from 1 to 5'
              }
            ],
            solutionCode: 'for i in range(1, 6):\n    print(i)'
          }
        ]
      },
      { id: 'm1-l3', title: 'Functions & Scope', description: 'Define reusable code with parameters and return values.', xpReward: 100, exercises: [] },
      { id: 'm1-l4', title: 'Lists & Tuples', description: 'Master indexed collections and immutable sequences.', xpReward: 100, exercises: [] },
      { id: 'm1-l5', title: 'Dictionaries & Sets', description: 'Store values in key-value pairs and fast lookups.', xpReward: 100, exercises: [] },
      { id: 'm1-l6', title: 'Object-Oriented Python', description: 'Create custom classes, attributes, methods, and inheritance.', xpReward: 100, exercises: [] },
      { id: 'm1-l7', title: 'File Input/Output', description: 'Read and write local text and CSV files seamlessly.', xpReward: 100, exercises: [] },
      { id: 'm1-l8', title: 'Error & Exception Handling', description: 'Use try-except blocks to catch runtime bugs gracefully.', xpReward: 100, exercises: [] },
      { id: 'm1-l9', title: 'JSON Serialization', description: 'Convert Python dictionaries to JSON and back.', xpReward: 100, exercises: [] },
      { id: 'm1-l10', title: 'Testing with Pytest', description: 'Write unit tests to assert code correctness.', xpReward: 100, exercises: [] },
      { id: 'm1-l11', title: 'Advanced Iterators & Generators', description: 'Use yield and range generators for memory efficiency.', xpReward: 100, exercises: [] },
      { id: 'm1-l12', title: 'CLI Game Loops & State Machines', description: 'Learn how variables maintain state in a classic CLI loop.', xpReward: 100, exercises: [] }
    ],
    capstone: {
      id: 'm1-cap',
      title: 'Capstone 1: CLI Text Adventure',
      description: 'Build a text-based Python game with variables, if-else branching, state loops, and OOP classes.',
      xpReward: 2000,
      initialCode: `class Hero:
    def __init__(self, name):
        self.name = name
        self.hp = 100
        
    def attack(self):
        return 15

# Write logic to run a game loop where choice is made
print("Adventure Begun!")`,
      testCode: `assert Hero("Snake").name == "Snake"`,
      guideSteps: [
        'Define a Hero class with Hp and Name',
        'Create a while True game loop',
        'Incorporate conditions for fighting monsters or healing'
      ]
    }
  },
  {
    id: 'm2',
    title: 'Module 2: Data Structures & Algorithms',
    subtitle: 'Graph Theory & Networks',
    description: 'Learn stacks, trees, sorting, network structures, PageRank and NetworkX analysis.',
    lessons: [
      {
        id: 'm2-l1',
        title: 'Big-O Notation & Complexity',
        description: 'Measure execution scaling based on input sizes.',
        xpReward: 100,
        exercises: [
          {
            id: 'm2-l1-e1',
            type: 'MCQ',
            question: 'What is the worst-case time complexity of searching a value in an unsorted list of size N?',
            points: 25,
            romanHindiHint: 'Bhai, list unsorted hai toh humein har ek item ko check karna padega! linear time!',
            options: [
              'O(1)',
              'O(log N)',
              'O(N)',
              'O(N^2)'
            ],
            correctIndex: 2
          },
          {
            id: 'm2-l1-e2',
            type: 'CODE',
            question: 'Write an O(1) constant time function named `get_first` that returns the first element of a list.',
            points: 40,
            romanHindiHint: 'List ka 0th index return karo direct, bina loop lagaye!',
            initialCode: 'def get_first(lst):\n    # Return first item\n',
            testCases: [
              {
                expectedOutput: '10',
                description: 'test case with list [10, 20, 30]'
              }
            ],
            solutionCode: 'def get_first(lst):\n    return lst[0]\nprint(get_first([10, 20, 30]))'
          }
        ]
      },
      { id: 'm2-l2', title: 'Arrays & Linked Lists', description: 'Compare sequential memory storage types.', xpReward: 100, exercises: [] },
      { id: 'm2-l3', title: 'Stacks, Queues & Deques', description: 'First-In-First-Out vs Last-In-First-Out pipelines.', xpReward: 100, exercises: [] },
      { id: 'm2-l4', title: 'Binary Trees & BSTs', description: 'Navigate sorted hierarchies recursively.', xpReward: 100, exercises: [] },
      { id: 'm2-l5', title: 'Sorting Algorithms', description: 'Master Bubble Sort, Merge Sort, and Quick Sort mechanics.', xpReward: 100, exercises: [] },
      { id: 'm2-l6', title: 'Graph Databases & NetworkX', description: 'Model relationships with nodes, edges, and clusters.', xpReward: 100, exercises: [] },
      { id: 'm2-l7', title: 'Breadth & Depth First Searches', description: 'Traverse complex routes level by level or depth first.', xpReward: 100, exercises: [] },
      { id: 'm2-l8', title: 'Dijkstra’s Shortest Path', description: 'Find the quickest route on weighted grid layers.', xpReward: 100, exercises: [] },
      { id: 'm2-l9', title: 'PageRank Algorithm', description: 'Analyze web ranking weights like Google Search.', xpReward: 100, exercises: [] },
      { id: 'm2-l10', title: 'Community Detection', description: 'Group interconnected clusters with NetworkX modules.', xpReward: 100, exercises: [] }
    ],
    capstone: {
      id: 'm2-cap',
      title: 'Capstone 2: Graph Analyzer',
      description: 'Model social connection routes with PageRank weights in a 100,000+ node graph analyzer.',
      xpReward: 3000,
      initialCode: `class Graph:
    def __init__(self):
        self.adj = {}
        
    def add_edge(self, u, v):
        if u not in self.adj: self.adj[u] = []
        self.adj[u].append(v)

print("Social network initialized!")`,
      testCode: `assert True`,
      guideSteps: [
        'Implement an adjacency list graph representation',
        'Measure connection density',
        'Trace shortest path routes between key influencer accounts'
      ]
    }
  },
  {
    id: 'm3',
    title: 'Module 3: Python Pro Toolkit',
    subtitle: 'Asynchronous Programming',
    description: 'Learn generators, context managers, decorators, async/await, packaging, Docker, and CI/CD.',
    lessons: [
      {
        id: 'm3-l1',
        title: 'Python Decorators',
        description: 'Modify function behaviors dynamically.',
        xpReward: 100,
        exercises: [
          {
            id: 'm3-l1-e1',
            type: 'MCQ',
            question: 'What character is used to denote a Python decorator on top of a function definition?',
            points: 20,
            romanHindiHint: 'Decorator ke liye email address wala symbol use hota hai! @ symbol.',
            options: [
              '# symbol',
              '@ symbol',
              '* symbol',
              '$ symbol'
            ],
            correctIndex: 1
          },
          {
            id: 'm3-l1-e2',
            type: 'CODE',
            question: 'Write a basic decorator named `double_it` that doubles the integer result of the function it wraps.',
            points: 50,
            romanHindiHint: 'Wrapper function return karo jo original func ko call kare, aur uski output ko 2 se multiply kare!',
            initialCode: 'def double_it(func):\n    def wrapper(*args, **kwargs):\n        # Call func and multiply by 2\n        pass\n    return wrapper',
            testCases: [
              {
                expectedOutput: '20',
                description: 'Wrapping a function that returns 10'
              }
            ],
            solutionCode: 'def double_it(func):\n    def wrapper(*args, **kwargs):\n        return func(*args, **kwargs) * 2\n    return wrapper\n\n@double_it\ndef get_ten(): return 10\nprint(get_ten())'
          }
        ]
      },
      { id: 'm3-l2', title: 'Context Managers & `with`', description: 'Safely allocate and release system files or locks.', xpReward: 100, exercises: [] },
      { id: 'm3-l3', title: 'Asynchronous Programming with Asyncio', description: 'Execute concurrency without multi-threading overhead.', xpReward: 100, exercises: [] },
      { id: 'm3-l4', title: 'Generators & Yield Statements', description: 'Create dynamic pipelines that produce items sequentially.', xpReward: 100, exercises: [] },
      { id: 'm3-l5', title: 'Type Hinting & Static Analysis', description: 'Annotate type models and run static checks.', xpReward: 100, exercises: [] },
      { id: 'm3-l6', title: 'Packaging & pip setup', description: 'Bundle packages into reusable distribution modules.', xpReward: 100, exercises: [] },
      { id: 'm3-l7', title: 'Testing with pytest-mock', description: 'Mock external requests to simulate robust server behavior.', xpReward: 100, exercises: [] },
      { id: 'm3-l8', title: 'Multi-stage Docker Builds', description: 'Containerize lightweight Python packages for production.', xpReward: 100, exercises: [] },
      { id: 'm3-l9', title: 'CI/CD Pipelines with GitHub Actions', description: 'Automate lint, test, and release cycles on code commit.', xpReward: 100, exercises: [] },
      { id: 'm3-l10', title: 'APM & Production Loggers', description: 'Configure application performance trackers and alerts.', xpReward: 100, exercises: [] }
    ],
    capstone: {
      id: 'm3-cap',
      title: 'Capstone 3: FastAPI Microservice',
      description: 'Deploy a high-throughput async FastAPI microservice packed inside a Docker container with APM tracking.',
      xpReward: 3500,
      initialCode: `# Build FastAPI Microservice mock
print("Microservice ready!")`,
      testCode: `assert True`,
      guideSteps: [
        'Configure async request routes',
        'Setup health-checks and request timing metrics',
        'Design custom error handlers'
      ]
    }
  },
  {
    id: 'm4',
    title: 'Module 4: Data Science & Visualization',
    subtitle: 'Wrangle & Stream Data',
    description: 'Master NumPy, Pandas, Plotly, Streamlit, web caching, and real-time alerts.',
    lessons: [
      {
        id: 'm4-l1',
        title: 'NumPy Arrays & Linear Algebra',
        description: 'Learn multidimensional arrays for fast mathematical grids.',
        xpReward: 100,
        exercises: [
          {
            id: 'm4-l1-e1',
            type: 'MCQ',
            question: 'What is the main benefit of using NumPy arrays over native Python lists?',
            points: 20,
            romanHindiHint: 'Bhai, NumPy C-level array allocation use karta hai jo memory efficient aur vector computations ke liye super fast hai!',
            options: [
              'NumPy lists can hold varying types in one array',
              'Vectorized operations are compiled in C, making calculations extremely fast',
              'NumPy doesn’t require importing any packages',
              'NumPy variables do not take any storage space'
            ],
            correctIndex: 1
          },
          {
            id: 'm4-l1-e2',
            type: 'CODE',
            question: 'Mock an operation that simulates creating a NumPy-like array of zeroes of length 3 using lists.',
            points: 30,
            romanHindiHint: '3 times 0 wali list banana hai bhai. [0, 0, 0] or list of zeroes print karo.',
            initialCode: '# Create a list containing [0, 0, 0]\nzeroes = \nprint(zeroes)',
            testCases: [
              {
                expectedOutput: '[0, 0, 0]',
                description: 'verify output is [0, 0, 0]'
              }
            ],
            solutionCode: 'zeroes = [0, 0, 0]\nprint(zeroes)'
          }
        ]
      },
      { id: 'm4-l2', title: 'Pandas DataFrames', description: 'Index and segment tabular data spreadsheets.', xpReward: 100, exercises: [] },
      { id: 'm4-l3', title: 'Data Wrangling & Cleaning', description: 'Prune missing null cells and normalize columns.', xpReward: 100, exercises: [] },
      { id: 'm4-l4', title: 'Matplotlib & Seaborn plots', description: 'Plot high-resolution distributions and trends.', xpReward: 100, exercises: [] },
      { id: 'm4-l5', title: 'Interactive Plotly Plots', description: 'Render responsive, zoomable charts for web dashboards.', xpReward: 100, exercises: [] },
      { id: 'm4-l6', title: 'Streamlit App Creation', description: 'Turn analytical scripts into responsive UI portals in seconds.', xpReward: 100, exercises: [] },
      { id: 'm4-l7', title: 'Time Series & Aggregations', description: 'Resample dates and compute rolling moving averages.', xpReward: 100, exercises: [] },
      { id: 'm4-l8', title: 'WebSocket Stream Wrangling', description: 'Ingest live JSON telemetry directly into memory arrays.', xpReward: 100, exercises: [] },
      { id: 'm4-l9', title: 'Caching & Query Optimization', description: 'Accelerate dashboards using memory cache states.', xpReward: 100, exercises: [] },
      { id: 'm4-l10', title: 'Real-time Alerts & Triggers', description: 'Fire notifications when values exceed threshold marks.', xpReward: 100, exercises: [] }
    ],
    capstone: {
      id: 'm4-cap',
      title: 'Capstone 4: Real-time Dashboard',
      description: 'Assemble a real-time analytics portal with responsive Streamlit controls, cached API routes, and alerts.',
      xpReward: 4000,
      initialCode: `# Ingest, clean, and plot metrics
print("Dashboard live!")`,
      testCode: `assert True`,
      guideSteps: [
        'Ingest CSV source telemetry',
        'Group by custom timestamps',
        'Plot interactive, responsive line charts'
      ]
    }
  },
  {
    id: 'm5',
    title: 'Module 5: ML Fundamentals',
    subtitle: 'Classic Machine Learning & MLOps',
    description: 'Learn Regression, Classification, XGBoost, MLflow model serving, tracking and drifting.',
    lessons: [
      {
        id: 'm5-l1',
        title: 'Supervised Learning & Regression',
        description: 'Understand linear regression modeling for continuous curves.',
        xpReward: 100,
        exercises: [
          {
            id: 'm5-l1-e1',
            type: 'MCQ',
            question: 'What loss function is standard for evaluating linear regression models?',
            points: 20,
            romanHindiHint: 'Bhai mean of squared errors calculate karo! MSE.',
            options: [
              'Binary Cross Entropy',
              'Mean Squared Error (MSE)',
              'Categorical Cross Entropy',
              'Hinge Loss'
            ],
            correctIndex: 1
          },
          {
            id: 'm5-l1-e2',
            type: 'CODE',
            question: 'Write a basic python function `predict_y(x, w, b)` that calculates the regression prediction y = w * x + b.',
            points: 40,
            romanHindiHint: 'Straight line equation calculate karo: w times x plus b!',
            initialCode: 'def predict_y(x, w, b):\n    # Return prediction\n',
            testCases: [
              {
                expectedOutput: '13',
                description: 'test case with x=5, w=2, b=3'
              }
            ],
            solutionCode: 'def predict_y(x, w, b):\n    return w * x + b\nprint(predict_y(5, 2, 3))'
          }
        ]
      },
      { id: 'm5-l2', title: 'Logistic Regression & Classification', description: 'Model probability categories using sigmoid curves.', xpReward: 100, exercises: [] },
      { id: 'm5-l3', title: 'Decision Trees & Random Forests', description: 'Build non-linear classification splits using decision structures.', xpReward: 100, exercises: [] },
      { id: 'm5-l4', title: 'XGBoost & Gradient Boosting', description: 'Stack predictors to iteratively minimize errors.', xpReward: 100, exercises: [] },
      { id: 'm5-l5', title: 'Clustering with K-Means', description: 'Group unlabeled coordinates into dynamic spatial clusters.', xpReward: 100, exercises: [] },
      { id: 'm5-l6', title: 'Feature Engineering & Encoders', description: 'Transform categorical strings into hot encoded matrices.', xpReward: 100, exercises: [] },
      { id: 'm5-l7', title: 'Validation, Overfitting & Regularization', description: 'Prevent memorization using L1 Lasso / L2 Ridge rules.', xpReward: 100, exercises: [] },
      { id: 'm5-l8', title: 'MLflow Experiment Tracking', description: 'Track hyperparameters, runs, and weights.', xpReward: 100, exercises: [] },
      { id: 'm5-l9', title: 'DVC & Data Versioning', description: 'Track gigabytes of train-datasets with Git pointer states.', xpReward: 100, exercises: [] },
      { id: 'm5-l10', title: 'ML Serving with FastAPI & Prometheus', description: 'Serve models over REST API and monitor latency scales.', xpReward: 100, exercises: [] },
      { id: 'm5-l11', title: 'Model Drift & Telemetry Monitoring', description: 'Acknowledge performance decay when incoming user demographics shift.', xpReward: 100, exercises: [] },
      { id: 'm5-l12', title: 'A/B Deployment Rules', description: 'Shadow model releases to safely gauge relative performance.', xpReward: 100, exercises: [] }
    ],
    capstone: {
      id: 'm5-cap',
      title: 'Capstone 5: MLOps Pipeline',
      description: 'Engineer an end-to-end classification pipeline that tracks inputs, serves predictions, and measures data drift.',
      xpReward: 4500,
      initialCode: `# Load models, serve endpoints, monitor telemetry
print("MLOps Pipeline online!")`,
      testCode: `assert True`,
      guideSteps: [
        'Fit classification weights',
        'Expose predict endpoint with FastAPI',
        'Simulate feature drift detection alerts'
      ]
    }
  },
  {
    id: 'm6',
    title: 'Module 6: Deep Learning & Gen AI',
    subtitle: 'Neural Networks & LLMs',
    description: 'Build neural networks, transformers, hybrid RAG agents, planning loops, and LLM guardrails.',
    lessons: [
      {
        id: 'm6-l1',
        title: 'Deep Learning & Backpropagation',
        description: 'Understand how micrograd layers calculate slopes.',
        xpReward: 100,
        exercises: [
          {
            id: 'm6-l1-e1',
            type: 'MCQ',
            question: 'What rule of calculus is the engine behind backpropagation in neural networks?',
            points: 20,
            romanHindiHint: 'Bhai nested derivatives calculate karne ke liye Chain Rule lagaya jata hai!',
            options: [
              'Product Rule',
              'Chain Rule',
              'Quotient Rule',
              'Power Rule'
            ],
            correctIndex: 1
          },
          {
            id: 'm6-l1-e2',
            type: 'CODE',
            question: 'Write a simple python sigmoid activation function named `sigmoid(x)` using `math.exp` to map values between 0 and 1.',
            points: 50,
            romanHindiHint: 'Formula hota hai: 1 / (1 + exp(-x)). math.exp(-x) use karo!',
            initialCode: 'import math\n\ndef sigmoid(x):\n    # Return sigmoid activation\n',
            testCases: [
              {
                expectedOutput: '0.5',
                description: 'test case with x = 0'
              }
            ],
            solutionCode: 'import math\ndef sigmoid(x):\n    return 1 / (1 + math.exp(-x))\nprint(sigmoid(0))'
          }
        ]
      },
      { id: 'm6-l2', title: 'Convolutional Networks (CNNs)', description: 'Extract visual features using kernels and polling steps.', xpReward: 100, exercises: [] },
      { id: 'm6-l3', title: 'Recurrent Networks (RNNs & LSTMs)', description: 'Capture sequential word trends with recurrent memory loops.', xpReward: 100, exercises: [] },
      { id: 'm6-l4', title: 'The Attention Mechanism', description: 'Allow neural steps to look selectively across whole phrases.', xpReward: 100, exercises: [] },
      { id: 'm6-l5', title: 'The Transformer Architecture', description: 'Leverage multi-headed attention modules for massive text parsing.', xpReward: 100, exercises: [] },
      { id: 'm6-l6', title: 'Fine-Tuning LLMs & LoRA', description: 'Train billions of parameters with low-rank adapter weights.', xpReward: 100, exercises: [] },
      { id: 'm6-l7', title: 'RAG Architecture (Retrieval Augmented)', description: 'Enrich prompts with high-accuracy database search lookups.', xpReward: 100, exercises: [] },
      { id: 'm6-l8', title: 'Hybrid Search & Reranking', description: 'Combine vector similarity with keyword matches for pristine recall.', xpReward: 100, exercises: [] },
      { id: 'm6-l9', title: 'AI Agents: Planning & Actions', description: 'Empower models to reason, call tools, and verify outcomes.', xpReward: 100, exercises: [] },
      { id: 'm6-l10', title: 'vLLM & LLM Serving', description: 'Deploy massive open-weight systems with continuous batching speed.', xpReward: 100, exercises: [] },
      { id: 'm6-l11', title: 'RAGAS Evaluations & Quality', description: 'Measure faith and accuracy benchmarks with strict automated evals.', xpReward: 100, exercises: [] },
      { id: 'm6-l12', title: 'Guardrails & Safety Control', description: 'Inspect and prune model inputs or outputs for security policies.', xpReward: 100, exercises: [] }
    ],
    capstone: {
      id: 'm6-cap',
      title: 'Capstone 6: Custom AI Assistant',
      description: 'Deploy a hybrid RAG-agent capable of calling tools, reading vectors, and checking safety guardrails.',
      xpReward: 5000,
      initialCode: `# Build the custom agent
print("Agent system active!")`,
      testCode: `assert True`,
      guideSteps: [
        'Vectorize custom documentation files',
        'Configure tool planning blocks',
        'Implement input and output guardrails'
      ]
    }
  }
];

export function getLessonById(lessonId: string) {
  for (const m of modules) {
    const l = m.lessons.find(lesson => lesson.id === lessonId);
    if (l) return { module: m, lesson: l };
  }
  return null;
}
