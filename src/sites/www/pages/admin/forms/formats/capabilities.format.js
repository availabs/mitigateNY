const format = {
    "app": "dms-site",
    "type": "forms-capabilities",
    "attributes": [
            {
                "name": "cap_id",
                "display_name": "CapID",
                "type": ""
            },
            {
                "name": "admin_agency_type",
                "display_name": "Administering Agency Type (Fed, State, Local, Non-profit)",
                "type": ""
            },
            {
                "name": "admin_agency",
                "display_name": "Administering Agency",
                "type": ""
            },
            {
                "name": "name",
                "display_name": "Capability Name",
                "type": ""
            },
            {
                "name": "program",
                "display_name": "Program",
                "type": ""
            },
            {
                "name": "plan_guide",
                "display_name": "Plan-Guidance",
                "type": ""
            },
            {
                "name": "tool",
                "display_name": "Tool",
                "type": ""
            },
            {
                "name": "funding_source",
                "display_name": "Funding Source",
                "type": ""
            },
            {
                "name": "description",
                "display_name": "Description",
                "type": ""
            },
            {
                "name": "web_url",
                "display_name": "Web URL",
                "type": ""
            },
            {
                "name": "shmp_inclusion_internal",
                "display_name": "SHMP Inclusion (Internal)",
                "type": ""
            },
            {
                "name": "is_shmp_inclusion_complete",
                "display_name": "SHMP Inclusion Complete?",
                "type": ""
            },
            {
                "name": "mitigation_connection",
                "display_name": "Mitigation Connection (External - public facing on SHMP site)",
                "type": ""
            },
            {
                "name": "case_study",
                "display_name": "Case Study (Y/N)",
                "type": ""
            },
            {
                "name": "program_lead_name",
                "display_name": "Name",
                "type": ""
            },
            {
                "name": "program_lead_email",
                "display_name": "E-mail Address",
                "type": ""
            },
            {
                "name": "program_lead_title",
                "display_name": "Title/Role",
                "type": ""
            },
            {
                "name": "program_lead_department",
                "display_name": "Department, Division, Office",
                "type": ""
            },
            {
                "name": "partner_agencies",
                "display_name": "Partner Agency(ies)",
                "type": ""
            },
            {
                "name": "associated_hazards",
                "display_name": "associated_hazards",
                "type": "",
                "options": [
                    "ALL (formal hazards only)",
                    "Avalanche",
                    "Coastal Hazards",
                    "Cold Wave",
                    "Drought",
                    "Earthquake",
                    "Flooding",
                    "Hail",
                    "Extreme Heat",
                    "Extreme Cold",
                    "Hurricane",
                    "Ice storm",
                    "Landslide",
                    "Lightning",
                    "Severe Storms",
                    "Snowstorm",
                    "Tornado",
                    "Tsunami/Seiche",
                    "Wildfire",
                    "Wind",
                    "Other - Pandemic",
                    "Other - Air Quality",
                    "Other - Water Quality",
                    "Other - [please describe]"
                ]
            },
            {
                "name": "is_communicating_flood_risk_data",
                "display_name": "If yes to Flooding, does this program communicate flood risk data?",
                "type": ""
            },
            {
                "name": "buildings",
                "display_name": "buildings",
                "type": "",
                "options": ["Buildings - Public", "Buildings - Private", "RL/SRL"]
            },
            {
                "name": "infrastructure",
                "display_name": "infrastructure",
                "type": "",
                "options": [
                    "INFRASTRUCTRE - Catch All",
                    "Roads & Bridges",
                    "Water - ALL/ANY",
                    "Water - Wastewater/Stormwater",
                    "Water - Culverts",
                    "Energy",
                    "Communications"]
            },
            {
                "name": "natural_environment",
                "display_name": "natural_environment",
                "type": "",
                "options": [
                    "Environmental Protection (Legacy Catch-all)",
                    "Open Space",
                    "Natural Resource Protection & Restoration",
                    "Nature-based Solution Oriented"]
            },
            {
                "name": "is_emphasising_social_vul_comm",
                "display_name": "Does this program place emphasis on benefitting socially vulnerable communities?",
                "type": ""
            },
            {
                "name": "tool_or_method_equal_priority",
                "display_name": "If yes, please identify the tool or methodology used to identify \"equity priority.\"",
                "type": ""
            },
            {
                "name": "emergency_management_phase",
                "display_name": "emergency_management_phase",
                "type": "",
                "options": [
                    "Hazard Mitigation",
                    "Preparedness",
                    "Response",
                    "Recovery"]
            },
            {
                "name": "category",
                "display_name": "category",
                "type": "",
                "options": [
                    "Planning & Regulatory",
                    "Administrative & Technical",
                    "Education/ Outreach",
                    "Financial"
                ]
            },
            {
                "name": "integrated_capacity_building",
                "display_name": "integrated_capacity_building",
                "type": "",
                "options": [
                    "Supports Community Rating System (CRS) Points",
                    "Supports Climate Smart Communities (CSC) Points"
                ]
            },
            {
                "name": "climate_change",
                "display_name": "climate_change",
                "type": "",
                "options": [
                    "Climate Change considerations (projections, impacts, risks)",
                    "Climate Mitigation specific (emissions reduction)",
                    "Climate Adaptation specific"
                ]
            },
            {
                "name": "status",
                "display_name": "status",
                "type": "",
                "options": [
                    "New Since Last Plan (2018)",
                    "Ongoing Since Last Plan",
                    "No Longer Relevant"
                ]
            },
            {
                "name": "desc_status",
                "display_name": "Description of Status",
                "type": ""
            },
            {
                "name": "shmp_dev_team_review_date",
                "display_name": "SHMP Dev Team - Reviewed (Date)",
                "type": ""
            },
            {
                "name": "agency_verified_date",
                "display_name": "Agency - Verified (Date)",
                "type": ""
            },
            {
                "name": "can_provide_fun_or_resources_for",
                "display_name": "can_provide_fun_or_resources_for",
                "type": "",
                "options": [
                    "Mitigation Planning/ Planning Activities/ Capacity Building",
                    "Engineering/ Project Scoping",
                    "Construction/ Project Implementation",
                    "Other (please describe)"]
            },
            {
                "name": "primary_funding_source",
                "display_name": "Primary Funding Source",
                "type": ""
            },
            {
                "name": "is_federal_funding_primary",
                "display_name": "Federal Funding - Primary (Y/N)",
                "type": ""
            },
            {
                "name": "non_federal_match_source",
                "display_name": "Potential Non-federal Match Source (Yes/No)",
                "type": ""
            },
            {
                "name": "availability",
                "display_name": "Availability",
                "type": ""
            },
            {
                "name": "funding_source_type",
                "display_name": "funding_source_type",
                "type": "",
                "options": [
                    "Grant",
                    "Loan",
                    "Individual Benefit",
                    "Other",
                    "Match Requirement (Yes/No)"]
            },
            {
                "name": "eligibility",
                "display_name": "eligibility",
                "type": "",
                "options": [
                    "State",
                    "Tribal",
                    "Local Government",
                    "CBO/Non-profit",
                    "For Profit",
                    "Individuals",
                    "Offers Management/ Admin Costs"
                ]
            }
        ]

}