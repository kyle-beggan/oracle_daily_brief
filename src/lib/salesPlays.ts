export interface SalesPlayItem {
  title: string;
  source_type: "Current Event" | "Technology Roadmap" | "Acquisition Forecast";
  problem_or_focus_area: string;
  oracle_solution: string;
  value_proposition: string;
  target_contact_name: string;
  target_contact_role: string;
  target_contact_sales_nav_url: string;
}

export function makeSalesNavUrl(name: string, agency: string): string {
  const cleanName = name.replace(/\s*\([^)]*\)\s*/g, " ").trim();
  return `https://www.linkedin.com/sales/search/people?query=(keywords%3A${encodeURIComponent(
    cleanName + " " + agency
  )})`;
}

export const FALLBACK_SALES_PLAYS_BY_TERRITORY: Record<string, SalesPlayItem[]> = {
  "U.S. Department of Homeland Security Headquarters": [
    {
      title: "Enterprise AI Governance & Cross-Component Vector Search",
      source_type: "Current Event",
      problem_or_focus_area:
        "DHS OCIO and the Chief AI Officer are scaling department-wide generative AI pilots while enforcing strict zero-trust data boundaries across HQ and component repositories. Agencies struggle with data duplication and security drift when moving sensitive mission records into standalone vector databases.",
      oracle_solution:
        "Oracle Database 26ai with AI Vector Search & OCI Generative AI Service (FedRAMP High)",
      value_proposition:
        "Oracle 26ai lets DHS run semantic vector search and retrieval-augmented generation (RAG) directly inside the converged database alongside existing relational security controls, eliminating separate vector database sprawl and keeping sensitive homeland security data within accredited enclaves.",
      target_contact_name: "Kyle Schutt",
      target_contact_role: "Acting CIO & Chief AI Officer",
      target_contact_sales_nav_url: makeSalesNavUrl("Kyle Schutt", "Department of Homeland Security")
    },
    {
      title: "Multi-Cloud Data Center & Cloud Optimization (DCCO) Cost Reduction",
      source_type: "Technology Roadmap",
      problem_or_focus_area:
        "Under the DHS Data Center and Cloud Optimization (DCCO) roadmap, DHS HQ operates hybrid and multi-cloud workloads across AWS, Azure, and Stennis DC1, facing rising data egress fees and database licensing overhead on third-party clouds.",
      oracle_solution:
        "Oracle Cloud Infrastructure (OCI) Government Cloud & Oracle Interconnect for Azure / AWS",
      value_proposition:
        "OCI delivers predictable government cloud pricing with zero network egress fees via dedicated low-latency multi-cloud interconnects, allowing DHS to run heavy database and analytics tiers on OCI Exadata while keeping front-end apps in Azure or AWS.",
      target_contact_name: "Rear Admiral Christopher Bartz",
      target_contact_role: "Deputy CIO",
      target_contact_sales_nav_url: makeSalesNavUrl("Christopher Bartz", "Department of Homeland Security")
    },
    {
      title: "Department-Wide Data Mesh & Automated Data Lineage",
      source_type: "Technology Roadmap",
      problem_or_focus_area:
        "The DHS Chief Data Officer is driving real-time cross-component data sharing for border, cyber, and emergency operations, but legacy ETL batch jobs create latency and inconsistent schemas across directorates.",
      oracle_solution:
        "Oracle Autonomous Data Warehouse & Oracle GoldenGate Stream Analytics",
      value_proposition:
        "GoldenGate provides real-time change data capture across heterogeneous component databases into an Autonomous Data Warehouse with built-in JSON, graph, and spatial analytics, giving leadership a live executive decision-support fabric.",
      target_contact_name: "Mike Horton",
      target_contact_role: "Chief Data Officer",
      target_contact_sales_nav_url: makeSalesNavUrl("Mike Horton", "Department of Homeland Security")
    },
    {
      title: "Zero-Trust Database Security & Automated Compliance Auditing",
      source_type: "Current Event",
      problem_or_focus_area:
        "Federal zero-trust mandates (OMB M-22-09 and CISA BODs) require continuous encryption, privileged user auditing, and automated threat detection down to the data layer across all DHS HQ mission systems.",
      oracle_solution:
        "Oracle Data Safe, Database Vault & OCI Maximum Security Zones",
      value_proposition:
        "Database Vault enforces mandatory Separation of Duties so even privileged DBAs cannot view sensitive mission data, while Data Safe automates continuous compliance auditing and data masking across hybrid and cloud databases.",
      target_contact_name: "Paul Boscacci",
      target_contact_role: "CISO",
      target_contact_sales_nav_url: makeSalesNavUrl("Paul Boscacci", "Department of Homeland Security")
    }
  ],

  "Federal Emergency Management Agency (FEMA)": [
    {
      title: "Elastic Disaster Surge Scaling for Survivor Assistance & NFIP",
      source_type: "Current Event",
      problem_or_focus_area:
        "During concurrent major hurricane and wildfire declarations, FEMA's survivor registration, Individual Assistance, and National Flood Insurance Program (NFIP) databases experience massive 10x–20x transaction spikes that strain legacy architectures.",
      oracle_solution:
        "Oracle Autonomous Database on Exadata Cloud Infrastructure (OCI FedRAMP High)",
      value_proposition:
        "Autonomous Database dynamically auto-scales compute and I/O online with zero downtime during disaster surge events and scales back down post-incident, ensuring 99.995% availability while preventing over-provisioned cloud spend.",
      target_contact_name: "Steven McAndrews",
      target_contact_role: "CIO",
      target_contact_sales_nav_url: makeSalesNavUrl("Steven McAndrews", "FEMA")
    },
    {
      title: "Enterprise Data & Analytics Modernization (EDAM) & Grants Consolidation",
      source_type: "Technology Roadmap",
      problem_or_focus_area:
        "FEMA's technology roadmap prioritizes unifying fragmented preparedness, hazard mitigation, and public assistance grant systems (FEMA GO / GMM) with real-time logistics and financial ledgers to eliminate manual reconciliation.",
      oracle_solution:
        "Oracle Database 26ai JSON Relational Duality & Oracle Analytics Cloud",
      value_proposition:
        "JSON Relational Duality allows FEMA's Agile microservices teams to build modern document-based grant intake APIs while storing data as normalized relational tables for instant financial reconciliation and fraud analytics.",
      target_contact_name: "Zeke Maldonado",
      target_contact_role: "Deputy CIO",
      target_contact_sales_nav_url: makeSalesNavUrl("Zeke Maldonado", "FEMA")
    },
    {
      title: "Geospatial Flood Risk Modeling & Real-Time Supply Chain Tracking",
      source_type: "Technology Roadmap",
      problem_or_focus_area:
        "FEMA requires high-speed geospatial analytics to correlate Risk Rating 2.0 flood models, critical infrastructure vulnerability maps, and real-time emergency commodity movements in the Logistics Supply Chain Management System (LSCMS).",
      oracle_solution:
        "Oracle Spatial & Graph in Oracle 26ai + OCI AI Agents",
      value_proposition:
        "Native Oracle Spatial processing and AI Vector Search allow incident commanders to query geospatial hazard zones alongside unstructured situation reports and live logistics telemetry in a single sub-second SQL query.",
      target_contact_name: "Bobby McCandlish",
      target_contact_role: "Chief Technology Officer",
      target_contact_sales_nav_url: makeSalesNavUrl("Bobby McCandlish", "FEMA")
    }
  ],

  "Homeland Security Operational Analysis Center (HSOAC) & Homeland Security Systems Engineering and Development Institute (HSSEDI)": [
    {
      title: "High-Performance AI Simulation & Sensor Validation Testbed",
      source_type: "Current Event",
      problem_or_focus_area:
        "HSOAC and HSSEDI are evaluating AI model assurance, biometric accuracy, and non-intrusive inspection algorithms across DHS components, requiring high-density GPU clusters with deterministic network latency.",
      oracle_solution:
        "OCI Supercluster & Bare Metal GPU Instances with RDMA Cluster Networking",
      value_proposition:
        "OCI's non-oversubscribed RDMA cluster networking and bare-metal NVIDIA GPU shapes deliver superior price-performance and predictable low latency for training, red-teaming, and benchmarking homeland security AI models.",
      target_contact_name: "Kerry Buckley",
      target_contact_role: "HSSEDI Director (MITRE)",
      target_contact_sales_nav_url: makeSalesNavUrl("Kerry Buckley", "MITRE HSSEDI")
    },
    {
      title: "Cross-Component Cloud Reference Architecture & Interoperability",
      source_type: "Technology Roadmap",
      problem_or_focus_area:
        "HSSEDI's systems engineering roadmap focuses on eliminating data silos and standardizing multi-cloud interoperability across CBP, ICE, USCIS, and CISA without forcing costly application rewrites.",
      oracle_solution:
        "Oracle Database 26ai Converged Architecture & OCI Multi-Cloud Interconnect",
      value_proposition:
        "A converged Oracle 26ai data tier supports relational, JSON, vector, graph, and spatial workloads through standard APIs, giving MITRE and DHS S&T a unified reference architecture that bridges multiple commercial clouds.",
      target_contact_name: "Nabajyoti Barkakati",
      target_contact_role: "DHS S&T CIO",
      target_contact_sales_nav_url: makeSalesNavUrl("Nabajyoti Barkakati", "Department of Homeland Security")
    },
    {
      title: "Operational Analysis & Acquisition Cost-Benefit Modeling Platform",
      source_type: "Technology Roadmap",
      problem_or_focus_area:
        "RAND HSOAC conducts complex Monte Carlo simulations, workforce readiness modeling, and border policy evaluations across massive multi-year DHS datasets.",
      oracle_solution:
        "Oracle Autonomous Data Warehouse & Oracle Machine Learning (OML)",
      value_proposition:
        "In-database machine learning (OML4Py / OML4R) allows RAND researchers to run statistical and predictive models directly where the data resides without exporting sensitive DHS datasets to external workstations.",
      target_contact_name: "Eric Landree",
      target_contact_role: "HSOAC Director (RAND)",
      target_contact_sales_nav_url: makeSalesNavUrl("Eric Landree", "RAND HSOAC")
    }
  ],

  "U.S. Secret Service (USSS)": [
    {
      title: "Cryptocurrency & Financial Cyber Crime Graph Analytics",
      source_type: "Current Event",
      problem_or_focus_area:
        "The Secret Service Cyber Investigative Section faces exploding transaction volumes in transnational ransomware, illicit cryptocurrency laundering, and wire fraud investigations that overwhelm traditional relational queries.",
      oracle_solution:
        "Oracle Database 26ai Property Graph & AI Vector Search on OCI",
      value_proposition:
        "Built-in SQL Property Graph and AI Vector Search allow cyber investigators to trace multi-hop illicit financial networks and correlate unstructured forensic evidence in real time within a single hardened database.",
      target_contact_name: "Chris Kraft",
      target_contact_role: "CIO",
      target_contact_sales_nav_url: makeSalesNavUrl("Chris Kraft", "Secret Service")
    },
    {
      title: "Resilient Hybrid Cloud for National Special Security Events (NSSE)",
      source_type: "Technology Roadmap",
      problem_or_focus_area:
        "With upcoming major National Special Security Events (FIFA World Cup, America250, and dignitary summits), USSS requires zero-downtime protective intelligence databases and deployable tactical edge computing.",
      oracle_solution:
        "Oracle Exadata Cloud@Customer & OCI Roving Edge Infrastructure",
      value_proposition:
        "OCI Roving Edge devices bring ruggedized compute, GPU video analytics, and local Oracle database synchronization directly to NSSE mobile command posts, seamlessly replicating back to USSS headquarters cloud enclaves.",
      target_contact_name: "Susan Palmer",
      target_contact_role: "Deputy CIO",
      target_contact_sales_nav_url: makeSalesNavUrl("Susan Palmer", "Secret Service")
    },
    {
      title: "Classified Protective Intelligence Modernization",
      source_type: "Technology Roadmap",
      problem_or_focus_area:
        "USSS is modernizing legacy protective intelligence and venue access vetting applications while maintaining strict air-gapped and classified data sovereignty requirements.",
      oracle_solution:
        "OCI National Security Regions & Oracle Autonomous Database",
      value_proposition:
        "OCI's accredited government and national security regions provide complete architectural parity with commercial cloud, enabling USSS to modernize protective vetting databases with automated patching and zero-trust encryption.",
      target_contact_name: "Matthew Quinn",
      target_contact_role: "Deputy Director",
      target_contact_sales_nav_url: makeSalesNavUrl("Matthew Quinn", "Secret Service")
    }
  ],

  "DHS Office of Intelligence & Analysis (I&A)": [
    {
      title: "High-Side Multi-INT RAG & Entity Resolution on Classified Cloud",
      source_type: "Current Event",
      problem_or_focus_area:
        "DHS I&A analysts must correlate high volumes of unstructured OSINT, classified intelligence cables, and state/local fusion center reports across HSDN and Top Secret enclaves to detect emerging homeland threats.",
      oracle_solution:
        "Oracle Database 26ai AI Vector Search & Property Graph in OCI Classified Regions",
      value_proposition:
        "Combining AI Vector Search with Property Graph inside accredited OCI national security enclaves lets analysts semantically search millions of intelligence reports and automatically uncover hidden entity relationships without data leaving high-side boundaries.",
      target_contact_name: "Ken Massey",
      target_contact_role: "CIO",
      target_contact_sales_nav_url: makeSalesNavUrl("Ken Massey", "Department of Homeland Security")
    },
    {
      title: "Real-Time Cross-Component Intelligence Data Mesh",
      source_type: "Technology Roadmap",
      problem_or_focus_area:
        "I&A's data strategy focuses on breaking down silos between CBP, ICE, USCG, and fusion center threat repositories while enforcing strict need-to-know row-level and label-based access controls.",
      oracle_solution:
        "Oracle Label Security (OLS) & Oracle GoldenGate on Autonomous Database",
      value_proposition:
        "Oracle Label Security natively enforces classification markings and compartmented access at the individual row level, enabling a unified intelligence data lake that safely serves users across multiple clearance tiers.",
      target_contact_name: "Robert Wood",
      target_contact_role: "Chief Data Officer",
      target_contact_sales_nav_url: makeSalesNavUrl("Robert Wood", "Department of Homeland Security")
    },
    {
      title: "Fusion Center Information Sharing Portal Modernization",
      source_type: "Technology Roadmap",
      problem_or_focus_area:
        "Modernizing intelligence dissemination workflows across 80+ state and major urban area fusion centers requires low-latency API gateways, automated threat indicator triage, and zero-trust identity federation.",
      oracle_solution:
        "OCI Application Development (APEX) & Oracle Autonomous JSON Database",
      value_proposition:
        "Oracle APEX and Autonomous Database allow I&A engineering teams to rapidly deploy secure, FedRAMP High/classified intelligence sharing portals and STIX/TAXII threat feeds with minimal custom middleware.",
      target_contact_name: "Jennifer Jones",
      target_contact_role: "Deputy CIO",
      target_contact_sales_nav_url: makeSalesNavUrl("Jennifer Jones", "Department of Homeland Security")
    }
  ],

  "Transportation Security Administration (TSA)": [
    {
      title: "Secure Flight & CAT-2 Biometric Vetting Latency Optimization",
      source_type: "Current Event",
      problem_or_focus_area:
        "As TSA expands Credential Authentication Technology (CAT-2) facial biometrics and Digital ID verification across 430+ airports, passenger vetting databases must handle sub-second real-time matching against millions of daily flight manifests.",
      oracle_solution:
        "Oracle Exadata Cloud Infrastructure & Oracle Database 26ai True Cache",
      value_proposition:
        "Oracle 26ai True Cache and Exadata's RDMA smart storage deliver microsecond query latency and active-active fault tolerance for Secure Flight and biometric credential validation during peak holiday travel surges.",
      target_contact_name: "Balaji V. Subramaniam",
      target_contact_role: "CIO",
      target_contact_sales_nav_url: makeSalesNavUrl("Balaji Subramaniam", "TSA")
    },
    {
      title: "Open-Architecture Checkpoint CT Telemetry & Predictive Maintenance",
      source_type: "Technology Roadmap",
      problem_or_focus_area:
        "TSA's checkpoint modernization roadmap connects thousands of 3D Computed Tomography (CT) baggage scanners and Automated Target Recognition (ATR) systems to the cloud to predict hardware faults before lanes go offline.",
      oracle_solution:
        "OCI Streaming, Oracle Autonomous Data Warehouse & OCI AI Services",
      value_proposition:
        "OCI ingests high-frequency IoT telemetry from airport screening lanes at a fraction of hyperscaler ingestion costs, using in-database machine learning to predict equipment maintenance windows and maximize lane availability.",
      target_contact_name: "David Earle",
      target_contact_role: "Deputy CIO",
      target_contact_sales_nav_url: makeSalesNavUrl("David Earle", "TSA")
    },
    {
      title: "Enterprise Passenger Wait-Time & Workforce Allocation Analytics",
      source_type: "Technology Roadmap",
      problem_or_focus_area:
        "TSA's Chief Data Officer is integrating airline reservation feeds, real-time checkpoint throughput, and TSO scheduling datasets to reduce passenger wait times and optimize staffing across nationwide airports.",
      oracle_solution:
        "Oracle Analytics Cloud (OAC) & Oracle Autonomous Database",
      value_proposition:
        "Provides a unified, governed enterprise data platform that combines live operational streaming data with historical flight models, empowering Federal Security Directors with AI-driven staffing forecasts.",
      target_contact_name: "Mike Karas",
      target_contact_role: "Chief Data Officer",
      target_contact_sales_nav_url: makeSalesNavUrl("Mike Karas", "TSA")
    }
  ],

  "U.S. Coast Guard (USCG)": [
    {
      title: "Disconnected Cutter Tactical Edge Cloud & C5ISR Data Sync",
      source_type: "Current Event",
      problem_or_focus_area:
        "National Security Cutters and Offshore Patrol Cutters operate in contested or bandwidth-constrained maritime environments where intermittent SATCOM links disrupt cloud application access and sensor data synchronization.",
      oracle_solution:
        "OCI Roving Edge Infrastructure & Oracle GoldenGate Asynchronous Replication",
      value_proposition:
        "OCI Roving Edge nodes run containerized C5I applications, AI computer vision for UAS video feeds, and local Oracle databases aboard cutters at sea, automatically synchronizing compressed deltas to shore cloud enclaves when SATCOM links restore.",
      target_contact_name: "Scott St. Pierre",
      target_contact_role: "Assistant Commandant for C5I & CIO",
      target_contact_sales_nav_url: makeSalesNavUrl("Scott St. Pierre", "Coast Guard")
    },
    {
      title: "Fleet Logistics & Condition-Based Maintenance Modernization",
      source_type: "Technology Roadmap",
      problem_or_focus_area:
        "USCG's systems modernization roadmap focuses on unifying aviation (ALMIS) and surface fleet logistics databases to eliminate maintenance backlogs and improve cutter/aircraft operational availability.",
      oracle_solution:
        "Oracle Database 26ai & Oracle Fusion Cloud Supply Chain / Asset Management",
      value_proposition:
        "Consolidates fragmented hull, mechanical, electrical, and avionics maintenance records into an AI-enabled converged database that predicts part failures and automates supply chain requisitioning across shore depots.",
      target_contact_name: "Rear Admiral Jon P. Hickey",
      target_contact_role: "Deputy Commandant for Systems",
      target_contact_sales_nav_url: makeSalesNavUrl("Jon Hickey", "Coast Guard")
    },
    {
      title: "Maritime Domain Awareness & Illicit Trafficking Analytics",
      source_type: "Current Event",
      problem_or_focus_area:
        "Correlating AIS vessel transponders, dark-ship satellite radar detections, and interagency counter-narcotics intelligence requires high-speed spatial and graph analytics across massive maritime datasets.",
      oracle_solution:
        "Oracle Spatial & Property Graph in Oracle Autonomous Database (DISA IL5)",
      value_proposition:
        "Enables Coast Guard Maritime Intelligence Fusion Centers to fuse live geospatial vessel tracks with vessel ownership graphs to flag anomalous maritime behavior in real time.",
      target_contact_name: "Vice Admiral Thomas G. Allan Jr.",
      target_contact_role: "Vice Commandant",
      target_contact_sales_nav_url: makeSalesNavUrl("Thomas Allan", "Coast Guard")
    }
  ],

  "U.S. Citizenship and Immigration Services (USCIS)": [
    {
      title: "AI-Assisted Adjudication Backlog Reduction & Document Processing",
      source_type: "Current Event",
      problem_or_focus_area:
        "USCIS processes millions of immigration benefit applications and digitized A-Files annually in ELIS, seeking to accelerate case adjudication and reduce backlogs using secure generative AI and intelligent document processing.",
      oracle_solution:
        "Oracle Database 26ai AI Vector Search & OCI Document Understanding",
      value_proposition:
        "Allows USCIS to extract, embed, and semantically search unstructured case files alongside structured ELIS relational data inside one database, enabling AI-assisted case summaries without moving PII to external AI tools.",
      target_contact_name: "Andrew Vanjani",
      target_contact_role: "CIO",
      target_contact_sales_nav_url: makeSalesNavUrl("Andrew Vanjani", "USCIS")
    },
    {
      title: "High-Throughput E-Verify, SAVE & Person Centric Query Modernization",
      source_type: "Technology Roadmap",
      problem_or_focus_area:
        "USCIS's Verification Information System (E-Verify / SAVE) and Person Centric Query Service (PCQS) handle tens of millions of real-time eligibility queries across federal and state partners, requiring extreme concurrency and zero downtime.",
      oracle_solution:
        "Oracle Exadata Cloud Infrastructure & Oracle 26ai JSON Relational Duality",
      value_proposition:
        "Delivers linear scalability, active-active high availability, and sub-millisecond API response times for identity verification microservices while reducing multi-cloud database hosting costs.",
      target_contact_name: "Dave Bottom",
      target_contact_role: "Deputy CIO",
      target_contact_sales_nav_url: makeSalesNavUrl("Dave Bottom", "USCIS")
    },
    {
      title: "Benefit Fraud Detection & Entity Resolution Graph Analytics",
      source_type: "Technology Roadmap",
      problem_or_focus_area:
        "The Chief Data & AI Officer and the Fraud Detection and National Security (FDNS) Directorate need to identify complex, coordinated immigration benefit fraud rings hidden across millions of filings.",
      oracle_solution:
        "Oracle Database 26ai Property Graph & Oracle Machine Learning",
      value_proposition:
        "Native graph analytics uncovers shared addresses, shell petitioners, financial anomalies, and document patterns directly on live transactional data without slow ETL transfers to third-party graph engines.",
      target_contact_name: "Steve Yonkers",
      target_contact_role: "Chief Data & AI Officer",
      target_contact_sales_nav_url: makeSalesNavUrl("Steve Yonkers", "USCIS")
    }
  ],

  "U.S. Customs and Border Protection (CBP)": [
    {
      title: "ACE 2.0 Trade Modernization & Supply Chain Fentanyl Targeting",
      source_type: "Current Event",
      problem_or_focus_area:
        "CBP OIT is modernizing the Automated Commercial Environment (ACE) and National Targeting Center (NTC) analytics to screen billions of de minimis shipments and cargo manifests for fentanyl precursors and forced-labor violations.",
      oracle_solution:
        "Oracle Database 26ai Converged Database (Vector + Graph + JSON) on OCI",
      value_proposition:
        "Correlates multi-hop global shell-company graphs with unstructured shipping manifests and radiography anomaly embeddings in real time, giving CBP targeting officers immediate actionable risk scores at ports of entry.",
      target_contact_name: "Sanjeev \"Sonny\" Bhagowalia",
      target_contact_role: "CIO & Assistant Commissioner (OIT)",
      target_contact_sales_nav_url: makeSalesNavUrl("Sanjeev Bhagowalia", "Customs and Border Protection")
    },
    {
      title: "Biometric Entry-Exit (TVS) & Multi-Cloud Database Optimization",
      source_type: "Technology Roadmap",
      problem_or_focus_area:
        "CBP operates one of the largest multi-cloud footprints in federal government under the BEAGLE and cloud hosting contracts, facing massive compute and data transfer demands for the Traveler Verification Service (TVS).",
      oracle_solution:
        "Oracle Exadata Cloud Infrastructure & Oracle Interconnect for AWS / Azure",
      value_proposition:
        "Consolidates high-throughput mission databases onto OCI Exadata with direct ultra-low-latency interconnect to CBP's existing cloud application tiers, cutting database infrastructure costs by up to 40% while boosting IOPS.",
      target_contact_name: "Jay Alalasundaram",
      target_contact_role: "Deputy CIO",
      target_contact_sales_nav_url: makeSalesNavUrl("Jay Alalasundaram", "Customs and Border Protection")
    },
    {
      title: "Autonomous Border Tower & Non-Intrusive Inspection (NII) Edge AI",
      source_type: "Technology Roadmap",
      problem_or_focus_area:
        "CBP's CTO is evaluating generative AI and edge computer vision to process terabytes of X-ray cargo scans and autonomous surveillance tower feeds at remote southwest and northern border sectors.",
      oracle_solution:
        "OCI Roving Edge Infrastructure & OCI Bare Metal GPU Clusters",
      value_proposition:
        "Deploys ruggedized GPU edge inference nodes directly at ports of entry and sector command posts to process high-resolution NII radiography and sensor fusion locally while streaming prioritized alerts to CBP cloud data lakes.",
      target_contact_name: "Sunil Madhugiri",
      target_contact_role: "CTO",
      target_contact_sales_nav_url: makeSalesNavUrl("Sunil Madhugiri", "Customs and Border Protection")
    }
  ],

  "U.S. Immigration and Customs Enforcement (ICE)": [
    {
      title: "HSI Transnational Crime & Illicit Network Link Analysis",
      source_type: "Current Event",
      problem_or_focus_area:
        "Homeland Security Investigations (HSI) agents need to fuse fragmented investigative case files, financial wires, dark-web cyber evidence, and cross-border trafficking records across legacy case management systems.",
      oracle_solution:
        "Oracle Database 26ai AI Vector Search & SQL Property Graph on OCI",
      value_proposition:
        "Replaces costly, proprietary data-silo platforms with open standard SQL Property Graph and vector search directly inside Oracle 26ai, enabling HSI analysts to query unstructured case narratives and criminal networks simultaneously.",
      target_contact_name: "Dustin Goetz",
      target_contact_role: "CIO",
      target_contact_sales_nav_url: makeSalesNavUrl("Dustin Goetz", "Immigration and Customs Enforcement")
    },
    {
      title: "ERO Case Management & Interagency Docket Synchronization",
      source_type: "Technology Roadmap",
      problem_or_focus_area:
        "ICE OCIO is modernizing Enforcement and Removal Operations (ERO) docket tracking and Alternatives to Detention (ATD) telemetry, requiring real-time, fault-tolerant data synchronization with CBP, USCIS, and DOJ immigration courts.",
      oracle_solution:
        "Oracle GoldenGate & Oracle Autonomous Transaction Processing (ATP)",
      value_proposition:
        "Delivers guaranteed, zero-data-loss real-time replication across interagency immigration databases with automated scaling and immutable audit trails for federal court compliance.",
      target_contact_name: "Rob Thorne",
      target_contact_role: "Deputy CIO",
      target_contact_sales_nav_url: makeSalesNavUrl("Rob Thorne", "Immigration and Customs Enforcement")
    },
    {
      title: "Modern Microservices & API Gateway Architecture for Law Enforcement Apps",
      source_type: "Technology Roadmap",
      problem_or_focus_area:
        "ICE's CTO is leading the transition from monolithic legacy applications to containerized cloud microservices and mobile field tools for law enforcement personnel.",
      oracle_solution:
        "Oracle Database 26ai JSON Relational Duality & OCI Kubernetes Engine (OKE)",
      value_proposition:
        "Lets mobile and microservices developers read and write JSON documents effortlessly while maintaining full ACID relational integrity and enterprise reporting consistency under the hood.",
      target_contact_name: "Christopher Chilbert",
      target_contact_role: "CTO",
      target_contact_sales_nav_url: makeSalesNavUrl("Christopher Chilbert", "Immigration and Customs Enforcement")
    }
  ],

  "Cybersecurity and Infrastructure Security Agency (CISA)": [
    {
      title: "CDM Dashboard & National Cyber Telemetry Analytics Scaling",
      source_type: "Current Event",
      problem_or_focus_area:
        "CISA's Continuous Diagnostics and Mitigation (CDM) program and Cyber Analytics and Data System (CADS) ingest billions of daily endpoint, vulnerability, and zero-trust telemetry events from across all federal civilian (.gov) agencies.",
      oracle_solution:
        "Oracle Autonomous Data Warehouse & OCI High-Performance Object Storage",
      value_proposition:
        "Provides massive parallel query performance and automated columnar compression for federal-wide cyber telemetry at significantly lower total cost of ownership than consumption-heavy cloud data warehouses.",
      target_contact_name: "Preston Werntz",
      target_contact_role: "Acting CIO",
      target_contact_sales_nav_url: makeSalesNavUrl("Preston Werntz", "CISA")
    },
    {
      title: "CIRCIA Cyber Incident Reporting & AI Threat Triage",
      source_type: "Current Event",
      problem_or_focus_area:
        "With mandatory Cyber Incident Reporting for Critical Infrastructure Act (CIRCIA) submissions ramping up, CISA must ingest, deduplicate, and triage thousands of unstructured incident and ransomware reports within hours.",
      oracle_solution:
        "Oracle Database 26ai AI Vector Search & OCI Generative AI Agents",
      value_proposition:
        "Automatically generates vector embeddings for incoming CIRCIA incident narratives to correlate new attacks against Known Exploited Vulnerabilities (KEV) and historical threat actor TTPs in real time.",
      target_contact_name: "Chris Butera",
      target_contact_role: "Acting EAD for Cybersecurity",
      target_contact_sales_nav_url: makeSalesNavUrl("Chris Butera", "CISA")
    },
    {
      title: "Critical Infrastructure Dependency Graph & Zero-Trust Registry",
      source_type: "Technology Roadmap",
      problem_or_focus_area:
        "CISA's technology roadmap includes modeling cascading cyber-physical risks across the 16 critical infrastructure sectors and hardening internal OCIO mission portals to Federal Zero Trust Architecture standards.",
      oracle_solution:
        "Oracle Spatial & Property Graph in Oracle 26ai + OCI Maximum Security Zones",
      value_proposition:
        "Models multi-sector infrastructure interdependencies (energy, water, communications, financial) as a live geospatial property graph while protecting sensitive vulnerability registries inside hardware-isolated security zones.",
      target_contact_name: "Lytwaive Hutchinson",
      target_contact_role: "Deputy CIO",
      target_contact_sales_nav_url: makeSalesNavUrl("Lytwaive Hutchinson", "CISA")
    }
  ]
};

export function getFallbackSalesPlaysForTerritory(territoryName: string): SalesPlayItem[] {
  if (FALLBACK_SALES_PLAYS_BY_TERRITORY[territoryName]) {
    return FALLBACK_SALES_PLAYS_BY_TERRITORY[territoryName];
  }
  const norm = territoryName.trim().toLowerCase();
  for (const [key, plays] of Object.entries(FALLBACK_SALES_PLAYS_BY_TERRITORY)) {
    const keyNorm = key.trim().toLowerCase();
    if (keyNorm === norm || keyNorm.includes(norm) || norm.includes(keyNorm)) {
      return plays;
    }
  }
  return [];
}

function stripHtmlTags(html: string): string {
  return html
    .replace(/<code>[\s\S]*?<\/code>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildSalesPlaysFromBriefTerritory(
  territoryName: string,
  newsHtmlItems: string[] = []
): SalesPlayItem[] {
  const baseline = getFallbackSalesPlaysForTerritory(territoryName);
  const dynamicEventPlays: SalesPlayItem[] = [];

  const defaultContact = baseline[0] || {
    target_contact_name: "Kyle Schutt",
    target_contact_role: "Acting CIO & Chief AI Officer",
    target_contact_sales_nav_url: makeSalesNavUrl("Kyle Schutt", territoryName)
  };
  const secondaryContact = baseline[1] || defaultContact;

  for (let i = 0; i < Math.min(newsHtmlItems.length, 2); i++) {
    const cleanText = stripHtmlTags(newsHtmlItems[i]);
    if (!cleanText || cleanText.length < 30) continue;

    const lower = cleanText.toLowerCase();
    let solution = "Oracle Database 26ai & OCI Government Cloud (FedRAMP High)";
    let valueProp =
      "Provides a unified, zero-trust data and cloud foundation with built-in AI Vector Search, automated scaling, and predictable pricing without data egress fees.";
    let contact = defaultContact;
    let playTitle = "Strategic Mission & Cloud Modernization Play";

    if (lower.includes("ai") || lower.includes("artificial intelligence") || lower.includes("data") || lower.includes("analytics")) {
      playTitle = "Current Event Play: Mission AI & Converged Data Acceleration";
      solution = "Oracle Database 26ai with AI Vector Search & OCI Generative AI Agents";
      valueProp =
        "Allows the agency to run retrieval-augmented generation (RAG) and semantic search directly on mission data in place without duplicating records into standalone vector databases or compromising zero-trust boundaries.";
    } else if (lower.includes("cyber") || lower.includes("zero trust") || lower.includes("security") || lower.includes("vulnerability")) {
      playTitle = "Current Event Play: Zero-Trust Data Centric Security & Cyber Telemetry";
      solution = "Oracle Autonomous Database, Database Vault & OCI Maximum Security Zones";
      valueProp =
        "Enforces separation of duties, automated patching, and continuous compliance monitoring at the database kernel level while ingesting high-volume cyber telemetry at lower TCO.";
      contact = secondaryContact;
    } else if (lower.includes("border") || lower.includes("biometric") || lower.includes("tactical") || lower.includes("sensor") || lower.includes("cutter")) {
      playTitle = "Current Event Play: Tactical Edge AI & Real-Time Sensor Fusion";
      solution = "OCI Roving Edge Infrastructure & Oracle GoldenGate Stream Analytics";
      valueProp =
        "Brings ruggedized GPU compute and local Oracle database processing to tactical field and port environments, synchronizing real-time operational intelligence back to headquarters cloud enclaves.";
      contact = secondaryContact;
    } else if (lower.includes("cloud") || lower.includes("contract") || lower.includes("modernization") || lower.includes("procurement")) {
      playTitle = "Current Event Play: Multi-Cloud Modernization & Cost Optimization";
      solution = "Oracle Exadata Cloud Infrastructure & Oracle Interconnect for Azure / AWS";
      valueProp =
        "Accelerates legacy database and application modernization with highest IOPS performance, active-active availability, and zero cross-cloud network egress fees.";
    }

    dynamicEventPlays.push({
      title: playTitle,
      source_type: "Current Event",
      problem_or_focus_area: cleanText,
      oracle_solution: solution,
      value_proposition: valueProp,
      target_contact_name: contact.target_contact_name,
      target_contact_role: contact.target_contact_role,
      target_contact_sales_nav_url: contact.target_contact_sales_nav_url
    });
  }

  return [...dynamicEventPlays, ...baseline].slice(0, 5);
}
