import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  type Service = {
    #consulting;
    #coaching;
    #workshops;
  };

  type ContactMethod = {
    #email;
    #phone;
  };

  public type SiteSettings = {
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

  public type UserProfile = {
    name : Text;
  };

  let inquiries = Map.empty<Nat, Inquiry>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextInquiryId = 0;
  var siteSettings : ?SiteSettings = null;

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Site Settings Management
  public shared ({ caller }) func updateSiteSettings(settings : SiteSettings) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update site settings.");
    };
    siteSettings := ?settings;
  };

  public query func getSiteSettings() : async ?SiteSettings {
    // Public access - site settings (contact info, business details) are publicly visible
    siteSettings;
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Contact/Booking Inquiry Functions
  public shared ({ caller }) func submitInquiry(
    fullName : Text,
    email : Text,
    phone : ?Text,
    service : Service,
    preferredContactMethod : ContactMethod,
    message : Text,
    consent : Bool,
  ) : async {
    id : Nat;
    timestamp : Time.Time;
  } {
    // No authorization check - public contact form accessible to everyone including guests
    if (not consent) {
      Runtime.trap("Consent must be given to submit an inquiry.");
    };

    let inquiry : Inquiry = {
      id = nextInquiryId;
      fullName;
      email;
      phone;
      service;
      preferredContactMethod;
      message;
      consent;
      timestamp = Time.now();
    };

    inquiries.add(nextInquiryId, inquiry);
    let response = { id = nextInquiryId; timestamp = inquiry.timestamp };
    nextInquiryId += 1;
    response;
  };

  public query ({ caller }) func getAllInquiries() : async [Inquiry] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can access inquiries.");
    };
    inquiries.values().toArray();
  };
};
