
const cmsPageFormat = {
  app: "dms-site",
  type: "forms-actions-test",
  // defaultSearch: `data ->> 'index' = '0' and data ->> 'parent' = ''`,
  // defaultSort: (d) => d.sort((a,b) => a.index - b.index || a.parent-b.parent),
    sections: [
        {title: 'Step 1', subtitle: 'General Action Information', id: '1'},
        {title: 'Step 2', subtitle: 'Prioritization', id: '2'},
        {title: 'Step 3', subtitle: 'Location', id: '3'},
        {title: 'Step 4', subtitle: 'Application Details', id: '4'},
        {title: 'Step 5', subtitle: 'Technical Information', id: '5'},
        {title: 'Step 6', subtitle: 'Supplemental Info', id: '6'},
        {title: 'Step 7', subtitle: 'Action Status ', id: '7'},
    ],
  attributes: [
    {
        key: 'action_county',
        label: ' Action County',// which you would like to see on the form
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
        label: ' Action Jurisdiction',// which you would like to see on the form
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
        key: 'description_of_problem_being_mitigated',
        label: 'Description of the Problem (Problem Statement)',
        prompt: 'Provide a detailed narrative of the problem. Describe the natural' +
            ' hazard you wish to mitigate, its impacts to the community, past damages and' +
            ' loss of service, etc. Include the street address of the property/project location' +
            ' (if applicable), adjacent streets, and easily identified landmarks such as water' +
            ' bodies and well-known structures, and end with a brief description of existing' +
            ' conditions (topography, terrain, hydrology) of the site.',
        type: 'textarea',
        meta: 'false',
        expandable: 'true',
        section: '1',
        placeholder: 'Description of the Problem (Problem Statement)'
    },
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
        key: 'action_description',
        label: 'Action Description',
        prompt: 'Provide a detailed narrative of the solution. Describe the physical ' +
            'area (project limits) to be affected, both by direct work and by the project\'s ' +
            'effects; how the action would address the existing conditions previously identified;' +
            ' proposed construction methods, including any excavation and earth-moving activities;' +
            ' where you are in the development process (e.g., are studies and/or drawings complete),' +
            ' etc., the extent of any analyses or studies performed (attach any reports or studies).',
        type: 'textarea',
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
        key: 'previous_plan_action',
        label: 'Is this action from the previous Hazard Mitigation Plan?',
        prompt: 'All actions from the previous plan must be reviewed during the Hazard Mitigation Plan update. You can provide a status update in the last tab of this form.',
        type: 'radio',
        options: ['yes', 'no'],
        meta: 'false',
        inline: true,
        section: '1'
    },
    {
        key: 'action_category',
        label: 'Action Category',
        prompt: 'Choose the category that best describes the action from the dropdown menu .' +
            'The category you choose will limit the possible responses to question 4.' +
            'If you do not see the action type you are expecting in the dropdown for question 4 ' +
            'you may need to change the action category you’ve selected in question 3.',
        type: 'select',
        disable_condition: '',
        meta: 'true',
        metaSource: 'meta_file',
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
        options: ['type 1', 'type 1'],
        disable_condition: '',
        meta: 'true',
        metaSource: 'meta_file',
        section: '1'
    },
    {
        key: 'action_number',
        label: 'Action Number',
        prompt: 'Provide county designated action number for this action',
        type: 'text',
        meta: 'false',
        section: '1'
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
        key: 'comments',
        label: 'Next Steps',
        prompt: 'What are some of the next steps you can take to begin implementing this action',
        type: 'textarea',
        meta: 'false',
        hidden: 'false',
        section: '1'
    },
    {
        key: 'action_point_of_contact',
        label: 'Action Point of Contact',
        prompt: 'Provide the name of the person responsible for the action.',
        type: 'multiselect',
        meta: {
            key: 'meta_filter',
            filter_key: 'roles', value: 'contact_name'
        }, // if populating from another form type
        section: '1',
        //defaultValue: ['Countywide'],
        //example: 'Demo example.'
    },
    {
        key: 'lead_agency_name_text',
        label: 'Lead Agency/Department',
        prompt: 'Provide the name of the Agency or Department capable of implementing this action.',
        type: 'text',
        section: '1',
        //defaultValue: ['Countywide'],
        //example: 'Demo example.'

    },
    {
        key: 'action_lead_agency_contact',
        label: 'Lead Agency/Department Point of Contact',
        prompt: 'Provide the name and/or office of the person who is most capable of implementing this action.',
        type: 'text',
        section: '1',
        //defaultValue: ['Countywide'],
        //example: 'Demo example.'

    },
    {
        key: 'is_agency_type',
        label: 'Is the Lead Agency/Department a:',
        prompt: 'Priority Information is Only Applicable to New Actions',
        type: 'dropdown_no_meta',
        options: ['State Agency', 'Local Government', 'Tribal Entity', 'Private Non-Profit', 'Other'],
        meta: 'false',
        section: '1'
    },
    {
        key: 'estimated_cost_range',
        label: 'Estimated Cost Range',
        prompt: 'Select the cost range that most accurately reflects the costs associated with the action.',
        type: 'dropdown_no_meta',
        options: ['<$100k', '$100K-$500K', '$500K-$1M', '$1M-$5M', '$5M-$10M', '$10M+'],
        disable_condition: '',
        meta: 'false',
        section: '1'
    },
    {
        key: 'estimated_benefits',
        label: 'Estimated Benefits',
        prompt: 'Describe the estimated benefits of implementing this action.',
        type: 'text',
        display_condition: '',
        meta: 'false',
        section: '1',
    },
    {
        key: 'primary_or_potential_funding_sources_name',
        label: 'Potential primary funding sources',
        prompt: 'Identify the name of the potential primary funding source. Or enter a new funding source.',
        type: 'text',
        disable_condition: '',
        meta: 'false',
        section: '1'
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
        // display_condition:{attribute:'boolalternative',check:['yes','true',true]},
        meta: 'false',
        section: '1',
        field_required: 'required'
    },
    {
        key: 'alternative_action_2',
        label: 'Alternative Action 2',
        prompt: 'What alternatives were considered when identifying and developing this action?',
        type: 'text',
        display_condition: '',
        meta: 'false',
        section: '1'
    },
    {
        key: 'alternative_action_2_evaluation',
        label: 'Alternative Action 2 (if applicable)',
        prompt: 'Explain why the alternative action was not selected; include the estimated cost and reasoning.',
        type: 'text',
        display_condition: '',
        meta: 'false',
        section: '1'
    },
    {
        key: 'priority_scoring_probability_of_acceptance_by_population',
        label: 'Priority Scoring: Probability of Acceptance by Population',
        prompt: 'Priority Information is Only Applicable to New Actions',
        type: 'radio',
        options: ['(4) Likely to be endorsed by the entire population',
            '(3) Of benefit only to those directly affected and would not adversely affect others',
            '(2) Would be somewhat controversial with special interest groups or a small percentage of the population',
            '(1) Would be strongly opposed by special interest groups or a significant percentage of the population',
            '(0) Would be strongly opposed by nearly all of the population'
        ],
        meta: 'false',
        section: '2'
    },
    {
        key: 'priority_scoring_funding_availability',
        label: 'Priority Scoring: Funding Availability',
        prompt: 'Priority Information is Only Applicable to New Actions',
        type: 'radio',
        options: ['(4) Little to no direct expenses',
            '(3) Can be funded by operating budget',
            '(2) Grant funding identified',
            '(1) Grant funding needed',
            '(0) Potential funding source unknown'],
        meta: 'false',
        section: '2'
    },
    {
        key: 'priority_scoring_probability_of_matching_funds',
        label: 'Priority Scoring: Probability of Matching Funds',
        prompt: 'Priority Information is Only Applicable to New Actions',
        type: 'radio',
        options: ['(4) Funding match is available or funding match not required',
            '(2) Partial funding match available',
            '(0) No funding match available or funding match unknown'],
        meta: 'false',
        section: '2'
    },
    {
        key: 'priority_scoring_benefit_cost_review',
        label: 'Priority Scoring: Benefit Cost Review',
        prompt: 'Priority Information is Only Applicable to New Actions',
        type: 'radio',
        options: ['(4) Likely to meet Benefit Cost Review',
            '(2) Benefit Cost Review not required',
            '(0) Benefit Cost Review unknown'],
        meta: 'false',
        section: '2'
    },
    {
        key: 'priority_scoring_environmental_benefit',
        label: 'Priority Scoring: Environmental Benefit',
        prompt: 'Priority Information is Only Applicable to New Actions.',
        type: 'radio',
        options: ['(4) Environmentally sound and relatively easy to implement; or no adverse impact on environment', '(3) Environmentally acceptable and not anticipated to be difficult to implement', '(2) Environmental concerns and somewhat difficult to implement because of complex requirements', '(1) Difficult to implement because of significantly complex requirements and environmental permitting', '(0) Very difficult to implement due to extremely complex requirements and environmental permitting problems'],
        meta: 'false',
        section: '2'
    },
    {
        key: 'priority_score',
        label: 'Priority Score - Add numbers associated with your above answers',
        prompt: 'Add up the numbers from each of the priority scoring answers',
        type: 'number',
        meta: 'false',
        section: '2'
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
    {
        key: 'location_point',
        label: 'Location Point',
        prompt: ' Provide the exact location(s) where the action takes place. Multiple points may be selected.',
        type: 'geoPointSelectorMap',
        meta: 'false',
        section: '3'
    },
  {
    key: 'zones',
        label: 'Does the project have an associated map zone from the scenario tools? If yes please select',
        prompt: '',
        type: 'AvlFormsJoin',
        display_type: 'AvlFormsJoin',
        parentConfig: 'actions', // this is the attribute name by which the data will be stored in target config
        targetConfig: 'zones',
        meta: 'false',
        section: '3'
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
        key: 'relates_to_protects_critical_facility_infrastructure',
        label: 'Relates to/ Protects Critical Facility/ Infrastructure',
        prompt: 'Is the action directly related to any critical facilities or infrastructure?' +
            ' Critical facilities include; utilities, emergency services, governmental structures,' +
            ' bridges, transportation corridors, etc.',
        type: 'radio',
        options: ['yes', 'no'],
        meta: 'false',
        inline: true,
        section: '3'
    },
    {
        key: 'is_project_structure_located_in_sfha',
        label: 'Is Project Structure(s) Located in SFHA?',
        prompt: 'This can be any project or building located in the Special Flood Hazard Area',
        type: 'radio',
        options: ['yes', 'no'],
        meta: 'false',
        inline: true,
        section: '3'
    },
    {
        key: 'known_environmental_historic_preservation_protected_species_iss',
        label: 'Known Environmental/Historic Preservation/Protected Species Issues?',
        prompt: '',
        type: 'radio',
        options: ['yes', 'no'],
        meta: 'false',
        inline: true,
        section: '3'
    },
    {
        key: 'property_names_or_hist_dist',
        label: 'List the property name(s) or historic district(s)',
        prompt: 'Provide the name of properties and/or districts designated as State and National Registers of Historic Places.',
        type: 'text',
        meta: 'false',
        section: '3'
    },
    {
        key: 'ground_distributed_other_than_agriculture',
        label: 'Has the ground at the project location been disturbed other than by agriculture?',
        prompt: 'Has there been any instances of development, clearing, or other ground altering activity',
        type: 'radio',
        options: ['yes', 'no'],
        meta: 'false',
        inline: true,
        section: '3'
    },
    {
        key: 'indian_or_historic_artifacts_found_on_or_adjacent_project_area',
        label: 'To your knowledge, have Indian or historic artifacts been found on or adjacent to the project area?',
        prompt: '',
        type: 'radio',
        options: ['yes', 'no'],
        meta: 'false',
        inline: true,
        section: '3'
    },
    {
        key: 'building_50_years_or_older_within_or_near',
        label: 'Does your project affect or is in close proximity to any buildings or structures 50 years or more in age?',
        prompt: '',
        type: 'radio',
        options: ['yes', 'no'],
        meta: 'false',
        inline: true,
        section: '3'
    },
    {
        key: 'is_shpo_survey',
        label: 'SHPO survey?',
        prompt: 'Has a State Historic Preservation Office survey been conducted in the ' +
            'location of the action? If the survey is available, upload the PDF.',
        type: 'radio',
        options: ['yes', 'no'],
        meta: 'false',
        inline: true,
        section: '3'
    },
    {
        key: 'shpo_survey',
        label: 'SHPO survey File',
        prompt: '',
        type: 'file',
        meta: 'false',
        section: '3'
    },
    {
        key: 'calculated_cost',
        label: 'Calculated Cost',
        prompt: 'Provide the total dollar amount calculated in association with the action.',
        type: 'number',
        meta: 'true',
        section: '4'
    },
    {
        key: 'secondary_funding_source_name',
        label: 'Secured funding sources name',
        prompt: 'Identify the name of the potential funding source.',
        type: 'text',
        disable_condition: '',
        meta: 'false',
        section: '4'
    },
    {
        key: 'metric_for_measurement',
        label: 'Metric for Evaluation',
        prompt: ' Identify one or more measurable elements that can be used to track the' +
            ' progress of implementation and/or impact of this action. Quantitative values like' +
            ' number of culverts widened or acres of agricultural land protected are recommended.',
        type: 'text',
        meta: 'false',
        section: '4'
    },
    {
        key: 'action_url',
        label: 'Action URL (if applicable)',
        prompt: ' If the action has a website or online document associated with the capability,' +
            ' enter it here. Examples include; emergency manager/department,' +
            ' soil and water conservation districts’ websites, weblink to a policy.',
        type: 'text',
        meta: 'false',
        section: '4'
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
        key: 'is_final_engineering_design_completes',
        label: 'Final Engineering Design Complete?',
        prompt: 'Is the final engineering design complete?',
        type: 'radio',
        options: ['yes', 'no'],
        meta: 'false',
        section: '5',
    },
    {
        key: 'is_engineering_design_studies',
        label: 'Describe any studies, design or input that has already occurred and upload available information.',
        prompt: 'Describe any studies, design or input that has already occurred and upload available information.',
        type: 'text',
        meta: 'false',
        section: '5',
    },
    {
        key: 'is_engineering_design_requirements',
        label: 'Describe any studies, design or input that will be required.',
        prompt: 'Describe any studies, design or input that will be required',
        type: 'text',
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
        label: 'What is the BCR (Benefit Cost Ratio)?',
        prompt: 'Was a Benefit Cost Report established as an outcome of the Benefit Cost Analysis?',
        type: 'text',
        meta: 'false',
        section: '5'
    },
    {
        key: 'bcr',
        label: 'BCR Upload',
        prompt: 'Provide an upload the Benefit Cost Report document',
        type: 'file',
        meta: 'false',
        section: '5'
    },
    {
        key: 'level_of_protection',
        label: 'Level of Protection',
        prompt: 'Identify the level of protection the proposed project will provide.  Ex. 100-year (1%) flood.',
        type: 'text',
        display_condition: '',
        meta: 'false',
        section: '5'
    },
    {
        key: 'associated_goals',
        label: 'Associated Goals/Obejectives',
        prompt: 'Provide the Goals/Objectives from this Hazard Mitigation Plan that this action supports.',
        type: 'text',
        meta: 'false',
        section: '6',
    },
    {
        key: 'relates_to_protects_community_lifeline_by_fema',
        label: 'Select the Community Lifelines(s) associated with this action:',
        prompt: 'Categories include: Safety & Security, Food/Water/Sheltering, Health & Medical,' +
            'Energy, Communications, Transportation, and Hazardous Material.',
        type: 'dropdown_no_meta',
        options: ['Safety & Security', 'Food/Water/Sheltering', 'Health & Medical', 'Energy', 'Communications', 'Transportation', 'Hazardous Material'],
        meta: 'false',
        section: '6'
    },
    {
        key: 'relates_to_mitigation_sectors_by_fema',
        label: 'Select the FEMA designated Mitigation Sector(s) associated with this action: ',
        prompt: 'Categories include: Emergency Management, Economic Development, Land Use Development, Housing, Health and Social Services, Infrastructure, Natural & Cultural Resources',
        type: 'dropdown_no_meta',
        options: ['Emergency Management', 'Economic Development', 'Land Use Development', 'Housing', 'Health and Social Services', 'Infrastructure', 'Natural & Cultural Resources'],
        meta: 'false',
        section: '6'
    },
    {
        key: 'associated_mitigation_capability_2',
        label: 'Select the Capability Type that this Action will be used and/or contribute to:',
        prompt: 'Categories include: Planning & Regulatory, Administrative & Technical, Financial, Education & Outreach',
        type: 'dropdown_no_meta',
        options: ['Planning & Regulatory', 'Administrative & Technical', 'Financial', 'Education & Outreach'],
        meta: 'false',
        section: '6'
    },
    {
        key: 'is_protects_repetitive_loss_property',
        label: 'Protects Repetitive Loss (RL) Property?',
        prompt: 'Does the action protect a “Repetitive Loss Property” as defined by FEMA?' +
            ' “Repetitive Loss Structure. An NFIP-insured structure that has had at least 2 ' +
            'paid flood losses of more than $1,000 each in any 10-year period since 1978.” (FEMA)',
        type: 'radio',
        options: ['yes', 'no'],
        meta: 'false',
        inline: true,
        section: '6'
    },
    {
        key: 'is_protects_severe_repetitive_loss_property',
        label: 'Protects Severe Repetitive Loss (SRL) Property?',
        prompt: 'Does the action protect a “Severe Repetitive Loss Property” as defined by FEMA? \n' +
            '“Severe Repetitive Loss Building. Any building that:\n' +
            'Is covered under a Standard Flood Insurance Policy made available under this title;\n' +
            'Has incurred flood damage for which:\n' +
            'a. 4 or more separate claim payments have been made under a Standard Flood Insurance ' +
            'Policy issued pursuant to this title, with the amount of each such claim exceeding $5,000, ' +
            'and with the cumulative amount of such claims payments exceeding $20,000; or\n' +
            'b. At least 2 separate claims payments have been made under a Standard Flood Insurance Policy,' +
            ' with the cumulative amount of such claim payments exceed the fair market value of the' +
            ' insured building on the day before each loss.” (FEMA)',
        type: 'radio',
        options: ['yes', 'no'],
        meta: 'false',
        inline: true,
        section: '6'
    },
    {
        key: 'is_crs',
        label: 'Does this action count toward CRS score?',
        prompt: '',
        type: 'radio',
        options: ['yes', 'no', 'unknown'],
        meta: 'false',
        inline: true,
        section: '6'
    },
    {
        key: 'is_climate_adaptation',
        label: 'Is Climate Adaptation?',
        prompt: 'What categories of the disaster cycle would the action be considered?',
        type: 'radio',
        options: ['yes', 'no'],
        meta: 'false',
        inline: true,
        section: '6'
    },
    {
        key: 'climate_smart_communities_action_type',
        label: 'Climate Smart Communities action type?',
        prompt: 'From the Climate Smart Community action type dropdown, select the category that best describes your action.',
        type: 'dropdown_no_meta',
        options: [' '],
        meta: 'false',
        section: '6'
    },
    {
        key: 'plan_maintenance_date_of_status_report',
        label: 'Plan Maintenance - Date of Status Report',
        prompt: 'This section should be completed during plan maintenance/evaluation.',
        type: 'date',
        meta: 'false',
        section: '9'
    },
    {
        key: 'plan_maintenance_progress_report',
        label: 'Plan Maintenance - Progress Report',
        prompt: 'Describe what progress, if any, has been made on this project.  ' +
            'If it has been determined the community no longer wishes to pursue project, state that here and indicate why.',
        type: 'text',
        meta: 'false',
        section: '9'
    }
  ]
}

export default cmsPageFormat