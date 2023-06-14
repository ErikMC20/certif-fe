export interface CreateProspectModel {
  status:     number;
  statusText: string;
  data:       Data;
}

export interface Data {
  type:          string;
  id:            string;
  attributes:    Attributes;
  relationships: Relationships;
}

export interface Attributes {
  name:                         string;
  date_entered:                 string;
  date_modified:                string;
  modified_user_id:             string;
  modified_by_name:             string;
  created_by:                   string;
  created_by_name:              string;
  description:                  string;
  deleted:                      number;
  created_by_link:              string;
  modified_user_link:           string;
  assigned_user_id:             string;
  assigned_user_name:           string;
  assigned_user_link:           string;
  SecurityGroups:               string;
  salutation:                   string;
  first_name:                   string;
  last_name:                    string;
  full_name:                    string;
  title:                        string;
  photo:                        string;
  department:                   string;
  do_not_call:                  number;
  phone_home:                   string;
  email:                        string;
  phone_mobile:                 string;
  phone_work:                   string;
  phone_other:                  string;
  phone_fax:                    string;
  email1:                       string;
  email2:                       string;
  invalid_email:                number;
  email_opt_out:                number;
  lawful_basis:                 string;
  date_reviewed:                string;
  lawful_basis_source:          string;
  primary_address_street:       string;
  primary_address_street_2:     string;
  primary_address_street_3:     string;
  primary_address_city:         string;
  primary_address_state:        string;
  primary_address_postalcode:   string;
  primary_address_country:      string;
  alt_address_street:           string;
  alt_address_street_2:         string;
  alt_address_street_3:         string;
  alt_address_city:             string;
  alt_address_state:            string;
  alt_address_postalcode:       string;
  alt_address_country:          string;
  assistant:                    string;
  assistant_phone:              string;
  email_addresses_primary:      string;
  email_addresses:              string;
  email_addresses_non_primary:  string;
  tracker_key:                  number;
  birthdate:                    string;
  lead_id:                      string;
  account_name:                 string;
  campaign_id:                  string;
  campaigns:                    string;
  prospect_lists:               string;
  calls:                        string;
  meetings:                     string;
  notes:                        string;
  tasks:                        string;
  emails:                       string;
  fp_events_prospects_1:        string;
  e_invite_status_fields:       string;
  event_status_name:            string;
  event_invite_id:              string;
  e_accept_status_fields:       string;
  event_accept_status:          string;
  event_status_id:              string;
  prospects:                    string;
  jjwg_maps_lng_c:              number;
  jjwg_maps_address_c:          string;
  jjwg_maps_geocode_status_c:   string;
  jjwg_maps_lat_c:              number;
  alt_address_state_list_c:     string;
  primary_address_state_list_c: string;
}

export interface Relationships {
  CampaignLog:    CampaignLog;
  EmailAddress:   CampaignLog;
  Meetings:       CampaignLog;
  ProspectLists:  CampaignLog;
  SecurityGroups: CampaignLog;
  Users:          CampaignLog;
}

export interface CampaignLog {
  links: Links;
}

export interface Links {
  related: string;
}

//* Relationship between modules response
export interface RelationResponse {
  meta: Meta;
  data: DataRelation[];
}

export interface DataRelation {
  type: string;
  id: string;
  attributes: {[key: string]: string | number};
  links: Links;
}

export interface Links {
  self: string;
}

export interface Meta {
  'total-records': number;
  'total-pages': number;
  'records-on-this-page': number;
}
