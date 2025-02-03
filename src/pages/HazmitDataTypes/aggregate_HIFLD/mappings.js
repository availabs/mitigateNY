export const SOURCE_TO_MAPPING_TYPE_MAPPINGS = {
  583: "power",
  608: "school",
  578: "aviation",
  579: "source",
  580: "source",
  581: "source",
  582: "source",
  585: "source",
  604: "source",
  605: "source",
  606: "source",
  640: "source",
  641: "source",
  642: "source",
  643: "source",
  644: "source",
  649: "source",
  653: "source",
  655: "source",
  656: "source",
  657: "source",
  658: "source",
  659: "source",
  660: "source",
  665: "source",
  668: "source",
  669: "source",
  671: "source",
  675: "source",
  676: "source",
  563: "source",
  680: "source",
  681: "source",
  682: "source",
  686: "source",
  689: "source",
  691: "source",
  693: "source",
  695: "source",
  696: "source",
  697: "source",
  699: "source",
  700: "source",
  701: "source"
}

export const POWER_COLUMN = 'naics_code';
export const POWER_TO_FCODE_MAPPINGS = {
  221118:	75030,
  221111:	75032,
  221118:	75034,
  221114:	75036,
  221118:	75038,
  221112:	75039,
  221115:	75040,
  221117:	75041,
  221118:	75042,
  221116:	75043
}

export const SCHOOL_COLUMN = 'level';
export const SCHOOL_TO_FCODE_MAPPINGS = {
  'ELEMENTARY': 73003,
  'MIDDLE': 73004,
  'HIGH': 73005,
  'SECONDARY': 73005,
  'ADULT EDUCATION': 73007,
  'PREKINDERGARTEN': 73002,
  'NOT APPLICABLE': 73002,
  'NOT REPORTED': 73002,
  'UNGRADED': 73002,
  'OTHER': 73002,
}

export const AVIATION_COLUMN = 'twr_type_c';
export const AVIATION_TO_FCODE_MAPPINGS = {
  'NON-ATCT': 81006,
  'ATCT': 81010,
  'ATCT-TRACON': 81010,
  'ATCT-RATCF': 81010,
  'ATCT-RAPCON': 81010,
  'ATCT-A/C': 81010
}

export const SOURCE_TO_FCODE_MAPPINGS = {
  579: 75002,
  580: 75012,
  581: 75020,
  582: 75012,
  585: 76004,
  604: 81050,
  605: 80006,
  606: 73006,
  640: 73007,
  641: 74002,
  642: 74020,
  643: 74026,
  644: 74044,
  649: 74044,
  653: 75024,
  655: 75000,
  656: 83040,
  657: 74034,
  658: 71038,
  659: 71038,
  660: 83040,
  665: 83040,
  668: 83040,
  669: 83040,
  671: 71050,
  675: 88002,
  676: 88002,
  563: 88002,
  680: 88002,
  681: 88002,
  682: 88002,
  686: 88002,
  689: 88002,
  691: 81060,
  693: 81060,
  695: 81024,
  696: 80000,
  697: 80022,
  699: 80012,
  700: 83040,
  701: 79002
}

export const MAPPING_TYPE_MAPPINGS = {
  power: {
    column: POWER_COLUMN,
    mappings: POWER_TO_FCODE_MAPPINGS
  },
  school: {
    column: SCHOOL_COLUMN,
    mappings: SCHOOL_TO_FCODE_MAPPINGS
  },
  aviation: {
    column: AVIATION_COLUMN,
    mappings: AVIATION_TO_FCODE_MAPPINGS
  },
  source: {
    column: null,
    mappings: SOURCE_TO_FCODE_MAPPINGS
  }
}
