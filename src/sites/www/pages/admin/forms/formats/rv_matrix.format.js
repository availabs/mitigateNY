const format = {
    "app": "dms-site",
    "type": "forms-rv-matrix",
    "attributes": [
        {
            "name": "ctrl_num",
            "display_name": "Control #",
            "type": "text"
        },
        {
            "name": "associated_hazards",
            "display_name": "associated_hazards",
            "type": "select",
            "options": [
                "Avalanche",
                "Coastal Hazards",
                "Cold Wave",
                "Drought",
                "Earthquake",
                "Flood",
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
                "Wind"
            ]
        },
        {
            "name": "flooding_subtype",
            "display_name": "Flooding Subtype",
            "type": "text"
        },
        {
            "name": "domain",
            "display_name": "Domain",
            "type": "select",
            "options": [
                "Buildings",
                "Infrastructure",
                "Natural"
            ]
        },
        {
            "name": "subdomain",
            "display_name": "Sub-domain",
            "type": "select",
            "options": [
                "Communications",
                "Energy",
                "Energy, Communications",
                "Open Space",
                "Renewable Energy",
                "Residential",
                "Transportation",
                "Water",
                "Water, Natural",
                "Waterbodies",
                "Waterbodies, Wildlife",
                "Wildlife"
            ]
        },
        {
            "name": "subdomain_cat",
            "display_name": "Sub-domain Category",
            "type": "select",
            "options": [
                "Air",
                "Bridges",
                "Electric Power Systems",
                "Flood Control",
                "Manufactured",
                "Maritime",
                "Non-renewable Energy",
                "Ports, Harbors and Waterways",
                "Portable Water",
                "Portable Water, Wastewater Management",
                "Rail",
                "Renewable Energy",
                "Road",
                "Solar",
                "Stormwater Management",
                "Wastewater Management",
                "Wastewater Management, Portable Water",
                "Wastewater Management, Stormwater Management"
            ]
        },
        {
            "name": "asset_type",
            "display_name": "Asset Type",
            "type": "select",
            "options": [
                "Bridges",
                "Dams",
                "Doors",
                "Electric Systems, Natual Gas",
                "Electric Systems",
                "Floors",
                "Foundation",
                "Frame",
                "HVAC",
                "Hydropower",
                "Natural Gas",
                "Passenger Rail",
                "Plumbing",
                "Ports and Harbors",
                "Road Tunnels",
                "Roads and Highways",
                "Roads and Highways, Bridges",
                "Roof",
                "Runways",
                "Siding",
                "Solar",
                "Solar Panels",
                "Walls",
                "Wind",
                "Windows",
                "Windows, Doors"
            ]
        },
        {
            "name": "material",
            "display_name": "Material",
            "type": "select",
            "option": [
                "Asphalt Shingles",
                "Brick",
                "Concrete Panels",
                "Flat Roofs",
                "Glass Panels",
                "Metal Cladding",
                "Tile or Slate",
                "Vinyl",
                "Wood",
                "Wood Shingle"
            ]
        },
        {
            "name": "potential_impact_name",
            "display_name": "Potential Impact Name",
            "type": "text"
        },
        {
            "name": "impact_description",
            "display_name": "Impact Description",
            "type": "text"
        }
    ]
}