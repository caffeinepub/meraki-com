import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  type OldActor = {
    var inquiries : Map.Map<Nat, Inquiry>;
    var nextInquiryId : Nat;
    var siteSettings : ?SiteSettings;
    var userProfiles : Map.Map<Principal, UserProfile>;
  };

  type Service = {
    #consulting;
    #coaching;
    #workshops;
  };

  type ContactMethod = {
    #email;
    #phone;
  };

  type SiteSettings = {
    contactEmail : Text;
    contactPhone : Text;
    businessName : ?Text;
    addressLine : ?Text;
    socialLinks : ?[Text];
  };

  type Inquiry = {
    id : Nat;
    fullName : Text;
    email : Text;
    phone : ?Text;
    service : Service;
    preferredContactMethod : ContactMethod;
    message : Text;
    consent : Bool;
    timestamp : Time.Time;
  };

  type UserProfile = {
    name : Text;
  };

  // Migration function (discard legacy variables)
  public func run(old : OldActor) : {} {
    {};
  };
};
