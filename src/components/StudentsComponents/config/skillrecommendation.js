// ============================================================================
// COMPREHENSIVE SKILL RECOMMENDATIONS MAPPING
// ============================================================================
// This object contains detailed skill recommendations for each technology
// in the domains data structure. Each key represents a skill ID, and the
// value is an array of recommended related skills to learn.
// ============================================================================

export const skillRecommendations = {
  // ============================================================================
  // FRONTEND DEVELOPMENT
  // ============================================================================
  
  // React Ecosystem
  'react': [
    'typescript', 'redux', 'nextjs', 'jest', 'cypress', 'react-native',
    'tailwind', 'material-ui', 'zustand', 'webpack', 'vite', 'graphql',
    'rest', 'html', 'css', 'javascript'
  ],
  'angular': [
    'typescript', 'rxjs', 'ngrx', 'jasmine', 'karma', 'material-ui',
    'html', 'css', 'sass', 'rest', 'graphql', 'nodejs'
  ],
  'vue': [
    'typescript', 'javascript', 'vuex', 'pinia', 'nuxt', 'vite',
    'tailwind', 'sass', 'jest', 'cypress', 'html', 'css'
  ],
  'nextjs': [
    'react', 'typescript', 'tailwind', 'vercel', 'nodejs', 'rest',
    'graphql', 'prisma', 'mongodb', 'postgresql', 'redis'
  ],
  'svelte': [
    'javascript', 'typescript', 'sveltekit', 'vite', 'tailwind',
    'html', 'css', 'rest', 'graphql'
  ],
  
  // Programming Languages (Frontend)
  'javascript': [
    'typescript', 'react', 'vue', 'angular', 'nodejs', 'html', 'css',
    'webpack', 'vite', 'jest', 'express', 'rest'
  ],
  'typescript': [
    'javascript', 'react', 'angular', 'vue', 'nextjs', 'nodejs', 'nestjs',
    'jest', 'webpack', 'vite', 'graphql'
  ],
  'html': [
    'css', 'javascript', 'react', 'vue', 'angular', 'sass', 'tailwind',
    'bootstrap', 'responsive-design', 'accessibility'
  ],
  'css': [
    'html', 'javascript', 'sass', 'tailwind', 'bootstrap', 'material-ui',
    'responsive-design', 'figma', 'adobe-xd'
  ],
  
  // Styling Frameworks
  'tailwind': [
    'react', 'vue', 'nextjs', 'html', 'css', 'figma', 'responsive-design',
    'typescript', 'vite', 'webpack'
  ],
  'sass': [
    'css', 'html', 'javascript', 'webpack', 'gulp', 'react', 'vue', 'angular'
  ],
  'bootstrap': [
    'html', 'css', 'javascript', 'jquery', 'sass', 'responsive-design'
  ],
  'material-ui': [
    'react', 'typescript', 'javascript', 'figma', 'design-systems'
  ],
  
  // State Management
  'redux': [
    'react', 'typescript', 'javascript', 'redux-saga', 'redux-thunk',
    'jest', 'react-native'
  ],
  'mobx': [
    'react', 'typescript', 'javascript', 'jest'
  ],
  'zustand': [
    'react', 'typescript', 'javascript', 'nextjs'
  ],
  
  // Build Tools
  'webpack': [
    'javascript', 'typescript', 'babel', 'nodejs', 'react', 'vue',
    'sass', 'css'
  ],
  'vite': [
    'javascript', 'typescript', 'react', 'vue', 'svelte', 'tailwind'
  ],
  
  // Testing
  'jest': [
    'javascript', 'typescript', 'react', 'nodejs', 'babel', 'enzyme',
    'testing-library'
  ],
  'cypress': [
    'javascript', 'typescript', 'react', 'vue', 'angular', 'selenium'
  ],

  // ============================================================================
  // BACKEND DEVELOPMENT
  // ============================================================================
  
  // Node.js Ecosystem
  'nodejs': [
    'javascript', 'typescript', 'express', 'nestjs', 'fastify', 'mongodb',
    'postgresql', 'redis', 'docker', 'rest', 'graphql', 'jest', 'jwt',
    'websockets'
  ],
  'express': [
    'nodejs', 'javascript', 'typescript', 'mongodb', 'postgresql', 'mysql',
    'redis', 'jwt', 'passport', 'rest', 'docker', 'jest'
  ],
  'nestjs': [
    'nodejs', 'typescript', 'express', 'typeorm', 'prisma', 'postgresql',
    'mongodb', 'redis', 'jest', 'graphql', 'microservices', 'docker'
  ],
  'fastify': [
    'nodejs', 'typescript', 'javascript', 'postgresql', 'mongodb', 'redis',
    'rest', 'graphql', 'docker'
  ],
  
  // Python Ecosystem
  'python': [
    'django', 'flask', 'fastapi', 'postgresql', 'mongodb', 'redis', 'pandas',
    'numpy', 'pytest', 'docker', 'celery', 'rest', 'graphql'
  ],
  'django': [
    'python', 'postgresql', 'mysql', 'redis', 'celery', 'django-rest',
    'docker', 'nginx', 'gunicorn', 'jwt'
  ],
  'flask': [
    'python', 'postgresql', 'mysql', 'mongodb', 'redis', 'sqlalchemy',
    'jwt', 'rest', 'docker', 'gunicorn'
  ],
  'fastapi': [
    'python', 'postgresql', 'mongodb', 'redis', 'sqlalchemy', 'pydantic',
    'jwt', 'rest', 'graphql', 'docker', 'uvicorn', 'async'
  ],
  
  // Java Ecosystem
  'java': [
    'springboot', 'maven', 'gradle', 'hibernate', 'postgresql', 'mysql',
    'mongodb', 'redis', 'docker', 'kubernetes', 'junit', 'rest', 'kafka'
  ],
  'springboot': [
    'java', 'maven', 'gradle', 'hibernate', 'jpa', 'postgresql', 'mysql',
    'mongodb', 'redis', 'kafka', 'docker', 'kubernetes', 'microservices',
    'rest', 'graphql'
  ],
  
  // Go Ecosystem
  'go': [
    'gin', 'postgresql', 'mongodb', 'redis', 'docker', 'kubernetes',
    'grpc', 'rest', 'microservices', 'kafka'
  ],
  'gin': [
    'go', 'postgresql', 'mongodb', 'redis', 'docker', 'rest', 'jwt',
    'grpc', 'microservices'
  ],
  
  // Ruby Ecosystem
  'ruby': [
    'postgresql', 'mysql', 'redis', 'sidekiq', 'rspec', 'rest', 'docker'
  ],
  
  // PHP Ecosystem
  'php': [
    'laravel', 'mysql', 'postgresql', 'redis', 'composer', 'rest', 'docker'
  ],
  'laravel': [
    'php', 'mysql', 'postgresql', 'redis', 'composer', 'rest', 'vue',
    'docker', 'nginx'
  ],
  
  // .NET Ecosystem
  'csharp': [
    'dotnet', 'azure', 'sql-server', 'entity-framework', 'rest', 'graphql',
    'docker', 'kubernetes'
  ],
  'dotnet': [
    'csharp', 'azure', 'sql-server', 'entity-framework', 'rest', 'graphql',
    'docker', 'kubernetes', 'aspnet-core'
  ],
  
  // API Technologies
  'graphql': [
    'nodejs', 'typescript', 'apollo', 'react', 'postgresql', 'mongodb',
    'redis', 'rest', 'docker'
  ],
  'rest': [
    'nodejs', 'python', 'java', 'go', 'postgresql', 'mongodb', 'redis',
    'jwt', 'swagger', 'postman', 'docker'
  ],
  'grpc': [
    'go', 'java', 'python', 'nodejs', 'protobuf', 'microservices',
    'kubernetes', 'docker'
  ],

  // ============================================================================
  // MOBILE DEVELOPMENT
  // ============================================================================
  
  // Cross-Platform
  'react-native': [
    'react', 'javascript', 'typescript', 'redux', 'firebase', 'rest',
    'graphql', 'jest', 'detox', 'expo'
  ],
  'flutter': [
    'dart', 'firebase', 'rest', 'graphql', 'sqlite', 'provider',
    'bloc', 'riverpod', 'figma'
  ],
  
  // iOS Development
  'swift': [
    'swiftui', 'uikit', 'combine', 'coredata', 'firebase', 'rest',
    'graphql', 'xcode', 'testflight'
  ],
  'swiftui': [
    'swift', 'combine', 'coredata', 'firebase', 'rest', 'graphql', 'figma'
  ],
  
  // Android Development
  'kotlin': [
    'jetpack-compose', 'room', 'retrofit', 'coroutines', 'firebase',
    'rest', 'graphql', 'android-studio'
  ],
  'java-android': [
    'android-sdk', 'room', 'retrofit', 'firebase', 'rest', 'sqlite'
  ],
  'jetpack-compose': [
    'kotlin', 'android-studio', 'room', 'retrofit', 'firebase', 'material-design'
  ],
  
  // Hybrid
  'ionic': [
    'angular', 'react', 'vue', 'typescript', 'capacitor', 'firebase'
  ],
  'cordova': [
    'html', 'css', 'javascript', 'jquery', 'firebase'
  ],
  
  // Mobile Backend
  'firebase': [
    'react-native', 'flutter', 'swift', 'kotlin', 'firestore', 'authentication',
    'cloud-functions', 'analytics'
  ],
  'realm': [
    'swift', 'kotlin', 'react-native', 'mongodb'
  ],

  // ============================================================================
  // DEVOPS & CLOUD
  // ============================================================================
  
  // Containerization
  'docker': [
    'kubernetes', 'docker-compose', 'helm', 'jenkins', 'gitlab', 'terraform',
    'ansible', 'nginx', 'linux', 'bash'
  ],
  'kubernetes': [
    'docker', 'helm', 'istio', 'prometheus', 'grafana', 'terraform',
    'jenkins', 'gitlab', 'aws', 'gcp', 'azure'
  ],
  'helm': [
    'kubernetes', 'docker', 'yaml', 'terraform', 'jenkins'
  ],
  
  // CI/CD
  'jenkins': [
    'docker', 'kubernetes', 'git', 'groovy', 'bash', 'terraform',
    'ansible', 'sonarqube'
  ],
  'gitlab': [
    'docker', 'kubernetes', 'git', 'yaml', 'terraform', 'ansible'
  ],
  'github-actions': [
    'docker', 'kubernetes', 'yaml', 'terraform', 'git'
  ],
  'circleci': [
    'docker', 'kubernetes', 'yaml', 'git'
  ],
  'travis': [
    'docker', 'yaml', 'git'
  ],
  
  // Cloud Platforms
  'aws': [
    'terraform', 'docker', 'kubernetes', 'lambda', 's3', 'ec2', 'rds',
    'dynamodb', 'cloudformation', 'cloudwatch', 'iam', 'vpc'
  ],
  'azure': [
    'terraform', 'docker', 'kubernetes', 'azure-functions', 'azure-devops',
    'arm-templates', 'csharp', 'dotnet'
  ],
  'gcp': [
    'terraform', 'docker', 'kubernetes', 'cloud-functions', 'bigquery',
    'cloud-run', 'app-engine'
  ],
  
  // Infrastructure as Code
  'terraform': [
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ansible', 'vault',
    'hcl', 'bash'
  ],
  'ansible': [
    'terraform', 'docker', 'linux', 'yaml', 'python', 'bash', 'jenkins'
  ],
  'cloudformation': [
    'aws', 'yaml', 'json', 'terraform'
  ],
  
  // Monitoring & Logging
  'prometheus': [
    'grafana', 'kubernetes', 'docker', 'alertmanager', 'node-exporter'
  ],
  'grafana': [
    'prometheus', 'influxdb', 'elasticsearch', 'kubernetes', 'docker'
  ],
  'elk': [
    'elasticsearch', 'logstash', 'kibana', 'filebeat', 'docker', 'kubernetes'
  ],
  
  // Web Servers
  'nginx': [
    'docker', 'linux', 'ssl', 'reverse-proxy', 'load-balancing', 'kubernetes'
  ],
  
  // Operating Systems
  'linux': [
    'bash', 'docker', 'kubernetes', 'nginx', 'systemd', 'vim', 'ssh',
    'networking', 'security'
  ],
  'bash': [
    'linux', 'docker', 'git', 'sed', 'awk', 'python', 'ansible'
  ],

  // ============================================================================
  // MACHINE LEARNING & AI
  // ============================================================================
  
  // Programming Languages (ML)
  'python-ml': [
    'tensorflow', 'pytorch', 'keras', 'scikit', 'pandas', 'numpy',
    'matplotlib', 'jupyter', 'opencv', 'nlp'
  ],
  'r': [
    'rstudio', 'ggplot2', 'dplyr', 'shiny', 'statistics', 'probability'
  ],
  
  // Deep Learning Frameworks
  'tensorflow': [
    'python-ml', 'keras', 'numpy', 'pandas', 'jupyter', 'tensorboard',
    'gpu', 'cuda', 'docker', 'kubernetes'
  ],
  'pytorch': [
    'python-ml', 'numpy', 'pandas', 'jupyter', 'torchvision', 'cuda',
    'gpu', 'docker', 'fastai'
  ],
  'keras': [
    'tensorflow', 'python-ml', 'numpy', 'pandas', 'matplotlib', 'jupyter'
  ],
  
  // ML Libraries
  'scikit': [
    'python-ml', 'numpy', 'pandas', 'matplotlib', 'seaborn', 'jupyter',
    'scipy', 'statistics'
  ],
  'pandas': [
    'python-ml', 'numpy', 'matplotlib', 'seaborn', 'jupyter', 'sql',
    'scikit', 'tensorflow', 'pytorch'
  ],
  'numpy': [
    'python-ml', 'pandas', 'scipy', 'matplotlib', 'tensorflow', 'pytorch',
    'scikit', 'jupyter'
  ],
  
  // Visualization
  'matplotlib': [
    'python-ml', 'numpy', 'pandas', 'seaborn', 'jupyter', 'scipy'
  ],
  'seaborn': [
    'python-ml', 'pandas', 'matplotlib', 'numpy', 'jupyter', 'statistics'
  ],
  
  // Computer Vision
  'opencv': [
    'python-ml', 'numpy', 'matplotlib', 'tensorflow', 'pytorch', 'yolo',
    'cuda', 'image-processing'
  ],
  'yolo': [
    'opencv', 'python-ml', 'pytorch', 'tensorflow', 'cuda', 'computer-vision'
  ],
  
  // Natural Language Processing
  'nlp': [
    'python-ml', 'spacy', 'huggingface', 'transformers', 'nltk', 'gensim',
    'tensorflow', 'pytorch'
  ],
  'spacy': [
    'python-ml', 'nlp', 'transformers', 'huggingface', 'numpy'
  ],
  'huggingface': [
    'python-ml', 'transformers', 'pytorch', 'tensorflow', 'nlp', 'spacy'
  ],
  'transformers': [
    'python-ml', 'huggingface', 'pytorch', 'tensorflow', 'nlp', 'bert',
    'gpt', 'tokenization'
  ],
  
  // MLOps
  'mlflow': [
    'python-ml', 'tensorflow', 'pytorch', 'scikit', 'docker', 'kubernetes',
    'aws', 'azure'
  ],
  'kubeflow': [
    'kubernetes', 'docker', 'tensorflow', 'pytorch', 'python-ml', 'jupyter'
  ],

  // ============================================================================
  // DATA ENGINEERING
  // ============================================================================
  
  // Programming Languages (Data)
  'sql': [
    'postgresql', 'mysql', 'sql-server', 'oracle', 'snowflake', 'bigquery',
    'redshift', 'dbt', 'tableau', 'power-bi'
  ],
  'python-de': [
    'pandas', 'numpy', 'pyspark', 'airflow', 'sql', 'kafka', 'dbt',
    'great-expectations'
  ],
  'scala': [
    'spark-de', 'kafka', 'akka', 'sbt', 'java', 'functional-programming'
  ],
  
  // Databases
  'postgresql': [
    'sql', 'python-de', 'nodejs', 'django', 'prisma', 'pgadmin',
    'docker', 'replication', 'indexing'
  ],
  'mysql': [
    'sql', 'php', 'laravel', 'nodejs', 'workbench', 'docker', 'replication'
  ],
  'mongodb': [
    'nodejs', 'express', 'python', 'mongoose', 'docker', 'atlas',
    'aggregation', 'indexing'
  ],
  'cassandra': [
    'java', 'python-de', 'cql', 'spark-de', 'docker', 'kubernetes',
    'distributed-systems'
  ],
  'dynamodb': [
    'aws', 'nodejs', 'python', 'lambda', 'nosql', 'partition-keys'
  ],
  
  // Caching
  'redis': [
    'nodejs', 'python', 'docker', 'kubernetes', 'memcached', 'caching',
    'pub-sub', 'lua'
  ],
  'memcached': [
    'redis', 'python', 'nodejs', 'caching', 'distributed-systems'
  ],
  
  // Search
  'elasticsearch': [
    'kibana', 'logstash', 'python-de', 'java', 'docker', 'kubernetes',
    'full-text-search', 'aggregations'
  ],
  
  // Streaming
  'kafka': [
    'java', 'python-de', 'scala', 'spark-de', 'flink', 'zookeeper',
    'docker', 'kubernetes', 'streaming'
  ],
  'flink': [
    'java', 'scala', 'kafka', 'spark-de', 'docker', 'kubernetes',
    'stream-processing'
  ],
  
  // Orchestration
  'airflow': [
    'python-de', 'docker', 'kubernetes', 'sql', 'pandas', 'dbt',
    'scheduling', 'dag'
  ],
  'luigi': [
    'python-de', 'hadoop', 'spark-de', 'workflow-orchestration'
  ],
  
  // Big Data Processing
  'spark-de': [
    'scala', 'python-de', 'hadoop', 'kafka', 'delta-lake', 'databricks',
    'sql', 'pyspark'
  ],
  'hadoop': [
    'java', 'hive', 'spark-de', 'yarn', 'hdfs', 'mapreduce'
  ],
  'hive': [
    'hadoop', 'sql', 'spark-de', 'presto', 'hql'
  ],
  
  // Data Warehouses
  'snowflake': [
    'sql', 'python-de', 'dbt', 'airflow', 'tableau', 'power-bi',
    'data-modeling', 'etl'
  ],
  'redshift': [
    'aws', 'sql', 'python-de', 'postgresql', 's3', 'spectrum', 'etl'
  ],
  'bigquery': [
    'gcp', 'sql', 'python-de', 'looker', 'dataflow', 'standard-sql'
  ],
  
  // Data Platforms
  'databricks': [
    'spark-de', 'python-de', 'scala', 'delta-lake', 'mlflow', 'sql',
    'notebooks'
  ],

  // ============================================================================
  // CYBERSECURITY
  // ============================================================================
  
  // Offensive Security
  'penetration-testing': [
    'ethical-hacking', 'metasploit', 'burp-suite', 'nmap', 'kali-linux',
    'owasp', 'networking', 'linux'
  ],
  'ethical-hacking': [
    'penetration-testing', 'metasploit', 'burp-suite', 'wireshark',
    'kali-linux', 'python', 'bash', 'networking'
  ],
  
  // Security Tools
  'metasploit': [
    'kali-linux', 'ruby', 'python', 'networking', 'exploitation',
    'post-exploitation'
  ],
  'burp-suite': [
    'owasp', 'web-security', 'pentesting', 'proxy', 'scanner'
  ],
  'wireshark': [
    'networking', 'tcp-ip', 'packet-analysis', 'protocols', 'forensics'
  ],
  'nmap': [
    'networking', 'port-scanning', 'kali-linux', 'python', 'scripting'
  ],
  
  // Operating Systems (Security)
  'kali-linux': [
    'linux', 'bash', 'python', 'metasploit', 'burp-suite', 'nmap',
    'wireshark', 'penetration-testing'
  ],
  
  // Security Knowledge
  'owasp': [
    'web-security', 'burp-suite', 'zap', 'injection', 'xss', 'csrf',
    'authentication'
  ],
  'cryptography': [
    'ssl-tls', 'encryption', 'hashing', 'pki', 'certificates', 'openssl'
  ],
  
  // Defensive Security
  'network-security': [
    'firewall', 'ids-ips', 'vpn', 'networking', 'tcp-ip', 'segmentation'
  ],
  'firewall': [
    'network-security', 'iptables', 'pfsense', 'cisco', 'policies'
  ],
  'ids-ips': [
    'snort', 'suricata', 'network-security', 'siem', 'threat-detection'
  ],
  
  // Monitoring
  'siem': [
    'splunk', 'elk', 'log-analysis', 'correlation', 'threat-hunting'
  ],
  'splunk': [
    'siem', 'log-analysis', 'spl', 'dashboards', 'alerts'
  ],
  
  // Incident Response
  'incident-response': [
    'forensics', 'malware-analysis', 'threat-hunting', 'siem', 'playbooks'
  ],
  'forensics': [
    'incident-response', 'autopsy', 'volatility', 'disk-analysis',
    'memory-analysis'
  ],
  'malware-analysis': [
    'forensics', 'reverse-engineering', 'ida-pro', 'ghidra', 'x64dbg',
    'yara'
  ],

  // ============================================================================
  // GAME DEVELOPMENT
  // ============================================================================
  
  // Game Engines
  'unity': [
    'csharp-game', 'blender', '3d-modeling', 'animation', 'physics',
    'lighting', 'ai-programming', 'shader'
  ],
  'unreal': [
    'cpp', 'blueprints', 'animation', '3d-modeling', 'niagara', 'materials',
    'lighting', 'physics'
  ],
  'godot': [
    'gdscript', 'csharp-game', 'animation', '2d-3d', 'physics', 'scripting'
  ],
  
  // Programming Languages (Game)
  'csharp-game': [
    'unity', 'godot', 'dotnet', 'visual-studio', 'monogame'
  ],
  'cpp': [
    'unreal', 'opengl', 'directx', 'vulkan', 'sdl', 'game-physics',
    'data-structures'
  ],
  'gdscript': [
    'godot', 'python', 'scripting', 'game-logic'
  ],
  
  // Visual Scripting
  'blueprints': [
    'unreal', 'cpp', 'visual-programming', 'game-logic'
  ],
  
  // 3D Tools
  '3d-modeling': [
    'blender', 'maya', 'zbrush', 'substance', 'texturing', 'topology',
    'uv-mapping'
  ],
  'blender': [
    '3d-modeling', 'animation', 'rigging', 'rendering', 'sculpting',
    'python', 'unity', 'unreal'
  ],
  'maya': [
    '3d-modeling', 'animation', 'rigging', 'mel', 'python', 'arnold'
  ],
  'substance': [
    'texturing', 'pbr', 'materials', '3d-modeling', 'unity', 'unreal'
  ],
  
  // 2D Tools
  'photoshop': [
    'textures', '2d-art', 'ui-design', 'concept-art', 'sprite-sheets'
  ],
  
  // Game Programming
  'game-physics': [
    'unity', 'unreal', 'cpp', 'mathematics', 'collision-detection',
    'rigid-body'
  ],
  'ai-programming': [
    'unity', 'unreal', 'behavior-trees', 'pathfinding', 'state-machines',
    'navmesh'
  ],
  'multiplayer': [
    'unity', 'unreal', 'photon', 'mirror', 'networking', 'synchronization',
    'lag-compensation'
  ],
  
  // Graphics Programming
  'shader': [
    'hlsl', 'glsl', 'unity', 'unreal', 'opengl', 'directx', 'rendering'
  ],
  'opengl': [
    'cpp', 'glsl', 'shader', 'graphics-programming', '3d-rendering'
  ],
  'directx': [
    'cpp', 'hlsl', 'shader', 'graphics-programming', 'windows'
  ],

  // ============================================================================
  // DATA SCIENCE
  // ============================================================================
  
  // Programming Languages (DS)
  'python-ds': [
    'pandas-ds', 'numpy-ds', 'scipy', 'matplotlib-ds', 'seaborn-ds',
    'scikit', 'jupyter', 'sql', 'statistics'
  ],
  'r-ds': [
    'ggplot2', 'dplyr', 'tidyr', 'caret', 'shiny', 'rstudio', 'statistics'
  ],
  
  // Mathematics
  'statistics': [
    'python-ds', 'r-ds', 'probability', 'hypothesis-testing', 'regression',
    'anova', 'bayesian'
  ],
  'probability': [
    'statistics', 'python-ds', 'r-ds', 'distributions', 'bayesian'
  ],
  'linear-algebra': [
    'numpy-ds', 'python-ds', 'tensorflow', 'pytorch', 'matrices', 'vectors'
  ],
  
  // Data Libraries
  'pandas-ds': [
    'python-ds', 'numpy-ds', 'matplotlib-ds', 'seaborn-ds', 'sql',
    'data-cleaning', 'etl'
  ],
  'numpy-ds': [
    'python-ds', 'pandas-ds', 'scipy', 'matplotlib-ds', 'scikit',
    'linear-algebra'
  ],
  'scipy': [
    'python-ds', 'numpy-ds', 'statistics', 'optimization', 'signal-processing'
  ],
  
  // Visualization
  'matplotlib-ds': [
    'python-ds', 'numpy-ds', 'pandas-ds', 'seaborn-ds', 'jupyter'
  ],
  'seaborn-ds': [
    'python-ds', 'pandas-ds', 'matplotlib-ds', 'statistics', 'jupyter'
  ],
  'plotly': [
    'python-ds', 'pandas-ds', 'dash', 'interactive-viz', 'javascript'
  ],
  
  // BI Tools
  'tableau': [
    'sql', 'excel', 'data-viz', 'dashboards', 'calculated-fields', 'lod'
  ],
  'power-bi': [
    'sql', 'excel', 'dax', 'power-query', 'data-modeling', 'dashboards'
  ],
  'excel': [
    'power-bi', 'tableau', 'vba', 'pivot-tables', 'vlookup', 'statistics'
  ],
  
  // Analysis Types
  'hypothesis-testing': [
    'statistics', 'python-ds', 'r-ds', 'ab-testing', 't-test', 'anova'
  ],
  'regression': [
    'statistics', 'python-ds', 'r-ds', 'scikit', 'linear-regression',
    'logistic-regression'
  ],
  'time-series': [
    'python-ds', 'r-ds', 'pandas-ds', 'arima', 'prophet', 'forecasting'
  ],
  'ab-testing': [
    'statistics', 'hypothesis-testing', 'python-ds', 'experimentation',
    'causal-inference'
  ],

  // ============================================================================
  // UI/UX DESIGN
  // ============================================================================
  
  // Design Tools
  'figma': [
    'sketch', 'adobe-xd', 'prototyping', 'design-systems', 'auto-layout',
    'components', 'plugins'
  ],
  'sketch': [
    'figma', 'adobe-xd', 'invision', 'prototyping', 'symbols', 'macos'
  ],
  'adobe-xd': [
    'figma', 'sketch', 'photoshop-ui', 'illustrator', 'prototyping',
    'auto-animate'
  ],
  'photoshop-ui': [
    'illustrator', 'figma', 'adobe-xd', 'image-editing', 'mockups'
  ],
  'illustrator': [
    'photoshop-ui', 'adobe-xd', 'figma', 'vector-graphics', 'icons',
    'logos'
  ],
  
  // Prototyping Tools
  'invision': [
    'sketch', 'figma', 'prototyping', 'collaboration', 'handoff'
  ],
  'framer': [
    'figma', 'react', 'typescript', 'prototyping', 'code-components',
    'animation'
  ],
  'protopie': [
    'figma', 'sketch', 'prototyping', 'advanced-interactions', 'sensors'
  ],
  
  // Research
  'user-research': [
    'usability-testing', 'interviews', 'surveys', 'personas', 'journey-maps',
    'analytics'
  ],
  'usability-testing': [
    'user-research', 'prototyping', 'heuristics', 'a-b-testing',
    'eye-tracking'
  ],
  
  // Design Activities
  'wireframing': [
    'figma', 'sketch', 'adobe-xd', 'prototyping', 'information-architecture',
    'low-fidelity'
  ],
  'prototyping': [
    'figma', 'framer', 'protopie', 'wireframing', 'user-testing',
    'high-fidelity'
  ],
  'visual-design': [
    'figma', 'photoshop-ui', 'illustrator', 'typography', 'color-theory',
    'layout'
  ],
  'interaction-design': [
    'prototyping', 'animation', 'microinteractions', 'user-flows',
    'state-management'
  ],
  'design-systems': [
    'figma', 'storybook', 'design-tokens', 'components', 'documentation',
    'atomic-design'
  ],
  
  // Standards
  'accessibility': [
    'wcag', 'aria', 'screen-readers', 'keyboard-navigation', 'color-contrast',
    'semantic-html'
  ],
  'responsive-design': [
    'html', 'css', 'tailwind', 'breakpoints', 'mobile-first', 'fluid-layouts'
  ],
  
  // Methodology
  'design-thinking': [
    'user-research', 'ideation', 'prototyping', 'testing', 'empathy-mapping',
    'iteration'
  ],

  // ============================================================================
  // BLOCKCHAIN
  // ============================================================================
  
  // Programming Languages (Blockchain)
  'solidity': [
    'ethereum', 'hardhat', 'truffle', 'web3js', 'ethersjs', 'openzeppelin',
    'smart-contracts', 'remix'
  ],
  'rust-blockchain': [
    'solana', 'substrate', 'polkadot', 'near', 'anchor', 'smart-contracts'
  ],
  
  // Platforms
  'ethereum': [
    'solidity', 'web3js', 'ethersjs', 'hardhat', 'truffle', 'metamask',
    'infura', 'alchemy'
  ],
  'hyperledger': [
    'fabric', 'composer', 'go', 'nodejs', 'chaincode', 'permissioned'
  ],
  'polkadot': [
    'substrate', 'rust-blockchain', 'parachains', 'relay-chain', 'xcm'
  ],
  
  // Smart Contracts
  'smart-contracts': [
    'solidity', 'ethereum', 'hardhat', 'truffle', 'security', 'auditing',
    'gas-optimization'
  ],
  
  // Web3 Libraries
  'web3js': [
    'ethereum', 'solidity', 'nodejs', 'javascript', 'metamask', 'web3-react'
  ],
  'ethersjs': [
    'ethereum', 'solidity', 'typescript', 'nodejs', 'react', 'metamask'
  ],
  
  // Development Tools
  'hardhat': [
    'solidity', 'ethereum', 'javascript', 'typescript', 'testing', 'deployment'
  ],
  'truffle': [
    'solidity', 'ethereum', 'ganache', 'javascript', 'testing', 'migration'
  ],
  
  // Wallets
  'metamask': [
    'ethereum', 'web3js', 'ethersjs', 'browser-extension', 'dapp-integration'
  ],
  
  // Storage
  'ipfs': [
    'filecoin', 'pinata', 'nft', 'decentralized-storage', 'content-addressing'
  ],
  
  // Domains
  'defi': [
    'solidity', 'ethereum', 'uniswap', 'aave', 'compound', 'liquidity-pools',
    'amm'
  ],
  'nft': [
    'solidity', 'ethereum', 'ipfs', 'erc721', 'erc1155', 'opensea', 'metadata'
  ],
  'dao': [
    'solidity', 'ethereum', 'governance', 'voting', 'multisig', 'gnosis-safe'
  ],
  
  // Knowledge
  'consensus': [
    'pow', 'pos', 'pbft', 'raft', 'distributed-systems', 'blockchain-basics'
  ],
  'cryptography-bc': [
    'hashing', 'digital-signatures', 'elliptic-curves', 'merkle-trees',
    'zero-knowledge'
  ],

  // ============================================================================
  // AI & AUTOMATION
  // ============================================================================
  
  // LLM APIs
  'chatgpt': [
    'openai', 'langchain', 'prompt-engineering', 'embeddings', 'rag',
    'function-calling'
  ],
  'openai': [
    'chatgpt', 'gpt-4', 'embeddings', 'langchain', 'python', 'nodejs',
    'api-integration'
  ],
  'claude': [
    'anthropic', 'langchain', 'prompt-engineering', 'long-context',
    'api-integration'
  ],
  
  // AI Frameworks
  'langchain': [
    'python', 'openai', 'claude', 'embeddings', 'vector-db', 'rag',
    'agents', 'chains'
  ],
  'llamaindex': [
    'python', 'openai', 'embeddings', 'vector-db', 'rag', 'data-connectors',
    'indices'
  ],
  
  // Skills
  'prompt-engineering': [
    'openai', 'claude', 'langchain', 'few-shot', 'chain-of-thought',
    'temperature'
  ],
  
  // RPA
  'rpa': [
    'uipath', 'automation-anywhere', 'python', 'process-automation',
    'workflow'
  ],
  'uipath': [
    'rpa', 'vb.net', 'orchestrator', 'studio', 'process-mining'
  ],
  'automation-anywhere': [
    'rpa', 'bot-creation', 'control-room', 'iq-bot'
  ],
  
  // Test Automation
  'selenium': [
    'python', 'java', 'javascript', 'webdriver', 'testing', 'page-object'
  ],
  'puppeteer': [
    'nodejs', 'javascript', 'headless-chrome', 'web-scraping', 'testing'
  ],
  'playwright': [
    'nodejs', 'python', 'typescript', 'cross-browser', 'testing', 'debugging'
  ],
  
  // Vector Databases
  'vector-db': [
    'pinecone', 'weaviate', 'qdrant', 'milvus', 'embeddings', 'similarity-search'
  ],
  'pinecone': [
    'vector-db', 'langchain', 'embeddings', 'openai', 'semantic-search'
  ],
  
  // AI Architectures
  'rag': [
    'langchain', 'llamaindex', 'vector-db', 'embeddings', 'retrieval',
    'generation'
  ],
  'fine-tuning': [
    'openai', 'huggingface', 'pytorch', 'tensorflow', 'lora', 'qlora',
    'training'
  ],
  'agent-frameworks': [
    'langchain', 'autogpt', 'tools', 'reasoning', 'planning', 'memory'
  ],

  // ============================================================================
  // NETWORKING
  // ============================================================================
  
  // Protocols
  'tcp-ip': [
    'networking', 'routing', 'switching', 'subnetting', 'osi-model',
    'packet-analysis'
  ],
  'http-https': [
    'ssl-tls', 'rest', 'graphql', 'cors', 'headers', 'status-codes'
  ],
  'dns': [
    'bind', 'dnssec', 'zones', 'records', 'caching', 'resolution'
  ],
  'dhcp': [
    'networking', 'ip-addressing', 'leases', 'reservations', 'relay'
  ],
  
  // Core Networking
  'routing': [
    'tcp-ip', 'bgp', 'ospf', 'eigrp', 'static-routes', 'dynamic-routing'
  ],
  'switching': [
    'vlan', 'stp', 'port-security', 'trunking', 'layer2'
  ],
  'vlan': [
    'switching', 'trunking', '802.1q', 'inter-vlan-routing', 'segmentation'
  ],
  
  // Security
  'vpn': [
    'ipsec', 'ssl-vpn', 'wireguard', 'openvpn', 'site-to-site', 'remote-access'
  ],
  
  // Vendors
  'cisco': [
    'ios', 'ccna', 'ccnp', 'routing', 'switching', 'asa', 'nexus'
  ],
  'juniper': [
    'junos', 'jncia', 'routing', 'switching', 'srx', 'mx-series'
  ],
  
  // Infrastructure
  'load-balancing': [
    'nginx', 'haproxy', 'f5', 'algorithms', 'health-checks', 'ssl-offload'
  ],
  'cdn': [
    'cloudflare', 'akamai', 'caching', 'edge-locations', 'performance'
  ],
  
  // Management
  'network-monitoring': [
    'snmp', 'netflow', 'syslog', 'nagios', 'zabbix', 'prtg'
  ],
  'packet-analysis': [
    'wireshark', 'tcpdump', 'tcp-ip', 'troubleshooting', 'forensics'
  ],
  
  // Advanced Protocols
  'bgp': [
    'routing', 'as-numbers', 'peering', 'route-maps', 'communities'
  ],
  'ospf': [
    'routing', 'link-state', 'areas', 'dr-bdr', 'lsa'
  ],
  'mpls': [
    'routing', 'labels', 'vpn', 'traffic-engineering', 'qos'
  ],
};

// ============================================================================
// SKILL CATEGORIES FOR BETTER ORGANIZATION
// ============================================================================

export const skillCategories = {
  'framework': 'Framework',
  'language': 'Language',
  'library': 'Library',
  'tool': 'Tool',
  'platform': 'Platform',
  'database': 'Database',
  'cloud': 'Cloud Service',
  'testing': 'Testing',
  'styling': 'Styling',
  'state-management': 'State Management',
  'runtime': 'Runtime',
  'api': 'API Technology',
  'containerization': 'Containerization',
  'orchestration': 'Orchestration',
  'ci-cd': 'CI/CD',
  'iac': 'Infrastructure as Code',
  'monitoring': 'Monitoring',
  'logging': 'Logging',
  'web-server': 'Web Server',
  'os': 'Operating System',
  'scripting': 'Scripting',
  'visualization': 'Visualization',
  'computer-vision': 'Computer Vision',
  'nlp': 'Natural Language Processing',
  'mlops': 'MLOps',
  'big-data': 'Big Data',
  'cache': 'Caching',
  'search': 'Search Engine',
  'streaming': 'Streaming',
  'processing': 'Data Processing',
  'warehouse': 'Data Warehouse',
  'offensive': 'Offensive Security',
  'defensive': 'Defensive Security',
  'investigation': 'Security Investigation',
  'governance': 'Security Governance',
  'engine': 'Game Engine',
  'art': 'Game Art',
  'graphics': 'Graphics Programming',
  'programming': 'Game Programming',
  'mathematics': 'Mathematics',
  'analysis': 'Data Analysis',
  'experimentation': 'Experimentation',
  'bi-tools': 'Business Intelligence',
  'research': 'User Research',
  'design': 'Design',
  'prototyping': 'Prototyping',
  'standards': 'Design Standards',
  'methodology': 'Design Methodology',
  'knowledge': 'Knowledge Area',
  'domain': 'Domain',
  'development': 'Development',
  'wallet': 'Crypto Wallet',
  'storage': 'Storage',
  'llm': 'Large Language Model',
  'automation': 'Automation',
  'architecture': 'Architecture',
  'training': 'Model Training',
  'protocols': 'Network Protocols',
  'core': 'Core Networking',
  'security': 'Network Security',
  'vendor': 'Network Vendor',
  'infrastructure': 'Infrastructure',
  'management': 'Network Management',
  'advanced': 'Advanced Networking'
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get recommended skills for a given skill
 * @param {string} skillId - The ID of the skill
 * @param {number} limit - Maximum number of recommendations to return
 * @returns {string[]} Array of recommended skill IDs
 */
export const getSkillRecommendations = (skillId, limit = 6) => {
  const recommendations = skillRecommendations[skillId] || [];
  return limit ? recommendations.slice(0, limit) : recommendations;
};

/**
 * Get all skills that recommend a given skill (reverse lookup)
 * @param {string} skillId - The ID of the skill
 * @returns {string[]} Array of skill IDs that recommend this skill
 */
export const getSkillsRecommendingThis = (skillId) => {
  const recommenders = [];
  Object.entries(skillRecommendations).forEach(([key, values]) => {
    if (values.includes(skillId)) {
      recommenders.push(key);
    }
  });
  return recommenders;
};

/**
 * Get skill path (learning journey) from skill A to skill B
 * @param {string} startSkillId - Starting skill
 * @param {string} endSkillId - Target skill
 * @returns {string[]} Array representing the learning path
 */
export const getSkillPath = (startSkillId, endSkillId) => {
  // Simple BFS to find shortest path
  const queue = [[startSkillId]];
  const visited = new Set([startSkillId]);
  
  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1];
    
    if (current === endSkillId) {
      return path;
    }
    
    const recommendations = skillRecommendations[current] || [];
    for (const skill of recommendations) {
      if (!visited.has(skill)) {
        visited.add(skill);
        queue.push([...path, skill]);
      }
    }
  }
  
  return []; // No path found
};

/**
 * Get common skills between two skills
 * @param {string} skillId1 - First skill ID
 * @param {string} skillId2 - Second skill ID
 * @returns {string[]} Array of common recommended skills
 */
export const getCommonSkills = (skillId1, skillId2) => {
  const skills1 = new Set(skillRecommendations[skillId1] || []);
  const skills2 = new Set(skillRecommendations[skillId2] || []);
  return [...skills1].filter(skill => skills2.has(skill));
};

/**
 * Get skill difficulty level based on number of prerequisites
 * @param {string} skillId - The skill ID
 * @returns {string} 'beginner', 'intermediate', or 'advanced'
 */
export const getSkillDifficulty = (skillId) => {
  const prerequisites = getSkillsRecommendingThis(skillId);
  if (prerequisites.length <= 2) return 'beginner';
  if (prerequisites.length <= 5) return 'intermediate';
  return 'advanced';
};

export default skillRecommendations;