export const metaData = {
    total_losses: {
        type: 'disaster_declarations_summaries_v2',
        columns: {
            'IHP Loss': 'ihp_loss',
            'PA Loss': 'pa_loss',
            'SBA Loss': 'sba_loss',
            'NFIP Loss': 'nfip_loss',
            'USDA Loss': 'fema_crop_damage'
        },
        paintFn: (d) => d && +d.ihp_loss + +d.pa_loss + +d.sba_loss + +d.nfip_loss + +d.fema_crop_damage
    },
    ihp: {
        type: 'individuals_and_households_program_valid_registrations_v1',
        columns: ['rpfvl', 'ppfvl'],
        paintFn: (d) => d && d.rpfvl + d.ppfvl
    },
    pa: {
        type: 'public_assistance_funded_projects_details_v1',
        geoColumn: `lpad(state_number_code::text, 2, '0') || lpad(county_code::text, 3, '0')`,
        columns: ['project_amount']
    },
    sba: {
        type: 'sba_disaster_loan_data_new',
        disasterNumberColumn: 'fema_disaster_number',
        columns: ['total_verified_loss']
    },
    nfip: {
        type: 'fima_nfip_claims_v1_enhanced',
        mapGeoidToName: true,
        columns: ['total_amount_paid']
    },
    usda: {
        type: 'usda_crop_insurance_cause_of_loss_enhanced',
        columns: ['indemnity_amount']
    },
};