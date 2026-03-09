import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";

module {
  type VideoProject = {
    id : Text;
    title : Text;
    description : Text;
    video : ?{
      #external;
    };
    thumbnail : ?{
      #external;
    };
    visible : Bool;
    youtubeUrl : ?Text;
  };

  type ContactInfo = {
    email : Text;
    tel : Text;
    socialMedia : [SocialMediaLink];
  };

  type SocialMediaLink = {
    platform : Text;
    url : Text;
  };

  type UserProfile = {
    name : Text;
  };

  type AboutPageContent = {
    title : Text;
    content : Text;
    placeholder : Bool;
  };

  type OldActor = {
    videoProjects : OrderedMap.Map<Text, VideoProject>;
    videoOrder : [Text];
    contactInfo : ?ContactInfo;
    userProfiles : OrderedMap.Map<Principal, UserProfile>;
    aboutPageContent : ?AboutPageContent;
  };

  type NewActor = {
    videoProjects : OrderedMap.Map<Text, VideoProject>;
    videoOrder : [Text];
    contactInfo : ?ContactInfo;
    userProfiles : OrderedMap.Map<Principal, UserProfile>;
    aboutPageContent : ?AboutPageContent;
    totalVisits : Nat;
    videoViews : OrderedMap.Map<Text, Nat>;
  };

  public func run(old : OldActor) : NewActor {
    let textMap = OrderedMap.Make<Text>(Text.compare);
    {
      videoProjects = old.videoProjects;
      videoOrder = old.videoOrder;
      contactInfo = old.contactInfo;
      userProfiles = old.userProfiles;
      aboutPageContent = old.aboutPageContent;
      totalVisits = 0;
      videoViews = textMap.empty<Nat>();
    };
  };
};

