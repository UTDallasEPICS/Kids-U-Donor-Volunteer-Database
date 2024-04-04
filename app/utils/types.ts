export type Grant = {

}

export type Representative = {

        RepresentativeID:          String,
        RepresentativeFirstName:   String,
        RepresentativeLastName:    String,
        RepresentativeEmail:       String,   
        RepresentativePhone:       String,
        PositionInCompany:         String,
        Grants:                    Grant[],
        OrganizationID:            String,
        Organization:              Organization,
}


export type Organization = {
    OrganizationID:            String,
    WebsiteForFunder:          String,
    StreetAddress:             String,
    City:                      String,
    State:                     String,
    Zipcode:                   String,
    Country:                   String,
    OrganizationName:          String,
    PortalForGrantApplication: String,
    NotesAboutLoginInfo:       String,
    representative:            Representative[],
    
  }