export const metaData = {
    ihp: {
        type: 'individuals_and_households_program_valid_registrations_v1',
        attributes: (geoid) => ({
            [geoid?.length === 5 ? "Damaged City" : "County"]: geoid?.length === 5 ? "damaged_city" : "county",
            "# Claims": "count(1) as num_claims",
            "Assessed Building Damage": "sum(rpfvl) as rpfvl",
            "Assessed Contents Damage": "sum(ppfvl) as ppfvl",
            "Housing Assistance": "sum(ha_amount) as ha_amount",
            "Total Amount": "sum(ihp_amount) as ihp_amount",
            "Other Needs Assistance": "sum(ona_amount) as ona_amount"
        }),
        options: (disasterNumber, geoid) => ({
            aggregatedLen: true,
            filter: {
                ...disasterNumber && {"disaster_number": [disasterNumber]},
                ...geoid && {[`substring(geoid, 1, ${geoid?.length})`]: [geoid]}
            },
            groupBy: [geoid?.length === 5 ? 'damaged_city' : 'county']
        }),
        textCols: ['County', 'Damaged City'],
        numCols: ['# Claims'],
        anchorCols: ['County', 'Damaged City']
    },
    pa: {
        type: 'public_assistance_funded_projects_details_v1',
        attributes: () => ({
            "County": "county",
            "Damage Category": "damage_category",
            "# Projects": "count(1) as num_projects",
            "Project Amount": "sum(project_amount) as project_amount",
            "Federal Share Obligated": "sum(federal_share_obligated) as federal_share_obligated",
            "Total Obligated": "sum(total_obligated) as total_obligated"
        }),
        options: (disasterNumber, geoid) => ({
            aggregatedLen: true,
            filter: {
                ...disasterNumber && {"disaster_number": [disasterNumber]},
                ...geoid && {[`substring(lpad(state_number_code::text, 2, '0') || lpad(county_code::text, 3, '0'), 1, ${geoid?.length})`]: [geoid]}
            },
            exclude: {
                dcc: ["A", "B", "Z"]
            },
            groupBy: ["county", 'damage_category']
        }),
        textCols: ["County", "Damage Category"],
        numCols: ["# Projects"],
        anchorCols: ['County']
    },
    sba: {
        type: 'sba_disaster_loan_data_new',
        attributes: (geoid) => ({
            [geoid?.length === 5 ? "City" : "County / Parish"]: geoid?.length === 5 ? "damaged_property_city_name" : "damaged_property_county_or_parish_name",
            "# Loans": "count(1) as num_loans",
            "Verified Loss": "sum(total_verified_loss) as total_verified_loss",
            "Verified Loss Real Estate": "sum(verified_loss_real_estate) as verified_loss_real_estate",
            "Verified Loss Content": "sum(verified_loss_content) as verified_loss_content",
            "Loan Approved Total": "sum(total_approved_loan_amount) as total_approved_loan_amount",
            "Loan Approved Real Estate": "sum(approved_amount_real_estate) as approved_amount_real_estate",
            "Loan Approved Content": "sum(approved_amount_content) as approved_amount_content",
            "Loan approved Economic Injury (EIDL)": "sum(approved_amount_eidl) as approved_amount_eidl"
        }),
        options: (disasterNumber, geoid) => ({
            aggregatedLen: true,
            filter: {
                ...disasterNumber && {"fema_disaster_number": [disasterNumber]},
                ...geoid && {[`substring(geoid, 1, ${geoid?.length})`]: [geoid]}
            },
            groupBy: [geoid?.length === 5 ? "damaged_property_city_name" : "damaged_property_county_or_parish_name"]
        }),
        textCols: ["City", "County / Parish"],
        numCols: ["# Loans"],
        anchorCols: ["City", "County / Parish"]
    },
    nfip: {
        type: 'fima_nfip_claims_v1_enhanced',
        mapGeoidToName: true,
        attributes: () => ({
            "County": "geoid",
            "# Claims": "count(1) as num_claims",
            "Amount Paid on Building Claim": "sum(amount_paid_on_building_claim) as amount_paid_on_building_claim",
            "Amount Paid on Contents Claim": "sum(amount_paid_on_contents_claim) as amount_paid_on_contents_claim",
            "Amount Paid on Increased Cost of Compliance": "sum(amount_paid_on_increased_cost_of_compliance_claim) as amount_paid_on_increased_cost_of_compliance_claim",
            "Total Amount Paid": "sum(total_amount_paid) as total_amount_paid"
        }),
        options: (disasterNumber, geoid) => ({
            aggregatedLen: true,
            filter: {
                ...disasterNumber && {"disaster_number": [disasterNumber]},
                ...geoid && {[`substring(geoid, 1, ${geoid?.length})`]: [geoid]}
            },
            groupBy: ['geoid']
        }),
        textCols: ["County"],
        numCols: ["# Claims"],
        anchorCols: ['County']
    },
    usda: {
        type: 'usda_crop_insurance_cause_of_loss_enhanced',
        attributes: () => ({
            "County": "county_name",
            "# Claims": "count(1) as num_claims",
            "Commodity Name": "ARRAY_AGG(distinct commodity_name order by commodity_name) as commodity_names",
            "Acres Planted": "sum(net_planted_acres) as net_planted_acres",
            "Acres Lost": "sum(net_determined_acres) as net_determined_acres",
            "Crop Value Lost": "sum(indemnity_amount) as indemnity_amount"
        }),
        options: (disasterNumber, geoid) => ({
            aggregatedLen: true,
            filter: {
                ...disasterNumber && {"disaster_number": [disasterNumber]},
                ...geoid && {[`substring(geoid, 1, ${geoid?.length})`]: [geoid]}
            },
            groupBy: ['county_name']
        }),
        textCols: ["County", 'Commodity Name'],
        numCols: ["# Claims"],
        anchorCols: ['County']
    },
};

export const ihpAttributes = (geoid) => ({
        [geoid?.length === 5 ? 'damaged_city' : 'county']: {
            name: geoid?.length === 5 ? 'Damaged City' : 'County',
            align: 'left',
            filter: 'text',
            groupBy: true,
            visible: true
        },
        [`substring(geoid, 1, ${geoid.length})`]: {
            name: 'Geoid',
            visible: false,
            filterBy: [geoid]
        },
        'count(1) as num_claims': {
            name: '# Claims',
            align: 'right'
        },
        'sum(rpfvl) as rpfvl': {
            name: 'Assessed Building Damage',
            align: 'right'
        },
        'sum(ppfvl) as ppfvl': {
            name: 'Assessed Contents Damage',
            align: 'right'
        },
        'sum(ha_amount) as ha_amount': {
            name: 'Housing Assistance',
            align: 'right'
        },
        'sum(ihp_amount) as ihp_amount': {
            name: 'Total Amount',
            align: 'right'
        },
        'sum(ona_amount) as ona_amount': {
            name: 'Other Needs Assistance',
            align: 'right'
        }
    }),
    paAttributes = () => ({
        'County': 'county',
        'Damage Category': 'damage_category',
        '# Projects': 'count(1) as num_projects',
        'Project Amount': 'sum(project_amount) as project_amount',
        'Federal Share Obligated': 'sum(federal_share_obligated) as federal_share_obligated',
        'Total Obligated': 'sum(total_obligated) as total_obligated'
    }),
    sbaAttributes = (geoid) => ({
        [geoid?.length === 5 ? 'City' : 'County / Parish']: geoid?.length === 5 ? 'damaged_property_city_name' : 'damaged_property_county_or_parish_name',
        '# Loans': 'count(1) as num_loans',
        'Verified Loss': 'sum(total_verified_loss) as total_verified_loss',
        'Verified Loss Real Estate': 'sum(verified_loss_real_estate) as verified_loss_real_estate',
        'Verified Loss Content': 'sum(verified_loss_content) as verified_loss_content',
        'Loan Approved Total': 'sum(total_approved_loan_amount) as total_approved_loan_amount',
        'Loan Approved Real Estate': 'sum(approved_amount_real_estate) as approved_amount_real_estate',
        'Loan Approved Content': 'sum(approved_amount_content) as approved_amount_content',
        'Loan approved Economic Injury (EIDL)': 'sum(approved_amount_eidl) as approved_amount_eidl'
    }),
    nfipAttributes = () => ({
        'County': 'geoid',
        '# Claims': 'count(1) as num_claims',
        'Amount Paid on Building Claim': 'sum(amount_paid_on_building_claim) as amount_paid_on_building_claim',
        'Amount Paid on Contents Claim': 'sum(amount_paid_on_contents_claim) as amount_paid_on_contents_claim',
        'Amount Paid on Increased Cost of Compliance': 'sum(amount_paid_on_increased_cost_of_compliance_claim) as amount_paid_on_increased_cost_of_compliance_claim',
        'Total Amount Paid': 'sum(total_amount_paid) as total_amount_paid'
    }),
    usdaAttributes = () => ({
        'County': 'county_name',
        '# Claims': 'count(1) as num_claims',
        'Commodity Name': 'ARRAY_AGG(distinct commodity_name order by commodity_name) as commodity_names',
        'Acres Planted': 'sum(net_planted_acres) as net_planted_acres',
        'Acres Lost': 'sum(net_determined_acres) as net_determined_acres',
        'Crop Value Lost': 'sum(indemnity_amount) as indemnity_amount'
    });