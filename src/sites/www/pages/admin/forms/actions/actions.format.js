const cmsPageFormat = {
    app: "dms-site",
    type: "forms-actions-test",
    sections: [
        {title: 'Step 1', subtitle: 'General Action Information', id: '1'},
        {title: 'Step 2', subtitle: 'Prioritization', id: '2'},
        {title: 'Step 3', subtitle: 'Location', id: '3'},
        {title: 'Step 4', subtitle: 'Application Details', id: '4'},
        {title: 'Step 5', subtitle: 'Technical Information', id: '5'},
        // {title: 'Step 6', subtitle: 'Supplemental Info', id: '6'},
        // {title: 'Step 7', subtitle: 'Action Status ', id: '7'},
    ],
    attributes: [
        {
            key: 'comments',
            label: 'Next Steps',
            prompt: 'What are some of the next steps you can take to begin implementing this action',
            type: 'textarea',
            meta: 'false',
            hidden: 'false',
            section: '1'
        },
        {
            key: 'data_entry_reference_date',
            label: 'Data Entry Reference Date',
            prompt: 'For large inputs, this is the plan year. For individual additions or changes, add the actual date.',
            type: 'text',
            meta: 'false',
            area: 'true',
            section: '1',
        },
        {
            key: 'action_county',
            label: 'Action County',// which you would like to see on the form
            prompt: 'Select the county where the action takes place. If the action is located' +
                ' in a different county you can select it by clicking the dropdown.',
            type: 'select',
            options: [{value: '36001', label: 'Albany County'}, {value: '36003', label: 'Allegany County'}],
            meta: 'true',
            area: 'true',
            section: '1',
        },
        {
            key: 'action_jurisdiction',
            label: 'Action Jurisdiction',// which you would like to see on the form
            prompt: 'Provide the name of the Town, Village or City where the action is located.' +
                ' For example; Sullivan County has adopted a hazard mitigation plan, the Town of Callicoon' +
                ' is the jurisdiction location of the specific action,' +
                ' such as acquiring emergency generators for critical facilities.',
            type: 'select',
            meta: 'true',
            depend_on: 'action_county',
            area: 'true',
            section: '1',
            defaultValue: ['Countywide'],
            placeholder: 'Action Jurisdiction'
        },
        {
            key: 'action_number',
            label: 'Action Number',
            prompt: 'Provide county designated action number for this action. YOU CAN LEAVE THIS BLANK OR AS IS.  We will number for you when the actions are all complete.',
            type: 'text',
            meta: 'false',
            section: '1'
        },
        {
            key: 'action_name',
            label: 'Action Name',
            prompt: 'Provide a name for the action. Be as concise and specific as possible.',
            type: 'text',
            meta: 'false',
            section: '1',
            list_attribute: 'true'
        },
        {
            key: 'included_in_last_hmp',
            label: 'Included in Last HMP',
            prompt: '',
            type: 'radio',
            options: ['Yes', 'No'],
            inline: true,
            section: '1',
        },
        // actions status update begin
        {
            key: 'status',
            label: 'Action Status',
            prompt: 'Select the current status of the project',
            type: 'select',
            options: [
               'Not Started', 'In-progress', 'Completed', 'Discontinued', 'Delayed', 'Problem Statement ONLY', 'Action Description ONLY'
            ],
            display_condition: '',
            meta: 'false',
            section: '1'
        },
        {
            key: 'exact_timeframe_for_action_implementation',
            label: 'Action Status Date',
            prompt: 'Provided the specific timeline for action implementation as it exists.' +
                ' How long it takes from beginning of action implementation to end of action implementation.',
            type: 'text',
            display_condition: '',
            meta: 'false',
            section: '1'
        },
        {
            key: 'status_report',
            label: 'Action Status Details/Next Steps for Implementation',
            prompt: 'If there are additional details about the status of the action (i.e. why discontinued, or why a problem statement does not have an associated action), list them here.  Otherwise, identify next steps that could support implementation:' +
                'Is coordination with a regulatory agency required? Or a state agency/authority?  Does an H&H need to be completed? Do you need to seek funding?  Identify the next step.',
            type: 'text',
            display_condition: '',
            meta: 'false',
            section: '1'
        },
        {
            key: 'ready_for_plan_approval',
            label: 'Ready for State/FEMA Plan Approval',
            prompt: 'Only actions with all required* information will be considered "approvable" for this plan.',
            type: 'text',
            display_condition: '',
            meta: 'false',
            section: '1'
        },
        // actions status update end
        {
            key: 'associated_hazards',
            label: 'Associated Hazards',
            prompt: 'Identify the hazard(s) being addressed with this action.',
            type: 'multiselect',
            // options: [{value: 'hurricane', label: 'h'}, {value: 'avalanche', label: 'a'}, {value: 'hail', label: 'ha'}],
            options: ['hurricane', 'avalanche', 'hail'],
            meta: 'true',
            metaSource: 'meta_file',

            section: '1'
        },
        {
            key: 'associated_hazards_entries',
            label: 'Entries',
            prompt: '',
            type: 'number',
            section: '1'
        },
        {
            key: 'is_associated_hazards_complete',
            label: 'Complete',
            prompt: '',
            type: 'radio',
            options: ['yes', 'no'],
            section: '1'
        },
        {
            key: 'description_of_problem_being_mitigated',
            label: 'Description of the Problem (Problem Statement)',
            prompt: `Provide a detailed narrative of the problem (hazard risks and impacts). 
                     Think about the who, what, when, where, why and how related to the problem and its impacts. Include specific details about:
                        •Past hazard events that have caused this problem
                        •Impacts to the built environment, including critical facilities, infrastructure, assets, residential and commercial properties
                        •Impacts to community capabilities and operations. This includes details about who responds and how
                        •Impacts to the community, including vulnerable populations and community assets
                        •Impacts to the natural environment
                        •Loss of services
                        •Current limitations to address the problem
                        
                        If applicable, include geographical information, including:
                        •Address of the problem site/area and/or easily identified landmarks such as water bodies and well-known structures
                        •Description of the problem site/area
                        •Description of existing conditions (topography, terrain, hydrology) of the site/area
                        `,
            type: 'textarea',
            meta: 'false',
            expandable: 'true',
            section: '1',
            placeholder: 'Description of the Problem (Problem Statement)'
        },
        {
            key: 'solution_description',
            label: 'Description of the Solution (Action Description)',
            placeholder: 'Description of the Solution (Action Description)',
            sub_type: 'worksheet',
            prompt: `Provide a detailed narrative of the proposed solution. Describe:
                        •How the action would address the specific impacts and existing conditions previously identified in the Description of the Problem
                        •Proposed construction methods, including any excavation and earth-moving activities
                        •Where you are in the development process (e.g., are studies and/or drawings complete or in-progress), etc., 
                        •The extent of any analyses or studies performed (identify and attach any reports or studies).
                        `,
            type: 'textarea',
            meta: 'false',
            section: '1'
        }, // todo: solution description and action description same?
        // {
        //     key: 'action_description',
        //     label: 'Action Description',
        //     prompt: 'Provide a detailed narrative of the solution. Describe the physical ' +
        //         'area (project limits) to be affected, both by direct work and by the project\'s ' +
        //         'effects; how the action would address the existing conditions previously identified;' +
        //         ' proposed construction methods, including any excavation and earth-moving activities;' +
        //         ' where you are in the development process (e.g., are studies and/or drawings complete),' +
        //         ' etc., the extent of any analyses or studies performed (attach any reports or studies).',
        //     type: 'textarea',
        //     meta: 'false',
        //     section: '1'
        // },
        {
            key: 'action_category',
            label: 'Action Category',
            prompt: 'Choose the category that best describes the action from the dropdown menu .' +
                'The category you choose will limit the possible responses to question 4.' +
                'If you do not see the action type you are expecting in the dropdown for question 4 ' +
                'you may need to change the action category you’ve selected in question 3.',
            type: 'select',
            options: [
                'Planning & Regulatory',
                'Structural',
                'Property Protection & Infrastructure',
                'Natural Resource Protection & Restoration',
                'Education, Outreach & Awareness',
                'Preparedness & Response'
            ],
            disable_condition: '',
            section: '1'
        },
        {
            key: 'action_type',
            label: 'Action Type',
            prompt: 'Choose the category that best describes the action from the dropdown menu .' +
                'The category you choose will limit the possible responses to question 4.' +
                'If you do not see the action type you are expecting in the dropdown for question 4 ' +
                'you may need to change the action category you’ve selected in question 3.',
            type: 'select',
            options: [
                'Plan & Reg - Plans',
                'Plan & Reg - Building Codes/Zoning/Ordinance/Policy/Law/Governance',
                'Plan & Reg - Establishing Long-Term Programs',
                'Plan & Reg - Studies and/or Risk Assessment',
                'Plan & Reg - Project Scoping',
                'Plan & Reg - Other',
                'Structural - Dams',
                'Structural - Levees',
                'Structural - Floodwall',
                'Structural - Other',
                'Prop Protect & Infra - Community Infrastructure (Drainage, Utilities)',
                'Prop Protect & Infra - Acquisition',
                'Prop Protect & Infra - Elevation',
                'Prop Protect & Infra - Relocation',
                'Prop Protect & Infra - Retrofit',
                'Prop Protect & Infra - Other',
                'Prop Protect & Infra - Power',
                'Nat Res Prot & Restore - Wetland Protection/Restoration',
                'Nat Res Prot & Restore -  - Other',
                'Education, Outreach & Awareness',
                'Preparedness & Response',

            ],
            section: '1'
        },
        {
            key: 'action_type_specific',
            label: 'Action Type - Specific (if applicable)',
            prompt: '',
            type: 'text',
            disable_condition: '',
            meta: 'true',
            metaSource: 'meta_file',
            section: '1'
        },
        {
            key: 'action_location',
            label: 'Action Location',
            prompt: 'Provide a narrative description of where the action is located. ' +
                '(For example: At the intersection of Broadway and South St.)',
            type: 'text',
            meta: 'false',
            section: '3'
        },
        // {
        //     key: 'location_point',
        //     label: 'Location Point',
        //     prompt: ' Provide the exact location(s) where the action takes place. Multiple points may be selected.',
        //     type: 'geoPointSelectorMap',
        //     meta: 'false',
        //     section: '3'
        // }, // needs dms datatype
        {
            key: 'relates_to_protects_critical_facility_infrastructure',
            label: 'Relates to/ Protects Critical Facility/ Infrastructure',
            prompt: `Yes or No. If Yes, please note this project must intend to protect the Critical Facility to the .02% chance flood or the actual worst damage scenario, whichever is greater.`,
            type: 'radio',
            options: ['yes', 'no'],
            meta: 'false',
            inline: true,
            section: '3'
        },
        {
            key: 'lead_agency_name_text',
            label: 'Lead Agency/Department',
            prompt: 'Identify the Agency, Department, Office, etc. that will lead the effort and coordination necessary to implement this action.  Try to avoid just listing the jurisdiction.',
            type: 'text',
            section: '1',
            //defaultValue: ['Countywide'],
            //example: 'Demo example.'
        },
        //action poc started

        {
            key: 'contact_name',
            label: 'Action Point of Contact (Title or Name)',
            prompt: '',
            sub_type: '',
            type: 'text',
            section: '1',
        },
        {
            key: 'contact_email',
            label: 'Action POC Email (if available)',
            prompt: '',
            sub_type: '',
            type: "email",
            data_error: "Your email address is invalid",
            meta: 'false',
            section: '1'
        },
        //action poc end
        {
            key: 'priority',
            label: 'Priority',
            prompt: '',
            type: 'text',
            section: '1',
        },
        {
            key: 'estimated_cost_range',
            label: 'Estimated Cost Range',
            prompt: `Provide estimate or actual calculated costs if known.
                        Alternatively, select the cost range that most accurately reflects the costs associated with the action. Options include:
                        •< $100,000
                        •$100K-$500K
                        •$500K-$1 MIL
                        •$1 MIL-$5 MIL
                        •$5MIL-$10MIL
                        •> $10 MIL`,
            type: 'text',
            // options: ['<$100k', '$100K-$500K', '$500K-$1M', '$1M-$5M', '$5M-$10M', '$10M+'],
            disable_condition: '',
            meta: 'false',
            section: '1'
        },
        {
            key: 'estimated_benefits',
            label: 'Estimated Benefits',
            prompt: `The one prioritization criterion that must be include in LHMP action development is benefit-cost review. This does not mean a full benefit-cost analysis but a planning level assessment of whether the costs are reasonable compared to the probable benefits. Cost estimates do not have to be exact but can be based on experience and judgment.
                    Benefits include losses avoided, such as the number and value of structures and infrastructure protected by the action and the population protected from injury and loss of life. Qualitative benefits, such as quality of life and natural and beneficial functions of ecosystems, can also be included in the review.
                    If dollar amounts are known, include them.  If dollar amounts are unknown or are unquantifiable, describe the losses that will be avoided. `,
            type: 'text',
            display_condition: '',
            meta: 'false',
            section: '1',
        },
        {
            key: 'estimated_timeframe_for_action_implementation',
            label: 'Estimated Timeframe for Action Implementation',
            prompt: 'Provided the estimated time required to complete the project from start to finish.',
            type: 'text',
            display_condition: '',
            meta: 'false',
            section: '1'
        },
        {
            key: 'primary_or_potential_funding_sources_name',
            label: 'Potential primary funding sources',
            prompt: `List potential funding sources. Multiple sources of potential funding should be listed when appropriate. Examples include HMGP, BRIC, FMA, Public Assistance, Individual Assistance, HUD CDBG, other Federal or State Program Funds, Capital Budget, etc.`,
            type: 'text',
            disable_condition: '',
            meta: 'false',
            section: '1'
        },
        {
            key: 'planning_mechanism',
            label: 'Local Planning Mechanisms to be Used in Implementation, if any',
            prompt: `Mitigation plans must describe the community’s process to integrate the data, analysis, and mitigation goals and actions into other planning mechanisms. 
            First, the plan must identify the existing planning mechanisms where hazard mitigation information and actions may be incorporated. 
            In this context, planning mechanisms mean governance structures and community capabilities used manage local land use development and community decision making. 
            Multi-jurisdictional plans must describe each participating jurisdiction’s individual process for integrating the plan into their local planning mechanisms.`,
            sub_type: 'worksheet',
            type: 'text',
            // display_type: 'text',
            meta: 'false',
            section: '4'
        },




        {
            key: 'priority_scoring_probability_of_acceptance_by_population',
            label: 'Priority Scoring: Probability of Acceptance by Population',
            prompt: 'Priority Information is Only Applicable to New Actions',
            type: 'radio',
            options: [
                '(4) Likely to be endorsed by the entire population',
                '(3) Of benefit only to those directly affected and would not adversely affect others',
                '(2) Would be somewhat controversial with special interest groups or a small percentage of the population',
                '(1) Would be strongly opposed by special interest groups or a significant percentage of the population',
                '(0) Would be strongly opposed by nearly all of the population'
            ],
            section: '2'
        },
        {
            key: 'priority_scoring_funding_availability',
            label: 'Priority Scoring: Funding Availability',
            prompt: 'Priority Information is Only Applicable to New Actions',
            type: 'radio',
            options: [
                '(4) Little to no direct expenses',
                '(3) Can be funded by operating budget',
                '(2) Grant funding identified',
                '(1) Grant funding needed',
                '(0) Potential funding source unknow'
            ],
            meta: 'false',
            section: '2'
        },
        {
            key: 'priority_scoring_probability_of_matching_funds',
            label: 'Priority Scoring: Probability of Matching Funds',
            prompt: 'Priority Information is Only Applicable to New Actions',
            type: 'radio',
            options: [
                '(4) Funding match is available or funding match not required',
                '(2) Partial funding match available',
                '(0) No funding match available or funding match unknown'
            ],
            meta: 'false',
            section: '2'
        },
        {
            key: 'priority_scoring_benefit_cost_review',
            label: 'Priority Scoring: Benefit Cost Review',
            prompt: 'Priority Information is Only Applicable to New Actions',
            type: 'radio',
            options: [
                '(4) Likely to meet Benefit Cost Review',
                '(2) Benefit Cost Review not required',
                '(0) Benefit Cost Review unknown'
            ],
            meta: 'false',
            section: '2'
        },
        {
            key: 'priority_scoring_environmental_benefit',
            label: 'Priority Scoring: Environmental Benefit',
            prompt: 'Priority Information is Only Applicable to New Actions.',
            type: 'radio',
            options: [
                '(4) Environmentally sound and relatively easy to implement; or no adverse impact on environment',
                '(3) Environmentally acceptable and not anticipated to be difficult to implement',
                '(2) Environmental concerns and somewhat difficult to implement because of complex requirements',
                '(1) Difficult to implement because of significantly complex requirements and environmental permitting',
                '(0) Very difficult to implement due to extremely complex requirements and environmental permitting problems'
            ],
            meta: 'false',
            section: '2'
        },
        {
            key: 'priority_score',
            label: 'Priority Score - Total score',
            prompt: 'Add up the numbers from each of the priority scoring answers',
            type: 'number',
            meta: 'false',
            section: '2'
        },
        {
            key: 'alternative_action_1',
            label: 'Alternative Action 1',
            prompt: 'What alternatives were considered when identifying and developing this action?',
            type: 'text',
            display_condition: '',
            meta: 'false',
            section: '1',
            field_required: 'required'
        },
        {
            key: 'alternative_action_1_evaluation',
            label: 'Alternative Action 1 Evaluation',
            prompt: 'Explain why the alternative action was not selected; include the estimated cost and reasoning.',
            type: 'text',
            display_condition: '',
            meta: 'false',
            section: '1',
            field_required: 'required'
        },
        {
            key: 'is_action_addressing_climate_change',
            label: 'Is this action addressing Climate Change?',
            prompt: '',
            type: 'radio',
            options: ['yes', 'no'],
            display_condition: '',
            meta: 'false',
            section: '1',
            field_required: 'required'
        },
        {
            key: 'are_environment_or_historic_preservation_or_protected_species_concern',
            label: 'Are there known Environmental, Historic Preservation or Protected Species Concerns?',
            prompt: '',
            type: 'radio',
            options: ['yes', 'no'],
            display_condition: '',
            meta: 'false',
            section: '1',
            field_required: 'required'
        },
        {
            key: 'is_action_protecting_or_including_assessment_of_risk_to_vulnerable_population',
            label: 'Does this action protect or include assessment of risk to vulnerable populations?',
            prompt: '',
            type: 'radio',
            options: ['yes', 'no'],
            display_condition: '',
            meta: 'false',
            section: '1',
            field_required: 'required'
        },

        {
            key: 'site_photographs',
            label: 'Site Photographs (If applicable)',
            prompt: 'Upload photographs of the site that are relevant to outlining, describing,' +
                ' depicting, or otherwise enhancing the description of this action.',
            type: 'file',
            meta: 'false',
            section: '3'
        },

        {
            key: 'engineering_required',
            label: 'Does this action require input or designs from engineering professionals?',
            prompt: 'Does proposed action require input or designs from engineering professionals?',
            type: 'radio',
            options: ['yes', 'no'],
            meta: 'false',
            inline: true,
            section: '5'
        },
        {
            key: 'is_study_design_or_plan_completed',
            label: 'Have any studies, designs, or plans been completed?',
            prompt: '',
            type: 'radio',
            options: ['yes', 'no'],
            meta: 'false',
            inline: true,
            section: '5'
        },
        {
            key: 'is_engineering_design_studies',
            label: 'If yes (studies), describe and provide copies if available.',
            prompt: 'Describe any studies, design or input that has already occurred and upload available information.',
            type: 'text',
            meta: 'false',
            section: '5',
        },
        {
            key: 'is_final_engineering_design_completes',
            label: 'Is Final Engineering Design Complete?',
            prompt: 'Is the final engineering design complete?',
            type: 'radio',
            options: ['yes', 'no'],
            meta: 'false',
            section: '5',
        },

        {
            key: 'bca',
            label: 'Has a Benefit Cost Analysis been completed for this action?',
            prompt: 'Has a Benefit Cost Analysis been completed for this action.',
            type: 'radio',
            options: ['yes', 'no'],
            meta: 'false',
            inline: true,
            section: '5'
        },
        {
            key: 'bca_to_bcr',
            label: 'If Yes, What is the BCR (Benefit Cost Ratio)?',
            prompt: 'Was a Benefit Cost Report established as an outcome of the Benefit Cost Analysis?',
            type: 'text',
            meta: 'false',
            section: '5'
        },
        {
            key: 'bcr',
            label: 'If Yes, BCR Upload',
            prompt: 'Provide an upload the Benefit Cost Report document',
            type: 'file',
            meta: 'false',
            section: '5'
        },
        {
            key: 'are_resources_available_bca',
            label: 'If No, are resources available to complete a BCA?',
            prompt: 'Provide an upload the Benefit Cost Report document',
            type: 'file',
            meta: 'false',
            section: '5'
        },
        {
            key: 'is_action_protecting_against_repetitive_loss_properties',
            label: 'Does this action protect Repetitive or Severe Repetitive Loss Properties?',
            prompt: '',
            type: 'radio',
            options: ['yes', 'no'],
            meta: 'false',
            inline: true,
            section: '5'
        },
        {
            key: 'is_crs',
            label: 'Can this action support points for Community Rating System (CRS)?',
            prompt: '',
            type: 'radio',
            options: ['yes', 'no', 'unknown'],
            meta: 'false',
            inline: true,
            section: '5'
        },
        {
            key: 'climate_smart_communities_action_type',
            label: 'Does this action align with a Climate Smart Communities action?',
            prompt: '',
            type: 'radio',
            options: ['yes', 'no'],
            meta: 'false',
            inline: true,
            section: '5'
        },
        {
            key: 'is_action_approvable',
            label: 'Approvable?',
            prompt: '',
            type: 'radio',
            options: ['yes', 'no'],
            meta: 'false',
            inline: true,
            section: '5'
        },
        {
            key: 'dhses_comments',
            label: 'DHSES Comments',
            prompt: '',
            type: 'textarea',
            meta: 'false',
            hidden: 'false',
            section: '1'
        },
        {
            key: 'fema_comments',
            label: 'FEMA Comments',
            prompt: '',
            type: 'textarea',
            meta: 'false',
            hidden: 'false',
            section: '1'
        },
    ]
}

export default cmsPageFormat