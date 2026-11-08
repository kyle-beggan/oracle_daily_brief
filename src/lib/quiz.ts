export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  category:
    | "Oracle 26ai"
    | "AI Capabilities"
    | "Oracle Cloud Infrastructure"
    | "Cloud Migration & Multi-Cloud"
    | "Tech Modernization";
  installBase: "Existing Oracle Install Base" | "No Current Oracle Install Base";
  scenario: string;
  options: QuizOption[];
  explanation: string;
}

export const SALES_QUIZ_POOL: QuizQuestion[] = [
  // ============================================================================
  // ORACLE 26ai — EXISTING ORACLE INSTALL BASE
  // ============================================================================
  {
    id: "q-26ai-vector-existing",
    category: "Oracle 26ai",
    installBase: "Existing Oracle Install Base",
    scenario:
      "An agency CIO says: \"We store our mission case records in Oracle Database, and AWS is pitching us Amazon OpenSearch and Pinecone so our team can run vector similarity searches alongside our case data. What is Oracle's advantage here?\"",
    options: [
      {
        text: "Oracle 26ai embeds AI Vector Search right inside the database, letting you query vectors and live relational data together in one SQL query.",
        isCorrect: true,
      },
      {
        text: "Oracle 26ai includes a dedicated OCI OpenSearch cluster that replicates your relational tables out to a vector engine every five minutes.",
        isCorrect: false,
      },
      {
        text: "Oracle 26ai uses Select AI to convert your relational tables into external Pinecone-compatible vector files stored in OCI Object Storage.",
        isCorrect: false,
      },
      {
        text: "Oracle 26ai replaces traditional SQL queries with a specialized vector-only query language that runs on dedicated OCI GPU nodes.",
        isCorrect: false,
      },
    ],
    explanation:
      "AI Vector Search in Oracle 26ai runs inside the core database engine using standard SQL—not in a separate cluster or external object storage—eliminating data movement, sync lag, and security fragmentation.",
  },
  {
    id: "q-26ai-select-ai-existing",
    category: "Oracle 26ai",
    installBase: "Existing Oracle Install Base",
    scenario:
      "An agency Deputy Director says: \"Our field analysts don't know SQL, and Microsoft is pitching us exporting our Oracle data into Fabric so analysts can ask operational questions in plain English. Which Oracle capability directly addresses this?\"",
    options: [
      {
        text: "Select AI in Autonomous Database translates plain-English prompts directly into secure SQL against live Oracle data without exporting records.",
        isCorrect: true,
      },
      {
        text: "Oracle True Cache automatically pre-generates natural-language summaries from your database redo logs and publishes them every hour.",
        isCorrect: false,
      },
      {
        text: "JSON Relational Duality lets non-technical analysts type conversational English prompts into any browser and stores the answers as JSON.",
        isCorrect: false,
      },
      {
        text: "Oracle Data Safe includes a built-in natural-language copilot that copies your operational tables into an OCI data lakehouse for analysts to query.",
        isCorrect: false,
      },
    ],
    explanation:
      "Select AI is the specific Autonomous Database feature that converts natural-language questions into SQL against live data, whereas True Cache is for middle-tier caching, JSON Duality is for app development, and Data Safe is for database security.",
  },
  {
    id: "q-26ai-json-duality-existing",
    category: "Oracle 26ai",
    installBase: "Existing Oracle Install Base",
    scenario:
      "An application lead at an agency with an existing Oracle footprint says: \"My developers want MongoDB Atlas for a new citizen portal because they want to read and write JSON documents, while my data team still needs relational SQL reporting.\"",
    options: [
      {
        text: "JSON Relational Duality in Oracle 26ai lets apps read and write JSON documents while storing the data as normalized relational tables for SQL.",
        isCorrect: true,
      },
      {
        text: "Oracle Autonomous JSON Database stores data exclusively as BSON files and uses nightly GoldenGate batch jobs to convert them into SQL tables.",
        isCorrect: false,
      },
      {
        text: "Oracle 26ai True Cache intercepts MongoDB API calls at the network edge and translates them into static flat files inside OCI Object Storage.",
        isCorrect: false,
      },
      {
        text: "Oracle APEX automatically wraps legacy relational tables in a proprietary XML-to-JSON gateway, provided developers write all backend logic in PL/SQL.",
        isCorrect: false,
      },
    ],
    explanation:
      "JSON Relational Duality Views in Oracle 26ai store data once as normalized relational tables while exposing it simultaneously as JSON documents—with no batch ETL or dual storage needed.",
  },
  {
    id: "q-26ai-upgrade-value-existing",
    category: "Oracle 26ai",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A customer running Oracle Database 19c on-premises asks: \"AWS is pitching us a simple lift-and-shift of our 19c databases onto Amazon EC2 virtual machines. What is our strongest counter-pitch for moving to Oracle 26ai on OCI?\"",
    options: [
      {
        text: "Oracle 26ai on OCI delivers long-term support with built-in AI Vector Search, Exadata performance, and Autonomous self-patching that EC2 lacks.",
        isCorrect: true,
      },
      {
        text: "Oracle Database 19c is not supported on Amazon EC2 virtual machines, so lifting and shifting 19c to AWS immediately voids your support contract.",
        isCorrect: false,
      },
      {
        text: "Moving to Oracle 26ai on OCI automatically converts all of your on-premises processor licenses into unlimited enterprise-wide SaaS subscriptions.",
        isCorrect: false,
      },
      {
        text: "Oracle 26ai on OCI uses a brand-new non-relational storage engine that eliminates SQL schemas entirely for 10x faster batch processing than EC2.",
        isCorrect: false,
      },
    ],
    explanation:
      "While 19c can technically run on EC2, doing so leaves the customer on generic VMs doing manual administration. Moving to 26ai on OCI unlocks long-term support, native AI capabilities, Exadata performance, and Autonomous operations.",
  },
  {
    id: "q-26ai-true-cache-existing",
    category: "Oracle 26ai",
    installBase: "Existing Oracle Install Base",
    scenario:
      "An enterprise architect says: \"Our benefits portal has heavy read traffic, and AWS is recommending we put Amazon ElastiCache (Redis) in front of our Oracle database. How should you position Oracle 26ai instead?\"",
    options: [
      {
        text: "Oracle 26ai True Cache is an in-memory middle-tier cache that stays automatically consistent with the database without custom Redis sync code.",
        isCorrect: true,
      },
      {
        text: "Oracle 26ai includes a managed Redis cluster inside Autonomous Database that translates Redis key-value scripts into PL/SQL stored procedures.",
        isCorrect: false,
      },
      {
        text: "Oracle GoldenGate Cache Tier replicates read-only snapshots of your database onto the client's web browser so read queries skip the network.",
        isCorrect: false,
      },
      {
        text: "Oracle Exadata Smart Flash Cache replaces middle-tier caching by moving your entire application web server tier into the database storage rack.",
        isCorrect: false,
      },
    ],
    explanation:
      "True Cache in Oracle 26ai is a diskless, in-memory middle-tier cache that automatically stays transactionally consistent with the primary Oracle database—unlike Redis, which requires manual application cache management.",
  },

  // ============================================================================
  // ORACLE 26ai — NO CURRENT ORACLE INSTALL BASE (GREENFIELD)
  // ============================================================================
  {
    id: "q-26ai-converged-greenfield",
    category: "Oracle 26ai",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A prospect on AWS with no Oracle footprint says: \"We're currently paying for four separate AWS databases—RDS for relational, DynamoDB for JSON, Neptune for graph, and OpenSearch for vectors. How do we pitch Oracle's architecture against this?\"",
    options: [
      {
        text: "Oracle 26ai is a converged database that natively runs relational, JSON, Graph, Spatial, and AI Vector workloads inside one unified engine.",
        isCorrect: true,
      },
      {
        text: "OCI bundles four separate open-source database clusters—PostgreSQL, MongoDB, Neo4j, and Milvus—under one invoice with automated cross-cluster ETL.",
        isCorrect: false,
      },
      {
        text: "Oracle Autonomous Data Warehouse replaces those four databases by converting all transactional and graph workloads into Parquet files in Object Storage.",
        isCorrect: false,
      },
      {
        text: "OCI Dedicated Region lets you run AWS RDS, DynamoDB, Neptune, and OpenSearch natively on Oracle hardware using an emulation layer.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle's converged database architecture runs relational, JSON, Graph, Spatial, and Vector workloads natively inside a single database engine with unified security, HA, and SQL access.",
  },
  {
    id: "q-26ai-rag-greenfield",
    category: "Oracle 26ai",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A Chief Data Officer at a non-Oracle agency asks: \"We're building a Retrieval-Augmented Generation (RAG) app on Azure, but our standalone vector database doesn't enforce the row-level security rules from our transactional database. How does Oracle 26ai solve this?\"",
    options: [
      {
        text: "Storing vectors inside Oracle 26ai alongside operational rows means every vector search automatically enforces existing database row-level security.",
        isCorrect: true,
      },
      {
        text: "Oracle 26ai encrypts each vector with a separate hardware key and provisions a dedicated, isolated vector database instance for every individual user.",
        isCorrect: false,
      },
      {
        text: "OCI Generative AI rewrites the LLM system prompt after the query runs to redact any sensitive rows returned from the unsegmented vector index.",
        isCorrect: false,
      },
      {
        text: "Oracle Data Safe scans your external vector database every night and deletes any vector embeddings generated from restricted records.",
        isCorrect: false,
      },
    ],
    explanation:
      "When vectors and relational data live together in Oracle 26ai, existing database security policies (such as Virtual Private Database and Real Application Security) filter vector search results in real time.",
  },

  // ============================================================================
  // AI CAPABILITIES — EXISTING & GREENFIELD
  // ============================================================================
  {
    id: "q-ai-data-privacy-greenfield",
    category: "AI Capabilities",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A CISO at an agency with no current Oracle footprint says: \"We want to fine-tune and run LLMs on agency data, but we're concerned about shared multi-tenant GPU endpoints on other clouds and whether our prompts or weights could leak.\"",
    options: [
      {
        text: "OCI Generative AI Dedicated AI Clusters isolate GPUs, fine-tuned weights, and prompts to your tenancy so they are never shared with other customers.",
        isCorrect: true,
      },
      {
        text: "OCI Generative AI downloads open-source foundation models onto your end-users' government laptops so inference never runs in a cloud data center.",
        isCorrect: false,
      },
      {
        text: "OCI Generative AI anonymizes your prompts using GoldenGate data masking before routing them through shared public model APIs hosted by startups.",
        isCorrect: false,
      },
      {
        text: "OCI Generative AI requires purchasing physical NVIDIA DGX racks upfront and installing them inside your own agency building before fine-tuning models.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI Generative AI Dedicated AI Clusters allocate single-tenant GPU infrastructure in the cloud for a customer's fine-tuning and inference workloads, ensuring predictable performance and strict data isolation.",
  },
  {
    id: "q-ai-bring-ai-to-data-existing",
    category: "AI Capabilities",
    installBase: "Existing Oracle Install Base",
    scenario:
      "An executive at an Oracle customer says: \"Databricks and AWS are pitching us an 18-month project to extract all of our Oracle data into their cloud lakehouse before we can start rolling out AI use cases. What is the best strategic response?\"",
    options: [
      {
        text: "Oracle 26ai and OCI Generative AI bring AI directly to where your governed data already lives, avoiding an 18-month migration and egress fees.",
        isCorrect: true,
      },
      {
        text: "We can match that architecture by using OCI Data Integration to copy all of your Oracle tables into a separate OCI HDFS cluster for Spark jobs.",
        isCorrect: false,
      },
      {
        text: "Oracle's licensing rules prohibit extracting data into Databricks or AWS, so your agency is contractually required to use Oracle Analytics Cloud.",
        isCorrect: false,
      },
      {
        text: "You should freeze all transactional database upgrades for 18 months while our team rebuilds your relational schemas into specialized AI tensor files.",
        isCorrect: false,
      },
    ],
    explanation:
      "'Bring AI to your data, not your data to AI' is Oracle's core differentiator—letting customers run AI Vector Search, Select AI, OML, and OCI GenAI against their authoritative data immediately without costly data migration.",
  },
  {
    id: "q-ai-gpu-training-greenfield",
    category: "AI Capabilities",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A federal AI program manager with no Oracle install base asks: \"We already use AWS and Azure, yet leading AI model builders and defense contractors keep choosing OCI for large GPU workloads. What architectural advantage drives that?\"",
    options: [
      {
        text: "OCI combines bare-metal GPU instances with ultra-low-latency RoCEv2 RDMA cluster networking, eliminating hypervisor overhead across thousands of GPUs.",
        isCorrect: true,
      },
      {
        text: "OCI uses a proprietary hypervisor that compresses GPU memory by 4x, allowing four virtual machines to share a single physical GPU without loss.",
        isCorrect: false,
      },
      {
        text: "OCI GPU Superclusters replace standard NVIDIA GPUs with custom Oracle SPARC AI processors that run PyTorch models without cluster networking.",
        isCorrect: false,
      },
      {
        text: "OCI runs all GPU training jobs inside Oracle Exadata storage servers, offloading neural network training directly to the database flash tier.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI's Gen 2 bare-metal GPU architecture and non-blocking RoCEv2 (RDMA over Converged Ethernet) cluster networking provide bare-metal speed and microsecond latency without a virtualization tax.",
  },
  {
    id: "q-ai-autonomous-ml-existing",
    category: "AI Capabilities",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A fraud analytics lead says: \"Every night my data scientists extract terabytes of transaction records out of Oracle into Amazon SageMaker to train and score fraud models, costing us a fortune in data transfer and compute.\"",
    options: [
      {
        text: "Oracle Machine Learning (OML) is included in Autonomous Database, letting you train and score Python or SQL models right inside the database.",
        isCorrect: true,
      },
      {
        text: "OCI Data Science mounts your on-premises database hard drives over the internet so SageMaker notebooks run without AWS compute charges.",
        isCorrect: false,
      },
      {
        text: "Oracle Select AI replaces custom fraud machine learning models by sending nightly transaction batches to a public foundation model.",
        isCorrect: false,
      },
      {
        text: "Oracle Autonomous Recovery Service includes a built-in fraud scoring engine that analyzes backup files in OCI Object Storage.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle Machine Learning (OML) is included with Autonomous Database and executes scalable SQL and Python ML algorithms directly inside the database—eliminating data extraction and separate ML cluster fees.",
  },

  // ============================================================================
  // ORACLE CLOUD INFRASTRUCTURE (OCI) — GREENFIELD & EXISTING
  // ============================================================================
  {
    id: "q-oci-egress-cost-greenfield",
    category: "Oracle Cloud Infrastructure",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A cloud budget director at an agency running on AWS complains: \"Every time partner components or field offices pull data out of our cloud environment, we get hit with massive outbound data egress charges. How does OCI compare?\"",
    options: [
      {
        text: "OCI includes the first 10 TB of outbound data transfer free each month and charges far lower per-GB egress rates after that than AWS or Azure.",
        isCorrect: true,
      },
      {
        text: "OCI charges the same per-GB outbound egress rates as AWS, but refunds 100% of your bandwidth bill at year-end as Oracle Database license credits.",
        isCorrect: false,
      },
      {
        text: "OCI eliminates outbound data egress fees completely for all traffic over 500 TB per month when stored inside Autonomous Data Warehouse.",
        isCorrect: false,
      },
      {
        text: "OCI waives outbound egress fees inside commercial regions, while charging a 20% sovereign network surcharge in OCI US Government regions.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI provides 10 TB/month of free outbound data transfer and dramatically lower per-GB rates beyond that across both commercial and government regions—saving agencies heavily on data sharing.",
  },
  {
    id: "q-oci-fedramp-gov-greenfield",
    category: "Oracle Cloud Infrastructure",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A federal program manager with no Oracle install base asks: \"We know AWS GovCloud and Azure Government, but they charge a steep price premium over their commercial regions. How does OCI handle government accreditations and pricing?\"",
    options: [
      {
        text: "OCI operates dedicated FedRAMP High, DISA IL5, and classified US Government regions at the exact same low list pricing as our commercial regions.",
        isCorrect: true,
      },
      {
        text: "OCI achieves lower pricing by hosting FedRAMP High and DISA IL5 workloads inside shared commercial data centers using software encryption.",
        isCorrect: false,
      },
      {
        text: "OCI US Government regions match AWS GovCloud's 30% price premium on compute, but include free unlimited Oracle Database Enterprise licenses.",
        isCorrect: false,
      },
      {
        text: "OCI holds FedRAMP High authorization for Oracle Database services only, while general Linux compute and Kubernetes run in commercial regions.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI operates physically isolated, US-citizen-operated Government and DoD regions (FedRAMP High, DISA IL5, IL6/Classified) while maintaining uniform commercial list pricing—avoiding the 'GovCloud markup' charged by other hyperscalers.",
  },
  {
    id: "q-oci-roving-edge-greenfield",
    category: "Oracle Cloud Infrastructure",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A disaster-response operations chief says: \"When hurricanes knock out communications or our vessels are at sea, cloud data centers in Virginia can't help our field teams. What is OCI's disconnected tactical edge capability?\"",
    options: [
      {
        text: "OCI Roving Edge provides ruggedized portable nodes that run OCI compute, storage, GPU AI, and Oracle Database offline and sync when reconnected.",
        isCorrect: true,
      },
      {
        text: "Exadata Cloud@Customer Ultra-Light is a battery-powered array designed solely to capture encrypted backups for physical transport to an OCI region.",
        isCorrect: false,
      },
      {
        text: "OCI Roving Edge nodes provide local Wi-Fi caching in the field, but require a continuous satellite link to the OCI control plane to boot VMs.",
        isCorrect: false,
      },
      {
        text: "OCI Autonomous Edge replicates your cloud VMs directly onto standard iOS and Android devices so agents can run Exadata workloads without servers.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI Roving Edge Infrastructure delivers ruggedized, portable nodes with local CPUs, GPUs, NVMe storage, and OCI software that operate completely disconnected from the internet at the tactical edge.",
  },
  {
    id: "q-oci-dedicated-region-existing",
    category: "Oracle Cloud Infrastructure",
    installBase: "Existing Oracle Install Base",
    scenario:
      "An agency infrastructure director says: \"We looked at AWS Outposts for workloads that must stay inside our secure facility, but Outposts only supports a small fraction of AWS services and can't run our heavy databases. How does Oracle compare?\"",
    options: [
      {
        text: "OCI Dedicated Region and Exadata Cloud@Customer bring the full OCI service catalog and genuine Exadata Autonomous Database into your data center.",
        isCorrect: true,
      },
      {
        text: "Exadata Cloud@Customer lets you purchase the hardware upfront on a 5-year capital lease while your agency DBAs manage all firmware and OS patching.",
        isCorrect: false,
      },
      {
        text: "OCI Dedicated Region runs compute VMs inside your building, but requires storing all database files in a public multi-tenant OCI region.",
        isCorrect: false,
      },
      {
        text: "Like AWS Outposts, Exadata Cloud@Customer only runs standard Linux VMs and does not support Autonomous Database or Exadata Smart Scan.",
        isCorrect: false,
      },
    ],
    explanation:
      "Unlike stripped-down hybrid racks from other clouds, OCI Dedicated Region delivers the complete OCI cloud portfolio (and Exadata Cloud@Customer delivers genuine Autonomous Database on Exadata) inside the customer's own facility.",
  },

  // ============================================================================
  // CLOUD MIGRATION & MULTI-CLOUD — EXISTING & GREENFIELD
  // ============================================================================
  {
    id: "q-multicloud-azure-aws-existing",
    category: "Cloud Migration & Multi-Cloud",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A CIO says: \"Our agency has a large cloud commitment with Microsoft Azure and AWS, so my team is being pressured to move our on-premises Oracle databases onto standard Azure VMs or AWS RDS just to burn down that commit. How should you respond?\"",
    options: [
      {
        text: "Oracle Database@Azure and @AWS run genuine OCI Exadata and Autonomous Database inside Azure and AWS data centers, retiring your cloud commit.",
        isCorrect: true,
      },
      {
        text: "Through the OCI-Azure Interconnect, Microsoft lets you apply 100% of your uncommitted Azure funds toward Linux compute inside Oracle's own data centers.",
        isCorrect: false,
      },
      {
        text: "Oracle Database@Azure installs Autonomous Database software onto standard Microsoft Azure commodity servers managed by Microsoft support.",
        isCorrect: false,
      },
      {
        text: "If you move your databases onto AWS RDS for Oracle, you can still use Oracle Support Rewards to reduce your on-premises Oracle licensing bill.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle Database@Azure, @AWS, and @Google Cloud deploy real OCI-managed Exadata and Autonomous Database hardware physically inside the partner cloud's data centers, retired through the customer's existing cloud marketplace commitment.",
  },
  {
    id: "q-migration-byol-existing",
    category: "Cloud Migration & Multi-Cloud",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A CFO at an existing Oracle customer says: \"AWS told us that bringing our existing on-premises Oracle Database processor licenses (BYOL) to Amazon EC2 costs the exact same in licensing as bringing them to OCI. Why is AWS wrong?\"",
    options: [
      {
        text: "AWS EC2 requires up to 2x as many Oracle licenses per vCPU as OCI under core-factor rules, and only OCI offers Support Rewards on-prem credits.",
        isCorrect: true,
      },
      {
        text: "Oracle does not permit Bring Your Own License (BYOL) on Amazon EC2 or Azure VMs, so running on AWS requires repurchasing 100% of your database licenses.",
        isCorrect: false,
      },
      {
        text: "While vCPU license math is identical between AWS EC2 and OCI, OCI waives annual software support renewals for the first three years after migration.",
        isCorrect: false,
      },
      {
        text: "On OCI, a single on-premises Oracle Standard Edition license automatically upgrades into an unlimited Enterprise Edition with RAC license at no cost.",
        isCorrect: false,
      },
    ],
    explanation:
      "Under Oracle's cloud licensing policy, 1 processor license covers 2 vCPUs (1 OCPU) on OCI with full core-factor benefits, whereas AWS/Azure lose the on-prem 0.5 core factor—meaning customers need up to 2x as many licenses on AWS/Azure. Plus, Oracle Support Rewards is exclusive to OCI.",
  },
  {
    id: "q-migration-zdm-existing",
    category: "Cloud Migration & Multi-Cloud",
    installBase: "Existing Oracle Install Base",
    scenario:
      "An operations director for a 24/7 border screening system says: \"Another cloud vendor proposed using AWS Database Migration Service (DMS) to move our mission-critical Oracle database, but warned us about feature limitations and cutover downtime. What is Oracle's advantage?\"",
    options: [
      {
        text: "Oracle Zero Downtime Migration (ZDM) is free software using native Data Guard and GoldenGate replication to migrate live databases online.",
        isCorrect: true,
      },
      {
        text: "Oracle Autonomous Data Pump moves live multi-terabyte production databases over the internet in a single atomic transaction without standby replication.",
        isCorrect: false,
      },
      {
        text: "Oracle Zero Downtime Migration (ZDM) is a paid hardware appliance that Oracle ships to your data center to physically clone your storage arrays overnight.",
        isCorrect: false,
      },
      {
        text: "OCI FastConnect automatically mirrors your on-premises SAN block storage frames to OCI Object Storage at the network layer without migration software.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle Zero Downtime Migration (ZDM) is a free, purpose-built software tool that uses proven Oracle Data Guard (physical) or GoldenGate (logical) workflows to migrate databases smoothly with minimal or zero impact to 24/7 operations.",
  },
  {
    id: "q-migration-vmware-greenfield",
    category: "Cloud Migration & Multi-Cloud",
    installBase: "No Current Oracle Install Base",
    scenario:
      "An infrastructure manager with no Oracle footprint says: \"We need to evacuate 400 VMware VMs from our data center fast, but competing cloud VMware offerings lock down our root access and force us onto rigid upgrade schedules. How does OCI differ?\"",
    options: [
      {
        text: "Oracle Cloud VMware Solution (OCVS) runs on dedicated bare metal where your team keeps full root control over vSphere, NSX, vSAN, and upgrades.",
        isCorrect: true,
      },
      {
        text: "Oracle Cloud VMware Solution automatically converts your VMware ESXi virtual machines into native OCI Kubernetes containers so you stop paying VMware fees.",
        isCorrect: false,
      },
      {
        text: "OCVS is a fully Oracle-managed service where Oracle engineers hold root access and handle all vCenter administration and forced monthly hypervisor upgrades.",
        isCorrect: false,
      },
      {
        text: "OCVS runs your VMware virtual machines directly inside Oracle Exadata database servers, giving your Windows file servers automatic Exadata Smart Scan.",
        isCorrect: false,
      },
    ],
    explanation:
      "Unlike other clouds that restrict customer access to the underlying VMware control plane, OCVS gives the customer full administrative/root control on dedicated OCI bare-metal shapes—preserving their exact on-premises operational model and tools.",
  },
  {
    id: "q-migration-oracle-on-aws-rds-existing",
    category: "Cloud Migration & Multi-Cloud",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A customer says: \"We're considering moving our mission-critical, high-availability Oracle Real Application Clusters (RAC) database onto standard Amazon RDS for Oracle. What technical limitation should you point out immediately?\"",
    options: [
      {
        text: "Standard Amazon RDS for Oracle does not support active-active Oracle RAC or Exadata scale, whereas OCI and Oracle Database@AWS deliver native multi-node RAC.",
        isCorrect: true,
      },
      {
        text: "Amazon RDS for Oracle supports multi-node active-active RAC, but limits you to a maximum of two database schemas and prohibits automated storage volume backups.",
        isCorrect: false,
      },
      {
        text: "Amazon RDS for Oracle only supports read-only reporting replicas and cannot process transactional SQL INSERT or UPDATE statements without a GoldenGate license.",
        isCorrect: false,
      },
      {
        text: "Running Oracle on Amazon RDS disables Transparent Data Encryption (TDE), whereas OCI is the only cloud capable of encrypting Oracle Database tablespaces at rest.",
        isCorrect: false,
      },
    ],
    explanation:
      "Standard Amazon RDS for Oracle cannot run Oracle RAC (it only offers basic passive Multi-AZ standby failover) and imposes strict storage/IOPS limits compared to native Exadata and RAC on OCI or Oracle Database@AWS.",
  },

  // ============================================================================
  // TECH MODERNIZATION — EXISTING & GREENFIELD
  // ============================================================================
  {
    id: "q-mod-autonomous-dba-existing",
    category: "Tech Modernization",
    installBase: "Existing Oracle Install Base",
    scenario:
      "An IT Director says: \"AWS and Azure tell us they already have 'managed databases' like RDS and Azure SQL, yet my DBAs still spend weekends on patching windows and query tuning. How is Oracle Autonomous Database fundamentally different?\"",
    options: [
      {
        text: "Autonomous Database self-patches online with zero downtime, auto-tunes indexes using machine learning, and auto-scales compute and storage in real time.",
        isCorrect: true,
      },
      {
        text: "Oracle Autonomous Database eliminates maintenance windows by disabling quarterly security patches and relying on an external OCI Network Firewall.",
        isCorrect: false,
      },
      {
        text: "Autonomous Database automates OS patching, but requires your DBAs to schedule a 30-minute offline reboot every Sunday morning for ML index changes.",
        isCorrect: false,
      },
      {
        text: "Autonomous Database achieves self-tuning by locking out custom SQL queries and requiring all applications to access data through pre-built REST APIs.",
        isCorrect: false,
      },
    ],
    explanation:
      "Competing 'managed' databases are really just managed infrastructure—they still require planned downtime for patching and manual DBA query/index tuning. Autonomous Database automates full-stack patching, tuning, and scaling online without downtime.",
  },
  {
    id: "q-mod-apex-lowcode-existing",
    category: "Tech Modernization",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A division chief at an agency with Oracle Database says: \"We need to modernize dozens of legacy spreadsheet workflows, and Microsoft is pitching us Power Apps with expensive per-user monthly licensing fees. What is our counter-pitch?\"",
    options: [
      {
        text: "Oracle APEX is an enterprise low-code platform included at no extra per-user license cost with Oracle Database, running directly inside the database.",
        isCorrect: true,
      },
      {
        text: "Oracle APEX is licensed per named user just like Microsoft Power Apps, but costs 50% less per month when bundled with an OCI GoldenGate subscription.",
        isCorrect: false,
      },
      {
        text: "Oracle APEX is a desktop-only rapid prototyping tool that exports static HTML forms into OCI Object Storage for small teams under 25 concurrent users.",
        isCorrect: false,
      },
      {
        text: "Oracle Visual Builder is included free inside every on-premises Oracle Database 19c license and converts Microsoft Excel macros into Java microservices.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle APEX is already included at no extra cost with Oracle Database and Autonomous Database—no per-user or per-app licensing fees—and executes directly inside the database for extreme scale and security.",
  },
  {
    id: "q-mod-goldengate-greenfield",
    category: "Tech Modernization",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A data engineering lead at an agency using non-Oracle systems says: \"Our data lives across SQL Server, PostgreSQL, mainframes, and AWS. Does OCI GoldenGate only work if we're replicating into or out of an Oracle Database?\"",
    options: [
      {
        text: "OCI GoldenGate is fully heterogeneous, capturing and routing real-time changes sub-second across non-Oracle databases, mainframes, Kafka, and competing clouds.",
        isCorrect: true,
      },
      {
        text: "OCI GoldenGate supports non-Oracle sources like SQL Server and DB2, but requires an Oracle Autonomous Database to act as the final target repository.",
        isCorrect: false,
      },
      {
        text: "For non-Oracle-to-non-Oracle replication across AWS and Azure, OCI GoldenGate operates as a nightly batch ETL utility rather than real-time log CDC.",
        isCorrect: false,
      },
      {
        text: "OCI GoldenGate can replicate between non-Oracle databases only if both the source and target database engines are hosted inside an OCI Dedicated Region.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI GoldenGate is completely heterogeneous—it performs real-time, non-intrusive log-based change data capture (CDC) between non-Oracle sources and non-Oracle targets across multi-cloud and on-premises environments.",
  },
  {
    id: "q-mod-exadata-consolidation-existing",
    category: "Tech Modernization",
    installBase: "Existing Oracle Install Base",
    scenario:
      "An agency infrastructure lead says: \"We have 50 Oracle databases on aging servers. Another cloud provider suggested moving them onto 50 separate cloud VMs with network block storage. Why is Exadata Cloud Service on OCI a superior architecture?\"",
    options: [
      {
        text: "Exadata offloads SQL processing directly to smart storage servers and uses RDMA memory networking, letting you consolidate dozens of databases onto fewer cores.",
        isCorrect: true,
      },
      {
        text: "Exadata Cloud Service runs on standard OCI block storage volumes, but uses software compression so 50 virtual machines share a single iSCSI network cable.",
        isCorrect: false,
      },
      {
        text: "Exadata Cloud Service is designed strictly for read-only analytical data warehouses, so your OLTP transactional databases still require separate compute VMs.",
        isCorrect: false,
      },
      {
        text: "Consolidating onto Exadata Cloud Service requires merging all 50 individual databases into a single shared application schema before migrating onto OCI.",
        isCorrect: false,
      },
    ],
    explanation:
      "Generic cloud VMs bottleneck when pulling massive data volumes across network-attached block storage. Exadata's Smart Scan pushes SQL predicates directly down to the storage servers and uses RDMA for unmatched OLTP and analytics consolidation.",
  },
  {
    id: "q-mod-cyber-ransomware-existing",
    category: "Tech Modernization",
    installBase: "Existing Oracle Install Base",
    scenario:
      "An agency CISO asks: \"Other clouds rely on periodic storage snapshots for database backups, which leaves us exposed to data loss between snapshots and slow restores during a cyber incident. How does OCI Autonomous Recovery Service improve on that?\"",
    options: [
      {
        text: "OCI Autonomous Recovery Service streams redo changes continuously in real time for sub-second point-in-time recovery and validated immutable backups.",
        isCorrect: true,
      },
      {
        text: "OCI Autonomous Recovery Service takes full database storage snapshots every 15 minutes and copies them across three commercial regions in Object Storage.",
        isCorrect: false,
      },
      {
        text: "Autonomous Recovery Service prevents data loss by pausing active database writes for two minutes every hour while it verifies Block Volume checksums.",
        isCorrect: false,
      },
      {
        text: "OCI Autonomous Recovery Service is an on-premises tape backup agent that requires deploying physical Recovery Appliance racks in your local data center.",
        isCorrect: false,
      },
    ],
    explanation:
      "Built on Zero Data Loss Recovery Appliance technology, OCI Autonomous Recovery Service streams redo changes continuously in real time (eliminating the RPO gap between periodic snapshots) and creates validated virtual full backups with zero production impact.",
  },
  {
    id: "q-mod-open-source-postgres-greenfield",
    category: "Tech Modernization",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A prospect with no Oracle Database footprint says: \"Our applications run on open-source MySQL and PostgreSQL on AWS, and we're frustrated with slow analytics and forcing data into Redshift. How can OCI win this workload?\"",
    options: [
      {
        text: "OCI offers MySQL HeatWave—running OLTP, real-time analytics, and ML in one MySQL database without ETL—plus managed OCI PostgreSQL with distributed storage.",
        isCorrect: true,
      },
      {
        text: "MySQL HeatWave is an automated migration tool that converts your open-source MySQL and PostgreSQL applications into Oracle PL/SQL for Exadata Cloud Service.",
        isCorrect: false,
      },
      {
        text: "OCI runs standard open-source MySQL and PostgreSQL on unmanaged Linux VMs, and uses GoldenGate batch jobs to export your data into Amazon Redshift nightly.",
        isCorrect: false,
      },
      {
        text: "MySQL HeatWave accelerates queries by caching static reports in OCI Object Storage, provided you rewrite your MySQL queries in a non-SQL analytics syntax.",
        isCorrect: false,
      },
    ],
    explanation:
      "MySQL HeatWave on OCI (and available in multi-cloud) includes an in-memory massively parallel analytics and ML accelerator built directly into MySQL—delivering orders-of-magnitude faster queries than AWS Aurora/Redshift with zero ETL and standard MySQL syntax.",
  },
  {
    id: "q-26ai-graph-analytics-greenfield",
    category: "Oracle 26ai",
    installBase: "No Current Oracle Install Base",
    scenario:
      "An investigative unit at a law enforcement component says: \"We need to trace complex networks of shell companies and illicit financial transfers. AWS is pitching us Amazon Neptune as a separate graph database. What is our counter-pitch?\"",
    options: [
      {
        text: "Oracle 26ai includes native Operational Property Graphs at no extra license cost, running SQL graph queries directly on live transactional data.",
        isCorrect: true,
      },
      {
        text: "Oracle Graph Cloud Service is a standalone graph database cluster on OCI that costs 30% less per node than Amazon Neptune after you export your data.",
        isCorrect: false,
      },
      {
        text: "Oracle 26ai supports graph analytics by exporting your relational tables into RDF triple files in OCI Object Storage for external Gremlin servers.",
        isCorrect: false,
      },
      {
        text: "Property Graph in Oracle 26ai is an add-on plugin for Oracle Analytics Cloud that requires a separate per-core license on top of Autonomous Database.",
        isCorrect: false,
      },
    ],
    explanation:
      "Unlike AWS (which sells Amazon Neptune as a separate database silo requiring ETL), Oracle Database 26ai supports Operational Property Graphs natively inside the converged database using standard SQL/PGQ at no extra license cost.",
  },
  {
    id: "q-oci-interconnect-azure-greenfield",
    category: "Cloud Migration & Multi-Cloud",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A prospect says: \"If we run our high-performance data workloads on OCI while keeping some existing applications in Microsoft Azure, won't we get penalized by high cross-cloud latency and double data-transfer fees from both vendors?\"",
    options: [
      {
        text: "The direct OCI-Azure Interconnect links joint regions over a private <2ms connection with zero cross-cloud data egress fees from either Oracle or Microsoft.",
        isCorrect: true,
      },
      {
        text: "Oracle waives outbound egress fees across the OCI-Azure Interconnect, though Microsoft still charges standard internet bandwidth rates when data leaves Azure.",
        isCorrect: false,
      },
      {
        text: "The OCI-Azure Interconnect eliminates data transfer fees by batching traffic over an encrypted public internet VPN tunnel with an average latency of 35ms.",
        isCorrect: false,
      },
      {
        text: "Zero-egress cross-cloud networking between OCI and Azure is only available if you deploy OCI Roving Edge nodes inside your on-premises agency router room.",
        isCorrect: false,
      },
    ],
    explanation:
      "In interconnected regions, the Oracle-Microsoft Azure Interconnect provides a private, dedicated low-latency (<2ms) link with unified identity and zero data egress fees from either cloud provider.",
  },
  {
    id: "q-oci-flex-shapes-greenfield",
    category: "Oracle Cloud Infrastructure",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A cloud architect at a non-Oracle agency says: \"On AWS and Azure, whenever our applications need more RAM, we have to jump up to the next fixed 't-shirt size' VM and pay for double the CPU cores that sit idle. How does OCI solve this?\"",
    options: [
      {
        text: "OCI Flexible Compute Shapes let you scale OCPUs and gigabytes of RAM independently—including sub-core burstable VMs—so you never pay for idle compute.",
        isCorrect: true,
      },
      {
        text: "OCI uses fixed t-shirt instance sizes like AWS, but automatically credits your bill at month-end for any vCPU cores that stayed below 10% utilization.",
        isCorrect: false,
      },
      {
        text: "OCI Flexible Compute Shapes let you adjust memory independently, provided the virtual machine is running Oracle Linux and hosting an Oracle Database.",
        isCorrect: false,
      },
      {
        text: "OCI eliminates VM sizing altogether by running all customer Windows and Linux VMs inside a shared serverless container pool billed per HTTP request.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI Flexible Shapes work across general-purpose Linux and Windows VMs (AMD, Intel, and Ampere Arm), letting customers scale CPU cores and memory independently from 1 to 64 GB of RAM per OCPU.",
  },
  {
    id: "q-oci-kubernetes-cloudnative-greenfield",
    category: "Tech Modernization",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A cloud-native engineering lead at an agency with no Oracle footprint says: \"My team runs Linux microservices on Kubernetes (EKS/AKS) provisioned with Terraform. Why would a cloud-native shop look at OCI over AWS or Azure?\"",
    options: [
      {
        text: "OCI Container Engine for Kubernetes (OKE) runs upstream CNCF Kubernetes with native Terraform support, flexible shapes, and lower compute and egress costs.",
        isCorrect: true,
      },
      {
        text: "OKE uses a customized Oracle fork of Kubernetes that replaces standard Docker container images with WebLogic server pods to improve transactional throughput.",
        isCorrect: false,
      },
      {
        text: "OCI Resource Manager requires converting your open-source Terraform HCL files into proprietary Oracle XML templates before deploying Kubernetes clusters.",
        isCorrect: false,
      },
      {
        text: "OKE is included free on OCI, but only supports stateless frontend web containers and blocks persistent block or file storage volumes from attaching to pods.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI is built around open CNCF standards: OKE runs un-forked upstream Kubernetes, OCI Resource Manager uses native open-source Terraform HCL directly in the console, and flexible compute/networking cuts Kubernetes TCO significantly.",
  },
  // ============================================================================
  // BATCH 2: QUESTIONS 31–65
  // ============================================================================
  {
    id: "q-26ai-onnx-embeddings-existing",
    category: "Oracle 26ai",
    installBase: "Existing Oracle Install Base",
    scenario:
      "An agency architect asks: \"If we use Oracle 26ai for AI Vector Search, do we still have to send our sensitive text out to an external cloud API just to generate the vector embeddings?\"",
    options: [
      {
        text: "Oracle 26ai loads ONNX embedding models directly into the database so embeddings are generated locally without data leaving.",
        isCorrect: true,
      },
      {
        text: "Oracle 26ai requires calling an external third-party REST endpoint for every row, though GoldenGate encrypts the payload in transit.",
        isCorrect: false,
      },
      {
        text: "You must export your text tables to OCI Object Storage first so an external Spark cluster can calculate the embeddings overnight.",
        isCorrect: false,
      },
      {
        text: "Oracle 26ai generates vector embeddings by converting English words into standard B-tree hash indexes without using an embedding model.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle Database 26ai can import and run ONNX-format embedding models directly inside the database memory space—so sensitive text never has to leave the database to be vectorized.",
  },
  {
    id: "q-26ai-hybrid-search-greenfield",
    category: "Oracle 26ai",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A search engineer at a non-Oracle agency says: \"Pure vector search sometimes misses exact badge numbers or case IDs, while keyword search misses conceptual meaning. How does Oracle 26ai handle this?\"",
    options: [
      {
        text: "Oracle 26ai includes native Hybrid Vector Search, combining keyword matching and semantic vector similarity in one query.",
        isCorrect: true,
      },
      {
        text: "You must run a separate Elasticsearch cluster for exact badge numbers and merge the results with Oracle 26ai in your Java middle tier.",
        isCorrect: false,
      },
      {
        text: "Oracle 26ai requires disabling semantic vector indexes whenever a user searches for an exact alphanumeric case number or statute code.",
        isCorrect: false,
      },
      {
        text: "Hybrid search in Oracle 26ai works by duplicating your text columns into a separate OCI NoSQL table indexed by full-text triggers.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle 26ai's native Hybrid Vector Search combines Oracle Text keyword indexing with AI Vector Search in a single engine and scores both relevance types together.",
  },
  {
    id: "q-26ai-lock-free-reservations-existing",
    category: "Oracle 26ai",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A grants-management lead says: \"When thousands of applicants submit claims at the exact same deadline, our database locks up waiting for a single central budget balance row to update.\"",
    options: [
      {
        text: "Oracle 26ai Lock-Free Reservations let concurrent transactions update numeric balances simultaneously without blocking on row locks.",
        isCorrect: true,
      },
      {
        text: "Oracle 26ai solves hot-row contention by turning off ACID transaction consistency during peak hours and reconciling balances overnight.",
        isCorrect: false,
      },
      {
        text: "You need to move budget balance counters out of Oracle Database into an external Amazon DynamoDB table to avoid row-level locking.",
        isCorrect: false,
      },
      {
        text: "Oracle True Cache handles high-concurrency balance updates by queueing user writes on the client browser until database traffic drops.",
        isCorrect: false,
      },
    ],
    explanation:
      "Lock-Free Reservations in Oracle 26ai allow high-concurrency updates to hot numeric/inventory/budget rows to proceed without locking rows, validating constraints at commit time.",
  },
  {
    id: "q-26ai-sql-firewall-existing",
    category: "Oracle 26ai",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A federal CISO says: \"We're worried about SQL injection attacks and compromised application service accounts running unauthorized queries against our database. How does Oracle 26ai help?\"",
    options: [
      {
        text: "Oracle 26ai embeds SQL Firewall inside the database kernel to learn approved SQL patterns and block anomalous queries or injection.",
        isCorrect: true,
      },
      {
        text: "Oracle SQL Firewall is an external network proxy appliance that decrypts web browser traffic in the DMZ before it reaches your web servers.",
        isCorrect: false,
      },
      {
        text: "Oracle 26ai blocks SQL injection by prohibiting dynamic SQL queries and requiring all applications to use static flat-file extracts.",
        isCorrect: false,
      },
      {
        text: "Stopping unauthorized queries from service accounts requires routing every SQL statement through a third-party cloud WAF on AWS or Azure.",
        isCorrect: false,
      },
    ],
    explanation:
      "Because SQL Firewall is built right into the Oracle 26ai database kernel, it cannot be bypassed by encrypted network traffic or local stored-procedure execution.",
  },
  {
    id: "q-26ai-blockchain-immutable-greenfield",
    category: "Oracle 26ai",
    installBase: "No Current Oracle Install Base",
    scenario:
      "An inspector general's office with no Oracle footprint says: \"We need a tamper-evident audit ledger for evidence custody, and AWS is pitching us a separate quantum ledger database. What is our counter-pitch?\"",
    options: [
      {
        text: "Oracle 26ai includes Immutable and Blockchain Tables at no extra cost, providing cryptographic tamper protection in standard SQL tables.",
        isCorrect: true,
      },
      {
        text: "Oracle requires standing up a separate Hyperledger Fabric Kubernetes cluster on OCI and syncing audit rows out of the database every hour.",
        isCorrect: false,
      },
      {
        text: "Immutable Tables in Oracle 26ai prevent tampering by burning nightly database exports onto write-once optical storage in OCI Archive tier.",
        isCorrect: false,
      },
      {
        text: "To get cryptographic audit chains in Oracle 26ai, you must purchase a separate per-transaction blockchain token license from Oracle.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle Database 26ai includes native Immutable Tables and Blockchain Tables right inside the converged database at no extra cost—protecting rows with cryptographic hash chains.",
  },
  {
    id: "q-26ai-in-memory-htap-existing",
    category: "Oracle 26ai",
    installBase: "Existing Oracle Install Base",
    scenario:
      "An operations chief says: \"Snowflake is pitching us copying our live Oracle operational tables into their cloud warehouse so leadership can run real-time analytical queries without slowing down transactions.\"",
    options: [
      {
        text: "Oracle Database In-Memory maintains a dual-format column store in RAM alongside row data, running real-time analytics on OLTP without ETL.",
        isCorrect: true,
      },
      {
        text: "Running analytics on live data in Oracle 26ai requires pausing transactional inserts while the database rebuilds B-tree indexes in memory.",
        isCorrect: false,
      },
      {
        text: "Oracle Database In-Memory replaces your disk tablespaces completely, meaning your total database size cannot exceed a single server's RAM.",
        isCorrect: false,
      },
      {
        text: "To match Snowflake's speed, you must use GoldenGate to copy your Oracle tables into a separate OCI MySQL HeatWave cluster first.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle Database In-Memory stores data in both row format (for fast OLTP transactions) and compressed columnar format (for 100x faster analytics) simultaneously inside the same database.",
  },
  {
    id: "q-26ai-vector-chunking-dbms-existing",
    category: "Oracle 26ai",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A developer at an Oracle account asks: \"To build a RAG pipeline on PDF policy manuals, do we need to buy a third-party orchestration tool just to extract text, chunk paragraphs, and create vectors?\"",
    options: [
      {
        text: "No—Oracle 26ai includes DBMS_VECTOR_CHAIN to extract text from PDFs, chunk documents, and generate embeddings directly inside SQL.",
        isCorrect: true,
      },
      {
        text: "Oracle 26ai can store vectors, but text extraction and document chunking must always be performed on an external AWS Lambda server first.",
        isCorrect: false,
      },
      {
        text: "Document chunking in Oracle 26ai requires purchasing an enterprise license for Oracle WebCenter Content and running nightly batch jobs.",
        isCorrect: false,
      },
      {
        text: "Oracle 26ai only accepts pre-chunked plain-text strings under 255 characters and cannot process PDF or Word documents natively.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle 26ai provides end-to-end in-database vector pipelines (`DBMS_VECTOR_CHAIN`) that convert PDFs/docs to text, split them into chunks, generate embeddings, and index them without external middleware.",
  },
  {
    id: "q-26ai-multitenant-pdb-existing",
    category: "Oracle 26ai",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A database manager says: \"We manage 30 departmental databases for different sub-offices. On AWS RDS, each instance is patched and backed up separately, creating huge administrative overhead.\"",
    options: [
      {
        text: "Oracle Multitenant consolidates isolated Pluggable Databases (PDBs) inside one container database, patching and backing up all 30 as one.",
        isCorrect: true,
      },
      {
        text: "Oracle Multitenant merges all 30 departments into a single shared schema where every department's tables must use a custom prefix.",
        isCorrect: false,
      },
      {
        text: "Pluggable Databases in Oracle 26ai share the exact same database user passwords and cannot be cloned or migrated individually.",
        isCorrect: false,
      },
      {
        text: "Consolidating 30 databases with Oracle Multitenant requires rewriting your applications to include a tenant ID column in every SQL query.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle Multitenant architecture lets each Pluggable Database (PDB) remain 100% isolated to applications while allowing administrators to patch, back up, and manage the underlying Container Database (CDB) as one unit.",
  },
  {
    id: "q-26ai-globally-distributed-greenfield",
    category: "Oracle 26ai",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A global customs agency with no Oracle footprint says: \"CockroachDB and AWS Aurora are pitching us distributed SQL for multi-region active-active writes and strict data sovereignty. What does Oracle 26ai offer?\"",
    options: [
      {
        text: "Oracle 26ai Globally Distributed Database shards data across regions with built-in Raft replication and zero-downtime failover.",
        isCorrect: true,
      },
      {
        text: "Oracle 26ai only supports single-region primary databases and relies on manual overnight tape restores to recover if a cloud region goes offline.",
        isCorrect: false,
      },
      {
        text: "Raft replication in Oracle 26ai requires turning off SQL foreign keys and transactions, converting your database into an eventually consistent key-value store.",
        isCorrect: false,
      },
      {
        text: "To distribute data across regions on OCI, you must purchase separate third-party load balancers to manually route SQL statements by IP address.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle 26ai Globally Distributed Database supports hyperscale sharding and built-in Raft consensus replication for automatic sub-second zero-data-loss failover and regional data residency.",
  },
  {
    id: "q-26ai-partitioning-vectors-existing",
    category: "Oracle 26ai",
    installBase: "Existing Oracle Install Base",
    scenario:
      "An intelligence analyst lead asks: \"We have hundreds of millions of documents spanning 10 years. In standalone vector databases, searching only this month's vectors still scans the entire index slowly.\"",
    options: [
      {
        text: "Oracle 26ai combines Oracle Partitioning with vector indexes, pruning searches to just the relevant date or agency partition for fast queries.",
        isCorrect: true,
      },
      {
        text: "Vector indexes in Oracle 26ai cannot be partitioned, so you must create 120 separate database instances—one for every calendar month.",
        isCorrect: false,
      },
      {
        text: "To speed up date-filtered vector searches, Oracle 26ai deletes all vector embeddings older than 30 days and moves them to magnetic tape.",
        isCorrect: false,
      },
      {
        text: "Oracle 26ai requires exporting partitioned tables into a standalone Milvus cluster whenever your document count exceeds one million rows.",
        isCorrect: false,
      },
    ],
    explanation:
      "Unlike standalone vector stores that struggle with metadata pre-filtering at scale, Oracle 26ai combines mature table/index Partitioning with HNSW and IVF vector indexes for massive partition pruning.",
  },
  {
    id: "q-26ai-domains-annotations-existing",
    category: "Oracle 26ai",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A chief data architect says: \"Across 40 microservices, different developers define email addresses, SSNs, and currency columns with inconsistent rules and formats. How does Oracle 26ai standardize this?\"",
    options: [
      {
        text: "Oracle 26ai Data Use Case Domains and Annotations define validation, display, and metadata rules centrally in the database schema.",
        isCorrect: true,
      },
      {
        text: "Oracle 26ai requires installing a proprietary Java middleware agent on every developer laptop to rewrite SQL CREATE TABLE statements.",
        isCorrect: false,
      },
      {
        text: "Data Domains in Oracle 26ai are strictly visual labels inside Oracle SQL Developer and cannot enforce constraints at the database level.",
        isCorrect: false,
      },
      {
        text: "Standardizing column formats across microservices requires migrating your relational tables into an external OCI API Gateway schema registry.",
        isCorrect: false,
      },
    ],
    explanation:
      "Data Use Case Domains and Schema Annotations in Oracle 26ai centralize data intent, validation constraints, and AI/LLM metadata directly in the database so AI tools and apps understand column meaning.",
  },
  {
    id: "q-26ai-priority-transactions-existing",
    category: "Oracle 26ai",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A mission-systems DBA says: \"Sometimes a low-priority batch job holds a row lock and blocks a high-priority border-inspection transaction until a DBA manually kills the blocking session.\"",
    options: [
      {
        text: "Oracle 26ai Priority Transactions automatically abort low-priority transactions holding row locks so high-priority transactions proceed.",
        isCorrect: true,
      },
      {
        text: "Oracle 26ai prevents lock contention by blocking all batch jobs from running between 6:00 AM and midnight local data center time.",
        isCorrect: false,
      },
      {
        text: "Priority Transactions in Oracle 26ai require running high-priority users on a separate read-only database replica that syncs overnight.",
        isCorrect: false,
      },
      {
        text: "To stop batch jobs from blocking live users, you must move all transactional workloads out of Oracle Database into an in-memory Redis cache.",
        isCorrect: false,
      },
    ],
    explanation:
      "Priority Transactions in Oracle 26ai let administrators assign transaction priority tiers so critical mission transactions automatically preempt low-priority blocking sessions without DBA intervention.",
  },

  // ============================================================================
  // AI CAPABILITIES — ADDITIONAL SCENARIOS
  // ============================================================================
  {
    id: "q-ai-document-understanding-greenfield",
    category: "AI Capabilities",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A benefits processing director at a non-Oracle agency says: \"Our clerks manually type data from millions of scanned PDFs, receipts, and passport forms every year. How can OCI automate this without custom ML coding?\"",
    options: [
      {
        text: "OCI Document Understanding is a pre-built AI service extracting text, tables, and key-value fields from scanned documents via API or SQL.",
        isCorrect: true,
      },
      {
        text: "OCI requires your data science team to build and train a custom computer-vision neural network from scratch on bare-metal GPUs first.",
        isCorrect: false,
      },
      {
        text: "OCI Document Understanding only works on digital Word files and cannot perform optical character recognition (OCR) on scanned images.",
        isCorrect: false,
      },
      {
        text: "To extract tables from PDFs on OCI, you must purchase a third-party Adobe enterprise license and host it on Windows Server VMs.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI Document Understanding provides pre-trained OCR, table extraction, and key-value extraction out of the box—accessible via REST APIs or directly from Autonomous Database and APEX.",
  },
  {
    id: "q-ai-vision-inspection-greenfield",
    category: "AI Capabilities",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A port security director says: \"We want to use computer vision on X-ray and camera feeds to spot anomalies on cargo containers and damaged infrastructure, but we have a small team. What does OCI offer?\"",
    options: [
      {
        text: "OCI Vision provides pre-trained image classification and object detection models—plus custom model training on your labeled images.",
        isCorrect: true,
      },
      {
        text: "OCI Vision is strictly a video-conferencing compression tool and does not support object detection or custom image classification models.",
        isCorrect: false,
      },
      {
        text: "Using OCI Vision requires streaming all port camera feeds to a public commercial server outside the United States for manual labeling.",
        isCorrect: false,
      },
      {
        text: "OCI Vision only analyzes static black-and-white barcode labels and cannot detect physical objects or anomalies in color photographs.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI Vision offers both pre-built image/object recognition and no-code custom model training using the agency's own domain-specific imagery.",
  },
  {
    id: "q-ai-speech-transcription-greenfield",
    category: "AI Capabilities",
    installBase: "No Current Oracle Install Base",
    scenario:
      "An investigative unit says: \"We have thousands of hours of field audio interviews and call-center recordings that need fast, accurate transcription with speaker diarization. How does OCI Speech help?\"",
    options: [
      {
        text: "OCI Speech transcribes batch or real-time audio streams with automatic punctuation, timestamps, and speaker diarization labels.",
        isCorrect: true,
      },
      {
        text: "OCI Speech only transcribes pre-recorded audio clips shorter than 30 seconds and does not support real-time streaming or speaker labels.",
        isCorrect: false,
      },
      {
        text: "To transcribe audio on OCI, you must first convert all recordings into MIDI files and store them inside an Oracle 19c relational table.",
        isCorrect: false,
      },
      {
        text: "OCI Speech routes your sensitive investigative audio files to third-party gig-economy transcriptionists for manual human typing.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI Speech delivers scalable automatic speech recognition (ASR) for both batch audio files and real-time streams inside OCI's secure cloud tenancy.",
  },
  {
    id: "q-ai-language-pii-greenfield",
    category: "AI Capabilities",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A FOIA and privacy officer says: \"Before we release records or feed field reports into analytics dashboards, we need to automatically detect and redact Personally Identifiable Information (PII) in unstructured text.\"",
    options: [
      {
        text: "OCI Language includes built-in PII detection and redaction, entity extraction, and sentiment analysis for unstructured text.",
        isCorrect: true,
      },
      {
        text: "OCI Language is a human translation staffing agency and does not offer automated APIs for PII redaction or named-entity recognition.",
        isCorrect: false,
      },
      {
        text: "Redacting PII in unstructured text on OCI requires writing thousands of custom regular expressions manually inside an external firewall.",
        isCorrect: false,
      },
      {
        text: "OCI Language can detect sentiment in text, but PII detection requires exporting your documents to Microsoft Purview or AWS Macie.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI Language provides pre-trained natural language processing (NLP) capabilities—including automated PII detection/masking, named entity recognition, key-phrase extraction, and sentiment analysis.",
  },
  {
    id: "q-ai-genai-agents-rag-existing",
    category: "AI Capabilities",
    installBase: "Existing Oracle Install Base",
    scenario:
      "An IT modernization lead at an Oracle customer says: \"Building a production RAG chatbot on AWS took us months of wiring together LangChain, OpenSearch, and Glue pipelines. How does OCI speed this up?\"",
    options: [
      {
        text: "OCI Generative AI Agents provide a managed RAG service connecting directly to Oracle 26ai Vector Search and Object Storage.",
        isCorrect: true,
      },
      {
        text: "OCI Generative AI Agents require you to manually manage a fleet of 20 separate microservices and third-party vector sync pipelines.",
        isCorrect: false,
      },
      {
        text: "OCI Generative AI Agents can only answer questions from static HTML web pages and cannot connect to Oracle Database 26ai.",
        isCorrect: false,
      },
      {
        text: "To use OCI Generative AI Agents, you must first migrate your relational data out of Oracle Database into a flat CSV bucket.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI Generative AI Agents turn complex RAG orchestration into a turnkey managed service—natively integrating with Oracle Database 26ai AI Vector Search, OCI Object Storage, and hybrid search.",
  },
  {
    id: "q-ai-quick-actions-datascience-greenfield",
    category: "AI Capabilities",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A data science manager says: \"My team wants to deploy open-source models like Mistral, Llama, or Falcon on dedicated GPUs in our cloud tenancy without spending weeks writing Docker and inference server boilerplate.\"",
    options: [
      {
        text: "AI Quick Actions in OCI Data Science lets you fine-tune, evaluate, and deploy open-source LLMs on OCI GPUs in a few clicks.",
        isCorrect: true,
      },
      {
        text: "OCI Data Science blocks open-source Hugging Face models and only permits running proprietary models written in Oracle PL/SQL.",
        isCorrect: false,
      },
      {
        text: "Deploying an open-source LLM on OCI requires compiling the C++ CUDA kernel drivers manually on every GPU node before each run.",
        isCorrect: false,
      },
      {
        text: "AI Quick Actions is a desktop spreadsheet plugin that only supports linear regression on datasets under 10,000 rows.",
        isCorrect: false,
      },
    ],
    explanation:
      "AI Quick Actions inside OCI Data Science provides a no-code/low-code interface to browse, fine-tune, and deploy leading open-source LLMs onto OCI GPU shapes in minutes.",
  },
  {
    id: "q-ai-select-ai-narrate-existing",
    category: "AI Capabilities",
    installBase: "Existing Oracle Install Base",
    scenario:
      "An agency briefing officer says: \"When our executives ask a question in Select AI, they don't just want a raw table of numbers—they want a natural-language paragraph explaining the findings for their morning brief.\"",
    options: [
      {
        text: "Select AI's 'narrate' mode runs the generated SQL against live Oracle data and synthesizes the results into a natural-language summary.",
        isCorrect: true,
      },
      {
        text: "Select AI can only output raw SQL code strings, so an analyst still has to copy the query into SQL*Plus and write the summary by hand.",
        isCorrect: false,
      },
      {
        text: "Getting a natural-language summary requires exporting the SQL query results into Microsoft Word Copilot over the public internet.",
        isCorrect: false,
      },
      {
        text: "Select AI 'narrate' mode works by guessing the answer from the LLM's public training data without actually querying your database tables.",
        isCorrect: false,
      },
    ],
    explanation:
      "Select AI supports multiple actions (`runsql`, `showsql`, `explainsql`, `narrate`, and `chat`), allowing users to get either raw query results, the transparent SQL statement, or an executive narrative summary grounded in live database rows.",
  },
  {
    id: "q-ai-automl-adb-existing",
    category: "AI Capabilities",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A business analyst lead says: \"We want to build predictive models for employee attrition and case backlogs, but we have a shortage of PhD data scientists to select algorithms and tune hyperparameters.\"",
    options: [
      {
        text: "Oracle Machine Learning AutoML UI in Autonomous Database automatically selects the best algorithm, features, and hyperparameters.",
        isCorrect: true,
      },
      {
        text: "Building predictive models in Autonomous Database requires writing custom C++ matrix algebra libraries from scratch with no automated tooling.",
        isCorrect: false,
      },
      {
        text: "Oracle AutoML is an external SaaS consulting service where you email CSV files to Oracle analysts and wait two weeks for a report.",
        isCorrect: false,
      },
      {
        text: "AutoML in Autonomous Database only supports unsupervised clustering and cannot build classification or regression prediction models.",
        isCorrect: false,
      },
    ],
    explanation:
      "OML AutoML UI (included with Autonomous Database) automates algorithm selection, feature selection, and hyperparameter tuning—empowering citizen data scientists and speeding up model creation.",
  },
  {
    id: "q-ai-oml4py-embedded-existing",
    category: "AI Capabilities",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A Python data scientist at an Oracle account says: \"I love writing Python and using open-source packages, but my laptop crashes when I try to pull 50 million database rows into a local Pandas dataframe.\"",
    options: [
      {
        text: "OML4Py translates Python commands into scalable SQL on database tables and runs custom Python in database-spawned engines.",
        isCorrect: true,
      },
      {
        text: "Oracle Autonomous Database blocks Python connections, forcing data scientists to rewrite all of their data-prep logic in legacy COBOL.",
        isCorrect: false,
      },
      {
        text: "OML4Py requires purchasing a separate 512-GB RAM workstation for every data scientist so all 50 million rows download to their laptop.",
        isCorrect: false,
      },
      {
        text: "To run Python against Oracle data, you must first export the database to Amazon S3 and spin up an AWS EMR Spark cluster.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle Machine Learning for Python (OML4Py) lets data scientists manipulate massive database tables as proxy dataframes without pulling data to their laptop, and executes user-defined Python functions directly in the database.",
  },
  {
    id: "q-ai-supercluster-zettascale-greenfield",
    category: "AI Capabilities",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A defense research agency asks: \"We are evaluating cloud providers for frontier-scale AI model training and simulation. How large can OCI GPU clusters scale compared to standard cloud offerings?\"",
    options: [
      {
        text: "OCI Supercluster scales to 65,536+ GPUs—and up to 131,072 GPUs with OCI Zettascale—linked by ultra-low-latency RDMA networking.",
        isCorrect: true,
      },
      {
        text: "OCI caps GPU clusters at a maximum of 64 GPUs per region, requiring workloads to split across public internet VPNs for larger runs.",
        isCorrect: false,
      },
      {
        text: "OCI Supercluster scales by linking thousands of low-power desktop CPUs together over standard 1-gigabit office Ethernet switches.",
        isCorrect: false,
      },
      {
        text: "OCI Zettascale is an archival tape storage tier for cold AI training datasets and does not include GPU compute or RDMA networking.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI Supercluster and Zettascale architecture lead the industry in massive-scale GPU clustering with ultra-low-latency RDMA networking.",
  },
  {
    id: "q-ai-guardrails-moderation-greenfield",
    category: "AI Capabilities",
    installBase: "No Current Oracle Install Base",
    scenario:
      "An agency risk officer asks: \"Before we expose a generative AI assistant to citizens or employees, how do we prevent prompt injection, toxic outputs, or PII leakage in OCI Generative AI?\"",
    options: [
      {
        text: "OCI Generative AI includes configurable guardrails for content moderation, prompt-injection protection, and PII filtering.",
        isCorrect: true,
      },
      {
        text: "OCI Generative AI does not inspect prompts or responses, requiring your agency to review every chatbot response manually before it displays.",
        isCorrect: false,
      },
      {
        text: "Guardrails on OCI only work if you route all citizen prompts through a third-party commercial firewall hosted in AWS GovCloud first.",
        isCorrect: false,
      },
      {
        text: "Preventing prompt injection in OCI Generative AI requires disabling free-text user input and only allowing multiple-choice buttons.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI Generative AI and GenAI Agents provide built-in guardrails to filter harmful content, block prompt-injection attempts, and mask sensitive PII.",
  },
  {
    id: "q-ai-cohere-llama-choice-greenfield",
    category: "AI Capabilities",
    installBase: "No Current Oracle Install Base",
    scenario:
      "An enterprise architect asks: \"If we use OCI Generative AI, are we locked into a single proprietary Oracle LLM, or do we get a choice of industry-leading foundation models?\"",
    options: [
      {
        text: "OCI Generative AI offers managed access to top models from Cohere and Meta Llama alongside Bring-Your-Own-Model options.",
        isCorrect: true,
      },
      {
        text: "OCI Generative AI only runs a single proprietary Oracle LLM trained exclusively on SQL syntax manuals and blocks Meta Llama models.",
        isCorrect: false,
      },
      {
        text: "Using Meta Llama or Cohere models on OCI requires purchasing a separate commercial contract directly from Meta or Cohere outside OCI.",
        isCorrect: false,
      },
      {
        text: "OCI Generative AI only supports legacy GPT-2 models and does not offer modern enterprise models for RAG or tool use.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI Generative AI gives customers curated, enterprise-grade models from Cohere (optimized for enterprise RAG, embeddings, and reranking) and Meta Llama, plus full flexibility to deploy custom models.",
  },
  {
    id: "q-ai-spatial-ml-existing",
    category: "AI Capabilities",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A border and maritime operations planner says: \"We want to run machine learning on vessel GPS trajectories and sensor locations to predict illicit trafficking routes. Do we need a separate GIS AI cloud?\"",
    options: [
      {
        text: "Oracle Spatial and Oracle Machine Learning include spatial ML algorithms that analyze location trajectories right in the database.",
        isCorrect: true,
      },
      {
        text: "Oracle Database cannot process GPS coordinates in machine learning models, requiring a nightly data export to an external GIS SaaS tool.",
        isCorrect: false,
      },
      {
        text: "Running spatial machine learning in Oracle requires converting all latitude and longitude points into unindexed plain-text strings first.",
        isCorrect: false,
      },
      {
        text: "Oracle Spatial ML is only available as an offline desktop plugin for Windows 10 and cannot run on OCI or Autonomous Database.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle Spatial Studio and OML4Py/SQL include native spatial machine learning (spatial clustering, hotspot analysis, trajectory prediction) right inside Autonomous Database.",
  },
  {
    id: "q-ai-apex-ai-assistant-existing",
    category: "AI Capabilities",
    installBase: "Existing Oracle Install Base",
    scenario:
      "An application development manager says: \"My team uses Oracle APEX to build internal agency apps, and they want to both speed up app creation with AI and embed conversational AI into the apps they build.\"",
    options: [
      {
        text: "Oracle APEX includes a built-in AI Assistant to generate SQL and apps, plus declarative components to embed GenAI chat in apps.",
        isCorrect: true,
      },
      {
        text: "Oracle APEX does not support AI integration, so developers must rewrite their APEX applications in React and host them on AWS Amplify.",
        isCorrect: false,
      },
      {
        text: "Adding an AI chat widget to an Oracle APEX page requires writing custom C++ socket extensions and deploying a separate WebLogic cluster.",
        isCorrect: false,
      },
      {
        text: "The APEX AI Assistant can only change CSS button colors and cannot generate SQL queries or connect to OCI Generative AI services.",
        isCorrect: false,
      },
    ],
    explanation:
      "Modern Oracle APEX features AI-assisted app and SQL generation for developers, plus declarative Dynamic Actions to add RAG/conversational AI dialogs into mission apps in minutes.",
  },

  // ============================================================================
  // ORACLE CLOUD INFRASTRUCTURE — ADDITIONAL SCENARIOS
  // ============================================================================
  {
    id: "q-oci-fastconnect-pricing-greenfield",
    category: "Oracle Cloud Infrastructure",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A network architect at a non-Oracle agency says: \"We have a dedicated private circuit to AWS (Direct Connect) and Azure (ExpressRoute), and they still bill us per gigabyte for every byte of data that flows over that private line.\"",
    options: [
      {
        text: "OCI FastConnect charges a flat monthly port fee with zero per-gigabyte data transfer fees for inbound or outbound private traffic.",
        isCorrect: true,
      },
      {
        text: "OCI FastConnect charges the same per-gigabyte data transfer fees as AWS Direct Connect, plus an additional encryption surcharge per packet.",
        isCorrect: false,
      },
      {
        text: "OCI FastConnect is free for the first 100 gigabytes per month, after which outbound private circuit traffic is billed at public internet rates.",
        isCorrect: false,
      },
      {
        text: "Zero-fee private networking on OCI FastConnect is only available for 1-Gbps ports and does not apply to 10-Gbps or 100-Gbps connections.",
        isCorrect: false,
      },
    ],
    explanation:
      "While AWS Direct Connect and Azure ExpressRoute charge both a port fee AND per-GB outbound data transfer fees, OCI FastConnect charges only a flat port rate with $0/GB data transfer.",
  },
  {
    id: "q-oci-non-oversubscribed-network-greenfield",
    category: "Oracle Cloud Infrastructure",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A mission-critical systems engineer says: \"On our current cloud provider, our application latency spikes unpredictably whenever a 'noisy neighbor' customer on the same host bursts their network traffic.\"",
    options: [
      {
        text: "OCI's Gen 2 network is non-oversubscribed and offloads virtualization to SmartNIC hardware, guaranteeing predictable bandwidth.",
        isCorrect: true,
      },
      {
        text: "OCI prevents noisy neighbors by throttling all virtual machine network interfaces down to 100 megabits per second during peak business hours.",
        isCorrect: false,
      },
      {
        text: "Like first-generation clouds, OCI oversubscribes host network links by 4:1 unless you purchase dedicated bare-metal racks for every workload.",
        isCorrect: false,
      },
      {
        text: "OCI eliminates network contention by disabling TCP/IP networking between virtual machines and routing all traffic through shared disk files.",
        isCorrect: false,
      },
    ],
    explanation:
      "First-generation clouds share CPU cores for hypervisor/network virtualization and oversubscribe their network fabric. OCI offloads network virtualization to isolated hardware and uses a flat, non-oversubscribed Clos network.",
  },
  {
    id: "q-oci-sla-performance-greenfield",
    category: "Oracle Cloud Infrastructure",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A federal procurement officer asks: \"Every cloud provider claims to have a 99.9% SLA, but when our cloud disks or network slow to a crawl, the vendor says 'the server is technically reachable, so no SLA credit applies.'\"",
    options: [
      {
        text: "OCI offers financially backed SLAs for availability, manageability, AND performance across compute, block storage, and network.",
        isCorrect: true,
      },
      {
        text: "OCI's SLA only covers complete data center power outages lasting longer than 24 consecutive hours in a single availability domain.",
        isCorrect: false,
      },
      {
        text: "Like AWS and Azure, OCI's standard SLA only guarantees that the virtual machine can respond to a basic network ping, not IOPS performance.",
        isCorrect: false,
      },
      {
        text: "OCI performance SLAs require purchasing a separate 'Gold Tier' insurance policy that adds 25% to your monthly compute and storage invoice.",
        isCorrect: false,
      },
    ],
    explanation:
      "Other clouds only guarantee basic availability (reachability). OCI provides financially backed SLAs covering Availability, Manageability (API/console responsiveness), and Performance (compute, NVMe/Block IOPS, network).",
  },
  {
    id: "q-oci-cloud-guard-security-zones-greenfield",
    category: "Oracle Cloud Infrastructure",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A cloud security architect says: \"On AWS, we spend thousands a month extra on GuardDuty, Security Hub, and Config just to detect misconfigured public buckets—and admins still accidentally make buckets public.\"",
    options: [
      {
        text: "OCI includes Cloud Guard and Maximum Security Zones free—preventing misconfigurations up front and auto-remediating threats.",
        isCorrect: true,
      },
      {
        text: "OCI Cloud Guard is a paid per-asset security add-on that alerts you 24 hours after a bucket is made public, without automated remediation.",
        isCorrect: false,
      },
      {
        text: "OCI Maximum Security Zones only audit user login passwords and cannot block an administrator from creating a public Object Storage bucket.",
        isCorrect: false,
      },
      {
        text: "To detect cloud misconfigurations on OCI, you must export your audit logs to an external SIEM because OCI has no native posture tool.",
        isCorrect: false,
      },
    ],
    explanation:
      "While competitors nickel-and-dime customers for cloud security posture management, OCI includes Cloud Guard and Maximum Security Zones free—enforcing security policies proactively so misconfigurations can't happen.",
  },
  {
    id: "q-oci-block-volume-autotune-greenfield",
    category: "Oracle Cloud Infrastructure",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A storage administrator says: \"On AWS EBS, we have to provision expensive high-IOPS storage year-round just to handle end-of-quarter processing spikes, and changing storage tiers requires complex volume migrations.\"",
    options: [
      {
        text: "OCI Block Volumes let you dynamically adjust performance between Lower Cost, Balanced, and Ultra High Performance online.",
        isCorrect: true,
      },
      {
        text: "Changing the IOPS tier of an OCI Block Volume requires detaching the disk, rebooting the server, and copying the data to a new volume.",
        isCorrect: false,
      },
      {
        text: "OCI Block Volumes have a fixed, unchangeable IOPS limit determined permanently at the moment you create the virtual machine.",
        isCorrect: false,
      },
      {
        text: "High-performance block storage on OCI is only available for Oracle Exadata racks and cannot be attached to standard Linux or Windows VMs.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI Block Volumes use a single underlying storage type across all performance tiers—allowing customers to dial IOPS up or down dynamically with zero downtime or enable performance auto-tuning.",
  },
  {
    id: "q-oci-ampere-arm-compute-greenfield",
    category: "Oracle Cloud Infrastructure",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A platform engineering lead says: \"We're looking to cut our cloud compute bill for containerized web apps, Java services, and CI/CD pipelines. What does OCI offer in high-efficiency processors?\"",
    options: [
      {
        text: "OCI Ampere Arm compute shapes deliver leading price-performance with linear scaling, flexible sizing, and per-OCPU billing.",
        isCorrect: true,
      },
      {
        text: "OCI only offers x86 Intel processors in our data centers and has no Arm-based compute instances for Linux or container workloads.",
        isCorrect: false,
      },
      {
        text: "OCI Ampere Arm shapes are restricted to fixed 64-core bare-metal servers and cannot be used as flexible virtual machines or OKE nodes.",
        isCorrect: false,
      },
      {
        text: "Running Java or Docker containers on OCI Ampere Arm shapes requires purchasing a proprietary Oracle binary translation license per core.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI's Ampere Arm shapes offer predictable single-threaded core performance (no hyperthreading contention), flexible CPU/RAM sizing, and exceptional price-performance for cloud-native workloads.",
  },
  {
    id: "q-oci-universal-credits-existing",
    category: "Oracle Cloud Infrastructure",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A federal contracting officer says: \"With other cloud providers, if we commit to a specific database or VM instance type and our mission needs change mid-year to AI GPUs or analytics, we lose our committed discount.\"",
    options: [
      {
        text: "Oracle Universal Credits let you apply one committed pool of funds flexibly across any eligible OCI IaaS or PaaS service.",
        isCorrect: true,
      },
      {
        text: "Oracle Universal Credits lock your budget to the exact VM shape and region selected on Day 1, charging a 25% fee to switch to AI services.",
        isCorrect: false,
      },
      {
        text: "Universal Credits can only be used for OCI Compute and Object Storage, while Autonomous Database and AI services require separate contracts.",
        isCorrect: false,
      },
      {
        text: "Unused Oracle Universal Credits expire every 24 hours if your agency does not maintain a constant 90% CPU utilization across all VMs.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle Universal Credits give agencies maximum procurement agility—allowing them to shift consumption freely between Compute, Autonomous Database, AI GPUs, Storage, and Cloud@Customer without re-contracting.",
  },
  // ============================================================================
  // BATCH 3: QUESTIONS 64–100 (COMPLETING THE 100-QUESTION POOL)
  // ============================================================================
  {
    id: "q-ai-model-catalog-conda-greenfield",
    category: "AI Capabilities",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A machine learning lead says: \"Our data scientists waste days debugging broken Python dependencies when moving trained models from their notebooks into production endpoints. How does OCI Data Science solve this?\"",
    options: [
      {
        text: "OCI Data Science provides curated Conda environments and a centralized Model Catalog that packages models as reproducible artifacts.",
        isCorrect: true,
      },
      {
        text: "OCI Data Science requires rewriting Python notebook models into compiled C# binaries before they can be registered in the Model Catalog.",
        isCorrect: false,
      },
      {
        text: "To avoid dependency conflicts, OCI Data Science deletes all third-party Python libraries after each session and only allows standard SQL.",
        isCorrect: false,
      },
      {
        text: "The OCI Model Catalog is a documentation wiki that stores text descriptions of models, while actual weights must be hosted on GitHub.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI Data Science includes curated Conda environments for popular ML/AI frameworks and a governed Model Catalog that versions, tests, and deploys models to managed HTTPS endpoints.",
  },
  {
    id: "q-ai-sovereign-govcloud-genai-existing",
    category: "AI Capabilities",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A homeland security program manager asks: \"Can we use Oracle's AI Vector Search and machine learning capabilities inside accredited US Government cloud regions, or are AI tools restricted to commercial regions?\"",
    options: [
      {
        text: "Oracle 26ai AI Vector Search, Autonomous Database ML, and OCI AI services run directly inside accredited OCI US Government regions.",
        isCorrect: true,
      },
      {
        text: "Oracle AI Vector Search is only available in commercial regions, so government workloads must send vector queries over the public internet.",
        isCorrect: false,
      },
      {
        text: "Using AI in OCI Government regions requires a special waiver that disables FedRAMP High encryption on your Autonomous Database tables.",
        isCorrect: false,
      },
      {
        text: "In OCI Government regions, machine learning models can only be trained on synthetic test data and are blocked from production tables.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle brings in-database AI (Oracle 26ai AI Vector Search, OML, Select AI) and OCI AI infrastructure directly into OCI's accredited US Government and defense cloud regions.",
  },
  {
    id: "q-oci-object-storage-autotiering-greenfield",
    category: "Oracle Cloud Infrastructure",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A records-management director says: \"We store petabytes of body-cam video and case evidence in cloud object storage. We overpay because nobody knows when files stop being accessed frequently.\"",
    options: [
      {
        text: "OCI Object Storage Auto-Tiering automatically moves cold objects to Infrequent Access and back with zero retrieval fees.",
        isCorrect: true,
      },
      {
        text: "OCI Object Storage Auto-Tiering permanently deletes any video file that has not been opened for 90 days to reduce your monthly storage bill.",
        isCorrect: false,
      },
      {
        text: "Moving an object from Infrequent Access back to Standard tier on OCI requires a 48-hour manual tape retrieval ticket and high per-GB fees.",
        isCorrect: false,
      },
      {
        text: "OCI Object Storage Auto-Tiering only works on files smaller than 1 megabyte and cannot be enabled on video or PDF evidence buckets.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI Object Storage Auto-Tiering automatically transitions objects between Standard and Infrequent Access tiers based on real usage—with instant retrieval and no retrieval fees if accessed again.",
  },
  {
    id: "q-oci-bastion-vulnerability-free-greenfield",
    category: "Oracle Cloud Infrastructure",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A DevSecOps lead says: \"On our current cloud, we pay extra every month to run permanent jump-box VMs with public IPs for SSH access, plus third-party agents for host vulnerability scanning.\"",
    options: [
      {
        text: "OCI includes managed Bastion (for time-bound, public-IP-free SSH access) and OCI Vulnerability Scanning Service at no additional charge.",
        isCorrect: true,
      },
      {
        text: "OCI Bastion requires assigning a permanent public IPv4 address to every private database server and opening port 22 to the entire internet.",
        isCorrect: false,
      },
      {
        text: "OCI Vulnerability Scanning Service is a paid third-party appliance licensed per CPU core that only scans Windows desktop workstations.",
        isCorrect: false,
      },
      {
        text: "To access private Linux VMs on OCI without a public IP, you must purchase a dedicated hardware VPN router for every individual administrator.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI includes both OCI Bastion (ephemeral, identity-controlled SSH/RDP sessions without public IPs or jump-box VMs) and OCI Vulnerability Scanning Service at no extra cost.",
  },
  {
    id: "q-oci-file-storage-lustre-greenfield",
    category: "Oracle Cloud Infrastructure",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A weather and geospatial modeling team says: \"Our high-performance computing (HPC) and AI training jobs bottleneck waiting on shared POSIX file storage across hundreds of compute nodes.\"",
    options: [
      {
        text: "OCI File Storage with Lustre delivers managed, massively parallel POSIX file throughput built for demanding HPC and AI training clusters.",
        isCorrect: true,
      },
      {
        text: "OCI only supports single-node block storage volumes and cannot mount a shared file system across multiple Linux compute instances.",
        isCorrect: false,
      },
      {
        text: "Running parallel HPC file systems on OCI requires converting all of your scientific simulation files into relational database BLOB columns.",
        isCorrect: false,
      },
      {
        text: "OCI File Storage caps throughput at 10 megabytes per second per region to prevent HPC workloads from using network bandwidth.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI offers both elastic enterprise NFS (OCI File Storage) and high-throughput managed Lustre file systems designed specifically for AI training and HPC clusters.",
  },
  {
    id: "q-oci-network-firewall-paloalto-greenfield",
    category: "Oracle Cloud Infrastructure",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A federal network security chief says: \"Our agency standardized on Palo Alto Networks next-generation firewall rules, and we don't want to manage our own firewall VM appliances and patching in the cloud.\"",
    options: [
      {
        text: "OCI Network Firewall is a turnkey managed firewall service powered by Palo Alto Networks with built-in scaling and high availability.",
        isCorrect: true,
      },
      {
        text: "OCI blocks Palo Alto Networks technology and requires agencies to write custom Linux iptables scripts on every individual virtual machine.",
        isCorrect: false,
      },
      {
        text: "Using OCI Network Firewall requires shipping physical Palo Alto hardware appliances to an Oracle data center for manual rack installation.",
        isCorrect: false,
      },
      {
        text: "OCI Network Firewall only inspects unencrypted HTTP traffic on port 80 and cannot perform TLS inspection or intrusion prevention.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI Network Firewall is a native, Oracle-managed next-generation firewall service powered by Palo Alto Networks—supporting deep packet inspection, TLS decryption, and IPS without managing VM appliances.",
  },
  {
    id: "q-oci-vault-hsm-keys-existing",
    category: "Oracle Cloud Infrastructure",
    installBase: "Existing Oracle Install Base",
    scenario:
      "An agency compliance officer asks: \"Our security mandate requires customer-managed encryption keys stored in FIPS 140-2 Level 3 Hardware Security Modules (HSMs) for our databases and storage.\"",
    options: [
      {
        text: "OCI Vault lets you control master encryption keys backed by FIPS 140-2 Level 3 HSMs across Autonomous Database and Storage.",
        isCorrect: true,
      },
      {
        text: "OCI requires Oracle administrators to hold sole custody of all encryption keys in plaintext files on shared management servers.",
        isCorrect: false,
      },
      {
        text: "Hardware Security Modules on OCI are only available for commercial banking accounts and are disabled inside US Government regions.",
        isCorrect: false,
      },
      {
        text: "Enabling customer-managed keys in OCI Vault disables Autonomous Database automated backups and zero-downtime security patching.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI Vault provides dedicated and shared FIPS 140-2 Level 3 HSM-protected master encryption keys that integrate seamlessly with Autonomous Database, Exadata, Block Volumes, and Object Storage.",
  },
  {
    id: "q-oci-container-instances-serverless-greenfield",
    category: "Oracle Cloud Infrastructure",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A developer lead says: \"Sometimes we just want to run a few Docker containers for an API or background worker without standing up and managing a full Kubernetes cluster.\"",
    options: [
      {
        text: "OCI Container Instances launch Docker containers in seconds on serverless compute with selectable CPU/RAM and zero cluster management.",
        isCorrect: true,
      },
      {
        text: "Running a single Docker container on OCI always requires provisioning a minimum 10-node Kubernetes cluster and managing worker OS patches.",
        isCorrect: false,
      },
      {
        text: "OCI Container Instances only run proprietary Oracle Linux images and block containers pulled from Docker Hub or GitHub Container Registry.",
        isCorrect: false,
      },
      {
        text: "Serverless containers on OCI are terminated automatically after 60 seconds and cannot run persistent web APIs or background services.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI Container Instances provide a fast, serverless way to run containerized apps with flexible CPU/memory allocation and zero Kubernetes or VM management overhead.",
  },
  {
    id: "q-oci-compartment-governance-greenfield",
    category: "Oracle Cloud Infrastructure",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A cloud governance lead says: \"On AWS, isolating 15 sub-agencies required creating 15 separate AWS accounts with complex cross-account IAM roles and fragmented networking.\"",
    options: [
      {
        text: "OCI Compartments provide logical resource isolation, IAM policies, and cost tracking inside a single tenancy without account sprawl.",
        isCorrect: true,
      },
      {
        text: "OCI requires creating a separate billing tenancy and signing a new procurement contract for every individual project or sub-department.",
        isCorrect: false,
      },
      {
        text: "OCI Compartments are strictly cosmetic folder labels in the web console and cannot enforce IAM access controls or budget quotas.",
        isCorrect: false,
      },
      {
        text: "Resources placed in different OCI Compartments cannot communicate over the same Virtual Cloud Network without going over the public internet.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI Compartments are a core architectural advantage over legacy clouds—allowing agencies to enforce strict role-based isolation, quotas, and cost chargeback across sub-components within one tenancy and VCN.",
  },
  {
    id: "q-oci-isolated-classified-region-existing",
    category: "Oracle Cloud Infrastructure",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A national security customer asks: \"Beyond FedRAMP High and DISA IL5, how does Oracle support air-gapped, classified intelligence and defense workloads?\"",
    options: [
      {
        text: "Oracle operates air-gapped OCI National Security Regions (DISA IL6 / Top Secret / SCI) run by cleared US citizens.",
        isCorrect: true,
      },
      {
        text: "Classified Top Secret workloads on OCI run inside standard commercial data centers using a virtual private network tunnel over the internet.",
        isCorrect: false,
      },
      {
        text: "OCI National Security Regions only provide cold archival storage and cannot run Oracle Autonomous Database or compute instances.",
        isCorrect: false,
      },
      {
        text: "Oracle does not operate accredited classified cloud regions, requiring all IL6 and Top Secret systems to use third-party clouds.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle operates dedicated, air-gapped National Security Regions accredited for DISA IL6 and Intelligence Community Top Secret/SCI workloads.",
  },

  // ============================================================================
  // CLOUD MIGRATION & MULTI-CLOUD — ADDITIONAL SCENARIOS
  // ============================================================================
  {
    id: "q-multicloud-google-vertex-existing",
    category: "Cloud Migration & Multi-Cloud",
    installBase: "Existing Oracle Install Base",
    scenario:
      "An agency data science lead says: \"Our team uses Google Cloud's Vertex AI and BigQuery, but our core system of record is an on-premises Oracle database. How can we connect them without brittle ETL?\"",
    options: [
      {
        text: "Oracle Database@Google Cloud runs genuine OCI Exadata and Autonomous Database inside Google Cloud data centers for low-latency access.",
        isCorrect: true,
      },
      {
        text: "Oracle Database@Google Cloud requires converting your relational Oracle tables into flat CSV files stored in Google Cloud Storage buckets nightly.",
        isCorrect: false,
      },
      {
        text: "Oracle and Google Cloud do not have a direct partnership, so all traffic must route through an on-premises proxy server over the public internet.",
        isCorrect: false,
      },
      {
        text: "Running Oracle Database@Google Cloud replaces the Oracle Database engine with Google Cloud Spanner while keeping PL/SQL syntax emulation.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle Database@Google Cloud places OCI-managed Exadata and Autonomous Database hardware directly inside Google Cloud data centers, procured via Google Cloud Marketplace.",
  },
  {
    id: "q-multicloud-aws-zero-etl-existing",
    category: "Cloud Migration & Multi-Cloud",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A cloud architect at an agency using AWS says: \"If we use Oracle Database@AWS for our mission-critical Oracle databases, how easily can that data work with our existing AWS analytics services?\"",
    options: [
      {
        text: "Oracle Database@AWS runs OCI Exadata inside AWS data centers with low-latency private networking and integration with AWS services.",
        isCorrect: true,
      },
      {
        text: "Oracle Database@AWS isolates your database on an air-gapped network that blocks any connection to your existing Amazon VPCs or analytics tools.",
        isCorrect: false,
      },
      {
        text: "Connecting Oracle Database@AWS to your AWS applications requires routing all SQL traffic out over the public internet and paying double egress fees.",
        isCorrect: false,
      },
      {
        text: "Oracle Database@AWS is limited to single-core developer trial databases and cannot run production Exadata or Autonomous Database workloads.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle Database@AWS physically co-locates OCI Exadata and Autonomous Database inside AWS data centers with direct, low-latency connectivity to the customer's AWS VPC and analytics ecosystem.",
  },
  {
    id: "q-multicloud-azure-macc-procurement-existing",
    category: "Cloud Migration & Multi-Cloud",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A procurement lead says: \"We want Oracle Autonomous Database for our mission apps in Azure, but we don't have time for a new 12-month federal contract vehicle—we only have budget on our Azure MACC.\"",
    options: [
      {
        text: "You can procure Oracle Database@Azure through the Azure Marketplace, drawing down your existing Microsoft Azure Consumption Commitment.",
        isCorrect: true,
      },
      {
        text: "Oracle Database@Azure cannot be purchased through the Azure Marketplace and requires signing a separate hardware lease directly with Oracle.",
        isCorrect: false,
      },
      {
        text: "Using your Azure MACC for Oracle Database@Azure forfeits your ability to use existing Oracle Bring Your Own License (BYOL) entitlements.",
        isCorrect: false,
      },
      {
        text: "Azure Marketplace only sells unmanaged Oracle Linux virtual machines and does not list Exadata Database Service or Autonomous Database.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle Database@Azure is transacted directly through the Azure Marketplace, allowing customers to draw down their existing Microsoft Azure Consumption Commitment (MACC) while still using Oracle BYOL and Unlimited License Agreements (ULA).",
  },
  {
    id: "q-migration-cloud-lift-services-existing",
    category: "Cloud Migration & Multi-Cloud",
    installBase: "Existing Oracle Install Base",
    scenario:
      "An agency IT director says: \"We want to migrate our on-premises Oracle databases and apps to OCI, but my staff has never done a cloud migration and we can't afford a $2M systems-integrator fee just to get started.\"",
    options: [
      {
        text: "Oracle Cloud Lift Services provides hands-on Oracle cloud engineers at no extra cost to help architect and migrate workloads to OCI.",
        isCorrect: true,
      },
      {
        text: "Oracle prohibits customers from migrating their own workloads and requires a mandatory $500,000 consulting retainer before activating an OCI tenancy.",
        isCorrect: false,
      },
      {
        text: "Oracle Cloud Lift Services only provides automated PDF documentation links and does not include hands-on architecture or migration engineering.",
        isCorrect: false,
      },
      {
        text: "Cloud Lift Services is only available for commercial retail companies and cannot assist federal agencies migrating to OCI Government regions.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle Cloud Lift Services gives customers access to specialized Oracle cloud migration engineers at no extra cost to accelerate architecture design and workload migration to OCI.",
  },
  {
    id: "q-migration-weblogic-byol-existing",
    category: "Cloud Migration & Multi-Cloud",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A middleware manager says: \"We run dozens of Java applications on Oracle WebLogic Server on-premises. AWS is pitching us rewriting all of them from scratch to run on Amazon ECS.\"",
    options: [
      {
        text: "WebLogic Server for OCI automates clustering and provisioning on OCI VMs or Kubernetes (OKE) while reusing your WebLogic licenses.",
        isCorrect: true,
      },
      {
        text: "Oracle WebLogic Server cannot run in a cloud environment, so migrating to OCI also requires rewriting all of your Java EE applications from scratch.",
        isCorrect: false,
      },
      {
        text: "Bringing WebLogic licenses to AWS EC2 gives you the same automated JRF database provisioning and favorable OCPU license ratio as OCI.",
        isCorrect: false,
      },
      {
        text: "WebLogic Server for OCI only supports single-node development servers and does not support high-availability clustering or load balancing.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle WebLogic Server for OCI provides turnkey Terraform/OKE automation, full high availability, and favorable OCPU BYOL licensing math without costly application rewrites.",
  },
  {
    id: "q-migration-sqlserver-to-oci-greenfield",
    category: "Cloud Migration & Multi-Cloud",
    installBase: "No Current Oracle Install Base",
    scenario:
      "An infrastructure lead at a non-Oracle agency says: \"We have dozens of Microsoft SQL Server databases and Windows Server apps. Can we run Microsoft workloads on OCI, or is OCI only for Linux and Oracle?\"",
    options: [
      {
        text: "OCI is a first-class host for Windows Server and SQL Server—supporting License Mobility or license-included shapes with high IOPS.",
        isCorrect: true,
      },
      {
        text: "OCI blocks the Microsoft Windows Server operating system and requires converting all .NET and SQL Server apps to Linux before migrating.",
        isCorrect: false,
      },
      {
        text: "Microsoft licensing rules prohibit running SQL Server on OCI under any circumstances, even with active Microsoft Software Assurance.",
        isCorrect: false,
      },
      {
        text: "SQL Server on OCI can only run on single-core burstable VMs and does not support Always On Availability Groups or shared storage.",
        isCorrect: false,
      },
    ],
    explanation:
      "Customers regularly migrate Windows Server, .NET, and Microsoft SQL Server to OCI to take advantage of OCI's lower compute/storage costs, predictable high-IOPS Block Volumes, and Microsoft License Mobility.",
  },
  {
    id: "q-migration-teradata-netezza-adw-greenfield",
    category: "Cloud Migration & Multi-Cloud",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A data warehouse manager says: \"Our legacy on-premises Teradata and Netezza appliances are expiring. Snowflake is pitching us a migration, but we're worried about runaway credit consumption when analysts run complex queries.\"",
    options: [
      {
        text: "Oracle Autonomous Data Warehouse on Exadata delivers predictable, auto-scaling price-performance with built-in ML and zero manual tuning.",
        isCorrect: true,
      },
      {
        text: "Autonomous Data Warehouse charges a separate per-query fee every time an analyst clicks refresh on a dashboard, just like consumption warehouses.",
        isCorrect: false,
      },
      {
        text: "Migrating from Teradata or Netezza to Autonomous Data Warehouse requires manually indexing every single column before queries can execute.",
        isCorrect: false,
      },
      {
        text: "Autonomous Data Warehouse cannot join more than two tables in a single SQL query and requires flattening all data into a single table.",
        isCorrect: false,
      },
    ],
    explanation:
      "Replacing aging Teradata/Netezza appliances with Oracle Autonomous Data Warehouse combines Exadata's columnar flash speed with predictable OCPU/ECPU pricing and built-in OML/Select AI.",
  },
  {
    id: "q-migration-active-dataguard-dr-existing",
    category: "Cloud Migration & Multi-Cloud",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A continuity-of-operations planner says: \"We pay for a disaster recovery site that sits completely idle 364 days a year because our standby database on another cloud can't accept read queries while replicating.\"",
    options: [
      {
        text: "Oracle Active Data Guard on OCI lets your DR standby database stay open for real-time reporting and backups while replicating.",
        isCorrect: true,
      },
      {
        text: "Oracle Data Guard requires shutting down replication completely whenever an analyst runs a read-only SQL report against the standby site.",
        isCorrect: false,
      },
      {
        text: "Cross-region disaster recovery on OCI only updates the standby database once every 24 hours via nightly object storage file copies.",
        isCorrect: false,
      },
      {
        text: "Active Data Guard is only supported on-premises and is disabled when you deploy Exadata Database Service or Autonomous Database on OCI.",
        isCorrect: false,
      },
    ],
    explanation:
      "Active Data Guard (and Autonomous Data Guard) turns an idle DR investment into an active asset by offloading read-only reporting, analytics, and backups to the synchronized standby database.",
  },
  {
    id: "q-migration-adb-dedicated-vs-serverless-existing",
    category: "Cloud Migration & Multi-Cloud",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A security-conscious agency CIO asks: \"We love the self-driving benefits of Oracle Autonomous Database, but our agency security policy requires dedicated Exadata hardware isolation rather than shared serverless nodes.\"",
    options: [
      {
        text: "Autonomous Database on Dedicated Exadata Infrastructure gives you single-tenant Exadata hardware in OCI or Cloud@Customer.",
        isCorrect: true,
      },
      {
        text: "Oracle Autonomous Database is only available on multi-tenant shared hardware, so agencies requiring dedicated racks must manage 19c manually.",
        isCorrect: false,
      },
      {
        text: "Choosing Dedicated Exadata Infrastructure disables all Autonomous self-patching, auto-scaling, and built-in Select AI capabilities.",
        isCorrect: false,
      },
      {
        text: "Autonomous Database on Dedicated Infrastructure is only available in commercial regions and cannot be deployed in OCI US Government regions.",
        isCorrect: false,
      },
    ],
    explanation:
      "Autonomous Database is available both as Serverless and on Dedicated Exadata Infrastructure (in OCI or Exadata Cloud@Customer)—giving agencies complete hardware isolation and control over maintenance schedules.",
  },
  {
    id: "q-migration-ebs-peoplesoft-cloud-manager-existing",
    category: "Cloud Migration & Multi-Cloud",
    installBase: "Existing Oracle Install Base",
    scenario:
      "An enterprise applications director says: \"We still run Oracle E-Business Suite (EBS) and PeopleSoft on aging on-premises hardware. AWS is pitching us a manual lift-and-shift onto EC2. Why is OCI better for these apps?\"",
    options: [
      {
        text: "Oracle Cloud Manager for EBS and PeopleSoft automates one-click cloning, patching, and migration on OCI with Exadata acceleration.",
        isCorrect: true,
      },
      {
        text: "Oracle E-Business Suite and PeopleSoft are no longer supported on OCI, requiring an immediate rip-and-replace before exiting your data center.",
        isCorrect: false,
      },
      {
        text: "AWS EC2 includes Oracle's proprietary PeopleSoft Cloud Manager and Exadata storage offloading natively at no extra cost.",
        isCorrect: false,
      },
      {
        text: "Migrating E-Business Suite to OCI requires manually reinstalling every application tier patch one by one without automated cloning tools.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle provides purpose-built Cloud Manager automation exclusively on OCI for E-Business Suite, PeopleSoft, and JD Edwards—automating lift-and-shift, environment cloning, and lifecycle management.",
  },
  {
    id: "q-migration-split-stack-latency-myth-existing",
    category: "Cloud Migration & Multi-Cloud",
    installBase: "Existing Oracle Install Base",
    scenario:
      "An application architect says: \"AWS told us that if our application servers are in AWS, our database MUST also run on AWS RDS, because putting the database on OCI would cause 100ms of network latency.\"",
    options: [
      {
        text: "With Oracle Database@AWS or Interconnect regions, OCI Exadata sits inside or adjacent to AWS with sub-2ms network latency.",
        isCorrect: true,
      },
      {
        text: "AWS is right that connecting an AWS app to an Oracle database always adds 100ms of latency unless you rewrite the app in Oracle Forms.",
        isCorrect: false,
      },
      {
        text: "The only way to avoid 100ms latency is to cache 100% of your database tables inside Amazon ElastiCache and sync to OCI once a week.",
        isCorrect: false,
      },
      {
        text: "Oracle Database@AWS routes all SQL queries through a satellite relay station, which is why it is only recommended for offline batch jobs.",
        isCorrect: false,
      },
    ],
    explanation:
      "Competitors often spread FUD about cross-cloud latency. With Oracle Database@AWS/Azure/Google (physically inside the hyperscaler data center) or Interconnect (<2ms), latency is on par with single-cloud deployments.",
  },
  {
    id: "q-migration-estate-explorer-assessment-existing",
    category: "Cloud Migration & Multi-Cloud",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A database director with 200 on-premises Oracle databases asks: \"How do we quickly figure out which of our 200 databases are the easiest candidates to move to Autonomous Database first?\"",
    options: [
      {
        text: "Oracle Estate Explorer and Cloud Premigration Advisor Tool (CPAT) automatically catalog and score your fleet for Autonomous readiness.",
        isCorrect: true,
      },
      {
        text: "You must manually read the alert logs of all 200 databases line by line over six months because Oracle has no automated assessment tool.",
        isCorrect: false,
      },
      {
        text: "Oracle Estate Explorer requires shutting down all 200 production databases for 24 hours while it exports their data to a public website.",
        isCorrect: false,
      },
      {
        text: "Only databases smaller than 10 gigabytes with zero stored procedures can be evaluated for migration to Oracle Autonomous Database.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle Estate Explorer and CPAT (Cloud Premigration Advisor Tool) rapidly analyze hundreds of on-premises databases, scoring migration readiness and flagging any needed adjustments before cutover.",
  },
  {
    id: "q-migration-fallback-goldengate-existing",
    category: "Cloud Migration & Multi-Cloud",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A risk-averse agency CIO says: \"What if we cut over our mission-critical database to the cloud on Sunday night and discover an unexpected third-party integration issue on Monday morning? How do we guarantee a safe fallback?\"",
    options: [
      {
        text: "Zero Downtime Migration with GoldenGate supports bi-directional replication, keeping your on-premises DB synced for instant fallback.",
        isCorrect: true,
      },
      {
        text: "Once you cut over to OCI, your on-premises database is automatically wiped, so falling back requires restoring from last month's tape backup.",
        isCorrect: false,
      },
      {
        text: "Falling back to on-premises requires shutting down the agency for 72 hours while all transactions entered on Monday are re-typed by hand.",
        isCorrect: false,
      },
      {
        text: "Bi-directional fallback replication is only supported if you migrate onto standard AWS RDS instead of Oracle Exadata on OCI.",
        isCorrect: false,
      },
    ],
    explanation:
      "Using Oracle GoldenGate during cloud migration allows reverse replication back to the on-premises source after cutover—giving risk-averse federal CIOs a zero-data-loss fallback safety net.",
  },
  {
    id: "q-migration-ula-certification-cloud-existing",
    category: "Cloud Migration & Multi-Cloud",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A software asset manager says: \"Our agency has an active Oracle Unlimited License Agreement (ULA). If we deploy workloads in the cloud, how does OCI treat our ULA differently than third-party clouds?\"",
    options: [
      {
        text: "Workloads deployed on OCI (and Oracle Database@Azure/AWS/Google) count toward certifying an Oracle ULA, unlike generic cloud VMs.",
        isCorrect: true,
      },
      {
        text: "Deploying any database on OCI immediately terminates your on-premises Unlimited License Agreement and triggers a retroactive audit fee.",
        isCorrect: false,
      },
      {
        text: "AWS EC2 and Azure VMs allow you to certify unlimited permanent processor licenses at ULA exit on a 4-to-1 vCPU multiplier.",
        isCorrect: false,
      },
      {
        text: "Oracle Unlimited License Agreements can only be used for desktop client software and never apply to enterprise database deployments.",
        isCorrect: false,
      },
    ],
    explanation:
      "For customers with an Oracle ULA, deploying on OCI or Oracle Database@Azure/AWS/Google protects and maximizes their ULA investment and certification options.",
  },

  // ============================================================================
  // TECH MODERNIZATION — ADDITIONAL SCENARIOS
  // ============================================================================
  {
    id: "q-mod-lakehouse-iceberg-parquet-greenfield",
    category: "Tech Modernization",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A data analytics director with no Oracle footprint says: \"We have petabytes of open Parquet and Apache Iceberg files in object storage, plus structured warehouse tables. Can Autonomous Data Warehouse query open lakehouse formats?\"",
    options: [
      {
        text: "Oracle Autonomous Data Warehouse acts as a unified Lakehouse, querying open Parquet and Iceberg tables alongside warehouse data.",
        isCorrect: true,
      },
      {
        text: "Autonomous Data Warehouse blocks external Parquet and Iceberg files, requiring you to convert all object storage files into proprietary DMP exports.",
        isCorrect: false,
      },
      {
        text: "Querying Parquet files from Autonomous Data Warehouse requires spinning up a separate third-party Databricks cluster to translate every SQL query.",
        isCorrect: false,
      },
      {
        text: "Autonomous Data Warehouse can read CSV files under 5 megabytes from Object Storage, but does not support columnar Parquet or Iceberg tables.",
        isCorrect: false,
      },
    ],
    explanation:
      "Autonomous Data Warehouse seamlessly queries open data lake formats (Apache Iceberg, Parquet, ORC, JSON, CSV) across OCI Object Storage, AWS S3, Azure Blob, and Google Cloud Storage with Exadata acceleration.",
  },
  {
    id: "q-mod-mainframe-exit-adb-apex-greenfield",
    category: "Tech Modernization",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A federal Deputy CIO with no current Oracle install base says: \"We're spending millions keeping a 35-year-old mainframe alive, and our last COBOL engineers retire next year. How can Oracle help us modernize?\"",
    options: [
      {
        text: "Migrating mainframe data to Autonomous Database on OCI and modernizing green-screen apps with Oracle APEX retires mainframe MIPS fast.",
        isCorrect: true,
      },
      {
        text: "Oracle sells newly manufactured IBM z/OS mainframe hardware racks so your agency can continue writing COBOL for another 30 years.",
        isCorrect: false,
      },
      {
        text: "OCI cannot process high-volume transactional batch jobs, so mainframe workloads must be split across hundreds of desktop Access files.",
        isCorrect: false,
      },
      {
        text: "Modernizing a mainframe onto OCI requires keeping the physical mainframe running forever as a front-end terminal router for every user click.",
        isCorrect: false,
      },
    ],
    explanation:
      "Mainframe re-platforming and modernization onto OCI, Exadata/Autonomous Database, and Oracle APEX slashes millions in legacy mainframe maintenance while modernizing user workflows.",
  },
  {
    id: "q-mod-txeventq-microservices-existing",
    category: "Tech Modernization",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A microservices architect says: \"We use Apache Kafka on AWS to pass events between microservices, but when a database commit succeeds and the Kafka message fails, our financial records get out of sync.\"",
    options: [
      {
        text: "Oracle 26ai Transactional Event Queues (TxEventQ) build Kafka-compatible messaging into the database so data and events commit atomically.",
        isCorrect: true,
      },
      {
        text: "Oracle 26ai requires disabling database transactions altogether when using microservices so that every service writes to unindexed flat files.",
        isCorrect: false,
      },
      {
        text: "TxEventQ is a standalone third-party message broker hosted outside OCI that polls your database every 15 minutes for updated rows.",
        isCorrect: false,
      },
      {
        text: "To keep Kafka in sync with your database, Oracle recommends pausing all user traffic for 10 seconds after every single SQL INSERT statement.",
        isCorrect: false,
      },
    ],
    explanation:
      "Transactional Event Queues (TxEventQ) in Oracle Database 26ai let developers publish and consume Kafka-compatible events inside the exact same ACID database transaction as their SQL updates—eliminating dual-write inconsistency.",
  },
  {
    id: "q-mod-forms-to-apex-existing",
    category: "Tech Modernization",
    installBase: "Existing Oracle Install Base",
    scenario:
      "An agency applications manager says: \"We have a 20-year-old Oracle Forms application that runs our core case workflow. Competitors are pitching us a $10M, 3-year Java/React rewrite that throws away all our database PL/SQL logic.\"",
    options: [
      {
        text: "Modernizing Oracle Forms to Oracle APEX reuses 100% of your existing database packages, triggers, and PL/SQL logic in a modern web UI.",
        isCorrect: true,
      },
      {
        text: "Moving from Oracle Forms to Oracle APEX requires deleting all of your existing PL/SQL stored procedures and rewriting them in TypeScript.",
        isCorrect: false,
      },
      {
        text: "Oracle APEX still requires installing the legacy Java Applet browser plugin on every user's desktop just like classic Oracle Forms.",
        isCorrect: false,
      },
      {
        text: "Oracle Forms databases cannot be upgraded to Oracle 26ai or migrated to OCI without first converting all tables into MongoDB collections.",
        isCorrect: false,
      },
    ],
    explanation:
      "Because both Oracle Forms and Oracle APEX are built around SQL and PL/SQL in the database, modernizing Forms to APEX preserves existing business logic and cuts modernization time and cost by 70–80%.",
  },
  {
    id: "q-mod-oic-integration-adapters-greenfield",
    category: "Tech Modernization",
    installBase: "No Current Oracle Install Base",
    scenario:
      "An enterprise integration lead says: \"We have SaaS apps, on-premises SAP and Workday systems, and custom federal databases. Writing custom point-to-point API glue code in AWS Lambda is becoming unmaintainable.\"",
    options: [
      {
        text: "Oracle Integration Cloud (OIC) provides pre-built enterprise adapters, visual low-code orchestration, and B2B/EDI integration.",
        isCorrect: true,
      },
      {
        text: "Oracle Integration Cloud only connects Oracle SaaS applications to each other and blocks connections to SAP, Salesforce, or Workday.",
        isCorrect: false,
      },
      {
        text: "Building an integration flow in OIC requires writing thousands of lines of custom C++ socket code for every REST or SOAP endpoint.",
        isCorrect: false,
      },
      {
        text: "Oracle Integration Cloud is an on-premises-only middleware CD-ROM that cannot be deployed as a managed service inside OCI regions.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle Integration Cloud (OIC) accelerates hybrid and multi-cloud modernization with pre-built adapters for Oracle and non-Oracle apps (SAP, Workday, Salesforce, ServiceNow, databases) plus visual process automation.",
  },
  {
    id: "q-mod-data-safe-included-existing",
    category: "Tech Modernization",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A database security officer says: \"To meet federal audit requirements on AWS, we had to buy separate third-party tools for database configuration auditing, user risk assessment, activity auditing, and sensitive data masking.\"",
    options: [
      {
        text: "Oracle Data Safe is a unified security control center included with Autonomous Database for assessments, auditing, and data masking.",
        isCorrect: true,
      },
      {
        text: "Oracle Data Safe only checks password length rules and requires buying four separate third-party appliances for auditing and data masking.",
        isCorrect: false,
      },
      {
        text: "Using Oracle Data Safe to mask sensitive PII for test environments permanently overwrites and destroys the data in your production database.",
        isCorrect: false,
      },
      {
        text: "Oracle Data Safe is only available for on-premises Solaris servers and cannot monitor Exadata Database Service or Autonomous Database on OCI.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle Data Safe is included with Autonomous Database (and Exadata/Base DB on OCI) and unifies security posture assessment, user risk evaluation, sensitive data discovery, data masking, and activity auditing.",
  },
  {
    id: "q-mod-database-vault-zero-trust-existing",
    category: "Tech Modernization",
    installBase: "Existing Oracle Install Base",
    scenario:
      "An intelligence agency security director says: \"Under our Zero-Trust mandate, even a privileged DBA who patches and tunes the database must NEVER be able to query sensitive citizen or classified mission tables.\"",
    options: [
      {
        text: "Oracle Database Vault enforces mandatory Realms inside the database kernel, blocking privileged DBAs from viewing sensitive mission tables.",
        isCorrect: true,
      },
      {
        text: "In any relational database, anyone with the DBA role can always read every table, so the only solution is to stop employing database administrators.",
        isCorrect: false,
      },
      {
        text: "Oracle Database Vault prevents DBA access by encrypting the entire monitor screen so DBAs cannot see error messages when tuning queries.",
        isCorrect: false,
      },
      {
        text: "Enforcing separation of duties in Oracle Database requires copying each sensitive table onto a separate physical server with no admin account.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle Database Vault is a proven federal security differentiator: it enforces strict separation of duties inside the database so DBAs can perform maintenance without ever accessing protected application data.",
  },
  {
    id: "q-mod-oac-analytics-cloud-greenfield",
    category: "Tech Modernization",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A BI director at a non-Oracle agency says: \"Our analysts use desktop BI tools that create ungoverned data extracts on laptops, leading to conflicting metrics in executive briefings. How does Oracle Analytics Cloud (OAC) help?\"",
    options: [
      {
        text: "Oracle Analytics Cloud combines a governed semantic model with self-service visual analytics, AI Assistant, and live database queries.",
        isCorrect: true,
      },
      {
        text: "Oracle Analytics Cloud requires every user to download a 50-gigabyte desktop client and store all agency datasets on their local hard drive.",
        isCorrect: false,
      },
      {
        text: "Oracle Analytics Cloud can only connect to Oracle 26ai databases and blocks connections to Snowflake, SQL Server, Postgres, or Google BigQuery.",
        isCorrect: false,
      },
      {
        text: "Creating a chart in Oracle Analytics Cloud requires writing custom Java servlets because OAC does not include drag-and-drop visual dashboards.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle Analytics Cloud (OAC) bridges governed enterprise BI (a single semantic source of truth across Oracle and non-Oracle data sources) with modern self-service visualization and generative AI.",
  },
  {
    id: "q-mod-arcgis-spatial-modernization-existing",
    category: "Tech Modernization",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A geospatial intelligence lead says: \"We run Esri ArcGIS on an on-premises database and want to modernize to the cloud while adding spatial analytics and 3D lidar/raster processing.\"",
    options: [
      {
        text: "Oracle Spatial in Autonomous Database and Exadata is certified with Esri ArcGIS and includes 3D lidar, raster, and Spatial Studio tools.",
        isCorrect: true,
      },
      {
        text: "Esri ArcGIS cannot connect to Oracle Autonomous Database, forcing agencies to abandon their existing Esri geodatabases when moving to OCI.",
        isCorrect: false,
      },
      {
        text: "Oracle Spatial requires purchasing a separate per-user GIS license for every citizen who views a public map on your agency's website.",
        isCorrect: false,
      },
      {
        text: "Storing 3D lidar or satellite raster imagery on OCI requires converting all map data into flat comma-separated text files in Object Storage.",
        isCorrect: false,
      },
    ],
    explanation:
      "Oracle Spatial is included at no extra cost in Oracle Database / Autonomous Database, is deeply integrated with Esri ArcGIS Enterprise, and natively processes vector, raster, 3D lidar, and network graphs.",
  },
  {
    id: "q-mod-oci-streaming-kafka-greenfield",
    category: "Tech Modernization",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A platform engineer says: \"We run open-source Apache Kafka on AWS to ingest IoT sensor and border-gate telemetry, but managing ZooKeeper/KRaft brokers and paying AWS Managed Kafka fees is expensive.\"",
    options: [
      {
        text: "OCI Streaming is a fully managed serverless event streaming service with native Apache Kafka compatibility and low-cost pricing.",
        isCorrect: true,
      },
      {
        text: "OCI Streaming uses a proprietary binary protocol that requires rewriting all of your existing Apache Kafka producer and consumer applications.",
        isCorrect: false,
      },
      {
        text: "Using OCI Streaming requires your team to manually patch underlying Linux broker virtual machines and rebalance partitions whenever traffic spikes.",
        isCorrect: false,
      },
      {
        text: "OCI Streaming only accepts batch file uploads once an hour and cannot ingest real-time telemetry from field sensors or microservices.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI Streaming is Kafka-compatible out of the box—allowing agencies to point existing Kafka producers/consumers at OCI with zero broker management and significantly lower cost than AWS MSK.",
  },
  {
    id: "q-mod-api-gateway-functions-greenfield",
    category: "Tech Modernization",
    installBase: "No Current Oracle Install Base",
    scenario:
      "A modernization architect says: \"We want to wrap our legacy backend systems in secure REST APIs with OAuth authentication, rate limiting, and serverless event triggers using open standards.\"",
    options: [
      {
        text: "OCI API Gateway and OCI Functions (built on open-source Fn) provide managed API security, routing, and serverless execution.",
        isCorrect: true,
      },
      {
        text: "OCI Functions locks your code into a proprietary runtime that prevents you from ever running your serverless functions as standard Docker containers.",
        isCorrect: false,
      },
      {
        text: "OCI API Gateway cannot validate JWT or OAuth tokens and requires exposing backend database ports directly to the public internet.",
        isCorrect: false,
      },
      {
        text: "Deploying serverless functions on OCI requires purchasing a dedicated bare-metal server that bills 24/7 even when no API calls occur.",
        isCorrect: false,
      },
    ],
    explanation:
      "OCI Functions is based on the open-source Fn Project (meaning every function is a standard Docker container with zero vendor lock-in), paired with OCI API Gateway for OAuth/JWT security and throttling.",
  },
  {
    id: "q-mod-data-studio-adb-existing",
    category: "Tech Modernization",
    installBase: "Existing Oracle Install Base",
    scenario:
      "A data warehouse manager says: \"On other clouds, we have to buy separate third-party tools for data loading, visual data transforms, data cataloging, and business data sharing. What comes built into Autonomous Database?\"",
    options: [
      {
        text: "Autonomous Database includes built-in Data Studio at no extra cost for visual data loading, transforms, cataloging, and Delta Sharing.",
        isCorrect: true,
      },
      {
        text: "Autonomous Database only provides a command-line SQL prompt, requiring separate paid licenses for visual data loading and data cataloging.",
        isCorrect: false,
      },
      {
        text: "Data Studio in Autonomous Database is a desktop Windows installer that can only load local CSV files smaller than 10 megabytes.",
        isCorrect: false,
      },
      {
        text: "Sharing data from Autonomous Database Data Studio requires recipients to purchase an Oracle Exadata rack before they can view shared tables.",
        isCorrect: false,
      },
    ],
    explanation:
      "Built-in Data Studio inside Oracle Autonomous Database gives teams browser-based Data Load, Data Transforms, Data Catalog, Data Insights, and open-standard Delta Sharing at no additional cost.",
  },
  {
    id: "q-mod-graph-studio-adb-existing",
    category: "Tech Modernization",
    installBase: "Existing Oracle Install Base",
    scenario:
      "An investigative analytics team using Oracle Autonomous Database says: \"We want to visually explore fraud networks and run 60+ pre-built graph algorithms like PageRank and community detection without setting up graph servers.\"",
    options: [
      {
        text: "Graph Studio is included in Autonomous Database, automating graph models from relational tables with built-in notebooks and visual tools.",
        isCorrect: true,
      },
      {
        text: "Graph Studio is a paid third-party SaaS subscription that requires exporting your sensitive Autonomous Database tables to an external cloud.",
        isCorrect: false,
      },
      {
        text: "Running graph algorithms like PageRank in Autonomous Database requires manually configuring and patching a separate Linux cluster on OCI.",
        isCorrect: false,
      },
      {
        text: "Graph Studio can display static network diagrams, but cannot execute graph algorithms or query live relational tables in Autonomous Database.",
        isCorrect: false,
      },
    ],
    explanation:
      "Graph Studio is built right into Oracle Autonomous Database—letting analysts model relational tables as graphs in one click, run dozens of parallel in-memory graph algorithms, and visualize results in interactive notebooks.",
  },
];

export function generateRandomQuiz(count = 10): QuizQuestion[] {
  // Fisher-Yates shuffle on a copy of the pool
  const poolCopy = [...SALES_QUIZ_POOL];
  for (let i = poolCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [poolCopy[i], poolCopy[j]] = [poolCopy[j], poolCopy[i]];
  }

  const selected = poolCopy.slice(0, Math.min(count, poolCopy.length));

  // Also shuffle the 4 options inside each selected question so the correct answer position is randomized
  return selected.map((q) => {
    const shuffledOptions = [...q.options];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }
    return {
      ...q,
      options: shuffledOptions,
    };
  });
}
