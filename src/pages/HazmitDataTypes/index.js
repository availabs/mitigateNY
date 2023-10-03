
// ---------------------------
// ---- Hazard Mitigation Types
// ---------------------------
import disaster_declarations_summaries_v2 from "./disaster_declarations_summaries_v2";
import fema_web_disaster_summaries_v1 from "./fema_web_disaster_summaries_v1/index.jsx";
import fima_nfip_claims_v1 from "./fema_nfip_claims_v1";
import fima_nfip_claims_v1_enhanced from "./fema_nfip_claims_v1_enhanced";
import individuals_and_households_program_valid_registrations_v1
  from "./individuals_and_households_program_valid_registrations_v1";
import public_assistance_funded_projects_details_v1
  from "./public_assistance_funded_projects_details_v1";
import public_assistance_funded_projects_details_v1_enhanced
  from "./public_assistance_funded_projects_details_v1_enhanced";
import hazard_mitigation_grant_program_disaster_summaries_v2
  from "./hazard_mitigation_grant_program_disaster_summaries_v2/index.jsx";
import hazard_mitigation_assistance_mitigated_properties_v3
  from "./hazard_mitigation_assistance_mitigated_properties_v3/index.jsx";
import hazard_mitigation_assistance_projects_v3
  from "./hazard_mitigation_assistance_projects_v3/index.jsx";
import hazard_mitigation_assistance_projects_v3_enhanced
  from "./hazard_mitigation_assistance_projects_v3_enhanced/index.jsx";
import ncei_storm_events from './ncei_storm_events';
import ncei_storm_events_enhanced from "./ncei_storm_events_enhanced";
import zone_to_county from "./zone_to_county";
import tiger_2017 from "./tiger_2017";
import tiger_2017_full from "./tiger_2017_full";
import usda_crop_insurance_cause_of_loss from "./usda";
import usda_crop_insurance_cause_of_loss_enhanced from "./usda_enhanced";
import sba_disaster_loan_data_new from "./sba";
import nri from "./nri";
import nri_tracts from "./nri_tracts/index.jsx";
import per_basis from "./per_basis_swd";
import per_basis_fusion from "./per_basis_fusion";
import hlr from "./hlr";
import eal from "./eal"
import disaster_loss_summary from "./disaster_loss_summary";
import fusion from "./fusion";
//import open_fema_data from "./open_fema_data";



const DataTypes = {
  
  tiger_2017,
  tiger_2017_full,

  // // // hazmit types: swd
  ncei_storm_events,
  ncei_storm_events_enhanced,


  // hazmit types: other data
  usda_crop_insurance_cause_of_loss,
  usda_crop_insurance_cause_of_loss_enhanced,
  sba_disaster_loan_data_new,
  nri,
  nri_tracts,

  // // hazmit types: open fema data types
  disaster_declarations_summaries_v2,
  fema_web_disaster_summaries_v1,
  //fima_nfip_claims_v1,
  fima_nfip_claims_v1_enhanced,
  individuals_and_households_program_valid_registrations_v1,
  public_assistance_funded_projects_details_v1,
  public_assistance_funded_projects_details_v1_enhanced,
  hazard_mitigation_grant_program_disaster_summaries_v2,
  hazard_mitigation_assistance_mitigated_properties_v3,
  hazard_mitigation_assistance_projects_v3,
  hazard_mitigation_assistance_projects_v3_enhanced,
  // open_fema_data,

  disaster_loss_summary,

  // hazmit types: AVAIL processing
  per_basis,
  per_basis_fusion,
  hlr,
  eal,
  fusion

};

export default DataTypes;
